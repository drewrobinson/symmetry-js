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

import { Symmetry } from "../src/symmetry";

describe('Mediator Class', () => {

  test('Mediator should have constructor', () => {  
    expect.any(Symmetry.Mediator);
  });

  test('Mediator should have taskQueue property of type array', () => {  
    expect(Array.isArray(Symmetry.Mediator.taskQueue)).toBe(true);
  });

  test('Mediator should have taskMap property of type object', () => {  
    expect(typeof Symmetry.Mediator.taskMap === 'object' && Symmetry.Mediator.taskMap !== null).toBe(true);
  });

  test('Mediator should have processingMap property of type object', () => {  
    expect(typeof Symmetry.Mediator.processingMap === 'object' && Symmetry.Mediator.processingMap !== null).toBe(true);
  });

  test('Mediator should have queueConcurrency property of type number', () => {  
    expect(typeof Symmetry.Mediator.queueConcurrency === 'number').toBe(true);
  });

  test('Mediator should have tasksProcessing property of type number', () => {  
    expect(typeof Symmetry.Mediator.tasksProcessing === 'number').toBe(true);
  });

  test('Mediator should have componentBus an instance of PubSub', () => {  
    let componentBus = Symmetry.Mediator.constructor.getComponentBus();
    expect(componentBus instanceof Symmetry.PubSub).toBe(true);
  });

  test('Mediator should have serviceBus an instance of PubSub', () => {  
    let serviceBus = Symmetry.Mediator.constructor.getServiceBus();
    expect(serviceBus instanceof Symmetry.PubSub).toBe(true);
  });

  test('Mediator should have registerService method', () => {  
    expect(typeof Symmetry.Mediator.registerService === 'function').toBe(true);
  });

  
});//-->

describe('Mediator.registerService', () => {

  test('Mediator.registerService should throw TypeError if argument cannot be instantiated', () => {
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      
      mockServiceMethod(){
        //console.log('mock service method');
      }
    }
    
    expect(() => {
      Symmetry.Mediator.registerService(MockService);
      Symmetry.Mediator.unregisterService(MockService);
    }).toBeTruthy();
    
    expect(() => {
      Symmetry.Mediator.registerService('');
      
    }).toThrow(TypeError);
    
  });
  
  
  test('Mediator.registerService should throw TypeError if service name conflicts in taskMap ', () => {
     
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      mockServiceMethod(){
        //console.log('mock service method');
      }
    }
    
    Symmetry.Mediator.registerService(MockService);
    
    expect(() => {
      Symmetry.Mediator.registerService(MockService);
    }).toThrow(TypeError);
    
    Symmetry.Mediator.unregisterService(MockService);
   
  });
  
  
  test('Mediator.registerService should parse service and entry in taskMap including name, message, service, fn for each service method', () => {
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      mockServiceMethod(){
        //console.log('mock service method');
      }
    }
    
    Symmetry.Mediator.registerService(MockService);
    
    expect(Symmetry.Mediator.taskMap.hasOwnProperty('mockServiceMethod')).toBeTruthy();
    expect(Symmetry.Mediator.taskMap['mockServiceMethod'].hasOwnProperty('name')).toBeTruthy();
    expect(Symmetry.Mediator.taskMap['mockServiceMethod'].hasOwnProperty('message')).toBeTruthy();
    expect(Symmetry.Mediator.taskMap['mockServiceMethod'].hasOwnProperty('service')).toBeTruthy();
    expect(Symmetry.Mediator.taskMap['mockServiceMethod'].hasOwnProperty('fn')).toBeTruthy();
    
    Symmetry.Mediator.unregisterService(MockService);
    
  });
  
  
  test('Mediator.registerService should registerMessage (Service Model Message) with serviceBus and componentBus', () => {
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      mockServiceMethod(){
        //console.log('mock service method');
      }
    }
    
    let serviceBus = Symmetry.Mediator.constructor.getServiceBus();
    let componentBus = Symmetry.Mediator.constructor.getComponentBus();
    
    let registerServiceBusMessageSpy = jest.spyOn(serviceBus, 'registerMessage');
    let registerComponentBusMessageSpy = jest.spyOn(componentBus, 'registerMessage');
    
    Symmetry.Mediator.registerService(MockService);
        
    expect(registerServiceBusMessageSpy).toHaveBeenCalled();
    expect(registerComponentBusMessageSpy).toHaveBeenCalled();
    
    expect(serviceBus.messages.hasOwnProperty('MOCK_MODEL_UPDATED')).toBeTruthy();
    expect(serviceBus.messages.hasOwnProperty('MOCK_MODEL_UPDATED')).toBeTruthy();
    
    Symmetry.Mediator.unregisterService(MockService);
    
  });
    
  
});//-->

describe('Mediator.queueTask', () => {

  test('Mediator.queueTask taskName argument should be registered in taskMap', () => {
    
    let badTask = 'nonRegisteredTaskName';
    
    expect(() => {
      Symmetry.Mediator.queueTask(badTask);
    }).toThrow(ReferenceError);
    
  });
  
  
  test('Mediator.queueTask should throw TypeError if taskName argument is not of type string', () => {
    expect(() => {
      Symmetry.Mediator.queueTask({});
    }).toThrow(TypeError);
  });
  
  
  test('Mediator.queueTask should assign task name as key in processingMap with value of 1', done => {
    
    let taskName = 'mockServiceMethod';
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      
      mockServiceMethod(dequeueTask, params){
        let self = this;
        setTimeout(function(){
          expect(Symmetry.Mediator.processingMap[taskName]).toBe(1);
          dequeueTask();
          Symmetry.Mediator.unregisterService(MockService);
          done();        
        }, 700);
        
      }
    }
    
    Symmetry.Mediator.registerService(MockService);
    
    Symmetry.Mediator.queueTask(taskName);
    
  });
  
  test('Mediator.queueTask should disregard request if task is already processing', done => {
    
    let taskName = 'mockServiceMethod';
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      
      mockServiceMethod(dequeueTask, params){
        //Ensure Still Processing by removing dequeueTask();
      }
    }
    
    Symmetry.Mediator.registerService(MockService);
  
    Symmetry.Mediator.queueTask(taskName);
    
    expect(Symmetry.Mediator.queueTask(taskName)).toBe('disregarded');
   
    Symmetry.Mediator.unregisterService(MockService);
    
    done();
    
  });
   
  
});//-->


describe('Mediator.dequeueTask', () => {
  test('Mediator.dequeueTask should assign task name as key in processingMap to value of 0', done => {
    
    let taskName = 'mockServiceMethod';
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      
      mockServiceMethod(dequeueTask, params){
        setTimeout(function(){
       
          dequeueTask();
          expect(Symmetry.Mediator.processingMap[taskName]).toBe(0);
          Symmetry.Mediator.unregisterService(MockService);
          
          done();
        }, 700);
      }
    }
    
    Symmetry.Mediator.registerService(MockService);
    
    Symmetry.Mediator.queueTask(taskName);
  });
  
  
  test('Mediator.dequeueTask should allow same task to be queued and processed again', done => {
      
      let taskName = 'mockServiceMethod';
      
      class MockService extends Symmetry.Service {
        constructor(){
          super('MOCK_MODEL_UPDATED');
        }
        
        mockServiceMethod(dequeueTask, params){
          let self = this;
          setTimeout(function(){
           
            dequeueTask();
            
            expect(Symmetry.Mediator.processingMap[taskName]).toBe(0);
            
            Symmetry.Mediator.queueTask(taskName);
            
            expect(Symmetry.Mediator.processingMap[taskName]).toBe(1);
            
            Symmetry.Mediator.unregisterService(MockService);
            
            done();
            
          
          }, 700);
          
        }
      }
      
      Symmetry.Mediator.registerService(MockService);
      
      Symmetry.Mediator.queueTask(taskName);
    });
});//-->


describe('Mediator.resolveTask', () => {
  test('Mediator.resolveTask should return a promise', () => {
    
    let taskName = 'mockServiceMethod';
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      
      mockServiceMethod(dequeueTask, params){
        let self = this;
        self.model.setData({'mock-property':'mock-value'});
        dequeueTask();
        
      }
    }
    
    Symmetry.Mediator.registerService(MockService);
    
    let promise = Symmetry.Mediator.resolveTask(taskName, null, 'mock-property');
    expect(promise instanceof Promise).toBeTruthy();
    Symmetry.Mediator.unregisterService(MockService);
  });

  it('Mediator.resolveTask should return a resolve with requested data model property', async () => {
    let taskName = 'mockResolveTask';
    
    class MockService extends Symmetry.Service {
      constructor(){
        super('MOCK_MODEL_UPDATED');
      }
      
      mockResolveTask(dequeueTask, params){
        let self = this;
        self.model.setData({'mock-property':'mock-value'});
        dequeueTask();
        
      }
    }
    
    Symmetry.Mediator.registerService(MockService);
    
    try {
      let data = await Symmetry.Mediator.resolveTask(taskName, null, 'mock-property');
      expect(data).toEqual('mock-value');
      Symmetry.Mediator.unregisterService(MockService);
    } catch (e) {
      console.log('---- error : ', e);
    }
  });
});//-->

