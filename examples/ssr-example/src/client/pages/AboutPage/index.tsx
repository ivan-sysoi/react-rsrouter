import * as React from 'react'

const { lazy, Suspense } = React
declare var isBrowser: boolean

let AboutPageComponent: React.ComponentFactory<{}, React.Component>
if (isBrowser) {
  const LazyAboutPage = lazy(() => import(/* webpackChunkName: "about-page" */'./AboutPage'))
  AboutPageComponent = () => (
    <Suspense
      fallback={<div>About page is loading...</div>}
    >
      <LazyAboutPage/>
    </Suspense>
  )
} else {
  AboutPageComponent = require('./AboutPage').default
}

export default AboutPageComponent
