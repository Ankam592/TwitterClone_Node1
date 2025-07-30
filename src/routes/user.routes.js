import {Router} from "express";

import {unfollowUser,followUser, currentUser, registerUser,loginUser  ,logoutUser,userProfile,deleteUser,editUser} from "../controllers/user.controller.js";
import { homePage } from "../controllers/home.controller.js";
import {upload}   from "../middlewares/multer.middlewares.js"
import {profilePic, uploadFile ,deleteFile, downloadFile} from "../controllers/upload.controller.js";
import { AllUsers,searchUser } from "../controllers/AllUsers.controller.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
import { dashboardPage } from "../controllers/dashboard.controller.js";

import {AllComments,getBookMarkedTweets,editTweet,getTweetById,getTweets,addComment,engageContent,postTweet,AllTweets} from "../controllers/tweets.controller.js";




const router = Router()

//router.route("/").get(homePage)

router.route("/register").post(registerUser);       //inside post add fields method in upload object),
//router.route("/registerPage").get(registerPage);                                                                         // serving it at register and it is post request

router.post('/postTweet', upload.single('image'), postTweet);
router.route('/getTweets/:email').get(getTweets);
router.route('/getTweetbyId/:id').get(getTweetById);
router.route("/AllTweets").get(AllTweets); 
router.route("/engage/:id").post(engageContent);
router.route("/addComment/:id").post(addComment);
router.route("/AllComments").get(AllComments); 

router.post('/editTweet/:id', upload.single('image'), editTweet);
router.route('/bookmarks/:email').get(getBookMarkedTweets);



router.post('/profilePic',upload.single('image'),profilePic);
router.route("/login").post(loginUser);
//router.route("/loginPage").get(loginPage);
router.route("/logoutUser").get(logoutUser);
router.route("/currentuser").get(currentUser);


router.route("/userProfile/:email").get(userProfile);

router.route("/searchUser/:input").get(searchUser);
router.route("/follow/:email").get(followUser);
router.route("/unfollow/:email").get(unfollowUser)
router.route("/AllUsers").get(authorizeAdmin,AllUsers);   // authorizing users while going into profiles page as only admins has access

//router.route("/editUserPage/:id").get(editPage);
router.route("/editUser").post(editUser);
router.route('/deleteUser/:id').get(deleteUser);


router.route('/deleteFile/:id').get(deleteFile)
//router.route('/uploadPage').get(uploadPage);


router.route("/fileUpload").post(upload.single('fileUpload'),uploadFile);

//router.route("/filesPage").get(filesPage);
router.route("/downloadFile").get(downloadFile);


router.route("/dashboardPage").get(dashboardPage);


export {router};