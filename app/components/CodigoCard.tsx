"use client"

type CodigoCardProps = {
  codigo: any
  onExcluir: (id: number) => void
}

export default function CodigoCard({
  codigo,
  onExcluir,
}: CodigoCardProps) {

  function getEmpresaIcon(nome: string) {
    switch (nome) {
      case "Shopee":
        return "🟠"

      case "Mercado Livre":
        return "🟡"

      case "Amazon":
        return "🟦"

      case "iFood":
        return "🍔"

      case "99":
        return "🚕"

      default:
        return "📦"
    }
  }

  return (
    <div className="codigo-card">

      <div className="codigo-topo">

        <div className="codigo-empresa">
          <span className="empresa-icon">
            {getEmpresaIcon(codigo.empresa)}
          </span>

          <span>
            {codigo.empresa}
          </span>
        </div>

        <button
        className="codigo-excluir"
        onClick={() => onExcluir(codigo.id)}
      >
        🗑 Excluir
      </button>
        </div>

      <div className="codigo-principal">
        {codigo.codigo}
      </div>

      <div className="codigo-status">
        Código ativo
      </div>

    </div>
  )
}