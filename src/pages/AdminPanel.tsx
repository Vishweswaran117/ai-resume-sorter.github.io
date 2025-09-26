import { BackgroundGradient } from "@/components/BackgroundGradient";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Eye, CheckCircle, XCircle, Clock, Users, TrendingUp, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const resumes = useQuery(api.resumes.getAllResumes);
  const updateStatus = useMutation(api.resumes.updateResumeStatus);
  const runAnalysis = useAction(api.ai.analyzeResume);
  
  const [selectedResume, setSelectedResume] = useState<any>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundGradient />
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const handleStatusUpdate = async (resumeId: string, status: "shortlisted" | "rejected") => {
    try {
      await updateStatus({
        resumeId: resumeId as any,
        status,
        aiReason: `Manually ${status} by admin`,
      });
      toast.success(`Resume ${status} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRunAnalysis = async (resume: any) => {
    try {
      await runAnalysis({
        resumeId: resume._id,
        resumeText: `Candidate ${resume.name} applying for ${resume.roleApplied}. Highlights: projects, leadership, PM skills.`,
        candidateInfo: {
          name: resume.name,
          age: resume.age,
          gender: resume.gender,
          phoneNumber: resume.phoneNumber,
          email: resume.email,
          state: resume.state,
          district: resume.district,
        },
      });
      toast.success("AI analysis started. Results will appear shortly.");
    } catch (err) {
      toast.error("Failed to run AI analysis");
    }
  };

  const stats = resumes ? {
    total: resumes.length,
    pending: resumes.filter(r => r.status === "pending").length,
    shortlisted: resumes.filter(r => r.status === "shortlisted").length,
    rejected: resumes.filter(r => r.status === "rejected").length,
  } : { total: 0, pending: 0, shortlisted: 0, rejected: 0 };

  return (
    <div className="min-h-screen">
      <BackgroundGradient />
      
      {/* Header - Styled Admin Navigation */}
      <header className="relative z-20 sticky top-0">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl px-4 py-3 shadow-lg">
            {/* Left: Back + Brand */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Emblem of India"
                className="w-8 h-8"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-semibold">Admin Panel</span>
                <span className="text-white/60 text-xs">PM Internship Portal</span>
              </div>
            </div>

            {/* Right: Accent pill */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-white/70">Secure Access</span>
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
          {/* Tricolor underline */}
          <div className="mt-1 h-1 w-full rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600 opacity-70" />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-blue-300" />
                <div>
                  <p className="text-white/70 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="w-10 h-10 text-yellow-300" />
                <div>
                  <p className="text-white/70 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-10 h-10 text-green-300" />
                <div>
                  <p className="text-white/70 text-sm">Shortlisted</p>
                  <p className="text-2xl font-bold text-white">{stats.shortlisted}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <XCircle className="w-10 h-10 text-red-300" />
                <div>
                  <p className="text-white/70 text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Applications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">All Applications</h2>
              
              {!resumes || resumes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">No applications submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <motion.div
                      key={resume._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">{resume.name}</h3>
                            <Badge
                              variant={
                                resume.status === "shortlisted"
                                  ? "default"
                                  : resume.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                resume.status === "shortlisted"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : resume.status === "rejected"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              }
                            >
                              {resume.status}
                            </Badge>
                            {resume.aiScore && (
                              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                AI Score: {resume.aiScore}%
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70 mb-3">
                            <div>
                              <span className="font-medium">Age:</span> {resume.age}
                            </div>
                            <div>
                              <span className="font-medium">Gender:</span> {resume.gender}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {resume.district}, {resume.state}
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(resume.submittedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <span className="font-medium">Email:</span> {resume.email}
                            <span className="font-medium">Phone:</span> {resume.phoneNumber}
                          </div>

                          {resume.aiReason && (
                            <div className="mt-3 p-3 bg-white/5 rounded-lg">
                              <p className="text-white/80 text-sm">
                                <span className="font-medium">AI Analysis:</span> {resume.aiReason}
                              </p>
                              {resume.keySkills && resume.keySkills.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-white/70 text-sm font-medium">Key Skills: </span>
                                  {resume.keySkills.map((skill, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="mr-1 mb-1 bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setSelectedResume(resume)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          
                          <GlassButton
                            size="sm"
                            onClick={() => handleRunAnalysis(resume)}
                            className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Run AI Analysis
                          </GlassButton>
                          
                          {resume.status === "pending" && (
                            <>
                              <GlassButton
                                size="sm"
                                onClick={() => handleStatusUpdate(resume._id, "shortlisted")}
                                className="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Shortlist
                              </GlassButton>
                              <GlassButton
                                size="sm"
                                onClick={() => handleStatusUpdate(resume._id, "rejected")}
                                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </GlassButton>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Resume Detail Modal */}
      {selectedResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <GlassCard className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">Application Details</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedResume(null)}
                  className="text-white hover:bg-white/10"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 text-sm">Name</p>
                    <p className="text-white font-medium">{selectedResume.name}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Age</p>
                    <p className="text-white font-medium">{selectedResume.age}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Gender</p>
                    <p className="text-white font-medium">{selectedResume.gender}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Phone</p>
                    <p className="text-white font-medium">{selectedResume.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Email</p>
                    <p className="text-white font-medium">{selectedResume.email}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Location</p>
                    <p className="text-white font-medium">{selectedResume.district}, {selectedResume.state}</p>
                  </div>
                </div>

                {selectedResume.aiReason && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-white/70 text-sm mb-2">AI Analysis</p>
                    <p className="text-white">{selectedResume.aiReason}</p>
                    {selectedResume.aiScore && (
                      <p className="text-white/70 text-sm mt-2">Score: {selectedResume.aiScore}%</p>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <GlassButton
                    onClick={() => {
                      // In a real app, this would download the resume file
                      toast.info("Resume download would be implemented here");
                    }}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}