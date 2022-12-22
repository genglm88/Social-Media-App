import {db} from "../connect.js"
import jwt from "jsonwebtoken"

export const getUser = (req, res) => {
    const userId= req.params.userId
    const q = "SELECT * FROM users WHERE id=?"

    db.query(q, [userId], (err, data) => {
        if(err) return res.status(500).json(err)
        const {password, ...info} = data[0]
        return res.json(info)

    })
   
}

export const getAllUser = (req, res) => {
    const userId= req.params.userId
    const q = "SELECT * FROM users"

    db.query(q, [userId], (err, data) => {
        if(err) return res.status(500).json(err)
        let info = data.map(item => {
            const {password, ...info} = item
            return info
        })
        
        return res.json(info)

    })
   
}

export const updateUser = (req, res) => {

    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not logged in!")    

    jwt.verify(token, "verysecretkey", (err, userInfo)=> {
        if(err) return res.status(403).json("Token is not valid!")

        const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePicture`=?, `coverPicture`=? WHERE id=?"

        db.query(
            q, 
            [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.profilePicture,
            req.body.coverPicture,
            userInfo.id
        ], (err, data) => {
            if(err) return res.status(500).json(err)
            if(data.affectedRows > 0) return res.json("Updated")
            return res.status(403).json("You cannot update other's profile.")
        })
    }  )
}