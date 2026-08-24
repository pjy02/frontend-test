import path from "node:path";
import { createServer } from "vite";

export default async function globalSetup() {
  const server = await createServer({
    root: path.join(process.cwd(), "apps", "admin"),
    logLevel: "error",
    server: {
      host: "127.0.0.1",
      port: 4173,
      strictPort: true,
    },
  });

  await server.listen();

  return async () => {
    await server.close();
  };
}
