var e=globalThis,r={},t={},s=e.parcelRequire7715;null==s&&((s=function(e){if(e in r)return r[e].exports;if(e in t){var s=t[e];delete t[e];var i={id:e,exports:{}};return r[e]=i,s.call(i.exports,i,i.exports),i.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,r){t[e]=r},e.parcelRequire7715=s),(0,s.register)("6bFjC",function(e,r){Object.defineProperty(e.exports,"default",{get:()=>t,set:void 0,enumerable:!0,configurable:!0});class t{get isEmpty(){return 0===this.errors.size}set(e,r,t,s){this.errors.add(e),r.classList.add("input-error"),t.classList.remove("hidden"),t.innerHTML=s}unset(e,r,t){this.errors.delete(e),r.classList.remove("input-error"),t.classList.add("hidden"),t.innerHTML=""}constructor(){this.errors=new Set}}}),s("6bFjC");
//# sourceMappingURL=errors.js.map
