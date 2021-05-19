const myKey = 'OKS6juBWYTLJWiJ19pez';
const inputForm = document.querySelector('form');
const title = document.getElementById('street-name');
const streetsSection = document.querySelector(".streets");
const tableSection = document.querySelector('table tbody');
const searchInput = document.getElementById('search');

// Url function for API
const getURL = function name(params, indexname) {
        const myURL = `https://api.winnipegtransit.com/v3/${params}.json?api-key=${myKey}&${indexname}&usage=long`;
        return myURL;
    }
    // examples for API
console.log(getURL('streets', 'name=silver'));
console.log(getURL('stops', 'street=3346'));
console.log(getURL('stops/60079/schedule', 'route=672&max-results-per-route=2'))

const getStreets = async(keyWords) => {
    const streetsURL = getURL('streets', `name=${keyWords}`)
    const response = await fetch(streetsURL);
    const data = await response.json();
    if (response.status != 200) {
        throw new err("Can't get data.");
    }
    return data.streets;
}
const getStops = async(keyWords) => {
    const stopsURL = getURL('stops', `street=${keyWords}`)
    const response = await fetch(stopsURL);
    const data = await response.json();
    if (response.status != 200) {
        throw new err("Can't get stops data");
    }
    console.log(data.stops);
    return data.stops;
}
const getSchedule = async(keyWords) => {
    const stopsURL = getURL(`stops/${stopsKey}/schedule`, `stop=${keyWords}&max-results-per-route=2`)
    const response = await fetch(stopsURL);
    const data = await response.json();
    if (response.status != 200) {
        throw new err("Can't get Schedule data");
    }
    console.log(data)
    return data;
}
const renderStreets = (streets) => {
    streetsSection.innerHTML = '';
    streets.forEach(street => {
        streetsSection.innerHTML += `
        <a href="#" data-street-key=${street.key}>${street.name}</a>`
    })

}

const renderTable = (schedules) => {
    tableSection.innerHTML = '';
    schedules.forEach(schedule => {
        const allSchedules = schedule['stop-schedule']['route-schedules'];
        allSchedules.forEach(data => {
            data['scheduled-stops'].forEach(schedulestop => {
                console.log(schedulestop);
                stopsSchedule.insertAdjacentHTML('beforeend', `
            <tr>
            <td>${schedule['stop-schedule'].stop.name}</td>
            <td>${schedule['stop-schedule'].stop['cross-street'].name}</td>
            <td>${schedule['stop-schedule'].stop.direction}</td>
            <td>${scheduleStop.bus.key}</td>
            <td>${scheduleStop.times.arrival.scheduled}</td>
          </tr>\n`)
            })
        });

    })
}


//add elisterner for input and streetList 

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    getStreets(e.target[0].value)
        .then((data) => {
            return renderStreets(data);
        })
        .catch((err) => alert(err));
    e.target[0].value = '';
})

streetsSection.addEventListener('click', (e) => {
    title.innerHTML = `Displaying results for ${e.target.closest('a').innerHTML}`
    console.log(e.target.closest('a').dataset.streetKey);
    getStops(e.target.closest('a').dataset.streetKey)
        .then((allStops) => {
            const stopPromises = [];
            allStops.map((stop) => {
                stopPromises.push(getSchedule(stop.key));

            });
            console.log(stopPromises)
            Promise.all(stopPromises)
                .then(value => { return renderTable(value) })
                .catch(err => alert("Can't get the promises data."));
        });
})