
# Part 1
- Created a signup Flow
- Created a Login Flow


 const renderShimmer = () => {
    return Array.from({ length: 12 }).map((_, index) => {
      return (
        <div key={index} className=" border-2 max-w-[80%] mt-3 ml-3">
          {/* Image */}

          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlZH0mP4Ya3LtL0frNoX7J54yuK9mFpaXFj3JduvimnRa1dvAjQFJAy50&s=10"
            alt="headphones"
            className="h-[370px]  w-[320px] mx-auto mt-2 hover:scale-105"
          />

          {/* details*/}
          <div className="mt-3 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 pl-5 pr-2 p-1">
              Accessories
            </p>

            <h3 className="mt-2 text-md font-medium text-gray-900 transition-colors group-hover:text-gray-500 pl-5 pr-1 ">
              Headphones
            </h3>

            <span className="text-sm font-semibold text-gray-900   pl-5 pr-2 p-1">
              ₹199
            </span>

            {/* Buttons */}
            <div className="flex gap-2 items-center   pl-5 pr-2 p-1">
              <button className={buttonClass}>Buy Now</button>
              <button className={buttonClass}>Add to Cart</button>
            </div>
          </div>
        </div>
      );
    });
  };
