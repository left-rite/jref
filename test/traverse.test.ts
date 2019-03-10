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

  it('an array when reference is in uri fragment representation', () => {
    expect(traverse(object, '#/a/b/0/c')).to.equal(1);
  });

  it('when target is null when reference is in uri fragment representation', () => {
    expect(traverse(object, '#/z/y/x')).to.be.equal(null);
  });
  
  it('when pointer has funny symbols when reference is in uri fragment representation', () => {
    expect(traverse(object, '#/~1/~0')).to.deep.equal({ '!': 'wow' });
  });

  it('will throw if references an external object', () => {
    expect(() => traverse(object, 'external#/step')).to.throw('The library does not support foreign references external#/step');
  });

  it('will not throw if references the object\'s own id', () => {
    expect(traverse(object, 'self#/~1/~0')).to.deep.equal({ '!': 'wow' });
  });

  it('will be successful when reference is in json string representation', () => {
    expect(traverse(object, '/~1/~0')).to.deep.equal({ '!': 'wow' });
  });
  
  it('will throw if reference doesn\'t make sense (missing leading /)', () => {
    expect(() => traverse(object, 'self#~1/~0')).to.throw('Bad JSON pointer self#~1/~0');
  });

  it('will throw if reference doesn\'t make sense (no /)', () => {
    expect(() => traverse(object, 'self#~1')).to.throw('Bad JSON pointer self#~1');
  });

});

describe('navigate() JSON string representation examples', () => {
  const object = {
    foo: ['bar', 'baz'],
    '': 0,
    'a/b': 1,
    'c%d': 2,
    'e^f': 3,
    'g|h': 4,
    'i\\j': 5,
    'k\"l': 6,
    ' ' : 7,
    'm~n': 8
  };

  it('"" will evaluate to the whole object', () => {
    expect(traverse(object, '')).to.equal(object);
  });
 
  it('"/foo" will evaluate to object.foo', () => {
    expect(traverse(object, '/foo')).to.equal(object.foo).and.deep.equal(['bar', 'baz']);
  });

  it('"/foo/0" will evaluate to object.foo[0]', () => {
    expect(traverse(object, '/foo/0')).to.equal(object.foo[0]).and.equal('bar');
  });

  it('"/" will evaluate to object[""]', () => {
    expect(traverse(object, '/')).to.equal(object[""]).and.equal(0);
  });
  
  it('"/a~1b" will evaluate to object["a/b"]', () => {
    expect(traverse(object, '/a~1b')).to.equal(object["a/b"]).and.equal(1);
  });
  
  it('"/c%d" will evaluate to object["c%d"]', () => {
    expect(traverse(object, '/c%d')).to.equal(object["c%d"]).and.equal(2);
  });

  it('"/e^f" will evaluate to object["e^f"]', () => {
    expect(traverse(object, '/e^f')).to.equal(object["e^f"]).and.equal(3);
  });
  
  it('"/g|h" will evaluate to object["g|h"]', () => {
    expect(traverse(object, '/g|h')).to.equal(object["g|h"]).and.equal(4);
  });
  
  it('"/i\\j" will evaluate to object["i\\j"]', () => {
    expect(traverse(object, '/i\\j')).to.equal(object["i\\j"]).and.equal(5);
  });
  
  it('"/k\"l" will evaluate to object["k\"l"]', () => {
    expect(traverse(object, '/k\"l')).to.equal(object["k\"l"]).and.equal(6);
  });
  
  it('"/ " will evaluate to object[" "]', () => {
    expect(traverse(object, '/ ')).to.equal(object[" "]).and.equal(7);
  });
  
  it('"/m~0n" will evaluate to object[m/n]', () => {
    expect(traverse(object, '/m~0n')).to.equal(object["m~n"]).and.equal(8);
  });

});

describe('navigate() URI fragment identifier representation examples', () => {
  const object = {
    foo: ['bar', 'baz'],
    '': 0,
    'a/b': 1,
    'c%d': 2,
    'e^f': 3,
    'g|h': 4,
    'i\\j': 5,
    'k\"l': 6,
    ' ' : 7,
    'm~n': 8
  };

  it('"#" will evaluate to the whole object', () => {
    expect(traverse(object, '#')).to.equal(object);
  });
  
  it('"#/foo" will evaluate to object.foo', () => {
    expect(traverse(object, '#/foo')).to.equal(object.foo).and.deep.equal(['bar', 'baz']);
  });

  it('"#/foo/0" will evaluate to object.foo[0]', () => {
    expect(traverse(object, '#/foo/0')).to.equal(object.foo[0]).and.equal('bar');
  });

  it('"#/" will evaluate to object[""]', () => {
    expect(traverse(object, '#/')).to.equal(object[""]).and.equal(0);
  });
  
  it('"#/a~1b" will evaluate to object["a/b"]', () => {
    expect(traverse(object, '#/a~1b')).to.equal(object["a/b"]).and.equal(1);
  });
  
  it('"#/c%25d" will evaluate to object["c%d"]', () => {
    expect(traverse(object, '#/c%25d')).to.equal(object["c%d"]).and.equal(2);
  });

  it('"#/e%5Ef" will evaluate to object["e^f"]', () => {
    expect(traverse(object, '#/e%5Ef')).to.equal(object["e^f"]).and.equal(3);
  });
  
  it('"#/g%7Ch" will evaluate to object["g|h"]', () => {
    expect(traverse(object, '#/g%7Ch')).to.equal(object["g|h"]).and.equal(4);
  });
  
  it('"#/i%5Cj" will evaluate to object["i\\j"]', () => {
    expect(traverse(object, '#/i%5Cj')).to.equal(object["i\\j"]).and.equal(5);
  });
  
  it('"#/k%22l" will evaluate to object["k\"l"]', () => {
    expect(traverse(object, '#/k%22l')).to.equal(object["k\"l"]).and.equal(6);
  });
  
  it('"#/%20" will evaluate to object[" "]', () => {
    expect(traverse(object, '#/%20')).to.equal(object[" "]).and.equal(7);
  });
  
  it('"#/m~0n" will evaluate to object[m/n]', () => {
    expect(traverse(object, '#/m~0n')).to.equal(object["m~n"]).and.equal(8);
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
