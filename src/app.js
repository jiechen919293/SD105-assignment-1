const myKey = 'OKS6juBWYTLJWiJ19pez';
const inputForm = document.querySelector('form');
const title = document.getElementById('street-name');
const streetsSection = document.querySelector(".streets");
const tableSection = document.querySelector('tbody');
const searchInput = document.getElementById('search');

// Url function for API
const getURL = function name(params, indexname) {
    const myURL = `https://api.winnipegtransit.com/v3/${params}.json?api-key=${myKey}&${indexname}&usage=long`;
    return myURL;
}

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
    return data.stops;
}
const getSchedule = async(stopsKey) => {
    const stopsURL = getURL(`stops/${stopsKey}/schedule`, `&max-results-per-route=2`)
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
    schedules.forEach(data => {
        const nextBusTime =
            tableSection.insertAdjacentHTML('beforeend', `
            <tr>
            <td>${data['stop-schedule'].stop.name}</td>
            <td>${data['stop-schedule'].stop['cross-street'].name}</td>
            <td>${data['stop-schedule'].stop.direction}</td>
            <td>${data['stop-schedule']['route-schedules'][0].route.number}</td>
            <td>${data["stop-schedule"]["route-schedules"][0]["scheduled-stops"][0].times.arrival.scheduled}</td>
          </tr>
          `)
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
                stopPromises.push(getSchedule(stop.key))
            });
            Promise.all(stopPromises)
                .then(value => {
                    console.log(value);
                    renderTable(value);
                })
                .catch(err => alert("Can't get the promises data."));
        });
})