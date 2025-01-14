import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { create, getposts,deletepost, updatepost,} from '../controlers/post.controler.js'
const router=express.Router()


// router.post('/create',verifyToken,create)
// router.get('/getposts', getposts)
// router.delete('/deletepost/:postId/:userId',verifyToken,deletepost)
// router.put('/updatepost/:postId/:userId',verifyToken,updatepost)
// // router.get('/getUserCreatorPost/:userId',getUserCreatorPost)
// export default router
