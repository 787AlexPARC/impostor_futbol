import { Footballer } from '@/contexts/GameContext';

export interface FootballerCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  footballers: Footballer[];
}

export const footballerCategories: FootballerCategory[] = [
  {
    id: 'legends',
    name: 'Leyendas del Fútbol',
    description: 'Los mejores jugadores de todos los tiempos',
    icon: '👑',
    footballers: [
      { id: '1', name: 'Pelé', position: 'Delantero' },
      { id: '2', name: 'Diego Maradona', position: 'Mediapunta' },
      { id: '3', name: 'Johan Cruyff', position: 'Delantero' },
      { id: '4', name: 'Franz Beckenbauer', position: 'Defensa' },
      { id: '5', name: 'Gerd Müller', position: 'Delantero' },
      { id: '6', name: 'Bobby Moore', position: 'Defensa' },
      { id: '7', name: 'Zinedine Zidane', position: 'Centrocampista' },
      { id: '8', name: 'Ronaldo Nazário', position: 'Delantero' },
      { id: '9', name: 'Ronaldinho', position: 'Extremo' },
      { id: '10', name: 'Garrincha', position: 'Extremo' },
    ],
  },
  {
    id: 'european-stars',
    name: 'Estrellas de Ligas Europeas',
    description: 'Las mejores figuras de las principales ligas europeas',
    icon: '⭐',
    footballers: [
      { id: '11', name: 'Cristiano Ronaldo', position: 'Delantero' },
      { id: '12', name: 'Lionel Messi', position: 'Delantero' },
      { id: '13', name: 'Neymar Jr', position: 'Extremo' },
      { id: '14', name: 'Kylian Mbappé', position: 'Delantero' },
      { id: '15', name: 'Luka Modrić', position: 'Centrocampista' },
      { id: '16', name: 'Mohamed Salah', position: 'Extremo' },
      { id: '17', name: 'Vinícius Júnior', position: 'Extremo' },
      { id: '18', name: 'Erling Haaland', position: 'Delantero' },
      { id: '19', name: 'Jude Bellingham', position: 'Centrocampista' },
      { id: '20', name: 'Gianluigi Donnarumma', position: 'Portero' },
    ],
  },
  {
    id: 'premier-league',
    name: 'Premier League Inglesa',
    description: 'Las mejores figuras de la Premier League',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    footballers: [
      { id: '21', name: 'Harry Kane', position: 'Delantero' },
      { id: '22', name: 'Bukayo Saka', position: 'Extremo' },
      { id: '23', name: 'Phil Foden', position: 'Extremo' },
      { id: '24', name: 'Declan Rice', position: 'Centrocampista' },
      { id: '25', name: 'Jadon Sancho', position: 'Extremo' },
      { id: '26', name: 'Mason Mount', position: 'Centrocampista' },
      { id: '27', name: 'Callum Hudson-Odoi', position: 'Extremo' },
      { id: '28', name: 'Aaron Ramsdale', position: 'Portero' },
      { id: '29', name: 'Luke Shaw', position: 'Defensa' },
      { id: '30', name: 'Reece James', position: 'Defensa' },
    ],
  },
  {
    id: 'la-liga',
    name: 'La Liga Española',
    description: 'Las mejores figuras de la Liga Española',
    icon: '🇪🇸',
    footballers: [
      { id: '31', name: 'Vinícius Júnior', position: 'Extremo' },
      { id: '32', name: 'Jude Bellingham', position: 'Centrocampista' },
      { id: '33', name: 'Rodri', position: 'Centrocampista' },
      { id: '34', name: 'Pedri', position: 'Centrocampista' },
      { id: '35', name: 'Gavi', position: 'Centrocampista' },
      { id: '36', name: 'Robert Lewandowski', position: 'Delantero' },
      { id: '37', name: 'Álvaro Morata', position: 'Delantero' },
      { id: '38', name: 'Ferran Torres', position: 'Extremo' },
      { id: '39', name: 'Thibaut Courtois', position: 'Portero' },
      { id: '40', name: 'Sergio Busquets', position: 'Centrocampista' },
    ],
  },
  {
    id: 'serie-a',
    name: 'Serie A Italiana',
    description: 'Las mejores figuras de la Serie A',
    icon: '🇮🇹',
    footballers: [
      { id: '41', name: 'Gianluigi Donnarumma', position: 'Portero' },
      { id: '42', name: 'Sergej Milinković-Savić', position: 'Centrocampista' },
      { id: '43', name: 'Dušan Vlahović', position: 'Delantero' },
      { id: '44', name: 'Nicolò Barella', position: 'Centrocampista' },
      { id: '45', name: 'Lautaro Martínez', position: 'Delantero' },
      { id: '46', name: 'Alessandro Bastoni', position: 'Defensa' },
      { id: '47', name: 'Rafael Tolói', position: 'Defensa' },
      { id: '48', name: 'Juan Cuadrado', position: 'Defensa' },
      { id: '49', name: 'Matteo De Sciglio', position: 'Defensa' },
      { id: '50', name: 'Danilo', position: 'Defensa' },
    ],
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1 Francesa',
    description: 'Las mejores figuras de la Ligue 1',
    icon: '🇫🇷',
    footballers: [
      { id: '51', name: 'Kylian Mbappé', position: 'Delantero' },
      { id: '52', name: 'Neymar Jr', position: 'Extremo' },
      { id: '53', name: 'Achraf Hakimi', position: 'Defensa' },
      { id: '54', name: 'Marquinhos', position: 'Defensa' },
      { id: '55', name: 'Sergio Ramos', position: 'Defensa' },
      { id: '56', name: 'Presnel Kimpembe', position: 'Defensa' },
      { id: '57', name: 'Gianluigi Donnarumma', position: 'Portero' },
      { id: '58', name: 'Marco Verratti', position: 'Centrocampista' },
      { id: '59', name: 'Ángel Di María', position: 'Extremo' },
      { id: '60', name: 'Leandro Paredes', position: 'Centrocampista' },
    ],
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga Alemana',
    description: 'Las mejores figuras de la Bundesliga',
    icon: '🇩🇪',
    footballers: [
      { id: '61', name: 'Erling Haaland', position: 'Delantero' },
      { id: '62', name: 'Jude Bellingham', position: 'Centrocampista' },
      { id: '63', name: 'Florian Wirtz', position: 'Extremo' },
      { id: '64', name: 'Jamal Musiala', position: 'Centrocampista' },
      { id: '65', name: 'Serge Gnabry', position: 'Extremo' },
      { id: '66', name: 'Leroy Sané', position: 'Extremo' },
      { id: '67', name: 'Joshua Kimmich', position: 'Defensa' },
      { id: '68', name: 'Manuel Neuer', position: 'Portero' },
      { id: '69', name: 'Dayot Upamecano', position: 'Defensa' },
      { id: '70', name: 'Alphonso Davies', position: 'Defensa' },
    ],
  },
];

export const getFootballersByCategory = (categoryId: string): Footballer[] => {
  const category = footballerCategories.find((cat) => cat.id === categoryId);
  return category ? category.footballers : [];
};
