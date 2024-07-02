"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PromptCard from "./PromptCard";
import { motion, AnimatePresence } from 'framer-motion';

const AddressInput = () => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [destinationCoordinates, setDestinationCoordinates] = useState({ lat: null, lng: null });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { data: session } = useSession();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [carpoolData, setCarpoolData] = useState([]);

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

    loadGoogleMapsScript();
  }, []);

  const initAutocomplete = () => {
    if (!window.google) return;

    const startInput = document.getElementById('location-input');
    const destinationInput = document.getElementById('destination-input');

    if (startInput) {
      const startAutocomplete = new window.google.maps.places.Autocomplete(startInput, { types: ['geocode'] });
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
    }

    if (destinationInput) {
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInput, { types: ['geocode'] });
      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry) {
          setDestination(place.formatted_address);
          setDestinationCoordinates({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });
    }
  };

  useEffect(() => {
    initAutocomplete();
  }, []);

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
          userName: "username",
          startAddress: {
            address: location,
            coordinates: coordinates
          },
          destinationAddress: {
            address: destination,
            coordinates: destinationCoordinates
          },
          date: date,
          time: time,
        }),
      });

      if (response.ok) {
        const fetchResponse = await fetch(`/api/findcarpools`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location,
            destination,
            date,
            time,
            userId: session.user.id,
            coordinates,
            destinationCoordinates
          }),
        });
        const carpooldata = await fetchResponse.json();
        console.log(carpooldata);
        setCarpoolData(carpooldata);
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
    <div className="flex flex-col w-full max-w-xl mx-auto my-4 p-4 rounded-lg font-inter">
      <div className="items-center mb-8">
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="relative w-full mb-4 text-black"
            >
              <div className="relative w-full mb-4 text-black">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full mb-4"
                >
                  <div className="relative w-full mb-4">
                    <label htmlFor="location-input" className="block text-sm font-medium text-gray-700">Start Address</label>
                    <input
                      type="text"
                      id="location-input"
                      placeholder="Enter your starting address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100 placeholder-gray-800"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="relative w-full mb-4 text-black"
            >
              <div className="relative w-full mb-4 text-black">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full mb-4"
                >
                  <div className="relative w-full mb-4">
                    <label htmlFor="destination-input" className="block text-sm font-medium text-gray-700">End Address</label>
                    <input
                      type="text"
                      id="destination-input"
                      placeholder="Enter your destination address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100 placeholder-gray-800"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="relative w-full mb-4"
            >
              <div className="relative w-full mb-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex flex-col flex-1">
                    <label htmlFor="travel-date" className="block text-sm font-medium text-gray-700">Travel Date</label>
                    <input
                      type="date"
                      id="travel-date"
                      className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="travel-time" className="block text-sm font-medium text-gray-700">Travel Time</label>
                    <input
                      type="time"
                      id="travel-time"
                      className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleLocationSubmit}
                    disabled={submitting}
                    className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    {submitting ? 'Submitting...' : 'Add Trip'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {carpoolData.length > 0 && (
        <div className="mt-10 w-full">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Search Results</h2>
          <div className="prompt_layout flex flex-col gap-4 w-full">
            {carpoolData.map((post) => (
              <PromptCard
                key={post._id}
                post={post}
                handleEdit={() => handleEdit && handleEdit(post)}
                handleDelete={() => handleDelete && handleDelete(post)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
