const DATE_FORMAT = new Intl.DateTimeFormat(
    "fr-FR",
    {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: 'Europe/Paris'
    }
);

function getDateFormatedParts(date){
    const [
        { value: day },,
        { value: month },,
        { value: year },,
        { value: hour },,
        { value: minute },,
        { value: second }
    ] = DATE_FORMAT.formatToParts(new Date(date));
    return {day, month, year, hour, minute, second};
}

function getUtcDate(date) {
    const {day, month, year, hour, minute, second} = getDateFormatedParts(date);
    return Date.UTC(year, month, day, hour, minute, second);
}

function getDiffBetweenDates(date1, date2) {
    return getUtcDate(date1) - getUtcDate(date2);
}

export {
    getDiffBetweenDates,
    getDateFormatedParts,
}