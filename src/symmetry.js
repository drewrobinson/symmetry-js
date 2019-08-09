import { logger } from "./symmetry-utils";
import { App } from "./symmetry-app";
import { PubSub } from "./symmetry-pubsub";
import { Component } from "./symmetry-component";
import { Service } from "./symmetry-service";
import { Mediator } from "./symmetry-mediator";


let Symmetry = Object.create({

  id:'Symmetry',

  App: App,

  PubSub: PubSub,

  Component: Component,

  Service: Service,

  Mediator: new Mediator(),

  TaskSignature: function(params) {

    if(!params.hasOwnProperty('taskName')){
      throw new Error ('Referrence Error: TaskSignature is missing required property');
    }

    let paramSignature = '';

    let keys = Object.keys(params);
    keys.forEach(function(key, index){
      if(key !== "symmetry-id" && params[key]){
        let str = params[key].toString().replace(/,/g, '-');
        paramSignature += (index === keys.length - 1) ?`${str}` : `${str}-`;
      }
    });

    return Object.assign(params, {'task-signature' : params['taskName'] += `-${ paramSignature }`});
  }


});

export { Symmetry };

