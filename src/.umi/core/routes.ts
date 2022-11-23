// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/xian.xia/Documents/github/rap-client-github/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/~demos/:uuid",
    "layout": false,
    "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'../dumi/layout')})],
    "component": ((props) => dynamic({
          loader: async () => {
            const React = await import('react');
            const { default: getDemoRenderArgs } = await import(/* webpackChunkName: 'dumi_demos' */ '/Users/xian.xia/Documents/github/rap-client-github/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
            const { default: Previewer } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi-theme-default/es/builtins/Previewer.js');
            const { usePrefersColor, context } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi/theme');

            return props => {
              
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
            }
          },
          loading: () => null,
        }))()
  },
  {
    "path": "/_demos/:uuid",
    "redirect": "/~demos/:uuid"
  },
  {
    "__dumiRoot": true,
    "layout": false,
    "path": "/",
    "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'../dumi/layout')}), dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'/Users/xian.xia/Documents/github/rap-client-github/node_modules/dumi-theme-default/es/layout.js')})],
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__index.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/index.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/index.en-US.md",
          "updatedTime": 1669191571071,
          "hero": {
            "title": "RAP",
            "desc": "<div class=\"markdown\"><p>An automation、visualization and documentation API management platform</p></div>",
            "actions": [
              {
                "text": "Getting Started",
                "link": "/guide"
              }
            ]
          },
          "features": [
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png",
              "title": "GUI",
              "desc": "<div class=\"markdown\"><p>Provides GUI tools to help developers managing their APIs</p></div>"
            },
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png",
              "title": "Mock Server",
              "desc": "<div class=\"markdown\"><p>Provides easily mock server, no longer to worry about generating mock data</p></div>"
            },
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png",
              "title": "Generate Code",
              "desc": "<div class=\"markdown\"><p>Provides generate code packages with lot of modes, easy to sync with the platform definitions</p></div>"
            }
          ],
          "footer": "<div class=\"markdown\"><p>Open-source MIT Licensed | Copyright © 2022<br />Powered by <a href=\"https://d.umijs.org/\" target=\"_blank\">dumi<svg xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"\" x=\"0px\" y=\"0px\" viewBox=\"0 0 100 100\" width=\"15\" height=\"15\" class=\"__dumi-default-external-link-icon\"><path fill=\"currentColor\" d=\"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z\"></path><polygon fill=\"currentColor\" points=\"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9\"></polygon></svg></a></p></div>",
          "slugs": [
            {
              "depth": 2,
              "value": "Hello RAP!",
              "heading": "hello-rap"
            }
          ],
          "title": "Hello RAP!",
          "locale": "en-US"
        },
        "title": "Hello RAP! - RAP"
      },
      {
        "path": "/zh-CN",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__index.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/index.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/index.zh-CN.md",
          "updatedTime": 1669191571090,
          "hero": {
            "title": "RAP",
            "desc": "<div class=\"markdown\"><p>自动化、可视化、文档化的API管理平台</p></div>",
            "actions": [
              {
                "text": "开始使用",
                "link": "/guide"
              }
            ]
          },
          "features": [
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png",
              "title": "可视化界面",
              "desc": "<div class=\"markdown\"><p>提供可视化的界面来帮助开发者管理API</p></div>"
            },
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png",
              "title": "Mock服务器",
              "desc": "<div class=\"markdown\"><p>提供简单的mock服务器，让开发者再也不用担心mock数据的问题</p></div>"
            },
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png",
              "title": "生成代码",
              "desc": "<div class=\"markdown\"><p>提供多种模式的代码生成利器，自动与平台进行接口同步</p></div>"
            }
          ],
          "footer": "<div class=\"markdown\"><p>Open-source MIT Licensed | Copyright © 2022<br />Powered by <a href=\"https://d.umijs.org/\" target=\"_blank\">dumi<svg xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"\" x=\"0px\" y=\"0px\" viewBox=\"0 0 100 100\" width=\"15\" height=\"15\" class=\"__dumi-default-external-link-icon\"><path fill=\"currentColor\" d=\"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z\"></path><polygon fill=\"currentColor\" points=\"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9\"></polygon></svg></a></p></div>",
          "slugs": [
            {
              "depth": 2,
              "value": "Hello RAP!",
              "heading": "hello-rap"
            }
          ],
          "title": "Hello RAP!",
          "locale": "zh-CN"
        },
        "title": "Hello RAP! - RAP"
      },
      {
        "path": "/code/dto",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__dto.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/dto.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/dto.md",
          "updatedTime": 1669191570708,
          "slugs": [
            {
              "depth": 1,
              "value": "Nest DTO Generation",
              "heading": "nest-dto-generation"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Nest DTO mode",
              "heading": "2-select-rapper30--nest-dto-mode"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            }
          ],
          "title": "Nest DTO Generation",
          "nav": {
            "path": "/code",
            "title": "Code"
          }
        },
        "title": "Nest DTO Generation - RAP"
      },
      {
        "path": "/code/http",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__http.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/http.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/http.md",
          "updatedTime": 1669191570709,
          "slugs": [
            {
              "depth": 1,
              "value": "Http",
              "heading": "http"
            },
            {
              "depth": 2,
              "value": "@rapper/request",
              "heading": "rapperrequest"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "http(url, payload, config)",
              "heading": "httpurl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.get(url, payload, config)",
              "heading": "httpgeturl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.post(url, payload, config)",
              "heading": "httpposturl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.put(url, payload, config)",
              "heading": "httpputurl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.delete(url, payload, config)",
              "heading": "httpdeleteurl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.patch(url, payload, config)",
              "heading": "httppatchurl-payload-config"
            },
            {
              "depth": 2,
              "value": "Interceptor",
              "heading": "interceptor"
            },
            {
              "depth": 3,
              "value": "1. Cofig baseURL",
              "heading": "1-cofig-baseurl"
            },
            {
              "depth": 3,
              "value": "2. Hanlde the response data",
              "heading": "2-hanlde-the-response-data"
            }
          ],
          "title": "Http",
          "hasPreviewer": true,
          "nav": {
            "path": "/code",
            "title": "Code"
          }
        },
        "title": "Http - RAP"
      },
      {
        "path": "/code",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__index.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/index.md",
          "updatedTime": 1669191570728,
          "slugs": [
            {
              "depth": 1,
              "value": "Generate Code Rapper v3",
              "heading": "generate-code-rapper-v3"
            },
            {
              "depth": 2,
              "value": "Contact",
              "heading": "contact"
            }
          ],
          "title": "Generate Code Rapper v3",
          "nav": {
            "path": "/code",
            "title": "Code"
          }
        },
        "title": "Generate Code Rapper v3 - RAP"
      },
      {
        "path": "/code/migration",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__migration.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/migration.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/migration.md",
          "updatedTime": 1669194459241,
          "slugs": [
            {
              "depth": 1,
              "value": "Rapper2.x -> Rapper3.0",
              "heading": "rapper2x---rapper30"
            },
            {
              "depth": 2,
              "value": "Override fetch",
              "heading": "override-fetch"
            },
            {
              "depth": 2,
              "value": "Config baseURL",
              "heading": "config-baseurl"
            },
            {
              "depth": 3,
              "value": "Other configuration",
              "heading": "other-configuration"
            }
          ],
          "title": "Rapper2.x -> Rapper3.0",
          "nav": {
            "path": "/code",
            "title": "Code"
          }
        },
        "title": "Rapper2.x -> Rapper3.0 - RAP"
      },
      {
        "path": "/code/ts",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__ts.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/ts.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/ts.md",
          "updatedTime": 1669191570736,
          "slugs": [
            {
              "depth": 1,
              "value": "Pure TS Models",
              "heading": "pure-ts-models"
            },
            {
              "depth": 2,
              "value": "Overview",
              "heading": "overview"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Pure TS Models Mode",
              "heading": "2-select-rapper30--pure-ts-models-mode"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            }
          ],
          "title": "Pure TS Models",
          "nav": {
            "path": "/code",
            "title": "Code"
          }
        },
        "title": "Pure TS Models - RAP"
      },
      {
        "path": "/code/react",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__index.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/index.md",
          "updatedTime": 1669191570733,
          "slugs": [
            {
              "depth": 1,
              "value": "React Hooks",
              "heading": "react-hooks"
            },
            {
              "depth": 2,
              "value": "@rapper/ahooks",
              "heading": "rapperahooks"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & React + ahooks mode",
              "heading": "2-select-rapper30--react--ahooks-mode"
            },
            {
              "depth": 2,
              "value": "Movitation",
              "heading": "movitation"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            },
            {
              "depth": 2,
              "value": "Background",
              "heading": "background"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "React Hooks",
          "hasPreviewer": true,
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/react",
            "title": "React"
          }
        },
        "title": "React Hooks - RAP"
      },
      {
        "path": "/code/react/react-query",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__react-query.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/react-query.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/react-query.md",
          "updatedTime": 1669191570734,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-query",
              "heading": "rapperreact-query"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install @tanstack/react-query & @rapper/react-query",
              "heading": "3-then-install-tanstackreact-query--rapperreact-query"
            },
            {
              "depth": 3,
              "value": "Tips",
              "heading": "tips"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "useRapperQuery",
              "heading": "userapperquery"
            },
            {
              "depth": 3,
              "value": "useRapperQueries",
              "heading": "userapperqueries"
            },
            {
              "depth": 3,
              "value": "useRapperMutation",
              "heading": "userappermutation"
            },
            {
              "depth": 3,
              "value": "useRapperInfiniteQuery",
              "heading": "userapperinfinitequery"
            }
          ],
          "title": "@rapper/react-query",
          "hasPreviewer": true,
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/react",
            "title": "React"
          }
        },
        "title": "@rapper/react-query - RAP"
      },
      {
        "path": "/code/react/react-query3",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__react-query3.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/react-query3.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/react-query3.md",
          "updatedTime": 1669194520984,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-query3",
              "heading": "rapperreact-query3"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install react-query@3 & @rapper/react-query3",
              "heading": "3-then-install-react-query3--rapperreact-query3"
            },
            {
              "depth": 3,
              "value": "Tips",
              "heading": "tips"
            },
            {
              "depth": 3,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "useRapperQuery",
              "heading": "userapperquery"
            },
            {
              "depth": 3,
              "value": "useRapperQueries",
              "heading": "userapperqueries"
            },
            {
              "depth": 3,
              "value": "useRapperMutation",
              "heading": "userappermutation"
            },
            {
              "depth": 3,
              "value": "useRapperInfiniteQuery",
              "heading": "userapperinfinitequery"
            }
          ],
          "title": "@rapper/react-query3",
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/react",
            "title": "React"
          }
        },
        "title": "@rapper/react-query3 - RAP"
      },
      {
        "path": "/code/react/react-swr",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__react-swr.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/react-swr.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/react-swr.md",
          "updatedTime": 1669191570735,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-swr",
              "heading": "rapperreact-swr"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install swr & @rapper/react-swr",
              "heading": "3-then-install-swr--rapperreact-swr"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "@rapper/react-swr",
          "hasPreviewer": true,
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/react",
            "title": "React"
          }
        },
        "title": "@rapper/react-swr - RAP"
      },
      {
        "path": "/code/react/redux-toolkit",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__redux-toolkit.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/redux-toolkit.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/redux-toolkit.md",
          "updatedTime": 1669191570735,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-redux-toolkit",
              "heading": "rapperreact-redux-toolkit"
            }
          ],
          "title": "@rapper/react-redux-toolkit",
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/react",
            "title": "React"
          }
        },
        "title": "@rapper/react-redux-toolkit - RAP"
      },
      {
        "path": "/code/react/redux",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__redux.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/redux.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/redux.md",
          "updatedTime": 1669191570735,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-redux",
              "heading": "rapperreact-redux"
            }
          ],
          "title": "@rapper/react-redux",
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/react",
            "title": "React"
          }
        },
        "title": "@rapper/react-redux - RAP"
      },
      {
        "path": "/code/vue",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__vue__index.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/vue/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/vue/index.md",
          "updatedTime": 1669191570737,
          "slugs": [],
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/vue",
            "title": "Vue"
          },
          "title": "Vue"
        },
        "title": "Vue - RAP"
      },
      {
        "path": "/code/vue/vue-query",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__vue__vue-query.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/vue/vue-query.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/vue/vue-query.md",
          "updatedTime": 1669191570737,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/vue-query",
              "heading": "rappervue-query"
            },
            {
              "depth": 2,
              "value": "Http",
              "heading": "http"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install vue-query & @rapper/vue-query",
              "heading": "3-then-install-vue-query--rappervue-query"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "@rapper/vue-query",
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/vue",
            "title": "Vue"
          }
        },
        "title": "@rapper/vue-query - RAP"
      },
      {
        "path": "/code/vue/vue-swr",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__vue__vue-swr.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/vue/vue-swr.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/vue/vue-swr.md",
          "updatedTime": 1669191570738,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/vue-swr",
              "heading": "rappervue-swr"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install swrv & @rapper/vue-swr",
              "heading": "3-then-install-swrv--rappervue-swr"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "@rapper/vue-swr",
          "nav": {
            "path": "/code",
            "title": "Code"
          },
          "group": {
            "path": "/code/vue",
            "title": "Vue"
          }
        },
        "title": "@rapper/vue-swr - RAP"
      },
      {
        "path": "/guide/export",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__export.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/export.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/export.en-US.md",
          "updatedTime": 1669191570882,
          "slugs": [
            {
              "depth": 1,
              "value": "Export",
              "heading": "export"
            },
            {
              "depth": 2,
              "value": "Single interface",
              "heading": "single-interface"
            },
            {
              "depth": 2,
              "value": "Whole repository",
              "heading": "whole-repository"
            }
          ],
          "title": "Export",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          }
        },
        "title": "Export - RAP"
      },
      {
        "path": "/zh-CN/guide/export",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__export.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/export.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/export.zh-CN.md",
          "updatedTime": 1669191570883,
          "slugs": [
            {
              "depth": 1,
              "value": "导出",
              "heading": "导出"
            },
            {
              "depth": 2,
              "value": "接口导出",
              "heading": "接口导出"
            },
            {
              "depth": 2,
              "value": "仓库导出",
              "heading": "仓库导出"
            }
          ],
          "title": "导出",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          }
        },
        "title": "导出 - RAP"
      },
      {
        "path": "/guide",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__index.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/index.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/index.en-US.md",
          "updatedTime": 1669191570901,
          "slugs": [
            {
              "depth": 1,
              "value": "First View",
              "heading": "first-view"
            },
            {
              "depth": 1,
              "value": "RAP",
              "heading": "rap"
            },
            {
              "depth": 3,
              "value": "Login",
              "heading": "login"
            },
            {
              "depth": 3,
              "value": "Home",
              "heading": "home"
            },
            {
              "depth": 3,
              "value": "Repository",
              "heading": "repository"
            },
            {
              "depth": 3,
              "value": "Organization",
              "heading": "organization"
            },
            {
              "depth": 3,
              "value": "Account",
              "heading": "account"
            }
          ],
          "title": "First View",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          }
        },
        "title": "First View - RAP"
      },
      {
        "path": "/zh-CN/guide",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__index.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/index.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/index.zh-CN.md",
          "updatedTime": 1669191570902,
          "slugs": [
            {
              "depth": 1,
              "value": "初识RAP",
              "heading": "初识rap"
            },
            {
              "depth": 1,
              "value": "RAP",
              "heading": "rap"
            },
            {
              "depth": 3,
              "value": "登录",
              "heading": "登录"
            },
            {
              "depth": 3,
              "value": "首页",
              "heading": "首页"
            },
            {
              "depth": 3,
              "value": "仓库",
              "heading": "仓库"
            },
            {
              "depth": 3,
              "value": "团队",
              "heading": "团队"
            },
            {
              "depth": 3,
              "value": "账户",
              "heading": "账户"
            }
          ],
          "title": "初识RAP",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          }
        },
        "title": "初识RAP - RAP"
      },
      {
        "path": "/guide/qa",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__qa.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/qa.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/qa.en-US.md",
          "updatedTime": 1669195782095,
          "slugs": [
            {
              "depth": 1,
              "value": "FAQ",
              "heading": "faq"
            },
            {
              "depth": 3,
              "value": "Where is the rap repo?",
              "heading": "where-is-the-rap-repo"
            },
            {
              "depth": 3,
              "value": "How can I import repository？",
              "heading": "how-can-i-import-repository"
            },
            {
              "depth": 3,
              "value": "How can I import data with two-dimensional array?",
              "heading": "how-can-i-import-data-with-two-dimensional-array"
            },
            {
              "depth": 3,
              "value": "Why it throw an error like this when I use rapper first?",
              "heading": "why-it-throw-an-error-like-this-when-i-use-rapper-first"
            },
            {
              "depth": 3,
              "value": "How to set headers and query parameters in rapper?",
              "heading": "how-to-set-headers-and-query-parameters-in-rapper"
            },
            {
              "depth": 3,
              "value": "Which Mode should I choose in rapper?",
              "heading": "which-mode-should-i-choose-in-rapper"
            }
          ],
          "title": "FAQ",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          }
        },
        "title": "FAQ - RAP"
      },
      {
        "path": "/zh-CN/guide/qa",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__qa.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/qa.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/qa.zh-CN.md",
          "updatedTime": 1669195793562,
          "slugs": [
            {
              "depth": 1,
              "value": "FAQ",
              "heading": "faq"
            },
            {
              "depth": 3,
              "value": "RAP的仓库地址是?",
              "heading": "rap的仓库地址是"
            },
            {
              "depth": 3,
              "value": "如何导入数据到RAP中？",
              "heading": "如何导入数据到rap中"
            },
            {
              "depth": 3,
              "value": "如何导入二维数组?",
              "heading": "如何导入二维数组"
            },
            {
              "depth": 3,
              "value": "首次运行rapper的时候为什么会请求不到数据?",
              "heading": "首次运行rapper的时候为什么会请求不到数据"
            },
            {
              "depth": 3,
              "value": "如何用rapper发送headers和在post接口中发送query参数?",
              "heading": "如何用rapper发送headers和在post接口中发送query参数"
            },
            {
              "depth": 3,
              "value": "我应该选择rapper的哪种模式?",
              "heading": "我应该选择rapper的哪种模式"
            }
          ],
          "title": "FAQ",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          }
        },
        "title": "FAQ - RAP"
      },
      {
        "path": "/guide/start",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__start.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/start.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/start.en-US.md",
          "updatedTime": 1669191571014,
          "slugs": [
            {
              "depth": 1,
              "value": "How to create first interface?",
              "heading": "how-to-create-first-interface"
            },
            {
              "depth": 3,
              "value": "Choose repository",
              "heading": "choose-repository"
            },
            {
              "depth": 3,
              "value": "Create Interface",
              "heading": "create-interface"
            }
          ],
          "title": "How to create first interface?",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          }
        },
        "title": "How to create first interface? - RAP"
      },
      {
        "path": "/zh-CN/guide/start",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__start.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/start.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/start.zh-CN.md",
          "updatedTime": 1669191571014,
          "slugs": [
            {
              "depth": 1,
              "value": "创建第一个接口?",
              "heading": "创建第一个接口"
            },
            {
              "depth": 3,
              "value": "选择仓库",
              "heading": "选择仓库"
            },
            {
              "depth": 3,
              "value": "创建接口",
              "heading": "创建接口"
            }
          ],
          "title": "创建第一个接口?",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          }
        },
        "title": "创建第一个接口? - RAP"
      },
      {
        "path": "/guide/import/protobuf",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__protobuf.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/protobuf.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/protobuf.en-US.md",
          "updatedTime": 1669191570894,
          "slugs": [
            {
              "depth": 1,
              "value": "protobuf",
              "heading": "protobuf"
            }
          ],
          "title": "protobuf",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/import",
            "title": "Import"
          }
        },
        "title": "protobuf - RAP"
      },
      {
        "path": "/zh-CN/guide/import/protobuf",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__protobuf.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/protobuf.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/protobuf.zh-CN.md",
          "updatedTime": 1669191570895,
          "slugs": [
            {
              "depth": 1,
              "value": "protobuf",
              "heading": "protobuf"
            }
          ],
          "title": "protobuf",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/import",
            "title": "Import"
          }
        },
        "title": "protobuf - RAP"
      },
      {
        "path": "/guide/import/rap",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__rap.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/rap.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/rap.en-US.md",
          "updatedTime": 1669191570896,
          "slugs": [
            {
              "depth": 2,
              "value": "Import Interface",
              "heading": "import-interface"
            },
            {
              "depth": 2,
              "value": "Import Repository",
              "heading": "import-repository"
            },
            {
              "depth": 2,
              "value": "Merge pattern",
              "heading": "merge-pattern"
            }
          ],
          "title": "Import Interface",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/import",
            "title": "Import"
          }
        },
        "title": "Import Interface - RAP"
      },
      {
        "path": "/zh-CN/guide/import/rap",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__rap.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/rap.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/rap.zh-CN.md",
          "updatedTime": 1669191570897,
          "slugs": [
            {
              "depth": 2,
              "value": "Import Interface",
              "heading": "import-interface"
            },
            {
              "depth": 2,
              "value": "仓库导入",
              "heading": "仓库导入"
            },
            {
              "depth": 2,
              "value": "合并方式",
              "heading": "合并方式"
            }
          ],
          "title": "Import Interface",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/import",
            "title": "Import"
          }
        },
        "title": "Import Interface - RAP"
      },
      {
        "path": "/guide/import/swagger",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__swagger.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/swagger.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/swagger.en-US.md",
          "updatedTime": 1669191570898,
          "slugs": [
            {
              "depth": 1,
              "value": "Swagger and OpenAPI",
              "heading": "swagger-and-openapi"
            }
          ],
          "title": "Swagger and OpenAPI",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/import",
            "title": "Import"
          }
        },
        "title": "Swagger and OpenAPI - RAP"
      },
      {
        "path": "/zh-CN/guide/import/swagger",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__swagger.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/swagger.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/swagger.zh-CN.md",
          "updatedTime": 1669191570899,
          "slugs": [
            {
              "depth": 1,
              "value": "Swagger and OpenAPI",
              "heading": "swagger-and-openapi"
            }
          ],
          "title": "Swagger and OpenAPI",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/import",
            "title": "Import"
          }
        },
        "title": "Swagger and OpenAPI - RAP"
      },
      {
        "path": "/guide/import/yapi",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__yapi.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/yapi.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/yapi.en-US.md",
          "updatedTime": 1669191570900,
          "slugs": [
            {
              "depth": 1,
              "value": "Yapi",
              "heading": "yapi"
            }
          ],
          "title": "Yapi",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/import",
            "title": "Import"
          }
        },
        "title": "Yapi - RAP"
      },
      {
        "path": "/zh-CN/guide/import/yapi",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__import__yapi.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/import/yapi.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/import/yapi.zh-CN.md",
          "updatedTime": 1669191570901,
          "slugs": [
            {
              "depth": 1,
              "value": "Yapi",
              "heading": "yapi"
            }
          ],
          "title": "Yapi",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/import",
            "title": "Import"
          }
        },
        "title": "Yapi - RAP"
      },
      {
        "path": "/guide/interface/basic",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__basic.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/basic.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/basic.en-US.md",
          "updatedTime": 1669195760285,
          "slugs": [
            {
              "depth": 1,
              "value": "Interface Settings",
              "heading": "interface-settings"
            },
            {
              "depth": 2,
              "value": "Create Interface",
              "heading": "create-interface"
            },
            {
              "depth": 2,
              "value": "Edit Interface",
              "heading": "edit-interface"
            },
            {
              "depth": 3,
              "value": "requests",
              "heading": "requests"
            },
            {
              "depth": 3,
              "value": "responses",
              "heading": "responses"
            },
            {
              "depth": 3,
              "value": "import data",
              "heading": "import-data"
            },
            {
              "depth": 3,
              "value": "mock preview",
              "heading": "mock-preview"
            },
            {
              "depth": 3,
              "value": "sort",
              "heading": "sort"
            },
            {
              "depth": 3,
              "value": "shortcuts",
              "heading": "shortcuts"
            },
            {
              "depth": 2,
              "value": "Sort Interface",
              "heading": "sort-interface"
            },
            {
              "depth": 2,
              "value": "Migrate Interface",
              "heading": "migrate-interface"
            },
            {
              "depth": 2,
              "value": "Delete Interface",
              "heading": "delete-interface"
            },
            {
              "depth": 2,
              "value": "Template",
              "heading": "template"
            },
            {
              "depth": 2,
              "value": "History",
              "heading": "history"
            }
          ],
          "title": "Interface Settings",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/interface",
            "title": "Interface"
          }
        },
        "title": "Interface Settings - RAP"
      },
      {
        "path": "/zh-CN/guide/interface/basic",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__basic.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/basic.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/basic.zh-CN.md",
          "updatedTime": 1669195760285,
          "slugs": [
            {
              "depth": 1,
              "value": "接口管理",
              "heading": "接口管理"
            },
            {
              "depth": 2,
              "value": "新建接口",
              "heading": "新建接口"
            },
            {
              "depth": 2,
              "value": "编辑接口",
              "heading": "编辑接口"
            },
            {
              "depth": 3,
              "value": "请求参数",
              "heading": "请求参数"
            },
            {
              "depth": 3,
              "value": "响应内容",
              "heading": "响应内容"
            },
            {
              "depth": 3,
              "value": "数据导入",
              "heading": "数据导入"
            },
            {
              "depth": 3,
              "value": "数据预览",
              "heading": "数据预览"
            },
            {
              "depth": 3,
              "value": "排序",
              "heading": "排序"
            },
            {
              "depth": 3,
              "value": "快捷键",
              "heading": "快捷键"
            },
            {
              "depth": 2,
              "value": "接口排序",
              "heading": "接口排序"
            },
            {
              "depth": 2,
              "value": "接口迁移",
              "heading": "接口迁移"
            },
            {
              "depth": 2,
              "value": "删除接口",
              "heading": "删除接口"
            },
            {
              "depth": 2,
              "value": "模板",
              "heading": "模板"
            },
            {
              "depth": 2,
              "value": "历史",
              "heading": "历史"
            }
          ],
          "title": "接口管理",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/interface",
            "title": "Interface"
          }
        },
        "title": "接口管理 - RAP"
      },
      {
        "path": "/guide/interface/code",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__code.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/code.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/code.en-US.md",
          "updatedTime": 1669195859596,
          "slugs": [
            {
              "depth": 2,
              "value": "Basic Settings",
              "heading": "basic-settings"
            },
            {
              "depth": 2,
              "value": "Choose Mode",
              "heading": "choose-mode"
            },
            {
              "depth": 2,
              "value": "Project Settings",
              "heading": "project-settings"
            },
            {
              "depth": 2,
              "value": "Override",
              "heading": "override"
            }
          ],
          "title": "Basic Settings",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/interface",
            "title": "Interface"
          }
        },
        "title": "Basic Settings - RAP"
      },
      {
        "path": "/zh-CN/guide/interface/code",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__code.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/code.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/code.zh-CN.md",
          "updatedTime": 1669195893586,
          "slugs": [
            {
              "depth": 2,
              "value": "基本操作",
              "heading": "基本操作"
            },
            {
              "depth": 2,
              "value": "选择模式",
              "heading": "选择模式"
            },
            {
              "depth": 2,
              "value": "项目设置",
              "heading": "项目设置"
            },
            {
              "depth": 2,
              "value": "Override",
              "heading": "override"
            }
          ],
          "title": "基本操作",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/interface",
            "title": "Interface"
          }
        },
        "title": "基本操作 - RAP"
      },
      {
        "path": "/guide/interface/history",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__history.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/history.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/history.en-US.md",
          "updatedTime": 1669191570977,
          "slugs": [
            {
              "depth": 2,
              "value": "Interface History",
              "heading": "interface-history"
            },
            {
              "depth": 2,
              "value": "Repository Interfaces History",
              "heading": "repository-interfaces-history"
            }
          ],
          "title": "Interface History",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/interface",
            "title": "Interface"
          }
        },
        "title": "Interface History - RAP"
      },
      {
        "path": "/zh-CN/guide/interface/history",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__history.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/history.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/history.zh-CN.md",
          "updatedTime": 1669191570978,
          "slugs": [
            {
              "depth": 2,
              "value": "接口历史",
              "heading": "接口历史"
            },
            {
              "depth": 2,
              "value": "仓库接口历史",
              "heading": "仓库接口历史"
            }
          ],
          "title": "接口历史",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/interface",
            "title": "Interface"
          }
        },
        "title": "接口历史 - RAP"
      },
      {
        "path": "/guide/interface/module",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__module.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/module.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/module.en-US.md",
          "updatedTime": 1669191570978,
          "slugs": [
            {
              "depth": 2,
              "value": "Create Module",
              "heading": "create-module"
            },
            {
              "depth": 2,
              "value": "Edit Module",
              "heading": "edit-module"
            },
            {
              "depth": 2,
              "value": "Migrate Module",
              "heading": "migrate-module"
            },
            {
              "depth": 2,
              "value": "Delete Module",
              "heading": "delete-module"
            }
          ],
          "title": "Create Module",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/interface",
            "title": "Interface"
          }
        },
        "title": "Create Module - RAP"
      },
      {
        "path": "/zh-CN/guide/interface/module",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__module.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/module.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/module.zh-CN.md",
          "updatedTime": 1669191570979,
          "slugs": [
            {
              "depth": 2,
              "value": "新建模块",
              "heading": "新建模块"
            },
            {
              "depth": 2,
              "value": "编辑模块",
              "heading": "编辑模块"
            },
            {
              "depth": 2,
              "value": "迁移模块",
              "heading": "迁移模块"
            },
            {
              "depth": 2,
              "value": "删除模块",
              "heading": "删除模块"
            }
          ],
          "title": "新建模块",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/interface",
            "title": "Interface"
          }
        },
        "title": "新建模块 - RAP"
      },
      {
        "path": "/guide/interface/validation",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__validation.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/validation.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/validation.en-US.md",
          "updatedTime": 1669191570979,
          "slugs": [
            {
              "depth": 1,
              "value": "Validation",
              "heading": "validation"
            },
            {
              "depth": 2,
              "value": "Basic Settings",
              "heading": "basic-settings"
            },
            {
              "depth": 2,
              "value": "Target Result",
              "heading": "target-result"
            },
            {
              "depth": 2,
              "value": "Send Request",
              "heading": "send-request"
            }
          ],
          "title": "Validation",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/interface",
            "title": "Interface"
          }
        },
        "title": "Validation - RAP"
      },
      {
        "path": "/zh-CN/guide/interface/validation",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__interface__validation.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/interface/validation.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/interface/validation.zh-CN.md",
          "updatedTime": 1669191570979,
          "slugs": [
            {
              "depth": 1,
              "value": "接口校验",
              "heading": "接口校验"
            },
            {
              "depth": 2,
              "value": "基本设置",
              "heading": "基本设置"
            },
            {
              "depth": 2,
              "value": "目标结果",
              "heading": "目标结果"
            },
            {
              "depth": 2,
              "value": "接口请求",
              "heading": "接口请求"
            }
          ],
          "title": "接口校验",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/interface",
            "title": "Interface"
          }
        },
        "title": "接口校验 - RAP"
      },
      {
        "path": "/guide/mock/basic",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__mock__basic.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/mock/basic.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/mock/basic.en-US.md",
          "updatedTime": 1669191570980,
          "slugs": [
            {
              "depth": 2,
              "value": "Mock introduce",
              "heading": "mock-introduce"
            },
            {
              "depth": 2,
              "value": "Basic settings",
              "heading": "basic-settings"
            },
            {
              "depth": 2,
              "value": "Default values",
              "heading": "default-values"
            }
          ],
          "title": "Mock introduce",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/mock",
            "title": "Mock"
          }
        },
        "title": "Mock introduce - RAP"
      },
      {
        "path": "/zh-CN/guide/mock/basic",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__mock__basic.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/mock/basic.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/mock/basic.zh-CN.md",
          "updatedTime": 1669191570981,
          "slugs": [
            {
              "depth": 2,
              "value": "Mock接口",
              "heading": "mock接口"
            },
            {
              "depth": 2,
              "value": "基础设置",
              "heading": "基础设置"
            },
            {
              "depth": 2,
              "value": "默认值",
              "heading": "默认值"
            }
          ],
          "title": "Mock接口",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/mock",
            "title": "Mock"
          }
        },
        "title": "Mock接口 - RAP"
      },
      {
        "path": "/guide/mock/rule",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__mock__rule.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/mock/rule.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/mock/rule.en-US.md",
          "updatedTime": 1669194672776,
          "slugs": [
            {
              "depth": 1,
              "value": "Path Rule",
              "heading": "path-rule"
            },
            {
              "depth": 1,
              "value": "Match Steps",
              "heading": "match-steps"
            }
          ],
          "title": "Path Rule",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/mock",
            "title": "Mock"
          }
        },
        "title": "Path Rule - RAP"
      },
      {
        "path": "/zh-CN/guide/mock/rule",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__mock__rule.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/mock/rule.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/mock/rule.zh-CN.md",
          "updatedTime": 1669194662066,
          "slugs": [
            {
              "depth": 1,
              "value": "Mock路径规则",
              "heading": "mock路径规则"
            },
            {
              "depth": 1,
              "value": "匹配顺序",
              "heading": "匹配顺序"
            }
          ],
          "title": "Mock路径规则",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/mock",
            "title": "Mock"
          }
        },
        "title": "Mock路径规则 - RAP"
      },
      {
        "path": "/guide/mock/scene",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__mock__scene.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/mock/scene.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/mock/scene.en-US.md",
          "updatedTime": 1669191570993,
          "slugs": [
            {
              "depth": 2,
              "value": "Mock Scene",
              "heading": "mock-scene"
            }
          ],
          "title": "Mock Scene",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/mock",
            "title": "Mock"
          }
        },
        "title": "Mock Scene - RAP"
      },
      {
        "path": "/zh-CN/guide/mock/scene",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__mock__scene.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/mock/scene.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/mock/scene.zh-CN.md",
          "updatedTime": 1669191570993,
          "slugs": [
            {
              "depth": 2,
              "value": "Mock Scene",
              "heading": "mock-scene"
            }
          ],
          "title": "Mock Scene",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/mock",
            "title": "Mock"
          }
        },
        "title": "Mock Scene - RAP"
      },
      {
        "path": "/guide/project/organization",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__project__organization.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/project/organization.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/project/organization.en-US.md",
          "updatedTime": 1669195760018,
          "slugs": [
            {
              "depth": 2,
              "value": "Create Organization",
              "heading": "create-organization"
            },
            {
              "depth": 2,
              "value": "Edit Organization",
              "heading": "edit-organization"
            },
            {
              "depth": 2,
              "value": "Exit Organization",
              "heading": "exit-organization"
            },
            {
              "depth": 2,
              "value": "Delete Organization",
              "heading": "delete-organization"
            },
            {
              "depth": 2,
              "value": "Organization authorities",
              "heading": "organization-authorities"
            },
            {
              "depth": 2,
              "value": "Create Repository",
              "heading": "create-repository"
            },
            {
              "depth": 2,
              "value": "Import Repository",
              "heading": "import-repository"
            }
          ],
          "title": "Create Organization",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/project",
            "title": "Project"
          }
        },
        "title": "Create Organization - RAP"
      },
      {
        "path": "/zh-CN/guide/project/organization",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__project__organization.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/project/organization.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/project/organization.zh-CN.md",
          "updatedTime": 1669195760016,
          "slugs": [
            {
              "depth": 2,
              "value": "创建团队",
              "heading": "创建团队"
            },
            {
              "depth": 2,
              "value": "编辑团队",
              "heading": "编辑团队"
            },
            {
              "depth": 2,
              "value": "退出团队",
              "heading": "退出团队"
            },
            {
              "depth": 2,
              "value": "删除团队",
              "heading": "删除团队"
            },
            {
              "depth": 2,
              "value": "团队权限",
              "heading": "团队权限"
            },
            {
              "depth": 2,
              "value": "创建仓库",
              "heading": "创建仓库"
            },
            {
              "depth": 2,
              "value": "导入仓库",
              "heading": "导入仓库"
            }
          ],
          "title": "创建团队",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/project",
            "title": "Project"
          }
        },
        "title": "创建团队 - RAP"
      },
      {
        "path": "/guide/project/repository",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__project__repository.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/project/repository.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/project/repository.en-US.md",
          "updatedTime": 1669191571011,
          "slugs": [
            {
              "depth": 2,
              "value": "Create Repository",
              "heading": "create-repository"
            },
            {
              "depth": 2,
              "value": "Edit Repository",
              "heading": "edit-repository"
            },
            {
              "depth": 2,
              "value": "Delete Repository",
              "heading": "delete-repository"
            },
            {
              "depth": 2,
              "value": "Repository Plugin",
              "heading": "repository-plugin"
            },
            {
              "depth": 2,
              "value": "Operation Bar",
              "heading": "operation-bar"
            },
            {
              "depth": 2,
              "value": "Repository Settings",
              "heading": "repository-settings"
            }
          ],
          "title": "Create Repository",
          "locale": "en-US",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/guide/project",
            "title": "Project"
          }
        },
        "title": "Create Repository - RAP"
      },
      {
        "path": "/zh-CN/guide/project/repository",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__project__repository.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/guide/project/repository.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/project/repository.zh-CN.md",
          "updatedTime": 1669191571012,
          "slugs": [
            {
              "depth": 2,
              "value": "创建仓库",
              "heading": "创建仓库"
            },
            {
              "depth": 2,
              "value": "编辑仓库",
              "heading": "编辑仓库"
            },
            {
              "depth": 2,
              "value": "删除仓库",
              "heading": "删除仓库"
            },
            {
              "depth": 2,
              "value": "仓库插件",
              "heading": "仓库插件"
            },
            {
              "depth": 2,
              "value": "功能区",
              "heading": "功能区"
            },
            {
              "depth": 2,
              "value": "仓库设置",
              "heading": "仓库设置"
            }
          ],
          "title": "创建仓库",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/guide",
            "title": "Guide"
          },
          "group": {
            "path": "/zh-CN/guide/project",
            "title": "Project"
          }
        },
        "title": "创建仓库 - RAP"
      },
      {
        "path": "/open/data",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__data.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/data.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/data.en-US.md",
          "updatedTime": 1669194632055,
          "slugs": [
            {
              "depth": 1,
              "value": "Search repository details with format data",
              "heading": "search-repository-details-with-format-data"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Request",
              "heading": "request"
            },
            {
              "depth": 3,
              "value": "Response",
              "heading": "response"
            },
            {
              "depth": 2,
              "value": "Rap Definition",
              "heading": "rap-definition"
            }
          ],
          "title": "Search repository details with format data",
          "locale": "en-US",
          "nav": {
            "path": "/open",
            "title": "Open"
          }
        },
        "title": "Search repository details with format data - RAP"
      },
      {
        "path": "/zh-CN/open/data",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__data.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/data.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/data.zh-CN.md",
          "updatedTime": 1669194627472,
          "slugs": [
            {
              "depth": 1,
              "value": "查询指定格式的仓库数据",
              "heading": "查询指定格式的仓库数据"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "请求参数",
              "heading": "请求参数"
            },
            {
              "depth": 3,
              "value": "响应参数",
              "heading": "响应参数"
            },
            {
              "depth": 2,
              "value": "Rap定义",
              "heading": "rap定义"
            }
          ],
          "title": "查询指定格式的仓库数据",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/open",
            "title": "Open"
          }
        },
        "title": "查询指定格式的仓库数据 - RAP"
      },
      {
        "path": "/open/detail",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__detail.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/detail.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/detail.en-US.md",
          "updatedTime": 1669194622993,
          "slugs": [
            {
              "depth": 1,
              "value": "Search repository details",
              "heading": "search-repository-details"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Request",
              "heading": "request"
            },
            {
              "depth": 3,
              "value": "Response",
              "heading": "response"
            },
            {
              "depth": 2,
              "value": "Rap Definition",
              "heading": "rap-definition"
            }
          ],
          "title": "Search repository details",
          "locale": "en-US",
          "nav": {
            "path": "/open",
            "title": "Open"
          }
        },
        "title": "Search repository details - RAP"
      },
      {
        "path": "/zh-CN/open/detail",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__detail.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/detail.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/detail.zh-CN.md",
          "updatedTime": 1669194618595,
          "slugs": [
            {
              "depth": 1,
              "value": "查询仓库的模块列表和接口列表",
              "heading": "查询仓库的模块列表和接口列表"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "请求参数",
              "heading": "请求参数"
            },
            {
              "depth": 3,
              "value": "响应参数",
              "heading": "响应参数"
            },
            {
              "depth": 2,
              "value": "Rap定义",
              "heading": "rap定义"
            }
          ],
          "title": "查询仓库的模块列表和接口列表",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/open",
            "title": "Open"
          }
        },
        "title": "查询仓库的模块列表和接口列表 - RAP"
      },
      {
        "path": "/open/interface",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__interface.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/interface.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/interface.en-US.md",
          "updatedTime": 1669194614360,
          "slugs": [
            {
              "depth": 1,
              "value": "Search interface details",
              "heading": "search-interface-details"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Request",
              "heading": "request"
            },
            {
              "depth": 3,
              "value": "Response",
              "heading": "response"
            },
            {
              "depth": 2,
              "value": "Rap Definition",
              "heading": "rap-definition"
            }
          ],
          "title": "Search interface details",
          "locale": "en-US",
          "nav": {
            "path": "/open",
            "title": "Open"
          }
        },
        "title": "Search interface details - RAP"
      },
      {
        "path": "/zh-CN/open/interface",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__interface.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/interface.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/interface.zh-CN.md",
          "updatedTime": 1669194609541,
          "slugs": [
            {
              "depth": 1,
              "value": "查询接口定义详情",
              "heading": "查询接口定义详情"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "请求参数",
              "heading": "请求参数"
            },
            {
              "depth": 3,
              "value": "响应参数",
              "heading": "响应参数"
            },
            {
              "depth": 2,
              "value": "Rap定义",
              "heading": "rap定义"
            }
          ],
          "title": "查询接口定义详情",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/open",
            "title": "Open"
          }
        },
        "title": "查询接口定义详情 - RAP"
      },
      {
        "path": "/open/organizations",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__organizations.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/organizations.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/organizations.en-US.md",
          "updatedTime": 1669194604420,
          "slugs": [
            {
              "depth": 1,
              "value": "Search organization lists",
              "heading": "search-organization-lists"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Request",
              "heading": "request"
            },
            {
              "depth": 3,
              "value": "Response",
              "heading": "response"
            },
            {
              "depth": 2,
              "value": "Rap Definition",
              "heading": "rap-definition"
            }
          ],
          "title": "Search organization lists",
          "locale": "en-US",
          "nav": {
            "path": "/open",
            "title": "Open"
          }
        },
        "title": "Search organization lists - RAP"
      },
      {
        "path": "/zh-CN/open/organizations",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__organizations.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/organizations.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/organizations.zh-CN.md",
          "updatedTime": 1669194598920,
          "slugs": [
            {
              "depth": 1,
              "value": "查询团队列表",
              "heading": "查询团队列表"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "请求参数",
              "heading": "请求参数"
            },
            {
              "depth": 3,
              "value": "响应参数",
              "heading": "响应参数"
            },
            {
              "depth": 2,
              "value": "Rap定义",
              "heading": "rap定义"
            }
          ],
          "title": "查询团队列表",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/open",
            "title": "Open"
          }
        },
        "title": "查询团队列表 - RAP"
      },
      {
        "path": "/open/repos",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__repos.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/repos.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/repos.en-US.md",
          "updatedTime": 1669194593253,
          "slugs": [
            {
              "depth": 1,
              "value": "Search repository lists",
              "heading": "search-repository-lists"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Request",
              "heading": "request"
            },
            {
              "depth": 3,
              "value": "Response",
              "heading": "response"
            },
            {
              "depth": 2,
              "value": "Rap Definition",
              "heading": "rap-definition"
            }
          ],
          "title": "Search repository lists",
          "locale": "en-US",
          "nav": {
            "path": "/open",
            "title": "Open"
          }
        },
        "title": "Search repository lists - RAP"
      },
      {
        "path": "/zh-CN/open/repos",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__repos.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/repos.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/repos.zh-CN.md",
          "updatedTime": 1669194584841,
          "slugs": [
            {
              "depth": 1,
              "value": "查询仓库列表",
              "heading": "查询仓库列表"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "请求参数",
              "heading": "请求参数"
            },
            {
              "depth": 3,
              "value": "响应参数",
              "heading": "响应参数"
            },
            {
              "depth": 2,
              "value": "Rap定义",
              "heading": "rap定义"
            }
          ],
          "title": "查询仓库列表",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/open",
            "title": "Open"
          }
        },
        "title": "查询仓库列表 - RAP"
      },
      {
        "path": "/open/upload",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__upload.en-US.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/upload.en-US.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/upload.en-US.md",
          "updatedTime": 1669195939684,
          "slugs": [
            {
              "depth": 1,
              "value": "Update repository interfaces data",
              "heading": "update-repository-interfaces-data"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Headers",
              "heading": "headers"
            },
            {
              "depth": 3,
              "value": "Request",
              "heading": "request"
            },
            {
              "depth": 3,
              "value": "Response",
              "heading": "response"
            }
          ],
          "title": "Update repository interfaces data",
          "locale": "en-US",
          "nav": {
            "path": "/open",
            "title": "Open"
          }
        },
        "title": "Update repository interfaces data - RAP"
      },
      {
        "path": "/zh-CN/open/upload",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__open__upload.zh-CN.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/open/upload.zh-CN.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/open/upload.zh-CN.md",
          "updatedTime": 1669195943125,
          "slugs": [
            {
              "depth": 1,
              "value": "更新仓库接口信息",
              "heading": "更新仓库接口信息"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Headers",
              "heading": "headers"
            },
            {
              "depth": 3,
              "value": "请求参数",
              "heading": "请求参数"
            },
            {
              "depth": 3,
              "value": "响应参数",
              "heading": "响应参数"
            }
          ],
          "title": "更新仓库接口信息",
          "locale": "zh-CN",
          "nav": {
            "path": "/zh-CN/open",
            "title": "Open"
          }
        },
        "title": "更新仓库接口信息 - RAP"
      },
      {
        "path": "/zh-CN/code/dto",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__dto.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/dto.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/dto.md",
          "updatedTime": 1669191570708,
          "slugs": [
            {
              "depth": 1,
              "value": "Nest DTO Generation",
              "heading": "nest-dto-generation"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Nest DTO mode",
              "heading": "2-select-rapper30--nest-dto-mode"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            }
          ],
          "title": "Nest DTO Generation",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "locale": "zh-CN"
        },
        "title": "Nest DTO Generation - RAP"
      },
      {
        "path": "/zh-CN/code/http",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__http.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/http.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/http.md",
          "updatedTime": 1669191570709,
          "slugs": [
            {
              "depth": 1,
              "value": "Http",
              "heading": "http"
            },
            {
              "depth": 2,
              "value": "@rapper/request",
              "heading": "rapperrequest"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "http(url, payload, config)",
              "heading": "httpurl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.get(url, payload, config)",
              "heading": "httpgeturl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.post(url, payload, config)",
              "heading": "httpposturl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.put(url, payload, config)",
              "heading": "httpputurl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.delete(url, payload, config)",
              "heading": "httpdeleteurl-payload-config"
            },
            {
              "depth": 3,
              "value": "http.patch(url, payload, config)",
              "heading": "httppatchurl-payload-config"
            },
            {
              "depth": 2,
              "value": "Interceptor",
              "heading": "interceptor"
            },
            {
              "depth": 3,
              "value": "1. Cofig baseURL",
              "heading": "1-cofig-baseurl"
            },
            {
              "depth": 3,
              "value": "2. Hanlde the response data",
              "heading": "2-hanlde-the-response-data"
            }
          ],
          "title": "Http",
          "hasPreviewer": true,
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "locale": "zh-CN"
        },
        "title": "Http - RAP"
      },
      {
        "path": "/zh-CN/code",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__index.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/index.md",
          "updatedTime": 1669191570728,
          "slugs": [
            {
              "depth": 1,
              "value": "Generate Code Rapper v3",
              "heading": "generate-code-rapper-v3"
            },
            {
              "depth": 2,
              "value": "Contact",
              "heading": "contact"
            }
          ],
          "title": "Generate Code Rapper v3",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "locale": "zh-CN"
        },
        "title": "Generate Code Rapper v3 - RAP"
      },
      {
        "path": "/zh-CN/code/migration",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__migration.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/migration.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/migration.md",
          "updatedTime": 1669194459241,
          "slugs": [
            {
              "depth": 1,
              "value": "Rapper2.x -> Rapper3.0",
              "heading": "rapper2x---rapper30"
            },
            {
              "depth": 2,
              "value": "Override fetch",
              "heading": "override-fetch"
            },
            {
              "depth": 2,
              "value": "Config baseURL",
              "heading": "config-baseurl"
            },
            {
              "depth": 3,
              "value": "Other configuration",
              "heading": "other-configuration"
            }
          ],
          "title": "Rapper2.x -> Rapper3.0",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "locale": "zh-CN"
        },
        "title": "Rapper2.x -> Rapper3.0 - RAP"
      },
      {
        "path": "/zh-CN/code/ts",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__ts.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/ts.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/ts.md",
          "updatedTime": 1669191570736,
          "slugs": [
            {
              "depth": 1,
              "value": "Pure TS Models",
              "heading": "pure-ts-models"
            },
            {
              "depth": 2,
              "value": "Overview",
              "heading": "overview"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Pure TS Models Mode",
              "heading": "2-select-rapper30--pure-ts-models-mode"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            }
          ],
          "title": "Pure TS Models",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "locale": "zh-CN"
        },
        "title": "Pure TS Models - RAP"
      },
      {
        "path": "/zh-CN/code/react",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__index.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/index.md",
          "updatedTime": 1669191570733,
          "slugs": [
            {
              "depth": 1,
              "value": "React Hooks",
              "heading": "react-hooks"
            },
            {
              "depth": 2,
              "value": "@rapper/ahooks",
              "heading": "rapperahooks"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & React + ahooks mode",
              "heading": "2-select-rapper30--react--ahooks-mode"
            },
            {
              "depth": 2,
              "value": "Movitation",
              "heading": "movitation"
            },
            {
              "depth": 2,
              "value": "Install",
              "heading": "install"
            },
            {
              "depth": 2,
              "value": "Background",
              "heading": "background"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "React Hooks",
          "hasPreviewer": true,
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/react",
            "title": "React"
          },
          "locale": "zh-CN"
        },
        "title": "React Hooks - RAP"
      },
      {
        "path": "/zh-CN/code/react/react-query",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__react-query.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/react-query.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/react-query.md",
          "updatedTime": 1669191570734,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-query",
              "heading": "rapperreact-query"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install @tanstack/react-query & @rapper/react-query",
              "heading": "3-then-install-tanstackreact-query--rapperreact-query"
            },
            {
              "depth": 3,
              "value": "Tips",
              "heading": "tips"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "useRapperQuery",
              "heading": "userapperquery"
            },
            {
              "depth": 3,
              "value": "useRapperQueries",
              "heading": "userapperqueries"
            },
            {
              "depth": 3,
              "value": "useRapperMutation",
              "heading": "userappermutation"
            },
            {
              "depth": 3,
              "value": "useRapperInfiniteQuery",
              "heading": "userapperinfinitequery"
            }
          ],
          "title": "@rapper/react-query",
          "hasPreviewer": true,
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/react",
            "title": "React"
          },
          "locale": "zh-CN"
        },
        "title": "@rapper/react-query - RAP"
      },
      {
        "path": "/zh-CN/code/react/react-query3",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__react-query3.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/react-query3.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/react-query3.md",
          "updatedTime": 1669194520984,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-query3",
              "heading": "rapperreact-query3"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install react-query@3 & @rapper/react-query3",
              "heading": "3-then-install-react-query3--rapperreact-query3"
            },
            {
              "depth": 3,
              "value": "Tips",
              "heading": "tips"
            },
            {
              "depth": 3,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "useRapperQuery",
              "heading": "userapperquery"
            },
            {
              "depth": 3,
              "value": "useRapperQueries",
              "heading": "userapperqueries"
            },
            {
              "depth": 3,
              "value": "useRapperMutation",
              "heading": "userappermutation"
            },
            {
              "depth": 3,
              "value": "useRapperInfiniteQuery",
              "heading": "userapperinfinitequery"
            }
          ],
          "title": "@rapper/react-query3",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/react",
            "title": "React"
          },
          "locale": "zh-CN"
        },
        "title": "@rapper/react-query3 - RAP"
      },
      {
        "path": "/zh-CN/code/react/react-swr",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__react-swr.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/react-swr.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/react-swr.md",
          "updatedTime": 1669191570735,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-swr",
              "heading": "rapperreact-swr"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install swr & @rapper/react-swr",
              "heading": "3-then-install-swr--rapperreact-swr"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "@rapper/react-swr",
          "hasPreviewer": true,
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/react",
            "title": "React"
          },
          "locale": "zh-CN"
        },
        "title": "@rapper/react-swr - RAP"
      },
      {
        "path": "/zh-CN/code/react/redux-toolkit",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__redux-toolkit.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/redux-toolkit.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/redux-toolkit.md",
          "updatedTime": 1669191570735,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-redux-toolkit",
              "heading": "rapperreact-redux-toolkit"
            }
          ],
          "title": "@rapper/react-redux-toolkit",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/react",
            "title": "React"
          },
          "locale": "zh-CN"
        },
        "title": "@rapper/react-redux-toolkit - RAP"
      },
      {
        "path": "/zh-CN/code/react/redux",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__react__redux.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/react/redux.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/react/redux.md",
          "updatedTime": 1669191570735,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/react-redux",
              "heading": "rapperreact-redux"
            }
          ],
          "title": "@rapper/react-redux",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/react",
            "title": "React"
          },
          "locale": "zh-CN"
        },
        "title": "@rapper/react-redux - RAP"
      },
      {
        "path": "/zh-CN/code/vue",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__vue__index.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/vue/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/vue/index.md",
          "updatedTime": 1669191570737,
          "slugs": [],
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/vue",
            "title": "Vue"
          },
          "title": "Vue",
          "locale": "zh-CN"
        },
        "title": "Vue - RAP"
      },
      {
        "path": "/zh-CN/code/vue/vue-query",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__vue__vue-query.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/vue/vue-query.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/vue/vue-query.md",
          "updatedTime": 1669191570737,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/vue-query",
              "heading": "rappervue-query"
            },
            {
              "depth": 2,
              "value": "Http",
              "heading": "http"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install vue-query & @rapper/vue-query",
              "heading": "3-then-install-vue-query--rappervue-query"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "@rapper/vue-query",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/vue",
            "title": "Vue"
          },
          "locale": "zh-CN"
        },
        "title": "@rapper/vue-query - RAP"
      },
      {
        "path": "/zh-CN/code/vue/vue-swr",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__code__vue__vue-swr.md' */'/Users/xian.xia/Documents/github/rap-client-github/docs/code/vue/vue-swr.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/code/vue/vue-swr.md",
          "updatedTime": 1669191570738,
          "slugs": [
            {
              "depth": 1,
              "value": "@rapper/vue-swr",
              "heading": "rappervue-swr"
            },
            {
              "depth": 3,
              "value": "1. Click Generate TS code",
              "heading": "1-click-generate-ts-code"
            },
            {
              "depth": 3,
              "value": "2. Select Rapper3.0 & Basic Mode",
              "heading": "2-select-rapper30--basic-mode"
            },
            {
              "depth": 3,
              "value": "3. Then install swrv & @rapper/vue-swr",
              "heading": "3-then-install-swrv--rappervue-swr"
            },
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            }
          ],
          "title": "@rapper/vue-swr",
          "nav": {
            "path": "/zh-CN/code",
            "title": "Code"
          },
          "group": {
            "path": "/zh-CN/code/vue",
            "title": "Vue"
          },
          "locale": "zh-CN"
        },
        "title": "@rapper/vue-swr - RAP"
      },
      {
        "path": "/guide/import",
        "meta": {},
        "exact": true,
        "redirect": "/guide/import/protobuf"
      },
      {
        "path": "/zh-CN/guide/import",
        "meta": {},
        "exact": true,
        "redirect": "/zh-CN/guide/import/protobuf"
      },
      {
        "path": "/guide/interface",
        "meta": {},
        "exact": true,
        "redirect": "/guide/interface/basic"
      },
      {
        "path": "/zh-CN/guide/interface",
        "meta": {},
        "exact": true,
        "redirect": "/zh-CN/guide/interface/basic"
      },
      {
        "path": "/guide/mock",
        "meta": {},
        "exact": true,
        "redirect": "/guide/mock/basic"
      },
      {
        "path": "/zh-CN/guide/mock",
        "meta": {},
        "exact": true,
        "redirect": "/zh-CN/guide/mock/basic"
      },
      {
        "path": "/guide/project",
        "meta": {},
        "exact": true,
        "redirect": "/guide/project/organization"
      },
      {
        "path": "/zh-CN/guide/project",
        "meta": {},
        "exact": true,
        "redirect": "/zh-CN/guide/project/organization"
      },
      {
        "path": "/open",
        "meta": {},
        "exact": true,
        "redirect": "/open/upload"
      },
      {
        "path": "/zh-CN/open",
        "meta": {},
        "exact": true,
        "redirect": "/zh-CN/open/upload"
      }
    ],
    "title": "RAP",
    "component": (props) => props.children
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
