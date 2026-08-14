/**
 * Backend Integration Tests
 * Run these functions from browser console to verify backend is working
 */

import { createTrip, getTrip, generateItineraries, confirmBooking } from './tripApi';

export const backendTests = {
  /**
   * Test 1: Verify API connectivity
   */
  async testConnection() {
    console.log('🧪 TEST 1: Verifying API Connection...');
    console.log('================================================');
    
    try {
      // Try to create a minimal trip
      const testTrip = await createTrip({
        intentText: 'Test trip to verify API connection',
        overrides: {
          trip_name: 'API Connection Test',
          destination: 'New York',
          dates: {
            start_date: '2026-02-01',
            end_date: '2026-02-05',
          },
        },
        organizer_name: 'Test User',
        organizer_email: 'test@example.com',
      });

      console.log('✅ SUCCESS: API is accessible');
      console.log('Trip ID:', testTrip.id);
      console.log('Trip Name:', testTrip.trip_name);
      console.log('Destination:', testTrip.destination);
      console.log('Full Response:', testTrip);
      console.log('================================================\n');
      
      return { success: true, tripId: testTrip.id, trip: testTrip };
    } catch (error) {
      console.error('❌ FAILED: Cannot connect to API');
      console.error('Error:', error);
      console.error('================================================\n');
      
      return { success: false, error };
    }
  },

  /**
   * Test 2: Verify trip retrieval
   */
  async testGetTrip(tripId: string) {
    console.log('🧪 TEST 2: Verifying Trip Retrieval...');
    console.log('================================================');
    console.log('Trip ID:', tripId);
    
    try {
      const trip = await getTrip(tripId);
      
      console.log('✅ SUCCESS: Trip retrieved successfully');
      console.log('Trip Name:', trip.trip_name);
      console.log('Status:', trip.status);
      console.log('Has Itineraries:', !!trip.itineraries);
      console.log('Itinerary Count:', trip.itineraries?.length || 0);
      console.log('Full Trip:', trip);
      console.log('================================================\n');
      
      return { success: true, trip };
    } catch (error) {
      console.error('❌ FAILED: Cannot retrieve trip');
      console.error('Error:', error);
      console.error('================================================\n');
      
      return { success: false, error };
    }
  },

  /**
   * Test 3: Verify itinerary generation (Flowise or Mock)
   */
  async testItineraryGeneration(tripId: string) {
    console.log('🧪 TEST 3: Verifying Itinerary Generation...');
    console.log('================================================');
    console.log('Trip ID:', tripId);
    console.log('This may take 10-30 seconds...');
    
    try {
      const result = await generateItineraries(tripId);
      
      console.log('✅ SUCCESS: Itineraries generated');
      console.log('Number of Options:', result.itineraries?.length || 0);
      
      if (result.itineraries && result.itineraries.length > 0) {
        console.log('\nGenerated Options:');
        result.itineraries.forEach((itin: any, index: number) => {
          console.log(`\n  Option ${index + 1}:`);
          console.log(`    - ID: ${itin.id}`);
          console.log(`    - Title: ${itin.title}`);
          console.log(`    - Cost: $${itin.total_cost}`);
          console.log(`    - Features: ${itin.features?.join(', ') || 'None'}`);
        });
      }
      
      console.log('\nFull Response:', result);
      console.log('================================================\n');
      
      // Check if using mock data
      if (result.warning || result.mock_data) {
        console.warn('⚠️  WARNING: Using MOCK DATA (Flowise not available)');
        console.warn('This is expected if Flowise is not configured.');
        console.warn('================================================\n');
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('❌ FAILED: Cannot generate itineraries');
      console.error('Error:', error);
      console.error('================================================\n');
      
      return { success: false, error };
    }
  },

  /**
   * Test 4: Verify booking confirmation
   */
  async testBooking(tripId: string, itineraryId: string) {
    console.log('🧪 TEST 4: Verifying Booking Confirmation...');
    console.log('================================================');
    console.log('Trip ID:', tripId);
    console.log('Itinerary ID:', itineraryId);
    
    try {
      const result = await confirmBooking(tripId, itineraryId);
      
      console.log('✅ SUCCESS: Booking confirmed');
      console.log('Trip Status:', result.trip?.status);
      console.log('Flight Confirmation:', result.confirmations?.flight);
      console.log('Hotel Confirmation:', result.confirmations?.hotel);
      console.log('Booked At:', result.trip?.booked_at);
      console.log('Full Response:', result);
      console.log('================================================\n');
      
      return { success: true, result };
    } catch (error) {
      console.error('❌ FAILED: Cannot confirm booking');
      console.error('Error:', error);
      console.error('================================================\n');
      
      return { success: false, error };
    }
  },

  /**
   * Run all tests in sequence
   */
  async runAll() {
    console.log('🚀 RUNNING ALL BACKEND TESTS');
    console.log('================================================\n');
    
    // Test 1: Create trip
    const test1 = await this.testConnection();
    if (!test1.success) {
      console.error('⛔ Cannot proceed - API connection failed');
      return { success: false, stage: 'connection' };
    }
    
    const tripId = test1.tripId!;
    
    // Test 2: Retrieve trip
    const test2 = await this.testGetTrip(tripId);
    if (!test2.success) {
      console.error('⛔ Cannot proceed - Trip retrieval failed');
      return { success: false, stage: 'retrieval', tripId };
    }
    
    // Test 3: Generate itineraries
    const test3 = await this.testItineraryGeneration(tripId);
    if (!test3.success) {
      console.error('⛔ Cannot proceed - Itinerary generation failed');
      return { success: false, stage: 'generation', tripId };
    }
    
    const itineraryId = test3.result?.itineraries?.[0]?.id || 'option-1';
    
    // Test 4: Confirm booking
    const test4 = await this.testBooking(tripId, itineraryId);
    if (!test4.success) {
      console.error('⛔ Booking confirmation failed');
      return { success: false, stage: 'booking', tripId };
    }
    
    console.log('🎉 ALL TESTS PASSED!');
    console.log('================================================');
    console.log('Your backend is working correctly.');
    console.log('Trip ID for reference:', tripId);
    console.log('================================================\n');
    
    return { 
      success: true, 
      tripId,
      summary: {
        connection: '✅',
        retrieval: '✅',
        generation: test3.result?.warning ? '⚠️ (mock data)' : '✅',
        booking: '✅',
      }
    };
  },

  /**
   * Quick connectivity check
   */
  async quickCheck() {
    console.log('⚡ QUICK CONNECTIVITY CHECK');
    console.log('================================================\n');
    
    const result = await this.testConnection();
    
    if (result.success) {
      console.log('✅ Your backend is connected and working!');
      console.log('You can proceed with API integration.');
    } else {
      console.log('❌ Backend connection failed.');
      console.log('Check your Supabase configuration and Edge Functions.');
    }
    
    console.log('================================================\n');
    
    return result;
  }
};

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).backendTests = backendTests;
  console.log('✅ Backend tests loaded! Available as window.backendTests');
  console.log('Run: backendTests.quickCheck() or backendTests.runAll()');
}

export default backendTests;
