/**
 * Email Template Generator for Cafe Kyaa!
 * This utility helps generate dynamic email content from Google Sheet data
 */

// Sample data structure (replace with actual Google Sheet data)
const sampleBookingData = {
  bookingId: "925386",
  email: "kanishkkumar2610@gmail.com",
  mobile: "8758610922",
  seats: "12",
  transactionId: "txnid1234",
  totalAmount: "₹2400",
  slotDetails: [
    {
      slotDetails: "Day 1 - 22 Aug - Slot 1",
      count: 1,
      omuriceQty: 1,
      curryRiceQty: 0,
      icedTeaQty: 1,
      plainWaterQty: 0
    },
    {
      slotDetails: "Day 1 - 22 Aug - Slot 2",
      count: 1,
      omuriceQty: 0,
      curryRiceQty: 1,
      icedTeaQty: 0,
      plainWaterQty: 1
    },
    {
      slotDetails: "Day 1 - 22 Aug - Slot 3",
      count: 1,
      omuriceQty: 1,
      curryRiceQty: 0,
      icedTeaQty: 0,
      plainWaterQty: 1
    },
    {
      slotDetails: "Day 1 - 22 Aug - Slot 4",
      count: 1,
      omuriceQty: 0,
      curryRiceQty: 1,
      icedTeaQty: 1,
      plainWaterQty: 0
    },
    {
      slotDetails: "Day 2 - 23 Aug - Slot 1",
      count: 1,
      omuriceQty: 1,
      curryRiceQty: 0,
      icedTeaQty: 0,
      plainWaterQty: 1
    },
    {
      slotDetails: "Day 2 - 23 Aug - Slot 2",
      count: 1,
      omuriceQty: 0,
      curryRiceQty: 1,
      icedTeaQty: 0,
      plainWaterQty: 1
    },
    {
      slotDetails: "Day 2 - 23 Aug - Slot 3",
      count: 1,
      omuriceQty: 0,
      curryRiceQty: 1,
      icedTeaQty: 1,
      plainWaterQty: 0
    },
    {
      slotDetails: "Day 2 - 23 Aug - Slot 4",
      count: 1,
      omuriceQty: 1,
      curryRiceQty: 0,
      icedTeaQty: 1,
      plainWaterQty: 0
    },
    {
      slotDetails: "Day 3 - 24 Aug - Slot 1",
      count: 1,
      omuriceQty: 1,
      curryRiceQty: 0,
      icedTeaQty: 1,
      plainWaterQty: 0
    },
    {
      slotDetails: "Day 3 - 24 Aug - Slot 2",
      count: 1,
      omuriceQty: 0,
      curryRiceQty: 1,
      icedTeaQty: 0,
      plainWaterQty: 1
    },
    {
      slotDetails: "Day 3 - 24 Aug - Slot 3",
      count: 1,
      omuriceQty: 1,
      curryRiceQty: 0,
      icedTeaQty: 1,
      plainWaterQty: 0
    },
    {
      slotDetails: "Day 3 - 24 Aug - Slot 4",
      count: 1,
      omuriceQty: 1,
      curryRiceQty: 0,
      icedTeaQty: 0,
      plainWaterQty: 1
    }
  ]
};

/**
 * Generate slot rows HTML for email template
 * @param {Array} slotDetails - Array of slot detail objects
 * @param {Array} selectedSlots - Array of slot IDs to include (optional, if not provided, all slots are included)
 * @returns {string} HTML string for slot rows
 */
function generateSlotRows(slotDetails, selectedSlots = null) {
  let rowsHTML = '';
  let totalFoodItems = 0;
  let totalBeverages = 0;
  
  // Filter slots if selectedSlots is provided
  const slotsToShow = selectedSlots 
    ? slotDetails.filter(slot => selectedSlots.includes(slot.slotDetails))
    : slotDetails;
  
  slotsToShow.forEach((slot, index) => {
    const isEvenRow = index % 2 === 0;
    const rowBgColor = isEvenRow ? '#ffffff' : '#f9fafb';
    
    // Calculate totals
    const foodItems = slot.omuriceQty + slot.curryRiceQty;
    const beverages = slot.icedTeaQty + slot.plainWaterQty;
    totalFoodItems += foodItems;
    totalBeverages += beverages;
    
    rowsHTML += `
      <tr style="background-color: ${rowBgColor};">
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500; color: #374151; font-size: 14px;">
            ${formatSlotDisplay(slot.slotDetails)}
          </div>
        </td>
        <td style="padding: 12px 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <span style="font-weight: 600; color: #059669; font-size: 14px;">
            ${slot.count}
          </span>
        </td>
        <td style="padding: 12px 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <span style="font-weight: 500; color: #374151; font-size: 14px;">
            ${slot.omuriceQty > 0 ? slot.omuriceQty : '-'}
          </span>
        </td>
        <td style="padding: 12px 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <span style="font-weight: 500; color: #374151; font-size: 14px;">
            ${slot.curryRiceQty > 0 ? slot.curryRiceQty : '-'}
          </span>
        </td>
        <td style="padding: 12px 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <span style="font-weight: 500; color: #374151; font-size: 14px;">
            ${slot.icedTeaQty > 0 ? slot.icedTeaQty : '-'}
          </span>
        </td>
        <td style="padding: 12px 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <span style="font-weight: 500; color: #374151; font-size: 14px;">
            ${slot.plainWaterQty > 0 ? slot.plainWaterQty : '-'}
          </span>
        </td>
      </tr>
    `;
  });
  
  return {
    rowsHTML,
    totalFoodItems,
    totalBeverages
  };
}

/**
 * Format slot details for better display
 * @param {string} slotDetails - Raw slot details string
 * @returns {string} Formatted slot details
 */
function formatSlotDisplay(slotDetails) {
  // Convert "Day 1 - 22 Aug - Slot 1" to "Day 1 (22 Aug) - 11:00 AM"
  const slotNameMapping = {
    "Slot 1": "11:00 AM",
    "Slot 2": "1:00 PM", 
    "Slot 3": "3:00 PM",
    "Slot 4": "5:00 PM"
  };
  
  const match = slotDetails.match(/Day (\d+) - (\d+ \w+) - (Slot \d+)/);
  if (match) {
    const day = match[1];
    const date = match[2];
    const slot = match[3];
    const time = slotNameMapping[slot] || slot;
    return `Day ${day} (${date}) - ${time}`;
  }
  
  return slotDetails;
}

/**
 * Generate complete email content
 * @param {Object} bookingData - Booking data object
 * @param {Array} selectedSlots - Array of slot IDs to include (optional)
 * @param {string} entryQRCode - URL or base64 string for QR code
 * @returns {string} Complete email HTML content
 */
function generateEmailContent(bookingData, selectedSlots = null, entryQRCode = 'https://via.placeholder.com/200x200/ec4899/ffffff?text=QR+Code') {
  const { rowsHTML, totalFoodItems, totalBeverages } = generateSlotRows(bookingData.slotDetails, selectedSlots);
  
  // Read the email template
  const emailTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation - Cafe Kyaa!</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8f9fa;
      line-height: 1.6;
    "
  >
    <!-- Email Container -->
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #f8f9fa"
    >
      <tr>
        <td align="center" style="padding: 20px 0">
          <!-- Main Content Table -->
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="
              max-width: 600px;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
                  padding: 40px 30px;
                  text-align: center;
                "
              >
                <img
                  src="https://via.placeholder.com/120x60/ffffff/ec4899?text=Cafe+Kyaa!"
                  alt="Cafe Kyaa!"
                  style="
                    width: 120px;
                    height: 60px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                  "
                />
                <h1
                  style="
                    color: #ffffff;
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                  "
                >
                  Booking Confirmed!
                </h1>
                <p
                  style="
                    color: #ffffff;
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.9;
                  "
                >
                  Anime India 2025 · Mumbai
                </p>
              </td>
            </tr>

            <!-- Success Message -->
            <tr>
              <td
                style="
                  padding: 30px;
                  text-align: center;
                  background-color: #f0fdf4;
                  border-bottom: 1px solid #e5e7eb;
                "
              >
                <div
                  style="
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(
                      135deg,
                      #10b981 0%,
                      #059669 100%
                    );
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span style="color: #ffffff; font-size: 24px">✓</span>
                </div>
                <h2
                  style="
                    color: #065f46;
                    margin: 0 0 10px 0;
                    font-size: 24px;
                    font-weight: 600;
                  "
                >
                  Payment Successful!
                </h2>
                <p style="color: #047857; margin: 0; font-size: 16px">
                  Your booking has been confirmed and payment received.
                </p>
              </td>
            </tr>

            <!-- Entry QR Code -->
            <tr>
              <td
                style="
                  padding: 30px;
                  text-align: center;
                  background-color: #f8fafc;
                  border-bottom: 1px solid #e5e7eb;
                "
              >
                <h3
                  style="
                    color: #1f2937;
                    margin: 0 0 20px 0;
                    font-size: 20px;
                    font-weight: 600;
                  "
                >
                  Entry Pass
                </h3>
                <p
                  style="
                    color: #6b7280;
                    margin: 0 0 20px 0;
                    font-size: 14px;
                    font-weight: 500;
                  "
                >
                  Show this QR code at the venue for entry
                </p>
                <div
                  style="
                    display: inline-block;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    border: 2px solid #e5e7eb;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  "
                >
                  <img
                    src="${entryQRCode}"
                    alt="Entry QR Code"
                    style="width: 200px; height: 200px; display: block"
                  />
                </div>
                <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 12px">
                  Booking ID: ${bookingData.bookingId}
                </p>
              </td>
            </tr>

            <!-- Booking Details -->
            <tr>
              <td style="padding: 30px">
                <h3
                  style="
                    color: #1f2937;
                    margin: 0 0 20px 0;
                    font-size: 20px;
                    font-weight: 600;
                  "
                >
                  Booking Details
                </h3>

                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="margin-bottom: 25px"
                >
                  <tr>
                    <td
                      style="padding: 12px 0; border-bottom: 1px solid #e5e7eb"
                    >
                      <span
                        style="
                          color: #6b7280;
                          font-weight: 500;
                          display: inline-block;
                          width: 120px;
                        "
                        >Booking ID:</span
                      >
                      <span style="color: #1f2937; font-weight: 600"
                        >${bookingData.bookingId}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 12px 0; border-bottom: 1px solid #e5e7eb"
                    >
                      <span
                        style="
                          color: #6b7280;
                          font-weight: 500;
                          display: inline-block;
                          width: 120px;
                        "
                        >Email:</span
                      >
                      <span style="color: #1f2937">${bookingData.email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 12px 0; border-bottom: 1px solid #e5e7eb"
                    >
                      <span
                        style="
                          color: #6b7280;
                          font-weight: 500;
                          display: inline-block;
                          width: 120px;
                        "
                        >Mobile:</span
                      >
                      <span style="color: #1f2937">${bookingData.mobile}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 12px 0; border-bottom: 1px solid #e5e7eb"
                    >
                      <span
                        style="
                          color: #6b7280;
                          font-weight: 500;
                          display: inline-block;
                          width: 120px;
                        "
                        >Total Seats:</span
                      >
                      <span style="color: #1f2937">${bookingData.seats}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 12px 0; border-bottom: 1px solid #e5e7eb"
                    >
                      <span
                        style="
                          color: #6b7280;
                          font-weight: 500;
                          display: inline-block;
                          width: 120px;
                        "
                        >Transaction ID:</span
                      >
                      <span style="color: #1f2937">${bookingData.transactionId}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0">
                      <span
                        style="
                          color: #6b7280;
                          font-weight: 500;
                          display: inline-block;
                          width: 120px;
                        "
                        >Amount Paid:</span
                      >
                      <span
                        style="
                          color: #1f2937;
                          font-weight: 600;
                          font-size: 18px;
                        "
                        >${bookingData.totalAmount}</span
                      >
                    </td>
                  </tr>
                </table>

                <!-- Slot Details -->
                <h3
                  style="
                    color: #1f2937;
                    margin: 30px 0 20px 0;
                    font-size: 20px;
                    font-weight: 600;
                  "
                >
                  Your Slots & Orders
                </h3>
                <div
                  style="
                    background-color: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 25px;
                  "
                >
                  <!-- Dynamic Slot Details Table -->
                  <table
                    role="presentation"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    width="100%"
                    style="border-collapse: collapse; margin-bottom: 20px"
                  >
                    <!-- Table Header -->
                    <tr style="background-color: #e5e7eb; border-radius: 8px 8px 0 0">
                      <th
                        style="
                          padding: 12px 8px;
                          text-align: left;
                          font-weight: 600;
                          color: #374151;
                          font-size: 14px;
                          border-bottom: 2px solid #d1d5db;
                        "
                      >
                        Slot Details
                      </th>
                      <th
                        style="
                          padding: 12px 8px;
                          text-align: center;
                          font-weight: 600;
                          color: #374151;
                          font-size: 14px;
                          border-bottom: 2px solid #d1d5db;
                        "
                      >
                        Seats
                      </th>
                      <th
                        style="
                          padding: 12px 8px;
                          text-align: center;
                          font-weight: 600;
                          color: #374151;
                          font-size: 14px;
                          border-bottom: 2px solid #d1d5db;
                        "
                      >
                        Omurice
                      </th>
                      <th
                        style="
                          padding: 12px 8px;
                          text-align: center;
                          font-weight: 600;
                          color: #374151;
                          font-size: 14px;
                          border-bottom: 2px solid #d1d5db;
                        "
                      >
                        Curry Rice
                      </th>
                      <th
                        style="
                          padding: 12px 8px;
                          text-align: center;
                          font-weight: 600;
                          color: #374151;
                          font-size: 14px;
                          border-bottom: 2px solid #d1d5db;
                        "
                      >
                        Iced Tea
                      </th>
                      <th
                        style="
                          padding: 12px 8px;
                          text-align: center;
                          font-weight: 600;
                          color: #374151;
                          font-size: 14px;
                          border-bottom: 2px solid #d1d5db;
                        "
                      >
                        Plain Water
                      </th>
                    </tr>
                    
                    <!-- Dynamic Slot Rows -->
                    ${rowsHTML}
                  </table>
                  
                  <!-- Summary Row -->
                  <div
                    style="
                      background-color: #ffffff;
                      border-radius: 6px;
                      padding: 15px;
                      margin-top: 15px;
                      border: 1px solid #e5e7eb;
                    "
                  >
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-weight: 600; color: #374151;">Total Summary:</span>
                      <div style="text-align: right;">
                        <div style="font-size: 14px; color: #6b7280;">
                          <span style="font-weight: 500;">Total Seats:</span> 
                          <span style="font-weight: 600; color: #374151;">${bookingData.seats}</span>
                        </div>
                        <div style="font-size: 14px; color: #6b7280;">
                          <span style="font-weight: 500;">Total Food Items:</span> 
                          <span style="font-weight: 600; color: #374151;">${totalFoodItems}</span>
                        </div>
                        <div style="font-size: 14px; color: #6b7280;">
                          <span style="font-weight: 500;">Total Beverages:</span> 
                          <span style="font-weight: 600; color: #374151;">${totalBeverages}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Important Information -->
            <tr>
              <td style="padding: 0 30px 30px 30px">
                <div
                  style="
                    background: linear-gradient(
                      135deg,
                      #fef3c7 0%,
                      #fde68a 100%
                    );
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 20px;
                  "
                >
                  <h4
                    style="
                      color: #92400e;
                      margin: 0 0 15px 0;
                      font-size: 18px;
                      font-weight: 600;
                    "
                  >
                    📋 Important Information
                  </h4>
                  <ul style="color: #92400e; margin: 0; padding-left: 20px">
                    <li style="margin-bottom: 8px">
                      Please arrive 10 minutes before your scheduled slot time
                    </li>
                    <li style="margin-bottom: 8px">
                      Bring a valid ID proof for verification
                    </li>
                    <li style="margin-bottom: 8px">
                      This confirmation email serves as your entry pass
                    </li>
                    <li style="margin-bottom: 0">
                      For any queries, contact us via our support form
                    </li>
                  </ul>
                </div>
              </td>
            </tr>

            <!-- Venue Details -->
            <tr>
              <td style="padding: 0 30px 30px 30px">
                <div
                  style="
                    background-color: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                  "
                >
                  <h4
                    style="
                      color: #1f2937;
                      margin: 0 0 15px 0;
                      font-size: 18px;
                      font-weight: 600;
                    "
                  >
                    📍 Venue Details
                  </h4>
                  <p
                    style="color: #4b5563; margin: 0 0 10px 0; font-weight: 500"
                  >
                    Anime India 2025
                  </p>
                  <p style="color: #6b7280; margin: 0 0 10px 0">
                    Mumbai, Maharashtra
                  </p>
                  <p style="color: #6b7280; margin: 0">
                    Event Date: August 22-24, 2025
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  background-color: #1f2937;
                  padding: 30px;
                  text-align: center;
                "
              >
                <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 14px">
                  Thank you for choosing Cafe Kyaa!
                </p>
                <p style="color: #9ca3af; margin: 0 0 20px 0; font-size: 14px">
                  For support, visit our help form
                </p>
                <div style="border-top: 1px solid #374151; padding-top: 20px">
                  <p style="color: #6b7280; margin: 0; font-size: 12px">
                    © 2025 Cafe Kyaa! All rights reserved.
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  
  return emailTemplate;
}

/**
 * Example usage functions
 */

// Generate email with all slots
function generateFullEmail() {
  return generateEmailContent(sampleBookingData);
}

// Generate email with only specific slots (e.g., only Day 1 slots)
function generatePartialEmail() {
  const selectedSlots = [
    "Day 1 - 22 Aug - Slot 1",
    "Day 1 - 22 Aug - Slot 2", 
    "Day 1 - 22 Aug - Slot 3",
    "Day 1 - 22 Aug - Slot 4"
  ];
  return generateEmailContent(sampleBookingData, selectedSlots);
}

// Generate email with only slots that have food/beverage orders
function generateActiveSlotsEmail() {
  const activeSlots = sampleBookingData.slotDetails.filter(slot => 
    slot.omuriceQty > 0 || slot.curryRiceQty > 0 || slot.icedTeaQty > 0 || slot.plainWaterQty > 0
  ).map(slot => slot.slotDetails);
  return generateEmailContent(sampleBookingData, activeSlots);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateSlotRows,
    formatSlotDisplay,
    generateEmailContent,
    generateFullEmail,
    generatePartialEmail,
    generateActiveSlotsEmail,
    sampleBookingData
  };
} 