import { expect } from 'chai';
import { toString } from '../src/toString';
import { stepThrough, traverse } from '../src/traverse';

const object = { 
  a: { 
    b: [
      {
        c: 1
      },
      {
        c: 2
      },
      {
        c: 3
      }
    ]
  },
  z: {
    y: {
      x: null
    }
  },
  '/': {
    '~': {
      '!': 'wow'
    }
  },
  id: 'self'
};

describe('navigate()', () => {

  it('an array', () => {
    expect(traverse(object, '#/a/b/0/c')).to.equal(1);
  });

  it('when target is null', () => {
    expect(traverse(object, '#/z/y/x')).to.be.equal(null);
  });
  
  it('when pointer has funny symbols', () => {
    expect(traverse(object, '#/~1/~0')).to.deep.equal({ '!': 'wow' });
  });

  it('will throw if references an external object', () => {
    expect(() => traverse(object, 'external#/step')).to.throw('The library does not support foreign references external#/step');
  });

  it('will not throw if references the object\'s own id', () => {
    expect(traverse(object, 'self#/~1/~0')).to.deep.equal({ '!': 'wow' });
  });

  it('will throw if reference doesn\'t make sense (missing #)', () => {
    expect(() => traverse(object, '/~1/~0')).to.throw('The library does not support foreign references /~1/~0');
  });
  
  it('will throw if reference doesn\'t make sense (missing leading /)', () => {
    expect(() => traverse(object, 'self#~1/~0')).to.throw('Bad JSON pointer self#~1/~0');
  });

  it('will throw if reference doesn\'t make sense (no /)', () => {
    expect(() => traverse(object, 'self#~1')).to.throw('Bad JSON pointer self#~1');
  });

});

describe('stepThrough()', () => {
  
  it('no step', () => {
    expect(stepThrough(object, [])).to.deep.equal(object);
  });

  it('single step', () => {
    expect(stepThrough(object, ['a'])).to.deep.equal(object.a);
  });
  
  it('multiple steps', () => {
    expect(stepThrough(object, ['z', 'y', 'x'])).to.deep.equal(object.z.y.x);
  });

  it('incorrect step', () => {
    expect(() => stepThrough(object, ['z', 'y', 'v'])).to.throw(`Object does not have a property of 'v' ${toString(object.z.y)}`);
  });

});
