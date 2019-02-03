import { SagaIterator } from 'redux-saga';
import { IRoutesCollection } from '../../utils';
import { Match } from '../../.';
export declare type applyMatchSaga = ({ match }: {
    match: Match;
}) => SagaIterator;
export declare const createApplyMatch: ({ routes }: {
    routes: IRoutesCollection;
}) => applyMatchSaga;
