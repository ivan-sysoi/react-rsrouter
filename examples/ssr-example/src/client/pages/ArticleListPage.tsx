import * as React from 'react'
import { connect } from 'react-redux'
import { Link, getParams } from 'react-rsrouter'

import { Article } from 'services/articlesService'
import { RootState, FetchState } from 'store'
import { Rubric } from 'store/rubrics'
import { getArticleList } from 'store/articles'

interface ArticleListPageProps {
  readonly selectedRubric: Rubric | undefined
  readonly articles: FetchState<Article[]>
}

function ArticleListPage({ selectedRubric, articles }: ArticleListPageProps) {
  return (
    <>
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
                slug: a.slug,
              }}
            >
              {a.title}
            </Link>
          </h3>
          <span>rubric: </span>
          <Link
            to="articles.list"
            params={{
              rubric: a.rubric,
            }}
          >
            {a.rubric}
          </Link>
        </article>
      ))}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  selectedRubric: getParams(state, 'rubric'),
  articles: getArticleList(state),
})

export default connect(mapStateToProps)(ArticleListPage)
