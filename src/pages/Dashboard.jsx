import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Box, Building2, Calculator, Cpu, Camera, ArrowLeft } from 'lucide-react';
import GlobalHeader from '../components/GlobalHeader';

const modules = [
  {
    id: 1,
    path: '/module/1',
    icon: Box,
    title: 'הפיזיקה הרגשית של המרחב',
    subtitle: 'Room Geometry Simulator',
    description: 'חקור כיצד צורת החדר משפיעה על הרגשות והפרודוקטיביות של האדם',
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-500/30',
    iconBg: 'bg-blue-500/10 text-blue-600',
  },
  {
    id: 2,
    path: '/module/2',
    icon: Building2,
    title: 'בונה השכונות הפרקטלי',
    subtitle: 'Fractal City Builder',
    description: 'בנה שכונות באמצעות אלגוריתמים פרקטליים וגלה את ההשפעה על תחושת השייכות',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    id: 3,
    path: '/module/3',
    icon: Calculator,
    title: 'פיזיקה מתמטית ואינטגרלים',
    subtitle: 'Calculus Physics Engine',
    description: 'חשב את המסלול האופטימלי של גרם מדרגות באמצעות חדו"א',
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
    iconBg: 'bg-purple-500/10 text-purple-600',
  },
  {
    id: 4,
    path: '/module/4',
    icon: Cpu,
    title: 'מחולל AI אדריכלי',
    subtitle: 'AI Architecture Generator',
    description: 'צור מבנים אדריכליים באמצעות מודלים מתמטיים ובינה מלאכותית',
    color: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
    iconBg: 'bg-orange-500/10 text-orange-600',
  },
  {
    id: 5,
    path: '/module/5',
    icon: Camera,
    title: 'מציאות רבודה - טופולוגיה',
    subtitle: 'AR Camera Overlay',
    description: 'חווה רצועת מביוס ורשת פיבונאצ\'י בעולם האמיתי דרך המצלמה',
    color: 'from-rose-500/20 to-pink-500/20',
    borderColor: 'border-rose-500/30',
    iconBg: 'bg-rose-500/10 text-rose-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <GlobalHeader showBack={false} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-heebo font-bold text-foreground mb-2">בחר מודול ניסוי</h2>
          <p className="text-muted-foreground text-lg">5 מודולים אינטראקטיביים לחקר הקשר בין מתמטיקה לאדריכלות</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                variants={cardVariants}
                onClick={() => navigate(mod.path)}
                className={`group relative bg-card border ${mod.borderColor} rounded-2xl p-6 cursor-pointer 
                  hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${mod.iconBg} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-space text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      {String(mod.id).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-heebo font-bold text-foreground text-lg mb-1">{mod.title}</h3>
                  <p className="font-space text-xs text-muted-foreground mb-3">{mod.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-accent font-heebo text-sm font-medium group-hover:gap-3 transition-all">
                    <span>כניסה למודול</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}