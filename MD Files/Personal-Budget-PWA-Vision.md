# Personal Budget PWA - Zero-Based Budgeting Vision

## Overview
Transform the Personal Budget PWA into a comprehensive **zero-based budgeting** application where every dollar of income must be allocated to specific envelopes until the budget is balanced.

## Core Features

### 1. Monthly Budget Cycles
- **Separate Months**: Each month operates as an independent budget cycle
- **Month Switching**: Easy navigation between past and future months
- **Month Templates**: Ability to copy budget structure from previous months
- **Budget Status**: Clear indication of whether budget is balanced (all income allocated)

### 2. Income Management
- **Monthly Income Entry**: Dedicated section for adding all sources of income
- **Income Tracking**: Total income for the month clearly displayed
- **Income Categories**: Classify income sources (salary, freelance, investments, etc.)
- **Income History**: Track income over time for better planning

### 3. Zero-Based Allocation
- **Budget Balancing**: Visual indicator showing progress toward zero balance
- **Unallocated Funds**: Clear display of remaining income that needs to be allocated
- **Allocation Tracking**: See how much of each income source is allocated
- **Over-Allocation Prevention**: Prevent allocating more than available income

### 4. Split Transactions
- **Transaction Splitting**: Ability to split single transactions across multiple envelopes
- **Split Categories**: Assign different portions to different budget categories
- **Split Tracking**: Maintain relationships between split portions
- **Split Editing**: Modify splits after creation

### 5. Enhanced Envelope System
- **Envelope Allocation**: Allocate specific amounts from income to envelopes
- **Envelope Limits**: Set spending limits for each envelope
- **Envelope Categories**: Organize envelopes by type (Essentials, Wants, Savings, Debt)
- **Envelope Transfers**: Move money between envelopes within the same month

### 6. Budget Analytics
- **Monthly Comparison**: Compare spending vs budget by month
- **Category Analysis**: See spending patterns across categories
- **Budget Performance**: Track how well you stick to your budget
- **Trend Analysis**: Identify spending trends over time

## Technical Implementation Plan

### Phase 1: Core Infrastructure
1. **Database Schema Updates**
   - Add month-based data structure
   - Income tracking tables
   - Transaction split relationships
   - Budget allocation tracking

2. **Month Management System**
   - Month selection component
   - Month creation/copying
   - Month data isolation

### Phase 2: Income & Allocation
1. **Income Entry Interface**
   - Income source management
   - Monthly income input
   - Income categorization

2. **Zero-Based Allocation Engine**
   - Allocation tracking
   - Balance calculation
   - Visual progress indicators

### Phase 3: Split Transactions
1. **Split Transaction UI**
   - Split creation interface
   - Split editing capabilities
   - Split visualization

2. **Split Data Management**
   - Split relationship handling
   - Split amount validation
   - Split category assignment

### Phase 4: Enhanced Analytics
1. **Budget Dashboard**
   - Monthly overview
   - Budget vs actual comparisons
   - Progress tracking

2. **Reporting Features**
   - Category breakdowns
   - Trend analysis
   - Budget performance metrics

## Data Model Changes

### New Collections/Tables:
- `monthly_budgets`: Core budget data per month
- `income_sources`: User income entries per month
- `budget_allocations`: How income is allocated to envelopes
- `transaction_splits`: Split transaction relationships
- `envelope_limits`: Spending limits per envelope per month

### Updated Collections:
- `transactions`: Add month reference and split relationships
- `envelopes`: Add monthly allocation data
- `users`: Add budget preferences

## User Experience Flow

1. **New User Onboarding**
   - Set up first month's budget
   - Add income sources
   - Create initial envelopes
   - Allocate income to envelopes

2. **Monthly Workflow**
   - Review previous month performance
   - Create/copy budget for new month
   - Add monthly income
   - Allocate income to envelopes
   - Track spending throughout month
   - Review and adjust as needed

3. **Daily Usage**
   - Record transactions (with split capability)
   - Monitor envelope balances
   - Track budget progress
   - Adjust allocations as needed

## Success Metrics
- **Budget Completion Rate**: % of months where budget reaches zero balance
- **Transaction Split Usage**: How often users split transactions
- **Monthly Active Users**: Consistent monthly usage
- **User Retention**: Continued app usage over time

## Future Enhancements
- **Automated Rules**: Set up recurring allocations
- **Goal Tracking**: Savings goals with progress tracking
- **Collaborative Budgeting**: Share budgets with partners
- **AI Insights**: Spending pattern analysis and suggestions
- **Integration**: Bank account syncing for automatic transaction import

## Implementation Priority
1. **High Priority**: Month management, income tracking, basic allocation
2. **Medium Priority**: Split transactions, enhanced analytics
3. **Low Priority**: Advanced features, integrations

---
*Document created: December 27, 2025*
*Last updated: December 27, 2025*
