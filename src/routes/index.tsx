import { useList } from "@refinedev/core";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Route as taskRoute } from "./tasks/$id";
import { Route as slotRoute } from "./slots/$id";

import { Task, Slot, calculateAvailability } from "../model";

export const Route = createFileRoute("/")({
  component: function Index() {
    const { data: tasks, isLoading: isTasksLoading } = useList<Task>({
      resource: "tasks",
    });
    const { data: slots, isLoading: isSlotsLoading } = useList<Slot>({
      resource: "slots",
    });

    return (
      <main>
        <h3>Home</h3>
        <p>Welcome to the Picker app</p>
        <h4>Tasks</h4>
        {isTasksLoading || isSlotsLoading ? (
          <div>Loading...</div>
        ) : (
          calculateAvailability(slots!.data!, tasks!.data!, [], [])).map(({ task, slots }) => (
            <article key={task.id}>
              <Link to={taskRoute.to} params={{ id: task.id }}>
                <h3>{task.title}</h3>
                <p>{task.duration} minutes</p>
              </Link>
              <h5>Available Slots</h5>
              <ul>
                {slots.map(slot => (
                  <li key={slot.id}>
                    <Link to={slotRoute.to} params={{ id: slot.id }}>
                      {slot.start.toLocaleString()} - {slot.duration} minutes
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
      </main>
    );
  },
});
