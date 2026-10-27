import { Suspense } from "react";
import { TaskList } from "./task-list";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
      <Suspense
        fallback={<p className="text-sm text-zinc-500">Loading tasks…</p>}
      >
        <TaskList />
      </Suspense>
    </main>
  );
}
