"use client"

import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export default function Home() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [logado, setLogado] = useState(false)
  const [erro, setErro] = useState("")

  const [validadeSelecionada, setValidadeSelecionada] = useState("5 minutos")
  const [codigos, setCodigos] = useState<any[]>([])

  const [caixas, setCaixas] = useState<any[]>([])
  const [caixaSelecionada, setCaixaSelecionada] = useState<any>(null)

  function fazerLogin() {
    if (email === "admin@smartbox.com" && senha === "123456") {
      setLogado(true)
      setErro("")
    } else {
      setErro("E-mail ou senha inválidos")
    }
  }

  function gerarCodigoAleatorio() {
    const letras = ["A", "B", "C", "D"]
    const numero = Math.floor(100 + Math.random() * 900).toString()
    const letra = letras[Math.floor(Math.random() * letras.length)]
    const letraNoInicio = Math.random() < 0.5

    return letraNoInicio
      ? `${letra}${numero}#`
      : `${numero}${letra}#`
  }

  function calcularExpiracao(validade) {
    const agora = new Date()

    if (validade === "5 minutos") {
      agora.setMinutes(agora.getMinutes() + 5)
    } else if (validade === "30 minutos") {
      agora.setMinutes(agora.getMinutes() + 30)
    } else if (validade === "1 hora") {
      agora.setHours(agora.getHours() + 1)
    } else if (validade === "12 horas") {
      agora.setHours(agora.getHours() + 12)
    } else {
      return null
    }

    return agora.toISOString()
  }

  function codigoExpirado(expira_em) {
    if (!expira_em) return false

    const agora = new Date()
    const expira = new Date(expira_em)

    return agora > expira
  }

  async function carregarCaixas() {
    const { data, error } = await supabase
      .from("caixas")
      .select("*")

    if (error) {
      console.log("Erro ao buscar caixas:", error)
    } else {
      setCaixas(data || [])
    }
  }

  async function carregarCodigos() {
    if (!caixaSelecionada) return

    const { data, error } = await supabase
      .from("test")
      .select("*")
      .eq("usado", false)
      .eq("box_id", caixaSelecionada.box_id)
      .order("id", { ascending: false })

    if (error) {
      console.log("Erro ao buscar códigos:", error)
    } else {
      setCodigos(data || [])
    }
  }

  useEffect(() => {
    if (logado) carregarCaixas()
  }, [logado])

  useEffect(() => {
    if (caixaSelecionada) carregarCodigos()
  }, [caixaSelecionada])

  async function gerarNovoCodigo() {
    if (codigos.length >= 3) {
      alert("Limite máximo de 3 códigos ativos atingido.")
      return
    }

    const novoCodigo = gerarCodigoAleatorio()

    const { error } = await supabase.from("test").insert([
      {
        codigo: novoCodigo,
        validade: validadeSelecionada,
        usado: false,
        status: "fechada",
        box_id: caixaSelecionada.box_id,
        expira_em: calcularExpiracao(validadeSelecionada),
      },
    ])

    if (error) {
      console.log("Erro ao salvar código:", error)
      alert("Erro ao salvar código")
    } else {
      carregarCodigos()
    }
  }

  async function excluirCodigo(id: number) {
    const { error } = await supabase
      .from("test")
      .update({ usado: true })
      .eq("id", id)

    if (error) {
      alert("Erro ao excluir código")
    } else {
      carregarCodigos()
    }
  }

  // LOGIN
  if (!logado) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h1 className="text-xl font-bold mb-4">Login</h1>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={(e) => setSenha(e.target.value)}
            className="border p-2 mb-2 w-full"
          />

          {erro && <p className="text-red-500">{erro}</p>}

          <button onClick={fazerLogin} className="bg-blue-500 text-white p-2 w-full">
            Entrar
          </button>
        </div>
      </main>
    )
  }

  // ESCOLHER CAIXA
  if (!caixaSelecionada) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-4">Escolha sua caixa</h2>

          {caixas.length === 0 ? (
            <p>Nenhuma caixa encontrada</p>
          ) : (
            caixas.map((caixa) => (
              <button
                key={caixa.id}
                onClick={() => setCaixaSelecionada(caixa)}
                className="block w-full mb-2 p-3 bg-blue-500 text-white rounded-lg"
              >
                {caixa.nome} ({caixa.box_id})
              </button>
            ))
          )}
        </div>
      </main>
    )
  }

  // PAINEL
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-xl font-bold mb-2">Painel</h1>

        <p className="mb-2">Caixa: {caixaSelecionada.box_id}</p>

        <button
          onClick={() => setCaixaSelecionada(null)}
          className="text-blue-500 mb-4"
        >
          Trocar caixa
        </button>

        <select
          value={validadeSelecionada}
          onChange={(e) => setValidadeSelecionada(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option>5 minutos</option>
          <option>30 minutos</option>
          <option>1 hora</option>
          <option>12 horas</option>
          <option>Até usar</option>
        </select>

        <button
          onClick={gerarNovoCodigo}
          className="bg-green-500 text-white p-2 w-full mb-4"
        >
          Gerar código
        </button>

        {codigos.map((c) => {
          const expirado = codigoExpirado(c.expira_em)

          return (
            <div key={c.id} className="border p-2 mb-2">
              <p className="font-bold">{c.codigo}</p>

              <p style={{ color: expirado ? "red" : "green" }}>
                {expirado ? "Expirado" : "Ativo"}
              </p>

              <button onClick={() => excluirCodigo(c.id)}>
                Excluir
              </button>
            </div>
          )
        })}
      </div>
    </main>
  )
}