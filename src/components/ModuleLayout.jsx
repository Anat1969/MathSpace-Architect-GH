import GlobalHeader from './GlobalHeader';
import ModuleFooter from './ModuleFooter';
import { motion } from 'framer-motion';

export default function ModuleLayout({ moduleNumber, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <GlobalHeader showBack={true} />
      <motion.main
        className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 flex-1 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <ModuleFooter currentModule={moduleNumber} />
    </div>
  );
}