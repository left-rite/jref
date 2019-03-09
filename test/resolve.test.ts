import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as t from '../src/traverse';
import { resolve } from '../src/resolve';
chai.use(sinonChai);

const expect = chai.expect;

describe('resolve()', () => {

  let spy;

  beforeEach('set-up spies', () => {
    spy = sinon.spy(t, 'traverse');
  });

  afterEach('reset spies', () => {
    spy.restore();
  });

  it('will find reference from object if its not in memory', () => {
    const object = {
      a: {
        $ref: '#/references/a'
      },
      references: {
        a: { b: 'b' }
      }
    };

    const resolved = resolve(object);
    
    expect(resolved).to.deep.equal({
      a: { b: 'b' },
      references: {
        a: { b: 'b' }
      }
    });

    expect(spy).to.be.calledOnce;
  });

  it('will get from memory it is available', () => {
    const object = {
      a: {
        $ref: '#/references/a'
      },
      references: {
        a: { b: 'b' }
      }
    };

    const memory = { '#/references/a': { b: 'b' } };
    const resolved = resolve(object, object, memory);

    expect(resolved).to.deep.equal({
      a: { b: 'b' },
      references: {
        a: { b: 'b' }
      }
    });

    expect(spy).to.not.be.called;
  });

  it('will remember chained references', () => {
    const object = {
      a: {
        b: {
          $ref: '#/references/b'
        }
      },
      b: {
        $ref: '#/references/b'
      },
      references: {
        b: {
          be: {
            $ref: '#/references/bee'
          }
        },
        bee: {
          buzz: true
        }
      }
    };

    const resolved = resolve(object);

    expect(resolved).to.deep.equal({
      a: {
        b: {
          be: {
            buzz: true
          }
        }
      },
      b: {
        be: {
          buzz: true
        }
      },
      references: {
        b: {
          be: {
            buzz: true
          }
        },
        bee: {
          buzz: true
        }
      }
    });
    
    expect(spy).to.be.calledTwice;
  });

  it('will throw if $ref has sibling properties', () => {
    const object = {
      a: {
        $ref: '#/ref/a/b/c',
        sibling: { $ref: '#/ref/a/b/c' }
      },
      ref: {
        a: { b: { c: null } }
      }
    };  

    expect(() => resolve(object)).to.throw(`References cannot have sibling properties ${object.a}`);
  });

  it('will resolve if its an array of $ref objects', () => {
    const object = {
      arr: [
        {
          $ref: '#/definitions/a/z'
        },
        {
          $ref: '#/definitions/b/y'
        }
      ],
      definitions: {
        a: { z: 'z' },
        b: { y: 'y' }
      }
    };

    const resolved = resolve(object);

    expect(resolved).to.deep.equal({
      arr: [
        'z',
        'y'
      ],
      definitions: {
        a: { z: 'z' },
        b: { y: 'y' }
      }
    });

    expect(spy).to.be.calledTwice;
  });

  it('will not modify object if there are no references', () => {
    const object = {
      no: { references: true }
    };

    const resolved = resolve(object);
    
    expect(resolved).to.equal(object);

    expect(spy).to.not.be.called;
  });

});
