import { useState } from 'react'
import { Plus, Search, BookOpen, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDataStore from '@/stores/useDataStore'
import { WikiEntry } from '@/lib/mock-data'

export default function AdminWiki() {
  const { wikiEntries, addWikiEntry } = useDataStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<WikiEntry | null>(null)

  // Form
  const [title, setTitle] = useState('')
  const [formCategory, setFormCategory] = useState('Teses Jurídicas')
  const [content, setContent] = useState('')

  const handleAdd = () => {
    if (title && content) {
      addWikiEntry({ title, category: formCategory, content })
      setIsAddOpen(false)
      setTitle('')
      setContent('')
    }
  }

  const filtered = wikiEntries.filter((w) => {
    const matchCat = category === 'Todas' || w.category === category
    const matchSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.content.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const categories = ['Teses Jurídicas', 'Modelos de Petições', 'Notas Técnicas']

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-1">Wiki Legal Interna</h1>
          <p className="text-muted-foreground">
            Repositório de conhecimento e modelos do escritório.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary text-white gap-2">
          <Plus className="w-4 h-4" /> Novo Artigo
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Tabs defaultValue="Todas" onValueChange={setCategory} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="Todas">Todas</TabsTrigger>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <p className="text-muted-foreground py-8 text-center">Nenhum artigo encontrado.</p>
        )}
        {filtered.map((entry) => (
          <Card
            key={entry.id}
            className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEntry(entry)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-primary">{entry.title}</h3>
                    <p className="text-xs text-secondary font-medium">{entry.category}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  Atualizado em: {entry.updatedAt.split('-').reverse().join('/')}
                </span>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 mt-4">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Artigo Wiki</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Conteúdo</label>
              <Textarea
                className="min-h-[250px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>Salvar Artigo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={(o) => !o && setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b pb-4">
            <div className="flex justify-between items-center pr-8">
              <DialogTitle className="font-serif text-2xl text-primary">
                {selectedEntry?.title}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-secondary font-medium mt-1">{selectedEntry?.category}</p>
          </DialogHeader>
          <div className="py-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 max-h-[60vh] overflow-y-auto">
            {selectedEntry?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
