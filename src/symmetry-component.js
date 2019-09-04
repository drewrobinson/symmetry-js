import { logger, hashKey } from "./symmetry-utils";
import { Symmetry } from "./symmetry";

class Component {
  constructor() {
    let self = this;
    self.bus = Symmetry.Mediator.constructor.getComponentBus();
    self.logger = logger;
    self.symmetryId = hashKey();

    if(self.constructor.messages){
      let messages = self.constructor.messages();
      messages.forEach((msg)=>{
        if(typeof msg !== 'string'){
          throw new TypeError(`Service constructor msg argument should be of type string`);
        }
        self.bus.registerMessage(msg);
      });
    }
  }
}

export { Component };