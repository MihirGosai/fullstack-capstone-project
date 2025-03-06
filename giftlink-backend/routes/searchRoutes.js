/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB using connectToDatabase. Remember to use the await keyword.
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Add the name filter to the query if the name parameter is provided
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Case-insensitive regex search
        }

        // Task 3: Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category; // Exact match for category
        }
        if (req.query.condition) {
            query.condition = req.query.condition; // Exact match for condition
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) }; // Filter by age_years (less than or equal to)
        }

        // Task 4: Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        console.error("Error fetching gifts:", e);
        next(e);
    }
});

module.exports = router;
