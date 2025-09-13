#!/bin/bash

# Check Cloudflare Pages deployment status
# Usage: ./check-deployment.sh

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Checking Cloudflare Pages deployment status..."
echo ""

# Use the working token if not already set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    export CLOUDFLARE_API_TOKEN='uv2pxfyb39WtPLi-klCOZCA-oUWnmc_ImVAA-4-g'
    echo "ℹ️  Using stored API token"
fi

# Get latest deployment
echo "📋 Latest deployments for dumpster-rental-site:"
echo "----------------------------------------"
npx wrangler pages deployment list --project-name=dumpster-rental-site | head -20

echo ""
echo "📊 Deployment details:"
echo "----------------------------------------"
# Get the latest deployment ID and show its details
LATEST_DEPLOYMENT=$(npx wrangler pages deployment list --project-name=dumpster-rental-site --json 2>/dev/null | jq -r '.[0].id' 2>/dev/null)

if [ ! -z "$LATEST_DEPLOYMENT" ] && [ "$LATEST_DEPLOYMENT" != "null" ]; then
    echo "Latest deployment ID: $LATEST_DEPLOYMENT"
    echo ""
    # Try to get more details about the deployment
    npx wrangler pages deployment list --project-name=dumpster-rental-site --json 2>/dev/null | jq '.[0]' 2>/dev/null
else
    echo "Could not parse deployment details. Showing raw output above."
fi

echo ""
echo "🌐 Your site URLs:"
echo "----------------------------------------"
echo "Production: https://dumpster-rental-site.pages.dev"
echo "Latest preview: https://${LATEST_DEPLOYMENT}.dumpster-rental-site.pages.dev (if deployment ID was found)"
echo ""
echo "💡 Tip: You can also check the Cloudflare dashboard at:"
echo "   https://dash.cloudflare.com/?to=/:account/pages/view/dumpster-rental-site"