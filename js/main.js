import { translateText } from './translateText.js';
import { fetchDeHetWord } from './fetchDeHetWord.js';
import { fetchImages } from './fetchImages.js';
import { fetchArticle } from './fetchArticle.js';
import { searchInput, loadingIndicator, targetLanguages } from './constants.js';
import { fetchMediawiki } from './fetchMediawiki.js';
import { fetchForms } from './fetchForms.js';

// Display loading indicator
function showLoadingIndicator() {
  loadingIndicator.style.display = 'block';
}

// Hide loading indicator
function hideLoadingIndicator() {
  loadingIndicator.style.display = 'none';
}

let isNavigating = false;

// Main function to orchestrate async functions
export async function main(sourceText, sourceLang) {
  showLoadingIndicator();
  // Ensure sourceText and sourceLang are properly defined
  if (!sourceText || !sourceLang) {
    console.error('Invalid sourceText or sourceLang');
    return;
  }
  if (!isNavigating) {
    history.pushState(
      { query: sourceText, lang: sourceLang },
      '',
      `?q=${sourceText}`
    );
  }
  try {
    for (const targetLang of targetLanguages) {
      await translateText(sourceText, sourceLang, targetLang);
    } 
    await fetchDeHetWord(sourceText, sourceLang),
    await fetchImages(sourceText, sourceLang),
    await fetchArticle(sourceText, sourceLang),
    await fetchMediawiki(sourceText, sourceLang);
    await fetchDeHetWord(sourceText, sourceLang);
    await fetchForms(sourceText, sourceLang);
    
    hideLoadingIndicator();
    isNavigating = false;
  } catch (error) {
    console.error(error);
    hideLoadingIndicator();
  }
}

// Event listener for popstate event
window.onpopstate = async function (event) {
  if (event.state) {
    const { query, lang } = event.state;
    searchInput.value = query;
    isNavigating = true;
    await main(query, lang); // Reuse the main function with the new query and lang
  }
};
