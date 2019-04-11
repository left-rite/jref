import { clone } from './clone';
import { resolve } from './resolve';

export function dereference(object: any): any {

  if (object && typeof object === 'object') {
    const duplicate = clone(object);
    
    return clone(resolve(duplicate));
  }

  return clone(object);
}
