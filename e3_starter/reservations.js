/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')
	updateSystemStatus()
	return JSON.parse(status)
}

/*********/

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	const file = fs.readFileSync('status.json')
	let status = JSON.parse(file)

	const allRestaurants = getAllRestaurants()
	const allReservations = getAllReservations()

	let numRest = allRestaurants.length
	let numResv = allReservations.length

	allRestaurants.sort(function(a, b) {

		const aResv = new Date(a.numReservations)
		const bResv = new Date(b.numReservations)
		return bResv - aResv
	})

	let busiest = allRestaurants[0].name

	const newStatus = {
		numRestaurants: numRest,
		totalReservations: numResv,
		currentBusiestRestaurantName: busiest,
		systemStartTime: new Date(status.systemStartTime)
		}
	
	/* Add your code below */
	fs.writeFileSync('status.json', JSON.stringify(newStatus))
}

const saveRestaurantsToJSONFile = (restaurants) => {

	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants))
	/* Add your code below */

};

const saveReservationsToJSONFile = (reservations) => {

	fs.writeFileSync('reservations.json', JSON.stringify(reservations))
	/* Add your code below */

};

const getReservationTime = (reservation) => {

	const date = new Date(reservation.time)
	return datetime.format(date, 'MMM. D YYYY, h:mm A,')
};

/*********/

// Should return an array
const addRestaurant = (name, description) => {


	// Maybe update system?


	// Check for duplicate names
	const restaurants = getAllRestaurants()
	const sameRest = restaurants.filter(restaurant => restaurant.name === name)
	// console.log(sameRest)
	// console.log(restaurants)
	if (sameRest.length !== 0) {
		// Duplicate found
		return []
	}
	// if no duplicate names:
	const restaurant = {
		'name': name,
		'description': description,
		'numReservations': 0
	}
	restaurants.push(restaurant)

	saveRestaurantsToJSONFile(restaurants)
	return restaurants;

}

const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	const dateObject = new Date(time)
	const allReservations = getAllReservations()
	const reservation = {
		'restaurant': restaurant,
		'time': dateObject,
		'people': people
	}
	allReservations.push(reservation)
	saveReservationsToJSONFile(allReservations)

	// Update retaurant reservations

	const allRestaurants = getAllRestaurants()
	const myRestaurant = allRestaurants.filter(res => res.name === restaurant)
	myRestaurant[0].numReservations++
	saveRestaurantsToJSONFile(allRestaurants)

	const confirm = datetime.format(dateObject, 'MMMM D YYYY at h:mm A')
	// console.log(confirm)
	return confirm;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	try {
		const resFromFile = fs.readFileSync('restaurants.json')
		return JSON.parse(resFromFile)
	} catch (e) {
		return []
	}

};


const getRestaurtantByName = (name) => {

	const allRestaurants = getAllRestaurants()
	return allRestaurants.filter(restaurant => restaurant.name === name)

};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */

  try {
		const resFromFile = fs.readFileSync('reservations.json')
		return JSON.parse(resFromFile)
	} catch (e) {
		return []
	}


};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	
	const allReservations = getAllReservations()
	return allReservations.filter(reservation => reservation.restaurant === name)

};


// Should return an array
const getReservationsForHour = (time) => {
	
	const allReservations = getAllReservations()
	const timeCheck = new Date(time) 
	const cond = new Date(timeCheck.getTime() + 60*60000)
	let result = []

	for (let i = 0; i < allReservations.length; i++) {

		const Datetime = new Date(allReservations[i].time)
		if (Datetime < cond && Datetime >= timeCheck) {
			result.push(allReservations[i])
		}
	}
	return result;
}


const checkOffEarliestReservation = (restaurantName) => {
	
	const allReservations = getAllReservations()
	const thisRestaurant = allReservations.filter(restaurant => restaurant.restaurant === restaurantName)

	thisRestaurant.sort(function(a, b) {

		const aDate = new Date(a.time)
		const bDate = new Date(b.time)
		return aDate - bDate
	})

	const toRemove = thisRestaurant[0]
	const index = allReservations.indexOf(toRemove)
	allReservations.splice(index, 1)
	decreaseNumReservations(restaurantName)
	saveReservationsToJSONFile(allReservations)
	
	return toRemove

}

function decreaseNumReservations(restaurant) {

	const allRestaurants = getAllRestaurants()
	const myRest = allRestaurants.filter(res => res.name === restaurant)
	myRest[0].numReservations--
	saveRestaurantsToJSONFile(allRestaurants)

}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use array.map()

	// Map creates a new array with the result of calling a function for every array element.

	const allReservations = getAllReservations()

	for (let i = 0; i < allReservations.length; i++) {
		if (allReservations[i].restaurant === restaurant) {
			const resTime = new Date(allReservations[i].time) 
			const delayedTime = new Date(resTime.getTime() + minutes*60000)
			allReservations[i].time = delayedTime;
		}
	}

	saveReservationsToJSONFile(allReservations)

	
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurtantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations,
	getReservationTime
}
