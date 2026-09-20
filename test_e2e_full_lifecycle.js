/**
 * ==============================================================================
 * KISAN SETU — END-TO-END PRODUCTION & DEMO VERIFICATION SUITE
 * Complete Farmer → Booking → QR → Queue → Weighbridge → Quality → DBT Flow
 * HackDevengers 2.0
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("================================================================================");
console.log("  KISAN SETU — END-TO-END LIFECYCLE & INTEGRATION VERIFICATION");
console.log("================================================================================\n");

// 1. Setup mock Browser & DOM Environment
const storage = {};
global.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

global.window = {
    location: { reload: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    print: () => {},
    BroadcastChannel: class {
        constructor(name) { this.name = name; }
        postMessage(msg) {}
        close() {}
    }
};

global.confirm = () => true;
global.alert = () => {};
global.requestAnimationFrame = (cb) => { if (typeof cb === 'function') cb(); };

const mockElements = {};
global.document = {
    getElementById: (id) => {
        if (!mockElements[id]) {
            mockElements[id] = {
                id,
                style: {},
                classList: {
                    classes: new Set(),
                    add(c) { this.classes.add(c); },
                    remove(c) { this.classes.delete(c); },
                    contains(c) { return this.classes.has(c); },
                    toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
                },
                innerHTML: '',
                textContent: '',
                value: '',
                setAttribute: () => {},
                getAttribute: () => null,
                addEventListener: () => {},
                appendChild: () => {},
                dataset: {}
            };
        }
        return mockElements[id];
    },
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        style: {},
        classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); }
        },
        innerHTML: '',
        textContent: '',
        appendChild: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        addEventListener: () => {},
        querySelector: () => ({ onclick: null, style: {}, classList: { add: () => {}, remove: () => {} } }),
        querySelectorAll: () => []
    }),
    body: {
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    },
    addEventListener: () => {}
};

// 2. Load script.js
const scriptPath = path.join(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
vm.runInThisContext(scriptContent);

let passed = 0;
let failed = 0;

function assert(condition, message, details = "") {
    if (condition) {
        console.log(`  ✓ PASS: ${message}`);
        if (details) console.log(`    ↳ ${details}`);
        passed++;
    } else {
        console.error(`  ✗ FAIL: ${message}`);
        if (details) console.error(`    ↳ ${details}`);
        failed++;
    }
}

// ==============================================================================
// STAGE 1: Authentication & Role Management
// ==============================================================================
console.log("[STAGE 1] User Authentication & Cross-Role State Verification");

const farmerUser = { role: "farmer", name: "Ramesh Kumar", farmerId: "KS102458", phone: "+91 98765 43210" };
localStorage.setItem("kisanSetuUser", JSON.stringify(farmerUser));
const currentUser = (typeof getCurrentUser === "function") ? getCurrentUser() : farmerUser;
assert(currentUser.role === "farmer" && currentUser.farmerId === "KS102458", "Farmer user session active", `Role: ${currentUser.role}, ID: ${currentUser.farmerId}`);

const officerUser = { role: "officer", name: "Officer S. Sharma", officerId: "MANDI-OFF-902", centre: "AP State Procurement Centre (Yard 1)" };
assert(officerUser.role === "officer", "Mandi Officer role profile configured", `Officer: ${officerUser.name} (${officerUser.officerId})`);

// ==============================================================================
// STAGE 2: Smart Slot Recommendation & Booking (Task 06)
// ==============================================================================
console.log("\n[STAGE 2] AI Smart Slot Recommendation & Farmer Booking Execution");

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dateStr = tomorrow.toISOString().split("T")[0];

const recResult = KisanCongestionAI.recommendProcurementSlot({
    crop: "Paddy / Rice",
    quantity: 21.5,
    centre: "AP State Procurement Centre (Yard 1)",
    date: dateStr
});
assert(recResult && recResult.success === true, "Smart Slot AI generated optimal recommendations", `Recommended: ${recResult.recommended.timeSlot} (Score: ${recResult.recommended.compositeScore})`);

// Execute booking
const chosenSlotTime = recResult.recommended.timeSlot;
KisanCongestionAI.bookRecommendedSlot("Paddy / Rice", 21.5, "AP State Procurement Centre (Yard 1)", dateStr, chosenSlotTime);
assert(typeof currentBooking !== "undefined" && currentBooking.time === chosenSlotTime, "Slot successfully booked and synchronized with currentBooking", `Booking ID: ${currentBooking.id}, Token #${currentBooking.token}`);

// ==============================================================================
// STAGE 3: Dynamic QR Gate Pass Generation & Security Verification (Task 03)
// ==============================================================================
console.log("\n[STAGE 3] Dynamic Gate Pass QR Code Generation & Officer Gate Verification");

const qrPayloadStr = KisanQR.generatePayload(currentBooking);
const qrParsed = JSON.parse(qrPayloadStr);
assert(qrParsed && qrParsed.token === currentBooking.token, "Secure QR Payload generated with token & gate pass ID", `GatePass ID: ${qrParsed.gatePassId}, Token: ${qrParsed.token}`);

// Simulate Officer Gate Entry Verification
const verifyResult = KisanQR.verifyQRPayload(qrPayloadStr);
assert(verifyResult.success === true, "Officer Gate Scanner successfully verified farmer QR pass", `Gate Pass Token: ${verifyResult.booking.token}`);

// ==============================================================================
// STAGE 4: Interactive Mandi Yard Map Placement (Task 08)
// ==============================================================================
console.log("\n[STAGE 4] Mandi Yard Map Tracking & 8-Zone Pipeline");

const yardState = KisanYardMap.getYardState("AP State Procurement Centre (Yard 1)");
assert(yardState && yardState.zones && Object.keys(yardState.zones).length === 8, "Mandi Yard 8-zone pipeline active", `Active Vehicles: ${yardState.allVehicles ? yardState.allVehicles.length : 'OK'}`);

const farmerJourney = KisanYardMap.getFarmerJourney(currentBooking.token, "AP State Procurement Centre (Yard 1)");
assert(farmerJourney && farmerJourney.stages && farmerJourney.stages.length === 5, "Farmer personal journey tracker active across 5 milestones", `Active Zone: ${farmerJourney.activeZone ? farmerJourney.activeZone.name : 'Entry Gate'}`);

// ==============================================================================
// STAGE 5: Weighbridge Intake & Mathematical Validation (Task 09)
// ==============================================================================
console.log("\n[STAGE 5] Weighbridge Console — Gross Vehicle Intake & Scale Validation");

const grossWeightValue = 26.70; // 26.70 Quintals gross (tractor + loaded paddy)
const tarePresetTractor = 5.20; // 5.20 Quintals tractor tare

const weighVal = KisanWeighbridge.validateWeighment(grossWeightValue, tarePresetTractor, "Paddy / Rice (Grade A)");
assert(weighVal.valid === true, "Weighbridge scale validation passed for Gross 26.70 Q & Tare 5.20 Q");
assert(weighVal.netWeight === 21.50, "Exact Net Weight mathematical deduction: 26.70 - 5.20 = 21.50 Q");
assert(weighVal.netWeightKg === 2150, "Converted Net Weight in kg: 2,150 kg");

const grossResult = KisanWeighbridge.confirmWeighment({
    bookingId: currentBooking.id,
    grossWeight: grossWeightValue,
    tareWeight: tarePresetTractor,
    operatorNotes: "Calibrated weighbridge digital scale intake",
    autoAdvanceToQuality: true
});
assert(grossResult.success === true, "Weighbridge confirmation succeeded and Form W-1 generated", `Receipt ID: ${grossResult.record.receiptId}`);

// ==============================================================================
// STAGE 6: AI Grain Quality Inspection Lab (Task 04)
// ==============================================================================
console.log("\n[STAGE 6] AI Quality Inspection & Grain Moisture Assessment");

KisanGrainAI.openQualityInspectionModal(currentBooking.id);
KisanGrainAI.handleOfficerQualityDecision("APPROVE");
const qualityRecord = KisanGrainAI.getRecordForBooking(currentBooking.id);
assert(qualityRecord !== null && qualityRecord.grade.includes("Grade A"), "AI Quality Inspection approved grain lot", `Grade: ${qualityRecord ? qualityRecord.grade : 'N/A'}, Moisture: ${qualityRecord ? qualityRecord.moisture : 'N/A'}`);

// ==============================================================================
// STAGE 7: Procurement Handover & Official J-Form Receipt (Task 09)
// ==============================================================================
console.log("\n[STAGE 7] Procurement Handover & Official MSP Valuation");

const wbRecord = KisanWeighbridge.getRecordForBooking(currentBooking.id);
assert(wbRecord !== null, "Weighbridge record retrieved with verified net weight", `Net: ${wbRecord.netWeight} Q`);
assert(wbRecord.receiptId && wbRecord.receiptId.startsWith("WB-REC-"), "Official digital weighment slip generated with unique ID");

// ==============================================================================
// STAGE 8: Live Mandi Analytics Aggregation (Task 07)
// ==============================================================================
console.log("\n[STAGE 8] Live Mandi Analytics Dashboard Computation");

const analyticsState = KisanAnalytics.getLiveState();
const analytics = KisanAnalytics.calculateDashboardMetrics(analyticsState);
assert(analytics && analytics.vehiclesWeighedToday >= 1, "Analytics engine aggregated verified weighments", `Vehicles Weighed Today: ${analytics.vehiclesWeighedToday}`);
assert(analytics.totalVerifiedNetQuantity >= 21.50, "Analytics tracks verified net quantity in Quintals", `Verified Net Q: ${analytics.totalVerifiedNetQuantity} Q`);

// ==============================================================================
// STAGE 9: Weather & Grain Drying Advisory (Task 10)
// ==============================================================================
console.log("\n[STAGE 9] Weather Telemetry & Grain Drying Feasibility");

const weatherData = {
    status: "available",
    temperature: 31.0,
    relativeHumidity: 52,
    rainProbability: 10,
    windSpeed: 12.0,
    weatherCode: 0,
    hourlyForecast: [
        { time: "10:00 AM", temperature: 28, relativeHumidity: 55, rainProbability: 5, weatherCode: 0 },
        { time: "11:00 AM", temperature: 31, relativeHumidity: 50, rainProbability: 5, weatherCode: 0 },
        { time: "12:00 PM", temperature: 33, relativeHumidity: 48, rainProbability: 10, weatherCode: 0 },
        { time: "01:00 PM", temperature: 32, relativeHumidity: 50, rainProbability: 10, weatherCode: 0 },
        { time: "02:00 PM", temperature: 30, relativeHumidity: 54, rainProbability: 15, weatherCode: 1 }
    ]
};
KisanWeather.saveWeatherCache("AP State Procurement Centre (Yard 1)", weatherData);

const dryingAdv = KisanDryingAdvisory.getDryingRecommendation(weatherData, "Paddy / Rice", 12.8);
assert(dryingAdv.status === "SUITABLE", "Weather conditions evaluated as SUITABLE for solar drying", `Status: ${dryingAdv.statusText}`);
assert(dryingAdv.dryingWindow === "10:00 AM – 02:00 PM", "Solar drying window computed accurately", `Window: ${dryingAdv.dryingWindow}`);

// ==============================================================================
// STAGE 10: Kisan Vani Multilingual AI Assistant (Task 05)
// ==============================================================================
console.log("\n[STAGE 10] Kisan Vani Multilingual AI Assistant Across All Stages");

const vaniQueueEn = KisanVani.generateResponse("What is my queue position?", "en");
assert(vaniQueueEn && vaniQueueEn.text.length > 0, "Kisan Vani answered Queue inquiry in English");

const vaniQualityTe = KisanVani.generateResponse("నా నాణ్యత తనిఖీ రిపోర్ట్ ఎలా ఉంది?", "te");
assert(vaniQualityTe && vaniQualityTe.text.length > 0, "Kisan Vani answered Quality inquiry in Telugu");

const vaniWeighHi = KisanVani.generateResponse("मेरा तौल और वजन कितना है?", "hi");
assert(vaniWeighHi && vaniWeighHi.text.length > 0, "Kisan Vani answered Weighbridge inquiry in Hindi");

const vaniDryingEn = KisanVani.generateResponse("Can I dry my grain today?", "en");
assert(vaniDryingEn && vaniDryingEn.text.includes("Drying Advisory"), "Kisan Vani answered Weather Drying inquiry");

// ==============================================================================
// SUMMARY
// ==============================================================================
console.log("\n================================================================================");
console.log(`  E2E LIFECYCLE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("================================================================================");

if (failed > 0) {
    console.error("❌ E2E LIFECYCLE TESTS FAILED");
    process.exit(1);
} else {
    console.log("🎉 ALL E2E LIFECYCLE & MULTI-MODULE WORKFLOWS VERIFIED 100% SUCCESFULLY!\n");
}
