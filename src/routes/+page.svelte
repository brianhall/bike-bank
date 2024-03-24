<script>
	export let data;
</script>

<h2>Totals for Time Period</h2>
<ul>
	<li>{data.rides.total.distanceInMiles}mi</li>
	<li>
		{data.rides.total.movingTime.hours}hr {data.rides.total.movingTime.minutes}min {data.rides.total
			.movingTime.seconds}sec
	</li>
</ul>

<ul>
	{#each Object.keys(data.activitiesByDay) as day}
		<h3>{day}</h3>
		{#each data.activitiesByDay[day] as { formattedStartTime, name }}
			<li>
				At {formattedStartTime} you went on a ride called <b>{name}</b>
			</li>
		{/each}
	{/each}
</ul>
