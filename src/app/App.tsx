import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IntentCapture } from "./components/screens/IntentCapture";
import { PreferenceSetup } from "./components/screens/PreferenceSetup";
import { TripOverview } from "./components/screens/TripOverview";
import { AgentWorkingSimple } from "./components/screens/AgentWorkingSimple";
import { ReviewAndApprove } from "./components/screens/ReviewAndApprove";
import { EditItinerary } from "./components/screens/EditItinerary";
import { EditItineraryinDetail } from "./components/screens/EditItineraryinDetail";
import { BookingInProgress } from "./components/screens/BookingInProgress";
import { ConfirmAndBook } from "./components/screens/ConfirmAndBook";
import { ExpensesReport } from "./components/screens/ExpensesReport";
import { AppShell } from "./components/AppShell";
import { Toaster } from "./components/ui/sonner";
import { Trip } from "./utils/tripApi";
import "../styles/globals.css";

type Screen = 
  | "intent-capture"
  | "preference-setup"
  | "agent-working-simple"
  | "review-approve"
  | "edit-itinerary"
  | "edit-itinerary-detail"
  | "confirm-and-book"
  | "booking-progress"
  | "trip-overview"
  | "expenses"
  | "traveler-survey";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intent-capture");
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  // Which of the three options the organizer picked. Drives every screen
  // after Review & Approve.
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  // Expenses is reachable from the trip overview and from a finished trip on
  // the home screen, so Back has to return to wherever it was opened from.
  const [expensesReturnTo, setExpensesReturnTo] = useState<Screen>("trip-overview");
  // The wording that produced the current trip, so Edit returns to it rather
  // than an empty box.
  const [intentDraft, setIntentDraft] = useState("");

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
      return;
    }

    // ?demo=<tripId> opens a pre-generated trip straight at the options
    // screen. Nothing is generated, so this path costs nothing to serve.
    const demoTripId = params.get('demo');
    if (demoTripId) {
      setCurrentTripId(demoTripId);
      setCurrentScreen('review-approve');
    }
  }, []);

  // Edit on the options screen goes back to the prompt that produced them.
  const handleEditTrip = () => {
    setIntentDraft(currentTrip?.intent_text ?? intentDraft);
    setCurrentScreen("intent-capture");
  };

  // A finished trip's remaining task is filing receipts, so send it there.
  const handleOpenTripExpenses = (demoTripId: string) => {
    setCurrentTripId(demoTripId);
    setExpensesReturnTo("intent-capture");
    setCurrentScreen("expenses");
  };

  // Open a pre-generated trip without leaving the app.
  const handleOpenDemoTrip = (demoTripId: string) => {
    setCurrentTripId(demoTripId);
    setSelectedItineraryId(null);
    setCurrentScreen('review-approve');
  };

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  // Handler for the intent capture screen
  const handleStartPlanning = async (tripId: string, trip: Trip) => {
    setCurrentTripId(tripId);
    setCurrentTrip(trip);
    setIntentDraft(trip.intent_text ?? "");
    setCurrentScreen("agent-working-simple");
  };

  const handleAgentComplete = () => {
    setCurrentScreen("review-approve");
  };

  const handleApproveAndBook = () => {
    setCurrentScreen("confirm-and-book");
  };

  const handleSelectOption = (itineraryId?: string) => {
    if (itineraryId) setSelectedItineraryId(itineraryId);
    setCurrentScreen("edit-itinerary-detail");
  };

  const handleStartOverFromHome = () => {
    setSelectedItineraryId(null);
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
    setSelectedItineraryId(null);
    setCurrentScreen("intent-capture");
  };

  const handleConfirmAndBookComplete = () => {
    setCurrentScreen("booking-progress");
  };

  const handleBookingComplete = () => {
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
            initialIntent={intentDraft}
            onOpenDemoTrip={handleOpenDemoTrip}
            onOpenTripExpenses={handleOpenTripExpenses}
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
            onEditTrip={handleEditTrip}
          />
        );
      
      case "edit-itinerary":
        return (
          <EditItinerary
            tripId={currentTripId}
            selectedItineraryId={selectedItineraryId}
            onComplete={handleEditItineraryComplete}
            onBack={handleEditItineraryBack}
            onBackToHome={handleBackToHome}
          />
        );
      
      case "edit-itinerary-detail":
        return (
          <EditItineraryinDetail
            tripId={currentTripId}
            selectedItineraryId={selectedItineraryId}
            onComplete={handleConfirmAndBookComplete}
            onBack={() => setCurrentScreen("review-approve")}
            onBackToHome={handleBackToHome}
          />
        );
      
      case "confirm-and-book":
        return (
          <ConfirmAndBook
            tripId={currentTripId}
            selectedItineraryId={selectedItineraryId}
            onComplete={handleConfirmAndBookComplete}
            onBack={handleConfirmAndBookBack}
          />
        );
      
      case "booking-progress":
        return (
          <BookingInProgress
            tripId={currentTripId}
            selectedItineraryId={selectedItineraryId}
            onComplete={handleBookingComplete}
            onBack={() => setCurrentScreen("edit-itinerary-detail")}
          />
        );

      case "trip-overview":
        return (
          <TripOverview
            tripId={currentTripId}
            selectedItineraryId={selectedItineraryId}
            onViewExpenses={() => {
              setExpensesReturnTo("trip-overview");
              setCurrentScreen("expenses");
            }}
            onNewTrip={handleStartOverFromHome}
            onBack={() => setCurrentScreen("confirm-and-book")}
          />
        );
      
      case "expenses":
        return (
          <ExpensesReport
            tripId={currentTripId || undefined}
            onBack={() => setCurrentScreen(expensesReturnTo)}
          />
        );
      
      default:
        return <IntentCapture
          tripId={currentTripId}
          onStartPlanning={handleStartPlanning}
          onOpenDemoTrip={handleOpenDemoTrip}
          onOpenTripExpenses={handleOpenTripExpenses}
        />;
    }
  };

  return (
    <AppShell 
      currentNav="Plan a Trip" 
      onNavChange={() => setCurrentScreen("intent-capture")}
      onLogoClick={handleBackToHome}
    >
      {/* Screens cross-fade into each other: the one leaving goes first, then
          the next arrives. The nav bar sits outside this and never moves. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentScreen}
          className="min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </AppShell>
  );
}