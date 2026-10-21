'use client'

import { ChangeEvent, useState } from 'react'

import { parseM3U } from '@/lib/parseM3U'

type Props = {
  onChannelsLoaded: (channels: any[]) => void
}

export default function M3UUploader({
  onChannelsLoaded,
}: Props) {

  const [url, setUrl] = useState('')

  const [loading, setLoading] =
    useState(false)

  // IMPORTAÇÃO VIA ARQUIVO

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {

      const content =
        e.target?.result as string

      const parsedChannels =
        parseM3U(content)

      onChannelsLoaded(parsedChannels)
    }

    reader.readAsText(file)
  }

  // IMPORTAÇÃO VIA URL

  const handleUrlImport = async () => {

    if (!url) return

    try {

      setLoading(true)

      // força tratamento como texto puro
      const response = await fetch(url, {
        method: 'GET',
      })

      const content =
        await response.text()

      // detecta automaticamente M3U
      if (
        content.includes('#EXTM3U') ||
        content.includes('#EXTINF')
      ) {

        const parsedChannels =
          parseM3U(content)

        onChannelsLoaded(parsedChannels)
      }

      else {

        alert(
          'Formato não reconhecido'
        )
      }

    } catch (error) {

      console.error(error)

      alert(
        'Erro ao importar URL'
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 mb-4">

      {/* IMPORTAR ARQUIVO */}

      <label
        className="
          flex
          items-center
          justify-center
          w-full
          p-3
          rounded-xl
          bg-cyan-600
          hover:bg-cyan-500
          cursor-pointer
          transition
        "
      >
        Importar Arquivo

        <input
          type="file"
          accept="*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* IMPORTAÇÃO VIA URL */}

      <div className="space-y-2">

        <input
          type="text"
          placeholder="
https://servidor/lista
https://servidor/get.php
https://github/raw/lista.m3u
          "
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
          className="
            w-full
            p-3
            rounded-xl
            bg-zinc-800
            border
            border-zinc-700
            outline-none
          "
        />

        <button
          onClick={handleUrlImport}
          disabled={loading}
          className="
            w-full
            p-3
            rounded-xl
            bg-green-600
            hover:bg-green-500
            transition
            disabled:opacity-50
          "
        >
          {
            loading
              ? 'Importando...'
              : 'Importar via URL'
          }
        </button>

      </div>

    </div>
  )
}