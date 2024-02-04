import { describe, it, expect, beforeEach } from "vitest";
import { calculateAvailability } from "./model";
import type {
  Slot,
  Task,
  Unavailability,
  Scheduled,
} from "./model";

describe("calculateAvailability", () => {
  let slots: Slot[];

  beforeEach(() => {
    slots = [
      { id: "1", start: new Date("2022-01-01T09:00:00"), duration: 60 },
      { id: "2", start: new Date("2022-01-01T10:00:00"), duration: 60 },
      { id: "3", start: new Date("2022-01-01T11:00:00"), duration: 60 },
      { id: "4", start: new Date("2022-01-01T12:00:00"), duration: 120 },
    ];
  });

  it("should return all slots as available when no tasks are scheduled", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", duration: 40, setup: 10, cleanup: 10 },
      { id: "2", title: "Task 2", duration: 40, setup: 10, cleanup: 10 },
    ];
    const unavailability: Unavailability[] = [];
    const scheduled: Scheduled[] = [];

    const result = calculateAvailability(slots, tasks, unavailability, scheduled);

    const expected = [
      { task: tasks[0], slots },
      { task: tasks[1], slots },
    ];

    expect(result).toMatchObject(expected);
  });

  it("should return only available slots when some tasks are scheduled", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", duration: 40, setup: 10, cleanup: 10 },
      { id: "2", title: "Task 2", duration: 40, setup: 10, cleanup: 10 },
    ];
    const unavailability: Unavailability[] = [];
    const scheduled: Scheduled[] = [
      { id: "1", task: tasks[0], slot: slots[0], start: slots[0].start },
    ];

    const result = calculateAvailability(slots, tasks, unavailability, scheduled);

    const expected = [
      { task: tasks[0], slots: slots.slice(1) },
      { task: tasks[1], slots: slots.slice(1) },
    ];

    expect(result).toMatchObject(expected);
  });

  it("should return only available slots when some slots are unavailable for a task", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", duration: 40, setup: 10, cleanup: 10 },
      { id: "2", title: "Task 2", duration: 40, setup: 10, cleanup: 10 },
    ];
    const unavailability: Unavailability[] = [
      { id: "1", slot: slots[0], tasks: [tasks[0]] },
    ];
    const scheduled: Scheduled[] = [];

    const result = calculateAvailability(slots, tasks, unavailability, scheduled);

    const expected = [
      { task: tasks[0], slots: slots.slice(1) },
      { task: tasks[1], slots },
    ];

    expect(result).toMatchObject(expected);
  });

  it("should return only available slots when some slots are unavailable for a task and some tasks are scheduled", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", duration: 40, setup: 10, cleanup: 10 },
      { id: "2", title: "Task 2", duration: 40, setup: 10, cleanup: 10 },
    ];
    const unavailability: Unavailability[] = [
      { id: "1", slot: slots[0], tasks: [tasks[0]] },
    ];
    const scheduled: Scheduled[] = [
      { id: "1", task: tasks[0], slot: slots[1], start: slots[1].start },
    ];

    const result = calculateAvailability(slots, tasks, unavailability, scheduled);

    const expected = [
      { task: tasks[0], slots: slots.slice(2) },
      { task: tasks[1], slots: [slots[0], slots[2], slots[3]] },
    ];

    expect(result).toMatchObject(expected);
  });

  it("should return only available slots that are long enough for the task", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", duration: 40, setup: 10, cleanup: 10 },
      { id: "2", title: "Task 2", duration: 100, setup: 10, cleanup: 10 },
    ];
    const unavailability: Unavailability[] = [];
    const scheduled: Scheduled[] = [];

    const result = calculateAvailability(slots, tasks, unavailability, scheduled);

    const expected = [
      { task: tasks[0], slots: slots },
      { task: tasks[1], slots: [slots[3]] },
    ];

    expect(result).toMatchObject(expected);
  });

  it("should return only available slots that are long enough for the task and some tasks are scheduled", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", duration: 40, setup: 10, cleanup: 10 },
      { id: "2", title: "Task 2", duration: 100, setup: 10, cleanup: 10 },
    ];
    const unavailability: Unavailability[] = [];
    const scheduled: Scheduled[] = [
      { id: "1", task: tasks[0], slot: slots[3], start: slots[0].start },
    ];

    const result = calculateAvailability(slots, tasks, unavailability, scheduled);

    const expected = [
      { task: tasks[0], slots: slots },
      { task: tasks[1], slots: [] },
    ];

    expect(result).toMatchObject(expected);
  });
});
