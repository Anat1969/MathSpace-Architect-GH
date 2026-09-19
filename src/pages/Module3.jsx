import { useState, useEffect } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import StaircaseViewer from '../components/StaircaseViewer';
import CathedralChallenge from '../components/CathedralChallenge';
import MetricCard from '../components/MetricCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Zap, Sofa, Building2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import usePersistedImages from '../hooks/usePersistedImages';
import { base44 } from '@/api/base44Client';

const OPTIMAL_ANGLE = 32;
const OPTIMAL_ACCEL = 5;
const TOLERANCE = 3;

export default function Module3() {
  const [angle, setAngle] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [isOptimal, setIsOptimal] = useState(false);
  const [fatigue, setFatigue] = useState(0);
  const [comfort, setComfort] = useState(0);
  const [stairsRecord, setStairsRecord] = useState(null);
  const { imageUrls, saveImage: save, deleteImage: del } = usePersistedImages('module3');
  const imageKey = `${angle}_${acceleration}`;
  const imageUrl = calculated ? (imageUrls[imageKey] || '') : '';
  const saveImage = (url) => save(imageKey, url);
  const deleteImage = () => del(imageKey);

  useEffect(() => {
    base44.entities.CalculusPhysicsModel.list().then(rows => {
      const r = rows.find(x => x.Challenge_ID === 'challenge_stairs');
      if (r) setStairsRecord(r);
    });
  }, []);

  const handleCalculate = () => {
    const a = parseFloat(angle);
    const acc = parseFloat(acceleration);
    if (isNaN(a) || isNaN(acc)) return;

    const optimal = Math.abs(a - OPTIMAL_ANGLE) <= TOLERANCE && Math.abs(acc - OPTIMAL_ACCEL) <= TOLERANCE;
    setIsOptimal(optimal);
    setCalculated(true);

    if (optimal && stairsRecord) {
      setFatigue(stairsRecord.Fatigue_Metric);
      setComfort(stairsRecord.Comfort_Metric);
    } else {
      const angleDiff = Math.abs(a - OPTIMAL_ANGLE);
      const accelDiff = Math.abs(acc - OPTIMAL_ACCEL);
      const score = Math.max(0, 100 - angleDiff * 2 - accelDiff * 3);
      setFatigue(Math.round(-34 * (score / 100)));
      setComfort(Math.round(42 * (score / 100)));
    }
  };

  return (
    <ModuleLayout moduleNumber={3} title="פיזיקה מתמטית ואינטגרלים" subtitle="Calculus Physics Engine">
      <Tabs defaultValue="stairs" className="h-full flex flex-col min-h-0">
        <TabsList className="mb-2 shrink-0 w-fit">
          <TabsTrigger value="stairs" className="gap-2 font-heebo">
            <Calculator className="w-4 h-4" />אתגר המדרגות
          </TabsTrigger>
          <TabsTrigger value="cathedral" className="gap-2 font-heebo">
            <Building2 className="w-4 h-4" />אתגר הקתדרלה
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: Stairs --- */}
        <TabsContent value="stairs" className="flex-1 min-h-0 mt-0">
          <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3 min-h-0">
            {/* Viewer + calc panel */}
            <div className="min-h-0 flex flex-col gap-2">
              <div className="flex-1 min-h-0 relative">
                <StaircaseViewer
                  angle={parseFloat(angle) || 30}
                  acceleration={parseFloat(acceleration) || 0}
                  optimal={isOptimal}
                />
                {calculated && isOptimal && (
                  <div className="absolute bottom-2 inset-x-2 flex items-start gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-3 py-2 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-600 font-heebo leading-snug">
                      הזווית היא הנגזרת הראשונה, התאוצה היא השנייה — הפכתם הולכים למתהלכים על גרף חי!
                      <span className="opacity-75"> {stairsRecord?.Academic_Reference}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Calc panel */}
              <div className="bg-card border border-border/50 rounded-xl p-3 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <Label className="text-[11px] text-muted-foreground mb-1.5 block">זווית — נגזרת ראשונה (°)</Label>
                  <Input type="number" placeholder="הכנס ערך..." value={angle} onChange={e => setAngle(e.target.value)} className="font-space h-9" />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground mb-1.5 block">תאוצת שינוי — נגזרת שנייה</Label>
                  <Input type="number" placeholder="הכנס ערך..." value={acceleration} onChange={e => setAcceleration(e.target.value)} className="font-space h-9" />
                </div>
                <div>
                  <Button onClick={handleCalculate} className="w-full font-heebo font-semibold" disabled={!angle || !acceleration}>
                    חשב מסלול הליכה
                  </Button>
                  {(!angle || !acceleration) && (
                    <p className="text-[10px] text-muted-foreground mt-1.5 text-center font-heebo leading-tight">נסו 32° ותאוצה 5</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rail: metrics + hint + image */}
            <div className="min-h-0 flex flex-col gap-3">
              <div>
                <h3 className="text-xs font-heebo font-semibold text-muted-foreground mb-2">מדדי הליכה</h3>
                <div className="grid grid-cols-2 gap-2">
                  <MetricCard compact label="עייפות" value={fatigue} icon={Zap} positive={false} active={calculated && fatigue !== 0} />
                  <MetricCard compact label="נוחות" value={comfort} icon={Sofa} active={calculated && comfort !== 0} />
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <h4 className="text-[11px] font-heebo font-semibold text-muted-foreground mb-1">רמז</h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  הנוסחה האופטימלית: זווית כ-32° ותאוצת שינוי זווית (נגזרת שנייה) של כ-5.
                </p>
              </div>
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
                    prompt: 'גרם מדרגות מודרני בזווית 32 מעלות, עיצוב נקי, חומרי בטון ועץ, מעקה מינימליסטי, תאורה דרמטית',
                  }}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- TAB 2: Cathedral --- */}
        <TabsContent value="cathedral" className="flex-1 min-h-0 mt-0 overflow-y-auto">
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <h3 className="text-sm font-heebo font-semibold text-foreground mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" />אתגר הקתדרלה — מתמטיקה אינטואיטיבית
            </h3>
            <p className="text-xs text-muted-foreground mb-3">הצב קשתות תמך גותיות (Flying Buttresses) על הקתדרלה כדי לפזר את העומסים</p>
            <CathedralChallenge />
          </div>
        </TabsContent>
      </Tabs>
    </ModuleLayout>
  );
}