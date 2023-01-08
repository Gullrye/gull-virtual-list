export const throttle = (fn, delay) => {
  let timer
  return function () {
    const that = this
    const args = arguments
    if (timer) return
    timer = setTimeout(function () {
      fn.apply(that, args)
      timer = null
    }, delay)
  }
}
