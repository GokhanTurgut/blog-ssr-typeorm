# gusto-Blogs

![Project example picture](https://i.ibb.co/FX3q8YJ/gusto-Blogs-image.png)

Fourth assignment project for Gusto & RemoteTeam Node.js Bootcamp.

This project is the MySQL and TypeORM used version of previous [assignment](https://github.com/GokhanTurgut/blog-ssr-ts).

### [LIVE DEMO](https://gusto-blogs-typeorm.herokuapp.com/)

---

## Project Information

Technologies that has been used to create this project are NodeJS, Express and MySQL. This project uses server side rendering with the help of EJS as template engine. Also we use TypeORM as our object relational mapping tool to make an abstraction on raw SQL queries.

User authentication and authorization has been implemented with Json Web Tokens and session data. After logging in session id and JWT token are kept in cookies and validated during each request that require permission.

Posts can be viewed by every user but adding, deleting and editing posts require logging in. Markdown can be used to write posts and it will be sanitized and converted to HTML for displaying.

## Getting Started

### Prerequisites

You need to have a MySQL server running on local or cloud environment that can be accessed by user that has necessary privileges. Required data to connect to database server can be seen in environment variables below.

Required environment variables are:
```
PORT=< Port of your choice, when empty defaults to 5000 >
DATABASE_HOST=< Host url of your database server >
DATABASE_PORT=< Port of your database server >
DATABASE_USERNAME=< Username for database connection >
DATABASE_PASSWORD=< Password for database connection >
DATABASE_NAME=< Name for your database >
PRIVATE_KEY=< Private key for JWT token >
SESSION_SECRET=< Session secret key >
```

### Installation

```
git clone git@github.com:GokhanTurgut/blog-ssr-typeorm.git
cd blog-ssr-typeorm
npm install
npm run build
npm start
```

For running "dev" or "ts" scripts you need to make the changes below to ormconfig.js file:

```
entities: ["src/entities/**/*.ts"],
migrations: ["src/migration/**/*.ts"],
subscribers: ["src/subscriber/**/*.ts"],
cli: {
  entitiesDir: "src/entities",
  migrationsDir: "src/migration",
  subscribersDir: "src/subscriber",
},
```

After making the necessary changes to use nodemon:
```
npm run dev
```

For ts-node:
```
npm run ts
```

## License
[MIT](./LICENSE)