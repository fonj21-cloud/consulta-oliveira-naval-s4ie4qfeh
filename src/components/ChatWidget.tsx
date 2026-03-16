import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/contexts/AuthContext'

export function ChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { text: 'Olá! Como podemos ajudar com seu processo hoje?', sender: 'support' },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // Only show to authenticated clients
  if (!user || user.role !== 'client') return null

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg = { text: input, sender: 'user' }
    setMessages((prev) => [...prev, newMsg])
    setInput('')

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Um de nossos advogados já vai te atender. Por favor, aguarde.',
          sender: 'support',
        },
      ])
    }, 1500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="w-14 h-14 rounded-full shadow-2xl bg-secondary hover:bg-secondary/90 text-white transition-transform hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-80 p-0 mb-4 shadow-2xl border-0 overflow-hidden rounded-2xl flex flex-col h-[450px]"
        >
          <div className="bg-primary p-4 text-white flex items-center justify-between">
            <div>
              <h3 className="font-semibold font-serif text-lg tracking-tight">
                Suporte ao Cliente
              </h3>
              <p className="text-xs text-white/80">Oliveira Naval Advogados</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.sender === 'user' ? 'bg-secondary text-white rounded-br-sm' : 'bg-white border text-foreground rounded-bl-sm'}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-white border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="text-sm h-10 border-slate-200 focus-visible:ring-secondary focus-visible:ring-offset-0"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4 text-secondary" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
