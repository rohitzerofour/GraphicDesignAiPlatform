import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import ai from "./ai";
import images from "./images";
import users from "./users";
import { AuthConfig, initAuthConfig } from "@hono/auth-js";
import authConfig from "@/auth.config";

export const runtime = "nodejs";

const app = new Hono<{ Bindings: { AUTH_SECRET: string } }>().basePath("/api");

app.use("*", async (c, next) => {
  c.env = {
    AUTH_SECRET: process.env.AUTH_SECRET!,
  };
  await next();
});

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    ...(authConfig as any),
  };
}

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
  .route("/images", images)
  .route("/ai", ai)
  .route("/users", users);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
