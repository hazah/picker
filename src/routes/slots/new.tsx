import { useState, FormEvent } from 'react';
import { useForm, HttpError } from '@refinedev/core';
import { createFileRoute } from '@tanstack/react-router'

import { Slot } from '../../model';

type SlotFormValues = {
  start?: string;
  duration?: string;
};

export const Route = createFileRoute('/slots/new')({
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
  }
})