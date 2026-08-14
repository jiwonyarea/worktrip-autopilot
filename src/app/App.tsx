import { useState, useEffect } from "react";
import { IntentCapture } from "./components/screens/IntentCapture";
import { PreferenceSetup } from "./components/screens/PreferenceSetup";
import { TripOverview } from "./components/screens/TripOverview";
import { AgentWorkingSimple } from "./components/screens/AgentWorkingSimple";
import { ReviewAndApprove } from "./components/screens/ReviewAndApprove";
import { EditItinerary } from "./components/screens/EditItinerary";
import { EditItineraryinDetail } from "./components/screens/EditItineraryinDetail";
import { ConfirmAndBook } from "./components/screens/ConfirmAndBook";
import { ExpensesReport } from "./components/screens/ExpensesReport";
import { AppShell } from "./components/AppShell";
import { Toaster } from "./components/ui/sonner";
import { Trip } from "./utils/tripApi";
import "../styles/globals.css";
import "./utils/backendTests"; // Load backend tests for console access

type Screen = 
  | "intent-capture"
  | "preference-setup"
  | "agent-working-simple"
  | "review-approve"
  | "edit-itinerary"
  | "edit-itinerary-detail"
  | "confirm-and-book"
  | "trip-overview"
  | "expenses";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intent-capture");
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  // Check URL parameters on mount for traveler survey access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screen = params.get('screen');
    const tripId = params.get('tripId');
    const travelerEmail = params.get('travelerEmail');

    if (screen === 'traveler-survey' && tripId && travelerEmail) {
      setCurrentScreen('traveler-survey');
      setCurrentTripId(tripId);
      // Store traveler email for survey access
      sessionStorage.setItem('surveyTravelerEmail', travelerEmail);
    }
  }, []);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  // Handler for the intent capture screen
  const handleStartPlanning = async (tripId: string, trip: Trip) => {
    setCurrentTripId(tripId);
    setCurrentTrip(trip);
    setCurrentScreen("agent-working-simple");
  };

  const handleAgentComplete = () => {
    setCurrentScreen("review-approve");
  };

  const handleApproveAndBook = () => {
    setCurrentScreen("confirm-and-book");
  };

  const handleSelectOption = () => {
    setCurrentScreen("edit-itinerary-detail");
  };

  const handleStartOverFromHome = () => {
    setCurrentScreen("intent-capture");
  };

  const handleReviewApproveBack = () => {
    setCurrentScreen("intent-capture");
  };

  const handleEditItineraryComplete = () => {
    setCurrentScreen("confirm-and-book");
  };

  const handleEditItineraryBack = () => {
    setCurrentScreen("review-approve");
  };

  const handleBackToHome = () => {
    setCurrentTripId(null);
    setCurrentTrip(null);
    setCurrentScreen("intent-capture");
  };

  const handleConfirmAndBookComplete = () => {
    setCurrentScreen("trip-overview");
  };

  const handleConfirmAndBookBack = () => {
    setCurrentScreen("review-approve");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "intent-capture":
        return (
          <IntentCapture 
            onStartPlanning={handleStartPlanning} 
            tripId={currentTripId}
          />
        );
      
      case "agent-working-simple":
        return (
          <AgentWorkingSimple 
            onComplete={handleAgentComplete}
            tripData={currentTrip}
          />
        );
      
      case "review-approve":
        return (
          <ReviewAndApprove
            tripId={currentTripId}
            onApprove={handleApproveAndBook}
            onEditItinerary={handleSelectOption}
            onBack={handleReviewApproveBack}
          />
        );
      
      case "edit-itinerary":
        return (
          <EditItinerary
            tripId={currentTripId}
            onComplete={handleEditItineraryComplete}
            onBack={handleEditItineraryBack}
            onBackToHome={handleBackToHome}
          />
        );
      
      case "edit-itinerary-detail":
        return (
          <EditItineraryinDetail
            tripId={currentTripId}
            onComplete={handleConfirmAndBookComplete}
            onBack={() => setCurrentScreen("review-approve")}
            onBackToHome={handleBackToHome}
          />
        );
      
      case "confirm-and-book":
        return (
          <ConfirmAndBook
            tripId={currentTripId}
            onComplete={handleConfirmAndBookComplete}
            onBack={handleConfirmAndBookBack}
          />
        );
      
      case "trip-overview":
        return (
          <TripOverview
            tripId={currentTripId}
            onViewExpenses={() => setCurrentScreen("expenses")}
            onNewTrip={handleStartOverFromHome}
            onBack={() => setCurrentScreen("confirm-and-book")}
          />
        );
      
      case "expenses":
        return (
          <ExpensesReport
            tripId={currentTripId || undefined}
            onBack={() => setCurrentScreen("trip-overview")}
          />
        );
      
      default:
        return <IntentCapture
          tripId={currentTripId}
          onStartPlanning={handleStartPlanning}
        />;
    }
  };

  return (
    <AppShell 
      currentNav="Trips" 
      onNavChange={() => setCurrentScreen("intent-capture")}
      onLogoClick={handleBackToHome}
    >
      <div className="min-h-screen">
        {renderScreen()}
      </div>
      <Toaster />
    </AppShell>
  );
}