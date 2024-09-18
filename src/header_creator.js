import { createWebsite } from "./script";
import { changeIdPrevCurr } from "./script";
import { getJsonTable } from "./response_handler";

export function submitHeader(response, dataObj) {
    let topContainer = document.createElement('div');
    topContainer.setAttribute('id', 'header-container')
    let buttonContainer = document.createElement('nav');

    const numberOfDays = response['days'].length;

    let currDate;
    if (getJsonTable(response, ['days', dataObj.getTodayIndex(), 'datetime'])){
        currDate = response['days'][dataObj.getTodayIndex()]['datetime']; 
    } else {
        currDate = dataObj.getDateString(dataObj.currDate);
    }

    // add the top buttons with dates
    for(let i = 0; i < numberOfDays; i++) {
        let button = document.createElement('button');

        // set the date on the butons
        let datetime = new Date(dataObj.startDate.getTime());
        datetime.setDate(datetime.getDate() + i);
        datetime = dataObj.getDateString(datetime);
        
        // set button text
        button.setAttribute('date', datetime);
        button.innerHTML = datetime;

        // set 'current' id to specific button
        if (datetime === currDate) {
            button.setAttribute('id', 'current');
        }
        buttonContainer.appendChild(button);
    }

    // when other button is clicked -> change the weather information (to that day)
    let allButtons = buttonContainer.childNodes;
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Viewing: ', button.textContent);
            //console.log(dataObj.currDate, '\n', dataObj.startDate);
            //console.log((dataObj.currDate - dataObj.startDate) / (1000 * 60 * 60 * 24) + 1);
            changeIdPrevCurr(buttonContainer, button);
            centerToCurrentButton();

            // change the weather info (to the selected day)
            dataObj.currDate = dataObj.getStringToDate(button.textContent);
            // and restart the page
            createWebsite(response, false, button.textContent);
        });
    });

    topContainer.appendChild(buttonContainer);
    return topContainer;
}

export function centerToCurrentButton() {
    const currButton = document.querySelector('#current');
    const prevButton = document.querySelector('#previous');
    if (currButton) {
        const navContainer = currButton.parentElement;
        // scroll to the current button
        if (prevButton) {
            navContainer.scrollBy({ 
                left: currButton.offsetLeft - prevButton.offsetLeft,
                behavior: 'smooth'
            });
        }
        // Calculate where the button should be centered relative to the container
        const targetScrollPos = currButton.offsetLeft - (navContainer.clientWidth / 2) + (currButton.clientWidth / 2);
        navContainer.scrollBy({ 
            left: targetScrollPos - navContainer.scrollLeft,
            behavior: 'smooth'
        });
    } else {
        console.error("No element with ID 'current' found.");
    }
}