import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const numberToFrench = [
  'zéro',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
  'dix',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze',
  'seize',
  'dix-sept',
  'dix-huit',
  'dix-neuf',
  'vingt',
  'vingt et un',
  'vingt-deux',
  'vingt-trois',
  'vingt-quatre',
  'vingt-cinq',
  'vingt-six',
  'vingt-sept',
  'vingt-huit',
  'vingt-neuf',
  'trente',
  'trente et un',
  'trente-deux',
  'trente-trois',
  'trente-quatre',
  'trente-cinq',
  'trente-six',
  'trente-sept',
  'trente-huit',
  'trente-neuf',
  'quarante',
  'quarante et un',
  'quarante-deux',
  'quarante-trois',
  'quarante-quatre',
  'quarante-cinq',
  'quarante-six',
  'quarante-sept',
  'quarante-huit',
  'quarante-neuf',
  'cinquante',
  'cinquante et un',
  'cinquante-deux',
  'cinquante-trois',
  'cinquante-quatre',
  'cinquante-cinq',
  'cinquante-six',
  'cinquante-sept',
  'cinquante-huit',
  'cinquante-neuf',
];

function getMinuteWord(minute) {
  if ([1, 21, 31, 41, 51].includes(minute)) {
    return numberToFrench[minute].replace(/\bun\b/, 'une');
  }
  return numberToFrench[minute];
}

function getHourWord(hour) {
  if (hour === 0) return 'minuit';
  if (hour === 12) return 'midi';
  if (hour === 1) return 'une heure';
  if (hour === 21) return 'vingt et une heures';
  return `${numberToFrench[hour]} heures`;
}

export function timeToFrenchVariants(hour, minute) {
  const variants = new Set();
  const nextHour = (hour + 1) % 24;

  const hourStr = getHourWord(hour);
  const minuteStr = getMinuteWord(minute);
  const nextHourStr = getHourWord(nextHour);

  if (minute === 0) {
    variants.add(hourStr);
    if (hour === 12) variants.add('douze heures');
  } else if (minute === 15) {
    variants.add(`${hourStr} et quart`);
    variants.add(`${hourStr} quinze`);
    if (hour === 12) variants.add('douze heures quinze');
  } else if (minute === 30) {
    const demie = 'et demie';
    variants.add(`${hourStr} ${demie}`);
    variants.add(`${hourStr} trente`);
    if (hour === 12) {
      variants.add('douze heures trente');
      variants.add('midi et demi');
    }
  } else if (minute === 45) {
    const minus = getMinuteWord(60 - minute);
    variants.add(`${nextHourStr} moins ${minus}`);
    variants.add(`${nextHourStr} moins le quart`);
    variants.add(`${getHourWord(hour)} quarante-cinq`);
    if (hour === 12) variants.add('douze heures quarante-cinq');
  } else if (
    [35, 40, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].includes(minute)
  ) {
    const minus = getMinuteWord(60 - minute);
    variants.add(`${nextHourStr} moins ${minus}`);
    if (nextHour === 12) variants.add(`douze heures moins ${minus}`);
    variants.add(`${getHourWord(hour)} ${minuteStr}`);
    if (hour === 12) variants.add(`douze heures ${minuteStr}`);
  } else {
    variants.add(`${getHourWord(hour)} ${minuteStr}`);
    if (hour === 12) variants.add(`douze heures ${minuteStr}`);
  }

  return [...variants];
}

function App() {
  const [current, setCurrent] = useState({ hour: null, minute: null });
  const [inputHour, setInputHour] = useState('');
  const [inputMinute, setInputMinute] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentVariant, setCurrentVariant] = useState('');
  const [revealed, setRevealed] = useState([]);
  const [started, setStarted] = useState(false);

  const minuteInputRef = useRef(null);
  const hourInputRef = useRef(null);
  const frenchVoice = useRef(null);

  useEffect(() => {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      frenchVoice.current = voices.find((v) => v.lang.startsWith('fr'));
    };
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
  }, []);

  const speak = (hour, minute, variant = null) => {
    window.speechSynthesis.cancel();
    const variants = timeToFrenchVariants(hour, minute);
    const toSpeak =
      variant || variants[Math.floor(Math.random() * variants.length)];
    const utterance = new SpeechSynthesisUtterance(toSpeak);
    utterance.lang = 'fr-FR';
    utterance.voice = frenchVoice.current;
    window.speechSynthesis.speak(utterance);
  };

  const generateNew = () => {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60); // any minute 0-59
    const variants = timeToFrenchVariants(hour, minute);
    const chosenVariant = variants[Math.floor(Math.random() * variants.length)];
    setCurrent({ hour, minute });
    setCurrentVariant(chosenVariant);
    setInputHour('');
    setInputMinute('');
    speak(hour, minute, chosenVariant);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Parse input fields
    const hour = Number(inputHour);
    const minute = Number(inputMinute);
    const correct =
      hour % 12 === current.hour % 12 && minute % 12 === current.minute % 12;
    setTotal(total + 1);

    setRevealed((prev) => [
      ...prev,
      {
        hour: current.hour,
        minute: current.minute,
        variants: timeToFrenchVariants(current.hour, current.minute),
        correct,
      },
    ]);

    if (correct) {
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) setBestStreak(streak + 1);
      generateNew();
    } else {
      setStreak(0);
      generateNew();
    }
    setInputHour('');
    setInputMinute('');
    hourInputRef.current.focus();
  };

  const handleReveal = () => {
    setRevealed((prev) => [
      ...prev,
      {
        hour: current.hour,
        minute: current.minute,
        variants: timeToFrenchVariants(current.hour, current.minute),
        correct: null,
      },
    ]);
    generateNew();
  };

  const handleClearRevealed = () => {
    setRevealed([]);
    setStreak(0);
    setBestStreak(0);
    setTotal(0);
    setInputHour('');
    setInputMinute('');
  };

  const handleStart = () => {
    setStarted(true);
    generateNew();
  };

  return (
    <div className='app'>
      {!started ? (
        <button
          onClick={handleStart}
          style={{ fontSize: '1.5em', padding: '1em 2em', marginTop: 40 }}
        >
          Start
        </button>
      ) : (
        <>
          <div className='scoreboard'>
            <span>
              Streak:{' '}
              <b style={{ color: streak > 0 ? 'green' : 'red' }}>{streak}</b>
            </span>
            <span>
              Best streak: <b>{bestStreak}</b>
            </span>
            <span>Total: {total}</span>
          </div>

          <form
            onSubmit={handleSubmit}
            className='answer-form'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
            }}
          >
            <input
              type='number'
              min='0'
              max='23'
              placeholder='hh'
              value={inputHour}
              ref={hourInputRef}
              onChange={(e) => {
                const val = e.target.value;
                setInputHour(val);
                if (val.length === 2 && minuteInputRef.current) {
                  minuteInputRef.current.focus();
                }
              }}
              onKeyDown={(e) => {
                if (
                  (e.key === 'Enter' || e.key === 'Tab') &&
                  minuteInputRef.current
                ) {
                  e.preventDefault();
                  minuteInputRef.current.focus();
                }
              }}
              style={{ width: 30, margin: 0 }}
              inputMode='numeric'
              pattern='[0-9]*'
              className='no-spinner'
            />
            <span>:</span>
            <input
              type='number'
              min='0'
              max='59'
              placeholder='mm'
              value={inputMinute}
              onChange={(e) => {
                let val = e.target.value;
                setInputMinute(val);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'Backspace' &&
                  inputMinute.length === 0 &&
                  minuteInputRef.current
                ) {
                  e.preventDefault();
                  hourInputRef.current.focus();
                }
              }}
              ref={minuteInputRef}
              style={{ width: 30, margin: 0 }}
              inputMode='numeric'
              pattern='[0-9]*'
              className='no-spinner'
            />
            <button
              type='submit'
              style={{ marginLeft: 10 }}
            >
              Submit
            </button>
          </form>

          <div className='buttons'>
            <button
              onClick={() =>
                speak(current.hour, current.minute, currentVariant)
              }
            >
              Replay
            </button>
            <button
              type='button'
              onClick={handleReveal}
            >
              Reveal
            </button>
            <button
              type='button'
              onClick={handleClearRevealed}
            >
              Clear
            </button>
          </div>

          <div className='revealed-list'>
            {revealed
              .slice()
              .reverse()
              .map((item, idx) => (
                <div
                  key={idx}
                  className='answer-reveal'
                  style={{
                    color: item.correct ? undefined : 'red',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    marginBottom: 8,
                    padding: 8,
                    background: item.correct ? '#f9f9f9' : '#ffeaea',
                  }}
                >
                  <b>
                    {item.hour}:{item.minute.toString().padStart(2, '0')}
                  </b>
                  <ul>
                    {item.variants.map((variant, vIdx) => (
                      <li key={vIdx}>
                        <button
                          type='button'
                          onClick={() => speak(item.hour, item.minute, variant)}
                          style={{ marginRight: 8 }}
                        >
                          🔊
                        </button>
                        {variant}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
