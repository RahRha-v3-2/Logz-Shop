#!/bin/bash
set -x
echo "Checking files..."
ls -la services/frontend/Containerfile
ls -la services/auction-engine/Containerfile
ls -la kube.yaml

echo "Building Frontend..."
podman build -t log-market-frontend -f services/frontend/Containerfile services/frontend > build_frontend.log 2>&1
echo "Frontend Build Exit Code: $?"

echo "Building Backend..."
podman build -t log-market-engine -f services/auction-engine/Containerfile services/auction-engine > build_backend.log 2>&1
echo "Backend Build Exit Code: $?"

echo "Listing Images..."
podman images > images.log 2>&1

echo "Deploying..."
podman play kube kube.yaml --replace > deploy.log 2>&1
echo "Deploy Exit Code: $?"

echo "Checking Pods..."
podman ps -a > ps.log 2>&1
