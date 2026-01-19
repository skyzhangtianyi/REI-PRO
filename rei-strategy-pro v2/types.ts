
export interface FinancialInputs {
  price: number;              // A
  downPaymentPct: number;     // B
  interestRate: number;       // C
  monthlyRent: number;        // D
  appreciationRate: number;   // E
  marginalTaxRate: number;    // F
}

export interface ROIResult {
  downPayment: number;
  monthlyPI: number;
  monthlyCost: number;
  annualCashFlow: number;
  annualPrincipal: number;
  annualAppreciation: number;
  annualTaxBenefit: number;
  totalROI: number;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  rent: number;
  totalROI: number;
  source?: 'redfin' | 'zillow' | 'manual';
  agentName?: string; // New field for agent attribution
  timestamp: number;
  // Optional field to store grounding citations for compliance
  sources?: any[]; 
}

export interface ZipMonitor {
  zip: string;
  state: string;
  count: number;
}
