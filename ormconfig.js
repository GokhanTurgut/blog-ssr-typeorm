const fs = require("fs");

module.exports = {
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "first-db",
  synchronize: false,
  logging: false,
  entities: ["build/entities/**/*.js"],
  migrations: ["build/migration/**/*.js"],
  subscribers: ["build/subscriber/**/*.js"],
  cli: {
    entitiesDir: "build/entities",
    migrationsDir: "build/migration",
    subscribersDir: "build/subscriber",
  },
  ssl: {
    ca: fs.readFileSync(__dirname + "/ca-certificates.crt"),
    mode: "VERIFY_IDENTITY",
  },
};
