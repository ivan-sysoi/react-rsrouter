import { RoutesCollection } from './routes'
import { RouterLocation } from '..'

describe('RoutesCollection', () => {
  it('should match correctly', () => {
    const dummyGetState = () => ({ router: { match: { path: [], params: {} }, serverResponse: { status: 200 } } })

    const collection = new RoutesCollection([
      {
        id: 'a',
        type: 'static',
        path: '/some$',
        nested: [
          {
            id: 'b',
            type: 'static',
            path: '/path',
            nested: [
              {
                id: 'c',
                type: 'static',
                path: '/exact$',
              },
            ],
          },
        ],
      },
      {
        id: '404',
        type: 'fallback',
      },
    ])

    const assertions = [
      [
        { pathname: '/some/path/exact', search: '' },
        {
          path: ['a', 'b', 'c'],
          params: {},
        },
      ],
      [
        { pathname: '/invalid', search: '' },
        {
          path: ['404'],
          params: {},
        },
      ],
      [
        { pathname: '/some/path', search: '' },
        {
          path: ['404'],
          params: {},
        },
      ],
      [
        { pathname: '/some', search: '' },
        {
          path: ['a'],
          params: {},
        },
      ],
    ]

    for (const [loc, expMatch] of assertions) {
      const match = collection.getMatch(loc as RouterLocation, dummyGetState)
      expect(match).toEqual(expMatch)
    }
  })
})
