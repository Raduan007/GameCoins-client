import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import PopularGames from "@/components/home/PopularGames";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Statistics from "@/components/home/Statistics";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PopularGames />
        <FeaturedPackages />
        <WhyChooseUs />
        <Statistics />
        <Testimonials />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}