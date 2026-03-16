import { MessageCircle, Link as LinkIcon, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import useDataStore from '@/stores/useDataStore'
import { useToast } from '@/hooks/use-toast'

export default function AdminSettings() {
  const { whatsappConnected, setWhatsappConnected } = useDataStore()
  const { toast } = useToast()

  const handleToggle = (val: boolean) => {
    setWhatsappConnected(val)
    toast({
      title: val ? 'WhatsApp Conectado' : 'WhatsApp Desconectado',
      description: val
        ? 'Notificações automáticas ativadas.'
        : 'As mensagens automáticas foram pausadas.',
      className: val ? 'bg-[#25D366] text-white border-none' : '',
    })
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-1">
          Configurações de Integração
        </h1>
        <p className="text-muted-foreground">Gerencie as conexões externas do sistema.</p>
      </div>

      <Card className="border-0 shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <MessageCircle className="w-32 h-32" />
        </div>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
            WhatsApp API (Notificações Automáticas)
          </CardTitle>
          <CardDescription className="max-w-2xl text-base">
            O motor de notificações envia mensagens formatadas diretamente para o cliente sempre que
            uma movimentação ou documento for adicionado ao processo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-xl">
            <div>
              <p className="font-semibold text-primary">Status da Conexão</p>
              <p className="text-sm text-muted-foreground">
                Ative ou desative o envio automático em massa.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${whatsappConnected ? 'text-[#25D366]' : 'text-muted-foreground'}`}
              >
                {whatsappConnected ? 'Ativo' : 'Pausado'}
              </span>
              <Switch
                checked={whatsappConnected}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-[#25D366]"
              />
            </div>
          </div>

          <div className="border rounded-xl p-6">
            <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-secondary" /> Token de Acesso
            </h4>
            <div className="flex gap-4">
              <input
                type="password"
                value="sk_test_whatsapp_api_token_oliveira_naval_8829"
                readOnly
                className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
              <Button variant="outline">Regerar Token</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
