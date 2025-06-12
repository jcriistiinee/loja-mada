import React from "react";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const produtosComPreco = {
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

export default function Vendas() {
  const [dataAtual, setDataAtual] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [quantidades, setQuantidades] = useState({});
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const hoje = new Date();
    const opcoesData = { year: "numeric", month: "2-digit", day: "2-digit" };
    const dia = hoje.toLocaleDateString("pt-BR", opcoesData);
    const diasSemana = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado"
    ];
    setDataAtual(dia);
    setDiaSemana(diasSemana[hoje.getDay()]);

    const dadosSalvos = localStorage.getItem("vendas_diarias");
    if (dadosSalvos) setHistorico(JSON.parse(dadosSalvos));
  }, []);

  function atualizarQuantidade(produto, valor) {
    setQuantidades({ ...quantidades, [produto]: parseInt(valor) || 0 });
  }

  function salvarVendas() {
    const novaVenda = {
      data: dataAtual,
      dia: diaSemana,
      itens: Object.entries(quantidades).map(([produto, qtd]) => ({
        produto,
        quantidade: qtd,
        total: qtd * produtosComPreco[produto]
      }))
    };
    const novoHistorico = [...historico, novaVenda];
    setHistorico(novoHistorico);
    localStorage.setItem("vendas_diarias", JSON.stringify(novoHistorico));
    setQuantidades({});
  }

  function limparPlanilha() {
    setQuantidades({});
    localStorage.removeItem("produtos_adicionados");
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Vendas do dia - {dataAtual} ({diaSemana})</h2>

      <div className="grid gap-2">
        {Object.keys(produtosComPreco).map((produto) => (
          <Card key={produto} className="p-2">
            <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex flex-col">
                <span className="font-medium">{produto}</span>
                <span className="text-sm text-muted-foreground">
                  R$ {produtosComPreco[produto].toFixed(2)}
                </span>
              </div>
              <Input
                type="number"
                min={0}
                value={quantidades[produto] || ""}
                onChange={(e) => atualizarQuantidade(produto, e.target.value)}
                className="w-24"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={salvarVendas} className="w-full">
          Salvar Vendas
        </Button>
        <Button onClick={limparPlanilha} variant="outline" className="w-full">
          Limpar Planilha
        </Button>
      </div>
    </div>
  );
}
