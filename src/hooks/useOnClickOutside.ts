import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'

const useClientLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void,
) {
  const savedHandler = useRef(handler)
  useClientLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (target?.isConnected && ref.current && !ref.current.contains(target)) {
        savedHandler.current(event)
      }
    }
    window.addEventListener('mousedown', listener)
    return () => window.removeEventListener('mousedown', listener)
  }, [ref])
}
