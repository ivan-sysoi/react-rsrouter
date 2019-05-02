import React from 'react';
import { create } from 'react-test-renderer';
import Link from './Link';
import { RouterProvider } from './RouterProvider';
import { RoutesCollection } from '../utils';
describe('Link', () => {
    it('should render url', () => {
        const state = {
            router: {
                match: { path: ['simple'], params: {} },
                serverResponse: { status: 200 },
                location: null,
            },
        };
        const dummyGetState = () => state;
        const routes = new RoutesCollection([
            {
                id: 'simple',
                type: 'static',
                path: '/some/path',
                component: () => (React.createElement(Link, { to: "simple" }, "Simple Link")),
            },
            {
                id: 'fallback',
                type: 'fallback',
            },
        ]);
        const link = create(React.createElement(RouterProvider, { routes: routes, match: state.router.match, getState: dummyGetState }));
        expect(link.toJSON()).toMatchSnapshot();
    });
});
//# sourceMappingURL=Limk.test.js.map