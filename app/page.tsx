"use client"

import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import CodigoCard from "./components/CodigoCard"
import LoginForm from "./components/LoginForm"

export default function Home() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [logado, setLogado] = useState(false)
  const [erro, setErro] = useState("")
  const [user, setUser] = useState<any>(null)
  const [boxId, setBoxId] = useState("")

  const [modoCadastro, setModoCadastro] = useState(false)

  // ✅ EMPRESA
  const [empresaSelecionada, setEmpresaSelecionada] = useState("Shopee")

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

    return Math.random() < 0.5
      ? `${letra}${numero}#`
      : `${numero}${letra}#`
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

    if (codigos.length >= 3) {
      alert("Limite máximo atingido")
      return
    }

    const novoCodigo = gerarCodigoAleatorio()

    await supabase.from("test").insert([
      {
        codigo: novoCodigo,
        empresa: empresaSelecionada,
        usado: false,
        box_id: boxId,
      },
    ])

    carregarCodigos()
  }

  async function excluirCodigo(id: number) {
    await supabase
      .from("test")
      .update({ usado: true })
      .eq("id", id)

    carregarCodigos()
  }

// 🔐 LOGIN / CADASTRO
if (!logado) {
  return (
    <LoginForm
      modoCadastro={modoCadastro}
      email={email}
      senha={senha}
      erro={erro}
      setEmail={setEmail}
      setSenha={setSenha}
      setModoCadastro={setModoCadastro}
      cadastrar={cadastrar}
      fazerLogin={fazerLogin}
    />
  )
}

  // 📦 APP
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-4">
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