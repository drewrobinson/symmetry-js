import { Symmetry } from "./symmetry";
import { Model } from "./symmetry-model";

class Service {

  constructor(msg) {
    let self = this;
    self.bus = Symmetry.Mediator.constructor.getServiceBus();

    Object.assign(self.bus, {
      add:(msg)=> {
        self.bus.messages[msg] = msg;
      }
    });

    self.model = new Model(self, msg);
  }

  /**
   * Responsible for adding task to Mediator TaskQueue and resolving promise when complete
   * @desc - Wraps Symmetry.Mediator.queueTask method in promise
   * @param {String} taskName
   * @returns {Promise}
   */
  queueTask(taskName) {
    let self = this;

    let _resolve = null;

    let _task = Symmetry.Mediator.serviceMap[taskName];

    if(!_task){
      throw new Error('task not found');
    }

    let _cb = function _cb(msg){
      self.bus.unsubscribe(_task.message, _cb.bind(self));
      _resolve(msg);
    };

    let msgHandler = function(resolve, reject){
      _resolve = resolve;
      self.bus.subscribe(_task.message, _cb.bind(self));
      Symmetry.Mediator.queueTask(taskName);
    }

    return new Promise(msgHandler);
  }

  /**
   * Responsible for invoking synchronous service method
   * @returns {data} || null
   */
  call(taskName){
    let self = this;
    let data = null;

    let _task = Symmetry.Mediator.serviceMap[taskName];

    if(!_task){
      throw new Error('task not found');
    }

    data = _task.fn.call(_task.service);

    return (Object.keys(data).length > 0) ? { data : data } : null;
  }
}


export { Service };