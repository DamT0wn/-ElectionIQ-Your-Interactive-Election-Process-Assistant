const { Translate } = require('@google-cloud/translate').v2;

let translateClient = null;

function getTranslateClient() {
  if (!translateClient) {
    translateClient = new Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
  }
  return translateClient;
}

/**
 * Translate text to the target language.
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - BCP-47 target language code (e.g., 'es', 'fr')
 * @param {string|null} sourceLanguage - Source language (auto-detect if null)
 * @returns {Promise<{translatedText: string, detectedLanguage: string}>}
 */
async function translateText(text, targetLanguage, sourceLanguage = null) {
  const client = getTranslateClient();

  const options = { to: targetLanguage };
  if (sourceLanguage) options.from = sourceLanguage;

  const [translation, metadata] = await client.translate(text, options);

  return {
    translatedText: translation,
    detectedLanguage: metadata?.data?.translations?.[0]?.detectedSourceLanguage || sourceLanguage,
  };
}

/**
 * Detect the language of a piece of text.
 * @param {string} text
 * @returns {Promise<{language: string, confidence: number}>}
 */
async function detectLanguage(text) {
  const client = getTranslateClient();
  const [detections] = await client.detect(text);
  const detection = Array.isArray(detections) ? detections[0] : detections;
  return {
    language: detection.language,
    confidence: detection.confidence,
  };
}

/**
 * Get list of supported languages.
 * @returns {Promise<Array<{code: string, name: string}>>}
 */
async function getSupportedLanguages() {
  const client = getTranslateClient();
  const [languages] = await client.getLanguages();
  return languages.map((l) => ({ code: l.code, name: l.name }));
}

// Supported UI languages for the app
const SUPPORTED_UI_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', bcp47: 'en-US' },
  { code: 'es', name: 'Español', flag: '🇪🇸', bcp47: 'es-ES' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', bcp47: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', bcp47: 'de-DE' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', bcp47: 'hi-IN' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', bcp47: 'pt-BR' },
  { code: 'zh', name: '中文', flag: '🇨🇳', bcp47: 'zh-CN' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', bcp47: 'ar-XA' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', bcp47: 'ja-JP' },
];

module.exports = { translateText, detectLanguage, getSupportedLanguages, SUPPORTED_UI_LANGUAGES };
