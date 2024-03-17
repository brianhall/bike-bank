<script>
	export let data;
</script>

<ul>
	{#each Object.keys(data.ridesByDay) as day}
		<h2>{day}</h2>
		{#each data.ridesByDay[day] as { formattedStartDate, formattedStartTime, name, distanceInMiles }}
			<li>
				At {formattedStartTime} you went on a ride called <b>{name}</b> for {distanceInMiles}mi
			</li>
		{/each}
	{/each}
</ul>
