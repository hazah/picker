import { HttpError, Refine, useForm, useList, useOne } from "@refinedev/core";
import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { dataProvider, routerBindings, auditLogProvider } from "./providers";
import type { Slot, Task } from "./model";
import { FormEvent, useState } from "react";
import { resources } from "./resources";

const rootRoute = createRootRoute({
  component: () => {
    return (
      <DevtoolsProvider>
        <Refine
          dataProvider={dataProvider}
          routerProvider={routerBindings}
          auditLogProvider={auditLogProvider}
          resources={resources}
        >
          <header>
            <nav>
              <ul>
                <li>
                  <Link to={indexRoute.to}>Home</Link>
                </li>
                <li>
                  <Link to={tasksRoute.to}>Tasks</Link>
                </li>
                <li>
                  <Link to={slotsRoute.to}>Slots</Link>
                </li>
              </ul>
            </nav>
          </header>
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
    return null;
  },
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "tasks",
  component: function Tasks() {
    return <Outlet />;
  },
});

const tasksIndexRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: "/",
  component: function TasksIndex() {
    const { data, isLoading } = useList<Task>();

    return (
      <main>
        <h3>Tasks Index</h3>
        <Link to={newTaskRoute.to}>New Task</Link>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data?.data?.map((task) => (
            <article key={task.id}>
              <Link to={taskRoute.to} params={{ id: task.id }}>
                <h3>{task.title}</h3>
                <p>{task.duration} minutes</p>
              </Link>
            </article>
          ))
        )}
      </main>
    );
  },
});

type TaskFormValues = {
  title?: string;
  duration?: number;
  setup?: number;
  cleanup?: number;
};

const newTaskRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: "new",
  component: function NewTask() {
    const { onFinish } = useForm<Task, HttpError, TaskFormValues>({
      action: "create",
      redirect: "show",
    });

    const [values, setValues] = useState<TaskFormValues>({
      title: "",
      duration: 0,
      setup: 0,
      cleanup: 0,
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onFinish(values);
    };

    return (
      <main>
        <h3>New Task</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              name="title"
              type="text"
              id="title"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              name="duration"
              type="number"
              id="duration"
              value={values.duration}
              onChange={(e) =>
                setValues({ ...values, duration: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="setup">Setup</label>
            <input
              name="setup"
              type="number"
              id="setup"
              value={values.setup}
              onChange={(e) =>
                setValues({ ...values, setup: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="cleanup">Cleanup</label>
            <input
              name="cleanup"
              type="number"
              id="cleanup"
              value={values.cleanup}
              onChange={(e) =>
                setValues({ ...values, cleanup: Number(e.target.value) })
              }
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </main>
    );
  },
});

const taskRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: "$id",
  component: function Task() {
    const { id } = taskRoute.useParams();
    const { isLoading, data } = useOne<Task>({ id });
    return (
      <main>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h3>{data?.data?.title}</h3>
            <p>{data?.data?.duration} minutes</p>
            <Link to={editTaskRoute.to} params={{ id }}>
              Edit
            </Link>
          </>
        )}
      </main>
    );
  },
});

const editTaskRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: "$id/edit",
  component: function EditTask() {
    const { id } = editTaskRoute.useParams();
    const { queryResult, formLoading, onFinish } = useForm<Task, HttpError, TaskFormValues>({
      action: "edit",
      id,
      redirect: "show",
    });

    const defaultValues = queryResult?.data?.data;
    const [values, setValues] = useState<TaskFormValues>({
      title: defaultValues?.title || "",
      duration: defaultValues?.duration || 0,
      setup: defaultValues?.setup || 0,
      cleanup: defaultValues?.cleanup || 0,
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onFinish(values);
    };

    return (
      <main>
        <h3>Edit Task #{id}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              name="title"
              type="text"
              id="title"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              name="duration"
              type="number"
              id="duration"
              value={values.duration}
              onChange={(e) =>
                setValues({ ...values, duration: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="setup">Setup</label>
            <input
              name="setup"
              type="number"
              id="setup"
              value={values.setup}
              onChange={(e) =>
                setValues({ ...values, setup: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="cleanup">Cleanup</label>
            <input
              name="cleanup"
              type="number"
              id="cleanup"
              value={values.cleanup}
              onChange={(e) =>
                setValues({ ...values, cleanup: Number(e.target.value) })
              }
            />
          </div>
          <button type="submit">Update</button>
        </form>
        <Link to={taskRoute.to} params={{ id }}>
          Back
        </Link>
      </main>
    );
  },
});

const slotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "slots",
  component: function Slots() {
    return <Outlet />;
  },
});

const slotsIndexRoute = createRoute({
  getParentRoute: () => slotsRoute,
  path: "/",
  component: function SlotsIndex() {
    const { data, isLoading } = useList<Slot>();

    return (
      <main>
        <h3>Slots Index</h3>
        <Link to={newSlotRoute.to}>New Slot</Link>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data?.data?.map((slot) => (
            <article key={slot.id}>
              <Link to={slotRoute.to} params={{ id: slot.id }}>
                {slot.start.toLocaleString()} - {slot.duration} minutes
              </Link>
            </article>
          ))
        )}
      </main>
    );
  },
});

type SlotFormValues = {
  start?: string;
  duration?: string;
};

const newSlotRoute = createRoute({
  getParentRoute: () => slotsRoute,
  path: "new",
  component: function NewSlot() {
    const { onFinish } = useForm<Slot, HttpError, SlotFormValues>({
      resource: "slots",
      action: "create",
      redirect: "show",
    });

    const [values, setValues] = useState<SlotFormValues>({
      start: "",
      duration: "",
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onFinish(values);
    };

    return (
      <main>
        <h3>New Slot</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="start">Start</label>
            <input
              name="start"
              type="datetime-local"
              id="start"
              value={values.start}
              onChange={(e) => setValues({ ...values, start: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              name="duration"
              type="number"
              id="duration"
              value={values.duration}
              onChange={(e) =>
                setValues({ ...values, duration: e.target.value })
              }
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </main>
    );
  },
});

const slotRoute = createRoute({
  getParentRoute: () => slotsRoute,
  path: "$id",
  component: function Slot() {
    const { id } = slotRoute.useParams();
    const { isLoading, data } = useOne<Slot>({ id });

    return (
      <main>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h3>{data?.data?.start.toLocaleString()}</h3>
            <p>{data?.data?.duration} minutes</p>
            <Link to={editSlotRoute.to} params={{ id }}>
              Edit
            </Link>
          </>
        )}
      </main>
    );
  },
});

const editSlotRoute = createRoute({
  getParentRoute: () => slotsRoute,
  path: "$id/edit",
  component: function EditSlot() {
    const { id } = editSlotRoute.useParams();
    return (
      <main>
        <h3>Edit Slot #{id}</h3>
        <Link to={slotRoute.to} params={{ id }}>
          Back
        </Link>
      </main>
    );
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tasksRoute.addChildren([
    tasksIndexRoute,
    newTaskRoute,
    taskRoute,
    editTaskRoute,
  ]),
  slotsRoute.addChildren([
    slotsIndexRoute,
    newSlotRoute,
    slotRoute,
    editSlotRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
