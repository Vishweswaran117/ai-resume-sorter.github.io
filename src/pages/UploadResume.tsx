import { BackgroundGradient } from "@/components/BackgroundGradient";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function UploadResume() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const submitResume = useMutation(api.resumes.submitResume);
  const getUploadUrl = useAction(api.upload.getUploadUrl);
  
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phoneNumber: "",
    email: user?.email || "",
    state: "",
    district: "",
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("document")) {
        setResumeFile(file);
      } else {
        toast.error("Please upload a PDF or Word document");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setIsLoading(true);

    try {
      // Use Convex action to get a signed upload URL (no env dependency)
      const signedUrl = await getUploadUrl();

      // Upload the file to Convex storage and get storageId
      const uploadResp = await fetch(signedUrl, {
        method: "POST",
        body: resumeFile,
      });
      const { storageId } = await uploadResp.json();

      // Submit the resume data
      await submitResume({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        state: formData.state,
        district: formData.district,
        resumeFileId: storageId,
      });

      toast.success("Resume submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting resume:", error);
      toast.error("Failed to submit resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Upload Resume</h1>
        </div>
      </header>

      {/* Form */}
      <main className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="age" className="text-white">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="65"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Enter your age"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender" className="text-white">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        required
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-white">State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => setFormData({ ...formData, state: value })}
                        required
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="district" className="text-white">District *</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Enter your district"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Resume Upload</h2>
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="cursor-pointer flex flex-col items-center gap-4"
                    >
                      {resumeFile ? (
                        <>
                          <FileText className="w-12 h-12 text-green-300" />
                          <div>
                            <p className="text-white font-medium">{resumeFile.name}</p>
                            <p className="text-white/70 text-sm">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-white/50" />
                          <div>
                            <p className="text-white font-medium">Click to upload your resume</p>
                            <p className="text-white/70 text-sm">PDF, DOC, or DOCX (Max 10MB)</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/dashboard")}
                    className="text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <GlassButton
                    type="submit"
                    disabled={isLoading}
                    className="min-w-32"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </GlassButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}