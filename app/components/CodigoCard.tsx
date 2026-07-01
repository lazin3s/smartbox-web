"use client"

type CodigoCardProps = {
  codigo: any
  onExcluir: (id: number) => void
}

export default function CodigoCard({
  codigo,
  onExcluir,
}: CodigoCardProps) {

const logos: Record<string, string> = {
  Shopee: "/logos/shopee.png",
  "Mercado Livre": "/logos/mercado-livre.png",
  Amazon: "/logos/amazon.png",
  iFood: "/logos/ifood.png",
  "99": "/logos/99.png",
  AliExpress: "/logos/aliexpress.png",
  Shein: "/logos/shein.png",
}

  return (
    <div className="codigo-card">

      <div className="codigo-topo">

       <div className="codigo-empresa">

    <img
        src={logos[codigo.empresa] || "/logos/caixa.png"}
        alt={codigo.empresa}
        className="empresa-logo"
    />

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