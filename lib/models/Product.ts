import { model, models, Schema } from "mongoose";



const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['computers', 'phones', 'appliances']
    },
}, {
    timestamps: true
})

const ProductModel =
    models.ProductModel || model("ProductModel", productSchema);

export default ProductModel;