import React, { useState, createContext, useContext } from "react";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

// Kontext pro aktuálního uživatele
const UserContext = createContext();

// Předdefinovaní uživatelé
const users = [
    { id: "674ca27e6274e4d6c0c34f91", name: "FirtsUser" },
    { id: "674ca27e6274e4d6c0c34f92", name: "SecondUser" },
    { id: "676826b2bac3fc5627331932", name: "ThirdUser" },
  ];

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(users[0]); // Výchozí uživatel

  const changeUser = (userId) => {
    const newUser = users.find((user) => user.id === userId);
    if (newUser) setCurrentUser(newUser); // Aktualizace aktuálního uživatele
  };

  return (
    <UserContext.Provider value={{ currentUser, changeUser, users }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// Komponenta pro přepínač uživatelů
const UserSwitcher = () => {
    const { currentUser, changeUser, users } = useUser();
    const { theme, toggleTheme } = useTheme(); // Použití ThemeContextu
    const { language, switchLanguage } = useLanguage();
  
    return (
      <div style={{ marginBottom: "20px" }}>
        <h3>
          Aktuální uživatel: {currentUser.name}
        </h3>
        <select
          value={currentUser.id}
          onChange={(e) => changeUser(e.target.value)}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div style={{ marginTop: "10px" }}>
          <button onClick={toggleTheme}>
            {theme === "light" ? "Přepnout na tmavý režim" : "Přepnout na světlý režim"}
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => switchLanguage("en")}>English</button>
          <button onClick={() => switchLanguage("cs")}>Čeština</button>
        </div>
      </div>
    );
  };
  
  export default UserSwitcher;