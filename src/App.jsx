// App.jsx (sem componentes separados)
import React, { useState } from "react";

export default function App() {
  const [tela, setTela] = useState("encomendas");
  const [encomendas, setEncomendas] = useState([]);
  const [gastos, setGastos] = useState([]);

  // ENCOMENDAS
  const [nome, setNome] = useState("");
  const [itens, setItens] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valor, setValor] = useState("");
  const [pagamento, setPagamento] = useState("naoPago");
  const [dataEntrega, setDataEntrega] = useState("");

  function adicionarEncomenda() {
    const nova = {
      id: Date.now(),
      nome,
      itens,
      quantidade,
      valor: parseFloat(valor),
      pagamento,
      dataEntrega,
    };
    setEncomendas([...encomendas, nova]);
    setNome(""); setItens(""); setQuantidade(1); setValor(""); setPagamento("naoPago"); setDataEntrega("");
  }

  function excluirEncomenda(id) {
    setEncomendas(encomendas.filter(e => e.id !== id));
  }

  function editarEncomenda(id, campo, valor) {
    const atualizadas = encomendas.map(e =>
      e.id === id ? { ...e, [campo]: valor } : e
    );
    setEncomendas(atualizadas);
  }

  // GASTOS
  const [descricao, setDescricao] = useState("");
  const [valorGasto, setValorGasto] = useState("");

  function adicionarGasto() {
    const novo = {
      id: Date.now(),
      descricao,
      valor: parseFloat(valorGasto),
    };
    setGastos([...gastos, novo]);
    setDescricao(""); setValorGasto("");
  }

  function excluirGasto(id) {
    setGastos(gastos.filter(g => g.id !== id));
  }

  // RELATÓRIO
  const totalRecebido = encomendas.reduce((total, e) => {
    if (e.pagamento === "pago") return total + e.valor;
    if (e.pagamento === "sinal") return total + e.valor / 2;
    return total;
  }, 0);
  const totalGastos = gastos.reduce((total, g) => total + g.valor, 0);
  const lucro = totalRecebido - totalGastos;

  return (
    <div className="min-h-screen bg-[#fef6f9] p-4 font-sans text-gray-800">
      <header className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-[#f49ac2]">Doces com Amor Ateliê</h1>
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          <button onClick={() => setTela("encomendas")} className="rounded-xl bg-[#f49ac2] px-4 py-2 text-white shadow hover:bg-[#e687b3]">Encomendas</button>
          <button onClick={() => setTela("gastos")} className="rounded-xl bg-[#b2dffc] px-4 py-2 text-white shadow hover:bg-[#97d0f8]">Gastos</button>
          <button onClick={() => setTela("relatorio")} className="rounded-xl bg-[#a3deb9] px-4 py-2 text-white shadow hover:bg-[#88d0a4]">Relatório</button>
        </div>
      </header>

      <main>
        {tela === "encomendas" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#f49ac2]">Nova Encomenda</h2>
            <input className="input" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input className="input" placeholder="Itens" value={itens} onChange={e => setItens(e.target.value)} />
            <input className="input" type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} />
            <input className="input" type="number" placeholder="Valor Total" value={valor} onChange={e => setValor(e.target.value)} />
            <select className="input" value={pagamento} onChange={e => setPagamento(e.target.value)}>
              <option value="naoPago">Não Pago</option>
              <option value="sinal">50% Sinal</option>
              <option value="pago">Pago Completo</option>
            </select>
            <input className="input" type="date" value={dataEntrega} onChange={e => setDataEntrega(e.target.value)} />
            <button onClick={adicionarEncomenda} className="rounded-xl bg-[#f49ac2] px-4 py-2 text-white shadow hover:bg-[#e687b3]">Adicionar</button>

            <h3 className="mt-6 text-lg font-semibold">Lista de Encomendas</h3>
            <ul className="space-y-2">
              {encomendas.map((e) => (
                <li key={e.id} className="rounded-xl bg-white p-4 shadow">
                  <p><strong>Cliente:</strong> <input className="w-full" value={e.nome} onChange={(ev) => editarEncomenda(e.id, 'nome', ev.target.value)} /></p>
                  <p><strong>Itens:</strong> <input className="w-full" value={e.itens} onChange={(ev) => editarEncomenda(e.id, 'itens', ev.target.value)} /></p>
                  <p><strong>Quantidade:</strong> <input type="number" className="w-full" value={e.quantidade} onChange={(ev) => editarEncomenda(e.id, 'quantidade', parseInt(ev.target.value))} /></p>
                  <p><strong>Valor:</strong> R$<input type="number" className="w-full" value={e.valor} onChange={(ev) => editarEncomenda(e.id, 'valor', parseFloat(ev.target.value))} /></p>
                  <p><strong>Pagamento:</strong>
                    <select className="w-full" value={e.pagamento} onChange={(ev) => editarEncomenda(e.id, 'pagamento', ev.target.value)}>
                      <option value="naoPago">Não Pago</option>
                      <option value="sinal">50% Sinal</option>
                      <option value="pago">Pago Completo</option>
                    </select>
                  </p>
                  <p><strong>Entrega:</strong> <input type="date" className="w-full" value={e.dataEntrega} onChange={(ev) => editarEncomenda(e.id, 'dataEntrega', ev.target.value)} /></p>
                  <button onClick={() => excluirEncomenda(e.id)} className="mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">Excluir</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tela === "gastos" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#8ac0e2]">Novo Gasto</h2>
            <input className="input" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
            <input className="input" type="number" placeholder="Valor" value={valorGasto} onChange={e => setValorGasto(e.target.value)} />
            <button onClick={adicionarGasto} className="rounded-xl bg-[#b2dffc] px-4 py-2 text-white shadow hover:bg-[#97d0f8]">Adicionar</button>

            <h3 className="mt-6 text-lg font-semibold">Lista de Gastos</h3>
            <ul className="space-y-2">
              {gastos.map(g => (
                <li key={g.id} className="rounded-xl bg-white p-4 shadow">
                  <p><strong>Item:</strong> {g.descricao}</p>
                  <p><strong>Valor:</strong> R${g.valor.toFixed(2)}</p>
                  <button onClick={() => excluirGasto(g.id)} className="mt-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">Excluir</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tela === "relatorio" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#7bc89c]">Relatório</h2>
            <p><strong>Total Recebido:</strong> R${totalRecebido.toFixed(2)}</p>
            <p><strong>Total de Gastos:</strong> R${totalGastos.toFixed(2)}</p>
            <p><strong>Lucro:</strong> R${lucro.toFixed(2)}</p>
          </div>
        )}
      </main>
    </div>
  );
}
