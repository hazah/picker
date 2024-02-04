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
  AuditLogProvider,
  BaseKey,
  LogParams,
  HttpError,
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
import { useCallback, useContext, useMemo } from "react";
import database from "./database";

const dataProvider: DataProvider = {
  getList: async function <TData extends BaseRecord = BaseRecord>(
    params: GetListParams
  ): Promise<GetListResponse<TData>> {
    console.log("getList", params);
    try {
      const data = await database.rel.find(params.resource);
      console.log("data", data);
      return {
        data: data[params.resource] || [],
        total: data[params.resource]?.length || 0,
      };
    } catch (e: any) {
      console.error("exception", e);
      const error: HttpError = {
        message: e?.message || "An error occurred",
        statusCode: e?.status || 500,
      };
      return error as any;
    }
  },
  getOne: async <TData extends BaseRecord = BaseRecord>(
    params: GetOneParams
  ): Promise<GetOneResponse<TData>> => {
    console.log("getOne", params);
    try {
      const data = await database.rel.find(params.resource, params.id);
      return {
        data: data[params.resource][0],
      };
    } catch (e: any) {
      console.error("exception", e);
      const error: HttpError = {
        message: e?.message || "An error occurred",
        statusCode: e?.status || 500,
      };
      return error as any;
    }
  },
  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    params: CreateParams<TVariables>
  ): Promise<CreateResponse<TData>> => {
    console.log("create", params);
    try {
      const { id } = await database.rel.save(params.resource, params.variables);
      console.log("id", id);
      const data = await database.rel.find(params.resource, id);
      return {
        data: data[params.resource][0],
      };
    } catch (e: any) {
      console.error("exception", e);
      const error: HttpError = {
        message: e?.message || "An error occurred",
        statusCode: e?.status || 500,
      };
      return error as any;
    }
  },
  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    params: UpdateParams<TVariables>
  ): Promise<UpdateResponse<TData>> => {
    console.log("update", params);
    try {
      await database.rel.save(params.resource, {
        ...params.variables,
        id: params.id,
      });
      const data = await database.rel.find(params.resource, params.id);
      return {
        data: data[params.resource][0],
      };
    } catch (e: any) {
      console.error("exception", e);
      const error: HttpError = {
        message: e?.message || "An error occurred",
        statusCode: e?.status || 500,
      };
      return error as any;
    }
  },
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    params: DeleteOneParams<TVariables>
  ): Promise<DeleteOneResponse<TData>> => {
    console.log("deleteOne", params);
    try {
      const data = await database.rel.find(params.resource, params.id);
      await database.rel.del(params.resource, data[params.resource][0]);
      return {
        data: data[params.resource][0],
      };
    } catch (e: any) {
      console.error("exception", e);
      const error: HttpError = {
        message: e?.message || "An error occurred",
        statusCode: e?.status || 500,
      };
      return error as any;
    }
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

const auditLogProvider: AuditLogProvider = {
  get: async (params) => {},
  create: async (params: LogParams): Promise<any> => {},
  update: async (params: {
    [key: string]: any;
    id: BaseKey;
    name: string;
  }): Promise<any> => {},
};

export { dataProvider, routerBindings, auditLogProvider };
