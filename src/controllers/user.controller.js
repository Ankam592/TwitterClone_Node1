import { User } from "../models/user.models.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieparser from 'cookie-parser'
import { fileUpload } from "../models/uploadedFiles.models.js";



const editUser = async function (req, res) {
    try {
        const { username, Fullname, Password, confirmPassword, Address, pincode, role, email } = req.body;

        // Check if password and confirmPassword match
        if (Password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        // Hash the password if updated
        const hashedPassword = await bcrypt.hash(Password, 10); // Adjust hashing if necessary

        // Update the user by email (assuming email is unique and not editable)
        await User.updateOne(
            { email: email }, // find by email
            {
                username: username,
                Fullname: Fullname,
                Password: hashedPassword,
                Address: Address,
                pincode: pincode,
                role: role,
            }
        );

        // Redirect or send a success message after the update
        return res.status(200).redirect("/WeatherApp/AllUsers");
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while updating the user.");
    }
}


// const editPage = async function (req, res) {
//     const id = req.params.id;
//     const existedUser = await User.findById(id);
//     try {
//         return res.status(200).render('editUser', { 'user': existedUser });
//     }
//     catch (error) {
//         return res.status(404).send("some error occured!")
//     }
// }

// const registerPage = async function (req, res) {
//     res.render('register');

// }
const registerUser = async function (req, res) {
    try {
        console.log(req)
        var { username, email, Password, confirmPassword, bio } = req.body.data;
        console.log(req.body)
        if (Object.keys(req.body.data).length === 0) {
            return res.status(400).send("Invalid Input")
        }
        if (username.trim() == "" || email.trim() == "") {
            return res.status(400).send("Both Username and email fields should not be empty")
        }

        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(401).json({ 'message': "User with email already exist" });
        }
        if (Password !== confirmPassword) {
            return res.status(401).json({ 'message': 'passwords are not matching!' })
        }
        Password = await bcrypt.hash(Password, 10)
        const token = jwt.sign({
            email: email,
            username: username,
        },
            'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNTQ4NTE5MSwiaWF0IjoxNzI1NDg1MTkxfQ.1PC4lxzqGzLlYYEhmDuprB8kCJhuVadBeAiyLgin354',
            {
                expiresIn: '2h'
            })
        const now = new Date();
        const user = await User.create({
            username, email, Password, refreshToken: token, Followers: [], createdAt: now.toISOString(), Following: [],
            bio, tweets: 0, filename: "", fileId: ""
        })

        const createdUser = await User.findById(user._id);
        if (!createdUser) {
            return res.send(400).send("some thing went wrong while registering a user!")
        }
        return res.status(201).json({ "createdUser": createdUser });
    }
    catch (error) {
        console.log(error);
    }
}

// const loginPage = async function (req, res) {
//     console.log("Connected to backend and DB")
//     return res.render('login');
// }

const loginUser = async function (req, res) {

    var { email, Password } = req.body
    if (email.trim() == "" || Password.trim() == "") {
        return res.status(200).send("Both Fields are required");
    }
    const existedUser = await User.findOne({ email })
    if (!existedUser) {
        return res.status(401).json({ 'error': "Please register to the Application" })
    }
    const isMatch = await bcrypt.compare(Password, existedUser.Password);
    if (isMatch) {
        const token = jwt.sign({                                        // creating a JWT Token using id and email
            _id: existedUser._id,
            email: email,
        },
            'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNTQ4NTE5MSwiaWF0IjoxNzI1NDg1MTkxfQ.1PC4lxzqGzLlYYEhmDuprB8kCJhuVadBeAiyLgin354',
            {
                expiresIn: '2h'
            })
        // send token in cookie parser
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "Lax",
            secure: false, // Prevents JavaScript access to the cookie
            //secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
            maxAge: 3600000, // 1 hour in milliseconds
        });
        if (token) {
            try {
                const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
                res.locals.isAuthenticated = true;
                res.locals.user = decoded; // Pass user info to views
                console.log("hii",res.locals,decoded)
            } catch (err) {
                res.locals.isAuthenticated = false;
            }
        } else {
            res.locals.isAuthenticated = false;
        }
        console.log(res);
        return res.status(200).json({ "user": existedUser })  // we are sending only json data to front end, we dont render as react will do that
    } else {
        // Passwords don't match
        return res.status(401).json({ "error": "Wrong Password!" });
    }
}

const logoutUser = async function (req, res) {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ 'message': "successfully logged out" })
    }
    catch (error) {
        console.log(error)
    }

}

const currentUser = async (req, res) => {
    console.log(req);
    try {
        res.status(200).json({ 'userdata': res.locals })
    }
    catch (error) {
        console.log(error)
    }

}

const userProfile = async function (req, res) {
    const email = req.params.email
    console.log(email)
    const existUser = await User.find({ email: email });
    console.log(existUser)
    if (!existUser) {
        return res.status(404).send("No particular user")
    }
    return res.status(201).json({ 'exuser': [existUser] });
}



const followUser = async function (req, res) {
    const email = req.params.email
    const cur_user = res.locals.user.email;
    console.log(email)
    const existUser = await User.findOne({ email: email });
    const curexistUser = await User.findOne({ email: cur_user })
    if (!curexistUser) {
        return res.status(404).send("No particular user")
    }
    console.log(existUser)
    if (!existUser) {
        return res.status(404).send("No particular user")
    }
    existUser.Followers.push(cur_user)
    curexistUser.Following.push(email)
    await existUser.save();
    await curexistUser.save()
    return res.status(201).json({ 'exuser': [existUser] });
}


const unfollowUser = async function (req, res) {
    const email = req.params.email
    const cur_user = res.locals.user.email;
    let existUser = await User.findOne({ email: email });
    let curexistUser = await User.findOne({ email: cur_user })
    if (!existUser) {
        return res.status(404).send("No particular user")
    }
    if (!curexistUser) {
        return res.status(404).send("No particular user")
    }
    existUser.Followers = existUser.Followers.filter((followers) => {
        followers != cur_user;
    })
    curexistUser.Following = curexistUser.Following.filter(
        following => following != existUser.email
    )
    await existUser.save();
    await curexistUser.save();
    const allUsers = await User.find({});
    return res.status(201).json({ 'exuser': allUsers });
}


const deleteUser = async function (req, res) {
    const id = req.params.id
    console.log(id)
    const existUser = await User.findOne({ id: User._id });
    console.log(existUser)
    if (!existUser) {
        return res.status(404).send("No User to delete");
    }
    const deletedUser = await User.deleteOne({ id: User._id })
    console.log(deleteUser)
    return res.status(200).redirect('/WeatherApp/AllUsers');
}

export { unfollowUser, followUser, currentUser, registerUser, loginUser, logoutUser, userProfile, deleteUser, editUser }