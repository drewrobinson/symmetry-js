
const ROOT_SELECTOR = 'data-symmetry-js-app';

class App {

  constructor(componentList, debug=false, observeSubTree=false) {
    let self = this;
    self.observeSubTree = observeSubTree;
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
   */
  mutationHandler(mutationsList){
    let self = this;
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        let newNodes = mutation.addedNodes;

        if (newNodes.length) {
          newNodes.forEach(element => {
            self.initialize(element);
          });
        }
      }
    }
  }

  /**
   *
   * @param scope - a dom element; default is documentElement
   */
  initialize(scope) {
    let self = this;
    let _scope = document;

    if(scope){
      if(scope.nodeType === 1 | scope.nodeType === 9){
        _scope = scope;
      }
    }

    self.componentList.forEach(component => {
      let _selector = component.selector();
      if(!_selector){
        throw new Error(`${component.name} missing selector`);
      }
      var componentReferences = _scope.querySelectorAll(`[data-symmetry-js-${_selector}]`);

      if(componentReferences.length > 0){
        [...componentReferences].forEach(element => new component(element));
      }
    });

    if(!self.initialized){
      let targetNode = document.querySelector(`[${ROOT_SELECTOR}]`);
      let config = { attributes: false, childList: true, subtree: self.observeSubTree };
      self.initialized = true;
      self.observer.observe(targetNode, config);
    }
  }
}

export { App };