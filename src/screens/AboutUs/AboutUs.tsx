import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const AboutUs = (): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="relative">
          <div className="h-[300px] md:h-[500px] bg-[url(/about-terms-privacy.svg)] bg-cover bg-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center max-w-3xl px-4">
                Bringing the coolest events to you
              </h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="space-y-8 text-base md:text-xl">
            <p>Welcome to FaNect — Where Music Meets the Moment</p>
            <p>
              At FaNect, we're redefining how fans experience live music.
              Whether you're across the street or across the globe, we bring
              the magic of live performances right to your screen — in high
              quality, in real time, and in sync with the rhythm of your life.
            </p>
            <p>
              Born out of a passion for music and innovation, FaNect is your
              front-row seat to the world's best concerts, festivals, DJ
              sets, and underground showcases. From emerging artists to global
              superstars, we stream unforgettable moments as they unfold — all in
              one vibrant, immersive platform.
            </p>
            <p>
              Join the Movement. FaNect isn't just a platform — it's a
              pulse. A place where artists and audiences connect, no matter the
              distance. Whether you're tuning in solo or throwing a streaming
              party with friends, FaNect turns every event into an experience.
            </p>
            <p>Let's make music memories together.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};