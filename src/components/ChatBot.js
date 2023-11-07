import React, { useEffect, useState, useRef } from 'react'
import './ChatBot.css'

const Chatbot = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputError, setInputError] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Get the current time
    const currentTime = new Date()
    const hours = currentTime.getHours()

    // Determine the greeting based on the current time
    let greeting = ''
    if (hours >= 3 && hours < 12) {
      greeting = 'Good morning'
    } else if (hours >= 12 && hours < 17) {
      greeting = 'Good afternoon'
    } else {
      greeting = 'Good evening'
    }

    // Set the welcome message with the appropriate greeting
    setMessages([
      {
        text: `${greeting}! Welcome to Chatbot System! Press "hi" to start.`,
        bot: true
      }
    ])
  }, [])

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const handleInputChange = e => {
    setInput(e.target.value)
    // Reset input error when user starts typing
    setInputError(false)
  }

  // const sendMessage = () => {
  //   // Validate input
  //   if (input.trim() === '') {
  //     setInputError(true)
  //     return
  //   }

  //   // Show loading animation
  //   setLoading(true)

  //   // Process user input and provide appropriate suggestions
  //   let botMessage = ''
  //   if (input.toLowerCase() === 'hi') {
  //         botMessage = 'Please type "a" or "b".';
  //         handleBotResponse(botMessage);
  //       } else if (input.toLowerCase() === 'a') {
  //         botMessage = 'You chose option A. Type "x" or "y" for more options.';
  //         handleBotResponse(botMessage);
  //       } else if (input.toLowerCase() === 'b') {
  //         botMessage = 'You chose option B. Type "p" or "q" for more options.';
  //         handleBotResponse(botMessage);
  //       } else {
  //   }

  //   // For other inputs, make a request to the database and display the bot's response after 1 second
  //   fetch('http://192.168.1.13:3001/api/messages', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ message: input })
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       setTimeout(() => {
  //         setMessages([
  //           ...messages,
  //           { text: input, user: true },
  //           { text: data.message, bot: true }
  //         ])
  //         setLoading(false) // Hide loading animation after receiving the response
  //         setInput('')
  //       }, 1000) // Delay the bot's response by 1 second
  //     })
  //     .catch(error => {
  //       console.error('Error:', error)
  //       setLoading(false) // Hide loading animation in case of an error
  //       setInput('')
  //     })
  // }
  let productName, productCode, productQuantity;

const sendMessage = () => {
  // Validate input
  if (input.trim() === '') {
    setInputError(true);
    return;
  }

  // Show loading animation
  setLoading(true);

  // Process user input and provide appropriate suggestions
  let botMessage = '';

  const handleBotResponse = (response) => {
    setMessages([...messages, { text: input, user: true }, { text: response, bot: true }]);
    setLoading(false); // Hide loading animation after receiving the response
    setInput(''); // Reset the input after the response is received
  };

  if (input.toLowerCase() === 'hi') {
    botMessage = 'Please type "a" or "b".';
    handleBotResponse(botMessage);
  } else if (input.toLowerCase() === 'a') {
    botMessage = 'You chose option A. Type "x" or "y" for more options.';
    handleBotResponse(botMessage);
  } else if (input.toLowerCase() === 'b') {
    botMessage = 'You chose option B. Type "p" or "q" for more options.';
    handleBotResponse(botMessage);
  } else if (input.toLowerCase() === 'create') {
    productName = null;
    productCode = null;
    productQuantity = null;
    botMessage = 'Enter Product Name.';
    handleBotResponse(botMessage);
  } else if (!productName) {
    productName = input;
    botMessage = 'Enter Product Code.';
    handleBotResponse(botMessage);
  } else if (!productCode) {
    productCode = input;
    botMessage = 'Enter Quantity.';
    handleBotResponse(botMessage);
  } else if (!productQuantity) {
    productQuantity = input;
    // Make a request to the database and display the bot's response after 1 second
    fetch('http://192.168.1.13:3001/dataCreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: productName,
        code: productCode,
        quantity: productQuantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          handleBotResponse(data.message);
          // Reset the variables for the next product creation
          productName = null;
          productCode = null;
          productQuantity = null;
        }, 1000); // Delay the bot's response by 1 second
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false); // Hide loading animation in case of an error
        setInput('');
      });
  } else {
    // For other inputs, make a request to the database and display the bot's response after 1 second
    fetch('http://192.168.1.13:3001/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          handleBotResponse(data.message);
        }, 1000); // Delay the bot's response by 1 second
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false); // Hide loading animation in case of an error
        setInput('');
      });
  }
};

  

  return (
    <div className='chat-container'>
      <div className='messages'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.user
                ? 'message right-message'
                : message.bot
                ? 'message left-message'
                : ''
            }
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      {loading && <div className='loading'>Loading...</div>}
      {inputError && (
        <div className='error-message'>Please type a message.</div>
      )}
      <div className='input-container'>
        <input
          type='text'
          value={input}
          onChange={handleInputChange}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              sendMessage()
            }
          }}
          placeholder='Type your message...'
          className={inputError ? 'input-error' : ''}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default Chatbot
