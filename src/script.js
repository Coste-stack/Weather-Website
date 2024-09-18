import './reset.css';
import './style.css';
import { getWeatherAPI } from './weather_API_handler.js';
import { submitHeader, centerToCurrentButton } from './header_creator.js';
import { submitMain } from './main_creator.js';
import { submitChart } from './chart_creator.js'
import { DataHandler } from './data_handler.js';

export function changeIdPrevCurr(parent, currButton) {
    // delete previous '#previous'
    let prevCurr = parent.querySelector('#previous');
    if (prevCurr !== null) {
        prevCurr.removeAttribute('id');
    }

    // change the id from '#current' to '#previous'
    prevCurr = parent.querySelector('#current');
    
    prevCurr.removeAttribute('id');
    prevCurr.setAttribute('id', 'previous');
    // set the '#current' to the new button
    currButton.setAttribute('id', 'current');
}

function deleteWebsite(createHeader = true) {
    let containerOuter = document.getElementById('container-outer');
    const upToChildren = createHeader ? 0 : 1;
    while (containerOuter.childElementCount > upToChildren) {
        containerOuter.removeChild(containerOuter.lastChild);
    }
}

export function createWebsite(response, createHeader = true, clickedButtonDate = null) {
    // Reset the page before new API call
    deleteWebsite(createHeader);

    let containerOuter = document.getElementById('container-outer');
    const hourStart = 0;
    const hourEnd = 23;
    
    // create and add all website content
    if (createHeader) {
        let topContainer = submitHeader(response, dataObj);
        containerOuter.appendChild(topContainer);
        centerToCurrentButton();
    } else {
        dataObj.currDate = dataObj.getStringToDate(clickedButtonDate);
    }

    let mainContainer = submitMain(response, dataObj);
    containerOuter.appendChild(mainContainer);

    let chartContainer = submitChart(response, dataObj, hourStart, hourEnd);
    if (!(chartContainer instanceof Error)) {
        containerOuter.appendChild(chartContainer);
    }

    // add event listener to the new location search form
    let lcFormContainer = document.getElementById('location-form-container');
    lcFormContainer.addEventListener('submit', async (event) => {
        event.preventDefault(); // ADD FEATURES TO THE INPUT FIELD (!!!)

        let lcFormInput = lcFormContainer.querySelector('input');
        dataObj.location = lcFormInput.value;
        await getWeatherAPI(dataObj); // ADD EXCEPTION WHEN INVALID LOCATION (? !!!)
    });
}

const dateInfo = {
    location: 'Krakow',
    spread: 10
};
const dataObj = new DataHandler(dateInfo);

async function runWebsite() {
    const response = await getWeatherAPI(dataObj);
    console.log(response);
    createWebsite(response, true);

    window.addEventListener('resize', (event) => {
        centerToCurrentButton();
    }, true);
}
runWebsite();