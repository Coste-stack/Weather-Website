import { getJsonTable } from "./response_handler";

function createMainTop(response) {
    // create the headline
    let lcHeadline = document.createElement('span');
    lcHeadline.setAttribute('id', 'location-headline');
    lcHeadline.textContent = response['resolvedAddress'].split(',')[0].trim();

    let lcFormContainer = document.createElement('form');
    lcFormContainer.setAttribute('id', 'location-form-container');

    let lcFormInput = document.createElement('input');
    lcFormInput.required = true;
    lcFormInput.placeholder = 'Location eg. London';
    let lcFormButton = document.createElement('button');
    lcFormContainer.appendChild(lcFormInput);
    lcFormContainer.appendChild(lcFormButton);

    return [lcHeadline, lcFormContainer];
}

function createMainBottom(response, dataObj) {
    // create the main content below headline
    const mainContent = document.createElement('div');
    mainContent.setAttribute('id', 'main-content');

    // create a fieldset where weather data will be mainly displayed
    let weatherIndicator = document.createElement('fieldset');
    let weatherIndicatorLegend = document.createElement('legend');
    let weatherIndicatorContent = document.createElement('div');
    weatherIndicator.setAttribute('id', 'weather-indicator');
    weatherIndicatorLegend.setAttribute('id', 'weather-indicator-legend');
    weatherIndicatorContent.setAttribute('id', 'weather-indicator-content');
    weatherIndicator.appendChild(weatherIndicatorLegend);
    weatherIndicator.appendChild(weatherIndicatorContent);

    // set the fieldset legend text
    if (getJsonTable(response, ['days', dataObj.getTodayIndex(), 'datetime'])){
        weatherIndicatorLegend.textContent = 'Viewing: ' + response['days'][dataObj.getTodayIndex()]['datetime']; 
    } else {
        weatherIndicatorLegend.textContent = 'Viewing: undefined'; 
    }

    // add main temperature
    let temperatureDisplay = document.createElement('span');
    temperatureDisplay.setAttribute('id', 'temperature-display');
    temperatureDisplay.innerHTML = response['days'][dataObj.getTodayIndex()]['temp'] + ' &deg;C';
    weatherIndicatorContent.appendChild(temperatureDisplay);

    // add container for other values
    let weatherIndicatorSubcontent = document.createElement('div');
    weatherIndicatorSubcontent.setAttribute('id', 'weather-indicator-subcontent');

    let weatherDescription = document.createElement('span');
    weatherDescription.setAttribute('id', 'weather-description');
    weatherDescription.innerHTML = response['days'][dataObj.getTodayIndex()]['conditions'];

    let weatherDescriptionAdditional = document.createElement('div');
    weatherDescriptionAdditional.setAttribute('id', 'weather-description-additional');

    const addOptions = ['feelslike', 'humidity', 'pressure'];
    addOptions.forEach(op => {
        let container = document.createElement('div');
        let title = document.createElement('span');
        let value = document.createElement('span');
        container.setAttribute('id', 'additional-container');
        title.setAttribute('id', 'additional-title');
        value.setAttribute('id', 'additional-value');

        // set the title as 'option'
        title.innerHTML = op.toUpperCase();

        // add a unit to the end of value
        let unit = '';
        switch(op) {
            case 'feelslike':
                unit = ' &deg;C'; break;
            case 'humidity':
                unit = ' %'; break;
            case 'pressure':
                unit = ' hPa'; break;
        }

        value.innerHTML = response['days'][dataObj.getTodayIndex()][op] + unit;

        // add container to display
        container.appendChild(title);
        container.appendChild(value);
        weatherDescriptionAdditional.appendChild(container);
    });

    weatherIndicatorSubcontent.appendChild(weatherDescription);
    weatherIndicatorSubcontent.appendChild(weatherDescriptionAdditional);
    weatherIndicatorContent.appendChild(weatherIndicatorSubcontent);

    mainContent.appendChild(weatherIndicator);
    return mainContent;
}

export function submitMain(response, dataObj) {
    const mainContainer = document.createElement('div');
    mainContainer.setAttribute('id', 'main-container');

    // add all elements
    let [lcHeadline, lcFormContainer] = createMainTop(response); 
    let mainContent = createMainBottom(response, dataObj);
    mainContainer.appendChild(lcHeadline);
    mainContainer.appendChild(lcFormContainer);
    mainContainer.appendChild(mainContent);
    return mainContainer;
}