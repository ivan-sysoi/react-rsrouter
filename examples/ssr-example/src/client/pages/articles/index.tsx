import * as React from 'react'
import { connect } from 'react-redux'
import { Route, DynamicRouteSchema, MatcherResult, Link } from 'react-rsrouter'

import { RootState } from 'store'
import { selectRubricBySlug, selectRubrics, Rubric } from 'store/rubrics'
import { PageComponent } from '..'

import ArticleListPage from './ArticleListPage'
import ArticleDetailPage from './ArticleDetailPage'
import ArticleNotFound from './ArticleNotFound'

const pathRegExp = /^\/articles(\/rubric\/(?<slug>[\w-]+)(?<rest>.*)?)?$/
interface pathRegExpMatch extends RegExpMatchArray {
  groups: {
    slug: string
    rest: string
  }
}

const route: DynamicRouteSchema = {
  id: 'articles',
  type: 'dynamic',
  nested: [
    ArticleListPage.route,
    ArticleDetailPage.route,
    ArticleNotFound.route,
  ],
  buildUrl({ rubric }: { rubric: Rubric | string }, context) {
    if (rubric) {
      const slug = typeof rubric === 'string' ? rubric : rubric.slug
      return `/articles/rubric/${slug}`
    }
    return `/articles`
  },
  pathMatcher(location, { getState }) {
    const pathMatch = location.pathname.match(pathRegExp) as (pathRegExpMatch | undefined)

    if (pathMatch) {
      let rubric
      if (pathMatch.groups.slug) {
        rubric = selectRubricBySlug(getState() as RootState, pathMatch.groups.slug)
      }

      let nextLocation = { ...location, pathname: '' }
      if (rubric && pathMatch.groups.rest && pathMatch.groups.rest.length > 0) {
        nextLocation.pathname = pathMatch.groups.rest
      }

      return {
        params: {
          rubric,
        },
        nextLocation,
      } as MatcherResult
    }
    return null
  }
}

const Aside = ({ rubrics }: { rubrics: Rubric[] }) => (
  <aside>
    <h3>Rubrics</h3>
    <ul>
      <li>
        <Link
          to="articles.list"
        >
          All
              </Link>

      </li>
      {rubrics.map(rubric => (
        <li
          key={rubric.slug}
        >
          <Link
            to="articles.list"
            params={{
              rubric,
            }}
          >
            {rubric.name}
          </Link>

        </li>
      ))}
    </ul>
  </aside>
)

interface ArticlesPageProps {
  readonly rubrics: Rubric[],
}
  
class ArticlesPage extends React.Component<ArticlesPageProps> {
  static route = route

  render() {
    return (
      <Route
        {...route}
      >
        <Aside
          rubrics={this.props.rubrics}
        />
        <main>
          <ArticleDetailPage/>
          <ArticleListPage/>
          <ArticleNotFound/>
        </main>
      </Route>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  rubrics: selectRubrics(state),
})

const ConnectedArticlesPage = connect(mapStateToProps)(ArticlesPage)

export default ConnectedArticlesPage as typeof ConnectedArticlesPage & PageComponent
