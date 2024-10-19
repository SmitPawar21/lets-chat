import sendImg from "../images/send.svg";
import { useState, useEffect, useRef } from "react";

export const Chatbot = () => {

    const system_prompt = {
        "role": "system",
        "content": ""
    }

    const chat_history = [system_prompt]

    const groq = new Groq(process.env.GROQ_API_KEY)

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const userInput = document.querySelector(".userInput");

    const chat = async () => {
        const response = await reply(req.body.msg)
        db.createChat(req.user.emailId, response)
        return response
    }

    const reply = async (prompt) => {
        chat_history.push({
            "role": "user",
            "content": prompt
        })
        const completion = await groq.chat.completions.create({
            messages: chat_history,
            model: "llama3-70b-8192",
            max_tokens: 50,
            temperature: 0.9
        })
        const result = completion.choices[0].message.content
        chat_history.push({
            "role": "assistant",
            "content": result
        })
        return result
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (input === '') return;

        const newMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput('');
        userInput.value = '';

        // const response = await fetch('http://localhost:5000/chat',{
        //     method: 'POST',
        //     headers: {
        //         'content-type': 'application/json'
        //     },
        //     body: JSON.stringify({message: input})
        // })
        
        const response = chat(input)
        console.log(response)
        const botResponse = { text: response.data, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const styles = {
        userMessage: {
            width: 'fit-content',
            maxWidth: '48%',
            textAlign: 'left',
            padding: '7px 15px',
            marginLeft: 'auto',
            marginBottom: '5px',
            backgroundColor: '#d1e7dd',
            borderRadius: '25px',
            boxSizing: 'border-box'
          },
          botMessage: {
            width: 'fit-content',
            maxWidth: '48%',
            textAlign: 'left',
            padding: '7px 15px',
            boxSizing: 'border-box',
            marginRight: '50%',
            marginBottom: '5px',
            backgroundColor: '#f8d7da',
            borderRadius: '25px',
          }
    }

    return (
        <div className='chatbot'>
            <div className='navbar'>
                <h1> Chatbot </h1>
            </div>
            <div className='messageList'>
                <div style={styles.botMessage} > Hello, how may I help You </div>
                {messages.map((msg, index) => (
                    <div key={index} style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='inputBox'>
                <input type='text' className='userInput' placeholder='Message Chatbot' onChange={(e) => setInput(e.target.value)} />
                <button onClick={handleSend}> <img src={sendImg} /> </button>
            </div>
        </div>
    );
}