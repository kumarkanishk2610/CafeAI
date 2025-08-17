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
      // Fetch data from Google Sheets
      const response = await fetch(PRICE_SHEET_URL);
      const text = await response.text();
      
      // Parse the response (remove Google's wrapper)
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      // Extract data from the first row (row 2 in the sheet)
      const dataRow = json.table.rows[0];
      
      if (!dataRow || !dataRow.c || dataRow.c.length < 6) {
        // Not enough columns in data row
        return null;
      }
      
      // Extract values from columns
      const priceCol = dataRow.c[3]; // Column D2
      const preDiscountCol = dataRow.c[2]; // Column C2
      const discountNameCol = dataRow.c[1]; // Column B2
      const discountPercentCol = dataRow.c[4]; // Column E2
      
      if (!priceCol || !priceCol.v) {
        // Price column is empty or undefined
        return null;
      }
      
      // Parse the values
      const price = parseFloat(priceCol.v);
      const preDiscountPrice = preDiscountCol && preDiscountCol.v ? parseFloat(preDiscountCol.v) : null;
      const discountName = discountNameCol && discountNameCol.v ? String(discountNameCol.v).trim() : null;
      const discountPercent = discountPercentCol && discountPercentCol.v ? parseFloat(discountPercentCol.v) : null;
      
      if (isNaN(price)) {
        // Price is not a valid number
        return null;
      }
      
      // Extract QR folder information
      const qrFolderCol = dataRow.c[5]; // Column F2
      const qrFolder = qrFolderCol && qrFolderCol.v ? String(qrFolderCol.v).trim() : null;
      
      return {
        price,
        preDiscountPrice,
        discountName,
        discountPercent,
        qrFolder
      };
    } catch (error) {
      // Error fetching price
      return null;
    }
  }

async function getCurrentPrice() {
    if (cachedPrice && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
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