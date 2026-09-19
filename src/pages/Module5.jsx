import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ModuleLayout from '../components/ModuleLayout';
import ARViewer from '../components/ARViewer';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Camera, Infinity, Grid3x3 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import usePersistedImages from '../hooks/usePersistedImages';
import { cn } from "@/lib/utils";

export default function Module5() {
  const [mobiusEnabled, setMobiusEnabled] = useState(false);
  const [fibonacciEnabled, setFibonacciEnabled] = useState(false);
  const [records, setRecords] = useState({});
  const [activeInfo, setActiveInfo] = useState(null);
  const { imageUrls, saveImage: save, deleteImage: del } = usePersistedImages('module5');
  const imageKey = mobiusEnabled ? 'mobius' : fibonacciEnabled ? 'fibonacci' : 'default';
  const imageUrl = imageUrls[imageKey] || '';
  const saveImage = (url) => save(imageKey, url);
  const deleteImage = () => del(imageKey);

  useEffect(() => {
    base44.entities.ARTopologyModel.list().then(rows => {
      const map = {};
      rows.forEach(r => { map[r.Feature_ID] = r; });
      setRecords(map);
    });
  }, []);

  const handleMobius = (val) => {
    setMobiusEnabled(val);
    if (val) {
      setFibonacciEnabled(false);
      setActiveInfo(records['ar_mobius'] || null);
    } else {
      setActiveInfo(null);
    }
  };

  const handleFibonacci = (val) => {
    setFibonacciEnabled(val);
    if (val) {
      setMobiusEnabled(false);
      setActiveInfo(records['ar_fibonacci'] || null);
    } else {
      setActiveInfo(null);
    }
  };

  return (
    <ModuleLayout moduleNumber={5} title="מציאות רבודה — טופולוגיה ופרופורציות" subtitle="AR Camera Overlay">
      <div className="space-y-6">
        {/* AR Viewer */}
        <ARViewer mobiusEnabled={mobiusEnabled} fibonacciEnabled={fibonacciEnabled} />

        {/* Controls */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-sm font-heebo font-semibold text-foreground mb-5 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            שכבות AR
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Möbius Toggle */}
            <div className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all",
              mobiusEnabled ? "border-purple-500/30 bg-purple-500/5" : "border-border/50"
            )}>
              <Switch checked={mobiusEnabled} onCheckedChange={handleMobius} id="mobius" />
              <div className="flex-1">
                <Label htmlFor="mobius" className="flex items-center gap-2 cursor-pointer mb-1">
                  <Infinity className="w-4 h-4 text-purple-500" />
                  <span className="font-heebo font-semibold text-sm text-foreground">רצועת מביוס</span>
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ממחיש טשטוש בין פנים לחוץ ללא דלתות — מבוסס על פרויקט תומס הרצוג
                </p>
              </div>
            </div>

            {/* Fibonacci Toggle */}
            <div className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all",
              fibonacciEnabled ? "border-amber-500/30 bg-amber-500/5" : "border-border/50"
            )}>
              <Switch checked={fibonacciEnabled} onCheckedChange={handleFibonacci} id="fibonacci" />
              <div className="flex-1">
                <Label htmlFor="fibonacci" className="flex items-center gap-2 cursor-pointer mb-1">
                  <Grid3x3 className="w-4 h-4 text-amber-500" />
                  <span className="font-heebo font-semibold text-sm text-foreground">רשת פיבונאצ'י</span>
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  רשת פרופורציות של יחס הזהב — המתמטיקה כמבנה הבסיסי של המציאות
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Info Card — shown when a layer is active */}
        {activeInfo && (
          <div className={cn(
            "rounded-2xl border p-5 space-y-3 transition-all",
            mobiusEnabled ? "border-purple-500/30 bg-purple-500/5" : "border-amber-500/30 bg-amber-500/5"
          )}>
            <h4 className={cn(
              "font-heebo font-bold text-sm",
              mobiusEnabled ? "text-purple-600" : "text-amber-600"
            )}>
              {activeInfo.Feature_Name}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{activeInfo.Architectural_Concept}</p>
            {activeInfo.User_Quote && (
              <blockquote className={cn(
                "text-base font-heebo font-semibold italic border-r-4 pr-4 leading-relaxed",
                mobiusEnabled ? "border-purple-400 text-purple-700" : "border-amber-400 text-amber-700"
              )}>
                {activeInfo.User_Quote}
              </blockquote>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
              {activeInfo.Philosophical_Insight}
            </p>
          </div>
        )}

        {/* Image Uploader */}
        <ImageUploader
          imageUrl={imageUrl}
          onSave={saveImage}
          onDelete={deleteImage}
          label="הוסף תמונה לדוגמה הנוכחית — גרור, הדבק, או לחץ"
        />

        {/* Default Info Panel */}
        {!activeInfo && (
          <div className="bg-muted/50 rounded-2xl p-6">
            <h4 className="text-sm font-heebo font-semibold text-foreground mb-3">אודות מודול AR</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              מודול זה משתמש במצלמת המכשיר שלך כדי להלביש שכבות מתמטיות על המציאות.
              הפעל מתג כדי לגלות את הקשר הטופולוגי הנסתר בסביבתך.
            </p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}