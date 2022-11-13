import './index.css'
import p from './run.jpg'
let img = document.createElement('img')
img.src = p
console.log(typeof img)
window.onload = function() {
  const div = document.querySelector('.img')
  div.appendChild(img)
}

// console.log('hello')
// // -!不会再让文件走pre normal
// // ! 没有normal
// // ！！ 都不执行
// // const str = require('-!inline-loader!./a.js')
// const str = require('./a.js')
// console.log(str)

// class Test {
//   constructor(map) {
//     console.log(map)
//   }
// }

// new Test('a')
