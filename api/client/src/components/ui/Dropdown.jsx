// // client/src/components/ui/Dropdown.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { ChevronDownIcon } from "@heroicons/react/24/solid"; // Using heroicons

// function Dropdown({ options, selected, onSelect, label, style }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownRef]);

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   const handleSelect = (option) => {
//     onSelect(option);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative inline-block text-left w-full" ref={dropdownRef}>
//       <div>
//         <button
//           type="button"
//           className={`inline-flex justify-between w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${style}`}
//           onClick={toggleDropdown}
//           aria-haspopup="true"
//           aria-expanded={isOpen}
//         >
//           {selected
//             ? typeof selected == "string"
//               ? selected
//               : selected.name
//             : label}
//           <ChevronDownIcon className="h-5 w-5 ml-2" />
//         </button>
//       </div>

//       {isOpen && (
//         <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
//           <div className="py-1">
//             {options.map((option) => (
//               <button
//                 key={option.id}
//                 onClick={() => handleSelect(option)}
//                 className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
//               >
//                 {typeof option == "string" ? option : option.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dropdown;
// //

    // client/src/components/ui/Dropdown.jsx
 import React, { useState, useRef, useEffect } from 'react';
 import { ChevronDownIcon } from '@heroicons/react/24/solid'; // Using heroicons

function Dropdown({ options, selected, onSelect, label, style }) {
      const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

   useEffect(() => {
       function handleClickOutside(event) {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
         document.removeEventListener('mousedown', handleClickOutside);
        };
     }, [dropdownRef]);


    const toggleDropdown = () => setIsOpen(!isOpen);

      const handleSelect = (option) => {
          onSelect(option);
        setIsOpen(false);
      };

      return (
       <div className="relative inline-block text-left w-full" ref={dropdownRef}>
           <div>
               <button
                   type="button"
                   className={`inline-flex justify-between w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${style}`}
                   onClick={toggleDropdown}
                  aria-haspopup="true"
                    aria-expanded={isOpen}
                 >
                  {selected  ? ( typeof selected == 'string' ? selected : selected.name) : label}
                    <ChevronDownIcon className="h-5 w-5 ml-2" />
               </button>
          </div>

           {isOpen && (
             <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                   <div className="py-1">
                       {options && options.map((option) => (
                            <button
                                key={option.id}
                               onClick={() => handleSelect(option)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                             >
                             {typeof option == 'string' ? option : option.name}
                              </button>
                           ))}
                  </div>
             </div>
          )}
      </div>
   );
  }

   export default Dropdown;