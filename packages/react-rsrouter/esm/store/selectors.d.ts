import { RootState } from './reducer';
import { Match, ServerResponse } from '../.';
export declare const selectServerResponse: (state: RootState) => ServerResponse;
export declare const selectMatch: (state: RootState) => Match;
export declare const selectParams: (state: RootState, paramName?: string | undefined) => any;
