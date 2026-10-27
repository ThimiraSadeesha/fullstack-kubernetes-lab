import { getTasks } from "@/lib/tasks";
import { TaskBoard } from "./task-board";

export async function TaskList() {
  let tasks;
  try {
    tasks = await getTasks();
  } catch {
    return (
      <p className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        Could not reach the API. Check that erp-api is running and API_URL is
        correct.
      </p>
    );
  }
  return <TaskBoard tasks={tasks} />;
}
