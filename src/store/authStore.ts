import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'super_admin' | 'insurer' | 'broker'
  initials: string
  joinedAt: string
  kycStatus: 'verified' | 'pending' | 'unverified'
  company?: string   // for insurer role
  licenseNo?: string // for broker/insurer
}

export const ROLE_REDIRECT: Record<AuthUser['role'], string> = {
  super_admin: '/admin',
  insurer:     '/insurer',
  broker:      '/broker',
}

interface AuthStore {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const MOCK_USERS: Record<string, AuthUser> = {
  // Super Admin
  'admin@insureae.com': {
    id: 'sa_001', name: 'Khalid Al Hashimi', email: 'admin@insureae.com',
    phone: '0504567890', role: 'super_admin', initials: 'KH',
    joinedAt: '2023-01-01', kycStatus: 'verified', licenseNo: 'PLAT/SA/001',
  },
  // Insurance Company (Daman)
  'portal@daman.ae': {
    id: 'ins_001', name: 'Fatima Al Kaabi', email: 'portal@daman.ae',
    phone: '0551234567', role: 'insurer', initials: 'FK',
    joinedAt: '2023-06-01', kycStatus: 'verified',
    company: 'Daman Health', licenseNo: 'IC-DXB-0012',
  },
  // Broker
  'broker@insureae.com': {
    id: 'br_001', name: 'Omar Al Rashidi', email: 'broker@insureae.com',
    phone: '0561234567', role: 'broker', initials: 'OR',
    joinedAt: '2024-01-15', kycStatus: 'verified',
    company: 'Al Rashidi Insurance Brokers', licenseNo: 'BR-DXB-0247',
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (email, _password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 900))
        const user = MOCK_USERS[email.toLowerCase()]
        if (!user) {
          set({ isLoading: false })
          return { success: false, error: 'No account found with that email address.' }
        }
        set({ user, isLoading: false })
        return { success: true }
      },

      register: async (name, email, phone, _password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1000))
        if (MOCK_USERS[email.toLowerCase()]) {
          set({ isLoading: false })
          return { success: false, error: 'An account with this email already exists.' }
        }
        const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        const newUser: AuthUser = {
          id: `usr_${Date.now()}`,
          name,
          email,
          phone,
          role: 'broker',
          initials,
          joinedAt: new Date().toISOString().split('T')[0],
          kycStatus: 'pending',
        }
        set({ user: newUser, isLoading: false })
        return { success: true }
      },

      logout: () => set({ user: null }),
    }),
    {
      name: 'insureae-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : localStorage
      ),
    }
  )
)
