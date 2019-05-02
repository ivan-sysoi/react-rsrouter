import { createBrowserHistory } from 'history';
let history = null;
if (typeof window === 'object') {
    history = createBrowserHistory();
}
export default history;
//# sourceMappingURL=history.js.map