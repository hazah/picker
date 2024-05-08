import { useList } from "@refinedev/core";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Route as newSlotRoute } from "./new";
import { Route as slotRoute } from "./$id";

import { Slot } from "../../model";
import { dataProvider } from "../../providers";

export const Route = createFileRoute("/slots/")({
  loader: async ({ context }) => {
    const providerName = "default";
    const resource = "slots";
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
  component: function SlotsIndex() {
    const { data, isLoading } = useList<Slot>({
      resource: "slots",
    });

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