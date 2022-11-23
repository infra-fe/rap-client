// @ts-nocheck
import React from 'react';
import { dynamic } from 'dumi';
import rawCode1 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/http.tsx?dumi-raw-code';
import rawCode2 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/http/index.ts?dumi-raw-code';
import rawCode3 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/http/http.ts?dumi-raw-code';
import rawCode4 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/http/pos.ts?dumi-raw-code';
import rawCode5 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/http/models.ts?dumi-raw-code';
import rawCode6 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/ReactHooks.tsx?dumi-raw-code';
import rawCode7 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/react/index.ts?dumi-raw-code';
import rawCode8 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/react/http.ts?dumi-raw-code';
import rawCode9 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/react/pos.ts?dumi-raw-code';
import rawCode10 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/react/models.ts?dumi-raw-code';
import rawCode11 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/rapper/react/useHttp.ts?dumi-raw-code';
import rawCode12 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/ReactQuery.tsx?dumi-raw-code';
import rawCode13 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/utils.ts?dumi-raw-code';
import rawCode14 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/ReactQueries.tsx?dumi-raw-code';
import rawCode15 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/useMutation.tsx?dumi-raw-code';
import rawCode16 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/useInfiniteQuery.tsx?dumi-raw-code';
import rawCode17 from '!!dumi-raw-code-loader!/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/ReactSwr.tsx?dumi-raw-code';

export default {
  'code-http': {
    component: dynamic({
      loader: async () => (await import(/* webpackChunkName: "demos_no_comp" */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/http.tsx')).default,
      loading: () => null,
    }),
    previewerProps: {"sources":{"_":{"tsx":rawCode1},"rapper/http/index.ts":{"import":"../rapper/http","content":rawCode2},"rapper/http/http.ts":{"import":"./http","content":rawCode3},"rapper/http/pos.ts":{"import":"./pos","content":rawCode4},"rapper/http/models.ts":{"import":"./models","content":rawCode5}},"dependencies":{"antd":{"version":"4.24.3","css":"antd/dist/antd.css"},"react":{"version":">=16.9.0"},"react-dom":{"version":">=16.9.0"},"@rapper/request":{"version":"0.0.7"}},"identifier":"code-http"},
  },
  'code-reacthooks': {
    component: dynamic({
      loader: async () => (await import(/* webpackChunkName: "demos_no_comp" */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/ReactHooks.tsx')).default,
      loading: () => null,
    }),
    previewerProps: {"sources":{"_":{"tsx":rawCode6},"rapper/react/index.ts":{"import":"../rapper/react","content":rawCode7},"rapper/react/http.ts":{"import":"./http","content":rawCode8},"rapper/react/pos.ts":{"import":"./pos","content":rawCode9},"rapper/react/models.ts":{"import":"./models","content":rawCode10},"rapper/react/useHttp.ts":{"import":"./useHttp","content":rawCode11}},"dependencies":{"antd":{"version":"4.24.3","css":"antd/dist/antd.css"},"react":{"version":">=16.9.0"},"react-dom":{"version":">=16.9.0"},"@rapper/request":{"version":"^0.0.3"},"@rapper/ahooks":{"version":"0.0.6"},"ahooks":{"version":"^3.6.2"},"axios":{"version":"^0.27.2"}},"identifier":"code-reacthooks"},
  },
  'reactquery-reactquery': {
    component: dynamic({
      loader: async () => (await import(/* webpackChunkName: "demos_no_comp" */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/ReactQuery.tsx')).default,
      loading: () => null,
    }),
    previewerProps: {"sources":{"_":{"tsx":rawCode12},"utils.ts":{"import":"./utils","content":rawCode13},"rapper/http/index.ts":{"import":"../rapper/http","content":rawCode2},"rapper/http/http.ts":{"import":"./http","content":rawCode3},"rapper/http/pos.ts":{"import":"./pos","content":rawCode4},"rapper/http/models.ts":{"import":"./models","content":rawCode5}},"dependencies":{"antd":{"version":"4.24.3","css":"antd/dist/antd.css"},"react":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"@tanstack/react-query":{"version":"^4"},"react-dom":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"react-native":{"version":"*"},"@rapper/react-query":{"version":"0.1.6"},"@rapper/request":{"version":"0.0.7"}},"identifier":"reactquery-reactquery"},
  },
  'reactquery-reactqueries': {
    component: dynamic({
      loader: async () => (await import(/* webpackChunkName: "demos_no_comp" */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/ReactQueries.tsx')).default,
      loading: () => null,
    }),
    previewerProps: {"sources":{"_":{"tsx":rawCode14},"utils.ts":{"import":"./utils","content":rawCode13},"rapper/http/index.ts":{"import":"../rapper/http","content":rawCode2},"rapper/http/http.ts":{"import":"./http","content":rawCode3},"rapper/http/pos.ts":{"import":"./pos","content":rawCode4},"rapper/http/models.ts":{"import":"./models","content":rawCode5}},"dependencies":{"antd":{"version":"4.24.3","css":"antd/dist/antd.css"},"react":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"@tanstack/react-query":{"version":"^4"},"react-dom":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"react-native":{"version":"*"},"@rapper/react-query":{"version":"0.1.6"},"@rapper/request":{"version":"0.0.7"}},"identifier":"reactquery-reactqueries"},
  },
  'reactquery-usemutation': {
    component: dynamic({
      loader: async () => (await import(/* webpackChunkName: "demos_no_comp" */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/useMutation.tsx')).default,
      loading: () => null,
    }),
    previewerProps: {"sources":{"_":{"tsx":rawCode15},"utils.ts":{"import":"./utils","content":rawCode13},"rapper/http/index.ts":{"import":"../rapper/http","content":rawCode2},"rapper/http/http.ts":{"import":"./http","content":rawCode3},"rapper/http/pos.ts":{"import":"./pos","content":rawCode4},"rapper/http/models.ts":{"import":"./models","content":rawCode5}},"dependencies":{"antd":{"version":"4.24.3","css":"antd/dist/antd.css"},"react":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"@tanstack/react-query":{"version":"^4"},"react-dom":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"react-native":{"version":"*"},"@rapper/react-query":{"version":"0.1.6"},"@rapper/request":{"version":"0.0.7"}},"identifier":"reactquery-usemutation"},
  },
  'reactquery-useinfinitequery': {
    component: dynamic({
      loader: async () => (await import(/* webpackChunkName: "demos_no_comp" */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/reactQuery/useInfiniteQuery.tsx')).default,
      loading: () => null,
    }),
    previewerProps: {"sources":{"_":{"tsx":rawCode16},"utils.ts":{"import":"./utils","content":rawCode13},"rapper/http/index.ts":{"import":"../rapper/http","content":rawCode2},"rapper/http/http.ts":{"import":"./http","content":rawCode3},"rapper/http/pos.ts":{"import":"./pos","content":rawCode4},"rapper/http/models.ts":{"import":"./models","content":rawCode5}},"dependencies":{"antd":{"version":"4.24.3","css":"antd/dist/antd.css"},"react":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"@tanstack/react-query":{"version":"^4"},"react-dom":{"version":"^16.8.0 || ^17.0.0 || ^18.0.0"},"react-native":{"version":"*"},"@rapper/react-query":{"version":"0.1.6"},"@rapper/request":{"version":"0.0.7"}},"identifier":"reactquery-useinfinitequery"},
  },
  'code-reactswr': {
    component: dynamic({
      loader: async () => (await import(/* webpackChunkName: "demos_no_comp" */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/demos/ReactSwr.tsx')).default,
      loading: () => null,
    }),
    previewerProps: {"sources":{"_":{"tsx":rawCode17},"rapper/http/index.ts":{"import":"../rapper/http","content":rawCode2},"rapper/http/http.ts":{"import":"./http","content":rawCode3},"rapper/http/pos.ts":{"import":"./pos","content":rawCode4},"rapper/http/models.ts":{"import":"./models","content":rawCode5}},"dependencies":{"antd":{"version":"4.24.3","css":"antd/dist/antd.css"},"@rapper/react-swr":{"version":"0.0.5"},"react":{"version":">=16.9.0"},"react-dom":{"version":">=16.9.0"},"@rapper/request":{"version":"0.0.7"},"swr":{"version":"^1.3.0"}},"identifier":"code-reactswr"},
  },
};
