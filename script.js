/* =========================================================
   KISANSETU — FARMER PROCUREMENT PORTAL
   COMPLETE INTERACTION SYSTEM & MULTI-LANGUAGE ENGINE
   Ministry of Consumer Affairs, Food & Public Distribution (DoCA)
========================================================= */

console.log("KisanSetu JavaScript Initialized Successfully");

/* =========================================================
   1. MULTI-LANGUAGE TRANSLATION DICTIONARIES
========================================================= */

const translations = {
    English: {
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
        voiceAlertBtn: "Play Voice Announcement",
        allNotifReadSuccess: "All notifications marked as read.",
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
        notificationsTitle: "सूचना एवं अलर्ट केंद्र",
        markAllRead: "सभी पढ़ी गई चिह्नित करें",
        voiceAlertBtn: "आवाज में सूचना सुनें",
        allNotifReadSuccess: "सभी सूचनाएं पढ़ ली गईं।",
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
        notificationsTitle: "నోటిఫికేషన్ & హెచ్చరిక కేంద్రం",
        markAllRead: "అన్నీ చదివినట్లు గుర్తించు",
        voiceAlertBtn: "వాయిస్ అనౌన్స్‌మెంట్ వినండి",
        allNotifReadSuccess: "అన్ని నోటిఫికేషన్లు చదివినట్లు గుర్తించబడ్డాయి.",
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
        downloadSlip: "DBT ரசீது பதிவிறக்கம்",
        notificationsTitle: "அறிவிப்பு மையம்",
        markAllRead: "அனைத்தையும் படித்ததாக குறிக்கவும்",
        voiceAlertBtn: "குரல் அறிவிப்பைக் கேட்க",
        allNotifReadSuccess: "அனைத்து அறிவிப்புகளும் படிக்கப்பட்டன.",
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
        downloadSlip: "DBT ರಸೀದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
        notificationsTitle: "ಅಧಿಸೂಚನೆ ಕೇಂದ್ರ",
        markAllRead: "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
        voiceAlertBtn: "ಧ್ವನಿ ಅಧಿಸೂಚನೆ ಕೇಳಿ",
        allNotifReadSuccess: "ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳನ್ನು ಓದಲಾಗಿದೆ.",
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
        notificationsTitle: "അറിയിപ്പ് കേന്ദ്രം",
        markAllRead: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക",
        voiceAlertBtn: "വോയ്‌സ് അറിയിപ്പ് കേൾക്കുക",
        allNotifReadSuccess: "എല്ലാ അറിയിപ്പുകളും വായിച്ചു.",
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
            crop: "Paddy / Rice",
            quantity: 21.5,
            date: "2026-08-27",
            time: "10:30 AM",
            centre: "AP State Procurement Centre",
            vehicleType: "Tractor Trolley",
            vehicleNo: "AP-07-TY-4920",
            token: "07",
            status: "Confirmed",
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
        stage: "Gross Weighbridge",
        stageCode: "gross_weighing",
        moisture: "14.2% (Pass)",
        amount: "₹49,450",
        status: "In Progress"
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

                <div class="gate-pass-qr">
                    <i class="fa-solid fa-qrcode"></i>
                    <small>${booking.id}</small>
                </div>
            </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:16px;">
            <button type="button" class="submit-auth-btn" style="flex:1;" onclick="simulateSmsPass('${booking.id}', '${booking.token}')">
                <i class="fa-solid fa-comment-sms"></i>
                <span>Simulate SMS Alert</span>
            </button>
            <button type="button" class="submit-auth-btn register-btn" style="flex:1;" onclick="window.print()">
                <i class="fa-solid fa-print"></i>
                <span>Print Gate Pass</span>
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

    currentBooking.status = "Cancelled";
    saveCurrentBooking();

    const histItem = bookingHistory.find(h => h.id === currentBooking.id);
    if (histItem) histItem.status = "Cancelled";
    saveBookingHistory();

    const farmerId = (getCurrentUser() && getCurrentUser().farmerId) || "KS102458";
    yardQueueData = yardQueueData.filter(f => f.id !== currentBooking.id && f.farmerId !== farmerId);
    saveYardQueue();

    closeModal();
    updateDashboardAfterBooking();
    showToast("Procurement booking cancelled successfully.", "warning");
}

function farmerCompleteProcurement() {
    if (!currentBooking || currentBooking.status === "Completed") {
        showToast("No active procurement in progress.", "warning");
        return;
    }

    currentBooking.status = "Completed";
    saveCurrentBooking();

    const histItem = bookingHistory.find(h => h.id === currentBooking.id);
    if (histItem) histItem.status = "Completed";
    saveBookingHistory();

    const farmerId = (getCurrentUser() && getCurrentUser().farmerId) || "KS102458";
    const queueItem = yardQueueData.find(f => f.id === currentBooking.id || f.farmerId === farmerId);
    if (queueItem) {
        queueItem.stageCode = "completed";
        queueItem.stage = "Procurement Completed";
        queueItem.status = "Completed";
        saveYardQueue();
    }

    closeModal();
    updateDashboardAfterBooking();
    showToast("✅ Procurement completed! ₹48,650 DBT settlement initiated.", "success");
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

const notificationsList = [
    {
        id: 1,
        title: "Queue Alert: Weighbridge Counter 2 Ready",
        time: "10 mins ago",
        desc: "Your Token #KS-07 has been called at AP State Centre Counter 2. Please proceed for weighing.",
        icon: "fa-bullhorn",
        unread: true
    },
    {
        id: 2,
        title: "DBT Payment Batch Initiated (₹48,650)",
        time: "1 hour ago",
        desc: "Sanction order generated for 21.5 Quintals Paddy under DoCA MSP. Funds in transit to your SBI account.",
        icon: "fa-indian-rupee-sign",
        unread: true
    },
    {
        id: 3,
        title: "Slot Confirmation for 27 Aug 10:30 AM",
        time: "Today · 09:42 AM",
        desc: "Digital gate pass #KS748291 generated. Mandi entrance access granted.",
        icon: "fa-calendar-check",
        unread: true
    },
    {
        id: 4,
        title: "Weather Advisory: Clear skies at Mandi",
        time: "Yesterday",
        desc: "Optimal harvest and transport conditions for Paddy & Wheat delivery.",
        icon: "fa-cloud-sun",
        unread: false
    }
];

function openNotifications() {
    const listHtml = notificationsList.map(n => `
        <div style="background:${n.unread ? '#f3faf5' : '#ffffff'}; border:1px solid ${n.unread ? '#bde5cb' : '#e2eae4'}; border-radius:14px; padding:16px; margin-bottom:10px; display:flex; gap:14px; align-items:flex-start;">
            <div style="width:38px; height:38px; border-radius:10px; background:${n.unread ? '#e8f5ed' : '#f0f4f1'}; color:${n.unread ? '#26734d' : '#6f7f75'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i class="fa-solid ${n.icon}"></i>
            </div>
            <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:13.5px; color:#174d32;">${n.title}</strong>
                    <span style="font-size:11px; color:#7d8f84;">${n.time}</span>
                </div>
                <p style="font-size:12.5px; color:#495a50; margin-top:4px; line-height:1.4;">${n.desc}</p>
            </div>
        </div>
    `).join("");

    const content = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <button type="button" class="text-btn" onclick="playVoiceAnnouncement()">
                <i class="fa-solid fa-volume-high"></i>
                <span>${t("voiceAlertBtn")}</span>
            </button>
            <button type="button" class="text-btn" onclick="markAllNotificationsRead()">
                <i class="fa-solid fa-check-double"></i>
                <span>${t("markAllRead")}</span>
            </button>
        </div>
        <div>
            ${listHtml}
        </div>
    `;

    openModal(t("notificationsTitle"), content);
}

function markAllNotificationsRead() {
    notificationsList.forEach(n => n.unread = false);
    const badge = document.getElementById("sidebar-notification-badge");
    const dot = document.getElementById("topbar-notif-dot");
    if (badge) badge.textContent = "0";
    if (dot) dot.style.display = "none";
    closeModal();
    showToast(t("allNotifReadSuccess"));
}

function playVoiceAnnouncement() {
    const lang = localStorage.getItem("kisanSetuLanguage") || "English";
    let text = "Dear Ramesh Kumar, your token number KS-07 is called for crop weighing at Gate 2. Please proceed.";
    if (lang === "Telugu") {
        text = "రైతు రమేష్ కుమార్ గారు, మీ టోకెన్ నంబర్ KS-07 తూకం కోసం కౌంటర్ 2 వద్దకు రండి.";
    } else if (lang === "Hindi") {
        text = "किसान रमेश कुमार जी, आपका टोकन नंबर KS-07 तौल काउंटर 2 पर बुलाया गया है। कृपया आगे बढ़ें।";
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
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
            case "history":
                openHistory();
                break;
            case "payment":
                openPayment();
                break;
            case "notifications":
                openNotifications();
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
    } else if (item.stageCode === "gross_weighing") {
        item.stageCode = "quality_check";
        item.stage = "Quality Inspected";
        item.moisture = "14.0% (Pass)";
        showToast(`Token #${item.token} Quality verified & moisture tested: 14.0%.`);
    } else if (item.stageCode === "quality_check") {
        item.stageCode = "tare_weighing";
        item.stage = "Tare Weighbridge";
        showToast(`Token #${item.token} moved to Empty Vehicle (Tare) Weighing.`);
    } else if (item.stageCode === "tare_weighing") {
        item.stageCode = "completed";
        item.stage = "Procurement Completed";
        item.status = "Completed";
        showToast(`Token #${item.token} Weighment complete! ₹${item.amount} DBT payout queued.`, "success");
    }

    if (currentBooking && (currentBooking.id === id || id === "KS748291")) {
        currentBooking.stageCode = item.stageCode;
        currentBooking.stage = item.stage;
        currentBooking.status = item.status;
        saveCurrentBooking();
        updateDashboardAfterBooking();
    }

    saveYardQueue();
    renderOfficerQueueTable();
    updateOfficerStats();
}

function officerCompleteProcurement(id) {
    const item = yardQueueData.find(f => f.id === id);
    if (!item) return;

    item.stageCode = "completed";
    item.stage = "Procurement Completed";
    item.status = "Completed";

    if (currentBooking && (currentBooking.id === id || id === "KS748291")) {
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
    showToast(`✅ Procurement finalized for Token #${item.token} (${item.farmerName})! J-Form created and DBT released.`, "success");
}

function officerCancelFarmerToken(id) {
    const item = yardQueueData.find(f => f.id === id);
    if (!item) return;

    const confirmed = confirm(`Are you sure you want to cancel Token #${item.token} for ${item.farmerName}?`);
    if (!confirmed) return;

    yardQueueData = yardQueueData.filter(f => f.id !== id);
    saveYardQueue();

    if (currentBooking && currentBooking.id === id) {
        currentBooking.status = "Cancelled";
        saveCurrentBooking();
        updateDashboardAfterBooking();
    }

    renderOfficerQueueTable();
    updateOfficerStats();
    showToast(`⚠️ Token #${item.token} (${item.farmerName}) removed from yard queue.`, "warning");
}

function officerCallFarmerToken(token, name) {
    const text = `Attention please. Token number ${token}, Farmer ${name}, please report to Weighbridge Gate 1 immediately.`;
    playVoiceAnnouncement(text, "English");
    showToast(`📢 Token #${token} (${name}) called over yard loudspeaker!`, "info");
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

        yardQueueData = yardQueueData.filter(f => f.id !== currentBooking.id);
        saveYardQueue();
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
   19. INITIALIZATION ON DOM LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function() {
    const savedLang = localStorage.getItem("kisanSetuLanguage") || "English";
    syncUserProfileUI();
    applyLanguage(savedLang);
    renderRoleBasedView();
    updateDashboardAfterBooking();
    console.log("KisanSetu Ready for Hackathon Presentation!");
});