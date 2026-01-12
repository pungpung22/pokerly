'use client';

import { useState } from 'react';
import { Target, Info } from 'lucide-react';

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

// GTO opening ranges by position (simplified version)
type Action = 'R' | 'C' | 'F';

interface PositionRange {
  [hand: string]: Action;
}

const GTO_RANGES: { [position: string]: PositionRange } = {
  UTG: {
    'AA': 'R', 'KK': 'R', 'QQ': 'R', 'JJ': 'R', 'TT': 'R', '99': 'R', '88': 'C', '77': 'C', '66': 'F', '55': 'F', '44': 'F', '33': 'F', '22': 'F',
    'AKs': 'R', 'AQs': 'R', 'AJs': 'R', 'ATs': 'R', 'A9s': 'C', 'A8s': 'C', 'A7s': 'C', 'A6s': 'C', 'A5s': 'C', 'A4s': 'C', 'A3s': 'F', 'A2s': 'F',
    'AKo': 'R', 'AQo': 'R', 'AJo': 'R', 'ATo': 'C', 'A9o': 'F', 'A8o': 'F', 'A7o': 'F', 'A6o': 'F', 'A5o': 'F', 'A4o': 'F', 'A3o': 'F', 'A2o': 'F',
    'KQs': 'R', 'KJs': 'R', 'KTs': 'R', 'K9s': 'C', 'K8s': 'F', 'K7s': 'F', 'K6s': 'F', 'K5s': 'F', 'K4s': 'F', 'K3s': 'F', 'K2s': 'F',
    'KQo': 'R', 'KJo': 'C', 'KTo': 'F', 'K9o': 'F', 'K8o': 'F', 'K7o': 'F', 'K6o': 'F', 'K5o': 'F', 'K4o': 'F', 'K3o': 'F', 'K2o': 'F',
    'QJs': 'R', 'QTs': 'R', 'Q9s': 'C', 'Q8s': 'F', 'Q7s': 'F', 'Q6s': 'F', 'Q5s': 'F', 'Q4s': 'F', 'Q3s': 'F', 'Q2s': 'F',
    'QJo': 'C', 'QTo': 'F', 'Q9o': 'F', 'Q8o': 'F', 'Q7o': 'F', 'Q6o': 'F', 'Q5o': 'F', 'Q4o': 'F', 'Q3o': 'F', 'Q2o': 'F',
    'JTs': 'R', 'J9s': 'C', 'J8s': 'F', 'J7s': 'F', 'J6s': 'F', 'J5s': 'F', 'J4s': 'F', 'J3s': 'F', 'J2s': 'F',
    'JTo': 'C', 'J9o': 'F', 'J8o': 'F', 'J7o': 'F', 'J6o': 'F', 'J5o': 'F', 'J4o': 'F', 'J3o': 'F', 'J2o': 'F',
    'T9s': 'C', 'T8s': 'F', 'T7s': 'F', 'T6s': 'F', 'T5s': 'F', 'T4s': 'F', 'T3s': 'F', 'T2s': 'F',
    'T9o': 'F', 'T8o': 'F', 'T7o': 'F', 'T6o': 'F', 'T5o': 'F', 'T4o': 'F', 'T3o': 'F', 'T2o': 'F',
    '98s': 'C', '97s': 'F', '96s': 'F', '95s': 'F', '94s': 'F', '93s': 'F', '92s': 'F',
    '98o': 'F', '97o': 'F', '96o': 'F', '95o': 'F', '94o': 'F', '93o': 'F', '92o': 'F',
    '87s': 'C', '86s': 'F', '85s': 'F', '84s': 'F', '83s': 'F', '82s': 'F',
    '87o': 'F', '86o': 'F', '85o': 'F', '84o': 'F', '83o': 'F', '82o': 'F',
    '76s': 'C', '75s': 'F', '74s': 'F', '73s': 'F', '72s': 'F',
    '76o': 'F', '75o': 'F', '74o': 'F', '73o': 'F', '72o': 'F',
    '65s': 'F', '64s': 'F', '63s': 'F', '62s': 'F',
    '65o': 'F', '64o': 'F', '63o': 'F', '62o': 'F',
    '54s': 'F', '53s': 'F', '52s': 'F', '54o': 'F', '53o': 'F', '52o': 'F',
    '43s': 'F', '42s': 'F', '43o': 'F', '42o': 'F',
    '32s': 'F', '32o': 'F',
  },
  MP: {
    'AA': 'R', 'KK': 'R', 'QQ': 'R', 'JJ': 'R', 'TT': 'R', '99': 'R', '88': 'R', '77': 'C', '66': 'C', '55': 'F', '44': 'F', '33': 'F', '22': 'F',
    'AKs': 'R', 'AQs': 'R', 'AJs': 'R', 'ATs': 'R', 'A9s': 'R', 'A8s': 'C', 'A7s': 'C', 'A6s': 'C', 'A5s': 'C', 'A4s': 'C', 'A3s': 'C', 'A2s': 'F',
    'AKo': 'R', 'AQo': 'R', 'AJo': 'R', 'ATo': 'R', 'A9o': 'C', 'A8o': 'F', 'A7o': 'F', 'A6o': 'F', 'A5o': 'F', 'A4o': 'F', 'A3o': 'F', 'A2o': 'F',
    'KQs': 'R', 'KJs': 'R', 'KTs': 'R', 'K9s': 'R', 'K8s': 'C', 'K7s': 'F', 'K6s': 'F', 'K5s': 'F', 'K4s': 'F', 'K3s': 'F', 'K2s': 'F',
    'KQo': 'R', 'KJo': 'R', 'KTo': 'C', 'K9o': 'F', 'K8o': 'F', 'K7o': 'F', 'K6o': 'F', 'K5o': 'F', 'K4o': 'F', 'K3o': 'F', 'K2o': 'F',
    'QJs': 'R', 'QTs': 'R', 'Q9s': 'R', 'Q8s': 'C', 'Q7s': 'F', 'Q6s': 'F', 'Q5s': 'F', 'Q4s': 'F', 'Q3s': 'F', 'Q2s': 'F',
    'QJo': 'R', 'QTo': 'C', 'Q9o': 'F', 'Q8o': 'F', 'Q7o': 'F', 'Q6o': 'F', 'Q5o': 'F', 'Q4o': 'F', 'Q3o': 'F', 'Q2o': 'F',
    'JTs': 'R', 'J9s': 'R', 'J8s': 'C', 'J7s': 'F', 'J6s': 'F', 'J5s': 'F', 'J4s': 'F', 'J3s': 'F', 'J2s': 'F',
    'JTo': 'R', 'J9o': 'F', 'J8o': 'F', 'J7o': 'F', 'J6o': 'F', 'J5o': 'F', 'J4o': 'F', 'J3o': 'F', 'J2o': 'F',
    'T9s': 'R', 'T8s': 'C', 'T7s': 'F', 'T6s': 'F', 'T5s': 'F', 'T4s': 'F', 'T3s': 'F', 'T2s': 'F',
    'T9o': 'C', 'T8o': 'F', 'T7o': 'F', 'T6o': 'F', 'T5o': 'F', 'T4o': 'F', 'T3o': 'F', 'T2o': 'F',
    '98s': 'R', '97s': 'C', '96s': 'F', '95s': 'F', '94s': 'F', '93s': 'F', '92s': 'F',
    '98o': 'F', '97o': 'F', '96o': 'F', '95o': 'F', '94o': 'F', '93o': 'F', '92o': 'F',
    '87s': 'R', '86s': 'C', '85s': 'F', '84s': 'F', '83s': 'F', '82s': 'F',
    '87o': 'F', '86o': 'F', '85o': 'F', '84o': 'F', '83o': 'F', '82o': 'F',
    '76s': 'R', '75s': 'C', '74s': 'F', '73s': 'F', '72s': 'F',
    '76o': 'F', '75o': 'F', '74o': 'F', '73o': 'F', '72o': 'F',
    '65s': 'C', '64s': 'F', '63s': 'F', '62s': 'F',
    '65o': 'F', '64o': 'F', '63o': 'F', '62o': 'F',
    '54s': 'C', '53s': 'F', '52s': 'F', '54o': 'F', '53o': 'F', '52o': 'F',
    '43s': 'F', '42s': 'F', '43o': 'F', '42o': 'F',
    '32s': 'F', '32o': 'F',
  },
  CO: {
    'AA': 'R', 'KK': 'R', 'QQ': 'R', 'JJ': 'R', 'TT': 'R', '99': 'R', '88': 'R', '77': 'R', '66': 'R', '55': 'C', '44': 'C', '33': 'C', '22': 'C',
    'AKs': 'R', 'AQs': 'R', 'AJs': 'R', 'ATs': 'R', 'A9s': 'R', 'A8s': 'R', 'A7s': 'R', 'A6s': 'R', 'A5s': 'R', 'A4s': 'R', 'A3s': 'R', 'A2s': 'R',
    'AKo': 'R', 'AQo': 'R', 'AJo': 'R', 'ATo': 'R', 'A9o': 'R', 'A8o': 'C', 'A7o': 'C', 'A6o': 'C', 'A5o': 'C', 'A4o': 'C', 'A3o': 'F', 'A2o': 'F',
    'KQs': 'R', 'KJs': 'R', 'KTs': 'R', 'K9s': 'R', 'K8s': 'R', 'K7s': 'R', 'K6s': 'C', 'K5s': 'C', 'K4s': 'C', 'K3s': 'C', 'K2s': 'C',
    'KQo': 'R', 'KJo': 'R', 'KTo': 'R', 'K9o': 'R', 'K8o': 'C', 'K7o': 'F', 'K6o': 'F', 'K5o': 'F', 'K4o': 'F', 'K3o': 'F', 'K2o': 'F',
    'QJs': 'R', 'QTs': 'R', 'Q9s': 'R', 'Q8s': 'R', 'Q7s': 'C', 'Q6s': 'C', 'Q5s': 'C', 'Q4s': 'C', 'Q3s': 'F', 'Q2s': 'F',
    'QJo': 'R', 'QTo': 'R', 'Q9o': 'R', 'Q8o': 'C', 'Q7o': 'F', 'Q6o': 'F', 'Q5o': 'F', 'Q4o': 'F', 'Q3o': 'F', 'Q2o': 'F',
    'JTs': 'R', 'J9s': 'R', 'J8s': 'R', 'J7s': 'C', 'J6s': 'C', 'J5s': 'F', 'J4s': 'F', 'J3s': 'F', 'J2s': 'F',
    'JTo': 'R', 'J9o': 'R', 'J8o': 'C', 'J7o': 'F', 'J6o': 'F', 'J5o': 'F', 'J4o': 'F', 'J3o': 'F', 'J2o': 'F',
    'T9s': 'R', 'T8s': 'R', 'T7s': 'R', 'T6s': 'C', 'T5s': 'F', 'T4s': 'F', 'T3s': 'F', 'T2s': 'F',
    'T9o': 'R', 'T8o': 'C', 'T7o': 'F', 'T6o': 'F', 'T5o': 'F', 'T4o': 'F', 'T3o': 'F', 'T2o': 'F',
    '98s': 'R', '97s': 'R', '96s': 'C', '95s': 'F', '94s': 'F', '93s': 'F', '92s': 'F',
    '98o': 'R', '97o': 'C', '96o': 'F', '95o': 'F', '94o': 'F', '93o': 'F', '92o': 'F',
    '87s': 'R', '86s': 'R', '85s': 'C', '84s': 'F', '83s': 'F', '82s': 'F',
    '87o': 'C', '86o': 'F', '85o': 'F', '84o': 'F', '83o': 'F', '82o': 'F',
    '76s': 'R', '75s': 'R', '74s': 'C', '73s': 'F', '72s': 'F',
    '76o': 'C', '75o': 'F', '74o': 'F', '73o': 'F', '72o': 'F',
    '65s': 'R', '64s': 'C', '63s': 'F', '62s': 'F',
    '65o': 'C', '64o': 'F', '63o': 'F', '62o': 'F',
    '54s': 'R', '53s': 'C', '52s': 'F', '54o': 'C', '53o': 'F', '52o': 'F',
    '43s': 'C', '42s': 'F', '43o': 'F', '42o': 'F',
    '32s': 'F', '32o': 'F',
  },
  BTN: {
    'AA': 'R', 'KK': 'R', 'QQ': 'R', 'JJ': 'R', 'TT': 'R', '99': 'R', '88': 'R', '77': 'R', '66': 'R', '55': 'R', '44': 'R', '33': 'R', '22': 'R',
    'AKs': 'R', 'AQs': 'R', 'AJs': 'R', 'ATs': 'R', 'A9s': 'R', 'A8s': 'R', 'A7s': 'R', 'A6s': 'R', 'A5s': 'R', 'A4s': 'R', 'A3s': 'R', 'A2s': 'R',
    'AKo': 'R', 'AQo': 'R', 'AJo': 'R', 'ATo': 'R', 'A9o': 'R', 'A8o': 'R', 'A7o': 'R', 'A6o': 'R', 'A5o': 'R', 'A4o': 'R', 'A3o': 'R', 'A2o': 'R',
    'KQs': 'R', 'KJs': 'R', 'KTs': 'R', 'K9s': 'R', 'K8s': 'R', 'K7s': 'R', 'K6s': 'R', 'K5s': 'R', 'K4s': 'R', 'K3s': 'R', 'K2s': 'R',
    'KQo': 'R', 'KJo': 'R', 'KTo': 'R', 'K9o': 'R', 'K8o': 'R', 'K7o': 'R', 'K6o': 'C', 'K5o': 'C', 'K4o': 'C', 'K3o': 'C', 'K2o': 'C',
    'QJs': 'R', 'QTs': 'R', 'Q9s': 'R', 'Q8s': 'R', 'Q7s': 'R', 'Q6s': 'R', 'Q5s': 'R', 'Q4s': 'R', 'Q3s': 'R', 'Q2s': 'R',
    'QJo': 'R', 'QTo': 'R', 'Q9o': 'R', 'Q8o': 'R', 'Q7o': 'C', 'Q6o': 'C', 'Q5o': 'C', 'Q4o': 'C', 'Q3o': 'F', 'Q2o': 'F',
    'JTs': 'R', 'J9s': 'R', 'J8s': 'R', 'J7s': 'R', 'J6s': 'R', 'J5s': 'R', 'J4s': 'R', 'J3s': 'C', 'J2s': 'C',
    'JTo': 'R', 'J9o': 'R', 'J8o': 'R', 'J7o': 'C', 'J6o': 'C', 'J5o': 'F', 'J4o': 'F', 'J3o': 'F', 'J2o': 'F',
    'T9s': 'R', 'T8s': 'R', 'T7s': 'R', 'T6s': 'R', 'T5s': 'R', 'T4s': 'C', 'T3s': 'C', 'T2s': 'C',
    'T9o': 'R', 'T8o': 'R', 'T7o': 'R', 'T6o': 'C', 'T5o': 'C', 'T4o': 'F', 'T3o': 'F', 'T2o': 'F',
    '98s': 'R', '97s': 'R', '96s': 'R', '95s': 'R', '94s': 'C', '93s': 'C', '92s': 'F',
    '98o': 'R', '97o': 'R', '96o': 'C', '95o': 'C', '94o': 'F', '93o': 'F', '92o': 'F',
    '87s': 'R', '86s': 'R', '85s': 'R', '84s': 'R', '83s': 'C', '82s': 'C',
    '87o': 'R', '86o': 'R', '85o': 'C', '84o': 'C', '83o': 'F', '82o': 'F',
    '76s': 'R', '75s': 'R', '74s': 'R', '73s': 'R', '72s': 'C',
    '76o': 'R', '75o': 'R', '74o': 'C', '73o': 'C', '72o': 'F',
    '65s': 'R', '64s': 'R', '63s': 'R', '62s': 'C',
    '65o': 'R', '64o': 'R', '63o': 'C', '62o': 'F',
    '54s': 'R', '53s': 'R', '52s': 'R', '54o': 'R', '53o': 'C', '52o': 'F',
    '43s': 'R', '42s': 'C', '43o': 'C', '42o': 'F',
    '32s': 'C', '32o': 'F',
  },
  SB: {
    'AA': 'R', 'KK': 'R', 'QQ': 'R', 'JJ': 'R', 'TT': 'R', '99': 'R', '88': 'R', '77': 'R', '66': 'R', '55': 'R', '44': 'R', '33': 'R', '22': 'R',
    'AKs': 'R', 'AQs': 'R', 'AJs': 'R', 'ATs': 'R', 'A9s': 'R', 'A8s': 'R', 'A7s': 'R', 'A6s': 'R', 'A5s': 'R', 'A4s': 'R', 'A3s': 'R', 'A2s': 'R',
    'AKo': 'R', 'AQo': 'R', 'AJo': 'R', 'ATo': 'R', 'A9o': 'R', 'A8o': 'R', 'A7o': 'R', 'A6o': 'R', 'A5o': 'R', 'A4o': 'R', 'A3o': 'C', 'A2o': 'C',
    'KQs': 'R', 'KJs': 'R', 'KTs': 'R', 'K9s': 'R', 'K8s': 'R', 'K7s': 'R', 'K6s': 'R', 'K5s': 'R', 'K4s': 'R', 'K3s': 'R', 'K2s': 'R',
    'KQo': 'R', 'KJo': 'R', 'KTo': 'R', 'K9o': 'R', 'K8o': 'R', 'K7o': 'C', 'K6o': 'C', 'K5o': 'C', 'K4o': 'C', 'K3o': 'C', 'K2o': 'C',
    'QJs': 'R', 'QTs': 'R', 'Q9s': 'R', 'Q8s': 'R', 'Q7s': 'R', 'Q6s': 'R', 'Q5s': 'R', 'Q4s': 'R', 'Q3s': 'R', 'Q2s': 'R',
    'QJo': 'R', 'QTo': 'R', 'Q9o': 'R', 'Q8o': 'C', 'Q7o': 'C', 'Q6o': 'C', 'Q5o': 'C', 'Q4o': 'C', 'Q3o': 'C', 'Q2o': 'C',
    'JTs': 'R', 'J9s': 'R', 'J8s': 'R', 'J7s': 'R', 'J6s': 'R', 'J5s': 'R', 'J4s': 'R', 'J3s': 'R', 'J2s': 'R',
    'JTo': 'R', 'J9o': 'R', 'J8o': 'C', 'J7o': 'C', 'J6o': 'C', 'J5o': 'C', 'J4o': 'C', 'J3o': 'C', 'J2o': 'C',
    'T9s': 'R', 'T8s': 'R', 'T7s': 'R', 'T6s': 'R', 'T5s': 'R', 'T4s': 'R', 'T3s': 'C', 'T2s': 'C',
    'T9o': 'R', 'T8o': 'R', 'T7o': 'C', 'T6o': 'C', 'T5o': 'C', 'T4o': 'C', 'T3o': 'C', 'T2o': 'C',
    '98s': 'R', '97s': 'R', '96s': 'R', '95s': 'R', '94s': 'R', '93s': 'C', '92s': 'C',
    '98o': 'R', '97o': 'C', '96o': 'C', '95o': 'C', '94o': 'C', '93o': 'C', '92o': 'C',
    '87s': 'R', '86s': 'R', '85s': 'R', '84s': 'R', '83s': 'C', '82s': 'C',
    '87o': 'R', '86o': 'C', '85o': 'C', '84o': 'C', '83o': 'C', '82o': 'C',
    '76s': 'R', '75s': 'R', '74s': 'R', '73s': 'R', '72s': 'C',
    '76o': 'R', '75o': 'C', '74o': 'C', '73o': 'C', '72o': 'C',
    '65s': 'R', '64s': 'R', '63s': 'R', '62s': 'C',
    '65o': 'R', '64o': 'C', '63o': 'C', '62o': 'C',
    '54s': 'R', '53s': 'R', '52s': 'R', '54o': 'R', '53o': 'C', '52o': 'C',
    '43s': 'R', '42s': 'C', '43o': 'C', '42o': 'C',
    '32s': 'C', '32o': 'C',
  },
};

interface GTOHandRangeChartProps {
  locale?: string;
}

export function GTOHandRangeChart({ locale = 'ko' }: GTOHandRangeChartProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>('BTN');
  const [hoveredHand, setHoveredHand] = useState<string | null>(null);

  const positions = ['UTG', 'MP', 'CO', 'BTN', 'SB'];

  const labels = {
    ko: {
      title: 'GTO 오픈 레인지 차트',
      position: '포지션',
      raise: '레이즈',
      call: '콜/믹스드',
      fold: '폴드',
      suited: '수딧',
      offsuit: '오프수딧',
      pairs: '페어',
      tooltip: 'GTO(Game Theory Optimal) 기반 프리플랍 오픈 레인지입니다. 포지션별 최적 핸드 선택을 참고하세요.',
      handsCount: '핸드',
      percentage: '레인지',
    },
    en: {
      title: 'GTO Opening Range Chart',
      position: 'Position',
      raise: 'Raise',
      call: 'Call/Mixed',
      fold: 'Fold',
      suited: 'Suited',
      offsuit: 'Offsuit',
      pairs: 'Pairs',
      tooltip: 'GTO (Game Theory Optimal) based preflop opening ranges. Use this as a reference for optimal hand selection by position.',
      handsCount: 'Hands',
      percentage: 'Range',
    },
    ja: {
      title: 'GTOオープンレンジチャート',
      position: 'ポジション',
      raise: 'レイズ',
      call: 'コール/ミックス',
      fold: 'フォールド',
      suited: 'スーテッド',
      offsuit: 'オフスート',
      pairs: 'ペア',
      tooltip: 'GTO(ゲーム理論最適)に基づくプリフロップオープンレンジです。ポジション別の最適なハンド選択の参考にしてください。',
      handsCount: 'ハンド',
      percentage: 'レンジ',
    }
  };

  const t = labels[locale as keyof typeof labels] || labels.ko;

  const getHandAction = (hand: string): Action => {
    return GTO_RANGES[selectedPosition]?.[hand] || 'F';
  };

  const getActionColor = (action: Action): string => {
    switch (action) {
      case 'R': return 'bg-[#22C55E]';
      case 'C': return 'bg-[#F59E0B]';
      case 'F': return 'bg-[#27272A]';
    }
  };

  const getActionBorder = (action: Action): string => {
    switch (action) {
      case 'R': return 'border-[#16A34A]';
      case 'C': return 'border-[#D97706]';
      case 'F': return 'border-[#3F3F46]';
    }
  };

  const calculateRangeStats = () => {
    let raiseCount = 0;
    let callCount = 0;
    let totalCombos = 0;

    HANDS.forEach((row, i) => {
      row.forEach((hand, j) => {
        const action = getHandAction(hand);
        const combos = i === j ? 6 : (i < j ? 4 : 12);
        totalCombos += combos;
        if (action === 'R') raiseCount += combos;
        if (action === 'C') callCount += combos;
      });
    });

    const raisePercent = ((raiseCount / totalCombos) * 100).toFixed(1);
    const callPercent = ((callCount / totalCombos) * 100).toFixed(1);
    const totalPercent = (((raiseCount + callCount) / totalCombos) * 100).toFixed(1);

    return { raiseCount, callCount, raisePercent, callPercent, totalPercent };
  };

  const stats = calculateRangeStats();

  return (
    <div className="rounded-xl bg-[#121216] border border-[#27272A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#14B8A6]" />
          <h3 className="font-semibold text-white">{t.title}</h3>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-[#71717A] cursor-help" />
          <div className="absolute right-0 top-6 z-10 w-72 p-3 bg-[#18181B] border border-[#27272A] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-xs text-[#A1A1AA]">
            {t.tooltip}
          </div>
        </div>
      </div>

      {/* Position Tabs */}
      <div className="px-5 py-3 border-b border-[#27272A] bg-[#0A0A0B]">
        <div className="flex items-center gap-2">
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

      {/* Stats Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#27272A]">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#22C55E]" />
            <span className="text-[#A1A1AA]">{t.raise}:</span>
            <span className="text-white font-medium">{stats.raisePercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#F59E0B]" />
            <span className="text-[#A1A1AA]">{t.call}:</span>
            <span className="text-white font-medium">{stats.callPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#27272A] border border-[#3F3F46]" />
            <span className="text-[#A1A1AA]">{t.fold}</span>
          </div>
        </div>
        <div className="text-sm">
          <span className="text-[#A1A1AA]">{t.percentage}:</span>
          <span className="text-[#14B8A6] font-bold ml-2">{stats.totalPercent}%</span>
        </div>
      </div>

      {/* Hand Grid */}
      <div className="p-4 overflow-x-auto">
        <div className="grid grid-cols-13 gap-0.5 min-w-[400px]">
          {HANDS.map((row, i) =>
            row.map((hand, j) => {
              const action = getHandAction(hand);
              return (
                <div
                  key={hand}
                  className={`
                    aspect-square flex items-center justify-center text-[9px] sm:text-[10px] font-medium
                    rounded cursor-pointer transition-all border
                    ${getActionColor(action)} ${getActionBorder(action)}
                    ${action === 'F' ? 'text-[#71717A]' : 'text-white'}
                    ${hoveredHand === hand ? 'ring-2 ring-[#14B8A6] z-10 scale-110' : ''}
                  `}
                  onMouseEnter={() => setHoveredHand(hand)}
                  onMouseLeave={() => setHoveredHand(null)}
                >
                  {hand}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Hovered Hand Info */}
      {hoveredHand && (
        <div className="px-5 py-3 border-t border-[#27272A] bg-[#0A0A0B]">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-lg">{hoveredHand}</span>
              <span className="text-[#A1A1AA]">
                {hoveredHand.length === 2 ? t.pairs :
                 hoveredHand.includes('s') ? t.suited : t.offsuit}
              </span>
            </div>
            <div className={`px-3 py-1 rounded font-medium ${
              getHandAction(hoveredHand) === 'R' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
              getHandAction(hoveredHand) === 'C' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
              'bg-[#27272A] text-[#71717A]'
            }`}>
              {getHandAction(hoveredHand) === 'R' ? t.raise :
               getHandAction(hoveredHand) === 'C' ? t.call : t.fold}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
