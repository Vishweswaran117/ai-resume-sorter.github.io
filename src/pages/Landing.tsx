import { BackgroundGradient } from "@/components/BackgroundGradient";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { FileText, Users, Zap, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Smart Resume Upload",
      description: "Upload your resume and personal details with our intuitive form system"
    },
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze and score resumes for optimal matching"
    },
    {
      icon: Users,
      title: "Admin Dashboard",
      description: "Comprehensive admin panel to review, shortlist, and manage applications"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures"
    }
  ];

  const benefits = [
    "Automated resume screening and scoring",
    "Real-time application status tracking",
    "Comprehensive candidate profiles",
    "AI-powered shortlisting recommendations",
    "Secure document storage",
    "Mobile-responsive design"
  ];

  return (
    <div className="min-h-screen">
      <BackgroundGradient />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white">Resume Portal</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {!isLoading && (
              <GlassButton
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              >
                {isAuthenticated ? "Dashboard" : "Get Started"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </GlassButton>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Resume
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Filtering
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Revolutionize your hiring process with AI-powered resume analysis and intelligent candidate matching
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton
                size="lg"
                onClick={() => navigate(isAuthenticated ? "/upload" : "/auth")}
                className="text-lg px-8 py-4"
              >
                {isAuthenticated ? "Upload Resume" : "Start Application"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </GlassButton>
              
              <GlassButton
                size="lg"
                glassVariant="secondary"
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="text-lg px-8 py-4"
              >
                {isAuthenticated ? "View Dashboard" : "Learn More"}
              </GlassButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to streamline your recruitment process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GlassCard className="p-6 h-full" hover>
                  <feature.icon className="w-12 h-12 text-blue-300 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Transform your hiring process with cutting-edge technology and intelligent automation
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-white/70 mb-6">
                    Join thousands of companies already using our platform to find the best talent
                  </p>
                  <GlassButton
                    size="lg"
                    onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                    className="w-full"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-white">Resume Portal</span>
          </div>
          <p className="text-white/60">
            Powered by AI • Built with ❤️ • Secured by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}