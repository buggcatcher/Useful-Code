import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const { localita, timestamps, photo_data_placeholder } = require('./script.js');
 
const pool = mysql.createPool 
({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})  .promise()

async function getImageData()
{
    const [rows] = await pool.query("SELECT * FROM photos");
    return rows;
}

async function getData(id)
{
    const [rows] = await pool.query(`
        SELECT *
        FROM photos
        WHERE id = ?`, [id]);
    return rows;
}

async function createPhoto(localita, timestamp, photo)
{
    const result = await pool.query(`
        INSERT INTO photos (id, localita, timestamps, immagine) VALUES (9, ?, ?, ?)`, [localita, timestamp, photo]
    )
    return result;
}

// const data = await getData(1);
// console.log(data);

const result = await createPhoto(localita, timestamps, photo_data_placeholder)
console.log(result);