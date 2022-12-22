
import {db} from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"

export const getPosts = (req, res) => {

    const userId = req.query.userId
    // find userId (currently logged in the token)
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not logged in!")    

    jwt.verify(token, "verysecretkey", (err, userInfo)=> {
        if(err) return res.status(403).json("Token is not valid!")

        // for ref const token = jwt.sign({id:data[0].id}, "verysecretkey") 


        // show only the post the current user followed
        // const q =  "SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)"

        // show both followed and user's own posts - ordered by date, closet 1st

        // if there is a userId, as in profile page, only show the post of the profile user
        //userId is the profile user, userInfo is the one logged in
         const q = 
            userId !== "undefined"
                ? "SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC" 
                // : "SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE  r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC"
                : `SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId = ? ORDER BY p.createdAt DESC`;
            
        const values =  
            userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id]
           

                                   
        db.query(q, values,(err, data)=> {
            if(err) return res.status(500).send(err) // same as json(err)
           
            return res.status(200).json(data)
        })            
        
    })
}

export const addPost =(req, res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated")     
    
    jwt.verify(token, "verysecretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO posts (`desc`,`img`, `createdAt`, `userId`) VALUES(?)" //must have (?)
        console.log(userInfo)
        const values = [
            req.body.desc,
            req.body.img,           
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,           
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.json("The post has been created.")
        })
    })    
}


export const getPost =(req, res) => {
    const q = "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?"

    db.query(q, [req.params.id], (err, data)=> {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data[0])       
    })
}



export const deletePost =(req, res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated")     
    
    jwt.verify(token,  "verysecretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        //const postId = req.params.id
        const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?"
       
        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err)
            if(data.affectedRows > 0) return res.status(200).json("The post has been deleted!")
            return res.status(403).json("You can delete only your post!")
        })
    })
}



export const updatePost = (req, res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated")     
    
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id
        const q = "UPDATE posts SET `title`=?, `desc`=?,`img`=?, `cat`=? WHERE `id` = ? AND `uid` = ?"

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ]
        
        db.query(q, [...values, postId, userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.json("The post has been updated.")
        })
    })    
}