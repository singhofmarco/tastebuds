import { parseAsStringEnum, useQueryState } from 'nuqs'

export const useView = () => {
  const [view, setView] = useQueryState(
    'view',
    parseAsStringEnum(['list', 'grid']).withDefault('grid')
  )

  return {
    view,
    setView,
  }
}
