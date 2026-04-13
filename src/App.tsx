
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("gochat_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u: { id: number; username: string; display_name: string; avatar_color: string }) => {
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem("gochat_token");
    localStorage.removeItem("gochat_user");
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/app" element={user ? <Chat user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;