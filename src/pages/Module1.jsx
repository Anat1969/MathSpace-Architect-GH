import { useState, useEffect } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import RoomViewer3D from '../components/RoomViewer3D';
import MetricCard from '../components/MetricCard';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Lightbulb, Brain, Target, Users, Frown, Leaf } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import usePersistedImages from '../hooks/usePersistedImages';
import { base44 } from '@/api/base44Client';

const GOLDEN_RATIO = 1.618;
const TOLERANCE = 0.03;

const SHAPE_TO_ID = {
  circle: 'shape_circle',
  square: 'shape_square',
  hexagon: 'shape_hexagon',
};

export default function Module1() {
  const [shape, setShape] = useState('square');
  const [ratioValue, setRatioValue] = useState([1]);
  const [geometries, setGeometries] = useState({});
  const { imageUrls, saveImage: save, deleteImage: del } = usePersistedImages('module1');

  const ratio = ratioValue[0];
  const isGolden = Math.abs(ratio - GOLDEN_RATIO) < TOLERANCE;

  const imageKey = isGolden ? 'golden' : shape;
  const imageUrl = imageUrls[imageKey] || '';
  const saveImage = (url) => save(imageKey, url);
  const deleteImage = () => del(imageKey);

  useEffect(() => {
    base44.entities.RoomGeometry.list().then(records => {
      const map = {};
      records.forEach(r => { map[r.Shape_ID] = r; });
      setGeometries(map);
    });
  }, []);

  const currentRecord = isGolden
    ? geometries['shape_golden']
    : geometries[SHAPE_TO_ID[shape]];

  const metrics = {
    creativity: currentRecord?.Creativity_Metric ?? 0,
    focus: currentRecord?.Focus_Metric ?? 0,
    community: currentRecord?.Community_Metric ?? 0,
    stress: currentRecord?.Stress_Metric ?? 0,
    calm: currentRecord?.Calmness_Metric ?? 0,
  };

  return (
    <ModuleLayout moduleNumber={1} title="הפיזיקה הרגשית של המרחב" subtitle="Room Geometry Simulator">
      <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 min-h-0">

        {/* ── Viewer + controls ── */}
        <div className="min-h-0 flex flex-col gap-2">
          <div className="flex-1 min-h-0 relative">
            <RoomViewer3D shape={shape} ratio={ratio} goldenActive={isGolden} />
            {isGolden && (
              <div className="absolute bottom-2 inset-x-2 flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-xl px-3 py-2 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Lightbulb className="w-4 h-4 text-accent shrink-0" />
                <p className="text-xs text-accent font-heebo font-medium">
                  יחס הזהב (1:1.618) מופעל — הפרופורציה המושלמת!
                </p>
              </div>
            )}
          </div>

          {/* Control panel (compact) */}
          <div className="bg-card border border-border/50 rounded-xl p-3 shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] text-muted-foreground mb-2 block">צורת החדר</Label>
              <RadioGroup value={shape} onValueChange={setShape} className="flex gap-2">
                {[
                  { value: 'circle', label: 'עגול', icon: '○' },
                  { value: 'square', label: 'מרובע', icon: '□' },
                  { value: 'hexagon', label: 'משושה', icon: '⬡' },
                ].map(item => (
                  <Label
                    key={item.value}
                    htmlFor={item.value}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border cursor-pointer transition-all
                      ${shape === item.value
                        ? 'border-accent bg-accent/5 text-foreground'
                        : 'border-border/50 hover:border-border text-muted-foreground'}`}
                  >
                    <RadioGroupItem value={item.value} id={item.value} className="sr-only" />
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-heebo">{item.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-[11px] text-muted-foreground mb-2 block">פרופורציות החדר</Label>
              <Slider value={ratioValue} onValueChange={setRatioValue} min={1} max={2} step={0.01} className="w-full" />
              <div className="flex items-center justify-between text-[11px] font-space text-muted-foreground mt-2">
                <span>1:1</span>
                <span className={`px-2 py-0.5 rounded-full transition-colors ${isGolden ? 'bg-accent text-accent-foreground font-bold' : ''}`}>
                  1:{ratio.toFixed(3)}
                </span>
                <span>1:2</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right rail: metrics + square image ── */}
        <div className="min-h-0 flex flex-col gap-3">
          <div>
            <h3 className="text-xs font-heebo font-semibold text-muted-foreground mb-2">מדדים פסיכולוגיים</h3>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard compact label="יצירתיות" value={metrics.creativity} icon={Brain} active={shape === 'circle'} />
              <MetricCard compact label="פוקוס" value={metrics.focus} icon={Target} active={shape === 'square'} />
              <MetricCard compact label="קהילתיות" value={metrics.community} icon={Users} active={shape === 'hexagon'} />
              <MetricCard compact label="לחץ" value={metrics.stress} icon={Frown} positive={false} active={isGolden} />
              <MetricCard compact label="רוגע" value={metrics.calm} icon={Leaf} active={isGolden} />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-heebo font-semibold text-muted-foreground mb-2">תמונת דוגמה</h3>
            <ImageUploader
              square
              imageUrl={imageUrl}
              onSave={saveImage}
              onDelete={deleteImage}
              label="הוסף תמונה"
              suggestion={{
                title: 'רעיון + פרומפט לתמונה',
                prompt: 'חדר מגורים מינימליסטי בצורה גיאומטרית מובהקת (עגול/מרובע/משושה), תאורה טבעית רכה, פרספקטיבה רחבה, רינדור אדריכלי פוטוריאליסטי',
              }}
            />
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}