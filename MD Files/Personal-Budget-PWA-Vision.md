# Personal Budget PWA - Zero-Based Budgeting Vision

## Overview
Transform the Personal Budget PWA into a comprehensive **zero-based budgeting** application following the EveryDollar model, where every dollar of income is assigned a job through a unified "Available to Budget" pool that funds spending envelopes until reaching zero balance.

## Core Features

### 1. Monthly Budget Cycles
- **Separate Months**: Each month operates as an independent budget cycle
- **Month Switching**: Easy navigation between past and future months
- **Month Templates**: Ability to copy budget structure from previous months
- **Budget Status**: Clear indication of whether budget is balanced (all income allocated)

### 2. Income Management
- **Multiple Income Sources**: Track separate income streams (salary, freelance, investments, etc.)
- **Unified Income Pool**: All income sources combine into total "Available to Budget"
- **Income History**: Track income sources over time for planning and forecasting
- **Income Categorization**: Group income by type for better organization

### 3. Zero-Based Allocation
- **Available to Budget**: Prominent display of unallocated income pool (like EveryDollar)
- **Envelope Funding**: Assign money from Available to Budget to spending envelopes
- **Zero Balance Goal**: Visual progress toward allocating every dollar
- **Reallocation Freedom**: Move money between envelopes as needs change

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

### Phase 1: Core Infrastructure ✅ COMPLETED
1. **Database Schema Updates** ✅
   - Add month-based budget structure with availableToBudget field
   - Income sources tracking with multiple streams
   - Transaction split relationships (schema ready)
   - Envelope allocation data with monthly budgeted amounts

2. **Month Management System** ✅
   - MonthSelector component for navigation between months
   - Month creation/copying functionality in MonthlyBudgetService
   - Month-based data isolation in monthlyBudgetStore

### Phase 2: Income & Allocation 🚧 IN PROGRESS
1. **Income Sources Management**
   - Income source entry forms (add/edit/delete)
   - Income categorization UI
   - Real-time total income calculation
   - Income history and trends

2. **Available to Budget System** ✅ (Core logic complete)
   - AvailableToBudget component with progress visualization
   - Real-time calculation engine
   - Zero balance goal tracking
   - Status indicators (balanced/over/under allocated)

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
- `monthly_budgets`: Core budget data per month with availableToBudget field
- `income_sources`: User income entries per month (reference only)
- `transaction_splits`: Split transaction relationships
- `envelope_allocations`: Monthly budgeted amounts per envelope

### Updated Collections:
- `transactions`: Add month reference and split relationships
- `envelopes`: Add category grouping and spending tracking
- `users`: Add budget preferences

## User Experience Flow

1. **New User Onboarding**
   - Set up first month's budget
   - Add income sources (creates total pool)
   - Create spending envelopes
   - Fund envelopes from "Available to Budget"

2. **Monthly Workflow**
   - Review previous month performance
   - Create/copy budget for new month
   - Add income sources (updates Available to Budget)
   - Fund envelopes until Available to Budget = $0
   - Track spending throughout month
   - Reallocate between envelopes as needed

3. **Daily Usage**
   - Record transactions (with split capability)
   - Monitor envelope balances vs budgeted amounts
   - Track progress toward zero Available to Budget
   - Adjust envelope allocations as needed

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
1. **✅ COMPLETED**: Month management, income tracking, basic allocation (Phase 1)
2. **🚧 CURRENT FOCUS**: Income source forms, envelope allocation UI (Phase 2)
3. **Medium Priority**: Split transactions, enhanced analytics
4. **Low Priority**: Advanced features, integrations

## Current Status: Phase 2 Development
- **Demo Page**: `/monthly-budget-demo` showcases all Phase 1 components
- **Available to Budget**: Core logic and UI component complete
- **Month Navigation**: Fully functional with data isolation
- **Next Steps**: Income source forms and envelope allocation interface

---
*Document created: December 27, 2025*
*Last updated: December 28, 2025*
