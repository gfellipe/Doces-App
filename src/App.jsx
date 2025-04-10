import { useState, useEffect } from "react";
import { Search, Plus, Trash, Pencil, Check, ShoppingBag } from "lucide-react";

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState("encomendas");
  const [encomendas, setEncomendas] = useState(() => JSON.parse(localStorage.getItem("encomendas")) || []);
  const [gastos, setGastos] = useState(() => JSON.parse(localStorage.getItem("gastos")) || []);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  useEffect(() => {
    localStorage.setItem("encomendas", JSON.stringify(encomendas));
  }, [encomendas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const alertaEntregas = encomendas.filter(
      (e) => e.status !== "entregue" && e.dataEntrega <= hoje
    );
    if (alertaEntregas.length > 0) {
      const nomes = alertaEntregas.map((e) => e.nome).join(", ");
      alert(`Entregas pendentes para hoje ou atrasadas: ${nomes}`);
    }
  }, []);

  const encomendasFiltradas = encomendas
    .filter((e) =>
      e.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (statusFiltro === "todos" || e.status === statusFiltro)
    )
    .sort((a, b) => new Date(a.dataEntrega) - new Date(b.dataEntrega));

  const encomendasPaginadas = encomendasFiltradas.slice(0, pagina * porPagina);

  const novaEncomenda = {
    id: Date.now(),
    nome: "",
    itens: "",
    quantidade: 1,
    valor: 0,
    status: "nao_pago",
    dataEntrega: new Date().toISOString().split("T")[0],
  };

  function atualizarEncomenda(id, campo, valor) {
    setEncomendas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [campo]: valor } : e))
    );
  }

  function removerEncomenda(id) {
    const confirmar = confirm("Tem certeza que deseja remover esta encomenda?");
    if (confirmar) {
      setEncomendas((prev) => prev.filter((e) => e.id !== id));
    }
  }

  function adicionarGasto() {
    const novo = { id: Date.now(), descricao: "", valor: 0, categoria: "geral" };
    setGastos([novo, ...gastos]);
  }

  function atualizarGasto(id, campo, valor) {
    setGastos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [campo]: valor } : g))
    );
  }

  function removerGasto(id) {
    const confirmar = confirm("Remover este gasto?");
    if (confirmar) {
      setGastos((prev) => prev.filter((g) => g.id !== id));
    }
  }

  const totalArrecadado = encomendas
    .filter((e) => e.status === "pago" || e.status === "entregue")
    .reduce((soma, e) => soma + Number(e.valor || 0), 0);

  const totalGastos = gastos.reduce((soma, g) => soma + Number(g.valor || 0), 0);

  const lucroLiquido = totalArrecadado - totalGastos;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-blue-50 to-white text-gray-800">
      <header className="text-center py-4 text-2xl font-bold text-pink-600">
        Doces com Amor 🍬
      </header>

      {abaAtiva === "encomendas" && (
        <div className="px-4 pb-24">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Buscar por nome..."
              className="w-full border rounded px-3 py-2"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button
              className="bg-pink-300 hover:bg-pink-400 text-white px-3 py-2 rounded"
              onClick={() => setEncomendas([novaEncomenda, ...encomendas])}
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {['todos','nao_pago','sinal','pago','entregue'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFiltro(st)}
                className={`px-3 py-1 rounded ${statusFiltro === st ? "bg-pink-400 text-white" : "bg-white border"}`}
              >
                {st === 'todos' ? 'Todos' : st === 'nao_pago' ? 'Não pago' : st === 'sinal' ? '50% Sinal' : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>

          {encomendasPaginadas.map((e) => (
            <div key={e.id} className="mb-4 rounded-lg bg-white p-4 shadow">
              <input
                value={e.nome}
                onChange={(ev) => atualizarEncomenda(e.id, "nome", ev.target.value)}
                className="font-semibold text-lg w-full mb-1"
                placeholder="Nome do cliente"
              />
              <input
                value={e.itens}
                onChange={(ev) => atualizarEncomenda(e.id, "itens", ev.target.value)}
                className="w-full border px-2 py-1 mb-1"
                placeholder="Itens"
              />
              <div className="flex gap-2 mb-1">
                <input
                  type="number"
                  value={e.quantidade}
                  onChange={(ev) => atualizarEncomenda(e.id, "quantidade", ev.target.value)}
                  className="w-1/3 border px-2 py-1"
                  placeholder="Qtd"
                />
                <input
                  type="number"
                  value={e.valor}
                  onChange={(ev) => atualizarEncomenda(e.id, "valor", ev.target.value)}
                  className="w-1/3 border px-2 py-1"
                  placeholder="Valor total"
                />
                <input
                  type="date"
                  value={e.dataEntrega}
                  onChange={(ev) => atualizarEncomenda(e.id, "dataEntrega", ev.target.value)}
                  className="w-1/3 border px-2 py-1"
                />
              </div>
              <select
                value={e.status}
                onChange={(ev) => atualizarEncomenda(e.id, "status", ev.target.value)}
                className="w-full border px-2 py-1 mb-2"
              >
                <option value="nao_pago">Não pago</option>
                <option value="sinal">50% Sinal</option>
                <option value="pago">Pago</option>
                <option value="entregue">Entregue</option>
              </select>
              <button
                onClick={() => removerEncomenda(e.id)}
                className="text-red-500 flex items-center gap-1"
              >
                <Trash size={16} /> Remover
              </button>
            </div>
          ))}

          {encomendasPaginadas.length < encomendasFiltradas.length && (
            <button
              onClick={() => setPagina((p) => p + 1)}
              className="w-full text-center py-2 bg-blue-100 rounded mb-4"
            >
              Ver mais
            </button>
          )}
        </div>
      )}

      {abaAtiva === "gastos" && (
        <div className="px-4 pb-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gastos</h2>
            <button onClick={adicionarGasto} className="bg-pink-300 hover:bg-pink-400 text-white px-3 py-1 rounded">
              <Plus size={18} />
            </button>
          </div>
          {gastos.length === 0 && <p className="text-gray-500">Nenhum gasto ainda.</p>}
          {gastos.map((g) => (
            <div key={g.id} className="bg-white rounded shadow p-3 mb-3">
              <input
                value={g.descricao}
                onChange={(e) => atualizarGasto(g.id, "descricao", e.target.value)}
                className="w-full mb-1 font-medium"
                placeholder="Descrição"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={g.valor}
                  onChange={(e) => atualizarGasto(g.id, "valor", e.target.value)}
                  className="w-1/2 border px-2 py-1"
                  placeholder="Valor"
                />
                <input
                  value={g.categoria}
                  onChange={(e) => atualizarGasto(g.id, "categoria", e.target.value)}
                  className="w-1/2 border px-2 py-1"
                  placeholder="Categoria"
                />
              </div>
              <button
                onClick={() => removerGasto(g.id)}
                className="text-red-500 flex items-center gap-1 mt-2"
              >
                <Trash size={16} /> Remover
              </button>
            </div>
          ))}
        </div>
      )}

      {abaAtiva === "relatorio" && (
        <div className="px-4 pb-24">
          <h2 className="text-xl font-bold text-center mb-4">Relatório Financeiro</h2>
          <div className="bg-white rounded shadow p-4 text-lg space-y-2">
            <p><strong>Total arrecadado:</strong> R$ {totalArrecadado.toFixed(2)}</p>
            <p><strong>Total de gastos:</strong> R$ {totalGastos.toFixed(2)}</p>
            <p><strong>Lucro líquido:</strong> R$ {lucroLiquido.toFixed(2)}</p>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 w-full flex justify-around bg-white shadow-md py-2 border-t z-50">
        <button
          onClick={() => setAbaAtiva("encomendas")}
          className={`flex flex-col items-center ${abaAtiva === "encomendas" ? "text-pink-500" : "text-gray-400"}`}
        >
          <ShoppingBag size={20} /> Encomendas
        </button>
        <button
          onClick={() => setAbaAtiva("gastos")}
          className={`flex flex-col items-center ${abaAtiva === "gastos" ? "text-pink-500" : "text-gray-400"}`}
        >
          <Trash size={20} /> Gastos
        </button>
        <button
          onClick={() => setAbaAtiva("relatorio")}
          className={`flex flex-col items-center ${abaAtiva === "relatorio" ? "text-pink-500" : "text-gray-400"}`}
        >
          <Check size={20} /> Relatório
        </button>
      </nav>
    </div>
  );
}
