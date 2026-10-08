const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- Helper Functions for Mapping ---
const mapToDb = (data) => {
    const validColumns = [
        'name', 'tamilName', 'scientificName', 'family', 'category', 'desc', 'benefits', 
        'medicalUses', 'culturalSignificance', 'economicUses', 'habitat', 'history', 
        'conservationStatus', 'nativeRegion', 'image1', 'image2', 'native', 'img', 
        'ecosystemImportance', 'diet', 'behaviour'
    ];
    
    const mapped = {};
    for (const [key, value] of Object.entries(data)) {
        let mappedKey = key;
        if (key === 'commonName') mappedKey = 'name';
        if (key === 'description') mappedKey = 'desc';
        if (key === 'medicinalUses') mappedKey = 'medicalUses';
        if (key === 'importanceToEcosystem') mappedKey = 'ecosystemImportance';
        
        if (validColumns.includes(mappedKey)) {
            mapped[mappedKey] = value;
        }
    }
    
    return mapped;
};

const mapToFrontend = (data) => {
    const mapped = { ...data };
    // Map DB columns back to frontend naming
    if (mapped.name !== undefined) {
        mapped.commonName = mapped.name;
        delete mapped.name;
    }
    if (mapped.desc !== undefined) {
        mapped.description = mapped.desc;
        delete mapped.desc;
    }
    if (mapped.medicalUses !== undefined) {
        mapped.medicinalUses = mapped.medicalUses;
        delete mapped.medicalUses;
    }
    if (mapped.ecosystemImportance !== undefined) {
        mapped.importanceToEcosystem = mapped.ecosystemImportance;
        delete mapped.ecosystemImportance;
    }
    return mapped;
};

// --- FLORA API ---
app.get("/api/flora", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM floras");
        const mappedRows = rows.map(mapToFrontend);
        res.json(mappedRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.get("/api/flora/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM floras WHERE id = ?", [req.params.id]);
        if (rows.length > 0) {
            res.json(mapToFrontend(rows[0]));
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("/api/flora", async (req, res) => {
    try {
        const dbData = mapToDb(req.body);
        dbData.id = Date.now().toString();
        dbData.createdAt = new Date();
        dbData.updatedAt = new Date();
        
        const keys = Object.keys(dbData);
        const values = Object.values(dbData);
        
        if (keys.length === 0) return res.status(400).json({ error: "Empty payload" });
        
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO floras (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
        
        const [result] = await db.query(sql, values);
        
        res.status(201).json({ 
            message: "Record created successfully", 
            record: mapToFrontend(dbData) 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create record" });
    }
});

app.put("/api/flora/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const dbData = mapToDb(req.body);
        dbData.updatedAt = new Date();
        
        const keys = Object.keys(dbData);
        const values = Object.values(dbData);
        
        if (keys.length === 0) return res.json({ message: "No fields to update" });
        
        const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
        const sql = `UPDATE floras SET ${setClause} WHERE id = ?`;
        
        const [result] = await db.query(sql, [...values, id]);
        
        if (result.affectedRows > 0) {
            const [updatedRows] = await db.query(`SELECT * FROM floras WHERE id = ?`, [id]);
            res.json({ message: "Record updated successfully", record: mapToFrontend(updatedRows[0]) });
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update record" });
    }
});

app.delete("/api/flora/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM floras WHERE id = ?", [req.params.id]);
        if (result.affectedRows > 0) res.json({ message: "Record deleted successfully" });
        else res.status(404).json({ error: "Record not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete record" });
    }
});

// --- FAUNA API ---
app.get("/api/fauna", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM faunas");
        const mappedRows = rows.map(mapToFrontend);
        res.json(mappedRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.get("/api/fauna/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM faunas WHERE id = ?", [req.params.id]);
        if (rows.length > 0) {
            res.json(mapToFrontend(rows[0]));
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("/api/fauna", async (req, res) => {
    try {
        const dbData = mapToDb(req.body);
        dbData.id = Date.now().toString();
        dbData.createdAt = new Date();
        dbData.updatedAt = new Date();
        
        const keys = Object.keys(dbData);
        const values = Object.values(dbData);
        
        if (keys.length === 0) return res.status(400).json({ error: "Empty payload" });
        
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO faunas (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
        
        const [result] = await db.query(sql, values);
        
        res.status(201).json({ 
            message: "Record created successfully", 
            record: mapToFrontend(dbData) 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create record" });
    }
});

app.put("/api/fauna/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const dbData = mapToDb(req.body);
        dbData.updatedAt = new Date();
        
        const keys = Object.keys(dbData);
        const values = Object.values(dbData);
        
        if (keys.length === 0) return res.json({ message: "No fields to update" });
        
        const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
        const sql = `UPDATE faunas SET ${setClause} WHERE id = ?`;
        
        const [result] = await db.query(sql, [...values, id]);
        
        if (result.affectedRows > 0) {
            const [updatedRows] = await db.query(`SELECT * FROM faunas WHERE id = ?`, [id]);
            res.json({ message: "Record updated successfully", record: mapToFrontend(updatedRows[0]) });
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update record" });
    }
});

app.delete("/api/fauna/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM faunas WHERE id = ?", [req.params.id]);
        if (result.affectedRows > 0) res.json({ message: "Record deleted successfully" });
        else res.status(404).json({ error: "Record not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete record" });
    }
});

// --- FEEDBACK API ---
app.get("/api/feedback", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM feedback");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("/api/feedback", async (req, res) => {
    try {
        const dbData = { ...req.body };
        dbData.id = Date.now().toString();
        if (!dbData.feedbackDate) dbData.feedbackDate = new Date();
        
        const keys = Object.keys(dbData);
        const values = Object.values(dbData);
        
        if (keys.length === 0) return res.status(400).json({ error: "Empty payload" });

        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO feedback (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
        
        const [result] = await db.query(sql, values);
        
        res.status(201).json({ message: "Record created successfully", record: dbData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create record" });
    }
});

app.delete("/api/feedback/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM feedback WHERE id = ?", [req.params.id]);
        if (result.affectedRows > 0) res.json({ message: "Record deleted successfully" });
        else res.status(404).json({ error: "Record not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete record" });
    }
});

// --- QR CODE API ---
app.get("/api/qr", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM qr_code");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("/api/qr", async (req, res) => {
    try {
        const dbData = { ...req.body };
        dbData.id = Date.now().toString();
        if (!dbData.createdDate) dbData.createdDate = new Date();
        
        const keys = Object.keys(dbData);
        const values = Object.values(dbData);
        
        if (keys.length === 0) return res.status(400).json({ error: "Empty payload" });

        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO qr_code (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
        
        const [result] = await db.query(sql, values);
        
        res.status(201).json({ message: "Record created successfully", record: dbData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create record" });
    }
});

app.delete("/api/qr/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM qr_code WHERE id = ?", [req.params.id]);
        if (result.affectedRows > 0) res.json({ message: "Record deleted successfully" });
        else res.status(404).json({ error: "Record not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete record" });
    }
});

// --- ADMIN LOGIN API ---
app.post("/api/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Parameterized query prevents SQL injection
        const [rows] = await db.query("SELECT * FROM admin WHERE email = ? AND password = ?", [email, password]);
        
        if (rows.length > 0) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

// --- ROOT ROUTE ---
app.get("/", (req, res) => {
    res.send("Green Campus Backend Running");
});

// --- UPLOAD CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only JPG, JPEG, PNG and WEBP images are allowed"));
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { files: 2 } // Allow max 2 images
});

// Image Upload Endpoint
app.post("/upload", (req, res) => {
    upload.array("images", 2)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        const uploadedFiles = req.files.map(file => file.filename);
        res.json({
            message: "Images uploaded successfully",
            files: uploadedFiles
        });
    });
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
