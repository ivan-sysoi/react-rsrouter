import * as React from 'react'
import { connect } from 'react-redux'
import { Routes, IRoutesCollection } from 'react-rsrouter'

import { RootState } from 'store'
import { getRubrics, Rubric } from 'store/rubrics'

import ArticlesAside from 'client/layout/ArticlesAside'


interface ArticlesPageProps {
  readonly rubrics: Rubric[],
  readonly routes: IRoutesCollection,
}

function ArticlesPage({ routes, rubrics }: ArticlesPageProps) {
  return (
    <>
      <ArticlesAside
        rubrics={rubrics}
      />
      <main>
        <Routes routes={routes}/>
      </main>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  rubrics: getRubrics(state),
})

export default connect(mapStateToProps)(ArticlesPage)
