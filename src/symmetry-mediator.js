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

import { logger } from "./symmetry-utils";
import { PubSub } from "./symmetry-pubsub";

const MODEL_ERROR = 'MODEL_ERROR';

let componentBus;
let serviceBus;

class Mediator {

  /**
   * Responsible for getting
   * @returns {string}
   */
  static getModelErrorMessage(){
    return MODEL_ERROR;
  }

  /**
   * Responsible for returning componentBus instance for Symmetry Components
   * @returns {*}
   */
  static getComponentBus(){
    return componentBus;
  }

  /**
   * Responsible for returning serviceBus instance for Symmetry Services
   * @returns {*}
   */
  static getServiceBus(){
    return serviceBus;
  }

  constructor(queueConcurrency = 6) {
    let self = this;
    this.taskQueue = [];
    this.taskMap = {};
    this.processingMap = {};
    this.queueConcurrency = queueConcurrency;
    this.tasksProcessing = 0;
    this.logger = logger;

    //Create Bus Instances
    componentBus = new PubSub('componentBus');
    serviceBus = new PubSub('serviceBus');

    //Register Error Notification Messages
    componentBus.registerMessage(MODEL_ERROR);
    serviceBus.registerMessage(MODEL_ERROR);

    //Register Error Listener with Service Bus
    serviceBus.subscribe(MODEL_ERROR, self.errorListener, self);
  }

  /**
   * Responsible for overriding default queueConcurrency
   * @param {number} queueConcurrency
   */
  setConcurrency(queueConcurrency){
    if(typeof queueConcurrency === 'number' & queueConcurrency > 0){
      this.queueConcurrency = queueConcurrency;
    }
  }

  /**
   * Responsible for re-publishing model error message to component bus
   * @param msg
   */
  errorListener(msg){
    let _msg = (msg.hasOwnProperty("data")) ? msg.data : msg;
    componentBus.publish(msg.msg, _msg);
  }

  /**
   * Responsible for registering a service with the mediator
   * @param service
   */
  registerService(service){
    let self = this;

    if(!service instanceof Object){
      throw new TypeError(`Mediator Register Error: argument cannot be instantiated`);
    }

    let _aux = new service();

    //Register Service Model Updated Message
    componentBus.registerMessage(_aux.model.MODEL_UPDATED);
    serviceBus.registerMessage(_aux.model.MODEL_UPDATED);

    Object.getOwnPropertyNames(service.prototype).forEach((prop)=>{
      if(prop !== 'constructor'){

        if(!self.taskMap.hasOwnProperty(prop)){
          self.taskMap[prop] = {
            name: prop,
            message: _aux.model.MODEL_UPDATED,
            service: _aux,
            fn: _aux[prop]
          };

        }else{
          throw new TypeError(`Name Conflict: Another service has already registerd a method named ${prop}.`);
        }
      }
    });
  }

  /**
   * Responsible for unregistering a service with the mediator
   */
  unregisterService(service){
    let self = this;

    if(!service instanceof Object){
      throw new TypeError(`Mediator Unregister Error: missing required argument`);
    }

    let _aux = new service();

    Object.getOwnPropertyNames(service.prototype).forEach((prop)=>{
      if(prop !== 'constructor'){

        //clean up taskMap
        if(self.taskMap.hasOwnProperty(prop)){
          delete self.taskMap[prop];
        }

        //clean up processingMap 
        if(self.processingMap.hasOwnProperty(prop)){
          delete self.processingMap[prop];
        }

        //clean up component and service bus
        componentBus.unregisterMessage(_aux.model.MODEL_UPDATED);
        serviceBus.unregisterMessage(_aux.model.MODEL_UPDATED);
      }
    });
    _aux = null;
  }

  /**
   * Responsible for registering task with taskQueue
   * @param {string} taskName
   * @param params
   * @TODO: Accommodate multiple requests to queue same task with different parameters
   */
  queueTask(taskName, params){
    let self = this;
    let paramSignature = '';
    let taskSignature = taskName;

    if(typeof taskName !== "string"){
      throw new TypeError(`Mediator queueTask Error: taskName argument is not of type string`);
    }

    if(!self.taskMap.hasOwnProperty(taskName)){
      throw new ReferenceError(`Mediator queueTask Error: ${taskName} is not a registered service method`);
    }

    if(params && typeof params === "object" && params.hasOwnProperty('task-signature')){
      taskSignature = params['task-signature'];
    }

    if(self.processingMap[taskSignature] > 0){
      self.logger(`${taskName} task is already processing in queue and request will be disregarded`);
      return 'disregarded';
    }

    self.processingMap[taskSignature] = 1;

    let listener = function(){
      return {
        queueTaskCallback: function queueTaskCallback(msg){
          componentBus.publish(componentBus.messages[task.message], msg.data);
          Object.assign(task, {listener : this });
        }
      }
    };

    let task = {
      name: taskSignature,
      message: self.taskMap[taskName].message,
      fn: self.taskMap[taskName].fn,
      ctx: self.taskMap[taskName].service,
      params: params || {}
    };

    let listenerInstance = new listener();

    serviceBus.subscribe(serviceBus.messages[self.taskMap[taskName].message], listenerInstance.queueTaskCallback, listenerInstance);

    self.taskQueue.push(task);

    if (self.taskQueue.length > 0) {
      self.processTaskQueue();
    }
  }

  /**
   * Responsible for processing task queue
   */
  processTaskQueue() {
    let self = this;
    for (let i = 0; i < self.taskQueue.length; i++) {
      if (self.tasksProcessing < self.queueConcurrency) {
        let currentTask = self.taskQueue.shift();
        currentTask.fn.call(currentTask.ctx, self.dequeueTask.bind(self, currentTask), currentTask.params);
        self.tasksProcessing += 1;
      }
    }
  }

  /**
   * Responsible for removing task from queue
   * @param name
   */
  dequeueTask(task) {
    let self = this;
    self.processingMap[task.name] = 0;
    self.tasksProcessing -= 1;

    if(task.hasOwnProperty('listener')){
      serviceBus.unsubscribe(task.message, task.listener.queueTaskCallback, task.listener);
    }

    if (self.taskQueue.length > 0) {
      self.processTaskQueue();
    }
  }

  /**
   * Responsible for adding task queue and resolving promise when complete
   * @desc - Wraps Symmetry.Mediator.queueTask method in promise
   * @param taskName
   * @param params
   * @param resolveProp
   * @returns {Promise}
   */
  resolveTask(taskName, params, resolveProp) {
    let self = this;

    if(!self.taskMap.hasOwnProperty(taskName)){
      throw new ReferenceError(`Mediator resolveTask Error: ${taskName} is not a registered service method`);
    }

    if(typeof resolveProp !== "string" || resolveProp.length < 1){
      throw new ReferenceError(`Mediator resolveTask Error: ${taskName} is missing required argument`);
    }

    let promise = new Promise(function resolveTaskPromise(resolve, reject) {
      let listener = function(task, componentBus, serviceBus,resolve, reject, resolveProp){
        return {
          resolverCallback: function resolverCallback(msg){
            if(msg.data.hasOwnProperty(resolveProp)){
              serviceBus.unsubscribe(serviceBus.messages[task.message], this.resolverCallback, this);

              if(msg){
                resolve(msg.data[resolveProp]);
              }else{
                reject(`Resolver Failed`);
              }
            }
          }
        }
      };

      let listenerInstance = new listener(self.taskMap[taskName], componentBus, serviceBus, resolve, reject, resolveProp);
      serviceBus.subscribe(self.taskMap[taskName].message, listenerInstance.resolverCallback, listenerInstance);
      self.queueTask(taskName, params);
    });

    promise.catch(function(error) {
      self.logger('There was an error with resolveTask promise ::', error);
    });

    return promise;
  }
}


export { Mediator };