/**
 * test_smart_slot.js
 * Comprehensive automated verification script for Task 06:
 * AI-Assisted Smart Procurement Slot Recommendation and Mandi Congestion Prediction.
 */

const fs = require('fs');
const path = require('path');

console.log("================================================================================");
console.log("  KISAN SETU — TASK 06 AUTOMATED VERIFICATION SUITE");
console.log("  AI-Assisted Smart Procurement Slot Recommendation & Mandi Congestion Prediction");
console.log("================================================================================\n");

// Setup mock DOM & Browser environment
const localStorageData = {};
global.localStorage = {
    getItem: (k) => localStorageData[k] || null,
    setItem: (k, v) => { localStorageData[k] = String(v); },
    removeItem: (k) => { delete localStorageData[k]; },
    clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

global.window = {
    location: { reload: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    BroadcastChannel: class {
        constructor(name) { this.name = name; }
        postMessage(msg) {}
        close() {}
    }
};

global.document = {
    getElementById: (id) => ({
        innerHTML: "",
        textContent: "",
        style: {},
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        value: "2026-09-21",
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {}
    }),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({
        id: "",
        className: "",
        innerHTML: "",
        style: {},
        appendChild: () => {},
        addEventListener: () => {}
    }),
    body: {
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    },
    addEventListener: () => {}
};

const vm = require('vm');
// Load script.js in Node context
const scriptCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Evaluate script.js in this context
vm.runInThisContext(scriptCode);

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details) {
    if (condition) {
        console.log(`  ✓ PASS: ${testName}`);
        if (details) console.log(`    ↳ ${details}`);
        passedTests++;
    } else {
        console.error(`  ✗ FAIL: ${testName}`);
        if (details) console.error(`    ↳ ${details}`);
        failedTests++;
    }
}

// -----------------------------------------------------------------------------
// TEST SUITE 1: Explainable Congestion Engine Core Math & Logic
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 1] Congestion Engine Math & Deterministic Scoring");

// Test 1.1: Standard Operating Slots Definition
assert(
    typeof KisanCongestionAI !== "undefined" && Array.isArray(KisanCongestionAI.STANDARD_SLOTS) && KisanCongestionAI.STANDARD_SLOTS.length === 5,
    "Standard Operating Slots Available",
    `Configured ${KisanCongestionAI.STANDARD_SLOTS.length} slots from 09:00 AM to 05:00 PM`
);

// Test 1.2: Slot Congestion Calculation for 02:30 PM slot (Low Congestion Window)
const lowSlot = KisanCongestionAI.calculateSlotCongestion(
    "AP State Procurement Centre (Yard 1)",
    "2026-09-21",
    "02:30 PM",
    "Wheat",
    25
);

assert(
    lowSlot.congestionLevel === "LOW" && lowSlot.waitMins >= 15 && lowSlot.waitMins <= 30,
    "Low Load Slot Classification",
    `Level: ${lowSlot.congestionLevel}, Wait: ${lowSlot.waitMins}m, Util: ${lowSlot.utilizationPct}%, Score: ${lowSlot.compositeScore}`
);

// Test 1.3: Slot Congestion Calculation for 09:00 AM slot (Medium Intake Window)
const medSlot = KisanCongestionAI.calculateSlotCongestion(
    "AP State Procurement Centre (Yard 1)",
    "2026-09-21",
    "09:00 AM",
    "Paddy",
    30
);

assert(
    medSlot.congestionLevel === "LOW" || medSlot.congestionLevel === "MEDIUM",
    "Medium/Moderate Load Slot Classification",
    `Level: ${medSlot.congestionLevel}, Wait: ${medSlot.waitMins}m, Util: ${medSlot.utilizationPct}%, Score: ${medSlot.compositeScore}`
);

// Test 1.4: Slot Congestion Calculation for 12:00 PM slot (Mid-Day Peak Bottleneck)
const highSlot = KisanCongestionAI.calculateSlotCongestion(
    "AP State Procurement Centre (Yard 1)",
    "2026-09-21",
    "12:00 PM",
    "Cotton",
    50
);

assert(
    highSlot.congestionLevel === "MEDIUM" || highSlot.congestionLevel === "HIGH",
    "Peak Midday Slot Classification",
    `Level: ${highSlot.congestionLevel}, Wait: ${highSlot.waitMins}m, Util: ${highSlot.utilizationPct}%, Score: ${highSlot.compositeScore}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 2: Multi-Slot Recommendation & Ranking
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 2] Multi-Slot Recommendation & Explainable Ranking");

// Tomorrow date for testing
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dateStr = tomorrow.toISOString().split("T")[0];

const recResult = KisanCongestionAI.recommendProcurementSlot({
    crop: "Wheat",
    quantity: 35,
    centre: "AP State Procurement Centre (Yard 1)",
    date: dateStr
});

assert(recResult.success === true, "Valid Date Validation Passed", `Requested date: ${dateStr}`);
assert(recResult.recommended !== null, "Recommended Slot Identified", `Top slot: ${recResult.recommended.timeSlot} (Score: ${recResult.recommended.compositeScore})`);
assert(recResult.alternative !== null, "Alternative Slot Identified", `Alternative: ${recResult.alternative.timeSlot}`);
assert(recResult.avoid !== null, "Avoid/Peak Bottleneck Slot Identified", `Bottleneck: ${recResult.avoid.timeSlot}`);

// Verify explainable reasons
assert(
    Array.isArray(recResult.recommended.whyBullets) && recResult.recommended.whyBullets.length >= 2,
    "Explainable Reasoning Generated",
    `Reasons: "${recResult.recommended.whyBullets.map(b => b.text).join('; ')}"`
);

// Verify past date rejection
const pastResult = KisanCongestionAI.recommendProcurementSlot({
    crop: "Paddy",
    date: "2020-01-01"
});

assert(
    pastResult.success === false && pastResult.error === "PAST_DATE",
    "Past Date Error Handling",
    `Rejection Message: "${pastResult.message}"`
);

// -----------------------------------------------------------------------------
// TEST SUITE 3: Direct Smart Slot Booking Execution
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 3] Smart Slot Direct Booking Execution");

const testSlotTime = "09:00 AM";
const testCrop = "Paddy / Rice";
const testQty = 28;
const testCentre = "AP State Procurement Centre (Yard 1)";

// Execute smart booking: (crop, quantity, centre, date, time)
KisanCongestionAI.bookRecommendedSlot(testCrop, testQty, testCentre, dateStr, testSlotTime);

// Validate updated global state
assert(
    typeof currentBooking !== "undefined" && currentBooking.status === "Confirmed" && currentBooking.time === testSlotTime,
    "currentBooking Updated with Smart Slot Details",
    `Booking ID: ${currentBooking.id}, Crop: ${currentBooking.crop}, Time: ${currentBooking.time}`
);

assert(
    Array.isArray(bookingHistory) && bookingHistory.some(b => b.time === testSlotTime && b.crop === testCrop),
    "bookingHistory Records New Smart Booking",
    `Latest History Entry: ${bookingHistory[0].id} (${bookingHistory[0].token})`
);

assert(
    Array.isArray(yardQueueData) && yardQueueData.some(y => y.time === testSlotTime && y.crop === testCrop),
    "yardQueueData Updated with Live Gate Pass Entry",
    `Yard Queue Head: Token #${yardQueueData[0].token} (${yardQueueData[0].gatePassId})`
);

// -----------------------------------------------------------------------------
// TEST SUITE 4: Kisan Vani AI Assistant SMART_SLOT Intent Integration
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 4] Kisan Vani Assistant Multilingual Smart Slot Intent");

// Test 4.1: English intent
const vaniRespEn = KisanVani.generateResponse("Which slot has the least waiting time?", "en");
assert(
    vaniRespEn.intent === "SMART_SLOT" && vaniRespEn.text.includes("recommended"),
    "English Smart Slot Intent Detected",
    `Detected Intent: ${vaniRespEn.intent}, Text: "${vaniRespEn.text.substring(0, 75)}..."`
);

// Test 4.2: Telugu intent
const vaniRespTe = KisanVani.generateResponse("రద్దీ తక్కువగా ఉండే మంచి స్లాట్ చెప్పండి", "te");
assert(
    vaniRespTe.intent === "SMART_SLOT" && vaniRespTe.text.includes("ఉత్తమ సమయం"),
    "Telugu Smart Slot Intent Detected",
    `Detected Intent: ${vaniRespTe.intent}, Text: "${vaniRespTe.text.substring(0, 75)}..."`
);

// Test 4.3: Hindi intent
const vaniRespHi = KisanVani.generateResponse("कम भीड़ वाला स्लॉट बताओ", "hi");
assert(
    vaniRespHi.intent === "SMART_SLOT" && vaniRespHi.text.includes("कम भीड़ वाला"),
    "Hindi Smart Slot Intent Detected",
    `Detected Intent: ${vaniRespHi.intent}, Text: "${vaniRespHi.text.substring(0, 75)}..."`
);

// Test 4.4: Action Buttons in Vani Response
assert(
    Array.isArray(vaniRespEn.actions) && vaniRespEn.actions.some(a => a.label.includes("Book") || a.label.includes("Slot")),
    "Vani Provides Direct Booking Action Button",
    `Actions: ${vaniRespEn.actions.map(a => a.label).join(", ")}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 5: Translation Dictionaries Completeness for Task 06
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 5] Translation Dictionaries Integrity");

const requiredKeys = [
    "smartSlotNav",
    "quickSmartSlot",
    "quickSmartSlotDesc",
    "navCongestionForecast",
    "mandiCongestionBtn",
    "congestionCardTitle",
    "congestionCardDesc",
    "smartSlotTitle",
    "findBestSlotBtn"
];

const testLangs = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"];

testLangs.forEach(lang => {
    const missing = requiredKeys.filter(k => !translations[lang] || !translations[lang][k]);
    assert(
        missing.length === 0,
        `All Task 06 Keys Present in ${lang}`,
        missing.length === 0 ? "All 9 keys verified" : `Missing: ${missing.join(", ")}`
    );
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log("\n================================================================================");
console.log(`  VERIFICATION RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${passedTests + failedTests})`);
console.log("================================================================================\n");

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log("✓ All Task 06 Automated Tests Passed Successfully!\n");
    process.exit(0);
}
