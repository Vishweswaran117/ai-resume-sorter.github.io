import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    resumes: defineTable({
      userId: v.id("users"),
      name: v.string(),
      age: v.number(),
      gender: v.string(),
      phoneNumber: v.string(),
      email: v.string(),
      state: v.string(),
      district: v.string(),
      resumeFileId: v.id("_storage"),
      status: v.union(v.literal("pending"), v.literal("shortlisted"), v.literal("rejected")),
      submittedAt: v.number(),
      reviewedAt: v.optional(v.number()),
      reviewedBy: v.optional(v.id("users")),
      aiScore: v.optional(v.number()),
      aiReason: v.optional(v.string()),
      keySkills: v.optional(v.array(v.string())),
      experience: v.optional(v.number()),
      analyzedAt: v.optional(v.number()),
      roleApplied: v.string(),
    })
      .index("by_user_id", ["userId"])
      .index("by_status", ["status"])
      .index("by_submitted_at", ["submittedAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;