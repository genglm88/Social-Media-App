import mysql from "mysql"

export const db= mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"aelm68986898",
    database:"social"
})