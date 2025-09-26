import { BackgroundGradient } from "@/components/BackgroundGradient";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { FileText, LogOut, Settings, Upload, Users } from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const userResumes = useQuery(api.resumes.getUserResumes);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundGradient />
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen">
      <BackgroundGradient />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white">Resume Portal</h1>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <span className="text-white/80">Welcome, {user.name || user.email}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Upload Resume Card */}
            <GlassCard className="p-6" hover>
              <div className="flex flex-col items-center text-center">
                <Upload className="w-12 h-12 text-blue-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload Resume</h3>
                <p className="text-white/70 mb-4">Submit your resume for review</p>
                <GlassButton
                  onClick={() => navigate("/upload")}
                  className="w-full"
                >
                  Get Started
                </GlassButton>
              </div>
            </GlassCard>

            {/* My Applications Card */}
            <GlassCard className="p-6" hover>
              <div className="flex flex-col items-center text-center">
                <FileText className="w-12 h-12 text-green-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">My Applications</h3>
                <p className="text-white/70 mb-4">
                  {userResumes?.length || 0} applications submitted
                </p>
                <GlassButton
                  onClick={() => navigate("/applications")}
                  glassVariant="secondary"
                  className="w-full"
                >
                  View Status
                </GlassButton>
              </div>
            </GlassCard>

            {/* Admin Panel Card */}
            {isAdmin && (
              <GlassCard className="p-6" hover>
                <div className="flex flex-col items-center text-center">
                  <Users className="w-12 h-12 text-purple-300 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Admin Panel</h3>
                  <p className="text-white/70 mb-4">Review and manage applications</p>
                  <GlassButton
                    onClick={() => navigate("/admin")}
                    glassVariant="primary"
                    className="w-full"
                  >
                    Manage
                  </GlassButton>
                </div>
              </GlassCard>
            )}
          </motion.div>

          {/* Recent Applications */}
          {userResumes && userResumes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Applications</h2>
                <div className="space-y-4">
                  {userResumes.slice(0, 3).map((resume) => (
                    <div
                      key={resume._id}
                      className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div>
                        <h3 className="text-white font-medium">{resume.name}</h3>
                        <p className="text-white/70 text-sm">
                          Submitted {new Date(resume.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            resume.status === "shortlisted"
                              ? "bg-green-500/20 text-green-300"
                              : resume.status === "rejected"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {resume.status}
                        </span>
                        {resume.aiScore && (
                          <span className="text-white/70 text-sm">
                            Score: {resume.aiScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}