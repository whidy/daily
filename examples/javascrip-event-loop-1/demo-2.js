console.log(1);
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log('2-' + i);
  }, 0);
}
console.log(3);