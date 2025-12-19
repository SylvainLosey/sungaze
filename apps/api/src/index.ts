import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { version } from "@sungaze/core";
import { appRouter } from "./routers";
import { createContext } from "./context";

const fastify = Fastify({
  logger: true,
  trustProxy: true, // Trust 'X-Forwarded-For' headers for correct IP detection
});

// Register CORS plugin
fastify.register(cors, {
  origin: true, // Allow all origins in development
  credentials: true,
});

// Register tRPC plugin
fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

fastify.get("/", async () => {
  return {
    status: "ok",
    engineVersion: version, // Testing the link to @sungaze/core
  };
});

const start = async () => {
  try {
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    const HOST = process.env.HOST || "0.0.0.0";
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`Server listening on ${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
