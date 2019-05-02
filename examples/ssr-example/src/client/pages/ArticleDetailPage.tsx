import * as React from 'react'
import { connect } from 'react-redux'

import { RootState, FetchState } from 'store'
import { getArticle } from 'store/articles'
import { Article } from 'services/articlesService'

interface ArticlePageProps {
  article: FetchState<Article | null>
}

function ArticleDetailPage({ article }: ArticlePageProps) {
  return (
    <>
      {article.loading && <div>Loading...</div>}
      {article.error && <div>Error</div>}
      {article.data && (
        <>
          <h1>{article.data.title}</h1>
          {article.data.text.map((l, ind) => <p key={ind}>{l}</p>)}
        </>
      )}
    </>
  )
}
const mapStateToProps = (state: RootState) => ({
  article: getArticle(state),
})

export default connect(mapStateToProps)(ArticleDetailPage)
