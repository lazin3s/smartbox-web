"use client"
import "../styles/dashboard.css"
import CodigoCard from "./CodigoCard"

type DashboardProps = {
  empresaSelecionada: string
  setEmpresaSelecionada: (valor: string) => void
  gerarNovoCodigo: () => void
  codigos: any[]
  excluirCodigo: (id: number) => void
}

export default function Dashboard({
  empresaSelecionada,
  setEmpresaSelecionada,
  gerarNovoCodigo,
  codigos,
  excluirCodigo,
}: DashboardProps) {
  return (
    <main className="dashboard-container">
      <div className="dashboard-card">

        <h1 className="dashboard-title">
          Smart Box
        </h1>

        <select
          value={empresaSelecionada}
          onChange={(e) => setEmpresaSelecionada(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
        >
          <option>Shopee</option>
          <option>Mercado Livre</option>
          <option>Amazon</option>
          <option>iFood</option>
          <option>99</option>
          <option>Outros</option>
        </select>

        <button
          onClick={gerarNovoCodigo}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg mb-4"
        >
          Gerar Código
        </button>

        <h2 className="font-semibold mb-2">
          Códigos Ativos
        </h2>

        {codigos.map((c) => (
          <CodigoCard
            key={c.id}
            codigo={c}
            onExcluir={excluirCodigo}
          />
        ))}
      </div>
    </main>
  )
}