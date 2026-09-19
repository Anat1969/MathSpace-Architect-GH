import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ModuleLayout from '../components/ModuleLayout';
import CityViewer from '../components/CityViewer';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Building2, TreePine } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import ProjectInfoBadge from '../components/ProjectInfoBadge';
import usePersistedImages from '../hooks/usePersistedImages';
import { cn } from "@/lib/utils";

export default function Module2() {
  const [model, setModel] = useState(null);
  const [belonging, setBelonging] = useState(0);
  const [message, setMessage] = useState(null);
  const [records, setRecords] = useState({});
  const { imageUrls, saveImage: save, deleteImage: del } = usePersistedImages('module2');
  const imageUrl = (model && imageUrls[model]) || '';
  const saveImage = (url) => save(model, url);
  const deleteImage = () => del(model);

  useEffect(() => {
    base44.entities.FractalUrbanModel.list().then(rows => {
      const map = {};
      rows.forEach(r => { map[r.Model_ID] = r; });
      setRecords(map);
    });
  }, []);

  const handleModel1 = () => {
    const r = records['model_bijlmermeer'];
    setModel('monotone');
    setBelonging(r?.Belonging_Metric ?? 0);
    setMessage({
      type: 'error',
      title: 'כישלון מתמטי — שכונה ללא תובנה אנושית היא ריקה מחיים',
      description: r?.Historical_Context ?? ''
    });
  };

  const handleModel2 = () => {
    const r = records['model_copenhagen_big'];
    setModel('organic');
    setBelonging(r?.Belonging_Metric ?? 67);
    setMessage({
      type: 'success',
      title: 'הצלחה! מתמטיקה המשרתת בני אדם',
      description: r?.Historical_Context ?? ''
    });
  };

  return (
    <ModuleLayout moduleNumber={2} title="בונה השכונות הפרקטלי" subtitle="Fractal City Builder">
      <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3 min-h-0">

        {/* ── Viewer + model buttons ── */}
        <div className="min-h-0 flex flex-col gap-2">
          <div className="flex-1 min-h-0 relative">
            <CityViewer model={model} />
            {message && (
              <div
                key={message.type}
                className={cn(
                  "absolute bottom-2 inset-x-2 flex items-start gap-2 rounded-xl p-3 border backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
                  message.type === 'error' ? "bg-red-500/10 border-red-500/25" : "bg-emerald-500/10 border-emerald-500/25"
                )}
              >
                {message.type === 'error'
                  ? <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  : <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <h4 className={cn("font-heebo font-bold text-xs mb-0.5", message.type === 'error' ? "text-red-600" : "text-emerald-600")}>
                    {message.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{message.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Model buttons */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <Button onClick={handleModel1} variant="outline"
              className={cn("h-auto py-3 px-4 flex flex-col items-start gap-1 text-right rounded-xl", model === 'monotone' && "border-red-500/30 bg-red-500/5")}>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-heebo font-semibold text-sm">מודל 1968 — צורות מבנים</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-normal">החל פרקטל על צורת מבנים בלבד</span>
            </Button>
            <Button onClick={handleModel2} variant="outline"
              className={cn("h-auto py-3 px-4 flex flex-col items-start gap-1 text-right rounded-xl", model === 'organic' && "border-emerald-500/30 bg-emerald-500/5")}>
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4 text-muted-foreground" />
                <span className="font-heebo font-semibold text-sm">מודל 2019 — דפוסי חיים</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-normal">החל פרקטל על דפוסי חיים מורכבים</span>
            </Button>
          </div>
        </div>

        {/* ── Rail ── */}
        <div className="min-h-0 flex flex-col gap-3">
          <div className="bg-card border border-border/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heebo font-semibold text-foreground">תחושת שייכות</span>
              <span className={cn("text-xl font-space font-bold", belonging > 50 ? "text-emerald-500" : belonging === 0 ? "text-red-500" : "text-muted-foreground")}>
                {belonging}%
              </span>
            </div>
            <Progress value={belonging} className="h-2.5 rounded-full" />
          </div>

          {model && (
            <ProjectInfoBadge
              name={records[model === 'monotone' ? 'model_bijlmermeer' : 'model_copenhagen_big']?.Project_Name}
              architect={records[model === 'monotone' ? 'model_bijlmermeer' : 'model_copenhagen_big']?.Architect}
              location={model === 'monotone' ? 'אמסטרדם, הולנד' : 'קופנהגן, דנמרק'}
              type={records[model === 'monotone' ? 'model_bijlmermeer' : 'model_copenhagen_big']?.Application_Type}
            />
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
                prompt: 'מבט אווירי על שכונה עירונית עם דפוסים פרקטליים אורגניים, רחובות מתעקלים, גינות קהילתיות ושטחים ירוקים, רינדור מפורט מלמעלה',
              }}
            />
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}