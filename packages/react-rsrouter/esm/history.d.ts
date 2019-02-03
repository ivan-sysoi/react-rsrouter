import { RouterLocation } from '.';
interface RouterHistory {
    push: (url: string) => void;
    replace: (url: string) => void;
    listen: (cb: (location: RouterLocation) => void) => void;
    location: RouterLocation;
}
declare let history: RouterHistory | null;
export default history;
