import { timeToFrenchVariants } from './App';

describe('timeToFrenchVariants()', () => {
  const cases = [
    {
      input: [0, 0],
      expected: ['minuit'],
    },
    {
      input: [0, 1],
      expected: ['minuit une'],
    },
    {
      input: [0, 30],
      expected: ['minuit trente', 'minuit et demie'],
    },
    {
      input: [0, 45],
      expected: [
        'minuit quarante-cinq',
        'une heure moins le quart',
        'une heure moins quinze',
      ],
    },
    {
      input: [1, 1],
      expected: ['une heure une'],
    },
    {
      input: [2, 15],
      expected: ['deux heures quinze', 'deux heures et quart'],
    },
    {
      input: [2, 45],
      expected: [
        'trois heures moins le quart',
        'trois heures moins quinze',
        'deux heures quarante-cinq',
      ],
    },
    {
      input: [5, 50],
      expected: ['cinq heures cinquante', 'six heures moins dix'],
    },
    {
      input: [11, 55],
      expected: ['onze heures cinquante-cinq', 'douze heures moins cinq'],
    },
    {
      input: [12, 0],
      expected: ['midi', 'douze heures'],
    },
    {
      input: [12, 15],
      expected: ['midi quinze', 'douze heures quinze', 'midi et quart'],
    },
    {
      input: [12, 30],
      expected: ['midi trente', 'douze heures trente', 'midi et demi'],
    },
    {
      input: [12, 45],
      expected: [
        'midi quarante-cinq',
        'douze heures quarante-cinq',
        'treize heures moins le quart',
        'treize heures moins quinze',
      ],
    },
    {
      input: [14, 22],
      expected: ['quatorze heures vingt-deux'],
    },
    {
      input: [14, 30],
      expected: ['quatorze heures trente', 'quatorze heures et demie'],
    },
    {
      input: [14, 40],
      expected: ['quatorze heures quarante', 'quinze heures moins vingt'],
    },
    {
      input: [14, 45],
      expected: [
        'quatorze heures quarante-cinq',
        'quinze heures moins le quart',
        'quinze heures moins quinze',
      ],
    },
    {
      input: [14, 50],
      expected: ['quatorze heures cinquante', 'quinze heures moins dix'],
    },
    {
      input: [14, 55],
      expected: ['quatorze heures cinquante-cinq', 'quinze heures moins cinq'],
    },
    {
      input: [21, 1],
      expected: ['vingt et une heures une'],
    },
    {
      input: [21, 40],
      expected: [
        'vingt et une heures quarante',
        'vingt-deux heures moins vingt',
      ],
    },
    {
      input: [23, 59],
      expected: ['vingt-trois heures cinquante-neuf', 'minuit moins une'],
    },
    { input: [1, 0], expected: ['une heure'] },
    { input: [15, 0], expected: ['quinze heures'] },
    {
      input: [13, 30],
      expected: ['treize heures trente', 'treize heures et demie'],
    },
    { input: [0, 21], expected: ['minuit vingt et une'] },
    { input: [2, 31], expected: ['deux heures trente et une'] },
    { input: [12, 1], expected: ['midi une', 'douze heures une'] },
    {
      input: [23, 59],
      expected: ['vingt-trois heures cinquante-neuf', 'minuit moins une'],
    },
    {
      input: [0, 59],
      expected: ['minuit cinquante-neuf', 'une heure moins une'],
    },
    {
      input: [12, 59],
      expected: [
        'midi cinquante-neuf',
        'treize heures moins une',
        'douze heures cinquante-neuf',
      ],
    },
    {
      input: [13, 1],
      expected: ['treize heures une'],
    },
    {
      input: [20, 31],
      expected: ['vingt heures trente et une'],
    },
    {
      input: [11, 1],
      expected: ['onze heures une'],
    },
    {
      input: [22, 45],
      expected: [
        'vingt-trois heures moins le quart',
        'vingt-trois heures moins quinze',
        'vingt-deux heures quarante-cinq',
      ],
    },
    {
      input: [16, 15],
      expected: ['seize heures et quart', 'seize heures quinze'],
    },
    {
      input: [10, 35],
      expected: ['onze heures moins vingt-cinq', 'dix heures trente-cinq'],
    },
    {
      input: [6, 50],
      expected: ['six heures cinquante', 'sept heures moins dix'],
    },
    {
      input: [1, 59],
      expected: ['une heure cinquante-neuf', 'deux heures moins une'],
    },
  ];

  cases.forEach(({ input, expected }) => {
    test(`${input[0]}:${input[1]
      .toString()
      .padStart(2, '0')} → includes all expected variants`, () => {
      const result = timeToFrenchVariants(...input);
      expected.forEach((variant) => {
        expect(result).toContain(variant);
      });
    });
  });
});
