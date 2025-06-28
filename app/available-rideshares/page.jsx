"use client";

import { useEffect, useState } from 'react';
import PromptCard from '@components/PromptCard';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CircularProgress from '@mui/material/CircularProgress'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Page = () => {
    const [drivercarpoolData, setDriverCarpoolData] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(null); 
    const [selectedTime, setSelectedTime] = useState('');
    const [roleFilter, setRoleFilter] = useState(''); 
    const [searchSubmitted, setSearchSubmitted] = useState(false); 
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        fetchCarpoolData();

        // Load Google Maps script and initialize autocomplete
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

    const fetchCarpoolData = async () => {
        setLoading(true); 
        const response = await fetch(`/api/findcarpools/drivers/${session?.user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          data.sort((a, b) => {
            const dateDiff = new Date(a.date) - new Date(b.date);
            if (dateDiff === 0) { 
              return a.time.localeCompare(b.time);
            }
            return dateDiff;
          });
          setDriverCarpoolData(data);
        } else {
          console.error('Failed to fetch carpool data');
        }
        setLoading(false); 
    };


    const initAutocomplete = () => {
        if (!window.google) return;

        const input = document.getElementById('location-input');
        if (input) {
            const autocomplete = new window.google.maps.places.Autocomplete(input, { types: ['geocode'] });
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    setSearchQuery(place.formatted_address);
                }
            });
        }
    };

    const filteredData = searchSubmitted 
        ? drivercarpoolData.filter(post => {
          
          //convert post date and search date to same timezone
          const postdate = new Date(post.date);
          postdate.setMinutes(postdate.getMinutes() + postdate.getTimezoneOffset());
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const postdatestring = postdate.toLocaleDateString(undefined, options);

          const searchdate = new Date(selectedDate);
          searchdate.setMinutes(searchdate.getMinutes() + searchdate.getTimezoneOffset());
          const searchdatestring = searchdate.toLocaleDateString(undefined, options);

          return (
            (!searchQuery || post.destinationAddress.address.includes(searchQuery)) && 
            (!selectedDate || postdatestring === searchdatestring) // Check if dates match or if no date filter is applied
        );
}) 
        : drivercarpoolData;

    const handleSearchSubmit = () => {
        setSearchSubmitted(true);
    };

    return (
      <div className="flex flex-col w-full max-w-xl mx-auto mb-2 p-4 rounded-lg text-white pt-32">
        <h1 className='text-4xl md:text-5xl font-bold text-center'>
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600'>Find Rideshares</span>
        </h1>
        <p className="text-lg text-center mt-4">
          Explore a variety of ride requests from our community. Find a match for your route and connect instantly!
        </p>
    

        {/* Search Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full max-w-2xl mx-auto">
          {/* Location input — stays full width */}
          <input
            type="text"
            id="location-input"
            placeholder="Search by destination"
            className="w-full p-3 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-gray-700 placeholder-gray-400 text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          {/* Date and Button — inline even on mobile */}
          <div className="flex w-full gap-4">
            <div className="w-1/2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="w-full p-3 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-gray-700 placeholder-gray-400 text-white"
                placeholderText="Select date"
                minDate={new Date()}
              />
            </div>

            <button
              onClick={handleSearchSubmit}
              className="w-1/2 px-6 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <CircularProgress sx={{ color: 'white' }} /> 
          </div>
        ) : (
          <div className="prompt_layout grid grid-cols-1 mx-auto w-full" style={{marginBottom: '0px'}}> 
            {filteredData.length > 0 ? (
              filteredData.map((post) => (
                <PromptCard
                  key={post._id}
                  post={post}
                  handleEdit={() => handleEdit && handleEdit(post)}
                  handleDelete={() => handleDelete && handleDelete(post)}
                />
              ))
            ) : (
              <div className="text-center p-4 rounded-md text-white text-xl text-gray-300">
          Currently, there are no rideshares for your search criteria.
        </div>
            )}
          </div>
        )}

        <p className="text-lg font-bold text-center mt-4">
          Can't find what you're looking for?
        </p>
        <button
          onClick={() => {
              router.push("/create-prompt");
          }}
          className=" text-blue-600 hover:text-blue-800 underline font-bold py-2 px-4 transition duration-300 ease-in-out">
          Create Rideshare Request
        </button>
      </div>
    )
}

export default Page;
