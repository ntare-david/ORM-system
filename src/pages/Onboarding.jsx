import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const TOTAL_STEPS = 4
const API_BASE_URL = 'http://localhost:8000/api'

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Section 1 - Identity & Access
  const [role, setRole] = useState('')
  const [roleOther, setRoleOther] = useState('')
  const [organizationType, setOrganizationType] = useState('')
  const [organizationOther, setOrganizationOther] = useState('')
  const [managesMultipleCompanies, setManagesMultipleCompanies] = useState('')
  const [companyNames, setCompanyNames] = useState('')
  const [accessLevel, setAccessLevel] = useState('')
  
  // Section 2 - Purpose & Goals
  const [primaryGoals, setPrimaryGoals] = useState([])
  const [biggestChallenge, setBiggestChallenge] = useState('')
  const [challengeOther, setChallengeOther] = useState('')
  
  // Section 3 - Personalization
  const [interfaceStyle, setInterfaceStyle] = useState('')
  const [comfortLevel, setComfortLevel] = useState('')
  const [activeModules, setActiveModules] = useState([])
  
  // Section 4 - Smart Startup Data
  const [autoConfig, setAutoConfig] = useState('')
  const [importData, setImportData] = useState([])
  const [importOther, setImportOther] = useState('')

  const handleGoalToggle = (goal) => {
    setPrimaryGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handleModuleToggle = (module) => {
    setActiveModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    )
  }

  const handleImportToggle = (item) => {
    setImportData(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return role && organizationType && managesMultipleCompanies && accessLevel
      case 2:
        return primaryGoals.length > 0 && biggestChallenge
      case 3:
        return interfaceStyle && comfortLevel && activeModules.length > 0
      case 4:
        return autoConfig
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
      setError('')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!canProceed()) return
    
    setLoading(true)
    setError('')
    try {
      const profilingData = {
        role: role === 'other' ? roleOther : role,
        organizationType: organizationType === 'other' ? organizationOther : organizationType,
        managesMultipleCompanies: managesMultipleCompanies === 'yes',
        companyNames: managesMultipleCompanies === 'yes' ? companyNames : null,
        accessLevel,
        primaryGoals,
        biggestChallenge: biggestChallenge === 'other' ? challengeOther : biggestChallenge,
        interfaceStyle,
        comfortLevel,
        activeModules,
        autoConfig,
        importData: importData.length > 0 ? importData : null,
        importOther: importData.includes('Other') ? importOther : null,
      }

      await apiClient.post('/auth/profile', profilingData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Profile submission failed:', error)
      setError(error.response?.data?.detail || 'Failed to save your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-foreground">Welcome to ORM System!</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Before we create your account, we need to understand who you are and how you'll be using the platform. 
            This helps us customize your dashboard, modules, permissions, and recommendations automatically.
          </p>
          <p className="text-muted-foreground mt-2 opacity-75">
            Please answer the questions below—your experience will be tailored to your needs.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {currentStep === 1 && 'Section 1 — Identity & Access'}
              {currentStep === 2 && 'Section 2 — Purpose & Goals'}
              {currentStep === 3 && 'Section 3 — Personalization'}
              {currentStep === 4 && 'Section 4 — Smart Startup Data'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {currentStep === 1 && 'Tell us about your role and organization'}
              {currentStep === 2 && 'What do you want to achieve?'}
              {currentStep === 3 && 'Customize your experience'}
              {currentStep === 4 && 'Final setup preferences'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Step 1: Identity & Access */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    1. What best describes your role?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'business_owner', label: 'Business Owner' },
                      { value: 'manager', label: 'Manager / Supervisor' },
                      { value: 'accountant', label: 'Accountant' },
                      { value: 'salesperson', label: 'Salesperson / Agent' },
                      { value: 'inventory_officer', label: 'Inventory Officer' },
                      { value: 'hr_manager', label: 'HR Manager' },
                      { value: 'developer', label: 'Developer / Technical Admin' },
                      { value: 'other', label: 'Other' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={role === option.value}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {role === 'other' && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={roleOther}
                      onChange={(e) => setRoleOther(e.target.value)}
                      className="input-field mt-2"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    2. Which of these best matches your organization?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'small_business', label: 'Small Business (1–10 employees)' },
                      { value: 'medium_enterprise', label: 'Medium Enterprise (11–100 employees)' },
                      { value: 'large_company', label: 'Large Company (100+ employees)' },
                      { value: 'freelancer', label: 'Freelancer / Solo Operator' },
                      { value: 'ngo', label: 'NGO / Organization' },
                      { value: 'education', label: 'Education / Training' },
                      { value: 'other', label: 'Other' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="radio"
                          name="organizationType"
                          value={option.value}
                          checked={organizationType === option.value}
                          onChange={(e) => setOrganizationType(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {organizationType === 'other' && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={organizationOther}
                      onChange={(e) => setOrganizationOther(e.target.value)}
                      className="input-field mt-2"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    3. Do you manage or belong to multiple companies?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                      <input
                        type="radio"
                        name="managesMultipleCompanies"
                        value="yes"
                        checked={managesMultipleCompanies === 'yes'}
                        onChange={(e) => setManagesMultipleCompanies(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                      <input
                        type="radio"
                        name="managesMultipleCompanies"
                        value="no"
                        checked={managesMultipleCompanies === 'no'}
                        onChange={(e) => setManagesMultipleCompanies(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-slate-300">No</span>
                    </label>
                  </div>
                  {managesMultipleCompanies === 'yes' && (
                    <div className="mt-3">
                      <label className="block text-sm text-slate-300 mb-2">Company names (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Company A, Company B, Company C"
                        value={companyNames}
                        onChange={(e) => setCompanyNames(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    4. What level of access do you need?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'full_admin', label: 'Full Admin' },
                      { value: 'department_admin', label: 'Department Admin' },
                      { value: 'standard_user', label: 'Standard User' },
                      { value: 'viewer_only', label: 'Viewer Only' },
                      { value: 'custom', label: 'Custom Access (system config will appear)' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="radio"
                          name="accessLevel"
                          value={option.value}
                          checked={accessLevel === option.value}
                          onChange={(e) => setAccessLevel(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Purpose & Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    5. What are your primary goals for using ORM System?
                  </label>
                  <p className="text-sm text-slate-400">Select as many as needed</p>
                  <div className="space-y-2">
                    {[
                      'Manage sales & customers',
                      'Track inventory & stock',
                      'Handle accounting & payments',
                      'HR & employee management',
                      'Build workflows & automation',
                      'Get analytics & insights',
                      'Website & e-commerce',
                      'AI assistance (summaries, insights, forecasting)',
                      'All of the above'
                    ].map((goal) => (
                      <label key={goal} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={primaryGoals.includes(goal)}
                          onChange={() => handleGoalToggle(goal)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-slate-300">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    6. What's the biggest challenge you want the system to solve?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'better_organization', label: '"We need better organization."' },
                      { value: 'too_slow', label: '"Our current tools are too slow."' },
                      { value: 'tracking_issues', label: '"We can\'t track payments/inventory properly."' },
                      { value: 'control_permissions', label: '"We want tighter control & permissions."' },
                      { value: 'automation', label: '"We need automation."' },
                      { value: 'analytics', label: '"We want better decision-making with analytics."' },
                      { value: 'other', label: 'Other' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="radio"
                          name="biggestChallenge"
                          value={option.value}
                          checked={biggestChallenge === option.value}
                          onChange={(e) => setBiggestChallenge(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {biggestChallenge === 'other' && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={challengeOther}
                      onChange={(e) => setChallengeOther(e.target.value)}
                      className="input-field mt-2"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Personalization */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    7. What interface style do you prefer?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'simple', label: 'Simple & minimal' },
                      { value: 'detailed', label: 'Detailed & data-dense' },
                      { value: 'automatic', label: 'Automatic (AI adapts your layout over time)' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="radio"
                          name="interfaceStyle"
                          value={option.value}
                          checked={interfaceStyle === option.value}
                          onChange={(e) => setInterfaceStyle(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    8. How comfortable are you with advanced tools?
                  </label>
                  <p className="text-sm text-slate-400">This lets you show simplified or advanced UI.</p>
                  <div className="space-y-2">
                    {[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'expert', label: 'Expert' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="radio"
                          name="comfortLevel"
                          value={option.value}
                          checked={comfortLevel === option.value}
                          onChange={(e) => setComfortLevel(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    9. Which modules do you want to activate immediately?
                  </label>
                  <p className="text-sm text-slate-400">This lets you dynamically generate dashboards.</p>
                  <div className="space-y-2">
                    {[
                      'Sales',
                      'Inventory',
                      'Accounting',
                      'CRM',
                      'HR',
                      'Website Builder',
                      'Workflow Automation',
                      'AI Tools',
                      'All modules'
                    ].map((module) => (
                      <label key={module} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeModules.includes(module)}
                          onChange={() => handleModuleToggle(module)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-slate-300">{module}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Smart Startup Data */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    10. Would you like the system to auto-configure defaults for you?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'yes_automatic', label: 'Yes, set up everything automatically' },
                      { value: 'no_manual', label: 'No, I prefer to configure manually' },
                      { value: 'assisted', label: 'I want assistance (AI-guided setup)' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="radio"
                          name="autoConfig"
                          value={option.value}
                          checked={autoConfig === option.value}
                          onChange={(e) => setAutoConfig(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-200">
                    11. Do you want to import existing data now?
                  </label>
                  <p className="text-sm text-slate-400">Select all that apply, or skip for now</p>
                  <div className="space-y-2">
                    {[
                      'Customers',
                      'Products',
                      'Inventory',
                      'Accounting balances',
                      'Employees',
                      'Other'
                    ].map((item) => (
                      <label key={item} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={importData.includes(item)}
                          onChange={() => handleImportToggle(item)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-slate-300">{item}</span>
                      </label>
                    ))}
                  </div>
                  {importData.includes('Other') && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={importOther}
                      onChange={(e) => setImportOther(e.target.value)}
                      className="input-field mt-2"
                    />
                  )}
                  <label className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={importData.length === 0}
                      onChange={(checked) => {
                        if (checked.target.checked) {
                          setImportData([])
                          setImportOther('')
                        }
                      }}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-slate-300">Skip for now</span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Setup
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

