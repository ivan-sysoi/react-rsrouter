import { RootStore } from '../reducer';
import { RouterLocation } from '../../.';
import { IRoutesCollection } from '../../utils';
declare type RoutesParam = {
    routes: IRoutesCollection;
};
export default function createRouterSaga({ routes, serverLocation, store }: RoutesParam & {
    serverLocation?: RouterLocation;
    store: RootStore;
}): () => IterableIterator<import("@redux-saga/types").StrictEffect<any>>;
export {};
