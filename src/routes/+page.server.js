import { rides } from '$lib/rides';
import { beers } from '$lib/beers';
import { convertTimestamp, metersToMiles } from '$lib/utils';

export function load() {
	const formattedRides = formatRides(rides);
	const formattedBeers = formatBeers(beers);
	const activities = formattedRides.concat(formattedBeers);

	const activitiesByDay = groupActivitiesByDay(activities);

	console.log({ rides: formattedRides, activitiesByDay });

	return { rides: formattedRides, activitiesByDay };
}

function formatBeers(beers) {
	const formattedBeers = [...beers];

	for (const beer of formattedBeers) {
		const { date, time } = convertTimestamp(beer.date);

		beer.formattedDate = date;
		beer.formattedTime = time;
	}

	return formattedBeers;
}

function formatRides(rides) {
	const filteredRides = rides.filter((ride) => ride.distance > 0);

	filteredRides.total = {
		distanceInMiles: 0,
		movingTime: 0
	};

	for (const ride of filteredRides) {
		const { date, time } = convertTimestamp(ride.start_date);

		ride.formattedDate = date;
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
 * @param {Array<Object>} activities
 */
function groupActivitiesByDay(activities) {
	const activitiesByDay = {};

	for (const activity of activities) {
		if (activitiesByDay[activity.formattedDate]) {
			activitiesByDay[activity.formattedDate].push(activity);
		} else {
			activitiesByDay[activity.formattedDate] = [activity];
		}
	}

	return activitiesByDay;
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
	};

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
