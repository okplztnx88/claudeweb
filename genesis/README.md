# 🌌 GENESIS - Deep Procedural World Generator

A sophisticated procedural generation system that creates rich, internally consistent fantasy worlds with:

- **Detailed Geography** - continents, oceans, climates, natural wonders, and resources
- **Complex Cultures** - governments, religions, customs, arts, technology levels
- **Unique Languages** - phonology, grammar, writing systems, dialects, and vocabularies
- **Epic History** - eras, major events, conflicts, alliances, and discoveries
- **Rich Mythology** - creation myths, heroes, monsters, artifacts, prophecies, and cosmology

## What Makes Genesis Special

Unlike simple name generators, Genesis creates **emergent complexity** where:
- Geography influences cultures (coastal vs. mountain peoples differ)
- Climate shapes technology and customs
- Historical events create lasting cultural impacts
- Mythologies reflect cultural values and environment
- Languages have realistic linguistic features
- Everything is **internally consistent** and interconnected

## Features

### 🗺️ Geography Generation
- Multiple continents with diverse terrain types
- Realistic climate zones and weather patterns
- Natural wonders and sacred sites
- Resource distribution driving economies

### 👥 Culture Generation
- 5-12 distinct civilizations per world
- Government types (monarchy, theocracy, democracy, etc.)
- Religious systems (polytheistic pantheons, monotheism, animism)
- Social structures, customs, and traditions
- Art, architecture, and cuisine
- Technology levels from stone age to early industrial

### 🗣️ Language Generation
- Realistic phonology with consonants, vowels, tone systems
- Complex grammar (cases, verb systems, word order)
- Writing systems (alphabets, syllabaries, logographs)
- Regional dialects
- Literary traditions
- Sample vocabulary

### 📜 History Generation
- Multi-era timelines spanning thousands of years
- 15-30 major historical events
- Detailed wars and conflicts with causes and consequences
- Political alliances and trade agreements
- Technological and cultural discoveries

### ✨ Mythology Generation
- Creation myths reflecting cultural values
- Legendary heroes with epic deeds
- Terrifying monsters and their symbolism
- Sacred artifacts with powers and curses
- Prophecies and their interpretations
- Detailed cosmology and afterlife beliefs

## Installation

```bash
cd genesis
npm install
```

## Usage

### Generate a World

```bash
npm run generate
```

This creates:
- JSON data file with all world information
- Comprehensive markdown documentation including:
  - Overview and index
  - Geography guide
  - Individual culture profiles
  - Language references
  - Historical timeline
  - Mythology compendium

### Generate with Specific Seed

```bash
npm run generate -- --seed=12345
```

Using the same seed always generates the exact same world, allowing you to:
- Share worlds with others
- Regenerate a world for further exploration
- Create consistent references

## Output Structure

```
generated/
├── world_[seed].json              # Complete world data
└── world_[seed]_docs/             # Markdown documentation
    ├── index.md                   # World overview
    ├── geography.md               # Geographic details
    ├── history.md                 # Historical timeline
    ├── mythology.md               # Myths and beliefs
    ├── culture_[id].md            # Individual culture docs
    └── language_[id].md           # Language references
```

## Example Output

A generated world includes:

```
World: Aetheros
- 5 continents (Norvaria, Shaldor, Azumaya, ...)
- 9 cultures (Aelian, Moronir, Thaldar, ...)
- 9 unique languages with detailed grammars
- 4,237 years of history across 6 eras
- 23 major historical events
- 11 epic conflicts
- 47 legendary heroes
- 62 terrifying monsters
- 38 sacred artifacts
- 25 prophecies
```

## Technical Details

### Generation System

Genesis uses a **seed-based random number generator** ensuring:
- Complete reproducibility
- Deterministic output
- Shareable worlds

### Algorithmic Approach

1. **Geography First** - terrain influences everything
2. **Culture Placement** - geography shapes societies
3. **Language Development** - reflects culture
4. **Historical Evolution** - cultures interact over time
5. **Mythology Weaving** - beliefs emerge from culture and history

### Consistency Mechanisms

- Climate affects agriculture and settlement patterns
- Terrain influences military tactics and architecture
- Resources drive economic systems and conflicts
- Historical events create cultural traditions
- Mythology reflects environmental and social realities

## Use Cases

- **Writers** - Rich worldbuilding for novels, stories, RPG campaigns
- **Game Developers** - Deep lore for games
- **Researchers** - Study emergent complexity in procedural generation
- **Artists** - Inspiration for world-building projects
- **Fun** - Explore fascinating procedural worlds

## Examples of Generated Content

### Sample Culture: The Aelian

- **Government:** Theocratic oligarchy with moderate corruption
- **Religion:** Polytheistic with 7 gods (war, wisdom, harvest...)
- **Values:** Honor, scholarly pursuit, spiritual enlightenment
- **Technology:** Iron age with advanced astronomy
- **Custom:** Coming of age at 16 via spiritual vision quest
- **Architecture:** Stone and marble in elegant, flowing style
- **Famous For:** Intricate metalwork and epic poetry

### Sample Language: Altaic

- **Phonology:** Complex 30+ consonants, 5-vowel system with length
- **Grammar:** SOV word order, ergative-absolutive, 6 cases
- **Writing:** Alphabet (28 characters), right to left, 800 years old
- **Features:** Vowel harmony, extensive kinship terms
- **Dialects:** High, Low, Court, Temple variants

### Sample Historical Event: The Battle of Red Bridge

- **Year:** 2,341 of current era
- **Participants:** Aelian Empire vs. Shaldar Confederacy
- **Impact:** World-changing
- **Consequences:** Shift in power balance, alliance formation, new traditions

## Future Enhancements

- Interactive web viewer
- 3D terrain visualization
- Trade route mapping
- Cultural exchange simulation
- Character generator tied to cultures
- Timeline visualization
- Map generation

## Technical Stack

- **Node.js** - Runtime
- **Pure JavaScript** - No heavy dependencies
- **Seedrandom** - Deterministic RNG
- **Markdown** - Documentation output

## Credits

Created to explore emergent complexity and procedural narrative generation.

Demonstrates how simple rules can create rich, believable worlds with internal consistency.

---

**Seed the universe. Generate infinity.**
