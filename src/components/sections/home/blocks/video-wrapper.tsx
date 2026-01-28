"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/cn"

type BaseComponentProps = {
  className?: string
  children?: React.ReactNode
}

type Props = BaseComponentProps & {
  margin?: string
  inView?: boolean
}

export function VideoWrapper({ className, children, margin, inView }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlayable, setIsPlayable] = useState(true)
  const [isInView, setIsInView] = useState(inView ?? false)

  useEffect(() => {
    if (inView !== undefined) {
      setIsInView(inView)
      return
    }

    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      margin ? { rootMargin: margin } : undefined
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [inView, margin])

  useEffect(() => {
    if (!videoRef.current || !isInView) return

    videoRef.current.play().catch((err) => {
      if (err.name === "NotAllowedError") {
        // Video couldn't play, low power play button showing.
        setIsPlayable(false)
      }
    })
  }, [isInView])

  if (!isPlayable) return null

  return (
    <div ref={containerRef}>
      {isInView && (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 z-1 size-full object-cover",
            className
          )}
          autoPlay
          playsInline
          loop
          muted
          disablePictureInPicture
          disableRemotePlayback
          preload="none"
        >
          {children}
        </video>
      )}
    </div>
  )
}
