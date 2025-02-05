import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BellIcon,
  CalendarDaysIcon,
  PhotoIcon,
  MicrophoneIcon,
  FaceSmileIcon,
  PlusIcon,
  PaperAirplaneIcon,
  VideoCameraIcon,
  PhoneIcon,
  UserPlusIcon,
  EllipsisVerticalIcon,
  InboxArrowDownIcon,
  SunIcon,
  MoonIcon,
  ArrowUpOnSquareIcon,
  CogIcon,
} from "@heroicons/react/24/solid";
import Picker from "emoji-picker-react"; // Using emoji-picker-react


const chatURL = "https://chat-app-backend-2ph1.onrender.com/api";
// Socket connection
const socket = io("https://chat-app-backend-2ph1.onrender.com", {
  withCredentials: true,
});

const generateAvatar = (username) => {
  if (!username) return { initial: "?", backgroundColor: "#cccccc" }; // Fallback for invalid username
  const avatarKey = `userAvatarImage_${username}`;
  const existingAvatar = localStorage.getItem(avatarKey);

  if (existingAvatar) {
    return JSON.parse(existingAvatar);
  }

  const colors = [
    "#FFD700",
    "#FFA07A",
    "#87CEEB",
    "#98FB98",
    "#DDA0DD",
    "#FFB6C1",
    "#FFC0CB",
    "#20B2AA",
    "#FF6347",
    "#708090",
    "#9370DB",
    "#90EE90",
    "#B0E0E6",
  ];
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  const initial = username.charAt(0).toUpperCase();

  const avatarImage = { initial, backgroundColor };
  localStorage.setItem(avatarKey, JSON.stringify(avatarImage));
  return avatarImage;
};

const ChatApp = () => {
  const [user, setUser] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to show emoji picker
  const [emoji, setEmoji] = useState(""); // State to store the selected emoji
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Fetch available channels dynamically
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const userId = localStorage.getItem("userId"); // If you're going to use this userId
        const response = await fetch(
          `${chatURL}/auths/getAllUsers/${userId}` // Fixed template literal
        );

        if (!response.ok) {
          console.error("Error fetching channels:", response.statusText);
          return;
        }

        const data = await response.json(); // Parse JSON response
        setChannels(data); // Update channel list
      } catch (error) {
        console.error("Error fetching channels:", error.message);
      }
    };

    fetchChannels();
  }, []);

  // Fetch messages dynamically when a channel is selected
  useEffect(() => {
    if (selectedChannel) {
      const fetchMessages = async () => {
        const response = await fetch(
           `${chatURL}/messages/getmsg`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              from: localStorage.getItem("userId"),
              to: selectedChannel._id,
            }),
          }
        );
        const data = await response.json();
        setMessages(data);
      };

      fetchMessages();
    }
  }, [selectedChannel]);

  // Listen for new messages via Socket.io
  useEffect(() => {
    socket.on("msg-recieve", ({ msg }) => {
      setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
    });

    return () => socket.off("msg-recieve");
  }, []);

  // Filter channels based on search input
  const filteredChannels = channels.filter((channel) =>
    channel.username.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Send a new message
  const sendMessage = async () => {
    const from = localStorage.getItem("userId");
    const to = selectedChannel._id;

    if (!newMessage.trim() && !emoji) return;

    await fetch(`${chatURL}/messages/addmsg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, message: newMessage }),
    });

    socket.emit("send-msg", { to, msg: newMessage });
    setMessages((prev) => [...prev, { fromSelf: true, message: newMessage }]);
    setNewMessage("");
    setEmoji(""); // Reset after sending
  };

  // Handle emoji selection
  const handleEmojiclick = (emojiObject) => {
    console.log("Selected emoji object:", emojiObject);
    if (emojiObject && emojiObject.emoji) {
      setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
      setShowEmojiPicker(false); // Hide the emoji picker after selecting an emoji
    } else {
      console.error("Invalid emoji object:", emojiObject);
    }
  };

  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false); // Close the calendar modal after selecting a date
    console.log("Selected Date:", date); // For debugging
  }; // Call this when the user comes online or changes channel

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-br from-blue-300 to-gray-500 dark:from-gray-800 dark:to-gray-900 flex flex-col py-6 space-y-6 items-center">
        {/* Logged-in User Avatar */}
        <div
          className="h-16 w-16 rounded-full border-2 border-white shadow-lg mb-8 flex items-center justify-center text-white font-bold text-xl"
          style={{
            backgroundColor: generateAvatar(user.username).backgroundColor,
          }}
        >
          {generateAvatar(user.username).initial}
        </div>
        <div className="space-y-6">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <UserGroupIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <BellIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <CalendarDaysIcon
            className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer"
            onClick={toggleCalendar}
          />
          <InboxArrowDownIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <ArrowUpOnSquareIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
        </div>
        <div className="flex-1"></div>
        <button
          className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer"
          onClick={toggleDarkMode}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer">
          <CogIcon />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Channel List */}
        <section className="w-1/4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-700 p-4">
          <div className="border-b border-gray-400 dark:border-gray-600 pb-4">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
              Chats
            </h2>
            <input
              type="text"
              placeholder="Search channels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-2 w-full px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded focus:outline-none"
            />
          </div>
          <ul className="mt-4 space-y-2">
            {filteredChannels.map((channel) => (
              <li
                key={channel._id}
                onClick={() => setSelectedChannel(channel)}
                className={`cursor-pointer p-2 rounded flex items-center shadow-sm ${
                  selectedChannel?._id === channel._id
                    ? "bg-blue-400 dark:bg-gray-600"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: generateAvatar(channel.username)
                      .backgroundColor,
                  }}
                >
                  {generateAvatar(channel.username).initial}
                </div>
                <span>{channel.username}</span>
              </li>
            ))}
          </ul>
          <button className="w-full mt-96 justify-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Invite
          </button>
        </section>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <header className="px-6 py-4 flex items-center justify-between border-b border-gray-400 dark:border-gray-600">
            {selectedChannel ? (
              <div className="flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: generateAvatar(selectedChannel.username)
                      .backgroundColor,
                  }}
                >
                  {generateAvatar(selectedChannel.username).initial}
                </div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedChannel.username}
                </h1>
              </div>
            ) : (
              <h1 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                Select a Channel
              </h1>
            )}

            {selectedChannel && (
              <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                  <PhoneIcon className="h-6 w-6 text-blue-500 cursor-pointer"/>
                </button>
                <button className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                  <VideoCameraIcon className="h-6 w-6 text-blue-500 cursor-pointer"/>
                </button>
                <button className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                  <UserPlusIcon className="h-6 w-6 text-blue-500 cursor-pointer"/>
                </button>
                <button className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                  <EllipsisVerticalIcon className="h-6 w-6 text-blue-500 cursor-pointer"/>
                </button>
              </div>
            )}
          </header>
          {isCalendarOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-1/3 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Select a Date
                  </h3>
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="react-calendar"
                  />
                  <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={toggleCalendar}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}


          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedChannel ? (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.fromSelf ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-md max-w-xs ${
                      msg.fromSelf
                        ? "bg-blue-400 text-white"
                        : "bg-white dark:bg-gray-700"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No messages available.
              </p>
            )}
          </div>

          {/* Input Section */}
          {selectedChannel && (
            <footer className="p-4 bg-gray-100 dark:bg-gray-700 border-t border-gray-400 dark:border-gray-600">
              <div className="flex items-center space-x-3 text-gray-400">
                <PhotoIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <MicrophoneIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <FaceSmileIcon
                  className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={handleEmojiPickerHideShow}
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-10">
                    <Picker onEmojiClick={handleEmojiclick} />
                  </div>
                )}
                <PlusIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>

              <div className="flex items-center mt-2 space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-full focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 px-4 py-2 text-white rounded-full hover:bg-blue-500"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
