"use client"
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaHome,
  FaComments,
  FaQuestionCircle,
  FaNewspaper,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const blogData = [
  {
    title: "The Crucial Role of Due Diligence in Startup Funding",
    content:
      "In the fast-paced world of startups, securing funding is often a crucial milestone for growth and expansion. Whether seeking equity funding or debt financing, startups face a competitive landscape where investors scrutinize every aspect of the business before committing capital. This is where due diligence plays a pivotal role, providing investors with the necessary confidence and assurance to invest in a startup.",
    image: "/assets/images/dashboard/blog1.jpeg",
  },
  {
    title:
      "Unlocking Potential: Why Now is the Ideal Time to Invest in Startups",
    content:
      "In the ever-evolving landscape of investments, the allure of startups continues to captivate seasoned investors and novices alike. While the allure of startups is perennial, the timing of investment plays a pivotal role in reaping optimal returns. In this article, we delve into why now presents an opportune moment to channel your investments into the startup ecosystem and discern the sectors primed for exponential growth.",
    image: "/assets/images/dashboard/blog2.jpeg",
  },
  {
    title:
      "Empowering Startups: The Role of Purchase Order (PO) Financing in Fulfilling Orders and Driving Revenue",
    content:
      "In the competitive landscape of startups, fulfilling orders and managing cash flow are paramount for sustained growth. Purchase Order (PO) financing emerges as a strategic solution, enabling startups to bridge the gap between securing orders and fulfilling them. This article delves into the concept of PO financing, its benefits for startups, and its role in accelerating revenue generation amidst the challenges of cash constraints.",
    image: "/assets/images/dashboard/blog3.jpeg",
  },
  {
    title: "Essentials Of Securing Startup Funding",
    content:
      "Embarking on the startup funding path requires a solid foundation. It's crucial to have a strong business plan that outlines your vision. A persuasive pitch can make your startup stand out to investors. Understanding the financial landscape helps you strategize effectively. With the right groundwork, your startup is more likely to secure the funding it needs for growth.",
    image: "/assets/images/dashboard/blog1.jpeg",
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [stage, setStage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(true);
  const [messageBoxInput, setMessageBoxInput] = useState("");
  const [activeTab, setActiveTab] = useState("messages"); // Ensure the chat section is active by default

  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const initialGreetingMessage = {
        role: "model",
        parts: [{
          text: "Hello, <br> How are you doing today? Welcome to Xellerates AI! I am Zephyr, your personal Investment Banker. (I am an AI, trained for your fundraising journey). <br><br> Are you an existing customer? Yes or No"
        }]
      };
      setChatHistory([initialGreetingMessage]);
      setStage("waitingForCustomerStatus");
    }
  }, [isOpen]);

  const handleInputClick = () => {
    setIsOpen(true);  // Open the chatbox
    setActiveTab("messages");  // Set the active tab to messages
    setIsMessageBoxOpen(false);  // Close the popup box
    if (chatHistory.length === 0) {
      const initialGreetingMessage = {
        role: "model",
        parts: [{
          text: "Hello, <br> How are you doing today? Welcome to Xellerates AI! I am Zephyr, your personal Investment Banker. (I am an AI, trained for your fundraising journey). <br><br> Are you an existing customer? Yes or No"
        }]
      };
      setChatHistory([initialGreetingMessage]);
      setStage("waitingForCustomerStatus");
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMessageBoxOpen(false); // Hide the message box when the chatbot is opened
      setChatHistory([]); // Clear history if the chatbot is being opened
      setStage(null); // Reset stage when closing the chatbot
    }
  };

  const sendMessage = async (inputMessage) => {
    if (!inputMessage || typeof inputMessage !== 'string') {
      return; // Avoid processing if there is no valid input message
    }

    const userMessage = { role: "user", parts: [{ text: inputMessage }] };
    setMessage(""); // Clear the message input immediately
    setIsTyping(true); // Show typing indicator

    try {
      const messagesHistory = [...chatHistory, userMessage];
      console.log("Message History: ", messagesHistory);
      setChatHistory(messagesHistory);

      let botResponseText;

      switch (stage) {
        case "waitingForCustomerStatus":
          if (inputMessage.toLowerCase() === "yes") {
            botResponseText = "Kindly confirm me with your email ID:";
            setStage("waitingForEmail");
          } else if (inputMessage.toLowerCase() === "no") {
            botResponseText = "Thank you for stepping in and planning to take your first step towards the startup ecosystem. Are you an investor or startup?";
            setStage("waitingForInvestorOrStartup");
          } else {
            botResponseText = "Please answer with 'Yes' or 'No'.";
          }
          break;
        case "waitingForEmail":
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailPattern.test(inputMessage)) {
            botResponseText = "Great! Do you have any questions for me?";
            const botMessageWithButtons = {
              role: "model",
              parts: [{ text: botResponseText }],
              buttons: [
                { label: "Continue to chat with Zephyr", action: "continueChat", icon: "/assets/images/chat/zephyr.png" },
                { label: "Talk to customer care on WhatsApp", action: "customerCare", icon: "/assets/images/chat/whatsapp.png" }
              ]
            };
            setChatHistory((prevChatHistory) => [...prevChatHistory, botMessageWithButtons]);
            setIsTyping(false);
            return;
          } else {
            botResponseText = "Please enter a valid email address.";
            setStage("waitingForEmail"); // Stay in the email stage
          }
          break;
        case "waitingForInvestorOrStartup":
          if (inputMessage.toLowerCase() === "investor") {
            botResponseText = "Are you? <br>• Venture Capital<br>• Angel Investor<br>• Family Office<br>• Angel Network<br>• Angel Fund";
            setStage("waitingForInvestorType");
          } else if (inputMessage.toLowerCase() === "startup") {
            botResponseText = "Which stage is your startup in?<br>• Bootstrapped<br>• Pre-Seed<br>• Seed<br>• Pre-Series A<br>• Series A<br>• Series B<br>• Series C & beyond";
            setStage("waitingForStartupStage");
          } else {
            botResponseText = "Please specify if you are an investor or a startup.";
          }
          break;
        case "waitingForInvestorType":
        case "waitingForStartupStage":
          botResponseText = "That's great! Do you have any questions for me?";
          const botMessageWithButtons = {
            role: "model",
            parts: [{ text: botResponseText }],
            buttons: [
              { label: "Continue to chat with Zephyr", action: "continueChat", icon: "/assets/images/chat/zephyr.png" },
              { label: "Talk to customer care on WhatsApp", action: "customerCare", icon: "/assets/images/chat/whatsapp.png" }
            ]
          };
          setChatHistory((prevChatHistory) => [...prevChatHistory, botMessageWithButtons]);
          setIsTyping(false);
          return;
        case "waitingForQuestions":
          botResponseText = "Feel free to ask any questions you have.";
          setStage("awaitingQuestion");
          break;
        case "awaitingQuestion":
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messagesHistory, question: inputMessage }),
          });

          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          const lastEntry = data[data.length - 1];
          const parts = lastEntry.parts;
          botResponseText = parts[0]?.text || "Sorry, something went wrong.";

          if (botResponseText.includes("{contact_info}")) {
            botResponseText = botResponseText.replace(
              "{contact_info}",
              `<a href="https://wa.me/9818446004?text=Hello%2C%0AI%20Need%20an%20assistance%20from%20an%20Investment%20banker%20@Xellerates%20AI" target="_blank" style="color: blue; text-decoration: underline; padding: 2px 4px; ">Click Here to chat on WhatsApp</a>`
            );
          }

          break;
        default:
          botResponseText = "Sorry, I didn't understand that. Can you please rephrase?";
      }

      const botMessage = { role: "model", parts: [{ text: botResponseText }] };
      setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message to chatbot", error);
      const errorMessage = { role: "model", parts: [{ text: "Sorry, something went wrong. Please try again later." }] };
      setChatHistory((prevChatHistory) => [...prevChatHistory, errorMessage]);
      setIsTyping(false);
    } finally {
      scrollToBottom();
    }
  };

  const handleButtonClick = (action) => {
    if (action === "continueChat") {
      const thankYouMessage = {
        role: "model",
        parts: [{ text: "Thank you for choosing Zephyr. Please ask your question." }]
      };
      setChatHistory(prevChatHistory => [...prevChatHistory, thankYouMessage]);
      setStage("awaitingQuestion");
    } else if (action === "customerCare") {
      window.open(`https://wa.me/9818446004?text=Hello%2C%0AI%20Need%20an%20assistance%20from%20an%20Investment%20banker%20@Xellerates%20AI`, "_blank");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage(message);
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return (
          <div className="chatbot-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', width: '100%' }}>
                {msg.parts.map((part, partIndex) => (
                  <div key={partIndex} style={{
                    padding: '12px 18px',
                    borderRadius: '20px',
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                    fontSize: '14px',
                    backgroundColor: msg.role === "user" ? '#4a90e2' : '#f7f7f7',
                    color: msg.role === "user" ? '#fff' : '#333',
                    alignSelf: msg.role === "user" ? 'flex-end' : 'flex-start'
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: part.text }} />
                  </div>
                ))}

                {msg.buttons && (
                  <div className="chatbot-buttons-container">
                    {msg.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        onClick={() => handleButtonClick(button.action)}
                        className="chatbot-button"
                      >
                        {button.icon && <img src={button.icon} alt="" className="button-icon" />}
                        {button.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px', width: '100%' }}>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '20px',
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                  fontSize: '14px',
                  backgroundColor: '#f7f7f7',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    margin: '0 1.5px',
                    backgroundColor: "rgb(78 78 78)",
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'bounce 1.2s infinite ease-in-out',
                    animationDelay: '0s',
                  }}></span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    margin: '0 1.5px',
                    backgroundColor: 'rgb(78 78 78)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'bounce 1.2s infinite ease-in-out',
                    animationDelay: '-0.16s'
                  }}></span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    margin: '0 1.5px',
                    backgroundColor: 'rgb(78 78 78)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'bounce 1.2s infinite ease-in-out',
                    animationDelay: '-0.32s'
                  }}></span>
                </div>
              </div>
            )}
            <style>
              {`
                @keyframes bounce {
                  0%, 100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-6px);
                  }
                }

                
  .chatbot-buttons-container {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  margin-bottom: 20px;
}

.chatbot-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 2px;
  background-color: #fff;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  border-radius: 15px;
  cursor: pointer;
  width: 40%;
  font-size: 12px;
  transition: background-color 0.3s ease;
  margin-right: 5px;
  margin-left: 5px;
}

.chatbot-button:hover {
  background-color: #4a90e2;
  color: #fff;
}

.button-icon {
  width: 25px;
  height: 25px;
  margin-left: 3px;
  margin-right: 5px;

}
              `}
            </style>
            <div ref={messageEndRef} />
          </div>
        );
      case "help":
        return <HelpContent />;
      case "news":
        return <NewsContent />;
      default:
        return (
          <HomeContent onSendMessageClick={() => setActiveTab("messages")} />
        );
    }
  };

  return (
    <>
      {!isOpen && isMessageBoxOpen && (
        <div className="message-box">
        <div className="message-header">
          <span className="message-text">Welcome to Xellerates AI!</span>
          <span className="message-subtext">
          Xellerates AI is a Global platform for startups to be investment ready through our AI model.
          </span>
          <span className="message-subtext">
          How can we help you? Feel free to ask anything.
          </span>
          <button className="close-btn" onClick={() => setIsMessageBoxOpen(false)}>×</button>
        </div>
        <div className="message-input-box">
          <input
            type="text"
            placeholder="Enter your message..."
            value={messageBoxInput}
            onClick={handleInputClick}
            onChange={(e) => setMessageBoxInput(e.target.value)}
          />
        </div>
      </div>
      
      
      )}

      <div className="chatbot-icon" onClick={toggleChatbot}>
        <img src="/assets/images/dashboard/chatbot2.png" alt="Chatbot Icon" />
      </div>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <img
              src="/assets/images/dashboard/Zephyr.gif"
              alt="Zephyr"
              className="header-image-full"
            />
            <button className="close-btn" onClick={toggleChatbot}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">{renderContent()}</div>

          {activeTab === "messages" && (
            <div className="chatbot-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your message..."
              />
              <button onClick={() => sendMessage(message)}>Send</button>
            </div>
          )}

          <div className="chatbot-footer">
            <button
              onClick={() => setActiveTab("home")}
              className={activeTab === "home" ? "active" : ""}
            >
              <FaHome size={24} />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={activeTab === "messages" ? "active" : ""}
            >
              <FaComments size={24} />
              <span>Messages</span>
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className={activeTab === "help" ? "active" : ""}
            >
              <FaQuestionCircle size={24} />
              <span>Help</span>
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={activeTab === "news" ? "active" : ""}
            >
              <FaNewspaper size={24} />
              <span>News</span>
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
.message-box {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 350px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 20px;
  border: 1px solid #e0e0e0;
  font-family: 'Roboto', sans-serif;
}

.message-header {
  position: relative;
  margin-bottom: 15px;
  color: #004e98;
}

.message-text {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #004e98;
  margin-bottom: 10px;
}

.message-subtext {
  display: block;
  font-size: 14px;
  color: #2f2f2f;
  margin-bottom: 20px;
}

.message-input-box {
  display: flex;
  align-items: center;
  background-color: #f5f8fa;
  border-radius: 25px;
  padding: 2px 15px;
  border: 1px solid #ccd6dd;
}

.message-input-box input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  background-color: transparent;
  outline: none;
  color: #004e98;
}

.close-btn1 {
  position: absolute;
  top: -15px;
  right: -10px;
  background: none;
  border: none;
  color: #004e98;
  font-size: 20px;
  cursor: pointer;
}

.close-btn1:hover {
  color: #00274d;
}



.chatbot-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.chatbot-icon img {
  width: 100%;
  height: 100%;
}

.chatbot-icon:hover {
  transform: scale(1.05);
}


        .chatbot-container {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 350px;
          height: 600px;
          background-color: #fff;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }

        .chatbot-header {
          background-color: #4a90e2;
          color: #fff;
          padding: 0;
          position: relative;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .header-image-full {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }

        .chatbot-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .chatbot-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #e0e0e0;
          background-color: #f7f7f7;
          color: #333;
        }

        .chatbot-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 25px;
          margin-right: 10px;
          font-size: 14px;
        }

        .chatbot-input button {
      padding: 10px 15px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
    }

        .chatbot-footer {
          display: flex;
          border-top: 1px solid #e0e0e0;
          background-color: #f7f7f7;
        }

        .chatbot-footer button {
          flex: 1;
          padding: 10px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgb(71 85 105);
        }

        .chatbot-footer button.active {
          background-color: #4a90e2;
          color: rgb(71 85 105);
        }

        .chatbot-footer button:hover {
          background-color: #007bff;
          color: white;
        }

        .chatbot-footer button span {
          font-size: 12px;
        }
      `}</style>
    </>
  );
};


const HomeContent = ({ onSendMessageClick }) => {
  const [expandedBlog, setExpandedBlog] = useState(null);

  const toggleBlog = (index) => {
    setExpandedBlog(expandedBlog === index ? null : index);
  };

  return (
    <div className="home-content">
      <div className="header-greeting">Hello there. How can we help?</div>
      <div className="send-message-bar" onClick={onSendMessageClick}>
        <input
          type="text"
          placeholder="Send us a message"
          className="send-message-input"
          readOnly
        />
        <FaArrowRight className="send-message-arrow" />
      </div>
      <div className="blog-section">
        {blogData.map((blog, index) => (
          <div key={index} className="blog-card">
            <img src={blog.image} alt={blog.title} className="blog-image" />
            <h3>{blog.title}</h3>
            <p>
              {expandedBlog === index
                ? blog.content
                : `${blog.content.split(" ").slice(0, 20).join(" ")}...`}
              <span className="read-more" onClick={() => toggleBlog(index)}>
                {expandedBlog === index ? " Show less" : " read more"}
              </span>
            </p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .home-content {
          padding: 5px;
        }
        .header-greeting {
          font-size: 24px;
          font-weight: bold;
          text-align: left;
          margin-bottom: 5px;
          line-height: 1.2;
        }
        .send-message-bar {
          display: flex;
          align-items: center;
          background-color: #fff;
          border-radius: 8px;
          padding: 0px 10px;
          width: 100%;
          max-width: 400px;
          margin-top: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
          cursor: pointer;
        }
        .send-message-input {
          flex: 1;
          border: none;
          background-color: transparent;
          font-size: 16px;
          padding: 10px;
          outline: none;
          cursor: pointer;
        }
        .send-message-arrow {
          color: #007bff;
          margin-left: 10px;
        }
        .send-message-arrow:hover {
          color: #0056b3;
        }
        .blog-section {
          padding: 20px 0;
        }
        .blog-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          padding: 20px;
        }
        .blog-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }
        .blog-card h3 {
          margin-top: 10px;
          font-size: 20px;
          line-height: 1.2;
        }
        .blog-card p {
          margin: 10px 0;
        }
        .read-more {
          color: #007bff;
          cursor: pointer;
        }
        .read-more:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

const HelpContent = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "What is Xellerates AI?",
      answer:
        "Xellerates AI is an investment tech platform and a one-stop solution for startups and investors to streamline the fundraising journey through artificial intelligence.",
    },
    {
      question: "Who can become a part of Xellerates AI?",
      answer:
        "Anyone who is a startup, investor, or incubator can become a part of Xellerates AI.",
    },
    {
      question:
        "Does Xellerates AI help startups with financial research and projections?",
      answer:
        "Yes, our Financial Insights tool helps with market studies, financial projections, and startup valuation. It provides accurate TAM, SAM, and SOM for your business, integrated with our Pitch Deck tool.",
    },
    {
      question: "How can Xellerates AI help me in fundraising?",
      answer:
        "We offer a Fundraising tool for equity funding, debt funding, M&A, and sale of secondary shares. It matches you with investors based on your profile.",
    },
    {
      question: "How does the fundraising tool work?",
      answer:
        "After analyzing your profile, you receive a list of investors aligned with your sector, stage, and geography. You can send connection requests to investors, and if they show interest, a meeting is scheduled.",
    },
    {
      question: "How does Xellerates AI address legal needs for startups?",
      answer:
        "Our legal tech solution offers legal agreements, a compliance library, and streamlined compliance management from day one.",
    },
    {
      question:
        "I am at the ideation stage and looking to avail grants from the government. Can Xellerates AI help?",
      answer:
        "Yes, first register your startup and obtain the Startup India certification through our Investment Readiness tool. We then help you connect with incubators for government grants and guide you through the application process.",
    },
    {
      question: "What kind of market research tools does Xellerates AI offer?",
      answer:
        "Our platform provides comprehensive market research tools that analyze your industry, competitors, and market trends to help you make informed decisions.",
    },
    {
      question:
        "Can Xellerates AI assist in networking with other startups and investors?",
      answer:
        "Yes, our platform includes networking features that allow you to connect with other startups, investors, and industry experts to build valuable relationships.",
    },
    {
      question: "Does Xellerates AI offer mentorship programs?",
      answer:
        "Yes, we provide access to a network of experienced mentors who can guide you through various stages of your startup journey.",
    },
    {
      question:
        "How can Xellerates AI help with my startup's compliance requirements?",
      answer:
        "Our compliance tools help you stay updated with regulatory requirements and streamline the process of maintaining compliance documentation.",
    },
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="help-content">
      <h5>Frequently asked question.</h5>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className={`faq-question ${
                openQuestion === index ? "active" : ""
              }`}
              onClick={() => toggleQuestion(index)}
            >
              {faq.question}
              {openQuestion === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openQuestion === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .faq-list {
          margin-top: 20px;
        }
        .faq-item {
          margin-bottom: 10px;
        }
        .faq-question {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #f1f1f1;
          border-radius: 4px;
        }
        .faq-answer {
          padding: 10px;
          background-color: #fff;
          border: 1px solid #f1f1f1;
          border-top: none;
          border-radius: 0 0 4px 4px;
        }
        .faq-question.active {
          color: #000;
        }
      `}</style>
    </div>
  );
};

const NewsContent = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndexes, setExpandedIndexes] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/fetch-news', {
          params: { q: 'category startups' },
        });
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Function to toggle content expansion
  const toggleExpansion = (index) => {
    setExpandedIndexes((prevExpandedIndexes) =>
      prevExpandedIndexes.includes(index)
        ? prevExpandedIndexes.filter((i) => i !== index)
        : [...prevExpandedIndexes, index]
    );
  };

  return (
    <div className="container">
      <style jsx>{`
        .container {
          background-color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .heading {
          font-size: 1.875rem; /* text-3xl */
          font-weight: 700; /* font-bold */
          color: #2563eb; /* text-blue-600 */
          margin-bottom: 1rem; /* mb-4 */
          margin-top: 0;
        }
        .loading-text {
          color: #4b5563; /* text-gray-600 */
        }
        .article-container {
          background-color: #f3f4f6; /* bg-gray-100 */
          padding: 1rem; /* p-4 */
          border-radius: 0.5rem; /* rounded-lg */
          margin-bottom: 1rem; /* mb-4 */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
        }
        .article-title {
          font-size: 1rem; /* text-lg */
          font-weight: 600; /* font-semibold */
          color: #1f2937; /* text-gray-800 */
          margin-bottom: 0.5rem; /* mb-2 */
          margin-top: 0;
        }
        .summary-list {
          list-style-type: disc; /* list-disc */
          padding-left: 1.25rem; /* pl-5 */
          color: #374151; /* text-gray-700 */
          margin: 0;
        }
        .list-item {
          margin-bottom: 0.25rem; /* mb-1 */
          font-size: 0.9rem;
        }
        .toggle-button {
          display: inline-block; /* inline-block */
          color: #2563eb; /* text-blue-600 */
          transition: all 0.3s; /* transition duration-300 */
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
        }
        .toggle-button:hover {
          text-decoration: underline; /* hover:underline */
        }
      `}</style>

      <h2 className="heading">Latest News</h2>
      {loading ? (
        <p className="loading-text">Loading news...</p>
      ) : (
        news.map((article, index) => {
          const isExpanded = expandedIndexes.includes(index);

          return (
            <div key={index} className="article-container">
              <h3 className="article-title">{article.title}</h3>
              <ul className="summary-list">
                {article.summary.slice(0, 1).map((point, idx) => {
                  const words = point.split(' ');
                  const isMoreThan30Words = words.length > 30;
                  return (
                    <li key={idx} className="list-item">
                      {expandedIndexes.includes(index)
                        ? point // Show full content if expanded
                        : words.slice(0, 30).join(' ') + (isMoreThan30Words ? '...' : '')} {/* Show truncated content if not expanded */}

                      {/* Conditionally render the button if text is more than 30 words */}
                      {isMoreThan30Words && (
                        <button
                          onClick={() => toggleExpansion(index)}
                          className="toggle-button"
                        >
                          {expandedIndexes.includes(index) ? 'Read less...' : 'Read more...'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
};


export default Chatbot;
