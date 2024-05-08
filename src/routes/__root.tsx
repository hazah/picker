import { Refine, useMenu } from "@refinedev/core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, createRoute, Link, Outlet, ReactNode } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient } from "@tanstack/react-query";

import { Route as indexRoute } from "./index";
import { Route as tasksRoute } from "./tasks";
import { Route as slotsRoute } from "./slots";

import { dataProvider, routerBindings, auditLogProvider } from "../providers";
import { resources } from "../resources";

interface RouterContext {
  queryClient: QueryClient
}

const Layout = ({ children }: { children: ReactNode }) => {
  const { menuItems } = useMenu();

  const routeMap = {
    "tasks": tasksRoute,
    "slots": slotsRoute,
  } as { [key: string]: ReturnType<typeof createRoute> };

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to={indexRoute.to}>Home</Link>
            </li>
            {menuItems.map(item => (
              <li key={item.name}>
                <Link to={routeMap[item.name].to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {children}
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: ({ context: queryClient }) => {
    return (
      // <DevtoolsProvider>
      <Refine
        dataProvider={dataProvider}
        routerProvider={routerBindings}
        auditLogProvider={auditLogProvider}
        resources={resources}
        options={
          {
            reactQuery: {
              clientConfig: queryClient
            }
          }
        }
      >
        <Layout>
          <Outlet />
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </Layout>
      </Refine>
      // {/* <DevtoolsPanel /> */}
      // </DevtoolsProvider>
    );
  },
});
