var nanoid = require('../../')

var html = ''
for (var i = 0; i < 10; i++) {
  html += '<div>' + nanoid() + '</div>'
}
document.body.innerHTML = html
