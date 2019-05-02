import { RouterLocation } from '..'

export * from './routes'
export * from './matcher'

export const urlToRouterLocation = (url: string): RouterLocation => {
  if (url) {
    const [pathname, ...rest] = url.split('?')
    const search = rest.length > 0 ? `?${rest.join('?')}` : ''
    return { pathname, search }
  }
  return { pathname: '', search: '' }
}

export const locationToUrl = (location: RouterLocation): string =>
  `${location.pathname}${location.search}`

export const isNotTheSameLocations = (
  { pathname: pathname1 = '', search: search1 = '' } : RouterLocation = { pathname: '', search: '' },
  { pathname: pathname2 = '', search: search2 = '' } : RouterLocation = { pathname: '', search: '' },
  ): boolean => pathname1 !== pathname2 || search1 !== search2
