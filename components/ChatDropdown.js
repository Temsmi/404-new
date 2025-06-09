'use client';
import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const menuItems = ["Mute notifications", "Close chat", "Clear chat"];

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!open && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right + window.scrollX - 224, // 224 = width of dropdown (e.g., 14rem)
      });
    }
    setOpen(!open);
  };

  return (
    <>
      <img
        ref={iconRef}
        src="/fonts/feather-icons/icons/moreV.svg"
        alt="More"
        className="w-6 h-6 cursor-pointer"
        onClick={toggleDropdown}
      />

      {open &&
        ReactDOM.createPortal(
          <div
            className="absolute w-56 bg-white border border-gray-300 rounded-md shadow-lg z-[9999]"
            style={{ top: position.top, left: position.left, position: 'absolute' }}
          >
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                onClick={() => setOpen(false)}
              >
                {item}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}