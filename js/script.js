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

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
    eventDescInput.classList.add('error');
    eventPalInput.classList.add('error');
    eventHoraInput.classList.add('error');
  }
}

function onEdit(pal) {
  selectedRow = pal.parentElement.parentElement;
  document.getElementById("eventTitleInput").value = selectedRow.cells[0].innerHTML;
  document.getElementById("eventDescInput").value = selectedRow.cells[1].innerHTML;
  document.getElementById("eventPalInput").value = selectedRow.cells[2].innerHTML;
  document.getElementById("eventHoraInput").value = selectedRow.cells[3].innerHTML;
}
function updateRecord(events) {
  selectedRow.cells[0].innerHTML = events.title;
  selectedRow.cells[1].innerHTML = events.desc;
  selectedRow.cells[2].innerHTML = events.pal;
  selectedRow.cells[3].innerHTML = events.hora;
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
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
  document.getElementById('editButton').addEventListener('click', onEdit);
}

initButtons();
load();