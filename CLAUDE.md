# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIDraft is a Japanese AI-powered automated email response system consisting of multiple Google Apps Script (GAS) projects. The system automatically generates AI responses to dental seminar inquiries and general email processing using OpenAI's GPT-4o-mini model and creates Gmail drafts.

## Architecture

The project consists of 4 independent GAS modules:
- `01_お問い合わせ/` - Dental seminar inquiry processing
- `02_その他セミナー/` - Other seminar inquiry processing  
- `03_WeekendEnt/` - WeekendEnt seminar inquiry processing
- `04_Gmail未読処理/` - Unread Gmail processing

Each module follows identical architecture:
```
src/
├── config/           # Configuration (common.js + project-specific)
├── main.js          # Entry points and trigger functions
├── processors/      # Business logic processors
└── services/        # External API integrations (AI, Gmail, Sheets)
```

## Development Commands

### Deployment
```bash
# Deploy to Google Apps Script (run from each project directory)
clasp push
clasp deploy
```

### Testing
```bash
# No traditional test runner - use GAS editor or manual execution
# Test functions available: runUnitTests(), runIntegrationTests()
# Single item testing: processLatestItemTest()
```

### Configuration Management
- Each project has `.clasp.json` for deployment settings
- `appsscript.json` configures V8 runtime and America/New_York timezone
- Shared settings in `src/config/common.js`
- Project-specific configs in `src/config/sheets.js` or `src/config/gmail.js`

## Key Technical Details

### AI Service Integration
- Uses OpenAI GPT-4o-mini with 500 max tokens, 0.7 temperature
- Japanese response templates with context-aware prompts
- Error handling for API failures with fallback responses

### Gmail Processing
- Creates drafts with appropriate labels ("AI Draft", "AI Error")
- Handles duplicate prevention via status tracking
- Custom Gmail API integration in `gmailService.js`

### Google Sheets Integration
- Column-based data extraction with configurable mappings
- Status tracking to prevent duplicate processing
- Batch processing with individual error isolation

### Trigger System
- Hourly automated triggers for production processing
- Manual trigger functions for testing single items
- Trigger management functions (setup/deletion) in each project

### Testing Framework
Custom lightweight testing built for GAS environment:
- Unit tests in `unitTests.js` (Gmail processor only)
- Integration tests in `integrationTests.js` (Gmail processor only)
- Assertion methods: `assertEqual`, `assertTrue`, `assertFalse`, `assertNotNull`, `assertArrayLength`
- Mock data support for isolated testing

## Common Development Patterns

### Error Handling
All services implement consistent error handling with:
- Try-catch blocks around external API calls
- Status tracking in data sources
- Detailed logging for debugging
- Graceful degradation for individual item failures

### Status Management
Standard status flow: `未処理` → `処理中` → `完了` or `エラー`

### Service Layer Pattern
Each service (AI, Gmail, Sheets) is isolated with:
- Clean interfaces for external dependencies
- Configuration injection
- Error boundary handling
- Logging integration

## Project-Specific Notes

### Gmail Processor (04_Gmail未読処理)
- Processes unread emails from specified Gmail labels
- Includes comprehensive test suite
- Uses Gmail-specific configuration in `config/gmail.js`

### Seminar Processors (01-03)
- Process Google Forms responses via Google Sheets
- Extract inquiry details for AI response generation
- Use Sheets-specific configuration in `config/sheets.js`

## Important Constraints

- Google Apps Script 6-minute execution time limit
- V8 runtime environment (ES6+ support)
- No npm/node_modules - pure GAS environment
- Timezone configured to America/New_York for consistent scheduling