export class MythologyGenerator {
  constructor(random, geography, cultures) {
    this.random = random;
    this.geography = geography;
    this.cultures = cultures;
  }

  generate() {
    const mythologies = this.cultures.map(culture => this.generateCultureMythology(culture));
    const sharedMyths = this.generateSharedMyths();
    const cosmology = this.generateCosmology();

    return {
      culturalMythologies: mythologies,
      sharedMyths,
      cosmology
    };
  }

  generateCultureMythology(culture) {
    return {
      cultureName: culture.name,
      creationMyth: this.generateCreationMyth(culture),
      heroes: this.generateHeroes(culture),
      monsters: this.generateMonsters(culture),
      artifacts: this.generateArtifacts(culture),
      prophecies: this.generateProphecies(culture),
      sacredPlaces: this.generateSacredPlaces(culture),
      cosmicBeings: culture.religion.type === 'polytheistic' && culture.religion.pantheon ?
        this.generateDetailedPantheon(culture) : this.generateAlternativeBeings(culture)
    };
  }

  generateCreationMyth(culture) {
    const mythType = this.random.weighted([
      { value: 'ex nihilo', weight: 2 },
      { value: 'cosmic egg', weight: 2 },
      { value: 'world parent', weight: 2 },
      { value: 'emergence', weight: 2 },
      { value: 'divine conflict', weight: 2 },
      { value: 'world tree', weight: 1 }
    ]);

    return {
      type: mythType,
      narrative: this.generateCreationNarrative(mythType, culture),
      firstBeings: this.generateFirstBeings(),
      primordialElements: this.random.sample([
        'chaos and void',
        'fire and ice',
        'light and darkness',
        'earth and sky',
        'sea and land',
        'word and silence'
      ], this.random.int(2, 3)),
      humanOrigin: this.generateHumanOrigin()
    };
  }

  generateCreationNarrative(type, culture) {
    const narratives = {
      'ex nihilo': `In the beginning was ${this.random.choice(['the Void', 'absolute Nothingness', 'infinite Silence'])}. ` +
        `From this ${this.random.choice(['emerged', 'was spoken', 'was dreamed'])} the first ${this.random.choice(['word', 'thought', 'being'])}, ` +
        `and from this all creation flowed.`,

      'cosmic egg': `Before time, there existed only the ${this.random.choice(['Cosmic Egg', 'Primordial Sphere', 'Universal Seed'])}. ` +
        `Within it swirled all potential existence. When it ${this.random.choice(['hatched', 'shattered', 'bloomed'])}, ` +
        `the world and all beings sprang forth.`,

      'world parent': `${this.random.choice(['Sky and Earth', 'Night and Day', 'Fire and Water'])} were the first parents, ` +
        `locked in eternal embrace. Their ${this.random.choice(['children', 'dreams', 'tears'])} became the world and all its inhabitants.`,

      'emergence': `The ${culture.name} ancestors emerged from ${this.random.choice(['beneath the earth', 'the underworld', 'another realm', 'the sea'])}. ` +
        `They climbed through ${this.random.int(3, 9)} worlds before reaching this one, each teaching them vital lessons.`,

      'divine conflict': `The gods ${this.random.choice(['battled', 'competed', 'warred'])} in the time before time. ` +
        `From their ${this.random.choice(['blood', 'tears', 'laughter', 'breath'])} the world was formed, ` +
        `and from their ${this.random.choice(['fallen', 'defeated', 'transformed'])} enemies came both beauty and terror.`,

      'world tree': `The great ${this.random.choice(['Ash', 'Oak', 'Yew', 'Willow'])} grows at the center of all things. ` +
        `Its roots reach into ${this.random.int(3, 9)} underworlds, its branches support ${this.random.int(3, 9)} heavens. ` +
        `All life springs from its ${this.random.choice(['sap', 'fruit', 'leaves', 'seeds'])}.`
    };

    return narratives[type] || 'The creation is shrouded in mystery.';
  }

  generateMythicName() {
    const prefixes = ['Ymir', 'Gaia', 'Nyx', 'Chaos', 'Erebus', 'Aether', 'Chronos', 'Tiamat'];
    const suffixes = ['', 'os', 'is', 'us', 'or', 'ar'];
    if (this.random.bool(0.6)) {
      return this.random.choice(prefixes);
    }
    return this.random.choice(prefixes) + this.random.choice(suffixes);
  }

  generateFirstBeings() {
    const count = this.random.int(2, 6);
    const beings = [];

    for (let i = 0; i < count; i++) {
      beings.push({
        name: this.generateMythicName(),
        nature: this.random.choice([
          'titan of chaos',
          'primordial dragon',
          'cosmic giant',
          'elemental force',
          'first god',
          'abstract concept made manifest'
        ]),
        fate: this.random.choice([
          'destroyed in creation',
          'sleeping beneath the world',
          'transformed into natural features',
          'became the gods',
          'still exists beyond mortal ken',
          'waiting to return'
        ])
      });
    }

    return beings;
  }

  generateHumanOrigin() {
    return this.random.choice([
      'shaped from clay by divine hands',
      'descended from the gods themselves',
      'emerged from the bones of titans',
      'grew like plants from sacred soil',
      'refugees from a destroyed realm',
      'created to serve the gods',
      'born from divine tears or blood',
      'the dreams of sleeping gods made real'
    ]);
  }

  generateHeroes(culture) {
    const heroCount = this.random.int(3, 8);
    const heroes = [];

    for (let i = 0; i < heroCount; i++) {
      heroes.push({
        name: this.generateHeroName(),
        epithet: this.generateHeroEpithet(),
        origin: this.random.choice([
          'divine parentage',
          'humble birth',
          'royal lineage',
          'mysterious appearance',
          'prophesied arrival',
          'cursed bloodline'
        ]),
        deeds: this.generateHeroicDeeds(),
        companions: this.random.int(0, 7),
        fate: this.generateHeroFate(),
        legacy: this.random.choice([
          'founded a dynasty',
          'became a constellation',
          'deified after death',
          'tragic warning tale',
          'inspiring legend',
          'cautionary example'
        ]),
        historicalBasis: this.random.weighted([
          { value: 'entirely mythical', weight: 3 },
          { value: 'based on real person', weight: 2 },
          { value: 'composite of several figures', weight: 2 },
          { value: 'debated by scholars', weight: 1 }
        ])
      });
    }

    return heroes;
  }

  generateHeroName() {
    const prefixes = ['Ael', 'Mor', 'Thal', 'Kor', 'Var', 'Syl', 'Dra', 'Bel'];
    const suffixes = ['dor', 'wen', 'mir', 'ath', 'ion', 'ara', 'eon', 'is'];
    return this.random.choice(prefixes) + this.random.choice(suffixes);
  }

  generateHeroEpithet() {
    const adjectives = ['Wise', 'Bold', 'Swift', 'Strong', 'Cunning', 'Valiant', 'Doomed', 'Blessed'];
    const nouns = ['heart', 'hand', 'blade', 'eye', 'voice', 'soul', 'flame'];
    return `the ${this.random.choice(adjectives)}-${this.random.choice(nouns)}`;
  }

  generateHeroicDeeds() {
    return this.random.sample([
      'slew a terrible monster',
      'retrieved a sacred artifact',
      'solved an impossible riddle',
      'journey to the underworld',
      'founded a great city',
      'united warring tribes',
      'defeated an army single-handedly',
      'won the love of a deity',
      'discovered a lost land',
      'broke a terrible curse',
      'tamed a legendary beast',
      'taught humanity crucial skills'
    ], this.random.int(2, 5));
  }

  generateHeroFate() {
    return this.random.weighted([
      { value: 'glorious death in battle', weight: 3 },
      { value: 'mysterious disappearance', weight: 2 },
      { value: 'betrayal by close companion', weight: 2 },
      { value: 'immortalized by gods', weight: 2 },
      { value: 'died of old age, mourned by all', weight: 1 },
      { value: 'transformed into natural feature', weight: 1 },
      { value: 'cursed to eternal wandering', weight: 1 },
      { value: 'merged with divine essence', weight: 1 }
    ]);
  }

  generateMonsters(culture) {
    const monsterCount = this.random.int(4, 10);
    const monsters = [];

    for (let i = 0; i < monsterCount; i++) {
      monsters.push({
        name: this.generateMonsterName(),
        form: this.generateMonsterForm(),
        origin: this.random.choice([
          'spawn of chaos',
          'divine punishment',
          'failed creation',
          'corrupted natural creature',
          'curse made manifest',
          'guardian of sacred place',
          'from beyond the world'
        ]),
        powers: this.generateMonsterPowers(),
        weakness: this.random.choice([
          'specific weapon or artifact',
          'time of day or year',
          'particular ritual',
          'clever wordplay',
          'pure innocence',
          'none known',
          'their own pride'
        ]),
        status: this.random.weighted([
          { value: 'slain by hero', weight: 3 },
          { value: 'still terrorizes region', weight: 2 },
          { value: 'imprisoned or bound', weight: 2 },
          { value: 'transformed or redeemed', weight: 1 },
          { value: 'sleeping/dormant', weight: 1 }
        ]),
        symbolism: this.random.choice([
          'embodiment of chaos',
          'test of heroic worth',
          'nature\'s vengeance',
          'divine justice',
          'human fears manifest',
          'guardian of boundaries'
        ])
      });
    }

    return monsters;
  }

  generateMonsterName() {
    const prefixes = ['Ghor', 'Nyx', 'Mal', 'Drak', 'Vor', 'Zal', 'Kraz', 'Thox'];
    const suffixes = ['oth', 'ax', 'ul', 'enn', 'ok', 'ith', 'ung', 'or'];
    return this.random.choice(prefixes) + this.random.choice(suffixes);
  }

  generateMonsterForm() {
    return this.random.choice([
      'serpentine dragon with many heads',
      'gigantic humanoid of stone or metal',
      'chimeric beast of mixed animals',
      'shapeshifter of many forms',
      'shadow or darkness incarnate',
      'massive predator of legendary size',
      'swarm of countless lesser creatures',
      'beautiful but deadly seducer',
      'walking corpse or undead thing',
      'elemental force given terrible shape'
    ]);
  }

  generateMonsterPowers() {
    return this.random.sample([
      'immense strength',
      'magical immunity',
      'regeneration',
      'petrifying gaze',
      'poisonous breath',
      'mind control',
      'weather manipulation',
      'dimensional travel',
      'life draining',
      'reality warping',
      'disease spreading',
      'immortality'
    ], this.random.int(2, 4));
  }

  generateArtifacts(culture) {
    const artifactCount = this.random.int(3, 8);
    const artifacts = [];

    for (let i = 0; i < artifactCount; i++) {
      artifacts.push({
        name: this.generateArtifactName(),
        type: this.random.choice([
          'weapon',
          'armor',
          'crown or regalia',
          'book or scroll',
          'gem or jewel',
          'musical instrument',
          'tool or implement',
          'vessel or container'
        ]),
        creator: this.random.choice([
          'the gods themselves',
          'legendary craftsman',
          'unknown ancient civilization',
          'heroic figure',
          'dark sorcerer',
          'nature spirits',
          'first beings'
        ]),
        powers: this.generateArtifactPowers(),
        curse: this.random.bool(0.4) ? this.generateArtifactCurse() : null,
        location: this.random.weighted([
          { value: 'lost to history', weight: 3 },
          { value: 'held by rulers', weight: 2 },
          { value: 'in sacred temple', weight: 2 },
          { value: 'guarded by monster', weight: 2 },
          { value: 'hidden by hero', weight: 1 },
          { value: 'destroyed', weight: 1 }
        ]),
        prophecy: this.random.bool(0.5) ? this.generateArtifactProphecy() : null
      });
    }

    return artifacts;
  }

  generateArtifactName() {
    const adjectives = ['Eternal', 'Blazing', 'Frozen', 'Singing', 'Weeping', 'Dancing', 'Shadow', 'Radiant'];
    const nouns = ['Blade', 'Crown', 'Tome', 'Chalice', 'Staff', 'Shield', 'Harp', 'Mirror'];
    return `The ${this.random.choice(adjectives)} ${this.random.choice(nouns)}`;
  }

  generateArtifactPowers() {
    return this.random.sample([
      'grants great strength',
      'bestows wisdom',
      'protects from harm',
      'controls elements',
      'reveals truth',
      'heals all wounds',
      'command over beasts',
      'dimensional travel',
      'immortality',
      'prophetic visions',
      'perfect luck',
      'irresistible command'
    ], this.random.int(1, 3));
  }

  generateArtifactCurse() {
    return this.random.choice([
      'corrupts wielder over time',
      'demands blood sacrifice',
      'brings ruin to bearer\'s loved ones',
      'cannot be discarded once claimed',
      'drives wielder to madness',
      'attracts terrible enemies',
      'steals wielder\'s mortality',
      'demands completion of impossible task'
    ]);
  }

  generateArtifactProphecy() {
    return this.random.choice([
      'will be found when world needs it most',
      'only the pure of heart may wield it',
      'its use will trigger the end times',
      'will reunite when scattered pieces found',
      'will be wielded by prophesied hero',
      'must be destroyed to save the world'
    ]);
  }

  generateProphecies(culture) {
    const prophecyCount = this.random.int(2, 6);
    const prophecies = [];

    for (let i = 0; i < prophecyCount; i++) {
      prophecies.push({
        name: this.generateProphecyName(),
        origin: this.random.choice([
          'ancient oracle',
          'dying god\'s words',
          'vision of prophet',
          'ancient text',
          'recurring dream',
          'astronomical portent'
        ]),
        prediction: this.generatePrediction(),
        interpretation: this.random.choice([
          'hotly debated',
          'seemingly clear',
          'deliberately obscure',
          'multiple readings possible',
          'thought fulfilled',
          'awaited fearfully'
        ]),
        fulfillment: this.random.weighted([
          { value: 'not yet', weight: 4 },
          { value: 'partially fulfilled', weight: 2 },
          { value: 'completely fulfilled', weight: 1 },
          { value: 'misinterpreted', weight: 1 },
          { value: 'self-fulfilling', weight: 1 }
        ]),
        significance: this.random.choice([
          'defines cultural worldview',
          'drives political decisions',
          'feared by many',
          'dismissed by skeptics',
          'secret known to few',
          'celebrated annually'
        ])
      });
    }

    return prophecies;
  }

  generateProphecyName() {
    return this.random.choice([
      'The Prophecy of',
      'The Vision of',
      'The Oracle of',
      'The Foretelling of'
    ]) + ' ' + this.random.choice([
      'the End Times',
      'the Chosen One',
      'the Seven Signs',
      'the Broken Crown',
      'the Returning King',
      'the Final Battle',
      'the Great Awakening',
      'the Twilight Age'
    ]);
  }

  generatePrediction() {
    return this.random.choice([
      'A child born under specific signs will unite/destroy the world',
      'Ancient evil will return when certain conditions met',
      'The gods will return to walk among mortals',
      'A great cataclysm will reshape the world',
      'True heir will reclaim their rightful throne',
      'Seven heroes will arise to face ultimate darkness',
      'The veil between worlds will tear',
      'All magic will fail or return',
      'The dead will rise and walk again',
      'A golden age will dawn after greatest darkness'
    ]);
  }

  generateSacredPlaces(culture) {
    const placeCount = this.random.int(3, 7);
    const places = [];

    for (let i = 0; i < placeCount; i++) {
      const continent = this.random.choice(this.geography.continents);
      const region = this.random.choice(continent.regions);

      places.push({
        name: this.generateSacredPlaceName(),
        location: region.name,
        type: this.random.choice([
          'temple complex',
          'natural formation',
          'ancient ruins',
          'sacred grove',
          'holy mountain',
          'blessed spring',
          'mystical cave',
          'standing stones'
        ]),
        significance: this.generatePlaceSignificance(),
        access: this.random.choice([
          'open to all pilgrims',
          'restricted to clergy',
          'requires ritual purification',
          'only at specific times',
          'forbidden to enter',
          'location lost to time'
        ]),
        phenomena: this.random.sample([
          'miraculous healings',
          'prophetic visions',
          'strange lights',
          'time distortions',
          'gravity anomalies',
          'ghostly apparitions',
          'perfect acoustics',
          'eternal flames'
        ], this.random.int(1, 3))
      });
    }

    return places;
  }

  generateSacredPlaceName() {
    const adjectives = ['Holy', 'Sacred', 'Blessed', 'Eternal', 'Ancient', 'Divine'];
    const places = ['Mount', 'Grove', 'Well', 'Stone', 'Temple', 'Cave', 'Isle'];
    return this.random.choice(adjectives) + ' ' + this.random.choice(places) + ' of ' +
           this.random.choice(['the Sun', 'Ancestors', 'Whispers', 'Stars', 'Beginning']);
  }

  generatePlaceSignificance() {
    return this.random.choice([
      'where the gods first touched the earth',
      'site of miraculous event',
      'gateway to otherworld',
      'burial place of heroes/gods',
      'where creation began',
      'nexus of magical power',
      'site of prophetic visions',
      'where prayers are always answered'
    ]);
  }

  generateDetailedPantheon(culture) {
    return culture.religion.pantheon.map(god => ({
      ...god,
      name: this.generateGodName(),
      titles: this.generateGodTitles(god.domain),
      myths: this.generateGodMyths(god.domain),
      symbols: this.generateGodSymbols(god.domain),
      followers: this.generateFollowerProfile(god.domain)
    }));
  }

  generateAlternativeBeings(culture) {
    return {
      type: culture.religion.type,
      beings: this.random.sample([
        'ancestral spirits',
        'nature forces',
        'cosmic principles',
        'enlightened teachers',
        'divine manifestations',
        'sacred animals'
      ], this.random.int(2, 4))
    };
  }

  generateGodName() {
    const prefixes = ['Ael', 'Mor', 'Thal', 'Val', 'Sil', 'Nox', 'Lux', 'Ver'];
    const suffixes = ['ion', 'ara', 'eth', 'os', 'wen', 'dor', 'is', 'en'];
    return this.random.choice(prefixes) + this.random.choice(suffixes);
  }

  generateGodTitles(domain) {
    const titleMap = {
      war: ['Lord of Battle', 'Bringer of Victory', 'Shield of the Righteous'],
      wisdom: ['Keeper of Knowledge', 'All-Seeing', 'Master of Secrets'],
      agriculture: ['Provider', 'Grain Mother', 'Harvest Lord'],
      death: ['Soul Keeper', 'Judge of the Dead', 'Eternal Rest'],
      love: ['Heart Desire', 'Passion Flame', 'Union Maker']
    };

    return this.random.sample(
      titleMap[domain] || ['The Divine', 'The Eternal', 'The Sacred'],
      this.random.int(1, 2)
    );
  }

  generateGodMyths(domain) {
    return this.random.sample([
      'created humanity',
      'fought primordial monster',
      'descended to underworld',
      'gave sacred gift to mortals',
      'had tragic love affair',
      'rebelled against other gods',
      'sacrificed for greater good',
      'transformed into constellation'
    ], this.random.int(2, 4));
  }

  generateGodSymbols(domain) {
    return this.random.sample([
      'sacred animal',
      'particular flower',
      'geometric shape',
      'celestial body',
      'natural phenomenon',
      'specific color',
      'ritual object',
      'mythical creature'
    ], this.random.int(2, 3));
  }

  generateFollowerProfile(domain) {
    return {
      primaryFollowers: this.random.choice([
        'warriors',
        'farmers',
        'scholars',
        'artisans',
        'rulers',
        'merchants',
        'healers',
        'all people'
      ]),
      offerings: this.random.sample([
        'animal sacrifice',
        'grain and bread',
        'wine and oil',
        'prayers and songs',
        'crafted items',
        'flowers and incense',
        'precious metals',
        'personal vows'
      ], this.random.int(2, 3))
    };
  }

  generateSharedMyths() {
    return {
      deluge: this.random.bool(0.6) ? this.generateFloodMyth() : null,
      goldenAge: this.random.bool(0.7) ? this.generateGoldenAge() : null,
      apocalypse: this.random.bool(0.5) ? this.generateApocalypse() : null
    };
  }

  generateFloodMyth() {
    return {
      cause: this.random.choice([
        'divine punishment',
        'primordial chaos returning',
        'tears of the gods',
        'broken cosmic dam',
        'sleeping god awakening'
      ]),
      survivors: this.random.choice([
        'single family in ark',
        'those who climbed highest mountain',
        'those warned by dream',
        'the righteous selected by gods',
        'none - new creation followed'
      ]),
      aftermath: this.random.choice([
        'covenant with divine',
        'rainbow as promise',
        'new world order',
        'loss of ancient knowledge',
        'shorter lifespans'
      ]),
      variations: 'Different cultures tell this story with local details'
    };
  }

  generateGoldenAge() {
    return {
      period: 'A legendary past age of perfection',
      characteristics: this.random.sample([
        'no death or disease',
        'perpetual spring',
        'gods walked with mortals',
        'no need to labor',
        'universal peace',
        'magical abundance',
        'perfect virtue'
      ], this.random.int(3, 5)),
      ending: this.random.choice([
        'gradual decline through ages',
        'catastrophic fall',
        'theft of sacred knowledge',
        'divine abandonment',
        'mortals\' hubris',
        'unstoppable cycle'
      ]),
      hope: this.random.bool() ? 'Prophecies speak of its return' : 'Lost forever as warning'
    };
  }

  generateApocalypse() {
    return {
      name: this.generateProphecyName(),
      triggers: this.random.sample([
        'breaking of divine seals',
        'death of all gods',
        'extinguishing of sacred flame',
        'corruption of world tree',
        'return of primordial chaos',
        'fulfillment of ancient curse',
        'heavens falling to earth'
      ], this.random.int(2, 4)),
      signs: this.random.sample([
        'stars falling from sky',
        'seas turning to blood',
        'dead rising',
        'eternal night',
        'mountains crumbling',
        'universal madness',
        'appearance of omen beasts'
      ], this.random.int(3, 6)),
      outcome: this.random.weighted([
        { value: 'total destruction', weight: 2 },
        { value: 'cyclic renewal', weight: 2 },
        { value: 'transformation', weight: 2 },
        { value: 'can be prevented', weight: 1 },
        { value: 'already happened', weight: 1 }
      ])
    };
  }

  generateCosmology() {
    return {
      structure: this.random.choice([
        'flat earth beneath dome sky',
        'spherical world in void',
        'world tree connecting realms',
        'world ocean with land islands',
        'layers of reality stacked',
        'world as divine body',
        'reality as dream of god'
      ]),
      realms: this.generateCosmicRealms(),
      celestialBodies: this.generateCelestialMythology(),
      afterlife: this.generateAfterlifeRealms()
    };
  }

  generateCosmicRealms() {
    const realmCount = this.random.int(3, 9);
    const realms = ['mortal world'];

    for (let i = 1; i < realmCount; i++) {
      realms.push(this.random.choice([
        'heaven of the gods',
        'underworld of dead',
        'realm of spirits',
        'elemental plane',
        'dream world',
        'chaos beyond',
        'primordial void',
        'paradise garden',
        'shadow realm'
      ]));
    }

    return {
      count: realmCount,
      realms,
      connections: this.random.choice([
        'sealed from each other',
        'connected by world tree',
        'accessible through rituals',
        'occasionally overlap',
        'dreams allow travel',
        'sacred places as gateways'
      ])
    };
  }

  generateCelestialMythology() {
    return {
      sun: {
        nature: this.random.choice([
          'chariot of god',
          'eye of creator',
          'sacred fire',
          'divine being',
          'battling darkness daily'
        ]),
        deity: this.random.bool()
      },
      moon: {
        nature: this.random.choice([
          'partner of sun',
          'realm of dead',
          'eye of night god',
          'reflection of hidden truth',
          'gateway to dreams'
        ]),
        phases: this.random.choice([
          'birth, life, death cycle',
          'divine moods',
          'cosmic battle',
          'measuring time'
        ])
      },
      stars: this.random.choice([
        'souls of heroes',
        'eyes of gods',
        'holes in reality',
        'distant worlds',
        'divine script',
        'eternal fires'
      ]),
      constellations: this.random.int(8, 20) + ' recognized patterns telling sacred stories'
    };
  }

  generateAfterlifeRealms() {
    const hasMultiple = this.random.bool(0.6);

    if (!hasMultiple) {
      return {
        type: 'single destination',
        realm: this.random.choice([
          'peaceful paradise',
          'shadowy existence',
          'reunion with ancestors',
          'merger with divine',
          'ceases to exist'
        ])
      };
    }

    return {
      type: 'multiple destinations',
      criteria: this.random.choice([
        'based on deeds in life',
        'based on manner of death',
        'based on social status',
        'based on burial rites',
        'seemingly arbitrary'
      ]),
      destinations: this.random.sample([
        'paradise for virtuous',
        'punishment for wicked',
        'neutral resting place',
        'reincarnation cycle',
        'warrior hall',
        'scholar library',
        'void of forgetting',
        'fields of eternal harvest'
      ], this.random.int(2, 4))
    };
  }
}
