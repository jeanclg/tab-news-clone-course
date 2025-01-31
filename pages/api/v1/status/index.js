import database from "infra/database";

async function status(req, res) {
  const databaseName = process.env.POSTGRES_DB;

  const databaseVersionResult = await database.query({
    text: "SHOW server_version;",
  });
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query({
    text: "SHOW max_connections;",
  });

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseUsedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseUsedConnectionsValue =
    databaseUsedConnectionsResult.rows[0].count;

  const updatedAt = new Date().toISOString();
  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseUsedConnectionsValue,
      },
    },
  });
}

export default status;
