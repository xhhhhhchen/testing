import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UserPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  name: string;
  email: string;
  location?: string;
  location_name?: string; 
  tank_id?: string;
  created_at: string;
}


const UserPopover: React.FC<UserPopoverProps> = ({ isOpen, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-64 bg-[#00421D]  shadow-lg rounded-xl p-4 z-50" 
        >
          <h3 className="text-xl mt-1 mb-2 text-yellow-300 font-semibold">{user.name}</h3>
          <p className="text-sm text-white">{user.email}</p>
          <hr className="my-2 text-green-700" />
          <div className="text-sm space-y-1 text-white">
            <div>
              <span className="font-medium text-white">Location:</span>{" "}
              {user.location_name || "N/A"}
            </div>
            <div>
              <span className="font-medium text-white">Tank ID:</span>{" "}
              {user.tank_id || "None"}
            </div>
            <div>
              <span className="font-medium text-white">Joined:</span>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserPopover;
