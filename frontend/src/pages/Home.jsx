
import CategorySection from "../components/Category";
import FeaturedProducts from "../components/FeatureProducts";
import Hero from "../components/Hero";

function Home() {
  return (
    <main>
      <Hero />
      <CategorySection/>
      <FeaturedProducts />
    </main>
  );
}

export default Home;
