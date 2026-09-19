import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Info, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

// Slots where buttresses should be placed (as % positions on the cathedral SVG)
const BUTTRESS_SLOTS = [
  { id: 'left1', x: 18, y: 62, label: 'שמאל קדמי' },
  { id: 'left2', x: 32, y: 72, label: 'שמאל אמצעי' },
  { id: 'right1', x: 68, y: 62, label: 'ימין קדמי' },
  { id: 'right2', x: 82, y: 72, label: 'ימין אמצעי' },
];

export default function CathedralChallenge({ onSuccess }) {
  const [placed, setPlaced] = useState([]);
  const [stability, setStability] = useState(0);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSlot = (id) => {
    if (solved) return;
    setPlaced(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleCalculate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const allPlaced = BUTTRESS_SLOTS.every(s => placed.includes(s.id));
    const records = await base44.entities.CalculusPhysicsModel.list();
    const record = records.find(r => r.Challenge_ID === 'challenge_cathedral');

    if (allPlaced && record) {
      setStability(record.Stability_Metric);
      setSolved(true);
      onSuccess?.(record);
    } else {
      // partial score
      const score = Math.round((placed.length / BUTTRESS_SLOTS.length) * 70);
      setStability(score);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Cathedral SVG Canvas */}
      <div className="relative w-full bg-slate-900 rounded-2xl border border-border/30 overflow-hidden" style={{ height: 280 }}>
        {/* Simple cathedral outline */}
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Sky */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={solved ? "#1a3a5c" : "#1a1a2e"} />
              <stop offset="100%" stopColor={solved ? "#2d5a8e" : "#16213e"} />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#skyGrad)" />

          {/* Main cathedral body */}
          <rect x="38" y="45" width="24" height="40" fill={solved ? "#c8a96e" : "#555577"} />
          {/* Central tower */}
          <rect x="44" y="25" width="12" height="22" fill={solved ? "#d4af7a" : "#666688"} />
          {/* Spire */}
          <polygon points="50,10 44,25 56,25" fill={solved ? "#e8c47a" : "#7777aa"} />
          {/* Side towers */}
          <rect x="35" y="35" width="8" height="30" fill={solved ? "#c0a060" : "#4a4a66"} />
          <rect x="57" y="35" width="8" height="30" fill={solved ? "#c0a060" : "#4a4a66"} />
          {/* Door arch */}
          <path d="M46,85 Q50,78 54,85" stroke={solved ? "#f0d090" : "#8888aa"} strokeWidth="1" fill="none" />
          <rect x="46" y="78" width="8" height="7" fill={solved ? "#8b5e3c" : "#333355"} />

          {/* Flying buttresses - placed ones */}
          {BUTTRESS_SLOTS.map(slot => {
            const isPlaced = placed.includes(slot.id);
            const isRight = slot.x > 50;
            const anchorX = isRight ? 65 : 35;
            return isPlaced ? (
              <g key={slot.id}>
                <line
                  x1={slot.x} y1={slot.y}
                  x2={anchorX} y2={52}
                  stroke={solved ? "#f0c040" : "#6688cc"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx={slot.x} cy={slot.y} r="2" fill={solved ? "#f0c040" : "#6688cc"} />
              </g>
            ) : null;
          })}
        </svg>

        {/* Clickable slot buttons */}
        {BUTTRESS_SLOTS.map(slot => (
          <button
            key={slot.id}
            onClick={() => toggleSlot(slot.id)}
            className="absolute rounded-full border-2 transition-all duration-300"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 28,
              height: 28,
              backgroundColor: placed.includes(slot.id)
                ? (solved ? 'rgba(240,192,64,0.8)' : 'rgba(102,136,204,0.8)')
                : 'rgba(255,255,255,0.1)',
              borderColor: placed.includes(slot.id)
                ? (solved ? '#f0c040' : '#6688cc')
                : 'rgba(255,255,255,0.3)',
            }}
            title={slot.label}
          />
        ))}

        <div className="absolute top-3 right-3 text-xs text-white/50 font-space">
          {placed.length}/{BUTTRESS_SLOTS.length} קשתות הוצבו
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        לחץ על נקודות ● לאורך הקתדרלה כדי להציב קשתות תמך גותיות
      </p>

      {/* Stability meter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-heebo text-muted-foreground">יציבות מבנית</span>
          <motion.span
            key={stability}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-space font-bold ${stability >= 100 ? 'text-emerald-500' : stability > 0 ? 'text-yellow-500' : 'text-muted-foreground/40'}`}
          >
            {stability}%
          </motion.span>
        </div>
        <Progress value={stability} className="h-3" />
      </div>

      <Button
        onClick={handleCalculate}
        disabled={placed.length === 0 || loading || solved}
        className="w-full font-heebo font-semibold"
      >
        {loading ? 'מחשב אינטגרל עומסים...' : 'חשב אינטגרל עומסים'}
      </Button>

      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-600 font-heebo leading-relaxed">
              הצלחה! האדריכלים הגותיים של המאה ה-12 פתרו את האינטגרלים הללו באופן אינטואיטיבי עוד לפני שנוסחו רשמית.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}