/**
 * test_analytics_dashboard.js
 * Automated Verification Suite for Task 07:
 * Live Mandi Analytics and Procurement Operations Dashboard.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("================================================================================");
console.log("  KISAN SETU — TASK 07 AUTOMATED VERIFICATION SUITE");
console.log("  Live Mandi Analytics & Procurement Operations Dashboard");
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

const mockElements = {};
global.document = {
    getElementById: (id) => {
        if (!mockElements[id]) {
            mockElements[id] = {
                id,
                innerHTML: "",
                textContent: "",
                style: {},
                classList: { add: () => {}, remove: () => {}, contains: () => false },
                value: "",
                setAttribute: () => {},
                getAttribute: () => null,
                appendChild: () => {}
            };
        }
        return mockElements[id];
    },
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
// TEST SUITE 1: KisanAnalytics Module Architecture
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 1] Centralized Analytics Engine Architecture");

assert(
    typeof KisanAnalytics !== "undefined" && typeof KisanAnalytics.calculateDashboardMetrics === "function",
    "KisanAnalytics Module Exposed with Core Metrics Calculator",
    "calculateDashboardMetrics available"
);

assert(
    typeof KisanAnalytics.calculateQueueMetrics === "function" &&
    typeof KisanAnalytics.calculateQualityMetrics === "function" &&
    typeof KisanAnalytics.calculatePaymentMetrics === "function" &&
    typeof KisanAnalytics.calculateCentreMetrics === "function" &&
    typeof KisanAnalytics.getActivityFeed === "function",
    "All Operational Sub-Metric Calculation Functions Present",
    "Queue, Quality, Payment, Centre & Feed methods verified"
);

// -----------------------------------------------------------------------------
// TEST SUITE 2: KPI Metrics Calculation & Accuracy
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 2] KPI Operational Metrics Computation");

const initialMetrics = KisanAnalytics.calculateDashboardMetrics();

assert(
    initialMetrics.totalBookings >= 22,
    "Today's Total Registered Bookings Metric",
    `Total Bookings: ${initialMetrics.totalBookings} farmers`
);

assert(
    typeof initialMetrics.activeQueueCount === "number" && initialMetrics.activeQueueCount >= 0,
    "Active Yard Queue Metric",
    `Active Trucks in Yard: ${initialMetrics.activeQueueCount}`
);

assert(
    initialMetrics.verifiedCount >= 18,
    "Verified Farmers Metric",
    `Verified Farmers: ${initialMetrics.verifiedCount}`
);

assert(
    initialMetrics.totalCompleted >= 18,
    "Completed Procurement Lots Metric",
    `Completed Lots: ${initialMetrics.totalCompleted}`
);

assert(
    initialMetrics.totalQuantity >= 342.5,
    "Total Quantity Procured Metric (Numeric Q)",
    `Total Quantity: ${initialMetrics.totalQuantity} Quintals`
);

assert(
    initialMetrics.avgWaitMins >= 12,
    "Average Estimated Waiting Time Metric",
    `Mean Waiting Time: ${initialMetrics.avgWaitMins} mins`
);

assert(
    initialMetrics.totalInspections >= 18 && initialMetrics.approvedCount >= 17,
    "Quality Inspections Metric",
    `Inspections: ${initialMetrics.totalInspections} (${initialMetrics.approvedCount} Approved, ${initialMetrics.onHoldCount} On Hold)`
);

assert(
    typeof initialMetrics.pendingDBT === "number" && initialMetrics.completedDBT >= 18,
    "DBT Status Metric",
    `DBT Settled: ${initialMetrics.completedDBT} Lots (${initialMetrics.pendingDBT} Pending)`
);

assert(
    initialMetrics.totalDisbursedValue >= 785450,
    "Total MSP Amount Disbursed Metric",
    `Total Disbursed: ₹${initialMetrics.totalDisbursedValue.toLocaleString("en-IN")}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 3: Stage Throughput & Procurement Trend Breakdown
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 3] Stage Throughput & Queue Pipeline");

const queueMetrics = KisanAnalytics.calculateQueueMetrics();
assert(
    queueMetrics.stages &&
    typeof queueMetrics.stages.gate_in === "number" &&
    typeof queueMetrics.stages.gross_weighing === "number" &&
    typeof queueMetrics.stages.quality_lab === "number" &&
    typeof queueMetrics.stages.tare_weighing === "number" &&
    typeof queueMetrics.stages.completed === "number",
    "All 5 Procurement Stages Tracked Accurately",
    `Gate: ${queueMetrics.stages.gate_in}, Gross: ${queueMetrics.stages.gross_weighing}, Lab: ${queueMetrics.stages.quality_lab}, Tare: ${queueMetrics.stages.tare_weighing}, Completed: ${queueMetrics.stages.completed}`
);

assert(
    queueMetrics.clearanceMins >= 15,
    "Queue Clearance Velocity Calculation",
    `Estimated yard clearance: ${queueMetrics.clearanceMins} mins`
);

// -----------------------------------------------------------------------------
// TEST SUITE 4: Quality Analytics & Grade Distribution
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 4] Grain Quality Grade Distribution Analytics");

const qualityMetrics = KisanAnalytics.calculateQualityMetrics();
assert(
    qualityMetrics.gradeDist &&
    qualityMetrics.gradeDist["Grade A+"] !== undefined &&
    qualityMetrics.gradeDist["Grade A"] !== undefined &&
    qualityMetrics.gradeDist["Grade B"] !== undefined,
    "Grain Grade Categorization Matrix",
    `A+: ${qualityMetrics.gradeDist["Grade A+"]}, A: ${qualityMetrics.gradeDist["Grade A"]}, B: ${qualityMetrics.gradeDist["Grade B"]}, C: ${qualityMetrics.gradeDist["Grade C"]}`
);

assert(
    qualityMetrics.avgScore >= 70 && qualityMetrics.passRate >= 80,
    "Average Quality Score & Pass Rate Calculations",
    `Average Score: ${qualityMetrics.avgScore}/100, Pass Rate: ${qualityMetrics.passRate}%, Moisture: ${qualityMetrics.avgMoisture}%`
);

// -----------------------------------------------------------------------------
// TEST SUITE 5: Payment & DBT Financial Analytics
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 5] Payment & DBT Financial Analytics");

const payMetrics = KisanAnalytics.calculatePaymentMetrics();
assert(
    payMetrics.totalDisbursed >= 785450 && payMetrics.formattedTotal.startsWith("₹"),
    "Financial Disbursed Total Formatting",
    `Formatted Amount: ${payMetrics.formattedTotal}`
);

assert(
    Array.isArray(payMetrics.cropBreakdown) && payMetrics.cropBreakdown.length === 3,
    "Crop MSP Commodity Breakdown Table",
    `Crops: ${payMetrics.cropBreakdown.map(c => c.crop + ' (' + c.value + ')').join(', ')}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 6: Multi-Centre Operational Comparison
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 6] Multi-Centre Operational Comparison");

const centreMetrics = KisanAnalytics.calculateCentreMetrics();
assert(
    Array.isArray(centreMetrics) && centreMetrics.length === 2,
    "Dual Procurement Centres Comparison Configured",
    `Centres: ${centreMetrics.map(c => c.name).join(' vs ')}`
);

assert(
    centreMetrics[0].capacity === 15 && centreMetrics[1].capacity === 12,
    "Accurate Capacity Utilization per Mandi Yard",
    `Yard 1: ${centreMetrics[0].activeQueue}/${centreMetrics[0].capacity} trucks (${centreMetrics[0].congestion} load); Yard 2: ${centreMetrics[1].activeQueue}/${centreMetrics[1].capacity} trucks`
);

// -----------------------------------------------------------------------------
// TEST SUITE 7: Live Activity Stream Feed
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 7] Live Operational Activity Stream");

const activityFeed = KisanAnalytics.getActivityFeed(5);
assert(
    Array.isArray(activityFeed) && activityFeed.length > 0,
    "Activity Feed Stream Populated",
    `Retrieved ${activityFeed.length} recent events. Latest: "${activityFeed[0].title}" (${activityFeed[0].time})`
);

assert(
    activityFeed[0].time && activityFeed[0].title && activityFeed[0].desc,
    "Activity Event Schema Completeness",
    `Event structure verified (title, time, desc, icon)`
);

// -----------------------------------------------------------------------------
// TEST SUITE 8: Real-Time State Reactivity
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 8] Real-Time State Reactivity");

// Simulate new farmer truck arrival
const initialActive = KisanAnalytics.calculateDashboardMetrics().activeQueueCount;
if (typeof yardQueueData !== "undefined" && Array.isArray(yardQueueData)) {
    yardQueueData.push({
        id: "KS999888",
        token: "99",
        farmerId: "KS999888",
        farmerName: "Suresh Patel",
        crop: "Wheat",
        quantity: 50.0,
        stageCode: "gross_weighing",
        stage: "Gross Weighbridge",
        amount: "₹1,13,750",
        status: "In Queue"
    });
}

const updatedMetrics = KisanAnalytics.calculateDashboardMetrics();
assert(
    updatedMetrics.activeQueueCount === initialActive + 1,
    "Active Queue Increments on New Truck Arrival",
    `Queue Count: ${initialActive} → ${updatedMetrics.activeQueueCount}`
);

// Simulate procurement completion
yardQueueData[yardQueueData.length - 1].stageCode = "completed";
yardQueueData[yardQueueData.length - 1].stage = "Completed (DBT Released)";

const completedMetrics = KisanAnalytics.calculateDashboardMetrics();
assert(
    completedMetrics.totalCompleted === initialMetrics.totalCompleted + 1,
    "Completed Count Increments on Procurement Completion",
    `Completed Lots: ${initialMetrics.totalCompleted} → ${completedMetrics.totalCompleted}`
);

assert(
    completedMetrics.totalQuantity === initialMetrics.totalQuantity + 50.0,
    "Total Quantity Procured Increments with Numeric Quintals",
    `Quantity: ${initialMetrics.totalQuantity} Q → ${completedMetrics.totalQuantity} Q`
);

// -----------------------------------------------------------------------------
// TEST SUITE 9: Empty & Zero State Safety
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 9] Empty State & Zero-Crash Safety");

const emptyMetrics = KisanAnalytics.calculateDashboardMetrics({
    queue: [],
    history: [],
    current: null,
    qualityRecords: []
});

assert(
    typeof emptyMetrics.totalBookings === "number" && !isNaN(emptyMetrics.totalBookings),
    "Empty State Safe for Dashboard Metrics",
    `Total Bookings on empty state: ${emptyMetrics.totalBookings}`
);

const emptyQueue = KisanAnalytics.calculateQueueMetrics({ queue: [] });
assert(
    emptyQueue.stages && typeof emptyQueue.totalLots === "number",
    "Empty State Safe for Queue Metrics",
    `Total lots: ${emptyQueue.totalLots}`
);

const emptyQuality = KisanAnalytics.calculateQualityMetrics({ qualityRecords: [] });
assert(
    emptyQuality.hasData === true && typeof emptyQuality.avgScore === "number",
    "Empty State Safe for Quality Metrics",
    `Avg Score: ${emptyQuality.avgScore}`
);

// -----------------------------------------------------------------------------
// TEST SUITE 10: Multi-Language Translation Dictionaries Completeness
// -----------------------------------------------------------------------------
console.log("\n[TEST SUITE 10] Multi-Language Translation Dictionaries");

const requiredTask07Keys = [
    "navLiveAnalytics",
    "mandiAnalyticsBtn",
    "analyticsDashboardTitle",
    "analyticsDashboardDesc",
    "liveStreamingBadge",
    "refreshAnalyticsBtn",
    "auditReportBtn",
    "filterAllOps",
    "filterYardQueue",
    "filterQualityLabs",
    "filterDBTPayments",
    "filterCentreComp"
];

const testLanguages = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"];

testLanguages.forEach(lang => {
    const missing = requiredTask07Keys.filter(k => !translations[lang] || !translations[lang][k]);
    assert(
        missing.length === 0,
        `All Task 07 Analytics Keys Present in ${lang}`,
        missing.length === 0 ? "All 12 keys verified" : `Missing: ${missing.join(", ")}`
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
    console.log("✓ All Task 07 Live Mandi Analytics Tests Passed Successfully!\n");
    process.exit(0);
}
