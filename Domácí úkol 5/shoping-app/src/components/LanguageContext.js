import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    shoppingListsTitle: "My Shopping Lists",
    addNewList: "Add New List",
    archivedLists: "Archived Shopping Lists",
    viewActiveLists: "View Active Lists",
    addItem: "Add Item",
    removeMember: "Remove",
    leaveList: "Leave List",
  },
  cs: {
    shoppingListsTitle: "Moje nákupní seznamy",
    addNewList: "Přidat nový seznam",
    archivedLists: "Archivované seznamy",
    viewActiveLists: "Zobrazit aktivní seznamy",
    addItem: "Přidat položku",
    removeMember: "Odstranit",
    leaveList: "Opustit seznam",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
