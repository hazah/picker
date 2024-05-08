import { useList } from '@refinedev/core';
import { Link, createFileRoute } from '@tanstack/react-router'

import { Route as newTaskRoute } from './new'
import { Route as taskRoute } from './$id'

import { Task } from '../../model'
import { dataProvider } from '../../providers';

export const Route = createFileRoute('/tasks/')({
  loader: async ({ context }) => {
    const providerName = "default";
    const resource = "tasks";
    const action = "list";
    const pagination = {
      current: 1,
      mode: "server",
      pageSize: 10,
    };
    const options = {
      hasPagination: true,
      pagination,
    };
    const queryKey = [
      providerName,
      resource,
      action,
      options,
    ];

    await context.queryClient.ensureQueryData({ queryKey, queryFn: () => dataProvider.getList({
      resource: queryKey[1] as string,
      pagination: (queryKey[3] as any).pagination,
    }) });
  },
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
  }
})