import type { Provider } from '@/store/useSettingsStore'

export type ModelOption = {
  value: string
  label: string
  description?: string
}

export const CUSTOM_MODEL_VALUE = '__custom_model__'

export const MODEL_OPTIONS: Record<Provider, ModelOption[]> = {
  openai: [
    { value: 'gpt-5.5', label: 'GPT-5.5', description: 'Flagship reasoning and coding' },
    { value: 'gpt-5.4', label: 'GPT-5.4', description: 'Balanced frontier model' },
    { value: 'gpt-5.4-mini', label: 'GPT-5.4 mini', description: 'Lower latency and cost' },
  ],
  anthropic: [
    { value: 'claude-fable-5', label: 'Claude Fable 5', description: 'Highest capability' },
    { value: 'claude-opus-4-8', label: 'Claude Opus 4.8', description: 'Complex coding and agentic work' },
    { value: 'claude-sonnet-5', label: 'Claude Sonnet 5', description: 'Speed and intelligence balance' },
    { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', description: 'Fast, lower-cost generation' },
  ],
  gemini: [
    { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', description: 'Current stable frontier model' },
    { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview', description: 'Advanced reasoning preview' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Deep reasoning and coding' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Price-performance model' },
  ],
  custom: [
    { value: 'gpt-5.5', label: 'GPT-5.5 compatible' },
    { value: 'gpt-5.4', label: 'GPT-5.4 compatible' },
    { value: 'gpt-5.4-mini', label: 'GPT-5.4 mini compatible' },
  ],
}

export const DEFAULT_MODEL_BY_PROVIDER: Record<Provider, string> = {
  openai: 'gpt-5.4-mini',
  anthropic: 'claude-sonnet-5',
  gemini: 'gemini-3.5-flash',
  custom: 'gpt-5.4-mini',
}

export function getModelOptions(provider: Provider) {
  return MODEL_OPTIONS[provider]
}

export function getDefaultModel(provider: Provider) {
  return DEFAULT_MODEL_BY_PROVIDER[provider]
}

export function isKnownModel(provider: Provider, model: string) {
  return MODEL_OPTIONS[provider].some((option) => option.value === model)
}
