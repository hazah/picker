import {
  DataProvider,
  BaseRecord,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  CreateParams,
  CreateResponse,
  UpdateParams,
  UpdateResponse,
  DeleteOneParams,
  DeleteOneResponse,
  RouterBindings,
  GoConfig,
  GoFunction,
  ResourceContext,
  matchResourceFromRoute,
  ParseResponse,
} from "@refinedev/core";
import {
  Link,
  useRouterState,
  useNavigate,
  useRouter,
  useParams,
  AnyPathParams,
  matchPathname,
} from "@tanstack/react-router";
import {
  useCallback,
  useContext,
  useMemo,
} from "react";
import database from "./database";

const dataProvider: DataProvider = {
  getList: async function <TData extends BaseRecord = BaseRecord>(
    params: GetListParams
  ): Promise<GetListResponse<TData>> {
    console.log("getList", params);
    const data = await database.rel.find(params.resource);
    console.log("data", data);
    return {
      data: data.tasks,
      total: data.tasks.length,
    };
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
  go: function () {
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

        const urlHash = `${(
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

  Link,
};

export { dataProvider, routerBindings };
