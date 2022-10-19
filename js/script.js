let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventDescInput = document.getElementById('eventDescInput');
const eventPalInput = document.getElementById('eventPalInput');
const eventHoraInput = document.getElementById('eventHoraInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


function openModal(date) {
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = "Evento: " + eventForDay.title + 
    " \nDescrição: " + eventForDay.desc + " \nPalestrante: " + eventForDay.pal+ 
    " \nHorário: " + eventForDay.hora;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }
  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('pt-br', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);    
  }
}


function closeModal() {
  eventTitleInput.classList.remove('error');
  eventDescInput.classList.remove('error');
  eventPalInput.classList.remove('error');
  eventHoraInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  eventDescInput.value = '';
  eventPalInput.value = '';
  eventHoraInput.value = '';
  clicked = null;
  load();
}

function callApi(events) {

  fetch("https://fala-fatec.herokuapp.com/evento",{
    headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
    },
    method: "POST", redirect: 'manual',
    body: JSON.stringify({nome: eventTitleInput.value, descricao: eventDescInput.value, palestrante: eventPalInput.value,
    hora: eventHoraInput.value, data: Object.values(events.find((e => e.date === clicked)))[0]})
})
.catch(function(err) {
    console.info(err);
});
};

function saveEvent() {

  if (eventTitleInput.value && eventDescInput.value && eventPalInput.value && eventHoraInput.value) {
    eventTitleInput.classList.remove('error');
    eventDescInput.classList.remove('error');
    eventPalInput.classList.remove('error');
    eventHoraInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
      desc: eventDescInput.value,
      pal: eventPalInput.value,
      hora: eventHoraInput.value,
    });
    //console.log(Object.values(events.find((e => e.date === clicked)))[0]);
    //console.log(events.find(e => e.date === clicked));
    //const keys = Object.keys(events);
    //console.log(Object.values(events => events.date)[0]);
    
    callApi(events);
    localStorage.setItem('events', JSON.stringify(events));
    
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
    eventDescInput.classList.add('error');
    eventPalInput.classList.add('error');
    eventHoraInput.classList.add('error');
  }
}

function onEditPressed(){
/*
  openModal();
  deleteEventModal.style.display = 'none';
  var events = localStorage.getItem('events')
  events['events'] = eventTitleInput.value,  eventDescInput.value, eventPalInput.value, eventHoraInput.value;

  localStorage.setItem('events', JSON.stringify(events));

  //closeModal();
  //saveEvent();
*/

}

function deleteApi(events, delData){
  const element = document.querySelector('#delete-request-set-headers .status');

  fetch('https://fala-fatec.herokuapp.com/evento/data?data=' + delData, {
    method: 'DELETE', headers: { 'Content-type': 'application/json; charset=UTF-8'},
  })
  
/*
  const element = document.querySelector('#delete-request-set-headers .status');
  const requestOptions = {
      method: 'DELETE',
      headers: { 
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
  };
  fetch('http://localhost:8080/evento/data?data=9/29/2022', )
      .then(() => element.innerHTML = 'Delete successful');
      */
}

function deleteEvent() {

  const delData = (Object.values(events.find((e => e.date === clicked)))[0]);
  events = events.filter(e => e.date !== clicked);
  deleteApi(events, delData);
  localStorage.setItem('events', JSON.stringify(events));

  closeModal();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
  //document.getElementById('editButton').addEventListener('click', onEditPressed);
}

initButtons();
load();
