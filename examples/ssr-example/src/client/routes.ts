import { select, put } from 'redux-saga/effects'
import { MatcherResult, notFound, RoutesCollection, getParams, RouterLocation } from 'react-rsrouter'

import { RootState } from 'store'
import { Rubric, getRubricBySlug } from 'store/rubrics'
import { fetchArticle, fetchArticlesList } from 'store/articles'
import articlesService from 'services/articlesService'

import {
  AboutPage, ArticlesPage, MainPage, NotFoundPage, ArticleListPage, ArticleDetailPage, ArticleNotFound,
} from './pages'

const slugRegExp = /^\/([\w-]+)$/
const articlesPathRegExp = /^\/articles(\/rubric\/(?<slug>[\w-]+)(?<rest>.*)?)?$/
interface PathRegExpMatch extends RegExpMatchArray {
  groups: {
    slug: string,
    rest: string,
  }
}

export default new RoutesCollection([
  {
    id: 'main',
    path:'/$',
    type: 'static',
    component: MainPage,
  },
  {
    id: 'about',
    path: '/about$',
    type: 'static',
    component: AboutPage,
  },
  {
    id: 'articles',
    type: 'dynamic',
    buildUrl({ rubric }: { rubric: Rubric | string }) {
      if (rubric) {
        const slug = typeof rubric === 'string' ? rubric : rubric.slug
        return `/articles/rubric/${slug}`
      }
      return '/articles'
    },
    pathMatcher(location, { getState }) {
      const pathMatch = location.pathname.match(articlesPathRegExp) as (PathRegExpMatch | undefined)

      if (pathMatch) {
        let rubric
        if (pathMatch.groups.slug) {
          rubric = getRubricBySlug(getState() as RootState, pathMatch.groups.slug)
          if (!rubric) {
            return null // not matched
          }
        }

        const nextLocation = { ...location, pathname: '' }
        if (rubric && pathMatch.groups.rest && pathMatch.groups.rest.length > 0) {
          nextLocation.pathname = pathMatch.groups.rest
        }

        return {
          nextLocation,
          params: {
            rubric,
          },
        } as MatcherResult
      }
      return null
    },
    component: ArticlesPage,
    routes: [
      {
        id: 'list',
        type: 'static',
        path: '$',
        component: ArticleListPage,
        *onEnter() {
          const selectedRubric = yield select(getParams, 'rubric')
          yield put(fetchArticlesList.request())
          try {
            const articles = yield articlesService.fetchArticles(selectedRubric && selectedRubric.slug)
            yield put(fetchArticlesList.success(articles))
          } catch (e) {
            yield put(fetchArticlesList.failure())
            yield put(notFound())
          }
        },
      },
      {
        id: 'detail',
        type: 'dynamic',
        buildUrl({ slug }: { slug: string }) {
          return `/${slug}`
        },
        pathMatcher(location: RouterLocation) {
          const pathMatch = location.pathname.match(slugRegExp)

          if (pathMatch) {
            return {
              params: {
                slug: pathMatch[1],
              },
              nextLocation: null,
            }
          }
          return null
        },
        component: ArticleDetailPage,
        *onEnter() {
          const params = yield select(getParams)
          yield put(fetchArticle.request())
          try {
            const article = yield articlesService.fetchArticle(params.slug, params.rubric.slug)
            yield put(fetchArticle.success(article))
          } catch (e) {
            yield put(fetchArticle.failure())
            yield put(notFound())
          }
        },
      },
      {
        id: 'not-found',
        type: 'fallback',
        component: ArticleNotFound,
      },
    ],
  },
  {
    id: 'not-found',
    type: 'fallback',
    component: NotFoundPage,
  },
])
