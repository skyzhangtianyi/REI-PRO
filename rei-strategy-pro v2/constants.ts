
import { Property, ZipMonitor } from './types';

export const INITIAL_ZIP_MONITORS: ZipMonitor[] = [
  { zip: '85295', state: 'AZ', count: 12 },
  { zip: '85286', state: 'AZ', count: 8 },
  { zip: '85383', state: 'AZ', count: 15 },
  { zip: '85718', state: 'AZ', count: 5 },
  { zip: '27613', state: 'NC', count: 21 },
  { zip: '75070', state: 'TX', count: 19 },
  { zip: '29715', state: 'SC', count: 7 },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'rec-1',
    address: '990 High Point Rd',
    city: 'Scottsdale',
    zip: '85255',
    price: 890000,
    rent: 5500,
    totalROI: 0.214,
    agentName: 'Sarah Miller',
    timestamp: Date.now() - 1000000,
  },
  {
    id: '1',
    address: '123 Desert Rose Way',
    city: 'Gilbert',
    zip: '85295',
    price: 450000,
    rent: 2800,
    totalROI: 0.185,
    timestamp: Date.now(),
  },
  {
    id: '2',
    address: '456 Tech Corridor Blvd',
    city: 'Raleigh',
    zip: '27613',
    price: 520000,
    rent: 3100,
    totalROI: 0.172,
    timestamp: Date.now(),
  },
  {
    id: '3',
    address: '789 Lonestar Ridge',
    city: 'McKinney',
    zip: '75070',
    price: 580000,
    rent: 3500,
    totalROI: 0.168,
    timestamp: Date.now(),
  }
];

export const APP_THEME = {
  primary: '#3b82f6',
  secondary: '#10b981',
  danger: '#ef4444',
  bg: '#0f172a',
  card: '#1e293b',
};
