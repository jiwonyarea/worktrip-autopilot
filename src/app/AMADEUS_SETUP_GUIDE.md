# 🎯 Amadeus API Setup Guide

**Complete step-by-step guide to integrate Amadeus flight and hotel APIs**

---

## 📋 Overview

**What is Amadeus?**
- Leading travel technology provider
- Powers major airlines, hotels, and travel agencies
- Developer-friendly APIs for flights, hotels, cars, and more
- Free test environment + affordable production pricing

**What You'll Get:**
- ✈️ Real-time flight search across 500+ airlines
- 🏨 Hotel search across 150,000+ properties
- 💰 Real pricing and availability
- 📅 Booking capabilities
- 🔄 Cancellation and modification support

---

## 🚀 Step 1: Sign Up for Amadeus

### 1.1 Create Account
1. Go to: https://developers.amadeus.com/
2. Click **"Register"** (top right)
3. Fill in your details:
   - **Email**: Your work email
   - **First/Last Name**: Your name
   - **Company**: WorkTrip Autopilot (or your company name)
   - **Use Case**: Corporate Travel Management
4. Verify your email
5. Complete your profile

### 1.2 Create an Application
1. After login, go to **"My Self-Service Workspace"**
2. Click **"Create New App"**
3. Fill in app details:
   - **App Name**: WorkTrip Autopilot
   - **Description**: Corporate travel booking and management platform
   - **Application Type**: Web Application
4. Click **"Create"**

### 1.3 Get Your API Credentials
1. Your app page will show:
   - ✅ **API Key** (Client ID)
   - ✅ **API Secret** (Client Secret)
2. **IMPORTANT**: Copy both and save them securely
3. You'll see two environments:
   - **Test**: Free, uses test data (START HERE)
   - **Production**: Real data, requires payment

---

## 🔑 Step 2: Add Credentials to Your Project

### 2.1 In Supabase Dashboard
1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **Settings** → **Edge Functions** → **Secrets**
3. Add these secrets:

```bash
AMADEUS_API_KEY=your_client_id_here
AMADEUS_API_SECRET=your_client_secret_here
AMADEUS_ENVIRONMENT=test
```

**Example**:
```
AMADEUS_API_KEY=AbCdEfGhIjKlMnOpQrStUvWxYz
AMADEUS_API_SECRET=1234567890aBcDeFgH
AMADEUS_ENVIRONMENT=test
```

### 2.2 Verify Secrets Are Set
Run this in your Edge Function to verify:
```typescript
console.log('Amadeus Key:', Deno.env.get('AMADEUS_API_KEY') ? 'SET ✅' : 'MISSING ❌');
console.log('Amadeus Secret:', Deno.env.get('AMADEUS_API_SECRET') ? 'SET ✅' : 'MISSING ❌');
```

---

## 🧪 Step 3: Test Authentication

### 3.1 Understanding Amadeus Authentication
Amadeus uses OAuth2. You need to:
1. Request an access token using your API Key + Secret
2. Use that token for all API requests
3. Tokens expire after ~30 minutes (refresh as needed)

### 3.2 Test Authentication Endpoint

Create a test file to verify your credentials work:

```typescript
// Test file: /utils/amadeusTest.ts

const AMADEUS_API_KEY = 'your_api_key';
const AMADEUS_API_SECRET = 'your_api_secret';
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com'; // Test environment

async function getAccessToken() {
  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Authentication failed: ${error}`);
  }

  const data = await response.json();
  console.log('✅ Authentication successful!');
  console.log('Access Token:', data.access_token);
  console.log('Expires In:', data.expires_in, 'seconds');
  
  return data.access_token;
}

// Run the test
getAccessToken()
  .then(() => console.log('✅ Amadeus credentials are valid'))
  .catch((err) => console.error('❌ Authentication failed:', err));
```

**Expected Output**:
```
✅ Authentication successful!
Access Token: eyJ0eXAiOiJKV1QiLCJhbGc...
Expires In: 1799 seconds
✅ Amadeus credentials are valid
```

---

## ✈️ Step 4: Test Flight Search API

### 4.1 Flight Search Endpoint
**Endpoint**: `GET /v2/shopping/flight-offers`

**What it does**: Search for flights between two cities

### 4.2 Example Request

```typescript
async function searchFlights(accessToken: string) {
  const params = new URLSearchParams({
    originLocationCode: 'PIT', // Pittsburgh
    destinationLocationCode: 'NYC', // New York City
    departureDate: '2026-03-02',
    adults: '1',
    max: '5', // Return max 5 results
  });

  const response = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Flight search failed: ${error}`);
  }

  const data = await response.json();
  console.log('✅ Flight search successful!');
  console.log('Number of offers:', data.data.length);
  console.log('First flight:', data.data[0]);
  
  return data.data;
}
```

### 4.3 Example Response Structure

```json
{
  "data": [
    {
      "type": "flight-offer",
      "id": "1",
      "source": "GDS",
      "instantTicketingRequired": false,
      "nonHomogeneous": false,
      "oneWay": false,
      "lastTicketingDate": "2026-03-02",
      "numberOfBookableSeats": 9,
      "itineraries": [
        {
          "duration": "PT1H30M",
          "segments": [
            {
              "departure": {
                "iataCode": "PIT",
                "terminal": "1",
                "at": "2026-03-02T08:00:00"
              },
              "arrival": {
                "iataCode": "LGA",
                "terminal": "B",
                "at": "2026-03-02T09:30:00"
              },
              "carrierCode": "AA",
              "number": "1234",
              "aircraft": {
                "code": "738"
              },
              "operating": {
                "carrierCode": "AA"
              },
              "duration": "PT1H30M",
              "numberOfStops": 0
            }
          ]
        }
      ],
      "price": {
        "currency": "USD",
        "total": "234.50",
        "base": "189.00",
        "fees": [
          {
            "amount": "45.50",
            "type": "TICKETING"
          }
        ]
      },
      "pricingOptions": {
        "fareType": ["PUBLISHED"],
        "includedCheckedBagsOnly": true
      },
      "validatingAirlineCodes": ["AA"],
      "travelerPricings": [
        {
          "travelerId": "1",
          "fareOption": "STANDARD",
          "travelerType": "ADULT",
          "price": {
            "currency": "USD",
            "total": "234.50",
            "base": "189.00"
          }
        }
      ]
    }
  ]
}
```

**Key Fields**:
- `itineraries[0].segments` - Flight details (departure, arrival, airline)
- `price.total` - Total price in USD
- `itineraries[0].duration` - Flight duration (ISO 8601 format: PT1H30M = 1h 30m)
- `numberOfBookableSeats` - Seats available

---

## 🏨 Step 5: Test Hotel Search API

### 5.1 Hotel Search Endpoint
**Endpoint**: `GET /v3/shopping/hotel-offers`

### 5.2 Example Request

```typescript
async function searchHotels(accessToken: string) {
  const params = new URLSearchParams({
    cityCode: 'NYC', // New York City
    checkInDate: '2026-03-02',
    checkOutDate: '2026-03-05',
    adults: '1',
    radius: '10', // 10 km radius
    radiusUnit: 'KM',
    ratings: '3,4,5', // 3-5 star hotels
    currency: 'USD',
    lang: 'EN',
    max: '5', // Return max 5 results
  });

  const response = await fetch(
    `https://test.api.amadeus.com/v3/shopping/hotel-offers?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hotel search failed: ${error}`);
  }

  const data = await response.json();
  console.log('✅ Hotel search successful!');
  console.log('Number of hotels:', data.data.length);
  console.log('First hotel:', data.data[0]);
  
  return data.data;
}
```

### 5.3 Example Response Structure

```json
{
  "data": [
    {
      "type": "hotel-offers",
      "hotel": {
        "type": "hotel",
        "hotelId": "NYCMARRI",
        "chainCode": "MC",
        "dupeId": "700123456",
        "name": "Marriott Marquis Times Square",
        "cityCode": "NYC",
        "latitude": 40.759,
        "longitude": -73.9844
      },
      "available": true,
      "offers": [
        {
          "id": "OFFER123",
          "checkInDate": "2026-03-02",
          "checkOutDate": "2026-03-05",
          "rateCode": "RAC",
          "room": {
            "type": "A1K",
            "typeEstimated": {
              "category": "STANDARD_ROOM",
              "beds": 1,
              "bedType": "KING"
            },
            "description": {
              "text": "Standard King Room"
            }
          },
          "guests": {
            "adults": 1
          },
          "price": {
            "currency": "USD",
            "base": "450.00",
            "total": "519.75",
            "variations": {
              "average": {
                "base": "150.00"
              }
            }
          },
          "policies": {
            "cancellation": {
              "type": "FULL_CHARGE",
              "deadline": "2026-03-01T23:59:00"
            }
          }
        }
      ]
    }
  ]
}
```

**Key Fields**:
- `hotel.name` - Hotel name
- `hotel.latitude/longitude` - Location coordinates
- `offers[0].price.total` - Total price for stay
- `offers[0].room.description.text` - Room type description
- `offers[0].policies.cancellation` - Cancellation policy

---

## 📚 Step 6: Read Documentation

### Essential Documentation Links

#### Flight APIs
- **Flight Offers Search**: https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search
- **Flight Create Orders** (Booking): https://developers.amadeus.com/self-service/category/flights/api-doc/flight-create-orders
- **Airport Codes**: https://www.iata.org/en/publications/directories/code-search/

#### Hotel APIs
- **Hotel Search**: https://developers.amadeus.com/self-service/category/hotels/api-doc/hotel-search
- **Hotel List**: https://developers.amadeus.com/self-service/category/hotels/api-doc/hotel-list
- **Hotel Booking**: https://developers.amadeus.com/self-service/category/hotels/api-doc/hotel-booking

#### General
- **Getting Started Guide**: https://developers.amadeus.com/get-started/get-started-with-self-service-apis-335
- **Authentication**: https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262

---

## 💡 Step 7: Key Concepts

### 7.1 IATA Airport Codes
Flights use 3-letter airport codes:
- **PIT** = Pittsburgh International Airport
- **NYC** = All New York airports (JFK, LGA, EWR)
- **LAX** = Los Angeles International Airport

**Find codes**: https://www.iata.org/en/publications/directories/code-search/

### 7.2 Duration Format (ISO 8601)
Amadeus returns durations in ISO 8601 format:
- `PT1H30M` = 1 hour 30 minutes
- `PT2H15M` = 2 hours 15 minutes
- `PT45M` = 45 minutes

**Parse in JavaScript**:
```typescript
function parseISO8601Duration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  
  const hours = match[1] || '0';
  const minutes = match[2] || '0';
  
  return `${hours}h ${minutes}m`;
}

parseISO8601Duration('PT1H30M'); // Returns: "1h 30m"
```

### 7.3 Price Structure
Amadeus prices include:
- **base**: Base fare
- **fees**: Taxes and fees
- **total**: Total price (base + fees)

Always use `total` for displaying to users.

### 7.4 Test vs Production
- **Test Environment**: 
  - URL: `https://test.api.amadeus.com`
  - Uses test data (not real flights/hotels)
  - Free to use
  - Great for development
  
- **Production Environment**:
  - URL: `https://api.amadeus.com`
  - Real flights and hotels
  - Charges per API call
  - Requires payment setup

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Invalid credentials"
**Solution**: Check that you copied API Key and Secret correctly. No extra spaces.

### Issue 2: "Access token expired"
**Solution**: Tokens expire after 30 minutes. Request a new token.

### Issue 3: "No results found"
**Solution**: 
- Check airport codes are valid (3 letters, uppercase)
- Ensure dates are in the future
- Try broader search parameters (increase `max` parameter)

### Issue 4: "Rate limit exceeded"
**Solution**: 
- Test environment has limits (10 requests/second)
- Add delay between requests
- Cache results when possible

---

## 🎯 Next Steps

Once you've completed this guide:

1. ✅ Verify your credentials work
2. ✅ Successfully search for flights
3. ✅ Successfully search for hotels
4. ✅ Read the documentation

**Then move to**: Integration phase (creating helper functions in your app)

---

## 📞 Support Resources

- **Amadeus Developer Forum**: https://developers.amadeus.com/support
- **API Status**: https://developers.amadeus.com/status
- **Email Support**: developers@amadeus.com (for API-related questions)

---

**Ready to integrate?** Return to `/BACKEND_INTEGRATION_PLAN.md` for the next steps!
