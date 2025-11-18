export class CultureGenerator {
  constructor(random, geography) {
    this.random = random;
    this.geography = geography;
  }

  generate() {
    const cultureCount = this.random.int(5, 12);
    const cultures = [];

    for (let i = 0; i < cultureCount; i++) {
      const location = this.assignLocation();
      cultures.push({
        id: `culture_${i}`,
        name: this.generateCultureName(),
        location,
        population: this.generatePopulation(),
        government: this.generateGovernment(),
        values: this.generateValues(),
        customs: this.generateCustoms(),
        arts: this.generateArts(),
        technology: this.generateTechnology(),
        religion: this.generateReligion(),
        economy: this.generateEconomy(),
        military: this.generateMilitary(),
        architecture: this.generateArchitecture(),
        cuisine: this.generateCuisine(),
        socialStructure: this.generateSocialStructure(),
        language: this.generateLanguageStub(i) // Full language generated separately
      });
    }

    return cultures;
  }

  assignLocation() {
    const continent = this.random.choice(this.geography.continents);
    const region = this.random.choice(continent.regions);

    return {
      continent: continent.name,
      region: region.name,
      terrain: this.random.choice(continent.terrain).type,
      climate: this.random.choice(continent.climate.zones)
    };
  }

  generateCultureName() {
    const patterns = [
      { parts: ['Ael', 'Mor', 'Thal', 'Kor', 'Var'], suffix: ['ian', 'ish', 'ese', 'ite', 'an'] },
      { parts: ['Nor', 'Shal', 'Kae', 'Dra', 'Zeph'], suffix: ['im', 'oni', 'ari', 'eth', 'os'] },
      { parts: ['Val', 'Sil', 'Oro', 'Mer', 'Cael'], suffix: ['dar', 'wen', 'mar', 'dor', 'vin'] }
    ];

    const pattern = this.random.choice(patterns);
    return this.random.choice(pattern.parts) + this.random.choice(pattern.suffix);
  }

  generatePopulation() {
    const size = this.random.weighted([
      { value: 'small', weight: 3 },
      { value: 'moderate', weight: 4 },
      { value: 'large', weight: 2 },
      { value: 'vast', weight: 1 }
    ]);

    const distribution = this.random.choice([
      'concentrated in cities',
      'spread across villages',
      'nomadic tribes',
      'isolated communities',
      'urbanized centers with rural hinterlands',
      'coastal settlements',
      'mountain strongholds'
    ]);

    return {
      size,
      distribution,
      growth: this.random.choice(['declining', 'stable', 'growing', 'rapidly expanding']),
      diversity: this.random.choice(['homogeneous', 'moderately diverse', 'highly multicultural'])
    };
  }

  generateGovernment() {
    const type = this.random.weighted([
      { value: 'monarchy', weight: 3 },
      { value: 'theocracy', weight: 2 },
      { value: 'democracy', weight: 2 },
      { value: 'oligarchy', weight: 2 },
      { value: 'meritocracy', weight: 1 },
      { value: 'tribal council', weight: 2 },
      { value: 'magocracy', weight: 1 },
      { value: 'military dictatorship', weight: 1 }
    ]);

    return {
      type,
      stability: this.random.choice(['chaotic', 'unstable', 'stable', 'rigid']),
      corruption: this.random.choice(['rampant', 'significant', 'moderate', 'minimal', 'virtually none']),
      succession: this.generateSuccession(type),
      powerStructure: this.generatePowerStructure(type)
    };
  }

  generateSuccession(govType) {
    const successionTypes = {
      monarchy: ['hereditary', 'elective', 'divine right', 'trial by combat'],
      theocracy: ['divine selection', 'clerical vote', 'prophetic vision', 'hereditary priesthood'],
      democracy: ['popular vote', 'representative election', 'lottery system'],
      oligarchy: ['internal selection', 'wealth-based', 'merit-based', 'hereditary elite'],
      meritocracy: ['examination system', 'achievement-based', 'peer review'],
      'tribal council': ['consensus', 'elder selection', 'warrior proven', 'spiritual chosen'],
      magocracy: ['magical duel', 'arcane assessment', 'mentor selection'],
      'military dictatorship': ['coup', 'military hierarchy', 'strongest warrior']
    };

    return this.random.choice(successionTypes[govType] || ['unclear']);
  }

  generatePowerStructure(govType) {
    return {
      centralizedControl: this.random.choice(['absolute', 'strong', 'moderate', 'weak', 'minimal']),
      regionalAutonomy: this.random.choice(['none', 'limited', 'significant', 'high']),
      keyFactions: this.random.sample([
        'military commanders',
        'religious leaders',
        'wealthy merchants',
        'landed nobility',
        'guild masters',
        'arcane practitioners',
        'tribal chieftains',
        'popular movements',
        'secret societies',
        'foreign interests'
      ], this.random.int(2, 4))
    };
  }

  generateValues() {
    const coreValues = this.random.sample([
      'honor and duty',
      'personal freedom',
      'collective good',
      'martial prowess',
      'scholarly pursuit',
      'spiritual enlightenment',
      'material wealth',
      'artistic expression',
      'harmony with nature',
      'technological progress',
      'tradition and ancestry',
      'individual achievement',
      'family loyalty',
      'social hierarchy',
      'equality and justice'
    ], this.random.int(3, 5));

    return {
      core: coreValues,
      taboos: this.generateTaboos(),
      virtues: this.generateVirtues(),
      vices: this.generateVices()
    };
  }

  generateTaboos() {
    return this.random.sample([
      'speaking the names of the dead',
      'consuming certain animals',
      'crossing religious boundaries',
      'breaking oaths',
      'touching sacred objects',
      'dishonoring ancestors',
      'wasting resources',
      'questioning authority',
      'mixing social classes',
      'practicing certain arts',
      'entering forbidden places',
      'violating hospitality'
    ], this.random.int(2, 4));
  }

  generateVirtues() {
    return this.random.sample([
      'courage in adversity',
      'wisdom in judgment',
      'generosity to others',
      'loyalty to kin',
      'honesty in dealings',
      'discipline in action',
      'compassion for the weak',
      'skill in craft',
      'eloquence in speech',
      'humility before greatness'
    ], this.random.int(3, 5));
  }

  generateVices() {
    return this.random.sample([
      'cowardice',
      'betrayal',
      'greed',
      'dishonesty',
      'cruelty',
      'sloth',
      'pride',
      'gluttony',
      'envy',
      'wrath'
    ], this.random.int(2, 3));
  }

  generateCustoms() {
    return {
      greetings: this.random.choice([
        'formal bows with hand gestures',
        'touching foreheads together',
        'elaborate handshakes',
        'verbal formulas and titles',
        'exchange of gifts',
        'ritual phrases',
        'touching of amulets'
      ]),
      comingOfAge: this.generateComingOfAge(),
      marriage: this.generateMarriageCustoms(),
      death: this.generateDeathRituals(),
      festivals: this.generateFestivals(),
      dailyRituals: this.generateDailyRituals()
    };
  }

  generateComingOfAge() {
    return {
      age: this.random.int(12, 20),
      ceremony: this.random.choice([
        'solo wilderness survival',
        'ritual combat or contest',
        'spiritual vision quest',
        'master crafting of first work',
        'pilgrimage to sacred site',
        'recitation of ancestral history',
        'formal presentation to community'
      ]),
      significance: this.random.choice([
        'marks full citizenship',
        'allows marriage',
        'enables property ownership',
        'grants voice in governance',
        'permits learning sacred knowledge'
      ])
    };
  }

  generateMarriageCustoms() {
    return {
      arrangement: this.random.choice([
        'arranged by families',
        'individual choice with family approval',
        'free choice',
        'negotiated alliances',
        'spiritual pairing'
      ]),
      ceremony: this.random.choice([
        'elaborate multi-day festival',
        'simple binding ritual',
        'religious consecration',
        'legal contract signing',
        'trial period cohabitation',
        'combat or contest victory'
      ]),
      structure: this.random.choice([
        'monogamous pairs',
        'polygamous households',
        'polyandrous groups',
        'communal marriages',
        'temporary bonds'
      ]),
      dowry: this.random.bool() ? this.random.choice([
        'bride\'s family provides wealth',
        'groom\'s family provides wealth',
        'mutual exchange',
        'no material exchange'
      ]) : 'no dowry tradition'
    };
  }

  generateDeathRituals() {
    return {
      bodyTreatment: this.random.choice([
        'cremation with elaborate ceremony',
        'burial in ancestral grounds',
        'sky burial exposed to elements',
        'sea burial',
        'mummification and preservation',
        'entombment in sacred caves',
        'return to nature in forest groves'
      ]),
      mourning: this.random.choice([
        'year-long formal mourning',
        'joyful celebration of life',
        'silent contemplation period',
        'elaborate funeral games',
        'ritual scarification',
        'feast and storytelling'
      ]),
      afterlife: this.random.choice([
        'belief in reincarnation',
        'journey to afterworld',
        'union with divine',
        'ancestral spirit realm',
        'no afterlife belief',
        'dependent on deeds in life'
      ])
    };
  }

  generateFestivals() {
    const festivalCount = this.random.int(4, 8);
    const festivals = [];

    for (let i = 0; i < festivalCount; i++) {
      festivals.push({
        name: this.generateFestivalName(),
        timing: this.random.choice([
          'spring equinox',
          'summer solstice',
          'autumn harvest',
          'winter solstice',
          'new moon',
          'full moon',
          'first rainfall',
          'end of war season'
        ]),
        purpose: this.random.choice([
          'honoring the gods',
          'celebrating harvest',
          'remembering ancestors',
          'marking the new year',
          'blessing marriages',
          'initiating warriors',
          'renewing social bonds'
        ]),
        activities: this.random.sample([
          'ritual dancing',
          'communal feasting',
          'athletic competitions',
          'artistic performances',
          'market fairs',
          'religious ceremonies',
          'gift exchanges',
          'storytelling contests'
        ], this.random.int(2, 4))
      });
    }

    return festivals;
  }

  generateFestivalName() {
    const prefixes = ['Feast of', 'Festival of', 'Night of', 'Day of', 'Celebration of'];
    const subjects = ['Lights', 'Renewal', 'Ancestors', 'Harvest', 'Stars', 'Fire', 'Water', 'Spirits'];
    return this.random.choice(prefixes) + ' ' + this.random.choice(subjects);
  }

  generateDailyRituals() {
    return this.random.sample([
      'dawn prayers or meditations',
      'ritual cleansing',
      'offerings to household spirits',
      'reading of sacred texts',
      'communal meals',
      'evening storytelling',
      'craft work as meditation',
      'honoring ancestors at shrine'
    ], this.random.int(2, 4));
  }

  generateArts() {
    return {
      visualArts: this.random.sample([
        'intricate metalwork',
        'stone carving',
        'pottery and ceramics',
        'textile weaving',
        'painting and murals',
        'wood carving',
        'glassblowing',
        'jewelry making'
      ], this.random.int(2, 4)),
      performingArts: this.random.sample([
        'epic poetry recitation',
        'masked theater',
        'ritual dancing',
        'musical performances',
        'puppetry',
        'acrobatics',
        'storytelling traditions'
      ], this.random.int(2, 3)),
      literaryArts: this.random.sample([
        'historical chronicles',
        'religious texts',
        'philosophical treatises',
        'poetry collections',
        'legal codes',
        'medical texts',
        'oral traditions'
      ], this.random.int(2, 3)),
      significance: this.random.choice([
        'central to cultural identity',
        'reserved for elite classes',
        'accessible to all',
        'sacred and ritualistic',
        'primarily utilitarian',
        'valued as highest achievement'
      ])
    };
  }

  generateTechnology() {
    const era = this.random.weighted([
      { value: 'stone age', weight: 1 },
      { value: 'bronze age', weight: 2 },
      { value: 'iron age', weight: 3 },
      { value: 'early industrial', weight: 2 },
      { value: 'mixed technology', weight: 2 }
    ]);

    return {
      era,
      metalworking: this.random.choice(['primitive', 'basic', 'advanced', 'masterful', 'none']),
      agriculture: this.random.choice(['hunter-gatherer', 'basic farming', 'advanced irrigation', 'crop rotation', 'intensive cultivation']),
      construction: this.random.choice(['simple shelters', 'timber buildings', 'stone masonry', 'advanced architecture', 'monumental works']),
      seafaring: this.random.choice(['none', 'coastal vessels', 'blue water capable', 'master navigators']),
      warfare: this.random.choice(['primitive weapons', 'organized tactics', 'siege warfare', 'cavalry', 'naval power']),
      specializations: this.random.sample([
        'astronomical knowledge',
        'medical practices',
        'alchemical arts',
        'engineering marvels',
        'magical theory',
        'cryptography',
        'cartography',
        'mathematics'
      ], this.random.int(1, 3))
    };
  }

  generateReligion() {
    const type = this.random.weighted([
      { value: 'polytheistic', weight: 4 },
      { value: 'monotheistic', weight: 2 },
      { value: 'animistic', weight: 2 },
      { value: 'ancestor worship', weight: 2 },
      { value: 'dualistic', weight: 1 },
      { value: 'philosophical', weight: 1 }
    ]);

    return {
      type,
      pantheon: type === 'polytheistic' ? this.generatePantheon() : null,
      clergy: this.generateClergy(),
      temples: this.random.choice([
        'grand temple complexes',
        'modest shrines',
        'natural sacred sites',
        'household altars',
        'no formal structures'
      ]),
      practices: this.random.sample([
        'daily prayers',
        'ritual sacrifices',
        'meditation and contemplation',
        'pilgrimage journeys',
        'sacred dances',
        'divination rituals',
        'fasting and purification',
        'communal worship'
      ], this.random.int(3, 5)),
      influence: this.random.choice([
        'dominates all aspects of life',
        'significant but not absolute',
        'moderate influence',
        'declining relevance',
        'private but intense'
      ])
    };
  }

  generatePantheon() {
    const godCount = this.random.int(3, 12);
    const gods = [];

    const domains = ['war', 'wisdom', 'agriculture', 'death', 'love', 'sea', 'sky', 'earth',
                     'fire', 'water', 'forge', 'hunt', 'magic', 'justice', 'chaos', 'order'];

    for (let i = 0; i < godCount; i++) {
      gods.push({
        domain: this.random.choice(domains),
        characteristics: this.random.choice(['benevolent', 'stern', 'capricious', 'vengeful', 'mysterious']),
        worship: this.random.choice(['widespread', 'regional', 'specialized', 'secret cult'])
      });
    }

    return gods;
  }

  generateClergy() {
    return {
      structure: this.random.choice([
        'hierarchical priesthood',
        'independent shamans',
        'monastic orders',
        'hereditary priests',
        'elected spiritual leaders',
        'no formal clergy'
      ]),
      power: this.random.choice([
        'rival to secular authority',
        'subordinate to rulers',
        'independent but respected',
        'minimal political influence',
        'actually rule society'
      ]),
      requirements: this.random.sample([
        'celibacy',
        'extensive training',
        'divine calling',
        'noble birth',
        'magical ability',
        'physical perfection',
        'intellectual prowess'
      ], this.random.int(1, 3))
    };
  }

  generateEconomy() {
    return {
      basis: this.random.weighted([
        { value: 'agriculture', weight: 4 },
        { value: 'trade', weight: 3 },
        { value: 'raiding', weight: 1 },
        { value: 'craftsmanship', weight: 2 },
        { value: 'resource extraction', weight: 2 },
        { value: 'tribute collection', weight: 1 }
      ]),
      currency: this.random.choice([
        'precious metal coins',
        'barter system',
        'standardized goods',
        'shell money',
        'promissory notes',
        'no currency'
      ]),
      trade: this.generateTrade(),
      resources: this.random.sample([
        'grain and foodstuffs',
        'livestock',
        'textiles',
        'metals and ores',
        'gems and jewelry',
        'timber',
        'spices',
        'medicines',
        'weapons',
        'art objects'
      ], this.random.int(3, 6)),
      wealthDistribution: this.random.choice([
        'extreme inequality',
        'wealthy elite with poor masses',
        'emerging middle class',
        'relatively equal',
        'communal property'
      ])
    };
  }

  generateTrade() {
    return {
      extent: this.random.choice([
        'isolated and self-sufficient',
        'limited regional trade',
        'extensive trade networks',
        'maritime trade empire',
        'control key trade routes'
      ]),
      attitude: this.random.choice([
        'suspicious of foreigners',
        'welcoming to merchants',
        'aggressive monopolization',
        'free trade advocates',
        'strategic embargoes'
      ])
    };
  }

  generateMilitary() {
    return {
      structure: this.random.choice([
        'professional standing army',
        'citizen militia',
        'feudal levies',
        'tribal war bands',
        'mercenary companies',
        'minimal military',
        'warrior caste'
      ]),
      strength: this.random.choice(['negligible', 'weak', 'moderate', 'strong', 'dominant force']),
      specialization: this.random.sample([
        'heavy infantry',
        'light skirmishers',
        'cavalry',
        'archers',
        'naval forces',
        'siege weapons',
        'guerrilla tactics',
        'magical warfare'
      ], this.random.int(1, 3)),
      philosophy: this.random.choice([
        'aggressive expansion',
        'defensive posture',
        'honorable combat',
        'total war',
        'strategic deterrence',
        'pacifist ideals'
      ])
    };
  }

  generateArchitecture() {
    return {
      materials: this.random.sample([
        'stone',
        'timber',
        'brick',
        'adobe',
        'bamboo',
        'marble',
        'metal',
        'glass'
      ], this.random.int(2, 3)),
      style: this.random.choice([
        'imposing and monumental',
        'elegant and refined',
        'functional and simple',
        'organic and flowing',
        'geometric and precise',
        'ornate and decorative'
      ]),
      notableFeatures: this.random.sample([
        'towering spires',
        'massive domes',
        'intricate mosaics',
        'flying buttresses',
        'underground chambers',
        'floating structures',
        'living buildings',
        'crystal formations'
      ], this.random.int(2, 4)),
      urbanPlanning: this.random.choice([
        'chaotic organic growth',
        'rigid grid system',
        'radiating from center',
        'following natural features',
        'fortified concentric rings',
        'vertical layering'
      ])
    };
  }

  generateCuisine() {
    return {
      staples: this.random.sample([
        'rice',
        'wheat bread',
        'root vegetables',
        'fish',
        'red meat',
        'poultry',
        'legumes',
        'dairy products'
      ], this.random.int(2, 4)),
      flavors: this.random.sample([
        'spicy and hot',
        'sweet and savory',
        'bitter and complex',
        'sour and tangy',
        'rich and fatty',
        'simple and mild'
      ], this.random.int(2, 3)),
      preparation: this.random.sample([
        'slow-cooked stews',
        'grilled over open flame',
        'raw and fresh',
        'fermented foods',
        'elaborate sauces',
        'baked goods',
        'preserved and dried'
      ], this.random.int(2, 3)),
      significance: this.random.choice([
        'central to social bonding',
        'ritualistic importance',
        'purely functional',
        'mark of status and wealth',
        'artistic expression'
      ])
    };
  }

  generateSocialStructure() {
    return {
      classes: this.generateSocialClasses(),
      mobility: this.random.choice([
        'rigid caste system',
        'minimal movement possible',
        'merit-based advancement',
        'fluid and changing',
        'classless society'
      ]),
      family: this.random.choice([
        'nuclear families',
        'extended clans',
        'communal child-rearing',
        'matriarchal lineages',
        'patriarchal lineages'
      ]),
      gender: this.generateGenderRoles(),
      ageHierarchy: this.random.choice([
        'elders hold authority',
        'youth valued',
        'prime of life esteemed',
        'age irrelevant'
      ])
    };
  }

  generateSocialClasses() {
    const classCount = this.random.int(3, 6);
    const classes = [];

    const possibleClasses = [
      'ruling elite',
      'religious authorities',
      'military officers',
      'wealthy merchants',
      'skilled craftsmen',
      'free farmers',
      'laborers',
      'servants',
      'slaves',
      'outcasts'
    ];

    for (let i = 0; i < classCount; i++) {
      if (possibleClasses.length > 0) {
        const className = possibleClasses.splice(this.random.int(0, possibleClasses.length - 1), 1)[0];
        classes.push({
          name: className,
          privileges: this.random.choice(['extensive', 'significant', 'moderate', 'minimal', 'none']),
          restrictions: this.random.choice(['few', 'some', 'many', 'severe'])
        });
      }
    }

    return classes;
  }

  generateGenderRoles() {
    return {
      type: this.random.choice([
        'strictly divided',
        'complementary but equal',
        'female-dominated',
        'male-dominated',
        'minimal differentiation',
        'complex multi-gender system'
      ]),
      leadership: this.random.choice([
        'exclusively male',
        'exclusively female',
        'merit-based regardless',
        'alternating or balanced',
        'specific roles by gender'
      ]),
      restrictions: this.random.choice([
        'severe limitations',
        'moderate expectations',
        'minimal constraints',
        'no gender-based restrictions'
      ])
    };
  }

  generateLanguageStub(index) {
    return {
      id: `language_${index}`,
      name: null, // Will be filled by language generator
      characteristics: 'To be generated'
    };
  }
}
