import express from 'express';
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { BookResolver } from "./resolvers/BookResolver";
import { UserResolver } from './resolvers/UserResolver';

if (process.env.NODE_ENV) {
  console.log("environment: " + process.env.NODE_ENV);
} else {
  console.log("environment: NO ENVIRONMENT SET");
}

require("dotenv").config();

declare module 'express-session' {
  export interface SessionData {
    userId: any;
    userid: any;
    loadedCount: any;
    test: any;

  }
}

const main = async () => {
  await createConnection();
  const schema = await buildSchema({ resolvers: [BookResolver, UserResolver] });
  const server = new ApolloServer({ schema });

  const app = express();
  const router = express.Router();
  server.applyMiddleware({
    app,
    cors: true,
  });

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });
  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({
    client: redis,
  });

  app.use(express.json());
  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: "Strict",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    } as any)
  );

  app.use(router);
  // router.get("/", (req, res, next) => {
  //   res.send("Hello from Express Router");
  //   if (!req.session!.userid) {
  //     req.session!
  //   }
  // });

  router.get("/", (req, res, next) => {
    if (!req.session!.userid) {
      req.session!.userid = req.query.userid;
      console.log("Userid is set");
      req.session!.loadedCount = 0;
    } else {
      req.session!.loadedCount = Number(req.session!.loadedCount) + 1;
    }

    res.send(
      `userid: ${req.session!.userid}, loadedCount: ${req.session!.loadedCount}`
    );
  });

  await app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(
      `GraphQl endpoint found at http://localhost:${process.env.SERVER_PORT}${server.graphqlPath}`
    );
  });
};

main();
