"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PromptCard from "./PromptCard";
import { motion, AnimatePresence } from 'framer-motion';

const AddressInput = () => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Step state to control field visibility
  const [startFromCampus, setStartFromCampus] = useState(null);
  const [endAtCampus, setEndAtCampus] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const campuses = ['UCLA', 'UCSD', 'UCSC', 'UCSF']; // Example campuses
  const [campusStart, setCampusStart] = useState('');
  const [campusEnd, setCampusEnd] = useState('');
  const [carpoolData, setCarpoolData] = useState([]);
  const [progress, setProgress] = useState(1);

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
        }
      });
    }
  };

  useEffect(() => {
    initAutocomplete();
  }, [startFromCampus, endAtCampus]);

  const fetchAddressFromCoords = (lat, lng) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_UNRESTRICTED}`)
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
          userName: "username",
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
        const fetchResponse = await fetch(`/api/findcarpools/${location}/${destination}/${date}/${time}/carpools2`);
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

  const getProgressBarWidth = () => {
    switch (progress) {
      case 1:
        return '2%';
      case 2:
        return '20%';
      case 3:
        return '40%';
      case 4:
        return '60%';
      case 5:
        return '80%';
      case 6:
        return '90%';
      case 7:
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto my-4 p-4 rounded-lg font-inter">
      <div className="relative w-full h-2 bg-gray-200 rounded mb-4">
        <div className="absolute h-2 bg-blue-500 rounded" style={{ width: getProgressBarWidth() }}></div>
      </div>
      <div className="items-center">
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
            <label className="block mb-2">Are you starting from campus?</label>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => {
                  setStartFromCampus(true);
                  setProgress(2);
                }}
                className={`px-4 py-2 rounded-lg ${startFromCampus === true ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setStartFromCampus(false);
                  setProgress(2);
                }}
                className={`px-4 py-2 rounded-lg ${startFromCampus === false ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                No
              </button>
            </div>
            {startFromCampus !== null && (
              <>
                {startFromCampus ? (
                  <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full mb-4"
                  >
                  <div className="relative w-full mb-4">
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                      value={campusStart}
                      onChange={e => {
                        setCampusStart(e.target.value);
                        setLocation(e.target.value);
                      }}
                    >
                      <option value="">Select a Campus</option>
                      {campuses.map(campus => (
                        <option key={campus} value={campus}>{campus}</option>
                      ))}
                    </select>
                  </div>
                  </motion.div>
                ) : (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full mb-4"
                    >
                  <div className="relative w-full mb-4">
                    <input
                      type="text"
                      id="location-input"
                      placeholder="Start Address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100 placeholder-black-800"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    />
                  </div>
                  </motion.div>
                )}
                
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setStep(3);
                      setProgress(3);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
                
              </>
            )}
          </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
          key="step3"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="relative w-full mb-4 text-black"
          >
          <div className="relative w-full mb-4 text-black">
            <label className="block mb-2">Are you ending at campus?</label>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => {
                  setEndAtCampus(true);
                  setProgress(4);
                }}
                className={`px-4 py-2 rounded-lg ${endAtCampus === true ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setEndAtCampus(false);
                  setProgress(4);
                }}
                className={`px-4 py-2 rounded-lg ${endAtCampus === false ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                No
              </button>
            </div>
            {endAtCampus !== null && (
              <>
                {endAtCampus ? (
                  <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full mb-4"
                  >
                  <div className="relative w-full mb-4">
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                      value={campusEnd}
                      onChange={e => {
                        setCampusEnd(e.target.value);
                        setDestination(e.target.value);
                      }}
                    >
                      <option value="">Select a Campus</option>
                      {campuses.map(campus => (
                        <option key={campus} value={campus}>{campus}</option>
                      ))}
                    </select>
                  </div>
                  </motion.div>
                ) : (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full mb-4"
                    >
                  <div className="relative w-full mb-4">
                    <input
                      type="text"
                      id="destination-input"
                      placeholder="End Address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100 placeholder-black-800"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                    />
                  </div>
                  </motion.div>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setStep(1);
                      setProgress(3);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setStep(5);
                      setProgress(5);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
                
              </>
            )}
          </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
          key="step5"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="relative w-full mb-4"
          >
          <div className="relative w-full mb-4">
            <div className="flex w-full gap-2 mb-4">
              <input
                type="date"
                id="travel-date"
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                value={date}
                onChange={e => {
                  setDate(e.target.value);
                  setProgress(6);
                }}
              />
              <input
                type="time"
                id="travel-time"
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                value={time}
                onChange={e => {
                  setTime(e.target.value)
                  setProgress(7);
                }}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setStep(3);
                  setProgress(5);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Back
              </button>
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
      <div className='mt-10 prompt_layout flex flex-col gap-4'>
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
