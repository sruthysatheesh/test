import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    recipient: "",
    message: "",
    type: "email",
  });

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    message: "",
    type: "text",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleChange = (e) => {
    setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
  };

  const handleSendNotification = async () => {
    if (!newNotification.recipient || !newNotification.message) {
      alert("Recipient and message are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/notifications/send", newNotification);
      alert("Notification sent successfully!");
      fetchNotifications();
      setNewNotification({ recipient: "", message: "", type: "email" });
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  return (
    <div>
      <h2>📢 Notifications & Alerts</h2>

      {/* Send Notification */}
      <div>
        <h3>Send Notification</h3>
        <input
          type="text"
          name="recipient"
          placeholder="Enter Email or Phone Number"
          value={newNotification.recipient}
          onChange={handleChange}
        />
        <input
          type="text"
          name="message"
          placeholder="Enter Message"
          value={newMessage.recipient}
          onChange={handleChange}
        />
        <select name="type" value={newNotification.type} onChange={handleChange}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <button onClick={handleSendNotification}>Send</button>
      </div>

      {/* List of Notifications */}
      <div>
        <h3>Recent Notifications</h3>
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>
              {notif.recipient} - {notif.message} ({notif.type}) - {notif.sent_at}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
