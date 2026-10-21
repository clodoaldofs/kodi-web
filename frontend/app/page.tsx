import Link from 'next/link'

export default function HomePage() {

  return (

    <main
      className="
        min-h-screen
        bg-zinc-950
        text-white
        flex
        flex-col
        items-center
        justify-center
        gap-6
      "
    >

      <h1
        className="
          text-6xl
          font-bold
          text-cyan-400
        "
      >
        Kodi Web IPTV
      </h1>

      <div
        className="
          flex
          gap-4
        "
      >

        <Link href="/live-tv">

          <button
            className="
              bg-cyan-500
              hover:bg-cyan-400
              px-8
              py-4
              rounded-2xl
              text-xl
              font-semibold
              transition
            "
          >
            Live TV
          </button>

        </Link>

        <Link href="/settings">

          <button
            className="
              bg-zinc-800
              hover:bg-zinc-700
              px-8
              py-4
              rounded-2xl
              text-xl
              font-semibold
              transition
            "
          >
            Configurações
          </button>

        </Link>

      </div>

    </main>
  )
}