/**
 * tRPC context creation.
 */

import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

/**
 * Creates the tRPC context for each request.
 * Includes the client IP address from Fastify request.
 */
export async function createContext({
  req,
}: CreateFastifyContextOptions) {
  // Extract the client's IP address
  // Fastify handles proxy headers if trustProxy is enabled
  const ip = req.ip;

  return {
    ip,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

