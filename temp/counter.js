const updateCounter = (startingMinutes, counterElement) => {
  let time = startingMinutes * 60;
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  counterElement.innerHTML = `${minutes}:${seconds}`;
  time--;
};


setInterval(updateCounter, 1000, startingMinutes, counterElement);
