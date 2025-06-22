import Image from "next/image";

export default function DemoNavbar() {
    return (
        <header className="w-full z-20 px-8 pt-8 text-center">
            <div className="container mx-auto flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <Image src="/logo.png" alt="CourtVision" width={32} height={32} />
                    <span className="text-white text-3xl font-bold">CourtVision</span>
                </div>
            </div>
        </header>
    );
}
