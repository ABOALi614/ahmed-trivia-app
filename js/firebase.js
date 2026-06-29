/**
 * ====================================================================
 * FIREBASE / FIRESTORE MODULE
 * ====================================================================
 * Saves a finished game's result to a Firestore collection.
 *
 * 🔑 SETUP — put your own keys below:
 *   1. Go to https://console.firebase.google.com → your project →
 *      Project settings → General → "Your apps" → Web app → SDK config.
 *   2. Copy the values into FIREBASE_CONFIG below.
 *   3. In Firestore (Build → Firestore Database) make sure a database
 *      exists, and set rules that allow writes to "playersData"
 *      (start in test mode while developing, lock down before shipping).
 *
 * What gets saved per finished game, and why each field is there:
 *   - playerName : the name typed on the welcome screen
 *   - finalScore : "x / total" — easy to read directly in the console
 *   - deviceInfo : readable browser/OS summary (see device.js) — this
 *                  is the same info any web server already logs
 *   - timestamp  : when the game was completed (Firestore serverTimestamp)
 *
 * Intentionally NOT collected: IP address, precise location, or ISP.
 * Those require either a permission prompt or collecting personal data
 * without telling the player it's happening — neither of which belongs
 * in a fun trivia game. If you want to add them later, the honest way
 * to do it is to say so on the welcome screen first (see the
 * `.privacy-note` line in index.html), then add the fields here.
 * ====================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 👇 Replace with your own Firebase project config
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAFzyykN0QBRkVo5jWHXCf4epRtwINQkpM",
  authDomain: "ahmed-trivia-6805d.firebaseapp.com",
  projectId: "ahmed-trivia-6805d",
  storageBucket: "ahmed-trivia-6805d.firebasestorage.app",
  messagingSenderId: "875855596412",
  appId: "1:875855596412:web:98b58cd7d00463e69bb2f9"
};

const COLLECTION_NAME = "playersData";

let db = null;
function getDb() {
  if (!db) {
    const app = initializeApp(FIREBASE_CONFIG);
    db = getFirestore(app);
  }
  return db;
}

/**
 * Saves one finished game to Firestore. Fails silently into the
 * console (never blocks or interrupts the end screen) so a missing
 * config or offline connection doesn't break the game for the player.
 *
 * @param {{ playerName: string, finalScore: string, deviceInfo: string }} result
 */
export async function saveGameResult(result) {
  try {
    await addDoc(collection(getDb(), COLLECTION_NAME), {
      ...result,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    // Intentionally non-blocking — see comment above.
    console.warn("لم يتم حفظ النتيجة في Firebase:", err);
  }
}
