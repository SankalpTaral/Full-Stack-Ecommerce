

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    category: "FASHION",
    title: "Elevate Your Everyday.",
    description:
      "Discover effortless style with oversized fits, timeless essentials and modern streetwear.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&q=85",
    button: "Shop Fashion",
    link: "/shop?category=fashion",
  },
  {
    category: "ELECTRONICS",
    title: "Technology Meets Lifestyle.",
    description:
      "Explore innovative gadgets and premium electronics designed for your everyday life.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=85",
    button: "Explore Electronics",
    link: "/shop?category=electronics",
  },
  {
    category: "ACCESSORIES",
    title: "Complete Your Look.",
    description:
      "Discover the finishing touches that make every outfit and everyday moment special.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85",
    button: "Shop Accessories",
    link: "/shop?category=accessories",
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="bg-[#faf9f6]">
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 lg:px-10">

        {/* Content */}
        <div className="max-w-xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            {slide.category} · THE LUXORA COLLECTION
          </p>

          <h1 className="text-5xl font-light leading-tight tracking-tight text-[#171717] md:text-6xl">
            {slide.title}
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-gray-500">
            {slide.description}
          </p>

          <div className="mt-10">
            <Link
              to={slide.link}
              className="inline-block bg-black px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-800"
            >
              {slide.button}
            </Link>
          </div>

          <div className="mt-16">
            <p className="text-sm tracking-widest text-gray-500">
              0{currentSlide + 1} / 0{slides.length}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="border border-gray-300 p-3 transition hover:bg-black hover:text-white"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="border border-gray-300 p-3 transition hover:bg-black hover:text-white"
              >
                <ChevronRight size={19} />
              </button>

              <div className="ml-3 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index
                        ? "w-8 bg-black"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="absolute -right-3 -top-3 h-full w-full border border-[#d8d0c4]" />

          <img
            key={slide.image}
            src={slide.image}
            alt={slide.category}
            className="relative h-[430px] w-full object-cover md:h-[540px]"
          />

          <div className="absolute bottom-5 left-5 bg-white/90 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Discover your style
            </p>
            <p className="mt-1 text-lg font-medium text-black">
              {slide.category}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
