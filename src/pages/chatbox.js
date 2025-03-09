import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  where,
  limit
} from "firebase/firestore";
 
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const initialGreeting = {
    text: "Hi! How can I help you navigate the campus today? 😊",
    sender: "bot",
  };
 
  useEffect(() => {
    if (chatVisible && messages.length === 0) {
      setMessages([initialGreeting]);
    }
  }, [chatVisible]);
 
  const cleanResponse = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/_(.*?)_/g, "$1");
  };
 
  // 🔍 **Search Firestore for location answers**
  const searchFirestoreForAnswer = async (question) => {
    const locationKeywords = [
        "where is",
        "where can i find",
        "how do i get to",
        "locate",
        "find",
        "directions to"
    ];
    
    // Remove punctuation (e.g., ?, ., ,) and convert to lowercase
    const lowerQuestion = question.toLowerCase().replace(/[?.,]/g, "");
 
    // Check if the question contains any location-based phrases
    if (!locationKeywords.some(keyword => lowerQuestion.includes(keyword))) {
        return null; // Ignore if it's not a location-based query
    }
 
    const words = lowerQuestion.split(" "); // Split input into words
    const buildingsRef = collection(db, "buildings");
    let results = [];
 
    for (let word of words) {
        const q = query(buildingsRef, where("search_keywords", "array-contains", word), limit(1));
        const snapshot = await getDocs(q);
 
        snapshot.forEach((doc) => {
            if (!results.some((b) => b.id === doc.id)) {
                results.push({ id: doc.id, ...doc.data() });
            }
        });
 
        if (results.length > 0) {
            const building = results[0]; //Suggestion: Can adjust to display all the results if multiple buildings are found
 
            return `🏢 *${building.building_name}*\n📍`; //Suggestion: to add go button to direct user to building pg
        }
    }
 
    return "Sorry, I couldn't find that building. Can you try again with a different name?";
};
 
 
  const sendMessage = async () => {
    if (!input.trim()) return;
 
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
 
    // 🔍 **Step 1: Check Firestore first**
    const firestoreAnswer = await searchFirestoreForAnswer(input.trim().toLowerCase());
 
    if (firestoreAnswer) {
      // 🎯 **Answer found in Firestore, send response immediately**
      const botReply = { text: firestoreAnswer, sender: "bot" };
      setMessages((prev) => [...prev, botReply]);
      setLoading(false);
    } else {
      // ❌ **No answer found in Firestore, send request to Gemini AI**
      await addDoc(collection(db, "extChatHistory"), {
        prompt: `${input} (Provide a concise response, no more than 3 sentences.)`,
        createTime: serverTimestamp(),
        max_tokens: 100, // Ensure AI keeps response short
      });
      
 
      listenForResponse();
    }
 
    setInput("");
  };
 
  const listenForResponse = () => {
    const q = query(
      collection(db, "extChatHistory"),
      orderBy("createTime", "desc"),
      limit(1)
    );
 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const data = change.doc.data();
          if (data.response) {
            const botReply = { text: cleanResponse(data.response), sender: "bot" };
            setMessages((prev) => [...prev, botReply]);
            setLoading(false);
            unsubscribe();
          }
        }
      });
    });
  };
 
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
 
  const clearChat = () => {
    setMessages([]);
    setTimeout(() => {
      setMessages([initialGreeting]);
    }, 100);
  };
 
  return (
    <div>
      <button
        onClick={() => setChatVisible(!chatVisible)}
        className="fixed bottom-9 right-9 bg-gold text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>
 
      {chatVisible && (
        <div className="fixed bottom-16 right-16 bg-white w-80 h-96 shadow-lg rounded-lg flex flex-col">
          <div className="p-3 flex-grow overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="p-2 my-1 text-left">
                <span className="inline-block px-3 py-1 rounded-lg bg-gray-300 text-black">
                  Bot is typing...
                </span>
              </div>
            )}
          </div>
 
          <div className="p-3 flex">
            <input
              className="flex-grow p-2 border rounded-lg text-black text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-navy text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
          <button
            onClick={clearChat}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Clear Chat
          </button>
        </div>
      )}
    </div>
  );
};
 
export default Chatbot;