import { createBrowserHistory, History } from 'history'
import { RouterLocation } from './'

export interface RouterHistory extends History {
  back: () => void
}

let history: RouterHistory | null = null

if (typeof window === 'object') {
  history = createBrowserHistory() as RouterHistory
}

export default history
