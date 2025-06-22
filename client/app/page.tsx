import Link from "next/link";
import { Button } from "../components/ui/button";
import Navbar from "../components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navbar />

      <main className="relative z-10 flex flex-col items-start justify-center h-screen container mx-auto px-4">
        <h1 className="text-white text-4xl lg:text-6xl font-bold uppercase leading-tight">
          The Best 3D
          <br />
          AI Replay
        </h1>

        <Link href="/demo">
          <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg text-lg">
            Try Demo
          </Button>
        </Link>

        {/* Orange Dots */}
        <div className="absolute top-[20%] left-[45%] w-32 h-32">
          <Image
            src="/dots.png"
            alt="Orange graphic"
            width={128}
            height={128}
          />
        </div>

        {/* Floating Cards */}
        <div className="absolute top-[15%] left-16 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 flex items-center max-w-lg space-x-4 shadow-lg">
          <Image
            src="/coachbot.png"
            alt="CoachBot"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="text-white text-xl font-semibold">
              Talk to our <span className="text-orange-400">CoachBot</span>
            </h3>
            <p className="text-gray-200 text-sm mt-1">
              VAPI-powered voice assistant that can answer natural questions,
              pause, replay, and much more via voice.
            </p>
          </div>
        </div>

        <div className="absolute bottom-[15%] right-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 flex items-center max-w-lg space-x-4 shadow-lg">
          <Image
            src="/walkplay.png"
            alt="Walk the Play"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="text-white text-xl font-semibold">
              <span className="text-orange-400">Walk</span> the Play
            </h3>
            <p className="text-gray-200 text-sm mt-1">
              With our 3D Gaussian-splat representations of game footage.
              You&apos;ll be able to stand on the court mid-replay.
            </p>
          </div>
        </div>
      </main>
      <p className="absolute bottom-4 w-full text-center text-gray-300 text-sm">&copy; 2025 Berkeley AI Hack Powered by Energy Drinks </p>
    </div>
  );
}
