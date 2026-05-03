const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');

let speechClient = null;
let ttsClient = null;

function getSpeechClient() {
  if (!speechClient) {
    speechClient = new speech.SpeechClient();
  }
  return speechClient;
}

function getTTSClient() {
  if (!ttsClient) {
    ttsClient = new textToSpeech.TextToSpeechClient();
  }
  return ttsClient;
}

/**
 * Transcribe audio buffer to text using Google Cloud Speech-to-Text.
 * @param {Buffer} audioBuffer - Raw audio data
 * @param {string} languageCode - BCP-47 language code (e.g., 'en-US')
 * @param {string} encoding - Audio encoding (e.g., 'WEBM_OPUS', 'LINEAR16')
 * @param {number} sampleRateHertz - Sample rate (e.g., 48000)
 * @returns {Promise<string>} Transcribed text
 */
async function transcribeAudio(
  audioBuffer,
  languageCode = 'en-US',
  encoding = 'WEBM_OPUS',
  sampleRateHertz = 48000,
) {
  const client = getSpeechClient();

  const request = {
    audio: { content: audioBuffer.toString('base64') },
    config: {
      encoding,
      sampleRateHertz,
      languageCode,
      enableAutomaticPunctuation: true,
      model: 'latest_long',
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join(' ');

  return transcription || '';
}

/**
 * Synthesize text to speech using Google Cloud Text-to-Speech.
 * @param {string} text - Text to synthesize
 * @param {string} languageCode - BCP-47 language code (e.g., 'en-US')
 * @param {string} voiceName - Voice name (optional)
 * @returns {Promise<Buffer>} MP3 audio buffer
 */
async function synthesizeSpeech(text, languageCode = 'en-US', voiceName = null) {
  const client = getTTSClient();

  const request = {
    input: { text },
    voice: {
      languageCode,
      name: voiceName || getVoiceForLanguage(languageCode),
      ssmlGender: 'NEUTRAL',
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      pitch: 0.0,
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
}

/**
 * Map a language code to a preferred voice name.
 * @param {string} languageCode
 * @returns {string} Voice name
 */
function getVoiceForLanguage(languageCode) {
  const voiceMap = {
    'en-US': 'en-US-Neural2-F',
    'es-ES': 'es-ES-Neural2-A',
    'fr-FR': 'fr-FR-Neural2-A',
    'de-DE': 'de-DE-Neural2-A',
    'hi-IN': 'hi-IN-Neural2-A',
    'pt-BR': 'pt-BR-Neural2-A',
    'zh-CN': 'cmn-CN-Wavenet-A',
    'ar-XA': 'ar-XA-Wavenet-A',
    'ja-JP': 'ja-JP-Neural2-B',
  };
  return voiceMap[languageCode] || 'en-US-Neural2-F';
}

module.exports = { transcribeAudio, synthesizeSpeech, getVoiceForLanguage };
