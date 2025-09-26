"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const analyzeResume = action({
  args: {
    resumeId: v.id("resumes"),
    resumeText: v.string(),
    candidateInfo: v.object({
      name: v.string(),
      age: v.number(),
      gender: v.string(),
      phoneNumber: v.string(),
      email: v.string(),
      state: v.string(),
      district: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Simulate AI analysis - in production, you'd integrate with OpenAI or similar
    const analysis = await simulateAIAnalysis(args.resumeText, args.candidateInfo);
    
    // Update the resume with AI analysis
    await ctx.runMutation(internal.internal.resumes.updateResumeAnalysis, {
      resumeId: args.resumeId,
      aiScore: analysis.score,
      aiReason: analysis.reason,
      keySkills: analysis.keySkills,
      experience: analysis.experience,
    });

    return analysis;
  },
});

async function simulateAIAnalysis(resumeText: string, candidateInfo: any) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const skills = extractSkills(resumeText);
  const experience = extractExperience(resumeText);
  const education = extractEducation(resumeText);

  let score = 0;
  let reasons = [];

  // Scoring logic
  if (skills.length >= 5) {
    score += 30;
    reasons.push(`Strong skill set with ${skills.length} relevant skills`);
  }

  if (experience >= 2) {
    score += 25;
    reasons.push(`${experience} years of relevant experience`);
  }

  if (education.includes('bachelor') || education.includes('master')) {
    score += 20;
    reasons.push('Strong educational background');
  }

  if (candidateInfo.age >= 22 && candidateInfo.age <= 35) {
    score += 15;
    reasons.push('Optimal age range for the position');
  }

  if (resumeText.toLowerCase().includes('project') || resumeText.toLowerCase().includes('achievement')) {
    score += 10;
    reasons.push('Demonstrates project experience and achievements');
  }

  const status = score >= 60 ? 'shortlisted' : score >= 40 ? 'pending' : 'rejected';

  return {
    score,
    reason: reasons.join('. '),
    keySkills: skills,
    experience,
    status,
  };
}

function extractSkills(text: string): string[] {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
    'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'machine learning', 'data analysis'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperience(text: string): number {
  const experienceMatch = text.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
  return experienceMatch ? parseInt(experienceMatch[1]) : 0;
}

function extractEducation(text: string): string {
  return text.toLowerCase();
}
