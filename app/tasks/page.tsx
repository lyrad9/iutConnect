import TaskList from "@/src/components/TaskList";

export default function TasksPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Gestionnaire de tâches</h1>
      <div className="bg-card rounded-lg shadow p-6">
        <TaskList />
      </div>
    </div>
  );
}
