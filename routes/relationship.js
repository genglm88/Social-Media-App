import express from "express"
import {getRelationships,addRelationship, deleteRelationship, getFollowingRelationships} from "../controllers/relationship.js"

const router = express.Router()

router.get("/", getRelationships)
router.get("/find", getFollowingRelationships)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)

export default router