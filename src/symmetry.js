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

