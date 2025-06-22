import Link from "next/link";
import { Button } from "../components/ui/button";
import Navbar from "../components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navbar />

      <main className="relative z-10 flex flex-col items-start justify-center h-screen container mx-auto px-4">
        <h1 className="text-white text-5xl lg:text-7xl font-bold uppercase leading-tight mt-72">
          The Best 3D
          <br />
          AI Replay
        </h1>

        <Link href="#explore">
          <Button className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-lg text-lg">
            Explore More
          </Button>
        </Link>

        {/* Orange Dots */}
        <div className="absolute top-[30%] left-[45%] w-40 h-40 z-100">
          <Image
            src="/dots.png"
            alt="Orange graphic"
            width={160}
            height={160}
          />
        </div>

        {/* Floating Cards */}
        <div className="absolute top-1/6 left-16 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 flex items-center max-w-xl space-x-6 shadow-lg">
          <Image
            src="/coachbot.png"
            alt="CoachBot"
            width={250}
            height={250}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="text-white text-2xl font-semibold">
              Talk to our <span className="text-orange-400">CoachBot</span>
            </h3>
            <p className="text-gray-200 text-base mt-2">
              VAPI-powered voice assistant that can answer natural questions,
              pause, replay, and much more via voice.
            </p>
          </div>
        </div>

        <div className="absolute bottom-40 right-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 flex items-center max-w-xl space-x-6 shadow-lg">
          <Image
            src="/walkplay.png"
            alt="Walk the Play"
            width={250}
            height={250}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="text-white text-2xl font-semibold">
              <span className="text-orange-400">Walk</span> the Play
            </h3>
            <p className="text-gray-200 text-base mt-2">
              With our 3D Gaussian-splat representations of game footage.
              You&apos;ll be able to stand on the court mid-replay.
            </p>
          </div>
        </div>
      </main>

      {/* Optional: add a dark overlay for better text legibility */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  );
}
