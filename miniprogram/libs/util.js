export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function debounce(fn, wait=500) {
  var timer = null;

  return function () {
    if (timer) {
      clearTimeout(timer);x
    }
    timer = setTimeout(fn, wait);
  }
}