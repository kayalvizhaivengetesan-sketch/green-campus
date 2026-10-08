const db = require("./db");

const mapToDb = (data) => {
    const mapped = { ...data };
    if (mapped.commonName !== undefined) {
        mapped.name = mapped.commonName;
        delete mapped.commonName;
    }
    if (mapped.description !== undefined) {
        mapped.desc = mapped.description;
        delete mapped.description;
    }
    if (mapped.medicinalUses !== undefined) {
        mapped.medicalUses = mapped.medicinalUses;
        delete mapped.medicinalUses;
    }
    delete mapped.id; 
    return mapped;
};

const floraData = {
    commonName: "Ashoka Tree",
    tamilName: "அசோக மரம்",
    scientificName: "Saraca asoca",
    family: "Fabaceae",
    category: "Trees, Flowering Plants, Medicinal Plants, Ornamental Plants",
    habitat: "Tropical and subtropical forests, especially moist areas.",
    description: "A small to medium-sized evergreen tree known for its beautiful clusters of orange, yellow and reddish flowers. It is widely valued as an ornamental and medicinal plant.",
    history: "The Ashoka tree has been associated with Indian culture and traditional medicine for centuries.",
    benefits: "Provides shade, supports biodiversity and has ornamental value.",
    medicinalUses: "Traditionally used in Ayurveda for women's health and various herbal preparations.",
    culturalSignificance: "Considered an important cultural tree in India and is valued for its attractive flowers.",
    economicUses: "Used in traditional herbal products and ornamental landscaping.",
    conservationStatus: "Vulnerable",
    nativeRegion: "Indian Subcontinent, especially India, Nepal, Bangladesh and Sri Lanka.",
    image1: "",
    image2: ""
};

async function addFlora() {
    try {
        const [existing] = await db.query("SELECT id FROM floras WHERE scientificName = ?", [floraData.scientificName]);
        if (existing.length > 0) {
            console.log("Record already exists with ID:", existing[0].id);
            process.exit(0);
        }

        const dbData = mapToDb(floraData);
        dbData.id = Date.now().toString();
        dbData.createdAt = new Date();
        dbData.updatedAt = new Date();
        
        const keys = Object.keys(dbData);
        const values = Object.values(dbData);
        const placeholders = keys.map(() => '?').join(', ');
        
        const sql = `INSERT INTO floras (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
        const [result] = await db.query(sql, values);
        
        console.log("Successfully inserted record ID:", dbData.id);
        process.exit(0);
    } catch (err) {
        console.error("Error inserting record:", err);
        process.exit(1);
    }
}
addFlora();
