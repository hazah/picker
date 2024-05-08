import { Link, createFileRoute } from '@tanstack/react-router'

import { Route as slotRoute } from './$id'

export const Route = createFileRoute('/slots/$id/edit')({
  component: function EditSlot() {
    const { id } = Route.useParams();
    return (
      <main>
        <h3>Edit Slot #{id}</h3>
        <Link to={slotRoute.to} params={{ id }}>
          Back
        </Link>
      </main>
    );
  }
})