// a task is a piece of work that needs to be scheduled
// it has a title, a duration, and a start time
// it cannot be scheduled outside of the start and end times
// of an available slot, including setup and cleanup times
export type Task = {
  id: string;
  title: string;
  // how long the task will take in minutes
  duration: number;
  // time in minutes it takes to set up the task
  setup: number;
  // time in minutes it takes to clean up the task
  cleanup: number;
};

// a slot is a time period that a task can be scheduled in
// it has a start time and a duration
// slots cannot overlap, and the start time of a task must be within
export type Slot = {
  id: string;
  start: Date;
  duration: number;
};

// availability is a task that has a list of slots that it is available in
export type Availability = {
  task: Task;
  slots: Slot[];
};

// unavailability is a slot that is not available for scheduling specific tasks
export type Unavailability = {
  id: string;
  slot: Slot;
  tasks: Task[];
};

// scheduled is a task that has been scheduled in a slot
export type Scheduled = {
  id: string;
  task: Task;
  slot: Slot;
  start: Date;
};

// examples of tasks
/*
const tasks: Task[] = [
  {
    id: "1",
    title: "Task 1",
    duration: 30,
    setup: 5,
    cleanup: 5,
  },
  {
    id: "2",
    title: "Task 2",
    duration: 60,
    setup: 10,
    cleanup: 10,
  },
];
*/

// examples of slots
/*
const slots: Slot[] = [
  {
    id: "1",
    start: new Date("2021-01-01T09:00:00"),
    duration: 60,
  },
  {
    id: "2",
    start: new Date("2021-01-01T10:00:00"),
    duration: 60,
  },
];
*/

// examples of unavailability
// here we are saying that task 1 cannot be scheduled in slot 1
// and task 2 cannot be scheduled in slot 2
/*
const unavailability: Unavailability[] = [
  {
    id: "1",
    slot: slots[0],
    tasks: [tasks[0]],
  },
  {
    id: "2",
    slot: slots[1],
    tasks: [tasks[1]],
  },
];
*/

// examples of scheduled
/*
const scheduled: Scheduled[] = [
  {
    id: "1",
    task: tasks[0],
    slot: slots[1],
    start: new Date("2021-01-01T10:00:00"),
  },
  {
    id: "2",
    task: tasks[1],
    slot: slots[0],
    start: new Date("2021-01-01T09:00:00"),
  },
];
*/

// examples of availability
// availability is derived from slots, tasks and unavailability
// as a result, the calculated availability maps task 1 to slot 2 and task 2 to slot 1
// availability business rules:
// - a task cannot be scheduled outside of the start and end times of a slot
// - a task cannot be scheduled in a slot that is unavailable to it
// - a task cannot be scheduled in a slot that overlaps with another task
// - a task cannot be scheduled in a slot that overlaps with setup or teardown times of another task
// - a task can be scheduled in any remaining time in a slot that is not already scheduled and is still
//   available
/*
const availability: Availability[] = [
  {
    task: tasks[0],
    slots: [slots[1]],
  },
  {
    task: tasks[1],
    slots: [slots[0]],
  },
];
*/

// determine availability from slots, tasks, currently scheduled tasks and unavailability
export const calculateAvailability = (
  slots: Slot[],
  tasks: Task[],
  unavailability: Unavailability[],
  scheduled: Scheduled[]
): Availability[] => {
  const availability: Availability[] = [];

  for (const task of tasks) {
    const slotsAvailable = slots.filter((slot) =>
      isSlotAvailable(slot, task, unavailability, scheduled)
    );
    availability.push({
      task,
      slots: slotsAvailable,
    });
  }

  return availability;
};

const isSlotUnavailable = (
  slot: Slot,
  task: Task,
  unavailability: Unavailability[]
): boolean => {
  const slotUnavailable = unavailability.find(
    (u) => u.slot.id === slot.id && u.tasks.find((t) => t.id === task.id)
  );
  return !!slotUnavailable;
};

const isTaskOverlappingSlot = (
  slot: Slot,
  task: Task,
  scheduled: Scheduled[]
): boolean => {
  let availableDuration = slot.duration;
  const slotsScheduled = scheduled.filter((s) => s.slot.id === slot.id);
  for (const scheduledSlot of slotsScheduled) {
    availableDuration -=
      scheduledSlot.task.duration +
      scheduledSlot.task.setup +
      scheduledSlot.task.cleanup;
  }

  if (availableDuration < task.duration) {
    return true;
  }

  return false;
};

export const isSlotAvailable = (
  slot: Slot,
  task: Task,
  unavailability: Unavailability[],
  scheduled: Scheduled[]
): boolean => {
  return (
    !isSlotUnavailable(slot, task, unavailability) &&
    !isTaskOverlappingSlot(slot, task, scheduled)
  );
};
