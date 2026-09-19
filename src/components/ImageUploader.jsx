import { useState, useRef, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, X, Pencil, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

export default function ImageUploader({ imageUrl, onSave, onDelete, label = "הוסף תמונה לדוגמה" }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onSave(file_url);
    setUploading(false);
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

  if (imageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-border/50 bg-card"
      >
        <img src={imageUrl} alt="תמונת דוגמה" className="w-full max-h-72 object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 gap-1.5 text-xs font-heebo shadow"
            onClick={() => inputRef.current?.click()}
          >
            <Pencil className="w-3 h-3" />
            החלף
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 gap-1.5 text-xs font-heebo shadow"
            onClick={onDelete}
          >
            <X className="w-3 h-3" />
            מחק
          </Button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
      </motion.div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
        dragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-border/40 hover:border-accent/50 hover:bg-muted/30"
      )}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />

      <AnimatePresence mode="wait">
        {uploading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-sm font-heebo text-muted-foreground">מעלה תמונה...</p>
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
  );
}