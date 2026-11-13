
const ProductDetailsShimmer = () => {
  return (
    <div className="min-h-screen bg-white animate-pulse">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <div className="h-4 w-48 bg-gray-200 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT: Image Skeleton */}
          <section className="space-y-4">

            {/* Main Image */}
            <div className="aspect-square w-full bg-gray-200 rounded-2xl" />

        

          </section>


          {/* RIGHT: Product Information Skeleton */}
          <section className="flex flex-col gap-6">

            {/* Category */}
            <div className="h-3 w-28 bg-gray-200 rounded" />

            {/* Product Name */}
            <div className="space-y-3">
              <div className="h-9 w-full bg-gray-200 rounded" />
              <div className="h-9 w-2/3 bg-gray-200 rounded" />

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-28 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>

            {/* Stock */}
            <div className="h-4 w-24 bg-gray-200 rounded" />

            {/* Description */}
            <div className="space-y-3">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="h-6 w-32 bg-gray-200 rounded" />

              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-48 bg-gray-200 rounded"
                />
              ))}
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-12 w-36 bg-gray-200 rounded-xl" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-14 bg-gray-200 rounded-xl" />
              <div className="h-14 bg-gray-200 rounded-xl" />
            </div>

            {/* Delivery Information */}
            <div className="border-t border-gray-200 pt-6 space-y-5">

              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}

            </div>

          </section>
        </div>


        {/* Specifications Skeleton */}
        <section className="mt-20 border-t border-gray-200 pt-10">

          <div className="h-8 w-64 bg-gray-200 rounded mb-8" />

          <div className="max-w-3xl divide-y divide-gray-200">

            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between py-5 gap-4"
              >
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-36 bg-gray-200 rounded" />
              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  );
};

export default ProductDetailsShimmer;
