/**
 * Convert meters to miles
 * @param {Number} meters
 * @returns {undefined | Number}
 */
export function metersToMiles(meters) {
	if (!meters) return;
	let miles = meters * 0.000621371;

	return Number(miles.toFixed(2));
}

/**
 * Convert timestamp
 * @param {string} timestamp
 * @returns {undefined | Object}
 */
export function convertTimestamp(timestamp) {
	if (!timestamp) return;

	const date = new Intl.DateTimeFormat('en-us', {
		dateStyle: 'short',
		timeZone: 'America/Chicago'
	}).format(new Date(timestamp));

	const time = new Intl.DateTimeFormat('en-us', {
		timeStyle: 'short',
		timeZone: 'America/Chicago'
	}).format(new Date(timestamp));

	return { date, time };
}
