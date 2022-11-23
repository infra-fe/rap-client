(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[12],{"9kvl":function(e,a,t){"use strict";var r=t("FfOG");t.d(a,"a",(function(){return r["b"]}));t("bCY9")},OP9m:function(e,a,t){"use strict";t.r(a);var r=t("q1tI"),n=t.n(r),c=t("dEAq"),i=t("Zxc8"),l=t("H1Ra"),s=n.a.memo((e=>{var a=e.demos,r=a["reactquery-reactquery"].component,s=a["reactquery-reactqueries"].component,o=a["reactquery-usemutation"].component,u=a["reactquery-useinfinitequery"].component;return n.a.createElement(n.a.Fragment,null,n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"markdown"},n.a.createElement("h1",{id:"rapperreact-query"},n.a.createElement(c["AnchorLink"],{to:"#rapperreact-query","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"@rapper/react-query"),n.a.createElement("p",null,n.a.createElement("code",null,"@rapper/react-query")," based on ",n.a.createElement(c["Link"],{to:"https://tanstack.com/query/v4/docs/adapters/react-query"},"@tanstack/react-query")),n.a.createElement("h3",{id:"1-click-generate-ts-code"},n.a.createElement(c["AnchorLink"],{to:"#1-click-generate-ts-code","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"1. Click ",n.a.createElement("code",null,"Generate TS code")),n.a.createElement("img",{width:"850px",src:t("WZFi")}),n.a.createElement("h3",{id:"2-select-rapper30--basic-mode"},n.a.createElement(c["AnchorLink"],{to:"#2-select-rapper30--basic-mode","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"2. Select ",n.a.createElement("code",null,"Rapper3.0")," & ",n.a.createElement("code",null,"Basic Mode")),n.a.createElement("img",{width:"850px",src:t("au+y")}),n.a.createElement("h3",{id:"3-then-install-tanstackreact-query--rapperreact-query"},n.a.createElement(c["AnchorLink"],{to:"#3-then-install-tanstackreact-query--rapperreact-query","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"3. Then install ",n.a.createElement("code",null,"@tanstack/react-query")," & ",n.a.createElement("code",null,"@rapper/react-query")),n.a.createElement(l["a"],{code:"yarn add @rapper/react-query @tanstack/react-query",lang:"bash"}),n.a.createElement("h3",{id:"tips"},n.a.createElement(c["AnchorLink"],{to:"#tips","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"Tips"),n.a.createElement("p",null,"Remember to add ",n.a.createElement("code",null,"QueryClientProvider"),". (",n.a.createElement(c["Link"],{to:"https://react-query.tanstack.com/quick-start"},"React Query Quick Start"),")"),n.a.createElement(l["a"],{code:"import { QueryClient, QueryClientProvider } from '@tanstack/react-query'\n\n// Create a client\nconst queryClient = new QueryClient()\n\nfunction App() {\n  return (\n    // Provide the client to your App\n    <QueryClientProvider client={queryClient}>\n      <Todos />\n    </QueryClientProvider>\n  )\n}",lang:"ts"}),n.a.createElement("h2",{id:"usage"},n.a.createElement(c["AnchorLink"],{to:"#usage","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"Usage"),n.a.createElement(l["a"],{code:"// utils.ts\nimport { http } from 'src/rapper'\nimport {\n  createUseRapperMutation,\n  createUseRapperQuery,\n  createUseRapperQueries,\n  createUseRapperInfiniteQuery,\n  createRapperQueryOptions,\n} from '@rapper/react-query'\n\nexport const useRapperQuery = createUseRapperQuery(http, {\n  baseURL: 'your baseURL',\n})\nexport const useRapperQueries = createUseRapperQueries(http, {\n  baseURL: 'your baseURL',\n})\nexport const useRapperMutation = createUseRapperMutation(http, {\n  baseURL: 'your baseURL',\n})\nexport const useRapperInfiniteQuery = createUseRapperInfiniteQuery(http, {\n  baseURL: 'your baseURL',\n})\nexport const op = createRapperQueryOptions(http)",lang:"ts"}),n.a.createElement("h3",{id:"userapperquery"},n.a.createElement(c["AnchorLink"],{to:"#userapperquery","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"useRapperQuery")),n.a.createElement(i["default"],a["reactquery-reactquery"].previewerProps,n.a.createElement(r,null)),n.a.createElement("div",{className:"markdown"},n.a.createElement("h3",{id:"userapperqueries"},n.a.createElement(c["AnchorLink"],{to:"#userapperqueries","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"useRapperQueries")),n.a.createElement(i["default"],a["reactquery-reactqueries"].previewerProps,n.a.createElement(s,null)),n.a.createElement("div",{className:"markdown"},n.a.createElement("h3",{id:"userappermutation"},n.a.createElement(c["AnchorLink"],{to:"#userappermutation","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"useRapperMutation")),n.a.createElement(i["default"],a["reactquery-usemutation"].previewerProps,n.a.createElement(o,null)),n.a.createElement("div",{className:"markdown"},n.a.createElement("h3",{id:"userapperinfinitequery"},n.a.createElement(c["AnchorLink"],{to:"#userapperinfinitequery","aria-hidden":"true",tabIndex:-1},n.a.createElement("span",{className:"icon icon-link"})),"useRapperInfiniteQuery")),n.a.createElement(i["default"],a["reactquery-useinfinitequery"].previewerProps,n.a.createElement(u,null))))}));a["default"]=e=>{var a=n.a.useContext(c["context"]),t=a.demos;return n.a.useEffect((()=>{var a;null!==e&&void 0!==e&&null!==(a=e.location)&&void 0!==a&&a.hash&&c["AnchorLink"].scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),n.a.createElement(s,{demos:t})}},WZFi:function(e,a,t){e.exports=t.p+"static/ts-generate.b75bbf35.jpg"},"au+y":function(e,a,t){e.exports=t.p+"static/normal-mode.10215453.jpg"}}]);