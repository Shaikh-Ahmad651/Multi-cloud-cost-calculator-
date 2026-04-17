// calculator.js - Pure Math Logic

function calculateCosts(cores, ram, storage) {
    const results = {};
    
    // Loop through the mock data in data.js
    for (const provider in cloudData) {
        const data = cloudData[provider];
        const computeCost = cores * data.computePerCore;
        const ramCost = ram * data.ramPerGB;

        // Apply the Free Tier logic
        let billableStorage = storage - data.freeTier.storageDiscountGB;
        if (billableStorage < 0) billableStorage = 0; // Can't have negative storage costs
        const storageCost = billableStorage * data.storagePerGB;

        const total = computeCost + ramCost + storageCost;
        
        results[provider] = {
            name: data.providerName,
            totalCost: total.toFixed(2),
            breakdown: `Compute: $${computeCost.toFixed(2)} | RAM: $${ramCost.toFixed(2)} | Storage: $${storageCost.toFixed(2)}`
        };
    }
    
    return results;
}