import {db} from "../connect.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = (req, res) => {
    //CHECK USER IF EXITS
    //IF NOT CREATE A NEW USER
        // hash the password

    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q,[req.body.username], (err, data)=> {
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("User already exists!")

        //Hash the password and create a user
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        //add user into database
        const q = "INSERT INTO users (`username`,`email`,`password`, `name`) VALUES (?)"
        const values = [
            req.body.username, 
            req.body.email,
            hashedPassword,
            req.body.name,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.json(err)
            return res.status(200).json("User has been created.")
        })
    })
}

export const login = (req, res) => {
    //CHECK USER
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q,[req.body.username], (err, data) => {// data is an Array data[0] - user
        if (err) return res.json(err)
        if(data.length === 0) return res.status(404).json("User not found")
        //CHECK PASSWORD
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)
        if ( !isPasswordCorrect) return res.status(400).json("Wrong username or password")

        const token = jwt.sign({id:data[0].id}, "verysecretkey") //user.id
        const {password, ...other} = data[0] //strip out of password

        res.cookie("access_token", token, {
                httpOnly: true, 
        }).status(200).json(other)
      
    })}

export const logout = (req, res) => {

    res.clearCookie("access_token",{
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.")

}