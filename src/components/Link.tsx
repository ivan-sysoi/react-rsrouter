import React from 'react'
import invariant from 'invariant'

import { RouterProviderContextValues, RouterProviderContext } from './contexts'
import history from '../history'
import { RouteParams, RoutePath } from '../'

type propsTo = RoutePath | string

interface LinkProps {
  to: propsTo
  params?: RouteParams
  target?: string
  replace?: boolean
  className?: string
  style?: {}
}

interface LinkPropsWithBuildUrl extends LinkProps {
  buildUrl: (to: RoutePath, params: RouteParams) => string
}

interface LinkState {
  to: RoutePath
  params: RouteParams
  href: string
  propsTo: propsTo
  propsParams?: RouteParams
}

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>): boolean =>
  Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

class Link extends React.PureComponent<LinkPropsWithBuildUrl, LinkState> {
  static defaultProps = {
    replace: false,
  }

  static getDerivedStateFromProps(nextProps: LinkPropsWithBuildUrl, prevState: LinkState): LinkState | null {
    invariant(nextProps.to, 'You must specify the "to" property')

    if (prevState.propsTo !== nextProps.to || prevState.propsParams !== nextProps.params) {
      const to = Array.isArray(nextProps.to) ? nextProps.to : nextProps.to.split('.')
      const params = nextProps.params || {}
      return {
        to,
        params,
        propsTo: nextProps.to,
        propsParams: nextProps.params,
        href: nextProps.buildUrl(to, params),
      }
    }

    return null
  }

  readonly state: LinkState = {} as LinkState

  onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault()
      if (history) {
        if (Boolean(this.props.replace)) {
          history.replace(this.state.href)
        } else {
          history.push(this.state.href)
        }
      }
    }
  }

  render() {
    const { className, children, style } = this.props
    const { href } = this.state
    return (
      <a href={href} onClick={this.onClick} className={className} style={style}>
        {children}
      </a>
    )
  }
}

const LinkWithBuildUrl: React.FunctionComponent<LinkProps> = props => {
  return (
    <RouterProviderContext.Consumer>
      {({ buildUrl }: RouterProviderContextValues) => {
        return <Link {...props} buildUrl={buildUrl} />
      }}
    </RouterProviderContext.Consumer>
  )
}

export default LinkWithBuildUrl
