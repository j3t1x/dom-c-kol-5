import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./components/UserSwitcher"; // Kontext pro přepínání uživatelů
import { ThemeProvider } from "./components/ThemeContext"; // Kontext pro světlý/tmavý režim
import { LanguageProvider } from "./components/LanguageContext"; // Kontext pro jazyky
import UserSwitcher from "./components/UserSwitcher"; // Přepínač uživatelů
import ShoppingListsPage from "./components/ShoppingListsPage";
import ShoppingListDetail from "./components/ShoppingListDetail";

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider> {/* Přidání LanguageProvider */}
        <UserProvider>
          <Router>
            <div>
              {/* Přepínač uživatelů jen na hlavní stránce */}
              <Routes>
                <Route path="/shopping-lists" element={<UserSwitcher />} />
              </Routes>

              {/* Definice tras */}
              <Routes>
                {/* Výchozí cesta */}
                <Route path="/" element={<Navigate to="/shopping-lists" replace />} />
                {/* Stránka se seznamy */}
                <Route path="/shopping-lists" element={<ShoppingListsPage />} />
                {/* Detail seznamu */}
                <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
                {/* Fallback pro neexistující trasy */}
                <Route path="*" element={<div>404: Page Not Found</div>} />
              </Routes>
            </div>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
