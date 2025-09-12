import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyIdeas from "./pages/MyIdeas";
import IdeaDetail from "./pages/IdeaDetail";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments"; // Import the new Payments page
import { Toaster } from "sonner";
import { SessionContextProvider } from "./integrations/supabase/session-context";
import { ThemeProvider } from "./components/theme/theme-provider";

function App() {
  return (
    <SessionContextProvider>
      <ThemeProvider defaultTheme="dark" attribute="class" enableSystem>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-ideas" element={<MyIdeas />} />
            <Route path="/idea/:id" element={<IdeaDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payments" element={<Payments />} /> {/* New Payments route */}
          </Routes>
        </Router>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default App;