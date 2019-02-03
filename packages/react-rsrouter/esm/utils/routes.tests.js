import { RoutesCollection } from './routes';
descibe('RoutesCollection', () => {
    it('should match correctly', () => {
        const dummyGetState = () => { };
        const collection = new RoutesCollection([
            {
                id: 'page1',
                type: 'static',
                path: '/some/path/exact$',
            },
            {
                id: '404',
                type: 'fallback',
            },
        ]);
        const match = collection.getMatch({ pathname: '/some/path/exact', search: '' }, dummyGetState);
        assert;
    });
});
//# sourceMappingURL=routes.tests.js.map