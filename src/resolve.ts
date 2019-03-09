import { getProperties } from './getProperties';
import { traverse } from './traverse';

const $ref = '$ref';

export function resolve(object: any, root: any = object, memory: Memory = {}): any {
  if (object !== null && typeof object === 'object') {
    const properties = getProperties(object);

    if (properties.includes($ref)) {
      if (properties.length !== 1) {
        throw new Error(`References cannot have sibling properties ${object}`);
      }
      
      if (memory[object.$ref] !== undefined) {
        object = memory[object.$ref];
      } else {
        const ref = traverse(root, object.$ref);
        
        object = memory[object.$ref] = resolve(ref, root, memory);
      }
    } else {
      properties.forEach((p) => object[p] = resolve(object[p], root, memory));
    }
  }

  return object;
}

interface Memory {
  [$ref: string]: any;
}
