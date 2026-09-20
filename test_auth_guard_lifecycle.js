/**
 * ==============================================================================
 * TEST SUITE: Task 11 — Authentication, Session Guard, Role Switching & Logout
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

// Mock localStorage
const localStorageStore = {};
global.localStorage = {
    getItem: (key) => localStorageStore[key] !== undefined ? localStorageStore[key] : null,
    setItem: (key, val) => { localStorageStore[key] = String(val); },
    removeItem: (key) => { delete localStorageStore[key]; },
    clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

// Mock DOM & window
global.window = {
    location: {
        pathname: "/index.html",
        href: "index.html"
    },
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
        tagName: (tag || 'DIV').toUpperCase(),
        style: {},
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        innerHTML: '',
        textContent: '',
        appendChild: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        addEventListener: () => {},
        querySelector: () => null,
        querySelectorAll: () => []
    }),
    body: {
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    },
    addEventListener: () => {}
};

// Load script.js
const scriptCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
eval(scriptCode);

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

console.log("==============================================================================");
console.log("RUNNING TEST SUITE: Task 11 — Authentication, Role Switching & Session Guard");
console.log("==============================================================================\n");

// TEST 1: Session Guard Unauthenticated Redirect
console.log("[TEST 1] Session Guard: Unauthenticated Access Redirect");
localStorage.clear();
window.location.pathname = "/index.html";
window.location.href = "index.html";

const guardResultUnauth = checkSessionAuth();
assert(guardResultUnauth === false && window.location.href === "login.html", "Session guard blocks unauthenticated access and redirects to login.html", `Redirect target: ${window.location.href}`);

// TEST 2: Session Guard Authenticated Access
console.log("\n[TEST 2] Session Guard: Authenticated Session Allowance");
localStorage.setItem("kisanSetuAuthToken", "demo-token-ks102458");
window.location.href = "index.html";

const guardResultAuth = checkSessionAuth();
assert(guardResultAuth === true, "Session guard allows access when kisanSetuAuthToken is present", `Token: ${localStorage.getItem("kisanSetuAuthToken")}`);

// TEST 3: Login Page Exemption
console.log("\n[TEST 3] Session Guard: Login Page Exemption");
localStorage.clear();
window.location.pathname = "/login.html";
const loginPageResult = checkSessionAuth();
assert(loginPageResult === true, "Session guard does not trigger infinite redirects on login.html");

// TEST 4: Demo Farmer Authentication State
console.log("\n[TEST 4] Demo Farmer Authentication State Establishment");
window.location.pathname = "/index.html";
switchDemoRole('farmer');

const farmerUser = getCurrentUser();
assert(farmerUser.role === "farmer", "Role correctly set to farmer", `Role: ${farmerUser.role}`);
assert(farmerUser.name === "Ramesh Kumar" && farmerUser.farmerId === "KS102458", "Farmer details match Ramesh Kumar KS102458", `Name: ${farmerUser.name}, ID: ${farmerUser.farmerId}`);
assert(localStorage.getItem("kisanSetuAuthToken") === "demo-token-ks102458", "kisanSetuAuthToken established for farmer", `Token: ${localStorage.getItem("kisanSetuAuthToken")}`);
assert(farmerUser.isLoggedIn === true, "farmerUser.isLoggedIn is true");

// TEST 5: Demo Mandi Officer Role Switch
console.log("\n[TEST 5] Demo Mandi Officer Role Switching");
switchDemoRole('officer');

const officerUser = getCurrentUser();
assert(officerUser.role === "officer", "Role dynamically switched to officer", `Role: ${officerUser.role}`);
assert(officerUser.name === "Officer S. Sharma" && officerUser.farmerId === "MANDI-OFF-902", "Officer details match S. Sharma MANDI-OFF-902", `Officer: ${officerUser.name} (${officerUser.farmerId})`);
assert(localStorage.getItem("kisanSetuAuthToken") === "demo-officer-token", "kisanSetuAuthToken established for officer", `Token: ${localStorage.getItem("kisanSetuAuthToken")}`);
assert(officerUser.isLoggedIn === true, "officerUser.isLoggedIn is true");

// TEST 6: Bidirectional Role Toggle & State Preservation
console.log("\n[TEST 6] Bidirectional Role Toggle & Data Continuity");
// Add a mock queue entry
const mockQueue = [{ token: "07", farmerName: "Ramesh Kumar", stage: "Gate In (Waiting)" }];
localStorage.setItem("kisanSetuYardQueue", JSON.stringify(mockQueue));

switchDemoRole('farmer');
assert(getCurrentUser().role === "farmer", "Switched back to farmer view");
assert(JSON.parse(localStorage.getItem("kisanSetuYardQueue")).length === 1, "Shared queue data preserved across role switches");

// TEST 7: Logout Lifecycle & Session Cleanup
console.log("\n[TEST 7] Logout Execution & Redirect Lifecycle");
window.location.href = "index.html";
executeLogout();

assert(localStorage.getItem("kisanSetuAuthToken") === null, "kisanSetuAuthToken removed on logout");
const loggedOutUser = getCurrentUser();
assert(loggedOutUser.isLoggedIn === false, "User marked as logged out (isLoggedIn: false)");
assert(JSON.parse(localStorage.getItem("kisanSetuYardQueue")).length === 1, "Non-auth mock data (yard queue) safely preserved for future sessions");

// Summary
console.log("\n==============================================================================");
console.log(`TASK 11 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
console.log("==============================================================================");

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
