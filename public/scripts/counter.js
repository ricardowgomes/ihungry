$(() => {

  const twentyMinutes = 60 * 20,
  const display = $('#counter');
  $('#checkout').on('click', countDown(twentyMinutes, display));

});


const countDown = function (duration, display) {
  let timer = duration, minutes, seconds;

  setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.text(minutes + ":" + seconds);

      if (timer <= 0) {
          timer = duration;
      }
  }, 1000);
};




//   document.getElementById("demo").innerHTML = "YOU CLICKED ME!";

