# Wander Lens AI - Smart Route Planning with POI Discovery

> Experience your journey before you go - Plan routes, discover places, and preview scenery along the way

## Inspiration

The inspiration for Wander Lens AI came from a team member's personal experience taking a trip between Los Angeles and San Francisco. They discovered there's a big difference between taking the scenic coastal routes (Highway 1 and 101) with breathtaking ocean views, charming coastal towns, and stunning vistas versus the inland Highway 5 surrounded by farmland and, well, cow dung. 

We decided it would be perfect to **experience the trip before actually going** - to see what restaurants we'd pass, where we could stop for coffee, what attractions were along the way, and most importantly, preview the actual scenery we'd encounter. Traditional GPS apps tell you *how* to get there, but they don't help you *experience* the journey or discover what makes each route special.

Wander Lens AI was born from this simple question: *"What if you could preview and plan every aspect of your road trip, from the route itself to every interesting stop along the way?"*

## What it does

Wander Lens AI is an intelligent route planning application that goes beyond simple navigation:

### 🗺️ Smart Route Planning
- **Multi-waypoint routing** with automatic segment merging for complex journeys
- **Multiple routing profiles**: Trekking, Fast Bike, Safety, Shortest, Moped
- **Real-time route metrics**: Distance, estimated time, elevation gain/loss
- **Interactive map interface**: Click to add waypoints, drag to adjust

### 🔍 POI Discovery
Discover interesting places along your route with smart filtering:
- 🍽️ **Restaurants** - Find dining options along the way
- ☕ **Cafes** - Perfect spots for coffee breaks
- 🍺 **Bars & Pubs** - Evening entertainment stops
- 🅿️ **Parking** - Convenient parking locations
- 🚻 **Restrooms** - Essential facilities
- 🏛️ **Tourism & Attractions** - Museums, artwork, landmarks
- ➕ **And More**

### 📸 Scenic Preview
- Street-level imagery from Google Maps to preview your route's scenery
- See what the drive actually looks like before you go
- Discover scenic viewpoints and photo opportunities

### 🎯 Smart Filtering
- Filter POIs by type to find exactly what you need
- Real-time updates showing available options
- Click any POI to focus and get details

## How we built it

### Backend Architecture
Built with **Python/Flask**, our backend uses three powerful APIs:

**1. BRouter API** - Route Generation
- Generates optimized routes with multiple profiles
- Handles complex multi-waypoint journeys
- Implemented intelligent segment splitting/merging for routes exceeding API limits
- Returns detailed GeoJSON with elevation and timing data

**2. Overpass API** - POI Discovery
- Queries OpenStreetMap for points of interest
- Searches within route bounding boxes
- Filters by amenity types (restaurants, cafes, parking, etc.)

**3. GoogleMaps API** - Street Imagery
- Provides street-level photography along routes
- Offers panoramic and directional views
- Helps users preview scenic sections

### Frontend
- **React** with TypeScript for type-safe component development
- **Leaflet** for interactive mapping and visualization
- **Vite** for fast development and optimized builds
- Responsive design optimized for desktop trip planning
- **Lovable** for site design

### API Design
RESTful endpoints for clean integration:
```
GET /api/route?waypoints=lon1,lat1;lon2,lat2&profile=trekking
GET /api/pois?bbox=minLat,minLon,maxLat,maxLon
GET /image-data?lat=37.7749&lon=-122.4194
```

## Challenges we ran into

### 1. Multi-Waypoint Route Complexity
BRouter's public API has limitations on complex multi-waypoint requests. We solved this by:
- Automatically detecting when routes exceed limits
- Splitting into individual segments
- Intelligently merging coordinates without duplication
- Aggregating metrics (distance, time, elevation)

### 2. POI Data Overload
Overpass API can return thousands of POIs for large areas. Our solutions:
- Smart bounding box calculation from route geometry
- Client-side filtering for real-time responsiveness
- Prioritized display showing most relevant results first
- Implemented pagination for large result sets

### 3. API Rate Limits
Managing multiple external APIs required:
- Intelligent caching strategies
- Request batching and throttling
- Graceful error handling and user feedback
- Fallback mechanisms for service interruptions

### 4. Coordinate System Complexity
Different APIs use different coordinate systems:
- BRouter uses lon,lat format
- Leaflet uses lat,lon format
- Overpass uses lat,lon for bounding boxes
- Implemented consistent transformation layer

## Accomplishments that we're proud of

✅ **Successfully integrated three complex APIs** (BRouter, Overpass, KartaView) into a cohesive system

✅ **Built multi-waypoint handling** that automatically splits and merges routes, solving a major limitation of the BRouter public API

✅ **Created an intuitive UI** where users can plan routes and discover places with just a few clicks

✅ **Implemented smart filtering** allowing users to customize their trip based on their interests

✅ **Clean, maintainable codebase** with separate service modules for easy future expansion

## What we learned

### Technical Insights
- **API integration requires careful abstraction** - Each service has unique quirks; wrapping them in clean interfaces made development much smoother
- **Geographic data is complex** - Coordinate systems, projections, and bounding boxes require careful handling
- **Real-time filtering > Server-side filtering** - For responsive UIs, client-side filtering of moderate datasets provides better UX
- **Error handling is crucial** - External APIs fail; graceful degradation and clear error messages are essential

### Product Insights
- **Users want to *experience* routes, not just *follow* them** - The combination of scenic previews and POI discovery addresses a real gap in existing navigation apps
- **Filtering is essential** - Not everyone wants to see every restaurant; letting users choose what's relevant makes the app much more useful
- **Interactive maps are intuitive** - Click-to-add waypoints feels natural and reduces friction

### Development Process
- **Start with working examples** - Building simple demos first helped us understand API limitations before tackling complex features
- **Test with real data** - Using actual SF coordinates revealed issues we wouldn't have found with synthetic data, and was much quicker
- **Incremental integration** - Building one service at a time and validating before moving to the next prevented compounding errors

## What's next for Wander Lens AI

### Short Term (MVP+)
- 🎨 **Enhanced UI/UX** - Polish the interface with better visual design and animations
- 📱 **Mobile Responsiveness** - Optimize for mobile trip planning on-the-go
- 💾 **Trip Saving** - Allow users to save and share their planned routes
- 🗺️ **Route Alternatives** - Show multiple route options with pros/cons

### Medium Term
- 🏨 **Accommodation Integration** - Find hotels/camping along routes
- ⛽ **Gas Station Locator** - Essential for long road trips
- 🌤️ **Weather Integration** - Check weather conditions along the route
- 📊 **Route Comparison** - Side-by-side comparison of different routes
- ⭐ **POI Ratings** - Show reviews and ratings from various sources

### Long Term
- 🤝 **Social Features** - Share trips, follow other travelers' routes
- 🎯 **AI-Powered Recommendations** - ML-based suggestion of stops based on preferences
- 🚗 **Multi-Modal Transport** - Support for mixed transportation (drive + bike + walk)
- 📱 **Native Mobile Apps** - iOS and Android apps with offline capability
- 🔌 **EV Charging Stations** - Essential for electric vehicle trip planning
- 🎵 **Spotify Integration** - Road trip playlists synced to journey segments

### Infrastructure
- 🚀 **Self-hosted BRouter** - Eliminate public API limitations
- 💾 **Route Caching** - Store popular routes for instant loading
- 📈 **Analytics Dashboard** - Understand how users plan trips
- 🔄 **Real-time Traffic** - Integrate live traffic data for accurate timing
