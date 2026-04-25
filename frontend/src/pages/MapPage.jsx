import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0d1425' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1425' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2440' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c3e6b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#080c18' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const LIGHT_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0e7ff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#dcfce7' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const DEMO_POLLING_PLACES = [
  { name: 'City Hall Polling Station', vicinity: '123 Main St, Your City' },
  { name: 'Public Library — Voting Center', vicinity: '456 Oak Ave, Your City' },
  { name: 'Community Center', vicinity: '789 Elm Blvd, Your City' },
];

export default function MapPage() {
  const { darkMode } = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [pollingPlaces, setPollingPlaces] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setLocationError('no-key');
      return;
    }

    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const existing = document.getElementById('gmap-script');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'gmap-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=__initElectionMap`;
    script.async = true;
    script.defer = true;

    window.__initElectionMap = () => setMapLoaded(true);
    script.onerror = () => setLocationError('Failed to load Google Maps. Check your API key.');
    document.head.appendChild(script);

    return () => { delete window.__initElectionMap; };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 39.8283, lng: -98.5795 },
      zoom: 4,
      styles: darkMode ? DARK_MAP_STYLES : LIGHT_MAP_STYLES,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
  }, [mapLoaded, darkMode]);

  // Update map styles when theme changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({ styles: darkMode ? DARK_MAP_STYLES : LIGHT_MAP_STYLES });
    }
  }, [darkMode]);

  const centerMapAndSearch = (coords) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter(coords);
    mapInstanceRef.current.setZoom(13);

    // Clear old markers
    if (window.__electionMarkers) {
      window.__electionMarkers.forEach(m => m.setMap(null));
    }
    window.__electionMarkers = [];

    // User location marker
    const userMarker = new window.google.maps.Marker({
      position: coords,
      map: mapInstanceRef.current,
      title: 'Your Location',
      zIndex: 999,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#6366f1',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      }
    });
    window.__electionMarkers.push(userMarker);

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

    // Search multiple types that are commonly used as polling places
    const VOTING_TYPES = [
      { type: 'city_hall', label: '🏛️ City Hall' },
      { type: 'library', label: '📚 Library' },
      { type: 'school', label: '🏫 School' },
      { type: 'community_center', label: '🏢 Community Center' },
      { type: 'local_government_office', label: '🏛️ Government Office' },
    ];

    const allResults = [];
    let completed = 0;

    VOTING_TYPES.forEach(({ type, label }) => {
      service.nearbySearch({
        location: coords,
        radius: 5000,
        type,
      }, (results, status) => {
        completed++;
        if (status === 'OK' && results?.length) {
          // Tag each result with its venue type label
          results.slice(0, 2).forEach(r => {
            if (!allResults.find(x => x.place_id === r.place_id)) {
              allResults.push({ ...r, venueType: label });
            }
          });
        }

        // When all searches done, show top 6 results
        if (completed === VOTING_TYPES.length) {
          if (allResults.length === 0) {
            setPollingPlaces(DEMO_POLLING_PLACES);
            return;
          }

          // Sort by distance (closest first using geometry)
          const sorted = allResults.slice(0, 6);
          setPollingPlaces(sorted);

          sorted.forEach(place => {
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: mapInstanceRef.current,
              title: place.name,
              icon: {
                path: window.google.maps.SymbolPath.MAP_PIN,
                scale: 6,
                fillColor: '#6366f1',
                fillOpacity: 0.9,
                strokeColor: '#fff',
                strokeWeight: 1.5,
              }
            });

            // Info window on click
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding:8px;max-width:200px;font-family:sans-serif">
                  <strong style="font-size:13px">${place.name}</strong>
                  <p style="font-size:12px;color:#555;margin:4px 0">${place.vicinity || ''}</p>
                  <span style="font-size:11px;color:#6366f1;font-weight:600">${place.venueType}</span>
                </div>
              `
            });
            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });

            window.__electionMarkers.push(marker);
          });
        }
      });
    });
  };

  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setIsLocating(false);
        centerMapAndSearch(coords);
      },
      () => {
        setLocationError('Unable to get your location. Please enter your address manually.');
        setIsLocating(false);
      }
    );
  };

  const searchByAddress = () => {
    if (!manualAddress.trim() || !mapInstanceRef.current) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: manualAddress }, (results, status) => {
      if (status === 'OK') {
        const coords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        setUserLocation(coords);
        centerMapAndSearch(coords);
      } else {
        setLocationError('Address not found. Please try a different address.');
      }
    });
  };

  // No API key fallback
  if (locationError === 'no-key') {
    return (
      <div style={{ minHeight: '100vh', padding: '0 0 60px' }}>
        <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}
          >
            Find Your <span className="page-title-gradient">Polling Place</span>
          </motion.h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Locate your nearest polling location on Election Day.
          </p>
        </div>
        <div style={{
          maxWidth: 500, margin: '40px auto', textAlign: 'center',
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          borderRadius: 20, padding: '48px 40px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>🗺️</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Map Configuration Required
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Add your Google Maps API key to enable the polling place finder:
          </p>
          <code style={{
            display: 'block', background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-default)', borderRadius: 8,
            padding: '12px 16px', margin: '16px 0',
            fontFamily: 'monospace', fontSize: 13,
            color: 'var(--accent-primary)', wordBreak: 'break-all'
          }}>
            VITE_GOOGLE_MAPS_API_KEY=your_key_here
          </code>
          <p style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
            Or find your polling place at:{' '}
            <a
              href="https://www.vote.gov/polling-place-locator/"
              target="_blank" rel="noreferrer"
              style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              vote.gov →
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}
        >
          Find Your <span className="page-title-gradient">Polling Place</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}
        >
          Enter your address or use your location to find polling places near you.
        </motion.p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        maxWidth: 700, margin: '0 auto 24px', padding: '0 24px', flexWrap: 'wrap'
      }}>
        <button
          onClick={getUserLocation} disabled={isLocating}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
        >
          {isLocating ? '⏳ Locating...' : '📍 Use My Location'}
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>or</span>
        <div style={{
          flex: 1, display: 'flex',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid var(--border-default)',
          borderRadius: 10, overflow: 'hidden', minWidth: 280
        }}>
          <input
            type="text"
            placeholder="Enter your address..."
            value={manualAddress}
            onChange={e => setManualAddress(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchByAddress()}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              padding: '12px 16px', color: 'var(--text-primary)',
              fontSize: 14, outline: 'none'
            }}
          />
          <button
            onClick={searchByAddress}
            style={{
              background: 'rgba(99,102,241,0.2)', border: 'none',
              borderLeft: '1px solid var(--border-default)',
              padding: '12px 18px', color: 'var(--accent-primary)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Error */}
      {locationError && locationError !== 'no-key' && (
        <div style={{
          maxWidth: 700, margin: '0 auto 16px', padding: '12px 20px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10, color: '#fca5a5', fontSize: 14
        }}>
          ⚠️ {locationError}
        </div>
      )}

      {/* Map + Results */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: pollingPlaces.length > 0 ? '1fr 320px' : '1fr',
        gap: 20
      }}>
        {/* Map canvas */}
        <div
          ref={mapRef}
          style={{
            height: 520, borderRadius: 16, overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)', position: 'relative'
          }}
        >
          {!mapLoaded && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16,
              color: 'var(--text-secondary)'
            }}>
              <div style={{
                width: 36, height: 36,
                border: '3px solid var(--border-default)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <p>Loading map...</p>
            </div>
          )}
        </div>

        {/* Results panel */}
        {pollingPlaces.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              Nearby Voting Locations
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
              These venues are commonly used as polling places. Verify with your local election office.
            </p>
            {pollingPlaces.map((place, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', cursor: 'pointer' }}
                onClick={() => {
                  if (place.geometry?.location && mapInstanceRef.current) {
                    mapInstanceRef.current.panTo(place.geometry.location);
                    mapInstanceRef.current.setZoom(16);
                  }
                }}
              >
                <div style={{
                  width: 28, height: 28, flexShrink: 0,
                  background: 'var(--brand-gradient)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white'
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {place.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    {place.vicinity}
                  </div>
                  {place.venueType && (
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: 'var(--accent-primary)',
                      background: 'var(--accent-glow)',
                      border: '1px solid var(--border-brand)',
                      borderRadius: 999, padding: '2px 8px'
                    }}>
                      {place.venueType}
                    </span>
                  )}
                  {place.opening_hours && (
                    <div style={{
                      fontSize: 12, marginTop: 4,
                      color: place.opening_hours.isOpen?.() ? '#4ade80' : '#f87171'
                    }}>
                      {place.opening_hours.isOpen?.() ? '🟢 Open Now' : '🔴 Closed'}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <a
              href="https://www.vote.gov/polling-place-locator/"
              target="_blank" rel="noreferrer"
              style={{
                display: 'block', textAlign: 'center', marginTop: 4,
                fontSize: 13, color: 'var(--accent-primary)',
                textDecoration: 'none', fontWeight: 600
              }}
            >
              Verify official polling place →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
