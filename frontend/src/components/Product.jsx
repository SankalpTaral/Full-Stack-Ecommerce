import { Link } from "react-router-dom"
import { ShoppingBag, ShoppingCart} from "lucide-react";

function Product({image , name , price , category ,_id}) {

  return (
   <>
   <div className="mt-4">
          {/* Actual Products */}
                {/* Product Image */}
                <Link
                  to={`/product/${_id}`}
                  className="relative block overflow-hidden bg-gray-100"
                >
                  <img
                    src={image?.url}
                    alt={name}
                    loading="lazy"
                    className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                {/* Product Details */}
                <div className="pt-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    {category}
                  </p>

                  <Link to={`/product/${_id}`}>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-gray-500">
                      {name}
                    </h3>
                  </Link>

                  <div className="mt-3">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{Number(price).toLocaleString("en-IN")}
                    </span>
                  </div>

                <div className="flex gap-2">
                  <button
                    className="mt-5 flex w-full items-center justify-center gap-2 border border-gray-300 py-3 text-xs font-semibold uppercase tracking-widest transition-all hover:border-black hover:bg-black hover:text-white"
                  >
                    <ShoppingBag size={15} />
                    Add to Cart
                  </button>
                    <button
                    className="mt-5 flex w-full items-center justify-center gap-2 border border-gray-300 py-3 text-xs font-semibold uppercase tracking-widest transition-all hover:border-black hover:bg-black hover:text-white"
                  >
                    <ShoppingCart size={15} />
                   BuyNow
                  </button>
                  </div>
                </div>

</div>


    </>
)
}
export default Product