import { RouterLocation } from '..'

export * from './routes'
export * from './matcher'

export const urlToRouterLocation = (url: string): RouterLocation => {
  if (url) {
    const [pathname, ...rest] = url.split('?')
    return { pathname, search: rest.join('?') }
  }
  return { pathname: '', search: '' }
}
