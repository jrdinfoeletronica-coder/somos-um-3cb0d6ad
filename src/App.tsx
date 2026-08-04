import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Escalas from "./pages/Escalas";
import Membros from "./pages/Membros";
import Repertorio from "./pages/Repertorio";
import Configuracoes from "./pages/Configuracoes";
import CadastroMembro from "./pages/CadastroMembro";
import ResetSenha from "./pages/ResetSenha";
import Comunicacao from "./pages/Comunicacao";
import Relatorios from "./pages/Relatorios";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroMembro />} />
          <Route path="/reset-senha" element={<ResetSenha />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/escalas" element={<Escalas />} />
          <Route path="/membros" element={<Membros />} />
          <Route path="/repertorio" element={<Repertorio />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/comunicacao" element={<Comunicacao />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/perfil" element={<Perfil />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
