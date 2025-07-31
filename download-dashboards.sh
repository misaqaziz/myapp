#!/bin/bash
mkdir -p dashboards
cd dashboards

# Example links — replace with actual direct JSON links
wget https://grafana.com/api/dashboards/1860/revisions/23/download -O node-exporter-full.json
wget https://grafana.com/api/dashboards/11074/revisions/7/download -O k8s-cluster-monitoring.json
