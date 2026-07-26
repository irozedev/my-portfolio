import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Reserves space before the image loads, e.g. "16 / 9". Defaults to 16/9. */
  aspectRatio?: string
}

export function ImageWithFallback({
  src,
  alt,
  style,
  className,
  aspectRatio = '16 / 9',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  // Without a reserved box the image pops in at its natural size and shoves
  // everything below it down — the main source of layout shift on this page.
  // aspect-ratio holds the slot from first paint; an explicit width/height pair
  // in `style` still wins because inline styles are merged last.
  const reservedSpace: React.CSSProperties = { aspectRatio, ...style }

  if (didError) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-[var(--bg-secondary)] align-middle ${className ?? ''}`}
        style={reservedSpace}
      >
        <img
          src={ERROR_IMG_SRC}
          alt={alt ? `${alt} (failed to load)` : 'Image failed to load'}
          width={88}
          height={88}
          data-original-url={src}
        />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      className={className}
      style={reservedSpace}
      loading={loading}
      decoding={decoding}
      onError={() => setDidError(true)}
      {...rest}
    />
  )
}
