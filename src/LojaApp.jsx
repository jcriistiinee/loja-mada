import React from "react";
import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import * as XLSX from "xlsx";
import { List, CreditCard, ClipboardList } from "lucide-react";
import Vendas from "./components/Vendas"; // ajuste o caminho conforme sua pasta


export default function LojaApp() {
  const [abaAtiva, setAbaAtiva] = useState("vendas");
  const [quantidades, setQuantidades] = useState({});
  const [quantidadesProducao, setQuantidadesProducao] = useState({});
  const [dataAtual, setDataAtual] = useState("");
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
    "Palha Italiana", "Pudim Copo", "Arroz doce Copo", "Creme de Avelã", "Adicional", "Picole - R$2,00",
    "Picolé  - R$3,00", "Picolé  - R$4,00", "Paleta  - R$6,00", "Pudim Forma", "Torta /Empadão grande",
    "Bolo de travessa", "Rabanada Recheada", "Rabanada Tradicional", "Salgado"
  ];

  const produtosProducao = [
    "EMPADÃO DE FRANGO", "EMPADÃO DE CARNE SECA", "EMPADÃO DE CALABRESA", "EMPADÃO DE COSTELA",
    "EMPADÃO DE FORMA GRANDE", "GELADÃO DE NINHO C/ NUTELLA", "GELADÃO DE NINHO C/ MORANGO",
    "GELADÃO DE MORANGO C/ NUTELLA", "GELADÃO DE AMENDOIN", "GELADÃO DE COCO", "GELADÃO DE MARACUJÁ",
    "GELADÃO DE FINI", "GELADÃO DE CHOCOLATE", "GELADÃO DE OVOMALTINE", "GELADÃO DE ABACAXI", "GELADÃO DE LIMÃO"
  ];

  useEffect(() => {
    const inicial = {};
    produtos.forEach(p => inicial[p] = 0);
    setQuantidades(inicial);

    const inicialProducao = {};
    produtosProducao.forEach(p => inicialProducao[p] = 0);
    setQuantidadesProducao(inicialProducao);

    const hoje = new Date();
    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const diaSemana = diasSemana[hoje.getDay()];
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    setDataAtual(`${diaSemana}, ${dia}/${mes}/${ano}`);
  }, []);

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleValor = (e, campo) => {
    const valor = parseFloat(e.target.value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    setCaixa(prev => ({ ...prev, [campo]: valor }));
  };

  const totalCaixa = Object.values(caixa).reduce((total, val) => total + (parseFloat(val) || 0), 0);

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
          </div>
        )}

        {abaAtiva === "caixa" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex flex-col gap-3">
                <Input placeholder="Dinheiro" type="text" defaultValue={formatarMoeda(caixa.dinheiro)} onBlur={(e) => handleValor(e, "dinheiro")} className="text-base p-3 rounded" />
                <Input placeholder="PIX Inter" type="text" defaultValue={formatarMoeda(caixa.pixInter)} onBlur={(e) => handleValor(e, "pixInter")} className="text-base p-3 rounded" />
                <Input placeholder="Cartão PagBank" type="text" defaultValue={formatarMoeda(caixa.cartaoPagBank)} onBlur={(e) => handleValor(e, "cartaoPagBank")} className="text-base p-3 rounded" />
                <Input placeholder="PIX Santander" type="text" defaultValue={formatarMoeda(caixa.pixSantander)} onBlur={(e) => handleValor(e, "pixSantander")} className="text-base p-3 rounded" />
                <Input placeholder="Cartão Santander" type="text" defaultValue={formatarMoeda(caixa.cartaoSantander)} onBlur={(e) => handleValor(e, "cartaoSantander")} className="text-base p-3 rounded" />
                <div className="text-right font-bold text-green-700">Total: {formatarMoeda(totalCaixa)}</div>
                <Button onClick={() => console.log("Exportar caixa")} className="mt-4 bg-purple-600 text-white w-full">Fechar o Caixa</Button>
              </div>
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
        </div>
      </div>
    </div>
  );
}
