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
		movingTime: 0
	};

	for (const ride of filteredRides) {
		const { date, time } = convertTimestamp(ride.start_date);

		ride.formattedStartDate = date;
		ride.formattedStartTime = time;
		ride.distanceInMiles = metersToMiles(ride.distance);

		filteredRides.total.distanceInMiles += ride.distanceInMiles;
		filteredRides.total.movingTime += ride.moving_time;
	}

    filteredRides.total.movingTime = convertMovingTime(filteredRides.total.movingTime);

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
 * Convert total moving time seconds into hours, minutes, and seconds.
 * @param {Number} movingTime
 */
function convertMovingTime(movingTime) {
    const convertedTime = {
        seconds: 0,
        minutes: 0,
        hours: 0
    }

    convertedTime.seconds = movingTime;

    if (convertedTime.seconds > 59) {
        convertedTime.minutes += Math.floor(convertedTime.seconds / 60);
        convertedTime.seconds = convertedTime.seconds % 60;
    }

	if (convertedTime.minutes > 59) {
		convertedTime.hours += Math.floor(convertedTime.minutes / 60);
		convertedTime.minutes = convertedTime.minutes % 60;
	}

	return convertedTime;
}
