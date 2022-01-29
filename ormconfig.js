const fs = require("fs");

module.exports = {
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  // Change build to src and js file extension to ts for ts-node or nodemon
  entities: ["build/entities/**/*.js"],
  migrations: ["build/migration/**/*.js"],
  subscribers: ["build/subscriber/**/*.js"],
  cli: {
    entitiesDir: "build/entities",
    migrationsDir: "build/migration",
    subscribersDir: "build/subscriber",
  },
  // Only necessary for servers that require SSL to be able to connect to such as PlanetScale
  // ca-certificates.crt file needs to be on root directory to able to read and send as certification
  // ssl: {
  //   ca: fs.readFileSync(__dirname + "/ca-certificates.crt"),
  //   mode: "VERIFY_IDENTITY",
  // },
};
