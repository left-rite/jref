import { expect } from 'chai';
import { dereference } from '../src/dereference';

describe('deference()', () => {

  it('input is an object', () => {
    expect(dereference({ a: 'a' })).to.not.equal({ a: 'a' });
    expect(dereference({ a: 'a' })).to.deep.equal({ a: 'a' });
  });

  it('input is an array', () => {
    expect(dereference([ 1, 2, 3 ])).to.not.equal([ 1, 2, 3 ]);
    expect(dereference([ 1, 2, 3 ])).to.deep.equal([ 1, 2, 3 ]);
  });

  it('input is an string', () => {
    expect(dereference(' a b c ')).to.equal(' a b c ');
  });

  it('input is an number', () => {
    expect(dereference(1234)).to.equal(1234);
  });

  it('input is an null', () => {
    expect(dereference(null)).to.equal(null);
  });

  it('input is an undefined', () => {
    expect(() => dereference(undefined)).to.throw('Unexpected token u in JSON at position 0');
  });

});
