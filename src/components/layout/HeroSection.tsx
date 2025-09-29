
import { useState, useEffect } from "react";

interface HeroSlide {
  id: number;
  image: string;
  title?: string;
  description?: string;
}

const heroSlides: HeroSlide[] = [
  { id: 1, image: "/Banner1.png", title: "", description: "" },
  { id: 2, image: "/Banner2.png", title: "", description: "" },
  { id: 3, image: "/Banner3.png", title: "", description: "" },
];

const smallScreenHeroSlides: HeroSlide[] = [
  { id: 1, image: "/Banner 1.png", title: "", description: "" },
  { id: 2, image: "/Banner 2.png", title: "", description: "" },
  { id: 3, image: "/Banner 3.png", title: "", description: "" },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect screen size based on Tailwind's lg breakpoint (1024px)
  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    checkScreen(); // run on mount
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const slides = isSmallScreen ? smallScreenHeroSlides : heroSlides;

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);

    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 pb-6 w-full relative">
      <div className="relative w-full max-w-[1400px] h-[250px] md:h-[300px] rounded-lg overflow-hidden group">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="relative w-full h-full flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt={slide.title || `Hero slide ${slide.id}`}
                src={slide.image}
              />

              {/* Overlay with content */}
              {(slide.title || slide.description) && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-2xl">
                    {slide.title && (
                      <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="text-lg md:text-xl opacity-90">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-green-600 scale-110"
                : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};



