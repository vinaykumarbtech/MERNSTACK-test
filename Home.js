import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

function Home() {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('es');

    const translateText = async () => {
        try {
            const response = await axios.get(`https://api.mymemory.translated.net/get?q=${text}&langpair=${sourceLang}|${targetLang}`);
            setTranslatedText(response.data.responseData.translatedText);
        } catch (error) {
            console.error('Error translating text', error);
        }
    };

    return (
        <div className="container">
            <h1>Text Translation Tool</h1>
            <nav>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
            </nav>
            <textarea className="input-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" rows="4" cols="50"></textarea>
            <br />
            <select className="dropdown" value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
            </select>
            <select className="dropdown" value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="en">English</option>
            </select>
            <br />
            <button className="translate-button" onClick={translateText}>Translate</button>
            <h2>Translated Text:</h2>
            <p className="translated-text">{translatedText}</p>
        </div>
    );
}

export default Home;
