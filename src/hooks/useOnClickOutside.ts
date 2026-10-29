import { type RefObject, useEffect, useEffectEvent } from 'react'

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void,
) {
  const onOutsideClick = useEffectEvent(handler)

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (target?.isConnected && ref.current && !ref.current.contains(target)) {
        onOutsideClick(event)
      }
    }
    window.addEventListener('mousedown', listener)
    return () => window.removeEventListener('mousedown', listener)
  }, [ref])
}
