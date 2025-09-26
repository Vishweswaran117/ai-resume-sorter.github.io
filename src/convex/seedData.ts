import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createAdminUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("email")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingAdmin) {
      // Update existing user to admin
      await ctx.db.patch(existingAdmin._id, {
        role: "admin",
      });
      return existingAdmin._id;
    }

    // Create new admin user
    return await ctx.db.insert("users", {
      email: args.email,
      role: "admin",
      name: "Admin User",
    });
  },
});
