import { Symmetry } from "../src/symmetry";

let instance;
const GOOD_MESSAGE = 'MOCK_MESSAGE';
const BAD_MESSAGE = {}

beforeEach(() => {
  instance = new Symmetry.PubSub('mock-message-bus');
});


describe('PubSub Class', () => {
  
  test('PubSub should have constructor', () => {  
    expect.any(instance);
  });

  test('PubSub should have id property of type string', () => {  
    expect(typeof instance.id === 'string').toBeTruthy();
  });

  test('PubSub should have messages property of type object', () => {  
    expect(typeof instance.messages === 'object' && instance.messages !== null).toBeTruthy();
  });

  test('PubSub should have listeners property of type object', () => {  
    expect(typeof instance.listeners === 'object' && instance.listeners !== null).toBeTruthy();
  });

  test('PubSub should have registerMessage method', () => {  
    expect(typeof instance.registerMessage === 'function').toBeTruthy();
  });

  test('PubSub should have publish method', () => {  
    expect(typeof instance.publish === 'function').toBeTruthy();
  });

  test('PubSub should have subscribe method', () => {  
    expect(typeof instance.subscribe === 'function').toBeTruthy();
  });

  test('PubSub should have unsubscribe method', () => {  
    expect(typeof instance.unsubscribe === 'function').toBeTruthy();
  });
  
});//-->



describe('PubSub.registerMessage', () => {
  
  test('PubSub.registerMessage should throw TypeError if message argument is not of type string', () => {
    
   expect(() => {
      instance.registerMessage(BAD_MESSAGE)
    }).toThrow(TypeError);
      
  });
  
  //@TODO - write test to confirm that messages object has key set to message and value set to message
  test('PubSub.registerMessage should add msg key to messages and assign msg as value', () => {
    instance.registerMessage(GOOD_MESSAGE);
    expect( Object.keys(instance.messages).indexOf(GOOD_MESSAGE) ).toBeGreaterThan(-1);
    expect( instance.messages[GOOD_MESSAGE] === GOOD_MESSAGE).toBeTruthy();
  });
  
  test('PubSub.registerMessage should add msg key to listeners object and assign empty array as value', () => {  
    instance.registerMessage(GOOD_MESSAGE);
    expect( Object.keys(instance.listeners).indexOf(GOOD_MESSAGE) ).toBeGreaterThan(-1);
    expect( Array.isArray(instance.listeners[GOOD_MESSAGE])).toBeTruthy();
  });
  
});//-->

describe('PubSub.unregisterMessage', () => {
  
  test('PubSub.unregisterMessage should remove msg key from messages', () => {
    instance.registerMessage(GOOD_MESSAGE);
    expect( instance.messages.hasOwnProperty(GOOD_MESSAGE) ).toBeTruthy();
    instance.unregisterMessage(GOOD_MESSAGE);
    expect( instance.messages.hasOwnProperty(GOOD_MESSAGE) ).toBeFalsy();
  });
  
  test('PubSub.unregisterMessage should remove msg key from listeners', () => {
    instance.registerMessage(GOOD_MESSAGE);
    expect( instance.listeners.hasOwnProperty(GOOD_MESSAGE) ).toBeTruthy();
    instance.unregisterMessage(GOOD_MESSAGE);
    expect( instance.listeners.hasOwnProperty(GOOD_MESSAGE) ).toBeFalsy();
  });
  
  
});//-->

describe('PubSub.subscribe', () => {
  
  test('PubSub.subscribe should throw ReferenceError if message argument is unregistered', () => {
    
    let listener = {
      callback: function callback(){
        return 'listener callback invoked';
      }
    };
    
    //no call to register BAD_MESSAGE 
    expect(() => {
      instance.subscribe(BAD_MESSAGE, listener.callback, listener)
    }).toThrow(ReferenceError);
    
  });
  
  
  test('PubSub.subscribe should throw TypeError if listener argument is not of type function', () => {
    
    let listener = {
        callback: ''
    };
    
    instance.registerMessage(GOOD_MESSAGE);
    
    expect(() => {
      instance.subscribe(GOOD_MESSAGE, listener.callback, listener)
    }).toThrow(TypeError);
    
  });
  
   
  test('PubSub.subscribe should throw ReferenceError if listener argument is not named function', () => {
    
    let listener = {};
    
    instance.registerMessage(GOOD_MESSAGE);
    
    expect(() => {
      instance.subscribe(GOOD_MESSAGE, function(){}, listener)
    }).toThrow(ReferenceError);
    
  });
  
  
  test('PubSub.subscribe should throw TypeError if context argument is not object', () => {
    
    let listener = {
        callback: function callback(){
          return 'listener callback invoked';
        }
      };
    
    let badContext = '';
    
    instance.registerMessage(GOOD_MESSAGE);
    
    expect(() => {
      instance.subscribe(GOOD_MESSAGE, listener.callback, badContext);
    }).toThrow(TypeError);
    
  });
  
  test('PubSub.subscribe context argument should be added to listener object context property', () => {
    
    let listener = {
        callback: function callback(){
          return 'listener callback invoked';
        }
      };
    
    instance.registerMessage(GOOD_MESSAGE);
    
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    
    expect(instance.listeners[GOOD_MESSAGE][0].context === listener).toBeTruthy();
    
  });
  
  
  test('PubSub.subscribe message argument should be used as listeners object key', () => {  
    
    let msg = 'MESSAGE_KEY';
    
    let listener = {
      callback: function callback(){
        return 'listener callback invoked';
      }
    };
    
    instance.registerMessage(msg);
    
    instance.subscribe(msg, listener.callback, listener);
    
    expect( Object.keys(instance.listeners).indexOf(msg) ).toBeGreaterThan(-1);
    expect(typeof instance.listeners[msg][0].listener === 'function').toBeTruthy();
    expect(instance.listeners[msg][0].context === listener).toBeTruthy();
    
  });
  
  
  test('PubSub.subscribe msg list count increment by 1 per call (i.e. should be 3)', () => {  
    
    let listener = {
      callback: function callback(){
        return 'listener callback invoked';
      }
    };
    instance.registerMessage(GOOD_MESSAGE);
    
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    
    expect(instance.listeners[GOOD_MESSAGE].length).toBe(3);
  });

  
   
});//-->


describe('PubSub.unsubscribe', () => {
  
  test('PubSub.unsubscribe should throw ReferenceError if message argument is unregistered', () => {
    
    let listener = {
        callback: function callback(){
          return 'listener callback invoked';
        }
      };
    
    //no call to register BAD_MESSAGE 
    
    expect(() => {
      instance.unsubscribe(BAD_MESSAGE, listener.callback, listener)
    }).toThrow(ReferenceError);
    
  });
  
  
  test('PubSub.unsubscribe should throw TypeError if listener argument is not of type function', () => {
    
    let listener = {
        callback: ''
    };
    
    instance.registerMessage(GOOD_MESSAGE);
    
    expect(() => {
      instance.unsubscribe(GOOD_MESSAGE, listener.callback, listener)
    }).toThrow(TypeError);
    
  });
  
  
  test('PubSub.unsubscribe should throw ReferenceError if listener argument is not named function', () => {
    
    let listener = {};
    
    instance.registerMessage(GOOD_MESSAGE);
    
    expect(() => {
      instance.unsubscribe(GOOD_MESSAGE, function(){}, listener)
    }).toThrow(ReferenceError);
    
  });
  
  
  test('PubSub.unsubscribe should throw TypeError if context argument is not object', () => {
    
    let listener = {
        callback: function callback(){
          return 'listener callback invoked';
        }
      };
    
    let badContext = '';
    
    instance.registerMessage(GOOD_MESSAGE);
    
    expect(() => {
      instance.unsubscribe(GOOD_MESSAGE, listener.callback, badContext);
    }).toThrow(TypeError);
    
  });
  
  
  test('PubSub.unsubscribe msg list count should decrease by 1 per call (i.e. should be 2)', () => {  
    
    let listener = {
      callback: function callback(){
        return 'listener callback invoked';
      }
    };
    instance.registerMessage(GOOD_MESSAGE);
    
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    
    expect(instance.listeners[GOOD_MESSAGE].length).toBe(3);
    
    instance.unsubscribe(GOOD_MESSAGE, listener.callback, listener);
    expect(instance.listeners[GOOD_MESSAGE].length).toBe(2);
  });


});//-->



describe('PubSub.publish', () => {
  

 
  test('PubSub.publish should throw ReferenceError if message argument is unregistered', () => {
    
    let listener = {
        callback: function callback(){
          return 'listener callback invoked';
        }
      };
    
    //no call to register BAD_MESSAGE 
    
    expect(() => {
      instance.publish(BAD_MESSAGE, listener.callback, listener)
    }).toThrow(ReferenceError);
    
  });
  
  test('PubSub.publish should throw TypeError if data argument is undefined', () => {
    
    let listener = {
        callback: function callback(){
          return 'listener callback invoked';
        }
      };
    
    instance.registerMessage(GOOD_MESSAGE);
    
    expect(() => {
      instance.publish(BAD_MESSAGE)
    }).toThrow(ReferenceError);
    
  });
  
  
  test('PubSub.publish should invoke listener method', () => {
    
    let listener = {
        callback: jest.fn()
      };
    
    instance.registerMessage(GOOD_MESSAGE);
    instance.subscribe(GOOD_MESSAGE, listener.callback, listener);
    instance.publish(GOOD_MESSAGE, 'test');
    
    expect(listener.callback).toHaveBeenCalled();
    
  });
  
 
  test('PubSub.publish should invoke listener method each time publish is called', () => {
    
    
    let add = {
      counter: 0,
      plusOne: function(){
        this.counter += 1;
        return this.counter;
      }
    }
    
    
    instance.registerMessage(GOOD_MESSAGE);
    instance.subscribe(GOOD_MESSAGE, add.plusOne, add);
    instance.publish(GOOD_MESSAGE, 'test');
    instance.publish(GOOD_MESSAGE, 'test');
    instance.publish(GOOD_MESSAGE, 'test');
    instance.publish(GOOD_MESSAGE, 'test');
    instance.publish(GOOD_MESSAGE, 'test');
    
    expect(add.counter).toBe(5);
    
  });


  
});//-->





