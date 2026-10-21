'use client'

import Image from 'next/image'
import { Channel } from '@/types/channel'


interface Props {

  channels: Channel[]

  currentChannel: string

  epgData: Record<string, any>

  onSelect: (
    url: string
  ) => void
}

export default function ChannelList({

  channels,

  currentChannel,

  epgData,

  onSelect

}: Props) {
    console.log(
    'Renderizando:',
    channels.length,
    'canais'
  )

  return (

    <div
      className="
        space-y-3
      "
    >

      {channels.map((
        channel,
        index
      ) => {

        console.log(
          'Canal:',
          channel.name
        )

        const epg =
          epgData?.[
            channel.name
          ]

        return (

          <button
            key={`${channel.streamUrl}-${index}`}
            onClick={() => {

            console.log(
              'Selecionado:',
              channel.name
            )

            onSelect(
              channel.streamUrl
            )
            }}
            className={`
              w-full
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              transition
              text-left

              ${
                currentChannel ===
                channel.streamUrl

                  ? `
                    bg-cyan-500
                    text-black
                  `

                  : `
                    bg-zinc-800
                    hover:bg-zinc-700
                    text-white
                  `
              }
            `}
          >

            {/* LOGO */}

            <div
              className="
                relative
                w-14
                h-14
                shrink-0
                bg-black
                rounded-lg
                overflow-hidden
              "
            >

              <Image
                src={
                  channel.logo?.trim() ||

                  '/channel-placeholder.png'
                }
                alt={channel.name}
                fill
                className="
                  object-contain
                "
                unoptimized
              />

            </div>

            {/* INFORMAÇÕES */}

            <div
              className="
                flex-1
                min-w-0
              "
            >

              <h3
                className="
                  font-bold
                  truncate
                "
              >
                {channel.name}
              </h3>

              {epg && (

                <p
                  className="
                    text-sm
                    opacity-70
                    truncate
                  "
                >
                  {epg.title}
                </p>

              )}

            </div>

          </button>
        )
      })}

      {channels.length === 0 && (

        <div
          className="
            text-center
            py-10
            text-zinc-500
          "
        >
          Nenhum canal encontrado
        </div>

      )}

    </div>
  )
}