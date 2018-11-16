const fs = require('fs');
fs.readFile('file.js', () => {
  setTimeout(() => {
    console.log('5. timeout');
  }, 0);
  setImmediate(() => {
    console.log('4. immediate');
  });
  console.log('2. i/o callback');
});
setTimeout(() => {
  console.log('1. outside timeout');
}, 0);
setImmediate(() => {
  console.log('3. outside immediate');
});

// 1. outside timeout
// 2. i/o callback
// 3. outside immediate
// 4. immediate
// 5. timeout
//
// or
//
// 2. i/o callback
// 3. outside immediate
// 4. immediate
// 1. outside timeout
// 5. timeout