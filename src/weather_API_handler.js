export async function getWeatherAPI(dataObj) {
    const startDate = dataObj.getDateString(dataObj.startDate);
    const endDate = dataObj.getDateString(dataObj.endDate)

    const options = `${dataObj.location}/${startDate}/${endDate}`;
    console.log(options)
    const additional = `&unitGroup=metric`;
    
    // get the weather data from API
    const webCall = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${options}?key=FKG9TMFAD5YB4AVTYLHJCMUKL${additional}`;
    const localCall = './response.json';
    const response = await fetch(localCall);
    /*const response = await fetch(webCall, {
        mode: 'cors'
    });*/
    
    if (response.status == 200) {
        const data = await response.json();
        return data;
    }
    return new Error(response);
}