import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const HERO_IMG = 'https://media.base44.com/images/public/69c77bd0ee0aec891938dd4a/7c6516b8c_generated_image.png';
const QUOTE_IMG = 'https://media.base44.com/images/public/69c77bd0ee0aec891938dd4a/77a9c32cd_generated_image.png';

const MODULES = [
  {
    num: '01',
    title: 'הפיזיקה הרגשית של המרחב',
    text: 'גלו את הכוח הפסיכולוגי של הגיאומטריה. שחקו עם מידות החדר וגלו כיצד חדרים עגולים מגבירים יצירתיות ב-23%, ואיך כוונון החדר ל"יחס הזהב" יפחית את רמות הלחץ שלכם ב-15%.',
    btn: 'הפעל סימולטור',
    path: '/module/1',
    color: 'from-violet-500/15 to-violet-500/5',
    border: 'border-violet-500/20',
    accent: 'text-violet-400',
    img: null,
  },
  {
    num: '03',
    title: 'מתמטיקה בתנועה — נגזרות ואינטגרלים',
    text: 'הפכו מתהלכים לנקודות על גרף. הזווית שבה אתם פונים היא הנגזרת הראשונה, והתאוצה היא הנגזרת השנייה. השתמשו בנגזרות לתכנן מדרגות שמפחיתות עייפות ב-34%, ונסו את האינטואיציה שלכם בפתרון אינטגרלים לייצוב קתדרלות גותיות.',
    btn: 'פתח מנוע פיזיקלי',
    path: '/module/3',
    color: 'from-amber-500/15 to-amber-500/5',
    border: 'border-amber-500/20',
    accent: 'text-amber-400',
    img: 'https://media.base44.com/images/public/69c77bd0ee0aec891938dd4a/b80b02fe7_generated_image.png',
  },
  {
    num: '05',
    title: 'חזון המציאות הרבודה (AR) והטופולוגיה',
    text: 'המציאות היא מתמטיקה. הדליקו את המצלמה שלכם והקרינו את "רצועת מביוס" ואת "סדרת פיבונאצ\'י" ישירות על המרחב שלכם.',
    btn: 'הפעל מציאות רבודה',
    path: '/module/5',
    color: 'from-rose-500/15 to-rose-500/5',
    border: 'border-rose-500/20',
    accent: 'text-rose-400',
    img: 'https://media.base44.com/images/public/69c77bd0ee0aec891938dd4a/6f73f37f5_generated_image.png',
  },
  {
    num: '04',
    title: 'מנוע ה-AI האדריכלי',
    text: 'אלגוריתמים של בינה מלאכותית לומדים לתרגם מושגים מתמטיים מורכבים ישירות למרחבים פיזיים. הזינו מודלים כגון "תורת המשחקים" או "חוקי האנטרופיה", וראו כיצד מנוע ה-AI מתרגם אותם למבנים שמשפרים ביצועים אנושיים.',
    btn: 'הפעל מנוע בינה מלאכותית',
    path: '/module/4',
    color: 'from-blue-500/15 to-blue-500/5',
    border: 'border-blue-500/20',
    accent: 'text-blue-400',
    img: 'https://media.base44.com/images/public/69c77bd0ee0aec891938dd4a/ce1518b1c_generated_image.png',
  },
];

const TESTIMONIALS = [
  {
    quote: '"אני לא מתמטיקאית, אבל יש משהו בבית הזה שגורם לי להרגיש... נכון. כמו שהכל במקום שלו, גם אם אני לא מבינה למה."',
    author: 'לי סטפנה, דיירת בדירת פיבונאצ\'י, מילאנו',
  },
  {
    quote: '"זה כמו לגור בשיר שלא נגמר."',
    author: 'דייר בפרויקט \'רצועת מביוס\' של האדריכל תומס הרצוג, ברלין',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Splash() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-primary text-primary-foreground" dir="rtl">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="מגדל ספירלי מתמטי"
            className="w-full h-full object-cover object-center"
          />
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

        {mounted && (
          <motion.div
            className="relative z-10 text-center px-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-8 border-2 border-accent rounded-xl flex items-center justify-center rotate-45"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-accent text-2xl font-space font-bold -rotate-45">φ</span>
            </motion.div>

            <motion.p className="text-accent/80 font-space text-xs tracking-[0.3em] uppercase mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              Virtual Architecture Lab
            </motion.p>

            <motion.h1 className="text-4xl md:text-6xl font-heebo font-black text-primary-foreground mb-4 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
              המעבדה לאדריכלות מתמטית
            </motion.h1>

            <motion.h2 className="text-xl md:text-2xl font-heebo font-light text-accent mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
              כשהמספרים הופכים למרחבים חיים.
            </motion.h2>

            <motion.p className="text-primary-foreground/70 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
              בעולם שבו אנשים חושבים שמתמטיקה זה משהו מופשט ואדריכלות זה משהו קונקרטי, יש סוד קטן ומסוכן: השניים הם בעצם אותו דבר בדיוק. המתמטיקה היא אדריכלות של הרעיונות, והאדריכלות היא מתמטיקה מגושמת. היכנסו למעבדה הווירטואלית שלנו וגלו כיצד נוסחאות הופכות לרגשות.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button
                onClick={() => navigate('/dashboard')}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-heebo font-bold text-lg px-10 py-6 rounded-xl gap-3 group"
              >
                היכנסו למעבדה
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </motion.div>

            <motion.div className="mt-16 flex items-center justify-center flex-wrap gap-4 text-primary-foreground/30 text-xs font-space" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              {['GEOMETRY', 'FRACTALS', 'CALCULUS', 'AI', 'AR'].map((t, i) => (
                <span key={t} className="flex items-center gap-4">
                  <span>{t}</span>
                  {i < 4 && <span className="w-1 h-1 rounded-full bg-accent/30" />}
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ===== QUOTE SECTION ===== */}
      <section className="py-20 px-6 border-y border-primary-foreground/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp()} className="space-y-6">
            <blockquote className="text-xl md:text-2xl font-heebo italic text-accent leading-relaxed border-r-4 border-accent pr-5">
              "אין דבר כזה קו ישר באדריכלות — יש רק עקמומיות שמתחזה לפשטות."
              <footer className="text-sm text-primary-foreground/50 font-normal not-italic mt-2">— זאהה חדיד</footer>
            </blockquote>
            <p className="text-primary-foreground/60 text-base leading-relaxed">
              המתמטיקה אינה רק משהו שלומדים בבית ספר ושוכחים. היא שפת האם של העיצוב, הקוד הבסיסי של היופי, והמפתח ליצירת מרחבים שבאמת משרתים בני אדם. באפליקציה זו, אתם מפסיקים להיות צופים והופכים לאדריכלים מתמטיים.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={QUOTE_IMG} alt="חלל אורגני זהוב" className="w-full h-64 md:h-80 object-cover" />
          </motion.div>
        </div>
      </section>

      {/* ===== MODULES GRID ===== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 {...fadeUp()} className="text-3xl font-heebo font-bold text-center text-primary-foreground mb-12">
          רשת הניסויים
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.num}
              {...fadeUp(i * 0.08)}
              className={`bg-gradient-to-br ${mod.color} border ${mod.border} rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-300`}
            >
              {mod.img && (
                <div className="h-44 overflow-hidden">
                  <img src={mod.img} alt={mod.title} className="w-full h-full object-cover object-center opacity-80" />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className={`font-space font-bold text-xs ${mod.accent} opacity-60`}>{mod.num}</span>
                  <h3 className="font-heebo font-bold text-primary-foreground text-base">{mod.title}</h3>
                </div>
                <p className="text-primary-foreground/55 text-sm leading-relaxed flex-1">{mod.text}</p>
                <Button
                  onClick={() => navigate(mod.path)}
                  size="sm"
                  variant="outline"
                  className={`border ${mod.border} ${mod.accent} bg-transparent hover:bg-primary-foreground/5 font-heebo text-xs self-start gap-2`}
                >
                  {mod.btn}
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-primary/70 border-t border-primary-foreground/10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h3 {...fadeUp()} className="text-2xl font-heebo font-bold text-center text-primary-foreground mb-12">
            הקול האנושי בתוך הנוסחה
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.12)} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6 space-y-4">
                <div className="text-accent text-5xl font-serif leading-none">"</div>
                <p className="text-primary-foreground/80 font-heebo text-base italic leading-relaxed">{t.quote}</p>
                <p className="text-primary-foreground/40 font-space text-xs border-t border-primary-foreground/10 pt-3">{t.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="py-24 px-6 text-center bg-primary border-t border-primary-foreground/10">
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.h2 {...fadeUp()} className="text-3xl md:text-4xl font-heebo font-black text-primary-foreground">
            הפכו למתרגמים של המציאות.
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-primary-foreground/55 text-base leading-relaxed">
            האדריכלים של העתיד לא יהיו רק מעצבים — הם יהיו מתרגמים בין עולם המושגים המתמטיים לעולם החוויות האנושיות. הם יקחו את היופי הפנימי של משוואה ויהפכו אותו למרחב שבו אפשר לחיות, לאהוב, לגדל ילדים ולחלום.
          </motion.p>
          <motion.div {...fadeUp(0.2)}>
            <Button
              onClick={() => navigate('/module/1')}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-heebo font-bold text-lg px-12 py-6 rounded-xl gap-3 group"
            >
              התחילו את הניסוי הראשון עכשיו
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}