import Pouch from "pouchdb";
import find from "pouchdb-find";
import rel from "relational-pouch";

Pouch.plugin(find).plugin(rel);

const Database = new Pouch("picker");
const database = Database.setSchema([
  {
    singular: "task",
    plural: "tasks",
  },
  {
    singular: "slot",
    plural: "slots",
  },
  {
    singular: "unavailability",
    plural: "unavailabilities",
  },
  {
    singular: "scheduled",
    plural: "scheduled",
  },
]);

export default database;
