import { fileURLToPath } from "node:url";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const pg = new EmbeddedPostgres({
  databaseDir: path.join(root, ".local-pg"),
  user: "postgres",
  password: "password",
  port: 5432,
  persistent: true,
});

async function main() {
  try {
    await pg.initialise();
  } catch {
    console.log("[local-pg] already initialised");
  }
  await pg.start();
  try {
    await pg.createDatabase("todo_app");
    console.log("[local-pg] database todo_app created");
  } catch {
    console.log("[local-pg] database todo_app already exists");
  }
  console.log("[local-pg] ready on port 5432 (postgres/password, db todo_app)");
}

main().catch((error) => {
  console.error("[local-pg] failed", error);
  process.exit(1);
});
