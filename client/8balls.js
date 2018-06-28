$(function() {
  var ball = $('.ball'),
  number = $('.number'),
  result = $('.result'),
  form = $('form'),
  input = $('input'),
  numberMoveClass = 'number--move',
  ballShakeClass = 'ball--shake',
  resultMoveClass = 'result--move';

  function tickleBall() {
    number.removeClass(numberMoveClass);
    ball.removeClass(ballShakeClass);
    result.removeClass(resultMoveClass);

    ball.addClass(ballShakeClass);
      
    setTimeout(function() {
      number.addClass(numberMoveClass);
      ball.removeClass(ballShakeClass);
      result.addClass(resultMoveClass);
    }, 2000);
  }

  form.on('submit', function(e) {
    e.preventDefault();

    $.get('/ballme/' + input.val(), function(data) {
      result.html(data.result.text);
      tickleBall();
      input.val('');
    })
  })
});