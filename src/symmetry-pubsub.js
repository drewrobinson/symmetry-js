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
   * @param msg
   * @param callBack
   * @param context
   */
  subscribe(msg, callBack, context) {
    let self = this;

    if (!msg || !callBack) {
      throw Error("subscribe error: missing required args");
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
        if (self.listeners[msg][i].callBack === callBack && self.listeners[msg][i].context === context) {
          throw Error("subscribe error: listener already registered");
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
   * @param msg
   * @param callBack
   * @param context
   */
  unsubscribe(msg, callBack, context) {
    let self = this;

    let i = 0,
      l = self.listeners[msg].length;
    for (i; i < l; i++) {
      if (self.listeners[msg][i].callBack === callBack && self.listeners[msg][i].context === context) {
        self.listeners[msg].splice(i, 1);
        break;
      }
    }
  }
};

export { PubSub }