// components/ui/tabs.jsx
import React from "react";

const TabsContext = React.createContext({ abaAtiva: null, setAbaAtiva: () => {} });

export function Tabs({ children, abaAtiva, setAbaAtiva }) {
  const [active, setActive] = React.useState(abaAtiva || null);
  const contextValue = React.useMemo(
    () => ({
      abaAtiva: abaAtiva !== undefined ? abaAtiva : active,
      setAbaAtiva: setAbaAtiva || setActive,
    }),
    [abaAtiva, active, setAbaAtiva]
  );
  return (
    <TabsContext.Provider value={contextValue}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }) {
  return <div className="flex gap-2 mb-4">{children}</div>;
}

export function TabsTrigger({ value, children }) {
  const { abaAtiva, setAbaAtiva } = React.useContext(TabsContext);
  const isActive = abaAtiva === value;
  return (
    <button
      onClick={() => setAbaAtiva(value)}
      className={`px-3 py-1 rounded ${
        isActive ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-800"
      }`}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const { abaAtiva } = React.useContext(TabsContext);
  if (abaAtiva !== value) return null;
  return <div>{children}</div>;
}
