import { BackgroundGradient } from "@/components/BackgroundGradient";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function Applications() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const userResumes = useQuery(api.resumes.getUserResumes);

  if (authLoading) {
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

  return (
    <div className="min-h-screen">
      <BackgroundGradient />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
        </div>
      </header>

      {/* Applications List */}
      <main className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6">
              {!userResumes || userResumes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">No Applications Yet</h2>
                  <p className="text-white/70 mb-6">You haven't submitted any applications yet.</p>
                  <Button
                    onClick={() => navigate("/upload")}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Submit Your First Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Your Applications</h2>
                  
                  {userResumes.map((resume) => (
                    <motion.div
                      key={resume._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{resume.name}</h3>
                          <div className="flex items-center gap-4 text-white/70 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Submitted: {new Date(resume.submittedAt).toLocaleDateString()}
                            </div>
                            {resume.reviewedAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Reviewed: {new Date(resume.reviewedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
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
                            {resume.status === "shortlisted" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {resume.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                            {resume.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                            {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                          </Badge>
                          
                          {resume.aiScore && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              Score: {resume.aiScore}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70 mb-4">
                        <div>
                          <span className="font-medium">Age:</span> {resume.age}
                        </div>
                        <div>
                          <span className="font-medium">Gender:</span> {resume.gender}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {resume.phoneNumber}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {resume.district}, {resume.state}
                        </div>
                      </div>

                      {resume.aiReason && (
                        <div className="p-4 bg-white/5 rounded-lg">
                          <h4 className="text-white font-medium mb-2">AI Analysis</h4>
                          <p className="text-white/80 text-sm mb-3">{resume.aiReason}</p>
                          
                          {resume.keySkills && resume.keySkills.length > 0 && (
                            <div>
                              <span className="text-white/70 text-sm font-medium">Identified Skills: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resume.keySkills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {resume.experience !== undefined && (
                            <p className="text-white/70 text-sm mt-2">
                              <span className="font-medium">Experience:</span> {resume.experience} years
                            </p>
                          )}
                        </div>
                      )}

                      {resume.status === "pending" && (
                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-yellow-300 text-sm">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Your application is currently under review. You'll be notified once it's processed.
                          </p>
                        </div>
                      )}

                      {resume.status === "shortlisted" && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-green-300 text-sm">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Congratulations! Your application has been shortlisted. We'll contact you soon.
                          </p>
                        </div>
                      )}

                      {resume.status === "rejected" && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-red-300 text-sm">
                            <XCircle className="w-4 h-4 inline mr-1" />
                            Unfortunately, your application wasn't selected this time. Keep improving and try again!
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
