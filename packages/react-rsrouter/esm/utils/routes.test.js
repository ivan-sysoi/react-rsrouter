import { RoutesCollection } from './routes';
describe('RoutesCollection', () => {
    it('should match correctly', () => {
        const dummyGetState = () => ({ router: { match: { path: [], params: {} }, serverResponse: { status: 200 } } });
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
        ]);
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
                    path: ['a', 'b'],
                    params: {},
                },
            ],
            [
                { pathname: '/some', search: '' },
                {
                    path: ['404'],
                    params: {},
                },
            ],
        ];
        for (const [loc, expMatch] of assertions) {
            console.log(loc);
            const match = collection.getMatch(loc, dummyGetState);
            console.log(match);
            expect(match).toEqual(expMatch);
        }
    });
});
//# sourceMappingURL=routes.test.js.map