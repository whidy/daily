let bar = 0
function foo() {
  bar++
  if (bar > 0) {
    return foo()
  }
}
foo()
