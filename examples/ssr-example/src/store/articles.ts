import { createAsyncAction, getType, ActionType } from 'typesafe-actions'

import { RootState, FetchState } from 'store'
import { Article } from 'services/articlesService'

interface ArticleState  {
  item: FetchState<Article | null>
  list: FetchState<Article[]>
}

export const getArticle = (state: RootState) => state.articles.item
export const getArticleList = (state: RootState) => state.articles.list

export const fetchArticlesList = createAsyncAction(
  'ARTICLE_LIST_FETCH_REQUEST',
  'ARTICLE_LIST_FETCH_SUCCESS',
  'ARTICLE_LIST_FETCH_FAILURE',
)<void, Article[], void>()

export const fetchArticle = createAsyncAction(
  'ARTICLE_FETCH_REQUEST',
  'ARTICLE_FETCH_SUCCESS',
  'ARTICLE_FETCH_FAILURE',
)<void, Article, void>()

type ArticleActions = ActionType<typeof fetchArticlesList | typeof fetchArticle>

const initialState = { item: { data: null }, list: { data: [] } }
export const reducer = {
  articles: function articleReducer(state: ArticleState = initialState, action: ArticleActions) {
    switch (action.type) {
      case getType(fetchArticlesList.request): {
        return {
          ...state,
          list: { loading: true, data: [] },
        }
      }
      case getType(fetchArticlesList.success): {
        return {
          ...state,
          list: { data: [...action.payload] },
        }
      }
      case getType(fetchArticlesList.failure): {
        return {
          ...state,
          list: { error: true, data: []  },
        }
      }
      case getType(fetchArticle.request): {
        return {
          ...state,
          item: { loading: true, data: null },
        }
      }
      case getType(fetchArticle.success): {
        return {
          ...state,
          item: { data: { ...action.payload } },
        }
      }
      case getType(fetchArticle.failure): {
        return {
          ...state,
          item: { error: true, data: null },
        }
      }
      default:
        return state
    }
  },
}
