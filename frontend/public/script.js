document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const heatmapIcon = document.querySelector('.heatmap-icon');
  const worldHeatmap = document.querySelector('.world-heatmap-container');
  const searchInput = document.querySelector('.search-input');
  const searchDropdown = document.querySelector('.search-dropdown');
  const cityMapContainer = document.querySelector('.city-map-container');
  const cityTitle = document.getElementById('city-title');
  const trapScoreContainer = document.getElementById('trap-score-container');
  const trapLocationName = document.getElementById('trap-location-name');
  const areaScoreValue = document.getElementById('area-score-value');
  const touristTrapsList = document.getElementById('tourist-traps-list');
  const localGemsList = document.getElementById('local-gems-list');
  
  // Map variables
  let worldMap = null;
  let cityMap = null;
  let cityMarkers = [];
  
  // Global location database with neighborhoods and attractions
  const locationDatabase = {
    "New York": {
      coordinates: [40.7128, -74.0060],
      neighborhoods: [
        { name: "Manhattan", touristLevel: "high", coordinates: [40.7831, -73.9712] },
        { name: "Brooklyn", touristLevel: "medium", coordinates: [40.6782, -73.9442] },
        { name: "Queens", touristLevel: "medium", coordinates: [40.7282, -73.7949] },
        { name: "Bronx", touristLevel: "low", coordinates: [40.8448, -73.8648] },
        { name: "Staten Island", touristLevel: "low", coordinates: [40.5795, -74.1502] }
      ],
      attractions: [
        { name: "Times Square", touristLevel: "high", coordinates: [40.7580, -73.9855] },
        { name: "Central Park", touristLevel: "high", coordinates: [40.7812, -73.9665] },
        { name: "Empire State Building", touristLevel: "high", coordinates: [40.7484, -73.9857] },
        { name: "Brooklyn Bridge", touristLevel: "medium", coordinates: [40.7061, -73.9969] }
      ]
    },
    "Paris": {
      coordinates: [48.8566, 2.3522],
      neighborhoods: [
        { name: "Le Marais", touristLevel: "high", coordinates: [48.8559, 2.3606] },
        { name: "Montmartre", touristLevel: "high", coordinates: [48.8867, 2.3431] },
        { name: "Latin Quarter", touristLevel: "high", coordinates: [48.8461, 2.3444] },
        { name: "Belleville", touristLevel: "low", coordinates: [48.8717, 2.3783] },
        { name: "Canal Saint-Martin", touristLevel: "medium", coordinates: [48.8701, 2.3659] }
      ],
      attractions: [
        { name: "Eiffel Tower", touristLevel: "high", coordinates: [48.8584, 2.2945] },
        { name: "Louvre Museum", touristLevel: "high", coordinates: [48.8606, 2.3376] },
        { name: "Notre-Dame Cathedral", touristLevel: "high", coordinates: [48.8530, 2.3499] },
        { name: "Sacré-Cœur", touristLevel: "medium", coordinates: [48.8867, 2.3431] }
      ]
    },
    "Tokyo": {
      coordinates: [35.6762, 139.6503],
      neighborhoods: [
        { name: "Shibuya", touristLevel: "high", coordinates: [35.6588, 139.7017] },
        { name: "Shinjuku", touristLevel: "high", coordinates: [35.6938, 139.7036] },
        { name: "Asakusa", touristLevel: "high", coordinates: [35.7148, 139.7967] },
        { name: "Shimokitazawa", touristLevel: "low", coordinates: [35.6614, 139.6648] },
        { name: "Koenji", touristLevel: "low", coordinates: [35.7053, 139.6500] }
      ],
      attractions: [
        { name: "Tokyo Tower", touristLevel: "high", coordinates: [35.6586, 139.7454] },
        { name: "Senso-ji Temple", touristLevel: "high", coordinates: [35.7147, 139.7966] },
        { name: "Meiji Shrine", touristLevel: "medium", coordinates: [35.6764, 139.6993] },
        { name: "Tsukiji Fish Market", touristLevel: "medium", coordinates: [35.6655, 139.7707] }
      ]
    },
    "Rome": {
      coordinates: [41.9028, 12.4964],
      neighborhoods: [
        { name: "Trastevere", touristLevel: "medium", coordinates: [41.8891, 12.4703] },
        { name: "Monti", touristLevel: "medium", coordinates: [41.8947, 12.4930] },
        { name: "Testaccio", touristLevel: "low", coordinates: [41.8767, 12.4747] },
        { name: "Prati", touristLevel: "medium", coordinates: [41.9085, 12.4670] }
      ],
      attractions: [
        { name: "Colosseum", touristLevel: "high", coordinates: [41.8902, 12.4924] },
        { name: "Vatican City", touristLevel: "high", coordinates: [41.9022, 12.4533] },
        { name: "Trevi Fountain", touristLevel: "high", coordinates: [41.9009, 12.4833] },
        { name: "Roman Forum", touristLevel: "high", coordinates: [41.8925, 12.4853] }
      ]
    },
    "New Orleans": {
      coordinates: [29.9511, -90.0715],
      neighborhoods: [
        { name: "French Quarter", touristLevel: "high", coordinates: [29.9584, -90.0644] },
        { name: "Garden District", touristLevel: "medium", coordinates: [29.9286, -90.0843] },
        { name: "Marigny", touristLevel: "medium", coordinates: [29.9644, -90.0533] },
        { name: "Bywater", touristLevel: "low", coordinates: [29.9686, -90.0394] },
        { name: "Tremé", touristLevel: "medium", coordinates: [29.9626, -90.0704] },
        { name: "Central Business District", touristLevel: "high", coordinates: [29.9507, -90.0729] }
      ],
      attractions: [
        { name: "Bourbon Street", touristLevel: "high", coordinates: [29.9554, -90.0684] },
        { name: "Jackson Square", touristLevel: "high", coordinates: [29.9574, -90.0632] },
        { name: "St. Louis Cathedral", touristLevel: "high", coordinates: [29.9577, -90.0631] },
        { name: "Frenchmen Street", touristLevel: "medium", coordinates: [29.9639, -90.0577] }
      ]
    },
    "Sydney": {
      coordinates: [-33.8688, 151.2093],
      neighborhoods: [
        { name: "The Rocks", touristLevel: "high", coordinates: [-33.8599, 151.2090] },
        { name: "Darlinghurst", touristLevel: "medium", coordinates: [-33.8792, 151.2215] },
        { name: "Newtown", touristLevel: "low", coordinates: [-33.8960, 151.1780] },
        { name: "Surry Hills", touristLevel: "medium", coordinates: [-33.8845, 151.2119] }
      ],
      attractions: [
        { name: "Sydney Opera House", touristLevel: "high", coordinates: [-33.8568, 151.2153] },
        { name: "Bondi Beach", touristLevel: "high", coordinates: [-33.8908, 151.2745] },
        { name: "Sydney Harbour Bridge", touristLevel: "high", coordinates: [-33.8523, 151.2108] },
        { name: "Royal Botanic Garden", touristLevel: "medium", coordinates: [-33.8641, 151.2166] }
      ]
    },
    "San Francisco": {
      coordinates: [37.7749, -122.4194],
      neighborhoods: [
        { name: "Mission District", touristLevel: "medium", coordinates: [37.7599, -122.4148] },
        { name: "North Beach", touristLevel: "high", coordinates: [37.8001, -122.4099] },
        { name: "The Castro", touristLevel: "medium", coordinates: [37.7609, -122.4350] },
        { name: "Nob Hill", touristLevel: "high", coordinates: [37.7930, -122.4161] },
        { name: "SoMa", touristLevel: "medium", coordinates: [37.7785, -122.4056] }
      ],
      attractions: [
        { name: "Golden Gate Bridge", touristLevel: "high", coordinates: [37.8199, -122.4783] },
        { name: "Alcatraz Island", touristLevel: "high", coordinates: [37.8270, -122.4230] },
        { name: "Fisherman's Wharf", touristLevel: "high", coordinates: [37.8080, -122.4177] },
        { name: "Golden Gate Park", touristLevel: "medium", coordinates: [37.7694, -122.4862] }
      ]
    },
    "Rio de Janeiro": {
      coordinates: [-22.9068, -43.1729],
      neighborhoods: [
        { name: "Copacabana", touristLevel: "high", coordinates: [-22.9657, -43.1776] },
        { name: "Ipanema", touristLevel: "high", coordinates: [-22.9837, -43.2147] },
        { name: "Leblon", touristLevel: "medium", coordinates: [-22.9847, -43.2256] },
        { name: "Santa Teresa", touristLevel: "medium", coordinates: [-22.9346, -43.1861] },
        { name: "Lapa", touristLevel: "medium", coordinates: [-22.9147, -43.1809] }
      ],
      attractions: [
        { name: "Christ the Redeemer", touristLevel: "high", coordinates: [-22.9519, -43.2105] },
        { name: "Sugarloaf Mountain", touristLevel: "high", coordinates: [-22.9491, -43.1546] },
        { name: "Copacabana Beach", touristLevel: "high", coordinates: [-22.9698, -43.1870] },
        { name: "Maracanã Stadium", touristLevel: "medium", coordinates: [-22.9122, -43.2303] }
      ]
    },
    "Moscow": {
      coordinates: [55.7558, 37.6173],
      neighborhoods: [
        { name: "Red Square Area", touristLevel: "high", coordinates: [55.7539, 37.6208] },
        { name: "Arbat", touristLevel: "high", coordinates: [55.7485, 37.5969] },
        { name: "Tverskaya", touristLevel: "medium", coordinates: [55.7636, 37.6066] },
        { name: "Kitay-Gorod", touristLevel: "medium", coordinates: [55.7546, 37.6325] },
        { name: "Zamoskvorechye", touristLevel: "low", coordinates: [55.7397, 37.6217] }
      ],
      attractions: [
        { name: "Red Square", touristLevel: "high", coordinates: [55.7539, 37.6208] },
        { name: "St. Basil's Cathedral", touristLevel: "high", coordinates: [55.7525, 37.6231] },
        { name: "Kremlin", touristLevel: "high", coordinates: [55.7520, 37.6175] },
        { name: "Gorky Park", touristLevel: "medium", coordinates: [55.7298, 37.6019] }
      ]
    },
    "Saint Petersburg": {
      coordinates: [59.9311, 30.3609],
      neighborhoods: [
        { name: "Nevsky Prospekt", touristLevel: "high", coordinates: [59.9356, 30.3301] },
        { name: "Palace Square", touristLevel: "high", coordinates: [59.9390, 30.3158] },
        { name: "Vasilyevsky Island", touristLevel: "medium", coordinates: [59.9428, 30.2765] },
        { name: "Petrogradsky Island", touristLevel: "medium", coordinates: [59.9577, 30.3086] },
        { name: "Kolomna", touristLevel: "low", coordinates: [59.9178, 30.2993] }
      ],
      attractions: [
        { name: "Hermitage Museum", touristLevel: "high", coordinates: [59.9398, 30.3146] },
        { name: "Church of the Savior on Blood", touristLevel: "high", coordinates: [59.9400, 30.3289] },
        { name: "Peterhof Palace", touristLevel: "high", coordinates: [59.8852, 29.9087] },
        { name: "Peter and Paul Fortress", touristLevel: "medium", coordinates: [59.9498, 30.3169] }
      ]
    },
    "Cape Town": {
      coordinates: [-33.9249, 18.4241],
      neighborhoods: [
        { name: "V&A Waterfront", touristLevel: "high", coordinates: [-33.9033, 18.4197] },
        { name: "City Bowl", touristLevel: "high", coordinates: [-33.9249, 18.4241] },
        { name: "Camps Bay", touristLevel: "medium", coordinates: [-33.9559, 18.3779] },
        { name: "Woodstock", touristLevel: "low", coordinates: [-33.9272, 18.4519] },
        { name: "Observatory", touristLevel: "low", coordinates: [-33.9374, 18.4717] }
      ],
      attractions: [
        { name: "Table Mountain", touristLevel: "high", coordinates: [-33.9625, 18.4099] },
        { name: "Robben Island", touristLevel: "high", coordinates: [-33.8076, 18.3683] },
        { name: "Kirstenbosch Botanical Gardens", touristLevel: "medium", coordinates: [-33.9881, 18.4326] },
        { name: "Bo-Kaap", touristLevel: "medium", coordinates: [-33.9178, 18.4165] }
      ]
    },
    "Marrakech": {
      coordinates: [31.6295, -7.9811],
      neighborhoods: [
        { name: "Medina", touristLevel: "high", coordinates: [31.6295, -7.9811] },
        { name: "Gueliz", touristLevel: "medium", coordinates: [31.6339, -8.0094] },
        { name: "Hivernage", touristLevel: "medium", coordinates: [31.6205, -8.0041] },
        { name: "Palmeraie", touristLevel: "low", coordinates: [31.6534, -7.9563] },
        { name: "Kasbah", touristLevel: "high", coordinates: [31.6216, -7.9891] }
      ],
      attractions: [
        { name: "Jemaa el-Fnaa", touristLevel: "high", coordinates: [31.6258, -7.9891] },
        { name: "Majorelle Garden", touristLevel: "high", coordinates: [31.6418, -8.0032] },
        { name: "Bahia Palace", touristLevel: "medium", coordinates: [31.6216, -7.9829] },
        { name: "Koutoubia Mosque", touristLevel: "high", coordinates: [31.6242, -7.9944] }
      ]
    },
    "Cairo": {
      coordinates: [30.0444, 31.2357],
      neighborhoods: [
        { name: "Downtown", touristLevel: "high", coordinates: [30.0444, 31.2357] },
        { name: "Zamalek", touristLevel: "medium", coordinates: [30.0571, 31.2241] },
        { name: "Giza", touristLevel: "high", coordinates: [30.0131, 31.2089] },
        { name: "Heliopolis", touristLevel: "low", coordinates: [30.0914, 31.3425] },
        { name: "Maadi", touristLevel: "low", coordinates: [29.9608, 31.2487] }
      ],
      attractions: [
        { name: "Pyramids of Giza", touristLevel: "high", coordinates: [29.9792, 31.1342] },
        { name: "Egyptian Museum", touristLevel: "high", coordinates: [30.0478, 31.2336] },
        { name: "Khan el-Khalili", touristLevel: "high", coordinates: [30.0476, 31.2622] },
        { name: "Citadel of Cairo", touristLevel: "medium", coordinates: [30.0287, 31.2599] }
      ]
    }
  };
  
  // Global country database with cities
  const countryDatabase = {
    "USA": {
      cities: ["New York", "San Francisco", "New Orleans"]
    },
    "France": {
      cities: ["Paris"]
    },
    "Japan": {
      cities: ["Tokyo"]
    },
    "Italy": {
      cities: ["Rome"]
    },
    "Australia": {
      cities: ["Sydney"]
    },
    "Brazil": {
      cities: ["Rio de Janeiro"]
    },
    "Russia": {
      cities: ["Moscow", "Saint Petersburg"]
    },
    "South Africa": {
      cities: ["Cape Town"]
    },
    "Morocco": {
      cities: ["Marrakech"]
    },
    "Egypt": {
      cities: ["Cairo"]
    }
  };

  // Map city to country
  const cityToCountry = {};
  Object.keys(countryDatabase).forEach(country => {
    countryDatabase[country].cities.forEach(city => {
      cityToCountry[city] = country;
    });
  });

  // Global trap score database for countries
  const countryTrapScoreDatabase = {
    "USA": {
      areaScore: 61,
      traps: [
        { name: "Times Square (New York)", score: 89 },
        { name: "Fisherman's Wharf (San Francisco)", score: 87 },
        { name: "Bourbon Street (New Orleans)", score: 85 },
        { name: "Hollywood Walk of Fame", score: 83 },
        { name: "Navy Pier (Chicago)", score: 80 }
      ],
      gems: [
        { name: "Greenacre Park (New York)", score: 15 },
        { name: "Ferry Building Farmers Market (SF)", score: 22 },
        { name: "Bywater (New Orleans)", score: 18 },
        { name: "Portland Farmers Market", score: 21 },
        { name: "Savannah Historic District", score: 28 }
      ]
    },
    "France": {
      areaScore: 65,
      traps: [
        { name: "Eiffel Tower Restaurants", score: 85 },
        { name: "Mont Saint-Michel Tourist Shops", score: 82 },
        { name: "Nice Promenade Cafes", score: 79 },
        { name: "Versailles Palace Food Court", score: 75 },
        { name: "Champs-Élysées Shopping", score: 81 }
      ],
      gems: [
        { name: "Marché d'Aligre (Paris)", score: 19 },
        { name: "Annecy Old Town", score: 24 },
        { name: "Lyon's Traboules", score: 16 },
        { name: "Île de Ré Villages", score: 22 },
        { name: "Cassis Harbor", score: 27 }
      ]
    },
    "Japan": {
      areaScore: 54,
      traps: [
        { name: "Robot Restaurant (Tokyo)", score: 87 },
        { name: "Kyoto Geisha District Tours", score: 82 },
        { name: "Osaka Castle Food Stalls", score: 79 },
        { name: "Harajuku Takeshita Street", score: 83 },
        { name: "Tokyo Disney Resort", score: 76 }
      ],
      gems: [
        { name: "Yanaka Ginza (Tokyo)", score: 17 },
        { name: "Naoshima Art Island", score: 15 },
        { name: "Koyasan Temple Stay", score: 12 },
        { name: "Tsumago Post Town", score: 14 },
        { name: "Onomichi Ramen Shops", score: 23 }
      ]
    },
    "Italy": {
      areaScore: 76,
      traps: [
        { name: "Spanish Steps Restaurants (Rome)", score: 92 },
        { name: "Venice Gondola Rides", score: 88 },
        { name: "Pisa Tower Photo Spots", score: 85 },
        { name: "Florence Leather Markets", score: 83 },
        { name: "Naples Pizza Tourist Traps", score: 79 }
      ],
      gems: [
        { name: "Quartiere Coppedè (Rome)", score: 18 },
        { name: "Ortigia Island (Sicily)", score: 21 },
        { name: "Bologna Food Markets", score: 25 },
        { name: "Procida Island", score: 16 },
        { name: "Matera Cave Restaurants", score: 29 }
      ]
    },
    "Australia": {
      areaScore: 58,
      traps: [
        { name: "Sydney Opera House Tours", score: 71 },
        { name: "Bondi Beach Main Strip", score: 76 },
        { name: "Great Barrier Reef Day Tours", score: 82 },
        { name: "Melbourne Federation Square", score: 68 },
        { name: "Gold Coast Theme Parks", score: 74 }
      ],
      gems: [
        { name: "Wendy's Secret Garden (Sydney)", score: 18 },
        { name: "Melbourne Laneways", score: 23 },
        { name: "Margaret River Wineries", score: 26 },
        { name: "Fremantle Markets", score: 25 },
        { name: "Tasmania's Bruny Island", score: 15 }
      ]
    },
    "Brazil": {
      areaScore: 62,
      traps: [
        { name: "Copacabana Beach Front", score: 81 },
        { name: "Christ the Redeemer Gift Shop", score: 78 },
        { name: "Amazon Jungle Package Tours", score: 76 },
        { name: "Salvador Carnival Tourist Areas", score: 83 },
        { name: "Iguazu Falls Boat Rides", score: 72 }
      ],
      gems: [
        { name: "Santa Teresa Art Studios (Rio)", score: 28 },
        { name: "Olinda Historic Center", score: 22 },
        { name: "Jericoacoara Beach Hammocks", score: 18 },
        { name: "Minas Gerais Colonial Towns", score: 24 },
        { name: "Paraty Hidden Beaches", score: 17 }
      ]
    },
    "Russia": {
      areaScore: 59,
      traps: [
        { name: "Red Square Souvenir Stalls", score: 79 },
        { name: "Hermitage Museum Guided Tours", score: 74 },
        { name: "Kremlin Tourist Restaurants", score: 77 },
        { name: "St. Petersburg Palace Square", score: 82 },
        { name: "Matryoshka Doll Markets", score: 76 }
      ],
      gems: [
        { name: "Danilovsky Market (Moscow)", score: 21 },
        { name: "Strelka Bar (Moscow)", score: 29 },
        { name: "New Holland Island (St. Petersburg)", score: 24 },
        { name: "Zaryadye Park Cafes", score: 32 },
        { name: "Golden Ring Small Towns", score: 18 }
      ]
    },
    "South Africa": {
      areaScore: 54,
      traps: [
        { name: "V&A Waterfront Food Court", score: 76 },
        { name: "Table Mountain Cable Car", score: 72 },
        { name: "Kruger Park Tourist Lodges", score: 78 },
        { name: "Johannesburg Lion Park", score: 75 },
        { name: "Durban Golden Mile", score: 71 }
      ],
      gems: [
        { name: "Neighbourgoods Market (Cape Town)", score: 18 },
        { name: "Woodstock Art Galleries", score: 23 },
        { name: "Kalk Bay Harbor", score: 22 },
        { name: "Coffee Shops in Maboneng", score: 21 },
        { name: "Stellenbosch Wine Farms", score: 27 }
      ]
    },
    "Morocco": {
      areaScore: 72,
      traps: [
        { name: "Jemaa el-Fnaa Snake Charmers", score: 92 },
        { name: "Fez Tannery Tours", score: 86 },
        { name: "Marrakech Souvenirs", score: 84 },
        { name: "Majorelle Garden Entrance", score: 78 },
        { name: "Essaouira Beach Camel Rides", score: 81 }
      ],
      gems: [
        { name: "Le Jardin Secret (Marrakech)", score: 31 },
        { name: "Moulay Idriss Town", score: 19 },
        { name: "Chefchaouen Side Streets", score: 24 },
        { name: "Asilah Art Town", score: 22 },
        { name: "Fez Local Restaurants", score: 26 }
      ]
    },
    "Egypt": {
      areaScore: 79,
      traps: [
        { name: "Pyramid Photo Spots", score: 94 },
        { name: "Nile Dinner Cruises", score: 88 },
        { name: "Luxor Temple Guides", score: 82 },
        { name: "Sharm El Sheikh Resort Beaches", score: 85 },
        { name: "Khan el-Khalili Tourist Section", score: 89 }
      ],
      gems: [
        { name: "Al-Azhar Park (Cairo)", score: 23 },
        { name: "Aswan Nubian Villages", score: 18 },
        { name: "Alexandria Library Cafes", score: 27 },
        { name: "Dahab Backstreets", score: 21 },
        { name: "Siwa Oasis Town", score: 15 }
      ]
    }
  };

  // Global trap score database for cities and neighborhoods
  const trapScoreDatabase = {
    // Cities
    "New York": {
      areaScore: 68,
      traps: [
        { name: "Times Square", score: 89 },
        { name: "Empire State Building Observation Deck", score: 78 },
        { name: "Madame Tussauds", score: 75 },
        { name: "Hard Rock Cafe", score: 72 },
        { name: "Ripley's Believe It or Not", score: 70 }
      ],
      gems: [
        { name: "Greenacre Park", score: 15 },
        { name: "Little Island", score: 22 },
        { name: "John's of Bleecker Street", score: 25 },
        { name: "The Cloisters", score: 18 },
        { name: "Roosevelt Island Tramway", score: 28 }
      ]
    },
    "Paris": {
      areaScore: 72,
      traps: [
        { name: "Eiffel Tower Restaurants", score: 85 },
        { name: "Champs-Élysées Shopping", score: 82 },
        { name: "Seine River Boat Tour", score: 77 },
        { name: "Moulin Rouge Shows", score: 75 },
        { name: "Les Deux Magots Cafe", score: 68 }
      ],
      gems: [
        { name: "Canal Saint-Martin", score: 24 },
        { name: "Parc des Buttes-Chaumont", score: 16 },
        { name: "Marché d'Aligre", score: 19 },
        { name: "Le Comptoir Général", score: 28 },
        { name: "Musée de la Chasse et de la Nature", score: 22 }
      ]
    },
    "Tokyo": {
      areaScore: 58,
      traps: [
        { name: "Robot Restaurant", score: 87 },
        { name: "Tokyo Skytree Observation Deck", score: 76 },
        { name: "Harajuku Takeshita Street (weekends)", score: 82 },
        { name: "Akihabara Maid Cafes", score: 79 },
        { name: "Gonpachi Nishi-Azabu (Kill Bill Restaurant)", score: 74 }
      ],
      gems: [
        { name: "Yanaka Ginza", score: 17 },
        { name: "Shimokitazawa District", score: 15 },
        { name: "Kappabashi Street", score: 26 },
        { name: "Nezu Shrine", score: 12 },
        { name: "Tsukishima Monja Street", score: 24 }
      ]
    },
    "Rome": {
      areaScore: 81,
      traps: [
        { name: "Spanish Steps Restaurants", score: 92 },
        { name: "Trevi Fountain Cafes", score: 88 },
        { name: "Vatican Museum Pizza Stalls", score: 87 },
        { name: "Termini Station Souvenir Shops", score: 82 },
        { name: "Colosseum Area Gladiator Photos", score: 85 }
      ],
      gems: [
        { name: "Quartiere Coppedè", score: 18 },
        { name: "Testaccio Market", score: 21 },
        { name: "Antica Osteria Rugantino", score: 24 },
        { name: "Aventine Keyhole", score: 32 },
        { name: "Centrale Montemartini", score: 19 }
      ]
    },
    "New Orleans": {
      areaScore: 63,
      traps: [
        { name: "Bourbon Street Daiquiri Shops", score: 87 },
        { name: "Pat O'Brien's", score: 79 },
        { name: "Cafe Du Monde (French Quarter location)", score: 72 },
        { name: "Jackson Square Portrait Artists", score: 65 },
        { name: "Royal Street Antique Shops", score: 61 }
      ],
      gems: [
        { name: "Bacchanal Wine", score: 22 },
        { name: "St. Roch Market", score: 31 },
        { name: "Bywater Art Garden", score: 19 },
        { name: "N7", score: 26 },
        { name: "Vaughan's Lounge", score: 24 }
      ]
    },
    "Sydney": {
      areaScore: 69,
      traps: [
        { name: "Sydney Opera House Tours", score: 71 },
        { name: "Darling Harbour Restaurants", score: 82 },
        { name: "King Street Wharf Bars", score: 79 },
        { name: "Circular Quay Souvenir Shops", score: 85 },
        { name: "Paddy's Markets Tourist Items", score: 75 }
      ],
      gems: [
        { name: "Wendy's Secret Garden", score: 18 },
        { name: "Spice Alley", score: 29 },
        { name: "The Rocks Markets (locals section)", score: 34 },
        { name: "Young Henrys Brewery", score: 25 },
        { name: "Marrickville Organic Food Markets", score: 16 }
      ]
    },
    "San Francisco": {
      areaScore: 74,
      traps: [
        { name: "Fisherman's Wharf Crab Stands", score: 89 },
        { name: "Pier 39 Shops", score: 86 },
        { name: "Alcatraz Cruise Packages", score: 72 },
        { name: "Union Square Chain Restaurants", score: 78 },
        { name: "Ghirardelli Square", score: 71 }
      ],
      gems: [
        { name: "Sutro Baths", score: 24 },
        { name: "Clarion Alley", score: 19 },
        { name: "Ferry Building Farmers Market", score: 36 },
        { name: "Garden of Shakespeare's Flowers", score: 15 },
        { name: "The Interval Bar", score: 27 }
      ]
    },
    "Rio de Janeiro": {
      areaScore: 66,
      traps: [
        { name: "Copacabana Beach Front Restaurants", score: 81 },
        { name: "Christ the Redeemer Gift Shop", score: 78 },
        { name: "Sugarloaf Mountain Cable Car Snack Bar", score: 72 },
        { name: "Lapa Nightclubs (tourist section)", score: 75 },
        { name: "Ipanema Beach Trinket Vendors", score: 69 }
      ],
      gems: [
        { name: "Santa Teresa Art Studios", score: 28 },
        { name: "Feira Nordestina São Cristóvão", score: 22 },
        { name: "Galeria Providência", score: 18 },
        { name: "Real Gabinete Português de Leitura", score: 15 },
        { name: "Bar do Mineiro", score: 31 }
      ]
    },
    "Moscow": {
      areaScore: 61,
      traps: [
        { name: "Red Square Souvenir Stalls", score: 79 },
        { name: "GUM Department Store Cafes", score: 74 },
        { name: "St. Basil's Cathedral Photo Service", score: 77 },
        { name: "Arbat Street Tourist Shops", score: 82 },
        { name: "Izmailovsky Market (tourist section)", score: 68 }
      ],
      gems: [
        { name: "Danilovsky Market", score: 21 },
        { name: "Gorky Park Food Stalls", score: 32 },
        { name: "Winzavod Contemporary Art Center", score: 17 },
        { name: "Mizuri Georgian Restaurant", score: 25 },
        { name: "Strelka Bar", score: 29 }
      ]
    },
    "Cape Town": {
      areaScore: 56,
      traps: [
        { name: "V&A Waterfront Food Court", score: 76 },
        { name: "Table Mountain Cafe", score: 72 },
        { name: "Long Street Bars (main strip)", score: 79 },
        { name: "Camps Bay Beach Front Restaurants", score: 83 },
        { name: "Bo-Kaap Photo Tours", score: 71 }
      ],
      gems: [
        { name: "Neighbourgoods Market", score: 18 },
        { name: "The Power and The Glory", score: 23 },
        { name: "Mzoli's", score: 17 },
        { name: "Kalky's Fish & Chips", score: 21 },
        { name: "The Secret Gin Bar", score: 26 }
      ]
    },
    
    // Neighborhoods
    "Manhattan": {
      areaScore: 71,
      traps: [
        { name: "Little Italy Restaurants", score: 88 },
        { name: "Chinatown Souvenir Shops", score: 79 },
        { name: "SoHo Chain Stores", score: 73 },
        { name: "Chelsea Market Food Court", score: 69 },
        { name: "Fifth Avenue Department Stores", score: 75 }
      ],
      gems: [
        { name: "Economy Candy", score: 22 },
        { name: "Tompkins Square Bagels", score: 27 },
        { name: "Strand Bookstore Rare Book Room", score: 18 },
        { name: "Ear Inn", score: 24 },
        { name: "Elizabeth Street Garden", score: 15 }
      ]
    },
    "Brooklyn": {
      areaScore: 47,
      traps: [
        { name: "DUMBO Waterfront Photo Spots", score: 65 },
        { name: "Williamsburg Branded Stores", score: 72 },
        { name: "Brooklyn Bridge Park Tourist Areas", score: 67 },
        { name: "Smorgasburg (peak hours)", score: 58 },
        { name: "Brooklyn Brewery Tours", score: 54 }
      ],
      gems: [
        { name: "Kings County Distillery", score: 24 },
        { name: "Pioneer Works", score: 16 },
        { name: "Four Horsemen Wine Bar", score: 28 },
        { name: "Matt Torrey's Bar", score: 32 },
        { name: "Court Street Grocers", score: 22 }
      ]
    },
    "Montmartre": {
      areaScore: 79,
      traps: [
        { name: "Place du Tertre Artists", score: 88 },
        { name: "Sacré-Cœur Souvenir Shops", score: 83 },
        { name: "La Maison Rose Photo Stop", score: 75 },
        { name: "Moulin de la Galette Tourist Menu", score: 81 },
        { name: "Le Consulat Cafe", score: 72 }
      ],
      gems: [
        { name: "Marcel", score: 26 },
        { name: "Musée de Montmartre", score: 31 },
        { name: "Le Refuge des Fondus", score: 35 },
        { name: "Marché Saint-Pierre", score: 18 },
        { name: "La Cave des Abbesses", score: 23 }
      ]
    },
    "Le Marais": {
      areaScore: 62,
      traps: [
        { name: "Rue des Rosiers Falafel Stands", score: 71 },
        { name: "Place des Vosges Cafes", score: 76 },
        { name: "BHV Department Store", score: 65 },
        { name: "L'As du Fallafel Queue", score: 79 },
        { name: "Vintage Shops on Rue de Turenne", score: 67 }
      ],
      gems: [
        { name: "Marché des Enfants Rouges", score: 29 },
        { name: "Breizh Café (off-hours)", score: 32 },
        { name: "Café Charlot", score: 35 },
        { name: "Les Mots à la Bouche Bookstore", score: 19 },
        { name: "Le Mary Celeste", score: 25 }
      ]
    },
    "Shibuya": {
      areaScore: 76,
      traps: [
        { name: "Shibuya Crossing Starbucks", score: 91 },
        { name: "Gyaru Fashion Stores", score: 83 },
        { name: "Hachiko Statue Photo Area", score: 87 },
        { name: "Center Gai Fast Food", score: 73 },
        { name: "Don Quijote Tourist Floor", score: 79 }
      ],
      gems: [
        { name: "Nonbei Yokocho Alley Bars", score: 21 },
        { name: "Uobei Sushi", score: 32 },
        { name: "D47 Museum", score: 14 },
        { name: "Tokyu Food Show Basement", score: 29 },
        { name: "Aoyama Flower Market Tea House", score: 35 }
      ]
    },
    "Shinjuku": {
      areaScore: 68,
      traps: [
        { name: "Robot Restaurant", score: 94 },
        { name: "Kabukicho Tourist Bars", score: 87 },
        { name: "Godzilla Head Photo Stop", score: 72 },
        { name: "Don Quijote Shinjuku", score: 76 },
        { name: "Shinjuku Station East Exit Restaurants", score: 71 }
      ],
      gems: [
        { name: "Golden Gai (select bars)", score: 35 },
        { name: "Omoide Yokocho Yakitori", score: 26 },
        { name: "Shinjuku Gyoen Garden", score: 18 },
        { name: "Nichome Micro Bars", score: 24 },
        { name: "Samurai Museum", score: 38 }
      ]
    },
    "Trastevere": {
      areaScore: 59,
      traps: [
        { name: "Piazza Santa Maria Restaurants", score: 77 },
        { name: "Ponte Sisto Area Gelato Shops", score: 72 },
        { name: "Via della Lungaretta Bars", score: 81 },
        { name: "Tourist Menu Restaurants", score: 85 },
        { name: "Souvenir Shops near Basilica", score: 73 }
      ],
      gems: [
        { name: "Pizzeria Ai Marmi", score: 31 },
        { name: "Antica Caciara Deli", score: 23 },
        { name: "Villa Farnesina", score: 18 },
        { name: "Da Enzo al 29", score: 35 },
        { name: "Bar San Calisto", score: 26 }
      ]
    },
    "Vatican City Area": {
      areaScore: 92,
      traps: [
        { name: "Via della Conciliazione Souvenir Shops", score: 95 },
        { name: "St. Peter's Square Cafe", score: 89 },
        { name: "Vatican Museum Exit Restaurant", score: 91 },
        { name: "Pope Merchandise Stalls", score: 87 },
        { name: "Guided Tour Hawkers", score: 93 }
      ],
      gems: [
        { name: "Pizzarium Bonci", score: 34 },
        { name: "Lourdes French Church", score: 29 },
        { name: "Sciascia Caffè", score: 37 },
        { name: "Forno Feliziani", score: 32 },
        { name: "Al Passetto di Borgo", score: 41 }
      ]
    },
    "French Quarter": {
      areaScore: 79,
      traps: [
        { name: "Bourbon Street Bars", score: 92 },
        { name: "Hurricane Cocktail Stands", score: 87 },
        { name: "Voodoo Shops", score: 78 },
        { name: "Cafe Beignet", score: 69 },
        { name: "Cafe Du Monde (long wait line)", score: 85 }
      ],
      gems: [
        { name: "Coop's Place", score: 32 },
        { name: "Bar Tonique", score: 26 },
        { name: "Louisiana Music Factory", score: 22 },
        { name: "Verti Marte", score: 19 },
        { name: "Preservation Hall (local night)", score: 35 }
      ]
    },
    "Garden District": {
      areaScore: 42,
      traps: [
        { name: "Commander's Palace", score: 61 },
        { name: "Lafayette Cemetery Tour Groups", score: 68 },
        { name: "Garden District Food Tour", score: 58 },
        { name: "Magazine Street Tourist Shops", score: 63 },
        { name: "Guided Mansion Tours", score: 55 }
      ],
      gems: [
        { name: "Turkey and the Wolf", score: 31 },
        { name: "Stein's Market & Deli", score: 24 },
        { name: "Sucré", score: 36 },
        { name: "The Bulldog", score: 29 },
        { name: "District Donuts", score: 32 }
      ]
    },
    "Marigny": {
      areaScore: 38,
      traps: [
        { name: "Frenchmen Street Jazz Clubs", score: 56 },
        { name: "Spotted Cat (weekend nights)", score: 62 },
        { name: "Marigny Opera House Tours", score: 49 },
        { name: "Washington Square Park Food Stalls", score: 54 },
        { name: "Royal Street Art Galleries", score: 51 }
      ],
      gems: [
        { name: "Mimi's in the Marigny", score: 21 },
        { name: "St. Roch Market", score: 31 },
        { name: "Kajun's Pub", score: 19 },
        { name: "Flora Gallery & Coffee Shop", score: 24 },
        { name: "Who Dat Coffee Cafe", score: 28 }
      ]
    },
    "Bywater": {
      areaScore: 31,
      traps: [
        { name: "Country Club", score: 48 },
        { name: "Elizabeth's Restaurant (brunch)", score: 55 },
        { name: "Studio BE (on tour days)", score: 42 },
        { name: "Crescent Park Entrance", score: 51 },
        { name: "Joint BBQ (peak hours)", score: 46 }
      ],
      gems: [
        { name: "Bacchanal Wine", score: 19 },
        { name: "Bratz Y'all", score: 26 },
        { name: "Bywater American Bistro", score: 33 },
        { name: "Saturn Bar", score: 17 },
        { name: "Satsuma Cafe", score: 28 }
      ]
    }
  };

  // Add trap score data to neighborhoods
  Object.keys(locationDatabase).forEach(city => {
    if (locationDatabase[city].neighborhoods) {
      locationDatabase[city].neighborhoods.forEach(neighborhood => {
        const neighborhoodName = neighborhood.name;
        if (trapScoreDatabase[neighborhoodName]) {
          neighborhood.trapScore = trapScoreDatabase[neighborhoodName].areaScore;
        }
      });
    }
  });
  
  // Sample data for hotspots with real coordinates
  const hotspots = [
    { id: 'new-york', name: 'New York', traffic: 'high', coordinates: [40.7128, -74.0060] },
    { id: 'paris', name: 'Paris', traffic: 'high', coordinates: [48.8566, 2.3522] },
    { id: 'tokyo', name: 'Tokyo', traffic: 'medium', coordinates: [35.6762, 139.6503] },
    { id: 'rio-de-janeiro', name: 'Rio de Janeiro', traffic: 'medium', coordinates: [-22.9068, -43.1729] },
    { id: 'rome', name: 'Rome', traffic: 'medium', coordinates: [41.9028, 12.4964] },
    { id: 'sydney', name: 'Sydney', traffic: 'low', coordinates: [-33.8688, 151.2093] },
    { id: 'san-francisco', name: 'San Francisco', traffic: 'low', coordinates: [37.7749, -122.4194] },
    { id: 'new-orleans', name: 'New Orleans', traffic: 'medium', coordinates: [29.9511, -90.0715] },
    // New hotspots for Russia and Africa
    { id: 'moscow', name: 'Moscow', traffic: 'high', coordinates: [55.7558, 37.6173] },
    { id: 'saint-petersburg', name: 'Saint Petersburg', traffic: 'medium', coordinates: [59.9311, 30.3609] },
    { id: 'cape-town', name: 'Cape Town', traffic: 'medium', coordinates: [-33.9249, 18.4241] },
    { id: 'marrakech', name: 'Marrakech', traffic: 'high', coordinates: [31.6295, -7.9811] },
    { id: 'cairo', name: 'Cairo', traffic: 'high', coordinates: [30.0444, 31.2357] }
  ];
  
  // Initialize world map
  function initWorldMap() {
    // Create map
    worldMap = L.map('world-map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
      scrollWheelZoom: true
    });
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(worldMap);
    
    // Add markers for hotspots
    hotspots.forEach((spot, index) => {
      // Create custom marker element
      const markerHtml = document.createElement('div');
      markerHtml.className = `custom-map-marker`;
      
      // Add class based on traffic level
      if (spot.traffic === 'high') {
        markerHtml.classList.add('high-marker');
      } else if (spot.traffic === 'medium') {
        markerHtml.classList.add('medium-marker');
      } else {
        markerHtml.classList.add('low-marker');
      }
      
      // Add random animation delay
      const randomDelayClass = `delay-${Math.floor(Math.random() * 12) + 1}`;
      markerHtml.classList.add(randomDelayClass);
      
      // Create custom icon
      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker-container',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      // Create marker
      const marker = L.marker(spot.coordinates, {
        icon: customIcon,
        title: spot.name
      }).addTo(worldMap);
      
      // Add label
      const labelIcon = L.divIcon({
        html: `<div class="hotspot-label">${spot.name}</div>`,
        className: 'label-container',
        iconSize: [100, 20],
        iconAnchor: [50, 0]
      });
      
      const labelMarker = L.marker(spot.coordinates, {
        icon: labelIcon,
        zIndexOffset: 1000
      }).addTo(worldMap);
      
      // Add popup
      const popupContent = `
        <div class="popup-title">${spot.name}</div>
        <div class="popup-tourist-level ${spot.traffic}">
          Tourist Level: ${spot.traffic.charAt(0).toUpperCase() + spot.traffic.slice(1)}
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      // Add click event
      marker.on('click', function() {
        searchInput.value = spot.name;
        updateSearchDropdown(spot.name);
        
        if (locationDatabase[spot.name]) {
          showCityMap(spot.name);
        }
      });
      
      // Make labels clickable too
      labelMarker.on('click', function() {
        searchInput.value = spot.name;
        updateSearchDropdown(spot.name);
        
        if (locationDatabase[spot.name]) {
          showCityMap(spot.name);
        }
      });
    });
  }
  
  // Initialize city map
  function initCityMap(city, highlight = null) {
    // Clear previous markers
    if (cityMap) {
      cityMap.remove();
    }
    
    // Get city coordinates
    const cityData = locationDatabase[city];
    if (!cityData || !cityData.coordinates) {
      console.error('City data not found:', city);
      return;
    }
    
    // Create map
    cityMap = L.map('city-map-element', {
      center: cityData.coordinates,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true
    });
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(cityMap);
    
    // Update city title
    cityTitle.textContent = city;
    
    // Add markers for neighborhoods
    if (cityData.neighborhoods) {
      cityData.neighborhoods.forEach((nbhd, index) => {
        if (!nbhd.coordinates) return;
        
        // Create custom marker element
        const markerHtml = document.createElement('div');
        markerHtml.className = 'custom-map-marker';
        
        // Set color based on tourist level
        if (nbhd.touristLevel === 'high') {
          markerHtml.classList.add('high-marker');
        } else if (nbhd.touristLevel === 'medium') {
          markerHtml.classList.add('medium-marker');
        } else {
          markerHtml.classList.add('low-marker');
        }
        
        // Add random animation delay
        const randomDelayClass = `delay-${Math.floor(Math.random() * 12) + 1}`;
        markerHtml.classList.add(randomDelayClass);
        
        // Create custom icon
        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-marker-container',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        // Create marker
        const marker = L.marker(nbhd.coordinates, {
          icon: customIcon,
          title: nbhd.name
        }).addTo(cityMap);
        
        cityMarkers.push(marker);
        
        // Add popup
        const popupContent = `
          <div class="popup-title">${nbhd.name}</div>
          <div class="popup-description">Neighborhood</div>
          <div class="popup-tourist-level ${nbhd.touristLevel}">
            Tourist Level: ${nbhd.touristLevel.charAt(0).toUpperCase() + nbhd.touristLevel.slice(1)}
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Highlight marker if it matches the highlight parameter
        if (highlight && nbhd.name === highlight) {
          marker.openPopup();
        }
      });
    }
    
    // Add markers for attractions
    if (cityData.attractions) {
      cityData.attractions.forEach((attr, index) => {
        if (!attr.coordinates) return;
        
        // Create custom marker element
        const markerHtml = document.createElement('div');
        markerHtml.className = 'custom-map-marker';
        
        // Set color based on tourist level
        if (attr.touristLevel === 'high') {
          markerHtml.classList.add('high-marker');
        } else if (attr.touristLevel === 'medium') {
          markerHtml.classList.add('medium-marker');
        } else {
          markerHtml.classList.add('low-marker');
        }
        
        // Add random animation delay
        const randomDelayClass = `delay-${Math.floor(Math.random() * 12) + 1}`;
        markerHtml.classList.add(randomDelayClass);
        
        // Create custom icon
        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-marker-container',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        // Create marker
        const marker = L.marker(attr.coordinates, {
          icon: customIcon,
          title: attr.name
        }).addTo(cityMap);
        
        cityMarkers.push(marker);
        
        // Add popup
        const popupContent = `
          <div class="popup-title">${attr.name}</div>
          <div class="popup-description">Attraction</div>
          <div class="popup-tourist-level ${attr.touristLevel}">
            Tourist Level: ${attr.touristLevel.charAt(0).toUpperCase() + attr.touristLevel.slice(1)}
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Highlight marker if it matches the highlight parameter
        if (highlight && attr.name === highlight) {
          marker.openPopup();
        }
      });
    }
  }
  
  // Function to show trap score for a location
  function showTrapScore(location, isCountry = false) {
    // Check if we have trap score data for this location
    let trapData;
    
    if (isCountry) {
      trapData = countryTrapScoreDatabase[location];
    } else {
      trapData = trapScoreDatabase[location];
    }
    
    if (!trapData) {
      // If no direct match but it's a city, try getting country data
      if (!isCountry && cityToCountry[location]) {
        const country = cityToCountry[location];
        trapData = countryTrapScoreDatabase[country];
        
        if (trapData) {
          console.log(`No trap data for ${location}, showing country data for ${country} instead`);
        }
      }
      
      if (!trapData) {
        trapScoreContainer.classList.remove('active');
        return;
      }
    }
    
    // Update the location name and area score
    trapLocationName.textContent = location;
    areaScoreValue.textContent = trapData.areaScore;
    
    // Set the appropriate color class for the area score
    areaScoreValue.className = 'score-value';
    areaScoreValue.classList.add(getAreaScoreColorClass(trapData.areaScore));
    
    // Clear existing lists
    touristTrapsList.innerHTML = '';
    localGemsList.innerHTML = '';
    
    // Populate tourist traps
    trapData.traps.forEach(trap => {
      const trapItem = document.createElement('div');
      trapItem.className = 'place-item';
      
      // Get the appropriate color class based on score
      const colorClass = getScoreColorClass(trap.score);
      
      trapItem.innerHTML = `
        <div class="place-name">${trap.name}</div>
        <div class="place-score ${colorClass}">${trap.score}</div>
      `;
      touristTrapsList.appendChild(trapItem);
    });
    
    // Populate local gems
    trapData.gems.forEach(gem => {
      const gemItem = document.createElement('div');
      gemItem.className = 'place-item';
      
      // Get the appropriate color class based on score
      const colorClass = getScoreColorClass(gem.score);
      
      gemItem.innerHTML = `
        <div class="place-name">${gem.name}</div>
        <div class="place-score ${colorClass}">${gem.score}</div>
      `;
      localGemsList.appendChild(gemItem);
    });
    
    // Show the trap score container
    trapScoreContainer.classList.add('active');
  }
  
  // Helper function to get the color class based on score for places
  function getScoreColorClass(score) {
    if (score <= 10) return 'score-0-10';
    else if (score <= 20) return 'score-11-20';
    else if (score <= 30) return 'score-21-30';
    else if (score <= 40) return 'score-31-40';
    else if (score <= 50) return 'score-41-50';
    else if (score <= 60) return 'score-51-60';
    else if (score <= 70) return 'score-61-70';
    else if (score <= 80) return 'score-71-80';
    else if (score <= 90) return 'score-81-90';
    else return 'score-91-100';
  }
  
  // Helper function to get the color class based on score for area scores
  function getAreaScoreColorClass(score) {
    if (score <= 10) return 'area-score-0-10';
    else if (score <= 20) return 'area-score-11-20';
    else if (score <= 30) return 'area-score-21-30';
    else if (score <= 40) return 'area-score-31-40';
    else if (score <= 50) return 'area-score-41-50';
    else if (score <= 60) return 'area-score-51-60';
    else if (score <= 70) return 'area-score-61-70';
    else if (score <= 80) return 'area-score-71-80';
    else if (score <= 90) return 'area-score-81-90';
    else return 'area-score-91-100';
  }
  
  // Toggle heatmap view when heatmap icon is clicked
  heatmapIcon.addEventListener('click', function() {
    cityMapContainer.classList.remove('active');
    trapScoreContainer.classList.remove('active');
    worldHeatmap.style.display = 'block';
    worldHeatmap.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Function to check if a city exists in the database
  function isValidCity(city) {
    return !!locationDatabase[city];
  }

  // Update search dropdown based on input
  function updateSearchDropdown(searchTerm) {
    if (!searchTerm) {
      searchDropdown.classList.remove('active');
      return;
    }
    
    searchTerm = searchTerm.toLowerCase().trim();
    searchDropdown.innerHTML = '';
    
    // Check for exact country match first
    const exactCountryMatch = Object.keys(countryDatabase).find(country => 
      country.toLowerCase() === searchTerm
    );
    
    if (exactCountryMatch) {
      generateCountryDropdown(exactCountryMatch);
      return;
    }
    
    // Check for exact city match
    const exactCityMatch = Object.keys(locationDatabase).find(city => 
      city.toLowerCase() === searchTerm
    );
    
    // If there's an exact match, generate dropdown with that city at the top
    if (exactCityMatch) {
      generateLocationDropdown(exactCityMatch);
      return;
    }
    
    // Get country partial matches
    const countryMatches = Object.keys(countryDatabase).filter(country => 
      country.toLowerCase().includes(searchTerm)
    );
    
    // Get city partial matches
    const cityMatches = Object.keys(locationDatabase).filter(city => 
      city.toLowerCase().includes(searchTerm)
    );
    
    // Get neighborhood matches across all cities
    let neighborhoodMatches = [];
    Object.keys(locationDatabase).forEach(city => {
      if (locationDatabase[city].neighborhoods) {
        const matches = locationDatabase[city].neighborhoods
          .filter(n => n.name.toLowerCase().includes(searchTerm))
          .map(n => ({
            name: n.name,
            parentCity: city,
            touristLevel: n.touristLevel
          }));
        neighborhoodMatches = [...neighborhoodMatches, ...matches];
      }
    });
    
    // If no results at all, hide dropdown and return
    if (countryMatches.length === 0 && cityMatches.length === 0 && neighborhoodMatches.length === 0) {
      searchDropdown.classList.remove('active');
      return;
    }
    
    // If we have country matches, they get priority
    if (countryMatches.length > 0) {
      const mainCountry = countryMatches[0];
      
      // Create a highlighted main result for country
      const mainCountryItem = document.createElement('div');
      mainCountryItem.className = 'search-dropdown-country';
      mainCountryItem.innerHTML = `<strong>${mainCountry}</strong> <span class="top-pick">(top pick)</span>`;
      mainCountryItem.setAttribute('data-country', mainCountry);
      searchDropdown.appendChild(mainCountryItem);
      
      // Add cities from this country
      if (countryDatabase[mainCountry] && countryDatabase[mainCountry].cities.length > 0) {
        const countryHeader = document.createElement('div');
        countryHeader.className = 'search-dropdown-header';
        countryHeader.textContent = `Cities in ${mainCountry}:`;
        searchDropdown.appendChild(countryHeader);
        
        countryDatabase[mainCountry].cities.forEach(city => {
          const cityItem = document.createElement('div');
          cityItem.className = 'search-dropdown-city';
          cityItem.textContent = city;
          cityItem.setAttribute('data-city', city);
          cityItem.setAttribute('data-parent-country', mainCountry);
          searchDropdown.appendChild(cityItem);
        });
      }
      
      // Add other matching countries (minus the first one)
      const otherCountries = countryMatches.slice(1, 3); // Just take 2 more countries to avoid crowding
      if (otherCountries.length > 0) {
        const otherCountriesHeader = document.createElement('div');
        otherCountriesHeader.className = 'search-dropdown-header';
        otherCountriesHeader.textContent = "Other matching countries:";
        searchDropdown.appendChild(otherCountriesHeader);
        
        otherCountries.forEach(country => {
          const countryItem = document.createElement('div');
          countryItem.className = 'search-dropdown-country';
          countryItem.textContent = country;
          countryItem.setAttribute('data-country', country);
          searchDropdown.appendChild(countryItem);
        });
      }
    }
    // If we have city matches but no country matches
    else if (cityMatches.length > 0) {
      const mainCity = cityMatches[0];
      
      // Create a highlighted main result for city
      const mainCityItem = document.createElement('div');
      mainCityItem.className = 'search-dropdown-city';
      mainCityItem.innerHTML = `<strong>${mainCity}</strong> <span class="top-pick">(top pick)</span>`;
      mainCityItem.setAttribute('data-city', mainCity);
      
      // Add country information if available
      const country = cityToCountry[mainCity];
      if (country) {
        mainCityItem.setAttribute('data-parent-country', country);
      }
      
      searchDropdown.appendChild(mainCityItem);
      
      // Add neighborhoods of the main city
      if (locationDatabase[mainCity] && locationDatabase[mainCity].neighborhoods) {
        // Sort neighborhoods by tourist level (high to low for better recommendations)
        const sortedNeighborhoods = [...locationDatabase[mainCity].neighborhoods].sort((a, b) => {
          const levels = { "high": 3, "medium": 2, "low": 1 };
          return levels[b.touristLevel] - levels[a.touristLevel];
        });
        
        // Take top 4 neighborhoods
        sortedNeighborhoods.slice(0, 4).forEach(neighborhood => {
          const item = document.createElement('div');
          item.className = 'search-dropdown-neighborhood';
          item.textContent = neighborhood.name;
          item.dataset.parentCity = mainCity;
          searchDropdown.appendChild(item);
        });
      }
      
      // Add other matching cities (minus the first one)
      const otherCities = cityMatches.slice(1, 3); // Just take 2 more cities to avoid crowding
      if (otherCities.length > 0) {
        const otherCitiesHeader = document.createElement('div');
        otherCitiesHeader.className = 'search-dropdown-header';
        otherCitiesHeader.textContent = "Other matching cities:";
        searchDropdown.appendChild(otherCitiesHeader);
        
        otherCities.forEach(city => {
          const cityItem = document.createElement('div');
          cityItem.className = 'search-dropdown-city';
          cityItem.textContent = city;
          cityItem.setAttribute('data-city', city);
          
          // Add country information if available
          const country = cityToCountry[city];
          if (country) {
            cityItem.setAttribute('data-parent-country', country);
          }
          
          searchDropdown.appendChild(cityItem);
        });
      }
    }
    // If no city or country matches but we have neighborhood matches
    else if (neighborhoodMatches.length > 0) {
      // Group neighborhoods by parent city
      const groupedNeighborhoods = {};
      neighborhoodMatches.forEach(n => {
        if (!groupedNeighborhoods[n.parentCity]) {
          groupedNeighborhoods[n.parentCity] = [];
        }
        groupedNeighborhoods[n.parentCity].push(n);
      });
      
      // Add grouped neighborhoods
      Object.keys(groupedNeighborhoods).forEach(city => {
        // Add city as header
        const cityHeader = document.createElement('div');
        cityHeader.className = 'search-dropdown-city';
        cityHeader.textContent = city;
        cityHeader.setAttribute('data-city', city);
        
        // Add country information if available
        const country = cityToCountry[city];
        if (country) {
          cityHeader.setAttribute('data-parent-country', country);
        }
        
        searchDropdown.appendChild(cityHeader);
        
        // Add neighborhoods below it
        groupedNeighborhoods[city].slice(0, 3).forEach(neighborhood => {
          const neighborhoodItem = document.createElement('div');
          neighborhoodItem.className = 'search-dropdown-neighborhood';
          neighborhoodItem.textContent = neighborhood.name;
          neighborhoodItem.dataset.parentCity = city;
          searchDropdown.appendChild(neighborhoodItem);
        });
      });
    }
    
    // Attach event listeners to all dropdown items
    attachDropdownEventListeners();
    
    // Show the dropdown
    searchDropdown.classList.add('active');
  }
  
  // Function to generate dropdown for a country
  function generateCountryDropdown(country) {
    // Clear the existing dropdown
    searchDropdown.innerHTML = '';
    
    // Add the country as the top selection with highlight
    const countryItem = document.createElement('div');
    countryItem.className = 'search-dropdown-country';
    countryItem.innerHTML = `<strong>${country}</strong> <span class="top-pick">(top pick)</span>`;
    countryItem.setAttribute('data-country', country);
    searchDropdown.appendChild(countryItem);
    
    // Add cities in this country
    if (countryDatabase[country] && countryDatabase[country].cities.length > 0) {
      const citiesHeader = document.createElement('div');
      citiesHeader.className = 'search-dropdown-header';
      citiesHeader.textContent = `Cities in ${country}:`;
      searchDropdown.appendChild(citiesHeader);
      
      countryDatabase[country].cities.forEach(city => {
        const cityItem = document.createElement('div');
        cityItem.className = 'search-dropdown-city';
        cityItem.textContent = city;
        cityItem.setAttribute('data-city', city);
        cityItem.setAttribute('data-parent-country', country);
        searchDropdown.appendChild(cityItem);
      });
    }
    
    // Attach event listeners to all dropdown items
    attachDropdownEventListeners();
    
    // Show the dropdown
    searchDropdown.classList.add('active');
  }
  
  // Function to generate dropdown for locations
  function generateLocationDropdown(city) {
    // Clear the existing dropdown
    searchDropdown.innerHTML = '';
    
    // Add the city as a top selection with highlight
    const cityItem = document.createElement('div');
    cityItem.className = 'search-dropdown-city';
    cityItem.innerHTML = `<strong>${city}</strong> <span class="top-pick">(top pick)</span>`;
    cityItem.setAttribute('data-city', city);
    
    // Add country information if available
    const country = cityToCountry[city];
    if (country) {
      cityItem.setAttribute('data-parent-country', country);
    }
    
    searchDropdown.appendChild(cityItem);
    
    // If we have neighborhood data for this city, add those
    const cityData = locationDatabase[city];
    if (cityData && cityData.neighborhoods) {
      // Sort neighborhoods by tourist level (high to low)
      const sortedNeighborhoods = [...cityData.neighborhoods].sort((a, b) => {
        const levels = { "high": 3, "medium": 2, "low": 1 };
        return levels[b.touristLevel] - levels[a.touristLevel];
      });
      
      // Adding top neighborhoods (up to 4)
      sortedNeighborhoods.slice(0, 4).forEach(neighborhood => {
        const neighborhoodItem = document.createElement('div');
        neighborhoodItem.className = 'search-dropdown-neighborhood';
        neighborhoodItem.textContent = neighborhood.name;
        neighborhoodItem.dataset.parentCity = city;
        searchDropdown.appendChild(neighborhoodItem);
      });
    }
    
    // Attach event listeners to all dropdown items
    attachDropdownEventListeners();
    
    // Show the dropdown
    searchDropdown.classList.add('active');
  }
  
  // Attach event listeners to all dropdown items
  function attachDropdownEventListeners() {
    // First, remove any existing event listeners
    const dropdownItems = searchDropdown.querySelectorAll('.search-dropdown-country, .search-dropdown-city, .search-dropdown-neighborhood');
    
    dropdownItems.forEach(item => {
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      newItem.addEventListener('click', function(e) {
        e.stopPropagation();
        handleDropdownItemSelection(this);
      });
    });
  }

  // Function to handle dropdown item selection
  function handleDropdownItemSelection(selectedItem) {
    // Get country, city and neighborhood information
    let countryName = "";
    let cityName = "";
    let neighborhoodName = "";
    
    if (selectedItem.classList.contains('search-dropdown-country')) {
      // Handle country selection
      countryName = selectedItem.getAttribute('data-country');
      if (!countryName) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = selectedItem.innerHTML;
        countryName = tempDiv.textContent.replace('(top pick)', '').trim();
      }
      
      console.log("Selected country:", countryName);
      
      // Fill the search input with the selected country
      searchInput.value = countryName;
      
      // No map for country level, just show trap score
      showTrapScore(countryName, true);
      
    } else if (selectedItem.classList.contains('search-dropdown-city')) {
      // Handle city selection
      if (selectedItem.hasAttribute('data-city')) {
        cityName = selectedItem.getAttribute('data-city');
      } else {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = selectedItem.innerHTML;
        cityName = tempDiv.textContent.replace('(top pick)', '').trim();
      }
      
      // Get parent country if available
      if (selectedItem.hasAttribute('data-parent-country')) {
        countryName = selectedItem.getAttribute('data-parent-country');
      }
      
      console.log("Selected city:", cityName, "in", countryName || "unknown country");
      
      // Fill the search input with the selected city
      searchInput.value = cityName;
      
      // Show city map for the selected city
      if (isValidCity(cityName)) {
        showCityMap(cityName);
        
        // Show trap score for the city
        showTrapScore(cityName);
      }
    } else if (selectedItem.classList.contains('search-dropdown-neighborhood')) {
      // Handle neighborhood selection
      neighborhoodName = selectedItem.textContent.trim();
      
      // Extract city name from the data attribute
      const parentCity = selectedItem.dataset.parentCity;
      
      console.log("Selected neighborhood:", neighborhoodName, "in", parentCity);
      
      // Fill the search input with the selected neighborhood
      searchInput.value = neighborhoodName;
      
      // Show city map for the parent city and highlight the neighborhood
      if (parentCity && isValidCity(parentCity)) {
        showCityMap(parentCity, neighborhoodName);
      }

      // Show trap score for the specific neighborhood
      showTrapScore(neighborhoodName);
    }
    
    // Hide the dropdown
    searchDropdown.classList.remove('active');
  }

  // Function to show city map
  function showCityMap(city, highlight = null) {
    if (locationDatabase[city]) {
      worldHeatmap.style.display = 'none';
      cityMapContainer.classList.add('active');
      
      // Initialize the city map
      initCityMap(city, highlight);
      
      cityMapContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error("City not found in database:", city);
    }
  }
  
  // Handle search input
  searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.trim();
    updateSearchDropdown(searchTerm);
  });
  
  // Hide dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
      searchDropdown.classList.remove('active');
    }
  });
  
  // Show world map when clicking heatmap icon
  heatmapIcon.addEventListener('click', function() {
    cityMapContainer.classList.remove('active');
    trapScoreContainer.classList.remove('active');
    worldHeatmap.style.display = 'block';
    worldHeatmap.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Add search functionality
  const searchForm = document.querySelector('.search-box');
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
      updateSearchDropdown(searchTerm);
      
      // If dropdown is populated, simulate clicking the first item
      if (searchDropdown.classList.contains('active') && searchDropdown.children.length > 0) {
        searchDropdown.children[0].click();
      }
    }
  });
  
  // Make search button work
  const searchButton = document.querySelector('.search-button');
  searchButton.addEventListener('click', function() {
    const event = new Event('submit');
    searchForm.dispatchEvent(event);
  });
  
  // Initialize maps
  initWorldMap();
}); 