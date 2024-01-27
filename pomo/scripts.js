let timer;
let minutes = 25;
let seconds = 0;
let tabTitle = document.getElementById('title');
let repetition = 0;
let totalDayTime = 0;
let taskList = [
  {
    numOfPomo: 1,
    donePomo: 0,
    name: "halo",
    checked: false
  }
];
let taskId = 0;
let lastSelected;
let state = 0;
let audioBell = new Audio("sounds/bell.mp3");
let quanity = 1;
let quickSetDisplayed = false;
let toStorage = [];
let hoursFocusedToday = 0; //magazine every pomo as 25min is storage at any task, start at 0 every new day
let hoursFocused = [3, 2, 1, 5, hoursFocusedToday];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

Date.prototype.toString = function() {
  const dayOfWeek = daysOfWeek[this.getDay()];
  const dayOfMonth = this.getDate();
  const monthName = monthsOfYear[this.getMonth()];

  return `${dayOfWeek} ${dayOfMonth}-${monthName}`;
};

//today from storage, if null then new Date()
//then check if from storage equal current date
//if not move the hours (remove last from storage)

let today = new Date();
let dates = [];
for(let i=4; i>=0; i--){
  let nextDay = new Date(today);
  nextDay.setDate(today.getDate()-i);

  dates.push(nextDay.toString());
}


let dataPoints = [];


for(let i=0; i<5; i++){
  dataPoints.push({label: dates[i], y: hoursFocused[i]});
}

try {
  dataPoints[dataPoints.length-1].y = JSON.parse(localStorage.getItem('today')); 
} catch (error) {
  console.log("nothing in storage");
}

console.log(dataPoints);

console.log(taskList);

window.onload = function () {

  let chart = new CanvasJS.Chart("chartContainer", {
    theme: "light1", // "light2", "dark1", "dark2"
    animationEnabled: true, // change to true		
    title:{
      text: "Productivity graph"
    },
    data: [
    {
      // Change type to "bar", "area", "spline", "pie",etc.
      type: "column",
      dataPoints: dataPoints
    }
    ]
  });

  function updateChart(){
    chart.options.data[0].dataPoints = dataPoints;
    chart.render();
  };

updateChart();

setInterval(function() {updateChart()}, 500);
  
}


function displayAtReload(){
  estimations();
  if(taskList.length>1){
    let conteiner = document.querySelector('.task-list');
    for(let i=1; i<taskList.length; i++){
      let newTask = `
        <button onclick="checkTask(${taskId});" class="task task-${taskId} ${taskId===lastSelected ? 'task-selected' : ''}">
          <div class="left">
              <img class="img img-${taskId}" onclick="crossTask(${taskId});" src="images/check-grey.png">
              <span id="task-name-${taskId}">${taskList[i].name}</span>
          </div>
          <div class="right">
              <span id="done-pomo-${taskId}">${taskList[i].donePomo}/${taskList[i].numOfPomo}</span>
          </div>
        </button>
      `;
      taskId++;
    
      conteiner.innerHTML += newTask;
    }
  }
}

try {
  getFromStorage();
} catch (TypeError) {
  console.log("nothing in storage");
}
displayAtReload();


function estimations(){
  if(taskList.length>1){
    document.querySelector('.esti-box').classList.add('esti-box-display');
    let x = 0;
    let y = 0;
    for(let i=1; i<taskList.length; i++){
      x += taskList[i].donePomo;
      y += taskList[i].donePomo < taskList[i].numOfPomo ? taskList[i].numOfPomo-taskList[i].donePomo : 0;
      y += taskList[i].donePomo;
    }
    document.getElementById('pomo-esti').innerHTML = `${x}/${y}`;
    console.log(`${x}/${y}`);
    const { resH: hours, resM: mins, timeLeftEsti: timeLeft } = estimateTime(x, y);
    document.getElementById('time-esti').innerHTML = `${hours<10 ? '0'+hours : hours}:${mins<10 ? '0'+mins : mins}`;
    document.getElementById('time-left').innerHTML = ` (${timeLeft}h)`;
    //`${hours}:${mins}`
  }
}

function estimateTime(x, y){
  console.log("");
  const userTime = new Date();
  let hours = userTime.getHours();
  let minutes = userTime.getMinutes();

  const pomosLeft = y - x;
  console.log(pomosLeft);
  let timeLeft = 25*pomosLeft;
  let breaks15;
  let breaks5;
  let sumOfBreaks;
  if(pomosLeft-1 <= 0){
    sumOfBreaks = 0;
  }else{
    breaks15 = Math.floor((pomosLeft-1 - repetition)/3)*15;
    breaks5 = (pomosLeft-1 - breaks15)*5;
    console.log(breaks5);
    sumOfBreaks = breaks15+breaks5;
  }
  timeLeft += sumOfBreaks;
  console.log('here');
  console.log(timeLeft);
  const timeLeftEsti = (timeLeft/60).toFixed(1);
  let hoursToMins = hours*60;
  const timeEstimation = hoursToMins+minutes+timeLeft;
  console.log(timeEstimation/60);
  const resH = Math.floor(timeEstimation/60)>23 ? Math.floor(timeEstimation/60)-24 : Math.floor(timeEstimation/60);

  const resM = Math.round(timeEstimation%60);
  console.log(resH);
  console.log(resM);
  console.log('here');
  console.log(timeLeftEsti);
  return {resH, resM, timeLeftEsti};
}


function saveToStorage(){
  console.log(lastSelected);
  toStorage[0] = taskList;
  toStorage[1] = lastSelected;
  console.log(toStorage[0]);
  localStorage.setItem('toStorage', JSON.stringify(toStorage));
}

function getFromStorage(){
  let fromStorage = localStorage.getItem('toStorage');
  let deserialize = JSON.parse(fromStorage);
  console.log(deserialize[0]);
  console.log("tutaj");
  taskList = deserialize[0];
  console.log(taskList);
  lastSelected = deserialize[1];
  console.log(lastSelected);
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
  document.querySelector('.start').classList.add('start-hide');
  document.querySelector('.pause').classList.add('pause-display');
}

function stopTimer() {
  clearInterval(timer);
  document.querySelector('.start').classList.remove('start-hide');
  document.querySelector('.pause').classList.remove('pause-display');
}

function skip(){
  stopTimer();
  minutes = 0;
  seconds = 1;
  startTimer();
  updateTimer();
}

function updateTimer() {
  if (minutes === 0 && seconds === 0) {
    stopTimer();
    repetition++;
    audioBell.play();
    if(lastSelected != null && state === 0){
      taskList[lastSelected+1].donePomo++;
      console.log(taskList[lastSelected+1].donePomo);
      document.getElementById(`done-pomo-${lastSelected}`).innerHTML = `${taskList[lastSelected+1].donePomo}/${taskList[lastSelected+1].numOfPomo}`;
    }
      if(state===0){
        dataPoints[dataPoints.length-1].y += Number((25/60).toFixed(1));
        localStorage.setItem('today', JSON.stringify(dataPoints[dataPoints.length-1].y));

        if(repetition<=3){
          shortBreak();
        }else{
          longBreak();
          repetition=0;
        }
        quanity++;
        document.querySelector('.quanity').innerHTML = `#${quanity}`;
        estimations();
      }else{
        pomodoro();
      }
  } else {
    if (seconds === 0) {
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const timeDisplay = `${formattedMinutes}:${formattedSeconds}`;

    document.querySelector('.timer').innerText = timeDisplay;
    document.getElementById('title').innerHTML = timeDisplay + ' - Time to focus!';
  }
  saveToStorage();
}

function shortBreak(){
    state = 1;
    minutes = 5;
    seconds = 1;
    document.querySelector('.main-icon').href = "images/check-green.png";
    document.querySelector('.pomo').classList.remove('set-pomo');
    document.querySelector('.long').classList.remove('set-long');
    document.querySelector('.short').classList.add('set-short');

    document.getElementById('body').classList.remove('pomo-body');
    document.getElementById('body').classList.remove('long-body');
    document.getElementById('body').classList.add('short-body');

    document.querySelector('.start').classList.add('start-short');
    document.querySelector('.start').classList.remove('start-long');
    document.querySelector('.start').classList.remove('start-pomo');

    document.querySelector('.pause').classList.add('pause-short');
    document.querySelector('.pause').classList.remove('pause-long');
    document.querySelector('.pause').classList.remove('pause-pomo');
    updateTimer();
    stopTimer();
}

function longBreak(){
  state = 2;
  minutes = 15;
  seconds = 1;
  document.querySelector('.main-icon').href = "images/check-blue.png";
  document.querySelector('.pomo').classList.remove('set-pomo');
  document.querySelector('.long').classList.add('set-long');
  document.querySelector('.short').classList.remove('set-short');

  document.getElementById('body').classList.remove('pomo-body');
  document.getElementById('body').classList.add('long-body');
  document.getElementById('body').classList.remove('short-body');

  document.querySelector('.start').classList.remove('start-short');
  document.querySelector('.start').classList.add('start-long');
  document.querySelector('.start').classList.remove('start-pomo');

  document.querySelector('.pause').classList.add('pause-short');
  document.querySelector('.pause').classList.remove('pause-long');
  document.querySelector('.pause').classList.remove('pause-pomo');
  updateTimer();
  stopTimer();
}

function pomodoro(){
    state = 0;
    minutes = 25;
    seconds = 1;
    document.querySelector('.main-icon').href = "images/check-red.png";
    document.querySelector('.pomo').classList.add('set-pomo');
    document.querySelector('.long').classList.remove('set-long');
    document.querySelector('.short').classList.remove('set-short');

    document.getElementById('body').classList.add('pomo-body');
    document.getElementById('body').classList.remove('long-body');
    document.getElementById('body').classList.remove('short-body');

    document.querySelector('.start').classList.remove('start-short');
    document.querySelector('.start').classList.remove('start-long');
    document.querySelector('.start').classList.add('start-pomo');

    document.querySelector('.pause').classList.remove('pause-short');
    document.querySelector('.pause').classList.remove('pause-long');
    document.querySelector('.pause').classList.add('pause-pomo');
    updateTimer();
    stopTimer();
}

function addTask(){
  //display properly
  document.querySelector('.add-task').classList.add('add-task-disable');
  document.querySelector('.new-task').classList.add('new-task-enable');

  //set default num of pomo
  document.getElementById('num-of-pomo').value = 1;

  //focus on input
  document.getElementById('input-task').focus();
}

function cancel(){
  document.querySelector('.add-task').classList.remove('add-task-disable');
  document.querySelector('.new-task').classList.remove('new-task-enable');
}

function save(){
  //add task to taskList
  if(document.getElementById('input-task').value === ''){
    return;
  }
  let newTask = {
    numOfPomo: Number(document.getElementById('num-of-pomo').value),
    donePomo: 0,
    name: document.getElementById('input-task').value,
    checked: false
  };
  taskList.push(newTask);
  console.log(taskList);
  document.querySelector('.add-task').classList.remove('add-task-disable');
  document.querySelector('.new-task').classList.remove('new-task-enable');
  
  updateTasks();
  document.getElementById('input-task').value = '';
  estimations();
}

function updateTasks(){
  let conteiner = document.querySelector('.task-list');
  console.log(conteiner);

  let newTask = `
    <button onclick="checkTask(${taskId});" class="task task-${taskId}">
      <div class="left">
          <img class="img img-${taskId}" onclick="crossTask(${taskId});" src="images/check-grey.png">
          <span id="task-name-${taskId}">${taskList[taskList.length-1].name}</span>
      </div>
      <div class="right">
          <span id="done-pomo-${taskId}">${taskList[taskList.length-1].donePomo}/${taskList[taskList.length-1].numOfPomo}</span>
      </div>
    </button>
  `;
  taskId++;

  conteiner.innerHTML += newTask;
  saveToStorage();
}

function checkTask(i){
  if(lastSelected === i){
    return;
  }
  document.querySelector(`.task-${i}`).classList.add('task-selected');
  if(lastSelected != null){
    document.querySelector(`.task-${lastSelected}`).classList.remove('task-selected');
  }
  lastSelected = i;
  document.querySelector('.task-title').innerHTML = taskList[i+1].name;
  saveToStorage();
}

function crossTask(i){
  console.log(taskList[i+1].checked);
  if(taskList[i+1].checked === true){
    taskList[i+1].checked = false;
    document.getElementById(`task-name-${i}`).classList.remove('task-checked');
    document.querySelector(`.img-${i}`).src = "images/check-grey.png";
  }else{
    document.getElementById(`task-name-${i}`).classList.add('task-checked');
    taskList[i+1].checked = true;
    document.querySelector(`.img-${i}`).src = "images/check-red.png";
  }
}

function addPomo(){
  document.getElementById('num-of-pomo').value++;
}

function removePomo(){
  document.getElementById('num-of-pomo').value--;
}

function clearAll(){
  taskList = taskList.slice(0, 1);
  console.log(taskList);
  document.querySelector('.task-list').innerHTML = '';
  taskId = 0;
  lastSelected = null;
  document.querySelector('.esti-box').classList.remove('esti-box-display');
  quickSet();
  localStorage.removeItem('toStorage');
}

function quickSet(){
  if(quickSetDisplayed){
    document.querySelector('.quick-set').classList.remove('quick-set-display');
    quickSetDisplayed = false;
  }else{
    document.querySelector('.quick-set').classList.add('quick-set-display');
    quickSetDisplayed = true;
  }
}

function graphDisplay(){
  document.getElementById('chartContainer').classList.remove('chartContainer-disable');
}