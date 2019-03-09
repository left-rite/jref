import { clone } from './clone';
import { resolve } from './resolve';

export function dereference(object: any): any {
  const duplicate = clone(object);

  if (duplicate && typeof duplicate === 'object') {
    return resolve(duplicate);
  }

  return duplicate;
}
