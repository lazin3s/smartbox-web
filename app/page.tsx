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

  const [modoCadastro, setModoCadastro] = useState(false)

  const [validadeSelecionada, setValidadeSelecionada] = useState("5 minutos")
  const [codigos, setCodigos] = useState<any[]>([])

  async function cadastrar() {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      setErro(error.message)
    } else {
      setErro("Conta criada! Agora faça login.")
      setModoCadastro(false)
    }
  }

  async function fazerLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
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
    return Math.random() < 0.5 ? `${letra}${numero}#` : `${numero}${letra}#`
  }

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
    const { data } = await supabase
      .from("test")
      .select("*")
      .eq("usado", false)
      .eq("box_id", boxId)
      .order("id", { ascending: false })

    setCodigos(data || [])
  }

  async function carregarCaixa() {
    if (!user) return

    const { data } = await supabase
      .from("caixas")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (data) setBoxId(data.box_id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user)
        setLogado(true)
      }
    })
  }, [])

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null)
        setLogado(!!session)
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) carregarCaixa()
  }, [user])

  useEffect(() => {
    if (boxId) carregarCodigos()
  }, [boxId])

  async function gerarNovoCodigo() {
    if (ativos.length >= 3) {
      alert("Limite máximo atingido")
      return
    }

    const novoCodigo = gerarCodigoAleatorio()
    const expiracao = calcularExpiracao(validadeSelecionada)

    await supabase.from("test").insert([
      {
        codigo: novoCodigo,
        validade: validadeSelecionada,
        usado: false,
        expira_em: expiracao,
        box_id: boxId,
      },
    ])

    carregarCodigos()
  }

  async function excluirCodigo(id: number) {
    await supabase.from("test").update({ usado: true }).eq("id", id)
    carregarCodigos()
  }

  function estaExpirado(c: any) {
    if (!c.expira_em) return false
    return new Date(c.expira_em) < new Date()
  }

  const ativos = codigos.filter((c) => !estaExpirado(c))
  const expirados = codigos.filter((c) => estaExpirado(c))

  // 🔐 LOGIN / CADASTRO
  if (!logado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {modoCadastro ? "Criar Conta" : "Login"}
          </h1>

          <input
            placeholder="Email"
            className="w-full mb-3 p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Senha"
            type="password"
            className="w-full mb-3 p-3 border rounded-lg"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}

          {modoCadastro ? (
            <>
              <button
                onClick={cadastrar}
                className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg"
              >
                Criar conta
              </button>

              <button
                onClick={() => setModoCadastro(false)}
                className="w-full mt-3 text-sm text-blue-500"
              >
                Já tem conta? Entrar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={fazerLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
              >
                Entrar
              </button>

              <button
                onClick={() => setModoCadastro(true)}
                className="w-full mt-3 text-sm text-gray-600"
              >
                Não tem conta? Criar
              </button>
            </>
          )}
        </div>
      </main>
    )
  }

  // 📦 APP
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Smart Box</h1>

        <select
          value={validadeSelecionada}
          onChange={(e) => setValidadeSelecionada(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
        >
          <option>5 minutos</option>
          <option>30 minutos</option>
          <option>1 hora</option>
          <option>12 horas</option>
          <option>Até usar</option>
        </select>

        <button
          onClick={gerarNovoCodigo}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg mb-4"
        >
          Gerar Código
        </button>

        <h2 className="font-semibold mb-2">Ativos</h2>
        {ativos.map((c) => (
          <div key={c.id} className="bg-green-50 p-3 rounded-lg mb-2">
            <p className="font-bold">{c.codigo}</p>
            <button
              onClick={() => excluirCodigo(c.id)}
              className="text-red-500 text-sm"
            >
              Excluir
            </button>
          </div>
        ))}

        <h2 className="font-semibold mt-4 mb-2">Expirados</h2>
        {expirados.map((c) => (
          <div key={c.id} className="bg-gray-200 p-3 rounded-lg mb-2">
            <p className="font-bold">{c.codigo}</p>
          </div>
        ))}
      </div>
    </main>
  )
}