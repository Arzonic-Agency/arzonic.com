import Hero from "@/components/client/home/Hero";
import Prices from "@/components/client/home/Prices";
import Process from "@/components/client/home/Process";
import NavProcess from "@/components/client/home/NavProcess";
import Preview from "@/components/client/home/Preview";
import SplashScreen from "@/components/client/layout/SplashScreen";

const Home = () => {
  return (
    <>
      <SplashScreen />
      <section className="h-[700px]">
        <Hero />
      </section>
      <section className="h-[2000px] lg:h-[800px]">
        <Prices />
      </section>
      <section className="h-[800px]">
        <NavProcess />
      </section>
      <section id="Process" className="h-[2000px]">
        <Process />
      </section>
      <section className="h-[2000px]">
        <Preview />
      </section>
    </>
  );
};

export default Home;
