import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

async function migrations(req, res) {
  const dbClient = await database.getNewClient();

  const migrationConfig = {
    dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method === "GET") {
    console.log("get");
    const pendingMigrations = await migrationRunner(migrationConfig);
    await dbClient.end();
    res.status(200).json(pendingMigrations);
  }

  if (req.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationConfig,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    res.status(200).json(migratedMigrations);
  }

  res.status(405);
}

export default migrations;
