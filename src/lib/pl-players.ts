export type PlayerEntry = {
  id: string;
  name: string;
  club?: string;
  image_url?: string;
};

export const PL_PLAYERS: PlayerEntry[] = [
  // Legends — 90s/00s
  { id: "alan-shearer", name: "Alan Shearer", club: "Newcastle" },
  { id: "thierry-henry", name: "Thierry Henry", club: "Arsenal" },
  { id: "dennis-bergkamp", name: "Dennis Bergkamp", club: "Arsenal" },
  { id: "patrick-vieira", name: "Patrick Vieira", club: "Arsenal" },
  { id: "robert-pires", name: "Robert Pires", club: "Arsenal" },
  { id: "eric-cantona", name: "Eric Cantona", club: "Manchester United" },
  { id: "ryan-giggs", name: "Ryan Giggs", club: "Manchester United" },
  { id: "paul-scholes", name: "Paul Scholes", club: "Manchester United" },
  { id: "roy-keane", name: "Roy Keane", club: "Manchester United" },
  { id: "david-beckham", name: "David Beckham", club: "Manchester United" },
  { id: "peter-schmeichel", name: "Peter Schmeichel", club: "Manchester United" },
  { id: "rio-ferdinand", name: "Rio Ferdinand", club: "Manchester United" },
  { id: "nemanja-vidic", name: "Nemanja Vidic", club: "Manchester United" },
  { id: "ruud-van-nistelrooy", name: "Ruud van Nistelrooy", club: "Manchester United" },
  { id: "wayne-rooney", name: "Wayne Rooney", club: "Manchester United" },
  { id: "cristiano-ronaldo", name: "Cristiano Ronaldo", club: "Manchester United" },
  { id: "frank-lampard", name: "Frank Lampard", club: "Chelsea" },
  { id: "john-terry", name: "John Terry", club: "Chelsea" },
  { id: "didier-drogba", name: "Didier Drogba", club: "Chelsea" },
  { id: "ashley-cole", name: "Ashley Cole", club: "Chelsea" },
  { id: "petr-cech", name: "Petr Cech", club: "Chelsea" },
  { id: "steven-gerrard", name: "Steven Gerrard", club: "Liverpool" },
  { id: "jamie-carragher", name: "Jamie Carragher", club: "Liverpool" },
  { id: "robbie-fowler", name: "Robbie Fowler", club: "Liverpool" },
  { id: "michael-owen", name: "Michael Owen", club: "Liverpool" },
  { id: "fernando-torres", name: "Fernando Torres", club: "Liverpool" },
  { id: "luis-suarez", name: "Luis Suarez", club: "Liverpool" },
  { id: "teddy-sheringham", name: "Teddy Sheringham", club: "Tottenham" },
  { id: "les-ferdinand", name: "Les Ferdinand", club: "Newcastle" },

  // 2010s stars
  { id: "sergio-aguero", name: "Sergio Agüero", club: "Manchester City" },
  { id: "yaya-toure", name: "Yaya Touré", club: "Manchester City" },
  { id: "david-silva", name: "David Silva", club: "Manchester City" },
  { id: "vincent-kompany", name: "Vincent Kompany", club: "Manchester City" },
  { id: "carlos-tevez", name: "Carlos Tevez", club: "Manchester City" },
  { id: "robin-van-persie", name: "Robin van Persie", club: "Arsenal" },
  { id: "dimitar-berbatov", name: "Dimitar Berbatov", club: "Tottenham" },
  { id: "david-de-gea", name: "David de Gea", club: "Manchester United" },

  // Current / recent
  { id: "harry-kane", name: "Harry Kane", club: "Tottenham" },
  { id: "son-heung-min", name: "Son Heung-min", club: "Tottenham" },
  { id: "mohamed-salah", name: "Mohamed Salah", club: "Liverpool" },
  { id: "virgil-van-dijk", name: "Virgil van Dijk", club: "Liverpool" },
  { id: "sadio-mane", name: "Sadio Mané", club: "Liverpool" },
  { id: "trent-alexander-arnold", name: "Trent Alexander-Arnold", club: "Liverpool" },
  { id: "kevin-de-bruyne", name: "Kevin De Bruyne", club: "Manchester City" },
  { id: "erling-haaland", name: "Erling Haaland", club: "Manchester City" },
  { id: "phil-foden", name: "Phil Foden", club: "Manchester City" },
  { id: "raheem-sterling", name: "Raheem Sterling", club: "Manchester City" },
  { id: "riyad-mahrez", name: "Riyad Mahrez", club: "Manchester City" },
  { id: "bruno-fernandes", name: "Bruno Fernandes", club: "Manchester United" },
  { id: "bukayo-saka", name: "Bukayo Saka", club: "Arsenal" },
  { id: "ngolo-kante", name: "N'Golo Kanté", club: "Chelsea" },
  { id: "mason-mount", name: "Mason Mount", club: "Chelsea" },
];