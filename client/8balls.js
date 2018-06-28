$(function() {
  console.log('?')
  var ball = $('.ball'),
  number = $('.number'),
  result = $('.result');
  
  ball.on('click', function() {
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
  });

  var button = $("button")
  button.on('click', function() {
    $.get("/ballme/"+$("input").val(), function(data) {
      console.log(data.result.text)
      result.html(data.result.text);
      ball.click()
    })
  })
});