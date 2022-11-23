(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[69],{"3ddU":function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),l=a.n(n),r=a("dEAq"),i=a("dMo/"),c=l.a.memo((e=>{e.demos;return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"markdown"},l.a.createElement("h1",{id:"update-repository-interfaces-data"},l.a.createElement(r["AnchorLink"],{to:"#update-repository-interfaces-data","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Update repository interfaces data"),l.a.createElement("h3",{id:"api"},l.a.createElement(r["AnchorLink"],{to:"#api","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"API"),l.a.createElement(i["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{align:"left"},"Method"),l.a.createElement("th",{align:"left"},"Endpoint"),l.a.createElement("th",{align:"left"},"Description"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"POST"),l.a.createElement("td",{align:"left"},"/openAPI/repository/import"),l.a.createElement("td",{align:"left"},"Import repository data")))),l.a.createElement("h3",{id:"headers"},l.a.createElement(r["AnchorLink"],{to:"#headers","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Headers"),l.a.createElement(i["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{align:"left"},"Name"),l.a.createElement("th",{align:"left"},"Required"),l.a.createElement("th",{align:"left"},"Type"),l.a.createElement("th",{align:"left"},"Default"),l.a.createElement("th",{align:"left"},"Description"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"accessToken"),l.a.createElement("td",{align:"left"},"true"),l.a.createElement("td",{align:"left"},"String"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"OpenAPI access token")))),l.a.createElement("h3",{id:"request"},l.a.createElement(r["AnchorLink"],{to:"#request","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Request"),l.a.createElement(i["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{align:"left"},"Name"),l.a.createElement("th",{align:"left"},"Required"),l.a.createElement("th",{align:"left"},"Type"),l.a.createElement("th",{align:"left"},"Default"),l.a.createElement("th",{align:"left"},"Description"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"repositoryId"),l.a.createElement("td",{align:"left"},"true"),l.a.createElement("td",{align:"left"},"Number"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"Compatible with number and string type, the target repository id")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"mode"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"String"),l.a.createElement("td",{align:"left"},"add"),l.a.createElement("td",{align:"left"},"add: always create new interfaces; cover: cover the same interface; clean: clean the same interface(not supported now)")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"dataType"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"String"),l.a.createElement("td",{align:"left"},"Swagger"),l.a.createElement("td",{align:"left"},"RAP\u3001Swagger\u3001YAPI\u3001PB (Only support swagger now)")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"async"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"Boolean"),l.a.createElement("td",{align:"left"},"true"),l.a.createElement("td",{align:"left"},"true: asynchronous import, import process prompt, import completion message notification; false: synchronous import")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"data"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"Object"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"The initial import data, such as swagger.json content")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"versionName"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"String"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"The repository version name, If the version name exists, this version will be updated; if the version name does not exist, a new version will be created; if not passed, the main version will be updated by default.")))),l.a.createElement("h3",{id:"response"},l.a.createElement(r["AnchorLink"],{to:"#response","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Response"),l.a.createElement(i["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",{align:"left"},"Name"),l.a.createElement("th",{align:"left"},"Required"),l.a.createElement("th",{align:"left"},"Type"),l.a.createElement("th",{align:"left"},"Default"),l.a.createElement("th",{align:"left"},"Description"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"code"),l.a.createElement("td",{align:"left"},"true"),l.a.createElement("td",{align:"left"},"Number"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"if success the code is 200, others is error")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"message"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"String"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"the notice messages")),l.a.createElement("tr",null,l.a.createElement("td",{align:"left"},"data"),l.a.createElement("td",{align:"left"},"false"),l.a.createElement("td",{align:"left"},"Null"),l.a.createElement("td",{align:"left"},"-"),l.a.createElement("td",{align:"left"},"result data"))))))}));t["default"]=e=>{var t=l.a.useContext(r["context"]),a=t.demos;return l.a.useEffect((()=>{var t;null!==e&&void 0!==e&&null!==(t=e.location)&&void 0!==t&&t.hash&&r["AnchorLink"].scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),l.a.createElement(c,{demos:a})}},WpQk:function(e,t,a){},"dMo/":function(e,t,a){"use strict";var n=a("q1tI"),l=a.n(n),r=a("hKI/"),i=a.n(r);a("WpQk");function c(e,t){return f(e)||s(e,t)||m(e,t)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function m(e,t){if(e){if("string"===typeof e)return d(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?d(e,t):void 0}}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}function s(e,t){var a=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=a){var n,l,r=[],i=!0,c=!1;try{for(a=a.call(e);!(i=(n=a.next()).done);i=!0)if(r.push(n.value),t&&r.length===t)break}catch(o){c=!0,l=o}finally{try{i||null==a["return"]||a["return"]()}finally{if(c)throw l}}return r}}function f(e){if(Array.isArray(e))return e}var E=function(e){var t=e.children,a=Object(n["useRef"])(),r=Object(n["useState"])(!1),o=c(r,2),m=o[0],d=o[1],s=Object(n["useState"])(!1),f=c(s,2),E=f[0],u=f[1];return Object(n["useEffect"])((function(){var e=a.current,t=i()((function(){d(e.scrollLeft>0),u(e.scrollLeft<e.scrollWidth-e.offsetWidth)}),100);return t(),e.addEventListener("scroll",t),window.addEventListener("resize",t),function(){e.removeEventListener("scroll",t),window.removeEventListener("resize",t)}}),[]),l.a.createElement("div",{className:"__dumi-default-table"},l.a.createElement("div",{className:"__dumi-default-table-content",ref:a,"data-left-folded":m||void 0,"data-right-folded":E||void 0},l.a.createElement("table",null,t)))};t["a"]=E}}]);