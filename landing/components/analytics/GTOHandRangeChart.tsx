'use client';

import { useState } from 'react';
import { Target, Info, TrendingUp, AlertCircle } from 'lucide-react';

// Hand rankings (row = first card, col = second card)
// Suited hands are above diagonal, offsuit below, pairs on diagonal
const HANDS = [
  ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
  ['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
  ['AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s'],
  ['AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s'],
  ['ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'],
  ['A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s'],
  ['A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s'],
  ['A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s'],
  ['A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s'],
  ['A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s'],
  ['A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s'],
  ['A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s'],
  ['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22'],
];

// Mixed strategy data: { raise%, call%, fold% }
interface MixedStrategy {
  r: number; // raise %
  c: number; // call/limp %
  f: number; // fold %
}

// GTO ranges with mixed strategies (more realistic)
const GTO_MIXED: { [position: string]: { [hand: string]: MixedStrategy } } = {
  UTG: {
    'AA': { r: 100, c: 0, f: 0 }, 'KK': { r: 100, c: 0, f: 0 }, 'QQ': { r: 100, c: 0, f: 0 }, 'JJ': { r: 100, c: 0, f: 0 },
    'TT': { r: 100, c: 0, f: 0 }, '99': { r: 85, c: 15, f: 0 }, '88': { r: 55, c: 45, f: 0 }, '77': { r: 30, c: 50, f: 20 },
    '66': { r: 15, c: 35, f: 50 }, '55': { r: 10, c: 30, f: 60 }, '44': { r: 5, c: 25, f: 70 }, '33': { r: 0, c: 20, f: 80 }, '22': { r: 0, c: 15, f: 85 },
    'AKs': { r: 100, c: 0, f: 0 }, 'AQs': { r: 100, c: 0, f: 0 }, 'AJs': { r: 100, c: 0, f: 0 }, 'ATs': { r: 95, c: 5, f: 0 },
    'A9s': { r: 45, c: 40, f: 15 }, 'A8s': { r: 35, c: 40, f: 25 }, 'A7s': { r: 25, c: 40, f: 35 }, 'A6s': { r: 20, c: 35, f: 45 },
    'A5s': { r: 40, c: 35, f: 25 }, 'A4s': { r: 30, c: 35, f: 35 }, 'A3s': { r: 15, c: 30, f: 55 }, 'A2s': { r: 10, c: 25, f: 65 },
    'AKo': { r: 100, c: 0, f: 0 }, 'AQo': { r: 100, c: 0, f: 0 }, 'AJo': { r: 90, c: 10, f: 0 }, 'ATo': { r: 55, c: 30, f: 15 },
    'A9o': { r: 15, c: 25, f: 60 }, 'A8o': { r: 0, c: 15, f: 85 }, 'A7o': { r: 0, c: 10, f: 90 }, 'A6o': { r: 0, c: 5, f: 95 },
    'A5o': { r: 0, c: 10, f: 90 }, 'A4o': { r: 0, c: 5, f: 95 }, 'A3o': { r: 0, c: 0, f: 100 }, 'A2o': { r: 0, c: 0, f: 100 },
    'KQs': { r: 100, c: 0, f: 0 }, 'KJs': { r: 95, c: 5, f: 0 }, 'KTs': { r: 85, c: 15, f: 0 }, 'K9s': { r: 35, c: 40, f: 25 },
    'K8s': { r: 10, c: 25, f: 65 }, 'K7s': { r: 5, c: 20, f: 75 }, 'K6s': { r: 0, c: 15, f: 85 }, 'K5s': { r: 0, c: 15, f: 85 },
    'K4s': { r: 0, c: 10, f: 90 }, 'K3s': { r: 0, c: 5, f: 95 }, 'K2s': { r: 0, c: 5, f: 95 },
    'KQo': { r: 95, c: 5, f: 0 }, 'KJo': { r: 50, c: 35, f: 15 }, 'KTo': { r: 20, c: 30, f: 50 }, 'K9o': { r: 0, c: 15, f: 85 },
    'K8o': { r: 0, c: 5, f: 95 }, 'K7o': { r: 0, c: 0, f: 100 }, 'K6o': { r: 0, c: 0, f: 100 }, 'K5o': { r: 0, c: 0, f: 100 },
    'K4o': { r: 0, c: 0, f: 100 }, 'K3o': { r: 0, c: 0, f: 100 }, 'K2o': { r: 0, c: 0, f: 100 },
    'QJs': { r: 95, c: 5, f: 0 }, 'QTs': { r: 80, c: 20, f: 0 }, 'Q9s': { r: 30, c: 40, f: 30 }, 'Q8s': { r: 10, c: 25, f: 65 },
    'Q7s': { r: 0, c: 15, f: 85 }, 'Q6s': { r: 0, c: 10, f: 90 }, 'Q5s': { r: 0, c: 10, f: 90 }, 'Q4s': { r: 0, c: 5, f: 95 },
    'Q3s': { r: 0, c: 5, f: 95 }, 'Q2s': { r: 0, c: 0, f: 100 },
    'QJo': { r: 45, c: 35, f: 20 }, 'QTo': { r: 15, c: 30, f: 55 }, 'Q9o': { r: 0, c: 15, f: 85 }, 'Q8o': { r: 0, c: 5, f: 95 },
    'Q7o': { r: 0, c: 0, f: 100 }, 'Q6o': { r: 0, c: 0, f: 100 }, 'Q5o': { r: 0, c: 0, f: 100 }, 'Q4o': { r: 0, c: 0, f: 100 },
    'Q3o': { r: 0, c: 0, f: 100 }, 'Q2o': { r: 0, c: 0, f: 100 },
    'JTs': { r: 90, c: 10, f: 0 }, 'J9s': { r: 40, c: 40, f: 20 }, 'J8s': { r: 15, c: 30, f: 55 }, 'J7s': { r: 0, c: 15, f: 85 },
    'J6s': { r: 0, c: 10, f: 90 }, 'J5s': { r: 0, c: 5, f: 95 }, 'J4s': { r: 0, c: 5, f: 95 }, 'J3s': { r: 0, c: 0, f: 100 }, 'J2s': { r: 0, c: 0, f: 100 },
    'JTo': { r: 35, c: 40, f: 25 }, 'J9o': { r: 5, c: 20, f: 75 }, 'J8o': { r: 0, c: 10, f: 90 }, 'J7o': { r: 0, c: 0, f: 100 },
    'J6o': { r: 0, c: 0, f: 100 }, 'J5o': { r: 0, c: 0, f: 100 }, 'J4o': { r: 0, c: 0, f: 100 }, 'J3o': { r: 0, c: 0, f: 100 }, 'J2o': { r: 0, c: 0, f: 100 },
    'T9s': { r: 50, c: 35, f: 15 }, 'T8s': { r: 20, c: 35, f: 45 }, 'T7s': { r: 5, c: 20, f: 75 }, 'T6s': { r: 0, c: 10, f: 90 },
    'T5s': { r: 0, c: 5, f: 95 }, 'T4s': { r: 0, c: 0, f: 100 }, 'T3s': { r: 0, c: 0, f: 100 }, 'T2s': { r: 0, c: 0, f: 100 },
    'T9o': { r: 10, c: 25, f: 65 }, 'T8o': { r: 0, c: 10, f: 90 }, 'T7o': { r: 0, c: 0, f: 100 }, 'T6o': { r: 0, c: 0, f: 100 },
    'T5o': { r: 0, c: 0, f: 100 }, 'T4o': { r: 0, c: 0, f: 100 }, 'T3o': { r: 0, c: 0, f: 100 }, 'T2o': { r: 0, c: 0, f: 100 },
    '98s': { r: 35, c: 40, f: 25 }, '97s': { r: 10, c: 30, f: 60 }, '96s': { r: 0, c: 15, f: 85 }, '95s': { r: 0, c: 5, f: 95 },
    '94s': { r: 0, c: 0, f: 100 }, '93s': { r: 0, c: 0, f: 100 }, '92s': { r: 0, c: 0, f: 100 },
    '98o': { r: 0, c: 10, f: 90 }, '97o': { r: 0, c: 0, f: 100 }, '96o': { r: 0, c: 0, f: 100 }, '95o': { r: 0, c: 0, f: 100 },
    '94o': { r: 0, c: 0, f: 100 }, '93o': { r: 0, c: 0, f: 100 }, '92o': { r: 0, c: 0, f: 100 },
    '87s': { r: 25, c: 40, f: 35 }, '86s': { r: 5, c: 25, f: 70 }, '85s': { r: 0, c: 10, f: 90 }, '84s': { r: 0, c: 0, f: 100 },
    '83s': { r: 0, c: 0, f: 100 }, '82s': { r: 0, c: 0, f: 100 },
    '87o': { r: 0, c: 5, f: 95 }, '86o': { r: 0, c: 0, f: 100 }, '85o': { r: 0, c: 0, f: 100 }, '84o': { r: 0, c: 0, f: 100 },
    '83o': { r: 0, c: 0, f: 100 }, '82o': { r: 0, c: 0, f: 100 },
    '76s': { r: 20, c: 40, f: 40 }, '75s': { r: 5, c: 25, f: 70 }, '74s': { r: 0, c: 10, f: 90 }, '73s': { r: 0, c: 0, f: 100 }, '72s': { r: 0, c: 0, f: 100 },
    '76o': { r: 0, c: 5, f: 95 }, '75o': { r: 0, c: 0, f: 100 }, '74o': { r: 0, c: 0, f: 100 }, '73o': { r: 0, c: 0, f: 100 }, '72o': { r: 0, c: 0, f: 100 },
    '65s': { r: 15, c: 35, f: 50 }, '64s': { r: 0, c: 15, f: 85 }, '63s': { r: 0, c: 5, f: 95 }, '62s': { r: 0, c: 0, f: 100 },
    '65o': { r: 0, c: 0, f: 100 }, '64o': { r: 0, c: 0, f: 100 }, '63o': { r: 0, c: 0, f: 100 }, '62o': { r: 0, c: 0, f: 100 },
    '54s': { r: 10, c: 30, f: 60 }, '53s': { r: 0, c: 15, f: 85 }, '52s': { r: 0, c: 5, f: 95 },
    '54o': { r: 0, c: 0, f: 100 }, '53o': { r: 0, c: 0, f: 100 }, '52o': { r: 0, c: 0, f: 100 },
    '43s': { r: 0, c: 15, f: 85 }, '42s': { r: 0, c: 5, f: 95 }, '43o': { r: 0, c: 0, f: 100 }, '42o': { r: 0, c: 0, f: 100 },
    '32s': { r: 0, c: 5, f: 95 }, '32o': { r: 0, c: 0, f: 100 },
  },
  BTN: {
    'AA': { r: 100, c: 0, f: 0 }, 'KK': { r: 100, c: 0, f: 0 }, 'QQ': { r: 100, c: 0, f: 0 }, 'JJ': { r: 100, c: 0, f: 0 },
    'TT': { r: 100, c: 0, f: 0 }, '99': { r: 100, c: 0, f: 0 }, '88': { r: 100, c: 0, f: 0 }, '77': { r: 95, c: 5, f: 0 },
    '66': { r: 90, c: 10, f: 0 }, '55': { r: 85, c: 15, f: 0 }, '44': { r: 80, c: 20, f: 0 }, '33': { r: 75, c: 25, f: 0 }, '22': { r: 70, c: 30, f: 0 },
    'AKs': { r: 100, c: 0, f: 0 }, 'AQs': { r: 100, c: 0, f: 0 }, 'AJs': { r: 100, c: 0, f: 0 }, 'ATs': { r: 100, c: 0, f: 0 },
    'A9s': { r: 100, c: 0, f: 0 }, 'A8s': { r: 100, c: 0, f: 0 }, 'A7s': { r: 100, c: 0, f: 0 }, 'A6s': { r: 100, c: 0, f: 0 },
    'A5s': { r: 100, c: 0, f: 0 }, 'A4s': { r: 100, c: 0, f: 0 }, 'A3s': { r: 100, c: 0, f: 0 }, 'A2s': { r: 100, c: 0, f: 0 },
    'AKo': { r: 100, c: 0, f: 0 }, 'AQo': { r: 100, c: 0, f: 0 }, 'AJo': { r: 100, c: 0, f: 0 }, 'ATo': { r: 100, c: 0, f: 0 },
    'A9o': { r: 100, c: 0, f: 0 }, 'A8o': { r: 100, c: 0, f: 0 }, 'A7o': { r: 100, c: 0, f: 0 }, 'A6o': { r: 95, c: 5, f: 0 },
    'A5o': { r: 100, c: 0, f: 0 }, 'A4o': { r: 95, c: 5, f: 0 }, 'A3o': { r: 90, c: 10, f: 0 }, 'A2o': { r: 85, c: 15, f: 0 },
    'KQs': { r: 100, c: 0, f: 0 }, 'KJs': { r: 100, c: 0, f: 0 }, 'KTs': { r: 100, c: 0, f: 0 }, 'K9s': { r: 100, c: 0, f: 0 },
    'K8s': { r: 100, c: 0, f: 0 }, 'K7s': { r: 100, c: 0, f: 0 }, 'K6s': { r: 100, c: 0, f: 0 }, 'K5s': { r: 100, c: 0, f: 0 },
    'K4s': { r: 100, c: 0, f: 0 }, 'K3s': { r: 100, c: 0, f: 0 }, 'K2s': { r: 100, c: 0, f: 0 },
    'KQo': { r: 100, c: 0, f: 0 }, 'KJo': { r: 100, c: 0, f: 0 }, 'KTo': { r: 100, c: 0, f: 0 }, 'K9o': { r: 100, c: 0, f: 0 },
    'K8o': { r: 95, c: 5, f: 0 }, 'K7o': { r: 85, c: 15, f: 0 }, 'K6o': { r: 70, c: 25, f: 5 }, 'K5o': { r: 60, c: 30, f: 10 },
    'K4o': { r: 50, c: 35, f: 15 }, 'K3o': { r: 45, c: 35, f: 20 }, 'K2o': { r: 40, c: 35, f: 25 },
    'QJs': { r: 100, c: 0, f: 0 }, 'QTs': { r: 100, c: 0, f: 0 }, 'Q9s': { r: 100, c: 0, f: 0 }, 'Q8s': { r: 100, c: 0, f: 0 },
    'Q7s': { r: 95, c: 5, f: 0 }, 'Q6s': { r: 90, c: 10, f: 0 }, 'Q5s': { r: 85, c: 15, f: 0 }, 'Q4s': { r: 80, c: 20, f: 0 },
    'Q3s': { r: 75, c: 20, f: 5 }, 'Q2s': { r: 70, c: 20, f: 10 },
    'QJo': { r: 100, c: 0, f: 0 }, 'QTo': { r: 100, c: 0, f: 0 }, 'Q9o': { r: 100, c: 0, f: 0 }, 'Q8o': { r: 90, c: 10, f: 0 },
    'Q7o': { r: 60, c: 30, f: 10 }, 'Q6o': { r: 50, c: 30, f: 20 }, 'Q5o': { r: 45, c: 30, f: 25 }, 'Q4o': { r: 40, c: 30, f: 30 },
    'Q3o': { r: 20, c: 30, f: 50 }, 'Q2o': { r: 15, c: 25, f: 60 },
    'JTs': { r: 100, c: 0, f: 0 }, 'J9s': { r: 100, c: 0, f: 0 }, 'J8s': { r: 100, c: 0, f: 0 }, 'J7s': { r: 95, c: 5, f: 0 },
    'J6s': { r: 85, c: 15, f: 0 }, 'J5s': { r: 80, c: 15, f: 5 }, 'J4s': { r: 75, c: 15, f: 10 }, 'J3s': { r: 60, c: 25, f: 15 }, 'J2s': { r: 55, c: 25, f: 20 },
    'JTo': { r: 100, c: 0, f: 0 }, 'J9o': { r: 100, c: 0, f: 0 }, 'J8o': { r: 85, c: 15, f: 0 }, 'J7o': { r: 55, c: 30, f: 15 },
    'J6o': { r: 40, c: 30, f: 30 }, 'J5o': { r: 25, c: 30, f: 45 }, 'J4o': { r: 15, c: 25, f: 60 }, 'J3o': { r: 10, c: 20, f: 70 }, 'J2o': { r: 5, c: 15, f: 80 },
    'T9s': { r: 100, c: 0, f: 0 }, 'T8s': { r: 100, c: 0, f: 0 }, 'T7s': { r: 95, c: 5, f: 0 }, 'T6s': { r: 85, c: 15, f: 0 },
    'T5s': { r: 75, c: 20, f: 5 }, 'T4s': { r: 60, c: 25, f: 15 }, 'T3s': { r: 50, c: 25, f: 25 }, 'T2s': { r: 45, c: 25, f: 30 },
    'T9o': { r: 100, c: 0, f: 0 }, 'T8o': { r: 90, c: 10, f: 0 }, 'T7o': { r: 75, c: 20, f: 5 }, 'T6o': { r: 50, c: 30, f: 20 },
    'T5o': { r: 35, c: 30, f: 35 }, 'T4o': { r: 20, c: 25, f: 55 }, 'T3o': { r: 10, c: 20, f: 70 }, 'T2o': { r: 5, c: 15, f: 80 },
    '98s': { r: 100, c: 0, f: 0 }, '97s': { r: 100, c: 0, f: 0 }, '96s': { r: 90, c: 10, f: 0 }, '95s': { r: 80, c: 15, f: 5 },
    '94s': { r: 55, c: 25, f: 20 }, '93s': { r: 45, c: 25, f: 30 }, '92s': { r: 30, c: 25, f: 45 },
    '98o': { r: 100, c: 0, f: 0 }, '97o': { r: 85, c: 15, f: 0 }, '96o': { r: 55, c: 30, f: 15 }, '95o': { r: 40, c: 30, f: 30 },
    '94o': { r: 20, c: 25, f: 55 }, '93o': { r: 10, c: 20, f: 70 }, '92o': { r: 5, c: 15, f: 80 },
    '87s': { r: 100, c: 0, f: 0 }, '86s': { r: 100, c: 0, f: 0 }, '85s': { r: 90, c: 10, f: 0 }, '84s': { r: 75, c: 20, f: 5 },
    '83s': { r: 50, c: 30, f: 20 }, '82s': { r: 40, c: 30, f: 30 },
    '87o': { r: 95, c: 5, f: 0 }, '86o': { r: 80, c: 15, f: 5 }, '85o': { r: 55, c: 30, f: 15 }, '84o': { r: 35, c: 30, f: 35 },
    '83o': { r: 15, c: 25, f: 60 }, '82o': { r: 5, c: 15, f: 80 },
    '76s': { r: 100, c: 0, f: 0 }, '75s': { r: 100, c: 0, f: 0 }, '74s': { r: 85, c: 15, f: 0 }, '73s': { r: 70, c: 20, f: 10 }, '72s': { r: 45, c: 30, f: 25 },
    '76o': { r: 90, c: 10, f: 0 }, '75o': { r: 75, c: 20, f: 5 }, '74o': { r: 50, c: 30, f: 20 }, '73o': { r: 30, c: 30, f: 40 }, '72o': { r: 10, c: 20, f: 70 },
    '65s': { r: 100, c: 0, f: 0 }, '64s': { r: 95, c: 5, f: 0 }, '63s': { r: 80, c: 15, f: 5 }, '62s': { r: 55, c: 25, f: 20 },
    '65o': { r: 85, c: 15, f: 0 }, '64o': { r: 65, c: 25, f: 10 }, '63o': { r: 40, c: 30, f: 30 }, '62o': { r: 20, c: 25, f: 55 },
    '54s': { r: 100, c: 0, f: 0 }, '53s': { r: 90, c: 10, f: 0 }, '52s': { r: 70, c: 20, f: 10 },
    '54o': { r: 80, c: 15, f: 5 }, '53o': { r: 55, c: 30, f: 15 }, '52o': { r: 30, c: 30, f: 40 },
    '43s': { r: 85, c: 15, f: 0 }, '42s': { r: 60, c: 25, f: 15 }, '43o': { r: 50, c: 30, f: 20 }, '42o': { r: 25, c: 30, f: 45 },
    '32s': { r: 55, c: 30, f: 15 }, '32o': { r: 20, c: 30, f: 50 },
  },
};

// Simplified ranges for other positions (similar structure)
const DEFAULT_STRATEGY: MixedStrategy = { r: 0, c: 0, f: 100 };

interface GTOHandRangeChartProps {
  locale?: string;
}

export function GTOHandRangeChart({ locale = 'ko' }: GTOHandRangeChartProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>('BTN');
  const [hoveredHand, setHoveredHand] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const positions = ['UTG', 'MP', 'CO', 'BTN', 'SB'];

  const labels = {
    ko: {
      title: 'GTO 오픈 레인지 차트',
      position: '포지션',
      raise: '레이즈',
      call: '콜/림프',
      fold: '폴드',
      suited: '수딧',
      offsuit: '오프수딧',
      pairs: '페어',
      tooltip: 'GTO(Game Theory Optimal) 기반 프리플랍 오픈 레인지입니다.',
      handsCount: '핸드',
      percentage: '레인지',
      mixedNote: '혼합 전략',
      pureRaise: '순수 레이즈',
      pureCall: '순수 콜',
      pureFold: '순수 폴드',
      combos: '콤보',
      strategyTip: '실제 GTO는 상황에 따라 믹스드 전략을 사용합니다',
    },
    en: {
      title: 'GTO Opening Range Chart',
      position: 'Position',
      raise: 'Raise',
      call: 'Call/Limp',
      fold: 'Fold',
      suited: 'Suited',
      offsuit: 'Offsuit',
      pairs: 'Pairs',
      tooltip: 'GTO (Game Theory Optimal) based preflop opening ranges.',
      handsCount: 'Hands',
      percentage: 'Range',
      mixedNote: 'Mixed Strategy',
      pureRaise: 'Pure Raise',
      pureCall: 'Pure Call',
      pureFold: 'Pure Fold',
      combos: 'combos',
      strategyTip: 'Real GTO uses mixed strategies depending on the situation',
    },
    ja: {
      title: 'GTOオープンレンジチャート',
      position: 'ポジション',
      raise: 'レイズ',
      call: 'コール/リンプ',
      fold: 'フォールド',
      suited: 'スーテッド',
      offsuit: 'オフスート',
      pairs: 'ペア',
      tooltip: 'GTO(ゲーム理論最適)に基づくプリフロップオープンレンジです。',
      handsCount: 'ハンド',
      percentage: 'レンジ',
      mixedNote: 'ミックス戦略',
      pureRaise: '純粋レイズ',
      pureCall: '純粋コール',
      pureFold: '純粋フォールド',
      combos: 'コンボ',
      strategyTip: '実際のGTOは状況に応じてミックス戦略を使用します',
    }
  };

  const t = labels[locale as keyof typeof labels] || labels.ko;

  const getHandStrategy = (hand: string): MixedStrategy => {
    // For positions not in GTO_MIXED, interpolate based on BTN/UTG
    if (GTO_MIXED[selectedPosition]?.[hand]) {
      return GTO_MIXED[selectedPosition][hand];
    }
    // Interpolation for MP, CO, SB based on position
    const btnStrategy = GTO_MIXED['BTN']?.[hand] || DEFAULT_STRATEGY;
    const utgStrategy = GTO_MIXED['UTG']?.[hand] || DEFAULT_STRATEGY;

    const positionFactor: { [key: string]: number } = {
      'UTG': 0, 'MP': 0.3, 'CO': 0.6, 'BTN': 1, 'SB': 0.9
    };
    const factor = positionFactor[selectedPosition] || 0.5;

    return {
      r: Math.round(utgStrategy.r + (btnStrategy.r - utgStrategy.r) * factor),
      c: Math.round(utgStrategy.c + (btnStrategy.c - utgStrategy.c) * factor),
      f: Math.round(utgStrategy.f + (btnStrategy.f - utgStrategy.f) * factor),
    };
  };

  const getHandType = (hand: string): string => {
    if (hand.length === 2) return t.pairs;
    return hand.includes('s') ? t.suited : t.offsuit;
  };

  const getCombos = (hand: string): number => {
    if (hand.length === 2) return 6; // pairs
    return hand.includes('s') ? 4 : 12; // suited vs offsuit
  };

  const getCellBackground = (strategy: MixedStrategy): string => {
    if (strategy.r >= 95) return 'bg-[#22C55E]';
    if (strategy.f >= 95) return 'bg-[#27272A]';
    if (strategy.c >= 50 && strategy.r < 30) return 'bg-[#F59E0B]';

    // Mixed strategy - use gradient
    if (strategy.r > 0 && strategy.c > 0) {
      return 'bg-gradient-to-br from-[#22C55E] to-[#F59E0B]';
    }
    if (strategy.r > 0 && strategy.f > 0) {
      return 'bg-gradient-to-br from-[#22C55E] to-[#27272A]';
    }
    if (strategy.c > 0 && strategy.f > 0) {
      return 'bg-gradient-to-br from-[#F59E0B] to-[#27272A]';
    }

    if (strategy.r >= 50) return 'bg-[#22C55E]';
    if (strategy.c >= 50) return 'bg-[#F59E0B]';
    return 'bg-[#27272A]';
  };

  const getCellOpacity = (strategy: MixedStrategy): number => {
    const maxAction = Math.max(strategy.r, strategy.c, strategy.f);
    if (maxAction >= 90) return 1;
    if (maxAction >= 70) return 0.9;
    if (maxAction >= 50) return 0.8;
    return 0.7;
  };

  const calculateRangeStats = () => {
    let raiseWeight = 0;
    let callWeight = 0;
    let totalCombos = 0;

    HANDS.forEach((row, i) => {
      row.forEach((hand, j) => {
        const strategy = getHandStrategy(hand);
        const combos = i === j ? 6 : (i < j ? 4 : 12);
        totalCombos += combos;
        raiseWeight += combos * (strategy.r / 100);
        callWeight += combos * (strategy.c / 100);
      });
    });

    const raisePercent = ((raiseWeight / totalCombos) * 100).toFixed(1);
    const callPercent = ((callWeight / totalCombos) * 100).toFixed(1);
    const totalPercent = (((raiseWeight + callWeight) / totalCombos) * 100).toFixed(1);

    return { raisePercent, callPercent, totalPercent };
  };

  const stats = calculateRangeStats();

  const handleMouseEnter = (hand: string, e: React.MouseEvent) => {
    setHoveredHand(hand);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <div className="rounded-xl bg-[#121216] border border-[#27272A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-[#14B8A6]" />
          <h3 className="font-semibold text-white">{t.title}</h3>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-[#71717A] cursor-help" />
          <div className="absolute right-0 top-6 z-20 w-72 p-3 bg-[#18181B] border border-[#27272A] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-xs text-[#A1A1AA]">
            {t.tooltip}
            <div className="mt-2 pt-2 border-t border-[#27272A] text-[#71717A]">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              {t.strategyTip}
            </div>
          </div>
        </div>
      </div>

      {/* Position Tabs */}
      <div className="px-5 py-3 border-b border-[#27272A] bg-[#0A0A0B]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#71717A] mr-2">{t.position}:</span>
          <div className="flex gap-1 p-1 bg-[#1A1A20] rounded-lg">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedPosition === pos
                    ? 'bg-[#14B8A6] text-white shadow-md'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#27272A]'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="px-5 py-4 border-b border-[#27272A] bg-[#0D0D0F]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Legend Items */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A20] rounded-lg">
              <div className="w-4 h-4 rounded bg-[#22C55E] shadow-sm shadow-[#22C55E]/30" />
              <span className="text-white font-medium text-sm">{t.raise}</span>
              <span className="text-[#22C55E] font-bold text-sm">{stats.raisePercent}%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A20] rounded-lg">
              <div className="w-4 h-4 rounded bg-[#F59E0B] shadow-sm shadow-[#F59E0B]/30" />
              <span className="text-white font-medium text-sm">{t.call}</span>
              <span className="text-[#F59E0B] font-bold text-sm">{stats.callPercent}%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A20] rounded-lg">
              <div className="w-4 h-4 rounded bg-[#27272A] border border-[#3F3F46]" />
              <span className="text-[#71717A] font-medium text-sm">{t.fold}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A20] rounded-lg">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-[#22C55E] to-[#F59E0B]" />
              <span className="text-[#A1A1AA] font-medium text-sm">{t.mixedNote}</span>
            </div>
          </div>

          {/* Total Range */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-lg">
            <TrendingUp className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-[#A1A1AA] text-sm">{t.percentage}:</span>
            <span className="text-[#14B8A6] font-bold text-lg">{stats.totalPercent}%</span>
          </div>
        </div>
      </div>

      {/* Hand Grid */}
      <div className="p-4 overflow-x-auto relative">
        <div className="grid grid-cols-13 gap-0.5 min-w-[400px]">
          {HANDS.map((row, i) =>
            row.map((hand, j) => {
              const strategy = getHandStrategy(hand);
              const isHovered = hoveredHand === hand;

              return (
                <div
                  key={hand}
                  className={`
                    aspect-square flex items-center justify-center text-[9px] sm:text-[10px] font-medium
                    rounded cursor-pointer transition-all border relative
                    ${getCellBackground(strategy)}
                    ${strategy.f >= 95 ? 'border-[#3F3F46] text-[#71717A]' : 'border-transparent text-white'}
                    ${isHovered ? 'ring-2 ring-[#14B8A6] z-10 scale-110 shadow-lg' : ''}
                  `}
                  style={{ opacity: getCellOpacity(strategy) }}
                  onMouseEnter={(e) => handleMouseEnter(hand, e)}
                  onMouseLeave={() => { setHoveredHand(null); setTooltipPos(null); }}
                >
                  {hand}
                  {/* Show small indicator for mixed strategies */}
                  {strategy.r > 0 && strategy.r < 95 && strategy.f < 95 && (
                    <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Enhanced Tooltip */}
      {hoveredHand && (
        <div className="px-5 py-4 border-t border-[#27272A] bg-[#0A0A0B]">
          <div className="flex flex-col gap-3">
            {/* Hand Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-xl">{hoveredHand}</span>
                <span className="text-[#71717A] text-sm">{getHandType(hoveredHand)}</span>
                <span className="text-[#52525B] text-xs">({getCombos(hoveredHand)} {t.combos})</span>
              </div>
            </div>

            {/* Strategy Breakdown */}
            <div className="flex flex-wrap gap-3">
              {(() => {
                const strategy = getHandStrategy(hoveredHand);
                return (
                  <>
                    {strategy.r > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
                        <div className="w-3 h-3 rounded bg-[#22C55E]" />
                        <span className="text-[#22C55E] font-bold">{strategy.r}%</span>
                        <span className="text-[#A1A1AA] text-sm">{t.raise}</span>
                      </div>
                    )}
                    {strategy.c > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                        <div className="w-3 h-3 rounded bg-[#F59E0B]" />
                        <span className="text-[#F59E0B] font-bold">{strategy.c}%</span>
                        <span className="text-[#A1A1AA] text-sm">{t.call}</span>
                      </div>
                    )}
                    {strategy.f > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#27272A] border border-[#3F3F46] rounded-lg">
                        <div className="w-3 h-3 rounded bg-[#52525B]" />
                        <span className="text-[#71717A] font-bold">{strategy.f}%</span>
                        <span className="text-[#52525B] text-sm">{t.fold}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Visual Bar */}
            {(() => {
              const strategy = getHandStrategy(hoveredHand);
              return (
                <div className="w-full h-2 bg-[#27272A] rounded-full overflow-hidden flex">
                  {strategy.r > 0 && (
                    <div className="h-full bg-[#22C55E]" style={{ width: `${strategy.r}%` }} />
                  )}
                  {strategy.c > 0 && (
                    <div className="h-full bg-[#F59E0B]" style={{ width: `${strategy.c}%` }} />
                  )}
                  {strategy.f > 0 && (
                    <div className="h-full bg-[#3F3F46]" style={{ width: `${strategy.f}%` }} />
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
