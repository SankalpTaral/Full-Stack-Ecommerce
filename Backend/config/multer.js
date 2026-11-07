import multer from "multer"

// whenever an file arrives keep it server RAM not in disk storage
// storage is an object which represents Multer memory storage engine 
const storage = multer.memoryStorage();


const upload = multer({
    storage : storage
});

/*

"Create an upload middleware,
 and whenever a file arrives,
  use this particular storage engine to handle it."


  multer() → Creates a Multer instance.



storage: storage → Tells Multer which storage engine to use.



const upload = ... → Stores the configured instance in the upload variable.


storage = How and where files are stored.



upload = Configured Multer instance that provides upload middleware.

*/

export default upload;