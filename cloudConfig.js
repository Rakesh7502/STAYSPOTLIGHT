const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//accessing google drive account
//backend to access the cloud storage with the cloud credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

});

//defining storage->like where to store(folder) files in that google drive
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "stayspotlight_DEV",
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

  module.exports= {
    cloudinary,
    storage,
  };