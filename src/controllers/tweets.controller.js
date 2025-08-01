
import { cpSync } from "fs";
import { Tweet } from "../models/tweet.models.js";
import { fileUpload } from "../models/uploadedFiles.models.js"
import { User } from "../models/user.models.js";


const getCurrentTime = () => {
    const utcTime = new Date();
    const istOffset = 5.5 * 60; // in minutes
    const istTime = new Date(utcTime.getTime());
    const IST = (istTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
    return IST;
}
const getBookMarkedTweets = async (req, res) => {
    try {
        const email = req.params.email;
        const tweets = await Tweet.find({ bookMarks: { $in: [email] } })
        if (tweets) {
            return res.status(200).json({ 'bookMarks': tweets })
        }
        else {
            return res.status(400).json({ 'message': 'some thing went wrong!' })
        }
    }
    catch (error) {
        console.log(error)
    }
}

const editTweet = async (req, res) => {
    try {
        const utcTime = new Date();
        const istOffset = 5.5 * 60; // in minutes
        const istTime = new Date(utcTime.getTime() + istOffset * 60000);
        const IST = (istTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
        const content = req.body.content;
        const file = req.file;
  

        if (req.body?.existed_file) {
            const tweet = await Tweet.updateOne({ filename: req.body.existed_file }, {
                Content: content,
            })
            const tweetTwted = await Tweet.find({ filename: req.body.existed_file });

        }
        else {
            const fileupload = await fileUpload.create({
                filename: file.filename,
                originalname: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
                uploadedBy: res.locals.user.email,
                uploadedAt: IST
            })
            const uploadFile = await fileUpload.findById(fileupload._id);
            if (!uploadFile) {
                return res.send(400).send("some thing went wrong while uploading the image!")
            }
            const tweet = await Tweet.updateOne({ _id: req.params.id }, {
                Content: content,
                fileId: fileupload._id,
                filename: file.filename
            })
            const tweetTwted = await Tweet.findById(req.params.id);
        }

        if (!tweetTwted) {
            return res.status(400).json({ message: "error while saving a tweet" })
        }
        return res.status(201).json({
            "postTweet": tweetTwted,
            'uploadedFile ': uploadFile
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error while redirecting to open defects page',
            error: error.message // or just: error
        });
    }
}
const addComment = async (req, res) => {
    try {
        const tweet_id = req.params.id;
        const cur_comment = req.body.curcomment;
        const toxicity = req.body.toxic;
        const ts = req.body.toxicScore;
     
        const time = getCurrentTime();
        const twt = await Tweet.findById(tweet_id);
        if (twt) {
            toxicity ? twt.ToxicComments.push({ 'email': res.locals.user.email, 'comment': cur_comment, 'toxicScore': ts ,'time':time}) : twt.Comments.push({ 'email': res.locals.user.email, 'comment': cur_comment, 'toxicScore': ts ,'time':time})
            twt.save();
            const out =     toxicity ? { 'message': 'Sorry we do not encourage toxic comments!', 'tweetId': tweet_id } : { 'message': 'Comment Added Successfully', 'tweetId': tweet_id }
            return res.status(201).json(out)
        }
        return res.status(401).json({ 'message': "some thing went wrong!" })
    }
    catch (err) {
        console.log(err)
    }
}

const AllComments = async (req,res)=>
{
    let comments = []
    const AllTweets = await Tweet.find();

    AllTweets.map((tweet)=>
    {
        comments = [...comments, ...tweet.Comments, ...tweet.ToxicComments];
    })

    if(AllTweets)
    {
        return res.status(201).json({'comments':comments})
    }

}

const engageContent = async (req, res) => {
    try {
        const id = req.params.id;
        const action_type = req.body.actionType;
        const email = req.body.email;
        let tweet = await Tweet.findById(id);
        if (tweet) {
            if (action_type == 'like') {
                tweet.likes.push(res.locals.user.email)
                tweet.save();
            }
            else if (action_type == 'bookmark') {
                tweet.bookMarks.push(res.locals.user.email)
                tweet.save();
            }
            else if (action_type == 'deleteBookmark') {
                tweet.bookMarks = tweet.bookMarks.filter(

                    bookmark => bookmark != email
                )
           
                // tweet['likes'] = [...likess]
                await tweet.save()
            }
            else if (action_type == 'deleteLike') {
                tweet.likes = tweet.likes.filter(

                    like => like != email
                )
      
                // tweet['likes'] = [...likess]
                await tweet.save()
            }
            return res.status(201).json({ 'engage': tweet })
        }
        return res.status(400).json({ 'message': 'some thing went wrong' })
    }
    catch (err) {
        console.log(err);
    }
}

const getTweets = async function (req, res) {
    try {
        const email = req.params.email;
        const tweets = await Tweet.find({ user_Tweeted: email });
        return res.status(200).json({ "Tweets": tweets });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching tweets', error });
    }
}

const getTweetById = async function (req, res) {
    try {
        const id = req.params.id;
        const tweets = await Tweet.findById(id);
        return res.status(200).json({ "Tweets": tweets });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching tweets', error });
    }
}


const AllTweets = async function (req, res) {
    try {

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        const tweets = await Tweet.find({}).skip(skip).limit(limit);
        return res.status(200).json({ "Tweets": tweets });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching tweets', error });
    }
}

const postTweet = async (req, res) => {
    try {
        const utcTime = new Date();
        const istOffset = 5.5 * 60; // in minutes
        const istTime = new Date(utcTime.getTime() + istOffset * 60000);
        const IST = (istTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
        const content = req.body.content;
        const file = req.file;
        const email = req.body.email;
        console.log(res.locals.user.email)
        const fileupload = await fileUpload.create({
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            uploadedBy: email,
            uploadedAt: IST
        })
        const uploadFile = await fileUpload.findById(fileupload._id);
        if (!uploadFile) {
            return res.send(400).send("some thing went wrong while uploading the image!")
        }
        const tweet = await Tweet.create({
            Content: content,
            user_Tweeted: res.locals.user.email,
            likes: [],
            Comments: [],
            bookMarks: [],
            twitter_handle: email,
            postedAt: IST,
            fileId: fileupload._id,
            filename: file.filename
        })
        const tweetTwted = await Tweet.findById(tweet._id);
        if (!tweetTwted) {
            return res.status(400).json({ message: "error while saving a tweet" })
        }
        const usr = await User.find({ email: tweet.user_Tweeted });
        if (usr) {
            const twts = usr[0].tweets;
            await User.updateOne({ email: tweet.user_Tweeted }, { tweets: twts + 1 })
        }
        return res.status(201).json({
            "postTweet": tweetTwted,
            'uploadedFile ': uploadFile
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error while redirecting to open defects page',
            error: error.message // or just: error
        });
    }
}





export {AllComments, getBookMarkedTweets, getTweetById, getTweets, addComment, engageContent, postTweet, AllTweets, editTweet };
