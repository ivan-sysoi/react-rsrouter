export type Article = {
  id: number,
  slug: string,
  rubric: string,
  title: string,
  text: string[],
}

const ARTICLES = [
  {
    id: 1,
    title: 'News Article',
    slug: 'news-article',
    rubric: 'news',
    text: [
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et ' +
      'dolore magna aliquyam erat, sed diam voluptua.',
      'At vero eos et accusam et justo duo dolores et ea rebum.',
      'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et ' +
      'dolore magna aliquyam erat, sed diam voluptua.',
    ],
  },
  {
    id: 2,
    title: 'Sport Article',
    slug: 'sport-article',
    rubric: 'sports',
    text: [
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et ' +
      'dolore magna aliquyam erat, sed diam voluptua.',
      'At vero eos et accusam et justo duo dolores et ea rebum.',
      'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et ' +
      'dolore magna aliquyam erat, sed diam voluptua.',
    ],
  },
  {
    id: 3,
    title: 'Events Article',
    slug: 'events-article',
    rubric: 'events',
    text: [
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et ' +
      'dolore magna aliquyam erat, sed diam voluptua.',
      'At vero eos et accusam et justo duo dolores et ea rebum.',
      'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et ' +
      'dolore magna aliquyam erat, sed diam voluptua.',
    ],
  },
]

export default {
  fetchArticle(slug: string, rubric: string): Promise<Article> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const article = ARTICLES.find(a => a.slug === slug && a.rubric === rubric)
        if (article) {
          resolve(article)
        } else {
          reject(new Error('Not found'))
        }
      },         Math.random() * 1500)
    })
  },
  fetchArticles(rubric?: string): Promise<Article[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (rubric) {
          resolve(ARTICLES.filter(a => a.rubric === rubric))
        } else {
          resolve(ARTICLES)
        }
      },         Math.random() * 1500)
    })
  },
}
