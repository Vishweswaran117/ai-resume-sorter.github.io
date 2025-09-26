import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { api } from "./_generated/api";

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
    roleApplied: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const resumeId = await ctx.db.insert("resumes", {
      ...args,
      userId: user._id,
      status: "pending" as const,
      submittedAt: Date.now(),
    });

    // Schedule AI analysis to run in the background (actions can't be called directly from mutations)
    await ctx.scheduler.runAfter(
      0,
      api.ai.analyzeResume,
      {
        resumeId,
        resumeText: `Candidate ${args.name} applying for ${args.roleApplied}. Experienced with projects, collaboration, and product thinking.`,
        candidateInfo: {
          name: args.name,
          age: args.age,
          gender: args.gender,
          phoneNumber: args.phoneNumber,
          email: args.email,
          state: args.state,
          district: args.district,
        },
      },
    );

    return resumeId;
  },
});

export const getAllResumes = query({
  args: {},
  handler: async (ctx) => {
    // Make admin access open for demo: return all resumes without role restriction
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
    // For demo: allow any authenticated user to update statuses
    if (!user) {
      throw new Error("Authentication required");
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