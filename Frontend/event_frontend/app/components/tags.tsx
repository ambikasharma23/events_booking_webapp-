import React, { useState } from 'react';

const Tags: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // State to store selected option
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  const handleOptionClick = async (option: string) => {
    setSelectedOption(option); // Set the selected option
    setShowDropdown(false); // Close the dropdown after selection

    // Check if the clicked option is "Cost: low to high"
    if (option === 'Cost: low to high') {
      try {
        // Perform the fetch operation
        const response = await fetch('http://localhost:3001/Eventcost?sortasc');
        // Handle response (optional)
        console.log('Fetch response:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (optional)
      }
    }
  };

  const resetSelection = () => {
    setSelectedOption(null); // Reset selected option
  };

  return (
    <div className="relative">
      <button
        id="dropdownHoverButton"
        data-dropdown-toggle="dropdownHover"
        data-dropdown-trigger="hover"
        onClick={toggleDropdown}
        className={`text-white ${selectedOption ? 'bg-yellow-500' : 'bg-gray-400 hover:bg-gray-500'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800`}
        type="button"
      >
        {selectedOption || 'Sort'}{' '}
        {selectedOption && (
          <button
            className="ml-2 text-gray-500 hover:text-gray-600 focus:outline-none"
            onClick={resetSelection}
            aria-label="Clear selection"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {!selectedOption && (
          <svg
            className="w-2.5 h-2.5 ml-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        )}
      </button>

      {/* Dropdown menu */}
      {showDropdown && (
        <div
          id="dropdownHover"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
            {/* <li>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none"
                onClick={() => handleOptionClick('Popularity')}
              >
                Popularity
              </button>
            </li> */}
            <li>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none"
                onClick={() => handleOptionClick('Cost: low to high')}
              >
                Cost: low to high
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none"
                onClick={() => handleOptionClick('Cost: high to low')}
              >
                Cost: high to low
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none"
                onClick={() => handleOptionClick('Distance: low to high')}
              >
                Distance: low to high
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:outline-none"
                onClick={() => handleOptionClick('Date')}
              >
                Date
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Tags;
