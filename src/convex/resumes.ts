import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const submitResume = mutation({
  args: {
    name: v.string(),
    age: v.number(),
    gender: v.string(),
    phoneNumber: v.string(),
    email: v.string(),
    state: v.string(),
    district: v.string(),
    resumeFileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    return await ctx.db.insert("resumes", {
      ...args,
      userId: user._id,
      status: "pending" as const,
      submittedAt: Date.now(),
    });
  },
});

export const getAllResumes = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_status")
      .collect();
  },
});

export const updateResumeStatus = mutation({
  args: {
    resumeId: v.id("resumes"),
    status: v.union(v.literal("pending"), v.literal("shortlisted"), v.literal("rejected")),
    aiReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db.patch(args.resumeId, {
      status: args.status,
      aiReason: args.aiReason,
      reviewedAt: Date.now(),
      reviewedBy: user._id,
    });
  },
});

export const getUserResumes = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});
