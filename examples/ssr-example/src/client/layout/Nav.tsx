import * as React from 'react'
import { Link } from 'react-rsrouter'

function Nav() {
  return (
    <nav>
      <Link to="main">Main</Link>
      <Link to="articles">Articles</Link>
      <Link to="about">About</Link>
    </nav>
  )
}

export default Nav
