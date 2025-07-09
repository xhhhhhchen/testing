import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";

interface UserPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserPopover: React.FC<UserPopoverProps> = ({ isOpen, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [botConnectionLink, setBotConnectionLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Safely parse the user object from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Extract location and tanks directly from the user object
  const location = user?.location || null;
  const tanks = user?.tanks || [];

  useEffect(() => {
    checkTelegramConnection();
  }, [user]);

  const checkTelegramConnection = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Replace with your actual Supabase call to check Telegram connection status
      // const { data, error } = await supabase
      //   .from('user_telegram_connections')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .single();
      
      // For demo purposes, we'll use a mock
      setTelegramConnected(false); // Change this based on your actual data
      
      // Generate a unique connection link for the user
      const uniqueToken = generateUniqueToken(user.id);
      const botUsername = "YourCompostBot"; // Replace with your bot's username
      setBotConnectionLink(`https://t.me/${botUsername}?start=${uniqueToken}`);
    } catch (error) {
      console.error("Error checking Telegram connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateUniqueToken = (userId: string) => {
    // In a real implementation, this should call your backend to generate and store a token
    return `token_${userId}_${Date.now()}`;
  };

  const handleConnectTelegram = () => {
    if (botConnectionLink) {
      window.open(botConnectionLink, "_blank");
    }
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

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
          
          {/* Telegram Connection Section */}
          <div className="mb-3 p-3 bg-green-800/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="#0088cc">
                  <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"/>
                </svg>
                <span className="font-medium text-white">Telegram Notifications</span>
              </div>
              {isLoading ? (
                <div className="animate-pulse h-4 w-20 bg-green-700/50 rounded"></div>
              ) : telegramConnected ? (
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>
                  Connected
                </span>
              ) : (
                <button 
                  onClick={toggleQR}
                  className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center transition-colors"
                >
                  {showQR ? "Hide QR" : "Connect"}
                </button>
              )}
            </div>

            {showQR && !telegramConnected && (
              <div className="mt-3 flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg mb-2">
                  <QRCode 
                    value={botConnectionLink}
                    size={128}
                    level="H"
                    fgColor="#00421D"
                    bgColor="#ffffff"
                  />
                </div>
                <p className="text-xs text-green-200 mb-2 text-center">
                  Scan this QR code with your phone's camera to connect
                </p>
                <button
                  onClick={handleConnectTelegram}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full flex items-center transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                  </svg>
                  Or open in Telegram
                </button>
              </div>
            )}

            {!showQR && !telegramConnected && !isLoading && (
              <p className="text-xs text-green-200">
                Connect to receive tank notifications directly in Telegram
              </p>
            )}
          </div>

          <div className="text-sm space-y-1 text-white">
            <div>
              <span className="font-medium text-yellow-200">Location:</span>{" "}
              {location?.location_name || "N/A"}
            </div>

            {/* Tanks information */}
            <div className="mt-2">
              <span className="font-medium text-yellow-200"> 
                Tanks owned: 
                <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                  {tanks.length}
                </span>
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