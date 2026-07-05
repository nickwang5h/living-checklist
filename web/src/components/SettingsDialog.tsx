'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Provider, useSettingsStore } from '@/store/useSettingsStore'
import { toast } from 'sonner'

const T = {
  zh: {
    title: 'API 设置',
    desc: '配置你大语言模型提供商。所有的密钥数据仅安全保存在你的浏览器本地，不会上传到我们的服务器。',
    provider: '提供商',
    selProv: '选择提供商',
    endpoint: '接口地址',
    model: '模型名称',
    apiKey: 'API 密钥',
    save: '保存设置',
    saved: '设置已保存到本地',
  },
  en: {
    title: 'Configuration',
    desc: 'Configure your AI provider. Keys are stored locally in your browser.',
    provider: 'Provider',
    selProv: 'Select provider',
    endpoint: 'Endpoint',
    model: 'Model',
    apiKey: 'API Key',
    save: 'Save changes',
    saved: 'Settings saved to local storage',
  },
  ja: {
    title: 'API 設定',
    desc: 'AIプロバイダーを設定してください。キーはブラウザにローカル保存されます。',
    provider: 'プロバイダー',
    selProv: 'プロバイダーを選択',
    endpoint: 'エンドポイント',
    model: 'モデル',
    apiKey: 'API キー',
    save: '設定を保存',
    saved: '設定をローカルに保存しました',
  },
  fr: {
    title: 'Paramètres API',
    desc: 'Configurez votre fournisseur d\'IA. Les clés sont stockées localement dans votre navigateur.',
    provider: 'Fournisseur',
    selProv: 'Sélectionner un fournisseur',
    endpoint: 'Point d\'accès',
    model: 'Modèle',
    apiKey: 'Clé API',
    save: 'Enregistrer',
    saved: 'Paramètres enregistrés localement',
  }
}

export function SettingsDialog() {
  const { apiKey, provider, customEndpoint, model, language, setSettings } = useSettingsStore()
  const [open, setOpen] = useState(false)

  const t = T[language]

  // Local state for the form so we can cancel without saving
  const [localApiKey, setLocalApiKey] = useState(apiKey)
  const [localProvider, setLocalProvider] = useState<Provider>(provider)
  const [localEndpoint, setLocalEndpoint] = useState(customEndpoint)
  const [localModel, setLocalModel] = useState(model)

  // Sync local state when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalApiKey(apiKey)
      setLocalProvider(provider)
      setLocalEndpoint(customEndpoint)
      setLocalModel(model)
    }
    setOpen(newOpen)
  }

  const handleSave = () => {
    setSettings({
      apiKey: localApiKey,
      provider: localProvider,
      customEndpoint: localEndpoint,
      model: localModel,
    })
    setOpen(false)
    toast.success(t.saved)
  }

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <Settings className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.desc}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">
              {t.provider}
            </Label>
            <div className="col-span-3">
              <Select value={localProvider} onValueChange={(v) => setLocalProvider(v as Provider)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selProv} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="custom">Custom (OpenAI-compatible)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(localProvider === 'custom' || localProvider === 'openai') && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endpoint" className="text-right">
                {t.endpoint}
              </Label>
              <Input
                id="endpoint"
                placeholder={localProvider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.example.com/v1'}
                value={localEndpoint}
                onChange={(e) => setLocalEndpoint(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              {t.model}
            </Label>
            <Input
              id="model"
              placeholder="gpt-4o-mini, claude-3-5-sonnet-20240620..."
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apikey" className="text-right">
              {t.apiKey}
            </Label>
            <Input
              id="apikey"
              type="password"
              placeholder="sk-..."
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>{t.save}</Button>
        </div>
      </DialogContent>
      </Dialog>
    </>
  )
}
