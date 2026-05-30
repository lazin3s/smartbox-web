"use client"
type CodigoCardProps = {
  codigo: any
  onExcluir: (id: number) => void
}

export default function CodigoCard({
  codigo,
  onExcluir,
}: CodigoCardProps) {
  return (
    <div className="bg-green-50 p-3 rounded-lg mb-2">
      <p className="font-bold text-lg">
        {codigo.codigo}
      </p>

      <p className="text-sm text-gray-600">
        {codigo.empresa}
      </p>

      <button
        onClick={() => onExcluir(codigo.id)}
        className="text-red-500 text-sm mt-2"
      >
        Excluir
      </button>
    </div>
  )
}