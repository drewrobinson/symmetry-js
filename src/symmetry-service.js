import { Symmetry } from "./symmetry";
import { Model } from "./symmetry-model";

class Service {

  constructor(msg) {
    let self = this;
    self.serviceBus = Symmetry.Mediator.constructor.getServiceBus();

    Object.assign(self.serviceBus, {
      add:(msg)=> {
        self.serviceBus.messages[msg] = msg;
      }
    });

    self.model = new Model(self, msg);

    //console.log('Base Service: ', self);

  }
}


export { Service };