import type { WorldDeck } from './types';

export const CUSTOM_STUDIO_COVER = '/src/assets/images/world_custom_studio_1795241654729.jpg';

export const SEED_WORLDS: WorldDeck[] = [
  {
    id: 'pigeon-union-1889',
    title: 'The Pigeon Union of 1889',
    subtitle: 'Trafalgar Square · Avian Labor Dispute',
    premise:
      'Lead London’s newly unionized street pigeons through a winter of breadcrumb shortages, grumpy constables, and parliamentary scandal.',
    tone: 'Victorian Satire',
    source: 'curated',
    coverImage: '/src/assets/images/world_pigeon_union_1795241654825.jpg',
    meters: [
      {
        id: 'cohesion',
        label: 'Flock Unity',
        icon: 'users',
        lowEndTitle: 'The Great Dispersal',
        lowEndText:
          'Half the union defected to Hyde Park ducks. Your tiny tweed waistcoat hangs solemnly on an empty bench.',
        highEndTitle: 'Unstoppable Flock Hive-Mind',
        highEndText:
          'Three million pigeons synchronize their wingbeats so tightly that London traffic freezes indefinitely. Parliament surrenders.',
      },
      {
        id: 'crumbs',
        label: 'Crumb Reserve',
        icon: 'coins',
        lowEndTitle: 'The Crust Famine',
        lowEndText:
          'Not a single poppy seed remains in the union pantry. Pigeons are forced to eat polite, dry polite-society scones.',
        highEndTitle: 'The Brioche Bubble',
        highEndText:
          'You hoarded so many pastries that Admiral Nelson’s column is structurally buried in butter croissants.',
      },
      {
        id: 'sympathy',
        label: 'Public Sympathy',
        icon: 'heart',
        lowEndTitle: 'Universal Umbrella Ban',
        lowEndText:
          'Citizens now carry spring-loaded umbrellas exclusively to shoo your delegates out of tea gardens.',
        highEndTitle: 'Beloved Feathered Icons',
        highEndText:
          'Every Londoner wears a pigeon lapel pin. The Times prints a daily column solely in coos.',
      },
      {
        id: 'crown',
        label: 'Crown Patience',
        icon: 'crown',
        lowEndTitle: 'Scotland Yard Sweep',
        lowEndText:
          'Constables deployed giant velvet butterfly nets at dawn. Your strike HQ is now a polite aviary.',
        highEndTitle: 'Royal Avian Charter',
        highEndText:
          'Queen Victoria appoints you Chief Feather-in-Waiting, which turns out to mean endless ceremonial speeches and zero naps.',
      },
    ],
    cards: [
      {
        id: 'pu-1',
        speaker: 'Barnaby Coo',
        role: 'Shop Steward · West Plinth',
        prompt:
          'A bakery wagon dropped four crates of day-old sesame rolls near Charing Cross, but a bobby is standing five paces away.',
        leftChoice: {
          label: 'Stage a coordinated distraction',
          outcome: 'Twelve pigeons tapped the bobby’s helmet while the rest hauled off the rye.',
          effects: { cohesion: 15, crumbs: 20, sympathy: -10, crown: -15 },
        },
        rightChoice: {
          label: 'Form an orderly single-file queue',
          outcome: 'Tourists applauded the polite line and tossed extra penny buns.',
          effects: { cohesion: -5, crumbs: 10, sympathy: 20, crown: 10 },
        },
      },
      {
        id: 'pu-2',
        speaker: 'Lady Margaret Finch',
        role: 'Benefactor · Kensington',
        prompt:
          'I adore your little tweed vests, darling. Will your delegates pose for a charity oil portrait in exchange for a sack of oats?',
        leftChoice: {
          label: 'Hold out for buttered brioche',
          outcome: 'Lady Margaret sniffed and donated her oats to the rival sparrow guild.',
          effects: { cohesion: 10, crumbs: -15, sympathy: -10, crown: 5 },
        },
        rightChoice: {
          label: 'Sit still for three hours',
          outcome: 'The painting became the talk of Mayfair, though several feathers fell asleep.',
          effects: { cohesion: -10, crumbs: 20, sympathy: 15, crown: 10 },
        },
      },
      {
        id: 'pu-3',
        speaker: 'Inspector Pemberton',
        role: 'Metropolitan Police',
        prompt:
          'Your pickets blocked the Lord Mayor’s carriage for forty minutes. Disband by sunset or I fetch the brass whistles.',
        leftChoice: {
          label: 'Confiscate his shiny whistle',
          outcome: 'Barnaby swooped in mid-sentence. The flock cheered; Scotland Yard did not.',
          effects: { cohesion: 20, crumbs: 0, sympathy: -10, crown: -25 },
        },
        rightChoice: {
          label: 'Offer a dignified truce salute',
          outcome: 'Pemberton tipped his hat and quietly diverted carriages down Whitehall.',
          effects: { cohesion: -15, crumbs: 0, sympathy: 10, crown: 20 },
        },
      },
      {
        id: 'pu-4',
        speaker: 'Archimedes',
        role: 'Carrier Pigeon Emeritus',
        prompt:
          'Word from Fleet Street: the Telegraph Clerks want to unionize alongside us if we deliver their urgent morning memos.',
        leftChoice: {
          label: 'Accept the courier pact',
          outcome: 'Solidarity soared across London, though carrying wet ink tubes ruined three vests.',
          effects: { cohesion: 15, crumbs: 15, sympathy: 15, crown: -15 },
        },
        rightChoice: {
          label: 'Keep the union strictly avian',
          outcome: 'The flock stayed focused on crust parity, leaving humans to sort their own wires.',
          effects: { cohesion: -5, crumbs: -5, sympathy: -10, crown: 15 },
        },
      },
      {
        id: 'pu-5',
        speaker: 'Duchess Gwendolyn',
        role: 'Royal Botanical Society',
        prompt:
          'Someone replaced all the geraniums in St. James’s Park with decorative millet stalks. Was that your doing?',
        leftChoice: {
          label: 'Claim artistic gardening credit',
          outcome: 'Botanical critics praised the bold golden palette; gardeners wept softly.',
          effects: { cohesion: 10, crumbs: 20, sympathy: -15, crown: -10 },
        },
        rightChoice: {
          label: 'Blame the nocturnal squirrels',
          outcome: 'The squirrels were framed immediately, preserving our tenuous respectability.',
          effects: { cohesion: -10, crumbs: 5, sympathy: 15, crown: 15 },
        },
      },
      {
        id: 'pu-6',
        speaker: 'Pip Squeak',
        role: 'Junior Fledgling',
        prompt:
          'Winter fog rolled in thick as pea soup! Half the night shift cannot find Nelson’s Column.',
        leftChoice: {
          label: 'Light tiny matchbox lanterns',
          outcome: 'The square glowed like a fairy harbor, though singed tailfeathers cost us reserve.',
          effects: { cohesion: 20, crumbs: -15, sympathy: 20, crown: -10 },
        },
        rightChoice: {
          label: 'Nest inside the opera house eaves',
          outcome: 'Warm velvet rafters saved everyone, even if our cooing harmonized with Act III.',
          effects: { cohesion: 10, crumbs: -5, sympathy: -15, crown: 10 },
        },
      },
      {
        id: 'pu-7',
        speaker: 'Lord Chamberlain',
        role: 'Palace Envoy',
        prompt:
          'Parliament proposes an official Breadcrumb Minimum Wage—provided your union drops its demand for Sunday fountain privileges.',
        leftChoice: {
          label: 'Refuse—fountains are non-negotiable',
          outcome: 'Splash rights secured! A furious minister slipped on wet marble outside.',
          effects: { cohesion: 20, crumbs: -10, sympathy: 10, crown: -20 },
        },
        rightChoice: {
          label: 'Sign the Sourdough Accord',
          outcome: 'Every fountain stays dry on Sundays, but fresh loaves arrive promptly at noon.',
          effects: { cohesion: -10, crumbs: 20, sympathy: 10, crown: 20 },
        },
      },
    ],
    victoryTitle: 'The Trafalgar Accord Stands',
    victoryText:
      'Against fog, nets, and stale scones, your feathered union kept every bench warm and earned a permanent place in London’s civic lore.',
  },
  {
    id: 'moonbase-cafeteria',
    title: 'Moonbase Cafeteria',
    subtitle: 'Low-Orbit Sector 4 · Zero-G Diner',
    premise:
      'Manage the only hot-meal counter in lunar orbit while juggling grumpy astronauts, rogue espresso bubbles, and strict safety inspectors.',
    tone: 'Sci-Fi Comedy',
    source: 'curated',
    coverImage: '/src/assets/images/world_moonbase_diner_1795241653253.jpg',
    meters: [
      {
        id: 'morale',
        label: 'Crew Morale',
        icon: 'users',
        lowEndTitle: 'The Silent Airlock',
        lowEndText:
          'Crew members eat nutrient paste alone in their bunks, glaring grimly at your unplugged waffle iron.',
        highEndTitle: 'Perpetual Disco Orbit',
        highEndText:
          'The cafeteria became so popular that three science teams abandoned their telescopes to run a karaoke league.',
      },
      {
        id: 'protein',
        label: 'Pantry Stock',
        icon: 'coins',
        lowEndTitle: 'Nothing Left But Ketchup',
        lowEndText:
          'Every freeze-dried omelet is gone. Tonight’s special is warm water seasoned with ambient stardust.',
        highEndTitle: 'Gravitational Pantry Collapse',
        highEndText:
          'Seven tons of surplus pancake batter drifted out of storage and glued the docking bay shut.',
      },
      {
        id: 'oxygen',
        label: 'Cabin Air',
        icon: 'wind',
        lowEndTitle: 'Emergency Helmet Soup',
        lowEndText:
          'Burnt toast tripped every scrubber on Deck 2. Everyone now sips broth through suit straws.',
        highEndTitle: 'Hyper-Oxygenated Euphoria',
        highEndText:
          'The mint-scented vents cranked so high that even a spilled napkin sparkles like fireworks.',
      },
      {
        id: 'inspector',
        label: 'Inspector Trust',
        icon: 'shield',
        lowEndTitle: 'Padlocked Griddle',
        lowEndText:
          'Earth Command sealed your espresso machine behind fourteen layers of hazard tape.',
        highEndTitle: 'Bureaucratic Gridlock',
        highEndText:
          'You followed so many safety forms that serving a single blueberry muffin requires three signatures and a flare gun.',
      },
    ],
    cards: [
      {
        id: 'mb-1',
        speaker: 'Commander Sato',
        role: 'EVA Team Lead',
        prompt:
          'My crew just spent six hours patching solar panels. If they do not get real maple syrup on their pancakes, they will boycott tomorrow’s spacewalk.',
        leftChoice: {
          label: 'Crack open the emergency Earth reserve',
          outcome: 'Cheers echoed through Hull B, though the sticky droplets floated everywhere.',
          effects: { morale: 20, protein: -20, oxygen: 0, inspector: -10 },
        },
        rightChoice: {
          label: 'Serve algae-butter substitute',
          outcome: 'Regulation-compliant, technically edible, and quietly despised by everyone.',
          effects: { morale: -15, protein: 10, oxygen: 5, inspector: 15 },
        },
      },
      {
        id: 'mb-2',
        speaker: 'BARISTA-9',
        role: 'Self-Aware Espresso Unit',
        prompt:
          'I have calibrated a 9-bar crema shot that tastes like childhood summers, but it vents pure steam directly into the airlock sensor.',
        leftChoice: {
          label: 'Brew ten doubles immediately',
          outcome: 'Best coffee in the solar system! Also the foggiest hallway.',
          effects: { morale: 20, protein: -10, oxygen: -20, inspector: -10 },
        },
        rightChoice: {
          label: 'Switch to lukewarm tea bags',
          outcome: 'Air scrubbers hummed happily while BARISTA-9 sighed in binary.',
          effects: { morale: -10, protein: 5, oxygen: 20, inspector: 10 },
        },
      },
      {
        id: 'mb-3',
        speaker: 'Inspector Vance',
        role: 'Orbital Health & Safety',
        prompt:
          'Why is there a sourdough starter named "Comet" strapped into the co-pilot chair?',
        leftChoice: {
          label: 'Declare Comet an emotional support yeast',
          outcome: 'Vance squinted at the handbook and reluctantly stamped a temporary badge.',
          effects: { morale: 15, protein: 15, oxygen: -10, inspector: -15 },
        },
        rightChoice: {
          label: 'Lock Comet inside the sterile cooler',
          outcome: 'The starter went dormant and the station smelled suspiciously hospital-clean.',
          effects: { morale: -15, protein: -10, oxygen: 15, inspector: 20 },
        },
      },
      {
        id: 'mb-4',
        speaker: 'Dr. Noor',
        role: 'Hydroponics Botanist',
        prompt:
          'Our experimental chili peppers mutated in low gravity. They glow slightly blue and double oxygen output—if someone eats them.',
        leftChoice: {
          label: 'Put "Nova Chili" on tonight’s menu',
          outcome: 'Three engineers hiccuped blue sparks and declared it the finest Tuesday ever.',
          effects: { morale: 15, protein: 15, oxygen: 15, inspector: -20 },
        },
        rightChoice: {
          label: 'Quarantine the peppers for study',
          outcome: 'Vance praised your restraint while the crew eyed the bland crackers.',
          effects: { morale: -10, protein: -10, oxygen: 10, inspector: 20 },
        },
      },
      {
        id: 'mb-5',
        speaker: 'Cargo Pilot Jax',
        role: 'Supply Shuttle 7',
        prompt:
          'Docking thrusters jammed! I can jettison either the crate of frozen croissants or the spare CO2 filter cartridges to lighten load.',
        leftChoice: {
          label: 'Save the croissants at all costs',
          outcome: 'Warm flaky butter filled the mess hall; vents wheezed heroically.',
          effects: { morale: 20, protein: 20, oxygen: -20, inspector: -10 },
        },
        rightChoice: {
          label: 'Save the CO2 filter cartridges',
          outcome: 'Crisp mountain-fresh air returned, accompanied by collective pastry mourning.',
          effects: { morale: -15, protein: -15, oxygen: 25, inspector: 15 },
        },
      },
      {
        id: 'mb-6',
        speaker: 'Chef Bot 4',
        role: 'Sous-Chef Module',
        prompt:
          'Gravity stabilizers flickered for four seconds. Two hundred meatballs are now orbiting the ceiling fan.',
        leftChoice: {
          label: 'Turn it into a zero-G catch contest',
          outcome: 'Highest crew morale of the quarter—minus a few sauce stains on the ceiling.',
          effects: { morale: 25, protein: -15, oxygen: -5, inspector: -15 },
        },
        rightChoice: {
          label: 'Vacuum them into emergency rations',
          outcome: 'Tidy, sanitary, and deeply unromantic.',
          effects: { morale: -15, protein: 15, oxygen: 10, inspector: 15 },
        },
      },
      {
        id: 'mb-7',
        speaker: 'Earth Command',
        role: 'Houston Broadcast',
        prompt:
          'Quarterly review incoming! Broadcast a live tour of your diner to boost public funding for the lunar colony.',
        leftChoice: {
          label: 'Host a chaotic live pancake flip',
          outcome: 'Viewers loved the floating syrup rings; inspectors covered their eyes.',
          effects: { morale: 20, protein: -10, oxygen: -10, inspector: -15 },
        },
        rightChoice: {
          label: 'Read the nutrition compliance chart',
          outcome: 'Senators nodded approvingly while the crew secretly passed notes.',
          effects: { morale: -15, protein: 10, oxygen: 10, inspector: 20 },
        },
      },
    ],
    victoryTitle: 'Five-Star Orbital Bistro',
    victoryText:
      'Your diner survived faulty vents, floating meatballs, and surprise inspections—earning legendary status across every ship in lunar orbit.',
  },
  {
    id: 'medieval-bakery-guild',
    title: 'Medieval Bakery Guild',
    subtitle: 'Oakhaven Market · Dragon-Fired Hearth',
    premise:
      'Run the kingdom’s proudest sourdough guild with the help of a sneeze-prone emerald dragon, fickle knights, and suspiciously competitive pastry monks.',
    tone: 'Cozy Fantasy',
    source: 'curated',
    coverImage: '/src/assets/images/world_bakery_guild_1795241654886.jpg',
    meters: [
      {
        id: 'yeast',
        label: 'Starter Potency',
        icon: 'sparkles',
        lowEndTitle: 'Flatbread Extinction',
        lowEndText:
          'Your 200-year-old mother dough went completely flat. Every loaf now doubles as a cobbler’s anvil.',
        highEndTitle: 'The Sentient Loaf',
        highEndText:
          'The starter rose so vigorously it pushed the roof off the guildhall and politely walked toward the river.',
      },
      {
        id: 'coin',
        label: 'Guild Treasury',
        icon: 'coins',
        lowEndTitle: 'Repo Knights at Dawn',
        lowEndText:
          'The flour merchant repossessed your favorite rolling pin. Time to bake pinecones.',
        highEndTitle: 'Gilded Pretzel Monopoly',
        highEndText:
          'You bought every windmill in the valley and now pay taxes exclusively in caramelized tarts.',
      },
      {
        id: 'favor',
        label: 'Royal Favor',
        icon: 'crown',
        lowEndTitle: 'Banished to Rye Country',
        lowEndText:
          'The Queen declared your crusts legally insulting and ordered the court jesters to juggle your buns.',
        highEndTitle: 'Trapped in Palace Kitchens',
        highEndText:
          'The Crown loves your brioche so much you are forbidden from ever leaving the castle pantry again.',
      },
      {
        id: 'dragon',
        label: 'Dragon Calm',
        icon: 'flame',
        lowEndTitle: 'Chilled Ember Sulk',
        lowEndText:
          'Your little emerald dragon curled up in the flour bin and refused to toast anything warmer than tepid milk.',
        highEndTitle: 'Accidental Hearth Inferno',
        highEndText:
          'Excited sneezing toasted every loaf in Oakhaven into carbon disks—though the smoke smelled faintly of cinnamon.',
      },
    ],
    cards: [
      {
        id: 'bg-1',
        speaker: 'Pippin the Emberling',
        role: 'Guild Oven Dragon',
        prompt:
          'Pippin sneezed near the nutmeg jar and now wants to toast forty cinnamon rolls at triple flame speed.',
        leftChoice: {
          label: 'Let Pippin blast the glaze',
          outcome: 'Caramelized perfection! Though Pippin’s tail knocked over two sacks of coin.',
          effects: { yeast: 10, coin: -10, favor: 15, dragon: 20 },
        },
        rightChoice: {
          label: 'Soothe him with chamomile tea',
          outcome: 'A gentle bake yielded tidy loaves and a sleepy, well-behaved dragon.',
          effects: { yeast: 5, coin: 10, favor: 5, dragon: -20 },
        },
      },
      {
        id: 'bg-2',
        speaker: 'Sir Cedric',
        role: 'Captain of the Guard',
        prompt:
          'Our marching regiment needs fifty crusty trenchers that will survive three days of rain without turning soggy.',
        leftChoice: {
          label: 'Double-bake dense rye bricks',
          outcome: 'The soldiers stayed fed and dry, though a few teeth complained.',
          effects: { yeast: -15, coin: 20, favor: 15, dragon: -5 },
        },
        rightChoice: {
          label: 'Gift warm honey-butter rolls instead',
          outcome: 'The guards wept with joy and forgot to march until dusk.',
          effects: { yeast: 15, coin: -15, favor: -10, dragon: 10 },
        },
      },
      {
        id: 'bg-3',
        speaker: 'Brother Crumble',
        role: 'Abbey Pastry Rival',
        prompt:
          'The Abbey claims our blessed wheat water produces fluffier croissants than your pagan dragon-oven.',
        leftChoice: {
          label: 'Challenge them to a market bake-off',
          outcome: 'The town square packed shoulder to shoulder; Pippin nailed the flaky crust.',
          effects: { yeast: 15, coin: 15, favor: 10, dragon: 15 },
        },
        rightChoice: {
          label: 'Share a spoonful of our starter',
          outcome: 'Peace bloomed between guilds, though our secret recipe is slightly less secret.',
          effects: { yeast: -15, coin: -5, favor: 20, dragon: -10 },
        },
      },
      {
        id: 'bg-4',
        speaker: 'Miller Goode',
        role: 'Windmill Proprietor',
        prompt:
          'A sudden gale snapped our main sail! I only have coarse barley meal left unless you front gold for repairs.',
        leftChoice: {
          label: 'Pay for emergency oak timber',
          outcome: 'Fresh white flour arrived by noon, keeping the starter bubbly and proud.',
          effects: { yeast: 20, coin: -25, favor: 10, dragon: 0 },
        },
        rightChoice: {
          label: 'Invent rustic "Storm Barley" loaves',
          outcome: 'Surprisingly chewy! Penny-pinching townsfolk bought every batch.',
          effects: { yeast: -15, coin: 20, favor: -10, dragon: 5 },
        },
      },
      {
        id: 'bg-5',
        speaker: 'Princess Elara',
        role: 'Midnight Kitchen Visitor',
        prompt:
          'Shh! Do not tell Father, but I want to learn how to braid challah while Pippin watches.',
        leftChoice: {
          label: 'Teach her the six-strand braid',
          outcome: 'She beamed ear to ear and dropped three royal gold sovereigns in the tip jar.',
          effects: { yeast: 10, coin: 15, favor: 15, dragon: 10 },
        },
        rightChoice: {
          label: 'Escort her back before curfew',
          outcome: 'The King appreciated your discretion, though Pippin moped all morning.',
          effects: { yeast: -5, coin: 0, favor: 20, dragon: -15 },
        },
      },
      {
        id: 'bg-6',
        speaker: 'Grandma Bracken',
        role: 'Master Starter Keeper',
        prompt:
          'The mother dough is humming softly in D-minor. Should we feed it wildflower honey or mountain spring water?',
        leftChoice: {
          label: 'Feed it warm wildflower honey',
          outcome: 'The crock bubbled wildly, filling the street with toasted-blossom perfume.',
          effects: { yeast: 25, coin: -10, favor: 10, dragon: 15 },
        },
        rightChoice: {
          label: 'Keep it lean with spring water',
          outcome: 'Balanced, reliable fermentation with crisp tang and zero oven surprises.',
          effects: { yeast: 10, coin: 10, favor: 5, dragon: -10 },
        },
      },
      {
        id: 'bg-7',
        speaker: 'Royal Herald',
        role: 'Harvest Festival Judge',
        prompt:
          'For the Harvest Crown Loaf, will you unveil an ornate seven-tier centerpiece or feed the entire market square free warm rolls?',
        leftChoice: {
          label: 'Bake the towering royal centerpiece',
          outcome: 'Dazzled the court, swelled our purse, and tested Pippin’s breath control.',
          effects: { yeast: -10, coin: 20, favor: 20, dragon: 15 },
        },
        rightChoice: {
          label: 'Hand out warm rolls to every villager',
          outcome: 'Empty coffers for a day, endless goodwill for a decade.',
          effects: { yeast: 15, coin: -20, favor: 10, dragon: -10 },
        },
      },
    ],
    victoryTitle: 'Grandmaster of the Golden Crust',
    victoryText:
      'Your sourdough sang, Pippin kept a steady ember, and Oakhaven crowned your guild the undisputed heart of the harvest.',
  },
];
