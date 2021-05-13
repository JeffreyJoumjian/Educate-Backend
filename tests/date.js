const { parse, parseISO, format, isAfter, isBefore } = require('date-fns');

let startDate = parse(`13/05/2021 12:01 AM`, 'dd/MM/yyyy p', Date.now());
let endDate = parse(`16/05/2021 11:59 PM`, 'dd/MM/yyyy p', Date.now());
let currentDate = parseISO(new Date().toISOString(), "dd/MM/yyyy p");

console.log(currentDate);
if (isAfter(startDate, currentDate) && isBefore(currentDate, endDate))
	return true;

// return false;