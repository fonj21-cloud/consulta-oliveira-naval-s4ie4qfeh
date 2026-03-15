import { Link, Outlet, useLocation } from 'react-router-dom'
import { Scale, UserCircle, Menu, X, Facebook, Instagram, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Meus Processos', path: '/' },
    { name: 'Sobre o Escritório', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-border' : 'bg-transparent border-transparent'}`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary text-secondary rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-colors">
              <Scale className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-none text-primary">
                Oliveira Naval
              </span>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Advogados Associados
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 gap-2"
            >
              <UserCircle className="w-4 h-4" />
              Área do Cliente
            </Button>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-primary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-medium p-2 text-foreground/80"
                >
                  {link.name}
                </Link>
              ))}
              <Button className="w-full gap-2 mt-4">
                <UserCircle className="w-4 h-4" /> Área do Cliente
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <footer className="bg-primary text-primary-foreground pt-16 pb-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-secondary" />
              <span className="font-serif font-bold text-xl text-white">Oliveira Naval</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Excelência e transparência na condução de processos trabalhistas no Rio de Janeiro.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-secondary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-secondary">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  PJe 1º Grau TRT1
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  PJe 2º Grau TRT1
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Consulta Pública TRT1
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Área do Cliente
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-secondary">Contato</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>(21) 99999-9999</li>
              <li>(21) 3333-3333</li>
              <li>contato@oliveiranaval.adv.br</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-secondary">Endereço</h4>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Av. Rio Branco, 1 - Centro
              <br />
              Rio de Janeiro - RJ
              <br />
              CEP: 20090-003
              <br />
              OAB/RJ 12.345
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 border-t border-white/10 pt-8 text-center text-sm text-primary-foreground/50">
          <p>
            &copy; {new Date().getFullYear()} Oliveira Naval Advogados Associados. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
