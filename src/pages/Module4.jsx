import { useState, useEffect } from 'react';
import ModuleLayout from '../components/ModuleLayout';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Loader2, TrendingUp } from 'lucide-react';
import ProjectInfoBadge from '../components/ProjectInfoBadge';
import ImageUploader from '../components/ImageUploader';
import usePersistedImages from '../hooks/usePersistedImages';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="space-y-6">
        {/* Control Panel */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-sm font-heebo font-semibold text-foreground mb-5 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            בחר מודל מתמטי
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger className="sm:w-80">
                <SelectValue placeholder="בחר מודל מתמטי..." />
              </SelectTrigger>
              <SelectContent>
                {models.map(m => (
                  <SelectItem key={m.Model_ID} value={m.Model_ID}>
                    {m.Math_Model_Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerate}
              disabled={!selectedModelId || loading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-heebo font-semibold gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
              צור מבנה באמצעות AI
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            מדמה את פעולת הסטארט-אפ MathSpace — יישום מודלים מתמטיים לתכנון אדריכלי חכם
          </p>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground font-heebo">מחולל AI מעבד את המודל המתמטי...</p>
            </motion.div>
          )}

          {!loading && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-6 md:p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Building info */}
                <div>
                  <div className="mb-4">
                    <h3 className="font-heebo font-bold text-foreground text-lg">
                      {result.Building_Type} — {result.Location}
                    </h3>
                    <p className="text-xs text-muted-foreground font-space">{result.Math_Model_Name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.Mechanism_Description}</p>
                  <div className="mt-4">
                    <ProjectInfoBadge
                      name={result.Building_Name}
                      architect={result.Architect}
                      location={result.Location}
                      type={result.Building_Type}
                    />
                  </div>
                </div>

                {/* Right: Metric */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-heebo text-muted-foreground">{result.Metric_Name}</span>
                    </div>
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="text-6xl md:text-7xl font-space font-bold text-emerald-500"
                    >
                      {metricDisplay}
                    </motion.span>
                    <p className="text-xs text-muted-foreground mt-2">שיפור מעוגן במחקר אמפירי</p>
                  </div>
                </div>
              </div>

              {/* Image Uploader inside result */}
              <div className="mt-6 border-t border-border/30 pt-5">
                <ImageUploader
                  imageUrl={imageUrl}
                  onSave={saveImage}
                  onDelete={deleteImage}
                  label="הוסף תמונת מבנה לדוגמה — גרור, הדבק, או לחץ"
                />
              </div>
            </motion.div>
          )}

          {!loading && !result && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Cpu className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-heebo font-semibold text-foreground mb-2">בחר מודל מתמטי</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                בחר את המודל המתמטי ולחץ "צור מבנה" כדי לראות את התוצאה האדריכלית
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModuleLayout>
  );
}