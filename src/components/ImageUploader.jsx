import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Pencil, ImageIcon, Loader2, AlertCircle, Lightbulb, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

// Downscale an image file to a small JPEG data URL so it renders instantly and
// barely touches localStorage. Resolution is intentionally sacrificed for size:
// a max edge of 640px at quality 0.6 turns even a large phone photo into a few
// tens of KB, which keeps browser storage tiny and avoids the old upload crash.
function downscaleImageToDataUrl(file, maxDim = 640, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (!width || !height) { reject(new Error('bad image dimensions')); return; }
      if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('no 2d context')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('image load failed')); };
    img.src = objectUrl;
  });
}

export default function ImageUploader({ imageUrl, onSave, onDelete, label = "הוסף תמונה לדוגמה", suggestion }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setError('הקובץ שנבחר אינו תמונה. נסי קובץ בפורמט JPG או PNG.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const dataUrl = await downscaleImageToDataUrl(file);
      const ok = onSave(dataUrl);
      if (ok === false) {
        setError('לא ניתן היה לשמור את התמונה בדפדפן (אחסון מלא). נסי תמונה קטנה יותר או מחקי תמונות קודמות.');
      }
    } catch {
      setError('העלאת התמונה נכשלה. נסי שוב, או בחרי תמונה אחרת.');
    } finally {
      setUploading(false);
    }
  }, [onSave]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          handleFile(item.getAsFile());
          break;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  const copySuggestion = useCallback(() => {
    if (!suggestion?.prompt) return;
    try {
      navigator.clipboard?.writeText(suggestion.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — no-op */ }
  }, [suggestion]);

  // ── State: image already uploaded ──────────────────────────────────────────
  if (imageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-border/50 bg-card"
      >
        <div className="w-full h-64 bg-muted/40 flex items-center justify-center">
          <img src={imageUrl} alt="תמונת דוגמה" className="max-w-full max-h-full object-contain" />
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <Button size="sm" variant="secondary" className="h-8 gap-1.5 text-xs font-heebo shadow"
            onClick={() => inputRef.current?.click()}>
            <Pencil className="w-3 h-3" />החלף
          </Button>
          <Button size="sm" variant="destructive" className="h-8 gap-1.5 text-xs font-heebo shadow"
            onClick={onDelete}>
            <X className="w-3 h-3" />מחק
          </Button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
      </motion.div>
    );
  }

  // ── State: dropzone (idle / uploading / error) ──────────────────────────────
  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
          error ? "border-destructive/50 bg-destructive/5"
                : dragging ? "border-accent bg-accent/5 scale-[1.01]"
                : "border-border/40 hover:border-accent/50 hover:bg-muted/30"
        )}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-sm font-heebo text-muted-foreground">מעבד תמונה...</p>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-sm font-heebo font-semibold text-destructive max-w-xs">{error}</p>
              <Button size="sm" variant="outline" className="font-heebo gap-2"
                onClick={(e) => { e.stopPropagation(); setError(''); inputRef.current?.click(); }}>
                <Upload className="w-3.5 h-3.5" />נסי שוב
              </Button>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-heebo font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">גרור תמונה לכאן, הדבק (Ctrl+V), או לחץ לבחירה</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Concrete content suggestion so the field is never a blank ask */}
      {suggestion && !uploading && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-heebo font-semibold text-foreground">{suggestion.title}</p>
              {suggestion.text && (
                <p className="text-xs text-muted-foreground font-heebo mt-0.5 leading-relaxed">{suggestion.text}</p>
              )}
              {suggestion.prompt && (
                <div className="mt-2 flex items-start gap-2 bg-background/60 rounded-lg px-2.5 py-2 border border-border/40">
                  <p className="text-[11px] text-muted-foreground font-space flex-1 leading-relaxed" dir="auto">
                    “{suggestion.prompt}”
                  </p>
                  <button
                    onClick={copySuggestion}
                    className="shrink-0 text-muted-foreground hover:text-accent transition-colors"
                    title="העתק פרומפט"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
