import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { formatCNJ } from '@/lib/utils'

export function ProcessSearch() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanQuery = query.replace(/\D/g, '')

    if (cleanQuery.length !== 20 && cleanQuery.length > 0) {
      toast({
        title: 'Número Inválido',
        description: 'O número do processo deve conter 20 dígitos.',
        variant: 'destructive',
      })
      return
    }

    if (!query) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate(`/processo/${encodeURIComponent(query)}`)
    }, 800)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group">
      <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full transition-all duration-500 group-hover:bg-secondary/30 opacity-0 group-hover:opacity-100" />
      <div className="relative flex items-center shadow-lg rounded-full bg-white border border-border overflow-hidden focus-within:ring-2 focus-within:ring-secondary transition-all duration-300">
        <div className="pl-6 pr-2 py-4 text-muted-foreground">
          <Search className="w-5 h-5 text-primary/50" />
        </div>
        <Input
          type="text"
          placeholder="0000000-00.0000.0.00.0000"
          value={query}
          onChange={(e) => setQuery(formatCNJ(e.target.value))}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-6 text-lg font-sans bg-transparent"
        />
        <div className="pr-2">
          <Button
            type="submit"
            size="lg"
            className="rounded-full bg-secondary hover:bg-secondary/90 text-primary-foreground px-8 font-semibold transition-transform active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Consultar'}
          </Button>
        </div>
      </div>
    </form>
  )
}
