import { RootState } from "store"

export type Rubric = { name: string, slug: string }
const RUBRICS_INITIAL = [
  { slug: 'news', name: 'News' },
  { slug: 'sports', 'name': 'Sports' },
  { slug: 'events', name: 'Events' }
]

export const selectRubrics = (state: RootState) => state.rubrics

export const selectRubricBySlug = (state: RootState, slug: string): Rubric | undefined =>
  state.rubrics.find((r: Rubric) => r.slug === slug)

export const reducer = {
  rubrics: function rubricsReducer(state = RUBRICS_INITIAL): Rubric[] {
    return state
  }
}