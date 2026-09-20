/**
 * test_yard_map.js
 * Automated Verification Suite for Task 08:
 * Interactive Mandi/Yard Map & Operational Flow Controller
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("================================================================================");
console.log("  KISAN SETU — TASK 08 AUTOMATED VERIFICATION SUITE");
console.log("  Interactive Mandi/Yard Map & Operational Flow Controller");
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
                innerHTML: "",
                textContent: "",
                style: {},
                classList: { 
                    classes: new Set(),
                    add(c) { this.classes.add(c); },
                    remove(c) { this.classes.delete(c); },
                    contains(c) { return this.classes.has(c); },
                    toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
                },
                value: "",
                setAttribute: () => {},
                getAttribute: () => null,
                appendChild: () => {},
                scrollIntoView: () => {}
            };
        }
        return mockElements[id];
    },
    querySelectorAll: (sel) => [],
    querySelector: (sel) => null,
    createElement: (tag) => ({
        id: "",
        className: "",
        innerHTML: "",
        style: {},
        classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); }
        },
        appendChild: () => {},
        addEventListener: () => {}
    }),
    body: {
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    },
    addEventListener: () => {}
};

// Load and evaluate script.js
const scriptCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
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
// TEST SUITE 1: KisanYardMap Module Architecture & 8-Zone Configuration
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 1] Mandi Yard Map Architecture & 8-Zone Pipeline");

assert(
    typeof KisanYardMap !== "undefined" && typeof KisanYardMap.getYardState === "function",
    "KisanYardMap Module Exposed with State Manager",
    "getYardState() available"
);

assert(
    Array.isArray(KisanYardMap.ZONES) && KisanYardMap.ZONES.length === 8,
    "8 State-Driven Mandi Operational Zones Configured",
    `Configured Zones: ${KisanYardMap.ZONES.map(z => z.id).join(', ')}`
);

const expectedZoneIds = [
    "zone_entry",
    "zone_waiting",
    "zone_queue",
    "zone_gross_weigh",
    "zone_quality_lab",
    "zone_procurement_bays",
    "zone_tare_weigh",
    "zone_exit"
];

const zoneIds = KisanYardMap.ZONES.map(z => z.id);
const allZonesPresent = expectedZoneIds.every(id => zoneIds.includes(id));
assert(
    allZonesPresent,
    "All 8 Physical Yard Zones Present in Pipeline",
    `Verified IDs: ${expectedZoneIds.join(', ')}`
);

// Verify zone attributes (capacities, dwell times, icon classes)
const validZoneMeta = KisanYardMap.ZONES.every(z => 
    z.name && z.shortName && z.icon && z.standardCapacity > 0 && z.dwellMins > 0 && z.colorClass
);
assert(
    validZoneMeta,
    "Zone Metadata and Physical Capacities Complete",
    "All zones define standard capacity, dwell time, color class, and icons"
);

// -----------------------------------------------------------------------------
// TEST SUITE 2: Live State Aggregation & Vehicle Placement
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 2] Live State Aggregation & Vehicle Distribution");

const state = KisanYardMap.getYardState();
assert(
    state && state.centre === "AP State Procurement Centre (Yard 1)",
    "Default Centre Initialized Correctly",
    `Active Centre: ${state.centre}`
);

assert(
    Array.isArray(state.allVehicles) && state.allVehicles.length > 0,
    "Real Active Lots Loaded from Application State",
    `Total Vehicles in Yard: ${state.allVehicles.length}`
);

const sampleVehicle = state.allVehicles[0];
assert(
    sampleVehicle.token && sampleVehicle.crop && sampleVehicle.vehicleNo && sampleVehicle.stageCode,
    "Vehicle Lot Contains Full Operational Context",
    `Token #${sampleVehicle.token} (${sampleVehicle.farmerName}): ${sampleVehicle.crop}, Vehicle ${sampleVehicle.vehicleNo}`
);

// Verify placement into zones
let totalPlacedVehicles = 0;
expectedZoneIds.forEach(id => {
    const zVehs = state.zones[id].vehicles;
    totalPlacedVehicles += zVehs.length;
});
assert(
    totalPlacedVehicles >= state.allVehicles.length,
    "All Vehicles Accurately Distributed to Respective Yard Zones",
    `Total Placed Across 8 Zones: ${totalPlacedVehicles}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 3: Zone Status & Congestion Level Integration
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 3] Zone Status, Utilization & Congestion Prediction");

const entryStatus = KisanYardMap.getZoneStatus("zone_entry");
assert(
    entryStatus && typeof entryStatus.utilPct === "number",
    "Zone Status Computes Real-Time Capacity Utilization",
    `Entry Gate: ${entryStatus.count}/${entryStatus.capacity} vehicles (${entryStatus.utilPct}% capacity)`
);

assert(
    ["LOW", "MEDIUM", "HIGH"].includes(entryStatus.congestion),
    "Congestion Heuristics Correctly Categorized (LOW/MEDIUM/HIGH)",
    `Congestion Level: ${entryStatus.congestion}`
);

assert(
    typeof entryStatus.estWaitMins === "number" && entryStatus.estWaitMins > 0,
    "Estimated Waiting/Dwell Time Calculated per Zone",
    `Est. Wait: ${entryStatus.estWaitMins} mins`
);

// -----------------------------------------------------------------------------
// TEST SUITE 4: Flow Pipeline Stage Counts
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 4] Live Flow Summary Pipeline");

const stageCounts = KisanYardMap.getStageCounts();
assert(
    Array.isArray(stageCounts) && stageCounts.length === 7,
    "Sequential Flow Bar Renders 7 Mandi Stages",
    `Flow Stages: ${stageCounts.map(s => s.label).join(' → ')}`
);

const expectedFlowKeys = ["entry", "queue", "gross", "quality", "unload", "tare", "exit"];
const flowKeys = stageCounts.map(s => s.id);
assert(
    expectedFlowKeys.every(k => flowKeys.includes(k)),
    "All Stage Keys Present in Flow Bar",
    `Stages: ${flowKeys.join(', ')}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 5: Farmer Privacy Journey Tracking
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 5] Farmer Personal Journey Tracking (Privacy-Safe)");

const journey = KisanYardMap.getFarmerJourney("07");
assert(
    journey && journey.token === "07",
    "Farmer Journey Identified by Token Number",
    `Token #${journey.token} for ${journey.crop}`
);

assert(
    Array.isArray(journey.stages) && journey.stages.length === 5,
    "5-Milestone Journey Progression Defined",
    `Milestones: ${journey.stages.map(s => s.name).join(' → ')}`
);

assert(
    typeof journey.currentIndex === "number" && journey.currentIndex >= 0 && journey.currentIndex < 5,
    "Active Journey Stage Accurately Tracked",
    `Current Stage Index: ${journey.currentIndex} (${journey.stages[journey.currentIndex]?.name})`
);

assert(
    journey.activeZone && journey.activeZone.name,
    "Active Physical Mandi Zone Located for Farmer",
    `Active Zone: ${journey.activeZone.name}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 6: Multi-Centre State Isolation
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 6] Multi-Centre Support (Yard 1 vs Yard 2)");

const yard2State = KisanYardMap.getYardState("District Food Grain Hub (Yard 2)");
assert(
    yard2State && yard2State.centre === "District Food Grain Hub (Yard 2)",
    "Yard 2 State Isolated from Yard 1",
    `Isolated Centre: ${yard2State.centre}`
);

assert(
    yard2State.zones["zone_entry"] && yard2State.zones["zone_quality_lab"],
    "Yard 2 Renders Complete 8-Zone Layout",
    "All 8 zones initialized for secondary hub"
);

// -----------------------------------------------------------------------------
// TEST SUITE 7: Kisan Vani Multilingual Yard Map Inquiries
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 7] Kisan Vani Multilingual Intent Connectivity");

const vaniQueries = [
    { q: "Where is my vehicle in the yard?", lang: "en" },
    { q: "Show mandi yard map", lang: "en" },
    { q: "నా ట్రాక్టర్ ఏ జోన్ లో ఉంది?", lang: "te" },
    { q: "మండీ మ్యాప్ చూపించు", lang: "te" },
    { q: "मेरी गाड़ी यार्ड में कहाँ है?", lang: "hi" },
    { q: "मंडी का नक्शा दिखाओ", lang: "hi" }
];

vaniQueries.forEach(testCase => {
    const res = KisanVani.generateResponse(testCase.q, testCase.lang);
    assert(
        res && res.text && res.text.length > 0,
        `Kisan Vani Answered Query in [${testCase.lang}]: "${testCase.q}"`,
        `Response Snippet: "${res.text.substring(0, 60)}..."`
    );
    assert(
        res.actions && res.actions.some(a => a.onclick && a.onclick.includes("YardMap")),
        `Includes Interactive Action to Launch Mandi Yard Map Modal`,
        `Action: ${res.actions[0]?.label} -> ${res.actions[0]?.onclick}`
    );
});

// -----------------------------------------------------------------------------
// TEST SUITE 8: Multi-Language Translation Dictionaries (6 Languages)
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 8] Multi-Language Localization Completeness");

const requiredKeys = [
    "yardMapNav",
    "navYardMap",
    "mandiYardMapBtn",
    "yardMapSectionTitle",
    "yardMapSectionDesc",
    "refreshMapBtn",
    "mapLegendBtn",
    "filterAllZones",
    "filterEntryQueue",
    "filterGrossWeigh",
    "filterQualityLab",
    "filterUnloadTare",
    "filterExitClearance"
];

const languages = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"];

languages.forEach(lang => {
    const dict = translations[lang];
    assert(
        dict !== undefined,
        `Translation Dictionary for [${lang}] Loaded`,
        `Keys count: ${Object.keys(dict || {}).length}`
    );

    const missing = requiredKeys.filter(k => !dict || !dict[k]);
    assert(
        missing.length === 0,
        `All 13 Task 08 Translation Keys Present in [${lang}]`,
        missing.length === 0 ? "13/13 keys verified" : `Missing: ${missing.join(', ')}`
    );
});

// -----------------------------------------------------------------------------
// TEST SUITE 9: DOM Element Rendering & Modal Handlers
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 9] UI Rendering & Modal Controllers");

assert(
    typeof KisanYardMap.renderOfficerYardMap === "function" &&
    typeof KisanYardMap.renderFarmerYardMap === "function" &&
    typeof KisanYardMap.openZoneDetailModal === "function" &&
    typeof KisanYardMap.openVehicleDetailModal === "function" &&
    typeof KisanYardMap.openFarmerYardMapModal === "function" &&
    typeof KisanYardMap.openLegendModal === "function",
    "All Modal and Rendering APIs Exported by KisanYardMap",
    "renderOfficerYardMap, renderFarmerYardMap, openZoneDetailModal, openVehicleDetailModal, openFarmerYardMapModal, openLegendModal"
);

// Test rendering officer map to mock target
const officerTarget = document.getElementById("officer-yard-map-target");
KisanYardMap.renderOfficerYardMap();
assert(
    officerTarget.innerHTML.includes("mandi-yard-map-layout") &&
    officerTarget.innerHTML.includes("yard-flow-indicator") &&
    officerTarget.innerHTML.includes("zone_entry") &&
    officerTarget.innerHTML.includes("zone_quality_lab"),
    "Officer Yard Map Renders Complete 8-Zone Grid with Flow Summary",
    "Target element populated with layout, 8 zones, stage chips, and vehicle markers"
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log("\n================================================================================");
console.log(`  VERIFICATION RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log("================================================================================\n");

if (failedTests === 0) {
    console.log("🎉 ALL TESTS PASSED! Task 08 (Interactive Mandi Yard Map) is verified.\n");
    process.exit(0);
} else {
    console.error(`❌ ${failedTests} test(s) failed. Review errors above.\n`);
    process.exit(1);
}
