import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Module1 from './pages/Module1';
import Module2 from './pages/Module2';
import Module3 from './pages/Module3';
import Module4 from './pages/Module4';
import Module5 from './pages/Module5';
import Admin from './pages/Admin';

// Public static app — no authentication. Routes render directly.
function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/module/1" element={<Module1 />} />
          <Route path="/module/2" element={<Module2 />} />
          <Route path="/module/3" element={<Module3 />} />
          <Route path="/module/4" element={<Module4 />} />
          <Route path="/module/5" element={<Module5 />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
