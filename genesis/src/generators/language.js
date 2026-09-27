export class LanguageGenerator {
  constructor(random) {
    this.random = random;
  }

  generate(culture) {
    const name = this.generateLanguageName();

    return {
      id: culture.language.id,
      name,
      cultureName: culture.name,
      family: this.generateLanguageFamily(),
      phonology: this.generatePhonology(),
      grammar: this.generateGrammar(),
      writing: this.generateWritingSystem(),
      vocabulary: this.generateVocabularySample(),
      dialects: this.generateDialects(),
      literaryTradition: this.generateLiteraryTradition(),
      speakers: culture.population.size,
      status: this.random.choice(['thriving', 'stable', 'declining', 'endangered', 'sacred/ritual only'])
    };
  }

  generateLanguageName() {
    const patterns = [
      { parts: ['Alta', 'Kesh', 'Mir', 'Vol', 'Zar'], suffix: ['ic', 'ish', 'ian', 'ese', 'ani'] },
      { parts: ['Tor', 'Shal', 'Nym', 'Kar', 'Vel'], suffix: ['dari', 'nir', 'wen', 'mar', 'dor'] }
    ];

    const pattern = this.random.choice(patterns);
    return this.random.choice(pattern.parts) + this.random.choice(pattern.suffix);
  }

  generateLanguageFamily() {
    return {
      family: this.random.choice([
        'Isolate (no known relations)',
        'Part of larger language family',
        'Creole of multiple languages',
        'Descended from ancient classical language'
      ]),
      influences: this.random.sample([
        'neighboring tribal tongues',
        'trade language',
        'conqueror\'s language',
        'religious liturgy',
        'scholarly exchange',
        'merchant pidgin'
      ], this.random.int(1, 3))
    };
  }

  generatePhonology() {
    return {
      consonants: this.random.choice([
        'simple with 15-20 consonants',
        'complex with 30+ consonants',
        'minimal with 10-15 consonants',
        'rich in fricatives',
        'heavy on stops and nasals'
      ]),
      vowels: this.random.choice([
        'basic 5-vowel system',
        'complex with vowel length distinctions',
        'rich diphthong system',
        'minimal 3-vowel system',
        'vowel harmony required'
      ]),
      syllableStructure: this.random.choice([
        'simple CV structure',
        'complex consonant clusters allowed',
        'strict phonotactic rules',
        'open syllables preferred',
        'consonant-heavy'
      ]),
      tone: this.random.bool(0.3) ? {
        present: true,
        type: this.random.choice(['2-tone system', '3-tone system', '5-tone system', 'pitch accent'])
      } : { present: false },
      stress: this.random.choice([
        'fixed on first syllable',
        'fixed on last syllable',
        'penultimate stress',
        'unpredictable',
        'no distinctive stress'
      ]),
      distinctiveFeatures: this.random.sample([
        'clicks',
        'ejectives',
        'breathy voice',
        'creaky voice',
        'nasal vowels',
        'long/short distinctions',
        'glottalization'
      ], this.random.int(0, 3))
    };
  }

  generateGrammar() {
    return {
      wordOrder: this.random.choice(['SOV', 'SVO', 'VSO', 'VOS', 'OVS', 'free word order']),
      alignment: this.random.choice([
        'nominative-accusative',
        'ergative-absolutive',
        'active-stative',
        'tripartite'
      ]),
      case: this.generateCaseSystem(),
      verbSystem: this.generateVerbSystem(),
      nounSystem: this.generateNounSystem(),
      complexity: this.random.choice([
        'highly analytical',
        'highly synthetic',
        'agglutinative',
        'fusional',
        'polysynthetic'
      ])
    };
  }

  generateCaseSystem() {
    const caseCount = this.random.weighted([
      { value: 'no cases', weight: 2 },
      { value: '2-3 cases', weight: 3 },
      { value: '4-6 cases', weight: 3 },
      { value: '7-10 cases', weight: 2 },
      { value: '10+ cases', weight: 1 }
    ]);

    const possibleCases = [
      'nominative', 'accusative', 'genitive', 'dative', 'ablative',
      'locative', 'instrumental', 'vocative', 'ergative', 'absolutive'
    ];

    return {
      count: caseCount,
      cases: caseCount !== 'no cases' ?
        this.random.sample(possibleCases, Math.min(parseInt(caseCount) || 3, possibleCases.length)) : [],
      marking: this.random.choice(['affixes', 'particles', 'word order', 'mixed'])
    };
  }

  generateVerbSystem() {
    return {
      tenses: this.random.sample([
        'past', 'present', 'future',
        'near past', 'remote past',
        'near future', 'remote future',
        'perfect', 'imperfect'
      ], this.random.int(3, 6)),
      aspects: this.random.sample([
        'perfective', 'imperfective',
        'habitual', 'progressive',
        'inceptive', 'completive'
      ], this.random.int(2, 4)),
      moods: this.random.sample([
        'indicative', 'subjunctive',
        'imperative', 'conditional',
        'optative', 'potential'
      ], this.random.int(2, 4)),
      voice: this.random.sample([
        'active', 'passive',
        'middle', 'reflexive',
        'reciprocal', 'causative'
      ], this.random.int(2, 4)),
      agreement: this.random.choice([
        'agrees with subject in person and number',
        'minimal agreement',
        'agrees with both subject and object',
        'no agreement',
        'complex agreement with evidentiality'
      ])
    };
  }

  generateNounSystem() {
    return {
      gender: this.random.weighted([
        { value: 'no grammatical gender', weight: 3 },
        { value: '2 genders', weight: 2 },
        { value: '3 genders', weight: 2 },
        { value: '4+ noun classes', weight: 1 }
      ]),
      number: this.random.choice([
        'singular/plural',
        'singular/dual/plural',
        'singular/paucal/plural',
        'no number marking'
      ]),
      definiteness: this.random.choice([
        'definite/indefinite articles',
        'no articles',
        'suffixed definiteness',
        'definiteness by context'
      ]),
      possession: this.random.choice([
        'possessive affixes',
        'possessive particles',
        'genitive construction',
        'alienable/inalienable distinction'
      ])
    };
  }

  generateWritingSystem() {
    const hasWriting = this.random.bool(0.7);

    if (!hasWriting) {
      return {
        type: 'oral tradition only',
        literacy: 'not applicable'
      };
    }

    const type = this.random.weighted([
      { value: 'alphabet', weight: 3 },
      { value: 'abjad (consonant-only)', weight: 2 },
      { value: 'abugida (consonant-vowel)', weight: 2 },
      { value: 'syllabary', weight: 2 },
      { value: 'logographic', weight: 1 },
      { value: 'mixed system', weight: 1 }
    ]);

    return {
      type,
      direction: this.random.choice([
        'left to right',
        'right to left',
        'top to bottom',
        'boustrophedon (alternating)'
      ]),
      characters: type === 'logographic' ? this.random.int(3000, 10000) : this.random.int(20, 200),
      materials: this.random.sample([
        'clay tablets',
        'papyrus scrolls',
        'parchment',
        'bark paper',
        'stone inscriptions',
        'metal plates',
        'woven textiles'
      ], this.random.int(1, 3)),
      literacy: this.random.choice([
        'restricted to elite',
        'clerical monopoly',
        'merchant class',
        'widespread',
        'universal expectation'
      ]),
      age: this.random.choice([
        'ancient (1000+ years)',
        'established (500-1000 years)',
        'recent (100-500 years)',
        'new (less than 100 years)'
      ])
    };
  }

  generateVocabularySample() {
    const words = [];

    // Basic vocabulary
    const concepts = [
      { concept: 'sun', phoneme: this.generateWord(1, 2) },
      { concept: 'moon', phoneme: this.generateWord(1, 2) },
      { concept: 'water', phoneme: this.generateWord(1, 2) },
      { concept: 'fire', phoneme: this.generateWord(1, 2) },
      { concept: 'earth', phoneme: this.generateWord(1, 2) },
      { concept: 'sky', phoneme: this.generateWord(1, 2) },
      { concept: 'mountain', phoneme: this.generateWord(2, 3) },
      { concept: 'river', phoneme: this.generateWord(2, 2) },
      { concept: 'tree', phoneme: this.generateWord(1, 2) },
      { concept: 'person', phoneme: this.generateWord(2, 3) },
      { concept: 'house', phoneme: this.generateWord(2, 2) },
      { concept: 'god', phoneme: this.generateWord(1, 2) },
      { concept: 'war', phoneme: this.generateWord(1, 2) },
      { concept: 'peace', phoneme: this.generateWord(2, 3) },
      { concept: 'king', phoneme: this.generateWord(2, 2) }
    ];

    return {
      examples: concepts,
      loanwords: this.random.sample([
        'from neighboring languages',
        'from trade contacts',
        'from conquered peoples',
        'from religious texts',
        'minimal borrowing'
      ], this.random.int(1, 3)),
      specializedVocabulary: this.random.sample([
        'extensive kinship terms',
        'rich color vocabulary',
        'detailed landscape terms',
        'complex honorifics',
        'specialized craft terms',
        'astronomical terminology',
        'ritual/religious language'
      ], this.random.int(2, 4))
    };
  }

  generateWord(minSyllables, maxSyllables) {
    const syllableCount = this.random.int(minSyllables, maxSyllables);
    const consonants = 'tkpbdgmnlrswyhzfvjx';
    const vowels = 'aeiou';

    let word = '';
    for (let i = 0; i < syllableCount; i++) {
      const consonant = consonants[this.random.int(0, consonants.length - 1)];
      const vowel = vowels[this.random.int(0, vowels.length - 1)];

      if (this.random.bool(0.7)) {
        word += consonant;
      }
      word += vowel;

      if (this.random.bool(0.3) && i === syllableCount - 1) {
        word += consonants[this.random.int(0, consonants.length - 1)];
      }
    }

    return word;
  }

  generateDialects() {
    const dialectCount = this.random.int(2, 6);
    const dialects = [];

    for (let i = 0; i < dialectCount; i++) {
      dialects.push({
        name: this.generateDialectName(),
        region: this.random.choice(['northern', 'southern', 'eastern', 'western', 'coastal', 'highland', 'urban', 'rural']),
        distinctiveness: this.random.choice(['subtle variations', 'noticeable differences', 'barely mutually intelligible', 'separate language']),
        features: this.random.sample([
          'different vocabulary',
          'phonological shifts',
          'grammatical simplification',
          'archaic forms preserved',
          'foreign influences',
          'prestige variant'
        ], this.random.int(2, 3))
      });
    }

    return dialects;
  }

  generateDialectName() {
    const modifiers = ['High', 'Low', 'Old', 'Common', 'Court', 'Street', 'Temple', 'Trade'];
    return this.random.choice(modifiers);
  }

  generateLiteraryTradition() {
    return {
      exists: this.random.bool(0.6),
      forms: this.random.sample([
        'epic poetry',
        'historical chronicles',
        'religious texts',
        'philosophical dialogues',
        'legal codes',
        'love poetry',
        'satirical works',
        'folk tales'
      ], this.random.int(2, 5)),
      age: this.random.choice([
        'ancient texts revered',
        'medieval corpus',
        'emerging tradition',
        'oral only until recently'
      ]),
      canonicalWorks: this.random.int(3, 12) + ' major texts'
    };
  }
}
