#!/bin/bash

# Script to download OpenAPI specification from running server
# Usage: npm run generate:openapi

API_URL="${API_URL:-http://localhost:3000}"
OUTPUT_FILE="openapi.json"

echo "📥 Downloading OpenAPI spec from $API_URL/docs-json..."

# Download the OpenAPI spec
if curl -f -s "$API_URL/docs-json" -o "$OUTPUT_FILE"; then
    echo "✅ OpenAPI spec saved to: $OUTPUT_FILE"
    
    # Count endpoints
    ENDPOINT_COUNT=$(jq '.paths | keys | length' "$OUTPUT_FILE" 2>/dev/null || echo "N/A")
    echo "📊 Total endpoints: $ENDPOINT_COUNT"
    
    echo ""
    echo "🔗 Swagger UI available at: $API_URL/docs"
else
    echo "❌ Failed to download OpenAPI spec"
    echo "   Make sure the SSO API is running at $API_URL"
    exit 1
fi

