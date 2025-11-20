import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { AccountingProvider, CrmProvider, InventoryProvider } from './shared/contexts'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import { Skeleton } from './components/Skeleton'
import Home from './pages/Home'

// Lazy load dashboard components for code splitting
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const DashboardLayout = lazy(() => import('./pages/dashboard/Dashboard'))

// Lazy load feature modules for better code splitting
const AccountingModule = lazy(() => import('./pages/dashboard/Accounting'))
const SalesModule = lazy(() => import('./pages/dashboard/Sales'))
const InventoryModule = lazy(() => import('./pages/dashboard/Inventory'))
const CrmModule = lazy(() => import('./pages/dashboard/CRM'))
const HrModule = lazy(() => import('./pages/dashboard/HR'))
const ReportsModule = lazy(() => import('./pages/dashboard/Reports'))
const WorkflowsModule = lazy(() => import('./pages/dashboard/Workflows'))
const AiModule = lazy(() => import('./pages/dashboard/AI'))
const WebsiteBuilderModule = lazy(() => import('./pages/dashboard/WebsiteBuilder'))
const SettingsModule = lazy(() => import('./pages/dashboard/Settings'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 text-center">
      <Skeleton width={200} height={200} rounded className="mx-auto" />
      <Skeleton width={150} height={20} className="mx-auto" />
    </div>
  </div>
)

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <SettingsProvider>
            <AuthProvider>
              <AccountingProvider>
                <CrmProvider>
                  <InventoryProvider>
                    <Router>
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          
                          <Route
                            path="/dashboard/*"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout />
                              </ProtectedRoute>
                            }
                          />
                          
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </Router>
                  </InventoryProvider>
                </CrmProvider>
              </AccountingProvider>
            </AuthProvider>
          </SettingsProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

