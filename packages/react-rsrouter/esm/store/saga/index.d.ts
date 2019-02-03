import { RootStore } from '../reducer';
import { RouterLocation } from '../../.';
import { IRoutesCollection } from '../../utils/routes';
export declare function createRouterSaga({ routes, serverLocation, store, }: {
    routes: IRoutesCollection;
    serverLocation?: RouterLocation;
    store: RootStore;
}): () => IterableIterator<import("@redux-saga/types").StrictEffect<any>>;
