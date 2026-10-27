"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Task } from "@/lib/tasks";

// Requests go to /api/*, which next.config.ts rewrites to the NestJS API.
async function call(path: string, init: RequestInit) {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
}

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const value = title.trim();
          if (!value) return;
          run(async () => {
            await call("/tasks", {
              method: "POST",
              body: JSON.stringify({ title: value }),
            });
            setTitle("");
          });
        }}
      >
        <input
          className="flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          placeholder="New task"
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          disabled={pending || !title.trim()}
        >
          Add
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-500">No tasks yet. Add one above.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={task.completed}
                disabled={pending}
                onChange={() =>
                  run(() =>
                    call(`/tasks/${task.id}`, {
                      method: "PATCH",
                      body: JSON.stringify({ completed: !task.completed }),
                    }),
                  )
                }
              />
              <span
                className={`flex-1 text-sm ${task.completed ? "text-zinc-400 line-through" : ""}`}
              >
                {task.title}
              </span>
              <button
                className="text-xs text-zinc-500 hover:text-red-600 disabled:opacity-50"
                disabled={pending}
                onClick={() =>
                  run(() => call(`/tasks/${task.id}`, { method: "DELETE" }))
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
