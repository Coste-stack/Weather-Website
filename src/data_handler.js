export class DataHandler {
    #location;
    #start; #end; #spread;
    #curr;

    constructor ({ location, spread, start, end}) {
        this.#location = location;
        this.#spread = spread;

        if (start === undefined) {
            start = new Date();
        }
        if (end === undefined) {
            end = new Date();
        }
        
        start.setDate(start.getDate() - spread);
        end.setDate(end.getDate() + spread);
        this.#start = start;
        this.#end = end;
        this.#curr = new Date();
    }

    getStringToDate(string) {
        return new Date(string);
    }

    getDateString(date) {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        month++;
        if (month.toString().length < 2){
            month = '0' + month;
        }
        if (day.toString().length < 2){
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }

    getTodayIndex() {
        return Math.floor((this.#curr - this.#start) / (1000 * 60 * 60 * 24) + 1);
    }

    get location() { return this.#location; }
    get startDate() { return this.#start; }
    get endDate() { return this.#end; }
    get currDate() { return this.#curr; }
    get spreadDate() { return this.#spread; }

    set location(newLocation) {
        this.#location = newLocation;
    }

    set startDate(newStart) {
        this.#start = newStart;
    }

    set endDate(newEnd) {
        this.#end = newEnd;
    }

    set currDate(newCurr) {
        this.#curr = newCurr;
    }
}