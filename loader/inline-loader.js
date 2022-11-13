function loader(source) {
  console.log('inline')
  return source
}

// pitch 有返回值就不会走后面的loader
loader.pitch = function() {
  console.log('pitch')
  return 'pitch'
}

module.exports = loader