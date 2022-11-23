(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[61],{A4a7:function(e,t,n){"use strict";n.r(t);var a=n("q1tI"),l=n.n(a),r=n("dEAq"),i=n("H1Ra"),c=n("dMo/"),o=l.a.memo((e=>{e.demos;return l.a.createElement(l.a.Fragment,null,l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"markdown"},l.a.createElement("h1",{id:"search-repository-details"},l.a.createElement(r["AnchorLink"],{to:"#search-repository-details","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Search repository details"),l.a.createElement("h3",{id:"api"},l.a.createElement(r["AnchorLink"],{to:"#api","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"API"),l.a.createElement(c["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{align:"left"},"Method"),l.a.createElement("th",{align:"left"},"Endpoint"),l.a.createElement("th",{align:"left"},"Description"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"GET"),l.a.createElement("td",{align:"left"},"/openAPI/repository/","{","id","}"),l.a.createElement("td",{align:"left"},"According to the repository id, query the module list and interface list")))),l.a.createElement("h3",{id:"request"},l.a.createElement(r["AnchorLink"],{to:"#request","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Request"),l.a.createElement(c["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{align:"left"},"Name"),l.a.createElement("th",{align:"left"},"Required"),l.a.createElement("th",{align:"left"},"Type"),l.a.createElement("th",{align:"left"},"Default"),l.a.createElement("th",{align:"left"},"Description"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"withoutModules"),l.a.createElement("td",{align:"left"},"true"),l.a.createElement("td",{align:"left"},"Boolean"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"If it is [true], the returned result does not include the module list and interface list.")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"withoutInterfaces"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"Boolean"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"If it is [true], the returned result does not include the interface list.")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"versionName"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"String"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"The repository version name, If the version name exists, this version will be updated; if the version name does not exist, a new version will be created; if not passed, the main version will be updated by default.")))),l.a.createElement("h3",{id:"response"},l.a.createElement(r["AnchorLink"],{to:"#response","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Response"),l.a.createElement(c["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{align:"left"},"Name"),l.a.createElement("th",{align:"left"},"Required"),l.a.createElement("th",{align:"left"},"Type"),l.a.createElement("th",{align:"left"},"Default"),l.a.createElement("th",{align:"left"},"Description"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"code"),l.a.createElement("td",{align:"left"},"true"),l.a.createElement("td",{align:"left"},"Number"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"if success the code is 200, others is error")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"message"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"String"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"the notice messages")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"data"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"Object"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"result data")))),l.a.createElement(i["a"],{code:'{\n  "data": {\n    "name": "RAP-openAPI",\n    "id": 121,\n    "description": "",\n    "modules": [\n      {\n        "id": 511,\n        "name": "Token Management",\n        "description": "OpenAPI",\n        "priority": 1,\n        "interfaces": [\n          {\n            "name": "login Token",\n            "id": 2841,\n            "url": "/auth/token",\n            "method": "POST",\n            "priority": 1643082128513,\n            "status": 200,\n            "bodyOption": null,\n            "description": "",\n            "moduleId": 511,\n            "repositoryId": 121\n          }\n        ]\n      }\n    ],\n    "basePath": "/api/openAPI/",\n    "version": {\n      "id": "",\n      "name": "",\n      "isMaster": false\n    }\n  },\n  "code": 1,\n  "message": ""\n}',lang:"json"}),l.a.createElement("h2",{id:"rap-definition"},l.a.createElement(r["AnchorLink"],{to:"#rap-definition","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),l.a.createElement(r["Link"],{to:"/repository/editor?id=317&itf=12574"},"Rap Definition")))))}));t["default"]=e=>{var t=l.a.useContext(r["context"]),n=t.demos;return l.a.useEffect((()=>{var t;null!==e&&void 0!==e&&null!==(t=e.location)&&void 0!==t&&t.hash&&r["AnchorLink"].scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),l.a.createElement(o,{demos:n})}},WpQk:function(e,t,n){},"dMo/":function(e,t,n){"use strict";var a=n("q1tI"),l=n.n(a),r=n("hKI/"),i=n.n(r);n("WpQk");function c(e,t){return u(e)||m(e,t)||d(e,t)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function d(e,t){if(e){if("string"===typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function m(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,l,r=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(a=n.next()).done);i=!0)if(r.push(a.value),t&&r.length===t)break}catch(o){c=!0,l=o}finally{try{i||null==n["return"]||n["return"]()}finally{if(c)throw l}}return r}}function u(e){if(Array.isArray(e))return e}var f=function(e){var t=e.children,n=Object(a["useRef"])(),r=Object(a["useState"])(!1),o=c(r,2),d=o[0],s=o[1],m=Object(a["useState"])(!1),u=c(m,2),f=u[0],E=u[1];return Object(a["useEffect"])((function(){var e=n.current,t=i()((function(){s(e.scrollLeft>0),E(e.scrollLeft<e.scrollWidth-e.offsetWidth)}),100);return t(),e.addEventListener("scroll",t),window.addEventListener("resize",t),function(){e.removeEventListener("scroll",t),window.removeEventListener("resize",t)}}),[]),l.a.createElement("div",{className:"__dumi-default-table"},l.a.createElement("div",{className:"__dumi-default-table-content",ref:n,"data-left-folded":d||void 0,"data-right-folded":f||void 0},l.a.createElement("table",null,t)))};t["a"]=f}}]);