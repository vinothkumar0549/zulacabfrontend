import React, { useEffect, useState, useRef } from "react";

function ChatComponent({ userType, userId, roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8080/cab/chat/${roomId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to chat room:", roomId);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleSend = () => {
    if (input.trim() === "") return;
    const messageObject = {
      senderType: userType,
      senderId: String(userId),
      message: input,
    };
    socketRef.current.send(JSON.stringify(messageObject));
    setInput(""); // Clear input
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
      <h4>Chat Room: {roomId}</h4>
      <div
        style={{
          height: "450px", // Adjusted for better visibility
          overflowY: "auto",
          background: "#f8f8f8",
          padding: "5px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.senderId === userId ? "right" : "left",
              marginBottom: "10px",
              display: "flex",
              justifyContent: msg.senderId === userId ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px",
                backgroundColor: msg.senderId === userId ? "#dcf8c6" : "#fff",
                borderRadius: "10px",
                border: msg.senderId === userId ? "1px solid #75b741" : "1px solid #ddd",
                boxShadow: msg.senderId === userId ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
              }}
            >
              <strong>{msg.senderType}</strong>: {msg.message}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
        style={{
          width: "80%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "5px",
          padding: "10px 15px",
          backgroundColor: "#75b741",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default ChatComponent;





// import React, { useEffect, useState, useRef } from "react";

// function ChatComponent({ userType, userId, roomId }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!roomId) return;

//     // Connect to WebSocket
//     const ws = new WebSocket(`ws://localhost:8080/cab/chat/${roomId}`);
//     socketRef.current = ws;

//     ws.onopen = () => {
//       console.log("Connected to chat room:", roomId);
//     };

//     ws.onmessage = (event) => {
//         console.log("message is sent");
//       const data = JSON.parse(event.data);
//       setMessages((prev) => [...prev, data]);
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//     };

//     // Clean up on unmount
//     return () => {
//       ws.close();
//     };
//   }, [roomId]);

//   const handleSend = () => {
//     if (input.trim() === "") return;
//     const messageObject = {
//       senderType: userType,
//       senderId: userId,
//       message: input,
//     };
//     socketRef.current.send(JSON.stringify(messageObject));
//     setInput(""); // Clear input
//   };

//   return (
//     <div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
//       <h4>Chat Room: {roomId}</h4>
//       <div style={{ height: "150px", overflowY: "auto", background: "#f8f8f8", padding: "5px" }}>
//         {messages.map((msg, idx) => (
//           <div key={idx} style={{ textAlign: msg.senderId === userId ? "right" : "left" }}>
//             <strong>{msg.senderType}</strong>: {msg.message}
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type your message"
//       />
//       <button onClick={handleSend} style={{ marginLeft: "5px" }}>Send</button>
//     </div>
//   );
// }

// export default ChatComponent;
