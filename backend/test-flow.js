const db = require('./db');
async function test() {
    const flora = {
        id: 'fake-uuid',
        commonName: 'Silver Oak',
        tamilName: 'சில்வர் ஓக்',
        scientificName: 'Grevillea robusta',
        family: 'Proteaceae',
        category: 'Trees',
        habitat: 'Subtropical',
        description: 'Fast-growing evergreen tree',
        history: 'Native to Australia',
        benefits: 'Timber',
        medicinalUses: 'None',
        culturalSignificance: 'Used for shade',
        economicUses: 'Wood for furniture',
        conservationStatus: 'Least Concern',
        nativeRegion: 'Australia',
        image1Url: 'https://example.com/so.jpg',
        image2File: ''
    };
    
    // mimic frontend
    const finalFlora = {
        ...flora,
        image1: flora.image1Url || flora.image1 || '',
        image2: flora.image2File || flora.image2 || ''
    };

    // mimic mapToDb
    const mapped = { ...finalFlora };
    mapped.name = mapped.commonName; delete mapped.commonName;
    mapped.desc = mapped.description; delete mapped.description;
    mapped.medicalUses = mapped.medicinalUses; delete mapped.medicinalUses;
    delete mapped.id; 
    delete mapped.image1Url;
    delete mapped.image2File;

    mapped.id = Date.now().toString();
    mapped.createdAt = new Date();
    mapped.updatedAt = new Date();

    const keys = Object.keys(mapped);
    const values = Object.values(mapped);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO floras (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;

    try {
        console.log("SQL:", sql);
        console.log("Values:", values);
        const [result] = await db.query(sql, values);
        console.log("Success");
    } catch(e) {
        console.error("SQL ERROR:", e.message);
    }
    process.exit(0);
}
test();
