
'use client'

import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { parseM3U } from '@/lib/parseM3U'

type Props = {
  onChannelsLoaded: (channels: any[]) => void
}

export default function M3UUploader({
  onChannelsLoaded,
}: Props) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  // IMPORTAÇÃO VIA ARQUIVO
  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const content = event.target?.result

        if (typeof content !== 'string') {
          alert('Não foi possível ler o arquivo.')
          return
        }

        if (
          !content.includes('#EXTM3U') &&
          !content.includes('#EXTINF')
        ) {
          alert('Arquivo M3U inválido ou não reconhecido.')
          return
        }

        const parsedChannels = await parseM3U(content)

        if (parsedChannels.length === 0) {
          alert('Nenhum canal encontrado no arquivo.')
          return
        }

        onChannelsLoaded(parsedChannels)
      } catch (error) {
        console.error('Erro ao importar arquivo:', error)
        alert('Erro ao processar o arquivo M3U.')
      }
    }

    reader.onerror = () => {
      alert('Erro ao ler o arquivo selecionado.')
    }

    reader.readAsText(file)
  }

  // IMPORTAÇÃO VIA URL
  const handleUrlImport = async () => {
    if (!url.trim()) {
      alert('Informe a URL da playlist.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(url.trim())

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const content = await response.text()

      if (
        !content.includes('#EXTM3U') &&
        !content.includes('#EXTINF')
      ) {
        alert('Formato não reconhecido. Informe uma playlist M3U válida.')
        return
      }

      const parsedChannels = await parseM3U(content)

      if (parsedChannels.length === 0) {
        alert('Nenhum canal encontrado na playlist.')
        return
      }

      onChannelsLoaded(parsedChannels)
    } catch (error) {
      console.error('Erro ao importar URL:', error)

      alert(
        'Erro ao importar a URL. Verifique o endereço e se o servidor permite acesso pelo navegador (CORS).'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4 space-y-4">
      {/* IMPORTAR ARQUIVO */}
      <label
        className="
          flex w-full cursor-pointer items-center
          justify-center rounded-xl bg-cyan-600 p-3
          transition hover:bg-cyan-500
        "
      >
        Importar Arquivo

        <input
          type="file"
          accept=".m3u,.m3u8,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* IMPORTAÇÃO VIA URL */}
      <div className="space-y-2">
        <input
          type="url"
          placeholder="https://servidor/lista.m3u"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="
            w-full rounded-xl border border-zinc-700
            bg-zinc-800 p-3 outline-none
          "
        />

        <button
          type="button"
          onClick={handleUrlImport}
          disabled={loading}
          className="
            w-full rounded-xl bg-green-600 p-3
            transition hover:bg-green-500
            disabled:opacity-50
          "
        >
          {loading ? 'Importando...' : 'Importar via URL'}
        </button>
      </div>
    </div>
  )
}
