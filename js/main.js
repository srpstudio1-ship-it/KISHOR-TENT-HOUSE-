/* ==========================================================================
   KISHOR TENT HOUSE - FULL JAVASCRIPT LOGIC ENGINE
   Features: 15 Master Admin Tools + IndexedDB Permanent Media Storage
   ========================================================================== */

// System Configuration Data
const CONFIG = {
    passcode: "jaimaahinglaj",
    phone: "919892880155",
    gstRate: 0.18
};

// Application State Variables
let db;
let invoiceItems = [];
let totalExpenses = 0;

let publicServices = [
    { id: 1, name: "Tent House & Luxury Decoration", desc: "Royal Marwadi tents & waterproof canopies.", img: "https://wedmeplz.com/wp-content/uploads/2021/06/A-Royal-Rajasthani-Wedding-in-the-Pink-City-The-Maharani-Diaries-45-scaled.jpeg", active: true },
    { id: 2, name: "Wedding Mandap & Stage Setup", desc: "Traditional royal mandaps with flower styling.", img: "https://www.marriagecolours.com/wp-content/uploads/2025/04/Bhavya-Arvind-Wedding-MRC-17.jpg", active: true },
    { id: 3, name: "Light Decoration & DJ Sound", desc: "Ambient LED lighting & high-bass DJ rigs.", img: "https://www.marriagecolours.com/wp-content/uploads/2025/10/Sindhu-Raghavan-Saravana-Raj-Reception-Apr-22-Sree-Varaaham-9.jpg", active: true }
];

// Document Initialization & IndexedDB Setup
document.addEventListener("DOMContentLoaded", () => {
    renderPublicServices();
    renderServiceToggleTable();
    initIndexedDB();
});

/* ==========================================================================
   INDEXEDDB DATABASE SETUP (PERMANENT MEDIA STORAGE)
   ========================================================================== */
function initIndexedDB() {
    const dbRequest = indexedDB.open("KishorTentGalleryDB", 1);

    dbRequest.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("photos")) {
            db.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
        }
    };

    dbRequest.onsuccess = function(event) {
        db = event.target.result;
        loadSavedGallery();
    };

    dbRequest.onerror = function(event) {
        console.error("IndexedDB Storage Error:", event.target.errorCode);
    };
}

/* ==========================================================================
   CORE SYSTEM UTILITIES & NAVIGATION
   ========================================================================== */
function toggleLanguage() {
    alert("Language toggled between English & Hindi.");
}

function unlockAdmin() {
    const pass = document.getElementById('adminPassInput').value;
    if (pass === CONFIG.passcode) {
        document.getElementById('admin-login-box').style.display = 'none';
        document.getElementById('lockBtn').style.display = 'inline-block';
        document.getElementById('admin-main-body').style.display = 'block';
        alert("Owner Security Authenticated! Console Unlocked.");
    } else {
        alert("Invalid Admin Password!");
    }
}

function lockAdmin() {
    document.getElementById('admin-login-box').style.display = 'inline-block';
    document.getElementById('lockBtn').style.display = 'none';
    document.getElementById('admin-main-body').style.display = 'none';
    document.getElementById('adminPassInput').value = '';
}

function switchAdminTab(tabId, btn) {
    document.querySelectorAll('.admin-feature-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

function renderPublicServices() {
    const container = document.getElementById('services-container');
    if (!container) return;
    container.innerHTML = '';
    publicServices.filter(s => s.active).forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-img-wrapper"><img src="${s.img}" alt="${s.name}"></div>
            <div class="service-content">
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ==========================================================================
   FEATURE 1: GST INVOICE BUILDER
   ========================================================================== */
function addInvoiceItem() {
    const desc = document.getElementById('invDesc').value;
    const qty = parseFloat(document.getElementById('invQty').value) || 0;
    const rate = parseFloat(document.getElementById('invRate').value) || 0;

    if (!desc || qty <= 0 || rate <= 0) return alert("Fill valid item description, qty, and rate.");

    const total = qty * rate;
    invoiceItems.push({ desc, qty, rate, total });
    renderInvoiceTable();

    document.getElementById('invDesc').value = '';
    document.getElementById('invQty').value = '';
    document.getElementById('invRate').value = '';
}

function renderInvoiceTable() {
    const tbody = document.querySelector('#invoiceTable tbody');
    tbody.innerHTML = '';
    let subtotal = 0;

    invoiceItems.forEach((item, index) => {
        subtotal += item.total;
        tbody.innerHTML += `
            <tr>
                <td>${item.desc}</td>
                <td>${item.qty}</td>
                <td>₹${item.rate.toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
                <td><button class="btn-danger" onclick="invoiceItems.splice(${index},1);renderInvoiceTable();">X</button></td>
            </tr>`;
    });

    const tax = subtotal * CONFIG.gstRate;
    document.getElementById('invSub').innerText = subtotal.toFixed(2);
    document.getElementById('invTax').innerText = tax.toFixed(2);
    document.getElementById('invGrand').innerText = (subtotal + tax).toFixed(2);
}

function printInvoice() {
    const client = document.getElementById('invClient').value || "Valued Client";
    document.getElementById('pClient').innerText = client;
    document.getElementById('pDate').innerText = new Date().toLocaleDateString();

    const pBody = document.getElementById('pTableBody');
    pBody.innerHTML = '';
    let subtotal = 0;

    invoiceItems.forEach(i => {
        subtotal += i.total;
        pBody.innerHTML += `<tr><td>${i.desc}</td><td>${i.qty}</td><td>₹${i.rate.toFixed(2)}</td><td>₹${i.total.toFixed(2)}</td></tr>`;
    });

    const tax = subtotal * CONFIG.gstRate;
    document.getElementById('pSub').innerText = subtotal.toFixed(2);
    document.getElementById('pTax').innerText = tax.toFixed(2);
    document.getElementById('pGrand').innerText = (subtotal + tax).toFixed(2);

    const printContents = document.getElementById('printableInvoice').innerHTML;
    const win = window.open('', '', 'height=600,width=800');
    win.document.write(`<html><body>${printContents}</body></html>`);
    win.document.close();
    win.print();
}

/* ==========================================================================
   FEATURE 2: BOOKING MANAGER & PUBLIC FORM SYNC
   ========================================================================== */
function submitCustomerBooking(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const eventType = document.getElementById('custEvent').value;
    const date = document.getElementById('custDate').value;
    const msg = document.getElementById('custMsg').value;

    const tbody = document.querySelector('#bookingManagerTable tbody');
    if (tbody) {
        tbody.innerHTML += `
            <tr>
                <td>${name}</td>
                <td>${phone}</td>
                <td>${eventType}</td>
                <td>${date}</td>
                <td><span style="color:orange;">Pending</span></td>
                <td><button class="btn-success" onclick="this.parentElement.previousElementSibling.innerHTML='<span style=\\'color:green;\\'>Confirmed</span>'">Confirm</button></td>
            </tr>`;
    }

    const text = `*New Booking Request*%0AName: ${name}%0APhone: ${phone}%0AEvent: ${eventType}%0ADate: ${date}%0ADetails: ${msg}`;
    window.open(`https://wa.me/${CONFIG.phone}?text=${text}`, '_blank');
}

/* ==========================================================================
   FEATURE 3: INVENTORY TRACKER
   ========================================================================== */
function addInventoryItem() {
    const name = document.getElementById('invItemName').value;
    const total = parseInt(document.getElementById('invItemTotal').value) || 0;

    if (!name || total <= 0) return alert("Specify valid inventory item and count.");

    const tbody = document.querySelector('#inventoryTable tbody');
    tbody.innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${total} Units</td>
            <td>0 Units</td>
            <td>${total} Units</td>
            <td><button class="btn-danger" onclick="this.parentElement.parentElement.remove()">Delete</button></td>
        </tr>`;

    document.getElementById('invItemName').value = '';
    document.getElementById('invItemTotal').value = '';
}

/* ==========================================================================
   FEATURE 4: PAYMENT LEDGER
   ========================================================================== */
function addLedgerEntry() {
    const name = document.getElementById('payClient').value;
    const total = parseFloat(document.getElementById('payTotal').value) || 0;
    const adv = parseFloat(document.getElementById('payAdvance').value) || 0;

    if (!name || total <= 0) return alert("Enter client name and valid total bill.");

    const due = total - adv;
    const status = due <= 0 ? '<span style="color:green;">Paid</span>' : `<span style="color:red;">Due ₹${due.toFixed(2)}</span>`;

    document.querySelector('#ledgerTable tbody').innerHTML += `
        <tr>
            <td>${name}</td>
            <td>₹${total.toFixed(2)}</td>
            <td>₹${adv.toFixed(2)}</td>
            <td>₹${due.toFixed(2)}</td>
            <td>${status}</td>
        </tr>`;

    document.getElementById('payClient').value = '';
    document.getElementById('payTotal').value = '';
    document.getElementById('payAdvance').value = '';
}

/* ==========================================================================
   FEATURE 5: BAD DEBT WHATSAPP REMINDER
   ========================================================================== */
function sendDebtReminder() {
    const name = document.getElementById('debtName').value;
    const phone = document.getElementById('debtPhone').value;
    const amt = document.getElementById('debtAmount').value;

    if (!name || !phone || !amt) return alert("Fill all debt details.");

    const msg = `Dear *${name}*, This is an official payment balance reminder from *Kishor Tent House*. You have an outstanding balance of *₹${amt}*. Kindly clear the payment at your earliest convenience. Contact: +91 98928 80155`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ==========================================================================
   FEATURE 6: LIVE GALLERY UPLOAD ENGINE (INDEXEDDB PERMANENT STORAGE)
   ========================================================================== */
function uploadToGallery(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const mediaData = {
            data: event.target.result,
            type: file.type
        };

        const transaction = db.transaction(["photos"], "readwrite");
        const store = transaction.objectStore("photos");
        const addRequest = store.add(mediaData);

        addRequest.onsuccess = function() {
            renderMediaItem(mediaData.data, mediaData.type, addRequest.result);
            alert("Media published and permanently stored on device!");
        };
    };
    reader.readAsDataURL(file);
}

function loadSavedGallery() {
    if (!db) return;
    const transaction = db.transaction(["photos"], "readonly");
    const store = transaction.objectStore("photos");
    const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            renderMediaItem(cursor.value.data, cursor.value.type, cursor.key);
            cursor.continue();
        }
    };
}

function renderMediaItem(src, type, id) {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.id = `media-item-${id}`;

    const isImage = type.startsWith('image/');
    const mediaTag = isImage ? `<img src="${src}" alt="Gallery Item">` : `<video src="${src}" controls></video>`;

    div.innerHTML = `
        ${mediaTag}
        <button class="gallery-delete-btn" title="Delete Photo" onclick="deleteSavedPhoto(${id})">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    container.prepend(div);
}

function deleteSavedPhoto(id) {
    if (!confirm("Are you sure you want to permanently delete this photo?")) return;

    const transaction = db.transaction(["photos"], "readwrite");
    const store = transaction.objectStore("photos");
    store.delete(id);

    transaction.oncomplete = function() {
        const item = document.getElementById(`media-item-${id}`);
        if (item) item.remove();
    };
}

/* ==========================================================================
   FEATURE 7: PRICE RATE CARD EDITOR
   ========================================================================== */
function addRateCardItem() {
    const item = document.getElementById('rateItem').value;
    const price = parseFloat(document.getElementById('ratePrice').value) || 0;

    if (!item || price <= 0) return alert("Enter item and valid price.");

    document.querySelector('#rateCardTable tbody').innerHTML += `
        <tr>
            <td>${item}</td>
            <td>₹${price.toFixed(2)}</td>
            <td><button class="btn-danger" onclick="this.parentElement.parentElement.remove()">Remove</button></td>
        </tr>`;

    document.getElementById('rateItem').value = '';
    document.getElementById('ratePrice').value = '';
}

/* ==========================================================================
   FEATURE 8: VENDOR EXPENSE LOGGER
   ========================================================================== */
function logExpense() {
    const title = document.getElementById('expName').value;
    const amt = parseFloat(document.getElementById('expAmount').value) || 0;
    const cat = document.getElementById('expCategory').value;

    if (!title || amt <= 0) return alert("Enter valid expense title and amount.");

    totalExpenses += amt;
    document.querySelector('#expenseTable tbody').innerHTML += `
        <tr>
            <td>${title}</td>
            <td>${cat}</td>
            <td>₹${amt.toFixed(2)}</td>
        </tr>`;

    document.getElementById('totalExpOut').innerText = totalExpenses.toFixed(2);
    document.getElementById('expName').value = '';
    document.getElementById('expAmount').value = '';
}

/* ==========================================================================
   FEATURE 9: CALENDAR BOOKING DATE LOCK
   ========================================================================== */
function lockDate() {
    const date = document.getElementById('lockDateInput').value;
    const reason = document.getElementById('lockDateReason').value;

    if (!date) return alert("Select a valid date to lock.");

    document.querySelector('#calendarTable tbody').innerHTML += `
        <tr>
            <td>${date}</td>
            <td>${reason || 'Reserved'}</td>
            <td><span style="color:red; font-weight:bold;">LOCKED</span></td>
        </tr>`;

    document.getElementById('lockDateInput').value = '';
    document.getElementById('lockDateReason').value = '';
}

/* ==========================================================================
   FEATURE 10: QUOTATION GENERATOR
   ========================================================================== */
function generateQuotation() {
    const client = document.getElementById('qClient').value || "Client";
    const eventType = document.getElementById('qEvent').value || "Event";
    const guests = parseInt(document.getElementById('qGuests').value) || 0;
    const rate = parseFloat(document.getElementById('qRatePerGuest').value) || 0;

    if (guests <= 0 || rate <= 0) return alert("Specify valid guest count and rate per guest.");

    const total = guests * rate;
    document.getElementById('qDetails').innerText = `Prepared for: ${client} | Event: ${eventType} | Guest Count: ${guests} @ ₹${rate}/guest`;
    document.getElementById('qTotal').innerText = total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    document.getElementById('quotationOutput').style.display = 'block';
}

/* ==========================================================================
   FEATURE 11: WORKER STAFF ALLOCATOR
   ========================================================================== */
function assignStaff() {
    const name = document.getElementById('staffName').value;
    const role = document.getElementById('staffRole').value;
    const venue = document.getElementById('staffVenue').value;

    if (!name || !role) return alert("Fill worker name and assigned role.");

    document.querySelector('#staffTable tbody').innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${role}</td>
            <td>${venue || 'Unassigned'}</td>
            <td><button class="btn-danger" onclick="this.parentElement.parentElement.remove()">Unassign</button></td>
        </tr>`;

    document.getElementById('staffName').value = '';
    document.getElementById('staffRole').value = '';
    document.getElementById('staffVenue').value = '';
}

/* ==========================================================================
   FEATURE 12: PUBLIC SERVICE TOGGLE MANAGER
   ========================================================================== */
function renderServiceToggleTable() {
    const tbody = document.querySelector('#serviceToggleTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    publicServices.forEach((s, idx) => {
        tbody.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.active ? '<span style="color:green; font-weight:bold;">Live</span>' : '<span style="color:red; font-weight:bold;">Hidden</span>'}</td>
                <td><button class="btn-gold" onclick="toggleServiceActive(${idx})">Toggle</button></td>
            </tr>`;
    });
}

function toggleServiceActive(idx) {
    publicServices[idx].active = !publicServices[idx].active;
    renderServiceToggleTable();
    renderPublicServices();
}

/* ==========================================================================
   FEATURE 13: TRANSPORT DISPATCH TRACKER
   ========================================================================== */
function dispatchTruck() {
    const no = document.getElementById('truckNo').value;
    const driver = document.getElementById('truckDriver').value;
    const venue = document.getElementById('truckVenue').value;

    if (!no) return alert("Specify truck registration number.");

    document.querySelector('#truckTable tbody').innerHTML += `
        <tr>
            <td>${no}</td>
            <td>${driver || 'N/A'}</td>
            <td>${venue || 'In-transit'}</td>
            <td><span style="color:orange; font-weight:bold;">In-Transit</span></td>
        </tr>`;

    document.getElementById('truckNo').value = '';
    document.getElementById('truckDriver').value = '';
    document.getElementById('truckVenue').value = '';
}

/* ==========================================================================
   FEATURE 14: CUSTOMER REVIEW MODERATION
   ========================================================================== */
function addCustomerReview() {
    const name = document.getElementById('revClient').value;
    const text = document.getElementById('revText').value;

    if (!name || !text) return alert("Fill review author and comment.");

    document.querySelector('#reviewTable tbody').innerHTML += `
        <tr>
            <td>${name}</td>
            <td>"${text}"</td>
            <td><button class="btn-success" onclick="alert('Review approved & highlighted!')">Approve</button></td>
        </tr>`;

    document.getElementById('revClient').value = '';
    document.getElementById('revText').value = '';
}

/* ==========================================================================
   FEATURE 15: SETTLEMENT DISCOUNT CALCULATOR
   ========================================================================== */
function calcDiscount() {
    const bill = parseFloat(document.getElementById('discBill').value) || 0;
    const pct = parseFloat(document.getElementById('discPct').value) || 0;

    if (bill <= 0) return alert("Enter valid total bill amount.");

    const discAmt = (bill * pct) / 100;
    const finalPay = bill - discAmt;

    document.getElementById('discAmtOut').innerText = discAmt.toFixed(2);
    document.getElementById('finalPayOut').innerText = finalPay.toFixed(2);
    document.getElementById('discResult').style.display = 'block';
}
