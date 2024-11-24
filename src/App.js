import { useState, useEffect } from 'react';

function App() {
  const [value, setValue] = useState(''); // Setează inițial cu un string gol
  const [message, setMessage] = useState(null);
  const [pastchat, setPastchat] = useState([]);
  const [curentTitle, setCurentTitle] = useState(null);

  const handleClik = (uniqueTitles) => {
    setCurentTitle(uniqueTitles);
    setMessage(null);
    setValue("");
  };

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurentTitle(null);
  };

  const getMessages = async () => {

  
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value // Trimite mesajul introdus de utilizator
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json(); // Așteaptă să obții rezultatul complet
      console.log(data);
      setMessage(data.choices[0].message); // Corectat din "choises" în "choices"
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(curentTitle, value, message);
    if (!curentTitle && value && message) {
      setCurentTitle(value);
    }

    if (curentTitle && value && message) {
      setPastchat(prevPastchat => [
        ...prevPastchat,
        { title: curentTitle, role: "User", content: value },
        { title: curentTitle, role: message.role, content: message.content }
      ]);
    }
  }, [message]);

  const curentChat = pastchat.filter(pastchat => pastchat.title === curentTitle);
  const uniqueTitles = Array.from(new Set(pastchat.map(pastchat => pastchat.title)));

  return (
    <div className="app">
      <section className="L-bar">
        <button onClick={createNewChat}>New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClik(uniqueTitle)}>{uniqueTitle}</li>
          ))}
        </ul>
      </section>
      <section className="content">
        {!curentTitle && <h1>CloneGPT</h1>}
        <ul className="chating">
          {curentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className='role'>{chatMessage.role}:</p>
              <p>{chatMessage.content}</p> {/* Corectat din "message" în "content" */}
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-section">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>➤</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;