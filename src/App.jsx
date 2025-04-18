import React, { useEffect, useState } from 'react';

export default function App() {
  const [aba, setAba] = useState("encomendas");
  const [encomendas, setEncomendas] = useState(() => {
    return JSON.parse(localStorage.getItem("encomendas") || "[]");
  });

  const [gastos, setGastos] = useState(() => {
    return JSON.parse(localStorage.getItem("gastos") || "[]");
  });

  const [form, setForm] = useState({
    nome: "",
    item: "",
    quantidade: "",
    valor: "",
    pagamento: "",
    data: "",
    status: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("encomendas", JSON.stringify(encomendas));
  }, [encomendas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const adicionar = () => {
    if (editIndex !== null) {
      const nova = [...encomendas];
      nova[editIndex] = form;
      setEncomendas(nova);
      setEditIndex(null);
    } else {
      setEncomendas([...encomendas, form]);
    }
    setForm({
      nome: "",
      item: "",
      quantidade: "",
      valor: "",
      pagamento: "",
      data: "",
      status: "",
    });
  };

  const editar = (index) => {
    setForm(encomendas[index]);
    setEditIndex(index);
  };

  const excluir = (index) => {
    const nova = [...encomendas];
    nova.splice(index, 1);
    setEncomendas(nova);
  };

  const adicionarGasto = () => {
    setGastos([...gastos, form]);
    setForm({
      nome: "",
      item: "",
      quantidade: "",
      valor: "",
      pagamento: "",
      data: "",
      status: "",
    });
  };

  const excluirGasto = (index) => {
    const nova = [...gastos];
    nova.splice(index, 1);
    setGastos(nova);
  };

  const calcularRelatorio = () => {
    let total = 0;
    encomendas.forEach((e) => {
      const val = parseFloat(String(e.valor).replace("R$", "").replace(",", ".")) || 0;
      if (e.pagamento === "50") total += val * 0.5;
      else total += val;
    });
    const gastosTotal = gastos.reduce((acc, g) => {
      const val = parseFloat(String(g.valor).replace("R$", "").replace(",", ".")) || 0;
      return acc + val;
    }, 0);
    return {
      arrecadado: total,
      gastos: gastosTotal,
      lucro: total - gastosTotal,
    };
  };

  const relatorio = calcularRelatorio();

  const listaFiltrada = encomendas.filter((e) => {
    const nomeMatch = e.nome.toLowerCase().includes(filtro.toLowerCase());
    const statusMatch = filtroStatus === "" || e.status === filtroStatus;
    return nomeMatch && statusMatch;
  });

  const corStatus = (status) => {
    switch (status) {
      case "pendente": return "bg-yellow-200";
      case "finalizado": return "bg-blue-200";
      case "entregue": return "bg-green-200";
      default: return "";
    }
  };

  const formatDateToDisplay = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const formatDateToInput = (displayDate) => {
    const [day, month, year] = displayDate.split("-");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 via-white to-blue-100 text-gray-800 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Doces com Amor</h1>

      <div className="flex justify-center gap-4 mb-6">
        {["encomendas", "gastos", "relatorio", "filtro"].map((tab) => (
          <button
            key={tab}
            onClick={() => setAba(tab)}
            className={`px-4 py-2 rounded-full shadow ${aba === tab ? "bg-pink-300" : "bg-white"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {aba === "encomendas" && (
        <>
          <div className="max-w-md mx-auto bg-white p-4 rounded-2xl shadow space-y-2 mb-6">
            <input name="nome" value={form.nome} onChange={handleInput} placeholder="Nome do Cliente" className="input" />
            <input name="item" value={form.item} onChange={handleInput} placeholder="Item" className="input" />
            <input name="quantidade" value={form.quantidade} onChange={handleInput} placeholder="Quantidade" className="input" />
            <input name="valor" value={form.valor} onChange={handleInput} placeholder="R$ 00,00" className="input" />
            <select name="pagamento" value={form.pagamento} onChange={handleInput} className="input">
              <option value="">Selecione Pagamento</option>
              <option value="pago">Pago</option>
              <option value="nao">Não Pago</option>
              <option value="50">Sinal de 50%</option>
            </select>
            <input
              type="date"
              name="data"
              value={form.data ? formatDateToInput(form.data) : ""}
              onChange={(e) => {
                const val = e.target.value;
                setForm((f) => ({ ...f, data: formatDateToDisplay(val) }));
              }}
              className="input"
            />
            <select name="status" value={form.status} onChange={handleInput} className="input">
              <option value="">Selecione Status</option>
              <option value="pendente">Pendente</option>
              <option value="finalizado">Finalizado</option>
              <option value="entregue">Entregue</option>
            </select>
            <button onClick={adicionar} className="w-full bg-pink-400 text-white py-2 rounded-full">
              {editIndex !== null ? "Atualizar" : "Adicionar"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-pink-200 text-left">
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Qtd</th>
                  <th className="px-4 py-2">Valor</th>
                  <th className="px-4 py-2">Pagamento</th>
                  <th className="px-4 py-2">Entrega</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {encomendas.map((e, i) => (
                  <tr key={i} className={corStatus(e.status)}>
                    <td className="px-4 py-2">{e.nome}</td>
                    <td className="px-4 py-2">{e.item}</td>
                    <td className="px-4 py-2">{e.quantidade}</td>
                    <td className="px-4 py-2">R$ {e.valor}</td>
                    <td className="px-4 py-2">{e.pagamento}</td>
                    <td className="px-4 py-2">{e.data}</td>
                    <td className="px-4 py-2">{e.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => editar(i)}>✏️</button>
                      <button onClick={() => excluir(i)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {aba === "gastos" && (
        <div className="max-w-md mx-auto bg-white p-4 rounded-2xl shadow space-y-2">
          <input name="nome" value={form.nome} onChange={handleInput} placeholder="Descrição do Gasto" className="input" />
          <input name="valor" value={form.valor} onChange={handleInput} placeholder="R$ 00,00" className="input" />
          <button onClick={adicionarGasto} className="w-full bg-pink-400 text-white py-2 rounded-full">Adicionar Gasto</button>
          <ul>
            {gastos.map((g, i) => (
              <li key={i} className="flex justify-between py-2 border-b">
                <span>{g.nome}</span>
                <span>R$ {g.valor}</span>
                <button onClick={() => excluirGasto(i)}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {aba === "relatorio" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow text-center space-y-2">
          <h2 className="text-xl font-bold">Relatório Financeiro</h2>
          <p>Total Arrecadado: <strong>R$ {relatorio.arrecadado.toFixed(2)}</strong></p>
          <p>Total de Gastos: <strong>R$ {relatorio.gastos.toFixed(2)}</strong></p>
          <p>Lucro Líquido: <strong>R$ {relatorio.lucro.toFixed(2)}</strong></p>
        </div>
      )}

      {aba === "filtro" && (
        <div className="max-w-md mx-auto bg-white p-4 rounded-2xl shadow space-y-2">
          <input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar por nome" className="input" />
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="input">
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="finalizado">Finalizado</option>
            <option value="entregue">Entregue</option>
          </select>
          <div className="mt-4">
            <h3 className="font-semibold">Resultados:</h3>
            {listaFiltrada.map((e, i) => (
              <div key={i} className="border p-2 my-1 rounded shadow bg-blue-50">
                {e.nome} - {e.status}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = document.createElement("style");
inputStyle.innerHTML = `
  .input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
  }
`;
document.head.appendChild(inputStyle);
