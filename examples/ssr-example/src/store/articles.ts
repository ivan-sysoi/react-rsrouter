import { createAsyncAction, getType, ActionType } from 'typesafe-actions'

import { RootState, FetchState } from 'store'
import { Article } from "services/articlesService"

interface ArticleState  {
  item: FetchState<Article | null>
  list: FetchState<Article[]>
}

export const selectArticle = (state: RootState) => state.articles.item
export const selectArticleList = (state: RootState) => state.articles.list

export const fetchArticlesList = createAsyncAction(
  'FETCH_ARTICLE_LIST_REQUEST',
  'FETCH_ARTICLE_LIST_SUCCESS',
  'FETCH_ARTICLE_LIST_FAILURE'
)<void, Article[], void>()

export const fetchArticle = createAsyncAction(
  'FETCH_ARTICLE_REQUEST',
  'FETCH_ARTICLE_SUCCESS',
  'FETCH_ARTICLE_FAILURE'
)<void, Article, void>()


type ArticleActions = ActionType<typeof fetchArticlesList | typeof fetchArticle>


export const reducer = {
  articles: function articleReducer(state: ArticleState = { item: { data: null }, list: { data: [] } }, action: ArticleActions) {
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
  }
}