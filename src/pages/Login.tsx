import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Scale, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API network delay
    setTimeout(() => {
      setIsLoading(false)
      if (email && password) {
        login(email)
        navigate('/dashboard')
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo de volta à sua área do cliente.',
        })
      } else {
        toast({
          title: 'Erro ao fazer login',
          description: 'Por favor, preencha todos os campos.',
          variant: 'destructive',
        })
      }
    }, 800)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">Área do Cliente</h1>
          <p className="text-muted-foreground">Acesse seus processos de forma segura.</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Senha</label>
                  <a
                    href="#"
                    className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base gap-2" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Entrar <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground border-t pt-6">
              Ainda não tem acesso?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-secondary transition-colors"
              >
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
