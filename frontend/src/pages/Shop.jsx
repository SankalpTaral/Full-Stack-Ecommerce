import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import Product from "../components/Product";


const Shop = () => {
  const [loading , setLoading] = useState(true);

  const [products , setProducts] = useState([])

  const [error , setError] = useState(false);


 
      const renderShimmer = () => {
    return Array.from({ length: 12}).map((_, index) => (
      <div key={index} className="animate-pulse mt-4 flex flex-col items-center ">
        {/* Image skeleton */}
        <div className="h-[320px] w-[90%] bg-gray-200"  />

        {/* Product details skeleton */}
        <div className="space-y-3 pt-5 w-[90%]">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-11 w-[90%] rounded bg-gray-200" />
        </div>
      </div>
    ));
  };
 
    useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
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
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2">
    {loading && renderShimmer()}
  </div>

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



     <div className="grid   gap-2  grid-cols-1 grid-rows-12 mx-auto  md:grid-cols-3 grid-rows-4 xl:grid-cols-4 grid-rows-3  ">
      
      {products.map((item)=>{
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
    </>
  )
  
};

export default Shop;
