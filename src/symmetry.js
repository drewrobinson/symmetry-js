import { App } from "./symmetry-app";
import { Component } from "./symmetry-component";
import { Service } from "./symmetry-service";
import { Mediator } from "./symmetry-mediator";
import { PubSub } from "./symmetry-pubsub";

let Symmetry = Object.create({
  
  id:'Symmetry',

  App: App,

  PubSub: PubSub,

  Component: Component,

  Service: Service,

  Mediator: new Mediator(PubSub)

});

export { Symmetry };

