import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";
import {
  BaseRecord,
  CreateParams,
  CreateResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  GoConfig,
  GoFunction,
  ParseResponse,
  Refine,
  ResourceContext,
  RouterBindings,
  UpdateParams,
  UpdateResponse,
  matchResourceFromRoute,
  useGo,
  useList,
} from "@refinedev/core";
import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  matchPathname,
  useNavigate,
  useParams,
  useRouter,
  useRouterState,
  AnyPathParams,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  ComponentProps,
  StrictMode,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
} from "react";

const dataProvider: DataProvider = {
  getList: function <TData extends BaseRecord = BaseRecord>(
    params: GetListParams
  ): Promise<GetListResponse<TData>> {
    console.log("getList", params);
    throw new Error("Function not implemented.");
  },
  getOne: function <TData extends BaseRecord = BaseRecord>(
    params: GetOneParams
  ): Promise<GetOneResponse<TData>> {
    console.log("getOne", params);
    throw new Error("Function not implemented.");
  },
  create: function <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    params: CreateParams<TVariables>
  ): Promise<CreateResponse<TData>> {
    console.log("create", params);
    throw new Error("Function not implemented.");
  },
  update: function <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    params: UpdateParams<TVariables>
  ): Promise<UpdateResponse<TData>> {
    console.log("update", params);
    throw new Error("Function not implemented.");
  },
  deleteOne: function <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    params: DeleteOneParams<TVariables>
  ): Promise<DeleteOneResponse<TData>> {
    console.log("deleteOne", params);
    throw new Error("Function not implemented.");
  },
  getApiUrl: function (): string {
    throw new Error("Function not implemented.");
  },
};

const routerBindings: RouterBindings = {
  go: function (): GoFunction {
    const routeState = useRouterState();

    const { search: existingSearch, hash: existingHash } = routeState.location;

    const navigate = useNavigate();

    const fn = useCallback(
      ({
        to,
        type,
        query,
        hash,
        options: { keepQuery, keepHash } = {},
      }: GoConfig) => {
        /** construct query params */
        const urlQuery = {
          ...(keepQuery && existingSearch && existingSearch),
          ...query,
        } as Record<string, string>;

        if (urlQuery.to) {
          urlQuery.to = encodeURIComponent(urlQuery.to);
        }

        const hasUrlQuery = Object.keys(urlQuery).length > 0;

        const urlHash = `#${(
          hash ||
          (keepHash && new URLSearchParams(existingHash).toString()) ||
          ""
        ).replace(/^#/, "")}`;

        const hasUrlHash = urlHash.length > 1;

        const urlTo = to || "";

        const fullPath = `${urlTo}${
          hasUrlQuery ? `?${new URLSearchParams(urlQuery).toString()}` : ""
        }${hasUrlHash ? urlHash : ""}`;

        if (type === "path") {
          return fullPath;
        }

        return navigate({
          to: urlTo,
          search: urlQuery,
          hash: urlHash,
          replace: type === "replace",
        });
      },
      [existingSearch, existingHash, navigate]
    );

    return fn as GoFunction;
  },
  back: () => {
    const router = useRouter();

    const fn = useCallback(() => {
      router.history.back();
    }, [router]);

    return fn;
  },
  parse: () => {
    let params = useParams({ strict: false }) as AnyPathParams & { id: string };
    const { pathname, search } = useRouterState().location;
    const { resources } = useContext(ResourceContext);

    const { resource, action, matchedRoute } = useMemo(() => {
      return matchResourceFromRoute(pathname, resources);
    }, [resources, pathname]);

    if (Object.entries(params).length === 0 && matchedRoute) {
      params = matchPathname(matchedRoute, pathname, {}) as AnyPathParams & {
        id: string;
      };
    }

    const fn = useCallback(() => {
      const combinedParams = {
        ...params,
        ...search,
      } as Record<string, string | number>;

      const response: ParseResponse = {
        ...(resource && { resource }),
        ...(action && { action }),
        ...(params?.id && { id: decodeURIComponent(params.id as string) }),
        pathname,
        params: {
          ...combinedParams,
          current: combinedParams.current
            ? Number(combinedParams.current)
            : undefined,
          pageSize: combinedParams.pageSize
            ? Number(combinedParams.pageSize)
            : undefined,
          to: combinedParams.to
            ? decodeURIComponent(combinedParams.to as string)
            : undefined,
        },
      };

      return response;
    }, [pathname, search, params, resource, action]);

    return fn;
  },

  Link: forwardRef<
    HTMLAnchorElement,
    ComponentProps<NonNullable<RouterBindings["Link"]>>
  >(function RefineLink(props, ref) {
    return <Link {...props} ref={ref} />;
  }),
};

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
        <Link to={taskRoute.to} params={{ id: "1" }}>
          Task #1
        </Link>{" "}
        |{" "}
        <Link to={taskRoute.to} params={{ id: "2" }}>
          Task #2
        </Link>
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

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
