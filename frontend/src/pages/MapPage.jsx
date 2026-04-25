import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { HiOutlineLocationMarker, HiOutlineSearch } from 'react-icons/hi';
import { motion } from 'framer-motion';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

// Default center: Washington D.C.
const defaultCenter = {
  lat: 38.8951,
  lng: -77.0364
};

// Custom map styles for a cleaner look that matches the app
const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0e7ff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#dcfce7' }] },
];

export default function MapPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [address, setAddress] = useState('');
  const [pollingPlaces, setPollingPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const searchAddress = async (e) => {
    e.preventDefault();
    if (!address.trim() || !window.google) return;

    setIsSearching(true);
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') resolve(results);
          else reject(status);
        });
      });

      const location = results[0].geometry.location;
      setCenter({ lat: location.lat(), lng: location.lng() });
      map?.panTo(location);
      map?.setZoom(14);

      // Search for nearby polling places (simulated with 'local government office' / 'school' for demo)
      // In a real app, this should query the Google Civic Information API
      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location,
          radius: 5000,
          type: ['local_government_office', 'school', 'library']
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            // Mocking these as "Polling Places" for the demo
            const places = results.slice(0, 5).map(p => ({
              ...p,
              isPollingPlace: Math.random() > 0.3,
              isDropBox: Math.random() > 0.7
            }));
            setPollingPlaces(places);
          }
          setIsSearching(false);
        }
      );
    } catch (err) {
      console.error('Geocoding error:', err);
      setIsSearching(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          map?.panTo(pos);
          map?.setZoom(14);
          setIsSearching(false);
          // Auto-trigger search near me
          setAddress('My Location');
          searchAddress({ preventDefault: () => {} });
        },
        () => {
          setIsSearching(false);
          alert('Error: The Geolocation service failed.');
        }
      );
    }
  };

  if (loadError) {
    return <div className="p-8 text-center text-red-500">Error loading Google Maps</div>;
  }

  return (
    <div className="section-container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4"
          >
            Find Your <span className="gradient-text">Polling Place</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Enter your address to locate nearby voting centers and ballot drop boxes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <form onSubmit={searchAddress} className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, City, State"
                      className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <HiOutlineSearch className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isSearching || !address}
                    className="btn-primary flex-1 py-2"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                  <button 
                    type="button" 
                    onClick={getUserLocation}
                    className="btn-secondary py-2 px-3"
                    title="Use my current location"
                  >
                    <HiOutlineLocationMarker className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-card p-6 min-h-[300px]">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Nearby Locations
              </h3>
              
              {!isLoaded && <div className="text-slate-500 text-sm animate-pulse">Loading map...</div>}
              
              {isLoaded && pollingPlaces.length === 0 && !isSearching && (
                <div className="text-slate-500 dark:text-slate-400 text-sm text-center py-8">
                  Enter your address to see polling places near you.
                </div>
              )}

              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {pollingPlaces.map((place) => (
                  <div 
                    key={place.place_id}
                    onClick={() => {
                      setSelectedPlace(place);
                      map?.panTo(place.geometry.location);
                      map?.setZoom(16);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPlace?.place_id === place.place_id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">{place.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{place.vicinity}</p>
                    <div className="flex gap-2 mt-2">
                      {place.isPollingPlace && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Polling Place
                        </span>
                      )}
                      {place.isDropBox && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          Ballot Drop Box
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2 relative">
            {/* Note: This requires VITE_GOOGLE_MAPS_API_KEY to be valid */}
            {isLoaded ? (
              <div className="map-container relative shadow-xl shadow-slate-200/50 dark:shadow-black/50">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={12}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    styles: mapStyles,
                    disableDefaultUI: false,
                    zoomControl: true,
                  }}
                >
                  {/* Home Marker */}
                  {address && (
                    <Marker
                      position={center}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#4f46e5',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                      }}
                    />
                  )}

                  {/* Polling Places Markers */}
                  {pollingPlaces.map((place) => (
                    <Marker
                      key={place.place_id}
                      position={place.geometry.location}
                      onClick={() => setSelectedPlace(place)}
                      icon={{
                        url: place.isDropBox 
                          ? 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"%3E%3Cpath d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6l6 6 6-6h-2v-5h-2v5z"/%3E%3C/svg%3E'
                          : 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
                        scaledSize: new window.google.maps.Size(32, 32),
                      }}
                    />
                  ))}

                  {/* Info Window */}
                  {selectedPlace && (
                    <InfoWindow
                      position={selectedPlace.geometry.location}
                      onCloseClick={() => setSelectedPlace(null)}
                    >
                      <div className="p-2 max-w-[200px] text-slate-800">
                        <h3 className="font-semibold text-sm mb-1">{selectedPlace.name}</h3>
                        <p className="text-xs text-slate-600 mb-2">{selectedPlace.vicinity}</p>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 font-medium hover:underline"
                        >
                          Get Directions →
                        </a>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>
            ) : (
              <div className="w-full h-full min-h-[400px] bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <div className="animate-pulse flex flex-col items-center">
                  <HiOutlineMap className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
                  <span className="text-slate-400">Initializing Map...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
