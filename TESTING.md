# End-to-End Testing Guide

## System Overview
This testing guide covers all major features of the Astral Gym Management System.

---

## 1. Authentication & Authorization

### Test 1.1: Admin Login
- [ ] Navigate to `/login`
- [ ] Enter admin credentials
- [ ] Verify dashboard loads with admin access
- [ ] Check sidebar shows admin-only sections

### Test 1.2: Super Admin Specific Features
- [ ] Login as super_admin
- [ ] Verify Settings page accessible at `/settings`
- [ ] Check permission matrix displays correctly
- [ ] Verify member deletion only available to super_admin

### Test 1.3: Role-Based Access Control
- [ ] Attempt to access `/settings` as admin (should redirect to login or deny)
- [ ] Verify permission checks work across all pages

---

## 2. Member Management

### Test 2.1: Member Listing
- [ ] Navigate to `/members`
- [ ] Verify all members display
- [ ] Check pagination (if implemented)
- [ ] Verify member cards show: name, email, phone, plan, status

### Test 2.2: Add Member
- [ ] Click "+ Add Member"
- [ ] Fill in form with valid data
- [ ] Submit and verify member appears in list
- [ ] Check database for new record

### Test 2.3: Edit Member
- [ ] Click edit on any member
- [ ] Modify membership_type or renewal_date
- [ ] Save changes
- [ ] Verify updates appear immediately

### Test 2.4: Delete Member (Super Admin Only)
- [ ] Login as super_admin
- [ ] Attempt to delete member
- [ ] Confirm deletion dialog
- [ ] Verify member removed from list
- [ ] As admin, verify delete button is disabled/hidden

---

## 3. Attendance Tracking

### Test 3.1: Check-in
- [ ] Navigate to `/attendance`
- [ ] Search for member
- [ ] Click "Check In"
- [ ] Verify today's date shows in attendance list

### Test 3.2: View Attendance History
- [ ] Click member to view details
- [ ] Verify attendance history displays
- [ ] Check date formatting is correct

---

## 4. Sales & Payments

### Test 4.1: View Sales Dashboard
- [ ] Navigate to `/sales`
- [ ] Verify payment type cards show: Memberships, Walk-ins, Merchandise
- [ ] Check payment method breakdown (Online/Cash)
- [ ] Verify recent transactions display in table

### Test 4.2: Record Transaction
- [ ] Click "+ Record" button
- [ ] Fill in transaction details
- [ ] Select payment method (Online or Cash)
- [ ] Submit and verify appears in transactions list

---

## 5. Financial Reporting (NEW)

### Test 5.1: Financial Reports Page
- [ ] Navigate to `/reports/financial`
- [ ] Verify key metrics display: Total Revenue, Transactions, Avg Transaction, Period

### Test 5.2: Date Range Filter
- [ ] Set Start Date: 1 month ago
- [ ] Set End Date: today
- [ ] Verify report recalculates
- [ ] Check revenue breakdown updates

### Test 5.3: Payment Method Filter
- [ ] Select "Online" only
- [ ] Verify only online transactions included
- [ ] Select "Cash" only
- [ ] Verify calculations change
- [ ] Reset to "All Methods"

### Test 5.4: Revenue Breakdown
- [ ] Verify "Revenue by Payment Method" shows Online/Cash split
- [ ] Check percentages sum to 100%
- [ ] Verify "Revenue by Type" shows top transaction types
- [ ] Check daily breakdown table

---

## 6. Renewal Tracking (NEW)

### Test 6.1: Renewal Dashboard
- [ ] Navigate to `/reports/renewals`
- [ ] Verify statistics cards show: Total, Active, Expiring Soon, Expired

### Test 6.2: Filter by Status
- [ ] Click "Active" card to filter
- [ ] Verify only active members display
- [ ] Click "Expiring Soon" (7 days or less)
- [ ] Verify filtered members display
- [ ] Click "Expired" to view past renewals
- [ ] Reset to "All"

### Test 6.3: Renewal Reminders
- [ ] Select a member with "Expiring" status
- [ ] Click "Send Reminder" button
- [ ] Verify notification sent (check logs or email)
- [ ] Check member's email receives renewal notification

### Test 6.4: Days Until Expiry
- [ ] Verify "Days Left" column shows accurate countdown
- [ ] For expired members, verify shows negative (days ago)

---

## 7. Inventory Management

### Test 7.1: Inventory List
- [ ] Navigate to `/inventory`
- [ ] Verify all drinks display with: name, quantity, price, status
- [ ] Check low-stock alert banner appears when applicable
- [ ] Verify expiry date countdown displays

### Test 7.2: Add Inventory Item
- [ ] Click "+ Add Item"
- [ ] Fill form:
  - [ ] Name: "Gatorade Blue"
  - [ ] Category: "sports_drink"
  - [ ] Quantity: 20
  - [ ] Unit Price: ₱45
  - [ ] Reorder Level: 5
  - [ ] Supplier: "Local Supplier"
  - [ ] Expiry Date: (future date)
- [ ] Click Add
- [ ] Verify item appears in inventory list

### Test 7.3: Record Transaction
- [ ] Click on inventory item
- [ ] Select "Sale" transaction type
- [ ] Enter quantity: 3
- [ ] Click Record
- [ ] Verify quantity decreases from 20 to 17

### Test 7.4: Inventory Reports
- [ ] Navigate to `/inventory/reports`
- [ ] Verify dashboard shows:
  - [ ] Total Items
  - [ ] Total Quantity
  - [ ] Inventory Value
  - [ ] Low Stock Count
- [ ] Check category breakdown with values
- [ ] Verify expiry status indicators (color-coded)

### Test 7.5: CSV Export
- [ ] On inventory page, click "↓ Export"
- [ ] Verify CSV downloads
- [ ] Open CSV and verify columns:
  - [ ] Name, Category, Quantity, Unit Price, Supplier, Reorder Level, Expiry Date, Days Until Expiry

### Test 7.6: Restock Transaction
- [ ] Record a "Restock" transaction
- [ ] Enter quantity: 15
- [ ] Verify quantity increases (17 + 15 = 32)

---

## 8. AI Reminders System

### Test 8.1: Renewal Reminders
- [ ] Navigate to `/reminders`
- [ ] Verify "Renewal Reminders" section shows members expiring soon
- [ ] Check email sent to member's email address
- [ ] Verify email contains: member name, renewal date, action link

### Test 8.2: Inactive Member Alerts
- [ ] Verify alerts show members with no attendance > 30 days
- [ ] Click "Send Alert" to notify member
- [ ] Check member receives email about inactivity

### Test 8.3: Low Inventory Alerts
- [ ] Reduce inventory item quantity below reorder level
- [ ] Navigate to `/reminders`
- [ ] Verify low-stock alert appears
- [ ] Send alert to staff
- [ ] Verify staff receives notification

### Test 8.4: Promotion Reminders
- [ ] Create a promotion reminder from dashboard
- [ ] Verify it appears in reminders list
- [ ] Send to selected members
- [ ] Verify members receive promo email

---

## 9. Dashboard Overview

### Test 9.1: Dashboard Stats
- [ ] Navigate to `/`
- [ ] Verify stat cards show:
  - [ ] Total Members (count)
  - [ ] Active Plans (count)
  - [ ] Expiring Soon (count)
  - [ ] Total Revenue (₱ amount)
- [ ] Verify member growth shows "up" indicator when applicable

### Test 9.2: Quick Actions
- [ ] Verify quick action buttons accessible
- [ ] Navigate from dashboard to each section

---

## 10. Data Persistence & Database

### Test 10.1: Verify Data Survives Page Reload
- [ ] Add a member
- [ ] Refresh page
- [ ] Verify member still appears

### Test 10.2: Verify Database Constraints
- [ ] Attempt to add member without email
- [ ] Verify validation error appears
- [ ] Attempt to set renewal date in past
- [ ] Verify error or warning appears

### Test 10.3: Verify RLS Policies
- [ ] Verify non-admin users cannot access admin pages
- [ ] Verify data isolation (users only see their own data if applicable)

---

## 11. Performance & UX

### Test 11.1: Mobile Responsiveness
- [ ] Open all pages on mobile device
- [ ] Verify sidebar collapses on mobile
- [ ] Check tables convert to card view on mobile
- [ ] Verify buttons and forms are touch-friendly

### Test 11.2: Load Times
- [ ] Verify dashboard loads within 2 seconds
- [ ] Check inventory page loads smoothly with 50+ items
- [ ] Verify reports generate quickly with date filters

### Test 11.3: Error Handling
- [ ] Try operations without internet
- [ ] Verify user-friendly error messages appear
- [ ] Refresh page to recover

---

## 12. Integration Tests

### Test 12.1: Email Integration
- [ ] Create reminder notification
- [ ] Verify email sent within 1 minute
- [ ] Check email contains proper formatting
- [ ] Verify links in email work correctly

### Test 12.2: Supabase Integration
- [ ] Verify all CRUD operations work
- [ ] Check database mirrors UI data
- [ ] Verify real-time updates across sessions

---

## 13. Security Tests

### Test 13.1: Authentication
- [ ] Cannot access admin pages without login
- [ ] Session persists on page reload
- [ ] Logout clears session properly

### Test 13.2: Authorization
- [ ] Admin cannot access super_admin features
- [ ] Super_admin can access all features
- [ ] Verify permission checks on API endpoints

---

## Test Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ⬜ | |
| Member Management | ⬜ | |
| Attendance Tracking | ⬜ | |
| Sales & Payments | ⬜ | |
| Financial Reporting | ⬜ | |
| Renewal Tracking | ⬜ | |
| Inventory Management | ⬜ | |
| AI Reminders | ⬜ | |
| Dashboard | ⬜ | |
| Database | ⬜ | |
| Performance | ⬜ | |
| Security | ⬜ | |

**Legend:**
- ✅ Passed - Feature works as expected
- ⚠️ Partial - Some issues found
- ❌ Failed - Major issues
- ⬜ Not Tested

---

## Known Issues & Notes

(Add any issues discovered during testing)

---

## Sign-off

- **Tested By:** ________________
- **Date:** ________________
- **Overall Status:** ________________
