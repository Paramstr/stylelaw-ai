#!/bin/bash

# Create directories
mkdir -p public/pdfjs
cd public/pdfjs

# Download latest stable PDF.js release
curl -L https://github.com/mozilla/pdf.js/releases/download/v4.0.379/pdfjs-4.0.379-dist.zip -o pdfjs.zip

# Unzip the contents
unzip pdfjs.zip -d .

# Clean up
rm pdfjs.zip

# Move files to correct location
mv web/* .
mv build/* .
rm -rf web build

# Update viewer.html to use absolute paths
sed -i '' 's/viewer.css/\/pdfjs\/viewer.css/g' viewer.html
sed -i '' 's/viewer.js/\/pdfjs\/viewer.js/g' viewer.html
sed -i '' 's/pdf.worker.js/\/pdfjs\/pdf.worker.js/g' viewer.html

echo "PDF.js setup complete!" 