import { Component } from "../src/symmetry-component";

test('Component should have constructor', () => {  

  let instance = new Component();
  expect.any(instance);
});