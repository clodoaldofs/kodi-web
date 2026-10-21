import { Channel } from '@/types/channel'

export async function parseM3U(
  content: string
): Promise<Channel[]> {

  const lines =
    content.split('\n')

  const channels: Channel[] = []

  let currentChannel:
    Partial<Channel> | null = null

  let counter = 0

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {

    const line =
      lines[i].trim()

    if (!line) {
      continue
    }

    if (
      line.startsWith(
        '#EXTINF'
      )
    ) {

      const logoMatch =
        line.match(
          /tvg-logo="([^"]*)"/i
        )

      const groupMatch =
        line.match(
          /group-title="([^"]*)"/i
        )

      const name =
        line
          .split(',')
          .pop()
          ?.trim()
        ||
        'Sem nome'

      const category =
        groupMatch?.[1]
          ?.trim()
        ||
        'Outros'

      currentChannel = {

        id:
          `ch-${counter++}`,

        name,

        logo:
          logoMatch?.[1]
            ?.trim()
          ||
          '',

        category
      }
    }

    else if (

      currentChannel &&

      (
        line.startsWith('http') ||
        line.startsWith('https') ||
        line.startsWith('rtmp') ||
        line.startsWith('rtsp') ||
        line.startsWith('udp')
      )

    ) {

      channels.push({

        id:
          currentChannel.id!,

        name:
          currentChannel.name!,

        logo:
          currentChannel.logo!,

        category:
          currentChannel.category!,

        streamUrl:
          line
      })

      currentChannel = null
    }
  }

  return channels
}