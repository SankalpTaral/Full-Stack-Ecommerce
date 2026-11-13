import { useParams } from "react-router-dom";


import { useState , useEffect } from "react";
import QuantitySelector from "../components/QuantitySelector";
import ProductDetailsShimmer from "../components/ProductDetailShimmer";
import { getProductById } from "../services/productService";

const ProductDetails = () => {

  const [loading, setLoading] = useState(false);

  const [product , setProduct] = useState();

  console.log(product);
  const { id } = useParams();

  useEffect(()=>{

    const fetchProductById = async()=>{

        setLoading(false);
        const data = await getProductById(id);

        setProduct(data.product)
        
        


    }
    fetchProductById();
  },[])

  if (loading) {
  return <ProductDetailsShimmer />;
}

if (!product) {
  return <p>Product not found</p>;
}

const { name, image, category, price, description, stock } = product;


const mrp = 15999;

const discount = Math.round(
  ((mrp - price) / mrp) * 100
);


  return (
    <>
        <div className="min-h-screen bg-white text-gray-900">

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-8">
              Home / Shop / {category} / Product
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

              {/* Product Images */}
              <section className="space-y-4">

                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <img
                    src={image.url}
                    alt="Product"
                    className="w-full h-full object-contain"
                  />
                </div>

              </section>

              {/* Product Information */}
              <section className="flex flex-col gap-6">

                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Electronics
                </p>

                {/* Name and Rating */}
                <div className="space-y-3">

                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {name}
                  </h1>

                  <div className="flex items-center gap-3">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm text-gray-500">
                      4.8 (120 Reviews)
                    </span>
                  </div>

                </div>

                {/* Price */}
                <div className="flex items-center gap-3 flex-wrap">

                  <span className="text-3xl font-bold">
                    ₹{price}
                  </span>

                  <span className="text-lg text-gray-400 line-through">
                   {mrp}
                  </span>

                  <span className="text-sm font-semibold text-green-600">
                    {discount}%
                  </span>

                </div>

                {/* Stock */}
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium text-green-600">
                    In Stock {stock}
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-3">

                  <h2 className="text-lg font-semibold">
                    Product Description
                  </h2>

                  <p className="text-gray-600 leading-7 text-sm md:text-base">
                    {description}
                  </p>

                </div>

                

                {/* Quantity */}
                <QuantitySelector />

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <button className="bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition">
                    Add to Cart
                  </button>

                  <button className="border border-black py-4 rounded-xl font-semibold hover:bg-gray-100 transition">
                    Buy Now
                  </button>

                </div>

                {/* Delivery Information */}
                <div className="border-t border-gray-200 pt-6 space-y-5">

                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="text-sm font-semibold">Free Delivery</p>
                      <p className="text-xs text-gray-500">
                        Delivery within 3–5 business days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl">↩️</span>
                    <div>
                      <p className="text-sm font-semibold">Easy Returns</p>
                      <p className="text-xs text-gray-500">
                        7-day return policy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <p className="text-sm font-semibold">Secure Payment</p>
                      <p className="text-xs text-gray-500">
                        Secure checkout experience
                      </p>
                    </div>
                  </div>

                </div>

              </section>
            </div>

            {/* Specifications */}
            <section className="mt-20 border-t border-gray-200 pt-10">

              <h2 className="text-2xl font-bold mb-8">
                Product Specifications
              </h2>

              <div className="max-w-3xl divide-y divide-gray-200">

                {[
                  ["Brand", name],
                  ["Category", category],
                  ["Warranty", "1 Year"]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between py-4 gap-4"
                  >
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}

              </div>
            </section>

          </main>
        </div>
    </>
  );
};

export default ProductDetails;
