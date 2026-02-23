import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoDownloader from "@/components/VideoDownloader";
import Features from "@/components/Features";
import Platforms from "@/components/Platforms";
import FAQ from "@/components/FAQ";
import AffiliateBanner from "@/components/AffiliateBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <VideoDownloader />
        <AffiliateBanner />
        <Features />
        <Platforms />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
