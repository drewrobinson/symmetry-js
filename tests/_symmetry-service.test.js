import { Symmetry } from "../src/symmetry";
import { Model } from "../src/symmetry-model";

let instance;

class MockService extends Symmetry.Service {
  
  constructor(){
    super('MOCK_MODEL_UPDATED');
  }
  
}

beforeEach(() => {
  instance = new MockService();
});

describe('Service class', () => {
  
  test('Service should have constructor', () => {  
    expect.any(instance);
  });
  
  
  test('Service should throw TypeError if super is called without msg argument of type string', () => { 
    
    class BadService extends Symmetry.Service {
      constructor(){
        super();
      }
    }

    expect(() => {
      new BadService()
    }).toThrow(TypeError);
  });
  
  
  test('Service should have bus property an instance of PubSub', () => {  
    expect(instance.bus instanceof Symmetry.PubSub).toBe(true);
  });
  
  
  test('Service should have model property an instance of Model', () => {  
    expect(instance.model instanceof Model).toBe(true);
  });
  
});