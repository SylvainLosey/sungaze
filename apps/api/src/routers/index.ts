/**
 * Main app router combining all tRPC routers.
 */

import { router } from "../trpc";
import { sunRouter } from "./sun.router";

export const appRouter = router({
  sun: sunRouter,
});

export type AppRouter = typeof appRouter;

