import mongoose,{Schema} from  'mongoose';
import { type } from 'os';
const TweetSchema = new Schema(
    {
        Content : 
        {
            type : String,
            required : true
        },
        user_Tweeted :
        {
            type : String,
            required : true
        },
        likes :
        {
            type : Array,
            default: [],
            required : true
        },
        Comments :
        {
            type : Array,
           // default: [{'email':'manojkumarankam0405@gmail.com','comment':'First Comment'}],
            required : true
        },
          ToxicComments :
        {
            type : Array,
           // default: [{'email':'manojkumarankam0405@gmail.com','comment':'First Comment','toxicScore':0,'insultScore':0}],
             required : true
        },
        twitter_handle :
        {
            type : String,
            required : true
        },
        postedAt :
        {
            type : String,
            required : true
        },
        fileId :
        {
            type : String,
            required : true
        },
        filename  :
        {
            type : String,
            required : true
        },
        bookMarks :
        {
            type : Array,
            default : ['manojkumarankam0405@gmail.com'],
        }

    },{timestamps : true} 
)

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
export {Tweet};
