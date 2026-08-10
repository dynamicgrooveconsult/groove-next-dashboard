import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-[#050505] text-white">
      {/* Logo and Name on the Left */}
      <div className="font-bold text-xl tracking-tight">
        Dynamic Groove Media
      </div>

      {/* Navigation Links on the Right */}
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <Link href="/services" className="hover:text-gray-300 transition-colors">Services</Link>
        <Link href="/portfolio" className="hover:text-gray-300 transition-colors">Portfolio</Link>
        {/* Updated path to match the folder structure */}
        <Link href="/live-broadcast" className="hover:text-gray-300 transition-colors">Live Broadcast</Link>
        <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>

        {/* "Watch Live" Button in the Nav */}
        <Link 
          href="/live-broadcast" 
          className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all"
        >
          Watch Live
        </Link>
      </div>
    </nav>
  );
}