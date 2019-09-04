import { logger } from "./symmetry-utils";
import { Symmetry } from "./symmetry";
import { Model } from "./symmetry-model";

class Service {
  constructor(modelUpdatedMessage) {
    let self = this;

    if(typeof modelUpdatedMessage !== 'string'){
      throw new TypeError(`Service missing required message argument of type string`);
    }

    self.logger = logger;
    self.bus = Symmetry.Mediator.constructor.getServiceBus();
    self.model = new Model(self, modelUpdatedMessage, Symmetry.Mediator.constructor.getModelErrorMessage());
  }
}

export { Service };