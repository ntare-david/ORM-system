import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [checkingProfile, setCheckingProfile] = useState(false)

  // Remove automatic redirects - let users see the home page first

  // Show home page to everyone - let them choose login or signup

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">ORM Management System</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Enterprise Business Management Platform</p>
        </div>

        <p className="text-lg text-slate-700 dark:text-slate-300">
          Unified platform for managing accounting, sales, inventory, CRM, and HR operations with AI-powered insights.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/signup" className="btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}

