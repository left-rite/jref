import { expect } from 'chai';
import { getProperties } from '../src/getProperties';

describe('getProperties()', () => {

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

  it('to get a single property when its the only 1', () => {
    expect(getProperties(object)).to.contain.members(['a']);
  });

  it('to get all properties of an object no matter the property type', () => {
    expect(getProperties(object.a)).to.contain.members(['b', 'c', 'd', 'e', 'f', 'g']);
  });

  const empty = {};

  it('to get no members if the object is empty', () => {
    expect(getProperties(empty)).to.deep.equal([]);
  });
  
});
