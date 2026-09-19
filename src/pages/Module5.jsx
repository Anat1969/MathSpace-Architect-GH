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
      <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3 min-h-0">

        {/* ── Viewer + toggles ── */}
        <div className="min-h-0 flex flex-col gap-2">
          <div className="flex-1 min-h-0">
            <ARViewer mobiusEnabled={mobiusEnabled} fibonacciEnabled={fibonacciEnabled} />
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all", mobiusEnabled ? "border-purple-500/30 bg-purple-500/5" : "border-border/50")}>
              <Switch checked={mobiusEnabled} onCheckedChange={handleMobius} id="mobius" />
              <div className="min-w-0">
                <Label htmlFor="mobius" className="flex items-center gap-1.5 cursor-pointer">
                  <Infinity className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="font-heebo font-semibold text-sm text-foreground">רצועת מביוס</span>
                </Label>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1">טשטוש בין פנים לחוץ — תומס הרצוג</p>
              </div>
            </div>

            <div className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all", fibonacciEnabled ? "border-amber-500/30 bg-amber-500/5" : "border-border/50")}>
              <Switch checked={fibonacciEnabled} onCheckedChange={handleFibonacci} id="fibonacci" />
              <div className="min-w-0">
                <Label htmlFor="fibonacci" className="flex items-center gap-1.5 cursor-pointer">
                  <Grid3x3 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-heebo font-semibold text-sm text-foreground">רשת פיבונאצ'י</span>
                </Label>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1">רשת פרופורציות של יחס הזהב</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Rail: info + image ── */}
        <div className="min-h-0 flex flex-col gap-3">
          {activeInfo ? (
            <div className={cn("rounded-xl border p-3 transition-all overflow-y-auto", mobiusEnabled ? "border-purple-500/30 bg-purple-500/5" : "border-amber-500/30 bg-amber-500/5")}>
              <h4 className={cn("font-heebo font-bold text-sm mb-1.5", mobiusEnabled ? "text-purple-600" : "text-amber-600")}>{activeInfo.Feature_Name}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug mb-2 line-clamp-4">{activeInfo.Architectural_Concept}</p>
              {activeInfo.User_Quote && (
                <blockquote className={cn("text-xs font-heebo font-semibold italic border-r-2 pr-2 leading-snug mb-2 line-clamp-2", mobiusEnabled ? "border-purple-400 text-purple-700" : "border-amber-400 text-amber-700")}>
                  {activeInfo.User_Quote}
                </blockquote>
              )}
              <p className="text-[11px] text-muted-foreground leading-snug border-t border-border/30 pt-2 line-clamp-3">{activeInfo.Philosophical_Insight}</p>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-3">
              <h4 className="text-sm font-heebo font-semibold text-foreground mb-1.5 flex items-center gap-1.5"><Camera className="w-4 h-4" />אודות מודול AR</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                המודול מלביש שכבות מתמטיות על המציאות דרך המצלמה. הפעילי מתג כדי לגלות את הקשר הטופולוגי הנסתר בסביבתך.
              </p>
            </div>
          )}

          <div className="mt-auto">
            <h3 className="text-xs font-heebo font-semibold text-muted-foreground mb-2">תמונת דוגמה</h3>
            <ImageUploader
              square
              imageUrl={imageUrl}
              onSave={saveImage}
              onDelete={deleteImage}
              label="הוסף תמונה"
              suggestion={{
                title: 'רעיון + פרומפט לתמונה',
                prompt: 'רצועת מביוס או ספירלת פיבונאצ׳י מוקרנת על קיר בחלל אדריכלי, אפקט מציאות רבודה, קווי אור זוהרים, אווירה עתידנית',
              }}
            />
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}