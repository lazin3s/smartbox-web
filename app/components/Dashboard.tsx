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
      <section className="dashboard-header">
        <img
          src="/logo-tbox.png"
          alt="Logo T-Box"
          className="dashboard-logo"
        />

      </section>

      <section className="dashboard-content">
        <div className="dashboard-card">
          <div className="dashboard-section-title">
            <span className="dashboard-icon">📦</span>
            <h2>Gerar novo código</h2>
          </div>

          <label className="dashboard-label">
            Selecione a empresa
          </label>

          <select
            value={empresaSelecionada}
            onChange={(e) => setEmpresaSelecionada(e.target.value)}
            className="dashboard-select"
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
            className="dashboard-button"
          >
            + Gerar código
          </button>
        </div>

        <div className="dashboard-status-card">
          <span>▦</span>
          <p>Códigos ativos</p>
          <strong>{codigos.length} / 4</strong>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-section-title">
            <span className="dashboard-icon">📦</span>
            <h2>Seus códigos ativos</h2>
          </div>

          {codigos.length === 0 ? (
            <p className="dashboard-empty">
              Nenhum código ativo no momento.
            </p>
          ) : (
            codigos.map((c) => (
              <CodigoCard
                key={c.id}
                codigo={c}
                onExcluir={excluirCodigo}
              />
            ))
          )}
        </div>
      </section>
    </main>
  )
}