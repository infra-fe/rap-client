(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[27],{OQaf:function(e,t,a){"use strict";a.r(t);var l=a("q1tI"),r=a.n(l),n=a("dEAq"),c=a("H1Ra"),i=r.a.memo((e=>{e.demos;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"markdown"},r.a.createElement("h1",{id:"path-rule"},r.a.createElement(n["AnchorLink"],{to:"#path-rule","aria-hidden":"true",tabIndex:-1},r.a.createElement("span",{className:"icon icon-link"})),"Path Rule"),r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement("p",null,"Mock server rule: RAP platform URL + mock + repository id + method + interface actual request path")),r.a.createElement("li",null,r.a.createElement("p",null,"Suppose your rap deployment address is: ",r.a.createElement(n["Link"],{to:"https://rap.server.io/"},"https://rap.server.io")," and use this address as an example"))),r.a.createElement(c["a"],{code:"mock address: https://rap.server.io/api/app/mock/154/get/example/interface",lang:"unknown"}),r.a.createElement("h1",{id:"match-steps"},r.a.createElement(n["AnchorLink"],{to:"#match-steps","aria-hidden":"true",tabIndex:-1},r.a.createElement("span",{className:"icon icon-link"})),"Match Steps"),r.a.createElement("ol",null,r.a.createElement("li",null,"Fuzzy search for current repository and collaborate repositories by relative path"),r.a.createElement("li",null,"Find all the path matched interfaces with the document"),r.a.createElement("li",null,"Filtered all query params matched interfaces"),r.a.createElement("li",null,"The current repository result is priority to return"),r.a.createElement("li",null,"If 1-4 not find, use the regexp find if there are exits some RESTFUL(/:id or /","{","id","}",") url."),r.a.createElement("li",null,"If there are exits multiple result in 5 step, it will return error"),r.a.createElement("li",null,"If there are none result, it will return error too"),r.a.createElement("li",null,"Find if it is a ",r.a.createElement("code",null,"scene")," request, return the scene data if exited"),r.a.createElement("li",null,"Checked the matched interface's ",r.a.createElement("code",null,"require")," params if it is a ",r.a.createElement("code",null,"get")," or ",r.a.createElement("code",null,"post")," method"),r.a.createElement("li",null,"If the response code is 301, then redirect"),r.a.createElement("li",null,"Generate mock data and return"),r.a.createElement("li",null,"If it has ",r.a.createElement("code",null,"callback")," params, wrap the data as jsonp format"))))}));t["default"]=e=>{var t=r.a.useContext(n["context"]),a=t.demos;return r.a.useEffect((()=>{var t;null!==e&&void 0!==e&&null!==(t=e.location)&&void 0!==t&&t.hash&&n["AnchorLink"].scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),r.a.createElement(i,{demos:a})}}}]);