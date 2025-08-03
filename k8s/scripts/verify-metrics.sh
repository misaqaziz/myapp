#!/bin/bash
set -e

echo "Verifying metrics pusher deployment..."
kubectl rollout status deployment/metrics-pusher --timeout=60s

echo "Checking logs for remote write success..."
kubectl logs -l app=metrics-pusher --tail=50 | grep -i "remote write" || {
  echo "No remote write logs found!"
  exit 1
}

echo "Metrics pusher is successfully deployed and sending data to Grafana Cloud."
