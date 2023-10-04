"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@zag-js";
exports.ids = ["vendor-chunks/@zag-js"];
exports.modules = {

/***/ "(ssr)/./node_modules/@zag-js/dom-query/dist/index.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/@zag-js/dom-query/dist/index.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MAX_Z_INDEX: () => (/* binding */ MAX_Z_INDEX),\n/* harmony export */   ariaAttr: () => (/* binding */ ariaAttr),\n/* harmony export */   contains: () => (/* binding */ contains),\n/* harmony export */   createScope: () => (/* binding */ createScope),\n/* harmony export */   dataAttr: () => (/* binding */ dataAttr),\n/* harmony export */   getActiveElement: () => (/* binding */ getActiveElement),\n/* harmony export */   getByText: () => (/* binding */ getByText),\n/* harmony export */   getByTypeahead: () => (/* binding */ getByTypeahead),\n/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),\n/* harmony export */   getDocument: () => (/* binding */ getDocument2),\n/* harmony export */   getEventTarget: () => (/* binding */ getEventTarget),\n/* harmony export */   getParent: () => (/* binding */ getParent),\n/* harmony export */   getPlatform: () => (/* binding */ getPlatform),\n/* harmony export */   getScrollParent: () => (/* binding */ getScrollParent),\n/* harmony export */   getScrollParents: () => (/* binding */ getScrollParents),\n/* harmony export */   getWindow: () => (/* binding */ getWindow),\n/* harmony export */   indexOfId: () => (/* binding */ indexOfId),\n/* harmony export */   isApple: () => (/* binding */ isApple),\n/* harmony export */   isDom: () => (/* binding */ isDom),\n/* harmony export */   isEditableElement: () => (/* binding */ isEditableElement),\n/* harmony export */   isFirefox: () => (/* binding */ isFirefox),\n/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),\n/* harmony export */   isIPhone: () => (/* binding */ isIPhone),\n/* harmony export */   isIos: () => (/* binding */ isIos),\n/* harmony export */   isMac: () => (/* binding */ isMac),\n/* harmony export */   isSafari: () => (/* binding */ isSafari),\n/* harmony export */   isSelfEvent: () => (/* binding */ isSelfEvent),\n/* harmony export */   isTouchDevice: () => (/* binding */ isTouchDevice),\n/* harmony export */   itemById: () => (/* binding */ itemById),\n/* harmony export */   nextById: () => (/* binding */ nextById),\n/* harmony export */   nextTick: () => (/* binding */ nextTick),\n/* harmony export */   prevById: () => (/* binding */ prevById),\n/* harmony export */   query: () => (/* binding */ query),\n/* harmony export */   queryAll: () => (/* binding */ queryAll),\n/* harmony export */   raf: () => (/* binding */ raf)\n/* harmony export */ });\n// src/attrs.ts\nvar dataAttr = (guard) => {\n  return guard ? \"\" : void 0;\n};\nvar ariaAttr = (guard) => {\n  return guard ? \"true\" : void 0;\n};\n\n// src/is-html-element.ts\nfunction isHTMLElement(value) {\n  return typeof value === \"object\" && value?.nodeType === Node.ELEMENT_NODE && typeof value?.nodeName === \"string\";\n}\n\n// src/contains.ts\nfunction contains(parent, child) {\n  if (!parent || !child)\n    return false;\n  if (!isHTMLElement(parent) || !isHTMLElement(child))\n    return false;\n  return parent === child || parent.contains(child);\n}\nvar isSelfEvent = (event) => contains(event.currentTarget, event.target);\n\n// src/create-scope.ts\nvar getDocument = (node) => {\n  if (node.nodeType === Node.DOCUMENT_NODE)\n    return node;\n  return node.ownerDocument ?? document;\n};\nfunction createScope(methods) {\n  const screen = {\n    getRootNode: (ctx) => ctx.getRootNode?.() ?? document,\n    getDoc: (ctx) => getDocument(screen.getRootNode(ctx)),\n    getWin: (ctx) => screen.getDoc(ctx).defaultView ?? window,\n    getActiveElement: (ctx) => screen.getDoc(ctx).activeElement,\n    getById: (ctx, id) => screen.getRootNode(ctx).getElementById(id)\n  };\n  return { ...screen, ...methods };\n}\n\n// src/env.ts\nvar isDocument = (el) => el.nodeType === Node.DOCUMENT_NODE;\nfunction getDocument2(el) {\n  if (isDocument(el))\n    return el;\n  return el?.ownerDocument ?? document;\n}\nfunction getWindow(el) {\n  return el?.ownerDocument.defaultView ?? window;\n}\n\n// src/get-active-element.ts\nfunction getActiveElement(el) {\n  let activeElement = el.ownerDocument.activeElement;\n  while (activeElement?.shadowRoot) {\n    const el2 = activeElement.shadowRoot.activeElement;\n    if (el2 === activeElement)\n      break;\n    else\n      activeElement = el2;\n  }\n  return activeElement;\n}\n\n// src/get-by-id.ts\nfunction itemById(v, id) {\n  return v.find((node) => node.id === id);\n}\nfunction indexOfId(v, id) {\n  const item = itemById(v, id);\n  return item ? v.indexOf(item) : -1;\n}\nfunction nextById(v, id, loop = true) {\n  let idx = indexOfId(v, id);\n  idx = loop ? (idx + 1) % v.length : Math.min(idx + 1, v.length - 1);\n  return v[idx];\n}\nfunction prevById(v, id, loop = true) {\n  let idx = indexOfId(v, id);\n  if (idx === -1)\n    return loop ? v[v.length - 1] : null;\n  idx = loop ? (idx - 1 + v.length) % v.length : Math.max(0, idx - 1);\n  return v[idx];\n}\n\n// src/get-by-text.ts\nvar getValueText = (item) => item.dataset.valuetext ?? item.textContent ?? \"\";\nvar match = (valueText, query2) => valueText.toLowerCase().startsWith(query2.toLowerCase());\nvar wrap = (v, idx) => {\n  return v.map((_, index) => v[(Math.max(idx, 0) + index) % v.length]);\n};\nfunction getByText(v, text, currentId) {\n  const index = currentId ? indexOfId(v, currentId) : -1;\n  let items = currentId ? wrap(v, index) : v;\n  const isSingleKey = text.length === 1;\n  if (isSingleKey) {\n    items = items.filter((item) => item.id !== currentId);\n  }\n  return items.find((item) => match(getValueText(item), text));\n}\n\n// src/get-by-typeahead.ts\nfunction getByTypeaheadImpl(_items, options) {\n  const { state, activeId, key, timeout = 350 } = options;\n  const search = state.keysSoFar + key;\n  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);\n  const query2 = isRepeated ? search[0] : search;\n  let items = _items.slice();\n  const next = getByText(items, query2, activeId);\n  function cleanup() {\n    clearTimeout(state.timer);\n    state.timer = -1;\n  }\n  function update(value) {\n    state.keysSoFar = value;\n    cleanup();\n    if (value !== \"\") {\n      state.timer = +setTimeout(() => {\n        update(\"\");\n        cleanup();\n      }, timeout);\n    }\n  }\n  update(search);\n  return next;\n}\nvar getByTypeahead = /* @__PURE__ */ Object.assign(getByTypeaheadImpl, {\n  defaultOptions: { keysSoFar: \"\", timer: -1 },\n  isValidEvent: isValidTypeaheadEvent\n});\nfunction isValidTypeaheadEvent(event) {\n  return event.key.length === 1 && !event.ctrlKey && !event.metaKey;\n}\n\n// src/get-computed-style.ts\nvar styleCache = /* @__PURE__ */ new WeakMap();\nfunction getComputedStyle(el) {\n  if (!styleCache.has(el)) {\n    const win = el.ownerDocument.defaultView || window;\n    styleCache.set(el, win.getComputedStyle(el));\n  }\n  return styleCache.get(el);\n}\n\n// src/get-event-target.ts\nfunction getEventTarget(event) {\n  return event.composedPath?.()[0] ?? event.target;\n}\n\n// src/get-scroll-parent.ts\nfunction isScrollParent(el) {\n  const win = el.ownerDocument.defaultView || window;\n  const { overflow, overflowX, overflowY } = win.getComputedStyle(el);\n  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);\n}\nfunction getParent(el) {\n  if (el.localName === \"html\")\n    return el;\n  return el.assignedSlot || el.parentElement || el.ownerDocument.documentElement;\n}\nfunction getScrollParent(el) {\n  if ([\"html\", \"body\", \"#document\"].includes(el.localName)) {\n    return el.ownerDocument.body;\n  }\n  if (isHTMLElement(el) && isScrollParent(el)) {\n    return el;\n  }\n  return getScrollParent(getParent(el));\n}\nfunction getScrollParents(el, list = []) {\n  const parent = getScrollParent(el);\n  const isBody = parent === el.ownerDocument.body;\n  const win = parent.ownerDocument.defaultView || window;\n  const target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(parent) ? parent : []) : parent;\n  const parents = list.concat(target);\n  return isBody ? parents : parents.concat(getScrollParents(getParent(target)));\n}\n\n// src/is-editable-element.ts\nfunction isEditableElement(el) {\n  if (el == null || !isHTMLElement(el)) {\n    return false;\n  }\n  try {\n    const win = el.ownerDocument.defaultView || window;\n    return el instanceof win.HTMLInputElement && el.selectionStart != null || /(textarea|select)/.test(el.localName) || el.isContentEditable;\n  } catch {\n    return false;\n  }\n}\n\n// src/platform.ts\nvar isDom = () => typeof document !== \"undefined\";\nfunction getPlatform() {\n  const agent = navigator.userAgentData;\n  return agent?.platform ?? navigator.platform;\n}\nvar pt = (v) => isDom() && v.test(getPlatform());\nvar ua = (v) => isDom() && v.test(navigator.userAgent);\nvar vn = (v) => isDom() && v.test(navigator.vendor);\nvar isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;\nvar isMac = () => pt(/^Mac/) && !isTouchDevice();\nvar isIPhone = () => pt(/^iPhone/);\nvar isSafari = () => isApple() && vn(/apple/i);\nvar isFirefox = () => ua(/firefox\\//i);\nvar isApple = () => pt(/mac|iphone|ipad|ipod/i);\nvar isIos = () => isApple() && !isMac();\n\n// src/query.ts\nfunction queryAll(root, selector) {\n  return Array.from(root?.querySelectorAll(selector) ?? []);\n}\nfunction query(root, selector) {\n  return root?.querySelector(selector);\n}\n\n// src/raf.ts\nfunction nextTick(fn) {\n  const set = /* @__PURE__ */ new Set();\n  function raf2(fn2) {\n    const id = globalThis.requestAnimationFrame(fn2);\n    set.add(() => globalThis.cancelAnimationFrame(id));\n  }\n  raf2(() => raf2(fn));\n  return function cleanup() {\n    set.forEach((fn2) => fn2());\n  };\n}\nfunction raf(fn) {\n  const id = globalThis.requestAnimationFrame(fn);\n  return () => {\n    globalThis.cancelAnimationFrame(id);\n  };\n}\n\n// src/index.ts\nvar MAX_Z_INDEX = 2147483647;\n\n//# sourceMappingURL=index.mjs.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvQHphZy1qcy9kb20tcXVlcnkvZGlzdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVUsc0NBQXNDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiwwQkFBMEI7QUFDOUM7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLGlDQUFpQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFxQ0U7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbmxuY2c0Ly4vbm9kZV9tb2R1bGVzL0B6YWctanMvZG9tLXF1ZXJ5L2Rpc3QvaW5kZXgubWpzP2U1OTQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2F0dHJzLnRzXG52YXIgZGF0YUF0dHIgPSAoZ3VhcmQpID0+IHtcbiAgcmV0dXJuIGd1YXJkID8gXCJcIiA6IHZvaWQgMDtcbn07XG52YXIgYXJpYUF0dHIgPSAoZ3VhcmQpID0+IHtcbiAgcmV0dXJuIGd1YXJkID8gXCJ0cnVlXCIgOiB2b2lkIDA7XG59O1xuXG4vLyBzcmMvaXMtaHRtbC1lbGVtZW50LnRzXG5mdW5jdGlvbiBpc0hUTUxFbGVtZW50KHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWU/Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiB0eXBlb2YgdmFsdWU/Lm5vZGVOYW1lID09PSBcInN0cmluZ1wiO1xufVxuXG4vLyBzcmMvY29udGFpbnMudHNcbmZ1bmN0aW9uIGNvbnRhaW5zKHBhcmVudCwgY2hpbGQpIHtcbiAgaWYgKCFwYXJlbnQgfHwgIWNoaWxkKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKCFpc0hUTUxFbGVtZW50KHBhcmVudCkgfHwgIWlzSFRNTEVsZW1lbnQoY2hpbGQpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHBhcmVudCA9PT0gY2hpbGQgfHwgcGFyZW50LmNvbnRhaW5zKGNoaWxkKTtcbn1cbnZhciBpc1NlbGZFdmVudCA9IChldmVudCkgPT4gY29udGFpbnMoZXZlbnQuY3VycmVudFRhcmdldCwgZXZlbnQudGFyZ2V0KTtcblxuLy8gc3JjL2NyZWF0ZS1zY29wZS50c1xudmFyIGdldERvY3VtZW50ID0gKG5vZGUpID0+IHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSlcbiAgICByZXR1cm4gbm9kZTtcbiAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudCA/PyBkb2N1bWVudDtcbn07XG5mdW5jdGlvbiBjcmVhdGVTY29wZShtZXRob2RzKSB7XG4gIGNvbnN0IHNjcmVlbiA9IHtcbiAgICBnZXRSb290Tm9kZTogKGN0eCkgPT4gY3R4LmdldFJvb3ROb2RlPy4oKSA/PyBkb2N1bWVudCxcbiAgICBnZXREb2M6IChjdHgpID0+IGdldERvY3VtZW50KHNjcmVlbi5nZXRSb290Tm9kZShjdHgpKSxcbiAgICBnZXRXaW46IChjdHgpID0+IHNjcmVlbi5nZXREb2MoY3R4KS5kZWZhdWx0VmlldyA/PyB3aW5kb3csXG4gICAgZ2V0QWN0aXZlRWxlbWVudDogKGN0eCkgPT4gc2NyZWVuLmdldERvYyhjdHgpLmFjdGl2ZUVsZW1lbnQsXG4gICAgZ2V0QnlJZDogKGN0eCwgaWQpID0+IHNjcmVlbi5nZXRSb290Tm9kZShjdHgpLmdldEVsZW1lbnRCeUlkKGlkKVxuICB9O1xuICByZXR1cm4geyAuLi5zY3JlZW4sIC4uLm1ldGhvZHMgfTtcbn1cblxuLy8gc3JjL2Vudi50c1xudmFyIGlzRG9jdW1lbnQgPSAoZWwpID0+IGVsLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREU7XG5mdW5jdGlvbiBnZXREb2N1bWVudDIoZWwpIHtcbiAgaWYgKGlzRG9jdW1lbnQoZWwpKVxuICAgIHJldHVybiBlbDtcbiAgcmV0dXJuIGVsPy5vd25lckRvY3VtZW50ID8/IGRvY3VtZW50O1xufVxuZnVuY3Rpb24gZ2V0V2luZG93KGVsKSB7XG4gIHJldHVybiBlbD8ub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA/PyB3aW5kb3c7XG59XG5cbi8vIHNyYy9nZXQtYWN0aXZlLWVsZW1lbnQudHNcbmZ1bmN0aW9uIGdldEFjdGl2ZUVsZW1lbnQoZWwpIHtcbiAgbGV0IGFjdGl2ZUVsZW1lbnQgPSBlbC5vd25lckRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gIHdoaWxlIChhY3RpdmVFbGVtZW50Py5zaGFkb3dSb290KSB7XG4gICAgY29uc3QgZWwyID0gYWN0aXZlRWxlbWVudC5zaGFkb3dSb290LmFjdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGVsMiA9PT0gYWN0aXZlRWxlbWVudClcbiAgICAgIGJyZWFrO1xuICAgIGVsc2VcbiAgICAgIGFjdGl2ZUVsZW1lbnQgPSBlbDI7XG4gIH1cbiAgcmV0dXJuIGFjdGl2ZUVsZW1lbnQ7XG59XG5cbi8vIHNyYy9nZXQtYnktaWQudHNcbmZ1bmN0aW9uIGl0ZW1CeUlkKHYsIGlkKSB7XG4gIHJldHVybiB2LmZpbmQoKG5vZGUpID0+IG5vZGUuaWQgPT09IGlkKTtcbn1cbmZ1bmN0aW9uIGluZGV4T2ZJZCh2LCBpZCkge1xuICBjb25zdCBpdGVtID0gaXRlbUJ5SWQodiwgaWQpO1xuICByZXR1cm4gaXRlbSA/IHYuaW5kZXhPZihpdGVtKSA6IC0xO1xufVxuZnVuY3Rpb24gbmV4dEJ5SWQodiwgaWQsIGxvb3AgPSB0cnVlKSB7XG4gIGxldCBpZHggPSBpbmRleE9mSWQodiwgaWQpO1xuICBpZHggPSBsb29wID8gKGlkeCArIDEpICUgdi5sZW5ndGggOiBNYXRoLm1pbihpZHggKyAxLCB2Lmxlbmd0aCAtIDEpO1xuICByZXR1cm4gdltpZHhdO1xufVxuZnVuY3Rpb24gcHJldkJ5SWQodiwgaWQsIGxvb3AgPSB0cnVlKSB7XG4gIGxldCBpZHggPSBpbmRleE9mSWQodiwgaWQpO1xuICBpZiAoaWR4ID09PSAtMSlcbiAgICByZXR1cm4gbG9vcCA/IHZbdi5sZW5ndGggLSAxXSA6IG51bGw7XG4gIGlkeCA9IGxvb3AgPyAoaWR4IC0gMSArIHYubGVuZ3RoKSAlIHYubGVuZ3RoIDogTWF0aC5tYXgoMCwgaWR4IC0gMSk7XG4gIHJldHVybiB2W2lkeF07XG59XG5cbi8vIHNyYy9nZXQtYnktdGV4dC50c1xudmFyIGdldFZhbHVlVGV4dCA9IChpdGVtKSA9PiBpdGVtLmRhdGFzZXQudmFsdWV0ZXh0ID8/IGl0ZW0udGV4dENvbnRlbnQgPz8gXCJcIjtcbnZhciBtYXRjaCA9ICh2YWx1ZVRleHQsIHF1ZXJ5MikgPT4gdmFsdWVUZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChxdWVyeTIudG9Mb3dlckNhc2UoKSk7XG52YXIgd3JhcCA9ICh2LCBpZHgpID0+IHtcbiAgcmV0dXJuIHYubWFwKChfLCBpbmRleCkgPT4gdlsoTWF0aC5tYXgoaWR4LCAwKSArIGluZGV4KSAlIHYubGVuZ3RoXSk7XG59O1xuZnVuY3Rpb24gZ2V0QnlUZXh0KHYsIHRleHQsIGN1cnJlbnRJZCkge1xuICBjb25zdCBpbmRleCA9IGN1cnJlbnRJZCA/IGluZGV4T2ZJZCh2LCBjdXJyZW50SWQpIDogLTE7XG4gIGxldCBpdGVtcyA9IGN1cnJlbnRJZCA/IHdyYXAodiwgaW5kZXgpIDogdjtcbiAgY29uc3QgaXNTaW5nbGVLZXkgPSB0ZXh0Lmxlbmd0aCA9PT0gMTtcbiAgaWYgKGlzU2luZ2xlS2V5KSB7XG4gICAgaXRlbXMgPSBpdGVtcy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uaWQgIT09IGN1cnJlbnRJZCk7XG4gIH1cbiAgcmV0dXJuIGl0ZW1zLmZpbmQoKGl0ZW0pID0+IG1hdGNoKGdldFZhbHVlVGV4dChpdGVtKSwgdGV4dCkpO1xufVxuXG4vLyBzcmMvZ2V0LWJ5LXR5cGVhaGVhZC50c1xuZnVuY3Rpb24gZ2V0QnlUeXBlYWhlYWRJbXBsKF9pdGVtcywgb3B0aW9ucykge1xuICBjb25zdCB7IHN0YXRlLCBhY3RpdmVJZCwga2V5LCB0aW1lb3V0ID0gMzUwIH0gPSBvcHRpb25zO1xuICBjb25zdCBzZWFyY2ggPSBzdGF0ZS5rZXlzU29GYXIgKyBrZXk7XG4gIGNvbnN0IGlzUmVwZWF0ZWQgPSBzZWFyY2gubGVuZ3RoID4gMSAmJiBBcnJheS5mcm9tKHNlYXJjaCkuZXZlcnkoKGNoYXIpID0+IGNoYXIgPT09IHNlYXJjaFswXSk7XG4gIGNvbnN0IHF1ZXJ5MiA9IGlzUmVwZWF0ZWQgPyBzZWFyY2hbMF0gOiBzZWFyY2g7XG4gIGxldCBpdGVtcyA9IF9pdGVtcy5zbGljZSgpO1xuICBjb25zdCBuZXh0ID0gZ2V0QnlUZXh0KGl0ZW1zLCBxdWVyeTIsIGFjdGl2ZUlkKTtcbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBjbGVhclRpbWVvdXQoc3RhdGUudGltZXIpO1xuICAgIHN0YXRlLnRpbWVyID0gLTE7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKHZhbHVlKSB7XG4gICAgc3RhdGUua2V5c1NvRmFyID0gdmFsdWU7XG4gICAgY2xlYW51cCgpO1xuICAgIGlmICh2YWx1ZSAhPT0gXCJcIikge1xuICAgICAgc3RhdGUudGltZXIgPSArc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHVwZGF0ZShcIlwiKTtcbiAgICAgICAgY2xlYW51cCgpO1xuICAgICAgfSwgdGltZW91dCk7XG4gICAgfVxuICB9XG4gIHVwZGF0ZShzZWFyY2gpO1xuICByZXR1cm4gbmV4dDtcbn1cbnZhciBnZXRCeVR5cGVhaGVhZCA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuYXNzaWduKGdldEJ5VHlwZWFoZWFkSW1wbCwge1xuICBkZWZhdWx0T3B0aW9uczogeyBrZXlzU29GYXI6IFwiXCIsIHRpbWVyOiAtMSB9LFxuICBpc1ZhbGlkRXZlbnQ6IGlzVmFsaWRUeXBlYWhlYWRFdmVudFxufSk7XG5mdW5jdGlvbiBpc1ZhbGlkVHlwZWFoZWFkRXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIGV2ZW50LmtleS5sZW5ndGggPT09IDEgJiYgIWV2ZW50LmN0cmxLZXkgJiYgIWV2ZW50Lm1ldGFLZXk7XG59XG5cbi8vIHNyYy9nZXQtY29tcHV0ZWQtc3R5bGUudHNcbnZhciBzdHlsZUNhY2hlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsKSB7XG4gIGlmICghc3R5bGVDYWNoZS5oYXMoZWwpKSB7XG4gICAgY29uc3Qgd2luID0gZWwub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gICAgc3R5bGVDYWNoZS5zZXQoZWwsIHdpbi5nZXRDb21wdXRlZFN0eWxlKGVsKSk7XG4gIH1cbiAgcmV0dXJuIHN0eWxlQ2FjaGUuZ2V0KGVsKTtcbn1cblxuLy8gc3JjL2dldC1ldmVudC10YXJnZXQudHNcbmZ1bmN0aW9uIGdldEV2ZW50VGFyZ2V0KGV2ZW50KSB7XG4gIHJldHVybiBldmVudC5jb21wb3NlZFBhdGg/LigpWzBdID8/IGV2ZW50LnRhcmdldDtcbn1cblxuLy8gc3JjL2dldC1zY3JvbGwtcGFyZW50LnRzXG5mdW5jdGlvbiBpc1Njcm9sbFBhcmVudChlbCkge1xuICBjb25zdCB3aW4gPSBlbC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgY29uc3QgeyBvdmVyZmxvdywgb3ZlcmZsb3dYLCBvdmVyZmxvd1kgfSA9IHdpbi5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgcmV0dXJuIC9hdXRvfHNjcm9sbHxvdmVybGF5fGhpZGRlbi8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCk7XG59XG5mdW5jdGlvbiBnZXRQYXJlbnQoZWwpIHtcbiAgaWYgKGVsLmxvY2FsTmFtZSA9PT0gXCJodG1sXCIpXG4gICAgcmV0dXJuIGVsO1xuICByZXR1cm4gZWwuYXNzaWduZWRTbG90IHx8IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG59XG5mdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQoZWwpIHtcbiAgaWYgKFtcImh0bWxcIiwgXCJib2R5XCIsIFwiI2RvY3VtZW50XCJdLmluY2x1ZGVzKGVsLmxvY2FsTmFtZSkpIHtcbiAgICByZXR1cm4gZWwub3duZXJEb2N1bWVudC5ib2R5O1xuICB9XG4gIGlmIChpc0hUTUxFbGVtZW50KGVsKSAmJiBpc1Njcm9sbFBhcmVudChlbCkpIHtcbiAgICByZXR1cm4gZWw7XG4gIH1cbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnQoZWwpKTtcbn1cbmZ1bmN0aW9uIGdldFNjcm9sbFBhcmVudHMoZWwsIGxpc3QgPSBbXSkge1xuICBjb25zdCBwYXJlbnQgPSBnZXRTY3JvbGxQYXJlbnQoZWwpO1xuICBjb25zdCBpc0JvZHkgPSBwYXJlbnQgPT09IGVsLm93bmVyRG9jdW1lbnQuYm9keTtcbiAgY29uc3Qgd2luID0gcGFyZW50Lm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgfHwgd2luZG93O1xuICBjb25zdCB0YXJnZXQgPSBpc0JvZHkgPyBbd2luXS5jb25jYXQod2luLnZpc3VhbFZpZXdwb3J0IHx8IFtdLCBpc1Njcm9sbFBhcmVudChwYXJlbnQpID8gcGFyZW50IDogW10pIDogcGFyZW50O1xuICBjb25zdCBwYXJlbnRzID0gbGlzdC5jb25jYXQodGFyZ2V0KTtcbiAgcmV0dXJuIGlzQm9keSA/IHBhcmVudHMgOiBwYXJlbnRzLmNvbmNhdChnZXRTY3JvbGxQYXJlbnRzKGdldFBhcmVudCh0YXJnZXQpKSk7XG59XG5cbi8vIHNyYy9pcy1lZGl0YWJsZS1lbGVtZW50LnRzXG5mdW5jdGlvbiBpc0VkaXRhYmxlRWxlbWVudChlbCkge1xuICBpZiAoZWwgPT0gbnVsbCB8fCAhaXNIVE1MRWxlbWVudChlbCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCB3aW4gPSBlbC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgICByZXR1cm4gZWwgaW5zdGFuY2VvZiB3aW4uSFRNTElucHV0RWxlbWVudCAmJiBlbC5zZWxlY3Rpb25TdGFydCAhPSBudWxsIHx8IC8odGV4dGFyZWF8c2VsZWN0KS8udGVzdChlbC5sb2NhbE5hbWUpIHx8IGVsLmlzQ29udGVudEVkaXRhYmxlO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gc3JjL3BsYXRmb3JtLnRzXG52YXIgaXNEb20gPSAoKSA9PiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG5mdW5jdGlvbiBnZXRQbGF0Zm9ybSgpIHtcbiAgY29uc3QgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50RGF0YTtcbiAgcmV0dXJuIGFnZW50Py5wbGF0Zm9ybSA/PyBuYXZpZ2F0b3IucGxhdGZvcm07XG59XG52YXIgcHQgPSAodikgPT4gaXNEb20oKSAmJiB2LnRlc3QoZ2V0UGxhdGZvcm0oKSk7XG52YXIgdWEgPSAodikgPT4gaXNEb20oKSAmJiB2LnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG52YXIgdm4gPSAodikgPT4gaXNEb20oKSAmJiB2LnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG52YXIgaXNUb3VjaERldmljZSA9ICgpID0+IGlzRG9tKCkgJiYgISFuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHM7XG52YXIgaXNNYWMgPSAoKSA9PiBwdCgvXk1hYy8pICYmICFpc1RvdWNoRGV2aWNlKCk7XG52YXIgaXNJUGhvbmUgPSAoKSA9PiBwdCgvXmlQaG9uZS8pO1xudmFyIGlzU2FmYXJpID0gKCkgPT4gaXNBcHBsZSgpICYmIHZuKC9hcHBsZS9pKTtcbnZhciBpc0ZpcmVmb3ggPSAoKSA9PiB1YSgvZmlyZWZveFxcLy9pKTtcbnZhciBpc0FwcGxlID0gKCkgPT4gcHQoL21hY3xpcGhvbmV8aXBhZHxpcG9kL2kpO1xudmFyIGlzSW9zID0gKCkgPT4gaXNBcHBsZSgpICYmICFpc01hYygpO1xuXG4vLyBzcmMvcXVlcnkudHNcbmZ1bmN0aW9uIHF1ZXJ5QWxsKHJvb3QsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHJvb3Q/LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpID8/IFtdKTtcbn1cbmZ1bmN0aW9uIHF1ZXJ5KHJvb3QsIHNlbGVjdG9yKSB7XG4gIHJldHVybiByb290Py5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuLy8gc3JjL3JhZi50c1xuZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgY29uc3Qgc2V0ID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgZnVuY3Rpb24gcmFmMihmbjIpIHtcbiAgICBjb25zdCBpZCA9IGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZuMik7XG4gICAgc2V0LmFkZCgoKSA9PiBnbG9iYWxUaGlzLmNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG4gIH1cbiAgcmFmMigoKSA9PiByYWYyKGZuKSk7XG4gIHJldHVybiBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIHNldC5mb3JFYWNoKChmbjIpID0+IGZuMigpKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHJhZihmbikge1xuICBjb25zdCBpZCA9IGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZuKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBnbG9iYWxUaGlzLmNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKTtcbiAgfTtcbn1cblxuLy8gc3JjL2luZGV4LnRzXG52YXIgTUFYX1pfSU5ERVggPSAyMTQ3NDgzNjQ3O1xuZXhwb3J0IHtcbiAgTUFYX1pfSU5ERVgsXG4gIGFyaWFBdHRyLFxuICBjb250YWlucyxcbiAgY3JlYXRlU2NvcGUsXG4gIGRhdGFBdHRyLFxuICBnZXRBY3RpdmVFbGVtZW50LFxuICBnZXRCeVRleHQsXG4gIGdldEJ5VHlwZWFoZWFkLFxuICBnZXRDb21wdXRlZFN0eWxlLFxuICBnZXREb2N1bWVudDIgYXMgZ2V0RG9jdW1lbnQsXG4gIGdldEV2ZW50VGFyZ2V0LFxuICBnZXRQYXJlbnQsXG4gIGdldFBsYXRmb3JtLFxuICBnZXRTY3JvbGxQYXJlbnQsXG4gIGdldFNjcm9sbFBhcmVudHMsXG4gIGdldFdpbmRvdyxcbiAgaW5kZXhPZklkLFxuICBpc0FwcGxlLFxuICBpc0RvbSxcbiAgaXNFZGl0YWJsZUVsZW1lbnQsXG4gIGlzRmlyZWZveCxcbiAgaXNIVE1MRWxlbWVudCxcbiAgaXNJUGhvbmUsXG4gIGlzSW9zLFxuICBpc01hYyxcbiAgaXNTYWZhcmksXG4gIGlzU2VsZkV2ZW50LFxuICBpc1RvdWNoRGV2aWNlLFxuICBpdGVtQnlJZCxcbiAgbmV4dEJ5SWQsXG4gIG5leHRUaWNrLFxuICBwcmV2QnlJZCxcbiAgcXVlcnksXG4gIHF1ZXJ5QWxsLFxuICByYWZcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/@zag-js/dom-query/dist/index.mjs\n");

/***/ }),

/***/ "(ssr)/./node_modules/@zag-js/element-size/dist/track-size.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@zag-js/element-size/dist/track-size.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   trackElementSize: () => (/* binding */ trackElementSize)\n/* harmony export */ });\nfunction trackElementSize(element, callback) {\n  if (!element) {\n    callback(void 0);\n    return;\n  }\n  callback({ width: element.offsetWidth, height: element.offsetHeight });\n  const win = element.ownerDocument.defaultView ?? window;\n  const observer = new win.ResizeObserver((entries) => {\n    if (!Array.isArray(entries) || !entries.length)\n      return;\n    const [entry] = entries;\n    let width;\n    let height;\n    if (\"borderBoxSize\" in entry) {\n      const borderSizeEntry = entry[\"borderBoxSize\"];\n      const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;\n      width = borderSize[\"inlineSize\"];\n      height = borderSize[\"blockSize\"];\n    } else {\n      width = element.offsetWidth;\n      height = element.offsetHeight;\n    }\n    callback({ width, height });\n  });\n  observer.observe(element, { box: \"border-box\" });\n  return () => observer.unobserve(element);\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvQHphZy1qcy9lbGVtZW50LXNpemUvZGlzdC90cmFjay1zaXplLm1qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsMERBQTBEO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFlLGVBQWU7QUFDOUIsR0FBRztBQUNILDhCQUE4QixtQkFBbUI7QUFDakQ7QUFDQTs7QUFFNEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW5sbmNnNC8uL25vZGVfbW9kdWxlcy9AemFnLWpzL2VsZW1lbnQtc2l6ZS9kaXN0L3RyYWNrLXNpemUubWpzPzFhNWEiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdHJhY2tFbGVtZW50U2l6ZShlbGVtZW50LCBjYWxsYmFjaykge1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICBjYWxsYmFjayh2b2lkIDApO1xuICAgIHJldHVybjtcbiAgfVxuICBjYWxsYmFjayh7IHdpZHRoOiBlbGVtZW50Lm9mZnNldFdpZHRoLCBoZWlnaHQ6IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IH0pO1xuICBjb25zdCB3aW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgPz8gd2luZG93O1xuICBjb25zdCBvYnNlcnZlciA9IG5ldyB3aW4uUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZW50cmllcykgfHwgIWVudHJpZXMubGVuZ3RoKVxuICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IFtlbnRyeV0gPSBlbnRyaWVzO1xuICAgIGxldCB3aWR0aDtcbiAgICBsZXQgaGVpZ2h0O1xuICAgIGlmIChcImJvcmRlckJveFNpemVcIiBpbiBlbnRyeSkge1xuICAgICAgY29uc3QgYm9yZGVyU2l6ZUVudHJ5ID0gZW50cnlbXCJib3JkZXJCb3hTaXplXCJdO1xuICAgICAgY29uc3QgYm9yZGVyU2l6ZSA9IEFycmF5LmlzQXJyYXkoYm9yZGVyU2l6ZUVudHJ5KSA/IGJvcmRlclNpemVFbnRyeVswXSA6IGJvcmRlclNpemVFbnRyeTtcbiAgICAgIHdpZHRoID0gYm9yZGVyU2l6ZVtcImlubGluZVNpemVcIl07XG4gICAgICBoZWlnaHQgPSBib3JkZXJTaXplW1wiYmxvY2tTaXplXCJdO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9XG4gICAgY2FsbGJhY2soeyB3aWR0aCwgaGVpZ2h0IH0pO1xuICB9KTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50LCB7IGJveDogXCJib3JkZXItYm94XCIgfSk7XG4gIHJldHVybiAoKSA9PiBvYnNlcnZlci51bm9ic2VydmUoZWxlbWVudCk7XG59XG5cbmV4cG9ydCB7IHRyYWNrRWxlbWVudFNpemUgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/@zag-js/element-size/dist/track-size.mjs\n");

/***/ }),

/***/ "(ssr)/./node_modules/@zag-js/focus-visible/dist/index.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@zag-js/focus-visible/dist/index.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getInteractionModality: () => (/* binding */ getInteractionModality),\n/* harmony export */   setInteractionModality: () => (/* binding */ setInteractionModality),\n/* harmony export */   trackFocusVisible: () => (/* binding */ trackFocusVisible),\n/* harmony export */   trackInteractionModality: () => (/* binding */ trackInteractionModality)\n/* harmony export */ });\n/* harmony import */ var _zag_js_dom_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @zag-js/dom-query */ \"(ssr)/./node_modules/@zag-js/dom-query/dist/index.mjs\");\n// src/index.ts\n\nvar hasSetup = false;\nvar modality = null;\nvar hasEventBeforeFocus = false;\nvar hasBlurredWindowRecently = false;\nvar handlers = /* @__PURE__ */ new Set();\nfunction trigger(modality2, event) {\n  handlers.forEach((handler) => handler(modality2, event));\n}\nvar isMac = typeof window !== \"undefined\" && window.navigator != null ? /^Mac/.test(window.navigator.platform) : false;\nfunction isValidKey(e) {\n  return !(e.metaKey || !isMac && e.altKey || e.ctrlKey || e.key === \"Control\" || e.key === \"Shift\" || e.key === \"Meta\");\n}\nfunction onKeyboardEvent(event) {\n  hasEventBeforeFocus = true;\n  if (isValidKey(event)) {\n    modality = \"keyboard\";\n    trigger(\"keyboard\", event);\n  }\n}\nfunction onPointerEvent(event) {\n  modality = \"pointer\";\n  if (event.type === \"mousedown\" || event.type === \"pointerdown\") {\n    hasEventBeforeFocus = true;\n    const target = event.composedPath ? event.composedPath()[0] : event.target;\n    let matches = false;\n    try {\n      matches = target.matches(\":focus-visible\");\n    } catch {\n    }\n    if (matches)\n      return;\n    trigger(\"pointer\", event);\n  }\n}\nfunction isVirtualClick(event) {\n  if (event.mozInputSource === 0 && event.isTrusted)\n    return true;\n  return event.detail === 0 && !event.pointerType;\n}\nfunction onClickEvent(e) {\n  if (isVirtualClick(e)) {\n    hasEventBeforeFocus = true;\n    modality = \"virtual\";\n  }\n}\nfunction onWindowFocus(event) {\n  if (event.target === window || event.target === document) {\n    return;\n  }\n  if (!hasEventBeforeFocus && !hasBlurredWindowRecently) {\n    modality = \"virtual\";\n    trigger(\"virtual\", event);\n  }\n  hasEventBeforeFocus = false;\n  hasBlurredWindowRecently = false;\n}\nfunction onWindowBlur() {\n  hasEventBeforeFocus = false;\n  hasBlurredWindowRecently = true;\n}\nfunction isFocusVisible() {\n  return modality !== \"pointer\";\n}\nfunction setupGlobalFocusEvents() {\n  if (!(0,_zag_js_dom_query__WEBPACK_IMPORTED_MODULE_0__.isDom)() || hasSetup) {\n    return;\n  }\n  const { focus } = HTMLElement.prototype;\n  HTMLElement.prototype.focus = function focusElement(...args) {\n    hasEventBeforeFocus = true;\n    focus.apply(this, args);\n  };\n  document.addEventListener(\"keydown\", onKeyboardEvent, true);\n  document.addEventListener(\"keyup\", onKeyboardEvent, true);\n  document.addEventListener(\"click\", onClickEvent, true);\n  window.addEventListener(\"focus\", onWindowFocus, true);\n  window.addEventListener(\"blur\", onWindowBlur, false);\n  if (typeof PointerEvent !== \"undefined\") {\n    document.addEventListener(\"pointerdown\", onPointerEvent, true);\n    document.addEventListener(\"pointermove\", onPointerEvent, true);\n    document.addEventListener(\"pointerup\", onPointerEvent, true);\n  } else {\n    document.addEventListener(\"mousedown\", onPointerEvent, true);\n    document.addEventListener(\"mousemove\", onPointerEvent, true);\n    document.addEventListener(\"mouseup\", onPointerEvent, true);\n  }\n  hasSetup = true;\n}\nfunction trackFocusVisible(fn) {\n  setupGlobalFocusEvents();\n  fn(isFocusVisible());\n  const handler = () => fn(isFocusVisible());\n  handlers.add(handler);\n  return () => {\n    handlers.delete(handler);\n  };\n}\nfunction trackInteractionModality(fn) {\n  setupGlobalFocusEvents();\n  fn(modality);\n  const handler = () => fn(modality);\n  handlers.add(handler);\n  return () => {\n    handlers.delete(handler);\n  };\n}\nfunction setInteractionModality(value) {\n  modality = value;\n  trigger(value, null);\n}\nfunction getInteractionModality() {\n  return modality;\n}\n\n//# sourceMappingURL=index.mjs.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvQHphZy1qcy9mb2N1cy12aXNpYmxlL2Rpc3QvaW5kZXgubWpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sd0RBQUs7QUFDWjtBQUNBO0FBQ0EsVUFBVSxRQUFRO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUU7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbmxuY2c0Ly4vbm9kZV9tb2R1bGVzL0B6YWctanMvZm9jdXMtdmlzaWJsZS9kaXN0L2luZGV4Lm1qcz8yODIzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9pbmRleC50c1xuaW1wb3J0IHsgaXNEb20gfSBmcm9tIFwiQHphZy1qcy9kb20tcXVlcnlcIjtcbnZhciBoYXNTZXR1cCA9IGZhbHNlO1xudmFyIG1vZGFsaXR5ID0gbnVsbDtcbnZhciBoYXNFdmVudEJlZm9yZUZvY3VzID0gZmFsc2U7XG52YXIgaGFzQmx1cnJlZFdpbmRvd1JlY2VudGx5ID0gZmFsc2U7XG52YXIgaGFuZGxlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuZnVuY3Rpb24gdHJpZ2dlcihtb2RhbGl0eTIsIGV2ZW50KSB7XG4gIGhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IGhhbmRsZXIobW9kYWxpdHkyLCBldmVudCkpO1xufVxudmFyIGlzTWFjID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubmF2aWdhdG9yICE9IG51bGwgPyAvXk1hYy8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnBsYXRmb3JtKSA6IGZhbHNlO1xuZnVuY3Rpb24gaXNWYWxpZEtleShlKSB7XG4gIHJldHVybiAhKGUubWV0YUtleSB8fCAhaXNNYWMgJiYgZS5hbHRLZXkgfHwgZS5jdHJsS2V5IHx8IGUua2V5ID09PSBcIkNvbnRyb2xcIiB8fCBlLmtleSA9PT0gXCJTaGlmdFwiIHx8IGUua2V5ID09PSBcIk1ldGFcIik7XG59XG5mdW5jdGlvbiBvbktleWJvYXJkRXZlbnQoZXZlbnQpIHtcbiAgaGFzRXZlbnRCZWZvcmVGb2N1cyA9IHRydWU7XG4gIGlmIChpc1ZhbGlkS2V5KGV2ZW50KSkge1xuICAgIG1vZGFsaXR5ID0gXCJrZXlib2FyZFwiO1xuICAgIHRyaWdnZXIoXCJrZXlib2FyZFwiLCBldmVudCk7XG4gIH1cbn1cbmZ1bmN0aW9uIG9uUG9pbnRlckV2ZW50KGV2ZW50KSB7XG4gIG1vZGFsaXR5ID0gXCJwb2ludGVyXCI7XG4gIGlmIChldmVudC50eXBlID09PSBcIm1vdXNlZG93blwiIHx8IGV2ZW50LnR5cGUgPT09IFwicG9pbnRlcmRvd25cIikge1xuICAgIGhhc0V2ZW50QmVmb3JlRm9jdXMgPSB0cnVlO1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LmNvbXBvc2VkUGF0aCA/IGV2ZW50LmNvbXBvc2VkUGF0aCgpWzBdIDogZXZlbnQudGFyZ2V0O1xuICAgIGxldCBtYXRjaGVzID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIG1hdGNoZXMgPSB0YXJnZXQubWF0Y2hlcyhcIjpmb2N1cy12aXNpYmxlXCIpO1xuICAgIH0gY2F0Y2gge1xuICAgIH1cbiAgICBpZiAobWF0Y2hlcylcbiAgICAgIHJldHVybjtcbiAgICB0cmlnZ2VyKFwicG9pbnRlclwiLCBldmVudCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGlzVmlydHVhbENsaWNrKGV2ZW50KSB7XG4gIGlmIChldmVudC5tb3pJbnB1dFNvdXJjZSA9PT0gMCAmJiBldmVudC5pc1RydXN0ZWQpXG4gICAgcmV0dXJuIHRydWU7XG4gIHJldHVybiBldmVudC5kZXRhaWwgPT09IDAgJiYgIWV2ZW50LnBvaW50ZXJUeXBlO1xufVxuZnVuY3Rpb24gb25DbGlja0V2ZW50KGUpIHtcbiAgaWYgKGlzVmlydHVhbENsaWNrKGUpKSB7XG4gICAgaGFzRXZlbnRCZWZvcmVGb2N1cyA9IHRydWU7XG4gICAgbW9kYWxpdHkgPSBcInZpcnR1YWxcIjtcbiAgfVxufVxuZnVuY3Rpb24gb25XaW5kb3dGb2N1cyhldmVudCkge1xuICBpZiAoZXZlbnQudGFyZ2V0ID09PSB3aW5kb3cgfHwgZXZlbnQudGFyZ2V0ID09PSBkb2N1bWVudCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWhhc0V2ZW50QmVmb3JlRm9jdXMgJiYgIWhhc0JsdXJyZWRXaW5kb3dSZWNlbnRseSkge1xuICAgIG1vZGFsaXR5ID0gXCJ2aXJ0dWFsXCI7XG4gICAgdHJpZ2dlcihcInZpcnR1YWxcIiwgZXZlbnQpO1xuICB9XG4gIGhhc0V2ZW50QmVmb3JlRm9jdXMgPSBmYWxzZTtcbiAgaGFzQmx1cnJlZFdpbmRvd1JlY2VudGx5ID0gZmFsc2U7XG59XG5mdW5jdGlvbiBvbldpbmRvd0JsdXIoKSB7XG4gIGhhc0V2ZW50QmVmb3JlRm9jdXMgPSBmYWxzZTtcbiAgaGFzQmx1cnJlZFdpbmRvd1JlY2VudGx5ID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGlzRm9jdXNWaXNpYmxlKCkge1xuICByZXR1cm4gbW9kYWxpdHkgIT09IFwicG9pbnRlclwiO1xufVxuZnVuY3Rpb24gc2V0dXBHbG9iYWxGb2N1c0V2ZW50cygpIHtcbiAgaWYgKCFpc0RvbSgpIHx8IGhhc1NldHVwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHsgZm9jdXMgfSA9IEhUTUxFbGVtZW50LnByb3RvdHlwZTtcbiAgSFRNTEVsZW1lbnQucHJvdG90eXBlLmZvY3VzID0gZnVuY3Rpb24gZm9jdXNFbGVtZW50KC4uLmFyZ3MpIHtcbiAgICBoYXNFdmVudEJlZm9yZUZvY3VzID0gdHJ1ZTtcbiAgICBmb2N1cy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXlib2FyZEV2ZW50LCB0cnVlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9uS2V5Ym9hcmRFdmVudCwgdHJ1ZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrRXZlbnQsIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIG9uV2luZG93Rm9jdXMsIHRydWUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgb25XaW5kb3dCbHVyLCBmYWxzZSk7XG4gIGlmICh0eXBlb2YgUG9pbnRlckV2ZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIG9uUG9pbnRlckV2ZW50LCB0cnVlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgb25Qb2ludGVyRXZlbnQsIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgb25Qb2ludGVyRXZlbnQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25Qb2ludGVyRXZlbnQsIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Qb2ludGVyRXZlbnQsIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uUG9pbnRlckV2ZW50LCB0cnVlKTtcbiAgfVxuICBoYXNTZXR1cCA9IHRydWU7XG59XG5mdW5jdGlvbiB0cmFja0ZvY3VzVmlzaWJsZShmbikge1xuICBzZXR1cEdsb2JhbEZvY3VzRXZlbnRzKCk7XG4gIGZuKGlzRm9jdXNWaXNpYmxlKCkpO1xuICBjb25zdCBoYW5kbGVyID0gKCkgPT4gZm4oaXNGb2N1c1Zpc2libGUoKSk7XG4gIGhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBoYW5kbGVycy5kZWxldGUoaGFuZGxlcik7XG4gIH07XG59XG5mdW5jdGlvbiB0cmFja0ludGVyYWN0aW9uTW9kYWxpdHkoZm4pIHtcbiAgc2V0dXBHbG9iYWxGb2N1c0V2ZW50cygpO1xuICBmbihtb2RhbGl0eSk7XG4gIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiBmbihtb2RhbGl0eSk7XG4gIGhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBoYW5kbGVycy5kZWxldGUoaGFuZGxlcik7XG4gIH07XG59XG5mdW5jdGlvbiBzZXRJbnRlcmFjdGlvbk1vZGFsaXR5KHZhbHVlKSB7XG4gIG1vZGFsaXR5ID0gdmFsdWU7XG4gIHRyaWdnZXIodmFsdWUsIG51bGwpO1xufVxuZnVuY3Rpb24gZ2V0SW50ZXJhY3Rpb25Nb2RhbGl0eSgpIHtcbiAgcmV0dXJuIG1vZGFsaXR5O1xufVxuZXhwb3J0IHtcbiAgZ2V0SW50ZXJhY3Rpb25Nb2RhbGl0eSxcbiAgc2V0SW50ZXJhY3Rpb25Nb2RhbGl0eSxcbiAgdHJhY2tGb2N1c1Zpc2libGUsXG4gIHRyYWNrSW50ZXJhY3Rpb25Nb2RhbGl0eVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/@zag-js/focus-visible/dist/index.mjs\n");

/***/ })

};
;