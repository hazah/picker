import { useOne } from '@refinedev/core';
import { Link, createFileRoute } from '@tanstack/react-router'

import { Route as editSlotRoute } from './$id_.edit';

import { Slot } from '../../model';

export const Route = createFileRoute('/slots/$id')({
  component: function Slot() {
    const { id } = Route.useParams();
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
  }
})