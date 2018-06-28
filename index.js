var express = require('express');
var app = express();
var path = require('path');
var responses = require('./responses')


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use(express.static('client'))

app.get('/ballme/:id', function(req, res) {
  var val = psuedoMaths(req.params.id)
  var resp = ''
  if (val > 0 && val < 0.3) {
    resp = responses.negative[Math.floor(Math.random() * responses.negative.length)]
  } else if ( val > 0.3 && val < 0.6) {
    resp = responses.neutral[Math.floor(Math.random() * responses.neutral.length)]
  } else {
    resp = responses.positive[Math.floor(Math.random() * responses.positive.length)]
  }

  res.send({result: resp}, 200);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`app listening on localhost:${process.env.PORT || 8080}`)
});

function psuedoMaths(id) {
  var kludge = String(Number(id) / 3.14)
  var pC = kludge.substring(kludge.length - 2,kludge.length) / 100
  return pC
}

//https://js.tensorflow.org/#getting-started