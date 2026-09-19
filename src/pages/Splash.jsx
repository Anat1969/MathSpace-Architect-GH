import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const HERO_IMG = 'https://media.base44.com/images/public/69c77bd0ee0aec891938dd4a/7c6516b8c_generated_image.png';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-primary text-primary-foreground overflow-hidden relative flex items-center justify-center" dir="rtl">
      {/* Hero background */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="מגדל ספירלי מתמטי" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/80" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto animate-in fade-in duration-700">
        <div className="w-16 h-16 mx-auto mb-5 border-2 border-accent rounded-xl flex items-center justify-center rotate-45">
          <span className="text-accent text-2xl font-space font-bold -rotate-45">φ</span>
        </div>

        <p className="text-accent/80 font-space text-xs tracking-[0.3em] uppercase mb-3">Virtual Architecture Lab</p>

        <h1 className="text-4xl md:text-6xl font-heebo font-black text-primary-foreground mb-3 leading-tight">
          המעבדה לאדריכלות מתמטית
        </h1>

        <h2 className="text-lg md:text-2xl font-heebo font-light text-accent mb-5">
          כשהמספרים הופכים למרחבים חיים.
        </h2>

        <p className="text-primary-foreground/70 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
          מתמטיקה היא אדריכלות של הרעיונות, והאדריכלות היא מתמטיקה מגושמת. היכנסו למעבדה הווירטואלית וגלו כיצד נוסחאות הופכות לרגשות ומרחבים חיים.
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-heebo font-bold text-lg px-10 py-6 rounded-xl gap-3 group"
        >
          היכנסו למעבדה
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </Button>

        <div className="mt-8 flex items-center justify-center flex-wrap gap-4 text-primary-foreground/30 text-xs font-space">
          {['GEOMETRY', 'FRACTALS', 'CALCULUS', 'AI', 'AR'].map((t, i) => (
            <span key={t} className="flex items-center gap-4">
              <span>{t}</span>
              {i < 4 && <span className="w-1 h-1 rounded-full bg-accent/30" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
