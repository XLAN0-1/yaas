const timeIntervalsQuotient = [32140800, 2678400, 86400, 3600, 60];

// //Currency selected
// currenyChanged = () => 
//   let currency = document.querySelector(".currency-field").value;
//   document.querySelector(".form-currency").value = currency;
// };

// //Event listener for when the user changes currency
// document
//   .querySelector(".currency-field")
//   .addEventListener("change", currenyChanged);


// console.log("Just let's be connected");


//A function to calculate the time interval
calculateTimeLeft = (timeRemaining, data, timeIntervalsQuotient, index)=>{
  if(index == 5){
      data[index] = Math.floor(timeRemaining);
      return data;
  }else{
      const time = Math.floor(timeRemaining / timeIntervalsQuotient[index]);
      const timeLeft = timeRemaining - (time * timeIntervalsQuotient[index]);
      data[index] = time;
      index += 1;
      return calculateTimeLeft(timeLeft, data, timeIntervalsQuotient, index);
  }
}

formatTime = (timeData)=>{
    if(timeData[0] !== 0){
      return `${timeData[0]}yr ${timeData[1]}m ${timeData[2]}d ${timeData[3]}hr ${timeData[4]}m ${timeData[5]}s`;
    }else if(timeData[1] !== 0){
      return `${timeData[1]}m ${timeData[2]}d ${timeData[3]}hr ${timeData[4]}m ${timeData[5]}s`;
    }else if(timeData[2] !== 0){
      return `${timeData[2]}d ${timeData[3]}hr ${timeData[4]}m ${timeData[5]}s`;
    }else if(timeData[3] !== 0){
      return `${timeData[3]}hr ${timeData[4]}m ${timeData[5]}s`;
    }else if(timeData[4] !== 0){
      return `${timeData[4]}m ${timeData[5]}s`;
    }else if(timeData[5] !== 0){
      return `${timeData[5]}s`;
    }
} 


setInterval(()=>{
  document.querySelectorAll(".auction-deadline").forEach((value)=>{
    const auctionDeadline = new Date(value.getAttribute("value"));
    const timeLeftInMillis = auctionDeadline - new Date();
    const timeLeftInSeconds = timeLeftInMillis / 1000;
    const formatedDate = timeLeftInSeconds >= 0 ? formatTime(calculateTimeLeft(timeLeftInSeconds, [], timeIntervalsQuotient, 0)): "RESOLVED";
    value.textContent = formatedDate;
  })
}, 1000);