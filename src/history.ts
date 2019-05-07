import { createBrowserHistory, History } from 'history'

export interface RouterHistory extends History {
  back: () => void
}

let history: RouterHistory | null = null

if (typeof window === 'object') {
  history = createBrowserHistory() as RouterHistory
}

export default history
