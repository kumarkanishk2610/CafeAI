# Google Apps Script Setup Guide for Email Template System

## 📋 Step-by-Step Setup

### **1. Create a New Google Apps Script Project**

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Rename the project to "Cafe Kyaa Email System"

### **2. Copy the Apps Script Code**

1. Delete the default `Code.gs` file content
2. Copy and paste the entire content from `apps-script-email-template.gs` into your Apps Script editor

### **3. Update the Spreadsheet ID**

In the `fetchBookingDataFromSheets` function, update the spreadsheet ID:

```javascript
const spreadsheetId = "1Sxrv3iIIdl_6RqAahVZBKKCA-PvzIJXIyz5fkhq0HNc"; // Your actual spreadsheet ID
```

### **4. Set Up Permissions**

1. Click "Run" on any function (e.g., `testEmailGeneration`)
2. Google will ask for permissions - click "Review Permissions"
3. Choose your Google account
4. Click "Advanced" → "Go to [Project Name] (unsafe)"
5. Click "Allow"

### **5. Test the System**

Run the `testEmailGeneration` function to test the setup:

```javascript
function testEmailGeneration() {
  const testBookingId = "925386"; // Replace with actual booking ID
  // ... rest of the function
}
```

## 🚀 How to Use

### **Option 1: Send Email with All Slots**

```javascript
sendFullConfirmationEmail("925386");
```

### **Option 2: Send Email with Specific Slots**

```javascript
const selectedSlots = ["Day 1 - 22 Aug - Slot 1", "Day 1 - 22 Aug - Slot 2"];
sendConfirmationEmail("925386", selectedSlots);
```

### **Option 3: Send Email with Only Active Slots**

```javascript
sendActiveSlotsConfirmationEmail("925386");
```

### **Option 4: Custom Slot Selection**

```javascript
// Only show slots that have food/beverage orders
const bookingData = fetchBookingDataFromSheets("925386");
const activeSlots = bookingData.slotDetails
  .filter(
    (slot) =>
      slot.omuriceQty > 0 ||
      slot.curryRiceQty > 0 ||
      slot.icedTeaQty > 0 ||
      slot.plainWaterQty > 0
  )
  .map((slot) => slot.slotDetails);

sendConfirmationEmail("925386", activeSlots);
```

## 📧 Email Template Features

### **Dynamic Content**

- ✅ Automatically fetches data from your Google Sheets
- ✅ Shows only the slots that users have booked
- ✅ Displays food/beverage quantities
- ✅ Calculates totals automatically

### **Flexible Display Options**

- ✅ Show all slots
- ✅ Show only specific days
- ✅ Show only slots with orders
- ✅ Custom slot selection

### **Professional Design**

- ✅ Responsive email template
- ✅ Professional branding
- ✅ QR code for entry
- ✅ Complete booking details

## 🔧 Customization

### **Update QR Code**

Replace the placeholder QR code with your actual QR code:

```javascript
const qrCodeUrl = "https://your-domain.com/qr-codes/925386.png";
sendConfirmationEmail("925386", null, qrCodeUrl);
```

### **Update Email Subject**

Modify the subject line in `sendConfirmationEmail`:

```javascript
const subject = `Your Custom Subject - Cafe Kyaa! (ID: ${bookingId})`;
```

### **Update Venue Details**

Edit the venue information in the `generateEmailContent` function.

## 📊 Data Structure

The system expects your Google Sheets to have this structure:

### **Raw Data Sheet**

- Column A: Timestamp
- Column B: Email
- Column C: Mobile
- Column D: Seats
- Column E: Hash (Booking ID)
- Column F: Transaction ID (optional)

### **Food Items Sheet**

- Column A: Timestamp
- Column B: Booking ID
- Column C: Slot ID
- Column D: Omurice Qty
- Column E: Curry Rice Qty
- Column F: Iced Tea Qty
- Column G: Plain Water Qty

## 🚨 Troubleshooting

### **Common Issues**

1. **"Spreadsheet not found"**

   - Check the spreadsheet ID is correct
   - Ensure the Apps Script has access to the spreadsheet

2. **"Booking ID not found"**

   - Verify the booking ID exists in the Raw Data sheet
   - Check that the Hash column (E) contains the booking ID

3. **"Permission denied"**

   - Run the test function again to trigger permission requests
   - Ensure you're using the correct Google account

4. **"Email not sent"**
   - Check the email address is valid
   - Verify the Apps Script has permission to send emails

### **Debug Mode**

Enable debug logging by checking the Apps Script logs:

```javascript
Logger.log("Debug info: " + JSON.stringify(data, null, 2));
```

## 📝 Example Usage Scenarios

### **Scenario 1: Send confirmation after payment**

```javascript
function sendPaymentConfirmation(bookingId) {
  sendFullConfirmationEmail(bookingId);
}
```

### **Scenario 2: Send reminder with only active slots**

```javascript
function sendReminderEmail(bookingId) {
  sendActiveSlotsConfirmationEmail(bookingId);
}
```

### **Scenario 3: Send day-specific confirmation**

```javascript
function sendDay1Confirmation(bookingId) {
  const day1Slots = [
    "Day 1 - 22 Aug - Slot 1",
    "Day 1 - 22 Aug - Slot 2",
    "Day 1 - 22 Aug - Slot 3",
    "Day 1 - 22 Aug - Slot 4",
  ];
  sendConfirmationEmail(bookingId, day1Slots);
}
```

## 🎯 Integration Tips

### **Trigger on Form Submission**

Set up a trigger to automatically send emails when new bookings are made:

```javascript
function onFormSubmit(e) {
  const bookingId = e.values[4]; // Assuming booking ID is in column E
  sendFullConfirmationEmail(bookingId);
}
```

### **Batch Processing**

Send emails to multiple bookings:

```javascript
function sendBatchConfirmations() {
  const bookingIds = ["925386", "925387", "925388"];
  bookingIds.forEach((id) => {
    try {
      sendFullConfirmationEmail(id);
    } catch (error) {
      Logger.log(`Failed to send email for booking ${id}: ${error}`);
    }
  });
}
```

This setup gives you a complete, flexible email system that integrates seamlessly with your Google Sheets data!
