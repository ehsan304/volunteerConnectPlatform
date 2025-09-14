// import { useState, useCallback, useRef, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import { MapPin, Calendar, Users } from 'lucide-react';

// const containerStyle = {
//     width: '100%',
//     height: '400px'
// };

// const defaultCenter = {
//     lat: 40.7128,
//     lng: -74.0060
// };

// const InteractiveMap = ({ opportunities, userLocation }) => {
//     const [selectedOpportunity, setSelectedOpportunity] = useState(null);
//     const [map, setMap] = useState(null);
//     const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//     const mapRef = useRef();

//     const onLoad = useCallback((mapInstance) => {
//         mapRef.current = mapInstance;
//         setMap(mapInstance);
//     }, []);

//     const onUnmount = useCallback(() => {
//         mapRef.current = null;
//         setMap(null);
//     }, []);

//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Fit map bounds to show all markers
//     const fitBounds = () => {
//         if (mapRef.current && opportunities.length > 0 && window.google) {
//             const bounds = new window.google.maps.LatLngBounds();

//             // Add user location if available
//             if (userLocation) {
//                 bounds.extend(userLocation);
//             }

//             // Add all opportunity locations
//             opportunities.forEach(opportunity => {
//                 if (opportunity.location && opportunity.location.coordinates) {
//                     bounds.extend({
//                         lat: opportunity.location.coordinates.coordinates[1],
//                         lng: opportunity.location.coordinates.coordinates[0]
//                     });
//                 }
//             });

//             mapRef.current.fitBounds(bounds);

//             // Add a slight zoom out
//             if (opportunities.length === 1 && userLocation) {
//                 setTimeout(() => {
//                     if (mapRef.current) {
//                         mapRef.current.setZoom(10);
//                     }
//                 }, 100);
//             }
//         }
//     };

//     // Handle script load success
//     const handleScriptLoad = () => {
//         setIsScriptLoaded(true);
//     };

//     // Handle script load error
//     const handleScriptError = () => {
//         console.error('Google Maps script failed to load');
//     };

//     // Fit bounds when opportunities or map changes
//     useEffect(() => {
//         if (isScriptLoaded && mapRef.current) {
//             // Small delay to ensure map is fully rendered
//             setTimeout(fitBounds, 100);
//         }
//     }, [isScriptLoaded, opportunities, userLocation]);

//     // Custom marker icons as data URLs
//     const userIcon = {
//         url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDhDNTAuOTE3NDcgOCA4IDUuOTE3NDcgOCA0QzggMi4wODI1MyA5LjA4MjUzIDEgMTEgMUMxMi45MTc0NyAxIDE0IDIuMDgyNTMgMTQgNEMxNCA1LjkxNzQ3IDEyLjkxNzQ3IDggMTIgOFoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTEyIDIyQzcgMiAyMiAyIDIyIDJDMjIgMiA3IDIgMTIgMjJaIiBmaWxsPSIjNDI4NUY0Ii8+Cjwvc3ZnPg==',
//         scaledSize: { width: 30, height: 30 },
//         anchor: { x: 15, y: 15 }
//     };

//     const opportunityIcon = {
//         url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwRUE1RTkiLz4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
//         scaledSize: { width: 25, height: 25 },
//         anchor: { x: 12.5, y: 12.5 }
//     };

//     if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
//         return (
//             <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//                 <div className="text-center text-gray-500">
//                     <p>Google Maps API key is not configured.</p>
//                     <p className="text-sm">Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="relative">
//             <LoadScript
//                 googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
//                 onLoad={handleScriptLoad}
//                 onError={handleScriptError}
//             >
//                 <GoogleMap
//                     mapContainerStyle={containerStyle}
//                     center={userLocation || defaultCenter}
//                     zoom={10}
//                     onLoad={onLoad}
//                     onUnmount={onUnmount}
//                     options={{
//                         streetViewControl: false,
//                         mapTypeControl: false,
//                         fullscreenControl: true,
//                         zoomControl: true,
//                     }}
//                 >
//                     {/* User location marker */}
//                     {userLocation && (
//                         <Marker
//                             position={userLocation}
//                             icon={userIcon}
//                             title="Your location"
//                         />
//                     )}

//                     {/* Opportunity markers */}
//                     {opportunities.map((opportunity) => {
//                         if (!opportunity.location || !opportunity.location.coordinates) return null;

//                         const position = {
//                             lat: opportunity.location.coordinates.coordinates[1],
//                             lng: opportunity.location.coordinates.coordinates[0]
//                         };

//                         return (
//                             <Marker
//                                 key={opportunity._id}
//                                 position={position}
//                                 onClick={() => setSelectedOpportunity(opportunity)}
//                                 icon={opportunityIcon}
//                             />
//                         );
//                     })}

//                     {/* Info window for selected opportunity */}
//                     {selectedOpportunity && selectedOpportunity.location && selectedOpportunity.location.coordinates && (
//                         <InfoWindow
//                             position={{
//                                 lat: selectedOpportunity.location.coordinates.coordinates[1],
//                                 lng: selectedOpportunity.location.coordinates.coordinates[0]
//                             }}
//                             onCloseClick={() => setSelectedOpportunity(null)}
//                         >
//                             <div className="p-2 max-w-xs">
//                                 <h3 className="font-semibold text-lg mb-2">{selectedOpportunity.title}</h3>
//                                 <div className="space-y-1 text-sm">
//                                     <div className="flex items-center">
//                                         <MapPin className="h-4 w-4 mr-1 text-primary-600" />
//                                         <span>{selectedOpportunity.location.address}</span>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <Calendar className="h-4 w-4 mr-1 text-primary-600" />
//                                         <span>{formatDate(selectedOpportunity.date)}</span>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <Users className="h-4 w-4 mr-1 text-primary-600" />
//                                         <span>{selectedOpportunity.volunteersNeeded} volunteers needed</span>
//                                     </div>
//                                 </div>
//                                 <a
//                                     href={`/opportunities/${selectedOpportunity._id}`}
//                                     className="block mt-2 text-primary-600 hover:text-primary-700 font-medium"
//                                 >
//                                     View details →
//                                 </a>
//                             </div>
//                         </InfoWindow>
//                     )}
//                 </GoogleMap>
//             </LoadScript>

//             {!isScriptLoaded && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
//                     <div className="text-center">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//                         <p className="mt-2 text-gray-600">Loading map...</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InteractiveMap;





import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Calendar, Users } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
};

const InteractiveMap = ({ opportunities, userLocation }) => {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [map, setMap] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const mapRef = useRef();

    const onLoad = useCallback((mapInstance) => {
        mapRef.current = mapInstance;
        setMap(mapInstance);

        // Fit bounds once the map is ready
        if (window.google && window.google.maps) {
            fitBounds(mapInstance);
        }
    }, [opportunities, userLocation]);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
        setMap(null);
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Fit map bounds to show all markers
    const fitBounds = (mapInstance = mapRef.current) => {
        if (
            mapInstance &&
            opportunities.length > 0 &&
            window.google &&
            window.google.maps
        ) {
            const bounds = new window.google.maps.LatLngBounds();

            // Add user location if available
            if (userLocation) {
                bounds.extend(userLocation);
            }

            // Add all opportunity locations
            opportunities.forEach(opportunity => {
                const coords = opportunity.location?.coordinates?.coordinates;
                if (coords && coords.length === 2) {
                    bounds.extend({
                        lat: coords[1],
                        lng: coords[0]
                    });
                }
            });

            mapInstance.fitBounds(bounds);

            // Adjust zoom if only one opportunity + user location
            if (opportunities.length === 1 && userLocation) {
                setTimeout(() => {
                    if (mapRef.current) {
                        mapRef.current.setZoom(10);
                    }
                }, 100);
            }
        }
    };

    // Handle script load success
    const handleScriptLoad = () => {
        setIsScriptLoaded(true);
    };

    // Handle script load error
    const handleScriptError = () => {
        console.error('Google Maps script failed to load');
    };

    // Fit bounds when opportunities or userLocation change
    useEffect(() => {
        if (isScriptLoaded && mapRef.current) {
            setTimeout(() => fitBounds(), 150);
        }
    }, [isScriptLoaded, opportunities, userLocation]);

    // Custom marker icons as data URLs
    const userIcon = {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDhDNTAuOTE3NDcgOCA4IDUuOTE3NDcgOCA0QzggMi4wODI1MyA5LjA4MjUzIDEgMTEgMUMxMi45MTc0NyAxIDE0IDIuMDgyNTMgMTQgNEMxNCA1LjkxNzQ3IDEyLjkxNzQ3IDggMTIgOFoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTEyIDIyQzcgMiAyMiAyIDIyIDJDMjIgMiA3IDIgMTIgMjJaIiBmaWxsPSIjNDI4NUY0Ii8+Cjwvc3ZnPg==',
        scaledSize: { width: 30, height: 30 },
        anchor: { x: 15, y: 15 }
    };

    const opportunityIcon = {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwRUE1RTkiLz4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
        scaledSize: { width: 25, height: 25 },
        anchor: { x: 12.5, y: 12.5 }
    };

    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center text-gray-500">
                    <p>Google Maps API key is not configured.</p>
                    <p className="text-sm">Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                onLoad={handleScriptLoad}
                onError={handleScriptError}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={userLocation || defaultCenter}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                        zoomControl: true,
                    }}
                >
                    {/* User location marker */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={userIcon}
                            title="Your location"
                        />
                    )}

                    {/* Opportunity markers */}
                    {opportunities.map((opportunity) => {
                        const coords = opportunity.location?.coordinates?.coordinates;
                        if (!coords || coords.length !== 2) return null;

                        const position = {
                            lat: coords[1],
                            lng: coords[0]
                        };

                        return (
                            <Marker
                                key={opportunity._id}
                                position={position}
                                onClick={() => setSelectedOpportunity(opportunity)}
                                icon={opportunityIcon}
                            />
                        );
                    })}

                    {/* Info window for selected opportunity */}
                    {selectedOpportunity?.location?.coordinates?.coordinates && (
                        <InfoWindow
                            position={{
                                lat: selectedOpportunity.location.coordinates.coordinates[1],
                                lng: selectedOpportunity.location.coordinates.coordinates[0]
                            }}
                            onCloseClick={() => setSelectedOpportunity(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-semibold text-lg mb-2">{selectedOpportunity.title}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1 text-primary-600" />
                                        <span>{selectedOpportunity.location.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-primary-600" />
                                        <span>{formatDate(selectedOpportunity.date)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1 text-primary-600" />
                                        <span>{selectedOpportunity.volunteersNeeded} volunteers needed</span>
                                    </div>
                                </div>
                                <a
                                    href={`/opportunities/${selectedOpportunity._id}`}
                                    className="block mt-2 text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    View details →
                                </a>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>

            {!isScriptLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading map...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteractiveMap;
