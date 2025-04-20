import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const AboutUs = (): JSX.Element => {
  return (
    <div className="bg-background text-foreground max-w-[1440px] mx-auto">
      <Header />
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 max-w-4xl mx-auto">
      <section className="absolute w-full h-[500px] top-0 left-0">
          <div className="relative h-[500px] bg-[url(/about-terms-privacy.svg)] bg-cover bg-[50%_50%]">
            <h1 className="absolute w-[686px] h-[140px] top-[179px] left-[355px] [font-family:'Sofia_Pro-Bold',Helvetica] font-bold text-[#eeeeee] text-[70px] text-center tracking-[-1.40px] leading-[normal]">
              Bringing the coolest events to you
            </h1>
          </div>
        </section>
        <section className="absolute w-[890px] h-[432px] top-[561px] left-[280px] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-black text-xl tracking-[-0.40px] leading-9">
          <p>Welcome to FaNect — Where Music Meets the Moment</p>
          <p>
            At FaNect, we&#39;re redefining how fans experience live music.
            Whether you&#39;re across the street or across the globe, we bring
            the magic of live performances right to your screen — in high
            quality, in real time, and in sync with the rhythm of your life.
          </p>
          <p>
            Born out of a passion for music and innovation, FaNect is your
            front-row seat to the world&apos;s best concerts, festivals, DJ
            sets, and underground showcases. From emerging artists to global
            superstars, we stream unforgettable moments as they unfold — all in
            one vibrant, immersive platform.
          </p>
          <br />
          <p>
            Join the Movement. FaNect isn&apos;t just a platform — it&apos;s a
            pulse. A place where artists and audiences connect, no matter the
            distance. Whether you&#39;re tuning in solo or throwing a streaming
            party with friends, FaNect turns every event into an experience.
          </p>
          <p>Let&apos;s make music memories together.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};