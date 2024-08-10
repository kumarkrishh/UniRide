"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PromptCard from "./PromptCard";
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const AddressInput = () => {
  // State variables to manage inputs, coordinates, form submission, etc.
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
  const [filterOption, setFilterOption] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [role, setRole] = useState('driver');
  const [tripSubmitted, setTripSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const currentDateTime = new Date();
  const currentTime = new Date().toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  // Load Google Maps script and initialize autocomplete
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

  // Initialize Google Maps Autocomplete for address inputs
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

  // Re-initialize autocomplete on component update
  useEffect(() => {
    initAutocomplete();
  }, []);

  // Handle role change between driver and rider
  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  // Handle form submission
  const handleLocationSubmit = async () => {
    if (!session) {
      alert("You must be logged in to save locations.");
      return;
    }
    if (!location || !destination || !date || !time || !coordinates.lat || !destinationCoordinates.lat) {
      setErrorMessage('Please fill out all fields before submitting.');
      return;
    }
    setErrorMessage('');
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
          rideType: role,
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
        setTripSubmitted(true);
        setShowSuccessMessage(true);
        //setTimeout(() => setTripSubmitted(false), 7000);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        // Clear form fields
        setLocation('');
        setDestination('');
        setDate(null);
        setTime('');
        
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
    <div className="flex flex-col w-full max-w-xl mx-auto mb-2 p-4 rounded-lg text-white">
      
      {errorMessage && (
  <div className={`mb-4 text-red-600 text-lg font-semibold transition-opacity duration-1000 ease-in-out ${!errorMessage ? 'opacity-0 max-h-0' : 'opacity-100'}`}>
    {errorMessage}
  </div>
)}



      <div className="items-center mb-8">
        <AnimatePresence>
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="relative w-full mb-4"
          >
            <div className="relative w-full mb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full mb-4"
              >
                <div className="relative w-full mb-6">
                  <label htmlFor="location-input" className="block text-m font-medium text-gray-300 mb-2">Start Address</label>
                  <input
                    type="text"
                    id="location-input"
                    placeholder="Enter your starting address"
                    className="w-full p-3 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 placeholder-gray-400 text-white"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="relative w-full mb-4"
          >
            <div className="relative w-full mb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full mb-4"
              >
                <div className="relative w-full">
                  <label htmlFor="destination-input" className="block text-m font-medium text-gray-300 mb-2">End Address</label>
                  <input
                    type="text"
                    id="destination-input"
                    placeholder="Enter your destination address"
                    className="w-full p-3 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 placeholder-gray-400 text-white"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="relative w-full mb-4"
          >
            <div className="flex gap-4 mb-6">
            <div className="flex flex-col flex-1">
                <label htmlFor="travel-date" className="block text-sm font-medium text-gray-300 mb-2">Travel Date</label>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  className=" p-3 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white w-full"
                  placeholderText="Select a date"
                  id="travel-date"
                  minDate={new Date()}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="travel-time" className="mt-0.5block text-sm font-medium text-gray-300 mb-2">Travel Time</label>
                <input
                  type="time"
                  id="travel-time"
                  className="p-2.5 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                  value={time || "--:--"} // Use "--:--" as the default display value
                  onChange={e => setTime(e.target.value)}
                  onFocus={e => e.target.showPicker()} // Show picker when the input gains focus
                />
              </div>
            </div>
            <style jsx>{`
              /* Hide the native time picker icon for WebKit browsers (Chrome, Safari) */
              input[type="time"]::-webkit-calendar-picker-indicator {
                display: none;
                -webkit-appearance: none;
              }

              /* Hide the native time picker icon for Firefox */
              input[type="time"]::-moz-focus-inner {
                border: 0;
              }

              /* Hide the native time picker icon for Internet Explorer */
              input[type="time"]::-ms-clear {
                display: none;
              }
            `}
            </style>
          </motion.div>

          {step === 1 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="relative w-full mb-4"
            >
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handleLocationSubmit}
                  disabled={submitting}
                  className="mt-2 px-5 py-3 font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 disabled:bg-gray-400"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              <style jsx>{`
                .role-buttons {
                  display: flex;
                  gap: 10px;
                  margin-right: 20px; /* Ensures spacing between buttons and the submit button */
                }
                .role-button, .submit-button {
                  padding: 10px 20px;
                  background-color: #4A5568;
                  color: #E2E8F0;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 16px;
                  transition: all 0.3s ease;
                  outline: none;
                }
                .role-button.active {
                  background-color: #3182CE;
                  color: #FFFFFF;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                .submit-button {
                  background-color: #2B6CB0; /* Distinct color for submit button */
                  color: #FFFFFF;
                  font-weight: bold;
                  hover: background-color: #3182CE;
                }
              `} </style>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
  {showSuccessMessage && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-center mt-6"
    >
      <div className="text-2xl font-semibold text-gray-200 shadow-lg transform transition-all duration-300 ease-in-out">
        <span className="block">🎉 Trip added successfully! 🎉</span>
      </div>
    </motion.div>
  )}
</AnimatePresence>





      {/* 
        {carpoolData.length > 0 && (
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-300">Search Results</h2>
          </div>
        )}
      */}

      <div className="prompt_layout grid grid-cols-1 mx-auto w-full">
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

    
  );
};

export default AddressInput;
