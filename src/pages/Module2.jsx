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
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="space-y-6">
        {/* 3D City Viewer */}
        <CityViewer model={model} />

        {/* Message Banner */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={message.type}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "flex items-start gap-3 rounded-2xl p-5 border",
                message.type === 'error'
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-emerald-500/5 border-emerald-500/20"
              )}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={cn(
                  "font-heebo font-bold text-sm mb-1",
                  message.type === 'error' ? "text-red-600" : "text-emerald-600"
                )}>
                  {message.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{message.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Info */}
        {model && (
          <ProjectInfoBadge
            name={records[model === 'monotone' ? 'model_bijlmermeer' : 'model_copenhagen_big']?.Project_Name}
            architect={records[model === 'monotone' ? 'model_bijlmermeer' : 'model_copenhagen_big']?.Architect}
            location={model === 'monotone' ? 'אמסטרדם, הולנד' : 'קופנהגן, דנמרק'}
            type={records[model === 'monotone' ? 'model_bijlmermeer' : 'model_copenhagen_big']?.Application_Type}
          />
        )}

        {/* Image Uploader */}
        <ImageUploader
          imageUrl={imageUrl}
          onSave={saveImage}
          onDelete={deleteImage}
          label="הוסף תמונה לדוגמה הנוכחית — גרור, הדבק, או לחץ"
          suggestion={{
            title: 'רעיון: מבט אווירי על שכונה',
            text: 'העלו תצלום אוויר של שכונה אורגנית מול מונוטונית, או צרו תמונה עם הפרומפט:',
            prompt: 'מבט אווירי על שכונה עירונית עם דפוסים פרקטליים אורגניים, רחובות מתעקלים, גינות קהילתיות ושטחים ירוקים, רינדור מפורט מלמעלה',
          }}
        />

        {/* Progress & Controls */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
          {/* Belonging metric */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-heebo font-semibold text-foreground">תחושת שייכות (Sense of Belonging)</span>
              <motion.span
                key={belonging}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className={cn(
                  "text-2xl font-space font-bold",
                  belonging > 50 ? "text-emerald-500" : belonging === 0 ? "text-red-500" : "text-muted-foreground"
                )}
              >
                {belonging}%
              </motion.span>
            </div>
            <Progress value={belonging} className="h-3 rounded-full" />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleModel1}
              variant="outline"
              className={cn(
                "h-auto py-4 px-5 flex flex-col items-start gap-2 text-right rounded-xl transition-all",
                model === 'monotone' && "border-red-500/30 bg-red-500/5"
              )}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-heebo font-semibold text-sm">מודל 1968 — צורות מבנים</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                החל פרקטל על צורת מבנים בלבד
              </span>
            </Button>

            <Button
              onClick={handleModel2}
              variant="outline"
              className={cn(
                "h-auto py-4 px-5 flex flex-col items-start gap-2 text-right rounded-xl transition-all",
                model === 'organic' && "border-emerald-500/30 bg-emerald-500/5"
              )}
            >
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4 text-muted-foreground" />
                <span className="font-heebo font-semibold text-sm">מודל 2019 — דפוסי חיים</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                החל פרקטל על דפוסי חיים מורכבים
              </span>
            </Button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}