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
]);

(async function () {
  if ((await database.rel.find("task")).tasks.length === 0) {
    await database.rel.save("task", {
      id: "1",
      title: "Task #1",
    });

    await database.rel.save("task", {
      id: "2",
      title: "Task #2",
    });

    console.log("Database seeded");
  }
})();

export default database;
