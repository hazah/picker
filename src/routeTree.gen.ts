/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TasksImport } from './routes/tasks'
import { Route as SlotsImport } from './routes/slots'
import { Route as IndexImport } from './routes/index'
import { Route as TasksIndexImport } from './routes/tasks/index'
import { Route as SlotsIndexImport } from './routes/slots/index'
import { Route as TasksNewImport } from './routes/tasks/new'
import { Route as TasksIdImport } from './routes/tasks/$id'
import { Route as SlotsNewImport } from './routes/slots/new'
import { Route as SlotsIdImport } from './routes/slots/$id'
import { Route as TasksIdEditImport } from './routes/tasks/$id_.edit'
import { Route as SlotsIdEditImport } from './routes/slots/$id_.edit'

// Create/Update Routes

const TasksRoute = TasksImport.update({
  path: '/tasks',
  getParentRoute: () => rootRoute,
} as any)

const SlotsRoute = SlotsImport.update({
  path: '/slots',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TasksIndexRoute = TasksIndexImport.update({
  path: '/',
  getParentRoute: () => TasksRoute,
} as any)

const SlotsIndexRoute = SlotsIndexImport.update({
  path: '/',
  getParentRoute: () => SlotsRoute,
} as any)

const TasksNewRoute = TasksNewImport.update({
  path: '/new',
  getParentRoute: () => TasksRoute,
} as any)

const TasksIdRoute = TasksIdImport.update({
  path: '/$id',
  getParentRoute: () => TasksRoute,
} as any)

const SlotsNewRoute = SlotsNewImport.update({
  path: '/new',
  getParentRoute: () => SlotsRoute,
} as any)

const SlotsIdRoute = SlotsIdImport.update({
  path: '/$id',
  getParentRoute: () => SlotsRoute,
} as any)

const TasksIdEditRoute = TasksIdEditImport.update({
  path: '/$id/edit',
  getParentRoute: () => TasksRoute,
} as any)

const SlotsIdEditRoute = SlotsIdEditImport.update({
  path: '/$id/edit',
  getParentRoute: () => SlotsRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/slots': {
      preLoaderRoute: typeof SlotsImport
      parentRoute: typeof rootRoute
    }
    '/tasks': {
      preLoaderRoute: typeof TasksImport
      parentRoute: typeof rootRoute
    }
    '/slots/$id': {
      preLoaderRoute: typeof SlotsIdImport
      parentRoute: typeof SlotsImport
    }
    '/slots/new': {
      preLoaderRoute: typeof SlotsNewImport
      parentRoute: typeof SlotsImport
    }
    '/tasks/$id': {
      preLoaderRoute: typeof TasksIdImport
      parentRoute: typeof TasksImport
    }
    '/tasks/new': {
      preLoaderRoute: typeof TasksNewImport
      parentRoute: typeof TasksImport
    }
    '/slots/': {
      preLoaderRoute: typeof SlotsIndexImport
      parentRoute: typeof SlotsImport
    }
    '/tasks/': {
      preLoaderRoute: typeof TasksIndexImport
      parentRoute: typeof TasksImport
    }
    '/slots/$id/edit': {
      preLoaderRoute: typeof SlotsIdEditImport
      parentRoute: typeof SlotsImport
    }
    '/tasks/$id/edit': {
      preLoaderRoute: typeof TasksIdEditImport
      parentRoute: typeof TasksImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  SlotsRoute.addChildren([
    SlotsIdRoute,
    SlotsNewRoute,
    SlotsIndexRoute,
    SlotsIdEditRoute,
  ]),
  TasksRoute.addChildren([
    TasksIdRoute,
    TasksNewRoute,
    TasksIndexRoute,
    TasksIdEditRoute,
  ]),
])

/* prettier-ignore-end */
