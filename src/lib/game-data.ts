
import type { GameState, Node, Edge, Board } from './types';

const nodes: Node[] = [
  // --- Far North-West ---
  { id: 1, name: "Lakeside View", x: 0.05, y: 0.05 },
  { id: 2, name: "Hilltop Observatory", x: 0.12, y: 0.08 },
  { id: 3, name: "Green Valley", x: 0.1, y: 0.15 },
  { id: 4, name: "Northwood Creek", x: 0.2, y: 0.06 },
  { id: 5, name: "Westwood Trail", x: 0.08, y: 0.22 },

  // --- North-Central ---
  { id: 6, name: "University North", x: 0.3, y: 0.1 },
  { id: 7, name: "Central Park North", x: 0.4, y: 0.08 },
  { id: 8, name: "Highland Avenue", x: 0.35, y: 0.18 },
  { id: 9, name: "Uptown Square", x: 0.45, y: 0.15 },
  { id: 10, name: "North Bridge (West)", x: 0.28, y: 0.25 }, // River West Bank

  // --- North-East ---
  { id: 11, name: "Eastwood Heights", x: 0.6, y: 0.07 },
  { id: 12, name: "Industrial Gates", x: 0.7, y: 0.05 },
  { id: 13, name: "Factory Overlook", x: 0.8, y: 0.1 },
  { id: 14, name: "Skyline Business Park", x: 0.65, y: 0.18 },
  { id: 15, name: "East Station", x: 0.9, y: 0.08 },
  { id: 16, name: "Cargo Hub", x: 0.95, y: 0.15 },
  { id: 17, name: "North Bridge (East)", x: 0.55, y: 0.24 }, // River East Bank
  { id: 18, name: "Power Grid", x: 0.85, y: 0.22 },
  { id: 19, name: "Airport North", x: 0.96, y: 0.04 },
  
  // --- Mid-West ---
  { id: 20, name: "Westside Market", x: 0.15, y: 0.3 },
  { id: 21, name: "Oakwood District", x: 0.08, y: 0.38 },
  { id: 22, name: "Community Gardens", x: 0.18, y: 0.45 },
  { id: 23, name: "Riverbend Docks", x: 0.29, y: 0.35 }, // River West Bank
  { id: 24, name: "Memorial Park", x: 0.22, y: 0.25 },
  { id: 25, name: "Arts Center", x: 0.1, y: 0.5 },
  { id: 26, name: "City College", x: 0.2, y: 0.55 },

  // --- Central ---
  { id: 27, name: "Midtown Plaza", x: 0.4, y: 0.3 },
  { id: 28, name: "Grand Central", x: 0.5, y: 0.32 },
  { id: 29, name: "Library Square", x: 0.42, y: 0.42 },
  { id: 30, name: "The Interchange", x: 0.52, y: 0.48 },
  { id: 31, name: "City Hall", x: 0.45, y: 0.55 },
  { id: 32, name: "Museum of History", x: 0.38, y: 0.6 },
  { id: 33, name: "East Bank Promenade", x: 0.56, y: 0.38 }, // River East Bank
  { id: 34, name: "Old Ferry Landing", x: 0.58, y: 0.52 }, // River East Bank

  // --- Mid-East ---
  { id: 35, name: "Tech Campus East", x: 0.68, y: 0.3 },
  { id: 36, name: "Hospital Complex", x: 0.78, y: 0.35 },
  { id: 37, name: "Eastside Mall", x: 0.88, y: 0.32 },
  { id: 38, name: "Expressway Exit", x: 0.75, y: 0.45 },
  { id: 39, name: "Waterfront Park (East)", x: 0.6, y: 0.3 }, // River East Bank
  { id: 40, name: "The Foundry", x: 0.92, y: 0.42 },
  { id: 41, name: "Logistics South", x: 0.82, y: 0.5 },
  
  // --- South-West ---
  { id: 42, name: "Historic Port", x: 0.31, y: 0.65 }, // River West Bank
  { id: 43, name: "Old Town Market", x: 0.22, y: 0.68 },
  { id: 44, name: "South Station", x: 0.15, y: 0.75 },
  { id: 45, name: "Fisherman's Wharf", x: 0.05, y: 0.65 },
  { id: 46, name: "The Marina", x: 0.08, y: 0.8 },
  { id: 47, name: "Lighthouse Point", x: 0.02, y: 0.9 },
  { id: 48, name: "Ocean View", x: 0.12, y: 0.95 },
  
  // --- South-Central ---
  { id: 49, name: "South Bridge (West)", x: 0.28, y: 0.8 }, // River West Bank
  { id: 50, name: "Financial District", x: 0.4, y: 0.7 },
  { id: 51, "name": "Convention Center", x: 0.48, y: 0.65 },
  { id: 52, "name": "Theater District", x: 0.35, y: 0.85 },
  { id: 53, "name": "Union Square", x: 0.46, y: 0.78 },
  { id: 54, "name": "South Ferry Terminal", x: 0.55, y: 0.65 }, // River East Bank
  
  // --- South-East ---
  { id: 55, "name": "South Bridge (East)", x: 0.58, y: 0.82 }, // River East Bank
  { id: 56, "name": "Stadium", x: 0.65, y: 0.75 },
  { id: 57, "name": "Pleasure Gardens", x: 0.75, y: 0.68 },
  { id: 58, "name": "Amusement Pier", x: 0.85, y: 0.78 },
  { id: 59, "name": "Palm Resort", x: 0.95, y: 0.7 },
  { id: 60, "name": "Sunset Beach", x: 0.9, y: 0.9 },
  { id: 61, "name": "The Grand Hotel", x: 0.78, y: 0.95 },
  { id: 62, "name": "Tropicana", x: 0.68, y: 0.9 },
  
  // Add more nodes to reach 120 total, filling gaps
  // Northwest quadrant
  { id: 63, name: "Maple Creek", x: 0.18, y: 0.12 },
  { id: 64, name: "Pine Ridge", x: 0.25, y: 0.02 },
  { id: 65, name: "Lookout Mountain", x: 0.02, y: 0.1 },
  { id: 66, name: "Whispering Woods", x: 0.04, y: 0.3 },

  // North-Central
  { id: 67, name: "Academy Halls", x: 0.33, y: 0.04 },
  { id: 68, name: "Civic Fountain", x: 0.48, y: 0.09 },

  // Northeast
  { id: 69, name: "Smokestack Alley", x: 0.75, y: 0.15 },
  { id: 70, name: "Ironworks", x: 0.88, y: 0.12 },
  { id: 71, name: "East Gate", x: 0.98, y: 0.1 },

  // West-Mid
  { id: 72, name: "Artisan's Row", x: 0.12, y: 0.28 },
  { id: 73, name: "West End Station", x: 0.25, y: 0.38 },
  { id: 74, name: "Riverside West Apts", x: 0.3, y: 0.45 },
  { id: 75, name: "The Boathouse", x: 0.29, y: 0.55 }, // River West Bank

  // Central
  { id: 76, name: "Main Library", x: 0.48, y: 0.4 },
  { id: 77, name: "Courthouse", x: 0.39, y: 0.5 },

  // East-Mid
  { id: 78, name: "East Clinic", x: 0.72, y: 0.25 },
  { id: 79, name: "St. Mary's Hospital", x: 0.84, y: 0.28 },
  { id: 80, name: "The Emporium", x: 0.94, y: 0.25 },
  { id: 81, name: "Warehouse District", x: 0.9, y: 0.5 },
  { id: 82, name: "Shipping Depot", x: 0.65, y: 0.5 },
  { id: 83, name: "Riverside East Apts", x: 0.57, y: 0.45 }, // River East Bank
  
  // Southwest
  { id: 84, name: "Maritime Museum", x: 0.18, y: 0.62 },
  { id: 85, name: "South Port", x: 0.25, y: 0.72 },
  { id: 86, name: "Beach Trail", x: 0.04, y: 0.72 },
  { id: 87, name: "Cove Market", x: 0.1, y: 0.88 },
  
  // South-Central
  { id: 88, name: "Capital Theater", x: 0.3, y: 0.75 },
  { id: 89, name: "Bankers Tower", x: 0.42, y: 0.75 },
  { id: 90, name: "Central Station", x: 0.45, y: 0.9 },
  { id: 91, name: "Castle Hill", x: 0.35, y: 0.95 },

  // Southeast
  { id: 92, name: "Sports Arena", x: 0.6, y: 0.65 },
  { id: 93, name: "The Midway", x: 0.72, y: 0.6 },
  { id: 94, name: "Boardwalk Shops", x: 0.8, y: 0.72 },
  { id: 95, name: "Paradise Hotel", x: 0.92, y: 0.65 },
  { id: 96, name: "Sunken Gardens", x: 0.88, y: 0.85 },
  { id: 97, name: "Botanic Park", x: 0.7, y: 0.85 },
  { id: 98, name: "The Zoo", x: 0.62, y: 0.95 },
  { id: 99, name: "Bayview Ferry", x: 0.56, y: 0.92 }, // River East Bank
  { id: 100, name: "South Inlet", x: 0.3, y: 0.9 }, // River West Bank

  // More filler nodes
  { id: 101, name: "Old Mill Crossing", x: 0.15, y: 0.2 },
  { id: 102, name: "Founders Bridge", x: 0.45, y: 0.25 },
  { id: 103, name: "Steelworks", x: 0.78, y: 0.08 },
  { id: 104, name: "Newtown Station", x: 0.85, y: 0.4 },
  { id: 105, name: "Western Promenade", x: 0.04, y: 0.45 },
  { id: 106, name: "Central Exchange", x: 0.5, y: 0.6 },
  { id: 107, name: "Regency Hotel", x: 0.4, y: 0.82 },
  { id: 108, name: "Exhibition Halls", x: 0.55, y: 0.75 },
  { id: 109, name: "Victory Park", x: 0.68, y: 0.65 },
  { id: 110, name: "The Esplanade", x: 0.8, y: 0.6 },
  { id: 111, name: "Sunny Isles", x: 0.95, y: 0.8 },
  { id: 112, name: "West Docks", x: 0.28, y: 0.48 },
  { id: 113, name: "East Docks", x: 0.62, y: 0.42 },
  { id: 114, name: "North Pier", x: 0.3, y: 0.3 },
  { id: 115, name: "South Pier", x: 0.58, y: 0.6 },
  { id: 116, name: "Hillside Houses", x: 0.15, y: 0.02 },
  { id: 117, name: "Ridgeview Apts", x: 0.22, y: 0.18 },
  { id: 118, name: "Eastend Suburbs", x: 0.9, y: 0.58 },
  { id: 119, name: "South Shore Apts", x: 0.2, y: 0.85 },
  { id: 120, name: "Bayfront Condos", x: 0.75, y: 0.82 },
];

const edges: Edge[] = [
  // --- AUTO (very dense local connections) ---
  // NW
  { from: 1, to: 2, transport: 'AUTO' }, { from: 1, to: 3, transport: 'AUTO' }, { from: 1, to: 65, transport: 'AUTO' },
  { from: 2, to: 3, transport: 'AUTO' }, { from: 2, to: 4, transport: 'AUTO' }, { from: 2, to: 63, transport: 'AUTO' },
  { from: 3, to: 5, transport: 'AUTO' }, { from: 3, to: 101, transport: 'AUTO' },
  { from: 4, to: 6, transport: 'AUTO' }, { from: 4, to: 64, transport: 'AUTO' },
  { from: 5, to: 20, transport: 'AUTO' }, { from: 5, to: 66, transport: 'AUTO' }, { from: 5, to: 72, transport: 'AUTO' },
  { from: 63, to: 4, transport: 'AUTO' }, { from: 63, to: 6, transport: 'AUTO' }, { from: 63, to: 117, transport: 'AUTO' },
  { from: 116, to: 1, transport: 'AUTO' }, { from: 116, to: 2, transport: 'AUTO' }, { from: 116, to: 64, transport: 'AUTO' },
  { from: 65, to: 3, transport: 'AUTO' }, { from: 65, to: 66, transport: 'AUTO' },
  { from: 66, to: 21, transport: 'AUTO' }, { from: 66, to: 105, transport: 'AUTO' },
  { from: 101, to: 20, transport: 'AUTO' }, { from: 101, to: 117, transport: 'AUTO' },
  { from: 117, to: 24, transport: 'AUTO' }, { from: 117, to: 8, transport: 'AUTO' },

  // NC
  { from: 6, to: 7, transport: 'AUTO' }, { from: 6, to: 8, transport: 'AUTO' },
  { from: 7, to: 9, transport: 'AUTO' }, { from: 7, to: 68, transport: 'AUTO' },
  { from: 8, to: 10, transport: 'AUTO' }, { from: 8, to: 27, transport: 'AUTO' },
  { from: 9, to: 11, transport: 'AUTO' }, { from: 9, to: 102, transport: 'AUTO' },
  { from: 10, to: 24, transport: 'AUTO' }, { from: 10, to: 114, transport: 'AUTO' },
  { from: 67, to: 4, transport: 'AUTO' }, { from: 67, to: 6, transport: 'AUTO' },
  { from: 68, to: 7, transport: 'AUTO' }, { from: 68, to: 11, transport: 'AUTO' },
  { from: 102, to: 27, transport: 'AUTO' }, { from: 102, to: 28, transport: 'AUTO' },

  // NE
  { from: 11, to: 12, transport: 'AUTO' }, { from: 11, to: 14, transport: 'AUTO' },
  { from: 12, to: 13, transport: 'AUTO' }, { from: 12, to: 69, transport: 'AUTO' },
  { from: 13, to: 15, transport: 'AUTO' }, { from: 13, to: 70, transport: 'AUTO' },
  { from: 14, to: 17, transport: 'AUTO' }, { from: 14, to: 18, transport: 'AUTO' },
  { from: 15, to: 16, transport: 'AUTO' }, { from: 15, to: 19, transport: 'AUTO' },
  { from: 16, to: 37, transport: 'AUTO' }, { from: 16, to: 71, transport: 'AUTO' },
  { from: 17, to: 39, transport: 'AUTO' }, { from: 17, to: 28, transport: 'AUTO' },
  { from: 18, to: 36, transport: 'AUTO' }, { from: 18, to: 79, transport: 'AUTO' },
  { from: 19, to: 71, transport: 'AUTO' },
  { from: 69, to: 78, transport: 'AUTO' }, { from: 70, to: 103, transport: 'AUTO' },
  { from: 71, to: 16, transport: 'AUTO' },
  { from: 103, to: 13, transport: 'AUTO' }, { from: 103, to: 15, transport: 'AUTO' },

  // MW
  { from: 20, to: 21, transport: 'AUTO' }, { from: 20, to: 24, transport: 'AUTO' },
  { from: 21, to: 22, transport: 'AUTO' }, { from: 21, to: 105, transport: 'AUTO' },
  { from: 22, to: 25, transport: 'AUTO' }, { from: 22, to: 26, transport: 'AUTO' },
  { from: 23, to: 24, transport: 'AUTO' }, { from: 23, to: 114, transport: 'AUTO' },
  { from: 24, to: 114, transport: 'AUTO' }, { from: 24, to: 27, transport: 'AUTO' },
  { from: 25, to: 45, transport: 'AUTO' }, { from: 25, to: 43, transport: 'AUTO' },
  { from: 26, to: 32, transport: 'AUTO' }, { from: 26, to: 43, transport: 'AUTO' },
  { from: 72, to: 5, transport: 'AUTO' }, { from: 72, to: 22, transport: 'AUTO' },
  { from: 73, to: 23, transport: 'AUTO' }, { from: 73, to: 112, transport: 'AUTO' },
  { from: 74, to: 26, transport: 'AUTO' }, { from: 74, to: 75, transport: 'AUTO' },
  { from: 75, to: 42, transport: 'AUTO' }, { from: 75, to: 84, transport: 'AUTO' },
  { from: 105, to: 25, transport: 'AUTO' },
  { from: 112, to: 74, transport: 'AUTO' }, { from: 112, to: 26, transport: 'AUTO' },
  { from: 114, to: 27, transport: 'AUTO' },

  // Central
  { from: 27, to: 28, transport: 'AUTO' }, { from: 27, to: 29, transport: 'AUTO' },
  { from: 28, to: 33, transport: 'AUTO' }, { from: 28, to: 39, transport: 'AUTO' },
  { from: 29, to: 30, transport: 'AUTO' }, { from: 29, to: 31, transport: 'AUTO' },
  { from: 30, to: 34, transport: 'AUTO' }, { from: 30, to: 51, transport: 'AUTO' },
  { from: 31, to: 32, transport: 'AUTO' }, { from: 31, to: 50, transport: 'AUTO' },
  { from: 32, to: 42, transport: 'AUTO' }, { from: 32, to: 77, transport: 'AUTO' },
  { from: 76, to: 29, transport: 'AUTO' }, { from: 76, to: 33, transport: 'AUTO' },
  { from: 77, to: 31, transport: 'AUTO' }, { from: 77, to: 43, transport: 'AUTO' },
  { from: 106, to: 31, transport: 'AUTO' }, { from: 106, to: 54, transport: 'AUTO' },
  { from: 114, to: 27, transport: 'AUTO' },

  // ME
  { from: 33, to: 39, transport: 'AUTO' }, { from: 33, to: 76, transport: 'AUTO' },
  { from: 34, to: 83, transport: 'AUTO' }, { from: 34, to: 115, transport: 'AUTO' },
  { from: 35, to: 36, transport: 'AUTO' }, { from: 35, to: 78, transport: 'AUTO' },
  { from: 36, to: 37, transport: 'AUTO' }, { from: 36, to: 38, transport: 'AUTO' },
  { from: 37, to: 40, transport: 'AUTO' }, { from: 37, to: 80, transport: 'AUTO' },
  { from: 38, to: 41, transport: 'AUTO' }, { from: 38, to: 82, transport: 'AUTO' },
  { from: 39, to: 113, transport: 'AUTO' },
  { from: 40, to: 81, transport: 'AUTO' },
  { from: 41, to: 81, transport: 'AUTO' }, { from: 41, to: 118, transport: 'AUTO' },
  { from: 78, to: 79, transport: 'AUTO' }, { from: 79, to: 37, transport: 'AUTO' },
  { from: 80, to: 40, transport: 'AUTO' },
  { from: 82, to: 108, transport: 'AUTO' }, { from: 82, to: 110, transport: 'AUTO' },
  { from: 83, to: 113, transport: 'AUTO' },
  { from: 104, to: 37, transport: 'AUTO' }, { from: 104, to: 41, transport: 'AUTO' },
  { from: 113, to: 35, transport: 'AUTO' },
  { from: 118, to: 59, transport: 'AUTO' }, { from: 118, to: 111, transport: 'AUTO' },

  // SW
  { from: 42, to: 43, transport: 'AUTO' }, { from: 42, to: 49, transport: 'AUTO' },
  { from: 43, to: 44, transport: 'AUTO' }, { from: 43, to: 84, transport: 'AUTO' },
  { from: 44, to: 46, transport: 'AUTO' }, { from: 44, to: 85, transport: 'AUTO' },
  { from: 45, to: 46, transport: 'AUTO' }, { from: 45, to: 86, transport: 'AUTO' },
  { from: 46, to: 47, transport: 'AUTO' }, { from: 46, to: 87, transport: 'AUTO' },
  { from: 47, to: 48, transport: 'AUTO' },
  { from: 48, to: 87, transport: 'AUTO' },
  { from: 84, to: 85, transport: 'AUTO' },
  { from: 85, to: 88, transport: 'AUTO' }, { from: 85, to: 119, transport: 'AUTO' },
  { from: 86, to: 45, transport: 'AUTO' },
  { from: 87, to: 48, transport: 'AUTO' },
  { from: 119, to: 44, transport: 'AUTO' }, { from: 119, to: 52, transport: 'AUTO' },

  // SC
  { from: 49, to: 88, transport: 'AUTO' }, { from: 49, to: 100, transport: 'AUTO' },
  { from: 50, to: 51, transport: 'AUTO' }, { from: 50, to: 89, transport: 'AUTO' },
  { from: 51, to: 53, transport: 'AUTO' }, { from: 51, to: 106, transport: 'AUTO' },
  { from: 52, to: 53, transport: 'AUTO' }, { from: 52, to: 90, transport: 'AUTO' },
  { from: 53, to: 89, transport: 'AUTO' }, { from: 53, to: 107, transport: 'AUTO' },
  { from: 54, to: 106, transport: 'AUTO' }, { from: 54, to: 115, transport: 'AUTO' },
  { from: 88, to: 107, transport: 'AUTO' },
  { from: 89, to: 50, transport: 'AUTO' }, { from: 89, to: 108, transport: 'AUTO' },
  { from: 90, to: 91, transport: 'AUTO' },
  { from: 91, to: 100, transport: 'AUTO' },
  { from: 100, to: 119, transport: 'AUTO' },
  { from: 107, to: 90, transport: 'AUTO' },

  // SE
  { from: 55, to: 99, transport: 'AUTO' }, { from: 55, to: 120, transport: 'AUTO' },
  { from: 56, to: 57, transport: 'AUTO' }, { from: 56, to: 92, transport: 'AUTO' },
  { from: 57, to: 58, transport: 'AUTO' }, { from: 57, to: 109, transport: 'AUTO' },
  { from: 58, to: 59, transport: 'AUTO' }, { from: 58, to: 94, transport: 'AUTO' },
  { from: 59, to: 95, transport: 'AUTO' }, { from: 59, to: 111, transport: 'AUTO' },
  { from: 60, to: 61, transport: 'AUTO' }, { from: 60, to: 96, transport: 'AUTO' },
  { from: 61, to: 62, transport: 'AUTO' }, { from: 61, to: 98, transport: 'AUTO' },
  { from: 62, to: 97, transport: 'AUTO' }, { from: 62, to: 99, transport: 'AUTO' },
  { from: 92, to: 108, transport: 'AUTO' },
  { from: 93, to: 57, transport: 'AUTO' }, { from: 93, to: 110, transport: 'AUTO' },
  { from: 94, to: 96, transport: 'AUTO' }, { from: 94, to: 118, transport: 'AUTO' },
  { from: 95, to: 111, transport: 'AUTO' },
  { from: 96, to: 60, transport: 'AUTO' },
  { from: 97, to: 120, transport: 'AUTO' },
  { from: 98, to: 99, transport: 'AUTO' },
  { from: 108, to: 56, transport: 'AUTO' },
  { from: 109, to: 93, transport: 'AUTO' },
  { from: 110, to: 57, transport: 'AUTO' },
  { from: 111, to: 60, transport: 'AUTO' },
  { from: 120, to: 58, transport: 'AUTO' },
  
  // --- BUS (arterial roads, medium distance) ---
  { from: 1, to: 8, transport: 'BUS' }, { from: 8, to: 14, transport: 'BUS' }, { from: 14, to: 35, transport: 'BUS' }, { from: 35, to: 41, transport: 'BUS' },
  { from: 19, to: 13, transport: 'BUS' }, { from: 13, to: 18, transport: 'BUS' }, { from: 18, to: 38, transport: 'BUS' }, { from: 38, to: 58, transport: 'BUS' }, { from: 58, to: 60, transport: 'BUS' },
  { from: 65, to: 22, transport: 'BUS' }, { from: 22, to: 32, transport: 'BUS' }, { from: 32, to: 50, transport: 'BUS' }, { from: 50, to: 56, transport: 'BUS' },
  { from: 72, to: 73, transport: 'BUS' }, { from: 73, to: 85, transport: 'BUS' }, { from: 85, to: 89, transport: 'BUS' }, { from: 89, to: 108, transport: 'BUS' },
  { from: 116, to: 101, transport: 'BUS' }, { from: 101, to: 27, transport: 'BUS' }, { from: 27, to: 76, transport: 'BUS' },
  { from: 4, to: 10, transport: 'BUS' }, { from: 10, to: 23, transport: 'BUS' }, { from: 23, to: 42, transport: 'BUS' }, { from: 42, to: 49, transport: 'BUS' },
  { from: 9, to: 17, transport: 'BUS' }, { from: 17, to: 33, transport: 'BUS' }, { from: 33, to: 54, transport: 'BUS' }, { from: 54, to: 55, transport: 'BUS' },
  { from: 45, to: 44, transport: 'BUS' }, { from: 44, to: 52, transport: 'BUS' }, { from: 52, to: 62, transport: 'BUS' }, { from: 52, to: 59, transport: 'BUS' },
  { from: 105, to: 84, transport: 'BUS' }, { from: 84, to: 91, transport: 'BUS' }, { from: 91, to: 98, transport: 'BUS' },
  { from: 70, to: 80, transport: 'BUS' }, { from: 80, to: 118, transport: 'BUS' },
  { from: 109, to: 94, transport: 'BUS' }, { from: 94, to: 96, transport: 'BUS' },
  
  // --- METRO (long distance, major hubs) ---
  { from: 2, to: 28, transport: 'METRO' }, { from: 28, to: 36, transport: 'METRO' }, { from: 36, to: 56, transport: 'METRO' }, { from: 56, to: 61, transport: 'METRO' },
  { from: 19, to: 28, transport: 'METRO' }, { from: 28, to: 51, transport: 'METRO' }, { from: 51, to: 44, transport: 'METRO' }, { from: 44, to: 47, transport: 'METRO' },
  { from: 67, to: 9, transport: 'METRO' }, { from: 9, to: 31, transport: 'METRO' }, { from: 31, to: 53, transport: 'METRO' }, { from: 53, to: 90, transport: 'METRO' },
  { from: 105, to: 26, transport: 'METRO' }, { from: 26, to: 50, transport: 'METRO' }, { from: 50, to: 108, transport: 'METRO' }, { from: 108, to: 95, transport: 'METRO' },
  { from: 12, to: 30, transport: 'METRO' }, { from: 30, to: 40, transport: 'METRO' }, { from: 40, to: 81, transport: 'METRO' },
  { from: 73, to: 88, transport: 'METRO' }, { from: 88, to: 97, transport: 'METRO' },
  { from: 20, to: 30, transport: 'METRO' },
  
  // --- FERRY (only on rivers) ---
  { from: 10, to: 23, transport: 'FERRY' },
  { from: 23, to: 42, transport: 'FERRY' },
  { from: 42, to: 49, transport: 'FERRY' },
  { from: 49, to: 100, transport: 'FERRY' },

  { from: 17, to: 33, transport: 'FERRY' },
  { from: 33, to: 34, transport: 'FERRY' },
  { from: 34, to: 54, transport: 'FERRY' },
  { from: 54, to: 55, transport: 'FERRY' },
  { from: 55, to: 99, transport: 'FERRY' },
];

export const DETECTIVE_START_LOCATIONS = [1, 4, 12, 16, 19, 21, 25, 37, 40, 45, 47, 57, 59, 61, 64, 69, 71, 80, 86, 93, 95, 103, 110, 116, 118, 120];
export const MRX_START_LOCATIONS = [3, 20, 32, 43, 52, 60, 77, 81, 90, 98, 105, 111];


const board: Board = {
    nodes: nodes,
    edges: edges.flatMap(edge => [edge, { from: edge.to, to: edge.from, transport: edge.transport }]),
}

export const initialGameState: Omit<GameState, 'gameId'> = {
  phase: 'lobby',
  mapId: 'mumbai_v5',
  round: 0,
  turnSeatIndex: 0,
  revealRounds: [3, 8, 13, 16],
  roundLimit: 16,
  players: [],
  mrXHistory: [],
  mrXLastRevealedPosition: null,
  board,
  winner: null,
};
