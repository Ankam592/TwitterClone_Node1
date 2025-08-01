import { User } from "../models/user.models.js"
import { Logger } from "../../utils/logger.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
const AllUsers = async function (req, res) {
  try {
    const { email } = res.locals.user;
    var users = await User.find({});    
    return res.status(200).json({ "Members": users });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching members', error });
  }
}

const searchUser = async (req, res) => {
  const searchText = (req.params.input);

  const Regex = new RegExp(`\\s*${searchText}\\s*`, 'mi');  
// for allowing whitespace-\\s*  and m for multiline and i for case-insensitive  
  var membersEmp;
     membersEmp = await User.find({
      $or: [ 
        { username: { $regex: Regex } },
        { email: { $regex: Regex } }
      ]
    })

  return res.status(200).json({ 'text': membersEmp })
}


export { AllUsers, searchUser };