import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const updateResumeAnalysis = internalMutation({
  args: {
    resumeId: v.id("resumes"),
    aiScore: v.number(),
    aiReason: v.string(),
    keySkills: v.array(v.string()),
    experience: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.resumeId, {
      aiScore: args.aiScore,
      aiReason: args.aiReason,
      keySkills: args.keySkills,
      experience: args.experience,
      analyzedAt: Date.now(),
    });
  },
});