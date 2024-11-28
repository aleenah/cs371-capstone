const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "pace", 
    password: "123456", 
    database: "capstone" 
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("Connected to MySQL database.");
});

app.get("/accidents", (req, res) => {
    const query = `
        SELECT state, COUNT(*) AS total_accidents, SUM(deaths) AS total_deaths
        FROM brazil_accidents
        GROUP BY state
        ORDER BY total_deaths DESC;
    `; 
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send("Error fetching data: " + err.message);
            return;
        }
        res.status(200).json(results);
    });
});

app.post("/accidents", (req, res) => {
    console.log("POST Request Body:", req.body);
    const {
        inverse_data, week_day, hour, state, road_id, km, city, cause_of_accident, type_of_accident, 
        victims_condition, weather_timestamp, road_direction, wheather_condition, road_type, road_delineation, 
        people, deaths, slightly_injured, severely_injured, uninjured, ignored, total_injured, vehicles_involved, 
        latitude, longitude, regional, id
    } = req.body;

    const query = `
        INSERT INTO brazil_accidents (
            inverse_data, week_day, hour, state, road_id, km, city, cause_of_accident, type_of_accident, 
            victims_condition, weather_timestamp, road_direction, wheather_condition, road_type, road_delineation, 
            people, deaths, slightly_injured, severely_injured, uninjured, ignored, total_injured, vehicles_involved, 
            latitude, longitude, regional, id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        inverse_data, week_day, hour, state, road_id, km, city, cause_of_accident, type_of_accident,
        victims_condition, weather_timestamp, road_direction, wheather_condition, road_type, road_delineation,
        people, deaths, slightly_injured, severely_injured, uninjured, ignored, total_injured, vehicles_involved,
        latitude, longitude, regional, id
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            res.status(500).send("Error inserting data: " + err.message);
            return;
        }
        res.status(201).send("New accident record added successfully!");
    });
});

app.delete("/accidents/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM brazil_accidents WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send("Error deleting record: " + err.message);
            return;
        }
        res.status(200).send("Record deleted successfully!");
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

