/*!
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
window.CKEditor5=window.CKEditor5||{},window.CKEditor5.basicStyles=function(e){var t={};function i(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)i.d(n,s,function(t){return e[t]}.bind(null,s));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=7)}([function(e,t,i){e.exports=i(3)("./src/core.js")},function(e,t,i){e.exports=i(3)("./src/ui.js")},function(e,t,i){e.exports=i(3)("./src/typing.js")},function(e,t){e.exports=CKEditor5.dll},function(e,t,i){var n=i(5),s=i(6);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};n(s,r);e.exports=s.locals||{}},function(e,t,i){"use strict";var n,s=function(){return void 0===n&&(n=Boolean(window&&document&&document.all&&!window.atob)),n},r=function(){var e={};return function(t){if(void 0===e[t]){var i=document.querySelector(t);if(window.HTMLIFrameElement&&i instanceof window.HTMLIFrameElement)try{i=i.contentDocument.head}catch(e){i=null}e[t]=i}return e[t]}}(),o=[];function c(e){for(var t=-1,i=0;i<o.length;i++)if(o[i].identifier===e){t=i;break}return t}function a(e,t){for(var i={},n=[],s=0;s<e.length;s++){var r=e[s],a=t.base?r[0]+t.base:r[0],l=i[a]||0,u="".concat(a," ").concat(l);i[a]=l+1;var d=c(u),g={css:r[1],media:r[2],sourceMap:r[3]};-1!==d?(o[d].references++,o[d].updater(g)):o.push({identifier:u,updater:b(g,t),references:1}),n.push(u)}return n}function l(e){var t=document.createElement("style"),n=e.attributes||{};if(void 0===n.nonce){var s=i.nc;s&&(n.nonce=s)}if(Object.keys(n).forEach((function(e){t.setAttribute(e,n[e])})),"function"==typeof e.insert)e.insert(t);else{var o=r(e.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(t)}return t}var u,d=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function g(e,t,i,n){var s=i?"":n.media?"@media ".concat(n.media," {").concat(n.css,"}"):n.css;if(e.styleSheet)e.styleSheet.cssText=d(t,s);else{var r=document.createTextNode(s),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(r,o[t]):e.appendChild(r)}}function p(e,t,i){var n=i.css,s=i.media,r=i.sourceMap;if(s?e.setAttribute("media",s):e.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var m=null,h=0;function b(e,t){var i,n,s;if(t.singleton){var r=h++;i=m||(m=l(t)),n=g.bind(null,i,r,!1),s=g.bind(null,i,r,!0)}else i=l(t),n=p.bind(null,i,t),s=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(i)};return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else s()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=s());var i=a(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var n=0;n<i.length;n++){var s=c(i[n]);o[s].references--}for(var r=a(e,t),l=0;l<i.length;l++){var u=c(i[l]);0===o[u].references&&(o[u].updater(),o.splice(u,1))}i=r}}}},function(e,t){e.exports=".ck-content code{background-color:hsla(0,0%,78%,.3);padding:.15em;border-radius:2px}.ck.ck-editor__editable .ck-code_selected{background-color:hsla(0,0%,78%,.5)}"},function(e,t,i){"use strict";i.r(t);var n=i(0);class s extends n.Command{constructor(e,t){super(e),this.attributeKey=t}refresh(){const e=this.editor.model,t=e.document;this.value=this._getValueFromFirstAllowedNode(),this.isEnabled=e.schema.checkAttributeInSelection(t.selection,this.attributeKey)}execute(e={}){const t=this.editor.model,i=t.document.selection,n=void 0===e.forceValue?!this.value:e.forceValue;t.change(e=>{if(i.isCollapsed)n?e.setSelectionAttribute(this.attributeKey,!0):e.removeSelectionAttribute(this.attributeKey);else{const s=t.schema.getValidRanges(i.getRanges(),this.attributeKey);for(const t of s)n?e.setAttribute(this.attributeKey,n,t):e.removeAttribute(this.attributeKey,t)}})}_getValueFromFirstAllowedNode(){const e=this.editor.model,t=e.schema,i=e.document.selection;if(i.isCollapsed)return i.hasAttribute(this.attributeKey);for(const e of i.getRanges())for(const i of e.getItems())if(t.checkAttribute(i,this.attributeKey))return i.hasAttribute(this.attributeKey);return!1}}class r extends n.Plugin{static get pluginName(){return"BoldEditing"}init(){const e=this.editor;e.model.schema.extend("$text",{allowAttributes:"bold"}),e.model.schema.setAttributeProperties("bold",{isFormatting:!0,copyOnEnter:!0}),e.conversion.attributeToElement({model:"bold",view:"strong",upcastAlso:["b",e=>{const t=e.getStyle("font-weight");return t?"bold"==t||Number(t)>=600?{name:!0,styles:["font-weight"]}:void 0:null}]}),e.commands.add("bold",new s(e,"bold")),e.keystrokes.set("CTRL+B","bold")}}var o=i(1);class c extends n.Plugin{static get pluginName(){return"BoldUI"}init(){const e=this.editor,t=e.t;e.ui.componentFactory.add("bold",i=>{const n=e.commands.get("bold"),s=new o.ButtonView(i);return s.set({label:t("Bold"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.187 17H5.773c-.637 0-1.092-.138-1.364-.415-.273-.277-.409-.718-.409-1.323V4.738c0-.617.14-1.062.419-1.332.279-.27.73-.406 1.354-.406h4.68c.69 0 1.288.041 1.793.124.506.083.96.242 1.36.478.341.197.644.447.906.75a3.262 3.262 0 0 1 .808 2.162c0 1.401-.722 2.426-2.167 3.075C15.05 10.175 16 11.315 16 13.01a3.756 3.756 0 0 1-2.296 3.504 6.1 6.1 0 0 1-1.517.377c-.571.073-1.238.11-2 .11zm-.217-6.217H7v4.087h3.069c1.977 0 2.965-.69 2.965-2.072 0-.707-.256-1.22-.768-1.537-.512-.319-1.277-.478-2.296-.478zM7 5.13v3.619h2.606c.729 0 1.292-.067 1.69-.2a1.6 1.6 0 0 0 .91-.765c.165-.267.247-.566.247-.897 0-.707-.26-1.176-.778-1.409-.519-.232-1.31-.348-2.375-.348H7z"/></svg>',keystroke:"CTRL+B",tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(s,"execute",()=>{e.execute("bold"),e.editing.view.focus()}),s})}}class a extends n.Plugin{static get requires(){return[r,c]}static get pluginName(){return"Bold"}}var l=i(2);const u="code";class d extends n.Plugin{static get pluginName(){return"CodeEditing"}static get requires(){return[l.TwoStepCaretMovement]}init(){const e=this.editor;e.model.schema.extend("$text",{allowAttributes:u}),e.model.schema.setAttributeProperties(u,{isFormatting:!0,copyOnEnter:!1}),e.conversion.attributeToElement({model:u,view:"code",upcastAlso:{styles:{"word-wrap":"break-word"}}}),e.commands.add(u,new s(e,u)),e.plugins.get(l.TwoStepCaretMovement).registerAttribute(u),Object(l.inlineHighlight)(e,u,"code","ck-code_selected")}}i(4);class g extends n.Plugin{static get pluginName(){return"CodeUI"}init(){const e=this.editor,t=e.t;e.ui.componentFactory.add("code",i=>{const n=e.commands.get("code"),s=new o.ButtonView(i);return s.set({label:t("Code"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5.7l5.2 3.9v1.3l-5.6 4c-.1.2-.3.2-.5.2-.3-.1-.6-.7-.6-1l.3-.4 4.7-3.5L11.5 7l-.2-.2c-.1-.3-.1-.6 0-.8.2-.2.5-.4.8-.4a.8.8 0 0 1 .4.1zm-5.2 0L2 9.6v1.3l5.6 4c.1.2.3.2.5.2.3-.1.7-.7.6-1 0-.1 0-.3-.2-.4l-5-3.5L8.2 7l.2-.2c.1-.3.1-.6 0-.8-.2-.2-.5-.4-.8-.4a.8.8 0 0 0-.3.1z"/></svg>',tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(s,"execute",()=>{e.execute("code"),e.editing.view.focus()}),s})}}class p extends n.Plugin{static get requires(){return[d,g]}static get pluginName(){return"Code"}}class m extends n.Plugin{static get pluginName(){return"ItalicEditing"}init(){const e=this.editor;e.model.schema.extend("$text",{allowAttributes:"italic"}),e.model.schema.setAttributeProperties("italic",{isFormatting:!0,copyOnEnter:!0}),e.conversion.attributeToElement({model:"italic",view:"i",upcastAlso:["em",{styles:{"font-style":"italic"}}]}),e.commands.add("italic",new s(e,"italic")),e.keystrokes.set("CTRL+I","italic")}}class h extends n.Plugin{static get pluginName(){return"ItalicUI"}init(){const e=this.editor,t=e.t;e.ui.componentFactory.add("italic",i=>{const n=e.commands.get("italic"),s=new o.ButtonView(i);return s.set({label:t("Italic"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.586 14.633l.021.004c-.036.335.095.655.393.962.082.083.173.15.274.201h1.474a.6.6 0 1 1 0 1.2H5.304a.6.6 0 0 1 0-1.2h1.15c.474-.07.809-.182 1.005-.334.157-.122.291-.32.404-.597l2.416-9.55a1.053 1.053 0 0 0-.281-.823 1.12 1.12 0 0 0-.442-.296H8.15a.6.6 0 0 1 0-1.2h6.443a.6.6 0 1 1 0 1.2h-1.195c-.376.056-.65.155-.823.296-.215.175-.423.439-.623.79l-2.366 9.347z"/></svg>',keystroke:"CTRL+I",tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(s,"execute",()=>{e.execute("italic"),e.editing.view.focus()}),s})}}class b extends n.Plugin{static get requires(){return[m,h]}static get pluginName(){return"Italic"}}class v extends n.Plugin{static get pluginName(){return"StrikethroughEditing"}init(){const e=this.editor;e.model.schema.extend("$text",{allowAttributes:"strikethrough"}),e.model.schema.setAttributeProperties("strikethrough",{isFormatting:!0,copyOnEnter:!0}),e.conversion.attributeToElement({model:"strikethrough",view:"s",upcastAlso:["del","strike",{styles:{"text-decoration":"line-through"}}]}),e.commands.add("strikethrough",new s(e,"strikethrough")),e.keystrokes.set("CTRL+SHIFT+X","strikethrough")}}class f extends n.Plugin{static get pluginName(){return"StrikethroughUI"}init(){const e=this.editor,t=e.t;e.ui.componentFactory.add("strikethrough",i=>{const n=e.commands.get("strikethrough"),s=new o.ButtonView(i);return s.set({label:t("Strikethrough"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 16.4c-.8-.4-1.5-.9-2.2-1.5a.6.6 0 0 1-.2-.5l.3-.6h1c1 1.2 2.1 1.7 3.7 1.7 1 0 1.8-.3 2.3-.6.6-.4.6-1.2.6-1.3.2-1.2-.9-2.1-.9-2.1h2.1c.3.7.4 1.2.4 1.7v.8l-.6 1.2c-.6.8-1.1 1-1.6 1.2a6 6 0 0 1-2.4.6c-1 0-1.8-.3-2.5-.6zM6.8 9L6 8.3c-.4-.5-.5-.8-.5-1.6 0-.7.1-1.3.5-1.8.4-.6 1-1 1.6-1.3a6.3 6.3 0 0 1 4.7 0 4 4 0 0 1 1.7 1l.3.7c0 .1.2.4-.2.7-.4.2-.9.1-1 0a3 3 0 0 0-1.2-1c-.4-.2-1-.3-2-.4-.7 0-1.4.2-2 .6-.8.6-1 .8-1 1.5 0 .8.5 1 1.2 1.5.6.4 1.1.7 1.9 1H6.8z"/><path d="M3 10.5V9h14v1.5z"/></svg>',keystroke:"CTRL+SHIFT+X",tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(s,"execute",()=>{e.execute("strikethrough"),e.editing.view.focus()}),s})}}class w extends n.Plugin{static get requires(){return[v,f]}static get pluginName(){return"Strikethrough"}}class x extends n.Plugin{static get pluginName(){return"SubscriptEditing"}init(){const e=this.editor;e.model.schema.extend("$text",{allowAttributes:"subscript"}),e.model.schema.setAttributeProperties("subscript",{isFormatting:!0,copyOnEnter:!0}),e.conversion.attributeToElement({model:"subscript",view:"sub",upcastAlso:[{styles:{"vertical-align":"sub"}}]}),e.commands.add("subscript",new s(e,"subscript"))}}class y extends n.Plugin{static get pluginName(){return"SubscriptUI"}init(){const e=this.editor,t=e.t;e.ui.componentFactory.add("subscript",i=>{const n=e.commands.get("subscript"),s=new o.ButtonView(i);return s.set({label:t("Subscript"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.03 10.349l3.818-3.819a.8.8 0 1 1 1.132 1.132L8.16 11.48l3.819 3.818a.8.8 0 1 1-1.132 1.132L7.03 12.61l-3.818 3.82a.8.8 0 1 1-1.132-1.132L5.9 11.48 2.08 7.662A.8.8 0 1 1 3.212 6.53l3.818 3.82zm8.147 7.829h2.549c.254 0 .447.05.58.152a.49.49 0 0 1 .201.413.54.54 0 0 1-.159.393c-.105.108-.266.162-.48.162h-3.594c-.245 0-.435-.066-.572-.197a.621.621 0 0 1-.205-.463c0-.114.044-.265.132-.453a1.62 1.62 0 0 1 .288-.444c.433-.436.824-.81 1.172-1.122.348-.312.597-.517.747-.615.267-.183.49-.368.667-.553.177-.185.312-.375.405-.57.093-.194.139-.384.139-.57a1.008 1.008 0 0 0-.554-.917 1.197 1.197 0 0 0-.56-.133c-.426 0-.761.182-1.005.546a2.332 2.332 0 0 0-.164.39 1.609 1.609 0 0 1-.258.488c-.096.114-.237.17-.423.17a.558.558 0 0 1-.405-.156.568.568 0 0 1-.161-.427c0-.218.05-.446.151-.683.101-.238.252-.453.452-.646s.454-.349.762-.467a2.998 2.998 0 0 1 1.081-.178c.498 0 .923.076 1.274.228a1.916 1.916 0 0 1 1.004 1.032 1.984 1.984 0 0 1-.156 1.794c-.2.32-.405.572-.613.754-.208.182-.558.468-1.048.857-.49.39-.826.691-1.008.906a2.703 2.703 0 0 0-.24.309z"/></svg>',tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(s,"execute",()=>{e.execute("subscript"),e.editing.view.focus()}),s})}}class E extends n.Plugin{static get requires(){return[x,y]}static get pluginName(){return"Subscript"}}class k extends n.Plugin{static get pluginName(){return"SuperscriptEditing"}init(){const e=this.editor;e.model.schema.extend("$text",{allowAttributes:"superscript"}),e.model.schema.setAttributeProperties("superscript",{isFormatting:!0,copyOnEnter:!0}),e.conversion.attributeToElement({model:"superscript",view:"sup",upcastAlso:[{styles:{"vertical-align":"super"}}]}),e.commands.add("superscript",new s(e,"superscript"))}}class T extends n.Plugin{static get pluginName(){return"SuperscriptUI"}init(){const e=this.editor,t=e.t;e.ui.componentFactory.add("superscript",i=>{const n=e.commands.get("superscript"),s=new o.ButtonView(i);return s.set({label:t("Superscript"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.677 8.678h2.549c.254 0 .447.05.58.152a.49.49 0 0 1 .201.413.54.54 0 0 1-.159.393c-.105.108-.266.162-.48.162h-3.594c-.245 0-.435-.066-.572-.197a.621.621 0 0 1-.205-.463c0-.114.044-.265.132-.453a1.62 1.62 0 0 1 .288-.444c.433-.436.824-.81 1.172-1.122.348-.312.597-.517.747-.615.267-.183.49-.368.667-.553.177-.185.312-.375.405-.57.093-.194.139-.384.139-.57a1.008 1.008 0 0 0-.554-.917 1.197 1.197 0 0 0-.56-.133c-.426 0-.761.182-1.005.546a2.332 2.332 0 0 0-.164.39 1.609 1.609 0 0 1-.258.488c-.096.114-.237.17-.423.17a.558.558 0 0 1-.405-.156.568.568 0 0 1-.161-.427c0-.218.05-.446.151-.683.101-.238.252-.453.452-.646s.454-.349.762-.467a2.998 2.998 0 0 1 1.081-.178c.498 0 .923.076 1.274.228a1.916 1.916 0 0 1 1.004 1.032 1.984 1.984 0 0 1-.156 1.794c-.2.32-.405.572-.613.754-.208.182-.558.468-1.048.857-.49.39-.826.691-1.008.906a2.703 2.703 0 0 0-.24.309zM7.03 10.349l3.818-3.819a.8.8 0 1 1 1.132 1.132L8.16 11.48l3.819 3.818a.8.8 0 1 1-1.132 1.132L7.03 12.61l-3.818 3.82a.8.8 0 1 1-1.132-1.132L5.9 11.48 2.08 7.662A.8.8 0 1 1 3.212 6.53l3.818 3.82z"/></svg>',tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(s,"execute",()=>{e.execute("superscript"),e.editing.view.focus()}),s})}}class S extends n.Plugin{static get requires(){return[k,T]}static get pluginName(){return"Superscript"}}class A extends n.Plugin{static get pluginName(){return"UnderlineEditing"}init(){const e=this.editor;e.model.schema.extend("$text",{allowAttributes:"underline"}),e.model.schema.setAttributeProperties("underline",{isFormatting:!0,copyOnEnter:!0}),e.conversion.attributeToElement({model:"underline",view:"u",upcastAlso:{styles:{"text-decoration":"underline"}}}),e.commands.add("underline",new s(e,"underline")),e.keystrokes.set("CTRL+U","underline")}}class C extends n.Plugin{static get pluginName(){return"UnderlineUI"}init(){const e=this.editor,t=e.t;e.ui.componentFactory.add("underline",i=>{const n=e.commands.get("underline"),s=new o.ButtonView(i);return s.set({label:t("Underline"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 18v-1.5h14V18zm2.2-8V3.6c0-.4.4-.6.8-.6.3 0 .7.2.7.6v6.2c0 2 1.3 2.8 3.2 2.8 1.9 0 3.4-.9 3.4-2.9V3.6c0-.3.4-.5.8-.5.3 0 .7.2.7.5V10c0 2.7-2.2 4-4.9 4-2.6 0-4.7-1.2-4.7-4z"/></svg>',keystroke:"CTRL+U",tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(s,"execute",()=>{e.execute("underline"),e.editing.view.focus()}),s})}}class P extends n.Plugin{static get requires(){return[A,C]}static get pluginName(){return"Underline"}}t.default={Bold:a,BoldEditing:r,BoldUI:c,Code:p,CodeEditing:d,CodeUI:g,Italic:b,ItalicEditing:m,ItalicUI:h,Strikethrough:w,StrikethroughEditing:v,StrikethroughUI:f,Subscript:E,SubscriptEditing:x,SubscriptUI:y,Superscript:S,SuperscriptEditing:k,SuperscriptUI:T,Underline:P,UnderlineEditing:A,UnderlineUI:C}}]).default;