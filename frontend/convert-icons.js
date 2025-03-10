const fs = require('fs');

const icons = {
  '16': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAJNJREFUOE+lk9ENgCAMRLkZ3ANncQ4ncRYHcQ+b0AYKtLSgxo/m0vJ6LQXhZ5T6EJExxjhSSiGEgJzzLbTW4JyDUupazrkXQghQWmtYa2/BWgvee6SUbsEYA2PMI+CcgxDiEbTWoJR6BMaY3oFS6u0Heu+htX697kIp5Tcg4pwTtm3rAlLKvhN570sp2Pc9xhihtf7vRBcUwpgxP3JJjwAAAABJRU5ErkJggg==',
  '32': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAMlJREFUWIXtlsENwyAMRf+NsgfZo+yRPcoeyR5lD7JH2SNkE2IUB2MbSFW1h77EAfnZBvwMRBwAPgDOEMI7xnhSSt05Z1prbRiGm7X2Za19WWvfxpjTGHOWUlBrRa31R0AIAcx8G2PMtNYihICU0o+gtRbOOQghbgEzg4jAzF3QWoNS6hHEGOG9fwS11m4gpQRmfgQppS6Qc4b3/hHknLuAlBLWWjjnuoAQ4n8/0HtBSgkxxv4VtNYgpewGvPcgIqSUkHPGuq7YtmD+zi/6Arh2mDHqB2qfAAAAAElFTkSuQmCC',
  '64': 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAQJJREFUeJzt2rENwzAMRUEp8h7eI+yRPbJH2CPsUfYI3iQpFBhwYUmUZOh9wIULFi8U9XFIkiRJkiRJ0r/ZxvhSSt+U0qeUcuWcP3POr1LKO+d8xhiP1tq9tfZsrd1ba4/W2q21dqWUHjHGR4zxFWM8Y4xXjPFMKZ0xxnNd13Nd13Nd13Nd13ld13ld13Vd13Vd13Vd13X9z/Xrx3Dbtm3btm3btm3btm3btm3btm3btm3b9h/b2zkncs7knBE5I3LG5AzKGZUzLGdczsCcsTlDc8bmDM4ZnTM8Z3zOAzgP4TyI8yjOwzgP5Dxyn7/0SpIkSZIkSdLv+QKXz6iN6crHfQAAAABJRU5ErkJggg==',
  '80': 'iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABHNCSVQICAgIfAhkiAAAARZJREFUeJzt3DEOgzAQRUEX5T7cI9wj9yj3CPfI9yh7hG5DFVlRItnG/jcjaKLi54XFNmYDAAAAAAAAAAAAgH/tEfFIKT1TSo+U0p5zvqWU7imlW0rpmnO+5JwvOedzzvm87/sppbSllLaU0pZS2lJKW0ppSyltKaUtpbSllLaU0pZS2lJKW0ppSyltKaUtpbSllLaU0pZS2lJKW0ppSyltKaUtpbSllLaU0pZS2lJKW0ppSyltKaUtpbSllLaU0pZS2lJKW0ppSyltKaUtpbSllLaU0pZS2lJKW0ppSyltKaUtpbSllLaU0pZS2lJKW0ppSyltKaUtpbSllLaU0pZS2lJKW0ppSyn9BfkCHR/h5SIxNNYAAAAASUVORK5CYII='
};

Object.entries(icons).forEach(([size, base64]) => {
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(`public/assets/icon-${size}.png`, buffer);
}); 