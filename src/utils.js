
function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

function choice(a) {
  return a[Math.floor(Math.random()*a.length)];
}

module.exports = {
  shuffle, choice
};
