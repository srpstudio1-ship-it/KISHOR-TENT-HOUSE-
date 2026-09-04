let currentLang = 'en';

const translations = {
    en: {
        brandSub: "Complete Event Solution",
        proprietor: "Proprietor: Bhavesh Purohit",
        navServices: "Services", navGallery: "Gallery", navBooking: "Book Now", navContact: "Contact",
        b1: "Hygienic Setup", b2: "Best Quality Material", b3: "Affordable Pricing", b4: "On-Time Service",
        titleServices: "Our Premium Services", titleGallery: "Event Gallery", titleBooking: "Book Your Event",
        s1t: "Tent House & Luxury Decoration", s1d: "Royal Marwadi tents, waterproof canopies, and luxury velvet draping for all events.",
        s2t: "Wedding Mandap & Stage Setup", s2d: "Traditional royal mandaps with flower styling, stage seating, and grand entrances.",
        s3t: "Light Decoration & DJ Sound", s3d: "Ambient LED lighting, fireworks, truss setups, and high-bass professional DJ sound.",
        s4t: "Catering & Crockery Services", s4d: "Hygienic food counters, premium bone china/brass crockery, and trained serving staff.",
        s5t: "Table, Chair & Sofa Rental", s5d: "VIP Maharaja sofas, banquet chairs with covers, and round dining tables.",
        s6t: "Birthday & Special Events", s6d: "Custom themes, balloon arches, flower gates, and lighting setups for private parties.",
        lblName: "Your Full Name", lblPhone: "Phone Number", lblEvent: "Event Type", lblDate: "Event Date", lblMsg: "Additional Requirements",
        btnSubmit: "Confirm Booking via WhatsApp"
    },
    hi: {
        brandSub: "संपूर्ण इवेंट सॉल्यूशन (सभी आयोजनों के लिए सुविधा)",
        proprietor: "प्रोप्राइटर: भावेश पुरोहित",
        navServices: "सेवाएं", navGallery: "गैलरी", navBooking: "बुक करें", navContact: "संपर्क",
        b1: "स्वच्छ व्यवस्था", b2: "उत्कृष्ट गुणवत्ता", b3: "किफायती दरें", b4: "समय पर सेवा",
        titleServices: "हमारी प्रमुख सेवाएं", titleGallery: "फोटो गैलरी", titleBooking: "ऑनलाइन बुकिंग",
        s1t: "टेंट हाउस एवं लक्जरी सजावट", s1d: "शाही मारवाड़ी टेंट, वॉटरप्रूफ शेड और आकर्षक सजावट।",
        s2t: "विवाह मंडप और स्टेज सजावट", s2d: "पारंपरिक शाही मंडप, फूलों की सजावट और भव्य प्रवेश द्वार।",
        s3t: "लाइटिंग एवं डीजे साउंड सिस्टम", s3d: "एलईडी लाइट सजावट, आतिशबाजी और हाई-बेस साउंड सिस्टम।",
        s4t: "कैटरिंग एवं क्रॉकरी सुविधाएं", s4d: "स्वादिष्ट भोजन व्यवस्था, क्रॉकरी सेट और प्रशिक्षित वेटर स्टाफ।",
        s5t: "टेबल, कुर्सी एवं सोफा किराया", s5d: "वीआईपी महाराजा सोफे, बैंक्वेट कुर्सियां और डाइनिंग टेबल।",
        s6t: "जन्मदिन एवं पार्टी सजावट", s6d: "बर्थडे थीम, गुब्बारे, फ्लावर गेट और लाइटिंग सेटअप।",
        lblName: "आपका पूरा नाम", lblPhone: "मोबाइल नंबर", lblEvent: "कार्यक्रम का प्रकार", lblDate: "कार्यक्रम की तिथि", lblMsg: "अन्य विवरण (आवश्यकता)",
        btnSubmit: "व्हाट्सएप द्वारा बुकिंग भेजें"
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    const t = translations[currentLang];
    
    document.getElementById('brand-sub').innerText = t.brandSub;
    document.getElementById('proprietor-text').innerText = t.proprietor;
    document.getElementById('nav-services').innerText = t.navServices;
    document.getElementById('nav-gallery').innerText = t.navGallery;
    document.getElementById('nav-booking').innerText = t.navBooking;
    document.getElementById('nav-contact').innerText = t.navContact;
    
    document.getElementById('b1').innerText = t.b1; 
    document.getElementById('b2').innerText = t.b2;
    document.getElementById('b3').innerText = t.b3; 
    document.getElementById('b4').innerText = t.b4;
    
    document.getElementById('title-services').innerText = t.titleServices;
    document.getElementById('title-gallery').innerText = t.titleGallery;
    document.getElementById('title-booking').innerText = t.titleBooking;

    document.getElementById('s1-t').innerText = t.s1t; 
    document.getElementById('s1-d').innerText = t.s1d;
    document.getElementById('s2-t').innerText = t.s2t; 
    document.getElementById('s2-d').innerText = t.s2d;
    document.getElementById('s3-t').innerText = t.s3t; 
    document.getElementById('s3-d').innerText = t.s3d;
    document.getElementById('s4-t').innerText = t.s4t; 
    document.getElementById('s4-d').innerText = t.s4d;
    document.getElementById('s5-t').innerText = t.s5t; 
    document.getElementById('s5-d').innerText = t.s5d;
    document.getElementById('s6-t').innerText = t.s6t; 
    document.getElementById('s6-d').innerText = t.s6d;

    document.getElementById('lbl-name').innerText = t.lblName;
    document.getElementById('lbl-phone').innerText = t.lblPhone;
    document.getElementById('lbl-event').innerText = t.lblEvent;
    document.getElementById('lbl-date').innerText = t.lblDate;
    document.getElementById('lbl-msg').innerText = t.lblMsg;
    document.getElementById('btn-submit').innerText = t.btnSubmit;
}

function sendToWhatsApp(e) {
    e.preventDefault();
    const phone = "919892880155";
    const name = document.getElementById('cust-name').value;
    const custPhone = document.getElementById('cust-phone').value;
    const event = document.getElementById('cust-event').value;
    const date = document.getElementById('cust-date').value;
    const msg = document.getElementById('cust-msg').value;

    const text = `*NEW EVENT BOOKING ENQUIRY*%0A%0A` +
                 `*Name:* ${name}%0A` +
                 `*Phone:* ${custPhone}%0A` +
                 `*Event Type:* ${event}%0A` +
                 `*Event Date:* ${date}%0A` +
                 `*Details:* ${msg}`;

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function loginAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === "kishor123") {
        document.getElementById('admin-login-box').style.display = 'none';
        document.getElementById('admin-controls').style.display = 'block';
        alert("Admin Login Successful!");
    } else {
        alert("Incorrect Password!");
    }
}

function uploadMedia(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const container = document.getElementById('gallery-container');
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = e.target.result;
            container.prepend(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = e.target.result;
            video.controls = true;
            container.prepend(video);
        }
        alert("Media temporarily added to session gallery!");
    };
    reader.readAsDataURL(file);
}
