import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Provider = 'openai' | 'anthropic' | 'gemini' | 'custom'

export type Language = 'zh' | 'en' | 'ja' | 'fr'

interface SettingsState {
  apiKey: string
  provider: Provider
  customEndpoint: string
  model: string
  language: Language
  setSettings: (settings: Partial<Omit<SettingsState, 'setSettings'>>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      provider: 'openai',
      customEndpoint: '',
      model: 'gpt-4o-mini',
      language: 'zh',
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'living-checklist-settings',
    }
  )
)
