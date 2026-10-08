const fs = require('fs');

async function test() {
    try {
        // Create a fake base64 image (small)
        const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

        // 1. Upload the image (simulate storage.js uploadImages)
        const res = await fetch(base64Image);
        const blob = await res.blob();
        
        const formData = new FormData();
        formData.append('images', blob, 'test.png');
        
        console.log("Uploading image...");
        const uploadRes = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!uploadRes.ok) throw new Error("Upload failed");
        
        const uploadData = await uploadRes.json();
        const uploadedUrl = `http://localhost:5000/uploads/${uploadData.files[0]}`;
        console.log("Uploaded URL:", uploadedUrl);

        // 2. Fetch an existing Flora ID to update
        console.log("Fetching existing flora...");
        const floraRes = await fetch('http://localhost:5000/api/flora');
        const floraList = await floraRes.json();
        if (floraList.length === 0) throw new Error("No flora found");
        
        const targetId = floraList[0].id;
        const targetFlora = floraList[0];
        
        console.log(`Updating flora ID: ${targetId}`);
        
        // 3. Prepare payload (simulate storage.js updateFlora)
        const finalFlora = {
            ...targetFlora,
            image1: targetFlora.image1 || '',
            image2: uploadedUrl
        };
        delete finalFlora.image1Url;
        delete finalFlora.image2File;

        // 4. Send PUT request
        const putRes = await fetch(`http://localhost:5000/api/flora/${targetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalFlora)
        });
        
        const putData = await putRes.json();
        
        if (!putRes.ok) {
            console.error("Update failed:", putData);
        } else {
            console.log("Update success:", putData.message);
            console.log("Updated record image2:", putData.record.image2);
        }
    } catch(e) {
        console.error("Test failed:", e);
    }
}
test();
