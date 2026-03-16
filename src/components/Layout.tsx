import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  User,
  LogOut,
  Settings as SettingsIcon,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import logoImg from '@/assets/generatedimage_1773618667682-c64bd.png'
import { ChatWidget } from './ChatWidget'

const navItems = [
  { name: 'Início', path: '/' },
  { name: 'Contato', path: '/contato' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black text-white shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <img
                src={logoImg}
                alt="Oliveira Naval Advogados"
                className="h-12 w-auto object-contain sm:h-14"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blue-400',
                  location.pathname === item.path ? 'text-blue-500' : 'text-slate-200',
                )}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 text-slate-200 hover:text-white hover:bg-zinc-800 focus-visible:ring-0"
                  >
                    <User className="h-4 w-4" />
                    {user.name.split(' ')[0]}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Meu Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'client' && (
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-secondary hover:bg-secondary/90 text-primary-foreground font-medium">
                  Área do Cliente
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-zinc-800 hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white border-zinc-800 p-0 w-72">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <SheetDescription className="sr-only">Links principais do site</SheetDescription>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-center p-6 border-b border-zinc-800">
                    <img
                      src={logoImg}
                      alt="Oliveira Naval Advogados"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col py-6">
                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className={cn(
                          'px-6 py-4 text-lg font-medium transition-colors hover:bg-zinc-900',
                          location.pathname === item.path
                            ? 'text-blue-500 border-l-4 border-blue-500'
                            : 'text-slate-200',
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}

                    <div className="my-4 border-t border-zinc-800" />

                    {user ? (
                      <>
                        <div className="px-6 py-2 text-sm text-zinc-400 uppercase tracking-wider font-semibold">
                          Área Logada
                        </div>
                        <Link
                          to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                          className="px-6 py-4 text-lg font-medium transition-colors hover:bg-zinc-900 text-slate-200 flex items-center gap-3"
                        >
                          <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </Link>
                        {user.role === 'client' && (
                          <Link
                            to="/settings"
                            className="px-6 py-4 text-lg font-medium transition-colors hover:bg-zinc-900 text-slate-200 flex items-center gap-3"
                          >
                            <SettingsIcon className="h-5 w-5" /> Configurações
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="px-6 py-4 text-lg font-medium transition-colors hover:bg-zinc-900 text-red-400 flex items-center gap-3 text-left w-full"
                        >
                          <LogOut className="h-5 w-5" /> Sair
                        </button>
                      </>
                    ) : (
                      <div className="px-6 py-4">
                        <Link to="/login">
                          <Button
                            className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground"
                            size="lg"
                          >
                            Acessar Área do Cliente
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-black text-slate-300 py-12 border-t border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
                <img
                  src={logoImg}
                  alt="Oliveira Naval Advogados"
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-center md:text-left max-w-sm text-zinc-400">
                Especialistas em Direito do Trabalho, defendendo seus direitos com excelência,
                transparência e dedicação na Justiça do Trabalho do Rio de Janeiro.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-4 pt-2">
              <h3 className="font-semibold text-white tracking-wide uppercase text-sm">
                Navegação
              </h3>
              <div className="flex flex-col space-y-3 text-sm text-zinc-400">
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Início
                </Link>
                <Link to="/contato" className="hover:text-blue-400 transition-colors">
                  Contato
                </Link>
                {!user && (
                  <Link to="/login" className="hover:text-blue-400 transition-colors">
                    Área do Cliente
                  </Link>
                )}
                <Link to="/admin/login" className="hover:text-blue-400 transition-colors">
                  Acesso Restrito
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-4 pt-2">
              <h3 className="font-semibold text-white tracking-wide uppercase text-sm">Contato</h3>
              <div className="flex flex-col space-y-3 text-sm text-zinc-400 text-center md:text-left">
                <p>Av. Rio Branco, 1 - Centro</p>
                <p>Rio de Janeiro, RJ - 20090-003</p>
                <p>contato@oliveiranaval.com.br</p>
                <p>(21) 9999-9999</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-900 text-center text-sm text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              &copy; {new Date().getFullYear()} Oliveira Naval Advogados. Todos os direitos
              reservados.
            </p>
            <p>Sistema de Consulta Processual</p>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  )
}
