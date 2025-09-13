import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyIdeas from "./pages/MyIdeas";
import IdeaDetail from "./pages/IdeaDetail";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";
import BrowseIdeas from "./pages/BrowseIdeas"; // Import BrowseIdeas
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import { SessionContextProvider } from "./integrations/supabase/session-context";
import { ThemeProvider } from "./components/theme/theme-provider";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <SessionContextProvider>
      <ThemeProvider forcedTheme="dark" attribute="class">
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-ideas" element={<MyIdeas />} />
              <Route path="/idea/:id" element={<IdeaDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/browse-ideas" element={<BrowseIdeas />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default App;