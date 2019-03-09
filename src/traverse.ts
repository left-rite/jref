import { toString } from './toString';

export function traverse(object: any, pointer: string): any {
  const [hash, path] = pointer.split('#');

  if (hash.length && hash !== object.id) {
    throw new Error(`The library does not support foreign references ${pointer}`); 
  }

  if (!path) {
    throw new Error(`Bad JSON pointer ${pointer}`);
  }

  const parts = path.split('/');

  if (!parts.length || parts[0] !== '') {
    throw new Error(`Bad JSON pointer ${pointer}`);
  }

  return stepThrough(object, parts.slice(1));
}

export function stepThrough(object: any, keys: string[]): any {
  if (!keys.length) {
    return object;
  }

  const key = decodeURIComponent(keys.shift()).replace(/~0/g, '~').replace(/~1/g, '/');

  if (object[key] === undefined) {
    throw new Error(`Object does not have a property of '${key}' ${toString(object)}`);
  }
  
  return stepThrough(object[key], keys);
}
