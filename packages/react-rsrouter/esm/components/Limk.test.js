import * as React from 'react';
import * as reactTestRenderer from 'react-test-renderer';
import Link from './Link';
import { RouterProvider } from './RouterProvider';
import { RoutesCollection } from '../utils/routes';
describe('Link', () => {
    it('should render url', () => {
        const state = {
            router: { match: { path: ['simple'], params: {} }, serverResponse: { status: 200 } },
        };
        const dummyGetState = () => state;
        const routes = new RoutesCollection([
            {
                id: 'simple',
                type: 'static',
                path: '/some/path',
            },
        ]);
        const link = reactTestRenderer.create(React.createElement(RouterProvider, { routes: routes, match: state.router.match, getState: dummyGetState },
            React.createElement(Link, { to: "simple" }, "Simple Link")));
        expect(link.toJSON()).toMatchSnapshot();
    });
});
//# sourceMappingURL=Limk.test.js.map