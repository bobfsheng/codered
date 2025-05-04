import { useEffect } from 'react'

const useDebounce = (actionToPerform, whenPerform, delay) => {
  useEffect(() => {
    const handler = setTimeout(() => actionToPerform(), delay)

    return () => clearTimeout(handler)
  }, [...(whenPerform || []), delay])
}

export { useDebounce }
