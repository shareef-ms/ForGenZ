import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TopicInputPage from './components/TopicInputPage';
import OutlinePage from './components/OutlinePage';
import SlideBuilderPage from './components/SlideBuilderPage';
import ExportPage from './components/ExportPage';
import MyDecksPage from './components/MyDecksPage';
import './index.css';

function App() {
  const [page, setPage] = useState('landing');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('academic');
  const [slideCount, setSlideCount] = useState(10);
  const [detail, setDetail] = useState('detailed');
  const [outline, setOutline] = useState([]);
  const [slides, setSlides] = useState([]);
  const [deckTitle, setDeckTitle] = useState('');
  const [speakerNotes, setSpeakerNotes] = useState({});
  const [decks, setDecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('forgenz-decks') || '[]'); } catch { return []; }
  });

  function saveDecks(newDecks) {
    setDecks(newDecks);
    try { localStorage.setItem('forgenz-decks', JSON.stringify(newDecks)); } catch {}
  }

  function saveDeck(title, slides, notes) {
    const newDeck = {
      id: Date.now(),
      title,
      slides,
      notes,
      createdAt: new Date().toISOString(),
      slideCount: slides.length,
    };
    const updated = [newDeck, ...decks].slice(0, 20);
    saveDecks(updated);
  }

  const nav = {
    toLanding: () => setPage('landing'),
    toTopic: () => setPage('topic'),
    toOutline: (t, s, sc, d) => {
      setTopic(t); setStyle(s); setSlideCount(sc); setDetail(d);
      setPage('outline');
    },
    toBuilder: (outlineData, slidesData, title, notes) => {
      setOutline(outlineData);
      setSlides(slidesData);
      setDeckTitle(title);
      setSpeakerNotes(notes || {});
      setPage('builder');
    },
    toExport: (slidesData, title, notes) => {
      setSlides(slidesData);
      setDeckTitle(title);
      setSpeakerNotes(notes || {});
      saveDeck(title, slidesData, notes || {});
      setPage('export');
    },
    toMyDecks: () => setPage('mydecks'),
    toBuilder2: () => setPage('builder'),
  };

  if (page === 'landing') return <LandingPage nav={nav} />;
  if (page === 'topic') return <TopicInputPage nav={nav} />;
  if (page === 'outline') return <OutlinePage nav={nav} topic={topic} style={style} slideCount={slideCount} detail={detail} />;
  if (page === 'builder') return <SlideBuilderPage nav={nav} slides={slides} setSlides={setSlides} deckTitle={deckTitle} speakerNotes={speakerNotes} setSpeakerNotes={setSpeakerNotes} />;
  if (page === 'export') return <ExportPage nav={nav} slides={slides} deckTitle={deckTitle} speakerNotes={speakerNotes} />;
  if (page === 'mydecks') return <MyDecksPage nav={nav} decks={decks} />;

  return <LandingPage nav={nav} />;
}

export default App;