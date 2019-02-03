import * as React from 'react'
import { connect } from 'react-redux'
import { select, put } from 'redux-saga/effects'
import { selectParams, Route, DynamicRouteSchema, RouterLocation, notFound } from 'react-rsrouter'

import { RootState, FetchState } from 'store'
import { selectArticle, fetchArticle } from 'store/articles'
import articleService, { Article } from 'services/articlesService'
import { PageComponent } from '..';

const pathRegExp = /^\/([\w-]+)$/

const route: DynamicRouteSchema = {
  id: 'detail',
  type: 'dynamic',
  buildUrl({ slug }: { slug: string }) {   
    return `/${slug}`
  },
  pathMatcher(location: RouterLocation) {   
    const pathMatch = location.pathname.match(pathRegExp)

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
  *onEnter() {
    const params = yield select(selectParams)
    yield put(fetchArticle.request())
    try {     
      const article = yield articleService.fetchArticle(params.slug, params.rubric.slug)     
      yield put(fetchArticle.success(article))
    } catch (e) {
      yield put(fetchArticle.failure())
      yield put(notFound())
    }    
  }
}

interface ArticlePageProps {
  article: FetchState<Article | null>
}

class ArticleDetailPage extends React.Component<ArticlePageProps> {

  static route = route

  render() {
    const { article } = this.props
    return (
      <Route
        {...route}
      >
        {article.loading && <div>Loading...</div>}
        {article.error && <div>Error</div>}
        {article.data && (
          <>
            <h1>{article.data.title}</h1>
            {article.data.text.map((l, ind) => <p key={ind}>{l}</p>)}
          </>
          )}
      </Route>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  article: selectArticle(state),
})

const ConnectedArticleDetailPage = connect(mapStateToProps)(ArticleDetailPage)

export default ConnectedArticleDetailPage as typeof ConnectedArticleDetailPage & PageComponent
