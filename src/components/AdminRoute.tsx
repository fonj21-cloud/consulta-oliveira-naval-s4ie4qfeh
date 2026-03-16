import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function AdminRoute() {
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
