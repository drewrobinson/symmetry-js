class PubSub {
  
  constructor(){
    this.messages = {};
    this.listeners = [];
  }
  
  publish(msg, data) {

    let self = this;

    if (self.messages.hasOwnProperty(msg) && this.listeners[msg]) {
      let i = 0,
        l = this.listeners[msg].length;

      for (i; i < l; i++) {
        if (this.listeners[msg][i]) {
          this.listeners[msg][i].callBack.call(this.listeners[msg][i].context, {
            msg: msg,
            data: data
          });
        }
      }
    }
  }

  /**
   * Responsible for registering a listener to message. Wild card (*) will subscribe to all events
   * @param {String} msg - Required
   * @param {fn} callBack - Required
   * @param {} context - Required if callback is not bound
   */
  subscribe(msg, callBack, context) {
    let self = this;

    if (!msg || !callBack ) {
      throw Error(`Subscribe Error: missing required args`);
    }

    if (callBack.name.indexOf('bound') < 0 && !context) {
      throw Error(`Subscribe Error: ${callBack.name} unbound or missing context`);
    }

    //Ensure message exists
    if (self.messages.hasOwnProperty(msg)) {

      if (typeof self.listeners[msg] === "undefined") {
        self.listeners[msg] = [];
      }

      //don't register same callback twice
      let i = 0,
        l = self.listeners[msg].length;

      for (i; i < l; i++) {

        if(callBack.name.indexOf('bound') > -1 && !context){

          if (self.listeners[msg][i].callBack.name == callBack.name) {
            throw Error(`Subscribe error: ${callBack.name} listener already registered. Include context with arguments. E.g. subscribe(msg, callback, context)`);
          }
        }else{
          if (self.listeners[msg][i].callBack === callBack && self.listeners[msg][i].context === context) {
            throw Error(`Subscribe error: ${callBack.name} listener already registered with context`);
          }
        }

      }

      self.listeners[msg].push({
        callBack: callBack,
        context: context
      });
    } else {
      throw Error("subscribe error: message not found", msg);
    }
  }

  /**
   * Responsible for removing listener
   * @param {String} msg
   * @param {fn} callBack
   * @param {} context - Required if callback is not bound
   */
  unsubscribe(msg, callBack, context) {
    let self = this;
    let i = 0,
      l = self.listeners[msg].length;
    for (i; i < l; i++) {
      if(callBack.name.indexOf('bound') > -1){
        if (self.listeners[msg][i].callBack.name === callBack.name) {
          self.listeners[msg].splice(i, 1);
          break;
        }
      }else{
        if (self.listeners[msg][i].callBack.name === callBack.name && self.listeners[msg][i].context === context) {
          self.listeners[msg].splice(i, 1);
          break;
        }
      }
    }
  }
};

export { PubSub }