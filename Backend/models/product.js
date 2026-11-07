import mongoose from "mongoose";

const {Schema} = mongoose


const productSchema = new Schema ({
    name : {
       type :  String,
       required : true
    },
     price : {
       type :  Number,
         required : true,
         min : 0
    },
     description : {
       type :  String
    },
     stock : {
       type :  Number,
       required : true,
       min : 0 ,
        validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number"
    }
    },
    category : {
        type : String,
        required : true
    },
    image: {
    url: String,
    publicId: String
}

})

const Product = mongoose.model('Product' , productSchema)

export default Product;