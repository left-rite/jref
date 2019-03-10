import { toString } from './toString';

export function traverse(object: any, pointer: string): any {
  const ref = pointer.split('#');

  const [id, path, decoder] = isFragment(pointer) ? [ ref[0], ref[1], decodeURIComponent ] : [ '', ref[0], (i) => i ];

  if (id !== '' && id !== object.id) {
    throw new Error(`The library does not support foreign references ${pointer}`); 
  }

  const parts = path.split('/');

  if (!parts.length || parts[0] !== '') {
    throw new Error(`Bad JSON pointer ${pointer}`);
  }

  return stepThrough(object, parts.slice(1), decoder);
}

export function isFragment(pointer: string): boolean {
  if (!pointer.includes('#')) {
    return false;
  }
  
  if (pointer.match(/#/g).length === 1) {
    return true;
  }

  throw new Error(`Bad URI fragment identifier ${pointer}`);
}

export function stepThrough(object: any, keys: string[], decoder: (str: string) => string = decodeURIComponent): any {
  if (!keys.length) {
    return object;
  }

  const key = decoder(keys.shift()).replace(/~0/g, '~').replace(/~1/g, '/');

  if (object[key] === undefined) {
    throw new Error(`Object does not have a property of '${key}' ${toString(object)}`);
  }
  
  return stepThrough(object[key], keys, decoder);
}
