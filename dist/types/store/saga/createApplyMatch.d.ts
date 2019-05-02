import { SagaIterator } from 'redux-saga';
import { IRoutesCollection } from '../../utils';
import { Match } from '../../.';
export declare type ApplyMatchSaga = ({ match }: {
    match: Match;
}) => SagaIterator;
declare const _default: ({ routes, ssr }: {
    ssr: boolean;
    routes: IRoutesCollection;
}) => ApplyMatchSaga;
export default _default;
