(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"9kvl":function(e,t,a){"use strict";var n=a("FfOG");a.d(t,"a",(function(){return n["b"]}));a("bCY9")},Fumd:function(e,t,a){e.exports=a.p+"static/http-res-reminder.987ef82e.jpg"},"Ja/W":function(e,t,a){e.exports=a.p+"static/http-url-reminder.15305855.jpg"},Pszd:function(e,t,a){e.exports=a.p+"static/http-req-remind.f75719cd.jpg"},WZFi:function(e,t,a){e.exports=a.p+"static/ts-generate.b75bbf35.jpg"},"au+y":function(e,t,a){e.exports=a.p+"static/normal-mode.10215453.jpg"},bT2K:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),l=a.n(n),r=a("dEAq"),c=a("Zxc8"),o=a("H1Ra"),i=l.a.memo((e=>{var t=e.demos,n=t["code-http"].component;return l.a.createElement(l.a.Fragment,null,l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"markdown"},l.a.createElement("h1",{id:"http"},l.a.createElement(r["AnchorLink"],{to:"#http","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Http"),l.a.createElement("h2",{id:"rapperrequest"},l.a.createElement(r["AnchorLink"],{to:"#rapperrequest","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"@rapper/request")),l.a.createElement(c["default"],t["code-http"].previewerProps,l.a.createElement(n,null)),l.a.createElement("div",{className:"markdown"},l.a.createElement("h3",{id:"1-click-generate-ts-code"},l.a.createElement(r["AnchorLink"],{to:"#1-click-generate-ts-code","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"1. Click ",l.a.createElement("code",null,"Generate TS code")),l.a.createElement("img",{width:"850px",src:a("WZFi")}),l.a.createElement("h3",{id:"2-select-rapper30--basic-mode"},l.a.createElement(r["AnchorLink"],{to:"#2-select-rapper30--basic-mode","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"2. Select ",l.a.createElement("code",null,"Rapper3.0")," & ",l.a.createElement("code",null,"Basic Mode")),l.a.createElement("img",{width:"850px",src:a("au+y")}),l.a.createElement("h2",{id:"install"},l.a.createElement(r["AnchorLink"],{to:"#install","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Install"),l.a.createElement(o["a"],{code:"yarn add @rapper/request @infra/rapper",lang:"bash"}),l.a.createElement("p",null,"Except the TS defination file\uff0cit will generate ",l.a.createElement("code",null,"http.ts")," file."),l.a.createElement("p",null,"The ",l.a.createElement("code",null,"@rapper/request")," based on ",l.a.createElement("code",null,"axios")),l.a.createElement("h2",{id:"usage"},l.a.createElement(r["AnchorLink"],{to:"#usage","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Usage"),l.a.createElement("h3",{id:"httpurl-payload-config"},l.a.createElement(r["AnchorLink"],{to:"#httpurl-payload-config","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"http(url, payload, config)"),l.a.createElement("blockquote",null,l.a.createElement("p",null,l.a.createElement("code",null,"http(url: keyof IModels, payload, config?: Omit<AxiosRequestConfig, 'method' | 'url'>)"))),l.a.createElement(o["a"],{code:"import { http } from './src/rapper'\n\nasync function Test() {\n  /**\n   * the same as: \n    axios('/api/get/users', {\n      method: 'GET',\n      params: { page: 1, pageSize: 10 }\n    })\n  */\n  const res = await http('GET/api/get/users', { page: 1, pageSize: 10 })\n  console.log(res.data)\n}",lang:"ts"}),l.a.createElement("blockquote",null,l.a.createElement("p",null,"TS smart reminder in VsCode"),l.a.createElement("img",{style:{width:"600px"},src:a("Ja/W")}),l.a.createElement("img",{style:{width:"600px"},src:a("Pszd")}),l.a.createElement("img",{style:{width:"600px"},src:a("Fumd")})),l.a.createElement("h3",{id:"httpgeturl-payload-config"},l.a.createElement(r["AnchorLink"],{to:"#httpgeturl-payload-config","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"http.get(url, payload, config)"),l.a.createElement("blockquote",null,l.a.createElement("p",null,"The same as ",l.a.createElement("code",null,"http(url, payload, config)"),"The difference is the ",l.a.createElement("code",null,"http.get()")," will only show the ",l.a.createElement("code",null,"GET")," url TS reminder",l.a.createElement("img",{style:{width:"600px"},src:a("lYym")}))),l.a.createElement("h3",{id:"httpposturl-payload-config"},l.a.createElement(r["AnchorLink"],{to:"#httpposturl-payload-config","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"http.post(url, payload, config)"),l.a.createElement("p",null,l.a.createElement("code",null,"http.post()")," will only show the ",l.a.createElement("code",null,"POST")," url in TS reminder"),l.a.createElement("h3",{id:"httpputurl-payload-config"},l.a.createElement(r["AnchorLink"],{to:"#httpputurl-payload-config","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"http.put(url, payload, config)"),l.a.createElement("p",null,l.a.createElement("code",null,"http.put()")," will only show the ",l.a.createElement("code",null,"PUT")," url in TS reminder"),l.a.createElement("h3",{id:"httpdeleteurl-payload-config"},l.a.createElement(r["AnchorLink"],{to:"#httpdeleteurl-payload-config","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"http.delete(url, payload, config)"),l.a.createElement("p",null,l.a.createElement("code",null,"http.delete()")," will only show the ",l.a.createElement("code",null,"DELETE")," url in TS reminder"),l.a.createElement("h3",{id:"httppatchurl-payload-config"},l.a.createElement(r["AnchorLink"],{to:"#httppatchurl-payload-config","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"http.patch(url, payload, config)"),l.a.createElement("p",null,l.a.createElement("code",null,"http.patch()")," will only show the ",l.a.createElement("code",null,"PATCH")," url in TS reminder"),l.a.createElement("h2",{id:"interceptor"},l.a.createElement(r["AnchorLink"],{to:"#interceptor","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Interceptor"),l.a.createElement("p",null,l.a.createElement("code",null,"@rapper/request")," based on ",l.a.createElement("code",null,"axios"),", so you can write interceptor as ",l.a.createElement("code",null,"axios")),l.a.createElement("h3",{id:"1-cofig-baseurl"},l.a.createElement(r["AnchorLink"],{to:"#1-cofig-baseurl","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"1. Cofig baseURL"),l.a.createElement("blockquote",null,l.a.createElement("p",null,l.a.createElement("code",null,"@rapper/request")," has the following baseURL configuration built in"),l.a.createElement("img",{width:"850px",src:a("pcFF")})),l.a.createElement("p",null,"If you want to custom your baseURL\uff0cyou can overider it as following"),l.a.createElement(o["a"],{code:"import { http } from 'src/rapper'\nhttp.interceptor.request.use((config) => {\n  config.baseURL = 'your baseURL'\n  return config\n})",lang:"ts"}),l.a.createElement("h3",{id:"2-hanlde-the-response-data"},l.a.createElement(r["AnchorLink"],{to:"#2-hanlde-the-response-data","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"2. Hanlde the response data"),l.a.createElement(o["a"],{code:"import { http } from 'src/rapper'\nhttp.interceptor.response.use((response) => {\n  if (response.code === 401) {\n    // do something\n  }\n  return response\n})",lang:"ts"}))))}));t["default"]=e=>{var t=l.a.useContext(r["context"]),a=t.demos;return l.a.useEffect((()=>{var t;null!==e&&void 0!==e&&null!==(t=e.location)&&void 0!==t&&t.hash&&r["AnchorLink"].scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),l.a.createElement(i,{demos:a})}},lYym:function(e,t,a){e.exports=a.p+"static/http-get-url-reminder.14de1c3e.jpg"},pcFF:function(e,t,a){e.exports=a.p+"static/http-file.4796bcac.jpg"}}]);