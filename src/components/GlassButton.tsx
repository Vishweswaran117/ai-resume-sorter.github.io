import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

interface GlassButtonProps extends React.ComponentProps<typeof Button> {
  variant?: "primary" | "secondary" | "ghost";
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/30 text-white hover:from-blue-500/30 hover:to-purple-500/30",
      secondary: "bg-white/10 border-white/20 text-white hover:bg-white/20",
      ghost: "bg-transparent border-transparent text-white hover:bg-white/10"
    };

    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          ref={ref}
          className={cn(
            "backdrop-blur-xl border rounded-xl shadow-lg",
            "transition-all duration-200",
            variants[variant],
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

GlassButton.displayName = "GlassButton";
