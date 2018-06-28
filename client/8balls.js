$(function() {
  var ball = $('.ball'),
  number = $('.number'),
  result = $('.result');

  function tickleBall() {
    if (!number.hasClass('number--move')) {
      ball.addClass('ball--shake');
      
      setTimeout(function() {
        number.addClass('number--move');
        ball.removeClass('ball--shake');
        result.addClass('result--move');
      }, 2000);
    } else {
      number.removeClass('number--move');
      ball.removeClass('ball--shake');
      result.removeClass('result--move');
    }
  }

  var button = $("button")
  button.on('click', function() {
    $.get("/ballme/"+$("input").val(), function(data) {
      result.html(data.result.text);
      tickleBall()
    })
  })
});