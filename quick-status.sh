#!/bin/bash

# Quick deployment status check without API permissions
echo "🚀 Checking site deployment status..."
echo ""

# Test main site
echo "📍 Testing main site..."
if curl -s -I https://dumpster-rental-site.pages.dev | head -1 | grep -q "200"; then
    echo "✅ Main site: https://dumpster-rental-site.pages.dev (LIVE)"
else
    echo "❌ Main site: DOWN or ERROR"
fi

# Test a few sample city pages
echo ""
echo "📍 Testing sample city pages..."

cities=("texas/dumpster-rental-houston" "california/dumpster-rental-los-angeles" "florida/dumpster-rental-miami" "new-york/dumpster-rental-new-york-city")

for city in "${cities[@]}"; do
    if curl -s -I "https://dumpster-rental-site.pages.dev/$city/" | head -1 | grep -q "200"; then
        echo "✅ /$city/ (LIVE)"
    else
        echo "❌ /$city/ (ERROR)"
    fi
done

# Test a state page
echo ""
echo "📍 Testing state pages..."
if curl -s -I https://dumpster-rental-site.pages.dev/texas/ | head -1 | grep -q "200"; then
    echo "✅ /texas/ (LIVE)"
else
    echo "❌ /texas/ (ERROR)"  
fi

echo ""
echo "🎉 Site status check complete!"
echo ""
echo "💡 Your live site: https://dumpster-rental-site.pages.dev"
echo "💡 For full API access, create a new token with these permissions:"
echo "   - Account: Cloudflare Pages:Read"
echo "   - Account: Account Settings:Read" 
echo "   - User: User Details:Read"