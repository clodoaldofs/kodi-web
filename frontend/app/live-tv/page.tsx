'use client'

import { Channel } from '@/types/channel'

import {
  useEffect,
  useState
} from 'react'

import Link from 'next/link'

import VideoPlayer from '@/components/player/VideoPlayer'
import ChannelList from '@/components/channels/ChannelList'

import {
  fetchEPG
} from '@/lib/parseEPG'

export default function LiveTVPage() {

  const [channels, setChannels] =
    useState<Channel[]>([])

  const [
    currentChannel,
    setCurrentChannel
  ] =
    useState<Channel | null>(null)

  const [epgData, setEpgData] =
    useState<any>({})

  const [search, setSearch] =
    useState('')

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState('Todos')

  useEffect(() => {

    const savedChannels =
      localStorage.getItem(
        'kodi-web-channels'
      )

    if (savedChannels) {

      try {

        const parsedChannels =
          JSON.parse(savedChannels)

        if (
          Array.isArray(
            parsedChannels
          )
        ) {

          const cleanChannels =

            parsedChannels.map(
              (
                channel: Channel,
                index: number
              ) => ({

                id:
                  channel.id ||
                  `${channel.name}-${index}`,

                name:
                  channel.name ||
                  'Sem nome',

                logo:
                  channel.logo || '',

                category:
                  channel.category ||
                  'Outros',

                streamUrl:
                  channel.streamUrl || ''
              })
            )

          setChannels(
            cleanChannels
          )

          if (
            cleanChannels.length > 0
          ) {

            setCurrentChannel(
              cleanChannels[0]
            )
          }
        }

      } catch (error) {

        console.error(
          'Erro canais:',
          error
        )
      }
    }

    const epgUrl =
      localStorage.getItem(
        'kodi-web-epg-url'
      )

    if (epgUrl) {

      fetchEPG(epgUrl)

        .then((data) => {

          setEpgData(data)

        })

        .catch((error) => {

          console.error(
            'Erro EPG:',
            error
          )
        })
    }

  }, [])
   const categories = [

      'Todos',

      ...new Set(
        channels.map(
          channel =>
            channel.category ||
            'Outros'
        )
      )

    ]

  const filteredChannels =
  channels.filter(
    (channel) => {

      const normalize =
        (text: string) =>
          String(text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(
              /[\u0300-\u036f]/g,
              ''
            )
            .replace(
              /[^a-z0-9]/g,
              ''
            )

      const channelName =
        normalize(channel.name)

      const searchText =
        normalize(search)

      const matchSearch =

        !searchText ||

        channelName.includes(
          searchText
        )

      const matchCategory =

        selectedCategory ===
        'Todos'

        ||

        channel.category ===
        selectedCategory

      return (
        matchSearch &&
        matchCategory
      )
    }
  )
  return (

    <main
      className="
        fixed
        inset-0
        bg-zinc-950
        text-white
        flex
        flex-col
        overflow-hidden
      "
    >

      {/* HEADER */}

      <header
        className="
          flex
          items-center
          justify-between
          p-3
          border-b
          border-zinc-800
          shrink-0
          bg-zinc-950
          z-20
        "
      >

        <Link href="/">

          <h1
            className="
              text-xl
              sm:text-2xl
              font-bold
              text-cyan-400
            "
          >
            Kodi Web IPTV
          </h1>

        </Link>

      </header>

      {/* CONTEÚDO */}

      <div
        className="
          flex-1
          overflow-hidden
          flex
          flex-col
          gap-4
          p-2
          sm:p-4
        "
      >

        {/* PLAYER */}

        <section
          className="
            bg-zinc-900
            rounded-2xl
            p-3
            shrink-0
            h-[240px]
            sm:h-[320px]
            md:h-[420px]
            flex
            flex-col
            overflow-hidden
          "
        >

          {currentChannel ? (

            <>

              <h2
                className="
                  text-lg
                  sm:text-2xl
                  font-bold
                  mb-3
                "
              >
                {currentChannel.name}
              </h2>

              <div
                className="
                  flex-1
                  overflow-hidden
                  rounded-2xl
                "
              >

                <VideoPlayer
                  url={
                    currentChannel.streamUrl
                  }
                />

              </div>

            </>

          ) : (

            <div
              className="
                h-full
                flex
                items-center
                justify-center
                text-zinc-500
              "
            >
              Nenhum canal selecionado
            </div>

          )}

        </section>

        {/* LISTA */}

        <section
          className="
            flex-1
            min-h-0
            bg-zinc-900
            rounded-2xl
            p-3
            overflow-hidden
            flex
            flex-col
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-4
            "
          >
            Canais
          </h2>

          {/* BUSCA */}

        <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Pesquisar canal..."
        className="
          w-full
          mb-2
          p-3
          rounded-xl
          bg-zinc-800
          border
          border-zinc-700
          outline-none
          focus:border-cyan-500
        "
      />

 
        
        <div
  className="
    flex
    gap-2
    overflow-x-auto
    mb-3
    pb-1
  "
>

  {categories.map(
      (category) => (

        <button
          key={category}
          onClick={() =>
            setSelectedCategory(
              category
            )
          }
          className={`
            px-4
            py-2
            rounded-full
            whitespace-nowrap
            text-sm
            transition

            ${
              selectedCategory ===
              category

                ? `
                  bg-cyan-500
                  text-black
                `

                : `
                  bg-zinc-800
                  text-white
                  hover:bg-zinc-700
                `
            }
          `}
        >

          {category}

        </button>

      )
    )}

  </div>
        <p
          className="
            text-sm
            text-zinc-400
            mb-3
          "
        >
          {filteredChannels.length}
          {' '}
          canais encontrados
        </p>

        <div
                  
          className="
            flex-1
            overflow-y-auto
            min-h-0
          "
        >

          <ChannelList
            channels={filteredChannels}
            epgData={epgData}
            currentChannel={
              currentChannel?.streamUrl || ''
            }
            onSelect={(url) => {

              console.log(
                'Selecionado:',
                url
              )

              const selected =
                channels.find(
                  (channel) =>
                    channel.streamUrl === url
                )

              if (selected) {

                console.log(
                  'Canal encontrado:',
                  selected.name
                )

                setCurrentChannel(
                  selected
                )
              }
            }}
          />

        </div>

        </section>

      </div>

    </main>
  )
}