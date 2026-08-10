export default function HeroSection() {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black/50 p-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Bringing Events to Life Through Cinematic Media & Live Broadcasting
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Professional multimedia production, live streaming, photography, and event technology solutions.
          </p>
        </div>
      </section>
    );
  }