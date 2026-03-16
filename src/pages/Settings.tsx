import { useState } from 'react'
import { Bell, Mail, Smartphone, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()

  const [phone, setPhone] = useState(user?.phone || '')
  const [emailNotif, setEmailNotif] = useState(user?.notifications.email ?? true)
  const [whatsappNotif, setWhatsappNotif] = useState(user?.notifications.whatsapp ?? true)

  const handleSave = () => {
    updateProfile({
      phone,
      notifications: { email: emailNotif, whatsapp: whatsappNotif },
    })
    toast({
      title: 'Configurações salvas',
      description: 'Suas preferências de notificação foram atualizadas com sucesso.',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu perfil e preferências de notificação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div
            className="md:col-span-1 space-y-2 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <nav className="flex flex-col space-y-1">
              <button className="bg-primary text-primary-foreground font-medium px-4 py-3 rounded-lg flex items-center gap-3 text-left w-full shadow-sm">
                <Bell className="w-5 h-5" /> Notificações
              </button>
            </nav>
          </div>

          <div
            className="md:col-span-3 space-y-6 animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Preferências de Alerta</CardTitle>
                <CardDescription>
                  Escolha como deseja ser avisado sobre movimentações nos seus processos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-start justify-between space-x-4 border-b pb-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary text-base">
                        Notificações por E-mail
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-md">
                        Receba um e-mail a cada nova movimentação importante ou documento anexado ao
                        seu processo.
                      </p>
                    </div>
                  </div>
                  <Switch checked={emailNotif} onCheckedChange={setEmailNotif} className="mt-2" />
                </div>

                <div className="flex items-start justify-between space-x-4">
                  <div className="flex items-start space-x-4 w-full">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary text-base">Alertas via WhatsApp</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1 mb-4 max-w-md">
                        Avisos rápidos diretamente no seu WhatsApp sobre andamentos processuais.
                      </p>

                      {whatsappNotif && (
                        <div
                          className="max-w-xs space-y-2 animate-slide-up"
                          style={{ animationDuration: '300ms' }}
                        >
                          <label className="text-sm font-medium text-foreground">
                            Número do WhatsApp
                          </label>
                          <Input
                            placeholder="(00) 00000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={whatsappNotif}
                    onCheckedChange={setWhatsappNotif}
                    className="mt-2 shrink-0"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} size="lg" className="gap-2 px-8">
                <Save className="w-5 h-5" /> Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
