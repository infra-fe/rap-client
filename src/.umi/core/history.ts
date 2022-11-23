// @ts-nocheck
import { createBrowserHistory, History } from '/Users/xian.xia/Documents/github/rap-client-github/node_modules/umi/node_modules/@umijs/runtime';

let options = {
  "basename": "rap-client"
};
if ((<any>window).routerBase) {
  options.basename = (<any>window).routerBase;
}

// remove initial history because of ssr
let history: History = process.env.__IS_SERVER ? null : createBrowserHistory(options);
export const createHistory = (hotReload = false) => {
  if (!hotReload) {
    history = createBrowserHistory(options);
  }

  return history;
};

export { history };
