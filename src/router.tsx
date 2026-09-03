import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/client/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({ routeTree, defaultErrorComponent: AppErrorComponent });
}
