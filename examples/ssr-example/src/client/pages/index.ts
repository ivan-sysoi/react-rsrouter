import { RouteSchema } from 'react-rsrouter'

import AboutPage from './AboutPage'
import MainPage from './MainPage'
import NotFoundPage from './NotFoundPage'
import ArticlesPage from './articles'

export type PageComponent = { route: RouteSchema }

export {
  AboutPage,
  MainPage,
  ArticlesPage,
  NotFoundPage,
}