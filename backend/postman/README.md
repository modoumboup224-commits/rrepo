# GreenCard Dashboard API - Postman Collection

## Overview
This collection contains all the secured endpoints for the GreenCard dashboard API, including authentication flows and protected routes.

## Files Included
1. **GreenCard-Dashboard-API-Collection.json** - Main Postman collection
2. **GreenCard-Environment.json** - Environment configuration for local testing

## Quick Start

### Import into Postman
1. Open Postman
2. Click "Import" → "Upload Files"
3. Select both JSON files
4. Set the environment to "GreenCard Local Environment"

### Using with Newman CLI

#### Install Newman
```bash
npm install -g newman
```

#### Run Tests
```bash
# Run all tests
newman run GreenCard-Dashboard-API-Collection.json -e GreenCard-Environment.json

# Run with HTML report
newman run GreenCard-Dashboard-API-Collection.json -e GreenCard-Environment.json -r html

# Run specific folder
newman run GreenCard-Dashboard-API-Collection.json -e GreenCard-Environment.json --folder "Dashboard - Secured Endpoints"

# Run with delay between requests
newman run GreenCard-Dashboard-API-Collection.json -e GreenCard-Environment.json --delay-request 1000
```

## Environment Variables
- `base_url`: Base API URL (default: http://localhost:3000)
- `jwt_token`: JWT token for authentication (auto-populated after login)
- `user_email`: Test user email
- `user_password`: Test user password

## Test Flow
1. **Authentication**: Register/Login to get JWT token
2. **Dashboard**: Use secured endpoints with JWT token
3. **Error Handling**: Test invalid tokens and missing authentication

## Available Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Dashboard (Secured)
- GET /api/dashboard/sales-recommendations
- GET /api/dashboard/user-segmentation
- GET /api/dashboard/recommendations

### Orders (Secured)
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders

### Products (Secured)
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

## Testing Scripts
The collection includes automated test scripts for:
- Token validation
- Response status codes
- Response time validation
- JSON schema validation

## Troubleshooting
1. **401 Unauthorized**: Check JWT token is valid and included in headers
2. **403 Forbidden**: Ensure user has proper permissions
3. **500 Server Error**: Check server logs and database connection
