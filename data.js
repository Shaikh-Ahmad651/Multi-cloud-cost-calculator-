// data.js - Comprehensive Cloud Service Catalog (April 2026)
const cloudCatalog = {
    compute: {
        "General Purpose": {
            AWS: { sku: "t3.large", vcpu: 2, ram: 8, hourly: 0.0832 },
            Azure: { sku: "D2s v3", vcpu: 2, ram: 8, hourly: 0.096 },
            GCP: { sku: "e2-standard-2", vcpu: 2, ram: 8, hourly: 0.067 }
        },
        "Compute Optimized": {
            AWS: { sku: "c6i.xlarge", vcpu: 4, ram: 8, hourly: 0.170 },
            Azure: { sku: "F4s v2", vcpu: 4, ram: 8, hourly: 0.169 },
            GCP: { sku: "c2-standard-4", vcpu: 4, ram: 8, hourly: 0.208 }
        },
        "Memory Optimized": {
            AWS: { sku: "r6i.large", vcpu: 2, ram: 16, hourly: 0.126 },
            Azure: { sku: "E2s v5", vcpu: 2, ram: 16, hourly: 0.137 },
            GCP: { sku: "n2-highmem-2", vcpu: 2, ram: 16, hourly: 0.131 }
        },
        "GPU Accelerated (AI/ML)": {
            AWS: { sku: "g4dn.xlarge (T4)", vcpu: 4, ram: 16, hourly: 0.526 },
            Azure: { sku: "NC4as T4 v3", vcpu: 4, ram: 28, hourly: 0.520 },
            GCP: { sku: "n1-std-4 + T4", vcpu: 4, ram: 15, hourly: 0.450 }
        }
    },
    storage: {
        "Standard HDD": {
            AWS: { name: "Throughput (st1)", perGB: 0.045 },
            Azure: { name: "Standard HDD", perGB: 0.040 },
            GCP: { name: "Standard PD", perGB: 0.040 }
        },
        "General Purpose SSD": {
            AWS: { name: "gp3 SSD", perGB: 0.080 },
            Azure: { name: "Premium SSD", perGB: 0.092 },
            GCP: { name: "Balanced PD", perGB: 0.100 }
        }
    },
    database: {
        "Small Instance": {
            AWS: { sku: "db.t3.medium", hourly: 0.068 },
            Azure: { sku: "B2s (SQL)", hourly: 0.075 },
            GCP: { sku: "db-f1-micro", hourly: 0.052 }
        },
        "Production Grade": {
            AWS: { sku: "db.m5.large", hourly: 0.175 },
            Azure: { sku: "D2s v4 (SQL)", hourly: 0.190 },
            GCP: { sku: "db-n1-std-2", hourly: 0.165 }
        }
    }
};

const regions = {
    "us-east": { name: "US East (N. Virginia)", multiplier: 1.0 },
    "india-mumbai": { name: "Asia Pacific (Mumbai)", multiplier: 1.14 },
    "eu-west": { name: "Europe (London)", multiplier: 1.09 }
};

const plans = {
    "ondemand": { name: "On-Demand", discount: 1.0 },
    "1year": { name: "1-Year Reserved", discount: 0.65 },
    "3year": { name: "3-Year Reserved", discount: 0.40 }
};