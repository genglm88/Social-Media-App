
import {db} from "../connect.js"
import moment from "moment"
import jwt from "jsonwebtoken"

export const getComments = (req, res) => {
 
         // show only the post the current user followed
         // const q =  "SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)"
 
         // show both followed and user's own posts - ordered by date, closet 1st
          const q =  `SELECT c.*, u.id AS userId, name, profilePicture FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC`
                                    
         db.query(q, [req.query.postId],(err, data)=> {
             if(err) return res.status(500).send(err) // same as json(err)
             return res.status(200).json(data)
         })            
     
 }

 export const addComment =(req, res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated")     
    
    jwt.verify(token, "verysecretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES(?)" //must have (?)
        //console.log(userInfo)
        const values = [
            req.body.desc,           
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,     
            req.body.postId      
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("The comment has been created.")
        })
    })    
}

