const eventManager = {
    eventsData: [],
};

document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

async function loadPage() {
    eventManager.eventsData = [];
    const updateTitle = document.getElementById('updateTitle');
    if (updateTitle) {
        updateTitle.value = '';
    }
    const updateDate = document.getElementById('updateDate');
    if (updateDate) {
        updateDate.value = '';
    }
    const addTitle = document.getElementById('addTitle');
    if (addTitle) {
        addTitle.value = '';
    }
    const addDate = document.getElementById('addDate');
    if (addDate) {
        addDate.value = '';
    }
    const deleteEvent = document.getElementById('deleteEvent');
    if (deleteEvent) {
        deleteEvent.value = '';
    }
    const updateEvent = document.getElementById('updateEvent');
    if (updateEvent) {
        updateEvent.value = '';
    }
    clearSelectOptions();
    await fetchData();
    getCalendar();
}

async function fetchData() {
    try {
        const response = await axios.get("https://localhost:7279/api/Events");
        eventManager.eventsData = response.data;
    }
    catch (error) {
        console.error('Error fetching events:', error);
    }
}

function getCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: eventManager.eventsData
    });
    calendar.render();

    const selectDeleteEvent = document.getElementById('deleteEvent');
    const selectUpdateEvent = document.getElementById('updateEvent');
    for (const event of eventManager.eventsData) {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.title;
        selectDeleteEvent.appendChild(option.cloneNode(true));
        selectUpdateEvent.appendChild(option.cloneNode(true));
    }
}

function clearSelectOptions() {
    const selectDeleteEvent = document.getElementById('deleteEvent');
    const selectUpdateEvent = document.getElementById('updateEvent');
    if (selectDeleteEvent && selectUpdateEvent) {
        while (selectDeleteEvent.firstChild) {
            selectDeleteEvent.removeChild(selectDeleteEvent.firstChild);
            selectUpdateEvent.removeChild(selectUpdateEvent.firstChild);
        }
    }
}


function addEvent() {
    const title = document.getElementById('addTitle');
    const date = document.getElementById('addDate');
    axios.post("https://localhost:7279/api/Events", {
        title: title.value,
        start: date.value
    }).then(res => {
        console.log(res);
        loadPage();
    });
}

function deleteEvent() {
    const deleteId = +document.getElementById('deleteEvent').value;
    axios.delete(`https://localhost:7279/api/Events/${deleteId}`).then(res => {
        console.log(res);
        loadPage();
    });
}

function updateEventData() {
    const updateId = +document.getElementById('updateEvent').value;
    if (updateId) {
        const index = document.getElementById('updateEvent').selectedIndex - 1;
        const updateTitleField = document.getElementById('updateTitle');
        const updateDateField = document.getElementById('updateDate');
        updateTitleField.value = eventManager.eventsData[index].title;
        updateDateField.value = eventManager.eventsData[index].start;
    }
}

function updateEvent() {
    const updateId = +document.getElementById('updateEvent').value;
    if (updateId) {
        const title = document.getElementById('updateTitle').value;
        const date = document.getElementById('updateDate').value;
        axios.put(`https://localhost:7279/api/Events/${updateId}`, {
            title: title,
            start: date
        }).then(res => {
            console.log(res);
            loadPage();
        });
    }
}