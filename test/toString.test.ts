import { expect } from 'chai';
import { toString } from '../src/toString';

describe('toString()', () => {

  const object = { 
    a: { 
      b: [1, 2, 3], 
      c: null,
      d: {},
      e: '',
      f: 0,
      g: false
    } 
  };

  it('to convert a JSON object to string', () => {
    expect(typeof toString(object)).to.be.equal('string');
  });
  
});
