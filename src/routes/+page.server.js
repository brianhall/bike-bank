import { rides } from '$lib/rides';
import { convertTimestamp, metersToMiles } from '$lib/utils';

export function load() {
	const formattedRides = formatRides(rides);
	const ridesByDay = groupRidesByDay(formattedRides);

	return { rides: formattedRides, ridesByDay: ridesByDay };
}

function formatRides(rides) {
	const filteredRides = rides.filter((ride) => ride.distance > 0);

	for (const ride of filteredRides) {
		const { date, time } = convertTimestamp(ride.start_date);

		ride.formattedStartDate = date;
		ride.formattedStartTime = time;
		ride.distanceInMiles = metersToMiles(ride.distance);
	}

	return filteredRides;
}

/**
 * Group rides by day
 * @param {Array<Object>} rides
 */
function groupRidesByDay(rides) {
	const ridesByDate = {};

	for (const ride of rides) {
		if (ridesByDate[ride.formattedStartDate]) {
			ridesByDate[ride.formattedStartDate].push(ride);
		} else {
			ridesByDate[ride.formattedStartDate] = [ride];
		}
	}

	return ridesByDate;
}
