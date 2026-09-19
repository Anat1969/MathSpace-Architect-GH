import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const TOTAL = 5;

export default function ModuleFooter({ currentModule }) {
  const navigate = useNavigate();
  const prev = currentModule > 1 ? currentModule - 1 : null;
  const next = currentModule < TOTAL ? currentModule + 1 : null;

  return (
    <footer className="border-t border-border/50 bg-card/50 mt-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">

        {/* Prev */}
        {prev ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/module/${prev}`)}
            className="gap-2 font-heebo text-xs"
          >
            <ChevronRight className="w-4 h-4" />
            ניסוי {prev}
          </Button>
        ) : <div />}

        {/* Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => navigate(`/module/${n}`)}
              title={`מעבדה ${n}`}
              className={`rounded-full transition-all duration-300 ${
                n === currentModule
                  ? 'w-5 h-2.5 bg-accent'
                  : 'w-2.5 h-2.5 bg-border hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>

        {/* Next */}
        {next ? (
          <Button
            size="sm"
            onClick={() => navigate(`/module/${next}`)}
            className="gap-2 font-heebo text-xs bg-accent text-accent-foreground hover:bg-accent/90"
          >
            המשך לניסוי הבא
            <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2 font-heebo text-xs"
          >
            חזור לדשבורד
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>
    </footer>
  );
}