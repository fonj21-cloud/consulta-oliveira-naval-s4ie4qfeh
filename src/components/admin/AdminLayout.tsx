import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Settings, LogOut, MessageCircle } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthContext'
import logoImg from '@/assets/generatedimage_1773618667682-c64bd.png'

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Clientes', url: '/admin/clients', icon: Users },
  { title: 'Processos', url: '/admin/processes', icon: Briefcase },
  { title: 'Integração WhatsApp', url: '/admin/settings', icon: MessageCircle },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-zinc-200" variant="sidebar">
        <SidebarHeader className="p-4 border-b bg-primary flex justify-center py-6">
          <img src={logoImg} alt="Logo" className="h-12 object-contain" />
        </SidebarHeader>
        <SidebarContent className="bg-slate-50">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider font-semibold text-muted-foreground pt-4 pb-2">
              Gestão
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:hover:bg-primary/90 h-10"
                    >
                      <Link to={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4 bg-slate-50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-primary">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <SidebarMenuButton
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" /> Sair do Sistema
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
          <SidebarTrigger className="-ml-2" />
          <div className="font-semibold font-serif text-lg text-primary ml-2">
            Painel do Advogado
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-slate-50/50 p-6 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
