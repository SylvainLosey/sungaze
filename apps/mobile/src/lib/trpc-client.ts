/**
 * tRPC client instance configuration.
 */

import { httpBatchLink } from "@trpc/client";
import { API_TRPC_URL } from "../constants/config";

export function createTRPCClient() {
  return {
    links: [
      httpBatchLink({
        url: API_TRPC_URL,
      }),
    ],
  };
}
