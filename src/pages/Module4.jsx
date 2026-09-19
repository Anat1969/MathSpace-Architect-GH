import { useState, useEffect } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Loader2, TrendingUp } from 'lucide-react';
import ProjectInfoBadge from '../components/ProjectInfoBadge';
import ImageUploader from '../components/ImageUploader';
import usePersistedImages from '../hooks/usePersistedImages';
import { cn } from "@/lib/utils";
import { base44 } from '@/api/base44Client';

export default function Module4() {
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { imageUrls, saveImage: save, deleteImage: del } = usePersistedImages('module4');
  const resultKey = result?.Model_ID || '';
  const imageUrl = (resultKey && imageUrls[resultKey]) || '';
  const saveImage = (url) => save(resultKey, url);
  const deleteImage = () => del(resultKey);

  useEffect(() => {
    base44.entities.ArchitecturalModel.list().then(setModels);
  }, []);

  const handleGenerate = () => {
    if (!selectedModelId) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const model = models.find(m => m.Model_ID === selectedModelId);
      setResult(model);
      setLoading(false);
    }, 1500);
  };

  const metricPositive = result && result.Metric_Value > 0;
  const metricColor = result
    ? (metricPositive ? 'text-emerald-500' : 'text-emerald-500') // both improvements
    : 'text-muted-foreground';
  const metricDisplay = result
    ? (result.Metric_Value > 0 ? `+${result.Metric_Value}%` : `${result.Metric_Value}%`)
    : '';

  return (
    <ModuleLayout moduleNumber={4} title="מחולל AI אדריכלי" subtitle="AI Architecture Generator">
      <div className="h-full flex flex-col gap-3 min-h-0">

        {/* ── Control bar ── */}
        <div className="bg-card border border-border/50 rounded-xl p-3 shrink-0 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-heebo font-semibold text-foreground shrink-0">
            <Cpu className="w-4 h-4" />בחר מודל מתמטי
          </div>
          <Select value={selectedModelId} onValueChange={setSelectedModelId}>
            <SelectTrigger className="w-full sm:w-72"><SelectValue placeholder="בחר מודל מתמטי..." /></SelectTrigger>
            <SelectContent>
              {models.map(m => (<SelectItem key={m.Model_ID} value={m.Model_ID}>{m.Math_Model_Name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={!selectedModelId || loading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-heebo font-semibold gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            צור מבנה באמצעות AI
          </Button>
          <p className="text-[11px] text-muted-foreground w-full sm:w-auto sm:mr-auto">
            יישום מודלים מתמטיים לתכנון אדריכלי חכם
          </p>
        </div>

        {/* ── Result area ── */}
        <div className="flex-1 min-h-0">
          <>
            {loading && (
              <div className="h-full flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground font-heebo">מחולל AI מעבד את המודל המתמטי...</p>
              </div>
            )}

            {!loading && result && (
              <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 min-h-0 animate-in fade-in duration-300">
                {/* Info + metric */}
                <div className="min-h-0 overflow-y-auto rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-start">
                  <div>
                    <h3 className="font-heebo font-bold text-foreground text-lg">{result.Building_Type} — {result.Location}</h3>
                    <p className="text-xs text-muted-foreground font-space mb-3">{result.Math_Model_Name}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.Mechanism_Description}</p>
                    <div className="mt-4">
                      <ProjectInfoBadge name={result.Building_Name} architect={result.Architect} location={result.Location} type={result.Building_Type} />
                    </div>
                  </div>
                  <div className="text-center md:border-r md:border-emerald-500/20 md:pr-5 shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span className="text-xs font-heebo text-muted-foreground">{result.Metric_Name}</span>
                    </div>
                    <span className="text-5xl md:text-6xl font-space font-bold text-emerald-500 block">
                      {metricDisplay}
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-1">שיפור מעוגן במחקר אמפירי</p>
                  </div>
                </div>

                {/* Image rail */}
                <div className="flex flex-col">
                  <h3 className="text-xs font-heebo font-semibold text-muted-foreground mb-2">תמונת דוגמה</h3>
                  <ImageUploader
                    square
                    imageUrl={imageUrl}
                    onSave={saveImage}
                    onDelete={deleteImage}
                    label="הוסף תמונת מבנה"
                    suggestion={{
                      title: 'רעיון + פרומפט לתמונה',
                      prompt: 'מבנה אדריכלי איקוני בהשראת מודל מתמטי (פרקטל/פיבונאצ׳י/וורונוי), חזית פרמטרית, רינדור פוטוריאליסטי בשעת בין הערביים',
                    }}
                  />
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-heebo font-semibold text-foreground mb-2">בחר מודל מתמטי</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  בחר את המודל המתמטי ולחץ "צור מבנה" כדי לראות את התוצאה האדריכלית
                </p>
              </div>
            )}
          </>
        </div>
      </div>
    </ModuleLayout>
  );
}