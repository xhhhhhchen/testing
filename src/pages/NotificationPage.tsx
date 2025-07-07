// HI JIALI PLEASE HELP ME ADD 
// - SORT BY FILTER (BY TIME, COMPOST TANK, PLANT) BUT UH PLANT BACKEND HAVENT FINISH YET IM UPDATE YOU AGAIN
// - TYPE FILTER (IF IT'S COMPOTST OR PLANT RELATED NOTIF)
// - ADD THE ICONS FOR EACH NOTIFICATION 
// - UI DESIGN IN GENERAL TO MAKE IT LOOK CONSISTENT WITH THE REST OF THE WEBSITE

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Notification = {
  notification_id: number;
  timestamp: string;
  type: string;
  category: string;
  header: string;
  message: string;
  location_id: number;
};

function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated", userError);
        setLoading(false);
        return;
      }

      const { data: userData, error: fetchUserError } = await supabase
        .from("users")
        .select("location_id")
        .eq("auth_uid", user.id)
        .single();

      if (fetchUserError || !userData) {
        console.error("Error fetching user location", fetchUserError);
        setLoading(false);
        return;
      }

      const locationId = userData.location_id;

      const { data: notificationsData, error: fetchNotificationsError } =
        await supabase
          .from("notifications")
          .select("*")
          .eq("location_id", locationId)
          .order("timestamp", { ascending: false });

      if (fetchNotificationsError) {
        console.error("Error fetching notifications", fetchNotificationsError);
        setLoading(false);
        return;
      }

      setNotifications(notificationsData || []);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    if (type.toLowerCase() === "plant") return "🪴";
    if (type.toLowerCase() === "compost") return "🪱";
    return "🔔";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300 shadow-sm"
              >
                {/* Left section: Icon + Text */}
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getIcon(n.type)}</div>
                  <div>
                    <div className="font-bold text-md">{n.header}</div>
                    <div className="text-sm text-gray-600">{n.message}</div>
                  </div>
                </div>

                {/* Right section: Label + Time */}
                <div className="flex flex-col items-end text-right gap-1">
                  <div className="text-xs px-3 py-1 rounded-full border text-blue-600 border-blue-300">
                    {n.category}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(n.timestamp).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
