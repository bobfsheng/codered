import { useSelector } from 'react-redux'

export const useAppStateSelector = <TSelected>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected => {
  return useSelector<RootState, TSelected>(selector, equalityFn)
}
export const buildSubStateSelector = <TSubState>(
  baseSubStateSelector: (state: RootState) => TSubState,
) => {
  return function <TSelected>(
    subSelector: (state: TSubState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ) {
    const selector = (state: RootState) => subSelector(baseSubStateSelector(state))
    return useSelector<RootState, TSelected>(selector, equalityFn)
  }
}
