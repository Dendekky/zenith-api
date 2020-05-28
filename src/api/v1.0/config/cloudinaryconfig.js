import cloudinary from 'cloudinary';
// import fs from 'fs';
require('dotenv').config();


cloudinary.config({
  cloud_name: 'dendekky',
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const uniqueFilename = new Date().toISOString();

exports.uploadImage = file => new Promise((resolve) => {
  cloudinary.uploader.upload(
    file,
    (result) => {
      resolve({ url: result.url, id: result.public_id });
    },
    { resource_type: 'auto' },
  );
});
