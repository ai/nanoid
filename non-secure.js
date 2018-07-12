var url = '_~getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ'

function random (size) {
  var result = []
  while (0 < size--) {
    result.push(Math.floor(Math.random() * 256))
  }
  return result
}

module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = random(size)
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}
