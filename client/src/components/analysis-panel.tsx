"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Info } from "lucide-react"

interface AnalysisPanelProps {
  isAnalyzing?: boolean
  analysisData?: any
  onClose?: () => void
}

export function AnalysisPanel({ isAnalyzing = false, analysisData = null, onClose }: AnalysisPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (isCollapsed) {
    return (
      <div className="bg-white border-t p-2 flex items-center justify-between">
        <h3 className="font-medium text-sm">Play Analysis</h3>
        <Button variant="ghost" size="sm" onClick={toggleCollapse}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white border-t overflow-y-auto max-h-96">
      <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
        <h2 className="font-semibold">Play Analysis</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
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
                    <Badge className="bg-orange-500">{analysisData?.foulDetection?.result || "Probable Flop"}</Badge>
                  </CardTitle>
                  <CardDescription>Confidence: {analysisData?.foulDetection?.confidence || 87}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {analysisData?.foulDetection?.reasoning ||
                      "Minimal contact + player initiated fall + delay before reaction"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Play Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{analysisData?.playType || "Pick and Roll"}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="positions" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Player Positions</CardTitle>
                  <CardDescription>At current frame</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Offense</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {(analysisData?.playerPositions?.offense || []).map((player) => (
                          <div key={player.id} className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                              {player.id}
                            </div>
                            <span className="text-xs mt-1">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Defense</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {(analysisData?.playerPositions?.defense || []).map((player) => (
                          <div key={player.id} className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-medium">
                              {player.id}
                            </div>
                            <span className="text-xs mt-1">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                  <CardDescription>Based on AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(
                      analysisData?.recommendations || [
                        "Defender should maintain vertical position",
                        "Offensive player exaggerated contact",
                        "Referee should have waited to see completion of play",
                      ]
                    ).map((rec, index) => (
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
            <p className="text-sm text-gray-500 mt-1">Click "Analyze Play" to generate insights</p>
          </div>
        </div>
      )}
    </div>
  )
}
