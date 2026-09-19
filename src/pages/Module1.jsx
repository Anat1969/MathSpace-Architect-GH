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
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-2">
          <RoomViewer3D shape={shape} ratio={ratio} goldenActive={isGolden} />
          <AnimatePresence>
            {isGolden && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3"
              >
                <Lightbulb className="w-5 h-5 text-accent shrink-0" />
                <p className="text-sm text-accent font-heebo font-medium">
                  יחס הזהב (1:1.618) מופעל — הפרופורציה המושלמת!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metrics Sidebar */}
        <div className="space-y-3">
          <h3 className="text-sm font-heebo font-semibold text-muted-foreground mb-3">מדדים פסיכולוגיים</h3>
          <MetricCard label="יצירתיות" value={metrics.creativity} icon={Brain} active={shape === 'circle'} />
          <MetricCard label="פוקוס" value={metrics.focus} icon={Target} active={shape === 'square'} />
          <MetricCard label="קהילתיות" value={metrics.community} icon={Users} active={shape === 'hexagon'} />
          <MetricCard label="לחץ" value={metrics.stress} icon={Frown} positive={false} active={isGolden} />
          <MetricCard label="רוגע" value={metrics.calm} icon={Leaf} active={isGolden} />
        </div>
      </div>

      {/* Image Uploader */}
      <ImageUploader
        imageUrl={imageUrl}
        onSave={saveImage}
        onDelete={deleteImage}
        label="הוסף תמונה לדוגמה הנוכחית — גרור, הדבק, או לחץ"
      />

      {/* Control Panel */}
      <div className="mt-6 bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="text-sm font-heebo font-semibold text-foreground mb-5">פאנל שליטה</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shape selector */}
          <div>
            <Label className="text-xs text-muted-foreground mb-3 block">צורת החדר</Label>
            <RadioGroup value={shape} onValueChange={setShape} className="flex flex-wrap gap-3">
              {[
                { value: 'circle', label: 'חדר עגול', icon: '○' },
                { value: 'square', label: 'חדר מרובע', icon: '□' },
                { value: 'hexagon', label: 'חדר משושה', icon: '⬡' },
              ].map(item => (
                <Label
                  key={item.value}
                  htmlFor={item.value}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                    ${shape === item.value 
                      ? 'border-accent bg-accent/5 text-foreground' 
                      : 'border-border/50 hover:border-border text-muted-foreground'
                    }`}
                >
                  <RadioGroupItem value={item.value} id={item.value} />
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-heebo">{item.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Ratio slider */}
          <div>
            <Label className="text-xs text-muted-foreground mb-3 block">
              פרופורציות החדר
            </Label>
            <div className="space-y-4">
              <Slider
                value={ratioValue}
                onValueChange={setRatioValue}
                min={1}
                max={2}
                step={0.01}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs font-space text-muted-foreground">
                <span>1:1</span>
                <span className={`px-2 py-0.5 rounded-full transition-colors ${isGolden ? 'bg-accent text-accent-foreground font-bold' : ''}`}>
                  1:{ratio.toFixed(3)}
                </span>
                <span>1:2</span>
              </div>
              <div className="relative h-1">
                <div className="absolute h-full bg-muted rounded-full w-full" />
                <div
                  className="absolute h-3 w-0.5 bg-accent/50 top-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${((GOLDEN_RATIO - 1) / 1) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                סמן הזהב: 1:1.618 (φ)
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}