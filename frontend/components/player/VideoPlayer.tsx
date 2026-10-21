'use client'

interface Props {

  url: string
}

export default function VideoPlayer({
  url
}: Props) {

  return (

    <div
      className="
        w-full
        h-full
        bg-black
        rounded-2xl
        overflow-hidden
        flex
        items-center
        justify-center
      "
    >

      <video
        key={url}
        src={url}
        controls
        autoPlay
        playsInline
        className="
          w-full
          h-full
          object-contain
          bg-black
        "
      />

    </div>
  )
}