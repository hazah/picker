import { useState, FormEvent } from "react";
import { useForm, HttpError } from "@refinedev/core";
import { createFileRoute } from "@tanstack/react-router";

import { Task } from "../../model";

type TaskFormValues = {
  title?: string;
  duration?: number;
  setup?: number;
  cleanup?: number;
};

export const Route = createFileRoute('/tasks/new')({
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
