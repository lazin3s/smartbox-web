"use client"

type LoginFormProps = {
  modoCadastro: boolean
  email: string
  senha: string
  erro: string
  setEmail: (valor: string) => void
  setSenha: (valor: string) => void
  setModoCadastro: (valor: boolean) => void
  cadastrar: () => void
  fazerLogin: () => void
}

export default function LoginForm({
  modoCadastro,
  email,
  senha,
  erro,
  setEmail,
  setSenha,
  setModoCadastro,
  cadastrar,
  fazerLogin,
}: LoginFormProps) {
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

        {erro && (
          <p className="text-red-500 text-sm mb-3">
            {erro}
          </p>
        )}

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