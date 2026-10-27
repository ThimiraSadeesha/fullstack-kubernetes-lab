export type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

// Server-side only. In Kubernetes this is the API Service DNS name
// (e.g. http://erp-api:3000), set at runtime via the API_URL env var.
export async function getTasks(): Promise<Task[]> {
  const apiUrl = process.env.API_URL ?? "http://localhost:3001";
  const res = await fetch(`${apiUrl}/tasks`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json();
}
