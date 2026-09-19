import GlobalHeader from './GlobalHeader';
import ModuleFooter from './ModuleFooter';

export default function ModuleLayout({ moduleNumber, title, subtitle, children }) {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden" dir="rtl">
      <GlobalHeader showBack={true} />
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-3 md:px-6 py-3">
        {children}
      </main>
      <ModuleFooter currentModule={moduleNumber} />
    </div>
  );
}