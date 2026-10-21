'use client'

import {
  useEffect,
  useState
} from 'react'

import Link from 'next/link'

import {
  parseM3U
} from '@/lib/parseM3U'

export default function SettingsPage() {

  const [url, setUrl] =
    useState('')

  const [epgUrl, setEpgUrl] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [channelCount, setChannelCount] =
    useState(0)

  const [categoryCount, setCategoryCount] =
    useState(0)

  // CARREGAR CONFIGURAÇÕES SALVAS

  useEffect(() => {

    const savedUrl =
      localStorage.getItem(
        'kodi-web-playlist-url'
      )

    const savedEpg =
      localStorage.getItem(
        'kodi-web-epg-url'
      )

    if (savedUrl) {
      setUrl(savedUrl)
    }

    if (savedEpg) {
      setEpgUrl(savedEpg)
    }

  }, [])

  // IMPORTAR URL IPTV

  async function importPlaylist() {

    if (!url.trim()) {

      alert(
        'Informe uma URL da playlist.'
      )

      return
    }

    if (
      !url.startsWith('http')
    ) {

      alert(
        'Informe uma URL válida.'
      )

      return
    }

    try {

      setLoading(true)

      const response =
        await fetch(url)

      if (!response.ok) {

        throw new Error(
          'Falha ao baixar playlist'
        )
      }

      const text =
        await response.text()

      if (
        !text.includes(
          '#EXTM3U'
        )
      ) {

        alert(
          'Playlist inválida.'
        )

        setLoading(false)

        return
      }

      const parsedChannels =
        await parseM3U(text)

      if (
        parsedChannels.length === 0
      ) {

        alert(
          'Nenhum canal encontrado.'
        )

        setLoading(false)

        return
      }

      const categories =
        new Set(
          parsedChannels.map(
            channel =>
              channel.category
          )
        )

      setChannelCount(
        parsedChannels.length
      )

      setCategoryCount(
        categories.size
      )

      // SALVAR CANAIS

      localStorage.setItem(
        'kodi-web-channels',
        JSON.stringify(
          parsedChannels
        )
      )

      // SALVAR CONFIGURAÇÕES

      localStorage.setItem(
        'kodi-web-playlist-url',
        url
      )

      localStorage.setItem(
        'kodi-web-epg-url',
        epgUrl
      )

      alert(
        `${parsedChannels.length} canais importados com sucesso.`
      )

    } catch (error) {

      console.error(error)

      alert(
        'Erro ao importar playlist.'
      )

    } finally {

      setLoading(false)

    }
  }

  // IMPORTAR ARQUIVO LOCAL

  async function importLocalFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0]

    if (!file) return

    try {

      setLoading(true)

      const text =
        await file.text()

      const parsedChannels =
        await parseM3U(text)

      if (
        parsedChannels.length === 0
      ) {

        alert(
          'Nenhum canal encontrado.'
        )

        return
      }

      const categories =
        new Set(
          parsedChannels.map(
            channel =>
              channel.category
          )
        )

      setChannelCount(
        parsedChannels.length
      )

      setCategoryCount(
        categories.size
      )

      localStorage.setItem(
        'kodi-web-channels',
        JSON.stringify(
          parsedChannels
        )
      )

      if (epgUrl) {

        localStorage.setItem(
          'kodi-web-epg-url',
          epgUrl
        )
      }

      alert(
        `${parsedChannels.length} canais importados com sucesso.`
      )

    } catch (error) {

      console.error(error)

      alert(
        'Erro ao importar arquivo.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <main
      className="
        min-h-screen
        bg-zinc-950
        text-white
        p-6
      "
    >

      <div
        className="
          max-w-2xl
          mx-auto
          space-y-6
        "
      >

        <Link
          href="/"
          className="
            text-cyan-400
            hover:underline
          "
        >
          ← Voltar
        </Link>

        <h1
          className="
            text-4xl
            font-bold
          "
        >
          Configurações
        </h1>

        {/* URL IPTV */}

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-lg
              font-semibold
            "
          >
            URL IPTV
          </label>

          <input
            type="text"
            value={url}
            onChange={(e) =>
              setUrl(
                e.target.value
              )
            }
            placeholder="https://..."
            className="
              w-full
              p-4
              rounded-xl
              bg-zinc-900
              border
              border-zinc-700
              outline-none
            "
          />

        </div>

        {/* URL EPG */}

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-lg
              font-semibold
            "
          >
            URL EPG
          </label>

          <input
            type="text"
            value={epgUrl}
            onChange={(e) =>
              setEpgUrl(
                e.target.value
              )
            }
            placeholder="https://..."
            className="
              w-full
              p-4
              rounded-xl
              bg-zinc-900
              border
              border-zinc-700
              outline-none
            "
          />

        </div>

        {/* IMPORTAR */}

        <button
          onClick={
            importPlaylist
          }
          disabled={
            loading
          }
          className="
            w-full
            p-4
            rounded-xl
            bg-cyan-500
            text-black
            font-bold
            hover:bg-cyan-400
            disabled:opacity-50
          "
        >
          {
            loading
              ? 'Importando...'
              : 'Importar Playlist'
          }
        </button>

        {/* ESTATÍSTICAS */}

        {channelCount > 0 && (

          <div
            className="
              p-4
              rounded-xl
              bg-zinc-900
              border
              border-zinc-800
              space-y-1
            "
          >

            <p>
              📺 Canais:
              {' '}
              {channelCount}
            </p>

            <p>
              📂 Categorias:
              {' '}
              {categoryCount}
            </p>

          </div>

        )}

        {/* ARQUIVO LOCAL */}

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              text-lg
              font-semibold
            "
          >
            Arquivo Local
          </label>

          <input
            type="file"
            accept=".m3u,.txt"
            onChange={
              importLocalFile
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-zinc-900
              border
              border-zinc-700
            "
          />

        </div>

      </div>

    </main>
  )
}