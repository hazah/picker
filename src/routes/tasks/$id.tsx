import { useOne } from '@refinedev/core';
import { Link, createFileRoute } from '@tanstack/react-router'

import { Route as editTaskRoute } from './$id_.edit'

import { Task } from '../../model'

export const Route = createFileRoute('/tasks/$id')({
  component: function Task() {
    const { id } = Route.useParams();
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
  }
})
