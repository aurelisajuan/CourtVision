import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <header className="absolute top-0 left-0 w-full z-20">
        <div className="container mx-auto flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="CourtVision" width={32} height={32} />
            <span className="text-white text-3xl font-bold">CourtVision</span>
            </div>
            <nav className="hidden md:flex space-x-8">
            <Link
                href="#"
                className="text-white hover:text-orange-400 transition relative group"
            >
                About Us
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link
                href="#"
                className="text-white hover:text-orange-400 transition relative group"
            >
                Contact Us
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link
                href="#"
                className="text-white hover:text-orange-400 transition relative group"
            >
                Product
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link
                href="#"
                className="text-white hover:text-orange-400 transition relative group"
            >
                Our Programs
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            </nav>
        </div>
        </header>
    );
}
