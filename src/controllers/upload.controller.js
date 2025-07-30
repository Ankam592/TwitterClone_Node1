import { User } from "../models/user.models.js"
import { fileUpload } from "../models/uploadedFiles.models.js"
import { fileURLToPath } from "url";

import fs from 'fs';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


console.log(__dirname);

const profilePic = async (req, res) => {
   try
   {
   const utcTime = new Date();
   const istOffset = 5.5 * 60; // in minutes
   const istTime = new Date(utcTime.getTime() );
   const IST = (istTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
   const File = req.file;
   const file = await fileUpload.create({
      'filename': File.filename,
      'originalname': File.originalname,
      'path': File.path,
      'mimetype': File.mimetype,
      'size': File.size,
      'uploadedBy': req.body.content,
      'uploadedAt': IST
  })
  
     const file_ = await fileUpload.findById(file._id);
     const editUser = await User.updateOne({email : res.locals.user.email},{$set:{filename : file.filename , fileId : file._id}})
     if(file_ && editUser)
     {
       res.status(201).json({'user':file_,'message':"Uploaded Successfully"})
     }
     else
     {
             res.status(400).json({'message':'something went wrong'})

     }
   }
   catch(err)
   {
      console.log(err)
   }
  
}



const downloadFile = async function (req, res) {
   const id = req.params.id;

}

const deleteFile = async function (req, res) {
   const id = req.params.id
   const existFile = await fileUpload.findOne({ id: fileUpload._id });
   if (!existFile) {
      return res.status(404).send("No File to delete");
   }
   const filepath = join(__dirname, '../uploads', existFile.filename)

   const deletedFile = await fileUpload.deleteOne({ id: fileUpload._id })
   console.log(deletedFile)
   // Delete the file
   //const filepath = path.join(__dirname,'..',existFile.filename)
   //console.log(path)
   fs.unlinkSync(existFile.path, (err) => {
      if (err) {
         return res.status(404).send(`Error: ${err}`);
      }
      console.log('File deleted successfully');
   });
   return res.status(200).redirect('/WeatherApp/filesPage');
}


// const filesPage = async function (req, res) {
//    const { email, role } = res.locals.user
//    const existFile = await fileUpload.find({});
//    if (!existFile) {
//       return res.status(404).send("No Files")
//    }
//    else {
//       if (role == 'admin') {
//          return res.status(201).render('Files', { 'Files': existFile })
//       }
//       else if (role == 'editor') {
//          const MyFile = await fileUpload.find({ email: fileUpload.email });
//          console.log(MyFile)
//          if (!MyFile) {
//             return res.status(404).send("No Files")
//          }
//          else {
//             return res.status(201).render('Files', { 'Files': MyFile })
//          }
//       }
//    }
// }

// const uploadPage = async function (req, res) {
//    return res.render('uploadPage')
// }

const uploadFile = async function (req, res) {
   try {
      var { destination, encoding, fieldname, filename, mimetype, originalname, path, size } = req.file;
      if (Object.keys(req.file).length === 0) {
         return res.status(400).send("Invalid File")
      }
      const { email, role } = res.locals.user

      const existinguser = await User.findOne({ email });
      if (existinguser) {
         var fileUploaded = await fileUpload.create({
            filename, originalname, path, mimetype, size, uploadedBy: email, role
         })
      }
      const filecreated = await fileUpload.findById(fileUploaded._id);
      if (!filecreated) {
         return res.send(400).send("File Uploaded successfully but error in storing in database!")
      }
      return res.status(201).send({ "createdUser": filecreated });
   }
   catch (error) {
      console.log(error);
   }

   // File is successfully uploaded


}


export { profilePic, uploadFile, deleteFile, downloadFile }