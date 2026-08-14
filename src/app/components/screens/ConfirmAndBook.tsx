import { useEffect } from "react";
import { ChevronLeft, MapPin, Calendar, Users, Briefcase } from "lucide-react";
import imgImageAirline from "figma:asset/50ba81ee3baed0d032549253a352c5d27d54adb9.png";
import imgImageHotel from "figma:asset/3a7194d0c070824d982b80f6a329057d5ed3025a.png";
import svgPaths from "../../imports/svg-m2suhopkjk";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";

interface ConfirmAndBookProps {
  /** Option chosen on Review & Approve. */
  selectedItineraryId?: string | null;
  onBack?: () => void;
  onConfirm?: () => void;
  tripId?: string | null;
  onComplete?: () => void;
}

export function ConfirmAndBook({ onBack, onConfirm, tripId, onComplete }: ConfirmAndBookProps) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent?.trim();
      
      if (text === "Back to options" && onBack) {
        e.preventDefault();
        onBack();
      }
      
      if (text === "Confirm & Complete Booking") {
        e.preventDefault();
        if (onComplete) {
          onComplete();
        } else if (onConfirm) {
          onConfirm();
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onBack, onComplete, onConfirm]);

  return (
    <div 
      className="relative min-h-screen pb-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Main Content - Max Width 1088px */}
      <div className="relative max-w-[1088px] mx-auto px-6 pt-8 z-10">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-b from-[#916af5] to-[#b2a5fb] rounded-2xl shadow-md w-12 h-12 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0a0a0a]">
              Edit and confirm your itinerary
            </h1>
            <p className="text-base text-[#4a5565]">
              Confirm your itinerary
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 mb-6 text-[#9095a1] hover:text-[#6d6788] transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to options
        </button>

        {/* Trip Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h3 className="text-base font-semibold text-[#1f2933]">
                  AWS: re:Invent 2026
                </h3>
                <div className="bg-[#d4e9ff] border border-[#b3d4ff] px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-[#1246a5]">awaiting_selection</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4a5565]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>New York City</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>2025-12-22 - 2025-12-30</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>1 traveler</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Conference</span>
                </div>
              </div>
            </div>
            <button className="bg-white border border-[#916af5] text-[#916af5] hover:bg-[#f2f1f8] rounded-lg px-5 py-2 text-sm font-medium transition-colors flex-shrink-0">
              View
            </button>
          </div>
        </div>

        {/* ONE BIG WHITE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN - Schedule */}
            <div className="w-full lg:w-[625px] flex-shrink-0">
              {/* Balanced Option Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#1f2933] mb-1">
                    Balanced Option
                  </h3>
                  <p className="text-sm text-[#4a5565]">
                    Best balance of cost and convenience
                  </p>
                </div>
                <div className="bg-[#d0f4e0] rounded-full px-3 py-1 flex-shrink-0">
                  <span className="text-xs font-medium text-[#44ad33]">
                    In policy
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e6e6e6] mb-6"></div>

              {/* Total Cost */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[#364153]">
                  Total cost (1 traveler)
                </p>
                <p className="text-[30px] font-semibold text-[#0a0a0a] leading-9">
                  $2,350
                </p>
              </div>

              {/* Tuesday, Mar 3 */}
              <div className="mb-4">
                <h4 className="text-base font-semibold text-[#1f2933] mb-4">Tuesday, Mar 3</h4>

                {/* Flight to New York */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                        <path d={svgPaths.pdab9800} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </svg>
                      <span className="text-base text-[#1f2933]">Flight to New York</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                          <path d={svgPaths.p1c0c5900} fill="black" />
                        </svg>
                      </button>
                      <button className="border border-[#c4c4c4] rounded-md px-2.5 py-1 text-sm text-black hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Flight Card with Timeline */}
                  <div className="flex gap-6">
                    {/* Vertical Line */}
                    <div className="flex flex-col items-center w-0">
                      <div className="w-px h-[112px] bg-[#c3c3c3]"></div>
                    </div>

                    {/* Flight Details */}
                    <div className="flex-1 bg-[#f7f6f8] rounded-[10px] p-5 border border-[rgba(179,173,196,0.28)]">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center flex-shrink-0 border border-[#e5e7eb]">
                          <img src={imgImageAirline} alt="Delta" className="w-6 h-6 object-contain" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#101828] leading-[18px]">7:30 AM</p>
                                <p className="text-[11px] text-[#6a7282] leading-[14px]">PIT</p>
                              </div>
                              <div className="flex flex-col items-center min-w-[60px] px-2">
                                <p className="text-[10px] text-[#6a7282] leading-[15px] mb-0.5">1h 45m</p>
                                <div className="w-full h-px bg-[#e5e7eb]"></div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#101828] leading-[18px]">9:15 AM</p>
                                <p className="text-[11px] text-[#6a7282] leading-[14px]">EWR</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end text-[11px] text-[#6a7282] leading-[13px] flex-shrink-0 ml-4 gap-0.5">
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 11.9957 11.9957" fill="none">
                                  <path d={svgPaths.pe90300} stroke="#0A0A0A" strokeWidth="0.89968" />
                                  <path d={svgPaths.p2a17c420} stroke="#0A0A0A" strokeWidth="0.89968" />
                                </svg>
                                <span>x1 Checked bag</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 11.9957 11.9957" fill="none">
                                  <path d={svgPaths.pe90300} stroke="#0A0A0A" strokeWidth="0.89968" />
                                  <path d={svgPaths.p2a17c420} stroke="#0A0A0A" strokeWidth="0.89968" />
                                </svg>
                                <span>Carry-on bag</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-[#6a7282] leading-4">
                            Delta Airlines · DL 3891 · Economy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotel Stay */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3.5">
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                        <path d="M8.33203 18.3344V12.8594" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M10 9.16797H10.0083" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M10 5.83203H10.0083" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M11.668 12.8594V18.3344" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPaths.p20136f00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M13.332 9.16797H13.3404" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M13.332 5.83203H13.3404" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M6.66797 9.16797H6.6763" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d="M6.66797 5.83203H6.6763" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPaths.p18a43400} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </svg>
                      <span className="text-base text-[#1f2933]">2- night stay in New York</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                          <path d={svgPaths.p1c0c5900} fill="black" />
                        </svg>
                      </button>
                      <button className="border border-[#c4c4c4] rounded-md px-2.5 py-1 text-sm text-black hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Hotel Card with Timeline */}
                  <div className="flex gap-6">
                    {/* Vertical Line */}
                    <div className="flex flex-col items-center w-0">
                      <div className="w-px h-[183px] bg-[#c3c3c3]"></div>
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 bg-[#f7f6f8] rounded-[10px] p-5 border border-[rgba(179,173,196,0.28)]">
                      <div className="flex gap-3 mb-3">
                        <div className="w-[72px] h-[49px] rounded-[10px] overflow-hidden flex-shrink-0">
                          <img src={imgImageHotel} alt="Hotel" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#101828] leading-4 mb-0.5">
                            New York Marriott Downtown
                          </p>
                          <div className="flex items-center gap-1 mb-0.5">
                            <svg className="w-[13px] h-[13px]" viewBox="0 0 13 13" fill="none">
                              <path d={svgPaths.pdf5e000} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
                              <path d={svgPaths.p14ca4800} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
                            </svg>
                            <p className="text-[11px] text-[#6a7282] leading-[13px]">
                              85 West Street of Albany Street
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] text-[#6a7282] leading-[16.5px]">
                              1x Deluxe King Room
                            </p>
                            <svg className="w-3 h-3" viewBox="0 0 11.9957 11.9957" fill="none">
                              <path d="M5.99805 9.99609H6.00305" stroke="#18A0A6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                              <path d={svgPaths.p24e33b00} stroke="#18A0A6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                              <path d={svgPaths.p1c443040} stroke="#18A0A6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                              <path d={svgPaths.p2ca9ce00} stroke="#18A0A6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-0.5 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#6a7282] leading-[15px]">
                          <span>Check-in</span>
                          <span>Tue, Mar 3, 4:00PM</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#6a7282] leading-[15px]">
                          <span>Check-out</span>
                          <span>Tue, Mar 5, 11:00AM</span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[rgba(179,173,196,0.28)]">
                        <div className="flex items-start gap-1.5">
                          <svg className="w-[13px] h-[13px] mt-0.5" viewBox="0 0 13 13" fill="none">
                            <path d="M4.33398 1.08398V3.25065" stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                            <path d="M8.66602 1.08398V3.25065" stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                            <path d={svgPaths.p1b069600} stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                            <path d="M1.625 5.41602H11.375" stroke="#6A7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999645" />
                          </svg>
                          <p className="text-[11px] text-[#6a7282] leading-3">
                            Free cancellation before Feb 28, 2026 at 11:59 PM (stay's local time)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ground Transport */}
                <div className="mb-3">
                  <div className="flex gap-6">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center w-0">
                      <div className="w-px h-[17px] bg-[#c3c3c3]"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                          <path d={svgPaths.p2905de80} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d={svgPaths.p2a7f1980} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M7.5 14.168H12.5" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d={svgPaths.p3849af00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        <div>
                          <p className="text-base text-[#1f2933] leading-6">Ground Transport</p>
                          <p className="text-sm text-[#364153] leading-5">3 Uber Vouchers Provided $40</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Food */}
                <div className="mb-4">
                  <div className="flex gap-6">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center w-0">
                      <div className="w-px h-[17px] bg-[#c3c3c3]"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                          <path d={svgPaths.p2840da80} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d={svgPaths.p18a1600} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M1.75 18.168L7.08333 12.918" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M15.8333 4.16797L10 10.0013" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        <div>
                          <p className="text-base text-[#1f2933] leading-6">Food</p>
                          <p className="text-sm text-[#364153] leading-5">Reimbursed Provided for under $40 per meal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thursday, Mar 5 */}
              <div className="mb-8">
                <h4 className="text-base font-semibold text-[#1f2933] mb-4">Thursday, Mar 5</h4>

                {/* Return Flight */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                        <path d={svgPaths.pdab9800} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </svg>
                      <span className="text-base text-[#1f2933]">Flight to New York</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                          <path d={svgPaths.p1c0c5900} fill="black" />
                        </svg>
                      </button>
                      <button className="border border-[#c4c4c4] rounded-md px-2.5 py-1 text-sm text-black hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Flight Card */}
                  <div className="flex gap-6">
                    {/* No Line for last item */}
                    <div className="w-0"></div>

                    <div className="flex-1 bg-[#f7f6f8] rounded-[10px] p-5 border border-[rgba(179,173,196,0.28)]">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center flex-shrink-0 border border-[#e5e7eb]">
                          <img src={imgImageAirline} alt="Delta" className="w-6 h-6 object-contain" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#101828] leading-[18px]">9:59 PM</p>
                                <p className="text-[11px] text-[#6a7282] leading-[14px]">PIT</p>
                              </div>
                              <div className="flex flex-col items-center min-w-[60px] px-2">
                                <p className="text-[10px] text-[#6a7282] leading-[15px] mb-0.5">1h 45m</p>
                                <div className="w-full h-px bg-[#e5e7eb]"></div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#101828] leading-[18px]">11:30 PM</p>
                                <p className="text-[11px] text-[#6a7282] leading-[14px]">EWR</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end text-[11px] text-[#6a7282] leading-[13px] flex-shrink-0 ml-4 gap-0.5">
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 11.9957 11.9957" fill="none">
                                  <path d={svgPaths.pe90300} stroke="#0A0A0A" strokeWidth="0.89968" />
                                  <path d={svgPaths.p2a17c420} stroke="#0A0A0A" strokeWidth="0.89968" />
                                </svg>
                                <span>x1 Checked bag</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 11.9957 11.9957" fill="none">
                                  <path d={svgPaths.pe90300} stroke="#0A0A0A" strokeWidth="0.89968" />
                                  <path d={svgPaths.p2a17c420} stroke="#0A0A0A" strokeWidth="0.89968" />
                                </svg>
                                <span>Carry-on bag</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-[#6a7282] leading-4">
                            Delta Airlines · DL 3891 · Economy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Checkmarks */}
              <div className="mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <svg className="w-4 h-4 text-[#52c93f]" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3 4L6 11.3 2.7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Accessibility satisfied</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <svg className="w-4 h-4 text-[#52c93f]" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3 4L6 11.3 2.7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>No red-eyes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <svg className="w-4 h-4 text-[#52c93f]" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3 4L6 11.3 2.7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Room sharing available</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div>
                <button 
                  onClick={() => {
                    if (onComplete) {
                      onComplete();
                    } else if (onConfirm) {
                      onConfirm();
                    }
                  }}
                  className="w-full bg-[#916af5] hover:bg-[#7c5dd4] text-white rounded-xl px-8 py-4 text-base font-semibold transition-colors"
                >
                  Confirm & Complete Booking
                </button>
                <p className="text-center text-sm text-[#1f2933] mt-3 italic">
                  Don't worry! All reservations can be cancelled within 24 hours.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-[397px] flex-shrink-0 flex flex-col gap-6">
              {/* Budget & Spend */}
              <div>
                <h3 className="text-base font-semibold text-[#1f2933] mb-4">
                  Budget & Spend
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[32px] font-normal text-[#1f2933]">$2,350</span>
                  <span className="text-sm text-[#6a7282]">of $2,500</span>
                </div>
                <div className="mb-3">
                  <div className="w-full h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#52c93f] to-[#18a0a6] rounded-full" 
                      style={{ width: '94%' }} 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-[#4a5565]">
                    94% used
                  </p>
                  <div className="bg-[#d0f4e0] rounded-full px-3 py-1">
                    <span className="text-xs font-medium text-[#52c93f]">
                      In policy
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#4a5565]">Flights</span>
                    <span className="text-[#1f2933]">$3,600</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#4a5565]">Hotels (2 nights)</span>
                    <span className="text-[#1f2933]">$800</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#4a5565]">Ground Transportation</span>
                    <span className="text-[#1f2933]">$120</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#4a5565]">Food (est.)</span>
                    <span className="text-[#1f2933]">$300</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-base font-semibold text-[#1f2933] mb-4">
                  Payment method
                </h3>
                <div className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-xl mb-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#1246a5]" viewBox="0 0 20 20" fill="none">
                        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.67"/>
                        <line x1="2" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.67"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#1f2933] mb-0.5">
                        Corporate card
                      </p>
                      <p className="text-xs text-[#6a7282]">
                        Visa •••• 4242
                      </p>
                    </div>
                  </div>
                  <button className="bg-[#f5f7fa] border border-[#e5e7eb] text-[#1f2933] rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#e8f9fb] border border-[#b8e9f0] rounded-xl">
                  <p className="text-sm text-[#1f2933] flex-1 pr-3">
                    Auto-fill purchase card forms and draft expense reports
                  </p>
                  <div className="relative inline-block w-10 h-6 flex-shrink-0">
                    <input type="checkbox" defaultChecked className="peer sr-only" id="auto-fill-toggle" />
                    <label 
                      htmlFor="auto-fill-toggle" 
                      className="block w-10 h-6 bg-[#1f2933] rounded-full cursor-pointer relative after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-0"
                    ></label>
                  </div>
                </div>
              </div>

              {/* View Policy Details */}
              <button className="w-full bg-[#e8f5ec] hover:bg-[#d4edd9] border border-[#b8dcc4] text-[#1f2933] rounded-xl px-4 py-4 text-sm transition-colors text-left flex items-center justify-between">
                <span>View Policy Details</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}