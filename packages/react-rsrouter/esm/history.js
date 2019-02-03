import createBrowserHistory from 'history/createBrowserHistory';
let history = null;
if (typeof window === 'object') {
    history = createBrowserHistory();
}
export default history;
//# sourceMappingURL=history.js.map