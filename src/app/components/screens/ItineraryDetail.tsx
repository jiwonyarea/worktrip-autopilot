import { ArrowLeft, Plane, Hotel, MapPin, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StatusBadge } from "../StatusBadge";

const costBreakdown = [
  { category: "Flights", amount: 3600, percentage: 42 },
  { category: "Hotels", amount: 2700, percentage: 32 },
  { category: "Ground transportation", amount: 800, percentage: 9 },
  { category: "Food & meals", amount: 1400, percentage: 17 },
];

const travelers = [
  {
    name: "Sarah Chen",
    role: "Organizer",
    flight: "UA 1234 · Dec 2, 8:30 AM → 10:15 AM (Direct)",
    returnFlight: "UA 5678 · Dec 6, 3:45 PM → 9:30 PM (Direct)",
    hotel: "ARIA Resort · Room 2451 · Standard King",
    notes: "Wheelchair-accessible room confirmed"
  },
  {
    name: "Marcus Johnson",
    role: "Traveler",
    flight: "UA 1234 · Dec 2, 8:30 AM → 10:15 AM (Direct)",
    returnFlight: "UA 5678 · Dec 6, 3:45 PM → 9:30 PM (Direct)",
    hotel: "ARIA Resort · Room 2452 · Standard King",
    notes: "Ground floor preferred, confirmed"
  },
  {
    name: "Priya Patel",
    role: "Traveler",
    flight: "UA 1234 · Dec 2, 8:30 AM → 10:15 AM (Direct)",
    returnFlight: "UA 5678 · Dec 6, 3:45 PM → 9:30 PM (Direct)",
    hotel: "ARIA Resort · Room 2453 · Standard King",
    notes: "Vegetarian meal preferences noted"
  }
];

interface ItineraryDetailProps {
  onBack?: () => void;
  onChoose?: () => void;
}

export function ItineraryDetail({ onBack, onChoose }: ItineraryDetailProps) {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mb-4 -ml-2 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to options
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="m-0">Balanced Option</h1>
                <StatusBadge status="Compliant" />
              </div>
              <div className="flex items-center gap-6 text-gray-600">
                <span>📍 Las Vegas, NV</span>
                <span>📅 Dec 2-6, 2025</span>
                <span>👥 3 travelers</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">$8,500</div>
              <div className="text-sm text-gray-500">94% of $9,000 budget</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <TabsList className="w-full border-b border-gray-200 bg-transparent rounded-none p-0">
            <TabsTrigger 
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1246A5] data-[state=active]:bg-transparent"
            >
              Group overview
            </TabsTrigger>
            <TabsTrigger 
              value="by-traveler"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1246A5] data-[state=active]:bg-transparent"
            >
              By traveler
            </TabsTrigger>
            <TabsTrigger 
              value="explore"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1246A5] data-[state=active]:bg-transparent"
            >
              Explore within policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Timeline */}
              <div className="col-span-7">
                <h3 className="mb-4">Trip timeline</h3>
                
                <div className="space-y-6">
                  {/* Day 1 */}
                  <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1246A5] border-2 border-white"></div>
                    <div className="text-sm text-gray-500 mb-2">Monday, Dec 2</div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Plane className="w-4 h-4 text-[#1246A5]" />
                          <span className="text-sm">Departure flight</span>
                        </div>
                        <div className="text-sm text-gray-600">UA 1234 · 8:30 AM - 10:15 AM</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Hotel className="w-4 h-4 text-[#1246A5]" />
                          <span className="text-sm">Check-in</span>
                        </div>
                        <div className="text-sm text-gray-600">ARIA Resort & Casino · 3:00 PM</div>
                      </div>
                    </div>
                  </div>

                  {/* Day 2-5 */}
                  <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#18A0A6] border-2 border-white"></div>
                    <div className="text-sm text-gray-500 mb-2">Dec 3-5</div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#18A0A6]" />
                        <span className="text-sm">Conference days</span>
                      </div>
                      <div className="text-sm text-gray-600">AWS re:Invent · Venetian Expo</div>
                    </div>
                  </div>

                  {/* Day 6 */}
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1246A5] border-2 border-white"></div>
                    <div className="text-sm text-gray-500 mb-2">Friday, Dec 6</div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Hotel className="w-4 h-4 text-[#1246A5]" />
                          <span className="text-sm">Check-out</span>
                        </div>
                        <div className="text-sm text-gray-600">ARIA Resort · 11:00 AM</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Plane className="w-4 h-4 text-[#1246A5]" />
                          <span className="text-sm">Return flight</span>
                        </div>
                        <div className="text-sm text-gray-600">UA 5678 · 3:45 PM - 9:30 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="col-span-5">
                <h3 className="mb-4">Cost breakdown</h3>
                
                <div className="space-y-3">
                  {costBreakdown.map((item) => (
                    <div key={item.category} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{item.category}</span>
                        <span className="text-sm">${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-[#1246A5] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{item.percentage}% of total</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-[#1F9D55]/10 border border-[#1F9D55]/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total trip cost</span>
                    <span className="text-lg">$8,500</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="by-traveler" className="p-6">
            <div className="space-y-4">
              {travelers.map((traveler) => (
                <details key={traveler.name} className="border border-gray-200 rounded-lg">
                  <summary className="p-4 cursor-pointer hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#18A0A6]/10 flex items-center justify-center">
                          <span>{traveler.name[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm">{traveler.name}</div>
                          <div className="text-xs text-gray-500">{traveler.role}</div>
                        </div>
                      </div>
                    </div>
                  </summary>
                  <div className="px-4 pb-4 space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Outbound flight</div>
                      <div className="text-sm">{traveler.flight}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Return flight</div>
                      <div className="text-sm">{traveler.returnFlight}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Hotel accommodation</div>
                      <div className="text-sm">{traveler.hotel}</div>
                    </div>
                    {traveler.notes && (
                      <div className="bg-[#18A0A6]/10 border border-[#18A0A6]/20 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Special requirements</div>
                        <div className="text-sm">{traveler.notes}</div>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explore" className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="mb-4">Alternative hotels</h3>
                <div className="space-y-3">
                  {[
                    { name: "ARIA Resort", distance: "0.3 mi", price: "$210/night", selected: true },
                    { name: "The Cosmopolitan", distance: "0.4 mi", price: "$230/night", selected: false },
                    { name: "Bellagio", distance: "0.6 mi", price: "$245/night", selected: false },
                  ].map((hotel) => (
                    <div 
                      key={hotel.name}
                      className={`p-4 border-2 rounded-lg ${
                        hotel.selected ? "border-[#1246A5] bg-[#1246A5]/5" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm">{hotel.name}</div>
                          <div className="text-xs text-gray-500">{hotel.distance} from venue</div>
                        </div>
                        <div className="text-sm">{hotel.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4">Recommended restaurants</h3>
                <div className="space-y-3">
                  {[
                    { name: "Carbone", cuisine: "Italian", perDiem: true },
                    { name: "Momofuku", cuisine: "Asian Fusion", perDiem: true },
                    { name: "é by José Andrés", cuisine: "Spanish", perDiem: false },
                  ].map((restaurant) => (
                    <div 
                      key={restaurant.name}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm">{restaurant.name}</div>
                          <div className="text-xs text-gray-500">{restaurant.cuisine}</div>
                        </div>
                        {restaurant.perDiem ? (
                          <span className="text-xs px-2 py-1 bg-[#1F9D55]/10 text-[#1F9D55] border border-[#1F9D55]/20 rounded">
                            Within per-diem
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Above per-diem</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-gray-300"
          >
            Back to options
          </Button>
          <Button 
            onClick={onChoose}
            className="bg-[#916AF5] hover:bg-[#7c5dd4] text-white px-8"
          >
            Choose this itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}