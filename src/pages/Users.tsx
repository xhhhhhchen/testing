import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UserPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserPopover: React.FC<UserPopoverProps> = ({ isOpen, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

// Safely parse the user object from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Extract location and tanks directly from the user object
    const location = user?.location || null;
    const tanks = user?.tanks || [];

  console.log("user:", user);
  console.log("name:", user?.name);
  console.log("created_at:", user?.created_at);

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

          className="absolute right-0 mt-2 max-w-sm w-auto bg-[#00421D] shadow-lg rounded-xl p-4 z-[9999]"
        >
          <h3 className="text-xl mt-1 mb-2 text-yellow-300 font-semibold">{user.name || "Unknown"}</h3>
          <p className="text-sm text-white">{user.email || "No email"}</p>
          <hr className="my-2 text-green-700" />
          <div className="text-sm space-y-1 text-white">
            <div>
              <span className="font-medium text-yellow-200">Location:</span>{" "}
              {location?.location_name || "N/A"}
            </div>

            {/* Tanks information */}

            <div className="mt-2">
             <span className="font-medium text-yellow-200"> Tanks owned: 
                <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">{tanks.length}</span>
            </span>

              {tanks.length > 0 ? (
                <div className="mt-1 space-y-2">
                  {tanks.map((tank: any) => (
                    <div 
                      key={tank.id} 
                      className="p-2 bg-green-800/50 rounded-lg hover:bg-green-700/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2 flex-shrink-0"></div>
                        <span className="text-green-100 truncate">{tank.name}</span>
                      </div>
                      {tank.description && (
                      <>
                        <div className="ml-4 h-px bg-green-700/50 my-1"></div>
                        <div className="ml-4 text-xs text-green-300 truncate">
                          {tank.description}
                        </div>
                      </>
                    )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-green-300 italic mt-1">No tanks assigned</div>
              )}
            </div>


            <div className="mt-2">
              <span className="font-medium text-yellow-200">Joined:</span>{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "Unknown"}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserPopover;
