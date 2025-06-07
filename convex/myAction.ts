import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const doSomething = action({
  args: {
    userId: v.id("users"),
    hashedPassword: v.string(),
  },
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    await ctx.runMutation(internal.users.approveUserMutation, {
      userId: user?.subject as Id<"users">,
      hashedPassword: "123",
    });
  },
});
