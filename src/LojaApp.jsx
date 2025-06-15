import React from "react";
import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import * as XLSX from "xlsx";
import { List, CreditCard, ClipboardList } from "lucide-react";
import { NumericFormat } from "react-number-format"; // ✅ correto
import {
  exportarVendaIndividual,
  exportarTodasVendas,
  limparVendas,
  exportarProducaoIndividual,
  exportarTodaProducao,
  limparProducao,
  exportarTodosFechamentos,
  exportarFechamentoIndividual,
  limparFechamentos,
  categorizarProduto
} from "./utils/relatorioHelpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

export default function LojaApp() {
  const [abaAtiva, setAbaAtiva] = useState("vendas");
  const [quantidades, setQuantidades] = useState({});
  const [quantidadesProducao, setQuantidadesProducao] = useState({});
  const [dataAtual, setDataAtual] = useState("");
  const [detalhesAbertos, setDetalhesAbertos] = useState({});  
  const [caixa, setCaixa] = useState({
    dinheiro: "",
    pixInter: "",
    cartaoPagBank: "",
    pixSantander: "",
    cartaoSantander: "",
  });

  const produtos = [
    "Geladão", "Geladão IFOOD", "Açaí&Sorvete 200ml", "Açaí&Sorvete 300ml", "Açaí&Sorvete 400ml",
    "Açaí&Sorvete 500ml", "Açaí&Sorvete 700ml", "Açaí&Sorvete 300ml IFOOD", "Açaí&Sorvete 500ml IFOOD",
    "Açaí&Sorvete 700ml IFOOD", "Empadão", "Empadão CARNE SECA/ outros", "Pão de Queijo", "Torta Salgada",
    "Sanduíche Natural", "Coca/Refri 200ml", "Guaraviton", "Água com/sem gás 500ml", "Tortinha/bolo de pote",
    "Palha Italiana", "Pudim Copo", "Arroz doce Copo", "Creme de Avelã", "Adicional", "Picole 2",
    "Picolé 3", "Picolé 4", "Paleta ", "Pudim Forma", "Torta /Empadão grande",
    "Bolo de travessa", "Rabanada Recheada", "Rabanada Tradicional", "Salgado"
  ];

  const produtosProducao = [
    "EMPADÃO DE FRANGO", "EMPADÃO DE CARNE SECA", "EMPADÃO DE CALABRESA", "EMPADÃO DE COSTELA",
    "EMPADÃO DE FORMA GRANDE", "GELADÃO DE NINHO C/ NUTELLA", "GELADÃO DE NINHO C/ MORANGO",
    "GELADÃO DE MORANGO C/ NUTELLA", "GELADÃO DE AMENDOIN", "GELADÃO DE COCO", "GELADÃO DE MARACUJÁ",
    "GELADÃO DE FINI", "GELADÃO DE CHOCOLATE", "GELADÃO DE OVOMALTINE", "GELADÃO DE ABACAXI", "GELADÃO DE LIMÃO","PALHA ITALIANA","BOLO DE POTE", "ARROZ DOCE"  
  ];

  useEffect(() => {
    const inicial = {};
    produtos.forEach(p => inicial[p] = 0);
    setQuantidades(inicial);

    const inicialProducao = {};
    produtosProducao.forEach(p => inicialProducao[p] = 0);
    setQuantidadesProducao(inicialProducao);

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const diaSemana = diasSemana[hoje.getDay()];

    const dataAtual = `${diaSemana}, ${dia}/${mes}/${ano}`;

    setDataAtual(dataAtual);
  }, []);

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleValor = (e, campo) => {
    const valor = parseFloat(e.target.value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    setCaixa(prev => ({ ...prev, [campo]: valor }));
  };

  const totalCaixa = Object.values(caixa).reduce((total, val) => total + (parseFloat(val) || 0), 0);

  const salvarFechamento = () => {
    const hoje = new Date();
    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const diaSemana = diasSemana[hoje.getDay()];
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const total =
      Number(caixa.dinheiro || 0) +
      Number(caixa.pixInter || 0) +
      Number(caixa.cartaoPagBank || 0) +
      Number(caixa.pixSantander || 0) +
      Number(caixa.cartaoSantander || 0);

    const novoFechamento = {
      data: dataFormatada,
      diaSemana,
      valores: { ...caixa },
      total
    };

    const fechamentosSalvos = JSON.parse(localStorage.getItem("fechamentos") || "[]");
    const atualizados = [...fechamentosSalvos, novoFechamento];
    localStorage.setItem("fechamentos", JSON.stringify(atualizados));
    alert("Fechamento salvo com sucesso! ✅");
    // Zerar os campos do caixa
    setCaixa({
      dinheiro: "",
      pixInter: "",
      cartaoPagBank: "",
      pixSantander: "",
      cartaoSantander: ""
    });
  };

  const precosProdutos = {
    "Geladão": 5,
    "Geladão IFOOD": 5,
    "Açaí&Sorvete 200ml": 7,
    "Açaí&Sorvete 300ml": 10,
    "Açaí&Sorvete 400ml": 12,
    "Açaí&Sorvete 500ml": 14,
    "Açaí&Sorvete 700ml": 18,
    "Açaí&Sorvete 300ml IFOOD": 10,
    "Açaí&Sorvete 500ml IFOOD": 14,
    "Açaí&Sorvete 700ml IFOOD": 18,
    "Empadão": 10,
    "Empadão CARNE SECA / outros": 15,
    "Pão de Queijo": 5,
    "Torta Salgada": 18,
    "Sanduíche Natural": 8,
    "Coca/Refri 200ml": 3,
    "Guaraviton": 5,
    "Água com/sem gás 500ml": 3,
    "Tortinha / Bolo de pote": 10,
    "Palha Italiana": 7,
    "Pudim Copo": 7,
    "Arroz doce Copo": 5,
    "Creme de Avelã": 6,
    "Adicional": 3,
    "Picolé 2": 2,
    "Picolé 3": 3,
    "Picolé 4": 4,
    "Paleta": 6,
    "Pudim Forma": 35,
    "Torta / Empadão grande": 90,
    "Bolo de travessa": 90,
    "Rabanada Recheada": 10,
    "Rabanada Tradicional": 5,
    "Salgado": 20
  };

  const salvarVendasNoRelatorio = () => {
    const hoje = new Date();
    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const diaSemana = diasSemana[hoje.getDay()];
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const vendasFiltradas = Object.entries(quantidades)
      .filter(([produto, qtd]) => qtd > 0)
      .map(([produto, qtd]) => {
        const preco = precosProdutos[produto] || 0;
        return {
          produto,
          preco,
          quantidade: qtd,
          total: preco * qtd
        };
      });

    const totalGeral = vendasFiltradas.reduce((acc, item) => acc + item.total, 0);

    const novaVenda = {
      data: dataFormatada,
      diaSemana,
      vendas: vendasFiltradas,
      totalGeral
    };

    const vendasSalvas = JSON.parse(localStorage.getItem("vendas") || "[]");
    const atualizadas = [...vendasSalvas, novaVenda];
    localStorage.setItem("vendas", JSON.stringify(atualizadas));
    alert("Vendas salvas com sucesso no relatório! ✅");
    // Zera os campos após salvar
    const resetQuantidades = {};
    produtos.forEach(p => (resetQuantidades[p] = 0));
    setQuantidades(resetQuantidades);
  };

  const salvarProducao = () => {
    const hoje = new Date();
    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const diaSemana = diasSemana[hoje.getDay()];
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Filtra apenas itens com quantidade > 0
    const itens = Object.entries(quantidadesProducao)
      .filter(([produto, qtd]) => qtd > 0)
      .map(([produto, qtd]) => ({ produto, quantidade: qtd }));

    // Agrupa por "classe" (primeira palavra do produto, ou tudo maiúsculo até o primeiro espaço ou /)
    const totalPorClasse = {};
    itens.forEach(item => {
      let classe = item.produto.split(" ")[0].toUpperCase();
      if (classe.includes("/")) classe = classe.split("/")[0];
      totalPorClasse[classe] = (totalPorClasse[classe] || 0) + item.quantidade;
    });

    const novoRegistro = {
      data: dataFormatada,
      diaSemana,
      itens,
      totalPorClasse
    };

    const producaoSalva = JSON.parse(localStorage.getItem("producao") || "[]");
    const atualizadas = [...producaoSalva, novoRegistro];
    localStorage.setItem("producao", JSON.stringify(atualizadas));
    alert("Produção salva com sucesso no relatório! ✅");
  };

  return (
    <div className="min-h-screen w-full bg-purple-50 flex flex-col items-center pt-4 px-2 pb-24">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center flex-col bg-white rounded-xl shadow p-4 mb-4">
          <img src="/lojinha.png" alt="Lojinha com borboletas" className="h-28 object-contain rounded mb-2" />
          <h1 className="text-xl font-bold text-purple-700">@mada_chefinhas 🦋</h1>
          <p className="text-sm text-gray-600 mt-1">{dataAtual}</p>
        </div>

        {abaAtiva === "vendas" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                {produtos.map((produto, index) => (
                  <div key={index} className="flex items-center justify-between border rounded px-3 py-2">
                    <span className="text-sm w-1/2 text-left text-gray-800">{produto}</span>
                    <input
                      type="number"
                      min="0"
                      value={quantidades[produto] ?? ''}
                      onChange={(e) => setQuantidades(prev => ({ ...prev, [produto]: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-16 text-center border border-gray-300 rounded"
                    />
                    <Button onClick={() => setQuantidades(prev => ({ ...prev, [produto]: (prev[produto] || 0) + 1 }))} className="ml-2 bg-green-200 text-[#2c2c2c] border border-green-400">+</Button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={salvarVendasNoRelatorio} className="mt-4 bg-purple-600 text-white w-full">
              Registrar Vendas
            </Button>
          </div>
        )}

        {abaAtiva === "producao" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                {produtosProducao.map((produto, index) => (
                  <div key={index} className="flex items-center justify-between border rounded px-3 py-2">
                    <span className="text-sm w-1/2 text-left text-gray-800">{produto}</span>
                    <input
                      type="number"
                      min="0"
                      value={quantidadesProducao[produto] ?? ''}
                      onChange={(e) => setQuantidadesProducao(prev => ({ ...prev, [produto]: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-16 text-center border border-gray-300 rounded"
                    />
                    <Button onClick={() => setQuantidadesProducao(prev => ({ ...prev, [produto]: (prev[produto] || 0) + 1 }))} className="ml-2 bg-blue-200 text-[#2c2c2c] border border-blue-400">+</Button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => {
                salvarProducao(quantidadesProducao);
                const resetQuantidadesProducao = {};
                produtosProducao.forEach(p => (resetQuantidadesProducao[p] = 0));
                setQuantidadesProducao(resetQuantidadesProducao);
              }}
              className="mt-4 bg-purple-600 text-white w-full"
            >
              Registrar Produção
            </Button>
          </div>
        )}

        {abaAtiva === "caixa" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              
              <div className="flex flex-col gap-3">
                {[ 
                  { label: "Dinheiro", campo: "dinheiro" },
                  { label: "PIX Inter", campo: "pixInter" },
                  { label: "Cartão PagBank", campo: "cartaoPagBank" },
                  { label: "PIX Santander", campo: "pixSantander" },
                  { label: "Cartão Santander", campo: "cartaoSantander" }
                ].map(({ label, campo }) => (
                  <div key={campo} className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 w-32">{label}:</label>
                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator="," 
                      prefix="R$ "
                      allowNegative={false}
                      value={caixa[campo]}
                      onValueChange={(val) =>
                        setCaixa(prev => ({ ...prev, [campo]: val.floatValue || 0 }))
                      }
                      className="text-base p-3 rounded border border-gray-300 flex-1"
                    />
                  </div>
                ))}

                <div className="text-right font-bold text-green-700 mt-4">
                  Total: {formatarMoeda(
                    Number(caixa.dinheiro || 0) +
                    Number(caixa.pixInter || 0) +
                    Number(caixa.cartaoPagBank || 0) +
                    Number(caixa.pixSantander || 0) +
                    Number(caixa.cartaoSantander || 0)
                  )}
                </div>

                <Button
                  onClick={salvarFechamento}
                  className="mt-4 bg-purple-600 text-white w-full"
                >
                  Fechar o Caixa
                </Button>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === "relatorios" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <Tabs defaultValue="fechamentos" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="fechamentos">Fechamentos</TabsTrigger>
                  <TabsTrigger value="vendas">Vendas</TabsTrigger>
                  <TabsTrigger value="producao">Produção</TabsTrigger>
                </TabsList>

                <TabsContent value="fechamentos">
                  <h2 className="text-lg font-bold text-purple-700 mb-2">📅 Relatórios de Fechamento</h2>
                  <Button onClick={exportarTodosFechamentos} className="mb-2 bg-green-600 text-white w-full">⬇️ Exportar Todos</Button>
                  <Button onClick={limparFechamentos} className="mb-4 bg-red-600 text-white w-full">🧼 Limpar Fechamentos</Button>
                  <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                    {JSON.parse(localStorage.getItem("fechamentos") || "[]")
                      .sort((a, b) => new Date(b.data.split('/').reverse()) - new Date(a.data.split('/').reverse()))
                      .map((f, index) => {
                        const estaAberto = detalhesAbertos[`fechamento-${index}`];
                        return (
                          <div key={index} className="border rounded p-3 shadow-sm bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-700">{f.diaSemana} – {f.data}</p>
                                <p className="text-sm text-green-700 font-bold">Total: R$ {f.total.toFixed(2).replace('.', ',')}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => setDetalhesAbertos(prev => ({ ...prev, [`fechamento-${index}`]: !prev[`fechamento-${index}`] }))} className="bg-purple-200 text-purple-800 border border-purple-400">{estaAberto ? "Fechar" : "Detalhes"}</Button>
                                <Button size="sm" onClick={() => exportarFechamentoIndividual(f)} className="bg-green-200 text-green-800 border border-green-400">Exportar</Button>
                              </div>
                            </div>
                            {estaAberto && (
                              <div className="mt-2 text-sm text-gray-700 space-y-1 pl-2 pt-2 border-t border-purple-100">
                                <p>Dinheiro: R$ {Number(f.valores.dinheiro || 0).toFixed(2).replace('.', ',')}</p>
                                <p>PIX Inter: R$ {Number(f.valores.pixInter || 0).toFixed(2).replace('.', ',')}</p>
                                <p>Cartão PagBank: R$ {Number(f.valores.cartaoPagBank || 0).toFixed(2).replace('.', ',')}</p>
                                <p>PIX Santander: R$ {Number(f.valores.pixSantander || 0).toFixed(2).replace('.', ',')}</p>
                                <p>Cartão Santander: R$ {Number(f.valores.cartaoSantander || 0).toFixed(2).replace('.', ',')}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="vendas">
                  <h2 className="text-lg font-bold text-purple-700 mb-2">🛍️ Relatórios de Vendas</h2>
                  <Button onClick={exportarTodasVendas} className="mb-2 bg-green-600 text-white w-full">⬇️ Exportar Todas as Vendas</Button>
                  <Button onClick={limparVendas} className="mb-4 bg-red-600 text-white w-full">🧼 Limpar Vendas</Button>
                  <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                    {JSON.parse(localStorage.getItem("vendas") || "[]")
                      .sort((a, b) => new Date(b.data.split('/').reverse()) - new Date(a.data.split('/').reverse()))
                      .map((venda, index) => {
                        const estaAberto = detalhesAbertos[`venda-${index}`];
                        return (
                          <div key={index} className="border rounded p-3 shadow-sm bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-700">{venda.diaSemana} – {venda.data}</p>
                                <p className="text-sm text-green-700 font-bold">Total: R$ {venda.totalGeral.toFixed(2).replace('.', ',')}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => setDetalhesAbertos(prev => ({ ...prev, [`venda-${index}`]: !prev[`venda-${index}`] }))} className="bg-purple-200 text-purple-800 border border-purple-400">{estaAberto ? "Fechar" : "Detalhes"}</Button>
                                <Button size="sm" onClick={() => exportarVendaIndividual(venda)} className="bg-green-200 text-green-800 border border-green-400">Exportar</Button>
                              </div>
                            </div>
                            {estaAberto && (
                              <div className="mt-2 text-sm text-gray-700 space-y-1 pl-2 pt-2 border-t border-purple-100">
                                {venda.vendas.map((item, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{item.produto} ({item.quantidade}x R$ {item.preco.toFixed(2).replace('.', ',')})</span>
                                    <span>R$ {item.total.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="producao">
                  <h2 className="text-lg font-bold text-purple-700 mb-2">🏭 Relatórios de Produção</h2>
                  <Button onClick={exportarTodaProducao} className="mb-2 bg-green-600 text-white w-full">⬇️ Exportar Toda a Produção</Button>
                  <Button onClick={limparProducao} className="mb-4 bg-red-600 text-white w-full">🧼 Limpar Produção</Button>
                  <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                    {JSON.parse(localStorage.getItem("producao") || "[]")
                      .sort((a, b) => new Date(b.data.split('/').reverse()) - new Date(a.data.split('/').reverse()))
                      .map((registro, index) => {
                        const estaAberto = detalhesAbertos[`producao-${index}`];
                        return (
                          <div key={index} className="border rounded p-3 shadow-sm bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-700">{registro.diaSemana} – {registro.data}</p>
                                <p className="text-sm text-green-700 font-bold">Total por Classe: {Object.entries(registro.totalPorClasse || {}).map(([classe, total]) => (<span key={classe}> {classe}: {total} |</span>))}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => setDetalhesAbertos(prev => ({ ...prev, [`producao-${index}`]: !prev[`producao-${index}`] }))} className="bg-purple-200 text-purple-800 border border-purple-400">{estaAberto ? "Fechar" : "Detalhes"}</Button>
                                <Button size="sm" onClick={() => exportarProducaoIndividual(registro)} className="bg-green-200 text-green-800 border border-green-400">Exportar</Button>
                              </div>
                            </div>
                            {estaAberto && (
                              <div className="mt-2 text-sm text-gray-700 space-y-1 pl-2 pt-2 border-t border-purple-100">
                                {registro.itens.map((item, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{item.produto}</span>
                                    <span>{item.quantidade}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-2 flex justify-center gap-4">
        <div className="flex justify-center max-w-md w-full">
          <Button onClick={() => setAbaAtiva("vendas")} className={`flex flex-col items-center justify-center flex-1 mx-1 ${abaAtiva === "vendas" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}>
            <List className="h-5 w-5" />
            <span className="text-xs">Produtos</span>
          </Button>
          <Button onClick={() => setAbaAtiva("caixa")} className={`flex flex-col items-center justify-center flex-1 mx-1 ${abaAtiva === "caixa" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}>
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Fechamento</span>
          </Button>
          <Button onClick={() => setAbaAtiva("producao")} className={`flex flex-col items-center justify-center flex-1 mx-1 ${abaAtiva === "producao" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}>
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs">Produção</span>
          </Button>
          <Button onClick={() => setAbaAtiva("relatorios")} className={`flex flex-col items-center justify-center flex-1 mx-1 ${abaAtiva === "relatorios" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}>
            <span role="img" aria-label="Relatórios">📊</span>
            <span className="text-xs">Relatórios</span>
          </Button>

        </div>
      </div>
    </div>
  );
}
