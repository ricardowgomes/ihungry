$(() => {

  const twentyMinutes = 60 * 20;
  const display = $('#counter');

  const countDown = function (duration, display) {
    let minutes, seconds;
    let timer = duration;

    const interval = setInterval(function () {

      timer -= 1;
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.text(minutes + ":" + seconds);

      if (timer <= 0) {
        clearInterval(interval);
        // work on message "order status" to change when counter reaches 00:00
      }
    }, 1000);
  };


  countDown(twentyMinutes, display);
});
