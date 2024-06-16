"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Import useSession

const AddressInput = () => {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession(); // Use useSession here to get session data

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) return;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initAutocomplete();
      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!window.google) return;
      const input = document.getElementById('location-input');
      const autocomplete = new window.google.maps.places.Autocomplete(input, { types: ['geocode'] });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setLocation(place.formatted_address);
          setCoordinates({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });
    };

    loadGoogleMapsScript();

    return () => {
      const script = document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js"]`);
      script?.remove();
    };
  }, []);

  const handleLocationSubmit = async () => {
    if (!session) {
      alert("You must be logged in to save locations.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/locations/new', { // Adjust this URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: location,
          lat: coordinates.lat,
          lng: coordinates.lng,
          userId: session?.user.id // Use the session to get the user ID
        }),
      });

      if (response.ok) {
        router.push('/'); // Redirect or handle the response
      } else {
        throw new Error('Failed to save location');
      }
    } catch (error) {
      console.error('Failed to save location:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        id="location-input"
        placeholder="Enter your address here"
        className="w-full p-2 border border-gray-300 rounded"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <button
        onClick={handleLocationSubmit}
        disabled={submitting}
        className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {submitting ? 'Submitting...' : 'Save Location'}
      </button>
    </div>
  );
};

export default AddressInput;
