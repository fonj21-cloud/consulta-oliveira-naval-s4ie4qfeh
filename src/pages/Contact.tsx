import { Mail, MapPin, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function Contact() {
  return (
    <div className="min-h-[80vh] py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Entre em Contato
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Estamos à disposição para tirar suas dúvidas e prestar o melhor atendimento jurídico.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div
            className="lg:col-span-1 space-y-6 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Endereço</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Av. Rio Branco, 1 - Centro
                    <br />
                    Rio de Janeiro - RJ
                    <br />
                    CEP: 20090-003
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Telefones</h3>
                  <p className="text-sm text-muted-foreground">
                    (21) 99999-9999
                    <br />
                    (21) 3333-3333
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">E-mail</h3>
                  <p className="text-sm text-muted-foreground">contato@oliveiranaval.adv.br</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Card className="border-0 shadow-lg h-full">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold text-primary mb-6">
                  Envie uma Mensagem
                </h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Nome Completo</label>
                      <Input placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">E-mail</label>
                      <Input type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Assunto</label>
                    <Input placeholder="Ex: Dúvida sobre processo" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mensagem</label>
                    <Textarea placeholder="Como podemos ajudar?" className="min-h-[150px]" />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
