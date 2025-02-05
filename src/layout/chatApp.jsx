<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
=======
import { useState, useEffect } from "react"
import io from "socket.io-client"
import Invitebutton from "./Invitebutton"
>>>>>>> 8c6e9f1 (first commit)
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
<<<<<<< HEAD
  InboxArrowDownIcon,
  SunIcon,
  MoonIcon,
  ArrowUpOnSquareIcon,
  CogIcon,
} from "@heroicons/react/24/solid";
import Picker from "emoji-picker-react"; // Using emoji-picker-react
=======
} from "@heroicons/react/24/solid"
>>>>>>> 8c6e9f1 (first commit)


const chatURL = "https://chat-app-backend-2ph1.onrender.com/api";
// Socket connection
const socket = io("https://chat-app-backend-2ph1.onrender.com", {
  withCredentials: true,
<<<<<<< HEAD
});

const generateAvatar = (username) => {
  if (!username) return { initial: "?", backgroundColor: "#cccccc" }; // Fallback for invalid username
  const avatarKey = `userAvatarImage_${username}`;
  const existingAvatar = localStorage.getItem(avatarKey);
=======
})

const generateAvatar = (username) => {
  if (!username) return { initial: "?", backgroundColor: "#cccccc" }

  const avatarKey = `userAvatarImage_${username}`
  const existingAvatar = localStorage.getItem(avatarKey)
>>>>>>> 8c6e9f1 (first commit)

  if (existingAvatar) {
    return JSON.parse(existingAvatar)
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
<<<<<<< HEAD
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
=======
  ]
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  const initial = username.charAt(0).toUpperCase()

  const avatarImage = { initial, backgroundColor }
  localStorage.setItem(avatarKey, JSON.stringify(avatarImage))
  return avatarImage
}

const ChatApp = () => {
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [search, setSearch] = useState("")
  const [showPoll, setShowPoll] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem("userId")

    if (userId) {
      socket.emit("add-user", userId)
    } else {
      console.warn("User ID not found in localStorage")
    }

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          console.log("No user ID found in localStorage")
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:5000/api/auths/getAllUsers/${userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()

        const avatarImage = generateAvatar(data.username)
        setUser({ ...data, avatarImage })
      } catch (error) {
        console.error("Error fetching user data:", error.message)
      } finally {
        setLoading(false)
>>>>>>> 8c6e9f1 (first commit)
      }
    }

<<<<<<< HEAD
    fetchChannels();
  }, []);
=======
    fetchUser()
  }, [])

  const fetchChannels = async (query = "") => {
    try {
      const response = await fetch("http://localhost:5000/api/auths/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        console.error("Error fetching channels:", response.statusText)
        return
      }

      const data = await response.json()
      const channelsWithAvatars = data.map((channel) => ({
        ...channel,
        avatarImage: generateAvatar(channel.username),
      }))
      setChannels(channelsWithAvatars)
    } catch (error) {
      console.error("Error fetching channels:", error.message)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, [search, user]) // Added 'user' to dependencies
>>>>>>> 8c6e9f1 (first commit)

  // Fetch messages dynamically when a channel is selected
  useEffect(() => {
<<<<<<< HEAD
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
=======
    socket.on("msg-recieve", ({ msg, from, isChatRequest }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          fromSelf: from === localStorage.getItem("userId"),
          message: msg,
          isChatRequest,
        },
      ])
    })

    return () => {
      socket.off("msg-recieve")
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearch(query)
    fetchChannels(query)
  }
>>>>>>> 8c6e9f1 (first commit)

  // Toggle dark mode
  const toggleDarkMode = () => {
<<<<<<< HEAD
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
=======
    setDarkMode((prev) => !prev)
  }

  const sendMessage = async (messageData) => {
    const from = localStorage.getItem("userId")
    const to = selectedChannel._id

    if (!from || !to) {
      alert("Invalid sender or recipient.")
      return
    }

    if (typeof messageData === "string" && !messageData.trim()) {
      return
    }

    const isChatRequest = !messages.some((msg) => msg.isAccepted)

    const messagePayload =
      typeof messageData === "string"
        ? {
            from,
            to,
            message: messageData,
            isChatRequest,
          }
        : {
            ...messageData,
            from,
            to,
            isChatRequest,
          }

    try {
      await fetch("http://localhost:5000/api/messages/addmsg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      })

      if (isChatRequest) {
        socket.emit("chat-request", messagePayload)
      } else {
        socket.emit("send-msg", messagePayload)
      }

      if (typeof messageData === "string") {
        setMessages((prev) => [...prev, { fromSelf: true, message: messageData }])
        setNewMessage("")
      } else if (messageData.type === "poll") {
        setMessages((prev) => [...prev, { fromSelf: true, ...messageData }])
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleRequest = async (requestId, action) => {
    try {
      const response = await fetch("http://localhost:5000/api/auths/handleRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      })
      if (!response.ok) {
        throw new Error("Failed to handle request")
      }
      const data = await response.json()
      console.log("Request handled successfully:", data)
    } catch (error) {
      console.error("Error handling request:", error)
>>>>>>> 8c6e9f1 (first commit)
    }
  }

  const handlePollSubmit = async () => {
    if (pollQuestion && pollOptions.filter((option) => option.trim()).length >= 2) {
      try {
        const response = await fetch("http://localhost:5000/api/poll/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: pollQuestion,
            options: pollOptions.filter((option) => option.trim()),
            createdBy: user._id,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Poll created successfully:", data)

          // Send the poll as a message
          sendMessage({
            type: "poll",
            pollId: data.poll._id,
            question: data.poll.question,
            options: data.poll.options,
            votes: new Array(data.poll.options.length).fill(0),
            voters: [],
          })

          setShowPoll(false)
          setPollQuestion("")
          setPollOptions(["", ""])
        } else {
          console.error("Failed to create poll:", await response.text())
        }
      } catch (error) {
        console.error("Error creating poll:", error)
      }
    } else {
      console.log("Please fill out the question and at least two options.")
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions]
    newOptions[index] = value
    setPollOptions(newOptions)
  }

  const handleAddOption = () => {
    setPollOptions([...pollOptions, ""])
  }

  const handleRemoveOption = (index) => {
    const newOptions = [...pollOptions]
    newOptions.splice(index, 1)
    setPollOptions(newOptions)
  }

  const handleVote = async (pollId, optionIndex) => {
    if (!user) return

    try {
      const response = await fetch("http://localhost:5000/api/poll/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, optionIndex, userId: user._id }),
      })

      if (response.ok) {
        const updatedPoll = await response.json()
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.pollId === pollId ? { ...msg, ...updatedPoll } : msg)),
        )
      } else {
        console.error("Failed to vote:", await response.text())
      }
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const fetchPollData = async (pollId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/poll/${pollId}`)
      if (response.ok) {
        const pollData = await response.json()
        return pollData
      } else {
        console.error("Failed to fetch poll data:", await response.text())
        return null
      }
    } catch (error) {
      console.error("Error fetching poll data:", error)
      return null
    }
  }

<<<<<<< HEAD
  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false); // Close the calendar modal after selecting a date
    console.log("Selected Date:", date); // For debugging
  }; // Call this when the user comes online or changes channel
=======
  useEffect(() => {
    const fetchPollsForMessages = async () => {
      const updatedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (msg.type === "poll" && msg.pollId) {
            const pollData = await fetchPollData(msg.pollId)
            if (pollData) {
              return { ...msg, ...pollData }
            }
          }
          return msg
        }),
      )
      setMessages(updatedMessages)
    }

    fetchPollsForMessages()
  }, [messages])
>>>>>>> 8c6e9f1 (first commit)

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-br from-blue-300 to-gray-500 dark:from-gray-800 dark:to-gray-900 flex flex-col py-6 space-y-6 items-center">
<<<<<<< HEAD
        {/* Logged-in User Avatar */}
        <div
          className="h-16 w-16 rounded-full border-2 border-white shadow-lg mb-8 flex items-center justify-center text-white font-bold text-xl"
          style={{
            backgroundColor: generateAvatar(user.username).backgroundColor,
          }}
        >
          {generateAvatar(user.username).initial}
        </div>
=======
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
          <div className="h-16 w-16 rounded-full bg-gray-400 flex items-center justify-center text-white">?</div>
        )}

>>>>>>> 8c6e9f1 (first commit)
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
<<<<<<< HEAD
        <div className="flex-1"></div>
        <button
          className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer"
          onClick={toggleDarkMode}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
=======

        <div className="flex-1"></div>

        <button className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer" onClick={toggleDarkMode}>
          {darkMode ? <SunIcon className="h-8 w-8" /> : <MoonIcon className="h-8 w-8" />}
>>>>>>> 8c6e9f1 (first commit)
        </button>
        <button className="h-8 w-8 text-white hover:text-gray-300 cursor-pointer">
          <CogIcon />
        </button>
      </aside>

<<<<<<< HEAD
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
=======
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{channel.latestMessage || "No messages yet"}</p>
              </div>
            </div>
          ))}
        </div><button className="w-full mt-64 justify-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          <Invitebutton />
        </button>
        
      </aside>

      <main className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-200 dark:from-gray-900 dark:to-gray-800">
        {selectedChannel ? (
          <>
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-400 dark:border-gray-600">
              <div className="flex items-center space-x-4">
>>>>>>> 8c6e9f1 (first commit)
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: generateAvatar(channel.username)
                      .backgroundColor,
                  }}
                >
                  {generateAvatar(channel.username).initial}
                </div>
<<<<<<< HEAD
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
=======
                <div>
                  <p className="text-lg font-semibold">{selectedChannel.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
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
                      onClick={() => handleRequest(selectedChannel.requestId, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 px-4 py-2 text-white rounded-full hover:bg-red-600"
                      onClick={() => handleRequest(selectedChannel.requestId, "reject")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </header>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.fromSelf ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    {msg.type === "poll" ? (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-semibold mb-2">{msg.question}</h3>
                        <div className="space-y-2">
                          {msg.options.map((option, optionIndex) => {
                            const voteCount = msg.votes[optionIndex]
                            const totalVotes = msg.votes.reduce((sum, count) => sum + count, 0)
                            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
                            const hasVoted = msg.voters.includes(user._id)

                            return (
                              <div key={optionIndex} className="relative">
                                <button
                                  className={`w-full text-left p-2 rounded ${
                                    hasVoted
                                      ? "bg-gray-100 dark:bg-gray-700"
                                      : "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                                  }`}
                                  onClick={() => !hasVoted && handleVote(msg.pollId, optionIndex)}
                                  disabled={hasVoted}
                                >
                                  {option}
                                </button>
                                <div
                                  className="absolute top-0 left-0 h-full bg-blue-500 opacity-20 rounded"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {msg.votes.reduce((sum, count) => sum + count, 0)} vote(s)
                        </p>
                      </div>
                    ) : (
                      msg.message
                    )}
>>>>>>> 8c6e9f1 (first commit)
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
<<<<<<< HEAD
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
=======
              <div className="flex items-center space-x-3">
                <PhotoIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                <MicrophoneIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                <FaceSmileIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />

                <PlusIcon
                  className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setShowPoll(!showPoll)}
                />

                {showPoll && (
                  <div className="bg-white p-4 rounded-lg shadow-lg absolute bottom-16 left-1/2 transform -translate-x-1/2 w-96">
                    <div>
                      <input
                        type="text"
                        placeholder="Poll Question"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                      />
                      {pollOptions.map((option, index) => (
                        <div key={index} className="mb-2 flex">
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-grow px-4 py-2 mb-2 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => handleRemoveOption(index)}
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleAddOption}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500 mb-2"
                      >
                        Add Option
                      </button>
                      <button
                        onClick={handlePollSubmit}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500"
                      >
                        Create Poll
                      </button>
                    </div>
                  </div>
                )}

>>>>>>> 8c6e9f1 (first commit)
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-full focus:outline-none"
                />
                <button
                  onClick={() => sendMessage(newMessage)}
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
<<<<<<< HEAD
  );
};

export default ChatApp;
=======
  )
}

export default ChatApp

>>>>>>> 8c6e9f1 (first commit)
