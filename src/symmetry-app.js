/**
 * ISC License (ISC)
 *
 * Copyright 2019 DrewRobinson <hello@drewrobinson.com>
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose with or without fee is hereby granted, provided
 * that the above copyright notice and this permission notice appear
 * in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

const ROOT_SELECTOR = 'data-symmetry-js-app';

class App {
  constructor(componentList, debug=false) {
    let self = this;
    self.initialized = false;
    self.componentList = componentList;
    self.observer = new MutationObserver(self.mutationHandler.bind(self));
    self.initialize();

    if(window){
      window.DEBUG_SYMMETRY = debug;
    }
  }

  /**
   * Responsible for DOM Mutation handling and determining if new components should be initialized
   * @param mutationsList
   * @desc - If mutation is childlist or subtree and new node is type is element, document or document fragment, pass it to the initialize method
   */
  mutationHandler(mutationsList){
    let self = this;
    for (var mutation of mutationsList) {
      let newNodes = mutation.addedNodes;
      if (newNodes.length) {
        newNodes.forEach(element => {
          if (element.nodeType === 1 || element.nodeType === 9 || element.nodeType === 11) {
            self.initialize(element);
          }
        });
      }
    }
  }

  /**
   * Responsible for searching given scope (DOM SubTree) for component references to be initialized.
   *    - e.g. components that do not have symmetry-js-* dataset value equal to "viewed"
   * @desc - document element is used as default scope if one is not provided
   * @param scope - a dom element; default is documentElement
   */
  initialize(scope) {
    let self = this;
    let _scope = document;

    //Only connect observer on first initalization call
    if(!self.initialized){
      let targetNode = document.querySelector(`[${ROOT_SELECTOR}]`);
      let config = {
        childList: true,
        subtree: true
      };
      self.initialized = true;
      self.observer.observe(targetNode, config);
    }

    if(scope){
      if(scope.nodeType === 1 || scope.nodeType === 9 || scope.nodeType === 11){
        _scope = scope;
      }
    }

    function capitalize(s) {
      if (typeof s !== 'string') { return ''; }
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function selectorToProp(s){
      let asProp = '';
      let _array = s.split('-');
      _array.forEach(function(str){
        let segment = capitalize(str);
        asProp += segment;
      });
      return asProp;
    }

    self.componentList.forEach(component => {
      let _selector = component.selector();
      if(!_selector){
        throw new Error(`${component.name} missing selector`);
      }
      var componentReferences = _scope.querySelectorAll(`[data-symmetry-js-${_selector}]`);
      var prop = 'symmetryJs'+selectorToProp(_selector);
      if(componentReferences.length > 0){
        [...componentReferences].forEach(function(element){
          if(element.dataset[prop] !== "viewed"){
            element.dataset[prop] = "viewed";
            return new component(element);
          }
        });
      }
    });

  }
}

export { App };