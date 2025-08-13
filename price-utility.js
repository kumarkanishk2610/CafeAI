// Dynamic Pricing Utility
const PRICE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1Sxrv3iIIdl_6RqAahVZBKKCA-PvzIJXIyz5fkhq0HNc/gviz/tq?tqx=out:json&gid=1287652045";

// Cell references for pricing data
const PRICE_CELL = "D2";        // Current price (after discount)
const PRE_DISCOUNT_CELL = "C2"; // Pre-discount price
const DISCOUNT_NAME_CELL = "B2"; // Discount name (e.g., "Early Bird Discount")
const DISCOUNT_PERCENT_CELL = "E2"; // Discount percentage
const QR_FOLDER_CELL = "F2";    // QR code folder name (e.g., "upiqr")

let cachedPrice = null;
let cachedDiscountData = null;
let pricePromise = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

async function fetchPriceFromSheet() {
    try {
        console.log("[Price] Fetching price from sheet...");
        const response = await fetch(PRICE_SHEET_URL);
        const text = await response.text();
        console.log("[Price] Raw response text:", text.substring(0, 200) + "...");
        
        const jsonText = text.substring(47, text.length - 2);
        const json = JSON.parse(jsonText);
        
        console.log("[Price] Parsed JSON structure:", json);
        console.log("[Price] Table structure:", json.table);
        console.log("[Price] Rows:", json.table?.rows);
        
        if (json.table && json.table.rows && json.table.rows.length > 0) {
            // Look at the second row (index 1) since first row appears to be headers
            const dataRow = json.table.rows[1] || json.table.rows[0];
            console.log("[Price] Data row:", dataRow);
            console.log("[Price] Data row columns:", dataRow.c);
            
            // Check if columns exist and have values
            if (!dataRow.c || dataRow.c.length < 5) {
                console.error("[Price] Not enough columns in data row:", dataRow.c);
                throw new Error("Insufficient columns in sheet");
            }
            
            // Check each column value
            const priceCol = dataRow.c[3];
            const preDiscountCol = dataRow.c[2];
            const discountNameCol = dataRow.c[1];
            const discountPercentCol = dataRow.c[4];
            
            console.log("[Price] Price column (D2):", priceCol);
            console.log("[Price] Pre-discount column (C2):", preDiscountCol);
            console.log("[Price] Discount name column (B2):", discountNameCol);
            console.log("[Price] Discount percent column (E2):", discountPercentCol);
            
            if (!priceCol || !priceCol.v) {
                console.error("[Price] Price column is empty or undefined");
                throw new Error("Price column is empty");
            }
            
            const price = parseFloat(priceCol.v);
            const preDiscountPrice = parseFloat(preDiscountCol.v) || price;
            const discountName = discountNameCol.v || "";
            const discountPercent = parseFloat(discountPercentCol.v) || 0;
            
            console.log("[Price] Parsed values:", { price, preDiscountPrice, discountName, discountPercent });
            
            if (isNaN(price)) {
                console.error("[Price] Price is not a valid number:", priceCol.v);
                throw new Error("Price is not a valid number");
            }
            
            // Get QR folder from F2
            const qrFolderCol = dataRow.c[5]; // Column F (index 5)
            const qrFolder = qrFolderCol && qrFolderCol.v ? qrFolderCol.v : "upiqr"; // Default to "upiqr"
            
            console.log("[Price] QR folder column (F2):", qrFolderCol);
            console.log("[Price] QR folder:", qrFolder);
            
            return {
                price: price,
                preDiscountPrice: preDiscountPrice,
                discountName: discountName,
                discountPercent: discountPercent,
                qrFolder: qrFolder
            };
        }
        throw new Error("No data found in sheet");
    } catch (error) {
        console.error("[Price] Error fetching price:", error);
        console.error("[Price] Full error details:", error.stack);
        return {
            price: 500,
            preDiscountPrice: 500,
            discountName: "",
            discountPercent: 0
        };
    }
}

async function getCurrentPrice() {
    if (cachedPrice && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
        console.log("[Price] Using cached price:", cachedPrice);
        return cachedPrice;
    }
    
    if (pricePromise) {
        return pricePromise;
    }
    
    pricePromise = fetchPriceFromSheet();
    const data = await pricePromise;
    cachedPrice = data.price;
    cachedDiscountData = data;
    lastFetchTime = Date.now();
    pricePromise = null;
    
    return data.price;
}

async function getCurrentDiscountData() {
    if (cachedDiscountData && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
        return cachedDiscountData;
    }
    
    if (pricePromise) {
        const data = await pricePromise;
        return data;
    }
    
    pricePromise = fetchPriceFromSheet();
    const data = await pricePromise;
    cachedPrice = data.price;
    cachedDiscountData = data;
    lastFetchTime = Date.now();
    pricePromise = null;
    
    return data;
}

async function getCurrentQRFolder() {
    if (cachedDiscountData && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
        return cachedDiscountData.qrFolder;
    }
    
    if (pricePromise) {
        const data = await pricePromise;
        return data.qrFolder;
    }
    
    pricePromise = fetchPriceFromSheet();
    const data = await pricePromise;
    cachedPrice = data.price;
    cachedDiscountData = data;
    lastFetchTime = Date.now();
    pricePromise = null;
    
    return data.qrFolder;
}

async function refreshPrice() {
    cachedPrice = null;
    cachedDiscountData = null;
    lastFetchTime = null;
    pricePromise = null;
    console.log("[Price] Cache cleared, will fetch fresh data");
    return await getCurrentPrice();
}

async function calculateAmount(seats) {
    const price = await getCurrentPrice();
    return seats * price;
}

async function getPriceWithLoading(updateCallback, loadingText = "Loading...") {
    try {
        updateCallback(loadingText);
        const price = await getCurrentPrice();
        updateCallback(price.toString());
        return price;
    } catch (error) {
        console.error("[Price] Error getting price with loading:", error);
        updateCallback("500"); // Fallback
        return 500;
    }
}

window.PriceUtility = {
    getCurrentPrice,
    getCurrentDiscountData,
    getCurrentQRFolder,
    refreshPrice,
    calculateAmount,
    getPriceWithLoading
}; 