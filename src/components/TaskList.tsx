"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/src/src/convex/_generated/api";
import { Id } from "@/src/src/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

export default function TaskList() {
  const tasks = useQuery(api.tasks.get);
  const addTask = useMutation(api.tasks.add);

  const toggleTask = useMutation(api.tasks.toggleCompleted);
  const removeTask = useMutation(api.tasks.remove);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = async () => {
    if (newTaskText.trim() === "") return;
    await addTask({ text: newTaskText });
    setNewTaskText("");
  };

  if (tasks === undefined) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Liste des tâches</h2>

      <div className="flex gap-2">
        <Input
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Nouvelle tâche"
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
        <Button onClick={handleAddTask}>Ajouter</Button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center justify-between gap-2 p-2 border rounded"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) =>
                  toggleTask({ id: task._id, completed: checked as boolean })
                }
              />
              <span
                className={
                  task.completed ? "line-through text-muted-foreground" : ""
                }
              >
                {task.text}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeTask({ id: task._id })}
            >
              Supprimer
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
