import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import path from "path";
import { Updoot } from "./entities/updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

// import redis from "redis";
// import session from "express-session";
// import connectRedis from "connect-redis";

const main = async () => {
  // sendEmail("bob@bob.com","hello there");
  const conn = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true, // create the tables without having to run migrations
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });

  await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  //   {
  //   host: process.env.redis_hostname,
  //   port: process.env.redis_port,
  // }
  redis.on("error", (error: any) => {
    console.error(error.message);
  });
  redis.on("connect", () => {
    console.info("Successfully connected to redis");
  });

  // To solve CORS Error
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // middleware for sessions in connect-redis
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "fafiqjofjpfasdfaljf", //this is whatever you want but you should hide it
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

  // const post = orm.em.create(Post, {title: 'my first post'}); //equivalent to new Post('my first post');
  // await orm.em.persistAndFlush(post);
};

main().catch((err) => {
  console.error(err);
});
