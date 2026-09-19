import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export default function MetricCard({ label, value, suffix = '%', icon: Icon, positive = true, active = false }) {
  return (
    <motion.div
      layout
      className={cn(
        "bg-card border rounded-xl p-4 transition-all duration-500",
        active ? "border-accent/50 shadow-md shadow-accent/10" : "border-border/50"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground font-heebo">{label}</span>
      </div>
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-baseline gap-1"
      >
        <span className={cn(
          "text-2xl font-space font-bold",
          active ? (positive ? "text-emerald-500" : "text-rose-500") : "text-muted-foreground/50"
        )}>
          {active ? (positive ? '+' : '') : ''}{value}
        </span>
        <span className="text-sm text-muted-foreground font-space">{suffix}</span>
      </motion.div>
    </motion.div>
  );
}