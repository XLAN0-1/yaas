const a = new Date("2022-04-21T18:00");

function calculateTimeLeft(timeInSeconds) {
  switch (timeInSeconds) {
    case timeInSeconds < 60:
      //Seconds
      return `${timeInSeconds}s`;
      break;
    case timeInSeconds < 3600:
      //Minutes
      var minutes = Math.floor(timeInSeconds / 60);
      var seconds = timeInSeconds - minutes * 60;
      return `${minutes}m ${seconds}s`;
      break;
    case timeInSeconds < 86400:
      //Hour
      var hours = Math.floor(timeInSeconds / 3600);
      var timeRemaining = timeInSeconds - hours * 3600;
      var minutes = Math.floor(timeRemaining / 60);
      var seconds = timeRemaining - minutes * 60;
      return `${hours}hr ${minutes}m ${seconds}s`;
    case timeInSeconds < 2678400:
      var days = Math.floor(timeInSeconds / 86400);
      var timeRemaining = timeInSeconds - days * 86400;
      var hours = Math.floor(timeRemaining / 3600);
      timeRemaining -= hours * 3600;
      var minutes = Math.floor(timeRemaining / 60);
      var seconds = timeRemaining - minutes * 60;
      return `${days}d ${hours}hr ${minutes}m ${seconds}s`;
      //Day
      break;
    case (timeInSeconds < 32, 140, 800):
      //Month
      var months = Math.floor(timeInSeconds / 2678400);
      var timeRemaining = timeInSeconds - months * 2678400;
      var days = Math.floor(timeRemaining / 86400);
      timeRemaining -= days * 86400;
      var hours = Math.floor(timeRemaining / 3600);
      timeRemaining -= hours * 3600;
      var minutes = Math.floor(timeRemaining / 60);
      var seconds = timeRemaining - minutes * 60;
      return `${days}d ${hours}hr ${minutes}m ${seconds}s`;
      break;
  }
}

console.log(calculateTimeLeft((a - new Date()) / 1000));
