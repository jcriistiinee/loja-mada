export function Tabs({ children }) {
  return <div>{children}</div>;
}

export function TabsContent({ children }) {
  return <div>{children}</div>;
}

export function TabsList({ children }) {
  return <div>{children}</div>;
}

export function TabsTrigger({ children }) {
  return <button>{children}</button>;
}
<Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
  <TabsList>
    <TabsTrigger value="vendas">Vendas</TabsTrigger>
    {/* Adicione outros TabsTrigger se quiser mais abas */}
  </TabsList>

  <TabsContent value="vendas">
    <Vendas />
  </TabsContent>
</Tabs>

