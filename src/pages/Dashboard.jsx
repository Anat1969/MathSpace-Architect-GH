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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden" dir="rtl">
      <GlobalHeader showBack={false} />

      {/* Main Content */}
      <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 md:px-6 py-4 flex flex-col">
        <div className="mb-4 shrink-0">
          <h2 className="text-2xl md:text-3xl font-heebo font-bold text-foreground">בחר מודול ניסוי</h2>
          <p className="text-muted-foreground text-sm">5 מודולים אינטראקטיביים לחקר הקשר בין מתמטיקה לאדריכלות</p>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 content-start">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => navigate(mod.path)}
                className={`group relative bg-card border ${mod.borderColor} rounded-2xl p-4 cursor-pointer flex flex-col
                  hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${mod.iconBg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-space text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {String(mod.id).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-heebo font-bold text-foreground text-base leading-tight mb-0.5">{mod.title}</h3>
                  <p className="font-space text-[11px] text-muted-foreground mb-2">{mod.subtitle}</p>
                  <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2">{mod.description}</p>
                  <div className="mt-auto pt-3 flex items-center gap-2 text-accent font-heebo text-sm font-medium group-hover:gap-3 transition-all">
                    <span>כניסה למודול</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}