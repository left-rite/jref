# jref
## Description
> ```jref``` traverse and dereference JSON objects quickly. 

* Currently only support internal references.
* No dependencies.

## Installation
```npm install jref```

## Example
```javascript
var jref = require('jref');

var object = {
  a: {
    b: {
      c: {
        $ref: '#/alphabet/c'
      }
    }
  },
  alphabet: {
    c: {
      soundsLike: 'see',
      one: 'stroke',
      is: 'curved'
    }
  }
};

jref.traverse(object, '#/alphabet/c');
// {
//   soundsLike: 'see',
//   one: 'stroke',
//   is: 'curved'
// }

jref.dereference(object);
// {
//   a: {
//     b: {
//       c: {
//       soundsLike: 'see',
//       one: 'stroke',
//       is: 'curved'
//     }
//   },
//   alphabet: {
//     c: {
//       soundsLike: 'see',
//       one: 'stroke',
//       is: 'curved'
//     }
//   }
// }

```





