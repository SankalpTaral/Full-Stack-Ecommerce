
import { Link } from "react-router-dom";

function CategorySection() {
  const categories = [
    {
      name: "Fashion",
      description: "Define your everyday style",
      image:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900&q=85",
      link: "/shop?category=fashion",
    },
    {
      name: "Electronics",
      description: "Upgrade your lifestyle",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=85",
      link: "/shop?category=electronics",
    },
    {
      name: "Accessories",
      description: "The perfect finishing touch",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85",
      link: "/shop?category=accessories",
    },
  ];

  return (
    <section className="bg-white px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              Discover LUXORA
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden border-b border-black pb-1 text-sm md:block"
          >
            View All Collections →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              to={category.link}
              key={category.name}
              className="group relative overflow-hidden bg-gray-100"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-[450px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-3xl font-semibold">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-white/80">
                  {category.description}
                </p>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em]">
                  Explore Collection →
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CategorySection;
