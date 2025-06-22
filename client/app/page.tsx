import Link from "next/link";
import { Button } from "../components/ui/button";
import { ArrowRight, BarChart3, Eye, MessageSquare, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">CourtVision VR</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#use-cases"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Use Cases
            </Link>
            <Link
              href="/demo"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Demo
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden md:flex bg-white text-blue-600 border-blue-600"
            >
              Sign In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Try Demo</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  3D AI Replay for Coaches, Analysts, and Refs
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Transform 2D sports footage into immersive, interactive 3D
                  experiences. Walk around plays, analyze calls, and get
                  AI-powered insights in real-time.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/demo">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Experience Demo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button
                      variant="outline"
                      className="bg-white text-blue-600 border-blue-600"
                    >
                      How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Built with:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      Video Gaussians
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      Retell AI
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      OpenAI
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      ElevenLabs
                    </span>
                  </div>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl border bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/demo">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white text-blue-600 border-blue-600"
                    >
                      <Video className="h-5 w-5" />
                      <span className="sr-only">Play Demo</span>
                    </Button>
                  </Link>
                </div>
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="CourtVision VR Demo"
                  className="object-cover w-full h-full opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 bg-white" id="problem">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  The Problem
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  Referees miss calls. Players flop. Coaches need better tools.
                </h2>
                <p className="text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                  Every season, thousands of controversial basketball calls go
                  viral. Was that a charge or a block? Did he actually get
                  fouled, or was it a dive?
                </p>
                <ul className="space-y-2 text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-blue-600 p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span>Reviewing plays from static camera angles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-blue-600 p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span>Explaining complex strategies in film sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="rounded-full bg-blue-600 p-1 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span>
                      Helping players visualize spacing, rotation, and timing
                    </span>
                  </li>
                </ul>
                <p className="text-gray-500">
                  This lack of perspective creates frustration and
                  inefficiencies for teams at all levels—from high school to
                  pro.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-gray-100 p-4 aspect-square flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Controversial call example"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="rounded-xl border bg-gray-100 p-4 aspect-square flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Limited camera angle example"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="rounded-xl border bg-gray-100 p-4 aspect-square flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Coach reviewing footage"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="rounded-xl border bg-gray-100 p-4 aspect-square flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Player flopping example"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 bg-blue-50" id="solution">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl border bg-white">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="CourtVision VR Solution"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  The Solution
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">
                  CourtVision VR transforms 2D footage into immersive 3D
                  experiences
                </h2>
                <p className="text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                  Using Video Gaussians, coaches and analysts can slow down
                  plays, walk around them in VR, and ask a voice AI to analyze
                  what's happening—frame by frame, call by call.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Walk the Play</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Move around plays in VR, like standing on the court
                      mid-replay.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Talk to CoachBot</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Voice assistant answers questions and explains tactical
                      breakdowns.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Foul/Flop Detector</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      AI detects whether contact was real, accidental, or
                      exaggerated.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Expressive Commentary</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      AI narrates analysis with emotion, making breakdowns
                      engaging.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/demo">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Try the Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Powerful Tools for Sports Analysis
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CourtVision VR combines cutting-edge technologies to deliver
                  an unparalleled sports analysis experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <Eye className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">3D Scene Reconstruction</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Video Gaussians convert footage into dynamic 3D spatial
                    scenes with camera motion, allowing you to view plays from
                    any angle.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">Real-Time Voice AI</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Retell AI enables live back-and-forth voice conversations
                    during replays, answering questions about rules, tactics,
                    and player positioning.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">Scene Analysis</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    OpenAI GPT-4o detects events (screens, flops, fouls) and
                    understands visual context to provide accurate analysis of
                    game situations.
                  </p>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative aspect-square overflow-hidden rounded-xl border bg-gray-100">
                <img
                  src="/placeholder.svg?height=500&width=500"
                  alt="CourtVision VR Features"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white md:text-4xl/tight">
                  Ready to Transform Your Sports Analysis?
                </h2>
                <p className="mx-auto max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience the future of sports analysis with CourtVision VR.
                  Try our interactive demo today.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/demo">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    Try the Demo
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-blue-700"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold">CourtVision VR</span>
            </div>
            <p className="text-sm text-gray-500">
              Transform 2D sports footage into immersive, interactive 3D
              experiences for coaches, analysts, and referees.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:w-1/3 lg:w-1/4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link
                href="#features"
                className="hover:text-blue-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-blue-600 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#use-cases"
                className="hover:text-blue-600 transition-colors"
              >
                Use Cases
              </Link>
              <Link
                href="/demo"
                className="hover:text-blue-600 transition-colors"
              >
                Demo
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 md:w-1/3 lg:w-1/4">
            <h3 className="font-semibold">Contact</h3>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="#" className="hover:text-blue-600 transition-colors">
                info@courtvisionvr.com
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                LinkedIn
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t bg-gray-100 py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-500">
              © 2025 CourtVision VR. All rights reserved.
            </p>
            <nav className="flex gap-4 text-xs text-gray-500">
              <Link href="#" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
