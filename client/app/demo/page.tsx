"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import {
  ArrowLeft,
  Pause,
  Play,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Mic,
  MicOff,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ThreeDViewer } from "../../components/three-d-viewer";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const containerRef = useRef(null);

  // Simulate loading the 3D scene
  useEffect(() => {
    // In a real implementation, this would load the 3D scene data
    setDuration(100);

    // Simulate assistant welcome message
    setTimeout(() => {
      setAssistantMessage(
        "Welcome to CourtVision VR! I'm your CoachBot assistant. You can ask me questions about the play or request analysis at any time."
      );
    }, 1500);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
    if (!isMicActive) {
      // In a real implementation, this would activate the microphone
      setAssistantMessage(
        "I'm listening. What would you like to know about this play?"
      );
    } else {
      setAssistantMessage("Microphone deactivated.");
    }
  };

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const analyzePlay = () => {
    setIsAnalyzing(true);
    setShowAnalysisPanel(true);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisData({
        foulDetection: {
          result: "Probable Flop",
          confidence: 87,
          reasoning:
            "Minimal contact + player initiated fall + delay before reaction",
        },
        playerPositions: {
          offense: [
            { id: 1, position: "PG", x: 0.3, y: 0.5, z: 0.1 },
            { id: 2, position: "SG", x: 0.7, y: 0.3, z: 0.1 },
            { id: 3, position: "SF", x: 0.2, y: 0.7, z: 0.1 },
            { id: 4, position: "PF", x: 0.8, y: 0.8, z: 0.1 },
            { id: 5, position: "C", x: 0.5, y: 0.9, z: 0.1 },
          ],
          defense: [
            { id: 6, position: "PG", x: 0.35, y: 0.45, z: 0.1 },
            { id: 7, position: "SG", x: 0.75, y: 0.25, z: 0.1 },
            { id: 8, position: "SF", x: 0.25, y: 0.65, z: 0.1 },
            { id: 9, position: "PF", x: 0.85, y: 0.75, z: 0.1 },
            { id: 10, position: "C", x: 0.55, y: 0.85, z: 0.1 },
          ],
        },
        playType: "Pick and Roll",
        recommendations: [
          "Defender should maintain vertical position",
          "Offensive player exaggerated contact",
          "Referee should have waited to see completion of play",
        ],
      });

      setAssistantMessage(
        "I've analyzed the play. This appears to be a flop with 87% confidence. The offensive player exaggerated minimal contact after a delay."
      );
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100" ref={containerRef}>
      <header className="bg-white border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold">CourtVision VR</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-white text-blue-600 border-blue-600"
              onClick={analyzePlay}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Play"}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white text-gray-600 border-gray-300"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>CourtVision VR Demo Help</SheetTitle>
                  <SheetDescription>
                    Learn how to use the 3D replay system
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium">Navigation Controls</h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-500">
                      <li className="flex items-start gap-2">
                        <RotateCcw className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span>Click and drag to rotate the view</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ZoomIn className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span>Scroll to zoom in and out</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Mic className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span>Click the microphone to ask questions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Voice Commands</h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-500">
                      <li>"Pause" or "Play"</li>
                      <li>"Rewind" or "Go back 5 seconds"</li>
                      <li>"Was that a foul?"</li>
                      <li>"Analyze this play"</li>
                      <li>"Show me player positions"</li>
                    </ul>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        {/* 3D Viewer */}
        <div className="relative flex-1 bg-black">
          <ThreeDViewer />

          {/* Playback Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white text-xs">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleTimeChange}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isMuted ? "Unmute" : "Mute"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                          onClick={toggleMic}
                        >
                          {isMicActive ? (
                            <Mic className="h-5 w-5 text-blue-400" />
                          ) : (
                            <MicOff className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isMicActive
                          ? "Stop Listening"
                          : "Start Voice Assistant"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Rewind className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 h-10 w-10 rounded-full bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <FastForward className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? (
                            <Minimize className="h-5 w-5" />
                          ) : (
                            <Maximize className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Assistant Feedback */}
          {assistantMessage && (
            <div className="absolute top-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg text-sm backdrop-blur-sm border border-white/20 flex items-start gap-3">
              <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                <Mic className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-400">CoachBot</div>
                <p>{assistantMessage}</p>
              </div>
            </div>
          )}

          {/* Camera Controls */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Zoom In</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Zoom Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Reset View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Analysis Panel */}
        {showAnalysisPanel && (
          <div className="w-full md:w-96 bg-white border-l overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
              <h2 className="font-semibold">Play Analysis</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAnalysisPanel(false)}
                className="h-8 w-8"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center p-8 gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500">Analyzing play...</p>
              </div>
            ) : analysisData ? (
              <div className="p-4">
                <Tabs defaultValue="summary">
                  <TabsList className="w-full">
                    <TabsTrigger value="summary" className="flex-1">
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="positions" className="flex-1">
                      Positions
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="flex-1">
                      Recommendations
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          Foul Analysis
                          <Badge className="bg-orange-500">
                            {analysisData.foulDetection.result}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Confidence: {analysisData.foulDetection.confidence}%
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {analysisData.foulDetection.reasoning}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Play Type</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{analysisData.playType}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="positions" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Player Positions
                        </CardTitle>
                        <CardDescription>At current frame</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Offense
                            </h4>
                            <div className="grid grid-cols-5 gap-2">
                              {analysisData.playerPositions.offense.map(
                                (player) => (
                                  <div
                                    key={player.id}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                      {player.id}
                                    </div>
                                    <span className="text-xs mt-1">
                                      {player.position}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Defense
                            </h4>
                            <div className="grid grid-cols-5 gap-2">
                              {analysisData.playerPositions.defense.map(
                                (player) => (
                                  <div
                                    key={player.id}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-medium">
                                      {player.id}
                                    </div>
                                    <span className="text-xs mt-1">
                                      {player.position}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Recommendations
                        </CardTitle>
                        <CardDescription>Based on AI analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisData.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="rounded-full bg-blue-600 p-1 text-white mt-0.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
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
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                <Info className="h-12 w-12 text-gray-300" />
                <div>
                  <p className="font-medium">No Analysis Available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click "Analyze Play" to generate insights
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
