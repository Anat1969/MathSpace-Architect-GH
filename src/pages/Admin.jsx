import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, Trash2, Edit2, Save, X, Github, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const REPO_URL = 'https://github.com/Anat1969/MathSpace-Architect-GH';
const CLONE_CMD = 'git clone https://github.com/Anat1969/MathSpace-Architect-GH.git';

// ─── Generic Entity Table + Form ────────────────────────────────────────────

function EntityManager({ entityName, fields }) {
  const entity = base44.entities[entityName];
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null); // null | {} | record
  const [form, setForm] = useState({});

  const load = () => entity.list().then(setRecords);
  useEffect(() => { load(); }, [entityName]);

  const openNew = () => {
    const blank = {};
    fields.forEach(f => { blank[f.key] = ''; });
    setForm(blank);
    setEditing('new');
  };

  const openEdit = (rec) => {
    setForm({ ...rec });
    setEditing(rec.id);
  };

  const cancel = () => { setEditing(null); setForm({}); };

  const save = async () => {
    if (editing === 'new') {
      await entity.create(form);
    } else {
      await entity.update(editing, form);
    }
    await load();
    cancel();
  };

  const del = async (id) => {
    await entity.delete(id);
    await load();
  };

  return (
    <div className="space-y-4">
      {/* Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 space-y-4"
        >
          <h4 className="font-heebo font-semibold text-foreground text-sm">
            {editing === 'new' ? 'רשומה חדשה' : 'עריכת רשומה'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key}>
                <Label className="text-xs text-muted-foreground mb-1 block">{f.label}</Label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm font-heebo resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                ) : (
                  <Input
                    type={f.type || 'text'}
                    value={form[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="font-heebo"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={save} className="gap-2 font-heebo">
              <Save className="w-3.5 h-3.5" />שמור
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel} className="gap-2 font-heebo">
              <X className="w-3.5 h-3.5" />ביטול
            </Button>
          </div>
        </motion.div>
      )}

      {/* Add button */}
      {!editing && (
        <Button size="sm" onClick={openNew} className="gap-2 font-heebo">
          <Plus className="w-3.5 h-3.5" />הוסף רשומה חדשה
        </Button>
      )}

      {/* Records list */}
      <div className="space-y-2">
        {records.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8 font-heebo">אין רשומות עדיין</p>
        )}
        {records.map(rec => (
          <div key={rec.id} className="bg-card border border-border/50 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heebo font-medium text-foreground truncate">
                {rec[fields[0]?.key] || rec.id}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {fields.slice(1, 3).map(f => rec[f.key]).filter(Boolean).join(' · ')}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(rec)}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => del(rec.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Entity Field Configs ────────────────────────────────────────────────────

const CONFIGS = {
  RoomGeometry: {
    label: 'מודול 1 — גיאומטריית חדרים',
    fields: [
      { key: 'Shape_ID', label: 'מזהה צורה (Shape_ID)' },
      { key: 'Shape_Name', label: 'שם הצורה' },
      { key: 'Creativity_Metric', label: 'יצירתיות (%)', type: 'number' },
      { key: 'Focus_Metric', label: 'פוקוס (%)', type: 'number' },
      { key: 'Community_Metric', label: 'קהילתיות (%)', type: 'number' },
      { key: 'Stress_Metric', label: 'לחץ (%)', type: 'number' },
      { key: 'Calmness_Metric', label: 'רוגע (%)', type: 'number' },
    ],
  },
  FractalUrbanModel: {
    label: 'מודול 2 — מודלים עירוניים פרקטליים',
    fields: [
      { key: 'Model_ID', label: 'מזהה מודל (Model_ID)' },
      { key: 'Project_Name', label: 'שם הפרויקט' },
      { key: 'Application_Type', label: 'סוג יישום' },
      { key: 'Historical_Context', label: 'הקשר היסטורי', type: 'textarea' },
      { key: 'Belonging_Metric', label: 'מדד שייכות (%)', type: 'number' },
      { key: 'Status_Color', label: 'צבע סטטוס (hex)' },
    ],
  },
  CalculusPhysicsModel: {
    label: 'מודול 3 — מודלים פיזיקליים',
    fields: [
      { key: 'Challenge_ID', label: 'מזהה אתגר (Challenge_ID)' },
      { key: 'Challenge_Name', label: 'שם האתגר' },
      { key: 'Math_Principle', label: 'עיקרון מתמטי' },
      { key: 'Academic_Reference', label: 'מקור אקדמי', type: 'textarea' },
      { key: 'Fatigue_Metric', label: 'מדד עייפות (%)', type: 'number' },
      { key: 'Comfort_Metric', label: 'מדד נוחות (%)', type: 'number' },
      { key: 'Stability_Metric', label: 'מדד יציבות (%)', type: 'number' },
    ],
  },
  ArchitecturalModel: {
    label: 'מודול 4 — מנוע AI אדריכלי',
    fields: [
      { key: 'Model_ID', label: 'מזהה מודל (Model_ID)' },
      { key: 'Math_Model_Name', label: 'שם המודל המתמטי' },
      { key: 'Building_Type', label: 'ייעוד המבנה' },
      { key: 'Location', label: 'מיקום' },
      { key: 'Mechanism_Description', label: 'תיאור המנגנון', type: 'textarea' },
      { key: 'Metric_Name', label: 'שם המדד' },
      { key: 'Metric_Value', label: 'ערך המדד (%)', type: 'number' },
    ],
  },
  ARTopologyModel: {
    label: 'מודול 5 — מודלים טופולוגיים AR',
    fields: [
      { key: 'Feature_ID', label: 'מזהה שכבה (Feature_ID)' },
      { key: 'Feature_Name', label: 'שם השכבה' },
      { key: 'Architectural_Concept', label: 'קונספט אדריכלי', type: 'textarea' },
      { key: 'User_Quote', label: 'ציטוט משתמש', type: 'textarea' },
      { key: 'Philosophical_Insight', label: 'תובנה פילוסופית', type: 'textarea' },
    ],
  },
};

// ─── Admin Page ──────────────────────────────────────────────────────────────

export default function Admin() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyClone = () => {
    try {
      navigator.clipboard?.writeText(CLONE_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border/50 bg-card/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="shrink-0">
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heebo font-bold text-foreground">פאנל ניהול תוכן</h1>
            <p className="text-xs text-muted-foreground font-space">CMS — Virtual Architecture Lab</p>
          </div>
          <div className="flex-1" />
          <Button
            onClick={() => window.open(REPO_URL, '_blank', 'noopener')}
            className="gap-2 font-heebo shrink-0"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">המשך פיתוח ב-Claude Code</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-4 rounded-xl border border-amber-300/40 bg-amber-50/60 px-4 py-3 text-sm font-heebo text-amber-900">
          עריכה מקומית בלבד: שינויים כאן נשמרים בדפדפן הזה בלבד ואינם משפיעים על משתמשים אחרים.
          מקור האמת של התוכן הוא קובצי ה-JSON ב-<span className="font-space">src/data</span> שבמאגר GitHub.
        </div>

        {/* Continue development from Claude Code */}
        <div className="mb-8 rounded-xl border border-border bg-card px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Github className="w-4 h-4 text-foreground" />
            <h3 className="text-sm font-heebo font-semibold text-foreground">המשך פיתוח מ-Claude Code</h3>
          </div>
          <p className="text-xs text-muted-foreground font-heebo mb-3 leading-relaxed">
            כל הקוד יושב ב-GitHub. כדי להמשיך לעבוד על האפליקציה מ-Claude Code — שכפלי את המאגר ופתחי את התיקייה ב-Claude Code:
          </p>
          <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2 border border-border/40">
            <code className="text-[11px] text-foreground font-space flex-1 overflow-x-auto whitespace-nowrap" dir="ltr">
              {CLONE_CMD}
            </code>
            <button onClick={copyClone} className="shrink-0 text-muted-foreground hover:text-accent transition-colors" title="העתק">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="mt-3">
            <Button variant="outline" size="sm" className="gap-2 font-heebo"
              onClick={() => window.open(REPO_URL, '_blank', 'noopener')}>
              <Github className="w-3.5 h-3.5" />פתח את המאגר ב-GitHub
            </Button>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="RoomGeometry">
            <TabsList className="mb-8 flex flex-wrap h-auto gap-1">
              {Object.entries(CONFIGS).map(([key, cfg]) => (
                <TabsTrigger key={key} value={key} className="font-heebo text-xs">
                  {cfg.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(CONFIGS).map(([key, cfg]) => (
              <TabsContent key={key} value={key}>
                <div className="mb-6">
                  <h2 className="text-lg font-heebo font-bold text-foreground">{cfg.label}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    שינויים כאן משתקפים בממשק בדפדפן זה בלבד (תצוגה מקדימה מקומית).
                  </p>
                </div>
                <EntityManager entityName={key} fields={cfg.fields} />
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}