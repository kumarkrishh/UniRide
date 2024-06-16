"use client"

import Image from "next/image";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSession } from 'next-auth/react';

const AddressInput = () => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

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

      const startInput = document.getElementById('location-input');
      const destinationInput = document.getElementById('destination-input');

      const startAutocomplete = new window.google.maps.places.Autocomplete(startInput, { types: ['geocode'] });
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInput, { types: ['geocode'] });

      startAutocomplete.addListener('place_changed', () => {
        const place = startAutocomplete.getPlace();
        if (place.geometry) {
          setLocation(place.formatted_address);
          setCoordinates({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });

      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry) {
          setDestination(place.formatted_address);
        }
      });
    };

    loadGoogleMapsScript();
  }, []);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });
        fetchAddressFromCoords(lat, lng);
      }, () => {
        alert('Unable to retrieve your location');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const fetchAddressFromCoords = (lat, lng) => {
    console.log(lat, lng);
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAmrXcjQ0-FGQFeKGwNzuVq24sY6uBeDQI`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          setLocation(data.results[0].formatted_address);
        } else {
          alert('Failed to get address');
        }
      }).catch(() => {
        alert('Failed to get address');
      });
  };

  const handleLocationSubmit = async () => {
    if (!session) {
      alert("You must be logged in to save locations.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/locations/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user.id,
          startAddress: {
            address: location,
            coordinates: coordinates
          },
          destinationAddress: {
            address: destination,
            coordinates: {} // Handle destination coordinates similarly if needed
          },
          date: date, // Sending date
          time: time, // Sending time
        }),
      });

      if (response.ok) {
        router.push('/');
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
    <div className="flex flex-col items-center w-5/12 max-w-xl mx-auto my-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <div className="relative w-full mb-4">
        <input
          type="text"
          id="location-input"
          placeholder="Enter your starting address here"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={fetchCurrentLocation}>
          <Image
            src='/assets/images/currlocation.svg'
            alt='Current Location'
            width={18}
            height={18}
            className='object-contain'
          />
        </div>
      </div>
      <div className="relative w-full mb-4">
        <input
          type="text"
          id="destination-input"
          placeholder="Enter your destination address here"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={destination}
          onChange={e => setDestination(e.target.value)}
        />
      </div>
      <div className="flex w-full gap-2 mb-2">
        <input
          type="date"
          id="travel-date"
          className="flex-grow p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          type="time"
          id="travel-time"
          className="flex-grow p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
      </div>
      <button
        onClick={handleLocationSubmit}
        disabled={submitting}
        className="w-full mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
      >
        {submitting ? 'Submitting...' : 'Add Trip'}
      </button>
    </div>
  );
};

export default AddressInput;