/**
 * DIECI Italian A1 Course - Audio Player
 * Uses pre-generated base64 audio from audio/audio-data.js
 * Falls back to Web Speech API if audio data is not available
 */

// Audio cache for loaded Audio objects
const audioCache = {};

/**
 * Play pre-recorded audio for a given word/phrase
 * @param {string} text - The word or phrase to pronounce
 */
function speak(text) {
  const normalized = text.toLowerCase().trim();

  // Try base64 audio if data is loaded
  if (typeof AUDIO_MAP !== 'undefined' && typeof AUDIO_DATA !== 'undefined') {
    const key = AUDIO_MAP[normalized] || AUDIO_MAP[text];
    if (key && AUDIO_DATA[key]) {
      playBase64Audio(AUDIO_DATA[key]);
      return;
    }
    if (AUDIO_DATA[normalized]) {
      playBase64Audio(AUDIO_DATA[normalized]);
      return;
    }
    const fallbackKey = normalized.replace(/[^a-z0-9']/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    if (AUDIO_DATA[fallbackKey]) {
      playBase64Audio(AUDIO_DATA[fallbackKey]);
      return;
    }
  }

  // Fallback: use Web Speech API
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text || normalized);
    utterance.lang = 'it-IT';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }
}

/**
 * Play audio from a base64 data URI
 */
function playBase64Audio(dataUri) {
  // Check cache first
  if (audioCache[dataUri]) {
    audioCache[dataUri].currentTime = 0;
    audioCache[dataUri].play().catch(() => {});
    return;
  }

  const audio = new Audio(dataUri);
  audioCache[dataUri] = audio;
  audio.play().catch(() => {});
}
