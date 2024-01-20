import {
  BackFunction,
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
  matchResourceFromRoute
} from '@refinedev/core';
import { Link, Route, useNavigate, useParams, useRouter, useRouterState, useSearch } from '@tanstack/react-router';
import { ComponentProps, forwardRef, useCallback, useContext, useMemo } from 'react';

const dataProvider: DataProvider = {
  getList: function <TData extends BaseRecord = BaseRecord>(params: GetListParams): Promise<GetListResponse<TData>> {
    throw new Error('Function not implemented.');
  },
  getOne: function <TData extends BaseRecord = BaseRecord>(params: GetOneParams): Promise<GetOneResponse<TData>> {
    throw new Error('Function not implemented.');
  },
  create: function <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: CreateParams<TVariables>): Promise<CreateResponse<TData>> {
    throw new Error('Function not implemented.');
  },
  update: function <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> {
    throw new Error('Function not implemented.');
  },
  deleteOne: function <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> {
    throw new Error('Function not implemented.');
  },
  getApiUrl: function (): string {
    throw new Error('Function not implemented.');
  }
};

const routerBindings: RouterBindings = {
  go: function (): GoFunction {
    const routeState = useRouterState();

    const { search: existingSearch, hash: existingHash } = routeState.location;

    const navigate = useNavigate();

    const fn = useCallback(({
      to,
      type,
      query,
      hash,
      options: { keepQuery, keepHash } = {},
    }: GoConfig) => {
      /** construct query params */
      const urlQuery = {
        ...(keepQuery &&
          existingSearch &&
          existingSearch),
        ...query,
      };

      if (urlQuery.to) {
        urlQuery.to = encodeURIComponent(urlQuery.to);
      }
      

      const hasUrlQuery = Object.keys(urlQuery).length > 0;
      
      const urlHash = `#${(hash || (keepHash && new URLSearchParams(existingHash).toString()) || '').replace(/^#/, '')}`;

      const hasUrlHash = urlHash.length > 1;

      const urlTo = to || '';

      const fullPath = `${urlTo}${hasUrlQuery ? `?${new URLSearchParams(urlQuery).toString()}` : ''}${hasUrlHash ? urlHash : ''}`;

      if (type === 'path') {
        return fullPath;
      }

      return navigate({
        to: urlTo,
        search: urlQuery,
        hash: urlHash,
        replace: type === 'replace',
      });

    }, [existingSearch, existingHash, navigate]);

    return fn as GoFunction;
  },
  back: () => {
    const router = useRouter();

    const fn = useCallback(() => {
      router.history.back();
    }, [router]);

    return fn as BackFunction;
  },
  parse: () => {
    let params = useParams({ strict: false });
    const { pathname, search } = useRouterState().location;
    const { resources } = useContext(ResourceContext);

    const { resource, action, matchedRoute } = useMemo(() => {
      return matchResourceFromRoute(pathname, resources);
    }, [resources, pathname]);

    const fn = useCallback(() => {
      const combinedParams = {
        ...params,
        ...search,
      };

      const response: ParseResponse = {
        ...(resource && { resource }),
        ...(action && { action }),
        ...(params?.id && { id: decodeURIComponent(params.id) }),
        pathname,
        params: {
          ...combinedParams,
          current: combinedParams.current ? Number(combinedParams.current) : undefined,
          pageSize: combinedParams.pageSize ? Number(combinedParams.pageSize) : undefined,
          to: combinedParams.to ? decodeURIComponent(combinedParams.to) : undefined,
        }
      };

      return response;
    }, [pathname, search, params, resource, action]);

    return fn;
  },

  Link: forwardRef<
    HTMLAnchorElement,
    ComponentProps<NonNullable<RouterBindings['Link']>>
    >(function RefineLink(props, ref) {
      return <Link {...props} ref={ref} />;
    }),
};

function App() {
  return <Refine
    dataProvider={dataProvider}
    routerProvider={routerBindings}
  />;
}

export default App
