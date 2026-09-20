/**
 * Automated Test Suite for Task 10: Weather + Grain Drying Advisory
 * HackDevengers 2.0 - Kisan Setu
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("==================================================================");
console.log("  RUNNING TASK 10: WEATHER + GRAIN DRYING ADVISORY TEST SUITE    ");
console.log("==================================================================\n");

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
    print: () => {},
    BroadcastChannel: class {
        constructor(name) { this.name = name; }
        postMessage(msg) {}
        close() {}
    }
};

global.confirm = () => true;
global.alert = () => {};

const mockElements = {};
global.document = {
    getElementById: (id) => {
        if (!mockElements[id]) {
            mockElements[id] = {
                id,
                style: {},
                classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
                innerHTML: '',
                textContent: '',
                value: '',
                setAttribute: () => {},
                getAttribute: () => null,
                addEventListener: () => {},
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
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        innerHTML: '',
        textContent: '',
        appendChild: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        addEventListener: () => {}
    }),
    body: {
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    },
    addEventListener: () => {}
};

// Load and evaluate script.js
const scriptPath = path.join(__dirname, 'script.js');
const scriptCode = fs.readFileSync(scriptPath, 'utf8');
vm.runInThisContext(scriptCode);

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        failed++;
    }
}

// -------------------------------------------------------------
// TEST 1: KisanWeather Centre GPS Resolution & WMO Code Decoder
// -------------------------------------------------------------
console.log("Test Suite 1: KisanWeather GPS Locations & WMO Code Mapping");
const loc1 = KisanWeather.getCentreLocation("AP State Procurement Centre (Yard 1)");
assert(loc1 && loc1.lat === 16.2929 && loc1.lng === 80.4552, "GPS coordinates resolved accurately for Yard 1");

const loc2 = KisanWeather.getCentreLocation("Tenali Rural Cooperative Mandi");
assert(loc2 && loc2.lat === 16.2437 && loc2.lng === 80.6400, "GPS coordinates resolved accurately for Tenali Mandi");

const codeClear = KisanWeather.interpretWeatherCode(0);
assert(codeClear.condition === "clear" && codeClear.label.includes("Clear Sky"), "WMO code 0 correctly decoded as Clear Sky");

const codeRain = KisanWeather.interpretWeatherCode(61);
assert(codeRain.condition === "rain" && (codeRain.icon.includes("rain") || codeRain.icon.includes("shower")), "WMO code 61 correctly decoded as Rainy");

const codeThunder = KisanWeather.interpretWeatherCode(95);
assert(codeThunder.condition === "thunderstorm" && codeThunder.icon.includes("bolt"), "WMO code 95 correctly decoded as Thunderstorm");

// -------------------------------------------------------------
// TEST 2: Offline & Fallback Handling (Zero Fake Data)
// -------------------------------------------------------------
console.log("\nTest Suite 2: Offline & Fallback Handling (No Fake Data)");
localStorage.clear();
const offlineWeather = KisanWeather.getWeatherSync("AP State Procurement Centre (Yard 1)");
assert(offlineWeather.status === "unavailable", "Offline weather correctly returns status: unavailable");
assert(offlineWeather.message === "Weather data currently unavailable", "Offline weather returns strict message");

const offlineAdvisory = KisanDryingAdvisory.getDryingRecommendation(offlineWeather, "Paddy / Rice", 14.5);
assert(offlineAdvisory.status === "UNAVAILABLE", "Drying advisory for unavailable weather returns UNAVAILABLE status");
assert(offlineAdvisory.cropStandard && offlineAdvisory.cropStandard.safeMoistureLimit === 14.0, "Crop storage standards still provided during weather offline");

// -------------------------------------------------------------
// TEST 3: Decision Matrix - SUITABLE Condition
// -------------------------------------------------------------
console.log("\nTest Suite 3: Multi-Factor Decision Matrix - SUITABLE");
const suitableWeather = {
    status: "available",
    temperature: 30.5,
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

const suitableAdv = KisanDryingAdvisory.getDryingRecommendation(suitableWeather, "Paddy / Rice", 15.2);
assert(suitableAdv.status === "SUITABLE", "Recommendation correctly evaluated as SUITABLE");
assert(suitableAdv.reason.includes("optimal drying conditions") || suitableAdv.reason.includes("Low rain probability"), "Reason includes valid rationale for suitable status");
assert(suitableAdv.dryingWindow === "10:00 AM – 02:00 PM", "Solar drying window computed correctly: 10:00 AM – 02:00 PM");

// -------------------------------------------------------------
// TEST 4: Decision Matrix - CAUTION Condition
// -------------------------------------------------------------
console.log("\nTest Suite 4: Multi-Factor Decision Matrix - CAUTION");
const cautionWeather = {
    status: "available",
    temperature: 34.0,
    relativeHumidity: 68,
    rainProbability: 35,
    windSpeed: 18.0,
    weatherCode: 2,
    hourlyForecast: [
        { time: "09:00 AM", temperature: 29, relativeHumidity: 72, rainProbability: 35, weatherCode: 2 },
        { time: "10:00 AM", temperature: 31, relativeHumidity: 68, rainProbability: 35, weatherCode: 2 }
    ]
};

const cautionAdv = KisanDryingAdvisory.getDryingRecommendation(cautionWeather, "Wheat", 13.0);
assert(cautionAdv.status === "CAUTION", "Recommendation correctly evaluated as CAUTION for 35% rain chance and 68% humidity");
assert(cautionAdv.reason.includes("35%"), "Explanation dynamically contains the actual 35% rain probability");

// -------------------------------------------------------------
// TEST 5: Decision Matrix - NOT RECOMMENDED Condition
// -------------------------------------------------------------
console.log("\nTest Suite 5: Multi-Factor Decision Matrix - NOT RECOMMENDED");
const rainWeather = {
    status: "available",
    temperature: 24.0,
    relativeHumidity: 88,
    rainProbability: 75,
    windSpeed: 28.0,
    weatherCode: 63,
    hourlyForecast: []
};

const rainAdv = KisanDryingAdvisory.getDryingRecommendation(rainWeather, "Maize", 16.0);
assert(rainAdv.status === "NOT_RECOMMENDED", "Recommendation correctly evaluated as NOT_RECOMMENDED for rainCode 63 and 75% rain probability");
assert(rainAdv.action.includes("tarpaulins") || rainAdv.action.includes("Delay outdoor drying"), "Suggested action advises covering with tarpaulins");
assert(rainAdv.storageWarning.includes("reabsorption") || rainAdv.storageWarning.includes("High ambient humidity"), "Storage warning alerts on moisture reabsorption at 88% humidity");

// -------------------------------------------------------------
// TEST 6: Crop Storage Limits & Multilingual Normalization
// -------------------------------------------------------------
console.log("\nTest Suite 6: Crop Standards & Safe Moisture Limits");
const paddyStd = KisanDryingAdvisory.getCropStandard("వరి (Paddy)");
assert(paddyStd.safeMoistureLimit === 14.0, "Telugu crop 'వరి' correctly mapped to Paddy limit 14.0%");

const wheatStd = KisanDryingAdvisory.getCropStandard("गेहूं (Wheat)");
assert(wheatStd.safeMoistureLimit === 12.0, "Hindi crop 'गेहूं' correctly mapped to Wheat limit 12.0%");

const cottonStd = KisanDryingAdvisory.getCropStandard("Cotton Lint");
assert(cottonStd.safeMoistureLimit === 8.5, "Cotton safe moisture limit is 8.5%");

const groundnutStd = KisanDryingAdvisory.getCropStandard("Groundnut Pods");
assert(groundnutStd.safeMoistureLimit === 9.0, "Groundnut safe moisture limit is 9.0%");

// -------------------------------------------------------------
// TEST 7: Multilingual Translations Completeness
// -------------------------------------------------------------
console.log("\nTest Suite 7: Multilingual Translations");
const requiredKeys = [
    "weatherNav", "weatherTitle", "weatherCardSubtitle", "advisorySuitable",
    "advisoryCaution", "advisoryNotRecommended", "advisoryUnavailable",
    "suggestedDryingWindow", "storageRiskWarning", "cropGuidanceTitle",
    "viewDryingAdvisoryBtn", "refreshWeather", "rainChance", "weatherHumidity",
    "weatherWind", "whyExplanation", "suggestedAction"
];

const supportedLangs = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"];
supportedLangs.forEach(lang => {
    let missing = 0;
    requiredKeys.forEach(k => {
        if (!translations[lang] || !translations[lang][k]) {
            missing++;
        }
    });
    assert(missing === 0, `All Task 10 translation keys present in ${lang} (0 missing)`);
});

// -------------------------------------------------------------
// TEST 8: Kisan Vani AI Assistant - Weather & Drying Intent
// -------------------------------------------------------------
console.log("\nTest Suite 8: Kisan Vani AI Assistant Voice/Text Intent");
// Save mock weather in cache
KisanWeather.saveWeatherCache("AP State Procurement Centre, Guntur Yard (Yard 1)", suitableWeather);
KisanWeather.saveWeatherCache("AP State Procurement Centre (Yard 1)", suitableWeather);

const enIntent = KisanVani.detectIntent("Can I dry my paddy grain today? What is the weather?", "en");
assert(enIntent === "DRYING_ADVISORY", "Kisan Vani recognizes English drying intent");

const enResponse = KisanVani.generateResponse("Can I dry my paddy grain today? What is the weather?", "en");
assert(enResponse && (enResponse.text.includes("Drying Advisory") || enResponse.text.includes("Weather")), "Kisan Vani EN responds to weather drying query");
assert(enResponse && enResponse.actions && enResponse.actions.some(a => a.onclick === "openDryingAdvisoryModal()"), "Kisan Vani EN includes interactive modal trigger action");

const teIntent = KisanVani.detectIntent("ఈ రోజు ధాన్యం ఆరబెట్టవచ్చా? వాతావరణం ఎలా ఉంది?", "te");
assert(teIntent === "DRYING_ADVISORY", "Kisan Vani recognizes Telugu drying intent");

const teResponse = KisanVani.generateResponse("ఈ రోజు ధాన్యం ఆరబెట్టవచ్చా? వాతావరణం ఎలా ఉంది?", "te");
assert(teResponse && (teResponse.text.includes("వాతావరణ") || teResponse.text.includes("ఆరబెట్ట")), "Kisan Vani TE responds in Telugu to drying query");

const hiIntent = KisanVani.detectIntent("क्या आज फसल सुखाना सही रहेगा? मौसम कैसा है?", "hi");
assert(hiIntent === "DRYING_ADVISORY", "Kisan Vani recognizes Hindi drying intent");

const hiResponse = KisanVani.generateResponse("क्या आज फसल सुखाना सही रहेगा? मौसम कैसा है?", "hi");
assert(hiResponse && (hiResponse.text.includes("मौसम") || hiResponse.text.includes("सुखाई")), "Kisan Vani HI responds in Hindi to drying query");

console.log("\n==================================================================");
console.log(`  TASK 10 TESTS SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================================");

if (failed > 0) {
    process.exit(1);
} else {
    console.log("\n>>> ALL TASK 10 WEATHER & GRAIN DRYING ADVISORY TESTS PASSED! <<<\n");
}
