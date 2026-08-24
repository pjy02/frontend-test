import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const adminSrc = path.join(repoRoot, "apps", "admin", "src");
const routesRoot = path.join(adminSrc, "routes");
const servicesRoot = path.join(repoRoot, "packages", "ui", "src", "services");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function resolveModule(specifier, importer) {
  let base;
  if (specifier.startsWith("@/")) {
    base = path.join(adminSrc, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(importer), specifier);
  } else {
    return;
  }

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];
  return candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile()
  );
}

function parseImports(source) {
  return Array.from(
    source.matchAll(
      /import\s+(?:type\s+)?[\w*{},\s]+?\s+from\s+["']([^"']+)["'];/g
    ),
    (match) => match[1]
  );
}

function parseServiceImports(source) {
  const imports = [];
  const expression =
    /import\s+\{([^}]+)\}\s+from\s+["']@workspace\/ui\/services\/([^"']+)["'];/g;
  for (const match of source.matchAll(expression)) {
    for (const rawName of match[1].split(",")) {
      const normalizedName = rawName.trim();
      if (normalizedName.startsWith("type ")) continue;
      const name = normalizedName.split(/\s+as\s+/)[0];
      if (name) imports.push({ module: match[2], name });
    }
  }
  return imports;
}

function collectFeature(entryFile) {
  const visited = new Set();
  const services = new Map();

  function visit(file) {
    if (!file || visited.has(file)) return;
    visited.add(file);
    const source = readFileSync(file, "utf8");

    for (const service of parseServiceImports(source)) {
      services.set(`${service.module}:${service.name}`, service);
    }
    for (const specifier of parseImports(source)) {
      visit(resolveModule(specifier, file));
    }
  }

  visit(entryFile);
  return { files: [...visited], services: [...services.values()] };
}

function getEndpoints(service) {
  const serviceFile = path.join(servicesRoot, `${service.module}.ts`);
  if (!existsSync(serviceFile)) return [];
  const source = readFileSync(serviceFile, "utf8");
  const escapedName = service.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = source.match(
    new RegExp(
      `export async function\\s+${escapedName}\\b([\\s\\S]*?)(?=\\r?\\n\\s*\\/\\*\\*|\\r?\\nexport (?:async function|function|const|interface|type)|$)`
    )
  )?.[0];
  if (!block) return [];
  return [...new Set(block.match(/\/v1\/[A-Za-z0-9_./${}-]+/g) || [])];
}

function operationKind(name) {
  if (/^(query|get|list|current|check|preview|heartbeat)/i.test(name)) {
    return "read";
  }
  if (/^(create|add|generate|register|upload|send|test)/i.test(name)) {
    return "create/action";
  }
  if (/^(update|set|reset|enable|disable|start|stop)/i.test(name)) {
    return "update/action";
  }
  if (/^(delete|remove|revoke|cancel)/i.test(name)) return "delete/action";
  return "action";
}

function routeRecord(routeFile) {
  const source = readFileSync(routeFile, "utf8");
  const route = source.match(/createLazyFileRoute\("([^"]+)"\)/)?.[1];
  const componentName = source.match(/component:\s*([A-Za-z0-9_]+)/)?.[1];
  if (!(route && componentName)) return;

  const importExpression = new RegExp(
    `import\\s+${componentName}\\s+from\\s+["']([^"']+)["']`
  );
  const componentSpecifier = source.match(importExpression)?.[1];
  const componentFile = componentSpecifier
    ? resolveModule(componentSpecifier, routeFile)
    : undefined;
  const feature = componentFile
    ? collectFeature(componentFile)
    : { files: [], services: [] };
  const operations = feature.services
    .map((service) => ({
      ...service,
      kind: operationKind(service.name),
      endpoints: getEndpoints(service),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    route,
    routeFile,
    componentName,
    componentFile,
    files: feature.files,
    operations,
  };
}

function relative(file) {
  return file ? path.relative(repoRoot, file).replaceAll("\\", "/") : "-";
}

function cell(values) {
  return values.length ? values.join("<br>") : "-";
}

const records = walk(routesRoot)
  .filter(
    (file) => file.endsWith(".lazy.tsx") && !file.endsWith("route.lazy.tsx")
  )
  .map(routeRecord)
  .filter(Boolean)
  .sort((left, right) => left.route.localeCompare(right.route));
const commit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: repoRoot,
  encoding: "utf8",
}).trim();
const operationCount = records.reduce(
  (total, record) => total + record.operations.length,
  0
);

const lines = [
  "# Admin UI v2 phase 0 baseline",
  "",
  `Source commit: \`${commit}\``,
  "",
  `Routes: ${records.length}; reachable service operations: ${operationCount}.`,
  "",
  "This inventory is generated by `bun run baseline:admin`. It follows each",
  "TanStack route into local feature imports and records generated API clients",
  "reachable from that page. Dynamic runtime-only imports still require manual",
  "verification during the visual and real-backend passes.",
  "",
  "| Route | Component | Reachable files | Operations | API endpoints |",
  "| --- | --- | ---: | --- | --- |",
];

for (const record of records) {
  lines.push(
    `| \`${record.route}\` | \`${record.componentName}\`<br>\`${relative(
      record.componentFile
    )}\` | ${record.files.length} | ${cell(
      record.operations.map(
        (operation) => `\`${operation.name}\` (${operation.kind})`
      )
    )} | ${cell(
      [
        ...new Set(
          record.operations.flatMap((operation) => operation.endpoints)
        ),
      ].map((endpoint) => `\`${endpoint}\``)
    )} |`
  );
}

process.stdout.write(`${lines.join("\n")}\n`);
