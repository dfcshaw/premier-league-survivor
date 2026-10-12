export type PlayerEntry = {
  id: string;
  name: string;
  club?: string;
  image_url?: string;
};

export const PL_PLAYERS: PlayerEntry[] = [
  // Arsenal
  { id: "thierry-henry", name: "Thierry Henry", club: "Arsenal" },
  { id: "dennis-bergkamp", name: "Dennis Bergkamp", club: "Arsenal" },
  { id: "patrick-vieira", name: "Patrick Vieira", club: "Arsenal" },
  { id: "robert-pires", name: "Robert Pires", club: "Arsenal" },
  { id: "ian-wright", name: "Ian Wright", club: "Arsenal" },
  { id: "tony-adams", name: "Tony Adams", club: "Arsenal" },
  { id: "david-seaman", name: "David Seaman", club: "Arsenal" },
  { id: "sol-campbell", name: "Sol Campbell", club: "Arsenal" },
  { id: "martin-keown", name: "Martin Keown", club: "Arsenal" },
  { id: "lee-dixon", name: "Lee Dixon", club: "Arsenal" },
  { id: "nigel-winterburn", name: "Nigel Winterburn", club: "Arsenal" },
  { id: "freddie-ljungberg", name: "Freddie Ljungberg", club: "Arsenal" },
  { id: "emmanuel-petit", name: "Emmanuel Petit", club: "Arsenal" },
  { id: "marc-overmars", name: "Marc Overmars", club: "Arsenal" },
  { id: "cesc-fabregas", name: "Cesc Fàbregas", club: "Arsenal" },
  { id: "robin-van-persie", name: "Robin van Persie", club: "Arsenal" },
  { id: "mikel-arteta", name: "Mikel Arteta", club: "Arsenal" },
  { id: "olivier-giroud", name: "Olivier Giroud", club: "Arsenal" },
  { id: "alexis-sanchez", name: "Alexis Sánchez", club: "Arsenal" },
  { id: "mesut-ozil", name: "Mesut Özil", club: "Arsenal" },
  { id: "pierre-emerick-aubameyang", name: "Pierre-Emerick Aubameyang", club: "Arsenal" },
  { id: "bukayo-saka", name: "Bukayo Saka", club: "Arsenal" },
  { id: "martin-odegaard", name: "Martin Ødegaard", club: "Arsenal" },
  { id: "declan-rice", name: "Declan Rice", club: "Arsenal" },

  // Manchester United
  { id: "eric-cantona", name: "Eric Cantona", club: "Manchester United" },
  { id: "ryan-giggs", name: "Ryan Giggs", club: "Manchester United" },
  { id: "paul-scholes", name: "Paul Scholes", club: "Manchester United" },
  { id: "roy-keane", name: "Roy Keane", club: "Manchester United" },
  { id: "david-beckham", name: "David Beckham", club: "Manchester United" },
  { id: "peter-schmeichel", name: "Peter Schmeichel", club: "Manchester United" },
  { id: "rio-ferdinand", name: "Rio Ferdinand", club: "Manchester United" },
  { id: "nemanja-vidic", name: "Nemanja Vidić", club: "Manchester United" },
  { id: "ruud-van-nistelrooy", name: "Ruud van Nistelrooy", club: "Manchester United" },
  { id: "wayne-rooney", name: "Wayne Rooney", club: "Manchester United" },
  { id: "cristiano-ronaldo", name: "Cristiano Ronaldo", club: "Manchester United" },
  { id: "gary-neville", name: "Gary Neville", club: "Manchester United" },
  { id: "phil-neville", name: "Phil Neville", club: "Manchester United" },
  { id: "nicky-butt", name: "Nicky Butt", club: "Manchester United" },
  { id: "gary-pallister", name: "Gary Pallister", club: "Manchester United" },
  { id: "steve-bruce", name: "Steve Bruce", club: "Manchester United" },
  { id: "andy-cole", name: "Andy Cole", club: "Manchester United" },
  { id: "dwight-yorke", name: "Dwight Yorke", club: "Manchester United" },
  { id: "ole-gunnar-solskjaer", name: "Ole Gunnar Solskjær", club: "Manchester United" },
  { id: "jaap-stam", name: "Jaap Stam", club: "Manchester United" },
  { id: "edwin-van-der-sar", name: "Edwin van der Sar", club: "Manchester United" },
  { id: "michael-carrick", name: "Michael Carrick", club: "Manchester United" },
  { id: "patrice-evra", name: "Patrice Evra", club: "Manchester United" },
  { id: "antonio-valencia", name: "Antonio Valencia", club: "Manchester United" },
  { id: "david-de-gea", name: "David de Gea", club: "Manchester United" },
  { id: "marcus-rashford", name: "Marcus Rashford", club: "Manchester United" },
  { id: "paul-pogba", name: "Paul Pogba", club: "Manchester United" },
  { id: "zlatan-ibrahimovic", name: "Zlatan Ibrahimović", club: "Manchester United" },
  { id: "bruno-fernandes", name: "Bruno Fernandes", club: "Manchester United" },
  { id: "casemiro", name: "Casemiro", club: "Manchester United" },
  { id: "lisandro-martinez", name: "Lisandro Martínez", club: "Manchester United" },

  // Chelsea
  { id: "frank-lampard", name: "Frank Lampard", club: "Chelsea" },
  { id: "john-terry", name: "John Terry", club: "Chelsea" },
  { id: "didier-drogba", name: "Didier Drogba", club: "Chelsea" },
  { id: "ashley-cole", name: "Ashley Cole", club: "Chelsea" },
  { id: "petr-cech", name: "Petr Čech", club: "Chelsea" },
  { id: "dennis-wise", name: "Dennis Wise", club: "Chelsea" },
  { id: "gianfranco-zola", name: "Gianfranco Zola", club: "Chelsea" },
  { id: "marcel-desailly", name: "Marcel Desailly", club: "Chelsea" },
  { id: "claude-makelele", name: "Claude Makélélé", club: "Chelsea" },
  { id: "michael-essien", name: "Michael Essien", club: "Chelsea" },
  { id: "michael-ballack", name: "Michael Ballack", club: "Chelsea" },
  { id: "juan-mata", name: "Juan Mata", club: "Chelsea" },
  { id: "eden-hazard", name: "Eden Hazard", club: "Chelsea" },
  { id: "diego-costa", name: "Diego Costa", club: "Chelsea" },
  { id: "thibaut-courtois", name: "Thibaut Courtois", club: "Chelsea" },
  { id: "branislav-ivanovic", name: "Branislav Ivanović", club: "Chelsea" },
  { id: "gary-cahill", name: "Gary Cahill", club: "Chelsea" },
  { id: "cesar-azpilicueta", name: "César Azpilicueta", club: "Chelsea" },
  { id: "ngolo-kante", name: "N'Golo Kanté", club: "Chelsea" },
  { id: "mason-mount", name: "Mason Mount", club: "Chelsea" },
  { id: "reece-james", name: "Reece James", club: "Chelsea" },
  { id: "cole-palmer", name: "Cole Palmer", club: "Chelsea" },

  // Liverpool
  { id: "steven-gerrard", name: "Steven Gerrard", club: "Liverpool" },
  { id: "jamie-carragher", name: "Jamie Carragher", club: "Liverpool" },
  { id: "robbie-fowler", name: "Robbie Fowler", club: "Liverpool" },
  { id: "michael-owen", name: "Michael Owen", club: "Liverpool" },
  { id: "fernando-torres", name: "Fernando Torres", club: "Liverpool" },
  { id: "luis-suarez", name: "Luis Suárez", club: "Liverpool" },
  { id: "john-barnes", name: "John Barnes", club: "Liverpool" },
  { id: "ian-rush", name: "Ian Rush", club: "Liverpool" },
  { id: "sami-hyypia", name: "Sami Hyypiä", club: "Liverpool" },
  { id: "xabi-alonso", name: "Xabi Alonso", club: "Liverpool" },
  { id: "pepe-reina", name: "Pepe Reina", club: "Liverpool" },
  { id: "philippe-coutinho", name: "Philippe Coutinho", club: "Liverpool" },
  { id: "daniel-sturridge", name: "Daniel Sturridge", club: "Liverpool" },
  { id: "jordan-henderson", name: "Jordan Henderson", club: "Liverpool" },
  { id: "mohamed-salah", name: "Mohamed Salah", club: "Liverpool" },
  { id: "virgil-van-dijk", name: "Virgil van Dijk", club: "Liverpool" },
  { id: "sadio-mane", name: "Sadio Mané", club: "Liverpool" },
  { id: "roberto-firmino", name: "Roberto Firmino", club: "Liverpool" },
  { id: "trent-alexander-arnold", name: "Trent Alexander-Arnold", club: "Liverpool" },
  { id: "andy-robertson", name: "Andy Robertson", club: "Liverpool" },
  { id: "alisson", name: "Alisson", club: "Liverpool" },
  { id: "diogo-jota", name: "Diogo Jota", club: "Liverpool" },

  // Manchester City
  { id: "sergio-aguero", name: "Sergio Agüero", club: "Manchester City" },
  { id: "yaya-toure", name: "Yaya Touré", club: "Manchester City" },
  { id: "david-silva", name: "David Silva", club: "Manchester City" },
  { id: "vincent-kompany", name: "Vincent Kompany", club: "Manchester City" },
  { id: "carlos-tevez", name: "Carlos Tevez", club: "Manchester City" },
  { id: "pablo-zabaleta", name: "Pablo Zabaleta", club: "Manchester City" },
  { id: "joleon-lescott", name: "Joleon Lescott", club: "Manchester City" },
  { id: "mario-balotelli", name: "Mario Balotelli", club: "Manchester City" },
  { id: "edin-dzeko", name: "Edin Džeko", club: "Manchester City" },
  { id: "samir-nasri", name: "Samir Nasri", club: "Manchester City" },
  { id: "fernandinho", name: "Fernandinho", club: "Manchester City" },
  { id: "kevin-de-bruyne", name: "Kevin De Bruyne", club: "Manchester City" },
  { id: "raheem-sterling", name: "Raheem Sterling", club: "Manchester City" },
  { id: "riyad-mahrez", name: "Riyad Mahrez", club: "Manchester City" },
  { id: "bernardo-silva", name: "Bernardo Silva", club: "Manchester City" },
  { id: "ilkay-gundogan", name: "İlkay Gündoğan", club: "Manchester City" },
  { id: "rodri", name: "Rodri", club: "Manchester City" },
  { id: "ruben-dias", name: "Rúben Dias", club: "Manchester City" },
  { id: "ederson", name: "Ederson", club: "Manchester City" },
  { id: "phil-foden", name: "Phil Foden", club: "Manchester City" },
  { id: "jack-grealish", name: "Jack Grealish", club: "Manchester City" },
  { id: "erling-haaland", name: "Erling Haaland", club: "Manchester City" },

  // Tottenham
  { id: "teddy-sheringham", name: "Teddy Sheringham", club: "Tottenham" },
  { id: "dimitar-berbatov", name: "Dimitar Berbatov", club: "Tottenham" },
  { id: "ledley-king", name: "Ledley King", club: "Tottenham" },
  { id: "robbie-keane", name: "Robbie Keane", club: "Tottenham" },
  { id: "jermain-defoe", name: "Jermain Defoe", club: "Tottenham" },
  { id: "luka-modric", name: "Luka Modrić", club: "Tottenham" },
  { id: "gareth-bale", name: "Gareth Bale", club: "Tottenham" },
  { id: "hugo-lloris", name: "Hugo Lloris", club: "Tottenham" },
  { id: "toby-alderweireld", name: "Toby Alderweireld", club: "Tottenham" },
  { id: "jan-vertonghen", name: "Jan Vertonghen", club: "Tottenham" },
  { id: "christian-eriksen", name: "Christian Eriksen", club: "Tottenham" },
  { id: "dele-alli", name: "Dele Alli", club: "Tottenham" },
  { id: "harry-kane", name: "Harry Kane", club: "Tottenham" },
  { id: "son-heung-min", name: "Son Heung-min", club: "Tottenham" },
  { id: "james-maddison", name: "James Maddison", club: "Tottenham" },

  // Newcastle
  { id: "alan-shearer", name: "Alan Shearer", club: "Newcastle" },
  { id: "les-ferdinand", name: "Les Ferdinand", club: "Newcastle" },
  { id: "david-ginola", name: "David Ginola", club: "Newcastle" },
  { id: "tino-asprilla", name: "Faustino Asprilla", club: "Newcastle" },
  { id: "robert-lee", name: "Robert Lee", club: "Newcastle" },
  { id: "nolberto-solano", name: "Nolberto Solano", club: "Newcastle" },
  { id: "kieron-dyer", name: "Kieron Dyer", club: "Newcastle" },
  { id: "craig-bellamy", name: "Craig Bellamy", club: "Newcastle" },
  { id: "kieran-trippier", name: "Kieran Trippier", club: "Newcastle" },
  { id: "bruno-guimaraes", name: "Bruno Guimarães", club: "Newcastle" },
  { id: "alexander-isak", name: "Alexander Isak", club: "Newcastle" },

  // Everton
  { id: "tim-cahill", name: "Tim Cahill", club: "Everton" },
  { id: "duncan-ferguson", name: "Duncan Ferguson", club: "Everton" },
  { id: "phil-jagielka", name: "Phil Jagielka", club: "Everton" },
  { id: "leighton-baines", name: "Leighton Baines", club: "Everton" },
  { id: "marouane-fellaini", name: "Marouane Fellaini", club: "Everton" },
  { id: "romelu-lukaku", name: "Romelu Lukaku", club: "Everton" },
  { id: "jordan-pickford", name: "Jordan Pickford", club: "Everton" },
  { id: "dominic-calvert-lewin", name: "Dominic Calvert-Lewin", club: "Everton" },
  { id: "steven-pienaar", name: "Steven Pienaar", club: "Everton" },

  // Aston Villa
  { id: "dion-dublin", name: "Dion Dublin", club: "Aston Villa" },
  { id: "paul-merson", name: "Paul Merson", club: "Aston Villa" },
  { id: "juan-pablo-angel", name: "Juan Pablo Ángel", club: "Aston Villa" },
  { id: "gareth-barry", name: "Gareth Barry", club: "Aston Villa" },
  { id: "olof-mellberg", name: "Olof Mellberg", club: "Aston Villa" },
  { id: "ashley-young", name: "Ashley Young", club: "Aston Villa" },
  { id: "christian-benteke", name: "Christian Benteke", club: "Aston Villa" },
  { id: "ollie-watkins", name: "Ollie Watkins", club: "Aston Villa" },
  { id: "emiliano-martinez", name: "Emiliano Martínez", club: "Aston Villa" },

  // West Ham
  { id: "paolo-di-canio", name: "Paolo Di Canio", club: "West Ham" },
  { id: "joe-cole", name: "Joe Cole", club: "West Ham" },
  { id: "trevor-sinclair", name: "Trevor Sinclair", club: "West Ham" },
  { id: "dimitri-payet", name: "Dimitri Payet", club: "West Ham" },
  { id: "mark-noble", name: "Mark Noble", club: "West Ham" },
  { id: "michail-antonio", name: "Michail Antonio", club: "West Ham" },
  { id: "jarrod-bowen", name: "Jarrod Bowen", club: "West Ham" },
  { id: "lukasz-fabianski", name: "Łukasz Fabiański", club: "West Ham" },

  // Leicester
  { id: "jamie-vardy", name: "Jamie Vardy", club: "Leicester City" },
  { id: "harry-maguire", name: "Harry Maguire", club: "Leicester City" },
  { id: "wes-morgan", name: "Wes Morgan", club: "Leicester City" },
  { id: "youri-tielemans", name: "Youri Tielemans", club: "Leicester City" },
  { id: "kasper-schmeichel", name: "Kasper Schmeichel", club: "Leicester City" },

  // Southampton
  { id: "matt-le-tissier", name: "Matt Le Tissier", club: "Southampton" },
  { id: "rickie-lambert", name: "Rickie Lambert", club: "Southampton" },
  { id: "james-ward-prowse", name: "James Ward-Prowse", club: "Southampton" },
  { id: "adam-lallana", name: "Adam Lallana", club: "Southampton" },

  // Blackburn
  { id: "chris-sutton", name: "Chris Sutton", club: "Blackburn Rovers" },
  { id: "tim-flowers", name: "Tim Flowers", club: "Blackburn Rovers" },
  { id: "colin-hendry", name: "Colin Hendry", club: "Blackburn Rovers" },
  { id: "graeme-le-saux", name: "Graeme Le Saux", club: "Blackburn Rovers" },

  // Leeds
  { id: "gary-mcallister", name: "Gary McAllister", club: "Leeds United" },
  { id: "gary-speed", name: "Gary Speed", club: "Leeds United" },
  { id: "harry-kewell", name: "Harry Kewell", club: "Leeds United" },
  { id: "mark-viduka", name: "Mark Viduka", club: "Leeds United" },
  { id: "lucas-radebe", name: "Lucas Radebe", club: "Leeds United" },

  // Fulham
  { id: "louis-saha", name: "Louis Saha", club: "Fulham" },
  { id: "clint-dempsey", name: "Clint Dempsey", club: "Fulham" },
  { id: "aleksandar-mitrovic", name: "Aleksandar Mitrović", club: "Fulham" },

  // Bolton
  { id: "jay-jay-okocha", name: "Jay-Jay Okocha", club: "Bolton Wanderers" },
  { id: "youri-djorkaeff", name: "Youri Djorkaeff", club: "Bolton Wanderers" },
  { id: "nicolas-anelka", name: "Nicolas Anelka", club: "Bolton Wanderers" },
  { id: "kevin-davies", name: "Kevin Davies", club: "Bolton Wanderers" },

  // Portsmouth
  { id: "peter-crouch", name: "Peter Crouch", club: "Portsmouth" },
  { id: "david-james", name: "David James", club: "Portsmouth" },

  // Wigan
  { id: "charles-nzogbia", name: "Charles N'Zogbia", club: "Wigan Athletic" },
  { id: "shaun-maloney", name: "Shaun Maloney", club: "Wigan Athletic" },

  // Middlesbrough
  { id: "juninho", name: "Juninho", club: "Middlesbrough" },
  { id: "fabrizio-ravanelli", name: "Fabrizio Ravanelli", club: "Middlesbrough" },

  // Sunderland
  { id: "niall-quinn", name: "Niall Quinn", club: "Sunderland" },
  { id: "kevin-phillips", name: "Kevin Phillips", club: "Sunderland" },
  { id: "darren-bent", name: "Darren Bent", club: "Sunderland" },

  // Crystal Palace
  { id: "wilfried-zaha", name: "Wilfried Zaha", club: "Crystal Palace" },
  { id: "eberechi-eze", name: "Eberechi Eze", club: "Crystal Palace" },

  // Brighton
  { id: "lewis-dunk", name: "Lewis Dunk", club: "Brighton" },
  { id: "pascal-gross", name: "Pascal Groß", club: "Brighton" },
  { id: "alexis-mac-allister", name: "Alexis Mac Allister", club: "Brighton" },
  { id: "moises-caicedo", name: "Moisés Caicedo", club: "Brighton" },

  // Wolves
  { id: "ruben-neves", name: "Rúben Neves", club: "Wolverhampton Wanderers" },
  { id: "raul-jimenez", name: "Raúl Jiménez", club: "Wolverhampton Wanderers" },
  { id: "joao-moutinho", name: "João Moutinho", club: "Wolverhampton Wanderers" },

  // Nottingham Forest (classic)
  { id: "stuart-pearce", name: "Stuart Pearce", club: "Nottingham Forest" },
  { id: "stan-collymore", name: "Stan Collymore", club: "Nottingham Forest" },

  // Burnley
  { id: "michael-keane", name: "Michael Keane", club: "Burnley" },
  { id: "nick-pope", name: "Nick Pope", club: "Burnley" },

  // Charlton Athletic
  { id: "scott-parker", name: "Scott Parker", club: "Charlton Athletic" },

  // Birmingham
  { id: "christophe-dugarry", name: "Christophe Dugarry", club: "Birmingham City" },
  { id: "robbie-savage", name: "Robbie Savage", club: "Birmingham City" },
];