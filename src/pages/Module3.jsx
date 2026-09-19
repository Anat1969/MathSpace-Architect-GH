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
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const OPTIMAL_ANGLE = 32;
const OPTIMAL_ACCEL = 5;
const TOLERANCE = 3;

export default function Module3() {
  const [angle, setAngle] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const { imageUrls, saveImage: save, deleteImage: del } = usePersistedImages('module3');
  const imageKey = `${angle}_${acceleration}`;
  const imageUrl = calculated ? (imageUrls[imageKey] || '') : '';
  const saveImage = (url) => save(imageKey, url);
  const deleteImage = () => del(imageKey);
  const [calculated, setCalculated] = useState(false);
  const [isOptimal, setIsOptimal] = useState(false);
  const [fatigue, setFatigue] = useState(0);
  const [comfort, setComfort] = useState(0);
  const [stairsRecord, setStairsRecord] = useState(null);

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
      <Tabs defaultValue="stairs">
        <TabsList className="mb-6">
          <TabsTrigger value="stairs" className="gap-2 font-heebo">
            <Calculator className="w-4 h-4" />אתגר המדרגות
          </TabsTrigger>
          <TabsTrigger value="cathedral" className="gap-2 font-heebo">
            <Building2 className="w-4 h-4" />אתגר הקתדרלה
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: Stairs --- */}
        <TabsContent value="stairs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StaircaseViewer
                angle={parseFloat(angle) || 30}
                acceleration={parseFloat(acceleration) || 0}
                optimal={isOptimal}
              />
              <AnimatePresence>
                {calculated && isOptimal && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3"
                  >
                    <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-600 font-heebo leading-relaxed">
                      הזווית היא הנגזרת הראשונה, התאוצה היא השנייה. הפכתם את ההולכים למתהלכים על גרף מתמטי חי!<br />
                      <span className="text-xs opacity-75">{stairsRecord?.Academic_Reference}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-heebo font-semibold text-muted-foreground mb-3">מדדי הליכה</h3>
              <MetricCard label="עייפות" value={fatigue} icon={Zap} positive={false} active={calculated && fatigue !== 0} />
              <MetricCard label="נוחות" value={comfort} icon={Sofa} active={calculated && comfort !== 0} />
              <div className="bg-muted/50 rounded-xl p-4 mt-4">
                <h4 className="text-xs font-heebo font-semibold text-muted-foreground mb-2">רמז</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  הנוסחה האופטימלית: זווית כ-32° ותאוצת שינוי זווית (נגזרת שנייה) של כ-5.
                </p>
              </div>
            </div>
          </div>

          <ImageUploader
            imageUrl={imageUrl}
            onSave={saveImage}
            onDelete={deleteImage}
            label="הוסף תמונה לתוצאה הנוכחית — גרור, הדבק, או לחץ"
          />

          <div className="mt-6 bg-card border border-border/50 rounded-2xl p-6">
            <h3 className="text-sm font-heebo font-semibold text-foreground mb-5 flex items-center gap-2">
              <Calculator className="w-4 h-4" />פאנל חישוב מסלול הליכה
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">זווית המדרגה — נגזרת ראשונה (°)</Label>
                <Input type="number" placeholder="הכנס ערך..." value={angle} onChange={e => setAngle(e.target.value)} className="font-space" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">תאוצת שינוי הזווית — נגזרת שנייה</Label>
                <Input type="number" placeholder="הכנס ערך..." value={acceleration} onChange={e => setAcceleration(e.target.value)} className="font-space" />
              </div>
              <Button onClick={handleCalculate} className="font-heebo font-semibold" disabled={!angle || !acceleration}>
                חשב מסלול הליכה
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* --- TAB 2: Cathedral --- */}
        <TabsContent value="cathedral">
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h3 className="text-sm font-heebo font-semibold text-foreground mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" />אתגר הקתדרלה — מתמטיקה אינטואיטיבית
            </h3>
            <p className="text-xs text-muted-foreground mb-5">הצב קשתות תמך גותיות (Flying Buttresses) על הקתדרלה כדי לפזר את העומסים</p>
            <CathedralChallenge />
          </div>
        </TabsContent>
      </Tabs>
    </ModuleLayout>
  );
}