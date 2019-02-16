/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array

function resOut(name, description, reservations) {

	return console.log(name + ": " + description + " - " + reservations + " active reservations")
}

function reservationOut(name, reservation, option) {

	const time = reservations.getReservationTime(reservation)
	const people = reservation.people
	if (option === 1) {
		console.log("- " + name + time + " table for " + people)
	} else {

		console.log("Checked off reservation on " + name + time + " table for " + people)
	}
}

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		console.log("Added Restaurant " + args[0] + ".") 
	} else {
		/* complete */ 
		console.log("Duplicate restaurant not added.")
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);
	console.log("Added reservation at " + args[0] + " on " + resv + " for " + args[2] + " people.")
	// Produce output below
	
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	for (let i = 0; i < restaurants.length; i++) {
		// Disect info
		const resName = restaurants[i].name
		const description = restaurants[i].description
		const reservations = restaurants[i].numReservations
		resOut(resName, description, reservations)
	}
	// Produce output below
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurtantByName(yargs_argv['restInfo']);
	for (let i = 0; i < restaurants.length; i++) {
		resOut(restaurants[i].name, restaurants[i].description, restaurants[i].numReservations)
	}
	// Produce output below

}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	reservationsForRestaurant.sort(function(a, b) {

		const aDate = new Date(a.time)
		const bDate = new Date(b.time)
		return aDate - bDate
	})
	// Produce output below
	console.log("Reservations for " + restaurantName + ":");
	for (let i = 0; i < reservationsForRestaurant.length; i++) {
		reservationOut("", reservationsForRestaurant[i], 1)
	}


}

if ('hourResv' in yargs_argv) {

	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary

	// console.log(reservationsForRestaurant)
	
	reservationsForRestaurant.sort(function(a, b) {

		const aDate = new Date(a.time)
		const bDate = new Date(b.time)
		return aDate - bDate
	})

	console.log("Reservations in the next hour:")
	for (let i = 0; i < reservationsForRestaurant.length; i++) {

		const name = reservationsForRestaurant[i].restaurant + ": "
		reservationOut(name, reservationsForRestaurant[i], 1)
	}

}

if ('checkOff' in yargs_argv) {
	
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	reservationOut("",earliestReservation, 0)



	
}

if ('addDelay' in yargs_argv) {

	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(args[0]);

	console.log("Reservations for " + args[0] + ":");
	for (let i = 0; i < reservationsForRestaurant.length; i++) {
		reservationOut("", reservationsForRestaurant[i], 1)
	}

	
	
}
const datetime = require('date-and-time')

if ('status' in yargs_argv) {
	// numRestaurants: 0,
	// 		totalReservations: 0,
	// 		currentBusiestRestaurantName: null,
	// 		systemStartTime: new Date(),
	const status = reservations.getSystemStatus()
	console.log("Number of restaurants: " + status.numRestaurants)
	console.log("Number of total reservations: " + status.totalReservations)
	console.log("Busiest restaurant: " + status.currentBusiestRestaurantName)

	const date = new Date(status.systemStartTime)
	const formatted = datetime.format(date, 'MMM D, YYYY, h:mm A')

	console.log("System started at: " + formatted)
	
	// Produce output below
}

