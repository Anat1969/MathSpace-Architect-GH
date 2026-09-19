import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MODULES = [
  { id: 1, path: '/module/1', title: 'מעבדה 1: הפיזיקה הרגשית של המרחב' },
  { id: 2, path: '/module/2', title: 'מעבדה 2: פרקטלים שהפכו שכונות שלמות' },
  { id: 3, path: '/module/3', title: 'מעבדה 3: מתהלכים על גרף (נגזרות ואינטגרלים)' },
  { id: 4, path: '/module/4', title: 'מעבדה 4: בינה מלאכותית אדריכלית' },
  { id: 5, path: '/module/5', title: 'מעבדה 5: כשהטופולוגיה פוגשת את החיים האמיתיים' },
];

export default function GlobalHeader({ showBack = true }) {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">

        {/* Back Button */}
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="shrink-0"
            title="חזור למסך הקודם"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}

        {/* Logo → Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 border-2 border-accent rounded-lg flex items-center justify-center rotate-45 shrink-0">
            <span className="text-accent text-xs font-space font-bold -rotate-45">φ</span>
          </div>
          <div className="hidden sm:block text-right">
            <p className="font-heebo font-bold text-foreground text-sm leading-tight">מעבדת תכנון</p>
            <p className="text-muted-foreground text-[10px] font-space leading-tight">Virtual Architecture Lab</p>
          </div>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Admin / content management */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin')}
          className="shrink-0"
          title="ניהול תוכן (Admin)"
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 font-heebo text-xs">
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">כל הניסויים</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72" dir="rtl">
            {MODULES.map((mod) => (
              <DropdownMenuItem
                key={mod.id}
                onClick={() => navigate(mod.path)}
                className="font-heebo text-sm cursor-pointer gap-3"
              >
                <span className="text-xs font-space text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                  {String(mod.id).padStart(2, '0')}
                </span>
                {mod.title.replace(`מעבדה ${mod.id}: `, '')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}