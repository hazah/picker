import { Refine, useList, useGo } from "@refinedev/core";
import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { dataProvider, routerBindings } from "./providers";


const rootRoute = createRootRoute({
    component: () => {
      return (
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider}
            routerProvider={routerBindings}
            resources={[
              {
                name: "tasks",
                list: "/tasks",
                show: "/tasks/:id",
              },
            ]}
          >
            <Link to="/">Home</Link> | <Link to="tasks">Tasks</Link>
            <Outlet />
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      );
    },
  });
  
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: function Index() {
      return (
        <div className="p-2">
          <h3>Welcome Home!</h3>
        </div>
      );
    },
  });
  
  const tasksRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "tasks",
    component: function Tasks() {
      return (
        <section>
          <Outlet />
        </section>
      );
    },
  });
  
  const tasksIndexRoute = createRoute({
    getParentRoute: () => tasksRoute,
    path: "/",
    component: function TasksIndex() {
      const { data, isLoading } = useList();
      const go = useGo();
  
      if (isLoading) return <div>Loading...</div>;
  
      return (
        <div className="p-2">
          <h3>Tasks Index</h3>
          {data?.data?.map((task) => (
            <div key={task.id}>
              <Link to={taskRoute.to} params={{ id: task.id as string }}>
                {task.id}
              </Link>
              |{" "}
              <button
                onClick={() =>
                  go({ to: {
                    resource: "tasks",
                    action: "show",
                    id: task.id!,
                  } })
                }
              >
                {task.title}
              </button>
            </div>
          ))}
        </div>
      );
    },
  });
  
  const taskRoute = createRoute({
    getParentRoute: () => tasksRoute,
    path: "$id",
    component: function Task() {
      const { id } = taskRoute.useParams();
      return (
        <div className="p-2">
          <h3>Task #{id}</h3>
        </div>
      );
    },
  });
  
  const routeTree = rootRoute.addChildren([
    indexRoute,
    tasksRoute.addChildren([tasksIndexRoute, taskRoute]),
  ]);
  
  const router = createRouter({ routeTree });
  
  declare module "@tanstack/react-router" {
    interface Register {
      router: typeof router;
    }
  }

  export default router;