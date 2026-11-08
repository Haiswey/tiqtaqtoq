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

// Super Minds 1, Unit 2 (Let's play!), p.25: "We use an before words beginning with a, e, i, o or u."
// Only Unit 2 language: toys, the p.25 adjectives, colours, There's / favourite / What a ...!
const AN = ['a', 'an'];
const aOrAn = [
  mcq("It's ______ orange kite.", AN, 'an'),
  mcq("It's ______ yellow kite.", AN, 'a'),
  mcq("It's ______ ugly monster.", AN, 'an'),
  mcq("It's ______ beautiful monster.", AN, 'a'),
  mcq("It's ______ old go-kart.", AN, 'an'),
  mcq("It's ______ new go-kart.", AN, 'a'),
  mcq("There's ______ orange ball.", AN, 'an'),
  mcq("There's ______ big ball.", AN, 'a'),
  mcq('My favourite toy is ______ old doll.', AN, 'an'),
  mcq('My favourite toy is ______ small doll.', AN, 'a'),
  mcq('His favourite toy is ______ orange plane.', AN, 'an'),
  mcq('His favourite toy is ______ red bike.', AN, 'a'),
  mcq('Her favourite toy is ______ ugly doll.', AN, 'an'),
  mcq("It's ______ short train.", AN, 'a'),
  mcq('What ______ ugly old go-kart!', AN, 'an'),
  mcq('What ______ long train!', AN, 'a'),
];

// Super Minds 1, Unit 2, p.T23: "This is Sophie. How old is she? Her favourite toy is her bike."
// The Super Friends are used so pupils know who is a boy (Thunder, Flash) and who is a girl (Misty, Whisper).
const HE = ['He', 'She'];
const he = ['he', 'she'];
const HIS = ['His', 'Her'];
const his = ['his', 'her'];
const heSheHisHer = [
  mcq('This is Misty. ______ is seven.', HE, 'She'),
  mcq('This is Flash. ______ is seven.', HE, 'He'),
  mcq("This is Thunder. ______'s six.", HE, 'He'),
  mcq("This is Whisper. ______'s six.", HE, 'She'),
  mcq('This is Whisper. How old is ______?', he, 'she'),
  mcq('This is Thunder. How old is ______?', he, 'he'),
  mcq('This is Thunder. ______ favourite toy is a kite.', HIS, 'His'),
  mcq('This is Whisper. ______ favourite toy is a doll.', HIS, 'Her'),
  mcq('This is Flash. ______ favourite toy is a go-kart.', HIS, 'His'),
  mcq('This is Misty. ______ favourite toy is a ball.', HIS, 'Her'),
  mcq('This is Misty. Her favourite toy is ______ bike.', his, 'her'),
  mcq('This is Flash. His favourite toy is ______ train.', his, 'his'),
  mcq("What's ______ name? This is Whisper.", his, 'her'),
  mcq("What's ______ name? This is Thunder.", his, 'his'),
];

// Super Minds 1, Unit 3, p.T36 song: "Nine rats are in the desk." Only Unit 3 animals and the song's places.
const plurals = [
  typed('Nine ______ (rat) are in the desk.', 'rats'),
  typed('Three ______ (lizard) are in the bag.', 'lizards'),
  typed('Seven ______ (cat) are under the table.', 'cats'),
  typed('Two ______ (elephant) are on the ruler.', 'elephants'),
  typed('Four ______ (dog) are on the table.', 'dogs'),
  typed('Eight ______ (duck) are on the books.', 'ducks'),
  typed('Ten ______ (frog) are under the chair.', 'frogs'),
  typed('Five ______ (spider) are on the desk.', 'spiders'),
  typed('One ______ (spider) is in the bag.', 'spider'),
  typed('One ______ (elephant) is under the chair.', 'elephant'),
  typed('Six ______ (duck) are under the desk.', 'ducks'),
  typed('One ______ (rat) is on the table.', 'rat'),
  typed('Two ______ (frog) are in the bag.', 'frogs'),
  typed('One ______ (lizard) is on the ruler.', 'lizard'),
  typed('Three ______ (dog) are on the chair.', 'dogs'),
  typed('Four ______ (cat) are on the books.', 'cats'),
];

// Super Minds 1, Unit 5: days of the week, three days in a row; every day is the answer twice.
const days = [
  typed('Friday, ______, Sunday.', 'Saturday'),
  typed('Saturday, ______, Monday.', 'Sunday'),
  typed('Tuesday, ______, Thursday.', 'Wednesday'),
  typed('______, Tuesday, Wednesday.', 'Monday'),
  typed('Wednesday, ______, Friday.', 'Thursday'),
  typed('Thursday, ______, Saturday.', 'Friday'),
  typed('Sunday, ______, Tuesday.', 'Monday'),
  typed('Thursday, Friday, ______.', 'Saturday'),
  typed('Monday, ______, Wednesday.', 'Tuesday'),
  typed('Monday, Tuesday, ______.', 'Wednesday'),
  typed('______, Saturday, Sunday.', 'Friday'),
  typed('Wednesday, Thursday, ______.', 'Friday'),
  typed('______, Wednesday, Thursday.', 'Tuesday'),
  typed('Saturday, Sunday, ______.', 'Monday'),
];

// Super Minds 1, Unit 7, p.T85: He/she is wearing ..., short answers. Names from the Unit 7 listening.
const IS = ['is', 'are'];
const ISQ = ['Is', 'Are'];
const NOT = ["isn't", "aren't"];
const wearing = [
  mcq('Paul ______ wearing a black T-shirt.', IS, 'is'),
  mcq('Lara and Emma ______ wearing T-shirts.', IS, 'are'),
  mcq('Ken ______ wearing a yellow sweater.', IS, 'is'),
  mcq('Paul and Ken ______ wearing jeans.', IS, 'are'),
  mcq('She ______ wearing a pink skirt.', IS, 'is'),
  mcq('They ______ wearing red caps.', IS, 'are'),
  mcq('He ______ wearing blue shorts.', IS, 'is'),
  mcq('Lara and Paul ______ wearing white socks.', IS, 'are'),
  mcq('______ he wearing a jacket? Yes, he is.', ISQ, 'Is'),
  mcq('______ they wearing shoes? Yes, they are.', ISQ, 'Are'),
  mcq("______ Emma wearing a skirt? No, she isn't.", ISQ, 'Is'),
  mcq("______ Ken and Paul wearing caps? No, they aren't.", ISQ, 'Are'),
  mcq('Is she wearing a cap? Yes, she ______.', IS, 'is'),
  mcq('Are they wearing trousers? Yes, they ______.', IS, 'are'),
  mcq('Is he wearing trousers? No, he ______.', NOT, "isn't"),
  mcq('Are they wearing socks? No, they ______.', NOT, "aren't"),
];

// Super Minds 1, Unit 9, p.T109: Where's ...? Where are ...? It's / They're, with Unit 9 beach words.
const WHERE = ["Where's", 'Where are'];
const ITS = ["It's", "They're"];
const whereIs = [
  mcq("______ the shells? They're in the bag.", WHERE, 'Where are'),
  mcq("______ the book? It's in the bag.", WHERE, "Where's"),
  mcq("______ the fish? It's in the sea.", WHERE, "Where's"),
  mcq("______ the books? They're in the blue bag.", WHERE, 'Where are'),
  mcq("______ the ice cream? It's in the red bag.", WHERE, "Where's"),
  mcq("______ the photos? They're on the book.", WHERE, 'Where are'),
  mcq("______ the shells? They're on the beach.", WHERE, 'Where are'),
  mcq("______ the book? It's on the sandcastle.", WHERE, "Where's"),
  mcq("Where's the ice cream? ______ on the book.", ITS, "It's"),
  mcq('Where are the shells? ______ in the red bag.', ITS, "They're"),
  mcq("Where's the sandcastle? ______ on the beach.", ITS, "It's"),
  mcq('Where are the books? ______ on the beach.', ITS, "They're"),
  mcq("Where's the photo? ______ in the book.", ITS, "It's"),
  mcq('Where are the shells? ______ on the sandcastle.', ITS, "They're"),
  mcq("Where's the fish? ______ in the sea.", ITS, "It's"),
  mcq('Where are the photos? ______ in the bag.', ITS, "They're"),
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

// group: home page section. year: small label (the teacher's school teaches Friends to Unit 4 in Year 1 and
// Units 5-9 in Year 2). Textbook sets are listed in unit order within a group.
export const GROUPS = ['grammar', 'spelling', 'topics'];

const sm1 = (unit) => `Super Minds 1 · Unit ${unit}`;

export const TOPICS = [
  { id: 'a-an', group: 'grammar', year: 1, title: 'a or an', sub: sm1(2), kind: 'mcq', color: 'purple', questions: () => aOrAn },
  { id: 'he-she', group: 'grammar', year: 1, title: 'he / she / his / her', sub: sm1(2), kind: 'mcq', color: 'purple', questions: () => heSheHisHer },
  { id: 'thisthese', group: 'grammar', year: 2, title: 'Get Dressed: this or these', sub: sm1(7), kind: 'typed', color: 'purple', questions: () => getDressed },
  { id: 'wearing', group: 'grammar', year: 2, title: 'is / are wearing', sub: sm1(7), kind: 'mcq', color: 'purple', questions: () => wearing },
  { id: 'where', group: 'grammar', year: 2, title: "Where's / Where are", sub: sm1(9), kind: 'mcq', color: 'purple', questions: () => whereIs },
  { id: 'plurals', group: 'spelling', year: 1, title: 'Plurals', sub: sm1(3), kind: 'typed', color: 'pink', questions: () => plurals },
  { id: 'days', group: 'spelling', year: 2, title: 'Days of the week', sub: sm1(5), kind: 'typed', color: 'pink', questions: () => days },
  { id: 'habitat', group: 'topics', year: 2, title: 'Habitats', sub: sm1(6), kind: 'mcq', color: 'green', questions: () => habitat },
  { id: 'addition', group: 'topics', title: 'Addition', sub: '1 + 1 to 10 + 10', kind: 'mcq', color: 'blue', random: true, questions: () => additionQuestions(12) },
  { id: 'general', group: 'topics', title: 'General Quiz', sub: 'Mixed questions', kind: 'typed', color: 'yellow', questions: () => general },
];

export function topicById(id) {
  return TOPICS.find((tp) => tp.id === id);
}

export { shuffle };
