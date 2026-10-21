import {
  EPGData
} from '@/types/epg'

export async function fetchEPG(
  epgUrl: string
): Promise<EPGData> {

  const response =
    await fetch(epgUrl)

  const xml =
    await response.text()

  const parser =
    new DOMParser()

  const xmlDoc =
    parser.parseFromString(
      xml,
      'text/xml'
    )

  const programmes =
    xmlDoc.getElementsByTagName(
      'programme'
    )

  const epgData: EPGData = {}

  for (
    let i = 0;
    i < programmes.length;
    i++
  ) {

    const programme =
      programmes[i]

    const channel =
      programme
        .getAttribute('channel')
        ?.toLowerCase()

    const title =
      programme
        .getElementsByTagName(
          'title'
        )[0]
        ?.textContent || ''

    const start =
      programme.getAttribute(
        'start'
      ) || ''

    const stop =
      programme.getAttribute(
        'stop'
      ) || ''

    if (!channel) continue

    if (!epgData[channel]) {

      epgData[channel] = []
    }

    epgData[channel].push({

      title,

      start,

      stop
    })
  }

  return epgData
}