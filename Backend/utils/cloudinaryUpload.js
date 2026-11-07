
// The use case of this is an helper function which takes the buffer and uploads that to cloudinary



// we are importing this cloudinary because that config is needed to upload image with ur cloudinary user api details
import cloudinary from "../config/cloudinary.js";


/*
* uploadToCloudinary is a function that takes an input parameter called buffer
* buffer comes from multer req.file.buffer
* in this we are returning a promise because why we are using a promise
* because uploading an image takes time it does not happen instantly
* javascript starts the upload , but cloudinary needs some time to process and store the image.
* a promise let u represent the operation 
* resolved : means upload succeded
* reject: upload failed
* We return this Promise so that the calling function can use await
* Ex const result = await uploadToCloudinary(req.file.buffer);
* await waits until the Promise settles.
* cloudinary.uploader gives us Cloudinary's upload functionality.
* upload_stream() starts an upload using a stream.
* A stream lets data flow from one place to another rather than requiring us to save the entire file to disk first.
* Here we are sending buffer to cloudinary 
* this object { resource_type: "image" } tells cloudinary that we are uploading an image
* Callback function Cloudinary calls it when an upload is finished 
* it gives us two possible piece of information
* err -> details if something went wrong
* result -> information about the uploaded image if succesfull
* if error comes up , we reject the promise
* otherwise resolve with the upload result 

 uploadStream.end(buffer); final piece we created an upload stream
 but we have not sent it cloudinary yet 

  uploadStream.end(buffer); final piece of dice 
 .end(buffer) it does two things
 * sends buffer data into the upload stream
 * and signals no more data is coming 
 * 
 * cloudinary can recieve and process the image   
 

* callback will run after the buffer is sent to cloudinary 

 * exporting This allows us to import and reuse this function in our controller.

*/
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
        // object of which type
      { resource_type: "image" },

      // callback function 
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export default uploadToCloudinary;