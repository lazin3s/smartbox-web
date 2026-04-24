"use client"

import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export default function Home() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [logado, setLogado] = useState(false)
  const [erro, setErro] = useState("")
  const [user, setUser] = useState<any>(null)
  const [boxId, setBoxId] = useState("")

  const [validadeSelecionada, setValidadeSelecionada] = useState("5 minutos")
  const [codigos, setCodigos] = useState<any[]>([])

 async function fazerLogin() {
  async function cadastrar() {
  const { error } = await supabase.auth.signUp({
    email: email,
    password: senha,
  })

  if (error) {
    setErro("Erro ao cadastrar")
    console.log(error)
  } else {
    setErro("Cadastro realizado! Verifique seu email.")
  }
}
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  })

  if (error) {
    setErro("E-mail ou senha inválidos")
  } else {
    setLogado(true)
    setErro("")
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

  // ✅ CORRIGIDO (TypeScript)
  function calcularExpiracao(validade: string) {
    const agora = new Date()

    if (validade === "5 minutos") agora.setMinutes(agora.getMinutes() + 5)
    if (validade === "30 minutos") agora.setMinutes(agora.getMinutes() + 30)
    if (validade === "1 hora") agora.setHours(agora.getHours() + 1)
    if (validade === "12 horas") agora.setHours(agora.getHours() + 12)

    if (validade === "Até usar") return null

    return agora.toISOString()
  }

  async function carregarCodigos() {
    const { data, error } = await supabase
      .from("test")
      .select("*")
      .eq("usado", false)
      .eq("box_id", boxId)
      .order("id", { ascending: false })

    if (error) {
      console.log(error)
    } else {
      setCodigos(data || [])
    }
  }

  async function carregarCaixa() {
  if (!user) return

  const { data, error } = await supabase
    .from("caixas")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.log("Erro ao buscar caixa:", error)
  } else {
    console.log("CAIXA:", data)
    setBoxId(data.box_id)
    }
  }

 useEffect(() => {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      setUser(session.user)
      setLogado(true)
      console.log("Sessão restaurada:", session.user)
    }
  }

  getSession()
}, [])

useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null)
      setLogado(!!session)
    }
  )

  return () => {
    listener.subscription.unsubscribe()
  }
}, [])

  useEffect(() => {
  if (user) {
    carregarCaixa()
  }
}, [user])

  async function gerarNovoCodigo() {
    console.log("BOX ID NA HORA DE SALVAR:", boxId)
    if (ativos.length >= 3) {
      alert("Limite máximo de 3 códigos ativos atingido.")
      return
    }

    const novoCodigo = gerarCodigoAleatorio()
    const expiracao = calcularExpiracao(validadeSelecionada)

    const { error } = await supabase.from("test").insert([
      {
        codigo: novoCodigo,
        validade: validadeSelecionada,
        usado: false,
        expira_em: expiracao,
        box_id: boxId,
      },
    ])

    if (error) {
      console.log(error)
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

    if (!error) carregarCodigos()
  }

  function estaExpirado(codigo: any) {
    if (!codigo.expira_em) return false
    return new Date(codigo.expira_em) < new Date()
  }

  const ativos = codigos.filter((c) => !estaExpirado(c))
  const expirados = codigos.filter((c) => estaExpirado(c))

  if (!logado) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow w-80">
          <h1 className="text-xl font-bold mb-4 text-center">Smart Box</h1>

          <input
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Senha"
            type="password"
            className="w-full mb-3 p-2 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <button
            onClick={fazerLogin}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Entrar
          </button>

          <button
            onClick={cadastrar}
            className="w-full bg-gray-500 text-white p-2 rounded mt-2"
>
          Criar conta
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Smart Box</h1>

      <select
        value={validadeSelecionada}
        onChange={(e) => setValidadeSelecionada(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option>5 minutos</option>
        <option>30 minutos</option>
        <option>1 hora</option>
        <option>12 horas</option>
        <option>Até usar</option>
      </select>

      <button
        onClick={gerarNovoCodigo}
        className="w-full bg-green-500 text-white p-2 rounded mb-4"
      >
        Gerar Código
      </button>

      {/* ATIVOS */}
      <h2 className="font-bold mb-2">Códigos Ativos</h2>
      {ativos.map((c) => (
        <div key={c.id} className="border p-2 mb-2 rounded">
          <p className="font-bold">{c.codigo}</p>
          <p style={{ color: "green" }}>Ativo</p>
          <button onClick={() => excluirCodigo(c.id)}>Excluir</button>
        </div>
      ))}

      {/* EXPIRADOS */}
      <h2 className="font-bold mt-4 mb-2">Expirados</h2>
      {expirados.map((c) => (
        <div key={c.id} className="border p-2 mb-2 rounded">
          <p className="font-bold">{c.codigo}</p>
          <p style={{ color: "red" }}>Expirado</p>
        </div>
      ))}
    </main>
  )
}