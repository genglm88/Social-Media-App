import {db} from "../connect.js" 
import jwt from "jsonwebtoken"

export const getRelationships = (req, res) => {
    
          const q =  "SELECT followerUserId  FROM relationships  WHERE followedUserId = ? "
                                    
         db.query(q, [req.query.followedUserId],(err, data)=> {
             if(err) return res.status(500).send(err) // same as json(err)
             return res.status(200).json(data.map(relationship => relationship.followerUserId))
             //need mapping because it return an object
             0
                // 0: {followerUserId: 1}
                // 1: {followerUserId: 3}
         })            
     
 }

 export const getFollowingRelationships = (req, res) => {
    
    const q =  "SELECT followedUserId  FROM relationships  WHERE followerUserId = ? "
                              
   db.query(q, [req.query.followerUserId],(err, data)=> {
       if(err) return res.status(500).send(err) // same as json(err)
       //return res.status(200).json(data.map(relationship => relationship.followedUserId))
       return res.status(200).json(data.map(relationship => relationship.followedUserId))
       //need mapping because it return an object
       0
          // 0: {followerUserId: 1}
          // 1: {followerUserId: 3}
   })            

}


 export const addRelationship =(req, res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated")     
    
    jwt.verify(token, "verysecretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const q = "INSERT INTO relationships ( `followerUserId`, `followedUserId`) VALUES(?)" //must have (?)
        //console.log(userInfo)
        const values = [
            userInfo.id,     
            req.body.userId      
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Following.")
        })
    })    
}

export const deleteRelationship =(req, res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated")     
    
    jwt.verify(token, "verysecretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!")

        const q = "DELETE FROM relationships WHERE `followerUserId`= ? AND `followedUserId` = ? " 
        //console.log(userInfo)
        // const values = [
        //     userInfo.id,     
        //     req.params.postId      
        // ]

        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Unfollowed.")
        })
    })    
}