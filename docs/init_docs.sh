#!/bin/bash

# Create the docs directory if it doesn't exist
mkdir -p docs

# List of documentation files to create
files=(
  "architecture.md"
  "security.md"
  "backend.md"
  "frontend.md"
  "api.md"
  "websocket.md"
  "encryption.md"
  "deployment.md"
  "troubleshooting.md"
)

# Loop through and create each file with a professional header
for file in "${files[@]}"; do
  cat <<EOF > "docs/$file"
# ChatSphere - $(echo "${file%.*}" | tr '[:lower:]' '[:upper:]')
---
**Status:** Draft
**Last Updated:** $(date +'%Y-%m-%d')

## Overview
This document outlines the $(echo "${file%.*}") specifications for the ChatSphere ecosystem.

## Content
- [TBD]
EOF
  echo "Created: docs/$file"
done

echo "-----------------------------------------------"
echo "Documentation structure initialized successfully!"
