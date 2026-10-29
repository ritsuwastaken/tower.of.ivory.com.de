'use client'

import Image, { type ImageProps } from 'next/image'
import { createContext, useContext, useState } from 'react'
import styled from 'styled-components'
import { Skeleton } from './Skeleton'

export const AssetBasePathContext = createContext('')

type CatalogImageProps = Omit<
  ImageProps,
  'src' | 'fill' | 'onLoad' | 'onError'
> & {
  src?: string
  fallbackSrc?: string
}

export function CatalogImage({
  src,
  fallbackSrc = '/icon/etc_alphabet_ii_i00.webp',
  ...props
}: CatalogImageProps) {
  const basePath = useContext(AssetBasePathContext)
  const source = `${basePath}${src || fallbackSrc}`
  const fallback = `${basePath}${fallbackSrc}`
  return (
    <LoadingImage
      key={`${source}:${fallback}`}
      {...props}
      src={source}
      fallbackSrc={fallback}
    />
  )
}

function LoadingImage({
  src,
  fallbackSrc,
  width,
  height,
  className,
  style,
  alt,
  ...props
}: CatalogImageProps & { src: string; fallbackSrc: string }) {
  const [failed, setFailed] = useState(false)
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const source = failed ? fallbackSrc : src
  return (
    <Frame
      className={className}
      style={{ width, height, ...style }}
      aria-busy={state === 'loading'}
    >
      {state !== 'loaded' && (
        <Placeholder
          aria-hidden="true"
          style={state === 'error' ? { animation: 'none' } : undefined}
        />
      )}
      <Image
        {...props}
        src={source}
        alt={alt}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'inherit',
          opacity: state === 'loaded' ? 1 : 0,
        }}
        onLoad={() => setState('loaded')}
        onError={() => {
          if (!failed && src !== fallbackSrc) {
            setFailed(true)
            setState('loading')
          } else setState('error')
        }}
      />
    </Frame>
  )
}

export function CatalogIcon({
  icon,
  fallback = 'etc_alphabet_ii_i00',
  width = 32,
  height = 32,
  ...props
}: Omit<CatalogImageProps, 'src' | 'fallbackSrc'> & {
  icon?: string
  fallback?: string
}) {
  return (
    <IconImage
      {...props}
      width={width}
      height={height}
      src={icon ? `/icon/${icon.split('.').at(-1)}.webp` : undefined}
      fallbackSrc={`/icon/${fallback}.webp`}
    />
  )
}

const Frame = styled.span`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  vertical-align: middle;
  max-width: 100%;

  img {
    display: block;
    border-radius: inherit;
  }
`

const Placeholder = styled(Skeleton)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
`

const IconImage = styled(CatalogImage)`
  border-radius: 4px;
  border: 1px solid #3a3a3a;
`
