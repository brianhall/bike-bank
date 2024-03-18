import { rides } from '$lib/rides';
import { convertTimestamp, metersToMiles } from '$lib/utils';

export function load() {
	const formattedRides = formatRides(rides);
	const ridesByDay = groupRidesByDay(formattedRides);

	return { rides: formattedRides, ridesByDay: ridesByDay };
}

function formatRides(rides) {
	const filteredRides = rides.filter((ride) => ride.distance > 0);
	filteredRides.total = {
		distanceInMiles: 0,
		movingTime: {
            seconds: 0,
			minutes: 0,
			hours: 0,
		}
	};

	for (const ride of filteredRides) {
		const { date, time } = convertTimestamp(ride.start_date);

		ride.formattedStartDate = date;
		ride.formattedStartTime = time;
		ride.distanceInMiles = metersToMiles(ride.distance);

		filteredRides.total.distanceInMiles += ride.distanceInMiles;
		filteredRides.total.movingTime = addMovingTimeToTotal(
			ride.moving_time,
			filteredRides.total.movingTime
		);
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

/**
 * Todo: Fix so that we're accumulating seconds into minutes.
 * @param {Number} movingTime
 * @param {Object} totalTime
 */
function addMovingTimeToTotal(movingTime, totalTime) {
	const movingTimeMinutes = Math.floor(movingTime / 60);
	const updatedTime = { ...totalTime };

	updatedTime.minutes += movingTimeMinutes;

	if (updatedTime.minutes > 59) {
		updatedTime.hours += Math.floor(updatedTime.minutes / 60);
		updatedTime.minutes = updatedTime.minutes % 60;
	}

	return updatedTime;
}
