/**
 * tRPC client setup for React Native.
 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@sungaze/api/types";

export const trpc = createTRPCReact<AppRouter>();
