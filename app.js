const GEMINI_API_KEY = "AIzaSyBVfO097yJainjZXVEiWQuSzCJtGNxH3XE"; 
let myChart = null;

// UI Elements
const mainCat = document.getElementById('mainCategory');
const subCat = document.getElementById('subCategory');
const qtySection = document.getElementById('qtySection');

// Populate Sub-Categories Dynamically
function updateSubOptions() {
    const category = mainCat.value;
    const options = Object.keys(cloudCatalog[category]);
    subCat.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    category === 'storage' ? qtySection.classList.remove('d-none') : qtySection.classList.add('d-none');
}

mainCat.addEventListener('change', updateSubOptions);
updateSubOptions();

// Analysis Engine
document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const cat = mainCat.value;
    const sub = subCat.value;
    const region = document.getElementById('regionSelect').value;
    const plan = document.getElementById('planSelect').value;
    
    const regMult = regions[region].multiplier;
    const planDisc = plans[plan].discount;
    const HOURS = 730;

    const results = ['AWS', 'Azure', 'GCP'].map(provider => {
        let monthly = 0;
        let label = "";
        let unitPrice = 0;

        if (cat === 'compute' || cat === 'database') {
            const data = cloudCatalog[cat][sub][provider];
            unitPrice = data.hourly;
            monthly = (unitPrice * HOURS) * regMult * planDisc;
            label = data.sku;
        } else {
            const data = cloudCatalog.storage[sub][provider];
            const gb = document.getElementById('storageQty').value;
            unitPrice = data.perGB;
            monthly = (unitPrice * gb) * regMult; 
            label = data.name;
        }

        return { provider, label, unitPrice, monthly: monthly.toFixed(2), savings: ((1-planDisc)*100).toFixed(0) };
    });

    renderUI(results);
    const useCase = document.getElementById('useCase').value || "Standard cloud deployment.";
    getAIRecommendation(cat, sub, results, useCase);
});

function renderUI(data) {
    // Update Table
    const body = document.getElementById('resultsBody');
    body.innerHTML = data.map(r => `
        <tr>
            <td class="fw-bold text-info">${r.provider}</td>
            <td><code>${r.label}</code></td>
            <td>$${r.unitPrice.toFixed(3)}</td>
            <td><span class="badge bg-success">-${r.savings}%</span></td>
            <td class="text-white fw-bold">$${r.monthly}</td>
        </tr>
    `).join('');

    // Update Chart
    const ctx = document.getElementById('costChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(r => r.provider),
            datasets: [{
                label: 'Monthly Cost (USD)',
                data: data.map(r => r.monthly),
                backgroundColor: ['#FF9900', '#0078D4', '#34A853'],
                borderRadius: 6
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

async function getAIRecommendation(cat, sub, results, useCase) {
    const aiBox = document.getElementById('aiAdvisor');
    aiBox.innerHTML = '<div class="text-center mt-4"><span class="spinner-border spinner-border-sm text-info mb-2"></span><br><span class="text-info small">Architect analyzing parameters...</span></div>';

    // 1. Upgraded Prompt: Forcing structure and bullet points
    // 1. Upgraded FinOps Prompt: Value vs. Cost
    const prompt = `Act as an elite Cloud FinOps Architect. The user is comparing ${cat} services for a "${sub}" workload. 
    Project goal/Use-case: "${useCase}".
    Monthly Estimates: AWS: $${results[0].monthly}, Azure: $${results[1].monthly}, GCP: $${results[2].monthly}.
    
    CRITICAL INSTRUCTION: Do NOT just automatically recommend the cheapest option. Evaluate the specific "Project goal" and recommend the best overall VALUE. Consider factors like ecosystem integration, enterprise reliability, and specialized hardware. If a more expensive provider is the better technical fit, recommend it and justify the premium.
    
    Format exactly like this:
    **Primary Recommendation:** [State the winner and mention if you chose them for raw savings or premium performance]
    
    **Strategic Advantages:**
    * [Bullet point 1 on technical alignment with their goal]
    * [Bullet point 2 on ecosystem or operational benefits]
    
    **Cost-to-Value Ratio:** [1 short sentence explaining why this choice is the smartest financial move, even if it is not the cheapest]`;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await response.json();
        let rawText = data.candidates[0].content.parts[0].text;

        // 2. The Magic Parser: Converts Markdown to clean HTML
        let formattedHTML = rawText
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') // Makes bold text white & bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')                                 // Italics
            .replace(/\n\* /g, '<br><span class="text-info">•</span> ')           // Styles bullet points
            .replace(/\n\n/g, '<br><br>')                                         // Double line breaks
            .replace(/\n/g, '<br>');                                              // Single line breaks
            
        aiBox.innerHTML = `<div class="small" style="line-height: 1.6;">${formattedHTML}</div>`;
        
    } catch (e) {
        aiBox.innerHTML = `<span class="text-danger">AI analysis currently unavailable. Please check your API key and network connection.</span>`;
    }
}