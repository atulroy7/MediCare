const makeProductImage = (title, subtitle, brand, category, bg1, bg2, accentColor, iconSvg) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${bg1}"/>
                <stop offset="100%" stop-color="${bg2}"/>
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.12"/>
            </filter>
        </defs>
        <rect width="800" height="800" fill="url(#bg)"/>
        <circle cx="680" cy="120" r="200" fill="${accentColor}" opacity="0.12"/>
        <circle cx="100" cy="700" r="220" fill="${accentColor}" opacity="0.08"/>
        
        <!-- Inner Card -->
        <rect x="80" y="80" width="640" height="640" rx="36" fill="#ffffff" opacity="0.95" filter="url(#shadow)"/>
        
        <!-- Category Pill -->
        <rect x="120" y="120" width="220" height="40" rx="20" fill="${accentColor}" opacity="0.12"/>
        <text x="230" y="145" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${accentColor}" text-anchor="middle" letter-spacing="1.5">${category.toUpperCase()}</text>
        
        <!-- Cross Badge -->
        <circle cx="640" cy="140" r="20" fill="${accentColor}"/>
        <path d="M632 140h16M640 132v16" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
        
        <!-- Icon Graphic Container -->
        <g transform="translate(400, 310)">
            ${iconSvg}
        </g>
        
        <!-- Title and Subtitle -->
        <text x="400" y="520" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#0f172a" text-anchor="middle">${title}</text>
        <text x="400" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="600" fill="#64748b" text-anchor="middle">${subtitle}</text>
        
        <!-- Brand Footer -->
        <line x1="180" y1="605" x2="620" y2="605" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="400" y="640" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${accentColor}" text-anchor="middle" letter-spacing="2">AUTHENTIC • ${brand.toUpperCase()}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// SVG Icon Graphics
const pillIcon = `<g transform="translate(-60, -60)">
    <rect x="20" y="20" width="80" height="80" rx="40" fill="#a855f7" opacity="0.2"/>
    <path d="M30 70 L70 30 C80 20 95 20 105 30 C115 40 115 55 105 65 L65 105 C55 115 40 115 30 105 C20 95 20 80 30 70 Z" fill="#9333ea"/>
    <path d="M50 50 L85 85" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
</g>`;

const bottleIcon = `<g transform="translate(-40, -70)">
    <rect x="25" y="10" width="30" height="15" rx="4" fill="#7e22ce"/>
    <rect x="33" y="25" width="14" height="20" fill="#7e22ce" opacity="0.6"/>
    <rect x="10" y="45" width="60" height="85" rx="12" fill="#9333ea"/>
    <rect x="20" y="65" width="40" height="45" rx="6" fill="#ffffff" opacity="0.9"/>
    <path d="M30 87h20M40 77v20" stroke="#9333ea" stroke-width="4" stroke-linecap="round"/>
</g>`;

const gelTubeIcon = `<g transform="translate(-40, -70)">
    <polygon points="20,10 60,10 50,30 30,30" fill="#d97706"/>
    <path d="M25 30 L55 30 L65 120 C65 130 55 135 40 135 C25 135 15 130 15 120 Z" fill="#f59e0b"/>
    <rect x="25" y="55" width="30" height="50" rx="4" fill="#ffffff" opacity="0.9"/>
</g>`;

const vitaminIcon = `<g transform="translate(-50, -50)">
    <circle cx="50" cy="50" r="45" fill="#d97706" opacity="0.2"/>
    <polygon points="50,15 62,38 87,42 68,60 73,85 50,73 27,85 32,60 13,42 38,38" fill="#d97706"/>
</g>`;

const faceWashIcon = `<g transform="translate(-40, -70)">
    <rect x="28" y="10" width="24" height="15" fill="#0891b2"/>
    <path d="M20 25 L60 25 L70 120 C70 130 55 135 40 135 C25 135 10 130 10 120 Z" fill="#06b6d4"/>
    <circle cx="40" cy="75" r="18" fill="#ffffff" opacity="0.9"/>
    <path d="M40 65 Q48 75 40 85 Q32 75 40 65 Z" fill="#06b6d4"/>
</g>`;

const creamJarIcon = `<g transform="translate(-50, -40)">
    <rect x="10" y="10" width="80" height="25" rx="8" fill="#2563eb"/>
    <rect x="15" y="35" width="70" height="50" rx="10" fill="#3b82f6"/>
    <rect x="25" y="45" width="50" height="30" rx="4" fill="#ffffff" opacity="0.9"/>
</g>`;

const diaperIcon = `<g transform="translate(-50, -40)">
    <path d="M10 20 L90 20 L80 80 Q50 95 20 80 Z" fill="#f59e0b"/>
    <rect x="20" y="25" width="60" height="15" rx="4" fill="#ffffff" opacity="0.8"/>
    <path d="M35 50 C45 65 55 65 65 50" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>`;

const glucometerIcon = `<g transform="translate(-40, -65)">
    <rect x="15" y="10" width="50" height="100" rx="16" fill="#0284c7"/>
    <rect x="23" y="22" width="34" height="35" rx="6" fill="#0f172a"/>
    <text x="40" y="46" font-family="monospace" font-size="16" font-weight="700" fill="#38bdf8" text-anchor="middle">108</text>
    <circle cx="40" cy="80" r="10" fill="#ffffff" opacity="0.9"/>
</g>`;

const bpMonitorIcon = `<g transform="translate(-55, -55)">
    <rect x="10" y="10" width="90" height="80" rx="16" fill="#475569"/>
    <rect x="20" y="20" width="70" height="40" rx="6" fill="#0f172a"/>
    <text x="55" y="46" font-family="monospace" font-size="18" font-weight="700" fill="#38bdf8" text-anchor="middle">120/80</text>
    <circle cx="35" cy="74" r="6" fill="#38bdf8"/>
    <circle cx="75" cy="74" r="6" fill="#94a3b8"/>
</g>`;

const bandageIcon = `<g transform="translate(-50, -50)">
    <rect x="10" y="30" width="80" height="40" rx="10" fill="#f59e0b" transform="rotate(-15 50 50)"/>
    <rect x="35" y="30" width="30" height="40" fill="#ffffff" opacity="0.9" transform="rotate(-15 50 50)"/>
    <circle cx="50" cy="50" r="3" fill="#d97706"/>
</g>`;

const buildProduct = (product) => ({
    ...product,
    discount: Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100)),
    badge: product.requiresPrescription ? 'Prescription' : Math.round(((product.mrp - product.price) / product.mrp) * 100) >= 12 ? 'Sale' : 'OTC',
});

export const featuredCategories = [
    { name: 'Medicines', iconKey: 'Pill', slug: 'Medicines', description: 'Prescription and everyday care from trusted pharmaceutical brands.' },
    { name: 'Vitamins & Supplements', iconKey: 'Sparkles', slug: 'Vitamins & Supplements', description: 'Daily wellness support for energy, immunity, bone health, and recovery.' },
    { name: 'Personal Care', iconKey: 'Sparkles', slug: 'Personal Care', description: 'Skin, hygiene, haircare, and grooming essentials for daily fresh wellness.' },
    { name: 'Baby Care', iconKey: 'Baby', slug: 'Baby Care', description: 'Gentle, dermatologist-tested products selected for infants and toddlers.' },
    { name: 'Diabetic Care', iconKey: 'Droplets', slug: 'Diabetic Care', description: 'Glucose monitoring, test strips, supplements, and diabetic health support.' },
    { name: 'Surgical & First Aid', iconKey: 'Bandage', slug: 'Surgical & First Aid', description: 'First aid kits, bandages, masks, thermometers, and medical home care.' },
];

export const trustBadges = [
    { title: 'Licensed Pharmacy', iconKey: 'ShieldCheck' },
    { title: '100% Genuine Medicines', iconKey: 'BadgeCheck' },
    { title: 'Same-Day Delivery', iconKey: 'Truck' },
    { title: 'Expert Consultation', iconKey: 'Stethoscope' },
];

export const howItWorksSteps = [
    {
        title: 'Browse or search',
        text: 'Find medicines, wellness essentials, and daily care products with live filters.',
        iconKey: 'Search',
    },
    {
        title: 'Upload prescription',
        text: 'Share a prescription when required and add any quick notes for the pharmacist.',
        iconKey: 'Upload',
    },
    {
        title: 'Receive doorstep delivery',
        text: 'We prepare the order carefully and coordinate delivery to your address.',
        iconKey: 'Truck',
    },
];

export const ownerProfile = {
    name: 'Madan Mohan Mishra',
    title: 'Proprietor, MediCare',
    quote: 'Serving your family with steady advice, authentic products, and careful attention to every order.',
    years: 15,
    bio:
        'Madan Mohan Mishra has built MediCare around one simple idea: a pharmacy should feel accurate, calm, and human. The store balances quick service with careful verification so every customer can order with confidence.',
    qualifications: ['Retail pharmacy experience', 'Prescription handling', 'Product guidance and counseling'],
};

export const storeInfo = {
    address: 'MediCare, Dhawari, Satna, Lamtara, Madhya Pradesh 485001',
    phone: '+91 97528 80806',
    email: 'support@medicare.in',
    whatsapp: 'https://wa.me/919752880806',
    hours: 'Monday to Sunday, 8:00 AM to 10:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps?q=24.5556833,80.8192739&z=18&output=embed',
};

export const socialLinks = [
    { name: 'WhatsApp', href: 'https://wa.me/919752880806' },
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'Facebook', href: 'https://www.facebook.com/' },
    { name: 'X', href: 'https://x.com/' },
];

export const footerLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Prescription', to: '/prescription' },
    { label: 'About', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' },
];

export const milestones = [
    { year: '2010', title: 'Store opened', text: 'MediCare began serving the neighborhood with a small, dependable pharmacy counter.' },
    { year: '2016', title: 'Home delivery added', text: 'The store expanded delivery support for recurring medicines and urgent requests.' },
    { year: '2020', title: 'Digital ordering', text: 'Prescription uploads and WhatsApp ordering became part of the daily workflow.' },
    { year: '2026', title: 'Modern online storefront', text: 'The pharmacy now ships with a polished multi-page shopping experience.' },
];

export const valueCards = [
    { title: 'Genuine Products', text: 'We source from trusted distributors and maintain a careful receiving process.', iconKey: 'ShieldCheck' },
    { title: 'Patient First', text: 'Our recommendations are designed to be practical, clear, and respectful.', iconKey: 'HeartPulse' },
    { title: 'Affordable Healthcare', text: 'We balance quality with pricing so regular essentials remain accessible.', iconKey: 'BadgeIndianRupee' },
    { title: 'Expert Advice', text: 'A pharmacist-friendly support flow keeps orders accurate and easy to follow.', iconKey: 'Stethoscope' },
];

export const testimonialItems = [
    {
        name: 'Priya Sharma',
        rating: 5,
        text: 'The prescription upload process was simple and the order reached us the same evening. The packaging was neat and reassuring.',
    },
    {
        name: 'Amit Verma',
        rating: 5,
        text: 'Clear communication, genuine products, and a team that answers quickly on WhatsApp. That combination matters.',
    },
    {
        name: 'Neha Patil',
        rating: 4,
        text: 'I liked how the site makes it easy to find wellness products and compare prices without clutter.',
    },
];

export const faqItems = [
    {
        question: 'How fast is delivery?',
        answer: 'Orders are prepared as quickly as possible and same-day delivery is available in select local areas when stock and timing allow.',
    },
    {
        question: 'Do I need a prescription for every order?',
        answer: 'Only for medicines marked as prescription required. OTC and wellness items can be ordered directly.',
    },
    {
        question: 'Can I return medicines?',
        answer: 'Returns are handled according to product condition, storage safety, and pharmacy policy. Please contact the store before sending anything back.',
    },
    {
        question: 'What payment methods are supported?',
        answer: 'Cash on delivery, UPI, and standard card or wallet payment options are accepted where available.',
    },
    {
        question: 'How do you verify product authenticity?',
        answer: 'Products are sourced through regular pharmacy channels and packed only after internal verification.',
    },
    {
        question: 'Can I order through WhatsApp?',
        answer: 'Yes. You can place a quick order or ask a follow-up question using the WhatsApp button.',
    },
];

export const contactSubjects = [
    'General inquiry',
    'Order status',
    'Prescription help',
    'Product availability',
    'Delivery support',
    'Other',
];

export const products = [
    // ─── MEDICINES ─────────────────────────────────────────────────────────────
    buildProduct({
        id: 1,
        name: 'Dolo 650 Tablet',
        category: 'Medicines',
        price: 30,
        mrp: 35,
        image: makeProductImage('Dolo 650', 'Paracetamol 650 mg', 'Micro Labs', 'Medicines', '#fae8ff', '#f5d0fe', '#a855f7', pillIcon),
        brand: 'Micro Labs',
        requiresPrescription: false,
        manufacturer: 'Micro Labs Ltd.',
        composition: 'Paracetamol 650 mg',
        dosage: 'Take as directed by a medical professional.',
        description: 'Trusted relief for fever and mild to moderate body pain.',
        rating: 4.9,
        reviews: 1284,
        uses: ['Fever', 'Headache', 'Body ache'],
    }),
    buildProduct({
        id: 2,
        name: 'Cetzine 10 Tablet',
        category: 'Medicines',
        price: 44,
        mrp: 52,
        image: makeProductImage('Cetzine 10', 'Cetirizine 10 mg', 'Dr. Reddy\'s', 'Medicines', '#eff6ff', '#dbeafe', '#2563eb', pillIcon),
        brand: 'Dr. Reddy\'s',
        requiresPrescription: true,
        manufacturer: 'Dr. Reddy\'s Laboratories',
        composition: 'Cetirizine 10 mg',
        dosage: 'Usually taken once daily when advised by doctor.',
        description: 'Antihistamine for moderate-to-severe allergy relief; requires prescription in India.',
        rating: 4.8,
        reviews: 842,
        uses: ['Allergy symptoms', 'Sneezing', 'Itching'],
    }),
    buildProduct({
        id: 3,
        name: 'Augmentin 625 Duo Tablet',
        category: 'Medicines',
        price: 245,
        mrp: 279,
        image: makeProductImage('Augmentin 625 Duo', 'Amoxicillin + Clavulanic Acid', 'GSK', 'Medicines', '#f0fdfa', '#e0f2fe', '#0284c7', pillIcon),
        brand: 'GSK',
        requiresPrescription: true,
        manufacturer: 'GlaxoSmithKline',
        composition: 'Amoxicillin 500 mg + Clavulanic Acid 125 mg',
        dosage: 'Prescription only.',
        description: 'Broad-spectrum antibiotic for doctor-prescribed bacterial infections.',
        rating: 4.7,
        reviews: 621,
        uses: ['Bacterial infection', 'Doctor-prescribed therapy'],
    }),
    buildProduct({
        id: 4,
        name: 'Voveran Emulgel 50g',
        category: 'Medicines',
        price: 128,
        mrp: 149,
        image: makeProductImage('Voveran Emulgel', 'Diclofenac Diethylamine Gel', 'Sun Pharma', 'Medicines', '#fffbeb', '#fef3c7', '#d97706', gelTubeIcon),
        brand: 'Sun Pharma',
        requiresPrescription: true,
        manufacturer: 'Sun Pharmaceutical Industries',
        composition: 'Diclofenac diethylamine gel',
        dosage: 'Apply topically; prescription required as per Schedule H1 NSAID regulations.',
        description: 'Prescription NSAID topical gel for muscle strain, sprains, and joint stiffness.',
        rating: 4.6,
        reviews: 512,
        uses: ['Muscle pain', 'Sprain', 'Joint pain'],
    }),
    buildProduct({
        id: 5,
        name: 'Pantocid 40 Tablet',
        category: 'Medicines',
        price: 155,
        mrp: 180,
        image: makeProductImage('Pantocid 40', 'Pantoprazole 40 mg', 'Sun Pharma', 'Medicines', '#faf5ff', '#f3e8ff', '#9333ea', pillIcon),
        brand: 'Sun Pharma',
        requiresPrescription: true,
        manufacturer: 'Sun Pharmaceutical Industries',
        composition: 'Pantoprazole 40 mg',
        dosage: 'Take empty stomach in the morning.',
        description: 'Effective relief for hyperacidity, GERD, and stomach ulcers.',
        rating: 4.8,
        reviews: 940,
        uses: ['Acidity', 'Heartburn', 'GERD'],
    }),
    buildProduct({
        id: 6,
        name: 'Crocin Pain Relief Tablet',
        category: 'Medicines',
        price: 65,
        mrp: 75,
        image: makeProductImage('Crocin Pain Relief', 'Paracetamol + Caffeine', 'GSK', 'Medicines', '#fef2f2', '#fee2e2', '#dc2626', pillIcon),
        brand: 'GSK',
        requiresPrescription: false,
        manufacturer: 'GlaxoSmithKline',
        composition: 'Paracetamol 650mg + Caffeine 50mg',
        dosage: 'Take as needed for severe headache.',
        description: 'Specialized formula for fast relief from persistent headaches & body pain.',
        rating: 4.7,
        reviews: 430,
        uses: ['Headache', 'Migraine relief'],
    }),

    // ─── VITAMINS & SUPPLEMENTS ────────────────────────────────────────────────
    buildProduct({
        id: 7,
        name: 'Revital H Daily Capsule (60s)',
        category: 'Vitamins & Supplements',
        price: 549,
        mrp: 625,
        image: makeProductImage('Revital H Daily', 'Multivitamins + Ginseng', 'Sun Pharma', 'Vitamins', '#fffbeb', '#fde68a', '#b45309', vitaminIcon),
        brand: 'Sun Pharma',
        requiresPrescription: false,
        manufacturer: 'Sun Pharmaceutical Industries',
        composition: 'Multivitamins, Minerals & Ginseng',
        dosage: 'One capsule daily after meal.',
        description: 'Comprehensive daily energy, mental stamina, and immunity support.',
        rating: 4.8,
        reviews: 1530,
        uses: ['Energy support', 'Stamina', 'Immunity'],
    }),
    buildProduct({
        id: 8,
        name: 'Shelcal 500 Calcium Tablet',
        category: 'Vitamins & Supplements',
        price: 168,
        mrp: 195,
        image: makeProductImage('Shelcal 500', 'Calcium + Vitamin D3', 'Torrent', 'Vitamins', '#f8fafc', '#e2e8f0', '#475569', bottleIcon),
        brand: 'Torrent',
        requiresPrescription: false,
        manufacturer: 'Torrent Pharmaceuticals',
        composition: 'Calcium carbonate 1250 mg + Vitamin D3 250 IU',
        dosage: 'One tablet daily with water.',
        description: 'Essential calcium & Vitamin D3 for strong bones, joints, and teeth.',
        rating: 4.7,
        reviews: 1104,
        uses: ['Bone strength', 'Calcium balance'],
    }),
    buildProduct({
        id: 9,
        name: 'Zincovit Multivitamin Syrup 200ml',
        category: 'Vitamins & Supplements',
        price: 148,
        mrp: 172,
        image: makeProductImage('Zincovit Syrup', 'Multivitamins + Zinc', 'Apex', 'Vitamins', '#fff7ed', '#ffedd5', '#c2410c', bottleIcon),
        brand: 'Apex',
        requiresPrescription: false,
        manufacturer: 'Apex Laboratories',
        composition: 'Multivitamins + Zinc + Grape Seed Extract',
        dosage: '10ml daily or as directed.',
        description: 'Popular liquid antioxidant and multivitamin tonic for illness recovery.',
        rating: 4.6,
        reviews: 706,
        uses: ['Immunity', 'Nutritional supplement'],
    }),
    buildProduct({
        id: 10,
        name: 'Limcee Vitamin C 500mg (Chewable)',
        category: 'Vitamins & Supplements',
        price: 85,
        mrp: 99,
        image: makeProductImage('Limcee 500mg', 'Vitamin C 500 mg Chewable', 'Abbott', 'Vitamins', '#fff7ed', '#fed7aa', '#ea580c', vitaminIcon),
        brand: 'Abbott',
        requiresPrescription: false,
        manufacturer: 'Abbott India',
        composition: 'Ascorbic Acid (Vitamin C) 500 mg',
        dosage: 'Chew one tablet daily.',
        description: 'Tasty orange chewable vitamin C tablet for immunity & skin glow.',
        rating: 4.8,
        reviews: 1820,
        uses: ['Immunity booster', 'Skin vitality'],
    }),
    buildProduct({
        id: 11,
        name: 'Evion 400 Vitamin E Capsule',
        category: 'Vitamins & Supplements',
        price: 38,
        mrp: 45,
        image: makeProductImage('Evion 400', 'Vitamin E 400 mg Capsule', 'P&G Health', 'Vitamins', '#ecfeff', '#cffafe', '#06b6d4', pillIcon),
        brand: 'Procter & Gamble',
        requiresPrescription: false,
        manufacturer: 'P&G Health',
        composition: 'Vitamin E 400 mg',
        dosage: 'One capsule daily or topical skin/hair application.',
        description: 'Potent Vitamin E capsule for muscle recovery, glowing skin, and hair strength.',
        rating: 4.9,
        reviews: 2150,
        uses: ['Skin nourish', 'Hair care', 'Antioxidant'],
    }),
    buildProduct({
        id: 12,
        name: 'Neurobion Forte Tablet',
        category: 'Vitamins & Supplements',
        price: 42,
        mrp: 49,
        image: makeProductImage('Neurobion Forte', 'B-Complex + Vitamin B12', 'P&G Health', 'Vitamins', '#fdf2f8', '#fbcfe8', '#db2777', pillIcon),
        brand: 'Procter & Gamble',
        requiresPrescription: false,
        manufacturer: 'P&G Health',
        composition: 'B-Complex Vitamins + B12',
        dosage: 'One tablet daily.',
        description: 'Targeted Vitamin B-complex supplement for nerve health and energy.',
        rating: 4.7,
        reviews: 990,
        uses: ['Nerve strength', 'Tiredness relief'],
    }),

    // ─── PERSONAL CARE ──────────────────────────────────────────────────────────
    buildProduct({
        id: 13,
        name: 'Himalaya Purifying Neem Face Wash 150ml',
        category: 'Personal Care',
        price: 185,
        mrp: 220,
        image: makeProductImage('Himalaya Neem Wash', 'Purifying Neem & Turmeric', 'Himalaya', 'Personal Care', '#f0f9ff', '#e0f2fe', '#0284c7', faceWashIcon),
        brand: 'Himalaya',
        requiresPrescription: false,
        manufacturer: 'Himalaya Wellness Company',
        composition: 'Neem & Turmeric extracts',
        dosage: 'Use twice daily.',
        description: 'Herbal acne-clearing face wash for clean, oil-free, glowing skin.',
        rating: 4.7,
        reviews: 1640,
        uses: ['Acne control', 'Deep skin cleansing'],
    }),
    buildProduct({
        id: 14,
        name: 'Cetaphil Gentle Skin Cleanser 250ml',
        category: 'Personal Care',
        price: 499,
        mrp: 549,
        image: makeProductImage('Cetaphil Cleanser', 'Gentle Skin Cleanser 250ml', 'Galderma', 'Personal Care', '#f0f9ff', '#bae6fd', '#0284c7', faceWashIcon),
        brand: 'Galderma',
        requiresPrescription: false,
        manufacturer: 'Galderma India',
        composition: 'Non-comedogenic hydrating formula',
        dosage: 'Apply with or without water.',
        description: 'Dermatologist recommended non-irritating cleanser for sensitive skin.',
        rating: 4.9,
        reviews: 2410,
        uses: ['Sensitive skin wash', 'Dermatological care'],
    }),
    buildProduct({
        id: 15,
        name: 'Suncros Matte Finish SPF 50 Gel',
        category: 'Personal Care',
        price: 365,
        mrp: 415,
        image: makeProductImage('Suncros SPF 50', 'Matte Finish Sunscreen Gel', 'Sun Pharma', 'Personal Care', '#fffbeb', '#fde68a', '#d97706', gelTubeIcon),
        brand: 'Sun Pharma',
        requiresPrescription: false,
        manufacturer: 'Sun Pharmaceutical Industries',
        composition: 'Broad spectrum UVA/UVB filters',
        dosage: 'Apply 15 mins before sun exposure.',
        description: 'Non-greasy water-resistant SPF 50 sunscreen for harsh Indian weather.',
        rating: 4.8,
        reviews: 890,
        uses: ['Sun protection', 'Anti-tanning'],
    }),
    buildProduct({
        id: 16,
        name: 'Dettol Original Liquid Hand Wash 250ml',
        category: 'Personal Care',
        price: 99,
        mrp: 120,
        image: makeProductImage('Dettol Hand Wash', 'Original Germ Protection', 'Dettol', 'Personal Care', '#eff6ff', '#dbeafe', '#2563eb', bottleIcon),
        brand: 'Dettol',
        requiresPrescription: false,
        manufacturer: 'Reckitt Benckiser',
        composition: 'Germ protection liquid soap',
        dosage: 'Wash hands for 20 seconds.',
        description: 'Trusted 99.9% germ protection handwash for family hygiene.',
        rating: 4.6,
        reviews: 780,
        uses: ['Hand hygiene', 'Germ protection'],
    }),
    buildProduct({
        id: 17,
        name: 'Nivea Soft Refreshing Light Moisturizer 200ml',
        category: 'Personal Care',
        price: 279,
        mrp: 325,
        image: makeProductImage('Nivea Soft Cream', 'Refreshing Light Moisturizer', 'Nivea', 'Personal Care', '#eff6ff', '#bfdbfe', '#1d4ed8', creamJarIcon),
        brand: 'Nivea',
        requiresPrescription: false,
        manufacturer: 'Beiersdorf',
        composition: 'Jojoba oil & Vitamin E',
        dosage: 'Apply smoothly over body & face.',
        description: 'Light non-sticky moisturizing cream for fresh, supple skin all day.',
        rating: 4.7,
        reviews: 1350,
        uses: ['Skin hydration', 'Daily moisturizing'],
    }),

    // ─── BABY CARE ─────────────────────────────────────────────────────────────
    buildProduct({
        id: 18,
        name: 'Pampers All-in-One Baby Diaper Pants (L)',
        category: 'Baby Care',
        price: 799,
        mrp: 949,
        image: makeProductImage('Pampers Diapers', 'All-in-One Pants (Large)', 'Pampers', 'Baby Care', '#fffbeb', '#fef3c7', '#b45309', diaperIcon),
        brand: 'Pampers',
        requiresPrescription: false,
        manufacturer: 'Procter & Gamble',
        composition: 'Ultra absorb magic gel pants',
        dosage: 'Change every 4-6 hours.',
        description: 'Breathable, leak-proof baby diaper pants for 12-hour overnight dryness.',
        rating: 4.9,
        reviews: 3100,
        uses: ['Baby comfort', 'Leakage prevention'],
    }),
    buildProduct({
        id: 19,
        name: 'Johnson\'s Baby Powder 400g',
        category: 'Baby Care',
        price: 245,
        mrp: 275,
        image: makeProductImage('Johnson\'s Powder', 'Soft Baby Powder 400g', 'Johnson\'s', 'Baby Care', '#fdf2f8', '#fbcfe8', '#ec4899', bottleIcon),
        brand: 'Johnson\'s',
        requiresPrescription: false,
        manufacturer: 'Kenvue',
        composition: 'Hypoallergenic cornstarch powder',
        dosage: 'Apply gently after bath.',
        description: 'Gentle, soothing powder that keeps baby skin soft, smooth, and fresh.',
        rating: 4.7,
        reviews: 1840,
        uses: ['Baby skin dry', 'Chafing protection'],
    }),
    buildProduct({
        id: 20,
        name: 'Himalaya Baby Lotion 400ml',
        category: 'Baby Care',
        price: 265,
        mrp: 310,
        image: makeProductImage('Himalaya Baby Lotion', 'Olive Oil & Almond Oil', 'Himalaya', 'Baby Care', '#fdf2f8', '#fbcfe8', '#db2777', bottleIcon),
        brand: 'Himalaya',
        requiresPrescription: false,
        manufacturer: 'Himalaya Wellness',
        composition: 'Olive oil & Almond oil',
        dosage: 'Apply after bathing.',
        description: 'Mild natural moisturizer designed to nourish delicate infant skin.',
        rating: 4.8,
        reviews: 950,
        uses: ['Baby moisturizing', 'Skin softness'],
    }),
    buildProduct({
        id: 21,
        name: 'Mee Mee Gentle Baby Wet Wipes (72s)',
        category: 'Baby Care',
        price: 159,
        mrp: 199,
        image: makeProductImage('Mee Mee Wipes', 'Aloe Vera Wet Wipes 72s', 'Mee Mee', 'Baby Care', '#f0f9ff', '#e0f2fe', '#0284c7', faceWashIcon),
        brand: 'Mee Mee',
        requiresPrescription: false,
        manufacturer: 'Meemee',
        composition: 'Aloe Vera & Chamomile thick wipes',
        dosage: 'Use for quick gentle cleaning.',
        description: 'Alcohol-free, ultra-soft wet wipes for baby diaper changes & hands.',
        rating: 4.6,
        reviews: 620,
        uses: ['Diaper cleanup', 'Baby hand wash'],
    }),
    buildProduct({
        id: 22,
        name: 'Sebamed Gentle Baby Shampoo 200ml',
        category: 'Baby Care',
        price: 495,
        mrp: 550,
        image: makeProductImage('Sebamed Shampoo', 'pH 5.5 Tear-Free Shampoo', 'Sebamed', 'Baby Care', '#f8fafc', '#f1f5f9', '#0f172a', bottleIcon),
        brand: 'Sebamed',
        requiresPrescription: false,
        manufacturer: 'Sebapharma',
        composition: 'pH 5.5 tear-free formula',
        dosage: 'Lather gently on scalp and rinse.',
        description: 'Clinically proven pH 5.5 tear-free shampoo for sensitive baby scalps.',
        rating: 4.9,
        reviews: 780,
        uses: ['Scalp care', 'Tear-free hair wash'],
    }),

    buildProduct({
        id: 32,
        name: 'Himalaya Baby Rash Cream Trial Sachet',
        category: 'Baby Care',
        price: 1,
        mrp: 2,
        image: makeProductImage('Baby Rash Cream', 'Trial Sachet 4g', 'Himalaya', 'Baby Care', '#fdf2f8', '#fbcfe8', '#ec4899', creamJarIcon),
        brand: 'Himalaya',
        requiresPrescription: false,
        manufacturer: 'Himalaya Wellness',
        composition: 'Aloe Vera & Almond Oil soothing formula',
        dosage: 'Apply gently on affected area after each diaper change.',
        description: 'Trial sachet of Himalaya\'s gentle baby rash cream — soothing, fragrance-free, and safe for newborns.',
        rating: 4.8,
        reviews: 320,
        uses: ['Diaper rash relief', 'Skin soothing', 'Redness prevention'],
    }),

    // ─── DIABETIC CARE ─────────────────────────────────────────────────────────
    buildProduct({
        id: 23,
        name: 'Accu-Chek Active Glucometer Kit',
        category: 'Diabetic Care',
        price: 1399,
        mrp: 1599,
        image: makeProductImage('Accu-Chek Active', 'Blood Glucose Meter Kit', 'Roche', 'Diabetic Care', '#f0f9ff', '#bae6fd', '#0369a1', glucometerIcon),
        brand: 'Roche',
        requiresPrescription: false,
        manufacturer: 'Roche Diabetes Care',
        composition: 'Digital blood glucose meter + 10 strips + lancets',
        dosage: 'Use for home blood sugar testing.',
        description: 'Gold standard fast 5-second blood glucose monitoring system.',
        rating: 4.9,
        reviews: 2450,
        uses: ['Glucose monitoring', 'Diabetes tracking'],
    }),
    buildProduct({
        id: 24,
        name: 'Accu-Chek Active Test Strips (50s Pack)',
        category: 'Diabetic Care',
        price: 949,
        mrp: 1049,
        image: makeProductImage('Accu-Chek Strips', '50s Glucose Test Strips', 'Roche', 'Diabetic Care', '#e0f2fe', '#bae6fd', '#0284c7', glucometerIcon),
        brand: 'Roche',
        requiresPrescription: false,
        manufacturer: 'Roche Diabetes Care',
        composition: 'Glucose test strips box of 50',
        dosage: 'Single use per blood test.',
        description: 'Precision test strips for Accu-Chek Active glucometers.',
        rating: 4.8,
        reviews: 1820,
        uses: ['Blood testing', 'Routine glucose check'],
    }),
    buildProduct({
        id: 25,
        name: 'Sugar Free Gold Sweetener (500 Pellets)',
        category: 'Diabetic Care',
        price: 285,
        mrp: 320,
        image: makeProductImage('Sugar Free Gold', 'Zero Calorie Sweetener', 'Sugar Free', 'Diabetic Care', '#fffbeb', '#fef3c7', '#d97706', bottleIcon),
        brand: 'Sugar Free',
        requiresPrescription: false,
        manufacturer: 'Zydus Wellness',
        composition: 'Aspartame zero-calorie sweetener',
        dosage: '1 pellet = 1 tsp sugar sweetness.',
        description: 'Zero-calorie sugar substitute ideal for diabetic tea, coffee & drinks.',
        rating: 4.7,
        reviews: 1410,
        uses: ['Calorie control', 'Sugar replacement'],
    }),
    buildProduct({
        id: 26,
        name: 'Metformin SR 500 mg Tablet',
        category: 'Diabetic Care',
        price: 85,
        mrp: 99,
        image: makeProductImage('Metformin SR 500', 'Metformin 500 mg SR', 'Intas', 'Diabetic Care', '#eff6ff', '#dbeafe', '#1d4ed8', pillIcon),
        brand: 'Intas',
        requiresPrescription: true,
        manufacturer: 'Intas Pharmaceuticals',
        composition: 'Metformin sustained release 500 mg',
        dosage: 'Prescription only.',
        description: 'First-line prescription medication for Type-2 blood glucose management.',
        rating: 4.7,
        reviews: 890,
        uses: ['Type 2 Diabetes', 'Blood sugar control'],
    }),

    // ─── SURGICAL & FIRST AID ──────────────────────────────────────────────────
    buildProduct({
        id: 27,
        name: 'Omron Automatic Blood Pressure Monitor HEM-7120',
        category: 'Surgical & First Aid',
        price: 2199,
        mrp: 2490,
        image: makeProductImage('Omron BP Monitor', 'Digital Upper Arm Monitor', 'Omron', 'Surgical', '#f1f5f9', '#cbd5e1', '#334155', bpMonitorIcon),
        brand: 'Omron',
        requiresPrescription: false,
        manufacturer: 'Omron Healthcare',
        composition: 'IntelliSense upper arm cuff monitor',
        dosage: 'Wrap cuff on arm and press start.',
        description: 'Accurate, easy-to-use digital BP monitor for home health tracking.',
        rating: 4.9,
        reviews: 3210,
        uses: ['BP measurement', 'Heart rate tracking'],
    }),
    buildProduct({
        id: 28,
        name: 'Hansaplast Washproof Bandages (100 Strips)',
        category: 'Surgical & First Aid',
        price: 195,
        mrp: 230,
        image: makeProductImage('Hansaplast Bandages', 'Washproof Strips (100 Pack)', 'Hansaplast', 'Surgical', '#fffbeb', '#fde68a', '#b45309', bandageIcon),
        brand: 'Hansaplast',
        requiresPrescription: false,
        manufacturer: 'Beiersdorf India',
        composition: 'Antiseptic medicated pad strips',
        dosage: 'Apply over clean minor cuts.',
        description: 'Waterproof first-aid adhesive bandages for fast cut & wound protection.',
        rating: 4.8,
        reviews: 1420,
        uses: ['First aid', 'Cut protection'],
    }),
    buildProduct({
        id: 29,
        name: 'Dr. Trust Digital Clinical Thermometer',
        category: 'Surgical & First Aid',
        price: 299,
        mrp: 349,
        image: makeProductImage('Dr. Trust Thermometer', 'Fast 10s Digital Sensor', 'Dr. Trust', 'Surgical', '#f0f9ff', '#e0f2fe', '#0284c7', glucometerIcon),
        brand: 'Dr. Trust',
        requiresPrescription: false,
        manufacturer: 'Nureca Inc',
        composition: 'Waterproof digital sensor',
        dosage: 'Place under tongue or armpit.',
        description: 'Fast 10-second high precision body temperature digital thermometer.',
        rating: 4.7,
        reviews: 1120,
        uses: ['Fever detection', 'Temperature check'],
    }),
    buildProduct({
        id: 30,
        name: 'Betadine Antiseptic Ointment 20g',
        category: 'Surgical & First Aid',
        price: 115,
        mrp: 132,
        image: makeProductImage('Betadine Ointment', 'Povidone-Iodine 5% w/w', 'Win-Medicare', 'Surgical', '#fef2f2', '#fecaca', '#b91c1c', gelTubeIcon),
        brand: 'Win-Medicare',
        requiresPrescription: false,
        manufacturer: 'Win-Medicare',
        composition: 'Povidone-Iodine 5% w/w',
        dosage: 'Apply topically on minor burns & cuts.',
        description: 'Gold-standard microbicidal ointment for wound disinfection & burn healing.',
        rating: 4.9,
        reviews: 2190,
        uses: ['Wound disinfection', 'Burn care'],
    }),
    buildProduct({
        id: 31,
        name: '3M Micropore Surgical Tape (1 inch x 9m)',
        category: 'Surgical & First Aid',
        price: 149,
        mrp: 179,
        image: makeProductImage('3M Micropore Tape', 'Gentle Paper Tape (1 inch)', '3M', 'Surgical', '#f8fafc', '#e2e8f0', '#475569', bandageIcon),
        brand: '3M',
        requiresPrescription: false,
        manufacturer: '3M India',
        composition: 'Hypoallergenic paper tape',
        dosage: 'Secure gauze or dressing.',
        description: 'Gentle breathable surgical tape that holds dressings securely without skin pain.',
        rating: 4.8,
        reviews: 750,
        uses: ['Dressing support', 'Medical tape'],
    }),

    // ─── PRESCRIPTION-ONLY (Schedule H / H1 / Controlled) ─────────────────────
    buildProduct({
        id: 33,
        name: 'Amlopin 5 mg Tablet',
        category: 'Medicines',
        price: 78,
        mrp: 92,
        image: makeProductImage('Amlopin 5mg', 'Amlodipine 5 mg', 'Cipla', 'Medicines', '#f0fdf4', '#dcfce7', '#15803d', pillIcon),
        brand: 'Cipla',
        requiresPrescription: true,
        manufacturer: 'Cipla Limited',
        composition: 'Amlodipine Besylate 5 mg',
        dosage: 'Prescription only — taken once daily as per cardiologist advice.',
        description: 'Schedule H antihypertensive calcium channel blocker for high blood pressure and angina management.',
        rating: 4.8,
        reviews: 1140,
        uses: ['High blood pressure', 'Angina', 'Heart health'],
    }),
    buildProduct({
        id: 34,
        name: 'Thyronorm 50 mcg Tablet',
        category: 'Medicines',
        price: 48,
        mrp: 58,
        image: makeProductImage('Thyronorm 50', 'Levothyroxine 50 mcg', 'Abbott', 'Medicines', '#fdf4ff', '#fae8ff', '#9333ea', pillIcon),
        brand: 'Abbott',
        requiresPrescription: true,
        manufacturer: 'Abbott India Ltd.',
        composition: 'Levothyroxine Sodium 50 mcg',
        dosage: 'Prescription only — taken on empty stomach every morning.',
        description: 'Schedule H thyroid hormone replacement therapy for hypothyroidism — requires strict endocrinologist supervision.',
        rating: 4.9,
        reviews: 2310,
        uses: ['Hypothyroidism', 'Thyroid hormone replacement'],
    }),
    buildProduct({
        id: 35,
        name: 'Betnesol 0.5 mg Tablet',
        category: 'Medicines',
        price: 42,
        mrp: 52,
        image: makeProductImage('Betnesol 0.5', 'Betamethasone 0.5 mg', 'GSK', 'Medicines', '#fff7ed', '#ffedd5', '#c2410c', pillIcon),
        brand: 'GSK',
        requiresPrescription: true,
        manufacturer: 'GlaxoSmithKline Pharmaceuticals',
        composition: 'Betamethasone 0.5 mg (corticosteroid)',
        dosage: 'Prescription only — strict short-term use under physician guidance.',
        description: 'Schedule H corticosteroid (steroid) for severe inflammatory conditions, autoimmune disorders, and allergic reactions.',
        rating: 4.6,
        reviews: 580,
        uses: ['Severe inflammation', 'Autoimmune disorders', 'Allergic reaction'],
    }),
    buildProduct({
        id: 36,
        name: 'Azithral 500 Tablet',
        category: 'Medicines',
        price: 145,
        mrp: 168,
        image: makeProductImage('Azithral 500', 'Azithromycin 500 mg', 'Alembic', 'Medicines', '#eff6ff', '#dbeafe', '#1d4ed8', pillIcon),
        brand: 'Alembic',
        requiresPrescription: true,
        manufacturer: 'Alembic Pharmaceuticals',
        composition: 'Azithromycin 500 mg (macrolide antibiotic)',
        dosage: 'Prescription only — do not self-medicate to avoid resistance.',
        description: 'Schedule H1 broad-spectrum antibiotic for chest, throat, skin, and ear bacterial infections.',
        rating: 4.7,
        reviews: 920,
        uses: ['Bacterial infections', 'Chest infection', 'Ear infection'],
    }),
    buildProduct({
        id: 37,
        name: 'Tramadol 50 mg Capsule',
        category: 'Medicines',
        price: 95,
        mrp: 115,
        image: makeProductImage('Tramadol 50mg', 'Tramadol HCl 50 mg', 'Mankind', 'Medicines', '#fef2f2', '#fee2e2', '#991b1b', pillIcon),
        brand: 'Mankind',
        requiresPrescription: true,
        manufacturer: 'Mankind Pharma Ltd.',
        composition: 'Tramadol Hydrochloride 50 mg (opioid analgesic)',
        dosage: 'Controlled substance — Schedule H1. Strict prescription required.',
        description: '⚠️ Controlled Substance (Schedule H1): Opioid pain reliever for moderate-to-severe acute pain. Highly regulated — only dispensed with valid doctor prescription.',
        rating: 4.5,
        reviews: 340,
        uses: ['Severe acute pain', 'Post-operative pain', 'Cancer pain'],
    }),
];

export const RX_REQUIRED_PRODUCT_IDS = new Set(
    products.filter(p => p.requiresPrescription).map(p => p.id)
);

export const productBrands = Array.from(new Set(products.map((product) => product.brand))).sort();
export const productCategories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];

export const productGroups = products.reduce((groups, product) => {
    if (!groups[product.category]) {
        groups[product.category] = [];
    }
    groups[product.category].push(product);
    return groups;
}, {});
