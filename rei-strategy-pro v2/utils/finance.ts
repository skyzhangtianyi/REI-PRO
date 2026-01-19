
import { FinancialInputs, ROIResult } from '../types';

/**
 * JS implementation of PMT (Equal Monthly Installment)
 * Equivalent to Excel's =PMT(rate, nper, pv)
 */
export const calculatePMT = (rate: number, nper: number, pv: number): number => {
  if (rate === 0) return pv / nper;
  const pvif = Math.pow(1 + rate, nper);
  return (rate * pv * pvif) / (pvif - 1);
};

export const calculateROI = (inputs: FinancialInputs): ROIResult => {
  const { price, downPaymentPct, interestRate, monthlyRent, appreciationRate, marginalTaxRate } = inputs;

  const downPayment = price * (downPaymentPct / 100);
  const loanAmount = price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const nper = 360; // 30 years

  const monthlyPI = calculatePMT(monthlyRate, nper, loanAmount);
  
  // Expenses: Insurance (approx 0.3% of price) + Property Tax (approx 1% of price)
  const annualInsurance = price * 0.003;
  const annualTax = price * 0.01;
  const monthlyCost = monthlyPI + (annualTax / 12) + (annualInsurance / 12);

  const annualCashFlow = (monthlyRent - monthlyCost) * 12;
  
  // Principal Paydown approximation for Year 1 (approx 1.1% of purchase price)
  const annualPrincipal = price * 0.011;
  
  const annualAppreciation = price * (appreciationRate / 100);
  
  // Tax Benefit: Depreciation (Building value approx 80% of price, over 27.5 years)
  const annualTaxBenefit = ((price * 0.8) / 27.5) * (marginalTaxRate / 100);

  const totalROI = (annualCashFlow + annualPrincipal + annualAppreciation + annualTaxBenefit) / downPayment;

  return {
    downPayment,
    monthlyPI,
    monthlyCost,
    annualCashFlow,
    annualPrincipal,
    annualAppreciation,
    annualTaxBenefit,
    totalROI
  };
};

export const projectWealth = (inputs: FinancialInputs, years: number): number[] => {
  const data: number[] = [];
  const roi = calculateROI(inputs);
  const initialEquity = roi.downPayment;
  
  let currentEquity = initialEquity;
  
  for (let i = 1; i <= years; i++) {
    // Simplified growth: previous equity + (Return factors)
    // Note: In reality ROI changes slightly as principal paydown increases, 
    // but for the projection we use the annual return components.
    currentEquity += (roi.annualCashFlow + roi.annualPrincipal + roi.annualAppreciation + roi.annualTaxBenefit);
    data.push(Math.round(currentEquity));
  }
  
  return data;
};
