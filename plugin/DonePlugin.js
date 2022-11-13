class DonePlugin {
  constructor() {}
  apply(complier) { // complier.hooks
    complier.hooks.done.tap('DonePlugin', () => {
      console.log('编译完成')
    })
  }
}

module.exports = DonePlugin