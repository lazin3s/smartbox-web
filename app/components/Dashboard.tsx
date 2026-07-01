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
  const empresas = [
  { nome: "Shopee", logo: "/logos/shopee.png" },
  { nome: "Mercado Livre", logo: "/logos/mercado-livre.png" },
  { nome: "Amazon", logo: "/logos/amazon.png" },
  { nome: "iFood", logo: "/logos/ifood.png" },
  { nome: "99", logo: "/logos/99.png" },
  { nome: "AliExpress", logo: "/logos/aliexpress.png" },
  { nome: "Shein", logo: "/logos/shein.png" },
  { nome: "Outros", logo: "/logos/caixa.png" },
]
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

          <div className="empresa-grid">
  {empresas.map((empresa) => (
    <button
      key={empresa.nome}
      type="button"
      onClick={() => setEmpresaSelecionada(empresa.nome)}
      className={
        empresaSelecionada === empresa.nome
          ? "empresa-option empresa-option-active"
          : "empresa-option"
      }
    >
      <img src={empresa.logo} alt={empresa.nome} />
    </button>
  ))}
</div>

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