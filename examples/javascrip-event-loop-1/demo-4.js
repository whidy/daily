setTimeout(() => {
  console.log('timeout1')
})
new Promise(function(resolve) {
  console.log('promise1')
  for (let i = 0; i < 1000; i++) {
    i === 99 && resolve()
  }
  console.log('promise2')
}).then(function() {
  console.log('then1')
})

console.log('global1')
