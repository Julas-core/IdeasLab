import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/theme/theme-provider";
import App from "./App.tsx";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" enableSystem={false} attribute="class">
    <App />
  </ThemeProvider>
);