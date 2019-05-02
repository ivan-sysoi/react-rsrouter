import { RootState } from './reducer';
import { Match, RouterLocation, ServerResponse } from '../.';
export declare const getServerResponse: (state: RootState) => ServerResponse;
export declare const getMatch: (state: RootState) => Match;
export declare const getMatchPath: (state: RootState) => string[];
export declare const getLocation: (state: RootState) => RouterLocation | null;
export declare const getParams: (state: RootState, paramName?: string | undefined) => any;
