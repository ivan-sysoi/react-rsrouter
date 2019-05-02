import * as React from 'react'
import { Link } from 'react-rsrouter'

import { Rubric } from 'store/rubrics'

function ArticlesAside({ rubrics }: { rubrics: Rubric[] }) {

  return (
    <aside>
      <h3>Rubrics</h3>
      <ul>
        <li>
          <Link to="articles.list">
            All
          </Link>
        </li>
        {rubrics.map(rubric => (
          <li key={rubric.slug}>
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
}

export default ArticlesAside
