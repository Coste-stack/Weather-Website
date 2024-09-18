// 'options' usage -> eg. response[options[0]][options[1]][...]
// check if 'response' path is correct and exists
export function getJsonTable(response, options) {
    let currentData = response;
    try {
        options.forEach(option => {
            // check if its array or object and use number or key accordingly
            if (Array.isArray(currentData)) {
                if (typeof option === 'number') {
                    if (option >= currentData.length) {
                        throw new Error(`Index ${option} out of bounds for array`);
                    }
                    currentData = currentData[option];
                } 
                else {
                    throw new Error(`Expected array index, but got key: ${option}`);
                }
            } 
            else if (typeof currentData === 'object' && currentData !== null) {
                if (!currentData.hasOwnProperty(option)) {
                    throw new Error(`No "${option}" key in object`);
                }
                currentData = currentData[option];
            } 
            else {
                throw new Error(`Cannot access ${option} in non-object/non-array data`);
            }
        });
        return true;
    }
    catch (error) {
        console.error(error.message);
        return false;
    }
}