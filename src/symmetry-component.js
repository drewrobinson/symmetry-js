import { Symmetry } from "./symmetry";

class Component {

  constructor() {
    let self = this;
    self.bus = Symmetry.Mediator.constructor.getComponentBus();

    Object.assign(self.bus, {
      add:(msg)=> {
        self.bus.messages[msg] = msg;
      }
    });

    if(self.constructor.messages){
      let messages = self.constructor.messages();
      messages.forEach((msg)=>{
        self.bus.add(msg);
      });
    }

  }
}

export { Component };