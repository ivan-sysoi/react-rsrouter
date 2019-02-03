import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as express from 'express'

import { selectServerResponse } from 'react-rsrouter'

import App from './client/App'
import { configureStore, RootState } from './store'

const app = express()

const appTemplate = (state: RootState, content: string) => {
  return `
<!DOCTYPE html>
<html>
  <title>SSR Example</title>
</html>
<body>
  <div id="root">${content}</div>
  <link href="https://fonts.googleapis.com/css?family=Sarabun" rel="stylesheet">
  <script>
    window.__STATE__ = ${JSON.stringify(state)};
  </script>
  <style type="text/css">
    html, body, #root {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: 'Sarabun', sans-serif;
    }
    #root {
      display: flex;
      flex-direction: column;
      align-content: space-between;
    }
    header, .page, footer {
      padding: 20px;
    }
    header {
      height: 100px;
      background-color: rgba(58,90,116,0.87);
      color: #fff;
    }
    footer {
      height: 50px;
      background-color: rgba(0,0,0,0.61);
      color: #fff;
    }
    nav {
      display: flex;
    }
    nav > a {
      padding-right: 10px;
    }
    .page {
      display: flex;
      flex: 1;
    }
    aside {
      flex-basis: 20%;
    }
    main {
      flex: 1;
    }
  </style>
  <script src="http://localhost:${process.env.WEBPACK_PORT}/static/vendors~bundle.client.js"></script>
  <script src="http://localhost:${process.env.WEBPACK_PORT}/static/client.js"></script>
</body>
`
}

app.use((req, res, next) => {
  configureStore(undefined, { pathname: req.path, search: '' } as Location).then(store => {
    const state: RootState = store.getState()
    const { status, location } = selectServerResponse(state)

    if (status in [301, 302] && location) {
      res.redirect(status, location)
    } else {
      const content = ReactDOMServer.renderToString(<App store={store} />)
      res.status(status).send(appTemplate(state, content))
    }
  }, next)
})

app.listen(process.env.PORT, (error: Error) => {
  const boldBlue = (text: string) => `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`
  if (error) {
    console.error(error)
  } else {
    console.info(`App is running 🌎 ${boldBlue(`http://localhost:${process.env.PORT}/`)}`)
  }
})

export default app
