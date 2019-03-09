import { expect } from 'chai';
import { clone } from '../src/clone';

describe('clone()', () => {

  const original = { a: { b: [1, 2, 3], c: null } };
  const duplicate = clone(original);

  it('duplicate object should not reference the same object as the original', () => {
    expect(duplicate).to.not.be.equal(original);
  });
  
  it('duplicate object should look the same as the original object', () => {
    expect(duplicate).to.deep.equal(original);
  });

});
