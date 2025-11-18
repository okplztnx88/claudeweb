export class HistoryGenerator {
  constructor(random, geography, cultures) {
    this.random = random;
    this.geography = geography;
    this.cultures = cultures;
  }

  generate() {
    const timeline = this.generateTimeline();
    const eras = this.generateEras();
    const majorEvents = this.generateMajorEvents(eras);
    const conflicts = this.generateConflicts();
    const alliances = this.generateAlliances();
    const discoveries = this.generateDiscoveries();

    return {
      timeline,
      eras,
      majorEvents,
      conflicts,
      alliances,
      discoveries,
      currentAge: this.getCurrentAge(eras)
    };
  }

  generateTimeline() {
    const currentYear = this.random.int(1000, 5000);
    return {
      currentYear,
      calendar: this.generateCalendar(),
      epochStart: this.random.choice([
        'mythical creation',
        'founding of first city',
        'great cataclysm',
        'divine revelation',
        'unknown origin'
      ])
    };
  }

  generateCalendar() {
    const daysInYear = this.random.int(300, 400);
    const monthCount = this.random.int(10, 15);

    return {
      daysInYear,
      monthCount,
      daysInMonth: Math.floor(daysInYear / monthCount),
      weeks: this.random.bool(0.7) ? {
        daysInWeek: this.random.choice([5, 6, 7, 8, 10]),
        named: true
      } : null,
      leapYears: this.random.bool(0.6)
    };
  }

  generateEras() {
    const eraCount = this.random.int(4, 8);
    const eras = [];
    const totalHistory = this.generateTimeline().currentYear;
    let yearsSoFar = 0;

    for (let i = 0; i < eraCount; i++) {
      const duration = i === eraCount - 1 ?
        totalHistory - yearsSoFar :
        this.random.int(100, 800);

      eras.push({
        name: this.generateEraName(),
        startYear: yearsSoFar,
        endYear: yearsSoFar + duration,
        duration: duration + ' years',
        characteristics: this.generateEraCharacteristics(),
        dominantCultures: this.random.sample(
          this.cultures.map(c => c.name),
          this.random.int(1, 3)
        ),
        keyDevelopments: this.generateKeyDevelopments()
      });

      yearsSoFar += duration;
    }

    return eras;
  }

  generateEraName() {
    const prefixes = ['Age of', 'Era of', 'Time of', 'Period of'];
    const subjects = [
      'Heroes', 'Kings', 'Gods', 'Chaos', 'Peace', 'War',
      'Discovery', 'Darkness', 'Enlightenment', 'Conquest',
      'Legends', 'Strife', 'Unity', 'Awakening', 'Twilight'
    ];

    return this.random.choice(prefixes) + ' ' + this.random.choice(subjects);
  }

  generateEraCharacteristics() {
    return this.random.sample([
      'widespread warfare',
      'cultural flowering',
      'technological advancement',
      'religious fervor',
      'political fragmentation',
      'unification movements',
      'trade expansion',
      'population growth',
      'natural disasters',
      'magical proliferation',
      'dark age',
      'renaissance'
    ], this.random.int(2, 4));
  }

  generateKeyDevelopments() {
    return this.random.sample([
      'invention of writing',
      'development of metallurgy',
      'rise of城city-states',
      'formation of empires',
      'religious schisms',
      'major migrations',
      'plague or famine',
      'discovery of new lands',
      'architectural innovations',
      'philosophical movements',
      'legal codification',
      'monetary systems'
    ], this.random.int(2, 4));
  }

  generateMajorEvents(eras) {
    const eventCount = this.random.int(15, 30);
    const events = [];

    for (let i = 0; i < eventCount; i++) {
      const era = this.random.choice(eras);
      const year = this.random.int(era.startYear, era.endYear);

      events.push({
        year,
        era: era.name,
        name: this.generateEventName(),
        type: this.random.choice([
          'battle',
          'founding',
          'disaster',
          'discovery',
          'assassination',
          'coronation',
          'treaty',
          'rebellion',
          'plague',
          'miracle',
          'invention'
        ]),
        description: this.generateEventDescription(),
        participants: this.random.sample(this.cultures.map(c => c.name), this.random.int(1, 3)),
        impact: this.random.choice(['minor', 'moderate', 'significant', 'transformative', 'world-changing']),
        consequences: this.generateConsequences()
      });
    }

    return events.sort((a, b) => a.year - b.year);
  }

  generateEventName() {
    const eventTypes = {
      battle: ['Battle of', 'Siege of', 'War of', 'Campaign of'],
      founding: ['Founding of', 'Establishment of', 'Creation of'],
      disaster: ['The Great', 'The Terrible', 'The Cataclysmic'],
      discovery: ['Discovery of', 'Finding of', 'Revelation of'],
      assassination: ['Death of', 'Murder of', 'Fall of'],
      coronation: ['Crowning of', 'Ascension of', 'Rise of'],
      treaty: ['Treaty of', 'Pact of', 'Alliance of'],
      rebellion: ['Revolt of', 'Uprising of', 'Rebellion of'],
      plague: ['The Great Plague', 'The Sweating Death', 'The Red Death'],
      miracle: ['The Miracle at', 'The Divine Event of', 'The Wonder of'],
      invention: ['Invention of', 'Creation of', 'Development of']
    };

    const places = ['Red Bridge', 'Five Rivers', 'Sacred Mount', 'Iron Gate', 'Crystal Shore'];
    const things = ['the Flame', 'the Sword', 'the Crown', 'the Word', 'the Path'];

    const type = this.random.choice(Object.keys(eventTypes));
    const prefix = this.random.choice(eventTypes[type]);

    return prefix + ' ' + this.random.choice([...places, ...things]);
  }

  generateEventDescription() {
    const descriptions = [
      'A pivotal moment that reshaped the political landscape',
      'An event whose consequences echo through the ages',
      'A turning point in the course of civilization',
      'A tragedy that united former enemies',
      'A triumph celebrated for generations',
      'A mysterious occurrence whose true nature remains debated',
      'A disaster from which the world slowly recovered',
      'An innovation that changed daily life forever'
    ];

    return this.random.choice(descriptions);
  }

  generateConsequences() {
    return this.random.sample([
      'shift in power balance',
      'cultural exchange',
      'technological spread',
      'religious reformation',
      'territorial changes',
      'economic boom or collapse',
      'population migration',
      'alliance formation',
      'dynasty ended',
      'new tradition established',
      'loss of knowledge',
      'awakening of something ancient'
    ], this.random.int(2, 4));
  }

  generateConflicts() {
    const conflictCount = this.random.int(8, 15);
    const conflicts = [];

    for (let i = 0; i < conflictCount; i++) {
      const participants = this.random.sample(this.cultures, this.random.int(2, 4));

      conflicts.push({
        name: this.generateConflictName(),
        participants: participants.map(c => c.name),
        cause: this.random.choice([
          'territorial dispute',
          'religious differences',
          'resource scarcity',
          'dynastic succession',
          'trade disagreement',
          'historical grievances',
          'ideological clash',
          'broken treaty',
          'assassination of diplomat',
          'prophecy or omen'
        ]),
        duration: this.random.int(1, 50) + ' years',
        casualties: this.random.choice(['minimal', 'moderate', 'heavy', 'devastating', 'near-genocidal']),
        outcome: this.generateConflictOutcome(participants),
        legacy: this.generateConflictLegacy()
      });
    }

    return conflicts;
  }

  generateConflictName() {
    const patterns = [
      'The War of',
      'The Conflict of',
      'The Struggle for'
    ];
    const subjects = [
      'Succession',
      'the Sacred Flame',
      'the Northern Marches',
      'Three Kingdoms',
      'the Prophet',
      'the Broken Crown',
      'the Seven Years',
      'the Divine Right'
    ];

    return this.random.choice(patterns) + ' ' + this.random.choice(subjects);
  }

  generateConflictOutcome(participants) {
    const winner = this.random.choice(participants);
    const outcomeType = this.random.weighted([
      { value: 'decisive victory', weight: 2 },
      { value: 'negotiated peace', weight: 3 },
      { value: 'stalemate', weight: 2 },
      { value: 'mutual exhaustion', weight: 2 },
      { value: 'intervention by third party', weight: 1 }
    ]);

    return {
      type: outcomeType,
      victor: outcomeType === 'decisive victory' ? winner.name : null,
      territories: this.random.choice([
        'significant territorial changes',
        'minor border adjustments',
        'status quo maintained',
        'partition of disputed land'
      ]),
      reparations: this.random.bool(0.4)
    };
  }

  generateConflictLegacy() {
    return this.random.sample([
      'lasting enmity between peoples',
      'cultural exchange and integration',
      'military innovations adopted',
      'commemorated in art and song',
      'taboo subject rarely discussed',
      'annual remembrance ceremonies',
      'buffer zones established',
      'refugees created new communities',
      'war crimes still remembered',
      'heroic tales passed down'
    ], this.random.int(2, 3));
  }

  generateAlliances() {
    const allianceCount = this.random.int(5, 10);
    const alliances = [];

    for (let i = 0; i < allianceCount; i++) {
      const members = this.random.sample(this.cultures, this.random.int(2, 4));

      alliances.push({
        name: this.generateAllianceName(members),
        members: members.map(c => c.name),
        formed: this.random.int(0, this.generateTimeline().currentYear) + ' years ago',
        purpose: this.random.choice([
          'mutual defense',
          'trade cooperation',
          'religious unity',
          'against common enemy',
          'cultural preservation',
          'resource sharing',
          'technological exchange',
          'dynastic marriage ties'
        ]),
        strength: this.random.choice(['fragile', 'stable', 'strong', 'unbreakable']),
        status: this.random.weighted([
          { value: 'active', weight: 4 },
          { value: 'strained', weight: 2 },
          { value: 'dissolved', weight: 1 },
          { value: 'dormant but official', weight: 1 }
        ]),
        achievements: this.generateAllianceAchievements()
      });
    }

    return alliances;
  }

  generateAllianceName(members) {
    if (this.random.bool(0.5)) {
      return `The ${this.random.choice(['Grand', 'Sacred', 'Eternal', 'Golden'])} ${this.random.choice(['Alliance', 'Compact', 'Pact', 'League', 'Union'])}`;
    } else {
      return `${members[0].name}-${members[1].name} ${this.random.choice(['Accord', 'Treaty', 'Partnership'])}`;
    }
  }

  generateAllianceAchievements() {
    return this.random.sample([
      'repelled common enemy',
      'established trade routes',
      'built joint infrastructure',
      'created unified legal code',
      'shared technological advances',
      'prevented famines through cooperation',
      'jointly explored new territories',
      'established common currency',
      'built defensive fortifications',
      'sponsored artistic endeavors'
    ], this.random.int(2, 4));
  }

  generateDiscoveries() {
    const discoveryCount = this.random.int(8, 15);
    const discoveries = [];

    for (let i = 0; i < discoveryCount; i++) {
      const discoverer = this.random.choice(this.cultures);

      discoveries.push({
        name: this.generateDiscoveryName(),
        discoveredBy: discoverer.name,
        year: this.random.int(0, this.generateTimeline().currentYear),
        type: this.random.choice([
          'technological',
          'geographical',
          'medical',
          'agricultural',
          'astronomical',
          'mathematical',
          'magical',
          'architectural',
          'metallurgical',
          'philosophical'
        ]),
        impact: this.random.choice([
          'revolutionized society',
          'gradual adoption',
          'limited to elite',
          'suppressed by authorities',
          'lost and rediscovered',
          'spread rapidly'
        ]),
        currentStatus: this.random.choice([
          'common knowledge',
          'closely guarded secret',
          'partially understood',
          'forgotten',
          'still being developed',
          'feared and restricted'
        ])
      });
    }

    return discoveries.sort((a, b) => a.year - b.year);
  }

  generateDiscoveryName() {
    const discoveries = [
      'The Wheel',
      'Bronze Working',
      'Crop Rotation',
      'Navigation by Stars',
      'Printing Press',
      'Gunpowder',
      'The Lodestone',
      'Glassmaking',
      'Fermentation',
      'Aqueduct System',
      'The Arch',
      'Paper Making',
      'Vaccines',
      'Zero Concept',
      'Algebra',
      'Astronomy Charts',
      'Magical Resonance',
      'Divine Geometry',
      'Soul Binding',
      'Time Dilation'
    ];

    return this.random.choice(discoveries);
  }

  getCurrentAge(eras) {
    const currentEra = eras[eras.length - 1];
    return {
      name: currentEra.name,
      yearInEra: this.generateTimeline().currentYear - currentEra.startYear,
      characteristics: this.random.sample([
        'relative peace after long conflict',
        'rising tensions',
        'golden age of culture',
        'technological revolution',
        'religious reformation',
        'empire building',
        'age of exploration',
        'decline of old powers',
        'emergence of new ideas',
        'uncertain future'
      ], this.random.int(2, 4))
    };
  }
}
