var url = '_~getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ'

module.exports = function (size) {
  size = size || 21
  var id = ''
  while (0 < size--) {
    id += url[Math.floor(Math.random() * 63)]
  }
  return id
}
