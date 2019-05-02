import { History } from 'history';
export interface RouterHistory extends History {
    back: () => void;
}
declare let history: RouterHistory | null;
export default history;
