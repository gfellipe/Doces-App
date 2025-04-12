import { useState, useEffect } from "react";
import { Plus, Trash2, XCircle, Edit2, Save, X } from "lucide-react";

export default function App() {
  const [encomendas, setEncomendas] = useState(() => JSON.parse(localStorage.getItem("encomendas")) || []);
  const [gastos, setGastos] = useState(() => {
    const dados = JSON.parse(localStorage.getItem("gastos"));
    return Array.isArray(dados) ? dados.filter(g => typeof g.valor === "number") : [];
  });
  const [aba, setAba] = useState("encomendas");
  const [novaEncomenda, setNovaEncomenda] = useState({ nome: "", item: "", quantidade: "", valor: "", pagamento: "nao_pago", dataEntrega: "", status: "pendente" });
  const [novoGasto, setNovoGasto] = useState({ descricao: "", valor: "" });
  const [filtroStatus, setFiltroStatus] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem("encomendas", JSON.stringify(encomendas));
  }, [encomendas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  const formatarValor = (valor) => `R$ ${Number(valor || 0).toFixed(2)}`;

  const handleAddEncomenda = () => {
    if (!novaEncomenda.nome) return;
    const valorNumerico = parseFloat(novaEncomenda.valor.replace("R$", "").replace(",", ".")) || 0;
    const nova = {
      ...novaEncomenda,
      id: Date.now(),
      valor: valorNumerico
    };
    setEncomendas([nova, ...encomendas]);
    setNovaEncomenda({ nome: "", item: "", quantidade: "", valor: "", pagamento: "nao_pago", dataEntrega: "", status: "pendente" });
  };

  const handleRemoveEncomenda = (id) => {
    setEncomendas(encomendas.filter((e) => e.id !== id));
  };

  const handleRemoveGasto = (id) => {
    setGastos(gastos.filter((g) => g.id !== id));
  };

  const handleAddGasto = () => {
    if (!novoGasto.descricao || !novoGasto.valor) return;
    const novo = {
      ...novoGasto,
      id: Date.now(),
      valor: parseFloat(novoGasto.valor.replace("R$", "").replace(",", ".")) || 0
    };
    setGastos([novo, ...gastos]);
    setNovoGasto({ descricao: "", valor: "" });
  };

  const totalArrecadado = encomendas.reduce((acc, e) => {
    if (e.pagamento === "pago") return acc + Number(e.valor || 0);
    if (e.pagamento === "sinal") return acc + Number(e.valor || 0) / 2;
    return acc;
  }, 0);

  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.valor || 0), 0);

  const lucroLiquido = totalArrecadado - totalGastos;

  const encomendasFiltradas = filtroStatus ? encomendas.filter(e => e.status === filtroStatus) : encomendas;

  const handleEditar = (encomenda) => {
    setEditando({ ...encomenda });
  };

  const handleSalvar = () => {
    setEncomendas(encomendas.map(e => e.id === editando.id ? editando : e));
    setEditando(null);
  };

  const handleCancelar = () => {
    setEditando(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-blue-50 to-white text-gray-800 p-4">
      <header className="text-center py-4 text-2xl font-bold text-pink-600">Doces com Amor 🍬</header>

      <nav className="flex gap-4 justify-center my-4">
        <button onClick={() => setAba("encomendas")} className={aba === "encomendas" ? "text-pink-600 font-bold" : "text-gray-500"}>Encomendas</button>
        <button onClick={() => setAba("gastos")} className={aba === "gastos" ? "text-pink-600 font-bold" : "text-gray-500"}>Gastos</button>
        <button onClick={() => setAba("relatorio")} className={aba === "relatorio" ? "text-pink-600 font-bold" : "text-gray-500"}>Relatório</button>
        <button onClick={() => setAba("filtros")} className={aba === "filtros" ? "text-pink-600 font-bold" : "text-gray-500"}>Filtros</button>
      </nav>

      {aba === "encomendas" && (
        <div className="max-w-5xl mx-auto bg-white shadow rounded p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <input value={novaEncomenda.nome} onChange={e => setNovaEncomenda({ ...novaEncomenda, nome: e.target.value })} placeholder="Nome do Cliente" className="border p-2 rounded" />
            <input value={novaEncomenda.item} onChange={e => setNovaEncomenda({ ...novaEncomenda, item: e.target.value })} placeholder="Item" className="border p-2 rounded" />
            <input value={novaEncomenda.quantidade} onChange={e => setNovaEncomenda({ ...novaEncomenda, quantidade: e.target.value })} placeholder="Quantidade" className="border p-2 rounded" />
            <input value={novaEncomenda.valor} onChange={e => setNovaEncomenda({ ...novaEncomenda, valor: e.target.value })} placeholder="Valor (R$)" className="border p-2 rounded" />
            <select value={novaEncomenda.pagamento} onChange={e => setNovaEncomenda({ ...novaEncomenda, pagamento: e.target.value })} className="border p-2 rounded">
              <option value="nao_pago">Não Pago</option>
              <option value="sinal">Sinal (50%)</option>
              <option value="pago">Pago</option>
            </select>
            <input value={novaEncomenda.dataEntrega} onChange={e => setNovaEncomenda({ ...novaEncomenda, dataEntrega: e.target.value })} type="date" className="border p-2 rounded" />
            <select value={novaEncomenda.status} onChange={e => setNovaEncomenda({ ...novaEncomenda, status: e.target.value })} className="border p-2 rounded">
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </select>
            <button onClick={handleAddEncomenda} className="bg-pink-500 text-white rounded px-4 py-2 col-span-2 md:col-span-1">Adicionar</button>
          </div>

          <table className="w-full text-left border-t">
            <thead>
              <tr>
                <th className="p-2">Cliente</th>
                <th>Item</th>
                <th>Qtd</th>
                <th>Valor</th>
                <th>Pagamento</th>
                <th>Entrega</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {encomendasFiltradas.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-2">{e.nome}</td>
                  <td>{e.item}</td>
                  <td>{e.quantidade}</td>
                  <td>{formatarValor(e.valor)}</td>
                  <td>{e.pagamento}</td>
                  <td>{e.dataEntrega}</td>
                  <td>{e.status}</td>
                  <td className="flex gap-2">
                    <button onClick={() => handleEditar(e)} className="text-blue-500"><Edit2 size={16} /></button>
                    <button onClick={() => handleRemoveEncomenda(e.id)} className="text-red-500"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "gastos" && (
        <div className="max-w-xl mx-auto bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Adicionar Gasto</h2>
          <div className="flex gap-2 mb-4">
            <input value={novoGasto.descricao} onChange={e => setNovoGasto({ ...novoGasto, descricao: e.target.value })} placeholder="Descrição" className="border p-2 rounded w-full" />
            <input value={novoGasto.valor} onChange={e => setNovoGasto({ ...novoGasto, valor: e.target.value })} placeholder="Valor (R$)" className="border p-2 rounded w-full" />
            <button onClick={handleAddGasto} className="bg-pink-500 text-white rounded px-4 py-2">Adicionar</button>
          </div>
          <ul>
            {gastos.map((g) => (
              <li key={g.id} className="flex justify-between border-b py-2">
                <span>{g.descricao} - {formatarValor(g.valor)}</span>
                <button onClick={() => handleRemoveGasto(g.id)} className="text-red-500"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {aba === "relatorio" && (
        <div className="max-w-xl mx-auto bg-white shadow rounded p-4 text-center">
          <h2 className="text-lg font-semibold mb-4">Relatório Financeiro</h2>
          <p><strong>Total Arrecadado:</strong> {formatarValor(totalArrecadado)}</p>
          <p><strong>Total de Gastos:</strong> {formatarValor(totalGastos)}</p>
          <p><strong>Lucro Líquido:</strong> {formatarValor(lucroLiquido)}</p>
        </div>
      )}

      {aba === "filtros" && (
        <div className="max-w-xl mx-auto bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Filtrar Encomendas</h2>
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="border p-2 rounded w-full">
            <option value="">Todas</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
      )}
    </div>
  );
}
