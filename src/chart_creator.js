import { Chart, Tooltip, CategoryScale, LinearScale, ScatterController, BarController, BarElement, PointElement, LineElement } from 'chart.js';
Chart.register([Tooltip, CategoryScale, LinearScale, ScatterController, BarController, BarElement, PointElement, LineElement]);
import { getJsonTable } from './response_handler';
import { changeIdPrevCurr } from "./script";

const TempColor = '#703142';
const PrecipColor = '#314270';

function getTempData(data) {
    return {
        type: 'scatter',
        data: data,
        beginAtZero: false,
        borderColor: TempColor,
        titleX: 'Hours',
        optionName: 'Temperature',
        unit: '\u00B0C',
    }
}

function getPrecipData(data) {
    return {
        type: 'bar',
        data: data,
        beginAtZero: true,
        borderColor: PrecipColor,
        titleX: 'Hours',
        optionName: 'Percip',
        unit: '[mm]',
    }
}

function getChartOptions(chartDataObj) {
    return {
        responsive: true,
        maintainAspectRatio: false, // if true canvas wont scale back
        scales: {
            x: {
                display: true,
                type: 'linear',
                position: 'bottom',
                min: -0.5,
                max: 23.5,
                ticks: {
                    color: '#1f1f1f',
                    font: {
                        size: 14
                    },
                    stepSize: 0.5,
                    callback: function(value, index) {
                        return Number.isInteger(value) ? value : null;
                    }
                },
                title: {
                    display: true,
                    text: chartDataObj.titleX,
                    color: chartDataObj.borderColor,
                    font: {
                        size: 16,
                        weight: 600
                    }
                }
            },
            y: {
                display: true,
                beginAtZero: chartDataObj.beginAtZero,
                ticks: {
                    color: '#1f1f1f',
                    font: {
                        size: 14
                    }
                },
                title: {
                    display: true,
                    text: `${chartDataObj.optionName} ${chartDataObj.unit}`,
                    color: chartDataObj.borderColor,
                    font: {
                        size: 16,
                        weight: 600
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                displayColors: false,
                callbacks: {
                    title: function() {
                        return '';
                    },
                    label: function(tooltipItem) {
                        const xValue = tooltipItem.raw.x;
                        const yValue = tooltipItem.raw.y;
                        return `Hour: ${xValue}, ${chartDataObj.optionName}: ${yValue}`;
                    }
                }
            }
        }
    }
}

function createPrecipChart(canvas, chartDataObj) {
    return new Chart(canvas, {
        type: 'bar',
        data: {
            datasets: [{
                data: chartDataObj.data,
                backgroundColor: chartDataObj.borderColor
            }]
        },
        options: getChartOptions(chartDataObj)
    });
}


function createChart(canvas, chartDataObj) {
    return new Chart(canvas, {
        type: chartDataObj.type,
        data: {
            datasets: [{
                data: chartDataObj.data,
                borderColor: chartDataObj.borderColor,
                showLine: true,
                pointRadius: 10,
                pointHoverRadius: 12
            }]
        },
        options: getChartOptions(chartDataObj)

    });
}

function getData(response, dataObj, toSearch, hourStart, hourEnd) {
    try {
        let myData = [];
        for (let hourCurr = hourStart; hourCurr <= hourEnd; hourCurr++) {
            // check if data exists in json
            if (getJsonTable(response, ['days', dataObj.getTodayIndex(), 'hours', hourCurr, toSearch])){
                myData[hourCurr] = {x: hourCurr, y: response['days'][dataObj.getTodayIndex()]['hours'][hourCurr][toSearch]};
            } else {
                myData[hourCurr] = {x: hourCurr, y: null};   
            }
        }
        return myData;
    } 
    catch (error) {
        console.error(error.message);
        return error;
    }
}

export function submitChart(response, dataObj, hourStart = 0, hourEnd = 23) {
    // create chart container
    const chartContainer = document.createElement('div');
    chartContainer.setAttribute('id', 'chart-container');

    // create buttons for changing chart
    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('id', 'button-container');

    const tempButton = document.createElement('button');
    tempButton.setAttribute('option', 'temp');
    tempButton.classList.add('weather-button');
    tempButton.textContent = 'Temperature';

    const precipButton = document.createElement('button');
    precipButton.setAttribute('option', 'precip');
    precipButton.classList.add('weather-button');
    precipButton.textContent = 'Rain';

    buttonContainer.appendChild(tempButton);
    buttonContainer.appendChild(precipButton);
    // set the default current chart active
    tempButton.setAttribute('id', 'current');

    // create chart and add it to container
    const canvasContainer = document.createElement('div');
    canvasContainer.setAttribute('id', 'canvas-container');
    let canvas = document.createElement('canvas');

    // create data for temperature(default) chart over hours
    let chartDataObj = getTempData(getData(response, dataObj, 'temp', hourStart, hourEnd));

    let chart = createChart(canvas, chartDataObj);

    canvasContainer.appendChild(canvas);
    chartContainer.appendChild(buttonContainer);
    chartContainer.appendChild(canvasContainer);

    buttonContainer.childNodes.forEach(button => {
        button.addEventListener('click', () => {
            changeIdPrevCurr(buttonContainer, button);

            // update chartDataObj
            chartDataObj.label = button.textContent;
            chartDataObj.borderColor = button.getAttribute('color');
            const option = button.getAttribute('option');
            chartDataObj.data = getData(response, dataObj, option, hourStart, hourEnd);

            chart.destroy();
            switch (option) {
                case 'temp':
                    chartDataObj = getTempData(getData(response, dataObj, option, hourStart, hourEnd));
                    chart = createChart(canvas, chartDataObj);
                    break;
                case 'precip':
                    chartDataObj = getPrecipData(getData(response, dataObj, option, hourStart, hourEnd));
                    chart = createPrecipChart(canvas, chartDataObj);
                    break;
                default:
                    break;
            }
        });
    });

    return chartContainer;
}