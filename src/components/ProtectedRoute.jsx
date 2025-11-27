import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiClient } from '../api/client'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

  // Skip onboarding check - allow direct access to dashboard
  useEffect(() => {
    setCheckingOnboarding(false)
    setHasProfile(true)
  }, [])

  if (isLoading || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // Onboarding disabled - skip profile check

  return <>{children}</>
}

