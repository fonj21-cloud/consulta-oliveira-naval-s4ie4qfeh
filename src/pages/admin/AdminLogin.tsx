import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import logoImg from '@/assets/generatedimage_1773618667682-c64bd.png'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@oliveiranaval.com')
  const [password, setPassword] = useState('admin123')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (email && password) {
        login(email, 'Dr. Roberto Naval', 'admin', 'admin1')
        navigate('/admin/dashboard')
        toast({
          title: 'Acesso Restrito Liberado',
          description: 'Bem-vindo ao Painel de Gestão.',
        })
      } else {
        toast({
          title: 'Erro de autenticação',
          description: 'Credenciais inválidas.',
          variant: 'destructive',
        })
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary/95 mix-blend-multiply" />
        <img
          src="https://img.usecurling.com/p/1920/1080?q=law%20office%20desk&color=blue"
          alt="Bg"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <img src={logoImg} alt="Logo" className="h-20 w-auto mx-auto mb-6 object-contain" />
          <h1 className="font-serif text-3xl font-bold text-white mb-2">Portal do Advogado</h1>
          <p className="text-white/70">Acesso restrito à equipe Oliveira Naval.</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">E-mail Corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type="password"
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base gap-2 bg-secondary hover:bg-secondary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Autenticar <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
