// Ready-made topics. A question is either
//   { type: 'mcq',   text, image, options: [...], correct: <index> }
//   { type: 'typed', text, image, answers: [...] }   (any accepted answer, case does not matter)

const mcq = (text, options, correctText) => ({
  type: 'mcq', text, image: null, options, correct: options.indexOf(correctText),
});
const typed = (text, ...answers) => ({ type: 'typed', text, image: null, answers });

// Super Minds habitat questions, as written by the teacher.
const HABITAT_PLACES = ['In the ocean', 'In the jungle', 'In the desert', 'In the polar region'];
const habitat = [
  mcq('Where do camels live?', HABITAT_PLACES, 'In the desert'),
  mcq('Where do penguins live?', HABITAT_PLACES, 'In the polar region'),
  mcq('Where do parrots live?', HABITAT_PLACES, 'In the jungle'),
  mcq('What can you find in the ocean?', ['coral', 'sand', 'snow', 'rocks'], 'coral'),
  mcq('What can you find in the mountains?', ['coral', 'sand', 'trees', 'rocks'], 'rocks'),
  mcq('What can you find in the jungle?', ['trees', 'sand', 'snow', 'rocks'], 'trees'),
  mcq('What animal can you find in the mountains?', ['goat', 'camel', 'shark', 'polar bear'], 'goat'),
  mcq('What animal can you find in the ocean?', ['shark', 'parrot', 'monkey', 'cat'], 'shark'),
  mcq('What animal can you find in the jungle?', ['camel', 'tiger', 'jellyfish', 'penguin'], 'tiger'),
];

const getDressed = [
  typed('______ jacket is red.', 'this'),
  typed('______ socks are orange.', 'these'),
  typed('______ cap is yellow.', 'this'),
  typed('______ sweater is green.', 'this'),
  typed('______ jeans are blue.', 'these'),
  typed('______ trousers are purple.', 'these'),
  typed('______ shoes are black.', 'these'),
  typed('______ T-shirt is pink.', 'this'),
  typed('______ shorts are brown.', 'these'),
];

const general = [
  typed('What is 5 + 5?', '10', 'ten'),
  typed('What colour is the sky?', 'blue'),
  typed('What does a cow say?', 'moo'),
  typed('Which month comes after January?', 'February'),
  typed("What is the opposite of 'hot'?", 'cold'),
  typed('How many legs does a cat have?', '4', 'four'),
  typed('What is the capital city of the UK?', 'London'),
  typed('What colour is a banana?', 'yellow'),
  typed('What is 7 + 3?', '10', 'ten'),
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Sums from 1 + 1 to 10 + 10 with three nearby wrong answers.
function additionQuestions(n = 12) {
  const seen = new Set();
  const out = [];
  while (out.length < n) {
    const a = 1 + Math.floor(Math.random() * 10);
    const b = 1 + Math.floor(Math.random() * 10);
    if (seen.has(`${a}+${b}`)) continue;
    seen.add(`${a}+${b}`);
    const sum = a + b;
    const wrong = shuffle([-2, -1, 1, 2, 3].map((d) => sum + d).filter((v) => v > 0)).slice(0, 3);
    const options = shuffle([sum, ...wrong]).map(String);
    out.push({ type: 'mcq', text: `${a} + ${b} = ?`, image: null, options, correct: options.indexOf(String(sum)) });
  }
  return out;
}

export const TOPICS = [
  {
    id: 'habitat',
    title: 'Habitats',
    sub: 'Super Minds',
    kind: 'mcq',
    color: 'green',
    questions: () => habitat,
  },
  {
    id: 'addition',
    title: 'Addition',
    sub: '1 + 1 to 10 + 10',
    kind: 'mcq',
    color: 'blue',
    random: true,
    questions: () => additionQuestions(12),
  },
  {
    id: 'thisthese',
    title: 'Get Dressed: this or these',
    sub: 'Super Minds',
    kind: 'typed',
    color: 'pink',
    questions: () => getDressed,
  },
  {
    id: 'general',
    title: 'General Quiz',
    sub: 'Mixed questions',
    kind: 'typed',
    color: 'yellow',
    questions: () => general,
  },
];

export function topicById(id) {
  return TOPICS.find((tp) => tp.id === id);
}

export { shuffle };
