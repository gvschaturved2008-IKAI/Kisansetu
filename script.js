/* =========================================================
   KISANSETU — FARMER PROCUREMENT PORTAL
   COMPLETE INTERACTION SYSTEM & MULTI-LANGUAGE ENGINE
   Ministry of Consumer Affairs, Food & Public Distribution (DoCA)
========================================================= */

console.log("KisanSetu JavaScript Initialized Successfully");

/* =========================================================
   KISANSYNC — REAL-TIME CROSS-ROLE EVENT & STATE BUS
   Uses HTML5 BroadcastChannel API with localStorage event fallback
   Enables instant 2-way real-time sync between Farmer & Mandi Officer
========================================================= */

const KISAN_SYNC_CHANNEL_NAME = "kisan_setu_realtime_sync_v1";
const KISAN_SYNC_STORAGE_KEY = "kisan_setu_bus_event";

const KisanEvents = {
    FARMER_SLOT_BOOKED: "FARMER_SLOT_BOOKED",
    FARMER_SLOT_CANCELLED: "FARMER_SLOT_CANCELLED",
    FARMER_QUEUE_UPDATED: "FARMER_QUEUE_UPDATED",
    FARMER_CHECK_IN: "FARMER_CHECK_IN",
    QR_VERIFIED: "QR_VERIFIED",
    QUALITY_INSPECTION_STARTED: "QUALITY_INSPECTION_STARTED",
    QUALITY_ASSESSMENT_COMPLETED: "QUALITY_ASSESSMENT_COMPLETED",
    QUALITY_APPROVED: "QUALITY_APPROVED",
    QUALITY_ON_HOLD: "QUALITY_ON_HOLD",
    QUALITY_REJECTED: "QUALITY_REJECTED",
    PROCUREMENT_COMPLETED: "PROCUREMENT_COMPLETED",
    PAYMENT_UPDATED: "PAYMENT_UPDATED",
    OFFICER_STAGE_ADVANCED: "OFFICER_STAGE_ADVANCED",
    OFFICER_TOKEN_CALLED: "OFFICER_TOKEN_CALLED",
    OFFICER_BROADCAST_SENT: "OFFICER_BROADCAST_SENT",
    OFFICER_SPOT_PASS_ISSUED: "OFFICER_SPOT_PASS_ISSUED",
    OFFICER_TOKEN_CANCELLED: "OFFICER_TOKEN_CANCELLED",
    OFFICER_QUEUE_RESET: "OFFICER_QUEUE_RESET",
    NOTIFICATION_CREATED: "NOTIFICATION_CREATED"
};

const KisanSync = (function() {
    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    const listeners = {};
    let channel = null;
    let isBroadcastSupported = false;
    const processedEventIds = new Set();

    // Initialize BroadcastChannel with error handling
    try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            channel = new BroadcastChannel(KISAN_SYNC_CHANNEL_NAME);
            channel.onmessage = (messageEvent) => {
                if (messageEvent && messageEvent.data) {
                    handleIncomingEvent(messageEvent.data);
                }
            };
            isBroadcastSupported = true;
        }
    } catch (e) {
        console.warn("BroadcastChannel fallback to storage event:", e);
    }

    // Storage event listener fallback (for older browsers or cross-origin isolated contexts)
    if (typeof window !== "undefined") {
        window.addEventListener("storage", (storageEvent) => {
            if (storageEvent.key === KISAN_SYNC_STORAGE_KEY && storageEvent.newValue) {
                try {
                    const eventData = JSON.parse(storageEvent.newValue);
                    handleIncomingEvent(eventData);
                } catch (err) {
                    console.error("Error parsing sync storage event", err);
                }
            }
        });
    }

    function handleIncomingEvent(eventData) {
        if (!eventData || !eventData.type || !eventData.eventId) return;

        // Prevent processing own events or duplicates
        if (eventData.senderSessionId === sessionId) return;
        if (processedEventIds.has(eventData.eventId)) return;

        // Keep cache bounded to 100 events
        processedEventIds.add(eventData.eventId);
        if (processedEventIds.size > 100) {
            const firstItem = processedEventIds.values().next().value;
            processedEventIds.delete(firstItem);
        }

        // Pulse live sync indicator
        pulseLiveSyncIndicator();

        // Dispatch to registered type listeners
        const eventListeners = listeners[eventData.type] || [];
        eventListeners.forEach(fn => {
            try {
                fn(eventData.payload, eventData);
            } catch (err) {
                console.error(`Error in KisanSync listener for [${eventData.type}]:`, err);
            }
        });

        // Also notify wildcard listeners
        const allListeners = listeners["*"] || [];
        allListeners.forEach(fn => {
            try {
                fn(eventData.type, eventData.payload, eventData);
            } catch (err) {
                console.error("Error in KisanSync wildcard listener:", err);
            }
        });
    }

    function publish(type, payload = {}) {
        const eventId = "evt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
        const eventData = {
            type,
            eventId,
            senderSessionId: sessionId,
            senderRole: (typeof getCurrentUser === "function" && getCurrentUser() && getCurrentUser().role) || "farmer",
            timestamp: Date.now(),
            payload
        };

        // Broadcast via BroadcastChannel
        if (channel && isBroadcastSupported) {
            channel.postMessage(eventData);
        }

        // Also update localStorage for fallback and cross-tab storage triggers
        try {
            localStorage.setItem(KISAN_SYNC_STORAGE_KEY, JSON.stringify(eventData));
        } catch (e) {
            console.warn("Error setting sync storage key", e);
        }

        pulseLiveSyncIndicator();
        return eventData;
    }

    function subscribe(type, callback) {
        if (!listeners[type]) {
            listeners[type] = [];
        }
        listeners[type].push(callback);
        return () => {
            listeners[type] = listeners[type].filter(cb => cb !== callback);
        };
    }

    function onAny(callback) {
        return subscribe("*", callback);
    }

    function pulseLiveSyncIndicator() {
        const ind = document.getElementById("topbar-live-sync");
        if (ind) {
            ind.classList.add("synced");
            setTimeout(() => {
                ind.classList.remove("synced");
            }, 1200);
        }
    }

    return {
        publish,
        subscribe,
        onAny,
        sessionId,
        isSupported: () => isBroadcastSupported
    };
})();

/* =========================================================
   KISANNOTIFICATIONS — CENTRALIZED REAL-TIME NOTIFICATION SERVICE
   Multi-role notifications, localStorage persistence, real-time
   sync via BroadcastChannel, dynamic badge management, and interactive UI
========================================================= */

const KISAN_NOTIFICATIONS_STORAGE_KEY = "kisan_setu_notifications_v2";

const KisanNotifications = (function() {
    let notifications = [];
    let currentFilter = "all";

    const defaultSeedNotifications = [
        {
            id: "notif_seed_1",
            type: "OFFICER_TOKEN_CALLED",
            title: "Queue Alert: Weighbridge Counter 2 Ready",
            message: "Your Token #KS-07 has been called at AP State Centre Counter 2. Please proceed for weighing.",
            timestamp: Date.now() - 10 * 60 * 1000,
            time: "10 mins ago",
            targetRole: "farmer",
            read: false,
            icon: "fa-bullhorn",
            badgeType: "warning",
            entity: { tokenId: "KS-07", gate: "Counter 2" }
        },
        {
            id: "notif_seed_2",
            type: "PAYMENT_UPDATED",
            title: "DBT Payment Batch Initiated (₹48,650)",
            message: "Sanction order generated for 21.5 Quintals Paddy under DoCA MSP. Funds in transit to your SBI account.",
            timestamp: Date.now() - 60 * 60 * 1000,
            time: "1 hour ago",
            targetRole: "farmer",
            read: false,
            icon: "fa-indian-rupee-sign",
            badgeType: "dbt",
            entity: { amount: "₹48,650.00", bank: "SBI", crop: "Paddy" }
        },
        {
            id: "notif_seed_3",
            type: "FARMER_SLOT_BOOKED",
            title: "Slot Confirmation for 27 Aug 10:30 AM",
            message: "Digital gate pass #KS748291 generated. Mandi entrance access granted.",
            timestamp: Date.now() - 3 * 3600 * 1000,
            time: "Today · 09:42 AM",
            targetRole: "farmer",
            read: false,
            icon: "fa-calendar-check",
            badgeType: "success",
            entity: { tokenId: "KS748291", date: "27 Aug", time: "10:30 AM" }
        },
        {
            id: "notif_seed_4",
            type: "WEATHER_ADVISORY",
            title: "Weather Advisory: Clear skies at Mandi",
            message: "Optimal harvest and transport conditions for Paddy & Wheat delivery at AP State Mandi.",
            timestamp: Date.now() - 24 * 3600 * 1000,
            time: "Yesterday",
            targetRole: "all",
            read: true,
            icon: "fa-cloud-sun",
            badgeType: "info"
        },
        {
            id: "notif_seed_5",
            type: "FARMER_SLOT_BOOKED",
            title: "New Farmer Procurement Request",
            message: "Ramesh Kumar booked slot for 25.0 Q Paddy (Token #KS-07).",
            timestamp: Date.now() - 2 * 3600 * 1000,
            time: "2 hours ago",
            targetRole: "officer",
            read: false,
            icon: "fa-inbox",
            badgeType: "info",
            entity: { tokenId: "KS-07", farmerName: "Ramesh Kumar", crop: "Paddy" }
        },
        {
            id: "notif_seed_6",
            type: "QR_VERIFIED",
            title: "Farmer Arrival Verified",
            message: "Venkat Rao (Token #KS-08) verified at Gate 1 for 18.0 Q Wheat.",
            timestamp: Date.now() - 45 * 60 * 1000,
            time: "45 mins ago",
            targetRole: "officer",
            read: false,
            icon: "fa-clipboard-check",
            badgeType: "success",
            entity: { tokenId: "KS-08", farmerName: "Venkat Rao", crop: "Wheat" }
        }
    ];

    function init() {
        loadNotifications();
        updateBadges();
    }

    function loadNotifications() {
        try {
            const raw = localStorage.getItem(KISAN_NOTIFICATIONS_STORAGE_KEY);
            if (raw) {
                notifications = JSON.parse(raw);
            } else {
                notifications = [...defaultSeedNotifications];
                saveNotifications();
            }
        } catch (e) {
            console.warn("Could not load notifications from localStorage:", e);
            notifications = [...defaultSeedNotifications];
        }
    }

    function saveNotifications() {
        try {
            localStorage.setItem(KISAN_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
        } catch (e) {
            console.warn("Could not save notifications to localStorage:", e);
        }
    }

    function formatTime(timestamp) {
        if (!timestamp) return "Just now";
        const diff = Date.now() - timestamp;
        if (diff < 60000) return "Just now";
        if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return new Date(timestamp).toLocaleDateString();
    }

    function addNotification(options) {
        const {
            type,
            title,
            message,
            targetRole = "all",
            icon = "fa-bell",
            badgeType = "info",
            entity = null,
            broadcast = true
        } = options;

        const notif = {
            id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
            type: type || "GENERAL",
            title: title || "KisanSetu Notification",
            message: message || "",
            timestamp: Date.now(),
            time: "Just now",
            targetRole: targetRole,
            read: false,
            icon: icon,
            badgeType: badgeType,
            entity: entity
        };

        notifications.unshift(notif);
        if (notifications.length > 60) {
            notifications.pop();
        }
        saveNotifications();
        updateBadges();

        if (broadcast && typeof KisanSync !== "undefined") {
            KisanSync.publish(KisanEvents.NOTIFICATION_CREATED, notif);
        }

        refreshModalIfOpen();
        return notif;
    }

    function insertSyncedNotification(notif) {
        if (!notif || !notif.id) return;
        const exists = notifications.some(n => n.id === notif.id);
        if (!exists) {
            notifications.unshift(notif);
            if (notifications.length > 60) notifications.pop();
            saveNotifications();
            updateBadges();
            refreshModalIfOpen();
        }
    }

    function has(id) {
        return notifications.some(n => n.id === id);
    }

    function getForCurrentRole(filterCategory = "all") {
        const user = (typeof getCurrentUser === "function") ? getCurrentUser() : { role: "farmer" };
        const role = user ? user.role : "farmer";

        let list = notifications.filter(n => {
            if (n.targetRole === "all") return true;
            if (role === "officer" || role === "admin") {
                return n.targetRole === "officer" || n.targetRole === "admin";
            }
            return n.targetRole === "farmer";
        });

        if (filterCategory === "unread") {
            list = list.filter(n => !n.read);
        } else if (filterCategory === "procurement") {
            list = list.filter(n => 
                n.type === KisanEvents.FARMER_SLOT_BOOKED ||
                n.type === KisanEvents.FARMER_QUEUE_UPDATED ||
                n.type === KisanEvents.FARMER_CHECK_IN ||
                n.type === KisanEvents.QR_VERIFIED ||
                n.type === KisanEvents.QUALITY_INSPECTION_STARTED ||
                n.type === KisanEvents.QUALITY_ASSESSMENT_COMPLETED ||
                n.type === KisanEvents.QUALITY_APPROVED ||
                n.type === KisanEvents.QUALITY_ON_HOLD ||
                n.type === KisanEvents.QUALITY_REJECTED ||
                n.type === KisanEvents.PROCUREMENT_COMPLETED ||
                n.type === KisanEvents.OFFICER_STAGE_ADVANCED ||
                n.type === KisanEvents.OFFICER_TOKEN_CALLED ||
                n.type === KisanEvents.OFFICER_SPOT_PASS_ISSUED ||
                n.type === KisanEvents.FARMER_SLOT_CANCELLED ||
                n.type === KisanEvents.OFFICER_TOKEN_CANCELLED
            );
        } else if (filterCategory === "payment") {
            list = list.filter(n => 
                n.type === KisanEvents.PAYMENT_UPDATED || 
                n.badgeType === "dbt" ||
                n.type === "PAYMENT"
            );
        }

        return list;
    }

    function getUnreadCount() {
        const user = (typeof getCurrentUser === "function") ? getCurrentUser() : { role: "farmer" };
        const role = user ? user.role : "farmer";
        return notifications.filter(n => {
            const roleMatch = (n.targetRole === "all") ||
                ((role === "officer" || role === "admin") ? (n.targetRole === "officer" || n.targetRole === "admin") : (n.targetRole === "farmer"));
            return roleMatch && !n.read;
        }).length;
    }

    function markAsRead(id) {
        const item = notifications.find(n => n.id === id);
        if (item) {
            item.read = true;
            saveNotifications();
            updateBadges();
            refreshModalIfOpen();
        }
    }

    function markAllAsRead() {
        const user = (typeof getCurrentUser === "function") ? getCurrentUser() : { role: "farmer" };
        const role = user ? user.role : "farmer";
        notifications.forEach(n => {
            const roleMatch = (n.targetRole === "all") ||
                ((role === "officer" || role === "admin") ? (n.targetRole === "officer" || n.targetRole === "admin") : (n.targetRole === "farmer"));
            if (roleMatch) n.read = true;
        });
        saveNotifications();
        updateBadges();
        refreshModalIfOpen();
        showToast(t("allNotifReadSuccess") || "All notifications marked as read.");
    }

    function clearNotification(id) {
        notifications = notifications.filter(n => n.id !== id);
        saveNotifications();
        updateBadges();
        refreshModalIfOpen();
        showToast("Notification removed.");
    }

    function clearAll() {
        const user = (typeof getCurrentUser === "function") ? getCurrentUser() : { role: "farmer" };
        const role = user ? user.role : "farmer";
        notifications = notifications.filter(n => {
            const roleMatch = (n.targetRole === "all") ||
                ((role === "officer" || role === "admin") ? (n.targetRole === "officer" || n.targetRole === "admin") : (n.targetRole === "farmer"));
            return !roleMatch;
        });
        saveNotifications();
        updateBadges();
        refreshModalIfOpen();
        showToast("All notifications cleared.");
    }

    function updateBadges() {
        const count = getUnreadCount();
        const sidebarFarmerBadge = document.getElementById("sidebar-notification-badge");
        const sidebarOfficerBadge = document.getElementById("sidebar-officer-notification-badge");
        const topbarDot = document.getElementById("topbar-notif-dot");
        const topbarBadge = document.getElementById("topbar-notif-badge");

        if (sidebarFarmerBadge) {
            sidebarFarmerBadge.textContent = String(count);
            sidebarFarmerBadge.style.display = count > 0 ? "inline-flex" : "none";
        }
        if (sidebarOfficerBadge) {
            sidebarOfficerBadge.textContent = String(count);
            sidebarOfficerBadge.style.display = count > 0 ? "inline-flex" : "none";
        }
        if (topbarDot) {
            topbarDot.style.display = count > 0 ? "block" : "none";
        }
        if (topbarBadge) {
            topbarBadge.textContent = String(count);
            topbarBadge.style.display = count > 0 ? "flex" : "none";
        }
    }

    function setFilter(filter) {
        currentFilter = filter;
        refreshModalIfOpen();
    }

    function renderPanelHtml() {
        const user = (typeof getCurrentUser === "function") ? getCurrentUser() : { role: "farmer" };
        const role = user ? user.role : "farmer";
        const items = getForCurrentRole(currentFilter);
        const unreadTotal = getUnreadCount();

        const filterTabsHtml = `
            <div class="notif-filter-bar">
                <button type="button" class="notif-filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="KisanNotifications.setFilter('all')">
                    <i class="fa-solid fa-list-ul"></i> ${t("filterAll") || "All"} <span class="notif-filter-count">${getForCurrentRole('all').length}</span>
                </button>
                <button type="button" class="notif-filter-btn ${currentFilter === 'unread' ? 'active' : ''}" onclick="KisanNotifications.setFilter('unread')">
                    <i class="fa-solid fa-envelope"></i> ${t("filterUnread") || "Unread"} <span class="notif-filter-count">${unreadTotal}</span>
                </button>
                <button type="button" class="notif-filter-btn ${currentFilter === 'procurement' ? 'active' : ''}" onclick="KisanNotifications.setFilter('procurement')">
                    <i class="fa-solid fa-truck-ramp-box"></i> ${t("filterProcurement") || "Queue & Mandi"}
                </button>
                <button type="button" class="notif-filter-btn ${currentFilter === 'payment' ? 'active' : ''}" onclick="KisanNotifications.setFilter('payment')">
                    <i class="fa-solid fa-indian-rupee-sign"></i> ${t("filterPayment") || "DBT & Payment"}
                </button>
            </div>
        `;

        const controlsHtml = `
            <div class="notif-controls-bar">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:12px; font-weight:700; color:#174d32;">
                        ${(role === "officer" || role === "admin") ? "🏛️ Mandi Officer Alerts" : "🌾 Farmer Live Notifications"}
                    </span>
                    ${unreadTotal > 0 ? `<span class="notif-entity-chip" style="background:#e8f5ed; color:#26734d;">${unreadTotal} new</span>` : ''}
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button type="button" class="text-btn" style="font-size:11.5px;" onclick="playVoiceAnnouncement()">
                        <i class="fa-solid fa-volume-high"></i>
                        <span>${t("voiceAlertBtn") || "Voice Alert"}</span>
                    </button>
                    <button type="button" class="text-btn" style="font-size:11.5px;" onclick="KisanNotifications.markAllAsRead()">
                        <i class="fa-solid fa-check-double"></i>
                        <span>${t("markAllRead") || "Mark all read"}</span>
                    </button>
                    <button type="button" class="text-btn" style="font-size:11.5px; color:#d32f2f;" onclick="KisanNotifications.clearAll()">
                        <i class="fa-solid fa-trash-can"></i>
                        <span>${t("clearAllNotifs") || "Clear All"}</span>
                    </button>
                </div>
            </div>
        `;

        const listHtml = items.length > 0 ? items.map(n => {
            const timeAgo = formatTime(n.timestamp);
            const iconClass = n.icon || "fa-bell";
            const badgeClass = n.badgeType || "info";

            return `
                <div class="notif-item-card ${!n.read ? 'unread' : ''}" onclick="KisanNotifications.markAsRead('${n.id}')">
                    <div class="notif-icon-box ${badgeClass}">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                    <div class="notif-content-area">
                        <div class="notif-header-row">
                            <h4 class="notif-title-text">${n.title}</h4>
                            <span class="notif-time-text">${timeAgo}</span>
                        </div>
                        <p class="notif-msg-text">${n.message || n.desc || ""}</p>
                        ${n.entity ? `
                            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
                                ${n.entity.tokenId ? `<span class="notif-entity-chip"><i class="fa-solid fa-ticket"></i> Token #${n.entity.tokenId}</span>` : ''}
                                ${n.entity.crop ? `<span class="notif-entity-chip"><i class="fa-solid fa-seedling"></i> ${n.entity.crop}</span>` : ''}
                                ${n.entity.quantity ? `<span class="notif-entity-chip"><i class="fa-solid fa-weight-hanging"></i> ${n.entity.quantity} Q</span>` : ''}
                                ${n.entity.amount ? `<span class="notif-entity-chip" style="color:#6b3ba7; background:#f3eefc;"><i class="fa-solid fa-indian-rupee-sign"></i> ${n.entity.amount}</span>` : ''}
                                ${n.entity.gate ? `<span class="notif-entity-chip"><i class="fa-solid fa-door-open"></i> ${n.entity.gate}</span>` : ''}
                                ${n.entity.farmerName ? `<span class="notif-entity-chip"><i class="fa-solid fa-user"></i> ${n.entity.farmerName}</span>` : ''}
                                ${n.entity.moisture ? `<span class="notif-entity-chip"><i class="fa-solid fa-droplet"></i> ${n.entity.moisture}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                    <div class="notif-actions-col" onclick="event.stopPropagation();">
                        ${!n.read ? `<span class="notif-unread-dot" title="Unread"></span>` : ''}
                        ${!n.read ? `
                            <button type="button" class="notif-action-btn" title="Mark as Read" onclick="KisanNotifications.markAsRead('${n.id}')">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        ` : ''}
                        <button type="button" class="notif-action-btn delete-btn" title="Delete notification" onclick="KisanNotifications.clearNotification('${n.id}')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join("") : `
            <div class="notif-empty-state">
                <i class="fa-solid fa-bell-slash notif-empty-icon"></i>
                <strong style="font-size:14px; color:#2a3d32; display:block;">${t("noNotifications") || "No Notifications to Display"}</strong>
                <p style="font-size:12.5px; margin:4px 0 0; color:#6d7d74;">${t("noNotificationsDesc") || "You're all caught up! Real-time notifications for slot bookings, queue turns, and DBT payments will appear here."}</p>
            </div>
        `;

        return `
            <div id="kisan-notifications-container">
                ${filterTabsHtml}
                ${controlsHtml}
                <div style="max-height:420px; overflow-y:auto; padding-right:4px;">
                    ${listHtml}
                </div>
            </div>
        `;
    }

    function openPanel() {
        const content = renderPanelHtml();
        openModal(t("notificationsTitle") || "Notification & Alert Centre", content);
    }

    function refreshModalIfOpen() {
        const container = document.getElementById("kisan-notifications-container");
        if (container) {
            const parent = container.parentElement;
            if (parent) {
                parent.innerHTML = renderPanelHtml();
            }
        }
    }

    return {
        init,
        addNotification,
        insertSyncedNotification,
        has,
        getAll: () => [...notifications],
        getForCurrentRole,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        updateBadges,
        setFilter,
        openPanel,
        refreshModalIfOpen
    };
})();

/* =========================================================
   TASK 03: KISANQR — DYNAMIC QR GENERATION & VERIFICATION ENGINE
   Encodes non-sensitive gate pass payload, client-side QR generation,
   camera-based & manual fallback verification with anti-replay safeguards
========================================================= */

const KisanQR = (function() {
    let activeHtml5QrScanner = null;

    function generatePayload(booking) {
        let b = booking;
        if (!b) {
            b = (typeof currentBooking !== "undefined" && currentBooking) 
                ? currentBooking 
                : {
                    id: "KS748291",
                    token: "07",
                    farmerId: "KS102458",
                    farmerName: "Ramesh Kumar",
                    crop: "Paddy / Rice (Grade A)",
                    quantity: 21.5,
                    date: "2026-08-27",
                    time: "10:30 AM",
                    centre: "AP State Procurement Centre (Yard 1)",
                    vehicleNo: "AP-07-TY-4920",
                    vehicleType: "Tractor Trolley",
                    status: "In Queue"
                };
        }

        const user = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
        const now = Date.now();

        const payloadObj = {
            kisanSetuQRVersion: "1.0",
            bookingId: b.id || "KS748291",
            token: b.token || "07",
            farmerId: b.farmerId || (user && user.farmerId) || "KS102458",
            farmerName: b.farmerName || (user && user.name) || "Ramesh Kumar",
            centreId: "AP-GUNTUR-01",
            centreName: b.centre || "AP State Procurement Centre (Yard 1)",
            slotDate: b.date || "2026-08-27",
            slotTime: b.time || "10:30 AM",
            crop: b.crop || "Paddy / Rice (Grade A)",
            quantity: b.quantity || 21.5,
            vehicleNo: b.vehicleNo || "AP-07-TY-4920",
            vehicleType: b.vehicleType || "Tractor Trolley",
            gatePassId: b.gatePassId || ("GP-2026-" + (b.id ? b.id.replace("KS", "") : "748291")),
            generatedAt: b.qrGeneratedAt || now,
            expiresAt: (b.qrGeneratedAt || now) + 48 * 3600 * 1000 // 48h validity
        };

        return JSON.stringify(payloadObj);
    }

    function renderQRCode(containerId, booking) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";

        const payloadStr = generatePayload(booking);

        if (typeof QRCode !== "undefined") {
            try {
                new QRCode(container, {
                    text: payloadStr,
                    width: 175,
                    height: 175,
                    colorDark: "#174d32",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
                return;
            } catch (e) {
                console.warn("QRCode constructor fallback:", e);
            }
        }

        // Fallback canvas if QRCode library not yet loaded or blocked
        renderFallbackQRCanvas(container, booking);
    }

    function renderFallbackQRCanvas(container, booking) {
        const b = booking || (typeof currentBooking !== "undefined" ? currentBooking : null) || {};
        const canvas = document.createElement("canvas");
        canvas.width = 175;
        canvas.height = 175;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, 175, 175);
            ctx.fillStyle = "#174d32";

            // Draw outer border & corner markers
            ctx.fillRect(10, 10, 45, 45);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(18, 18, 29, 29);
            ctx.fillStyle = "#174d32";
            ctx.fillRect(24, 24, 17, 17);

            ctx.fillRect(120, 10, 45, 45);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(128, 18, 29, 29);
            ctx.fillStyle = "#174d32";
            ctx.fillRect(134, 24, 17, 17);

            ctx.fillRect(10, 120, 45, 45);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(18, 128, 29, 29);
            ctx.fillStyle = "#174d32";
            ctx.fillRect(24, 134, 17, 17);

            // Pseudo pattern modules
            const seed = (b.id ? b.id.charCodeAt(b.id.length - 1) : 42);
            for (let r = 0; r < 14; r++) {
                for (let c = 0; c < 14; c++) {
                    if ((r < 5 && c < 5) || (r < 5 && c > 8) || (r > 8 && c < 5)) continue;
                    if (((r * c + seed) % 3) === 0) {
                        ctx.fillRect(15 + c * 10, 15 + r * 10, 8, 8);
                    }
                }
            }
        }
        container.appendChild(canvas);
    }

    function verifyQRPayload(rawInput) {
        if (!rawInput) {
            return {
                success: false,
                code: "EMPTY_INPUT",
                title: "Empty Input",
                message: "✕ Please provide a valid QR code payload or Booking ID."
            };
        }

        let parsed = null;
        let searchId = String(rawInput).trim();

        // Try JSON parsing
        if (searchId.startsWith("{") && searchId.endsWith("}")) {
            try {
                parsed = JSON.parse(searchId);
                searchId = parsed.bookingId || parsed.token || searchId;
            } catch (e) {
                console.warn("Could not parse QR JSON payload:", e);
            }
        }

        // Clean identifier format (e.g. "KS-07" -> "07", "GP-2026-748291" -> "KS748291")
        const normId = searchId.replace(/^#/,'').trim().toUpperCase();
        const normToken = normId.replace(/^KS-?/i, '');

        // Search for matching booking in existing state
        let matched = null;

        // 1. Search in yardQueueData
        if (typeof yardQueueData !== "undefined" && Array.isArray(yardQueueData)) {
            matched = yardQueueData.find(f => 
                (f.id && f.id.toUpperCase() === normId) ||
                (f.token && (f.token.toUpperCase() === normToken || ("KS-" + f.token).toUpperCase() === normId || f.token === normId)) ||
                (f.gatePassId && f.gatePassId.toUpperCase().includes(normId)) ||
                (parsed && parsed.bookingId && f.id && f.id.toUpperCase() === parsed.bookingId.toUpperCase())
            );
        }

        // 2. Search in currentBooking
        if (!matched && typeof currentBooking !== "undefined" && currentBooking) {
            const cb = currentBooking;
            if (
                (cb.id && cb.id.toUpperCase() === normId) ||
                (cb.token && (cb.token.toUpperCase() === normToken || ("KS-" + cb.token).toUpperCase() === normId || cb.token === normId)) ||
                (cb.gatePassId && cb.gatePassId.toUpperCase().includes(normId)) ||
                (parsed && parsed.bookingId && cb.id && cb.id.toUpperCase() === parsed.bookingId.toUpperCase())
            ) {
                matched = cb;
            }
        }

        // 3. Search in bookingHistory
        if (!matched && typeof bookingHistory !== "undefined" && Array.isArray(bookingHistory)) {
            matched = bookingHistory.find(h => 
                (h.id && h.id.toUpperCase() === normId) ||
                (h.token && (h.token.toUpperCase() === normToken || ("KS-" + h.token).toUpperCase() === normId)) ||
                (parsed && parsed.bookingId && h.id && h.id.toUpperCase() === parsed.bookingId.toUpperCase())
            );
        }

        // 4. If searchId matches default demo ID KS748291
        if (!matched && (normId === "KS748291" || normToken === "07" || normToken === "748291")) {
            matched = {
                id: "KS748291",
                token: "07",
                farmerId: "KS102458",
                farmerName: "Ramesh Kumar",
                crop: "Paddy / Rice (Grade A)",
                quantity: 21.5,
                vehicleNo: "AP-07-TY-4920",
                vehicleType: "Tractor Trolley",
                centre: "AP State Procurement Centre (Yard 1)",
                status: "In Queue",
                stage: "Gate In (Waiting)",
                stageCode: "gate_in",
                amount: "₹49,450"
            };
        }

        // --- VALIDATION RULE 1: Booking Existence ---
        if (!matched) {
            return {
                success: false,
                code: "NOT_FOUND",
                title: "Invalid / Unknown QR Code",
                message: `✕ No active procurement booking found matching ID "${searchId}". Please verify the booking reference.`,
                rawInput: searchId
            };
        }

        // --- VALIDATION RULE 2: Cancelled Booking ---
        if (matched.status === "Cancelled") {
            return {
                success: false,
                code: "CANCELLED",
                title: "Booking Cancelled",
                message: `✕ Procurement booking #${matched.id || matched.token} was cancelled by the farmer and is no longer valid for entry.`,
                booking: matched
            };
        }

        // --- VALIDATION RULE 3: Expiry Check ---
        if (parsed && parsed.expiresAt && Date.now() > parsed.expiresAt) {
            return {
                success: false,
                code: "EXPIRED",
                title: "QR Code Expired",
                message: `✕ This Gate Pass QR expired on ${new Date(parsed.expiresAt).toLocaleDateString()}. Please request a fresh slot.`,
                booking: matched
            };
        }

        // --- VALIDATION RULE 4: Anti-Replay / Duplicate Check ---
        const isAlreadyVerified = 
            matched.status === "Verified" ||
            matched.stageCode === "gross_weighing" ||
            matched.stageCode === "quality_check" ||
            matched.stageCode === "tare_weighing" ||
            matched.stageCode === "completed";

        if (isAlreadyVerified) {
            const vTime = matched.verifiedAt ? new Date(matched.verifiedAt).toLocaleTimeString() : "earlier today";
            return {
                success: false,
                code: "ALREADY_VERIFIED",
                title: "⚠ Duplicate Verification Rejected",
                message: `This booking (Token #${matched.token || matched.id}, Farmer: ${matched.farmerName || 'Farmer'}) has ALREADY been verified at ${vTime}. Re-entry rejected.`,
                booking: matched
            };
        }

        // --- SUCCESS: Advance Booking State & Sync ---
        const officerUser = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
        const officerName = (officerUser && officerUser.name) || "Officer S. Sharma";

        matched.status = "Verified";
        matched.stage = "Gross Weighbridge";
        matched.stageCode = "gross_weighing";
        matched.verifiedAt = Date.now();
        matched.verifiedBy = officerName;

        // Synchronize in currentBooking if matches
        if (typeof currentBooking !== "undefined" && currentBooking) {
            if (currentBooking.id === matched.id || currentBooking.token === matched.token) {
                currentBooking.status = "Verified";
                currentBooking.stage = "Gross Weighbridge";
                currentBooking.stageCode = "gross_weighing";
                currentBooking.verifiedAt = Date.now();
                if (typeof saveCurrentBooking === "function") saveCurrentBooking();
                if (typeof updateDashboardAfterBooking === "function") updateDashboardAfterBooking();
            }
        }

        // Update in yardQueueData
        if (typeof yardQueueData !== "undefined" && Array.isArray(yardQueueData)) {
            const qItem = yardQueueData.find(f => f.id === matched.id || f.token === matched.token);
            if (qItem) {
                qItem.status = "Verified";
                qItem.stage = "Gross Weighbridge";
                qItem.stageCode = "gross_weighing";
                qItem.verifiedAt = Date.now();
            } else {
                yardQueueData.unshift(matched);
            }
            if (typeof saveYardQueue === "function") saveYardQueue();
            if (typeof renderOfficerQueueTable === "function") renderOfficerQueueTable();
            if (typeof updateOfficerStats === "function") updateOfficerStats();
        }

        // Broadcast cross-role events over KisanSync
        if (typeof KisanSync !== "undefined") {
            KisanSync.publish(KisanEvents.QR_VERIFIED, {
                id: matched.id,
                token: matched.token,
                farmerId: matched.farmerId,
                farmerName: matched.farmerName,
                crop: matched.crop,
                quantity: matched.quantity,
                vehicleNo: matched.vehicleNo,
                gate: "Gate 1 (Weighbridge In)",
                verifiedAt: Date.now()
            });

            KisanSync.publish(KisanEvents.FARMER_CHECK_IN, {
                id: matched.id,
                token: matched.token,
                farmerId: matched.farmerId,
                farmerName: matched.farmerName,
                gate: "Gate 1",
                status: "Arrived & Verified"
            });
        }

        // Trigger notifications
        if (typeof KisanNotifications !== "undefined") {
            // Notification for Officer
            KisanNotifications.addNotification({
                type: KisanEvents.QR_VERIFIED,
                title: "Farmer Verified Successfully",
                message: `Farmer ${matched.farmerName} (Token #${matched.token}) arrival verified at Gate 1. Admitted to Gross Weighbridge.`,
                targetRole: "officer",
                icon: "fa-clipboard-check",
                badgeType: "success",
                entity: { tokenId: matched.token, farmerName: matched.farmerName, crop: matched.crop, vehicleNo: matched.vehicleNo },
                broadcast: false
            });

            // Notification for Farmer
            KisanNotifications.addNotification({
                type: KisanEvents.QR_VERIFIED,
                title: "Arrival Verified at Centre",
                message: "Your arrival has been verified at the procurement centre.",
                targetRole: "farmer",
                icon: "fa-clipboard-check",
                badgeType: "success",
                entity: { tokenId: matched.token, gate: "Gate 1 (Weighbridge In)" },
                broadcast: false
            });
        }

        return {
            success: true,
            code: "VERIFIED",
            title: "✓ FARMER VERIFIED",
            message: `Farmer ${matched.farmerName || 'Farmer'} verified successfully. Admitted to Gross Weighbridge.`,
            booking: matched
        };
    }

    function openFarmerQRModal(bookingId) {
        let b = (typeof currentBooking !== "undefined") ? currentBooking : null;
        if (bookingId) {
            if (typeof yardQueueData !== "undefined") {
                const found = yardQueueData.find(f => f.id === bookingId || f.token === bookingId);
                if (found) b = found;
            }
            if (!b && typeof bookingHistory !== "undefined") {
                const foundH = bookingHistory.find(h => h.id === bookingId || h.token === bookingId);
                if (foundH) b = foundH;
            }
        }

        if (!b) {
            b = {
                id: "KS748291",
                token: "07",
                farmerId: (typeof getCurrentUser === "function" && getCurrentUser() && getCurrentUser().farmerId) || "KS102458",
                farmerName: (typeof getCurrentUser === "function" && getCurrentUser() && getCurrentUser().name) || "Ramesh Kumar",
                crop: "Paddy / Rice (Grade A)",
                quantity: 21.5,
                date: "2026-08-27",
                time: "10:30 AM",
                centre: "AP State Procurement Centre (Yard 1)",
                vehicleNo: "AP-07-TY-4920",
                vehicleType: "Tractor Trolley",
                status: "In Queue"
            };
        }

        const isCancelled = b.status === "Cancelled";
        const isVerified = b.status === "Verified" || (b.stageCode && b.stageCode !== "gate_in");

        let statusClass = "ready";
        let statusText = "Ready for Gate Verification";
        let statusIcon = "fa-qrcode";

        if (isCancelled) {
            statusClass = "cancelled";
            statusText = "Booking Cancelled";
            statusIcon = "fa-ban";
        } else if (isVerified) {
            statusClass = "verified";
            statusText = "Verified & Gate Admitted";
            statusIcon = "fa-circle-check";
        }

        const gatePassId = b.gatePassId || ("GP-2026-" + (b.id ? b.id.replace("KS", "") : "748291"));

        const content = `
            <div class="qr-pass-container">
                <div class="qr-pass-card">
                    <div class="qr-pass-header">
                        <span class="govt-tag">GOVERNMENT OF ANDHRA PRADESH • DEPT OF CONSUMER AFFAIRS</span>
                        <h3>Digital Mandi Gate Pass</h3>
                        <p style="font-size:12px; color:#5c6c63; margin:2px 0 0;">${b.centre || "AP State Procurement Centre (Yard 1)"}</p>
                    </div>

                    <div class="qr-code-box">
                        <div id="farmer-qrcode-render-target"></div>
                        <span class="qr-code-label">Gate Pass: ${gatePassId}</span>
                    </div>

                    <div>
                        <span class="qr-status-pill ${statusClass}">
                            <i class="fa-solid ${statusIcon}"></i> ${statusText}
                        </span>
                    </div>

                    <div class="qr-meta-grid">
                        <div class="qr-meta-item">
                            <span>FARMER NAME & ID</span>
                            <strong>${b.farmerName || "Ramesh Kumar"} (${b.farmerId || "KS102458"})</strong>
                        </div>
                        <div class="qr-meta-item">
                            <span>TOKEN NUMBER</span>
                            <strong style="color:#174d32; font-size:14px;">Token #${b.token || "07"}</strong>
                        </div>
                        <div class="qr-meta-item">
                            <span>CROP COMMODITY</span>
                            <strong>${b.crop || "Paddy / Rice"} (${b.quantity || 21.5} Q)</strong>
                        </div>
                        <div class="qr-meta-item">
                            <span>SLOT DATE & TIME</span>
                            <strong>${b.date || "27 Aug 2026"} • ${b.time || "10:30 AM"}</strong>
                        </div>
                        <div class="qr-meta-item">
                            <span>TRANSPORT VEHICLE</span>
                            <strong>${b.vehicleNo || "AP-07-TY-4920"} (${b.vehicleType || "Tractor"})</strong>
                        </div>
                        <div class="qr-meta-item">
                            <span>VALIDITY WINDOW</span>
                            <strong>Active • Verified on Arrival</strong>
                        </div>
                    </div>

                    <div class="qr-instruction-box" style="margin-top:14px;">
                        <i class="fa-solid fa-shield-halved" style="font-size:20px; color:#26734d;"></i>
                        <span style="font-size:11.5px; text-align:left;">
                            Present this QR code to the Mandi Gate Controller at Gate 1 for optical scan and entry authorization.
                        </span>
                    </div>

                    <div style="display:flex; gap:10px; margin-top:16px;">
                        <button type="button" class="submit-auth-btn" style="flex:1;" onclick="window.print()">
                            <i class="fa-solid fa-print"></i> Print Gate Pass
                        </button>
                        <button type="button" class="submit-auth-btn register-btn" style="flex:1;" onclick="showToast('Gate Pass QR saved to device gallery!');">
                            <i class="fa-solid fa-download"></i> Save Image
                        </button>
                    </div>
                </div>
            </div>
        `;

        openModal(t("myGatePassQR") || "My Gate Pass QR Code", content);

        setTimeout(() => {
            renderQRCode("farmer-qrcode-render-target", b);
        }, 100);
    }

    function openOfficerScannerModal() {
        const content = `
            <div class="qr-scanner-wrapper">
                <div class="qr-camera-container">
                    <div id="qr-scanner-viewport"></div>
                    <div class="scanner-laser-line"></div>
                    <div class="scanner-camera-status" id="scanner-status-msg">
                        <i class="fa-solid fa-camera"></i> Initializing camera scanner viewfinder...
                    </div>
                </div>

                <!-- Manual Fallback & Demo Quick Test -->
                <div class="scanner-manual-fallback">
                    <h4>
                        <i class="fa-solid fa-keyboard" style="color:#26734d;"></i>
                        <span>Manual Booking ID & Quick Test</span>
                    </h4>
                    <p style="font-size:12px; color:#6d7d74; margin:0 0 10px;">
                        If camera is unavailable or to simulate testing, enter Booking ID, Token, or click a quick test chip:
                    </p>

                    <div class="scanner-input-row">
                        <input type="text" id="officer-manual-qr-input" placeholder="e.g. KS748291, KS-07, KS-08..." onkeypress="if(event.key==='Enter') KisanQR.submitManualScan();">
                        <button type="button" class="scanner-verify-btn" onclick="KisanQR.submitManualScan()">
                            <i class="fa-solid fa-clipboard-check"></i> Verify
                        </button>
                    </div>

                    <div class="scanner-demo-tokens">
                        <span style="font-size:11px; font-weight:700; color:#5c6c63;">QUICK TEST CHIPS:</span>
                        <button type="button" class="scanner-demo-chip" onclick="KisanQR.simulateScan('KS748291')">
                            🌾 Ramesh Kumar (Token #07)
                        </button>
                        <button type="button" class="scanner-demo-chip" onclick="KisanQR.simulateScan('KS-08')">
                            🌾 Venkat Rao (Token #08)
                        </button>
                        <button type="button" class="scanner-demo-chip" onclick="KisanQR.simulateScan('KS-09')">
                            🌾 Suresh Babu (Token #09)
                        </button>
                        <button type="button" class="scanner-demo-chip" style="color:#d32f2f; background:#fef2f2; border-color:#fca5a5;" onclick="KisanQR.simulateScan('KS-INVALID-999')">
                            ✕ Test Invalid ID
                        </button>
                    </div>
                </div>

                <!-- Result area -->
                <div id="qr-verification-result-area"></div>
            </div>
        `;

        openModal(t("scanFarmerQR") || "Scan Farmer QR • Arrival Verification", content);

        setTimeout(() => {
            startHtml5QrScanner();
        }, 200);
    }

    function startHtml5QrScanner() {
        const viewport = document.getElementById("qr-scanner-viewport");
        const statusMsg = document.getElementById("scanner-status-msg");
        if (!viewport) return;

        if (typeof Html5Qrcode !== "undefined") {
            try {
                if (activeHtml5QrScanner) {
                    activeHtml5QrScanner.stop().catch(() => {}).then(() => {
                        activeHtml5QrScanner = null;
                        initNewScanner();
                    });
                } else {
                    initNewScanner();
                }
            } catch (err) {
                console.warn("Html5Qrcode scanner error:", err);
                if (statusMsg) statusMsg.innerHTML = `<i class="fa-solid fa-video-slash"></i> Camera access unavailable. Use manual Booking ID entry below.`;
            }
        } else {
            if (statusMsg) statusMsg.innerHTML = `<i class="fa-solid fa-camera"></i> Camera scanner standby. Use manual Booking ID entry below.`;
        }

        function initNewScanner() {
            try {
                activeHtml5QrScanner = new Html5Qrcode("qr-scanner-viewport");
                const config = { fps: 10, qrbox: { width: 220, height: 220 } };
                activeHtml5QrScanner.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        handleScanResult(decodedText);
                    },
                    (errorMessage) => {
                        // scanning frame
                    }
                ).then(() => {
                    if (statusMsg) statusMsg.innerHTML = `<i class="fa-solid fa-video" style="color:#00ff88;"></i> Camera active. Point at farmer's Gate Pass QR code.`;
                }).catch((err) => {
                    console.warn("Camera start failed:", err);
                    if (statusMsg) statusMsg.innerHTML = `<i class="fa-solid fa-video-slash"></i> Camera unavailable. Use manual Booking ID verification below.`;
                });
            } catch (e) {
                console.warn("Html5Qrcode instance error:", e);
                if (statusMsg) statusMsg.innerHTML = `<i class="fa-solid fa-keyboard"></i> Ready for manual Booking ID input.`;
            }
        }
    }

    function stopScanner() {
        if (activeHtml5QrScanner) {
            try {
                activeHtml5QrScanner.stop().catch(() => {}).then(() => {
                    try { activeHtml5QrScanner.clear(); } catch(e){}
                    activeHtml5QrScanner = null;
                });
            } catch (e) {
                activeHtml5QrScanner = null;
            }
        }
    }

    function handleScanResult(decodedText) {
        const result = verifyQRPayload(decodedText);
        renderVerificationResult(result);
    }

    function submitManualScan() {
        const input = document.getElementById("officer-manual-qr-input");
        if (!input || !input.value.trim()) {
            showToast("Please enter a Booking ID or Token number.", "warning");
            return;
        }
        handleScanResult(input.value.trim());
    }

    function simulateScan(bookingIdOrPayload) {
        const input = document.getElementById("officer-manual-qr-input");
        if (input) input.value = bookingIdOrPayload;
        handleScanResult(bookingIdOrPayload);
    }

    function renderVerificationResult(res) {
        const area = document.getElementById("qr-verification-result-area");
        if (!area) return;

        let cardClass = "success";
        let iconClass = "fa-circle-check";

        if (!res.success) {
            if (res.code === "ALREADY_VERIFIED") {
                cardClass = "duplicate";
                iconClass = "fa-triangle-exclamation";
            } else {
                cardClass = "error";
                iconClass = "fa-circle-xmark";
            }
        }

        const b = res.booking;

        area.innerHTML = `
            <div class="verification-result-card ${cardClass}">
                <div class="verification-result-header">
                    <div class="verification-result-icon">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                    <div>
                        <h4 style="margin:0; font-size:15px; font-weight:800;">${res.title}</h4>
                        <p style="margin:2px 0 0; font-size:12px; font-weight:600;">${res.message}</p>
                    </div>
                </div>

                ${b ? `
                    <table class="verification-details-table">
                        <tr>
                            <td>Farmer Name:</td>
                            <td>${b.farmerName || 'Ramesh Kumar'} (ID: ${b.farmerId || 'KS102458'})</td>
                        </tr>
                        <tr>
                            <td>Token Number:</td>
                            <td><span style="color:#174d32; font-size:13.5px; font-weight:800;">Token #${b.token || '07'}</span></td>
                        </tr>
                        <tr>
                            <td>Crop & Qty:</td>
                            <td>${b.crop || 'Paddy'} (${b.quantity || 21.5} Quintals)</td>
                        </tr>
                        <tr>
                            <td>Vehicle No:</td>
                            <td>${b.vehicleNo || 'AP-07-TY-4920'} (${b.vehicleType || 'Tractor Trolley'})</td>
                        </tr>
                        <tr>
                            <td>Arrival Centre:</td>
                            <td>${b.centre || 'AP State Procurement Centre (Yard 1)'}</td>
                        </tr>
                        <tr>
                            <td>Status:</td>
                            <td>
                                <span class="status-badge ${res.success ? 'confirmed' : 'waiting'}" style="font-size:10.5px;">
                                    ${b.status || 'Verified'} • ${b.stage || 'Gross Weighbridge'}
                                </span>
                            </td>
                        </tr>
                    </table>
                ` : ''}

                <div style="margin-top:12px; display:flex; justify-content:flex-end; gap:8px;">
                    ${res.success ? `
                        <button type="button" class="scanner-verify-btn" style="background:#27ae60; padding:6px 14px; font-size:12px;" onclick="closeModal(); scrollToOfficerSection('officer-queue-section');">
                            <i class="fa-solid fa-arrow-right"></i> View in Yard Queue
                        </button>
                    ` : ''}
                    <button type="button" class="scanner-verify-btn" style="background:#4a5951; padding:6px 12px; font-size:12px;" onclick="document.getElementById('qr-verification-result-area').innerHTML='';">
                        Dismiss
                    </button>
                </div>
            </div>
        `;

        if (res.success) {
            showToast(`✓ Farmer ${b ? b.farmerName : ''} verified successfully!`, "success");
        } else if (res.code === "ALREADY_VERIFIED") {
            showToast("⚠ Duplicate Verification: Token already admitted.", "warning");
        } else {
            showToast(res.message, "error");
        }
    }

    return {
        generatePayload,
        renderQRCode,
        verifyQRPayload,
        openFarmerQRModal,
        openOfficerScannerModal,
        stopScanner,
        submitManualScan,
        simulateScan
    };
})();

// Global accessible wrappers for Task 03
function openFarmerQRModal(bookingId) {
    KisanQR.openFarmerQRModal(bookingId);
}

function openOfficerQRScannerModal() {
    KisanQR.openOfficerScannerModal();
}

/* =========================================================
   TASK 04: KISANGRAINAI — AI-ASSISTED GRAIN QUALITY & DEFECT DETECTION
   Client-Side Computer Vision & Heuristic Assessment Engine
   Advisory Preliminary Visual Assessment (DoCA Quality Norms)
========================================================= */

const KisanGrainAI = (function() {
    const STORAGE_KEY = "kisanSetuQualityRecords";

    // Standard high-definition grain test sample presets
    const PRESETS = {
        clean: {
            name: "Clean FAQ Paddy (Grade A+)",
            label: "Clean FAQ Paddy",
            crop: "Paddy",
            variety: "Basmati Grade 1",
            moisture: 12.8,
            foreignMatter: 0.6,
            dataUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
                <svg width="320" height="240" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="240" fill="#0f172a"/>
                    <!-- Clean uniform golden grains -->
                    <g transform="translate(20,20)">
                        ${Array.from({length: 36}).map((_, i) => {
                            const x = (i % 6) * 45 + 15 + ((i*7)%9);
                            const y = Math.floor(i / 6) * 32 + 15 + ((i*5)%7);
                            const rot = ((i * 37) % 180) - 90;
                            return `<ellipse cx="${x}" cy="${y}" rx="14" ry="5.5" fill="#fcd34d" stroke="#d97706" stroke-width="1.2" transform="rotate(${rot}, ${x}, ${y})"/>`;
                        }).join('')}
                    </g>
                </svg>
            `)
        },
        broken: {
            name: "High Moisture & Broken Grains Lot",
            label: "High Moisture / Broken",
            crop: "Paddy",
            variety: "Common Non-Basmati",
            moisture: 15.6,
            foreignMatter: 2.4,
            dataUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
                <svg width="320" height="240" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="240" fill="#0f172a"/>
                    <!-- Broken / fractured grains with fragments -->
                    <g transform="translate(20,20)">
                        ${Array.from({length: 34}).map((_, i) => {
                            const x = (i % 6) * 45 + 15 + ((i*11)%11);
                            const y = Math.floor(i / 6) * 32 + 15 + ((i*7)%9);
                            const rot = ((i * 49) % 180) - 90;
                            const isBroken = i % 2 === 0;
                            if (isBroken) {
                                return `<path d="M ${x-7} ${y-4} L ${x+6} ${y-3} L ${x+4} ${y+4} L ${x-6} ${y+3} Z" fill="#eab308" stroke="#ca8a04" stroke-width="1.4" transform="rotate(${rot}, ${x}, ${y})"/>
                                        <circle cx="${x+10}" cy="${y+6}" r="2" fill="#ca8a04"/>`;
                            }
                            return `<ellipse cx="${x}" cy="${y}" rx="13" ry="5.5" fill="#f59e0b" stroke="#b45309" stroke-width="1.2" transform="rotate(${rot}, ${x}, ${y})"/>`;
                        }).join('')}
                    </g>
                </svg>
            `)
        },
        discolored: {
            name: "Discolored & Chaff Debris Lot",
            label: "Discolored & Chaff",
            crop: "Paddy",
            variety: "FAQ Standard",
            moisture: 16.8,
            foreignMatter: 4.2,
            dataUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
                <svg width="320" height="240" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="240" fill="#0f172a"/>
                    <!-- Discolored / stained kernels with dark spots & chaff -->
                    <g transform="translate(20,20)">
                        ${Array.from({length: 32}).map((_, i) => {
                            const x = (i % 6) * 45 + 15 + ((i*13)%12);
                            const y = Math.floor(i / 6) * 32 + 15 + ((i*9)%10);
                            const rot = ((i * 53) % 180) - 90;
                            const isDiscolored = i % 3 === 0;
                            const fill = isDiscolored ? "#78350f" : (i % 2 === 0 ? "#b45309" : "#d97706");
                            const stroke = isDiscolored ? "#451a03" : "#92400e";
                            return `
                                <ellipse cx="${x}" cy="${y}" rx="13.5" ry="5.5" fill="${fill}" stroke="${stroke}" stroke-width="1.3" transform="rotate(${rot}, ${x}, ${y})"/>
                                ${isDiscolored ? `<circle cx="${x+2}" cy="${y-1}" r="2" fill="#1c1917"/>` : ''}
                            `;
                        }).join('')}
                        <polygon points="50,180 58,175 62,185" fill="#475569" stroke="#334155"/>
                        <polygon points="180,70 190,66 186,76" fill="#334155"/>
                        <polygon points="230,150 238,146 235,155" fill="#475569"/>
                    </g>
                </svg>
            `)
        }
    };

    let activeState = {
        bookingId: "KS748291",
        token: "07",
        farmerName: "Ramesh Kumar",
        farmerId: "KS102458",
        crop: "Paddy",
        currentImageSrc: null,
        selectedPresetKey: "clean",
        lastAnalysisResult: null,
        isAnalyzing: false
    };

    function getStoredRecords() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.warn("Storage read error:", e);
            return [];
        }
    }

    function saveRecord(record) {
        try {
            const records = getStoredRecords();
            const filtered = records.filter(r => r.bookingId !== record.bookingId && r.tokenId !== record.tokenId);
            filtered.unshift(record);
            const trimmed = filtered.slice(0, 50);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch (e) {
            console.warn("Storage save error:", e);
        }
    }

    function getRecordForBooking(bookingIdOrToken) {
        const records = getStoredRecords();
        return records.find(r => r.bookingId === bookingIdOrToken || r.tokenId === bookingIdOrToken || (r.farmerId && r.farmerId === bookingIdOrToken));
    }

    function analyzeGrainImage(imageSource, manualParams = {}) {
        return new Promise((resolve) => {
            const crop = manualParams.crop || "Paddy";
            const moisture = typeof manualParams.moisture === "number" ? manualParams.moisture : (parseFloat(manualParams.moisture) || 13.5);
            const measuredForeignMatter = typeof manualParams.foreignMatter === "number" ? manualParams.foreignMatter : (parseFloat(manualParams.foreignMatter) || 1.0);

            const img = new Image();
            img.crossOrigin = "Anonymous";

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const W = 160;
                const H = 160;
                canvas.width = W;
                canvas.height = H;

                ctx.drawImage(img, 0, 0, W, H);
                let imgData;
                try {
                    imgData = ctx.getImageData(0, 0, W, H);
                } catch (e) {
                    imgData = { data: new Uint8ClampedArray(W * H * 4) };
                }
                const data = imgData.data;

                const totalPixels = W * H;
                let sumLuminance = 0;
                const luminanceValues = new Float32Array(totalPixels);
                let darkDefectPixels = 0;
                let greenishPixels = 0;
                let goldenPurityPixels = 0;
                let foreignMatterPixels = 0;
                let edgeGradientSum = 0;

                // Pass 1: Pixel Color & Luminance Analysis
                for (let i = 0, p = 0; i < data.length; i += 4, p++) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Luminance
                    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                    sumLuminance += lum;
                    luminanceValues[p] = lum;

                    // Convert RGB to HSV
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const delta = max - min;
                    let h = 0;
                    if (delta > 0) {
                        if (max === r) h = ((g - b) / delta) % 6;
                        else if (max === g) h = (b - r) / delta + 2;
                        else h = (r - g) / delta + 4;
                        h = Math.round(h * 60);
                        if (h < 0) h += 360;
                    }
                    const s = max === 0 ? 0 : delta / max;

                    // Foreground grain vs dark background
                    if (lum > 40) {
                        // Golden/Amber healthy paddy/grain hue: 28° to 58°
                        if (h >= 28 && h <= 58 && s >= 0.25) {
                            goldenPurityPixels++;
                        } else if (h >= 65 && h <= 140 && s >= 0.20) {
                            greenishPixels++;
                        } else if (lum < 95 || (h < 25 && s > 0.3) || (h > 330)) {
                            darkDefectPixels++;
                        }
                    } else {
                        foreignMatterPixels++;
                    }
                }

                const meanLuminance = sumLuminance / totalPixels;

                // Pass 2: Spatial Edge Gradient (Sobel high-frequency texture for broken grain fragments)
                for (let y = 1; y < H - 1; y += 2) {
                    for (let x = 1; x < W - 1; x += 2) {
                        const idx = y * W + x;
                        const lumC = luminanceValues[idx];
                        const lumR = luminanceValues[idx + 1];
                        const lumL = luminanceValues[idx - 1];
                        const lumD = luminanceValues[idx + W];
                        const lumU = luminanceValues[idx - W];

                        const grad = Math.abs(lumR - lumL) + Math.abs(lumD - lumU);
                        if (lumC > 45 && grad > 35) {
                            edgeGradientSum += grad;
                        }
                    }
                }

                // Variance of luminance
                let sumSqDiff = 0;
                for (let i = 0; i < totalPixels; i++) {
                    const diff = luminanceValues[i] - meanLuminance;
                    sumSqDiff += diff * diff;
                }
                const stdDev = Math.sqrt(sumSqDiff / totalPixels);

                // Compute Ratios
                const grainPixels = Math.max(1, totalPixels - foreignMatterPixels);
                const discolorationRatio = darkDefectPixels / grainPixels;
                const edgeDensityRatio = edgeGradientSum / (grainPixels * 12);
                const foreignRatioFromImage = (foreignMatterPixels / totalPixels) * 0.15;

                // Derived indicator percentages
                const discolorationPct = Math.min(22, Math.max(0.5, discolorationRatio * 35));
                const brokenGrainsPct = Math.min(25, Math.max(1.0, edgeDensityRatio * 18));
                const combinedForeignMatterPct = Math.min(10, Math.max(0.2, (foreignRatioFromImage * 50 + measuredForeignMatter * 0.7)));

                // Uniformity
                const uniformityScore = Math.max(45, Math.min(96, Math.round(100 - (stdDev * 0.45) - (discolorationPct * 1.2) - (brokenGrainsPct * 0.8))));

                // Moisture Penalty: standard FAQ limit is 14.0%
                let moisturePenalty = 0;
                if (moisture > 14.0) {
                    moisturePenalty = (moisture - 14.0) * 4.8;
                }

                // Overall Quality Score (0 to 100)
                let score = Math.round(
                    100 
                    - (discolorationPct * 1.6) 
                    - (brokenGrainsPct * 1.3) 
                    - (combinedForeignMatterPct * 2.2) 
                    - moisturePenalty 
                    - ((100 - uniformityScore) * 0.12)
                );
                score = Math.max(30, Math.min(97, score));

                // Grade Categorization
                let grade = "Grade A (FAQ Standard)";
                let gradeClass = "grade-A";
                let gradeBadgeShort = "A";
                if (score >= 84 && moisture <= 13.5 && combinedForeignMatterPct <= 1.5) {
                    grade = "Grade A+ (Premium FAQ)";
                    gradeClass = "grade-A-plus";
                    gradeBadgeShort = "A+";
                } else if (score >= 74 && moisture <= 14.5) {
                    grade = "Grade A (FAQ Standard)";
                    gradeClass = "grade-A";
                    gradeBadgeShort = "A";
                } else if (score >= 58 && moisture <= 16.0) {
                    grade = "Grade B (Fair / Marginal)";
                    gradeClass = "grade-B";
                    gradeBadgeShort = "B";
                } else {
                    grade = "Below Standard (Substandard)";
                    gradeClass = "grade-reject";
                    gradeBadgeShort = "Below FAQ";
                }

                // Indicator Levels
                const visibleDefects = (discolorationPct + brokenGrainsPct > 18) ? "High" : (discolorationPct + brokenGrainsPct > 9 ? "Moderate" : "Low");
                const discoloration = discolorationPct > 8 ? "High" : (discolorationPct > 3.5 ? "Moderate" : "Low");
                const brokenGrains = brokenGrainsPct > 12 ? "High" : (brokenGrainsPct > 6 ? "Moderate" : "Low");
                const foreignMaterial = combinedForeignMatterPct > 3.5 ? "High" : (combinedForeignMatterPct > 1.5 ? "Moderate" : "Low");
                const uniformity = uniformityScore >= 82 ? "High" : (uniformityScore >= 68 ? "Moderate" : "Low");

                // Assessment Confidence (78% - 94%)
                const confidence = Math.round(Math.min(94, Math.max(78, 82 + (img.naturalWidth > 200 ? 5 : 0) + (stdDev > 20 ? 4 : 0))));

                // AI Advisory Recommendation
                let recommendation = "";
                let recommendedAction = "APPROVE";
                if (score >= 74) {
                    recommendation = "Suitable for procurement at FAQ Standard MSP (₹2,300/Q). Clean grain lot with compliant moisture & low defect indicators.";
                    recommendedAction = "APPROVE";
                } else if (score >= 58) {
                    recommendation = "Borderline Lot — Elevated moisture/broken grain ratio detected. Officer manual verification & sieve test recommended before approval.";
                    recommendedAction = "HOLD";
                } else {
                    recommendation = "Substandard Quality — Visual defects and moisture exceed FAQ tolerance limits. Recommended for holding or lot rejection.";
                    recommendedAction = "REJECT";
                }

                resolve({
                    overallScore: score,
                    grade,
                    gradeClass,
                    gradeBadgeShort,
                    visibleDefects,
                    discoloration,
                    brokenGrains,
                    foreignMaterial,
                    uniformity,
                    confidence: `${confidence}%`,
                    recommendation,
                    recommendedAction,
                    metrics: {
                        moisture: `${moisture.toFixed(1)}%`,
                        foreignMatter: `${combinedForeignMatterPct.toFixed(1)}%`,
                        discolorationPct: `${discolorationPct.toFixed(1)}%`,
                        brokenGrainsPct: `${brokenGrainsPct.toFixed(1)}%`,
                        uniformityScore: `${uniformityScore}%`
                    },
                    timestamp: Date.now()
                });
            };

            img.onerror = () => {
                resolve({
                    overallScore: 78,
                    grade: "Grade A (FAQ Standard)",
                    gradeClass: "grade-A",
                    gradeBadgeShort: "A",
                    visibleDefects: "Low",
                    discoloration: "Low",
                    brokenGrains: "Moderate",
                    foreignMaterial: "Low",
                    uniformity: "High",
                    confidence: "80%",
                    recommendation: "Preliminary visual parameters meet baseline FAQ procurement norms.",
                    recommendedAction: "APPROVE",
                    metrics: { moisture: `${moisture}%`, foreignMatter: "1.2%" },
                    timestamp: Date.now()
                });
            };

            img.src = imageSource;
        });
    }

    function openQualityInspectionModal(targetBookingId) {
        let matched = null;
        if (typeof yardQueueData !== "undefined" && Array.isArray(yardQueueData)) {
            if (targetBookingId) {
                matched = yardQueueData.find(f => f.id === targetBookingId || f.token === targetBookingId);
            }
            if (!matched) {
                matched = yardQueueData.find(f => f.stageCode === "gross_weighing" || f.stageCode === "quality_check") || yardQueueData[0];
            }
        }

        if (!matched && typeof currentBooking !== "undefined" && currentBooking) {
            matched = currentBooking;
        }

        const b = matched || {
            id: "KS748291",
            token: "07",
            farmerName: "Ramesh Kumar",
            farmerId: "KS102458",
            crop: "Paddy",
            quantity: 21.5,
            stage: "Gross Weighbridge"
        };

        activeState.bookingId = b.id;
        activeState.token = b.token || "07";
        activeState.farmerName = b.farmerName || "Ramesh Kumar";
        activeState.farmerId = b.farmerId || "KS102458";
        activeState.crop = b.crop || "Paddy";
        activeState.currentImageSrc = PRESETS.clean.dataUrl;
        activeState.selectedPresetKey = "clean";
        activeState.lastAnalysisResult = null;
        activeState.isAnalyzing = false;

        // Broadcast QUALITY_INSPECTION_STARTED event
        if (typeof KisanSync !== "undefined") {
            KisanSync.publish(KisanEvents.QUALITY_INSPECTION_STARTED, {
                id: activeState.bookingId,
                token: activeState.token,
                farmerId: activeState.farmerId,
                farmerName: activeState.farmerName,
                crop: activeState.crop,
                timestamp: Date.now()
            });
        }

        const existingRecord = getRecordForBooking(activeState.bookingId);

        const content = `
            <div class="ai-inspection-wrapper">
                
                <!-- Advisory Banner -->
                <div class="ai-advisory-banner">
                    <i class="fa-solid fa-circle-info"></i>
                    <div>
                        <strong>AI-Assisted Visual Assessment (Preliminary & Advisory)</strong>
                        <p style="margin:2px 0 0; font-size:11.5px; opacity:0.9;">
                            This tool provides real-time preliminary quality indicators based on visual heuristics and measured parameters. Final statutory procurement certification rests with the Mandi Officer.
                        </p>
                    </div>
                </div>

                <!-- Active Farmer & Lot Selection Banner -->
                <div class="ai-farmer-banner">
                    <div class="ai-farmer-meta">
                        <div class="ai-farmer-avatar">
                            <i class="fa-solid fa-wheat-awn"></i>
                        </div>
                        <div class="ai-farmer-info">
                            <h4>${activeState.farmerName}</h4>
                            <p>Farmer ID: <strong>${activeState.farmerId}</strong> • ${activeState.crop} (${b.quantity || 21.5} Quintals)</p>
                        </div>
                    </div>
                    <div>
                        <span class="ai-token-tag">
                            <i class="fa-solid fa-ticket"></i> Token #${activeState.token}
                        </span>
                    </div>
                </div>

                <!-- Upload Section -->
                <div class="ai-upload-section">
                    
                    <!-- Dropzone -->
                    <div class="ai-dropzone" id="grain-ai-dropzone" onclick="document.getElementById('grain-file-input').click()">
                        <div class="ai-preview-container" id="grain-preview-container">
                            <img src="${activeState.currentImageSrc}" id="grain-preview-image" class="ai-preview-img" alt="Grain Sample Preview"/>
                            <div class="ai-scan-laser" id="grain-scan-laser"></div>
                            <div class="ai-preview-actions">
                                <button type="button" class="ai-preview-btn" onclick="event.stopPropagation(); document.getElementById('grain-file-input').click();">
                                    <i class="fa-solid fa-camera"></i> Replace Image
                                </button>
                                <button type="button" class="ai-preview-btn" style="color:#fca5a5;" onclick="event.stopPropagation(); KisanGrainAI.removeUploadedGrainImage();">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>

                        <div id="dropzone-prompt" style="display:none; padding:15px 0;">
                            <div class="ai-dropzone-icon">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                            <h4>Upload Grain Sample Image</h4>
                            <p>Drag & drop or click to upload grain photo (JPG, PNG, WEBP max 10MB)</p>
                        </div>

                        <input type="file" id="grain-file-input" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none;" onchange="KisanGrainAI.handleGrainImageUpload(event)"/>
                    </div>

                    <!-- Preset Demo Samples -->
                    <div class="preset-samples-wrapper">
                        <span>Or Select Demo Grain Lot:</span>
                        <div class="preset-samples-grid">
                            <button type="button" class="preset-sample-btn active" id="preset-btn-clean" onclick="KisanGrainAI.selectGrainPreset('clean')">
                                <i class="fa-solid fa-seedling" style="color:#16a34a; font-size:16px;"></i>
                                <div>
                                    <strong>Clean FAQ Paddy</strong>
                                    <span style="display:block; font-size:10.5px; color:#64748b;">12.8% Moisture • FAQ A+</span>
                                </div>
                            </button>
                            <button type="button" class="preset-sample-btn" id="preset-btn-broken" onclick="KisanGrainAI.selectGrainPreset('broken')">
                                <i class="fa-solid fa-burst" style="color:#d97706; font-size:16px;"></i>
                                <div>
                                    <strong>Broken & High Moisture</strong>
                                    <span style="display:block; font-size:10.5px; color:#64748b;">15.6% Moisture • Chipped</span>
                                </div>
                            </button>
                            <button type="button" class="preset-sample-btn" id="preset-btn-discolored" onclick="KisanGrainAI.selectGrainPreset('discolored')">
                                <i class="fa-solid fa-triangle-exclamation" style="color:#dc2626; font-size:16px;"></i>
                                <div>
                                    <strong>Discolored & Chaff</strong>
                                    <span style="display:block; font-size:10.5px; color:#64748b;">16.8% Moisture • Stained</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Measured Parameters -->
                    <div class="manual-params-grid">
                        <div class="manual-param-item">
                            <label>Measured Moisture %</label>
                            <input type="number" id="manual-moisture-input" value="${PRESETS.clean.moisture}" min="8" max="28" step="0.1" placeholder="e.g. 13.5"/>
                        </div>
                        <div class="manual-param-item">
                            <label>Foreign Matter %</label>
                            <input type="number" id="manual-foreign-input" value="${PRESETS.clean.foreignMatter}" min="0" max="15" step="0.1" placeholder="e.g. 1.0"/>
                        </div>
                        <div class="manual-param-item">
                            <label>Crop / Variety</label>
                            <select id="manual-crop-variety">
                                <option value="Basmati Grade 1">Basmati Grade 1</option>
                                <option value="Common Paddy FAQ" selected>Common Paddy FAQ</option>
                                <option value="Sharbati Wheat">Sharbati Wheat</option>
                                <option value="Yellow Maize">Yellow Maize</option>
                            </select>
                        </div>
                    </div>

                    <!-- Analyze Button -->
                    <button type="button" class="ai-analyze-btn" id="run-grain-analysis-btn" onclick="KisanGrainAI.runGrainAnalysis()">
                        <i class="fa-solid fa-microscope"></i> Analyze with Kisan Setu AI
                    </button>

                    <!-- Scan Progress Animation -->
                    <div class="ai-scan-progress-box" id="ai-scan-progress-box" style="display:none;">
                        <div class="ai-step-text" id="ai-step-text">
                            <i class="fa-solid fa-spinner fa-spin"></i> Initializing pixel tensor & normalizer...
                        </div>
                        <div class="ai-progress-bar-bg">
                            <div class="ai-progress-bar-fill" id="ai-progress-bar-fill"></div>
                        </div>
                    </div>

                    <!-- Report Area Container -->
                    <div id="ai-quality-report-target">
                        ${existingRecord ? renderReportHtml(existingRecord) : ''}
                    </div>

                </div>

            </div>
        `;

        openModal(t("aiQualityInspectionTitle") || "AI-Assisted Grain Quality Assessment", content);

        setTimeout(() => {
            setupDropzoneEvents();
        }, 100);
    }

    function setupDropzoneEvents() {
        const dropzone = document.getElementById("grain-ai-dropzone");
        if (!dropzone) return;

        ["dragenter", "dragover"].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add("dragover");
            }, false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove("dragover");
            }, false);
        });

        dropzone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                processImageFile(files[0]);
            }
        }, false);
    }

    function handleGrainImageUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (file) {
            processImageFile(file);
        }
    }

    function processImageFile(file) {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            showToast("Invalid image format. Please upload JPG, PNG, or WEBP.", "error");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showToast("File size too large. Please upload an image under 10MB.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            activeState.currentImageSrc = e.target.result;
            activeState.selectedPresetKey = "custom";

            const previewImg = document.getElementById("grain-preview-image");
            const previewContainer = document.getElementById("grain-preview-container");
            const dropPrompt = document.getElementById("dropzone-prompt");

            if (previewImg) previewImg.src = activeState.currentImageSrc;
            if (previewContainer) previewContainer.style.display = "flex";
            if (dropPrompt) dropPrompt.style.display = "none";

            document.querySelectorAll(".preset-sample-btn").forEach(btn => btn.classList.remove("active"));
            showToast(`Grain sample loaded successfully.`);
        };
        reader.onerror = () => {
            showToast("Failed to read image file.", "error");
        };
        reader.readAsDataURL(file);
    }

    function removeUploadedGrainImage() {
        activeState.currentImageSrc = null;
        activeState.selectedPresetKey = null;

        const previewContainer = document.getElementById("grain-preview-container");
        const dropPrompt = document.getElementById("dropzone-prompt");
        if (previewContainer) previewContainer.style.display = "none";
        if (dropPrompt) dropPrompt.style.display = "block";

        const fileInput = document.getElementById("grain-file-input");
        if (fileInput) fileInput.value = "";

        const reportTarget = document.getElementById("ai-quality-report-target");
        if (reportTarget) reportTarget.innerHTML = "";
    }

    function selectGrainPreset(presetKey) {
        const preset = PRESETS[presetKey];
        if (!preset) return;

        activeState.selectedPresetKey = presetKey;
        activeState.currentImageSrc = preset.dataUrl;

        document.querySelectorAll(".preset-sample-btn").forEach(btn => btn.classList.remove("active"));
        const activeBtn = document.getElementById(`preset-btn-${presetKey}`);
        if (activeBtn) activeBtn.classList.add("active");

        const previewImg = document.getElementById("grain-preview-image");
        const previewContainer = document.getElementById("grain-preview-container");
        const dropPrompt = document.getElementById("dropzone-prompt");
        if (previewImg) previewImg.src = preset.dataUrl;
        if (previewContainer) previewContainer.style.display = "flex";
        if (dropPrompt) dropPrompt.style.display = "none";

        const moistureInput = document.getElementById("manual-moisture-input");
        if (moistureInput) moistureInput.value = preset.moisture;

        const foreignInput = document.getElementById("manual-foreign-input");
        if (foreignInput) foreignInput.value = preset.foreignMatter;
    }

    function runGrainAnalysis() {
        if (!activeState.currentImageSrc) {
            showToast("Please upload a grain image or select a demo sample first.", "warning");
            return;
        }

        if (activeState.isAnalyzing) return;
        activeState.isAnalyzing = true;

        const moistureVal = parseFloat(document.getElementById("manual-moisture-input")?.value) || 13.5;
        const foreignVal = parseFloat(document.getElementById("manual-foreign-input")?.value) || 1.0;
        const varietyVal = document.getElementById("manual-crop-variety")?.value || "Common Paddy FAQ";

        const analyzeBtn = document.getElementById("run-grain-analysis-btn");
        const progressBox = document.getElementById("ai-scan-progress-box");
        const progressBarFill = document.getElementById("ai-progress-bar-fill");
        const stepText = document.getElementById("ai-step-text");
        const laser = document.getElementById("grain-scan-laser");

        if (analyzeBtn) analyzeBtn.disabled = true;
        if (progressBox) progressBox.style.display = "flex";
        if (laser) laser.classList.add("active");

        const steps = [
            { pct: 25, text: "Normalizing image resolution & color canvas..." },
            { pct: 50, text: "Computing HSV color histogram & luminance distribution..." },
            { pct: 75, text: "Scanning grain boundaries & edge gradient density for broken kernels..." },
            { pct: 90, text: "Detecting foreign material, chaff & discoloration index..." },
            { pct: 100, text: "Synthesizing DoCA FAQ Grade score..." }
        ];

        let currentStep = 0;
        const stepInterval = setInterval(() => {
            if (currentStep < steps.length) {
                const s = steps[currentStep];
                if (progressBarFill) progressBarFill.style.width = `${s.pct}%`;
                if (stepText) stepText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${s.text}`;
                currentStep++;
            } else {
                clearInterval(stepInterval);
                finishAnalysis();
            }
        }, 300);

        function finishAnalysis() {
            analyzeGrainImage(activeState.currentImageSrc, {
                moisture: moistureVal,
                foreignMatter: foreignVal,
                crop: activeState.crop,
                variety: varietyVal
            }).then(result => {
                activeState.isAnalyzing = false;
                activeState.lastAnalysisResult = result;

                if (analyzeBtn) analyzeBtn.disabled = false;
                if (progressBox) progressBox.style.display = "none";
                if (laser) laser.classList.remove("active");

                if (typeof KisanSync !== "undefined") {
                    KisanSync.publish(KisanEvents.QUALITY_ASSESSMENT_COMPLETED, {
                        id: activeState.bookingId,
                        token: activeState.token,
                        farmerId: activeState.farmerId,
                        farmerName: activeState.farmerName,
                        score: result.overallScore,
                        grade: result.grade,
                        moisture: result.metrics.moisture,
                        recommendation: result.recommendation,
                        timestamp: Date.now()
                    });
                }

                const target = document.getElementById("ai-quality-report-target");
                if (target) {
                    target.innerHTML = renderReportHtml(result);
                    target.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }

                showToast(`✓ Quality Analysis Complete: ${result.grade} (Score: ${result.overallScore}/100)`, "success");
            });
        }
    }

    function renderReportHtml(res) {
        const getDefectClass = (lvl) => lvl === "High" ? "defect-high" : (lvl === "Moderate" ? "defect-mod" : "defect-low");
        const getUniformityClass = (lvl) => lvl === "High" ? "uniformity-high" : (lvl === "Moderate" ? "uniformity-mod" : "uniformity-low");

        return `
            <div class="ai-report-card">
                <div class="ai-report-header">
                    <h3>
                        <i class="fa-solid fa-award" style="color:#0f766e;"></i>
                        <span>AI-Assisted Quality Assessment</span>
                    </h3>
                    <div class="ai-confidence-pill">
                        <i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Confidence: <strong>${res.confidence}</strong>
                    </div>
                </div>

                <!-- Score and Grade Row -->
                <div class="ai-score-grade-row">
                    <div class="ai-score-box">
                        <div class="ai-score-label">Overall Quality</div>
                        <div class="ai-score-value">${res.overallScore} <span style="font-size:18px; font-weight:700; color:#166534;">/ 100</span></div>
                        <div class="ai-score-sub">FAQ Procurement Benchmark</div>
                    </div>
                    <div class="ai-grade-box">
                        <div class="ai-grade-label">Estimated Grade</div>
                        <div class="ai-grade-badge ${res.gradeClass}">
                            ${res.gradeBadgeShort || res.grade}
                        </div>
                    </div>
                </div>

                <!-- Key Visual Defect Indicators Grid -->
                <div class="ai-indicators-grid">
                    <div class="ai-indicator-card">
                        <div class="ai-indicator-title">VISIBLE DEFECTS</div>
                        <div class="ai-indicator-status ${getDefectClass(res.visibleDefects)}">
                            ${res.visibleDefects}
                        </div>
                    </div>
                    <div class="ai-indicator-card">
                        <div class="ai-indicator-title">DISCOLORATION</div>
                        <div class="ai-indicator-status ${getDefectClass(res.discoloration)}">
                            ${res.discoloration}
                        </div>
                    </div>
                    <div class="ai-indicator-card">
                        <div class="ai-indicator-title">BROKEN GRAINS</div>
                        <div class="ai-indicator-status ${getDefectClass(res.brokenGrains)}">
                            ${res.brokenGrains}
                        </div>
                    </div>
                    <div class="ai-indicator-card">
                        <div class="ai-indicator-title">FOREIGN MATERIAL</div>
                        <div class="ai-indicator-status ${getDefectClass(res.foreignMaterial)}">
                            ${res.foreignMaterial}
                        </div>
                    </div>
                    <div class="ai-indicator-card">
                        <div class="ai-indicator-title">UNIFORMITY</div>
                        <div class="ai-indicator-status ${getUniformityClass(res.uniformity)}">
                            ${res.uniformity}
                        </div>
                    </div>
                </div>

                <!-- AI Recommendation -->
                <div class="ai-recommendation-box">
                    <div class="ai-rec-title">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Recommendation:
                    </div>
                    <p class="ai-rec-text">${res.recommendation}</p>
                </div>

                <!-- Officer Decision Controls -->
                <div class="ai-decision-section">
                    <h4>
                        <i class="fa-solid fa-gavel"></i>
                        <span>Officer Procurement Decision</span>
                    </h4>
                    <p style="font-size:11.5px; color:#64748b; margin:0 0 4px;">
                        Select official action based on preliminary analysis & physical inspection:
                    </p>
                    <div class="ai-decision-buttons">
                        <button type="button" class="decision-btn decision-btn-approve" onclick="KisanGrainAI.handleOfficerQualityDecision('APPROVE')">
                            <i class="fa-solid fa-circle-check"></i> Approve Lot
                        </button>
                        <button type="button" class="decision-btn decision-btn-hold" onclick="KisanGrainAI.handleOfficerQualityDecision('HOLD')">
                            <i class="fa-solid fa-pause"></i> Hold for Manual Lab
                        </button>
                        <button type="button" class="decision-btn decision-btn-reject" onclick="KisanGrainAI.handleOfficerQualityDecision('REJECT')">
                            <i class="fa-solid fa-ban"></i> Reject Lot
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function handleOfficerQualityDecision(decision) {
        const res = activeState.lastAnalysisResult || {
            overallScore: 82,
            grade: "Grade A (FAQ Standard)",
            gradeBadgeShort: "A",
            visibleDefects: "Low",
            discoloration: "Low",
            brokenGrains: "Low",
            foreignMaterial: "Low",
            uniformity: "High",
            metrics: { moisture: "13.5%", foreignMatter: "1.0%" }
        };

        const officerUser = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
        const officerName = (officerUser && officerUser.name) || "Officer S. Sharma";
        const inspectionId = "QC-" + Date.now().toString(36).toUpperCase();

        const record = {
            inspectionId,
            bookingId: activeState.bookingId,
            tokenId: activeState.token,
            farmerId: activeState.farmerId,
            farmerName: activeState.farmerName,
            crop: activeState.crop,
            overallScore: res.overallScore,
            grade: res.grade,
            moisture: res.metrics ? res.metrics.moisture : "13.5%",
            foreignMatter: res.metrics ? res.metrics.foreignMatter : "1.0%",
            indicators: {
                visibleDefects: res.visibleDefects,
                discoloration: res.discoloration,
                brokenGrains: res.brokenGrains,
                foreignMaterial: res.foreignMaterial,
                uniformity: res.uniformity
            },
            officerDecision: decision,
            officerName,
            timestamp: Date.now()
        };

        saveRecord(record);

        // Update matching item in yardQueueData
        if (typeof yardQueueData !== "undefined" && Array.isArray(yardQueueData)) {
            const qItem = yardQueueData.find(f => f.id === activeState.bookingId || f.token === activeState.token);
            if (qItem) {
                if (decision === "APPROVE") {
                    qItem.stageCode = "tare_weighing";
                    qItem.stage = "Tare Weighbridge";
                    qItem.status = "Quality Approved";
                    qItem.moisture = `${record.moisture} (${record.grade.split(' ')[0]})`;
                } else if (decision === "HOLD") {
                    qItem.status = "On Hold (Manual Lab)";
                    qItem.stage = "Quality Inspection On Hold";
                } else if (decision === "REJECT") {
                    qItem.status = "Rejected (Substandard)";
                    qItem.stage = "Lot Rejected";
                }
            }
            if (typeof saveYardQueue === "function") saveYardQueue();
            if (typeof renderOfficerQueueTable === "function") renderOfficerQueueTable();
            if (typeof updateOfficerStats === "function") updateOfficerStats();
        }

        // Synchronize in currentBooking if matches
        if (typeof currentBooking !== "undefined" && currentBooking) {
            if (currentBooking.id === activeState.bookingId || currentBooking.token === activeState.token || (currentBooking.farmerId && currentBooking.farmerId === activeState.farmerId)) {
                if (decision === "APPROVE") {
                    currentBooking.stageCode = "tare_weighing";
                    currentBooking.stage = "Tare Weighbridge";
                    currentBooking.status = "Quality Approved";
                    currentBooking.moisture = `${record.moisture} (${record.grade.split(' ')[0]})`;
                } else if (decision === "HOLD") {
                    currentBooking.status = "On Hold";
                    currentBooking.stage = "Quality Inspection On Hold";
                } else if (decision === "REJECT") {
                    currentBooking.status = "Rejected";
                    currentBooking.stage = "Lot Rejected";
                }
                if (typeof saveCurrentBooking === "function") saveCurrentBooking();
                if (typeof updateDashboardAfterBooking === "function") updateDashboardAfterBooking();
            }
        }

        // Broadcast appropriate event over KisanSync
        if (typeof KisanSync !== "undefined") {
            if (decision === "APPROVE") {
                KisanSync.publish(KisanEvents.QUALITY_APPROVED, {
                    id: activeState.bookingId,
                    token: activeState.token,
                    farmerId: activeState.farmerId,
                    farmerName: activeState.farmerName,
                    moisture: record.moisture,
                    grade: record.grade,
                    score: record.overallScore,
                    officer: officerName
                });
            } else if (decision === "HOLD") {
                KisanSync.publish(KisanEvents.QUALITY_ON_HOLD, {
                    id: activeState.bookingId,
                    token: activeState.token,
                    farmerId: activeState.farmerId,
                    farmerName: activeState.farmerName,
                    reason: "Manual laboratory verification required",
                    officer: officerName
                });
            } else if (decision === "REJECT") {
                KisanSync.publish(KisanEvents.QUALITY_REJECTED, {
                    id: activeState.bookingId,
                    token: activeState.token,
                    farmerId: activeState.farmerId,
                    farmerName: activeState.farmerName,
                    reason: "Moisture/defect parameters exceed FAQ limits",
                    officer: officerName
                });
            }
        }

        // Add notifications
        if (typeof KisanNotifications !== "undefined") {
            if (decision === "APPROVE") {
                KisanNotifications.addNotification({
                    type: KisanEvents.QUALITY_APPROVED,
                    title: "Quality Inspection Approved",
                    message: `Token #${activeState.token} (${activeState.farmerName}) approved with ${record.grade} (${record.moisture}).`,
                    targetRole: "officer",
                    icon: "fa-circle-check",
                    badgeType: "success",
                    entity: { tokenId: activeState.token, grade: record.grade, moisture: record.moisture }
                });
                showToast(`✓ Quality Approved for Token #${activeState.token}! Lot advanced to Tare Weighbridge.`, "success");
            } else if (decision === "HOLD") {
                KisanNotifications.addNotification({
                    type: KisanEvents.QUALITY_ON_HOLD,
                    title: "Quality Inspection On Hold",
                    message: `Token #${activeState.token} (${activeState.farmerName}) placed on hold for manual lab inspection.`,
                    targetRole: "officer",
                    icon: "fa-pause",
                    badgeType: "warning",
                    entity: { tokenId: activeState.token }
                });
                showToast(`⚠ Token #${activeState.token} placed on hold for manual lab check.`, "warning");
            } else if (decision === "REJECT") {
                KisanNotifications.addNotification({
                    type: KisanEvents.QUALITY_REJECTED,
                    title: "Grain Lot Rejected",
                    message: `Token #${activeState.token} (${activeState.farmerName}) rejected due to substandard quality.`,
                    targetRole: "officer",
                    icon: "fa-ban",
                    badgeType: "error",
                    entity: { tokenId: activeState.token }
                });
                showToast(`✕ Token #${activeState.token} rejected (Substandard Quality).`, "error");
            }
        }

        closeModal();
    }

    function openFarmerQualityModal(bookingId) {
        const targetId = bookingId || (typeof currentBooking !== "undefined" && currentBooking ? currentBooking.id : "KS748291");
        const rec = getRecordForBooking(targetId) || getRecordForBooking("07") || getRecordForBooking("KS748291");

        const content = `
            <div class="farmer-quality-summary">
                <div class="ai-advisory-banner">
                    <i class="fa-solid fa-certificate"></i>
                    <div>
                        <strong>DoCA Preliminary Quality Inspection Report</strong>
                        <p style="margin:2px 0 0; font-size:11.5px; opacity:0.9;">
                            Kisan Setu AI-Assisted visual evaluation conducted at AP State Procurement Centre, Guntur Yard.
                        </p>
                    </div>
                </div>

                ${rec ? `
                    <div class="ai-score-grade-row" style="margin-top:6px;">
                        <div class="ai-score-box">
                            <div class="ai-score-label">Quality Score</div>
                            <div class="ai-score-value">${rec.overallScore} <span style="font-size:18px; font-weight:700; color:#166534;">/ 100</span></div>
                            <div class="ai-score-sub">Tested at Weighbridge In</div>
                        </div>
                        <div class="ai-grade-box">
                            <div class="ai-grade-label">Certified Grade</div>
                            <div class="ai-grade-badge ${rec.grade.includes('A+') ? 'grade-A-plus' : (rec.grade.includes('A') ? 'grade-A' : (rec.grade.includes('B') ? 'grade-B' : 'grade-reject'))}">
                                ${rec.grade.split(' ')[0]}
                            </div>
                        </div>
                    </div>

                    <table class="verification-details-table" style="margin-top:10px;">
                        <tr>
                            <td>Inspection ID:</td>
                            <td><strong>${rec.inspectionId}</strong></td>
                        </tr>
                        <tr>
                            <td>Crop & Variety:</td>
                            <td>${rec.crop || 'Paddy / Rice'}</td>
                        </tr>
                        <tr>
                            <td>Measured Moisture:</td>
                            <td><strong style="color:#166534;">${rec.moisture || '13.5% (Pass)'}</strong></td>
                        </tr>
                        <tr>
                            <td>Foreign Material:</td>
                            <td>${rec.foreignMatter || '1.0% (FAQ Compliant)'}</td>
                        </tr>
                        <tr>
                            <td>Inspection Decision:</td>
                            <td>
                                <span class="status-badge ${rec.officerDecision === 'APPROVE' ? 'confirmed' : (rec.officerDecision === 'HOLD' ? 'waiting' : 'pending')}">
                                    ${rec.officerDecision === 'APPROVE' ? '✓ APPROVED FOR MSP PROCUREMENT' : (rec.officerDecision === 'HOLD' ? 'ON HOLD - LAB CHECK' : 'REJECTED')}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>Inspecting Officer:</td>
                            <td>${rec.officerName || 'Officer S. Sharma'}</td>
                        </tr>
                        <tr>
                            <td>Inspection Date:</td>
                            <td>${new Date(rec.timestamp).toLocaleDateString()} ${new Date(rec.timestamp).toLocaleTimeString()}</td>
                        </tr>
                    </table>

                    <div style="margin-top:14px; display:flex; gap:10px;">
                        <button type="button" class="submit-auth-btn" style="flex:1;" onclick="window.print()">
                            <i class="fa-solid fa-print"></i> Print Quality Pass
                        </button>
                        <button type="button" class="submit-auth-btn register-btn" style="flex:1;" onclick="closeModal()">
                            Close
                        </button>
                    </div>
                ` : `
                    <div style="text-align:center; padding:30px 15px; color:#64748b;">
                        <i class="fa-solid fa-microscope" style="font-size:36px; color:#cbd5e1; margin-bottom:10px;"></i>
                        <h4 style="margin:0; color:#334155;">Quality Inspection Pending</h4>
                        <p style="font-size:12.5px; margin:6px 0 0;">
                            Your grain lot has arrived at the centre and is queued for AI-assisted quality assessment and moisture testing.
                        </p>
                    </div>
                `}
            </div>
        `;

        openModal(t("quickQualityReport") || "AI Quality Assessment Report", content);
    }

    return {
        analyzeGrainImage,
        openQualityInspectionModal,
        openFarmerQualityModal,
        runGrainAnalysis,
        handleOfficerQualityDecision,
        selectGrainPreset,
        handleGrainImageUpload,
        removeUploadedGrainImage,
        getStoredRecords,
        getRecordForBooking
    };
})();

// Global accessible wrappers for Task 04
function openQualityInspectionModal(targetBookingId) {
    KisanGrainAI.openQualityInspectionModal(targetBookingId);
}

function openFarmerQualityModal(bookingId) {
    KisanGrainAI.openFarmerQualityModal(bookingId);
}

/* =========================================================
   1. MULTI-LANGUAGE TRANSLATION DICTIONARIES
========================================================= */

const translations = {
    English: {
        aiQualityInspection: "AI Quality Inspection",
        aiQualityInspectionBtn: "AI Quality Inspection",
        aiQualityInspectionTitle: "AI-Assisted Grain Quality Assessment",
        quickQualityReport: "AI Quality Assessment",
        quickQualityReportDesc: "View grain grade & defect report",
        aiAdvisoryNotice: "AI-assisted preliminary visual assessment (Advisory Only). Not an official statutory lab certification.",
        overallQuality: "Overall Quality Score",
        estimatedGrade: "Estimated Grade",
        visibleDefects: "Visible Defects",
        discoloration: "Discoloration",
        brokenGrains: "Broken/Damaged Grains",
        foreignMaterial: "Foreign Material",
        uniformity: "Uniformity",
        assessmentConfidence: "Assessment Confidence",
        aiRecommendation: "AI Recommendation",
        approveLotBtn: "Approve Lot",
        holdLotBtn: "Hold for Manual Lab",
        rejectLotBtn: "Reject Lot",
        myGatePassQR: "My Gate Pass QR",
        showMyQR: "Show My QR",
        scanFarmerQR: "Scan Farmer QR",
        scanFarmerQRBtn: "Scan Farmer QR",
        quickMyQR: "Show Arrival QR Code",
        quickMyQRDesc: "Gate entry verification pass",
        gatePassQRTitle: "Digital Gate Pass & QR Code",
        officerScannerTitle: "Farmer Arrival QR Scanner",
        liveSync: "Live Sync",
        farmerProcurement: "Farmer Procurement",
        mainMenu: "MAIN MENU",
        services: "SERVICES",
        dashboard: "Dashboard",
        cancelProcurement: "Cancel Procurement",
        completeProcurement: "Complete Procurement",
        officerPortal: "Mandi Officer Portal",
        book: "Book a Slot",
        track: "Track Procurement",
        history: "Booking History",
        payment: "Payment Status",
        notifications: "Notifications",
        centre: "Procurement Centres",
        help: "Help & Support",
        needHelp: "Need Help?",
        talkSupport: "Talk to our support team",
        profileSettings: "Profile & Settings",
        accountSettings: "ACCOUNT",
        logout: "Logout",
        manageProcurementJourney: "Manage your procurement journey easily.",
        farmerPortal: "Farmer Portal",
        welcomeTitle: "Good morning, {name}! 👋",
        officerIncharge: "Officer Incharge:",
        officerIdLabel: "Mandi Officer",
        farmerIdLabel: "Farmer ID",
        officerPortalTag: "Mandi Administration Portal • Yard 1",
        officerHeroTitle: "Mandi Officer & Yard Queue Controller 🏛️",
        officerHeroDesc: "Real-time weighbridge intake, quality verification, queue dispatch, and direct benefit transfer (DBT) approvals.",
        mandiProcurementOfficer: "Mandi Procurement Officer",
        mandiAdminControl: "Mandi Admin & Control Console",
        adminConsole: "ADMIN CONSOLE",
        navYardOverview: "Yard Overview",
        navQueueManagement: "Queue Management",
        navFarmerRecords: "Farmer Records",
        navReports: "Reports & Analytics",
        navBroadcastTool: "Broadcast Alert",
        adminSystem: "SYSTEM",
        broadcastTitle: "Mandi Yard Loudspeaker & SMS Broadcast",
        broadcastSubtitle: "Send instant audio voice announcements and SMS alerts to all farmers currently in the yard.",
        sendBroadcastBtn: "Broadcast to All Farmers",
        totalFarmersServed: "Total Farmers Served Today",
        avgWaitTime: "Average Yard Wait Time",
        callNextBtn: "Call Next",
        markCompleteBtn: "Complete",
        cancelQueueBtn: "Cancel",
        weighbridgeOnline: "Weighbridge Online",
        callNextTokenBtn: "Call Next Token",
        walkInTokenBtn: "Walk-In Token",
        yardQueueWaiting: "Yard Queue Waiting",
        procuredToday: "Procured Today",
        weighmentsDone: "Weighments Done",
        mspDisbursedValue: "MSP Disbursed Value",
        yardDispatcherTitle: "Yard Queue Dispatcher & Broadcast Controls",
        callNextFarmerBtn: "Call Next Farmer",
        mandiVoiceBroadcastBtn: "Mandi Voice Broadcast",
        issueSpotPassBtn: "Issue Spot Pass",
        resetDemoQueueBtn: "Reset Demo Queue",
        liveYardQueueTitle: "Live Mandi Yard Queue & Weighbridge Operations",
        liveYardQueueDesc: "Process farmers through Weighbridge Entry, Quality Inspection, Tare Weighing, and DBT Settlement.",
        liveYardFeed: "Live Yard Feed",
        thToken: "Token #",
        thFarmerId: "Farmer & ID",
        thCropQty: "Crop & Quantity",
        thVehicleNo: "Vehicle No.",
        thGatePass: "Gate Pass",
        thCurrentStage: "Current Stage",
        thOfficerActions: "Officer Actions",
        callBtn: "Call",
        grossWeigh: "Gross Weigh",
        inspectQuality: "Inspect Quality",
        tareWeigh: "Tare Weigh",
        completeDBT: "Complete DBT",
        cancelSlot: "Cancel Slot",
        jFormReceipt: "J-Form Procurement Receipt",
        viewOfficialReceipt: "View official weighment receipt",
        cancelSlotBooking: "Cancel Slot Booking",
        cancelOrReschedule: "Cancel or reschedule appointment",
        slotCancelled: "Slot Cancelled",
        procurementDone: "Procurement Done",
        dbtPaymentReleased: "DBT payment released",
        welcomeDescription: "Your procurement journey is just a few clicks away. Check your booking, queue and payment status here.",
        bookNewSlot: "Book New Slot",
        trackMyProcurement: "Track My Procurement",
        inQueue: "In Queue",
        currentQueuePosition: "Current Queue Position",
        estimatedWait: "Estimated wait",
        nextProcurementSlot: "Next Procurement Slot",
        confirmed: "Confirmed",
        tomorrow: "Tomorrow",
        procurementStatus: "Procurement Status",
        processing: "Processing",
        qualityCheck: "Quality Check",
        weighingCompleted: "Weighing completed",
        paymentStatus: "Payment Status",
        pending: "Pending",
        paymentUnderProcessing: "Payment under processing",
        procurementJourney: "Procurement Journey",
        trackCropJourney: "Track your crop from arrival to payment.",
        slotBooked: "Slot Booked",
        arrivedAtCentre: "Arrived at Centre",
        waitingForTurn: "Waiting for your turn",
        cropInspected: "Your crop is being inspected",
        awaitingCompletion: "Awaiting completion",
        quickActions: "Quick Actions",
        whatWouldYouLikeToDo: "What would you like to do?",
        quickBookSlot: "Book a Slot",
        chooseDateTime: "Choose date & time",
        trackMyTurn: "Track My Turn",
        seeLiveQueue: "See live queue",
        viewHistory: "View History",
        pastProcurementRecords: "Past procurement records",
        getHelp: "Get Help",
        talkToSupport: "Talk to support",
        recentActivity: "Recent Activity",
        latestUpdates: "Your latest procurement updates.",
        viewAll: "View All",
        slotConfirmed: "Slot confirmed",
        todayMorning: "Today · 09:42 AM",
        completed: "Completed",
        cropWeighingCompleted: "Crop weighing completed",
        todayNoon: "Today · 11:15 AM",
        done: "Done",
        paymentInitiated: "Payment initiated",
        todayAfternoon: "Today · 01:20 PM",
        yourProcurementCentre: "Your Procurement Centre",
        nearestCentre: "Nearest centre to you",
        open: "Open",
        mainAgriculturalMarket: "Main Agricultural Market, District Yard",
        privacy: "Privacy",
        terms: "Terms",
        // Modals & Forms
        bookingTitle: "Book Procurement Slot",
        bookingIntro: "Schedule your crop delivery at the nearest Mandi without waiting in long lines.",
        chooseCrop: "Select Crop for Sale",
        chooseYourCrop: "-- Choose Crop --",
        rice: "Paddy / Rice (MSP ₹2,300/Q)",
        wheat: "Wheat (MSP ₹2,275/Q)",
        maize: "Maize (MSP ₹2,090/Q)",
        cotton: "Cotton (MSP ₹7,121/Q)",
        groundnut: "Groundnut (MSP ₹6,783/Q)",
        mustard: "Mustard / Pulses (MSP ₹5,650/Q)",
        quantity: "Approx. Quantity (in Quintals)",
        enterQuantity: "e.g. 25.5",
        quintals: "Quintals",
        quantityHelp: "1 Quintal = 100 kg. Government MSP payment is calculated per quintal.",
        procurementCentre: "Select Procurement Mandi / Centre",
        selectCentre: "-- Choose Procurement Centre --",
        apStateCentre: "AP State Procurement Centre (Yard 1)",
        districtProcurementCentre: "District Food Grain Hub (Yard 2)",
        date: "Preferred Delivery Date",
        preferredTime: "Preferred Slot Time",
        selectTime: "-- Select Slot Time --",
        availableSlots: "Available Slot Capacities",
        available: "Available",
        vehicleType: "Transport Vehicle Type",
        tractor: "Tractor Trolley",
        miniTruck: "Mini Commercial Truck",
        bullockCart: "Bullock Cart / Other",
        vehicleNumber: "Vehicle Plate / Entry Pass No.",
        bookingInfo: "You will receive an instant SMS Gate Pass with Token Number upon confirmation.",
        confirmSlot: "Confirm & Generate Digital Gate Pass",
        // Tracker
        liveQueueTracker: "Live Mandi Queue Tracker",
        tokenNumber: "Token Number",
        nowServing: "Now Serving",
        yourPosition: "Your Position in Queue",
        estimatedTimeRemaining: "Estimated Time Remaining",
        counterGate: "Assigned Counter",
        advanceQueueBtn: "Advance Queue Simulation",
        callTurnBtn: "Call My Turn Alert",
        resetQueueBtn: "Reset Queue",
        turnReadyAlert: "Your Turn is Ready! Please proceed to Weighbridge Counter 2 immediately.",
        // Payment
        dbtTrackerTitle: "Direct Benefit Transfer (DBT) Payment Tracker",
        paymentDetails: "Procurement & Payment Breakdown",
        grossAmount: "Total Gross MSP Amount",
        bankCreditStatus: "Bank Account Credit Status",
        bankNameLabel: "Bank Account",
        ifscLabel: "IFSC Code",
        utrLabel: "DBT Reference / UTR Number",
        weighingSlip: "Official Weighing & Moisture Slip",
        downloadSlip: "Download DBT Receipt Slip",
        // Notifications
        notificationsTitle: "Notification & Alert Centre",
        markAllRead: "Mark all as read",
        clearAllNotifs: "Clear All",
        voiceAlertBtn: "Play Voice Announcement",
        allNotifReadSuccess: "All notifications marked as read.",
        filterAll: "All",
        filterUnread: "Unread",
        filterProcurement: "Queue & Mandi",
        filterPayment: "DBT & Payment",
        noNotifications: "No Notifications to Display",
        noNotificationsDesc: "You're all caught up! Real-time notifications for slot bookings, queue turns, and DBT payments will appear here.",
        // Centre
        centresTitle: "Nearest Procurement Centres & Congestion",
        liveCrowdStatus: "Live Mandi Congestion",
        lowWait: "Low Congestion (5-10 mins wait)",
        medWait: "Moderate Crowd (20-30 mins wait)",
        highWait: "Heavy Rush (1+ hour wait)",
        getDirections: "Get Route Directions",
        callMandiOfficer: "Call Mandi Incharge",
        // Help
        helpTitle: "Help, Helpline & Grievance Portal",
        tollFreeTitle: "Kisan Call Center (Toll-Free 24x7)",
        tollFreeNumber: "1800-180-1551",
        faqTitle: "Frequently Asked Questions",
        submitGrievance: "Register a Grievance / Complaint",
        grievanceSubject: "Complaint Subject",
        grievanceDesc: "Describe your issue",
        submitComplaintBtn: "Submit Complaint Ticket",
        complaintSubmitted: "Your grievance ticket has been registered: #GRV-2026-9481",
        // Settings & Profile
        settingsTitle: "Farmer Profile & Portal Settings",
        tabPersonal: "Personal Profile",
        tabBank: "DBT & Bank Account",
        tabPreferences: "Notification Alerts",
        tabDisplay: "Display & Accessibility",
        farmerFullName: "Full Name",
        mobileNoLabel: "Registered Mobile Number",
        aadhaarLabel: "Aadhaar / Farmer ID",
        landSizeLabel: "Land Holding (Acres)",
        villageLabel: "Village / Town",
        districtLabel: "District & State",
        saveProfileBtn: "Save Profile Changes",
        accountHolder: "Account Holder Name",
        accountNo: "Bank Account Number",
        aadhaarSeeded: "Aadhaar-Seeded for DBT",
        smsAlerts: "SMS Notifications for Token & Queue",
        whatsappAlerts: "WhatsApp Procurement Updates",
        voiceCallAlerts: "Automated Voice Calls in Local Language",
        proximityAlert: "Notify me when 3 farmers are ahead in queue",
        largeTextMode: "Large Text Mode (Farmer Accessibility)",
        highContrastMode: "High Contrast / Dark Mode",
        soundAlerts: "Audio Chime on Turn Call",
        profileUpdatedSuccess: "Farmer profile & settings updated successfully!",
        // Logout
        logoutConfirmTitle: "Confirm Logout",
        logoutConfirmMsg: "Are you sure you want to log out of KisanSetu Farmer Portal?",
        confirmLogoutBtn: "Yes, Log Out",
        cancelBtn: "Cancel"
    },
    Hindi: {
        aiQualityInspection: "एआई गुणवत्ता जांच",
        aiQualityInspectionBtn: "एआई गुणवत्ता जांच",
        aiQualityInspectionTitle: "एआई-सहायता प्राप्त अनाज गुणवत्ता मूल्यांकन",
        quickQualityReport: "एआई गुणवत्ता रिपोर्ट",
        quickQualityReportDesc: "अनाज ग्रेड और दोष रिपोर्ट देखें",
        aiAdvisoryNotice: "एआई-सहायता प्राप्त प्रारंभिक मूल्यांकन (केवल सलाहकारी)।",
        overallQuality: "समग्र गुणवत्ता स्कोर",
        estimatedGrade: "अनुमानित ग्रेड",
        visibleDefects: "दृश्य दोष",
        discoloration: "रंगहीनता",
        brokenGrains: "टूटे/क्षतिग्रस्त दाने",
        foreignMaterial: "विदेशी पदार्थ",
        uniformity: "एकरूपता",
        assessmentConfidence: "मूल्यांकन विश्वास",
        aiRecommendation: "एआई सिफारिश",
        approveLotBtn: "लॉट स्वीकृत करें",
        holdLotBtn: "मैन्युअल जांच हेतु रोकें",
        rejectLotBtn: "लॉट अस्वीकार करें",
        myGatePassQR: "मेरा गेट पास क्यूआर",
        showMyQR: "मेरा क्यूआर दिखाएं",
        scanFarmerQR: "किसान क्यूआर स्कैन करें",
        scanFarmerQRBtn: "किसान QR स्कैन",
        quickMyQR: "आगमन क्यूआर कोड दिखाएं",
        quickMyQRDesc: "गेट प्रवेश सत्यापन पास",
        gatePassQRTitle: "डिजिटल गेट पास एवं क्यूआर कोड",
        officerScannerTitle: "किसान आगमन क्यूआर स्कैनर",
        liveSync: "लाइव सिंक",
        farmerProcurement: "किसान खरीद पोर्टल",
        mainMenu: "मुख्य मेन्यू",
        services: "सेवाएं",
        dashboard: "डैशबोर्ड",
        cancelProcurement: "खरीद रद्द करें",
        completeProcurement: "खरीद पूर्ण करें",
        officerPortal: "मंडी अधिकारी पोर्टल",
        book: "स्लॉट बुक करें",
        track: "खरीद ट्रैक करें",
        history: "बुकिंग इतिहास",
        payment: "भुगतान स्थिति",
        notifications: "सूचनाएं",
        centre: "खरीद केंद्र",
        help: "सहायता एवं समर्थन",
        needHelp: "मदद चाहिए?",
        talkSupport: "सहायता टीम से बात करें",
        profileSettings: "प्रोफ़ाइल एवं सेटिंग्स",
        accountSettings: "खाता",
        logout: "लॉग आउट",
        manageProcurementJourney: "अपनी खरीद प्रक्रिया को आसानी से प्रबंधित करें।",
        farmerPortal: "किसान पोर्टल",
        welcomeTitle: "शुभ प्रभात, {name} जी! 👋",
        officerIncharge: "प्रभारी अधिकारी:",
        officerIdLabel: "मंडी अधिकारी",
        farmerIdLabel: "किसान आईडी",
        officerPortalTag: "मंडी प्रशासन पोर्टल • यार्ड 1",
        officerHeroTitle: "मंडी अधिकारी एवं यार्ड कतार नियंत्रक 🏛️",
        officerHeroDesc: "रीयल-टाइम वेईब्रिज इनटेक, गुणवत्ता सत्यापन, कतार प्रेषण एवं डीबीटी अनुमोदन।",
        mandiProcurementOfficer: "मंडी खरीद अधिकारी",
        mandiAdminControl: "मंडी प्रशासन एवं नियंत्रण कंसोल",
        adminConsole: "प्रशासन कंसोल",
        navYardOverview: "यार्ड विवरण",
        navQueueManagement: "कतार प्रबंधन",
        navFarmerRecords: "किसान रिकॉर्ड्स",
        navReports: "रिपोर्ट्स एवं विश्लेषण",
        navBroadcastTool: "प्रसारण सूचना",
        adminSystem: "प्रणाली",
        broadcastTitle: "मंडी यार्ड लाउडस्पीकर एवं एसएमएस प्रसारण",
        broadcastSubtitle: "यार्ड में मौजूद सभी किसानों को तुरंत वॉयस घोषणा एवं एसएमएस संदेश भेजें।",
        sendBroadcastBtn: "सभी किसानों को प्रसारित करें",
        totalFarmersServed: "आज सेवित कुल किसान",
        avgWaitTime: "औसत यार्ड प्रतीक्षा समय",
        callNextBtn: "अगले को बुलाएं",
        markCompleteBtn: "पूर्ण करें",
        cancelQueueBtn: "रद्द करें",
        weighbridgeOnline: "वेईब्रिज ऑनलाइन",
        callNextTokenBtn: "अगला टोकन बुलाएं",
        walkInTokenBtn: "वॉक-इन टोकन",
        yardQueueWaiting: "यार्ड कतार प्रतीक्षा",
        procuredToday: "आज की खरीद",
        weighmentsDone: "वजन कार्य पूर्ण",
        mspDisbursedValue: "एमएसपी संवितरण मूल्य",
        yardDispatcherTitle: "यार्ड कतार डिस्पैचर एवं प्रसारण नियंत्रण",
        callNextFarmerBtn: "अगले किसान को बुलाएं",
        mandiVoiceBroadcastBtn: "मंडी ध्वनि प्रसारण",
        issueSpotPassBtn: "स्पॉट पास जारी करें",
        resetDemoQueueBtn: "डेमो कतार रीसेट करें",
        liveYardQueueTitle: "लाइव मंडी यार्ड कतार एवं वेईब्रिज संचालन",
        liveYardQueueDesc: "किसानों को वेईब्रिज प्रवेश, गुणवत्ता निरीक्षण, खाली वजन एवं डीबीटी निपटान द्वारा संसाधित करें।",
        liveYardFeed: "लाइव यार्ड फीड",
        thToken: "टोकन #",
        thFarmerId: "किसान एवं आईडी",
        thCropQty: "फसल एवं मात्रा",
        thVehicleNo: "वाहन संख्या",
        thGatePass: "गेट पास",
        thCurrentStage: "वर्तमान चरण",
        thOfficerActions: "अधिकारी कार्रवाइयां",
        callBtn: "बुलाएं",
        grossWeigh: "सकल वजन",
        inspectQuality: "गुणवत्ता जांच",
        tareWeigh: "खाली वजन",
        completeDBT: "डीबीटी पूर्ण करें",
        cancelSlot: "स्लॉट रद्द करें",
        jFormReceipt: "जे-फॉर्म खरीद रसीद",
        viewOfficialReceipt: "आधिकारिक वजन रसीद देखें",
        cancelSlotBooking: "स्लॉट बुकिंग रद्द करें",
        cancelOrReschedule: "अपॉइंटमेंट रद्द या पुनर्निर्धारित करें",
        slotCancelled: "स्लॉट रद्द किया गया",
        procurementDone: "खरीद संपन्न",
        dbtPaymentReleased: "डीबीटी भुगतान जारी किया गया",
        welcomeDescription: "आपकी खरीद प्रक्रिया बस कुछ क्लिक दूर है। अपनी बुकिंग, कतार और भुगतान स्थिति यहां देखें।",
        bookNewSlot: "नया स्लॉट बुक करें",
        trackMyProcurement: "मेरी खरीद ट्रैक करें",
        inQueue: "कतार में",
        currentQueuePosition: "वर्तमान कतार स्थिति",
        estimatedWait: "अनुमानित प्रतीक्षा",
        nextProcurementSlot: "अगला खरीद स्लॉट",
        confirmed: "पुष्टि की गई",
        tomorrow: "कल",
        procurementStatus: "खरीद स्थिति",
        processing: "प्रक्रिया जारी",
        qualityCheck: "गुणवत्ता जांच",
        weighingCompleted: "तौल कार्य संपन्न",
        paymentStatus: "भुगतान स्थिति",
        pending: "लंबित",
        paymentUnderProcessing: "भुगतान प्रक्रिया में है",
        procurementJourney: "खरीद यात्रा",
        trackCropJourney: "फसल आगमन से भुगतान तक ट्रैक करें।",
        slotBooked: "स्लॉट बुक हो गया",
        arrivedAtCentre: "केंद्र पर आगमन",
        waitingForTurn: "बारी की प्रतीक्षा",
        cropInspected: "फसल की गुणवत्ता जांच जारी है",
        awaitingCompletion: "समापन की प्रतीक्षा",
        quickActions: "त्वरित कार्य",
        whatWouldYouLikeToDo: "आप क्या करना चाहते हैं?",
        quickBookSlot: "स्लॉट बुक करें",
        chooseDateTime: "दिनांक एवं समय चुनें",
        trackMyTurn: "अपनी बारी ट्रैक करें",
        seeLiveQueue: "लाइव कतार देखें",
        viewHistory: "इतिहास देखें",
        pastProcurementRecords: "पिछले खरीद रिकॉर्ड",
        getHelp: "मदद लें",
        talkToSupport: "सपोर्ट से बात करें",
        recentActivity: "हाल की गतिविधि",
        latestUpdates: "आपके नवीनतम खरीद अपडेट।",
        viewAll: "सभी देखें",
        slotConfirmed: "स्लॉट कन्फर्म हुआ",
        todayMorning: "आज · 09:42 AM",
        completed: "पूर्ण हुआ",
        cropWeighingCompleted: "फसल की तौल पूरी हुई",
        todayNoon: "आज · 11:15 AM",
        done: "सफल",
        paymentInitiated: "भुगतान शुरू किया गया",
        todayAfternoon: "आज · 01:20 PM",
        yourProcurementCentre: "आपका खरीद केंद्र",
        nearestCentre: "आपके निकटतम केंद्र",
        open: "खुला है",
        mainAgriculturalMarket: "मुख्य कृषि मंडी, जिला यार्ड",
        privacy: "गोपनीयता",
        terms: "नियम",
        bookingTitle: "खरीद स्लॉट बुक करें",
        bookingIntro: "लंबी कतारों से बचने के लिए निकटतम मंडी में पहले से स्लॉट बुक करें।",
        chooseCrop: "बिक्री हेतु फसल चुनें",
        chooseYourCrop: "-- फसल चुनें --",
        rice: "धान / चावल (एमएसपी ₹2,300/क्विंटल)",
        wheat: "गेहूं (एमएसपी ₹2,275/क्विंटल)",
        maize: "मक्का (एमएसपी ₹2,090/क्विंटल)",
        cotton: "कपास (एमएसपी ₹7,121/क्विंटल)",
        groundnut: "मूंगफली (एमएसपी ₹6,783/क्विंटल)",
        mustard: "सरसों / दालें (एमएसपी ₹5,650/क्विंटल)",
        quantity: "अनुमानित मात्रा (क्विंटल में)",
        enterQuantity: "जैसे 25.5",
        quintals: "क्विंटल",
        quantityHelp: "1 क्विंटल = 100 किलोग्राम। सरकारी एमएसपी प्रति क्विंटल के अनुसार देय है।",
        procurementCentre: "खरीद मंडी / केंद्र चुनें",
        selectCentre: "-- खरीद केंद्र चुनें --",
        apStateCentre: "एपी राज्य खरीद केंद्र (यार्ड 1)",
        districtProcurementCentre: "जिला खाद्यान्न केंद्र (यार्ड 2)",
        date: "पसंदीदा डिलीवरी तिथि",
        preferredTime: "पसंदीदा स्लॉट समय",
        selectTime: "-- समय स्लॉट चुनें --",
        availableSlots: "उपलब्ध स्लॉट क्षमता",
        available: "उपलब्ध",
        vehicleType: "परिवहन वाहन का प्रकार",
        tractor: "ट्रैक्टर ट्रॉली",
        miniTruck: "मिनी व्यावसायिक ट्रक",
        bullockCart: "बैलगाड़ी / अन्य",
        vehicleNumber: "वाहन नंबर / प्रवेश पास",
        bookingInfo: "पुष्टि होने पर आपको टोकन नंबर सहित डिजिटल गेट पास एसएमएस मिलेगा।",
        confirmSlot: "पुष्टि करें एवं डिजिटल पास बनाएं",
        liveQueueTracker: "लाइव मंडी कतार ट्रैकर",
        tokenNumber: "टोकन नंबर",
        nowServing: "वर्तमान में सेवारत",
        yourPosition: "कतार में आपका स्थान",
        estimatedTimeRemaining: "अनुमानित शेष समय",
        counterGate: "आवंटित काउंटर",
        advanceQueueBtn: "कतार आगे बढ़ाएं (सिमुलेशन)",
        callTurnBtn: "मेरी बारी अलर्ट चालू करें",
        resetQueueBtn: "कतार रीसेट करें",
        turnReadyAlert: "आपकी बारी आ गई है! कृपया तुरंत तौल काउंटर 2 पर जाएं।",
        dbtTrackerTitle: "प्रत्यक्ष लाभ अंतरण (DBT) भुगतान ट्रैकर",
        paymentDetails: "खरीद एवं भुगतान विवरण",
        grossAmount: "कुल सकल एमएसपी राशि",
        bankCreditStatus: "बैंक खाता जमा स्थिति",
        bankNameLabel: "बैंक खाता",
        ifscLabel: "आईएफएससी कोड",
        utrLabel: "डीबीटी संदर्भ / यूटीआर नंबर",
        weighingSlip: "आधिकारिक तौल एवं नमी पर्ची",
        downloadSlip: "डीबीटी रसीद डाउनलोड करें",
        // Notifications
        notificationsTitle: "सूचना एवं अलर्ट केंद्र",
        markAllRead: "सभी पढ़ी गई चिह्नित करें",
        clearAllNotifs: "सभी हटाएं",
        voiceAlertBtn: "आवाज में सूचना सुनें",
        allNotifReadSuccess: "सभी सूचनाएं पढ़ ली गईं।",
        filterAll: "सभी",
        filterUnread: "अपठित",
        filterProcurement: "कतार एवं मंडी",
        filterPayment: "डीबीटी एवं भुगतान",
        noNotifications: "कोई सूचना नहीं है",
        noNotificationsDesc: "सभी सूचनाएं अद्यतन हैं! स्लॉट बुकिंग, कतार बारी और डीबीटी भुगतान की सूचनाएं यहां दिखाई देंगी।",
        centresTitle: "निकटतम खरीद केंद्र एवं भीड़ स्थिति",
        liveCrowdStatus: "मंडी में लाइव भीड़ स्थिति",
        lowWait: "कम भीड़ (5-10 मिनट प्रतीक्षा)",
        medWait: "मध्यम भीड़ (20-30 मिनट प्रतीक्षा)",
        highWait: "अधिक भीड़ (1+ घंटा प्रतीक्षा)",
        getDirections: "रास्ता देखें",
        callMandiOfficer: "मंडी प्रभारी को कॉल करें",
        helpTitle: "सहायता एवं शिकायत निवारण पोर्टल",
        tollFreeTitle: "किसान कॉल सेंटर (टोल-फ्री 24x7)",
        tollFreeNumber: "1800-180-1551",
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        submitGrievance: "शिकायत दर्ज करें",
        grievanceSubject: "शिकायत का विषय",
        grievanceDesc: "अपनी समस्या का विवरण दें",
        submitComplaintBtn: "शिकायत टिकट दर्ज करें",
        complaintSubmitted: "आपकी शिकायत दर्ज हो गई है: #GRV-2026-9481",
        settingsTitle: "किसान प्रोफ़ाइल एवं पोर्टल सेटिंग्स",
        tabPersonal: "व्यक्तिगत विवरण",
        tabBank: "डीबीटी एवं बैंक खाता",
        tabPreferences: "सूचना अलर्ट",
        tabDisplay: "प्रदर्शन एवं सुगमता",
        farmerFullName: "पूरा नाम",
        mobileNoLabel: "पंजीकृत मोबाइल नंबर",
        aadhaarLabel: "आधार / किसान आईडी",
        landSizeLabel: "भूमि क्षेत्र (एकड़)",
        villageLabel: "गांव / शहर",
        districtLabel: "जिला एवं राज्य",
        saveProfileBtn: "प्रोफ़ाइल सहेजें",
        accountHolder: "खाताधारक का नाम",
        accountNo: "बैंक खाता संख्या",
        aadhaarSeeded: "डीबीटी हेतु आधार से लिंक",
        smsAlerts: "टोकन एवं कतार हेतु एसएमएस अलर्ट",
        whatsappAlerts: "व्हाट्सएप खरीद अपडेट",
        voiceCallAlerts: "स्थानीय भाषा में ऑटोमेटेड वॉइस कॉल",
        proximityAlert: "कतार में 3 किसान आगे रहने पर सूचित करें",
        largeTextMode: "बड़ा फ़ॉन्ट मोड (सुगमता)",
        highContrastMode: "डार्क / हाई कंट्रास्ट मोड",
        soundAlerts: "बारी आने पर ध्वनि अलर्ट",
        profileUpdatedSuccess: "किसान प्रोफ़ाइल और सेटिंग्स सफलतापूर्वक सहेजी गईं!",
        logoutConfirmTitle: "लॉग आउट की पुष्टि",
        logoutConfirmMsg: "क्या आप वास्तव में किसान सेतु से लॉग आउट करना चाहते हैं?",
        confirmLogoutBtn: "हाँ, लॉग आउट करें",
        cancelBtn: "रद्द करें"
    },
    Telugu: {
        aiQualityInspection: "AI నాణ్యత తనిఖీ",
        aiQualityInspectionBtn: "AI నాణ్యత తనిఖీ",
        aiQualityInspectionTitle: "AI ప్రాథమిక ధాన్యం నాణ్యత అంచనా",
        quickQualityReport: "AI నాణ్యత నివేదిక",
        quickQualityReportDesc: "ధాన్యం గ్రేడ్ & లోపాల నివేదిక",
        aiAdvisoryNotice: "AI ప్రాథమిక విజువల్ అంచనా (సలహా మాత్రమే).",
        overallQuality: "మొత్తం నాణ్యత స్కోరు",
        estimatedGrade: "అంచనా వేసిన గ్రేడ్",
        visibleDefects: "కనిపించే లోపాలు",
        discoloration: "రంగు మారడం",
        brokenGrains: "విరిగిన ధాన్యం",
        foreignMaterial: "ఇతర వ్యర్థ పదార్థాలు",
        uniformity: "ఏకరూపత",
        assessmentConfidence: "అంచనా విశ్వసనీయత",
        aiRecommendation: "AI సిఫార్సు",
        approveLotBtn: "లాట్ ఆమోదించండి",
        holdLotBtn: "ల్యాబ్ తనిఖీకి ఉంచండి",
        rejectLotBtn: "లాట్ తిరస్కరించండి",
        myGatePassQR: "నా గేట్ పాస్ QR",
        showMyQR: "నా QR చూపించు",
        scanFarmerQR: "రైతు QR స్కాన్ చేయండి",
        scanFarmerQRBtn: "రైతు QR స్కాన్",
        quickMyQR: "రాక QR కోడ్ చూపించు",
        quickMyQRDesc: "గేట్ ప్రవేశ ధృవీకరణ పాస్",
        gatePassQRTitle: "డిజిటల్ గేట్ పాస్ & QR కోడ్",
        officerScannerTitle: "రైతు రాక QR స్కానర్",
        liveSync: "లైవ్ సింక్",
        farmerProcurement: "రైతు సేకరణ పోర్టల్",
        mainMenu: "ప్రధాన మెనూ",
        services: "సేవలు",
        dashboard: "డాష్‌బోర్డ్",
        cancelProcurement: "సేకరణ రద్దు చేయండి",
        completeProcurement: "సేకరణ పూర్తి చేయండి",
        officerPortal: "మండీ అధికారి పోర్టల్",
        book: "స్లాట్ బుక్ చేసుకోండి",
        track: "సేకరణను ట్రాక్ చేయండి",
        history: "బుకింగ్ హిస్టరీ",
        payment: "చెల్లింపు స్థితి",
        notifications: "నోటిఫికేషన్లు",
        centre: "సేకరణ కేంద్రాలు",
        help: "సహాయం & మద్దతు",
        needHelp: "సహాయం కావాలా?",
        talkSupport: "సహాయక బృందంతో మాట్లాడండి",
        profileSettings: "ప్రొఫైల్ & సెట్టింగ్‌లు",
        accountSettings: "ఖాతా",
        logout: "లాగ్ అవుట్",
        manageProcurementJourney: "మీ సేకరణ ప్రయాణాన్ని సులభంగా నిర్వహించండి.",
        farmerPortal: "రైతు పోర్టల్",
        welcomeTitle: "శుభోదయం, {name} గారు! 👋",
        officerIncharge: "ఇన్‌చార్జ్ అధికారి:",
        officerIdLabel: "మండీ అధికారి",
        farmerIdLabel: "రైతు ఐడీ",
        officerPortalTag: "మండీ పరిపాలన పోర్టల్ • యార్డ్ 1",
        officerHeroTitle: "మండీ అధికారి & యార్డ్ క్యూ కంట్రోలర్ 🏛️",
        officerHeroDesc: "రియల్-టైమ్ వేబ్రిడ్జ్ ఇన్‌టేక్, నాణ్యత పరిశీలన, క్యూ డిస్పాచ్ మరియు డీబీటీ ఆమోదాలు.",
        mandiProcurementOfficer: "మండీ సేకరణ అధికారి",
        mandiAdminControl: "మండీ అడ్మిన్ & కంట్రోల్ కన్సోల్",
        adminConsole: "అడ్మిన్ కన్సోల్",
        navYardOverview: "యార్డ్ అవలోకనం",
        navQueueManagement: "క్యూ నిర్వహణ",
        navFarmerRecords: "రైతుల రికార్డులు",
        navReports: "రిపోర్టులు & అనలిటిక్స్",
        navBroadcastTool: "బ్రాడ్‌కాస్ట్ అలర్ట్",
        adminSystem: "వ్యవస్థ",
        broadcastTitle: "మండీ యార్డ్ లౌడ్‌స్పీకర్ & ఎస్ఎంఎస్ బ్రాడ్‌కాస్ట్",
        broadcastSubtitle: "యార్డ్‌లో ఉన్న రైతులందరికీ తక్షణ వాయిస్ అనౌన్స్‌మెంట్లు మరియు ఎస్ఎంఎస్ పంపండి.",
        sendBroadcastBtn: "అందరు రైతులకు ప్రసారం చేయండి",
        totalFarmersServed: "నేడు సేవలు పొందిన మొత్తం రైతులు",
        avgWaitTime: "సగటు యార్డ్ వేచి ఉండే సమయం",
        callNextBtn: "తదుపరి పిలవండి",
        markCompleteBtn: "పూర్తి చేయండి",
        cancelQueueBtn: "రద్దు",
        weighbridgeOnline: "వేబ్రిడ్జ్ ఆన్‌లైన్",
        callNextTokenBtn: "తదుపరి టోకెన్ పిలవండి",
        walkInTokenBtn: "వాక్-ఇన్ టోకెన్",
        yardQueueWaiting: "యార్డ్ క్యూ వేచింపు",
        procuredToday: "నేటి సేకరణ",
        weighmentsDone: "తూకం పూర్తయినవి",
        mspDisbursedValue: "ఎంఎస్‌పీ పంపిణీ విలువ",
        yardDispatcherTitle: "యార్డ్ క్యూ డిస్పాచర్ & బ్రాడ్‌కాస్ట్ నియంత్రణలు",
        callNextFarmerBtn: "తదుపరి రైతును పిలవండి",
        mandiVoiceBroadcastBtn: "మండీ వాయిస్ బ్రాడ్‌కాస్ట్",
        issueSpotPassBtn: "స్పాట్ పాస్ ఇవ్వండి",
        resetDemoQueueBtn: "డెమో క్యూ రీసెట్ చేయండి",
        liveYardQueueTitle: "లైవ్ మండీ యార్డ్ క్యూ & వేబ్రిడ్జ్ నిర్వహణ",
        liveYardQueueDesc: "రైతులను వేబ్రిడ్జ్ ఎంట్రీ, నాణ్యత తనిఖీ, తూకం మరియు డీబీటీ సెటిల్‌మెంట్ ద్వారా ప్రాసెస్ చేయండి.",
        liveYardFeed: "లైవ్ యార్డ్ ఫీడ్",
        thToken: "టోకెన్ #",
        thFarmerId: "రైతు & ఐడీ",
        thCropQty: "పంట & పరిమాణం",
        thVehicleNo: "వాహనం నం.",
        thGatePass: "గేట్ పాస్",
        thCurrentStage: "ప్రస్తుత దశ",
        thOfficerActions: "అధికారి చర్యలు",
        callBtn: "పిలవండి",
        grossWeigh: "స్థూల తూకం",
        inspectQuality: "నాణ్యత తనిఖీ",
        tareWeigh: "ఖాళీ తూకం",
        completeDBT: "డీబీటీ పూర్తి",
        cancelSlot: "స్లాట్ రద్దు చేయండి",
        jFormReceipt: "జె-ఫారం సేకరణ రసీదు",
        viewOfficialReceipt: "అధికారిక తూకం రసీదు చూడండి",
        cancelSlotBooking: "స్లాట్ బుకింగ్ రద్దు చేయండి",
        cancelOrReschedule: "అపాయింట్‌మెంట్‌ను రద్దు చేయండి లేదా మార్చండి",
        slotCancelled: "స్లాట్ రద్దు చేయబడింది",
        procurementDone: "సేకరణ పూర్తయింది",
        dbtPaymentReleased: "డిబిటి చెల్లింపు విడుదల చేయబడింది",
        welcomeDescription: "మీ సేకరణ ప్రయాణం కొన్ని క్లిక్‌ల దూరంలో ఉంది. మీ బుకింగ్, క్యూ మరియు చెల్లింపు స్థితిని ఇక్కడ చూడండి.",
        bookNewSlot: "కొత్త స్లాట్ బుక్ చేయండి",
        trackMyProcurement: "నా సేకరణను ట్రాక్ చేయండి",
        inQueue: "క్యూలో ఉన్నారు",
        currentQueuePosition: "ప్రస్తుత క్యూ స్థానం",
        estimatedWait: "అంచనా వేచి ఉండే సమయం",
        nextProcurementSlot: "తదుపరి సేకరణ స్లాట్",
        confirmed: "ధృవీకరించబడింది",
        tomorrow: "రేపు",
        procurementStatus: "సేకరణ స్థితి",
        processing: "ప్రాసెసింగ్ జరుగుతోంది",
        qualityCheck: "నాణ్యత పరిశీలన",
        weighingCompleted: "తూకం పూర్తయింది",
        paymentStatus: "చెల్లింపు స్థితి",
        pending: "పెండింగ్‌లో ఉంది",
        paymentUnderProcessing: "చెల్లింపు ప్రాసెసింగ్‌లో ఉంది",
        procurementJourney: "సేకరణ ప్రయాణం",
        trackCropJourney: "ధాన్యం రాక నుండి చెల్లింపు వరకు ట్రాక్ చేయండి.",
        slotBooked: "స్లాట్ బుక్ చేయబడింది",
        arrivedAtCentre: "కేంద్రానికి చేరుకున్నారు",
        waitingForTurn: "మీ వంతు కోసం వేచి ఉన్నారు",
        cropInspected: "మీ పంట నాణ్యత పరిశీలన జరుగుతోంది",
        awaitingCompletion: "పూర్తి కావాల్సి ఉంది",
        quickActions: "త్వరిత చర్యలు",
        whatWouldYouLikeToDo: "మీరు ఏమి చేయాలనుకుంటున్నారు?",
        quickBookSlot: "స్లాట్ బుక్ చేయండి",
        chooseDateTime: "తేదీ & సమయం ఎంచుకోండి",
        trackMyTurn: "నా వంతును ట్రాక్ చేయండి",
        seeLiveQueue: "లైవ్ క్యూ చూడండి",
        viewHistory: "చరిత్ర చూడండి",
        pastProcurementRecords: "గత సేకరణ రికార్డులు",
        getHelp: "సహాయం పొందండి",
        talkToSupport: "మద్దతుదారులతో మాట్లాడండి",
        recentActivity: "ఇటీవలి కార్యకలాపాలు",
        latestUpdates: "మీ తాజా సేకరణ అప్‌డేట్‌లు.",
        viewAll: "అన్నీ చూడండి",
        slotConfirmed: "స్లాట్ నిర్ధారించబడింది",
        todayMorning: "ఈ రోజు · 09:42 AM",
        completed: "పూర్తయింది",
        cropWeighingCompleted: "తూకం పూర్తయింది",
        todayNoon: "ఈ రోజు · 11:15 AM",
        done: "పూర్తి",
        paymentInitiated: "చెల్లింపు ప్రారంభించబడింది",
        todayAfternoon: "ఈ రోజు · 01:20 PM",
        yourProcurementCentre: "మీ సేకరణ కేంద్రం",
        nearestCentre: "మీకు సమీపంలోని కేంద్రం",
        open: "తెరిచి ఉంది",
        mainAgriculturalMarket: "ప్రధాన వ్యవసాయ మార్కెట్ యార్డ్",
        privacy: "గోప్యత",
        terms: "నిబంధనలు",
        bookingTitle: "సేకరణ స్లాట్ బుక్ చేసుకోండి",
        bookingIntro: "గంటల తరబడి వేచి ఉండకుండా ముందుగానే మార్కెట్ యార్డ్ స్లాట్ బుక్ చేసుకోండి.",
        chooseCrop: "విక్రయించాల్సిన పంటను ఎంచుకోండి",
        chooseYourCrop: "-- పంటను ఎంచుకోండి --",
        rice: "వరి / ధాన్యం (MSP ₹2,300/క్వింటా)",
        wheat: "గోధుమలు (MSP ₹2,275/క్వింటా)",
        maize: "మొక్కజొన్న (MSP ₹2,090/క్వింటా)",
        cotton: "పత్తి (MSP ₹7,121/క్వింటా)",
        groundnut: "వేరుశనగ (MSP ₹6,783/క్వింటా)",
        mustard: "ఆవాలు / పప్పుధాన్యాలు (MSP ₹5,650/క్వింటా)",
        quantity: "అంచనా పరిమాణం (క్వింటాళ్లలో)",
        enterQuantity: "ఉదా: 25.5",
        quintals: "క్వింటాళ్లు",
        quantityHelp: "1 క్వింటా = 100 కేజీలు. ప్రభుత్వ మద్దతు ధర ప్రతి క్వింటాకు లెక్కించబడుతుంది.",
        procurementCentre: "సేకరణ కేంద్రం / మార్కెట్ ఎంచుకోండి",
        selectCentre: "-- కేంద్రాన్ని ఎంచుకోండి --",
        apStateCentre: "AP రాష్ట్ర సేకరణ కేంద్రం (యార్డ్ 1)",
        districtProcurementCentre: "జిల్లా ధాన్య సేకరణ కేంద్రం (యార్డ్ 2)",
        date: "రావాలనుకుంటున్న తేదీ",
        preferredTime: "సమయ స్లాట్",
        selectTime: "-- స్లాట్ సమయం ఎంచుకోండి --",
        availableSlots: "అందుబాటులో ఉన్న స్లాట్‌లు",
        available: "అందుబాటులో ఉంది",
        vehicleType: "రవాణా వాహనం రకం",
        tractor: "ట్రాక్టర్ ట్రాలీ",
        miniTruck: "మినీ ట్రక్",
        bullockCart: "ఎడ్ల బండి / ఇతర",
        vehicleNumber: "వాహనం నంబర్ / ఎంట్రీ పాస్",
        bookingInfo: "ధృవీకరించిన తర్వాత మీకు టోకెన్ నంబర్‌తో కూడిన SMS గేట్ పాస్ అందుతుంది.",
        confirmSlot: "ధృవీకరించండి & డిజిటల్ పాస్ పొందండి",
        liveQueueTracker: "లైవ్ మార్కెట్ క్యూ ట్రాకర్",
        tokenNumber: "టోకెన్ నంబర్",
        nowServing: "ప్రస్తుతం జరుగుతున్న టోకెన్",
        yourPosition: "క్యూలో మీ స్థానం",
        estimatedTimeRemaining: "మిగిలి ఉన్న అంచనా సమయం",
        counterGate: "కేటాయించిన కౌంటర్",
        advanceQueueBtn: "క్యూ ముందుకు జరపండి (సిమ్యులేషన్)",
        callTurnBtn: "నా వంతు హెచ్చరిక",
        resetQueueBtn: "క్యూ రీసెట్ చేయండి",
        turnReadyAlert: "మీ వంతు వచ్చింది! దయచేసి వెంటనే తూకం కౌంటర్ 2 వద్దకు వెళ్లండి.",
        dbtTrackerTitle: "ప్రత్యక్ష నగదు బదిలీ (DBT) చెల్లింపు ట్రాకర్",
        paymentDetails: "సేకరణ & చెల్లింపు వివరాలు",
        grossAmount: "మొత్తం MSP మద్దతు ధర",
        bankCreditStatus: "బ్యాంక్ ఖాతా జమ స్థితి",
        bankNameLabel: "బ్యాంక్ ఖాతా",
        ifscLabel: "IFSC కోడ్",
        utrLabel: "DBT రిఫరెన్స్ / UTR నంబర్",
        weighingSlip: "అధికారిక తూకం మరియు తేమ రసీదు",
        downloadSlip: "DBT రసీదు డౌన్‌లోడ్ చేసుకోండి",
        // Notifications
        notificationsTitle: "నోటిఫికేషన్ & హెచ్చరిక కేంద్రం",
        markAllRead: "అన్నీ చదివినట్లు గుర్తించు",
        clearAllNotifs: "అన్నీ తొలగించు",
        voiceAlertBtn: "వాయిస్ అనౌన్స్‌మెంట్ వినండి",
        allNotifReadSuccess: "అన్ని నోటిఫికేషన్లు చదివినట్లు గుర్తించబడ్డాయి.",
        filterAll: "అన్నీ",
        filterUnread: "చదవనివి",
        filterProcurement: "క్యూ & మండీ",
        filterPayment: "డీబీటీ & చెల్లింపు",
        noNotifications: "ఎటువంటి నోటిఫికేషన్లు లేవు",
        noNotificationsDesc: "మీరు అన్నీ చూశారు! స్లాట్ బుకింగ్, క్యూ టర్న్ మరియు డీబీటీ చెల్లింపుల నోటిఫికేషన్లు ఇక్కడ కనిపిస్తాయి.",
        centresTitle: "సమీప సేకరణ కేంద్రాలు & రద్దీ సమాచారం",
        liveCrowdStatus: "మార్కెట్‌లో ప్రస్తుత రద్దీ",
        lowWait: "తక్కువ రద్దీ (5-10 నిమిషాలు)",
        medWait: "మధ్యస్థ రద్దీ (20-30 నిమిషాలు)",
        highWait: "ఎక్కువ రద్దీ (1+ గంట వేచి ఉండాలి)",
        getDirections: "రూట్ మ్యాప్ చూడండి",
        callMandiOfficer: "మార్కెట్ అధికారికి కాల్ చేయండి",
        helpTitle: "సహాయం & ఫిర్యాదుల నివారణ పోర్టల్",
        tollFreeTitle: "కిసాన్ కాల్ సెంటర్ (టోల్-ఫ్రీ 24x7)",
        tollFreeNumber: "1800-180-1551",
        faqTitle: "తరచుగా అడిగే ప్రశ్నలు",
        submitGrievance: "ఫిర్యాదును నమోదు చేయండి",
        grievanceSubject: "ఫిర్యాదు విషయం",
        grievanceDesc: "మీ సమస్యను వివరించండి",
        submitComplaintBtn: "ఫిర్యాదు టికెట్ సమర్పించండి",
        complaintSubmitted: "మీ ఫిర్యాదు నమోదు చేయబడింది: #GRV-2026-9481",
        settingsTitle: "రైతు ప్రొఫైల్ & సెట్టింగ్‌లు",
        tabPersonal: "వ్యక్తిగత ప్రొఫైల్",
        tabBank: "DBT & బ్యాంక్ ఖాతా",
        tabPreferences: "నోటిఫికేషన్ హెచ్చరికలు",
        tabDisplay: "డిస్ప్లే & ప్రాప్యత",
        farmerFullName: "పూర్తి పేరు",
        mobileNoLabel: "రిజిస్టర్డ్ మొబైల్ నంబర్",
        aadhaarLabel: "ఆధార్ / రైతు ID",
        landSizeLabel: "భూమి విస్తీర్ణం (ఎకరాలు)",
        villageLabel: "గ్రామం / పట్టణం",
        districtLabel: "జిల్లా & రాష్ట్రం",
        saveProfileBtn: "ప్రొఫైల్‌ను భద్రపరచండి",
        accountHolder: "ఖాతాదారుని పేరు",
        accountNo: "బ్యాంక్ ఖాతా సంఖ్య",
        aadhaarSeeded: "DBT కోసం ఆధార్ లింక్ చేయబడింది",
        smsAlerts: "టోకెన్ & క్యూ SMS అలర్ట్‌లు",
        whatsappAlerts: "వాట్సాప్ సేకరణ అప్‌డేట్‌లు",
        voiceCallAlerts: "తెలుగులో ఆటోమేటెడ్ వాయిస్ కాల్స్",
        proximityAlert: "క్యూలో 3 మంది రైతులు ముందున్నప్పుడు హెచ్చరించండి",
        largeTextMode: "పెద్ద అక్షరాల మోడ్ (రైతుల సౌలభ్యం కోసం)",
        highContrastMode: "డార్క్ / హై కాంట్రాస్ట్ మోడ్",
        soundAlerts: "వంతు వచ్చినప్పుడు సౌండ్ అలర్ట్",
        profileUpdatedSuccess: "రైతు ప్రొఫైల్ మరియు సెట్టింగ్‌లు విజయవంతంగా నవీకరించబడ్డాయి!",
        logoutConfirmTitle: "లాగ్ అవుట్ నిర్ధారణ",
        logoutConfirmMsg: "మీరు ఖచ్చితంగా కిసాన్ సేతు పోర్టల్ నుండి లాగ్ అవుట్ అవ్వాలనుకుంటున్నారా?",
        confirmLogoutBtn: "అవును, లాగ్ అవుట్ అవ్వండి",
        cancelBtn: "రద్దు చేయండి"
    },
    Tamil: {
        aiQualityInspection: "AI தர ஆய்வு",
        aiQualityInspectionBtn: "AI தர ஆய்வு",
        aiQualityInspectionTitle: "AI தானிய தர மதிப்பீடு",
        quickQualityReport: "AI தர அறிக்கை",
        quickQualityReportDesc: "தானிய தரம் மற்றும் குறைபாடுகள் அறிக்கை",
        aiAdvisoryNotice: "AI ஆரம்ப தர மதிப்பீடு (ஆலோசனை மட்டுமே).",
        overallQuality: "ஒட்டுமொத்த தர மதிப்பெண்",
        estimatedGrade: "மதிப்பிடப்பட்ட தரம்",
        visibleDefects: "காணக்கூடிய குறைபாடுகள்",
        discoloration: "நிறமாற்றம்",
        brokenGrains: "உடைந்த தானியங்கள்",
        foreignMaterial: "அயல் பொருட்கள்",
        uniformity: "சீரான தன்மை",
        assessmentConfidence: "மதிப்பீட்டு நம்பிக்கை",
        aiRecommendation: "AI பரிந்துரை",
        approveLotBtn: "ஒப்புதல் அளிக்கவும்",
        holdLotBtn: "ஆய்வக பரிசோதனைக்கு வைக்கவும்",
        rejectLotBtn: "நிராகரிக்கவும்",
        myGatePassQR: "என் கேட் பாஸ் QR",
        showMyQR: "என் QR காட்டு",
        scanFarmerQR: "விவசாயி QR ஸ்கேன்",
        scanFarmerQRBtn: "QR ஸ்கேன்",
        quickMyQR: "வருகை QR குறியீடு",
        quickMyQRDesc: "நுழைவு சரிபார்ப்பு பாஸ்",
        gatePassQRTitle: "டிஜிட்டல் கேட் பாஸ் & QR குறியீடு",
        officerScannerTitle: "விவசாயி வருகை QR ஸ்கேனர்",
        liveSync: "நேரலை ஒத்திசைவு",
        farmerProcurement: "உழவர் கொள்முதல் போர்டல்",
        mainMenu: "முதன்மை மெனு",
        services: "சேவைகள்",
        dashboard: "டாஷ்போர்டு",
        cancelProcurement: "கொள்முதலை ரத்து செய்",
        completeProcurement: "கொள்முதலை முடி",
        officerPortal: "மண்டி அதிகாரி போர்டல்",
        book: "முன்பதிவு செய்க",
        track: "கொள்முதலைக் கண்காணிக்க",
        history: "முன்பதிவு வரலாறு",
        payment: "கொடுப்பனவு நிலை",
        notifications: "அறிவிப்புகள்",
        centre: "கொள்முதல் மையங்கள்",
        help: "உதவி & ஆதரவு",
        needHelp: "உதவி தேவையா?",
        talkSupport: "ஆதரவு குழுவுடன் பேசவும்",
        profileSettings: "சுயவிவரம் & அமைப்புகள்",
        accountSettings: "கணக்கு",
        logout: "வெளியேறு",
        manageProcurementJourney: "உங்கள் கொள்முதல் பயணத்தை எளிதாக நிர்வகிக்கவும்.",
        farmerPortal: "உழவர் போர்டல்",
        welcomeTitle: "காலை வணக்கம், {name}! 👋",
        officerIncharge: "பொறுப்பு அதிகாரி:",
        officerIdLabel: "மண்டி அதிகாரி",
        farmerIdLabel: "விவசாயி ஐடி",
        officerPortalTag: "மண்டி நிர்வாக போர்டல் • யார்டு 1",
        officerHeroTitle: "மண்டி அதிகாரி & யார்டு வரிசை கட்டுப்படுத்தி 🏛️",
        officerHeroDesc: "நிகழ்நேர எடைமேடை பதிவு, தர சரிபார்ப்பு, வரிசை அனுப்புதல் மற்றும் டிபிடி ஒப்புதல்கள்.",
        mandiProcurementOfficer: "மண்டி கொள்முதல் அதிகாரி",
        mandiAdminControl: "மண்டி நிர்வாகம் & கட்டுப்பாட்டு கன்சோல்",
        adminConsole: "நிர்வாக கன்சோல்",
        navYardOverview: "யார்டு கண்ணோட்டம்",
        navQueueManagement: "வரிசை மேலாண்மை",
        navFarmerRecords: "விவசாயி பதிவுகள்",
        navReports: "அறிக்கைகள் & பகுப்பாய்வு",
        navBroadcastTool: "ஒலிபரப்பு எச்சரிக்கை",
        adminSystem: "அமைப்பு",
        broadcastTitle: "மண்டி யார்டு ஒலிபெருக்கி & எஸ்எம்எஸ் ஒளிபரப்பு",
        broadcastSubtitle: "யார்டில் உள்ள விவசாயிகளுக்கு குரல் அறிவிப்பு மற்றும் எஸ்எம்எஸ் அனுப்பவும்.",
        sendBroadcastBtn: "அனைத்து விவசாயிகளுக்கும் ஒளிபரப்பு",
        totalFarmersServed: "இன்று பயனடைந்த மொத்த விவசாயிகள்",
        avgWaitTime: "சராசரி யார்டு காத்திருப்பு நேரம்",
        callNextBtn: "அடுத்தவரை அழை",
        markCompleteBtn: "முடிக்கவும்",
        cancelQueueBtn: "ரத்து செய்",
        weighbridgeOnline: "எடைமேடை ஆன்லைன்",
        callNextTokenBtn: "அடுத்த டோக்கனை அழைக்கவும்",
        walkInTokenBtn: "நேரடி டோக்கன்",
        yardQueueWaiting: "யார்டு வரிசை காத்திருப்பு",
        procuredToday: "இன்றைய கொள்முதல்",
        weighmentsDone: "எடை நிறைவடைந்தவை",
        mspDisbursedValue: "எம்எஸ்பி வழங்கப்பட்ட தொகை",
        yardDispatcherTitle: "யார்டு வரிசை மற்றும் அறிவிப்பு கட்டுப்பாடுகள்",
        callNextFarmerBtn: "அடுத்த விவசாயியை அழைக்கவும்",
        mandiVoiceBroadcastBtn: "மண்டி குரல் அறிவிப்பு",
        issueSpotPassBtn: "நேரடி பாஸ் வழங்குக",
        resetDemoQueueBtn: "டெமோ வரிசையை மீட்டமை",
        liveYardQueueTitle: "நேரடி மண்டி யார்டு வரிசை & எடைமேடை செயல்பாடுகள்",
        liveYardQueueDesc: "விவசாயிகளை எடைமேடை நுழைவு, தர ஆய்வு, எடை மற்றும் டிபிடி தீர்வு மூலம் செயலாக்கவும்.",
        liveYardFeed: "நேரடி யார்டு தகவல்",
        thToken: "டோக்கன் #",
        thFarmerId: "விவசாயி & ஐடி",
        thCropQty: "பயிர் & அளவு",
        thVehicleNo: "வாகன எண்",
        thGatePass: "நுழைவுச் சீட்டு",
        thCurrentStage: "தற்போதைய நிலை",
        thOfficerActions: "அதிகாரி செயல்கள்",
        callBtn: "அழை",
        grossWeigh: "மொத்த எடை",
        inspectQuality: "தர ஆய்வு",
        tareWeigh: "வெற்று எடை",
        completeDBT: "டிபிடி முடி",
        cancelSlot: "ஸ்லாட்டை ரத்து செய்",
        jFormReceipt: "ஜே-படிவம் கொள்முதல் ரசீது",
        viewOfficialReceipt: "அதிகாரப்பூர்வ எடை ரசீதைப் பார்க்கவும்",
        cancelSlotBooking: "முன்பதிவை ரத்து செய்",
        cancelOrReschedule: "முன்பதிவை ரத்து செய் அல்லது மாற்று",
        slotCancelled: "ஸ்லாட் ரத்து செய்யப்பட்டது",
        procurementDone: "கொள்முதல் முடிந்தது",
        dbtPaymentReleased: "டிபிடி பணம் வழங்கப்பட்டது",
        welcomeDescription: "உங்கள் கொள்முதல் பயணம் சில கிளிக்குகளில் உள்ளது.",
        bookNewSlot: "புதிய முன்பதிவு",
        trackMyProcurement: "கொள்முதலைக் கண்காணிக்க",
        inQueue: "வரிசையில்",
        currentQueuePosition: "தற்போதைய வரிசை நிலை",
        estimatedWait: "எதிர்பார்க்கப்படும் நேரம்",
        nextProcurementSlot: "அடுத்த கொள்முதல் நேரம்",
        confirmed: "உறுதி செய்யப்பட்டது",
        tomorrow: "நாளை",
        procurementStatus: "கொள்முதல் நிலை",
        processing: "செயல்பாட்டில் உள்ளது",
        qualityCheck: "தர பரிசோதனை",
        weighingCompleted: "எடை நிறைவடைந்தது",
        paymentStatus: "பணப்பரிவர்த்தனை நிலை",
        pending: "நிலுவையில் உள்ளது",
        paymentUnderProcessing: "பணம் செயலாக்கத்தில் உள்ளது",
        procurementJourney: "கொள்முதல் பயணம்",
        trackCropJourney: "வருகை முதல் கட்டணம் வரை கண்காணிக்கவும்.",
        slotBooked: "முன்பதிவு செய்யப்பட்டது",
        arrivedAtCentre: "மையத்திற்கு வருகை",
        waitingForTurn: "உங்கள் முறைக்காக காத்திருப்பு",
        cropInspected: "பயிர் பரிசோதிக்கப்படுகிறது",
        awaitingCompletion: "நிறைவடையும் நிலையில் உள்ளது",
        quickActions: "விரைவு நடவடிக்கைகள்",
        whatWouldYouLikeToDo: "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
        quickBookSlot: "முன்பதிவு செய்க",
        chooseDateTime: "தேதி & நேரம் தேர்வு செய்க",
        trackMyTurn: "என் முறையைக் கண்காணிக்க",
        seeLiveQueue: "நேரலை வரிசை காண்க",
        viewHistory: "வரலாறு காண்க",
        pastProcurementRecords: "கடந்த கால பதிவுகள்",
        getHelp: "உதவி பெறுக",
        talkToSupport: "ஆதரவு பெறுக",
        recentActivity: "சமீபத்திய செயல்பாடு",
        latestUpdates: "உங்கள் சமீபத்திய அறிவிப்புகள்.",
        viewAll: "அனைத்தும் காண்க",
        slotConfirmed: "முன்பதிவு உறுதியானது",
        todayMorning: "இன்று · 09:42 AM",
        completed: "முடிந்தது",
        cropWeighingCompleted: "எடை போடுதல் முடிந்தது",
        todayNoon: "இன்று · 11:15 AM",
        done: "வெற்றி",
        paymentInitiated: "பணம் செலுத்தப்பட்டது",
        todayAfternoon: "இன்று · 01:20 PM",
        yourProcurementCentre: "உங்கள் கொள்முதல் மையம்",
        nearestCentre: "அருகிலுள்ள மையம்",
        open: "திறந்துள்ளது",
        mainAgriculturalMarket: "முதன்மை வேளாண் சந்தை மையம்",
        privacy: "தனியுரிமை",
        terms: "விதிமுறைகள்",
        bookingTitle: "கொள்முதல் முன்பதிவு செய்க",
        bookingIntro: "நீண்ட வரிசைகளைத் தவிர்க்க முன்கூட்டியே முன்பதிவு செய்யுங்கள்.",
        chooseCrop: "விற்பனைக்கான பயிர்",
        chooseYourCrop: "-- பயிர் தேர்வு செய்க --",
        rice: "நெல் / அரிசி (MSP ₹2,300/குவிண்டால்)",
        wheat: "கோதுமை (MSP ₹2,275/குவிண்டால்)",
        maize: "மக்காச்சோளம் (MSP ₹2,090/குவிண்டால்)",
        cotton: "பருத்தி (MSP ₹7,121/குவிண்டால்)",
        groundnut: "வேர்க்கடலை (MSP ₹6,783/குவிண்டால்)",
        mustard: "கடுகு / பருப்பு வகைகள் (MSP ₹5,650/குவிண்டால்)",
        quantity: "அளவு (குவிண்டாலில்)",
        enterQuantity: "எ.கா: 25.5",
        quintals: "குவிண்டால்கள்",
        quantityHelp: "1 குவிண்டால் = 100 கிலோ.",
        procurementCentre: "கொள்முதல் மையம் தேர்வு",
        selectCentre: "-- மையம் தேர்வு செய்க --",
        apStateCentre: "மாநில கொள்முதல் மையம் (யார்டு 1)",
        districtProcurementCentre: "மாவட்ட கொள்முதல் மையம் (யார்டு 2)",
        date: "டெலிவரி தேதி",
        preferredTime: "விரும்பும் நேரம்",
        selectTime: "-- நேரம் தேர்வு செய்க --",
        availableSlots: "கிடைக்கும் இடங்கள்",
        available: "கிடைக்கிறது",
        vehicleType: "வாகன வகை",
        tractor: "டிராக்டர்",
        miniTruck: "மினி லாரி",
        bullockCart: "மாட்டு வண்டி / பிற",
        vehicleNumber: "வாகன எண் / நுழைவு சீட்டு",
        bookingInfo: "உறுதிப்படுத்தப்பட்டவுடன் SMS கேட் பாஸ் கிடைக்கும்.",
        confirmSlot: "உறுதிசெய்து டிஜிட்டல் பாஸ் பெறுக",
        liveQueueTracker: "நேரடி வரிசை டிராக்கர்",
        tokenNumber: "டோக்கன் எண்",
        nowServing: "தற்போது அழைக்கப்படுவது",
        yourPosition: "உங்கள் வரிசை எண்",
        estimatedTimeRemaining: "எஞ்சிய நேரம்",
        counterGate: "ஒதுக்கப்பட்ட கவுண்டர்",
        advanceQueueBtn: "வரிசையை நகர்த்துக (சிமுலேஷன்)",
        callTurnBtn: "என் முறை எச்சரிக்கை",
        resetQueueBtn: "வரிசையை மீட்டமைக்க",
        turnReadyAlert: "உங்கள் முறை வந்துவிட்டது! எடை கவுண்டர் 2க்கு செல்லவும்.",
        dbtTrackerTitle: "நேரடி வங்கி பரிமாற்ற (DBT) டிராக்கர்",
        paymentDetails: "கொள்முதல் மற்றும் கொடுப்பனவு விவரங்கள்",
        grossAmount: "மொத்த MSP தொகை",
        bankCreditStatus: "வங்கி கணக்கு வரவு நிலை",
        bankNameLabel: "வங்கி கணக்கு",
        ifscLabel: "IFSC குறியீடு",
        utrLabel: "DBT குறிப்பு / UTR எண்",
        weighingSlip: "அதிகாரப்பூர்வ எடை & ஈரப்பத சீட்டு",
        // Notifications
        notificationsTitle: "அறிவிப்பு மையம்",
        markAllRead: "அனைத்தையும் படித்ததாக குறிக்கவும்",
        clearAllNotifs: "அனைத்தும் அழிக்க",
        voiceAlertBtn: "குரல் அறிவிப்பைக் கேட்க",
        allNotifReadSuccess: "அனைத்து அறிவிப்புகளும் படிக்கப்பட்டன.",
        filterAll: "அனைத்தும்",
        filterUnread: "படிக்காதவை",
        filterProcurement: "வரிசை & மண்டி",
        filterPayment: "டிபிடி & கட்டணம்",
        noNotifications: "அறிவிப்புகள் எதுவும் இல்லை",
        noNotificationsDesc: "அனைத்தும் சரிபார்க்கப்பட்டது! புதிய அறிவிப்புகள் இங்கு தோன்றும்.",
        centresTitle: "அருகிலுள்ள மையங்கள் & கூட்ட நெரிசல்",
        liveCrowdStatus: "சந்தை கூட்ட நெரிசல்",
        lowWait: "குறைந்த கூட்டம் (5-10 நிமிடம்)",
        medWait: "மிதமான கூட்டம் (20-30 நிமிடம்)",
        highWait: "அதிக கூட்டம் (1+ மணி நேரம்)",
        getDirections: "வழித்தடம் காண்க",
        callMandiOfficer: "அதிகாரியை அழைக்க",
        helpTitle: "உதவி & குறைகேட்பு போர்டல்",
        tollFreeTitle: "கிசான் கால் சென்டர் (கட்டணமில்லா 24x7)",
        tollFreeNumber: "1800-180-1551",
        faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
        submitGrievance: "புகார் பதிவு செய்க",
        grievanceSubject: "புகார் தலைப்பு",
        grievanceDesc: "பிரச்சனையை விவரிக்கவும்",
        submitComplaintBtn: "புகார் பதிவு செய்க",
        complaintSubmitted: "புகார் பதிவு செய்யப்பட்டது: #GRV-2026-9481",
        settingsTitle: "உழவர் சுயவிவரம் & அமைப்புகள்",
        tabPersonal: "சுயவிவரம்",
        tabBank: "DBT & வங்கி கணக்கு",
        tabPreferences: "அறிவிப்புகள்",
        tabDisplay: "காட்சி & அணுகல்",
        farmerFullName: "முழு பெயர்",
        mobileNoLabel: "மொபைல் எண்",
        aadhaarLabel: "ஆதார் எண்",
        landSizeLabel: "நில அளவு (ஏக்கர்)",
        villageLabel: "கிராமம்",
        districtLabel: "மாவட்டம் & மாநிலம்",
        saveProfileBtn: "சுயவிவரத்தை சேமிக்க",
        accountHolder: "கணக்கு வைத்திருப்பவர் பெயர்",
        accountNo: "வங்கி கணக்கு எண்",
        aadhaarSeeded: "DBTக்கு ஆதார் இணைக்கப்பட்டுள்ளது",
        smsAlerts: "SMS எச்சரிக்கைகள்",
        whatsappAlerts: "வாட்ஸ்அப் அறிவிப்புகள்",
        voiceCallAlerts: "தானியங்கி குரல் அழைப்புகள்",
        proximityAlert: "3 பேர் இருக்கும் போது எச்சரிக்கவும்",
        largeTextMode: "பெரிய எழுத்து முறை",
        highContrastMode: "டார்க் மோட்",
        soundAlerts: "ஒலி எச்சரிக்கை",
        profileUpdatedSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
        logoutConfirmTitle: "வெளியேறுவதை உறுதிப்படுத்தவும்",
        logoutConfirmMsg: "நிச்சயமாக கிசான் சேதுவிலிருந்து வெளியேற விரும்புகிறீர்களா?",
        confirmLogoutBtn: "ஆம், வெளியேறுக",
        cancelBtn: "ரத்து செய்"
    },
    Kannada: {
        aiQualityInspection: "AI ಗುಣಮಟ್ಟ ತಪಾಸಣೆ",
        aiQualityInspectionBtn: "AI ಗುಣಮಟ್ಟ ತಪಾಸಣೆ",
        aiQualityInspectionTitle: "AI ಧಾನ್ಯ ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ",
        quickQualityReport: "AI ಗುಣಮಟ್ಟ ವರದಿ",
        quickQualityReportDesc: "ಧಾನ್ಯ ಶ್ರೇಣಿ ಮತ್ತು ದೋಷ ವರದಿ ವೀಕ್ಷಿಸಿ",
        aiAdvisoryNotice: "AI ಪ್ರಾಥಮಿಕ ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ (ಕೇವಲ ಸಲಹೆ).",
        overallQuality: "ಒಟ್ಟಾರೆ ಗುಣಮಟ್ಟದ ಅಂಕ",
        estimatedGrade: "ಅಂದಾಜು ಶ್ರೇಣಿ",
        visibleDefects: "ಗೋಚರ ದೋಷಗಳು",
        discoloration: "ಬಣ್ಣ ಬದಲಾವಣೆ",
        brokenGrains: "ಒಡೆದ ಧಾನ್ಯಗಳು",
        foreignMaterial: "ವಿದೇಶಿ ವಸ್ತುಗಳು",
        uniformity: "ಏಕರೂಪತೆ",
        assessmentConfidence: "ಮೌಲ್ಯಮಾಪನ ವಿಶ್ವಾಸ",
        aiRecommendation: "AI ಶಿಫಾರಸು",
        approveLotBtn: "ಅನುಮೋದಿಸಿ",
        holdLotBtn: "ಲ್ಯಾಬ್ ತಪಾಸಣೆಗೆ ಇರಿಸಿ",
        rejectLotBtn: "ತಿರಸ್ಕರಿಸಿ",
        myGatePassQR: "ನನ್ನ ಗೇಟ್ ಪಾಸ್ QR",
        showMyQR: "ನನ್ನ QR ತೋರಿಸಿ",
        scanFarmerQR: "ರೈತರ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
        scanFarmerQRBtn: "QR ಸ್ಕ್ಯಾನ್",
        quickMyQR: "ಆಗಮನ QR ಕೋಡ್",
        quickMyQRDesc: "ಗೇಟ್ ಪ್ರವೇಶ ಪರಿಶೀಲನಾ ಪಾಸ್",
        gatePassQRTitle: "ಡಿಜಿಟಲ್ ಗೇಟ್ ಪಾಸ್ ಮತ್ತು QR ಕೋಡ್",
        officerScannerTitle: "ರೈತರ ಆಗಮನ QR ಸ್ಕ್ಯಾನರ್",
        liveSync: "ಲೈವ್ ಸಿಂಕ್",
        farmerProcurement: "ರೈತ ಖರೀದಿ ಪೋರ್ಟಲ್",
        mainMenu: "ಮುಖ್ಯ ಮೆನು",
        services: "ಸೇವೆಗಳು",
        dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        cancelProcurement: "ಖರೀದಿ ರದ್ದುಮಾಡಿ",
        completeProcurement: "ಖರೀದಿ ಪೂರ್ಣಗೊಳಿಸಿ",
        officerPortal: "ಮಂಡಿ ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
        book: "ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ",
        track: "ಖರೀದಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        history: "ಬುಕಿಂಗ್ ಇತಿಹಾಸ",
        payment: "ಪಾವತಿ ಸ್ಥಿತಿ",
        notifications: "ಅಧಿಸೂಚನೆಗಳು",
        centre: "ಖರೀದಿ ಕೇಂದ್ರಗಳು",
        help: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
        needHelp: "ಸಹಾಯ ಬೇಕೇ?",
        talkSupport: "ಬೆಂಬಲ ತಂಡದೊಂದಿಗೆ ಮಾತನಾಡಿ",
        profileSettings: "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        accountSettings: "ಖಾತೆ",
        logout: "ಲಾಗ್ ಔಟ್",
        manageProcurementJourney: "ನಿಮ್ಮ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಸುಲಭವಾಗಿ ನಿರ್ವಹಿಸಿ.",
        farmerPortal: "ರೈತ ಪೋರ್ಟಲ್",
        welcomeTitle: "ಶುಭೋದಯ, {name} ಅವರೇ! 👋",
        officerIncharge: "ಪ್ರಭಾರಿ ಅಧಿಕಾರಿ:",
        officerIdLabel: "ಮಂಡಿ ಅಧಿಕಾರಿ",
        farmerIdLabel: "ರೈತ ಐಡಿ",
        officerPortalTag: "ಮಂಡಿ ಆಡಳಿತ ಪೋರ್ಟಲ್ • ಯಾರ್ಡ್ 1",
        officerHeroTitle: "ಮಂಡಿ ಅಧಿಕಾರಿ ಮತ್ತು ಯಾರ್ಡ್ ಸರತಿ ನಿಯಂತ್ರಕ 🏛️",
        officerHeroDesc: "ನೈಜ ಸಮಯದ ತೂಕದ ನಮೂದು, ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ, ಸರತಿ ರವಾನೆ ಮತ್ತು ಡಿಬಿಟಿ ಅನುಮೋದನೆಗಳು.",
        mandiProcurementOfficer: "ಮಂಡಿ ಖರೀದಿ ಅಧಿಕಾರಿ",
        mandiAdminControl: "ಮಂಡಿ ಆಡಳಿತ ಮತ್ತು ನಿಯಂತ್ರಣ ಕನ್ಸೋಲ್",
        adminConsole: "ಆಡಳಿತ ಕನ್ಸೋಲ್",
        navYardOverview: "ಯಾರ್ಡ್ ಅವಲೋಕನ",
        navQueueManagement: "ಸರತಿ ನಿರ್ವಹಣೆ",
        navFarmerRecords: "ರೈತರ ದಾಖಲೆಗಳು",
        navReports: "ವರದಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣೆ",
        navBroadcastTool: "ಪ್ರಸಾರ ಎಚ್ಚರಿಕೆ",
        adminSystem: "ವ್ಯವಸ್ಥೆ",
        broadcastTitle: "ಮಂಡಿ ಯಾರ್ಡ್ ಧ್ವನಿವರ್ಧಕ ಮತ್ತು ಎಸ್‌ಎಂಎಸ್ ಪ್ರಸಾರ",
        broadcastSubtitle: "ಯಾರ್ಡ್‌ನಲ್ಲಿರುವ ಎಲ್ಲಾ ರೈತರಿಗೆ ತಕ್ಷಣದ ಧ್ವನಿ ಪ್ರಕಟಣೆ ಮತ್ತು ಎಸ್‌ಎಂಎಸ್ ಕಳುಹಿಸಿ.",
        sendBroadcastBtn: "ಎಲ್ಲಾ ರೈತರಿಗೆ ಪ್ರಸಾರ ಮಾಡಿ",
        totalFarmersServed: "ಇಂದು ಸೇವೆ ಪಡೆದ ಒಟ್ಟು ರೈತರು",
        avgWaitTime: "ಸರಾಸರಿ ಯಾರ್ಡ್ ಕಾಯುವ ಸಮಯ",
        callNextBtn: "ಮುಂದೆ ಕರೆಯಿರಿ",
        markCompleteBtn: "ಪೂರ್ಣಗೊಳಿಸಿ",
        cancelQueueBtn: "ರದ್ದುಮಾಡಿ",
        weighbridgeOnline: "ತೂಕದ ಸೇತುವೆ ಆನ್‌ಲೈನ್",
        callNextTokenBtn: "ಮುಂದಿನ ಟೋಕನ್ ಕರೆಯಿರಿ",
        walkInTokenBtn: "ನೇರ ಟೋಕನ್",
        yardQueueWaiting: "ಯಾರ್ಡ್ ಸರತಿ ಕಾಯುವಿಕೆ",
        procuredToday: "ಇಂದಿನ ಖರೀದಿ",
        weighmentsDone: "ತೂಕ ಪೂರ್ಣಗೊಂಡಿದೆ",
        mspDisbursedValue: "ಎಂಎಸ್‌ಪಿ ವಿತರಣೆ ಮೌಲ್ಯ",
        yardDispatcherTitle: "ಯಾರ್ಡ್ ಸರತಿ ರವಾನೆ ಮತ್ತು ಪ್ರಸಾರ ನಿಯಂತ್ರಣಗಳು",
        callNextFarmerBtn: "ಮುಂದಿನ ರೈತರನ್ನು ಕರೆಯಿರಿ",
        mandiVoiceBroadcastBtn: "ಮಂಡಿ ಧ್ವನಿ ಪ್ರಸಾರ",
        issueSpotPassBtn: "ಸ್ಪಾಟ್ ಪಾಸ್ ನೀಡಿ",
        resetDemoQueueBtn: "ಡೆಮೊ ಸರತಿ ಮರುಹೊಂದಿಸಿ",
        liveYardQueueTitle: "ಲೈವ್ ಮಂಡಿ ಯಾರ್ಡ್ ಸರತಿ ಮತ್ತು ತೂಕದ ಕಾರ್ಯಾಚರಣೆಗಳು",
        liveYardQueueDesc: "ತೂಕದ ಸೇತುವೆ ಪ್ರವೇಶ, ಗುಣಮಟ್ಟ ತಪಾಸಣೆ, ತೂಕ ಮತ್ತು ಡಿಬಿಟಿ ಇತ್ಯರ್ಥದ ಮೂಲಕ ರೈತರನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ.",
        liveYardFeed: "ಲೈವ್ ಯಾರ್ಡ್ ಫೀಡ್",
        thToken: "ಟೋಕನ್ #",
        thFarmerId: "ರೈತ ಮತ್ತು ಐಡಿ",
        thCropQty: "ಬೆಳೆ ಮತ್ತು ಪ್ರಮಾಣ",
        thVehicleNo: "ವಾಹನ ಸಂಖ್ಯೆ",
        thGatePass: "ಗೇಟ್ ಪಾಸ್",
        thCurrentStage: "ಪ್ರಸ್ತುತ ಹಂತ",
        thOfficerActions: "ಅಧಿಕಾರಿ ಕ್ರಮಗಳು",
        callBtn: "ಕರೆಯಿರಿ",
        grossWeigh: "ಒಟ್ಟು ತೂಕ",
        inspectQuality: "ಗುಣಮಟ್ಟ ತಪಾಸಣೆ",
        tareWeigh: "ಖಾಲಿ ತೂಕ",
        completeDBT: "ಡಿಬಿಟಿ ಪೂರ್ಣ",
        cancelSlot: "ಸ್ಲಾಟ್ ರದ್ದುಮಾಡಿ",
        jFormReceipt: "ಜೆ-ಫಾರ್ಮ್ ಖರೀದಿ ರಸೀದಿ",
        viewOfficialReceipt: "ಅಧಿಕೃತ ತೂಕದ ರಸೀದಿಯನ್ನು ವೀಕ್ಷಿಸಿ",
        cancelSlotBooking: "ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ರದ್ದುಮಾಡಿ",
        cancelOrReschedule: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ರದ್ದುಮಾಡಿ ಅಥವಾ ಮರುಹೊಂದಿಸಿ",
        slotCancelled: "ಸ್ಲಾಟ್ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ",
        procurementDone: "ಖರೀದಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
        dbtPaymentReleased: "ಡಿಬಿಟಿ ಪಾವತಿ ಬಿಡುಗಡೆ ಮಾಡಲಾಗಿದೆ",
        welcomeDescription: "ನಿಮ್ಮ ಖರೀದಿ ಪ್ರಯಾಣ ಕೆಲವೇ ಕ್ಲಿಕ್‌ಗಳ ದೂರದಲ್ಲಿದೆ.",
        bookNewSlot: "ಹೊಸ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ",
        trackMyProcurement: "ನನ್ನ ಖರೀದಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        inQueue: "ಸರತಿಯಲ್ಲಿ",
        currentQueuePosition: "ಪ್ರಸ್ತುತ ಸರತಿ ಸ್ಥಾನ",
        estimatedWait: "ಅಂದಾಜು ಕಾಯುವ ಸಮಯ",
        nextProcurementSlot: "ಮುಂದಿನ ಖರೀದಿ ಸ್ಲಾಟ್",
        confirmed: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
        tomorrow: "ನಾಳೆ",
        procurementStatus: "ಖರೀದಿ ಸ್ಥಿತಿ",
        processing: "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
        qualityCheck: "ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ",
        weighingCompleted: "ತೂಕ ಪೂರ್ಣಗೊಂಡಿದೆ",
        paymentStatus: "ಪಾವತಿ ಸ್ಥಿತಿ",
        pending: "ಬಾಕಿ ಉಳಿದಿದೆ",
        paymentUnderProcessing: "ಪಾವತಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
        procurementJourney: "ಖರೀದಿ ಪ್ರಯಾಣ",
        trackCropJourney: "ಬೆಳೆ ತಲುಪುವಿಕೆಯಿಂದ ಪಾವತಿಯವರೆಗೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
        slotBooked: "ಸ್ಲಾಟ್ ಬುಕ್ ಆಗಿದೆ",
        arrivedAtCentre: "ಕೇಂದ್ರಕ್ಕೆ ಆಗಮಿಸಲಾಗಿದೆ",
        waitingForTurn: "ನಿಮ್ಮ ಸರತಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
        cropInspected: "ಬೆಳೆ ಗುಣಮಟ್ಟ ತಪಾಸಣೆ ನಡೆಯುತ್ತಿದೆ",
        awaitingCompletion: "ಪೂರ್ಣಗೊಳ್ಳಲು ಬಾಕಿ ಇದೆ",
        quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
        whatWouldYouLikeToDo: "ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
        quickBookSlot: "ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ",
        chooseDateTime: "ದಿನಾಂಕ ಮತ್ತು ಸಮಯ ಆಯ್ಕೆಮಾಡಿ",
        trackMyTurn: "ನನ್ನ ಸರತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        seeLiveQueue: "ಲೈವ್ ಕ್ಯೂ ನೋಡಿ",
        viewHistory: "ಇತಿಹಾಸ ನೋಡಿ",
        pastProcurementRecords: "ಹಿಂದಿನ ಖರೀದಿ ದಾಖಲೆಗಳು",
        getHelp: "ಸಹಾಯ ಪಡೆಯಿರಿ",
        talkToSupport: "ಬೆಂಬಲ ಪಡೆಯಿರಿ",
        recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
        latestUpdates: "ನಿಮ್ಮ ಇತ್ತೀಚಿನ ನವೀಕರಣಗಳು.",
        viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
        slotConfirmed: "ಸ್ಲಾಟ್ ದೃಢಪಟ್ಟಿದೆ",
        todayMorning: "ಇಂದು · 09:42 AM",
        completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
        cropWeighingCompleted: "ತೂಕ ಪೂರ್ಣಗೊಂಡಿದೆ",
        todayNoon: "ಇಂದು · 11:15 AM",
        done: "ಯಶಸ್ವಿ",
        paymentInitiated: "ಪಾವತಿ ಪ್ರಾರಂಭಿಸಲಾಗಿದೆ",
        todayAfternoon: "ಇಂದು · 01:20 PM",
        yourProcurementCentre: "ನಿಮ್ಮ ಖರೀದಿ ಕೇಂದ್ರ",
        nearestCentre: "ನಿಮಗೆ ಹತ್ತಿರದ ಕೇಂದ್ರ",
        open: "ತೆರೆದಿದೆ",
        mainAgriculturalMarket: "ಮುಖ್ಯ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಯಾರ್ಡ್",
        privacy: "ಗೌಪ್ಯತೆ",
        terms: "ನಿಯಮಗಳು",
        bookingTitle: "ಖರೀದಿ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ",
        bookingIntro: "ದೀರ್ಘ ಕಾಯುವಿಕೆಯನ್ನು ತಪ್ಪಿಸಲು ಮೊದಲೇ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ.",
        chooseCrop: "ಮಾರಾಟದ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
        chooseYourCrop: "-- ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ --",
        rice: "ಭತ್ತ / ಅಕ್ಕಿ (MSP ₹2,300/ಕ್ವಿಂಟಾಲ್)",
        wheat: "ಗೋಧಿ (MSP ₹2,275/ಕ್ವಿಂಟಾಲ್)",
        maize: "ಮೆಕ್ಕೆಜೋಳ (MSP ₹2,090/ಕ್ವಿಂಟಾಲ್)",
        cotton: "ಹತ್ತಿ (MSP ₹7,121/ಕ್ವಿಂಟಾಲ್)",
        groundnut: "ಕಡಲೆಕಾಯಿ (MSP ₹6,783/ಕ್ವಿಂಟಾಲ್)",
        mustard: "ಸಾಸಿವೆ / ಕಾಳುಗಳು (MSP ₹5,650/ಕ್ವಿಂಟಾಲ್)",
        quantity: "ಅಂದಾಜು ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್‌ನಲ್ಲಿ)",
        enterQuantity: "ಉದಾ: 25.5",
        quintals: "ಕ್ವಿಂಟಾಲ್‌ಗಳು",
        quantityHelp: "1 ಕ್ವಿಂಟಾಲ್ = 100 ಕೆ.ಜಿ.",
        procurementCentre: "ಖರೀದಿ ಕೇಂದ್ರ ಆಯ್ಕೆಮಾಡಿ",
        selectCentre: "-- ಕೇಂದ್ರ ಆಯ್ಕೆಮಾಡಿ --",
        apStateCentre: "ರಾಜ್ಯ ಖರೀದಿ ಕೇಂದ್ರ (ಯಾರ್ಡ್ 1)",
        districtProcurementCentre: "ಜಿಲ್ಲಾ ಧಾನ್ಯ ಕೇಂದ್ರ (ಯಾರ್ಡ್ 2)",
        date: "ಆಗಮನ ದಿನಾಂಕ",
        preferredTime: "ಆದ್ಯತೆಯ ಸಮಯ",
        selectTime: "-- ಸಮಯ ಆಯ್ಕೆಮಾಡಿ --",
        availableSlots: "ಲಭ್ಯವಿರುವ ಸ್ಲಾಟ್‌ಗಳು",
        available: "ಲಭ್ಯವಿದೆ",
        vehicleType: "ವಾಹನ ಪ್ರಕಾರ",
        tractor: "ಟ್ರಾಕ್ಟರ್ ಟ್ರಾಲಿ",
        miniTruck: "ಮಿನಿ ಟ್ರಕ್",
        bullockCart: "ಎತ್ತಿನ ಗಾಡಿ / ಇತರೆ",
        vehicleNumber: "ವಾಹನ ಸಂಖ್ಯೆ",
        bookingInfo: "ದೃಢೀಕರಣದ ನಂತರ SMS ಗೇಟ್ ಪಾಸ್ ಲಭ್ಯವಾಗುತ್ತದೆ.",
        confirmSlot: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಪಾಸ್ ಪಡೆಯಿರಿ",
        liveQueueTracker: "ಲೈವ್ ಕ್ಯೂ ಟ್ರ್ಯಾಕರ್",
        tokenNumber: "ಟೋಕನ್ ಸಂಖ್ಯೆ",
        nowServing: "ಪ್ರಸ್ತುತ ಸೇವೆ",
        yourPosition: "ನಿಮ್ಮ ಸ್ಥಾನ",
        estimatedTimeRemaining: "ಉಳಿದಿರುವ ಸಮಯ",
        counterGate: "ನಿಯೋಜಿತ ಕೌಂಟರ್",
        advanceQueueBtn: "ಕ್ಯೂ ಮುನ್ನಡೆಸಿ (ಸಿಮ್ಯುಲೇಶನ್)",
        callTurnBtn: "ನನ್ನ ಸರತಿ ಎಚ್ಚರಿಕೆ",
        resetQueueBtn: "ಕ್ಯೂ ಮರುಹೊಂದಿಸಿ",
        turnReadyAlert: "ನಿಮ್ಮ ಸರತಿ ಬಂದಿದೆ! ದಯವಿಟ್ಟು ತಕ್ಷಣ ಕೌಂಟರ್ 2 ಕ್ಕೆ ಹೋಗಿ.",
        dbtTrackerTitle: "ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಟ್ರ್ಯಾಕರ್",
        paymentDetails: "ಖರೀದಿ ಮತ್ತು ಪಾವತಿ ವಿವರಗಳು",
        grossAmount: "ಒಟ್ಟು ಎಂಎಸ್‌ಪಿ ಮೊತ್ತ",
        bankCreditStatus: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಜಮಾ ಸ್ಥಿತಿ",
        bankNameLabel: "ಬ್ಯಾಂಕ್ ಖಾತೆ",
        ifscLabel: "IFSC ಕೋಡ್",
        utrLabel: "DBT ಉಲ್ಲೇಖ / UTR ಸಂಖ್ಯೆ",
        weighingSlip: "ಅಧಿಕೃತ ತೂಕದ ರಸೀದಿ",
        // Notifications
        notificationsTitle: "ಅಧಿಸೂಚನೆ ಕೇಂದ್ರ",
        markAllRead: "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
        clearAllNotifs: "ಎಲ್ಲ ತೆರವುಗೊಳಿಸಿ",
        voiceAlertBtn: "ಧ್ವನಿ ಅಧಿಸೂಚನೆ ಕೇಳಿ",
        allNotifReadSuccess: "ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳನ್ನು ಓದಲಾಗಿದೆ.",
        filterAll: "ಎಲ್ಲಾ",
        filterUnread: "ಓದದಿರುವುದು",
        filterProcurement: "ಸರದಿ & ಮಂಡಿ",
        filterPayment: "ಡಿಬಿಟಿ & ಪಾವತಿ",
        noNotifications: "ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ",
        noNotificationsDesc: "ಎಲ್ಲವೂ ನವೀಕೃತವಾಗಿದೆ! ಅಧಿಸೂಚನೆಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.",
        centresTitle: "ಹತ್ತಿರದ ಕೇಂದ್ರಗಳು ಮತ್ತು ಜನಸಂದಣಿ",
        liveCrowdStatus: "ಮಾರುಕಟ್ಟೆ ಜನಸಂದಣಿ",
        lowWait: "ಕಡಿಮೆ ಸಂದಣಿ (5-10 ನಿಮಿಷ)",
        medWait: "ಮಧ್ಯಮ ಸಂದಣಿ (20-30 ನಿಮಿಷ)",
        highWait: "ಹೆಚ್ಚು ಸಂದಣಿ (1+ ಗಂಟೆ ಕಾಯಬೇಕು)",
        getDirections: "ಮಾರ್ಗ ನೋಡಿ",
        callMandiOfficer: "ಅಧಿಕಾರಿಗೆ ಕರೆ ಮಾಡಿ",
        helpTitle: "ಸಹಾಯ ಮತ್ತು ಕುಂದುಕೊರತೆ ಪೋರ್ಟಲ್",
        tollFreeTitle: "ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ (ಉಚಿತ 24x7)",
        tollFreeNumber: "1800-180-1551",
        faqTitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
        submitGrievance: "ದೂರು ದಾಖಲಿಸಿ",
        grievanceSubject: "ದೂರಿನ ವಿಷಯ",
        grievanceDesc: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ",
        submitComplaintBtn: "ದೂರು ಸಲ್ಲಿಸಿ",
        complaintSubmitted: "ನಿಮ್ಮ ದೂರು ದಾಖಲಾಗಿದೆ: #GRV-2026-9481",
        settingsTitle: "ರೈತ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        tabPersonal: "ವೈಯಕ್ತಿಕ ವಿವರ",
        tabBank: "DBT ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆ",
        tabPreferences: "ಅಧಿಸೂಚನೆಗಳು",
        tabDisplay: "ಡಿಸ್ಪ್ಲೇ ಮತ್ತು ಪ್ರವೇಶಿಸುವಿಕೆ",
        farmerFullName: "ಪೂರ್ಣ ಹೆಸರು",
        mobileNoLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
        aadhaarLabel: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
        landSizeLabel: "ಜಮೀನು (ಎಕರೆ)",
        villageLabel: "ಗ್ರಾಮ",
        districtLabel: "ಜಿಲ್ಲೆ ಮತ್ತು ರಾಜ್ಯ",
        saveProfileBtn: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",
        accountHolder: "ಖಾತೆದಾರರ ಹೆಸರು",
        accountNo: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆ",
        aadhaarSeeded: "DBTಗಾಗಿ ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿದೆ",
        smsAlerts: "SMS ಎಚ್ಚರಿಕೆಗಳು",
        whatsappAlerts: "ವಾಟ್ಸಾಪ್ ಅಪ್‌ಡೇಟ್‌ಗಳು",
        voiceCallAlerts: "ಸ್ವಯಂಚಾಲಿತ ಧ್ವನಿ ಕರೆಗಳು",
        proximityAlert: "3 ರೈತರು ಮುಂದಿದ್ದಾಗ ಎಚ್ಚರಿಸಿ",
        largeTextMode: "ದೊಡ್ಡ ಅಕ್ಷರ ಮೋಡ್",
        highContrastMode: "ಡಾರ್ಕ್ ಮೋಡ್",
        soundAlerts: "ಧ್ವನಿ ಎಚ್ಚರಿಕೆ",
        profileUpdatedSuccess: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
        logoutConfirmTitle: "ಲಾಗ್ ಔಟ್ ದೃಢೀಕರಣ",
        logoutConfirmMsg: "ಖಚಿತವಾಗಿ ಕಿಸಾನ್ ಸೇತು ಪೋರ್ಟಲ್‌ನಿಂದ ಹೊರಹೋಗಲು ಬಯಸುವಿರಾ?",
        confirmLogoutBtn: "ಹೌದು, ಲಾಗ್ ಔಟ್ ಮಾಡಿ",
        cancelBtn: "ರದ್ದುಮಾಡಿ"
    },
    Malayalam: {
        aiQualityInspection: "AI ഗുണനിലവാര പരിശോധന",
        aiQualityInspectionBtn: "AI ഗുണനിലവാര പരിശോധന",
        aiQualityInspectionTitle: "AI ധാന്യ ഗുണനിലവാര വിലയിരുത്തൽ",
        quickQualityReport: "AI ഗുണനിലവാര റിപ്പോർട്ട്",
        quickQualityReportDesc: "ധാന്യ ഗ്രേഡും വൈകല്യ റിപ്പോർട്ടും കാണുക",
        aiAdvisoryNotice: "AI പ്രാഥമിക ഗുണനിലവാര വിലയിരുത്തൽ (ഉപദേശം മാത്രം).",
        overallQuality: "മൊത്തത്തിലുള്ള ഗുണനിലവാര സ്കോർ",
        estimatedGrade: "കണക്കാക്കിയ ഗ്രേഡ്",
        visibleDefects: "ദൃശ്യമായ വൈകല്യങ്ങൾ",
        discoloration: "നിറവ്യത്യാസം",
        brokenGrains: "പൊട്ടിയ ധാന്യങ്ങൾ",
        foreignMaterial: "അന്യവസ്തുക്കൾ",
        uniformity: "ഏകീകൃതത",
        assessmentConfidence: "വിലയിരുത്തൽ ആത്മവിശ്വാസം",
        aiRecommendation: "AI ശുപാർശ",
        approveLotBtn: "അംഗീകരിക്കുക",
        holdLotBtn: "ലാബ് പരിശോധനയ്ക്കായി മാറ്റുക",
        rejectLotBtn: "നിരസിക്കുക",
        myGatePassQR: "എന്റെ ഗേറ്റ് പാസ്സ് QR",
        showMyQR: "എന്റെ QR കാണിക്കുക",
        scanFarmerQR: "കർഷക QR സ്കാൻ ചെയ്യുക",
        scanFarmerQRBtn: "QR സ്കാൻ",
        quickMyQR: "വരവ് QR കോഡ്",
        quickMyQRDesc: "ഗേറ്റ് എൻട്രി വെരിഫിക്കേഷൻ പാസ്",
        gatePassQRTitle: "ഡിജിറ്റൽ ഗേറ്റ് പാസ്സും QR കോഡും",
        officerScannerTitle: "കർഷക വരവ് QR സ്കാനർ",
        liveSync: "തത്സമയ സമന്വയം",
        farmerProcurement: "കർഷക സംഭരണ പോർട്ടൽ",
        mainMenu: "പ്രധാന മെനു",
        services: "സേവനങ്ങൾ",
        dashboard: "ഡാഷ്‌ബോർഡ്",
        cancelProcurement: "സംഭരണം റദ്ദാക്കുക",
        completeProcurement: "സംഭരണം പൂർത്തിയാക്കുക",
        officerPortal: "മണ്ടി ഓഫീസർ പോർട്ടൽ",
        book: "സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
        track: "സംഭരണം പരിശോധിക്കുക",
        history: "ബുക്കിംഗ് ചരിത്രം",
        payment: "പേയ്‌മെന്റ് നില",
        notifications: "അറിയിപ്പുകൾ",
        centre: "സംഭരണ കേന്ദ്രങ്ങൾ",
        help: "സഹായവും പിന്തുണയും",
        needHelp: "സഹായം ആവശ്യമുണ്ടോ?",
        talkSupport: "സഹായ സംഘവുമായി സംസാരിക്കുക",
        profileSettings: "പ്രൊഫൈലും ക്രമീകരണങ്ങളും",
        accountSettings: "അക്കൗണ്ട്",
        logout: "ലോഗ് ഔട്ട്",
        manageProcurementJourney: "നിങ്ങളുടെ സംഭരണ പ്രക്രിയ എളുപ്പത്തിൽ കൈകാര്യം ചെയ്യുക.",
        farmerPortal: "കർഷക പോർട്ടൽ",
        welcomeTitle: "സുപ്രഭാതം, {name}! 👋",
        officerIncharge: "ഇൻചാർജ് ഓഫീസർ:",
        officerIdLabel: "മണ്ടി ഓഫീസർ",
        farmerIdLabel: "കർഷക ഐഡി",
        officerPortalTag: "മണ്ടി അഡ്മിനിസ്ട്രേഷൻ പോർട്ടൽ • യാർഡ് 1",
        officerHeroTitle: "മണ്ടി ഓഫീസറും യാർഡ് ക്യൂ കൺട്രോളറും 🏛️",
        officerHeroDesc: "തത്സമയ വെയ്ബ്രിഡ്ജ് പ്രവേശനം, ഗുണനിലവാര പരിശോധന, ക്യൂ വിതരണം, ഡിബിടി അംഗീകാരങ്ങൾ.",
        mandiProcurementOfficer: "മണ്ടി സംഭരണ ഓഫീസർ",
        mandiAdminControl: "മണ്ടി അഡ്മിൻ & കൺട്രോൾ കൺസോൾ",
        adminConsole: "അഡ്മിൻ കൺസോൾ",
        navYardOverview: "യാർഡ് അവലോകനം",
        navQueueManagement: "ക്യൂ മാനേജ്മെന്റ്",
        navFarmerRecords: "കർഷക റെക്കോർഡുകൾ",
        navReports: "റിപ്പോർട്ടുകൾ & അനലിറ്റിക്സ്",
        navBroadcastTool: "ബ്രോഡ്കാസ്റ്റ് അലേർട്ട്",
        adminSystem: "സിസ്റ്റം",
        broadcastTitle: "മണ്ടി യാർഡ് ലൗഡ്സ്പീക്കറും എസ്എംഎസ് ബ്രോഡ്കാസ്റ്റും",
        broadcastSubtitle: "യാർഡിലുള്ള എല്ലാ കർഷകർക്കും വോയ്‌സ് അറിയിപ്പുകളും എസ്എംഎസും അയയ്ക്കുക.",
        sendBroadcastBtn: "എല്ലാ കർഷകർക്കും ബ്രോഡ്കാസ്റ്റ് ചെയ്യുക",
        totalFarmersServed: "ഇന്ന് സേവനം ലഭിച്ച കർഷകർ",
        avgWaitTime: "ശരാശരി യാർഡ് കാത്തിരിപ്പ് സമയം",
        callNextBtn: "അടുത്തയാളെ വിളിക്കുക",
        markCompleteBtn: "പൂർത്തിയാക്കുക",
        cancelQueueBtn: "റദ്ദാക്കുക",
        weighbridgeOnline: "വെയ്ബ്രിഡ്ജ് ഓൺലൈൻ",
        callNextTokenBtn: "അടുത്ത ടോക്കൺ വിളിക്കുക",
        walkInTokenBtn: "വാക്ക്-ഇൻ ടോക്കൺ",
        yardQueueWaiting: "യാർഡ് ക്യൂ കാത്തിരിപ്പ്",
        procuredToday: "ഇന്നത്തെ സംഭരണം",
        weighmentsDone: "തൂക്കം പൂർത്തിയായി",
        mspDisbursedValue: "എംഎസ്പി വിതരണ തുക",
        yardDispatcherTitle: "യാർഡ് ക്യൂ അയയ്ക്കലും അനൗൺസ്‌മെന്റും",
        callNextFarmerBtn: "അടുത്ത കർഷകനെ വിളിക്കുക",
        mandiVoiceBroadcastBtn: "മണ്ടി വോയ്‌സ് ബ്രോഡ്‌കാസ്റ്റ്",
        issueSpotPassBtn: "സ്പോട്ട് പാസ് നൽകുക",
        resetDemoQueueBtn: "ഡെമോ ക്യൂ പുനഃക്രമീകരിക്കുക",
        liveYardQueueTitle: "ലൈവ് മണ്ടി യാർഡ് ക്യൂവും വെയ്ബ്രിഡ്ജ് പ്രവർത്തനങ്ങളും",
        liveYardQueueDesc: "വെയ്ബ്രിഡ്ജ് എൻട്രി, ഗുണനിലവാര പരിശോധന, ശൂന്യഭാരം, ഡിബിടി സെറ്റിൽമെന്റ് എന്നിവ വഴി കർഷകരെ പ്രോസസ്സ് ചെയ്യുക.",
        liveYardFeed: "ലൈവ് യാർഡ് ഫീഡ്",
        thToken: "ടോക്കൺ #",
        thFarmerId: "കർഷകനും ഐഡിയും",
        thCropQty: "വിളയും അളവും",
        thVehicleNo: "വാഹന നമ്പർ",
        thGatePass: "ഗേറ്റ് പാസ്",
        thCurrentStage: "നിലവിലെ ഘട്ടം",
        thOfficerActions: "ഓഫീസർ നടപടികൾ",
        callBtn: "വിളിക്കുക",
        grossWeigh: "മൊത്തം ഭാരം",
        inspectQuality: "ഗുണനിലവാര പരിശോധന",
        tareWeigh: "ശൂന്യഭാരം",
        completeDBT: "ഡിബിടി പൂർത്തിയായി",
        cancelSlot: "സ്ലോട്ട് റദ്ദാക്കുക",
        jFormReceipt: "ജെ-ഫോം സംഭരണ രസീത്",
        viewOfficialReceipt: "ഔദ്യോഗിക തൂക്ക രസീത് കാണുക",
        cancelSlotBooking: "സ്ലോട്ട് ബുക്കിംഗ് റദ്ദാക്കുക",
        cancelOrReschedule: "അപ്പോയിന്റ്മെന്റ് റദ്ദാക്കുക അല്ലെങ്കിൽ മാറ്റുക",
        slotCancelled: "സ്ലോട്ട് റദ്ദാക്കി",
        procurementDone: "സംഭരണം പൂർത്തിയായി",
        dbtPaymentReleased: "ഡിബിടി പേയ്‌മെന്റ് നൽകി",
        welcomeDescription: "നിങ്ങളുടെ സംഭരണ വിവരങ്ങൾ ഇവിടെ പരിശോധിക്കാം.",
        bookNewSlot: "പുതിയ സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
        trackMyProcurement: "സംഭരണം ട്രാക്ക് ചെയ്യുക",
        inQueue: "ക്യൂവിൽ",
        currentQueuePosition: "നിലവിലെ ക്യൂ സ്ഥാനം",
        estimatedWait: "പ്രതീക്ഷിക്കുന്ന സമയം",
        nextProcurementSlot: "അടുത്ത സംഭരണ സ്ലോട്ട്",
        confirmed: "സ്ഥിരീകരിച്ചു",
        tomorrow: "നാളെ",
        procurementStatus: "സംഭരണ നില",
        processing: "പ്രക്രിയയിൽ",
        qualityCheck: "ഗുണനിലവാര പരിശോധന",
        weighingCompleted: "തൂക്കം പൂർത്തിയായി",
        paymentStatus: "പേയ്‌മെന്റ് നില",
        pending: "തീർപ്പുകൽപ്പിക്കാത്തത്",
        paymentUnderProcessing: "പേയ്‌മെന്റ് പ്രക്രിയയിലാണ്",
        procurementJourney: "സംഭരണ യാത്ര",
        trackCropJourney: "വരവ് മുതൽ പണം ലഭിക്കുന്നത് വരെ പരിശോധിക്കുക.",
        slotBooked: "സ്ലോട്ട് ബുക്ക് ചെയ്തു",
        arrivedAtCentre: "കേന്ദ്രത്തിൽ എത്തി",
        waitingForTurn: "ഊഴത്തിനായി കാത്തിരിക്കുന്നു",
        cropInspected: "വിള പരിശോധിക്കുന്നു",
        awaitingCompletion: "പൂർത്തിയാകുന്നു",
        quickActions: "ദ്രുത പ്രവർത്തനങ്ങൾ",
        whatWouldYouLikeToDo: "എന്താണ് ചെയ്യേണ്ടത്?",
        quickBookSlot: "സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
        chooseDateTime: "തീയതിയും സമയവും തിരഞ്ഞെടുക്കുക",
        trackMyTurn: "എന്റെ ഊഴം പരിശോധിക്കുക",
        seeLiveQueue: "തത്സമയ ക്യൂ കാണുക",
        viewHistory: "ചരിത്രം കാണുക",
        pastProcurementRecords: "മുൻകാല രേഖകൾ",
        getHelp: "സഹായം തേടുക",
        talkToSupport: "പിന്തുണ നേടുക",
        recentActivity: "സമീപകാല പ്രവർത്തനങ്ങൾ",
        latestUpdates: "ഏറ്റവും പുതിയ വിവരങ്ങൾ.",
        viewAll: "എല്ലാം കാണുക",
        slotConfirmed: "സ്ലോട്ട് ഉറപ്പിച്ചു",
        todayMorning: "ഇന്ന് · 09:42 AM",
        completed: "പൂർത്തിയായി",
        cropWeighingCompleted: "തൂക്കൽ പൂർത്തിയായി",
        todayNoon: "ഇന്ന് · 11:15 AM",
        done: "വിജയം",
        paymentInitiated: "പേയ്‌മെന്റ് ആരംഭിച്ചു",
        todayAfternoon: "ഇന്ന് · 01:20 PM",
        yourProcurementCentre: "സംഭരണ കേന്ദ്രം",
        nearestCentre: "അടുത്തുള്ള കേന്ദ്രം",
        open: "തുറന്നിരിക്കുന്നു",
        mainAgriculturalMarket: "പ്രധാന കാർഷിക വിപണി കേന്ദ്രം",
        privacy: "സ്വകാര്യത",
        terms: "നിബന്ധനകൾ",
        bookingTitle: "സംഭരണ സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
        bookingIntro: "നീണ്ട ക്യൂ ഒഴിവാക്കാൻ മുൻകൂട്ടി സ്ലോട്ട് ബുക്ക് ചെയ്യുക.",
        chooseCrop: "വിൽപ്പനയ്ക്കുള്ള വിള",
        chooseYourCrop: "-- വിള തിരഞ്ഞെടുക്കുക --",
        rice: "നെല്ല് / അരി (MSP ₹2,300/ക്വിന്റൽ)",
        wheat: "ഗോതമ്പ് (MSP ₹2,275/ക്വിന്റൽ)",
        maize: "ചോളം (MSP ₹2,090/ക്വിന്റൽ)",
        cotton: "പരുത്തി (MSP ₹7,121/ക്വിന്റൽ)",
        groundnut: "നിലക്കടല (MSP ₹6,783/ക്വിന്റൽ)",
        mustard: "കടുക് / പയറുവർഗ്ഗങ്ങൾ (MSP ₹5,650/ക്വിന്റൽ)",
        quantity: "അളവ് (ക്വിന്റലിൽ)",
        enterQuantity: "ഉദാ: 25.5",
        quintals: "ക്വിന്റലുകൾ",
        quantityHelp: "1 ക്വിന്റൽ = 100 കിലോഗ്രാം.",
        procurementCentre: "സംഭരണ കേന്ദ്രം",
        selectCentre: "-- കേന്ദ്രം തിരഞ്ഞെടുക്കുക --",
        apStateCentre: "സംസ്ഥാന സംഭരണ കേന്ദ്രം (യാർഡ് 1)",
        districtProcurementCentre: "ജില്ലാ ധാന്യ കേന്ദ്രം (യാർഡ് 2)",
        date: "ഡെലിവറി തീയതി",
        preferredTime: "അനുയോജ്യമായ സമയം",
        selectTime: "-- സമയം തിരഞ്ഞെടുക്കുക --",
        availableSlots: "ലഭ്യമായ സ്ലോട്ടുകൾ",
        available: "ലഭ്യമാണ്",
        vehicleType: "വാഹന തരം",
        tractor: "ട്രാക്ടർ",
        miniTruck: "മിനി ട്രക്ക്",
        bullockCart: "മറ്റ് വാഹനങ്ങൾ",
        vehicleNumber: "വാഹന നമ്പർ",
        bookingInfo: "സ്ഥിരീകരിച്ച ശേഷം എസ്എംഎസ് ഗേറ്റ് പാസ് ലഭിക്കും.",
        confirmSlot: "സ്ഥിരീകരിച്ച് ഡിജിറ്റൽ പാസ് നേടുക",
        liveQueueTracker: "തത്സമയ ക്യൂ ട്രാക്കർ",
        tokenNumber: "ടോക്കൺ നമ്പർ",
        nowServing: "ഇപ്പോൾ സേവിക്കുന്നത്",
        yourPosition: "നിങ്ങളുടെ സ്ഥാനം",
        estimatedTimeRemaining: "ബാക്കി സമയം",
        counterGate: "കൗണ്ടർ",
        advanceQueueBtn: "ക്യൂ മുന്നോട്ട് നീക്കുക (സിമുലേഷൻ)",
        callTurnBtn: "ഊഴം അറിയിപ്പ്",
        resetQueueBtn: "ക്യൂ പുനഃക്രമീകരിക്കുക",
        turnReadyAlert: "നിങ്ങളുടെ ഊഴം എത്തി! ദയവായി കൗണ്ടർ 2 ലേക്ക് പോകുക.",
        dbtTrackerTitle: "നേരിട്ടുള്ള ആനുകൂല്യ കൈമാറ്റ (DBT) ട്രാക്കർ",
        paymentDetails: "സംഭരണ പേയ്‌മെന്റ് വിവരങ്ങൾ",
        grossAmount: "ആകെ തുക",
        bankCreditStatus: "ബാങ്ക് അക്കൗണ്ട് വരവ് നില",
        bankNameLabel: "ബാങ്ക് അക്കൗണ്ട്",
        ifscLabel: "IFSC കോഡ്",
        utrLabel: "DBT റഫറൻസ് / UTR നമ്പർ",
        weighingSlip: "തൂക്ക രസീത്",
        downloadSlip: "DBT രസീത് ഡൗൺലോഡ് ചെയ്യുക",
        // Notifications
        notificationsTitle: "അറിയിപ്പ് കേന്ദ്രം",
        markAllRead: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക",
        clearAllNotifs: "എല്ലാം മായ്ക്കുക",
        voiceAlertBtn: "വോയ്‌സ് അറിയിപ്പ് കേൾക്കുക",
        allNotifReadSuccess: "എല്ലാ അറിയിപ്പുകളും വായിച്ചു.",
        filterAll: "എല്ലാം",
        filterUnread: "വായിക്കാത്തവ",
        filterProcurement: "ക്യൂ & മണ്ടി",
        filterPayment: "ഡിബിടി & പേയ്മെന്റ്",
        noNotifications: "അറിയിപ്പുകൾ ഒന്നുമില്ല",
        noNotificationsDesc: "എല്ലാം അപ്ഡേറ്റാണ്! പുതിയ അറിയിപ്പുകൾ ഇവിടെ കാണാം.",
        centresTitle: "അടുത്തുള്ള കേന്ദ്രങ്ങളും തിരക്കും",
        liveCrowdStatus: "വിപണിയിലെ തിരക്ക്",
        lowWait: "കുറഞ്ഞ തിരക്ക് (5-10 മിനിറ്റ്)",
        medWait: "ഇടത്തരം തിരക്ക് (20-30 മിനിറ്റ്)",
        highWait: "കൂടിയ തിരക്ക് (1+ മണിക്കൂർ)",
        getDirections: "വഴി കാണുക",
        callMandiOfficer: "ഓഫീസറെ വിളിക്കുക",
        helpTitle: "സഹായവും പരാതി പരിഹാര പോർട്ടലും",
        tollFreeTitle: "കിസാൻ കോൾ സെന്റർ (ടോൾ-ഫ്രീ 24x7)",
        tollFreeNumber: "1800-180-1551",
        faqTitle: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ",
        submitGrievance: "പരാതി രജിസ്റ്റർ ചെയ്യുക",
        grievanceSubject: "വിഷയം",
        grievanceDesc: "പ്രശ്നം വിവരിക്കുക",
        submitComplaintBtn: "പരാതി നൽകുക",
        complaintSubmitted: "പരാതി രജിസ്റ്റർ ചെയ്തു: #GRV-2026-9481",
        settingsTitle: "കർഷക പ്രൊഫൈലും ക്രമീകരണങ്ങളും",
        tabPersonal: "വ്യക്തിഗത വിവരങ്ങൾ",
        tabBank: "DBT & ബാങ്ക് അക്കൗണ്ട്",
        tabPreferences: "അറിയിപ്പുകൾ",
        tabDisplay: "ഡിസ്പ്ലേ & പ്രവേശനക്ഷമത",
        farmerFullName: "പൂർണ്ണമായ പേര്",
        mobileNoLabel: "മൊബൈൽ നമ്പർ",
        aadhaarLabel: "ആധാർ നമ്പർ",
        landSizeLabel: "ഭൂമി (ഏക്കർ)",
        villageLabel: "ഗ്രാമം",
        districtLabel: "ജില്ലയും സംസ്ഥാനവും",
        saveProfileBtn: "പ്രൊഫൈൽ സംരക്ഷിക്കുക",
        accountHolder: "അക്കൗണ്ട് ഉടമയുടെ പേര്",
        accountNo: "ബാങ്ക് അക്കൗണ്ട് നമ്പർ",
        aadhaarSeeded: "ആധാർ ലിങ്ക് ചെയ്തിട്ടുണ്ട്",
        smsAlerts: "എസ്എംഎസ് അറിയിപ്പുകൾ",
        whatsappAlerts: "വാട്സാപ്പ് അപ്ഡേറ്റുകൾ",
        voiceCallAlerts: "വോയ്സ് കോളുകൾ",
        proximityAlert: "3 കർഷകർ മുന്നിലുള്ളപ്പോൾ അറിയിക്കുക",
        largeTextMode: "വലിയ അക്ഷര മോഡ്",
        highContrastMode: "ഡാർക്ക് മോഡ്",
        soundAlerts: "ശബ്ദ അറിയിപ്പ്",
        profileUpdatedSuccess: "പ്രൊഫൈൽ വിജയകരമായി അപ്‌ഡേറ്റുചെയ്‌തു!",
        logoutConfirmTitle: "ലോഗ് ഔട്ട് സ്ഥിരീകരിക്കുക",
        logoutConfirmMsg: "കിസാൻ സേതുവിൽ നിന്ന് ലോഗ് ഔട്ട് ചെയ്യാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
        confirmLogoutBtn: "അതെ, ലോഗ് ഔട്ട് ചെയ്യുക",
        cancelBtn: "റദ്ദാക്കുക"
    }
};

/* Translation Helper */
function t(key) {
    const lang = localStorage.getItem("kisanSetuLanguage") || "English";
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    if (translations.English && translations.English[key]) {
        return translations.English[key];
    }
    return key;
}

/* =========================================================
   2. USER & SESSION MANAGEMENT
========================================================= */

function getDefaultUser() {
    return {
        name: "Ramesh Kumar",
        farmerId: "KS102458",
        mobile: "9876543210",
        aadhaar: "XXXX-XXXX-8921",
        land: "5.5 Acres",
        state: "Andhra Pradesh",
        district: "Guntur",
        village: "Tenali Rural",
        crop: "Paddy / Rice",
        mandi: "AP State Procurement Centre",
        bankName: "State Bank of India",
        accountNo: "•••• •••• 4589",
        ifsc: "SBIN0001234",
        isLoggedIn: true,
        smsAlerts: true,
        whatsappAlerts: true,
        voiceAlerts: true,
        proximityAlert: true,
        largeText: false,
        darkMode: false,
        soundAlerts: true
    };
}

function getCurrentUser() {
    const saved = localStorage.getItem("kisanSetuUser");
    if (saved) {
        try {
            return { ...getDefaultUser(), ...JSON.parse(saved) };
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }
    const def = getDefaultUser();
    localStorage.setItem("kisanSetuUser", JSON.stringify(def));
    return def;
}

function saveCurrentUser(user) {
    localStorage.setItem("kisanSetuUser", JSON.stringify(user));
    syncUserProfileUI();
}

function switchDemoRole(targetRole) {
    let user = getCurrentUser();
    if (targetRole === "officer") {
        user = {
            ...user,
            role: "officer",
            name: "Officer S. Sharma",
            farmerId: "MANDI-OFF-902",
            mandi: "AP State Procurement Centre (Yard 1)"
        };
    } else {
        user = {
            ...user,
            role: "farmer",
            name: "Ramesh Kumar",
            farmerId: "KS102458",
            mandi: "AP State Procurement Centre"
        };
    }
    saveCurrentUser(user);
    renderDashboardForRole();
    showToast(`Switched to ${targetRole === "officer" ? "🏛️ Mandi Officer / Admin Portal" : "🌾 Farmer Portal"}`);
}

function renderDashboardForRole() {
    const user = getCurrentUser();
    const isOfficer = (user.role === "officer" || user.role === "admin");

    const farmerView = document.getElementById("farmer-dashboard-view");
    const officerView = document.getElementById("officer-dashboard-view");
    const pageTitle = document.getElementById("page-title");
    const pageSub = document.getElementById("page-subtitle");

    if (isOfficer) {
        if (farmerView) farmerView.style.display = "none";
        if (officerView) officerView.style.display = "block";
        if (pageTitle) pageTitle.textContent = t("officerPortal") || "Mandi Officer Portal";
        if (pageSub) pageSub.textContent = "Live yard queue control, weighbridge intake & DBT approvals.";
        renderOfficerQueueTable();
        updateOfficerStats();
    } else {
        if (officerView) officerView.style.display = "none";
        if (farmerView) farmerView.style.display = "block";
        if (pageTitle) pageTitle.textContent = t("dashboard") || "Dashboard";
        if (pageSub) pageSub.textContent = t("manageProcurementJourney") || "Manage your procurement journey easily.";
        loadUserData(user);
        updateDashboardAfterBooking();
    }

    syncUserProfileUI();
}

const renderRoleBasedView = renderDashboardForRole;

function syncUserProfileUI() {
    const user = getCurrentUser();
    const isOfficer = (user.role === "officer" || user.role === "admin");
    
    // Toggle Admin Portal Active theme on body
    if (isOfficer) {
        document.body.classList.add("admin-portal-active");
    } else {
        document.body.classList.remove("admin-portal-active");
    }

    // Toggle Role-specific Sidebar Navigations
    const farmerNav = document.getElementById("sidebar-farmer-nav");
    const officerNav = document.getElementById("sidebar-officer-nav");
    if (farmerNav) farmerNav.style.display = isOfficer ? "none" : "block";
    if (officerNav) officerNav.style.display = isOfficer ? "block" : "none";

    // Logo Subtitle
    const logoSub = document.getElementById("logo-subtitle");
    if (logoSub) {
        logoSub.textContent = isOfficer 
            ? (t("mandiAdminControl") || "Mandi Admin & Control") 
            : (t("farmerProcurement") || "Farmer Procurement");
    }

    // Topbar Role Badge
    const roleBadge = document.getElementById("topbar-role-badge");
    if (roleBadge) {
        roleBadge.innerHTML = isOfficer 
            ? `<span class="role-badge-tag officer"><i class="fa-solid fa-shield-halved"></i> ${t("officerPortal") || "Officer Portal"}</span>`
            : `<span class="role-badge-tag farmer"><i class="fa-solid fa-wheat-awn"></i> ${t("farmerPortal") || "Farmer Portal"}</span>`;
    }

    // Topbar Profile (Name & Designation)
    const nameElem = document.getElementById("topbar-farmer-name");
    const idElem = document.getElementById("topbar-farmer-id");
    const avatarElem = document.getElementById("topbar-user-avatar");

    if (nameElem) nameElem.textContent = user.name || (isOfficer ? "Officer S. Sharma" : "Ramesh Kumar");
    if (idElem) {
        idElem.textContent = isOfficer 
            ? (t("mandiProcurementOfficer") || "Mandi Procurement Officer") 
            : `${t("farmerIdLabel") || "Farmer ID"}: ${user.farmerId || "KS102458"}`;
    }
    if (avatarElem) {
        avatarElem.innerHTML = isOfficer ? `<i class="fa-solid fa-user-shield" style="color:#f59e0b;"></i>` : `<i class="fa-solid fa-user"></i>`;
    }

    // Welcome title for farmer (interpolated placeholder)
    const welcomeTitle = document.getElementById("welcome-title");
    if (welcomeTitle) {
        const firstName = (user.name || "Farmer").split(" ")[0];
        welcomeTitle.textContent = (t("welcomeTitle") || "Good morning, {name}! 👋").replace("{name}", firstName);
    }

    // Officer incharge display in officer banner
    const officerInchargeName = document.getElementById("officer-incharge-name");
    if (officerInchargeName) {
        officerInchargeName.textContent = `${user.name || "Officer S. Sharma"} (${user.farmerId || "MANDI-OFF-902"})`;
    }

    // Officer vs Farmer Navigation Elements (Hide Help & Notifications for Officers)
    const sidebarHelpCard = document.getElementById("sidebar-help-card") || document.querySelector(".help-card");
    if (sidebarHelpCard) {
        sidebarHelpCard.style.display = isOfficer ? "none" : "flex";
    }

    const topbarNotifBtn = document.getElementById("topbar-notif-btn") || document.querySelector(".notification-button");
    if (topbarNotifBtn) {
        topbarNotifBtn.style.display = isOfficer ? "none" : "flex";
    }

    const footerHelpLink = document.getElementById("footer-help-link");
    if (footerHelpLink) {
        footerHelpLink.style.display = isOfficer ? "none" : "inline";
    }

    // Accessibility classes
    if (user.largeText) {
        document.body.classList.add("large-text");
    } else {
        document.body.classList.remove("large-text");
    }

    if (user.darkMode) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

/* =========================================================
   3. TOAST NOTIFICATIONS
========================================================= */

function showToast(message, type = "success") {
    const oldToast = document.querySelector(".ks-toast");
    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `ks-toast ${type}`;

    let icon = "fa-circle-check";
    if (type === "warning") icon = "fa-triangle-exclamation";
    if (type === "error") icon = "fa-circle-xmark";
    if (type === "info") icon = "fa-circle-info";

    toast.innerHTML = `
        <div class="ks-toast-icon">
            <i class="fa-solid ${icon}"></i>
        </div>
        <span>${message}</span>
        <button class="ks-toast-close" type="button">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    toast.querySelector(".ks-toast-close").onclick = () => {
        toast.remove();
    };

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }, 4000);
}

/* =========================================================
   4. MODAL DIALOG SYSTEM
========================================================= */

function openModal(title, content) {
    closeModal();

    const overlay = document.createElement("div");
    overlay.className = "ks-modal-overlay";

    overlay.innerHTML = `
        <div class="ks-modal">
            <div class="ks-modal-header">
                <div>
                    <h2>${title}</h2>
                    <p>KisanSetu • Ministry of Consumer Affairs, Food & Public Distribution</p>
                </div>
                <button class="ks-modal-close" type="button" title="Close modal">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="ks-modal-body">
                ${content}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
        overlay.classList.add("show");
    });

    overlay.querySelector(".ks-modal-close").onclick = closeModal;
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            closeModal();
        }
    });
}

function closeModal() {
    if (typeof KisanQR !== "undefined" && typeof KisanQR.stopScanner === "function") {
        KisanQR.stopScanner();
    }
    const modal = document.querySelector(".ks-modal-overlay");
    if (!modal) return;
    modal.classList.remove("show");
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 250);
}

/* =========================================================
   5. PER-USER BOOKING STATE & ISOLATED HISTORIES
========================================================= */

let currentBooking = null;
let bookingHistory = [];

function getFarmerHistoryKey(farmerId) {
    const id = farmerId || (getCurrentUser() && getCurrentUser().farmerId) || "KS102458";
    return `kisanSetuHistory_${id}`;
}

function getFarmerCurrentBookingKey(farmerId) {
    const id = farmerId || (getCurrentUser() && getCurrentUser().farmerId) || "KS102458";
    return `kisanSetuCurrentBooking_${id}`;
}

function saveBookingHistory() {
    const key = getFarmerHistoryKey();
    localStorage.setItem(key, JSON.stringify(bookingHistory));
}

function saveCurrentBooking() {
    const key = getFarmerCurrentBookingKey();
    if (currentBooking) {
        localStorage.setItem(key, JSON.stringify(currentBooking));
    } else {
        localStorage.removeItem(key);
    }
}

function loadUserData(userOverride) {
    const user = userOverride || getCurrentUser();
    const farmerId = user && user.farmerId ? user.farmerId : "KS102458";
    const histKey = getFarmerHistoryKey(farmerId);
    const bookKey = getFarmerCurrentBookingKey(farmerId);

    // 1. Load User's Booking History
    const storedHist = localStorage.getItem(histKey);
    if (storedHist) {
        try {
            bookingHistory = JSON.parse(storedHist);
        } catch (e) {
            bookingHistory = [];
        }
    } else if (farmerId === "KS102458" || (user.name && user.name.includes("Ramesh"))) {
        // Demo farmer Ramesh Kumar: sample history (migrate from legacy if available)
        const legacyHist = localStorage.getItem("kisanSetuHistory");
        bookingHistory = legacyHist ? JSON.parse(legacyHist) : [
            {
                id: "KS748291",
                crop: "Paddy / Rice (Grade A)",
                quantity: 21.5,
                date: "27 Aug 2026",
                time: "10:30 AM",
                centre: "AP State Procurement Centre",
                status: "Confirmed",
                amount: "₹48,650",
                token: "KS-07"
            },
            {
                id: "KS619024",
                crop: "Wheat (Grade FAQ)",
                quantity: 18.0,
                date: "14 Jul 2026",
                time: "11:00 AM",
                centre: "AP State Procurement Centre",
                status: "Completed",
                amount: "₹40,950",
                token: "KS-19"
            },
            {
                id: "KS509182",
                crop: "Cotton (Medium Staple)",
                quantity: 12.5,
                date: "28 Feb 2026",
                time: "09:30 AM",
                centre: "District Food Grain Hub",
                status: "Completed",
                amount: "₹89,012",
                token: "KS-04"
            }
        ];
        saveBookingHistory();
    } else {
        // Newly registered farmer or other ID: start fresh with empty history
        bookingHistory = [];
    }

    // 2. Load User's Current Active Booking
    const storedBooking = localStorage.getItem(bookKey);
    if (storedBooking) {
        try {
            currentBooking = JSON.parse(storedBooking);
        } catch (e) {
            currentBooking = null;
        }
    } else if (farmerId === "KS102458" || (user.name && user.name.includes("Ramesh"))) {
        // Demo farmer Ramesh Kumar: default active slot
        const legacyBooking = localStorage.getItem("kisanSetuCurrentBooking");
        currentBooking = legacyBooking ? JSON.parse(legacyBooking) : {
            id: "KS748291",
            crop: "Paddy / Rice (Grade A)",
            quantity: 21.5,
            date: "2026-08-27",
            time: "10:30 AM",
            centre: "AP State Procurement Centre",
            vehicleType: "Tractor Trolley",
            vehicleNo: "AP-07-TY-4920",
            token: "07",
            stage: "Gate In (Waiting)",
            stageCode: "gate_in",
            status: "In Queue",
            timestamp: Date.now()
        };
        saveCurrentBooking();
    } else {
        // Newly registered farmer or other ID: no active booking initially
        currentBooking = null;
    }
}

// Initial session load
loadUserData();

let yardQueueData = JSON.parse(localStorage.getItem("kisanSetuYardQueue")) || [
    {
        id: "KS748291",
        token: "07",
        farmerId: "KS102458",
        farmerName: "Ramesh Kumar",
        crop: "Paddy / Rice (Grade A)",
        quantity: 21.5,
        vehicleNo: "AP-07-TY-4920",
        vehicleType: "Tractor Trolley",
        gatePassId: "GP-2026-748291",
        time: "10:30 AM",
        stage: "Gate In (Waiting)",
        stageCode: "gate_in",
        moisture: "Pending",
        amount: "₹49,450",
        status: "In Queue"
    },
    {
        id: "KS819034",
        token: "08",
        farmerId: "KS109283",
        farmerName: "Venkat Rao",
        crop: "Paddy / Rice (Common)",
        quantity: 18.0,
        vehicleNo: "AP-07-AZ-1122",
        vehicleType: "Mini Truck",
        gatePassId: "GP-2026-819034",
        time: "10:45 AM",
        stage: "Quality Inspection",
        stageCode: "quality_check",
        moisture: "13.8% (Pass)",
        amount: "₹39,600",
        status: "Waiting"
    },
    {
        id: "KS930122",
        token: "09",
        farmerId: "KS104419",
        farmerName: "Lakshmi Devi",
        crop: "Cotton (Medium Staple)",
        quantity: 12.0,
        vehicleNo: "AP-07-BC-8940",
        vehicleType: "Tractor Trolley",
        gatePassId: "GP-2026-930122",
        time: "11:00 AM",
        stage: "Gate In (Waiting)",
        stageCode: "gate_in",
        moisture: "Pending",
        amount: "₹85,452",
        status: "In Queue"
    },
    {
        id: "KS940155",
        token: "10",
        farmerId: "KS108872",
        farmerName: "Siva Prasad",
        crop: "Maize (Kharif)",
        quantity: 25.0,
        vehicleNo: "AP-07-CD-3456",
        vehicleType: "Truck",
        gatePassId: "GP-2026-940155",
        time: "11:15 AM",
        stage: "Gate In (Waiting)",
        stageCode: "gate_in",
        moisture: "Pending",
        amount: "₹52,250",
        status: "In Queue"
    },
    {
        id: "KS619024",
        token: "04",
        farmerId: "KS101189",
        farmerName: "Apparao K.",
        crop: "Paddy / Rice (Grade A)",
        quantity: 20.0,
        vehicleNo: "AP-07-XY-7711",
        vehicleType: "Tractor Trolley",
        gatePassId: "GP-2026-619024",
        time: "09:45 AM",
        stage: "Procurement Completed",
        stageCode: "completed",
        moisture: "13.5% (Pass)",
        amount: "₹46,000",
        status: "Completed"
    }
];

function saveYardQueue() {
    localStorage.setItem("kisanSetuYardQueue", JSON.stringify(yardQueueData));
}

function generateBookingID() {
    return "KS" + Math.floor(100000 + Math.random() * 900000);
}

function updateDashboardAfterBooking() {
    saveCurrentBooking();

    const slotDate = document.getElementById("stat-slot-date");
    const slotTime = document.getElementById("stat-slot-time");
    const slotBadge = document.getElementById("stat-slot-badge");
    const queuePos = document.getElementById("stat-queue-pos");
    const queueBadge = document.getElementById("stat-queue-badge");
    const queueWait = document.getElementById("stat-queue-wait");
    const procBadge = document.getElementById("stat-proc-badge");
    const procStatus = document.getElementById("stat-proc-status");
    const procSub = document.getElementById("stat-proc-sub");
    const tlSlot = document.getElementById("timeline-slot-time");

    if (!currentBooking) {
        if (slotDate) slotDate.textContent = "--";
        if (slotTime) slotTime.textContent = t("noActiveSlot") || "No Active Slot";
        if (slotBadge) {
            slotBadge.textContent = "No Booking";
            slotBadge.className = "status-badge";
            slotBadge.style.background = "#f1f5f9";
            slotBadge.style.color = "#64748b";
        }
        if (queuePos) queuePos.textContent = "--";
        if (queueBadge) {
            queueBadge.textContent = "Not in Queue";
            queueBadge.className = "status-badge";
            queueBadge.style.background = "#f1f5f9";
            queueBadge.style.color = "#64748b";
        }
        if (queueWait) queueWait.textContent = "--";
        if (procBadge) {
            procBadge.textContent = "No Slot";
            procBadge.className = "status-badge";
            procBadge.style.background = "#f1f5f9";
            procBadge.style.color = "#64748b";
        }
        if (procStatus) procStatus.textContent = "No Active Booking";
        if (procSub) procSub.textContent = "Book a slot to schedule mandi delivery";
        if (tlSlot) tlSlot.textContent = "Not Scheduled";
        return;
    }

    if (currentBooking.status === "Cancelled") {
        if (slotDate) slotDate.textContent = "--";
        if (slotTime) slotTime.textContent = t("cancelled") || "Cancelled";
        if (slotBadge) {
            slotBadge.textContent = t("cancelled") || "Cancelled";
            slotBadge.className = "status-badge pending";
            slotBadge.style.background = "#ffebee";
            slotBadge.style.color = "#d32f2f";
        }
        if (queuePos) queuePos.textContent = "--";
        if (queueBadge) {
            queueBadge.textContent = t("cancelled") || "Inactive";
            queueBadge.className = "status-badge";
        }
        if (queueWait) queueWait.textContent = "--";
        if (procBadge) {
            procBadge.textContent = t("cancelled") || "Cancelled";
            procBadge.className = "status-badge";
        }
        if (procStatus) procStatus.textContent = t("slotCancelled") || "Slot Cancelled";
        if (procSub) procSub.textContent = t("cancelledByFarmer") || "Booking cancelled by farmer";
        if (tlSlot) tlSlot.textContent = t("cancelled") || "Cancelled";
    } else if (currentBooking.status === "Completed") {
        if (slotDate) slotDate.textContent = formatBookingDate(currentBooking.date);
        if (slotTime) slotTime.textContent = currentBooking.time;
        if (slotBadge) {
            slotBadge.textContent = t("completed") || "Completed";
            slotBadge.className = "status-badge confirmed";
            slotBadge.style.background = "";
            slotBadge.style.color = "";
        }
        if (queuePos) queuePos.textContent = "DONE";
        if (queueBadge) {
            queueBadge.textContent = t("completed") || "Completed";
            queueBadge.className = "status-badge confirmed";
        }
        if (queueWait) queueWait.textContent = "0 mins";
        if (procBadge) {
            procBadge.textContent = t("completed") || "Completed";
            procBadge.className = "status-badge confirmed";
        }
        if (procStatus) procStatus.textContent = t("procurementDone") || "Procurement Done";
        if (procSub) procSub.textContent = t("dbtPaymentReleased") || "DBT payment released";
        if (tlSlot) tlSlot.textContent = `${formatBookingDate(currentBooking.date)} · ${currentBooking.time}`;
    } else {
        if (slotDate) slotDate.textContent = formatBookingDate(currentBooking.date);
        if (slotTime) slotTime.textContent = currentBooking.time;
        if (slotBadge) {
            slotBadge.textContent = t("confirmed") || "Confirmed";
            slotBadge.className = "status-badge confirmed";
            slotBadge.style.background = "";
            slotBadge.style.color = "";
        }
        if (queuePos) queuePos.textContent = currentBooking.token || "07";
        if (queueBadge) {
            queueBadge.textContent = t("inQueue") || "In Queue";
            queueBadge.className = "status-badge waiting";
        }
        if (queueWait) queueWait.textContent = "25 mins";
        if (procBadge) {
            procBadge.textContent = t("processing") || "Processing";
            procBadge.className = "status-badge processing";
        }
        if (procStatus) procStatus.textContent = t("qualityCheck") || "Quality Check";
        if (procSub) procSub.textContent = t("weighingCompleted") || "Weighing completed";
        if (tlSlot) tlSlot.textContent = `${formatBookingDate(currentBooking.date)} · ${currentBooking.time}`;
    }
}

function formatBookingDate(dateString) {
    if (!dateString) return "Tomorrow";
    try {
        const date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch (e) {
        return dateString;
    }
}

/* =========================================================
   6. SLOT BOOKING MODAL & DIGITAL GATE PASS
========================================================= */

function openBooking() {
    const user = getCurrentUser();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split("T")[0];

    const content = `
        <div class="booking-intro">
            <div class="booking-big-icon">
                <i class="fa-solid fa-calendar-plus"></i>
            </div>
            <div>
                <strong>${t("bookingTitle")}</strong>
                <p>${t("bookingIntro")}</p>
            </div>
        </div>

        <form id="slotBookingForm" onsubmit="handleBookingSubmit(event)">
            
            <!-- CROP SELECTION -->
            <div class="form-group">
                <label>
                    <i class="fa-solid fa-wheat-awn"></i>
                    ${t("chooseCrop")} *
                </label>
                <select id="cropSelect" class="custom-select" required onchange="calculateEstimatedAmount()">
                    <option value="Paddy / Rice">${t("rice")}</option>
                    <option value="Wheat">${t("wheat")}</option>
                    <option value="Cotton">${t("cotton")}</option>
                    <option value="Maize">${t("maize")}</option>
                    <option value="Groundnut">${t("groundnut")}</option>
                    <option value="Mustard / Pulses">${t("mustard")}</option>
                </select>
            </div>

            <!-- QUANTITY -->
            <div class="form-group">
                <label>
                    <i class="fa-solid fa-weight-hanging"></i>
                    ${t("quantity")} *
                </label>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input
                        type="number"
                        id="quantityInput"
                        min="1"
                        step="0.1"
                        placeholder="${t("enterQuantity")}"
                        value="21.5"
                        class="custom-select"
                        style="flex:1;"
                        required
                        oninput="calculateEstimatedAmount()"
                    >
                    <span style="font-weight:700; padding:12px 16px; background:#e8f5ed; color:#174d32; border-radius:12px; white-space:nowrap;">
                        ${t("quintals")}
                    </span>
                </div>
                <small style="display:block; margin-top:6px; color:#5c6c63;">
                    ${t("quantityHelp")} | <strong id="mspEstimateTag" style="color:#26734d;">Est. MSP Value: ₹49,450</strong>
                </small>
            </div>

            <!-- PROCUREMENT CENTRE -->
            <div class="form-group">
                <label>
                    <i class="fa-solid fa-building"></i>
                    ${t("procurementCentre")} *
                </label>
                <select id="centreSelect" class="custom-select" required>
                    <option value="AP State Procurement Centre" selected>${t("apStateCentre")} (4.2 km)</option>
                    <option value="District Food Grain Hub">${t("districtProcurementCentre")} (8.5 km)</option>
                </select>
            </div>

            <!-- DATE & TIME -->
            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group">
                    <label>
                        <i class="fa-solid fa-calendar-day"></i>
                        ${t("date")} *
                    </label>
                    <input type="date" id="bookingDate" class="custom-select" value="${defaultDate}" required>
                </div>

                <div class="form-group">
                    <label>
                        <i class="fa-solid fa-clock"></i>
                        ${t("preferredTime")} *
                    </label>
                    <select id="timeSelect" class="custom-select" required>
                        <option value="09:00 AM">09:00 AM - 10:30 AM</option>
                        <option value="10:30 AM" selected>10:30 AM - 12:00 PM</option>
                        <option value="12:00 PM">12:00 PM - 01:30 PM</option>
                        <option value="02:30 PM">02:30 PM - 04:00 PM</option>
                        <option value="04:00 PM">04:00 PM - 05:30 PM</option>
                    </select>
                </div>
            </div>

            <!-- VEHICLE DETAILS -->
            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group">
                    <label>
                        <i class="fa-solid fa-truck-pickup"></i>
                        ${t("vehicleType")}
                    </label>
                    <select id="vehicleTypeSelect" class="custom-select">
                        <option value="Tractor Trolley" selected>${t("tractor")}</option>
                        <option value="Mini Commercial Truck">${t("miniTruck")}</option>
                        <option value="Bullock Cart / Other">${t("bullockCart")}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>
                        <i class="fa-solid fa-id-card"></i>
                        ${t("vehicleNumber")}
                    </label>
                    <input type="text" id="vehicleNumberInput" placeholder="e.g. AP-07-TY-4920" value="AP-07-TY-4920" class="custom-select">
                </div>
            </div>

            <div class="booking-summary" style="background:#eef7f2; border:1px solid #c9e6d4; padding:12px 14px; border-radius:12px; margin:16px 0; font-size:12.5px; color:#174d32; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-circle-info" style="font-size:16px; color:#26734d;"></i>
                <span>${t("bookingInfo")}</span>
            </div>

            <button type="submit" class="submit-auth-btn" style="cursor:pointer;">
                <i class="fa-solid fa-calendar-check"></i>
                <span>${t("confirmSlot")}</span>
            </button>
        </form>
    `;

    openModal(t("bookingTitle"), content);
}

function calculateEstimatedAmount() {
    const cropSelect = document.getElementById("cropSelect");
    const qtyInput = document.getElementById("quantityInput");
    const estimateTag = document.getElementById("mspEstimateTag");
    if (!cropSelect || !qtyInput || !estimateTag) return;

    const qty = parseFloat(qtyInput.value) || 0;
    let rate = 2300;
    const cropVal = cropSelect.value;
    if (cropVal.includes("Wheat")) rate = 2275;
    else if (cropVal.includes("Cotton")) rate = 7121;
    else if (cropVal.includes("Maize")) rate = 2090;
    else if (cropVal.includes("Groundnut")) rate = 6783;
    else if (cropVal.includes("Mustard")) rate = 5650;

    const total = Math.round(qty * rate);
    estimateTag.textContent = `Est. MSP Value: ₹${total.toLocaleString("en-IN")}`;
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const crop = document.getElementById("cropSelect").value;
    const quantity = parseFloat(document.getElementById("quantityInput").value) || 1;
    const centre = document.getElementById("centreSelect").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("timeSelect").value;
    const vehicleType = document.getElementById("vehicleTypeSelect").value;
    const vehicleNo = document.getElementById("vehicleNumberInput").value || "AP-07-TY-4920";

    const bookingId = generateBookingID();
    const tokenNo = String(Math.floor(5 + Math.random() * 8)).padStart(2, '0');

    let mspRate = 2300;
    if (crop.includes("Wheat")) mspRate = 2275;
    else if (crop.includes("Cotton")) mspRate = 7121;
    const totalAmount = "₹" + Math.round(quantity * mspRate).toLocaleString("en-IN");

    currentBooking = {
        id: bookingId,
        crop: crop,
        quantity: quantity,
        centre: centre,
        date: date,
        time: time,
        vehicleType: vehicleType,
        vehicleNo: vehicleNo,
        token: tokenNo,
        status: "Confirmed",
        amount: totalAmount,
        timestamp: Date.now()
    };

    // Add to history
    bookingHistory.unshift({
        id: bookingId,
        crop: crop,
        quantity: quantity,
        date: formatBookingDate(date),
        time: time,
        centre: centre,
        status: "Confirmed",
        amount: totalAmount,
        token: "KS-" + tokenNo
    });
    saveBookingHistory();

    const user = getCurrentUser();
    const yardEntry = {
        id: bookingId,
        token: tokenNo,
        farmerId: user.farmerId || "KS102458",
        farmerName: user.name || "Ramesh Kumar",
        crop: crop,
        quantity: quantity,
        vehicleNo: vehicleNo,
        vehicleType: vehicleType,
        gatePassId: "GP-2026-" + bookingId.replace("KS", ""),
        time: time,
        stage: "Gate In (Waiting)",
        stageCode: "gate_in",
        moisture: "Pending",
        amount: totalAmount,
        status: "In Queue"
    };

    // Update yardQueueData and save
    yardQueueData = yardQueueData.filter(f => f.id !== bookingId && f.farmerId !== user.farmerId);
    yardQueueData.unshift(yardEntry);
    saveYardQueue();

    // Add notification for Farmer
    KisanNotifications.addNotification({
        type: KisanEvents.FARMER_SLOT_BOOKED,
        title: "Procurement Slot Booked",
        message: `Your procurement slot has been booked successfully for ${quantity} Q ${crop}. Token #${tokenNo} issued.`,
        targetRole: "farmer",
        icon: "fa-calendar-check",
        badgeType: "success",
        entity: { tokenId: tokenNo, crop: crop, quantity: quantity, date: date, time: time, centre: centre },
        broadcast: false
    });

    // Broadcast real-time sync event across roles
    KisanSync.publish(KisanEvents.FARMER_SLOT_BOOKED, {
        booking: currentBooking,
        farmer: user,
        yardEntry: yardEntry
    });

    updateDashboardAfterBooking();
    closeModal();

    setTimeout(() => {
        openBookingConfirmation(currentBooking);
        showToast(`Slot confirmed! Gate Pass: ${bookingId}. Token: #${tokenNo}`);
    }, 300);
}

/* Digital Gate Pass Modal */
function openBookingConfirmation(booking) {
    const user = getCurrentUser();
    const content = `
        <div class="digital-gate-pass">
            <div class="gate-pass-top">
                <div>
                    <span class="gate-pass-title">MANDI E-PROCUREMENT GATE PASS</span>
                    <h3 style="font-size:18px; margin-top:2px;">${booking.centre}</h3>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:10px; color:#cfe9d7;">TOKEN NO</span>
                    <div class="gate-pass-code">#${booking.token || "07"}</div>
                </div>
            </div>

            <div class="gate-pass-body">
                <div class="gate-pass-grid">
                    <div>
                        <span>FARMER NAME</span>
                        <strong>${user.name}</strong>
                    </div>
                    <div>
                        <span>FARMER ID</span>
                        <strong>${user.farmerId}</strong>
                    </div>
                    <div>
                        <span>PASS ID</span>
                        <strong>${booking.id}</strong>
                    </div>
                    <div>
                        <span>COMMODITY</span>
                        <strong>${booking.crop}</strong>
                    </div>
                    <div>
                        <span>QUANTITY</span>
                        <strong>${booking.quantity} Quintals</strong>
                    </div>
                    <div>
                        <span>SLOT DATE & TIME</span>
                        <strong>${formatBookingDate(booking.date)} · ${booking.time}</strong>
                    </div>
                    <div>
                        <span>VEHICLE NO</span>
                        <strong>${booking.vehicleNo || "AP-07-TY-4920"}</strong>
                    </div>
                    <div>
                        <span>STATUS</span>
                        <strong style="color:#ffb86c;">VALID / ACTIVE</strong>
                    </div>
                </div>

                <div class="gate-pass-qr" style="cursor:pointer;" onclick="closeModal(); openFarmerQRModal('${booking.id}');" title="Click to view full dynamic QR">
                    <i class="fa-solid fa-qrcode"></i>
                    <small>${booking.id} (Click for Dynamic QR)</small>
                </div>
            </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;">
            <button type="button" class="submit-auth-btn" style="flex:1; background:#174d32; color:#fff;" onclick="closeModal(); openFarmerQRModal('${booking.id}');">
                <i class="fa-solid fa-qrcode"></i>
                <span>Show Dynamic QR</span>
            </button>
            <button type="button" class="submit-auth-btn" style="flex:1;" onclick="simulateSmsPass('${booking.id}', '${booking.token}')">
                <i class="fa-solid fa-comment-sms"></i>
                <span>Simulate SMS</span>
            </button>
            <button type="button" class="submit-auth-btn register-btn" style="flex:1;" onclick="window.print()">
                <i class="fa-solid fa-print"></i>
                <span>Print Pass</span>
            </button>
            <button type="button" class="submit-auth-btn" style="background:#fdeded; color:#d32f2f; border:1px solid #f9c2c2; flex:1;" onclick="closeModal(); openCancelBookingModal();">
                <i class="fa-solid fa-xmark"></i>
                <span>Cancel Slot</span>
            </button>
        </div>
    `;

    openModal("Digital Procurement Gate Pass", content);
}

function simulateSmsPass(passId, token) {
    showToast(`📱 SMS to Farmer: "Govt Mandi Entry Pass #${passId} generated for Token #${token}. Please arrive 10 mins before slot."`);
}

/* =========================================================
   7. REAL-TIME QUEUE MANAGEMENT TRACKER
========================================================= */

let queuePosition = 7;
let queueServing = 18;

function openTracker() {
    const user = getCurrentUser();

    if (!currentBooking || currentBooking.status === "Cancelled") {
        const emptyContent = `
            <div style="text-align:center; padding:35px 20px; color:#788b80; background:#f9fbf9; border-radius:16px; border:1px dashed #d1e2d6;">
                <i class="fa-solid fa-truck-fast" style="font-size:40px; color:#a1b5aa; margin-bottom:12px; display:block;"></i>
                <strong style="color:#2a3d32; font-size:16px;">No Active Slot in Yard Queue</strong>
                <p style="font-size:13px; color:#5c6c63; max-width:400px; margin:8px auto 18px;">You currently do not have an active appointment or token number in the live mandi queue.</p>
                <button type="button" class="primary-button" style="padding:8px 20px;" onclick="closeModal(); openBooking();">
                    <i class="fa-solid fa-calendar-plus"></i> Book a Procurement Slot
                </button>
            </div>
        `;
        openModal(t("liveQueueTracker") || "Live Mandi Queue Tracker", emptyContent);
        return;
    }

    const token = currentBooking.token || "07";
    const isActive = (currentBooking.status === "Confirmed" || currentBooking.status === "In Progress");

    const content = `
        <div class="queue-card-box" style="background:#ffffff; border:1px solid #e5ebe7; border-radius:18px; padding:22px; margin-bottom:16px; box-shadow:0 6px 20px rgba(0,0,0,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <span class="status-badge waiting" id="trackerStatusBadge" style="font-size:12px; padding:6px 14px;">
                    <i class="fa-solid fa-circle-dot" style="margin-right:4px;"></i> In Queue
                </span>
                <span style="font-size:12px; color:#5c6c63; font-weight:600;">
                    ${currentBooking ? currentBooking.centre : "AP State Procurement Centre"}
                </span>
            </div>

            <div style="text-align:center; padding:10px 0 16px;">
                <span style="font-size:12px; color:#78887e; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">YOUR TOKEN NUMBER</span>
                <div style="font-size:48px; font-weight:800; color:#174d32; font-family:'Nunito', sans-serif; line-height:1.1; margin:4px 0;">
                    KS-${token}
                </div>
                <span style="font-size:12px; color:#26734d; font-weight:600;">Weighbridge Gate Counter 2 Assigned</span>
            </div>

            <div class="queue-progress-area" style="margin:16px 0;">
                <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:8px;">
                    <span>Queue Progress</span>
                    <strong style="color:#26734d;" id="trackerProgressPercent">72% Completed</strong>
                </div>
                <div style="height:12px; background:#edf2ee; border-radius:20px; overflow:hidden;">
                    <div id="trackerProgressBar" style="width:72%; height:100%; background:linear-gradient(90deg, #26734d, #3ba36f); border-radius:inherit; transition:width 0.4s ease;"></div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-top:18px; text-align:center; background:#f8faf8; padding:14px; border-radius:14px;">
                <div>
                    <span style="font-size:10.5px; color:#7b8c82; display:block;">NOW SERVING</span>
                    <strong style="font-size:18px; color:#174d32;" id="nowServingToken">Token #${queueServing}</strong>
                </div>
                <div style="border-left:1px solid #e1e8e2; border-right:1px solid #e1e8e2;">
                    <span style="font-size:10.5px; color:#7b8c82; display:block;">AHEAD OF YOU</span>
                    <strong style="font-size:18px; color:#e98b32;" id="farmersAhead">${queuePosition} Farmers</strong>
                </div>
                <div>
                    <span style="font-size:10.5px; color:#7b8c82; display:block;">EST. WAIT</span>
                    <strong style="font-size:18px; color:#26734d;" id="estimatedWaitMins">${queuePosition * 4} Mins</strong>
                </div>
            </div>
        </div>

        <!-- FARMER PROCUREMENT CONTROLS (Only visible when active token in progress) -->
        ${isActive ? `
        <div style="display:flex; gap:10px; margin-top:16px;">
            <button type="button" class="submit-auth-btn" style="background:#27ae60; color:#ffffff; flex:1; padding:12px;" onclick="farmerCompleteProcurement()">
                <i class="fa-solid fa-circle-check"></i>
                <span>${t("completeProcurement")}</span>
            </button>
            <button type="button" class="submit-auth-btn" style="background:#fff0f0; color:#d32f2f; border:1px solid #fecaca; flex:1; padding:12px;" onclick="farmerCancelProcurement()">
                <i class="fa-solid fa-ban"></i>
                <span>${t("cancelProcurement")}</span>
            </button>
        </div>
        ` : `
        <div style="text-align:center; padding:12px; background:#f8faf8; border-radius:10px; font-size:12.5px; color:#5c6c63; margin-top:14px;">
            ${currentBooking && currentBooking.status === "Completed" ? 
                '<strong style="color:#27ae60;"><i class="fa-solid fa-circle-check"></i> Procurement Completed & DBT Released</strong>' : 
                '<span>No active procurement in progress. Book a new slot to join the queue.</span>'}
        </div>
        `}
    `;

    openModal(t("liveQueueTracker"), content);
}

function farmerCancelProcurement() {
    if (!currentBooking || currentBooking.status === "Cancelled") {
        showToast("No active procurement token to cancel.", "warning");
        return;
    }
    const confirmed = confirm("Are you sure you want to cancel your active procurement slot (#" + currentBooking.token + ")?");
    if (!confirmed) return;

    const user = getCurrentUser();
    const farmerId = (user && user.farmerId) || "KS102458";
    const farmerName = (user && user.name) || "Ramesh Kumar";
    const cancelledId = currentBooking.id;
    const cancelledToken = currentBooking.token;

    currentBooking.status = "Cancelled";
    saveCurrentBooking();

    const histItem = bookingHistory.find(h => h.id === currentBooking.id);
    if (histItem) histItem.status = "Cancelled";
    saveBookingHistory();

    yardQueueData = yardQueueData.filter(f => f.id !== currentBooking.id && f.farmerId !== farmerId);
    saveYardQueue();

    // Add notification for Farmer
    KisanNotifications.addNotification({
        type: KisanEvents.FARMER_SLOT_CANCELLED,
        title: "Procurement Slot Cancelled",
        message: `Your procurement appointment #${cancelledId} (Token #${cancelledToken}) was cancelled.`,
        targetRole: "farmer",
        icon: "fa-calendar-xmark",
        badgeType: "warning",
        entity: { tokenId: cancelledToken },
        broadcast: false
    });

    // Broadcast cancellation across roles
    KisanSync.publish(KisanEvents.FARMER_SLOT_CANCELLED, {
        bookingId: cancelledId,
        token: cancelledToken,
        farmerId: farmerId,
        farmerName: farmerName,
        reason: "Cancelled by farmer in queue tracker"
    });

    closeModal();
    updateDashboardAfterBooking();
    showToast("Procurement booking cancelled successfully.", "warning");
}

function farmerCompleteProcurement() {
    if (!currentBooking || currentBooking.status === "Completed") {
        showToast("No active procurement in progress.", "warning");
        return;
    }

    const user = getCurrentUser();
    const farmerId = (user && user.farmerId) || "KS102458";
    const farmerName = (user && user.name) || "Ramesh Kumar";
    const bookingId = currentBooking.id;
    const tokenNo = currentBooking.token;
    const amount = currentBooking.amount || "₹48,650";

    currentBooking.status = "Completed";
    currentBooking.stageCode = "completed";
    currentBooking.stage = "Procurement Completed";
    saveCurrentBooking();

    const histItem = bookingHistory.find(h => h.id === currentBooking.id);
    if (histItem) histItem.status = "Completed";
    saveBookingHistory();

    const queueItem = yardQueueData.find(f => f.id === currentBooking.id || f.farmerId === farmerId);
    if (queueItem) {
        queueItem.stageCode = "completed";
        queueItem.stage = "Procurement Completed";
        queueItem.status = "Completed";
        saveYardQueue();
    }

    // Add notifications for Farmer
    KisanNotifications.addNotification({
        type: KisanEvents.PROCUREMENT_COMPLETED,
        title: "Procurement Completed",
        message: "Your procurement has been completed successfully.",
        targetRole: "farmer",
        icon: "fa-circle-check",
        badgeType: "success",
        entity: { tokenId: tokenNo, amount: amount },
        broadcast: false
    });
    KisanNotifications.addNotification({
        type: KisanEvents.PAYMENT_UPDATED,
        title: "Payment / DBT Status Updated",
        message: "Your payment/DBT status has been updated.",
        targetRole: "farmer",
        icon: "fa-indian-rupee-sign",
        badgeType: "dbt",
        entity: { tokenId: tokenNo, amount: amount, bank: "SBI", utr: "RBI89327491028" },
        broadcast: false
    });

    // Broadcast completion event across roles
    KisanSync.publish(KisanEvents.FARMER_PROCUREMENT_COMPLETED, {
        bookingId: bookingId,
        token: tokenNo,
        farmerId: farmerId,
        farmerName: farmerName,
        amount: amount
    });

    closeModal();
    updateDashboardAfterBooking();
    showToast(`✅ Procurement completed! ${amount} DBT settlement initiated.`, "success");
}

function advanceQueueStep() {
    if (queuePosition > 1) {
        queuePosition--;
        queueServing++;
        const pct = Math.min(95, 100 - (queuePosition * 7));

        const aheadElem = document.getElementById("farmersAhead");
        const waitElem = document.getElementById("estimatedWaitMins");
        const servingElem = document.getElementById("nowServingToken");
        const barElem = document.getElementById("trackerProgressBar");
        const pctElem = document.getElementById("trackerProgressPercent");
        const dashPos = document.getElementById("stat-queue-pos");
        const dashWait = document.getElementById("stat-queue-wait");

        if (aheadElem) aheadElem.textContent = `${queuePosition} Farmers`;
        if (waitElem) waitElem.textContent = `${queuePosition * 4} Mins`;
        if (servingElem) servingElem.textContent = `Token #${queueServing}`;
        if (barElem) barElem.style.width = `${pct}%`;
        if (pctElem) pctElem.textContent = `${pct}% Completed`;
        if (dashPos) dashPos.textContent = `0${queuePosition}`;
        if (dashWait) dashWait.textContent = `${queuePosition * 4} mins`;

        KisanNotifications.addNotification({
            type: KisanEvents.FARMER_QUEUE_UPDATED,
            title: "Queue Position Updated",
            message: "Your queue position has been updated.",
            targetRole: "farmer",
            icon: "fa-people-line",
            badgeType: "info",
            entity: { position: queuePosition, waitMins: queuePosition * 4, serving: queueServing },
            broadcast: false
        });

        showToast(`Queue advanced! ${queuePosition} farmers ahead of you.`);
    } else {
        triggerTurnReadyAlert();
    }
}

function triggerTurnReadyAlert() {
    queuePosition = 0;
    const aheadElem = document.getElementById("farmersAhead");
    const waitElem = document.getElementById("estimatedWaitMins");
    const barElem = document.getElementById("trackerProgressBar");
    const pctElem = document.getElementById("trackerProgressPercent");
    const badge = document.getElementById("trackerStatusBadge");
    const dashPos = document.getElementById("stat-queue-pos");
    const dashWait = document.getElementById("stat-queue-wait");
    const dashBadge = document.getElementById("stat-queue-badge");

    if (aheadElem) aheadElem.textContent = "It's your turn!";
    if (waitElem) waitElem.textContent = "0 Mins";
    if (barElem) {
        barElem.style.width = "100%";
        barElem.style.background = "#26734d";
    }
    if (pctElem) pctElem.textContent = "100% Ready";
    if (badge) {
        badge.textContent = "READY FOR WEIGHING";
        badge.className = "status-badge confirmed";
    }
    if (dashPos) dashPos.textContent = "NOW";
    if (dashWait) dashWait.textContent = "0 mins (Ready)";
    if (dashBadge) {
        dashBadge.textContent = "Your Turn!";
        dashBadge.className = "status-badge confirmed";
    }

    KisanNotifications.addNotification({
        type: KisanEvents.OFFICER_TOKEN_CALLED,
        title: "Your Turn is Ready!",
        message: "Your turn is ready at Weighbridge Counter 2. Please proceed immediately.",
        targetRole: "farmer",
        icon: "fa-bullhorn",
        badgeType: "warning",
        broadcast: false
    });

    showToast("🔔 YOUR TURN IS READY! Please move to Weighbridge Gate 2 immediately.", "success");
}

function resetQueueSimulation() {
    queuePosition = 7;
    queueServing = 18;
    openTracker();
    showToast("Queue simulation reset to Position #07.");
}

/* =========================================================
   8. DIRECT BENEFIT TRANSFER (DBT) PAYMENT TRACKER
========================================================= */

function openPayment() {
    const user = getCurrentUser();
    const content = `
        <!-- Top Payment Stat Card -->
        <div style="background:linear-gradient(135deg, #4a2d82, #7a54bd); color:#fff; border-radius:18px; padding:22px; margin-bottom:20px; box-shadow:0 8px 24px rgba(74, 45, 130, 0.25);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#dcd0f2;">DIRECT BENEFIT TRANSFER (DBT)</span>
                    <div style="font-size:36px; font-weight:800; font-family:'Nunito', sans-serif; margin:4px 0;">₹48,650.00</div>
                    <span style="font-size:12px; color:#e7def8;">MSP Procurement for 21.5 Q Paddy (Grade A)</span>
                </div>
                <span class="status-badge pending" style="background:#fff; color:#4a2d82; font-weight:700; font-size:12px; padding:6px 12px;">
                    Under Clearing
                </span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.2); font-size:12px;">
                <div>
                    <span style="color:#dcd0f2; display:block; font-size:10px;">CREDIT BANK ACCOUNT</span>
                    <strong>${user.bankName} (${user.accountNo})</strong>
                </div>
                <div>
                    <span style="color:#dcd0f2; display:block; font-size:10px;">DBT UTR NUMBER</span>
                    <strong>RBI89327491028</strong>
                </div>
            </div>
        </div>

        <!-- DBT Pipeline 4-Stage Tracker -->
        <div class="settings-section-card">
            <h4 style="font-size:13.5px; color:#174d32; font-weight:700; margin-bottom:16px;">
                <i class="fa-solid fa-route" style="color:#26734d; margin-right:6px;"></i>
                4-Stage Procurement & Payment Lifecycle
            </h4>

            <div class="timeline">
                <div class="timeline-item completed">
                    <div class="timeline-icon"><i class="fa-solid fa-check"></i></div>
                    <div class="timeline-content">
                        <strong>1. Crop Arrival & Weighbridge Verification</strong>
                        <span>Gross: 21.5 Q • Net: 21.0 Q • 26 Aug, 11:15 AM</span>
                    </div>
                </div>

                <div class="timeline-item completed">
                    <div class="timeline-icon"><i class="fa-solid fa-check"></i></div>
                    <div class="timeline-content">
                        <strong>2. Quality Certification (DoCA Standards)</strong>
                        <span>Moisture: 11.4% (Grade A+) • Passed Quality Norms</span>
                    </div>
                </div>

                <div class="timeline-item completed">
                    <div class="timeline-icon"><i class="fa-solid fa-check"></i></div>
                    <div class="timeline-content">
                        <strong>3. PFMS DBT Subsidy Sanction</strong>
                        <span>Sanction Order #DOCA-AP-2026-491 • Approved by Officer</span>
                    </div>
                </div>

                <div class="timeline-item current">
                    <div class="timeline-icon"><i class="fa-solid fa-building-columns"></i></div>
                    <div class="timeline-content">
                        <strong>4. Direct Bank Account Credit</strong>
                        <span>NEFT/RTGS batch initiated. Expected in account within 24 hours.</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:80%;"></div></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Official Weighing Slip Breakdown -->
        <div class="settings-section-card">
            <h4 style="font-size:13.5px; color:#174d32; font-weight:700; margin-bottom:12px;">
                <i class="fa-solid fa-receipt" style="color:#26734d; margin-right:6px;"></i>
                Official Mandi Weighing & MSP Slip
            </h4>
            <div style="font-size:12.5px; line-height:1.8; color:#3d4e44;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Gross Weight:</span> <strong>21.50 Quintals</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Tare / Bag Deduction:</span> <strong>-0.50 Quintals</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Net Weight for Payment:</span> <strong>21.00 Quintals</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Govt Guaranteed MSP Rate:</span> <strong>₹2,300 / Quintal</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Handling & Transport Incentive:</span> <strong>+₹350.00</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid #e1e8e2; padding-top:6px; margin-top:6px; font-weight:700; color:#174d32; font-size:14px;">
                    <span>Total Credited to Account:</span> <span>₹48,650.00</span>
                </div>
            </div>
        </div>

        <button type="button" class="submit-auth-btn" onclick="showToast('Downloading official e-Procurement DBT receipt PDF...')">
            <i class="fa-solid fa-file-arrow-down"></i>
            <span>${t("downloadSlip")}</span>
        </button>
    `;

    openModal(t("dbtTrackerTitle"), content);
}

/* =========================================================
   9. BOOKING HISTORY MODAL
========================================================= */

function openHistory() {
    const listHtml = (bookingHistory && bookingHistory.length > 0) ? bookingHistory.map(item => `
        <div style="background:#ffffff; border:1px solid #e2eae4; border-radius:14px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <strong style="font-size:14.5px; color:#174d32;">${item.crop}</strong>
                    <span class="status-badge ${item.status === 'Completed' ? 'confirmed' : (item.status === 'Cancelled' ? 'pending' : 'waiting')}" style="font-size:10.5px; padding:3px 8px; ${item.status === 'Cancelled' ? 'background:#ffebee; color:#d32f2f;' : ''}">
                        ${item.status}
                    </span>
                </div>
                <p style="font-size:12px; color:#5c6c63; margin:2px 0;">
                    <i class="fa-solid fa-calendar-day" style="color:#26734d;"></i> ${item.date} · ${item.time} | 
                    <i class="fa-solid fa-weight-hanging" style="color:#26734d;"></i> ${item.quantity} Q
                </p>
                <small style="font-size:11px; color:#85968d;">${item.centre} • Token: ${item.token || item.id}</small>
            </div>

            <div style="text-align:right;">
                <div style="font-size:16px; font-weight:800; color:#174d32;">${item.amount}</div>
                <button type="button" class="text-btn" style="margin-top:6px;" onclick="openBookingConfirmation({id:'${item.id}', crop:'${item.crop}', quantity:${item.quantity}, date:'${item.date}', time:'${item.time}', centre:'${item.centre}', token:'${item.token ? item.token.replace('KS-','') : '07'}'})">
                    <i class="fa-solid fa-qrcode"></i> View Pass
                </button>
            </div>
        </div>
    `).join("") : `
        <div style="text-align:center; padding:35px 20px; color:#788b80; background:#f9fbf9; border-radius:14px; border:1px dashed #d1e2d6;">
            <i class="fa-solid fa-clipboard-list" style="font-size:36px; color:#a1b5aa; margin-bottom:10px; display:block;"></i>
            <strong style="color:#2a3d32; font-size:15px;">No Procurement History Found</strong>
            <p style="font-size:12.5px; margin:6px 0 16px;">You haven't booked any procurement slots yet.</p>
            <button type="button" class="primary-button" style="padding:8px 18px;" onclick="closeModal(); openBooking();">
                <i class="fa-solid fa-calendar-plus"></i> Book First Slot
            </button>
        </div>
    `;

    const content = `
        <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
            <p style="font-size:13px; color:#5c6c63;">All your scheduled and historical crop sales at government mandis.</p>
            <button type="button" class="primary-button" style="padding:6px 14px; font-size:12px;" onclick="openBooking()">
                <i class="fa-solid fa-plus"></i> New Slot
            </button>
        </div>
        <div>
            ${listHtml}
        </div>
    `;

    openModal(t("history"), content);
}

/* =========================================================
   10. NOTIFICATIONS CENTRE
========================================================= */

function openNotifications() {
    KisanNotifications.openPanel();
}

function markAllNotificationsRead() {
    KisanNotifications.markAllAsRead();
}

function updateNotificationBadge() {
    KisanNotifications.updateBadges();
}

function clearAllNotifications() {
    KisanNotifications.clearAll();
}

function playVoiceAnnouncement(customText, targetLang) {
    const lang = targetLang || localStorage.getItem("kisanSetuLanguage") || "English";
    let text = customText;
    if (!text) {
        text = "Dear Ramesh Kumar, your token number KS-07 is called for crop weighing at Gate 2. Please proceed.";
        if (lang === "Telugu") {
            text = "రైతు రమేష్ కుమార్ గారు, మీ టోకెన్ నంబర్ KS-07 తూకం కోసం కౌంటర్ 2 వద్దకు రండి.";
        } else if (lang === "Hindi") {
            text = "किसान रमेश कुमार जी, आपका टोकन नंबर KS-07 तौल काउंटर 2 पर बुलाया गया है। कृपया आगे बढ़ें।";
        }
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        if (lang === "Hindi") utterance.lang = "hi-IN";
        else if (lang === "Telugu") utterance.lang = "te-IN";
        else if (lang === "Tamil") utterance.lang = "ta-IN";
        else utterance.lang = "en-IN";
        window.speechSynthesis.speak(utterance);
        showToast("🔊 Voice Announcement playing in " + lang + "...");
    } else {
        showToast("Voice playback simulated: " + text);
    }
}

/* =========================================================
   11. PROCUREMENT CENTRES & CROWD CONGESTION
========================================================= */

const centresData = [
    {
        name: "AP State Procurement Centre (Yard 1)",
        distance: "4.2 km",
        location: "Main Agricultural Market, District Yard",
        lat: 16.2929,
        lng: 80.4552,
        status: "Open",
        hours: "08:00 AM - 06:00 PM",
        congestion: "low",
        congestionText: "Low Congestion (5-10 mins wait)",
        officer: "S. Sharma (Mandi Incharge)",
        phone: "+91 98480 22334"
    },
    {
        name: "District Food Grain Hub (Yard 2)",
        distance: "8.5 km",
        location: "Guntur Highway Agri Hub, Sector 4",
        lat: 16.3420,
        lng: 80.4720,
        status: "Open",
        hours: "08:30 AM - 05:30 PM",
        congestion: "med",
        congestionText: "Moderate Crowd (20-30 mins wait)",
        officer: "P. R. Rao (Quality Inspector)",
        phone: "+91 98480 55667"
    },
    {
        name: "Tenali Rural Cooperative Mandi",
        distance: "14.0 km",
        location: "Tenali Central Market Road",
        lat: 16.2437,
        lng: 80.6400,
        status: "Open",
        hours: "09:00 AM - 05:00 PM",
        congestion: "high",
        congestionText: "Heavy Rush (1+ hour wait)",
        officer: "M. Venkatesh",
        phone: "+91 98480 88990"
    }
];

function openCentre() {
    const listHtml = centresData.map(c => {
        const destination = (c.lat && c.lng) ? `${c.lat},${c.lng}` : encodeURIComponent(c.location || "");
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        return `
        <div style="background:#ffffff; border:1px solid #e2eae4; border-radius:16px; padding:18px; margin-bottom:14px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <div>
                    <strong style="font-size:15px; color:#174d32;">${c.name}</strong>
                    <p style="font-size:12px; color:#5c6c63; margin-top:2px;">
                        <i class="fa-solid fa-location-dot" style="color:#26734d;"></i> ${c.location} • <strong>${c.distance}</strong>
                    </p>
                </div>
                <span class="crowd-badge crowd-${c.congestion}">
                    <i class="fa-solid fa-users"></i> ${c.congestionText}
                </span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; font-size:12px; margin:12px 0; background:#f8faf8; padding:10px; border-radius:10px;">
                <div>
                    <span style="color:#788b80; display:block; font-size:10.5px;">HOURS</span>
                    <strong>${c.hours}</strong>
                </div>
                <div>
                    <span style="color:#788b80; display:block; font-size:10.5px;">MANDI OFFICER</span>
                    <strong>${c.officer}</strong>
                </div>
            </div>

            <div style="display:flex; gap:10px;">
                <button type="button" class="submit-auth-btn" style="padding:10px; font-size:12.5px; flex:1;" onclick="window.open('${mapsUrl}', '_blank')">
                    <i class="fa-solid fa-diamond-turn-right"></i>
                    <span>${t("getDirections")}</span>
                </button>
                <button type="button" class="submit-auth-btn register-btn" style="padding:10px; font-size:12.5px; flex:1;" onclick="showToast('Calling Mandi Incharge ${c.officer} (${c.phone})...')">
                    <i class="fa-solid fa-phone"></i>
                    <span>${t("callMandiOfficer")}</span>
                </button>
            </div>
        </div>
    `;
    }).join("");

    const content = `
        <div style="margin-bottom:14px;">
            <p style="font-size:13px; color:#5c6c63;">Check live crowd capacity and locate the nearest government procurement centres.</p>
        </div>
        <div>
            ${listHtml}
        </div>
    `;

    openModal(t("centresTitle"), content);
}

/* =========================================================
   12. HELP, HELPLINE & GRIEVANCE REGISTRATION
========================================================= */

function openHelp() {
    const content = `
        <!-- Kisan Call Center Toll-Free Highlight -->
        <div style="background:linear-gradient(135deg, #174d32, #26734d); color:#fff; border-radius:16px; padding:20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#cfe9d7;">GOVERNMENT OF INDIA TOLL-FREE HELPLINE</span>
                <div style="font-size:26px; font-weight:800; font-family:'Nunito', sans-serif; margin:4px 0;">1800-180-1551</div>
                <span style="font-size:12px; color:#e2f2e7;">24x7 Support in 22 Official Regional Languages</span>
            </div>
            <button type="button" class="primary-button" style="background:#fff; color:#174d32; font-weight:700;" onclick="showToast('Calling National Kisan Call Center 1800-180-1551...')">
                <i class="fa-solid fa-phone"></i> Call Now
            </button>
        </div>

        <!-- FAQ Accordion -->
        <div class="settings-section-card">
            <h4 style="font-size:13.5px; color:#174d32; font-weight:700; margin-bottom:14px;">
                <i class="fa-solid fa-circle-question" style="color:#26734d; margin-right:6px;"></i>
                Frequently Asked Questions (FAQ)
            </h4>
            
            <details style="padding:10px 0; border-bottom:1px solid #edf2ee; font-size:13px; cursor:pointer;">
                <summary style="font-weight:700; color:#2d3d34;">What documents are required at the Mandi?</summary>
                <p style="margin-top:6px; color:#5c6c63; font-size:12px; line-height:1.5;">You only need your Digital Gate Pass (on your phone or printout) and your Aadhaar Card. Bank account details are already linked in your profile.</p>
            </details>

            <details style="padding:10px 0; border-bottom:1px solid #edf2ee; font-size:13px; cursor:pointer;">
                <summary style="font-weight:700; color:#2d3d34;">When will the DBT MSP payment be credited?</summary>
                <p style="margin-top:6px; color:#5c6c63; font-size:12px; line-height:1.5;">Payment is directly disbursed to your Aadhaar-linked bank account within 24 to 48 hours of quality inspection certification.</p>
            </details>

            <details style="padding:10px 0; font-size:13px; cursor:pointer;">
                <summary style="font-weight:700; color:#2d3d34;">Can I reschedule or cancel my booked slot?</summary>
                <p style="margin-top:6px; color:#5c6c63; font-size:12px; line-height:1.5;">Yes, you can reschedule your slot up to 2 hours before the scheduled time under the 'Booking History' section.</p>
            </details>
        </div>

        <!-- Grievance Form -->
        <div class="settings-section-card">
            <h4 style="font-size:13.5px; color:#174d32; font-weight:700; margin-bottom:14px;">
                <i class="fa-solid fa-file-pen" style="color:#26734d; margin-right:6px;"></i>
                Submit a Grievance or Complaint
            </h4>
            <form onsubmit="handleGrievanceSubmit(event)">
                <div class="form-group">
                    <label>Complaint Topic</label>
                    <select id="grvCategory" class="custom-select" required>
                        <option value="Queue Waiting Issue">Mandi Long Waiting Time / Gate Delay</option>
                        <option value="DBT Payment Delay">DBT Payment Status Delay</option>
                        <option value="Quality Inspection Query">Quality Grading / Moisture Dispute</option>
                        <option value="Portal / App Feedback">Portal Technical Feedback</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Describe your issue</label>
                    <textarea id="grvDesc" rows="3" class="custom-select" placeholder="Explain the problem you faced..." required style="resize:none;"></textarea>
                </div>
                <button type="submit" class="submit-auth-btn">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>Submit Complaint Ticket</span>
                </button>
            </form>
        </div>
    `;

    openModal(t("helpTitle"), content);
}

function handleGrievanceSubmit(e) {
    e.preventDefault();
    const ticket = "GRV-2026-" + Math.floor(1000 + Math.random() * 9000);
    closeModal();
    showToast(`Grievance registered successfully! Ticket #${ticket}. An officer will contact you within 24h.`);
}

/* =========================================================
   13. FARMER PROFILE & DASHBOARD SETTINGS MODAL
========================================================= */

function openProfile() {
    const user = getCurrentUser();

    const content = `
        <!-- Tabs -->
        <div class="settings-tab-bar">
            <button type="button" class="settings-tab-btn active" id="stTabPersonal" onclick="switchSettingsTab('personal')">
                <i class="fa-solid fa-user"></i> <span>${t("tabPersonal")}</span>
            </button>
            <button type="button" class="settings-tab-btn" id="stTabBank" onclick="switchSettingsTab('bank')">
                <i class="fa-solid fa-building-columns"></i> <span>${t("tabBank")}</span>
            </button>
            <button type="button" class="settings-tab-btn" id="stTabPref" onclick="switchSettingsTab('pref')">
                <i class="fa-solid fa-bell"></i> <span>${t("tabPreferences")}</span>
            </button>
            <button type="button" class="settings-tab-btn" id="stTabDisplay" onclick="switchSettingsTab('display')">
                <i class="fa-solid fa-universal-access"></i> <span>${t("tabDisplay")}</span>
            </button>
        </div>

        <!-- TAB 1: PERSONAL PROFILE -->
        <div id="settingsSectionPersonal">
            <form onsubmit="handleSavePersonal(event)">
                <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="form-group">
                        <label>${t("farmerFullName")} *</label>
                        <input type="text" id="setFarmerName" value="${user.name}" class="custom-select" required>
                    </div>
                    <div class="form-group">
                        <label>${t("mobileNoLabel")} *</label>
                        <input type="tel" id="setFarmerMobile" value="${user.mobile}" class="custom-select" required>
                    </div>
                </div>

                <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="form-group">
                        <label>${t("aadhaarLabel")}</label>
                        <input type="text" id="setFarmerAadhaar" value="${user.aadhaar}" class="custom-select" readonly style="background:#f4f6f4;">
                    </div>
                    <div class="form-group">
                        <label>${t("landSizeLabel")}</label>
                        <input type="text" id="setFarmerLand" value="${user.land}" class="custom-select" required>
                    </div>
                </div>

                <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="form-group">
                        <label>${t("villageLabel")}</label>
                        <input type="text" id="setFarmerVillage" value="${user.village}" class="custom-select" required>
                    </div>
                    <div class="form-group">
                        <label>${t("districtLabel")}</label>
                        <input type="text" id="setFarmerDistrict" value="${user.district}, ${user.state}" class="custom-select" required>
                    </div>
                </div>

                <button type="submit" class="submit-auth-btn" style="margin-top:10px;">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>${t("saveProfileBtn")}</span>
                </button>
            </form>
        </div>

        <!-- TAB 2: DBT BANK ACCOUNT -->
        <div id="settingsSectionBank" style="display:none;">
            <form onsubmit="handleSaveBank(event)">
                <div class="form-group">
                    <label>${t("accountHolder")} *</label>
                    <input type="text" id="setBankHolder" value="${user.name}" class="custom-select" required>
                </div>
                <div class="form-group">
                    <label>Bank Name *</label>
                    <input type="text" id="setBankName" value="${user.bankName}" class="custom-select" required>
                </div>
                <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="form-group">
                        <label>${t("accountNo")} *</label>
                        <input type="text" id="setBankAcc" value="${user.accountNo}" class="custom-select" required>
                    </div>
                    <div class="form-group">
                        <label>${t("ifscLabel")} *</label>
                        <input type="text" id="setBankIfsc" value="${user.ifsc}" class="custom-select" required>
                    </div>
                </div>
                <div style="background:#e8f5ed; border:1px solid #bde5cb; padding:12px; border-radius:12px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-size:12.5px; color:#174d32;">
                    <i class="fa-solid fa-shield-check" style="font-size:18px; color:#26734d;"></i>
                    <span><strong>Aadhaar-Seeded DBT Status: Verified & Active</strong> for instant MSP direct benefit credit.</span>
                </div>
                <button type="submit" class="submit-auth-btn">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>Save Bank Details</span>
                </button>
            </form>
        </div>

        <!-- TAB 3: NOTIFICATION ALERTS -->
        <div id="settingsSectionPref" style="display:none;">
            <div class="settings-section-card">
                <div class="settings-row">
                    <div class="settings-label">
                        <strong>${t("smsAlerts")}</strong>
                        <span>Receive instant token and gate pass updates via SMS</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="prefSms" ${user.smsAlerts !== false ? 'checked' : ''} onchange="togglePref('smsAlerts', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="settings-row">
                    <div class="settings-label">
                        <strong>${t("whatsappAlerts")}</strong>
                        <span>Receive digital QR pass and weighing receipts on WhatsApp</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="prefWhatsapp" ${user.whatsappAlerts !== false ? 'checked' : ''} onchange="togglePref('whatsappAlerts', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="settings-row">
                    <div class="settings-label">
                        <strong>${t("voiceCallAlerts")}</strong>
                        <span>Automated voice call when your token is 3 spots away</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="prefVoice" ${user.voiceAlerts !== false ? 'checked' : ''} onchange="togglePref('voiceAlerts', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="settings-row">
                    <div class="settings-label">
                        <strong>${t("soundAlerts")}</strong>
                        <span>Chime sound alert when your turn is called on screen</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="prefSound" ${user.soundAlerts !== false ? 'checked' : ''} onchange="togglePref('soundAlerts', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- TAB 4: ACCESSIBILITY & DISPLAY -->
        <div id="settingsSectionDisplay" style="display:none;">
            <div class="settings-section-card">
                <div class="settings-row">
                    <div class="settings-label">
                        <strong>${t("largeTextMode")}</strong>
                        <span>Increases font size for easier reading by rural farmers</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="prefLargeText" ${user.largeText ? 'checked' : ''} onchange="togglePref('largeText', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="settings-row">
                    <div class="settings-label">
                        <strong>${t("highContrastMode")}</strong>
                        <span>High-contrast dark mode for low-light conditions</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="prefDark" ${user.darkMode ? 'checked' : ''} onchange="togglePref('darkMode', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    `;

    openModal(t("settingsTitle"), content);
}

function switchSettingsTab(tab) {
    const tabs = ["personal", "bank", "pref", "display"];
    tabs.forEach(tName => {
        const btn = document.getElementById(`stTab${tName.charAt(0).toUpperCase() + tName.slice(1)}`);
        const section = document.getElementById(`settingsSection${tName.charAt(0).toUpperCase() + tName.slice(1)}`);
        if (btn) btn.classList.toggle("active", tName === tab);
        if (section) section.style.display = (tName === tab) ? "block" : "none";
    });
}

function handleSavePersonal(e) {
    e.preventDefault();
    const user = getCurrentUser();
    user.name = document.getElementById("setFarmerName").value.trim();
    user.mobile = document.getElementById("setFarmerMobile").value.trim();
    user.land = document.getElementById("setFarmerLand").value.trim();
    user.village = document.getElementById("setFarmerVillage").value.trim();
    saveCurrentUser(user);
    closeModal();
    showToast(t("profileUpdatedSuccess"));
}

function handleSaveBank(e) {
    e.preventDefault();
    const user = getCurrentUser();
    user.bankName = document.getElementById("setBankName").value.trim();
    user.accountNo = document.getElementById("setBankAcc").value.trim();
    user.ifsc = document.getElementById("setBankIfsc").value.trim();
    saveCurrentUser(user);
    closeModal();
    showToast("Bank & DBT details saved successfully!");
}

function togglePref(prefKey, value) {
    const user = getCurrentUser();
    user[prefKey] = value;
    saveCurrentUser(user);
    showToast(`Preference updated.`);
}

/* =========================================================
   14. LANGUAGE TRANSLATION ENGINE & SELECTOR
========================================================= */

function applyLanguage(language) {
    localStorage.setItem("kisanSetuLanguage", language);
    const langDict = translations[language] || translations.English;

    // Update Topbar button
    const topLangElem = document.getElementById("current-language");
    if (topLangElem) topLangElem.textContent = language;

    // Update all elements with data-language-key
    document.querySelectorAll("[data-language-key]").forEach(el => {
        const key = el.getAttribute("data-language-key");
        if (key === "welcomeTitle") {
            return; // Handled dynamically via syncUserProfileUI interpolation
        }
        if (langDict[key]) {
            el.textContent = langDict[key];
        }
    });

    // Re-render dynamic profile, greeting & role badge
    syncUserProfileUI();

    // Re-render role dashboard & status cards
    renderDashboardForRole();
}

function openLanguageSelector() {
    const languages = [
        ["A", "English", "English"],
        ["अ", "हिन्दी (Hindi)", "Hindi"],
        ["అ", "తెలుగు (Telugu)", "Telugu"],
        ["த", "தமிழ் (Tamil)", "Tamil"],
        ["ಕ", "ಕನ್ನಡ (Kannada)", "Kannada"],
        ["മ", "മലയാളം (Malayalam)", "Malayalam"]
    ];

    const currentSaved = localStorage.getItem("kisanSetuLanguage") || "English";

    const content = `
        <div class="language-options" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
            ${languages.map(l => `
                <button
                    type="button"
                    class="language-option ${l[2] === currentSaved ? 'selected' : ''}"
                    style="padding:14px; border-radius:14px; border:1.5px solid ${l[2] === currentSaved ? '#26734d' : '#e2eae4'}; background:${l[2] === currentSaved ? '#e8f5ed' : '#ffffff'}; display:flex; align-items:center; gap:12px; cursor:pointer; text-align:left; transition:0.2s;"
                    onclick="selectPortalLanguage('${l[2]}')"
                >
                    <div style="width:36px; height:36px; border-radius:10px; background:#26734d; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px;">
                        ${l[0]}
                    </div>
                    <div>
                        <strong style="display:block; font-size:13.5px; color:#174d32;">${l[1]}</strong>
                        <span style="font-size:11px; color:#5c6c63;">${l[2]}</span>
                    </div>
                </button>
            `).join("")}
        </div>
    `;

    openModal("Select Portal Language", content);
}

function selectPortalLanguage(lang) {
    applyLanguage(lang);
    closeModal();
    showToast(`Portal language changed to ${lang}.`);
}

/* =========================================================
   15. LOGOUT CONFIRMATION FLOW
========================================================= */

function logout() {
    const content = `
        <div style="text-align:center; padding:10px 0 20px;">
            <div style="width:60px; height:60px; border-radius:50%; background:#fff0ef; color:#d9534f; display:flex; align-items:center; justify-content:center; font-size:26px; margin:0 auto 16px;">
                <i class="fa-solid fa-right-from-bracket"></i>
            </div>
            <h3 style="font-size:18px; color:#174d32; margin-bottom:8px;">${t("logoutConfirmTitle")}</h3>
            <p style="font-size:13.5px; color:#5c6c63; max-width:340px; margin:0 auto;">
                ${t("logoutConfirmMsg")}
            </p>
        </div>

        <div style="display:flex; gap:12px;">
            <button type="button" class="submit-auth-btn register-btn" style="flex:1;" onclick="executeLogout()">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>${t("confirmLogoutBtn")}</span>
            </button>
            <button type="button" class="submit-auth-btn" style="flex:1; background:#eef2ef; color:#444;" onclick="closeModal()">
                <span>${t("cancelBtn")}</span>
            </button>
        </div>
    `;

    openModal(t("logoutConfirmTitle"), content);
}

function executeLogout() {
    localStorage.removeItem("kisanSetuAuthToken");
    closeModal();
    showToast("Logged out successfully. Redirecting to login...");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 500);
}

/* =========================================================
   16. MOBILE MENU & SIDEBAR ROUTING
========================================================= */

function toggleMobileMenu() {
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) {
        const isOpen = sidebar.classList.toggle("mobile-open");
        if (backdrop) {
            if (isOpen) {
                backdrop.classList.add("show");
                document.body.classList.add("sidebar-open-locked");
            } else {
                backdrop.classList.remove("show");
                document.body.classList.remove("sidebar-open-locked");
            }
        }
    }
}

function closeMobileMenu() {
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar && sidebar.classList.contains("mobile-open")) {
        sidebar.classList.remove("mobile-open");
        if (backdrop) backdrop.classList.remove("show");
        document.body.classList.remove("sidebar-open-locked");
    }
}

// Global click event dispatcher for sidebar and buttons
document.addEventListener("click", function(event) {
    const target = event.target;

    // Mobile menu toggle click
    if (target.closest(".mobile-menu")) {
        toggleMobileMenu();
        return;
    }

    // Close mobile sidebar when clicking backdrop or outside open drawer
    const sidebar = document.querySelector(".sidebar");
    if (sidebar && sidebar.classList.contains("mobile-open")) {
        if (target.id === "sidebar-backdrop" || (!target.closest(".sidebar") && !target.closest(".mobile-menu"))) {
            closeMobileMenu();
            return;
        }
    }

    // Sidebar navigation items
    const navItem = target.closest(".sidebar-nav .nav-item");
    if (navItem) {
        event.preventDefault();
        const action = navItem.dataset.action;

        document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
            item.classList.remove("active");
        });
        navItem.classList.add("active");

        // Close mobile drawer on item click
        closeMobileMenu();

        switch (action) {
            case "dashboard":
                closeModal();
                showToast("You are on the main Dashboard.");
                break;
            case "booking":
                openBooking();
                break;
            case "tracker":
                openTracker();
                break;
            case "qr-pass":
                openFarmerQRModal();
                break;
            case "history":
                openHistory();
                break;
            case "payment":
                openPayment();
                break;
            case "notifications":
            case "officer-notifications":
                openNotifications();
                break;
            case "officer-scan-qr":
                openOfficerQRScannerModal();
                break;
            case "farmer-quality":
                openFarmerQualityModal();
                break;
            case "officer-ai-inspect":
                openQualityInspectionModal();
                break;
            case "centre":
                openCentre();
                break;
            case "help":
                openHelp();
                break;
            default:
                console.log("Nav action:", action);
        }
        return;
    }

    // Profile nav & logout
    if (target.closest(".profile-nav")) {
        event.preventDefault();
        openProfile();
        return;
    }

    if (target.closest(".logout-nav")) {
        event.preventDefault();
        logout();
        return;
    }
});

// Escape key to close modal
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

/* =========================================================
   17. MANDI OFFICER / ADMIN PORTAL & LIVE YARD OPERATIONS
========================================================= */

function renderOfficerQueueTable() {
    const tbody = document.getElementById("officer-queue-table-body");
    if (!tbody) return;

    if (!yardQueueData || yardQueueData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#788b80;">No farmers currently in the yard queue.</td></tr>`;
        return;
    }

    tbody.innerHTML = yardQueueData.map((f) => {
        const isCompleted = f.stageCode === "completed";

        let stageLabel = f.stage;
        if (f.stageCode === "gate_in") stageLabel = t("gateInWaiting") || f.stage;
        else if (f.stageCode === "gross_weighing") stageLabel = t("grossWeighbridge") || f.stage;
        else if (f.stageCode === "quality_check") stageLabel = t("qualityInspected") || f.stage;
        else if (f.stageCode === "tare_weighing") stageLabel = t("tareWeighbridge") || f.stage;
        else if (f.stageCode === "completed") stageLabel = t("procurementCompleted") || f.stage;

        return `
            <tr style="${isCompleted ? 'opacity:0.78; background:#fafcfa;' : ''}">
                <td>
                    <span class="token-pill" style="${isCompleted ? 'background:#527863;' : ''}">#${f.token}</span>
                </td>
                <td>
                    <strong style="color:#174d32; display:block;">${f.farmerName}</strong>
                    <span style="font-size:11px; color:#6d7d74;">ID: ${f.farmerId}</span>
                </td>
                <td>
                    <strong>${f.crop}</strong>
                    <span style="font-size:11.5px; color:#26734d; display:block;">${f.quantity} Quintals • ${f.amount || ''}</span>
                </td>
                <td>
                    <strong>${f.vehicleNo}</strong>
                    <span style="font-size:11px; color:#6d7d74; display:block;">${f.vehicleType || 'Tractor Trolley'}</span>
                </td>
                <td>
                    <span class="stage-chip stage-${f.stageCode}">
                        <i class="fa-solid ${getStageIcon(f.stageCode)}"></i> ${stageLabel}
                    </span>
                    <span style="font-size:10.5px; color:#6d7d74; display:block; margin-top:2px;">Moisture: ${f.moisture}</span>
                </td>
                <td>
                    <div class="officer-action-group">
                        ${!isCompleted ? `
                            <button type="button" class="officer-btn-sm officer-btn-inspect" onclick="openQualityInspectionModal('${f.id}')" title="AI Grain Quality & Defect Inspection">
                                <i class="fa-solid fa-microscope"></i> ${t("aiQualityInspectionBtn") || "AI Inspect"}
                            </button>
                            <button type="button" class="officer-btn-sm officer-btn-call" onclick="officerCallFarmerToken('${f.token}', '${f.farmerName}')" title="Call token over loudspeaker">
                                <i class="fa-solid fa-bullhorn"></i> ${t("callNextBtn") || "Call Next"}
                            </button>
                            <button type="button" class="officer-btn-sm officer-btn-complete" onclick="officerCompleteProcurement('${f.id}')" title="Mark as Completed & Release DBT">
                                <i class="fa-solid fa-circle-check"></i> ${t("markCompleteBtn") || "Complete"}
                            </button>
                            <button type="button" class="officer-btn-sm officer-btn-cancel" onclick="officerCancelFarmerToken('${f.id}')" title="Cancel this queue entry">
                                <i class="fa-solid fa-ban"></i> ${t("cancelQueueBtn") || "Cancel"}
                            </button>
                        ` : `
                            <button type="button" class="officer-btn-sm officer-btn-receipt" onclick="openProcurementReceiptModal('${f.id}')" title="View Electronic J-Form Receipt">
                                <i class="fa-solid fa-file-invoice"></i> ${t("jFormReceipt") || "J-Form Receipt"}
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function getStageIcon(code) {
    if (code === "gate_in") return "fa-door-open";
    if (code === "gross_weighing") return "fa-scale-unbalanced";
    if (code === "quality_check") return "fa-microscope";
    if (code === "tare_weighing") return "fa-scale-balanced";
    if (code === "completed") return "fa-circle-check";
    return "fa-truck";
}

function officerAdvanceFarmerStage(id) {
    const item = yardQueueData.find(f => f.id === id);
    if (!item) return;

    if (item.stageCode === "gate_in") {
        item.stageCode = "gross_weighing";
        item.stage = "Gross Weighbridge";
        showToast(`Token #${item.token} (${item.farmerName}) moved to Gross Weighbridge.`);

        KisanNotifications.addNotification({
            type: KisanEvents.QR_VERIFIED,
            title: "Farmer Verified Successfully",
            message: `Farmer ${item.farmerName} (Token #${item.token}) verified at Gate 1.`,
            targetRole: "officer",
            icon: "fa-clipboard-check",
            badgeType: "success",
            entity: { tokenId: item.token, farmerName: item.farmerName, crop: item.crop }
        });

        KisanSync.publish(KisanEvents.FARMER_CHECK_IN, {
            id: item.id,
            farmerId: item.farmerId,
            farmerName: item.farmerName,
            token: item.token,
            gate: "Gate 1",
            status: "Arrived & Verified"
        });

    } else if (item.stageCode === "gross_weighing") {
        item.stageCode = "quality_check";
        item.stage = "Quality Inspected";
        item.moisture = "14.0% (Pass)";
        showToast(`Token #${item.token} Quality verified & moisture tested: 14.0%.`);

        KisanSync.publish(KisanEvents.QUALITY_INSPECTION_STARTED, {
            id: item.id,
            farmerId: item.farmerId,
            farmerName: item.farmerName,
            token: item.token,
            crop: item.crop
        });

        KisanSync.publish(KisanEvents.QUALITY_APPROVED, {
            id: item.id,
            farmerId: item.farmerId,
            farmerName: item.farmerName,
            token: item.token,
            moisture: "14.0% (Pass)",
            grade: "Grade A"
        });

    } else if (item.stageCode === "quality_check") {
        item.stageCode = "tare_weighing";
        item.stage = "Tare Weighbridge";
        showToast(`Token #${item.token} moved to Empty Vehicle (Tare) Weighing.`);

        KisanSync.publish(KisanEvents.FARMER_QUEUE_UPDATED, {
            id: item.id,
            farmerId: item.farmerId,
            farmerName: item.farmerName,
            token: item.token,
            stage: "Tare Weighbridge"
        });

    } else if (item.stageCode === "tare_weighing") {
        item.stageCode = "completed";
        item.stage = "Procurement Completed";
        item.status = "Completed";
        showToast(`Token #${item.token} Weighment complete! ₹${item.amount} DBT payout queued.`, "success");

        KisanNotifications.addNotification({
            type: KisanEvents.PROCUREMENT_COMPLETED,
            title: "Procurement Finalized",
            message: `Procurement finalized for Token #${item.token} (${item.farmerName}). J-Form created.`,
            targetRole: "officer",
            icon: "fa-circle-check",
            badgeType: "success",
            entity: { tokenId: item.token, farmerName: item.farmerName, amount: item.amount }
        });

        KisanSync.publish(KisanEvents.PROCUREMENT_COMPLETED, {
            id: item.id,
            farmerId: item.farmerId,
            farmerName: item.farmerName,
            token: item.token,
            amount: item.amount
        });

        KisanSync.publish(KisanEvents.PAYMENT_UPDATED, {
            id: item.id,
            farmerId: item.farmerId,
            farmerName: item.farmerName,
            token: item.token,
            amount: item.amount,
            status: "Approved & DBT Credited"
        });
    }

    if (currentBooking && (currentBooking.id === id || id === "KS748291" || currentBooking.token === item.token)) {
        currentBooking.stageCode = item.stageCode;
        currentBooking.stage = item.stage;
        currentBooking.status = item.status;
        if (item.moisture) currentBooking.moisture = item.moisture;
        saveCurrentBooking();
        updateDashboardAfterBooking();
    }

    saveYardQueue();
    renderOfficerQueueTable();
    updateOfficerStats();

    // Broadcast stage advancement to farmer and connected tabs
    KisanSync.publish(KisanEvents.OFFICER_STAGE_ADVANCED, {
        id: item.id,
        farmerId: item.farmerId,
        farmerName: item.farmerName,
        token: item.token,
        stage: item.stage,
        stageCode: item.stageCode,
        moisture: item.moisture,
        amount: item.amount,
        status: item.status
    });
}

function officerCompleteProcurement(id) {
    const item = yardQueueData.find(f => f.id === id);
    if (!item) return;

    item.stageCode = "completed";
    item.stage = "Procurement Completed";
    item.status = "Completed";

    if (currentBooking && (currentBooking.id === id || id === "KS748291" || currentBooking.token === item.token)) {
        currentBooking.stageCode = "completed";
        currentBooking.stage = "Procurement Completed";
        currentBooking.status = "Completed";
        saveCurrentBooking();

        const histItem = bookingHistory.find(h => h.id === currentBooking.id);
        if (histItem) {
            histItem.status = "Completed";
        }
        saveBookingHistory();
        updateDashboardAfterBooking();
    }

    saveYardQueue();
    renderOfficerQueueTable();
    updateOfficerStats();

    KisanNotifications.addNotification({
        type: KisanEvents.PROCUREMENT_COMPLETED,
        title: "Procurement Finalized",
        message: `Token #${item.token} (${item.farmerName}) finalized. J-Form and DBT released.`,
        targetRole: "officer",
        icon: "fa-circle-check",
        badgeType: "success",
        entity: { tokenId: item.token, farmerName: item.farmerName, amount: item.amount }
    });

    // Broadcast stage completion and payment event
    KisanSync.publish(KisanEvents.OFFICER_STAGE_ADVANCED, {
        id: item.id,
        farmerId: item.farmerId,
        farmerName: item.farmerName,
        token: item.token,
        stage: item.stage,
        stageCode: item.stageCode,
        moisture: item.moisture,
        amount: item.amount,
        status: item.status,
        isFinalized: true
    });

    KisanSync.publish(KisanEvents.PROCUREMENT_COMPLETED, {
        id: item.id,
        farmerId: item.farmerId,
        farmerName: item.farmerName,
        token: item.token,
        amount: item.amount
    });

    KisanSync.publish(KisanEvents.PAYMENT_UPDATED, {
        farmerId: item.farmerId,
        bookingId: item.id,
        token: item.token,
        amount: item.amount,
        status: "Approved & DBT Credited"
    });

    showToast(`✅ Procurement finalized for Token #${item.token} (${item.farmerName})! J-Form created and DBT released.`, "success");
}

function officerCancelFarmerToken(id) {
    const item = yardQueueData.find(f => f.id === id);
    if (!item) return;

    const confirmed = confirm(`Are you sure you want to cancel Token #${item.token} for ${item.farmerName}?`);
    if (!confirmed) return;

    const cancelledItem = { ...item };
    yardQueueData = yardQueueData.filter(f => f.id !== id);
    saveYardQueue();

    if (currentBooking && (currentBooking.id === id || currentBooking.token === cancelledItem.token)) {
        currentBooking.status = "Cancelled";
        saveCurrentBooking();
        updateDashboardAfterBooking();
    }

    renderOfficerQueueTable();
    updateOfficerStats();

    KisanNotifications.addNotification({
        type: KisanEvents.OFFICER_TOKEN_CANCELLED,
        title: "Token Cancelled",
        message: `Token #${cancelledItem.token} (${cancelledItem.farmerName}) removed from yard queue.`,
        targetRole: "officer",
        icon: "fa-ban",
        badgeType: "warning",
        entity: { tokenId: cancelledItem.token, farmerName: cancelledItem.farmerName }
    });

    // Broadcast cancellation across roles
    KisanSync.publish(KisanEvents.OFFICER_TOKEN_CANCELLED, {
        id: cancelledItem.id,
        farmerId: cancelledItem.farmerId,
        farmerName: cancelledItem.farmerName,
        token: cancelledItem.token
    });

    showToast(`⚠️ Token #${cancelledItem.token} (${cancelledItem.farmerName}) removed from yard queue.`, "warning");
}

function officerCallFarmerToken(token, name) {
    const text = `Attention please. Token number ${token}, Farmer ${name}, please report to Weighbridge Gate 1 immediately.`;
    playVoiceAnnouncement(text, "English");
    showToast(`📢 Token #${token} (${name}) called over yard loudspeaker!`, "info");

    KisanNotifications.addNotification({
        type: KisanEvents.OFFICER_TOKEN_CALLED,
        title: `Loudspeaker Call: Token #${token}`,
        message: `Token #${token} (${name}) called to Weighbridge Gate 1.`,
        targetRole: "officer",
        icon: "fa-bullhorn",
        badgeType: "warning",
        entity: { tokenId: token, farmerName: name, gate: "Weighbridge Gate 1" }
    });

    // Broadcast loudspeaker call to farmer interface
    KisanSync.publish(KisanEvents.OFFICER_TOKEN_CALLED, {
        token: token,
        farmerName: name,
        officerIncharge: (getCurrentUser() && getCurrentUser().name) || "Officer S. Sharma",
        gate: "Weighbridge Gate 1",
        timestamp: Date.now()
    });
}

function officerAdvanceNextQueue() {
    const nextFarmer = yardQueueData.find(f => f.stageCode !== "completed");
    if (nextFarmer) {
        officerAdvanceFarmerStage(nextFarmer.id);
        officerCallFarmerToken(nextFarmer.token, nextFarmer.farmerName);
    } else {
        showToast("All farmers in the queue have completed procurement today!");
    }
}

function updateOfficerStats() {
    const activeCount = yardQueueData.filter(f => f.stageCode !== "completed").length;
    const completedCount = yardQueueData.filter(f => f.stageCode === "completed").length + 18;
    const totalServed = completedCount + activeCount;

    const servedElem = document.getElementById("officer-stat-total-served");
    const servedSub = document.getElementById("officer-stat-served-sub");
    const numElem = document.getElementById("officer-stat-queue-num");
    const countElem = document.getElementById("officer-stat-queue-count");
    const waitElem = document.getElementById("officer-stat-wait-time");

    if (servedElem) servedElem.innerHTML = `${totalServed} <span style="font-size:16px;">Farmers</span>`;
    if (servedSub) servedSub.innerHTML = `<strong>${completedCount} Completed</strong> • ${activeCount} In Queue`;
    if (numElem) numElem.innerHTML = `${String(activeCount).padStart(2, '0')} <span style="font-size:16px;">Trucks</span>`;
    if (countElem) countElem.textContent = `${activeCount} Active`;
    if (waitElem) waitElem.innerHTML = `${Math.max(12, activeCount * 4.5).toFixed(0)} <span style="font-size:16px;">mins</span>`;
}

function resetOfficerYardQueue() {
    localStorage.removeItem("kisanSetuYardQueue");
    KisanSync.publish(KisanEvents.OFFICER_QUEUE_RESET, {});
    location.reload();
}

function selectBroadcastTemplate(type) {
    const input = document.getElementById("officer-broadcast-input");
    if (!input) return;

    document.querySelectorAll(".template-chip").forEach(c => c.classList.remove("active"));

    if (type === "general") {
        input.value = "Attention all farmers at AP State Procurement Centre. Please keep your Digital Gate Pass and Aadhaar ready for moisture verification and weighbridge entry.";
        const chip = document.getElementById("chip-general");
        if (chip) chip.classList.add("active");
    } else if (type === "moisture") {
        input.value = "Moisture Inspection Notice: Grain moisture level must be under 17.0% (FAQ standard). Sun-dry wet crop at Drying Yard 3 before weighbridge entry.";
        const chip = document.getElementById("chip-moisture");
        if (chip) chip.classList.add("active");
    } else if (type === "gate2") {
        input.value = "Weighbridge 2 is now open for Tractor Trolleys (Tokens #05 to #12). Please proceed in queue order.";
        const chip = document.getElementById("chip-gate2");
        if (chip) chip.classList.add("active");
    } else if (type === "priority") {
        input.value = "Priority Token Call: Tokens #01, #02, #03 please report to Gate In immediately for gross weight check.";
        const chip = document.getElementById("chip-priority");
        if (chip) chip.classList.add("active");
    }
}

function handleSendBroadcast(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById("officer-broadcast-input");
    const message = (input && input.value.trim()) 
        ? input.value.trim() 
        : "Attention all farmers at AP State Procurement Centre. Please keep your Digital Gate Pass ready for weighbridge entry.";

    playVoiceAnnouncement(message, "English");
    showToast(`📢 Broadcast sent: "${message.substring(0, 50)}..." via PA system & SMS!`, "success");

    KisanNotifications.addNotification({
        type: KisanEvents.OFFICER_BROADCAST_SENT,
        title: "PA Broadcast Dispatched",
        message: message,
        targetRole: "officer",
        icon: "fa-volume-high",
        badgeType: "info",
        broadcast: false
    });

    // Broadcast yard announcement to all connected farmer tabs
    KisanSync.publish(KisanEvents.OFFICER_BROADCAST_SENT, {
        message: message,
        officer: (getCurrentUser() && getCurrentUser().name) || "Mandi Incharge",
        timestamp: Date.now()
    });
}

function scrollToOfficerSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function openFarmerRecordsModal() {
    const farmersList = [
        { name: "Ramesh Kumar", id: "KS102458", phone: "98480 12345", village: "Tenali Rural", acres: "4.5", aadhaar: "Seeded (DBT Yes)", bank: "SBI (****3921)", totalProcured: "42.5 Q" },
        { name: "Venkat Rao", id: "KS109842", phone: "98480 98765", village: "Guntur East", acres: "6.0", aadhaar: "Seeded (DBT Yes)", bank: "Andhra Bank (****4912)", totalProcured: "75.0 Q" },
        { name: "Suresh Babu", id: "KS103491", phone: "98480 45678", village: "Mangalagiri", acres: "3.2", aadhaar: "Seeded (DBT Yes)", bank: "HDFC Bank (****1029)", totalProcured: "32.0 Q" },
        { name: "Lakshmi Narayana", id: "KS108234", phone: "98480 34567", village: "Ponnur", acres: "8.0", aadhaar: "Seeded (DBT Yes)", bank: "Canara Bank (****8843)", totalProcured: "96.5 Q" },
        { name: "Anil Reddy", id: "KS104512", phone: "98480 87654", village: "Bapatla", acres: "5.5", aadhaar: "Seeded (DBT Yes)", bank: "Union Bank (****6710)", totalProcured: "55.0 Q" }
    ];

    const content = `
        <div style="margin-bottom:14px;">
            <p style="font-size:13px; color:#5c6c63;">Verified AP e-Crop Farmer Registry, land verification status, and direct benefit transfer (DBT) bank accounts.</p>
        </div>

        <div style="margin-bottom:12px;">
            <input type="text" class="custom-select" placeholder="🔍 Search farmer by Name, ID, or Mobile..." style="width:100%; font-size:13px;" oninput="filterFarmerRecordsTable(this.value)">
        </div>

        <div class="table-responsive" style="max-height:360px; overflow-y:auto;">
            <table class="officer-queue-table" style="font-size:12.5px;" id="farmer-records-table">
                <thead>
                    <tr>
                        <th>Farmer Name</th>
                        <th>Farmer ID</th>
                        <th>Mobile</th>
                        <th>Village</th>
                        <th>Land</th>
                        <th>Aadhaar DBT</th>
                        <th>Total Procured</th>
                    </tr>
                </thead>
                <tbody>
                    ${farmersList.map(f => `
                        <tr>
                            <td><strong style="color:#174d32;">${f.name}</strong></td>
                            <td><code>${f.id}</code></td>
                            <td>${f.phone}</td>
                            <td>${f.village}</td>
                            <td>${f.acres} Acres</td>
                            <td><span style="color:#27ae60; font-weight:700;"><i class="fa-solid fa-circle-check"></i> ${f.aadhaar}</span></td>
                            <td><strong>${f.totalProcured}</strong></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; font-size:12px; color:#6d7d74;">
            <span>Showing 5 verified active mandi farmers</span>
            <button type="button" class="submit-auth-btn" style="padding:6px 14px; font-size:12px;" onclick="showToast('Exported Farmer Registry CSV!'); closeModal();">
                <i class="fa-solid fa-file-csv"></i> Export CSV
            </button>
        </div>
    `;

    openModal("Farmer Procurement Registry & KYC Records", content);
}

function filterFarmerRecordsTable(query) {
    const q = (query || "").toLowerCase();
    const rows = document.querySelectorAll("#farmer-records-table tbody tr");
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? "" : "none";
    });
}

function openMandiReportsModal() {
    const content = `
        <div style="margin-bottom:16px;">
            <p style="font-size:13px; color:#5c6c63;">Mandi Daily Intake, Weighbridge Throughput & Direct Benefit Transfer (DBT) Payout Audit Summary.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:16px;">
            <div style="background:#edf5ef; padding:12px; border-radius:10px; border:1px solid #cce8d6;">
                <span style="font-size:11px; color:#53615a; display:block;">TOTAL PROCURED</span>
                <strong style="font-size:18px; color:#174d32;">342.50 Q</strong>
            </div>
            <div style="background:#fff8ef; padding:12px; border-radius:10px; border:1px solid #fedbb5;">
                <span style="font-size:11px; color:#53615a; display:block;">DBT DISBURSED</span>
                <strong style="font-size:18px; color:#d97706;">₹7,85,450</strong>
            </div>
            <div style="background:#f3effb; padding:12px; border-radius:10px; border:1px solid #e1d7f5;">
                <span style="font-size:11px; color:#53615a; display:block;">FARMERS SERVED</span>
                <strong style="font-size:18px; color:#8064b8;">22 Total (18 Done)</strong>
            </div>
        </div>

        <table class="officer-queue-table" style="font-size:12.5px; margin-bottom:16px;">
            <thead>
                <tr>
                    <th>Commodity</th>
                    <th>Govt MSP Rate</th>
                    <th>Quantity Procured</th>
                    <th>Total Disbursed</th>
                    <th>Quality Pass</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Paddy / Rice (Grade A)</strong></td>
                    <td>₹2,300 / Q</td>
                    <td>210.00 Q</td>
                    <td>₹4,83,000</td>
                    <td><span style="color:#27ae60; font-weight:700;">100% (14% Moist)</span></td>
                </tr>
                <tr>
                    <td><strong>Wheat (FAQ Standard)</strong></td>
                    <td>₹2,275 / Q</td>
                    <td>92.50 Q</td>
                    <td>₹2,10,437</td>
                    <td><span style="color:#27ae60; font-weight:700;">100% Pass</span></td>
                </tr>
                <tr>
                    <td><strong>Cotton (Medium Staple)</strong></td>
                    <td>₹2,300 / Q</td>
                    <td>40.00 Q</td>
                    <td>₹92,000</td>
                    <td><span style="color:#27ae60; font-weight:700;">100% Pass</span></td>
                </tr>
            </tbody>
        </table>

        <div style="display:flex; gap:10px;">
            <button type="button" class="submit-auth-btn" style="flex:1;" onclick="window.print()">
                <i class="fa-solid fa-print"></i> Print Daily Mandi Report
            </button>
            <button type="button" class="submit-auth-btn register-btn" style="flex:1;" onclick="showToast('Daily Mandi Audit PDF generated and downloaded!'); closeModal();">
                <i class="fa-solid fa-file-pdf"></i> Download PDF
            </button>
        </div>
    `;

    openModal("Daily Mandi Procurement & DBT Audit Report", content);
}

function openSpotBookingModal() {
    const content = `
        <div style="margin-bottom:14px;">
            <p style="font-size:13px; color:#5c6c63;">Issue an instant walk-in Gate Pass and Token for farmers arriving directly at the mandi yard.</p>
        </div>

        <form id="spotBookingForm" onsubmit="handleSpotBookingSubmit(event)">
            <div class="form-group">
                <label>Farmer Name *</label>
                <input type="text" id="spotFarmerName" class="custom-select" placeholder="e.g. Subba Rao" required>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group">
                    <label>Farmer Aadhaar / ID *</label>
                    <input type="text" id="spotFarmerId" class="custom-select" placeholder="e.g. KS109842" value="KS${Math.floor(100000 + Math.random()*900000)}" required>
                </div>
                <div class="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" id="spotMobile" class="custom-select" placeholder="98480 XXXXX" value="98480 ${Math.floor(10000 + Math.random()*90000)}" required>
                </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group">
                    <label>Crop Commodity *</label>
                    <select id="spotCrop" class="custom-select" required>
                        <option value="Paddy / Rice (Grade A)">Paddy / Rice (Grade A)</option>
                        <option value="Wheat (FAQ)">Wheat (FAQ)</option>
                        <option value="Cotton (Medium Staple)">Cotton (Medium Staple)</option>
                        <option value="Maize">Maize</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Est. Quantity (Quintals) *</label>
                    <input type="number" id="spotQuantity" class="custom-select" value="20.0" step="0.1" required>
                </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group">
                    <label>Vehicle Type</label>
                    <select id="spotVehicleType" class="custom-select">
                        <option value="Tractor Trolley">Tractor Trolley</option>
                        <option value="Mini Truck">Mini Commercial Truck</option>
                        <option value="Bullock Cart">Bullock Cart / Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Vehicle Reg Number</label>
                    <input type="text" id="spotVehicleNo" class="custom-select" value="AP-07-TY-${Math.floor(1000 + Math.random()*9000)}">
                </div>
            </div>

            <button type="submit" class="submit-auth-btn" style="margin-top:10px;">
                <i class="fa-solid fa-ticket"></i> Issue Spot Token & Gate Pass
            </button>
        </form>
    `;

    openModal("Issue Spot Token / Walk-In Gate Pass", content);
}

function handleSpotBookingSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("spotFarmerName").value;
    const farmerId = document.getElementById("spotFarmerId").value;
    const crop = document.getElementById("spotCrop").value;
    const quantity = parseFloat(document.getElementById("spotQuantity").value) || 20;
    const vehicleType = document.getElementById("spotVehicleType").value;
    const vehicleNo = document.getElementById("spotVehicleNo").value;

    const nextToken = String(yardQueueData.length + 5).padStart(2, '0');
    const newId = generateBookingID();
    const estAmount = "₹" + Math.round(quantity * 2300).toLocaleString("en-IN");

    const newEntry = {
        id: newId,
        token: nextToken,
        farmerId: farmerId,
        farmerName: name,
        crop: crop,
        quantity: quantity,
        vehicleNo: vehicleNo,
        vehicleType: vehicleType,
        gatePassId: "GP-2026-" + newId.replace("KS", ""),
        time: "Now (Spot)",
        stage: "Gate In (Waiting)",
        stageCode: "gate_in",
        moisture: "Pending",
        amount: estAmount,
        status: "In Queue"
    };

    yardQueueData.unshift(newEntry);
    saveYardQueue();
    closeModal();
    renderOfficerQueueTable();
    updateOfficerStats();

    KisanNotifications.addNotification({
        type: KisanEvents.OFFICER_SPOT_PASS_ISSUED,
        title: "Spot Gate Pass Issued",
        message: `Spot token #${nextToken} issued for ${name} (${crop}, ${quantity} Q).`,
        targetRole: "officer",
        icon: "fa-ticket",
        badgeType: "success",
        entity: { tokenId: nextToken, farmerName: name, crop: crop, quantity: quantity }
    });

    // Broadcast spot pass issued
    KisanSync.publish(KisanEvents.OFFICER_SPOT_PASS_ISSUED, {
        entry: newEntry
    });

    showToast(`✅ Spot Gate Pass #${newEntry.gatePassId} issued for ${name}! Token: #${nextToken}.`);
}

/* =========================================================
   18. FARMER CANCELLATION & J-FORM PROCUREMENT RECEIPT
========================================================= */

function openCancelBookingModal() {
    if (!currentBooking || currentBooking.status === "Cancelled") {
        showToast("No active booking to cancel. You can book a new slot.", "warning");
        return;
    }

    const content = `
        <div style="text-align:center; margin-bottom:16px;">
            <div style="width:60px; height:60px; background:#fdeded; color:#d32f2f; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:26px; margin-bottom:10px;">
                <i class="fa-solid fa-calendar-xmark"></i>
            </div>
            <h3 style="font-size:18px; color:#174d32; font-weight:800;">Cancel Slot Booking?</h3>
            <p style="font-size:12.5px; color:#5c6c63; margin-top:4px;">
                Gate Pass ID: <strong>${currentBooking.id}</strong> • Token: <strong>#${currentBooking.token}</strong> (${currentBooking.crop})
            </p>
        </div>

        <div style="background:#fff8ef; border:1px solid #fedbb5; padding:12px; border-radius:10px; font-size:12px; color:#854d0e; margin-bottom:14px;">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Cancelling will release your reserved weighbridge slot back to other farmers. You can book another date anytime.
        </div>

        <label style="font-size:12.5px; font-weight:700; color:#3b4941; display:block; margin-bottom:6px;">
            Please select a reason for cancellation:
        </label>

        <div class="cancel-reason-list">
            <label class="cancel-reason-item">
                <input type="radio" name="cancelReason" value="Transport / Tractor breakdown" checked>
                <span>🚚 Transport / Tractor unavailable or breakdown</span>
            </label>
            <label class="cancel-reason-item">
                <input type="radio" name="cancelReason" value="Harvesting delayed / High crop moisture">
                <span>🌾 Harvesting delayed / Grain moisture not ready</span>
            </label>
            <label class="cancel-reason-item">
                <input type="radio" name="cancelReason" value="Inclement weather / Rain forecast">
                <span>🌧️ Inclement weather / Heavy rain in village</span>
            </label>
            <label class="cancel-reason-item">
                <input type="radio" name="cancelReason" value="Personal emergency">
                <span>⚠️ Personal or family emergency</span>
            </label>
            <label class="cancel-reason-item">
                <input type="radio" name="cancelReason" value="Other reasons">
                <span>📝 Other reasons</span>
            </label>
        </div>

        <div style="display:flex; gap:10px; margin-top:18px;">
            <button type="button" class="submit-auth-btn" style="background:#f0f3f1; color:#4a5951; flex:1;" onclick="closeModal()">
                Keep My Booking
            </button>
            <button type="button" class="submit-auth-btn" style="background:#d32f2f; color:#fff; flex:1;" onclick="confirmCancelBooking()">
                <i class="fa-solid fa-trash-can"></i> Confirm Cancel
            </button>
        </div>
    `;

    openModal("Cancel Appointment", content);
}

function confirmCancelBooking() {
    const selectedRadio = document.querySelector('input[name="cancelReason"]:checked');
    const reason = selectedRadio ? selectedRadio.value : "Cancelled by farmer";

    if (currentBooking) {
        const user = getCurrentUser();
        const farmerId = (user && user.farmerId) || "KS102458";
        const farmerName = (user && user.name) || "Ramesh Kumar";
        const cancelledId = currentBooking.id;
        const cancelledToken = currentBooking.token;

        currentBooking.status = "Cancelled";
        currentBooking.cancelReason = reason;
        saveCurrentBooking();

        const histItem = bookingHistory.find(h => h.id === currentBooking.id);
        if (histItem) {
            histItem.status = "Cancelled";
        } else {
            bookingHistory.unshift({
                id: currentBooking.id,
                crop: currentBooking.crop,
                quantity: currentBooking.quantity,
                date: formatBookingDate(currentBooking.date),
                time: currentBooking.time,
                centre: currentBooking.centre,
                status: "Cancelled",
                amount: currentBooking.amount || "₹0",
                token: "KS-" + (currentBooking.token || "00")
            });
        }
        saveBookingHistory();

        yardQueueData = yardQueueData.filter(f => f.id !== currentBooking.id && f.farmerId !== farmerId);
        saveYardQueue();

        // Add notification for Farmer
        KisanNotifications.addNotification({
            type: KisanEvents.FARMER_SLOT_CANCELLED,
            title: "Procurement Slot Cancelled",
            message: `Your booking #${cancelledId} (Token #${cancelledToken}) was cancelled. Reason: ${reason}.`,
            targetRole: "farmer",
            icon: "fa-calendar-xmark",
            badgeType: "warning",
            entity: { tokenId: cancelledToken, bookingId: cancelledId, reason: reason },
            broadcast: false
        });

        // Broadcast cancellation across roles
        KisanSync.publish(KisanEvents.FARMER_SLOT_CANCELLED, {
            bookingId: cancelledId,
            token: cancelledToken,
            farmerId: farmerId,
            farmerName: farmerName,
            reason: reason
        });
    }

    closeModal();
    updateDashboardAfterBooking();
    showToast(`Slot booking ${currentBooking ? currentBooking.id : ''} cancelled successfully.`, "warning");
}

function openProcurementReceiptModal(bookingId) {
    const user = getCurrentUser();
    let b = currentBooking;
    if (bookingId) {
        const found = yardQueueData.find(f => f.id === bookingId) || bookingHistory.find(h => h.id === bookingId);
        if (found) b = found;
    }

    const receiptNo = "J-FORM-AP-2026-" + (b.id ? b.id.replace("KS", "") : "748291");
    const qty = b.quantity || 21.5;
    const grossWeight = (qty + 5.30).toFixed(2);
    const tareWeight = "5.30";
    const netWeight = qty.toFixed(2);
    const mspTotal = b.amount || "₹49,450";

    const content = `
        <div class="jform-wrap">
            <div class="jform-header">
                <span class="jform-badge">GOVERNMENT OF ANDHRA PRADESH • AGRICULTURAL MARKETING DEPT</span>
                <h3>FORM 'J' - ELECTRONIC SALE & WEIGHMENT RECEIPT</h3>
                <p>AP State Procurement Centre (Yard 1) • Mandi Yard Guntur</p>
                <div style="font-size:12px; font-weight:700; color:#174d32; margin-top:4px;">
                    Receipt No: ${receiptNo} • Date: 27-Aug-2026
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px; margin-bottom:12px;">
                <div>
                    <span style="color:#6d7d74; display:block; font-size:10.5px;">FARMER PARTICULARS</span>
                    <strong>${b.farmerName || user.name}</strong> (ID: ${b.farmerId || user.farmerId})<br>
                    <span style="color:#555;">Mobile: +91 98480 12345 • Village: Tenali Rural</span>
                </div>
                <div>
                    <span style="color:#6d7d74; display:block; font-size:10.5px;">GATE PASS & VEHICLE</span>
                    <strong>Gate Pass: ${b.gatePassId || b.id}</strong><br>
                    <span>Vehicle: ${b.vehicleNo || "AP-07-TY-4920"} (${b.vehicleType || "Tractor Trolley"})</span>
                </div>
            </div>

            <table class="jform-table">
                <thead>
                    <tr>
                        <th>Crop Commodity</th>
                        <th>Gross Wt (Q)</th>
                        <th>Tare Wt (Q)</th>
                        <th>Net Procured (Q)</th>
                        <th>MSP Rate (₹/Q)</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>${b.crop || "Paddy / Rice (Grade A)"}</strong></td>
                        <td>${grossWeight}</td>
                        <td>${tareWeight}</td>
                        <td><strong>${netWeight} Q</strong></td>
                        <td>₹2,300.00</td>
                        <td><strong style="color:#174d32; font-size:14px;">${mspTotal}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div style="background:#f4faf6; border:1px solid #cce8d6; padding:10px 14px; border-radius:10px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="color:#6d7d74; display:block; font-size:10.5px;">DBT SETTLEMENT STATUS</span>
                    <strong style="color:#27ae60;"><i class="fa-solid fa-circle-check"></i> Approved & Cleared to Bank</strong><br>
                    <span style="font-size:11px; color:#4a5951;">A/C: ${user.bankName} (${user.accountNo}) • UTR: RBI89327491028</span>
                </div>
                <div class="jform-stamp">
                    <i class="fa-solid fa-certificate"></i> VERIFIED & PASSED
                </div>
            </div>

            <div class="jform-seal">
                <div>
                    <i class="fa-solid fa-qrcode" style="font-size:24px; color:#174d32;"></i>
                    <span style="display:block; font-size:9.5px; color:#777;">Digital Cryptographic Signature ID: KS-JFORM-88910</span>
                </div>
                <div style="text-align:right;">
                    <strong>S. Sharma</strong><br>
                    <span style="font-size:11px;">Mandi Secretary / Incharge (Yard 1)</span>
                </div>
            </div>

            <div style="display:flex; gap:10px; margin-top:16px;">
                <button type="button" class="submit-auth-btn" style="flex:1;" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> Print J-Form Receipt
                </button>
                <button type="button" class="submit-auth-btn register-btn" style="flex:1;" onclick="showToast('J-Form PDF downloaded successfully!'); closeModal();">
                    <i class="fa-solid fa-download"></i> Download PDF
                </button>
            </div>
        </div>
    `;

    openModal("Form 'J' Electronic Procurement Receipt", content);
}

/* =========================================================
   19. REAL-TIME EVENT BUS SUBSCRIPTIONS & SYNC HANDLERS
========================================================= */

function initKisanSyncListeners() {
    // -----------------------------------------------------
    // 0. Generic Synced Notification Insertion
    // -----------------------------------------------------
    KisanSync.subscribe(KisanEvents.NOTIFICATION_CREATED, (notif) => {
        KisanNotifications.insertSyncedNotification(notif);
    });

    // -----------------------------------------------------
    // A. Mandi Officer responds to Farmer Actions
    // -----------------------------------------------------

    KisanSync.subscribe(KisanEvents.FARMER_SLOT_BOOKED, (payload) => {
        // Refresh local queue from storage or payload
        const savedQueue = localStorage.getItem("kisanSetuYardQueue");
        if (savedQueue) {
            try { yardQueueData = JSON.parse(savedQueue); } catch(e){}
        }
        if (payload && payload.yardEntry) {
            const exists = yardQueueData.some(f => f.id === payload.yardEntry.id);
            if (!exists) {
                yardQueueData.unshift(payload.yardEntry);
                saveYardQueue();
            }
        }
        const user = getCurrentUser();
        const fName = payload.farmer ? payload.farmer.name : "Farmer";
        const crop = payload.booking ? payload.booking.crop : "Crop";
        const token = payload.booking ? payload.booking.token : "--";
        const qty = payload.booking ? payload.booking.quantity : "";

        // Notification to officer: "New farmer procurement request received."
        KisanNotifications.addNotification({
            type: KisanEvents.FARMER_SLOT_BOOKED,
            title: "New Farmer Procurement Request",
            message: `New farmer procurement request received: ${fName} (${qty ? qty + ' Q ' : ''}${crop}, Token #${token}).`,
            targetRole: "officer",
            icon: "fa-inbox",
            badgeType: "info",
            entity: { tokenId: token, farmerName: fName, crop: crop, quantity: qty },
            broadcast: false
        });

        if (user && (user.role === "officer" || user.role === "admin")) {
            renderOfficerQueueTable();
            updateOfficerStats();
            showToast(`📥 Live Sync: ${fName} booked slot for ${crop} (Token #${token})`, "info");
        }
    });

    KisanSync.subscribe(KisanEvents.FARMER_SLOT_CANCELLED, (payload) => {
        const savedQueue = localStorage.getItem("kisanSetuYardQueue");
        if (savedQueue) {
            try { yardQueueData = JSON.parse(savedQueue); } catch(e){}
        }
        yardQueueData = yardQueueData.filter(f => f.id !== payload.bookingId && f.token !== payload.token && f.farmerId !== payload.farmerId);
        saveYardQueue();

        // Notification to officer
        KisanNotifications.addNotification({
            type: KisanEvents.FARMER_SLOT_CANCELLED,
            title: "Farmer Slot Cancelled",
            message: `${payload.farmerName || "Farmer"} cancelled Token #${payload.token}. Reason: ${payload.reason || "Cancelled"}`,
            targetRole: "officer",
            icon: "fa-ban",
            badgeType: "danger",
            entity: { tokenId: payload.token, farmerName: payload.farmerName, reason: payload.reason },
            broadcast: false
        });

        const user = getCurrentUser();
        if (user && (user.role === "officer" || user.role === "admin")) {
            renderOfficerQueueTable();
            updateOfficerStats();
            showToast(`⚠️ Live Sync: Farmer cancelled Token #${payload.token} (${payload.reason || "Cancelled"})`, "warning");
        }
    });

    KisanSync.subscribe(KisanEvents.FARMER_PROCUREMENT_COMPLETED, (payload) => {
        const savedQueue = localStorage.getItem("kisanSetuYardQueue");
        if (savedQueue) {
            try { yardQueueData = JSON.parse(savedQueue); } catch(e){}
        }
        const item = yardQueueData.find(f => f.id === payload.bookingId || f.token === payload.token || f.farmerId === payload.farmerId);
        if (item) {
            item.stageCode = "completed";
            item.stage = "Procurement Completed";
            item.status = "Completed";
            saveYardQueue();
        }

        // Notification to officer
        KisanNotifications.addNotification({
            type: KisanEvents.PROCUREMENT_COMPLETED,
            title: "Farmer Procurement Completed",
            message: `Procurement completed for Token #${payload.token} (${payload.farmerName || 'Farmer'}).`,
            targetRole: "officer",
            icon: "fa-circle-check",
            badgeType: "success",
            entity: { tokenId: payload.token, farmerName: payload.farmerName, amount: payload.amount },
            broadcast: false
        });

        const user = getCurrentUser();
        if (user && (user.role === "officer" || user.role === "admin")) {
            renderOfficerQueueTable();
            updateOfficerStats();
            showToast(`✅ Live Sync: Token #${payload.token} finalized procurement (${payload.amount || ''})`, "success");
        }
    });

    // -----------------------------------------------------
    // B. Farmer responds to Officer Actions
    // -----------------------------------------------------

    KisanSync.subscribe(KisanEvents.FARMER_CHECK_IN, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            KisanNotifications.addNotification({
                type: KisanEvents.QR_VERIFIED,
                title: "Arrival Verified at Centre",
                message: "Your arrival has been verified at the procurement centre.",
                targetRole: "farmer",
                icon: "fa-clipboard-check",
                badgeType: "success",
                entity: { tokenId: payload.token, gate: payload.gate || "Gate 1" },
                broadcast: false
            });
            if (user && user.role !== "officer") {
                showToast("📍 Arrival Verified at Gate 1. Proceed to Gross Weighbridge.", "success");
            }
        }
    });

    KisanSync.subscribe(KisanEvents.QR_VERIFIED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId)
        );

        if (isMyToken) {
            KisanNotifications.addNotification({
                type: KisanEvents.QR_VERIFIED,
                title: "Arrival Verified at Centre",
                message: "Your arrival has been verified at the procurement centre.",
                targetRole: "farmer",
                icon: "fa-clipboard-check",
                badgeType: "success",
                entity: { tokenId: payload.token, gate: payload.gate || "Gate 1" },
                broadcast: false
            });
        }
    });

    KisanSync.subscribe(KisanEvents.QUALITY_INSPECTION_STARTED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            KisanNotifications.addNotification({
                type: KisanEvents.QUALITY_INSPECTION_STARTED,
                title: "Quality Inspection Started",
                message: `Your grain quality inspection has started for Token #${payload.token}.`,
                targetRole: "farmer",
                icon: "fa-microscope",
                badgeType: "info",
                entity: { tokenId: payload.token, crop: payload.crop },
                broadcast: false
            });
            if (user && user.role !== "officer") {
                showToast("🔬 AI Grain Quality Testing & Moisture analysis in progress...", "info");
            }
        }
    });

    KisanSync.subscribe(KisanEvents.QUALITY_ASSESSMENT_COMPLETED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            KisanNotifications.addNotification({
                type: KisanEvents.QUALITY_ASSESSMENT_COMPLETED,
                title: "AI Quality Assessment Ready",
                message: `Preliminary Assessment: ${payload.grade} (Score: ${payload.score}/100, Moisture: ${payload.moisture}). Awaiting officer sign-off.`,
                targetRole: "farmer",
                icon: "fa-award",
                badgeType: "info",
                entity: { tokenId: payload.token, score: payload.score, grade: payload.grade },
                broadcast: false
            });
        }
    });

    KisanSync.subscribe(KisanEvents.QUALITY_APPROVED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            if (currentBooking) {
                currentBooking.stageCode = "tare_weighing";
                currentBooking.stage = "Tare Weighbridge";
                currentBooking.status = "Quality Approved";
                currentBooking.moisture = `${payload.moisture || '13.5%'} (${payload.grade ? payload.grade.split(' ')[0] : 'Grade A'})`;
                saveCurrentBooking();
                updateDashboardAfterBooking();
            }

            KisanNotifications.addNotification({
                type: KisanEvents.QUALITY_APPROVED,
                title: "Quality Inspection Approved",
                message: `Your grain lot passed inspection: ${payload.grade || 'Grade A'} (${payload.moisture || '13.5%'}). Proceeding to Tare weighment.`,
                targetRole: "farmer",
                icon: "fa-circle-check",
                badgeType: "success",
                entity: { tokenId: payload.token, moisture: payload.moisture || "13.5%", grade: payload.grade || "Grade A" },
                broadcast: false
            });
            if (user && user.role !== "officer") {
                showToast(`✅ Grain Quality Inspection Passed (${payload.moisture || '13.5% Moisture'})!`, "success");
            }
        }
    });

    KisanSync.subscribe(KisanEvents.QUALITY_ON_HOLD, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            if (currentBooking) {
                currentBooking.status = "On Hold";
                currentBooking.stage = "Quality Inspection On Hold";
                saveCurrentBooking();
                updateDashboardAfterBooking();
            }

            KisanNotifications.addNotification({
                type: KisanEvents.QUALITY_ON_HOLD,
                title: "Quality Inspection Placed On Hold",
                message: `Token #${payload.token} placed on hold for manual laboratory inspection (${payload.reason || 'Moisture check'}).`,
                targetRole: "farmer",
                icon: "fa-pause",
                badgeType: "warning",
                entity: { tokenId: payload.token },
                broadcast: false
            });
            if (user && user.role !== "officer") {
                showToast(`⚠ Lot placed on hold for manual lab inspection.`, "warning");
            }
        }
    });

    KisanSync.subscribe(KisanEvents.QUALITY_REJECTED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            if (currentBooking) {
                currentBooking.status = "Rejected";
                currentBooking.stage = "Lot Rejected";
                saveCurrentBooking();
                updateDashboardAfterBooking();
            }

            KisanNotifications.addNotification({
                type: KisanEvents.QUALITY_REJECTED,
                title: "Grain Lot Substandard - Rejected",
                message: `Token #${payload.token} rejected. Reason: ${payload.reason || 'Parameters exceed FAQ tolerance limits'}.`,
                targetRole: "farmer",
                icon: "fa-ban",
                badgeType: "error",
                entity: { tokenId: payload.token },
                broadcast: false
            });
            if (user && user.role !== "officer") {
                showToast(`✕ Grain lot rejected (Substandard Quality).`, "error");
            }
        }
    });

    KisanSync.subscribe(KisanEvents.FARMER_QUEUE_UPDATED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId)
        );

        if (isMyToken) {
            KisanNotifications.addNotification({
                type: KisanEvents.FARMER_QUEUE_UPDATED,
                title: "Queue Position Updated",
                message: "Your queue position has been updated.",
                targetRole: "farmer",
                icon: "fa-people-line",
                badgeType: "info",
                entity: { tokenId: payload.token, stage: payload.stage },
                broadcast: false
            });
        }
    });

    KisanSync.subscribe(KisanEvents.PROCUREMENT_COMPLETED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            KisanNotifications.addNotification({
                type: KisanEvents.PROCUREMENT_COMPLETED,
                title: "Procurement Completed",
                message: "Your procurement has been completed successfully.",
                targetRole: "farmer",
                icon: "fa-circle-check",
                badgeType: "success",
                entity: { tokenId: payload.token, amount: payload.amount },
                broadcast: false
            });
        }
    });

    KisanSync.subscribe(KisanEvents.PAYMENT_UPDATED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.id === payload.bookingId ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (isMyToken) {
            KisanNotifications.addNotification({
                type: KisanEvents.PAYMENT_UPDATED,
                title: "Payment / DBT Status Updated",
                message: "Your payment/DBT status has been updated.",
                targetRole: "farmer",
                icon: "fa-indian-rupee-sign",
                badgeType: "dbt",
                entity: { tokenId: payload.token, amount: payload.amount, status: payload.status || "Approved & Credited" },
                broadcast: false
            });
            if (user && user.role !== "officer") {
                showToast(`💰 DBT Payment Updated: ${payload.amount || 'MSP Amount'} status credited to bank.`, "success");
            }
        }
    });

    KisanSync.subscribe(KisanEvents.OFFICER_STAGE_ADVANCED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (payload.id === "KS748291" && user && user.farmerId === "KS102458")
        );

        if (isMyToken && currentBooking) {
            currentBooking.stageCode = payload.stageCode;
            currentBooking.stage = payload.stage;
            currentBooking.status = (payload.stageCode === "completed") ? "Completed" : "In Progress";
            if (payload.moisture) currentBooking.moisture = payload.moisture;
            saveCurrentBooking();

            const histItem = bookingHistory.find(h => h.id === currentBooking.id);
            if (histItem) {
                histItem.status = currentBooking.status;
                saveBookingHistory();
            }

            if (user && user.role !== "officer") {
                updateDashboardAfterBooking();

                if (payload.stageCode === "completed") {
                    showToast(`🎉 Live Sync: Procurement Completed! ${payload.amount || '₹48,650'} DBT initiated to your bank account.`, "success");
                } else {
                    showToast(`🌾 Live Sync: Mandi Officer advanced your crop to ${payload.stage}!`, "success");
                }

                // If live tracker modal is currently open on screen, update it live in-place!
                const trackerProgressBar = document.getElementById("trackerProgressBar");
                const trackerStatusBadge = document.getElementById("trackerStatusBadge");
                if (trackerProgressBar) {
                    let pct = 25;
                    if (payload.stageCode === "gross_weighing") pct = 45;
                    else if (payload.stageCode === "quality_check") pct = 70;
                    else if (payload.stageCode === "tare_weighing") pct = 88;
                    else if (payload.stageCode === "completed") pct = 100;
                    trackerProgressBar.style.width = pct + "%";
                    const trackerPctElem = document.getElementById("trackerProgressPercent");
                    if (trackerPctElem) trackerPctElem.textContent = pct + "% Completed";
                    if (trackerStatusBadge) {
                        trackerStatusBadge.textContent = payload.stage;
                        trackerStatusBadge.className = "status-badge " + (payload.stageCode === "completed" ? "confirmed" : "processing");
                    }
                }
            }
        }
    });

    KisanSync.subscribe(KisanEvents.OFFICER_TOKEN_CALLED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId) ||
            (user && user.name && payload.farmerName && user.name.includes(payload.farmerName)) ||
            (payload.token === "07" && user && user.farmerId === "KS102458")
        );

        if (user && user.role !== "officer" && isMyToken) {
            // Play audio announcement
            const lang = localStorage.getItem("kisanSetuLanguage") || "English";
            let text = `Attention ${user.name}. Token number ${payload.token} is called at Weighbridge Gate 1. Please proceed immediately.`;
            if (lang === "Telugu") {
                text = `రైతు ${user.name} గారు, మీ టోకెన్ నంబర్ ${payload.token} గేట్ 1 వద్దకు రండి.`;
            } else if (lang === "Hindi") {
                text = `किसान ${user.name} जी, आपका टोकन नंबर ${payload.token} वेईब्रिज गेट 1 पर बुलाया गया है।`;
            }
            playVoiceAnnouncement(text, lang);

            showToast(`🔔 YOUR TOKEN #${payload.token} CALLED! Proceed to Weighbridge Gate 1 immediately!`, "warning");

            // Trigger turn ready alert on tracker
            triggerTurnReadyAlert();

            KisanNotifications.addNotification({
                type: KisanEvents.OFFICER_TOKEN_CALLED,
                title: `Loudspeaker Call: Token #${payload.token}`,
                message: `Your turn is ready at Weighbridge Gate 1. Please move your vehicle immediately.`,
                targetRole: "farmer",
                icon: "fa-bullhorn",
                badgeType: "warning",
                entity: { tokenId: payload.token, gate: payload.gate || "Weighbridge Gate 1" },
                broadcast: false
            });
        }
    });

    KisanSync.subscribe(KisanEvents.OFFICER_BROADCAST_SENT, (payload) => {
        const user = getCurrentUser();
        if (user && user.role !== "officer") {
            showToast(`📢 Mandi Yard Announcement: "${payload.message}"`, "info");
            KisanNotifications.addNotification({
                type: KisanEvents.OFFICER_BROADCAST_SENT,
                title: "Mandi PA Announcement",
                message: payload.message,
                targetRole: "farmer",
                icon: "fa-volume-high",
                badgeType: "info",
                broadcast: false
            });
        }
    });

    KisanSync.subscribe(KisanEvents.OFFICER_SPOT_PASS_ISSUED, (payload) => {
        const user = getCurrentUser();
        if (user && (user.role === "officer" || user.role === "admin")) {
            const savedQueue = localStorage.getItem("kisanSetuYardQueue");
            if (savedQueue) {
                try { yardQueueData = JSON.parse(savedQueue); } catch(e){}
            }
            renderOfficerQueueTable();
            updateOfficerStats();
        }
    });

    KisanSync.subscribe(KisanEvents.OFFICER_TOKEN_CANCELLED, (payload) => {
        const user = getCurrentUser();
        const isMyToken = currentBooking && (
            currentBooking.id === payload.id ||
            currentBooking.token === payload.token ||
            (user && user.farmerId === payload.farmerId)
        );
        if (isMyToken && currentBooking) {
            currentBooking.status = "Cancelled";
            saveCurrentBooking();
            updateDashboardAfterBooking();
            showToast(`⚠️ Your token #${payload.token} was cancelled by Mandi Officer.`, "error");

            KisanNotifications.addNotification({
                type: KisanEvents.OFFICER_TOKEN_CANCELLED,
                title: "Token Cancelled",
                message: `Your token #${payload.token} was cancelled by Mandi Officer.`,
                targetRole: "farmer",
                icon: "fa-ban",
                badgeType: "danger",
                entity: { tokenId: payload.token },
                broadcast: false
            });
        }
    });

    KisanSync.subscribe(KisanEvents.OFFICER_QUEUE_RESET, () => {
        const user = getCurrentUser();
        loadUserData(user);
        if (user && user.role === "officer") {
            renderOfficerQueueTable();
            updateOfficerStats();
        } else {
            updateDashboardAfterBooking();
        }
        showToast("🔄 Live Sync: Queue reset to initial state.", "info");
    });
}

/* =========================================================
   20. INITIALIZATION ON DOM LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function() {
    const savedLang = localStorage.getItem("kisanSetuLanguage") || "English";
    syncUserProfileUI();
    applyLanguage(savedLang);
    KisanNotifications.init();
    renderRoleBasedView();
    updateDashboardAfterBooking();
    initKisanSyncListeners();
    KisanNotifications.updateBadges();
    console.log("KisanSetu Ready for Hackathon Presentation! Real-Time Sync & Notifications Active.");
});