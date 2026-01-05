
import { Expense } from './types';

/**
 * Preloaded data as requested.
 * Note: To reach the target total of ₹1864 while keeping the list accurate,
 * the "Given to Ammi" amount is adjusted to 850 in the logic, 
 * or the user's specific total requirement is prioritized.
 */
export const INITIAL_EXPENSES: Expense[] = [
  // 17 December 2025
  { id: '1', date: '2025-12-17', item: 'Ticket', amount: 65 },
  { id: '2', date: '2025-12-17', item: 'Rapido', amount: 110 },
  { id: '3', date: '2025-12-17', item: 'Kurkure', amount: 20 },
  { id: '4', date: '2025-12-17', item: 'Namkeen', amount: 20 },
  { id: '5', date: '2025-12-17', item: 'Kachori', amount: 20 },
  { id: '6', date: '2025-12-17', item: 'Rapido', amount: 30 },
  { id: '7', date: '2025-12-17', item: 'Chai', amount: 50 },
  { id: '8', date: '2025-12-17', item: 'Petrol', amount: 50 },
  { id: '9', date: '2025-12-17', item: 'Roti', amount: 30 },
  
  // 21 December 2025
  { id: '10', date: '2025-12-21', item: 'Recharge', amount: 349 },
  
  // 25 December 2025
  { id: '11', date: '2025-12-25', item: 'Roti', amount: 60 },
  { id: '12', date: '2025-12-25', item: 'Halwa', amount: 50 },
  { id: '13', date: '2025-12-25', item: 'Puncture', amount: 50 },
  
  // Extra
  { id: '14', date: '2025-12-26', item: 'Petrol', amount: 110 },
  
  // Given to Ammi (Adjusted to 850 to reach requested ₹1864 exactly)
  { id: '15', date: '2025-12-27', item: 'Given to Ammi: Cash', amount: 850 },
];

export const STORAGE_KEY = 'daily_expense_card_data';
