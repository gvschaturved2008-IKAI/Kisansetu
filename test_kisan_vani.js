/**
 * Automated Verification Script for Task 05: Kisan Vani Multilingual AI Farmer Assistant
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("==================================================");
console.log("🧪 TESTING KISAN VANI MULTILINGUAL ASSISTANT");
console.log("==================================================");

// Mock DOM / Browser environment for Node test execution
global.requestAnimationFrame = (cb) => { if (typeof cb === 'function') cb(); };
global.SpeechSynthesisUtterance = function(text) { this.text = text; };
global.window = {
    addEventListener: () => {},
    requestAnimationFrame: (cb) => { if (typeof cb === 'function') cb(); },
    SpeechSynthesisUtterance: function(text) { this.text = text; },
    speechSynthesis: {
        speak: () => {},
        cancel: () => {},
        getVoices: () => []
    },
    SpeechRecognition: function() {}
};
global.document = {
    addEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ 
        classList: { add: () => {}, remove: () => {} }, 
        appendChild: () => {}, 
        style: {},
        querySelector: () => ({ onclick: null }),
        querySelectorAll: () => []
    }),
    body: { appendChild: () => {} }
};
global.BroadcastChannel = function() {
    return {
        postMessage: () => {},
        close: () => {},
        onmessage: null
    };
};
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

// Mock Application State & Globals
global.currentBooking = {
    id: "KS748291",
    token: "07",
    farmerName: "Ramesh Kumar",
    farmerId: "KS102458",
    crop: "Paddy / Rice",
    quantity: 21.5,
    date: "Tomorrow",
    time: "10:30 AM",
    centre: "AP State Procurement Centre, Guntur Yard",
    stage: "Gross Weighbridge",
    stageCode: "gross_weighing",
    status: "Verified",
    moisture: "13.5% (Grade A)",
    amount: "₹49,450"
};

global.yardQueueData = [
    { id: "KS-04", token: "04", farmerName: "Narasimha Rao", status: "Gross Weighing", stageCode: "gross_weighing" },
    { id: "KS-05", token: "05", farmerName: "K. Satyam", status: "Quality Check", stageCode: "quality_check" },
    { id: "KS-06", token: "06", farmerName: "V. Krishna", status: "Gate Pass Verified", stageCode: "gate_verified" },
    { id: "KS748291", token: "07", farmerName: "Ramesh Kumar", status: "Verified", stageCode: "gross_weighing" }
];

global.KisanGrainAI = {
    getRecordForBooking: (id) => ({
        inspectionId: "QC-TEST-01",
        bookingId: "KS748291",
        tokenId: "07",
        farmerId: "KS102458",
        overallScore: 84,
        grade: "Grade A+ (Premium FAQ)",
        moisture: "12.8%",
        foreignMatter: "0.6%",
        officerDecision: "APPROVE"
    })
};

global.KisanNotifications = {
    getNotifications: () => [
        { id: 1, title: "Quality Inspection Approved", message: "Token #07 grain lot approved with Grade A+.", read: false }
    ],
    getUnreadCount: () => 1
};

global.getCurrentUser = () => ({ role: "farmer", name: "Ramesh Kumar", farmerId: "KS102458" });

// Load script.js
let scriptCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf-8');
scriptCode = scriptCode
    .replace('const KisanVani =', 'global.KisanVani =')
    .replace('const KisanGrainAI =', 'global.KisanGrainAI =')
    .replace('const KisanNotifications =', 'global.KisanNotifications =')
    .replace('let yardQueueData =', 'global.yardQueueData =')
    .replace('let currentBooking =', 'global.currentBooking =');

eval(scriptCode);

// Set test fixtures after script.js initialization
global.yardQueueData = [
    { id: "KS-04", token: "04", farmerName: "Narasimha Rao", status: "Gross Weighing", stageCode: "gross_weighing" },
    { id: "KS-05", token: "05", farmerName: "K. Satyam", status: "Quality Check", stageCode: "quality_check" },
    { id: "KS-06", token: "06", farmerName: "V. Krishna", status: "Gate Pass Verified", stageCode: "gate_verified" },
    { id: "KS748291", token: "07", farmerName: "Ramesh Kumar", status: "Verified", stageCode: "gross_weighing" }
];

if (typeof KisanNotifications !== "undefined" && typeof KisanNotifications.addNotification === "function") {
    KisanNotifications.addNotification({
        type: "QUALITY_APPROVED",
        title: "Quality Inspection Approved",
        message: "Token #07 grain lot approved with Grade A+.",
        targetRole: "farmer",
        icon: "fa-circle-check"
    });
}

console.log("✓ KisanVani initialized successfully.");

// 1. Test Context Retrieval & Safety
console.log("\n[TEST 1] Testing Farmer Context Retrieval & Privacy Safety...");
const ctx = KisanVani.buildFarmerContext();
assert.strictEqual(ctx.bookingId, "KS748291", "Booking ID matches");
assert.strictEqual(ctx.token, "07", "Token matches");
assert.strictEqual(ctx.queuePosition, 4, "Queue position calculated from yardQueueData");
assert.strictEqual(ctx.farmersAhead, 3, "Farmers ahead calculated");
assert.strictEqual(ctx.unreadCount, 1, "Unread notifications connected");
assert(ctx.qualityRecord !== null, "Quality record connected");

// Verify sensitive fields are NOT exposed
assert.strictEqual(ctx.password, undefined, "No passwords in context");
assert.strictEqual(ctx.bankAccount, undefined, "No raw bank account in context");
assert.strictEqual(ctx.aadhaar, undefined, "No raw Aadhaar in context");
console.log("✓ Context successfully extracted from live state without leaking sensitive PII.");

// 2. Test Intent Detection across EN, TE, HI
console.log("\n[TEST 2] Testing Multilingual Intent Detection Layer...");
const intentTests = [
    // English
    { q: "What is my queue position?", lang: "en", expected: "QUEUE_STATUS" },
    { q: "Show my gate pass QR", lang: "en", expected: "QR_HELP" },
    { q: "What is my grain quality inspection status?", lang: "en", expected: "QUALITY_STATUS" },
    { q: "Has my payment been processed?", lang: "en", expected: "PAYMENT_STATUS" },
    { q: "When is my slot timing?", lang: "en", expected: "SLOT_INFORMATION" },
    { q: "Where is my procurement centre located?", lang: "en", expected: "CENTRE_INFORMATION" },
    { q: "How do I contact support or file a grievance?", lang: "en", expected: "GRIEVANCE_HELP" },
    { q: "Hello Kisan Vani", lang: "en", expected: "GENERAL_HELP" },

    // Telugu
    { q: "నా క్యూ పొజిషన్ ఎంత?", lang: "te", expected: "QUEUE_STATUS" },
    { q: "నా QR పాస్ చూపించు", lang: "te", expected: "QR_HELP" },
    { q: "నా నాణ్యత తనిఖీ రిపోర్ట్ ఎలా ఉంది?", lang: "te", expected: "QUALITY_STATUS" },
    { q: "నా పేమెంట్ మరియు బ్యాంక్ జమ అయిందా?", lang: "te", expected: "PAYMENT_STATUS" },
    { q: "నా స్లాట్ తేదీ మరియు సమయం ఎప్పుడు?", lang: "te", expected: "SLOT_INFORMATION" },
    { q: "సేకరణ కేంద్రం ఎక్కడ ఉంది?", lang: "te", expected: "CENTRE_INFORMATION" },
    { q: "సహాయం మరియు మద్దతు కోసం ఎవరిని సంప్రదించాలి?", lang: "te", expected: "GRIEVANCE_HELP" },
    { q: "నమస్కారం", lang: "te", expected: "GENERAL_HELP" },

    // Hindi
    { q: "मेरी कतार में स्थिति क्या है?", lang: "hi", expected: "QUEUE_STATUS" },
    { q: "मेरा डिजिटल QR पास दिखाएं", lang: "hi", expected: "QR_HELP" },
    { q: "मेरी अनाज गुणवत्ता जांच और नमी की स्थिति क्या है?", lang: "hi", expected: "QUALITY_STATUS" },
    { q: "क्या मेरा डीबीटी भुगतान हो गया है?", lang: "hi", expected: "PAYMENT_STATUS" },
    { q: "मेरा खरीद स्लॉट कब और किस तारीख को है?", lang: "hi", expected: "SLOT_INFORMATION" },
    { q: "खरीद मंडी केंद्र कहाँ स्थित है?", lang: "hi", expected: "CENTRE_INFORMATION" },
    { q: "सहायता केंद्र या अधिकारी से संपर्क कैसे करें?", lang: "hi", expected: "GRIEVANCE_HELP" },
    { q: "नमस्ते किसान वाणी", lang: "hi", expected: "GENERAL_HELP" },

    // Unsupported
    { q: "Who won the cricket world cup in 1983?", lang: "en", expected: "UNKNOWN" }
];

let intentPassCount = 0;
for (const test of intentTests) {
    const detected = KisanVani.detectIntent(test.q, test.lang);
    assert.strictEqual(detected, test.expected, `Expected '${test.expected}' for "${test.q}" but got '${detected}'`);
    intentPassCount++;
}
console.log(`✓ Passed all ${intentPassCount} intent recognition test cases across EN, TE, HI.`);

// 3. Test Response Generation & Action Buttons
console.log("\n[TEST 3] Testing Deterministic State-Driven Response Generation & Action Buttons...");

// English Queue
const resQueueEn = KisanVani.generateResponse("QUEUE_STATUS", "What is my queue position?", "en", ctx);
assert(resQueueEn.text.includes("#4 in the queue"), "English response has position #4");
assert(resQueueEn.text.includes("3 farmer(s) ahead"), "English response has 3 ahead");
assert(resQueueEn.actions.length > 0 && resQueueEn.actions[0].onclick === "openTracker()", "Actionable Track button present");
console.log("  [EN Queue Response]:", resQueueEn.text);

// Telugu QR
const resQrTe = KisanVani.generateResponse("QR_HELP", "నా QR పాస్ చూపించు", "te", ctx);
assert(resQrTe.text.includes("KS748291") && resQrTe.text.includes("07"), "Telugu response includes booking ID & token");
assert(resQrTe.actions.some(a => a.onclick === "openFarmerQRModal()"), "Actionable Show QR button present");
console.log("  [TE QR Response]:", resQrTe.text);

// Hindi Quality (with record)
const qualityRecordFixture = {
    inspectionId: "QC-TEST-01",
    bookingId: "KS748291",
    tokenId: "07",
    farmerId: "KS102458",
    overallScore: 84,
    grade: "Grade A+ (Premium FAQ)",
    moisture: "12.8%",
    foreignMatter: "0.6%",
    officerDecision: "APPROVE"
};
const ctxWithQuality = { ...ctx, qualityRecord: qualityRecordFixture };
const resQualityHi = KisanVani.generateResponse("QUALITY_STATUS", "गुणवत्ता जांच स्थिति", "hi", ctxWithQuality);
assert(resQualityHi.text.includes("Grade A+ (Premium FAQ)"), "Hindi response includes live AI grade");
assert(resQualityHi.actions.some(a => a.onclick === "openFarmerQualityModal()"), "Actionable Quality modal button present");
console.log("  [HI Quality Response (Completed)]:", resQualityHi.text);

// English Quality (Pending case)
const ctxWithoutQuality = { ...ctx, qualityRecord: null };
const resQualityPendingEn = KisanVani.generateResponse("QUALITY_STATUS", "What is my quality status?", "en", ctxWithoutQuality);
assert(resQualityPendingEn.text.includes("in progress") || resQualityPendingEn.text.includes("stage"), "Quality pending message generated");
console.log("  [EN Quality Response (Pending)]:", resQualityPendingEn.text);

// Unknown fallback
const resUnknown = KisanVani.generateResponse("UNKNOWN", "random question", "en", ctx);
assert(resUnknown.text.includes("don't have enough specific information"), "Graceful unknown fallback message");
console.log("  [Fallback Response]:", resUnknown.text);

// 5. Test History Persistence & Clear History
console.log("\n[TEST 5] Testing Conversation History Persistence & LocalStorage...");
KisanVani.clearHistory();
assert.strictEqual(localStorage.getItem("kisanVaniChatHistory"), null, "History cleared from storage");

// Simulate sending a message
KisanVani.sendMessage("What is my queue position?");
const savedHistoryRaw = localStorage.getItem("kisanVaniChatHistory");
assert(savedHistoryRaw !== null, "Chat history saved to localStorage");
const savedHistory = JSON.parse(savedHistoryRaw);
assert(savedHistory.length >= 1, "Chat history contains message entries");
assert.strictEqual(savedHistory[savedHistory.length - 1].sender, "user", "User message persisted");
assert.strictEqual(savedHistory[savedHistory.length - 1].text, "What is my queue position?", "User query text persisted");
console.log("✓ Conversation history successfully stored and retrieved from localStorage.");

// 6. Test Language Switcher
console.log("\n[TEST 6] Testing Language Switcher API...");
KisanVani.setLanguage("te");
KisanVani.setLanguage("hi");
KisanVani.setLanguage("en");
console.log("✓ Language switching validated without exceptions.");

// 7. Full Matrix Test for All Intents in English, Telugu, Hindi
console.log("\n[TEST 7] Testing Full Response Generation Matrix (11 intents x 3 languages)...");
const allIntents = [
    "QUEUE_STATUS", "QR_HELP", "QUALITY_STATUS", "PAYMENT_STATUS",
    "SLOT_INFORMATION", "BOOKING_STATUS", "PROCUREMENT_STATUS",
    "NOTIFICATIONS", "CENTRE_INFORMATION", "GRIEVANCE_HELP", "GENERAL_HELP"
];
const languages = ["en", "te", "hi"];

for (const intent of allIntents) {
    for (const lang of languages) {
        const generated = KisanVani.generateResponse(intent, "query", lang, ctxWithQuality);
        assert(generated && typeof generated.text === "string" && generated.text.length > 5, `Valid text response generated for ${intent} in ${lang}`);
        assert(Array.isArray(generated.actions), `Actions array present for ${intent} in ${lang}`);
    }
}
console.log("✓ Verified 33/33 response matrix permutations across all supported languages & intents.");

console.log("\n==================================================");
console.log("🎉 ALL KISAN VANI TESTS COMPLETED & PASSED (100%)");
console.log("==================================================");
