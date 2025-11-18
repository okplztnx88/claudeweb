import { RandomGenerator } from '../utils/random.js';
import { GeographyGenerator } from './geography.js';
import { CultureGenerator } from './culture.js';
import { LanguageGenerator } from './language.js';
import { HistoryGenerator } from './history.js';
import { MythologyGenerator } from './mythology.js';

export class WorldGenerator {
  constructor(seed = Date.now()) {
    this.seed = seed;
    this.random = new RandomGenerator(seed);
  }

  generate() {
    console.log('🌍 Generating world with seed:', this.seed);

    // Step 1: Generate geography
    console.log('  ⛰️  Generating geography and climate...');
    const geographyGen = new GeographyGenerator(this.random);
    const geography = geographyGen.generate();

    // Step 2: Generate cultures
    console.log('  👥 Creating cultures and civilizations...');
    const cultureGen = new CultureGenerator(this.random, geography);
    const cultures = cultureGen.generate();

    // Step 3: Generate languages
    console.log('  🗣️  Developing language systems...');
    const languageGen = new LanguageGenerator(this.random);
    const languages = cultures.map(culture => languageGen.generate(culture));

    // Update culture language references
    cultures.forEach((culture, index) => {
      culture.language = languages[index];
    });

    // Step 4: Generate history
    console.log('  📜 Crafting historical timeline...');
    const historyGen = new HistoryGenerator(this.random, geography, cultures);
    const history = historyGen.generate();

    // Step 5: Generate mythology
    console.log('  ✨ Weaving mythologies and beliefs...');
    const mythologyGen = new MythologyGenerator(this.random, geography, cultures);
    const mythology = mythologyGen.generate();

    // Step 6: Create world summary
    console.log('  📝 Compiling world data...');
    const world = {
      metadata: {
        seed: this.seed,
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      },
      name: geography.name,
      geography,
      cultures,
      languages,
      history,
      mythology,
      statistics: this.generateStatistics(geography, cultures, history, mythology)
    };

    console.log('✅ World generation complete!');
    console.log(`   📍 World Name: ${geography.name}`);
    console.log(`   🌏 Continents: ${geography.continents.length}`);
    console.log(`   👥 Cultures: ${cultures.length}`);
    console.log(`   🗣️  Languages: ${languages.length}`);
    console.log(`   📜 Historical Events: ${history.majorEvents.length}`);
    console.log(`   ⚔️  Conflicts: ${history.conflicts.length}`);

    return world;
  }

  generateStatistics(geography, cultures, history, mythology) {
    return {
      geography: {
        continentCount: geography.continents.length,
        oceanCount: geography.oceans.length,
        naturalWonders: geography.naturalWonders.length,
        resources: geography.resources.length
      },
      cultures: {
        total: cultures.length,
        governmentTypes: this.countBy(cultures, c => c.government.type),
        religiousTypes: this.countBy(cultures, c => c.religion.type),
        technologyEras: this.countBy(cultures, c => c.technology.era),
        populationSizes: this.countBy(cultures, c => c.population.size)
      },
      languages: {
        total: cultures.length,
        withWriting: cultures.filter(c => c.language.writing.type !== 'oral tradition only').length,
        withTones: cultures.filter(c => c.language.phonology.tone?.present).length
      },
      history: {
        eras: history.eras.length,
        majorEvents: history.majorEvents.length,
        conflicts: history.conflicts.length,
        alliances: history.alliances.length,
        discoveries: history.discoveries.length,
        currentYear: history.timeline.currentYear
      },
      mythology: {
        totalHeroes: mythology.culturalMythologies.reduce((sum, m) => sum + m.heroes.length, 0),
        totalMonsters: mythology.culturalMythologies.reduce((sum, m) => sum + m.monsters.length, 0),
        totalArtifacts: mythology.culturalMythologies.reduce((sum, m) => sum + m.artifacts.length, 0),
        totalProphecies: mythology.culturalMythologies.reduce((sum, m) => sum + m.prophecies.length, 0),
        cosmicRealms: mythology.cosmology.realms.count
      }
    };
  }

  countBy(array, keyFn) {
    const counts = {};
    array.forEach(item => {
      const key = keyFn(item);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }
}
