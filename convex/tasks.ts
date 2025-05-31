import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer toutes les tâches
export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

// Ajouter une nouvelle tâche
export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      completed: false,
      createdAt: Date.now(),
    });
    return taskId;
  },
});

// Mettre à jour le statut d'une tâche
export const toggleCompleted = mutation({
  args: { id: v.id("tasks"), completed: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { completed: args.completed });
  },
});

// Supprimer une tâche
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
