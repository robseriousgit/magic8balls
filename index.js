var express = require('express');
var app = express();
var path = require('path');


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use(express.static('client'))
app.use('/sounds', express.static('sounds'))

app.listen(process.env.PORT || 8080, () => {
  console.log(`app listening on localhost:${process.env.PORT || 8080}`)
});