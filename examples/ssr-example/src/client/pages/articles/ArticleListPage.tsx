import * as React from 'react'
import { connect } from 'react-redux'
import { select, put } from 'redux-saga/effects'
import { Route, StaticRouteSchema, Link, RouteSchema, selectParams, notFound } from 'react-rsrouter'

import articlesService, { Article } from 'services/articlesService'
import { RootState, FetchState } from 'store'
import { Rubric } from 'store/rubrics'
import { fetchArticlesList, selectArticleList } from 'store/articles'
import { PageComponent } from '..'

const route: StaticRouteSchema = {
  id: 'list',
  type: 'static',
  path: '$',
  *onEnter() {
    const selectedRubric = yield select(selectParams, 'rubric')    
    yield put(fetchArticlesList.request())
    try {
      const articles = yield articlesService.fetchArticles(selectedRubric && selectedRubric.slug)
      yield put(fetchArticlesList.success(articles))    
    } catch (e) {
      yield put(fetchArticlesList.failure())    
      yield put(notFound())
    }  
  }
}

interface ArticleListPageProps {
  readonly selectedRubric: Rubric | undefined
  readonly articles: FetchState<Article[]>
}

class ArticleListPage extends React.Component<ArticleListPageProps> {

  public static route: RouteSchema = route

  render() {
    const { selectedRubric, articles } = this.props
   
    return (
      <Route {...route}>
        <h2>
          {selectedRubric ? `Rubric: ${selectedRubric.name}` : 'All articles'}
        </h2>   
        {articles.loading && <div>Loading...</div>}
        {articles.error && <div>Error</div>}
        {articles.data.map(a => (
          <article
            key={a.id}
          >
            <h3>
              <Link
                to="articles.detail"
                params={{
                  rubric: a.rubric,
                  slug: a.slug
                }}
              >
                {a.title}
              </Link>
            </h3>
            <span>rubric: </span>
            <Link
              to="articles.list"
              params={{
                rubric: a.rubric
              }}
            >
              {a.rubric}
            </Link>
          </article>
        ))}
   
      </Route>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedRubric: selectParams(state, 'rubric'),
  articles: selectArticleList(state),
})

const ConnectedArticleListPage = connect(mapStateToProps)(ArticleListPage)

export default ConnectedArticleListPage as typeof ConnectedArticleListPage & PageComponent
