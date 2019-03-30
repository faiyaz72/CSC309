/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// Mongoose
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')

// Express
const port = process.env.PORT || 3000
const app = express();
app.use(bodyParser.json());

/// Route for adding restaurant, with *no* reservations (an empty array).
/* 
Request body expects:
{
	"name": <restaurant name>
	"description": <restaurant description>
}
Returned JSON should be the database document added.
*/
// POST /restaurants
app.post('/restaurants', (req, res) => {
	// Add code here

	const newRestaurant = new Restaurant({
		name: req.body.name,
		description: req.body.description,
		reservations: []
	})

	newRestaurant.save().then((result) => {
		res.send(result)
	}).catch((error) => {
		res.status(400).send(error)
	})

})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here

	Restaurant.find().then((restaurants) => {
		res.send({restaurants})
	}), (error) => {
		res.status(400).send(error)
	}

})


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here

	Restaurant.findById(req.params.id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			res.send(restaurant)
		}
	}).catch((error) => {
		res.status(400).send(error)
	})

})


/// Route for adding reservation to a particular restaurant.
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database 
//   document that the reservation was added to, AND the reservation subdocument:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// POST /restaurants/id
app.post('/restaurants/:id', (req, res) => {
	// Add code here
	const id = req.params.id

	const { time, people } = req.body
	// const reservation = {time, people}
	// const reservationdata = {
	// 	"time": time,
	// 	"people": people,
	// 	"_id": id
	// }

	if (!ObjectID.isValid(id)) {
		return res.status(400).send()
	}

	let subdocument = {
		_id: mongoose.Types.ObjectId(),
		"time": time,
		"people": people
	}

	Restaurant.findById(id).then((result) => {
		result.reservations.push(subdocument)
		result.save().then((restaurant) => {
			const toReturn = {
				reservation: subdocument,
				restaurant
			}
			res.send(toReturn)
		}).catch((error) => {
			res.status(404).send()
		})
	}).catch((error) => {
		res.status(404).send()
	})


})


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/id
app.get('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here

	Restaurant.findById(req.params.id).then((result) => {
		if (!result) {
			res.status(404).send()
		} else {
			return result
		}
	}).then((restaurant) => {
		
		const reservation = restaurant.reservations.id(req.params.resv_id)

		if (!reservation) {
			res.status(404).send()
		} else {
			res.send(reservation)
		}
	}).catch((error) => {
		res.status(400).send(error)
	})

})


/// Route for deleting reservation
// Returned JSON should have the restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	Restaurant.findById(req.params.id).then((result) => {
		if (!result) {
			res.status(404).send()
		} else {
			
			const reservation = result.reservations.id(req.params.resv_id)
			if (!reservation) {
				res.status(404).send()
			}
			else {

			result.reservations.id(req.params.resv_id).remove()

			result.save().then((restaurant) => {
				const toSend = {
					reservation,
					restaurant
				}
				res.send(toSend)
				})
			}
		}

	}).catch((error) => {
		res.status(400).send(error)
	})
})


/// Route for changing reservation information
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database
//   document in which the reservation was changed, AND the reservation subdocument changed:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// PATCH restaurant/<restaurant_id>/<reservation_id>
app.patch('/restaurants/:id/:resv_id', (req, res) => {
	const restaurant_id = req.params.id
	const reser_id = req.params.resv_id

	const { time, people } = req.body
	const data = {time, people}

	Restaurant.findById(restaurant_id).then((result) => {
		let subDoc = result.reservations.id(reser_id)
		subDoc.set(data)
		result.save().then((rValue) => {
			// res.send(updated)
			const resvToSend = {
				"_id": reser_id,
				"time": time,
				"people": people 
			}
			const toSend = {
				"reservation": resvToSend,
				restaurant: rValue
			}
			res.send(toSend)

		}).catch((error) => {
			res.status(404).send()
		})
	})
})

// app.get('/delete', (re, res) => {
// 	Restaurant.deleteMany({}).then((result) => {
// 		res.send(result)
// 	})
// })


//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
