import createBrowserHistory from 'history/createBrowserHistory'
import { RouterLocation } from '.'

interface RouterHistory {
  push: (url: string) => void
  replace: (url: string) => void
  listen: (cb: (location: RouterLocation) => void) => void
  location: RouterLocation
}

let history: RouterHistory | null = null

if (typeof window === 'object') {
  history = createBrowserHistory() as RouterHistory
}

export default history
