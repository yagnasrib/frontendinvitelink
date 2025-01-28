import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BellIcon,
  CalendarDaysIcon,
  InboxArrowDownIcon,
  ArrowUpOnSquareIcon,
  SunIcon,
  MoonIcon,
  CogIcon,
  PhotoIcon,
  MicrophoneIcon,
  FaceSmileIcon,
  PlusIcon,
  PaperAirplaneIcon,
  VideoCameraIcon,
  PhoneIcon,
  UserPlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";

const socket = io("http://localhost:5000", {
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
    "#FFD700", "#FFA07A", "#87CEEB", "#98FB98", "#DDA0DD", "#FFB6C1", "#FFC0CB",
    "#20B2AA", "#FF6347", "#708090", "#9370DB", "#90EE90", "#B0E0E6",
  ];
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  const initial = username.charAt(0).toUpperCase();

  const avatarImage = { initial, backgroundColor };
  localStorage.setItem(avatarKey, JSON.stringify(avatarImage));
  console.log("Generated Avatar:", avatarImage);
  return avatarImage;
};

const ChatApp = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Replace with your logic to get the user's ID

    if (userId) {
      // Emit the add-user event after establishing a connection
      socket.emit("add-user", userId);
      console.log(`User ID ${userId} added to online users`);
    } else {
      console.warn("User ID not found in localStorage");
    }

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.log("No user ID found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/auths/getAllUsers/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        const avatarImage = generateAvatar(data.username);
        setUser({ ...data, avatarImage });
        console.log("Fetched user data:", data);
        console.log("Generated avatar for logged-in user:", avatarImage);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchChannels = async (query = "") => {
    try {
      const response = await fetch("http://localhost:5000/api/auths/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        console.error("Error fetching channels:", response.statusText);
        return;
      }

      const data = await response.json();
      const channelsWithAvatars = data.map((channel) => ({
        ...channel,
        avatarImage: generateAvatar(channel.username),
      }));
      setChannels(channelsWithAvatars);
    } catch (error) {
      console.error("Error fetching channels:", error.message);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    socket.on("msg-recieve", ({ msg, from, isChatRequest }) => {
      console.log("New message received:", { msg, from, isChatRequest }); // Debugging log
  
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          fromSelf: from === localStorage.getItem("userId"), // Distinguish sender
          message: msg,
          isChatRequest, // Include chat request information
        },
      ]);
    });
  
    return () => {
      socket.off("msg-recieve");
    };
  }, []);
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchChannels(query);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const sendMessage = async () => {
    const from = localStorage.getItem("userId");
    const to = selectedChannel._id;
  
    if (!from || !to) {
      alert("Invalid sender or recipient.");
      return;
    }
  
    if (!newMessage.trim()) {
      return;
    }
  
    const isChatRequest = !messages.some((msg) => msg.isAccepted);
  
    const messagePayload = {
      from,
      to,
      message: newMessage,
      isChatRequest,
    };
  
    try {
      await fetch("http://localhost:5000/api/messages/addmsg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });
  
      if (isChatRequest) {
        socket.emit("chat-request", { from, to, message: newMessage });
      } else {
        socket.emit("send-msg", { to, msg: newMessage, isChatRequest });
      }
  
      setMessages((prev) => [...prev, { fromSelf: true, message: newMessage }]);
      setNewMessage(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleRequest = async (requestId, action) => {
    try {
      const response = await fetch("http://localhost:5000/api/auths/handleRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }), // Example payload
      });
      if (!response.ok) {
        throw new Error("Failed to handle request");
      }
      const data = await response.json();
      console.log("Request handled successfully:", data);
    } catch (error) {
      console.error("Error handling request:", error);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      // Fetch all unread messages once the user is connected
      const fetchUnreadMessages = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/messages/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from: user, to: selectedChannel })
          });
  
          if (response.ok) {
            const messages = await response.json();
            setMessages(messages);
          }
        } catch (error) {
          console.error("Error fetching unread messages:", error);
        }
      };
  
      fetchUnreadMessages();
    });
  
    return () => {
      socket.off("connect");
    };
  }, [user, selectedChannel]);  // Call this when the user comes online or changes channel
  
  
  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      <aside className="w-20 bg-gradient-to-br from-blue-300 to-gray-500 dark:from-gray-800 dark:to-gray-900 flex flex-col py-6 space-y-6 items-center">
        {loading ? (
          <div className="h-16 w-16 rounded-full bg-gray-300 animate-pulse" />
        ) : user ? (
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{
              backgroundColor: user.avatarImage.backgroundColor,
            }}
          >
            {user.avatarImage.initial}
          </div>
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-400 flex items-center justify-center text-white">
            ?
          </div>
        )}
  
        <div className="space-y-6">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <UserGroupIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <BellIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <CalendarDaysIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <InboxArrowDownIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
          <ArrowUpOnSquareIcon className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" />
        </div>
  
        <div className="flex-1"></div>
  
        <button
          className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <SunIcon className="h-8 w-8" />
          ) : (
            <MoonIcon className="h-8 w-8" />
          )}
        </button>
        <button className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer">
          <CogIcon />
        </button>
      </aside>
  
      {/* Sidebar for channel selection */}
      <aside className="w-80 bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col">
        <div className="p-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className={`cursor-pointer p-2 rounded flex items-center shadow-sm ${
                selectedChannel?._id === channel._id
                  ? "bg-blue-400 dark:bg-gray-600"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{
                  backgroundColor: channel.avatarImage.backgroundColor,
                }}
              >
                {channel.avatarImage.initial}
              </div>
              <div>
                <p className="text-lg font-semibold">{channel.username}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {channel.latestMessage || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-64 justify-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Invite
        </button>
      </aside>
  
      {/* Main chat area */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-200 dark:from-gray-900 dark:to-gray-800">
        {selectedChannel ? (
          <>
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-400 dark:border-gray-600">
              <div className="flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white text-xl font-bold border border-gray-400 dark:border-gray-600"
                  style={{
                    backgroundColor: selectedChannel.avatarImage.backgroundColor,
                  }}
                >
                  {selectedChannel.avatarImage.initial}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {selectedChannel.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Online
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 ">
                <VideoCameraIcon className="h-6 w-6 text-blue-500 cursor-pointer" />
                <PhoneIcon className="h-6 w-6 text-blue-500 cursor-pointer" />
                <UserPlusIcon className="h-6 w-6 text-blue-500 cursor-pointer" />
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
              </div>
              <div className="flex space-x-4">
                {selectedChannel?.isChatRequest && (
                  <>
                    <button
                      className="bg-green-500 px-4 py-2 text-white rounded-full hover:bg-green-600"
                      onClick={() =>
                        handleRequest(selectedChannel.requestId, "accept")
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 px-4 py-2 text-white rounded-full hover:bg-red-600"
                      onClick={() =>
                        handleRequest(selectedChannel.requestId, "reject")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </header>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.fromSelf ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.fromSelf
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <footer className="p-4 bg-gray-100 dark:bg-gray-700 border-t border-gray-400 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <PhotoIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                <MicrophoneIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                <FaceSmileIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                <PlusIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-full"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 px-4 py-2 text-white rounded-full hover:bg-blue-500"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <p>Select a channel to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
  
  };
  
  export default ChatApp;
  