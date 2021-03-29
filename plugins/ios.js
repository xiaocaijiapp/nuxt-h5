function checkWebp () {
  try {
    const u = navigator.userAgent
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  } catch (err) {
    return false
  }
}
window.onready = () => {
  if (checkWebp()) {
    const images = document.getElementsByTagName('img')
    images.forEach((item) => {
      let src = item.getAttribute('src')
      if (typeof src !== 'undefined') {
        src = src.replace('/format,webp', '/format,webp') // 将webp格式转换成jpg格式
        console.log(src)
        item.setAttribute('src', src)
      }
      let original = item.getAttribute('data-src')
      if (typeof original !== 'undefined') {
        original = original.replace('/format,webp', '/format,webp') // 将webp格式转换成jpg格式
        item.setAttribute('data-src', original)
      }
    })
  }
}
