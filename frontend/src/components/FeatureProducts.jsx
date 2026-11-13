

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {ArrowRight} from "lucide-react"
import { getProducts } from "../services/productService";
import Product from "./Product";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(4);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // White shimmer skeleton
  const renderSkeletons = () => {
    return Array.from({ length: 9 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        {/* Image skeleton */}
        <div className="h-[320px] w-full bg-gray-200" />

        {/* Product details skeleton */}
        <div className="space-y-3 pt-5">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-11 w-full rounded bg-gray-200" />
        </div>
      </div>
    ));
  };

  return (
    <section className="bg-[#faf9f6] px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              Curated for you
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Discover products worth adding to your collection.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 border-b border-black pb-2 text-sm font-medium md:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">

          {/* Loading State */}
          {loading && renderSkeletons()}

          {/* Error State */}
          {!loading && error && (
            <div className="col-span-full py-16 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-500">
                No products available right now.
              </p>
            </div>
          )}

          {/* Actual Products */}
        
          {!loading &&
            !error &&
            products.map((item)=>{
        return <Product 
        key ={item._id}
        _id = {item._id}
         image = {item.image}
        category = {item.category}
        desc = {item.description}
        price = {item.price}
        name = {item.name}
        stock = {item.stock}
        />
      })
    }
    </div>
    </div>
    </section>
  );
}

export default FeaturedProducts;
