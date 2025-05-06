export const HeroSection = () => {
    return (
        <section className="flex flex-col items-center justify-center gap-4 pb-6 w-full">
            <img
              className="w-full max-w-[1400px] h-[250px] md:h-[300px] object-cover rounded-lg"
              alt="Hero Banner"
              src="/image.png"
            />

            <div className="flex items-center gap-2">
              <div className="bg-green-600 w-3 h-3 rounded-full" />
              <div className="bg-gray-300 dark:bg-gray-700 w-3 h-3 rounded-full" />
              <div className="bg-gray-300 dark:bg-gray-700 w-3 h-3 rounded-full" />
            </div>
          </section>
    );
    }