import cloudinary from 'cloudinary';
// import fs from 'fs';
require('dotenv').config();


cloudinary.config({
    cloud_name: 'dendekky',
    api_key: '439755927867787',
    api_secret: '8TnFlBfebKxIw_Hp8JAM5QDMPBU'
});

const uniqueFilename = new Date().toISOString();

exports.uploadImage = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(
            file, 
            (result) =>{
                resolve({url: result.url, id: result.public_id})
            }, 
            {resource_type: "auto"}
        )
    })
};
