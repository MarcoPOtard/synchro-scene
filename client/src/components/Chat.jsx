import React from 'react';

const Chat = ({ messages, messageInput, setMessageInput, sendMessage }) => (
  <section className="chat-section">
    <h3>Messages</h3>
    <div className="messages-container">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <strong>{msg.from}:</strong> {msg.text}
          <span className="message-time">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
    <form onSubmit={sendMessage} className="message-form">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Envoyer un message..."
      />
      <button type="submit">Envoyer</button>
    </form>
  </section>
);

export default Chat;
