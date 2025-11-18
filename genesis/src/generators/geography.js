export class GeographyGenerator {
  constructor(random) {
    this.random = random;
  }

  generate() {
    const worldName = this.generateWorldName();
    const continents = this.generateContinents();
    const oceans = this.generateOceans();
    const climate = this.generateClimate();

    return {
      name: worldName,
      continents,
      oceans,
      climate,
      naturalWonders: this.generateNaturalWonders(continents),
      resources: this.generateResources(continents)
    };
  }

  generateWorldName() {
    const prefixes = ['Aether', 'Mundus', 'Terra', 'Gaia', 'Nyx', 'Eos', 'Zephyr'];
    const suffixes = ['ia', 'os', 'um', 'is', 'ara', 'heim', 'garde'];
    return this.random.choice(prefixes) + this.random.choice(suffixes);
  }

  generateContinents() {
    const continentCount = this.random.int(3, 6);
    const continents = [];

    const namePatterns = [
      { prefix: ['Nor', 'Sou', 'Eas', 'Wes'], suffix: ['thara', 'varia', 'tania', 'landia'] },
      { prefix: ['Val', 'Kor', 'Mer', 'Dra'], suffix: ['heim', 'dor', 'win', 'goth'] },
      { prefix: ['Azu', 'Ver', 'Cri', 'Oro'], suffix: ['maya', 'dena', 'sina', 'vana'] }
    ];

    for (let i = 0; i < continentCount; i++) {
      const pattern = this.random.choice(namePatterns);
      const name = this.random.choice(pattern.prefix) + this.random.choice(pattern.suffix);

      continents.push({
        id: `continent_${i}`,
        name,
        size: this.random.choice(['massive', 'large', 'medium', 'archipelago']),
        terrain: this.generateTerrain(),
        climate: this.generateContinentalClimate(),
        regions: this.generateRegions()
      });
    }

    return continents;
  }

  generateTerrain() {
    const terrainTypes = [];
    const possibleTypes = [
      { type: 'mountains', weight: 3 },
      { type: 'plains', weight: 5 },
      { type: 'forests', weight: 4 },
      { type: 'deserts', weight: 2 },
      { type: 'tundra', weight: 2 },
      { type: 'wetlands', weight: 3 },
      { type: 'highlands', weight: 3 },
      { type: 'canyons', weight: 1 },
      { type: 'volcanic', weight: 1 }
    ];

    const typeCount = this.random.int(3, 6);
    for (let i = 0; i < typeCount; i++) {
      const terrain = this.random.weighted(possibleTypes);
      if (!terrainTypes.includes(terrain)) {
        terrainTypes.push({
          type: terrain,
          coverage: this.random.choice(['dominant', 'significant', 'moderate', 'scattered']),
          description: this.describeTerrainFeatures(terrain)
        });
      }
    }

    return terrainTypes;
  }

  describeTerrainFeatures(type) {
    const features = {
      mountains: [
        'jagged peaks that pierce the clouds',
        'ancient ranges worn smooth by time',
        'volcanic mountains with active calderas',
        'snow-capped ranges forming natural barriers'
      ],
      plains: [
        'endless grasslands swaying in the wind',
        'fertile flatlands perfect for agriculture',
        'rolling hills dotted with wildflowers',
        'windswept steppes stretching to the horizon'
      ],
      forests: [
        'dense primordial forests with ancient trees',
        'misty woodlands shrouded in mystery',
        'vibrant jungles teeming with life',
        'sparse woods gradually giving way to plains'
      ],
      deserts: [
        'vast dune seas shifting like ocean waves',
        'rocky badlands carved by wind and time',
        'salt flats glittering under the harsh sun',
        'oasis-dotted wastes hiding ancient secrets'
      ],
      tundra: [
        'frozen wastelands of eternal ice',
        'permafrost plains with hardy vegetation',
        'glacial valleys carved by ancient ice',
        'arctic plains where auroras dance'
      ],
      wetlands: [
        'vast marshes thick with reeds and mist',
        'mangrove forests meeting the sea',
        'peat bogs preserving ancient secrets',
        'river deltas creating a maze of waterways'
      ],
      highlands: [
        'elevated plateaus rising above the clouds',
        'mist-shrouded moors of haunting beauty',
        'rocky highlands carved by ancient glaciers',
        'windswept tablelands of stark grandeur'
      ],
      canyons: [
        'deep gorges revealing layers of history',
        'winding chasms carved by mighty rivers',
        'labyrinthine ravines echoing with mystery',
        'stratified cliffs painted in earth tones'
      ],
      volcanic: [
        'active calderas threatening eruption',
        'obsidian fields from ancient flows',
        'geothermal springs and geysers',
        'volcanic peaks breathing smoke and ash'
      ]
    };

    return this.random.choice(features[type] || ['unremarkable terrain']);
  }

  generateContinentalClimate() {
    return {
      zones: this.random.sample([
        'tropical',
        'subtropical',
        'temperate',
        'continental',
        'polar',
        'mediterranean',
        'oceanic',
        'arid'
      ], this.random.int(2, 4)),
      rainfall: this.random.choice(['abundant', 'moderate', 'sparse', 'seasonal']),
      temperature: this.random.choice(['scorching', 'hot', 'warm', 'mild', 'cool', 'cold', 'frigid']),
      seasons: this.generateSeasons()
    };
  }

  generateSeasons() {
    const seasonCount = this.random.choice([2, 4, 6]);
    const seasons = [];

    const seasonNames = ['Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon', 'Dry Season'];
    const selectedSeasons = this.random.sample(seasonNames, seasonCount);

    for (const season of selectedSeasons) {
      seasons.push({
        name: season,
        duration: this.random.int(60, 120) + ' days',
        characteristics: this.generateSeasonCharacteristics(season)
      });
    }

    return seasons;
  }

  generateSeasonCharacteristics(season) {
    const characteristics = {
      'Spring': ['renewal and growth', 'mild temperatures', 'blooming flora', 'increased rainfall'],
      'Summer': ['peak heat', 'long days', 'abundant harvest', 'occasional storms'],
      'Autumn': ['cooling temperatures', 'harvest season', 'falling leaves', 'crisp air'],
      'Winter': ['cold and frost', 'short days', 'dormancy', 'snow and ice'],
      'Monsoon': ['torrential rains', 'flooding', 'life-giving waters', 'high humidity'],
      'Dry Season': ['scarce rainfall', 'harsh conditions', 'water conservation', 'dust storms']
    };

    return this.random.sample(characteristics[season] || ['variable weather'], this.random.int(2, 4));
  }

  generateRegions() {
    const regionCount = this.random.int(5, 10);
    const regions = [];

    for (let i = 0; i < regionCount; i++) {
      regions.push({
        name: this.generateRegionName(),
        type: this.random.choice(['coastal', 'inland', 'mountainous', 'island', 'peninsula', 'valley']),
        features: this.random.sample([
          'ancient ruins',
          'sacred sites',
          'rich farmland',
          'dense population',
          'wild frontier',
          'trading hub',
          'military stronghold',
          'magical nexus',
          'natural harbor',
          'mineral deposits'
        ], this.random.int(2, 4))
      });
    }

    return regions;
  }

  generateRegionName() {
    const parts = [
      ['North', 'South', 'East', 'West', 'Central'],
      ['reach', 'march', 'lands', 'vale', 'hold', 'coast', 'wood']
    ];

    if (this.random.bool(0.7)) {
      return this.random.choice(parts[0]) + this.random.choice(parts[1]);
    } else {
      const uniqueNames = ['Shadowfen', 'Brightwater', 'Ironwood', 'Goldmeadow', 'Stormwatch',
                          'Silvershore', 'Deepholm', 'Highcrest', 'Thornvale', 'Moonhaven'];
      return this.random.choice(uniqueNames);
    }
  }

  generateOceans() {
    const oceanCount = this.random.int(2, 4);
    const oceans = [];

    const oceanNames = ['Endless', 'Twilight', 'Azure', 'Tempest', 'Frozen', 'Crimson', 'Emerald'];
    const oceanSuffixes = ['Ocean', 'Sea', 'Deep', 'Waters'];

    for (let i = 0; i < oceanCount; i++) {
      oceans.push({
        name: this.random.choice(oceanNames) + ' ' + this.random.choice(oceanSuffixes),
        depth: this.random.choice(['shallow', 'moderate', 'deep', 'abyssal']),
        characteristics: this.random.sample([
          'treacherous currents',
          'rich fishing grounds',
          'mysterious depths',
          'frequent storms',
          'calm waters',
          'bioluminescent life',
          'ancient shipwrecks',
          'sea monsters',
          'underwater ruins',
          'volcanic vents'
        ], this.random.int(3, 5))
      });
    }

    return oceans;
  }

  generateClimate() {
    return {
      globalTemperature: this.random.choice(['ice age', 'cool period', 'moderate', 'warm period', 'hot age']),
      weatherPatterns: this.random.sample([
        'stable and predictable',
        'frequent storms',
        'long droughts',
        'heavy precipitation',
        'extreme seasonal variation',
        'mild year-round',
        'monsoon cycles',
        'unpredictable shifts'
      ], this.random.int(2, 3)),
      magicalInfluence: this.random.bool(0.3) ? {
        present: true,
        effects: this.random.sample([
          'aurora-lit skies',
          'floating islands',
          'impossible weather',
          'time-dilated zones',
          'perpetual twilight regions',
          'gravity anomalies'
        ], this.random.int(1, 3))
      } : { present: false }
    };
  }

  generateNaturalWonders(continents) {
    const wonderCount = this.random.int(5, 10);
    const wonders = [];

    for (let i = 0; i < wonderCount; i++) {
      const continent = this.random.choice(continents);
      wonders.push({
        name: this.generateWonderName(),
        location: {
          continent: continent.name,
          region: this.random.choice(continent.regions).name
        },
        type: this.random.choice([
          'mountain peak',
          'waterfall',
          'canyon',
          'cave system',
          'geological formation',
          'ancient forest',
          'crystal formations',
          'hot springs',
          'ice caverns',
          'floating rock'
        ]),
        significance: this.random.choice([
          'sacred pilgrimage site',
          'source of legends',
          'dangerous and avoided',
          'natural resource',
          'astronomical importance',
          'magical properties'
        ]),
        description: this.generateWonderDescription()
      });
    }

    return wonders;
  }

  generateWonderName() {
    const adjectives = ['Eternal', 'Shattered', 'Weeping', 'Singing', 'Frozen', 'Burning', 'Crystal', 'Shadow'];
    const nouns = ['Spire', 'Falls', 'Chasm', 'Throne', 'Gate', 'Crown', 'Heart', 'Eye'];
    return `The ${this.random.choice(adjectives)} ${this.random.choice(nouns)}`;
  }

  generateWonderDescription() {
    const descriptions = [
      'A breathtaking natural marvel that has inspired awe for generations',
      'An imposing landmark visible from great distances',
      'A mysterious formation whose origins are hotly debated',
      'A place of power where the natural and supernatural intersect',
      'An ancient site predating known civilization',
      'A dangerous but beautiful testament to nature\'s might'
    ];
    return this.random.choice(descriptions);
  }

  generateResources(continents) {
    const resources = [];

    for (const continent of continents) {
      const resourceCount = this.random.int(3, 6);

      for (let i = 0; i < resourceCount; i++) {
        resources.push({
          type: this.random.choice([
            'precious metals',
            'gemstones',
            'rare woods',
            'medicinal herbs',
            'magical crystals',
            'fertile soil',
            'fish and seafood',
            'exotic spices',
            'building stone',
            'coal and minerals'
          ]),
          location: {
            continent: continent.name,
            regions: this.random.sample(continent.regions, this.random.int(1, 3)).map(r => r.name)
          },
          abundance: this.random.choice(['scarce', 'moderate', 'abundant', 'rich']),
          importance: this.random.choice([
            'drives local economy',
            'sought after by traders',
            'strategically valuable',
            'culturally significant',
            'enables unique crafts',
            'source of conflict'
          ])
        });
      }
    }

    return resources;
  }
}
