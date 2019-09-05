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