import * as XLSX from "xlsx";

// Utilitário para gerar nome de arquivo padronizado
function gerarNomeArquivo(prefixo) {
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-BR").replace(/\//g, "-");
  const horaFormatada = `${agora.getHours()}h${String(agora.getMinutes()).padStart(2, "0")}min`;
  return `${prefixo}_relatorio_${dataFormatada}_${horaFormatada}.xlsx`;
}

// Função utilitária para categorizar produtos de produção
export const categorizarProduto = (nomeProduto) => {
  const nome = nomeProduto.toUpperCase();
  if (nome.includes("GELADÃO")) return "Geladão";
  if (nome.includes("EMPADÃO")) return "Empadão";
  return "Outros";
};

// 🧾 EXPORTAR TODOS OS FECHAMENTOS
export const exportarTodosFechamentos = () => {
  const fechamentos = JSON.parse(localStorage.getItem("fechamentos") || "[]");
  console.log("Fechamentos carregados:", fechamentos);
  if (!fechamentos.length) return alert("Nenhum fechamento para exportar.");

  const dados = fechamentos.map(f => {
    return {
      "Dia da Semana": f.diaSemana || "",
      "Data Completa": f.data || "",
      "Dinheiro (R$)": `R$ ${parseFloat(f.valores?.dinheiro || 0).toFixed(2)}`,
      "PIX Inter (R$)": `R$ ${parseFloat(f.valores?.pixInter || 0).toFixed(2)}`,
      "Cartão PagBank (R$)": `R$ ${parseFloat(f.valores?.cartaoPagBank || 0).toFixed(2)}`,
      "PIX Santander (R$)": `R$ ${parseFloat(f.valores?.pixSantander || 0).toFixed(2)}`,
      "Cartão Santander (R$)": `R$ ${parseFloat(f.valores?.cartaoSantander || 0).toFixed(2)}`,
      "Total (R$)": `R$ ${(
        Number(f.valores?.dinheiro || 0) +
        Number(f.valores?.pixInter || 0) +
        Number(f.valores?.cartaoPagBank || 0) +
        Number(f.valores?.pixSantander || 0) +
        Number(f.valores?.cartaoSantander || 0)
      ).toFixed(2).replace('.', ',')}`
    };
  });

  console.log("DADOS EXPORTADOS:", dados);

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Fechamentos");
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-BR").replace(/\//g, "-");
  const horaFormatada = `${agora.getHours()}h${String(agora.getMinutes()).padStart(2, "0") }min`;
  const nomeArquivo = `relatorio_${dataFormatada}_${horaFormatada}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
};

// 📄 EXPORTAR FECHAMENTO INDIVIDUAL
export const exportarFechamentoIndividual = (fechamento) => {
  const valores = fechamento.valores || {};
  const total = (
    Number(valores.dinheiro || 0) +
    Number(valores.pixInter || 0) +
    Number(valores.cartaoPagBank || 0) +
    Number(valores.pixSantander || 0) +
    Number(valores.cartaoSantander || 0)
  ).toFixed(2).replace('.', ',');

  const dadosPlanilha = [{
    "Dia da Semana": fechamento.diaSemana || "",
    "Data": fechamento.data || "",
    "Dinheiro (R$)": `R$ ${Number(valores.dinheiro || 0).toFixed(2).replace('.', ',')}`,
    "PIX Inter (R$)": `R$ ${Number(valores.pixInter || 0).toFixed(2).replace('.', ',')}`,
    "Cartão PagBank (R$)": `R$ ${Number(valores.cartaoPagBank || 0).toFixed(2).replace('.', ',')}`,
    "PIX Santander (R$)": `R$ ${Number(valores.pixSantander || 0).toFixed(2).replace('.', ',')}`,
    "Cartão Santander (R$)": `R$ ${Number(valores.cartaoSantander || 0).toFixed(2).replace('.', ',')}`,
    "Total (R$)": `R$ ${total}`,
  }];

  const worksheet = XLSX.utils.json_to_sheet(dadosPlanilha);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Fechamento");

  const nomeArquivo = `fechamento_${(fechamento.data || '').replace(/\//g, "-")}.xlsx`;
  XLSX.writeFile(workbook, nomeArquivo);
};

// 🛍️ EXPORTAR TODAS AS VENDAS
export const exportarTodasVendas = () => {
  const vendas = JSON.parse(localStorage.getItem("vendas") || "[]");
  if (!vendas.length) {
    alert("Nenhuma venda para exportar.");
    return;
  }

  let dados = [];

  vendas.forEach((venda) => {
    // Adiciona cada item da venda
    venda.vendas.forEach((item) => {
      dados.push({
        Produto: item.produto,
        Preço: `R$ ${parseFloat(item.preco).toFixed(2).replace(".", ",")}`,
        Quantidade: item.quantidade,
        Total: `R$ ${parseFloat(item.total).toFixed(2).replace(".", ",")}`
      });
    });

    // Linha de total do dia
    dados.push({
      Produto: `🟣 Total do Dia (${venda.diaSemana} – ${venda.data})`,
      Preço: "",
      Quantidade: "",
      Total: `R$ ${parseFloat(venda.totalGeral).toFixed(2).replace(".", ",")}`
    });

    // Linha em branco entre os dias
    dados.push({});
  });

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vendas");
  XLSX.writeFile(wb, "relatorio-vendas.xlsx");
};

// 📄 EXPORTAR VENDA INDIVIDUAL
export const exportarVendaIndividual = (venda) => {
  const dados = venda.vendas.map(item => ({
    Categoria: categorizarProduto(item.produto),
    Produto: item.produto,
    Preço: `R$ ${parseFloat(item.preco).toFixed(2)}`,
    Quantidade: item.quantidade,
    Total: `R$ ${parseFloat(item.total).toFixed(2)}`
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Venda");
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-BR").replace(/\//g, "-");
  const horaFormatada = `${agora.getHours()}h${String(agora.getMinutes()).padStart(2, "0") }min`;
  const nomeArquivo = `relatorio_${dataFormatada}_${horaFormatada}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
};

// 🏭 EXPORTAR TODA PRODUÇÃO
export const exportarTodaProducao = () => {
  const producoes = JSON.parse(localStorage.getItem("producao") || "[]");
  if (!producoes.length) return alert("Nenhuma produção para exportar.");

  const dados = producoes.flatMap(p =>
    (p.itens || []).map(item => ({
      "Dia da Semana": p.diaSemana || "",
      "Data": p.data || "",
      Categoria: categorizarProduto(item.produto),
      Produto: item.produto,
      Quantidade: item.quantidade
    }))
  );

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Produção");
  XLSX.writeFile(wb, gerarNomeArquivo("producao"));
};

// 📄 EXPORTAR PRODUÇÃO INDIVIDUAL
export const exportarProducaoIndividual = (registro) => {
  const dados = (registro.itens || []).map(item => ({
    Categoria: categorizarProduto(item.produto),
    Produto: item.produto,
    Quantidade: item.quantidade
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Produção");
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-BR").replace(/\//g, "-");
  const horaFormatada = `${agora.getHours()}h${String(agora.getMinutes()).padStart(2, "0") }min`;
  const nomeArquivo = `relatorio_${dataFormatada}_${horaFormatada}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
};

// 🧼 LIMPAR LOCALSTORAGE
export const limparFechamentos = () => {
  if (window.confirm("Deseja apagar todos os fechamentos?")) {
    localStorage.removeItem("fechamentos");
    alert("Fechamentos apagados com sucesso!");
    window.location.reload();
  }
};

export const limparVendas = () => {
  const confirmar = window.confirm("Tem certeza que deseja apagar todas as vendas?");
  if (confirmar) {
    localStorage.removeItem("vendas");
    alert("Todas as vendas foram apagadas! 🧹");
    window.location.reload();
  }
};

export const limparProducao = () => {
  const confirmar = window.confirm("Tem certeza que deseja apagar todos os registros de produção?");
  if (confirmar) {
    localStorage.removeItem("producao");
    alert("Todos os registros de produção foram apagados! 🧹");
    window.location.reload();
  }
};

// TESTE DE COLUNAS XLSX
export const exportarTesteColunas = () => {
  const dados = [
    {
      "Dia da Semana": "Sábado",
      "Data": "14/06/2025",
      "Teste": "FUNCIONOU 🎉"
    }
  ];
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Teste");
  XLSX.writeFile(wb, "teste-colunas.xlsx");
};

// Exemplo de uso padronizado para map de produção agrupando categoria
// const itens = Object.entries(quantidadesProducao)
//   .filter(([produto, qtd]) => qtd > 0)
//   .map(([produto, qtd]) => ({
//     produto,
//     quantidade: qtd,
//     categoria: categorizarProduto(produto)
//   }));
