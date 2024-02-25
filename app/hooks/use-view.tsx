import { useContext, useEffect } from 'react'
import { ViewContext } from '../providers'

export const useView = () => {
  const { view, setView: setViewType } = useContext(ViewContext)

  // read the current view from localStorage
  // if it exists, set the view to the value from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedView = localStorage.getItem('view')
      if (storedView) {
        setViewType(storedView as 'list' | 'grid')
      }
    }
  }, [setViewType])

  function setView(newView: 'list' | 'grid') {
    setViewType(newView)
    localStorage.setItem('view', newView)
  }

  return {
    view,
    setView,
  }
}
