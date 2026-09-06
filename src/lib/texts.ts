import { TextMode } from '../types';
import { getRandomItems } from './utils';

const commonParagraphs = [
  "The forest floor crunched underfoot, scattered thickly with pine needles and fallen twigs. Sunbeams filtered through branches above, lighting golden patches on the path, while the air smelled of moss and earth. Birds called faintly, guiding travelers deeper into the cool, hushed woods.",
  "The morning light crept slowly across the kitchen table, warming the cold ceramic of an untouched coffee mug. Outside the window, frost still clung to the grass, sparkling like scattered diamonds under the pale winter sun. A cat stretched lazily on the chair, undisturbed by the quiet passage of time.",
  "The marketplace buzzed with energy as vendors called out their prices and shoppers weaved between stalls laden with bright produce. The smell of fresh bread mingled with the sharp tang of citrus and the earthy warmth of roasted nuts. Children darted between legs, laughing, their voices rising above the general hum.",
  "Rain drummed steadily against the window pane, turning the world outside into a grey blur. Inside, the fire crackled softly, casting flickering shadows across the walls of the small cabin. A book lay open on the armrest, its pages slowly turning in the gentle draft from under the door.",
  "The old clock on the mantelpiece ticked with a steady, reassuring rhythm that had measured out the hours of this house for over a hundred years. Its brass pendulum swung back and forth behind clouded glass, a tireless heart beating in the chest of a home filled with memories.",
  "She walked along the shoreline, leaving a trail of footprints in the wet sand that the incoming waves would soon erase. The ocean stretched out before her, a vast expanse of grey and blue merging seamlessly with the overcast sky. Seagulls cried overhead, riding the cold coastal wind.",
  "The library was quiet save for the occasional rustle of turning pages and the soft tap of fingers on a keyboard. Tall shelves lined the walls from floor to ceiling, packed with books whose spines formed a faded rainbow of colors. Dust motes danced in the shafts of light from the high windows.",
  "The garden was at its best in the early morning, before the heat of the day settled in. Dewdrops clung to the petals of roses and the slender blades of grass, catching the first rays of sunlight and scattering tiny prisms of color across the freshly turned soil.",
  "A narrow cobblestone street wound its way up the hillside, flanked by old buildings with shuttered windows and balconies overflowing with flowering plants. The air was warm and still, heavy with the scent of jasmine, and the only sound was the distant tolling of a church bell.",
  "The workshop was a cluttered sanctuary of half-finished projects and neatly organized tools. Sawdust covered the floor like a fine blanket of snow, and the air was thick with the sweet, clean scent of freshly cut wood. A single lamp illuminated the workbench where patient hands shaped something new.",
  "Stars began to appear one by one in the darkening sky, like tiny holes poked through a velvet curtain. The temperature dropped quickly as the last warmth of the sun faded behind the mountains, and the chirping of crickets rose to fill the silence left by the departing songbirds.",
  "The train station was nearly empty at this hour, the long platforms stretching away into pools of yellow lamplight. A digital board flickered with arrivals and departures, its silent updates watched by a lone traveler sitting on a cold metal bench with a suitcase at their feet.",
  "Autumn had painted the valley in shades of amber, crimson, and gold. Leaves drifted down from the branches in lazy spirals, carpeting the ground in a rustling layer that crackled underfoot. The air was crisp and cool, carrying the faint, sweet smell of wood smoke from a distant chimney.",
  "The kitchen was filled with the comforting aroma of simmering soup and freshly baked bread. Steam rose from a large pot on the stove, clouding the window above and making the cold world outside seem even more distant. A radio played softly on the counter, filling the room with gentle music.",
  "He sat on the park bench and watched the world go by, content to be a spectator for once rather than a participant. Dogs chased balls across the grass, joggers traced well-worn paths around the pond, and an elderly couple walked arm in arm, their pace unhurried, their conversation soft."
];

const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
  'their', 'what', 'about', 'which', 'when', 'make', 'can', 'like', 'time', 'just', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'great', 'between', 'need', 'large', 'under', 'never', 'city', 'tree', 'cross', 'small', 'long',
  'story', 'letter', 'river', 'found', 'still', 'learn', 'plant', 'food', 'sun', 'keep', 'together', 'build', 'own', 'earth',
  'picture', 'hand', 'high', 'away', 'old', 'animal', 'house', 'point', 'mother', 'world', 'near', 'light', 'important', 'often',
  'problem', 'start', 'children', 'country', 'music', 'family', 'door', 'answer', 'change', 'end', 'second', 'number', 'move',
  'head', 'kind', 'different', 'open', 'play', 'spell', 'read', 'add', 'big', 'went', 'car', 'water', 'place', 'line', 'boy',
  'came', 'show', 'every', 'part', 'around', 'form', 'mean', 'boy', 'following', 'came', 'want', 'show', 'also', 'around',
  'form', 'three', 'small', 'set', 'put', 'end', 'does', 'another', 'well', 'large', 'must', 'big', 'even', 'such', 'because',
  'turn', 'here', 'why', 'ask', 'went', 'men', 'read', 'need', 'land', 'different', 'home', 'us', 'move', 'try', 'kind', 'hand',
  'picture', 'again', 'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'house', 'point', 'page', 'letter', 'mother',
  'answer', 'found', 'study', 'still', 'learn', 'should', 'America', 'world', 'high'
];

const quotes = [
  "The only way to do great work is to love what you do.",
  "In the middle of difficulty lies opportunity.",
  "It is during our darkest moments that we must focus to see the light.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Life is what happens when you're busy making other plans.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
  "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
  "Be the change that you wish to see in the world.",
  "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.",
  "No one can make you feel inferior without your consent.",
  "If you tell the truth, you don't have to remember anything.",
  "A friend is someone who knows all about you and still loves you.",
  "Always forgive your enemies; nothing annoys them so much.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.",
  "Without music, life would be a mistake.",
  "To live is the rarest thing in the world. Most people exist, that is all.",
  "Good friends, good books, and a sleepy conscience: this is the ideal life.",
  "We accept the love we think we deserve.",
  "It is better to be hated for what you are than to be loved for what you are not."
];

const codeSnippets = [
  "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }",
  "const result = array.filter(item => item.active).map(item => item.name);",
  "for i in range(len(data)): if data[i] > threshold: results.append(data[i])",
  "def quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)",
  "SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id HAVING order_count > 5;",
  "const [state, setState] = useState(initialValue);\nuseEffect(() => {\n  document.title = `Count: ${state}`;\n}, [state]);",
  ".container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; align-items: center; }",
  "import pandas as pd\ndf = pd.read_csv('data.csv')\nclean_df = df.dropna(subset=['price']).fillna({'rating': 0})",
  "public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n}",
  "type User = { id: number; name: string; email?: string };\nconst getUser = (id: number): Promise<User> => fetch(`/api/users/${id}`).then(r => r.json());",
  "fn factorial(n: u32) -> u32 {\n    match n {\n        0 => 1,\n        _ => n * factorial(n - 1),\n    }\n}",
  "const express = require('express');\nconst app = express();\napp.use(express.json());\napp.post('/api/data', (req, res) => res.status(201).json(req.body));",
  "func (c *Client) FetchData(ctx context.Context, id string) (*Data, error) {\n    req, err := http.NewRequestWithContext(ctx, \"GET\", c.baseURL+\"/\"+id, nil)\n    if err != nil { return nil, err }\n}",
  "docker build -t myapp:latest .\ndocker run -p 8080:80 -d --name myapp_container myapp:latest",
  "grep -Rn \"TODO\" ./src | awk -F: '{print $1 \":\" $2}' | sort | uniq -c | sort -nr"
];

const numbers = [
  "3.14159 2.71828 1.41421 1.73205 2.23607",
  "100 + 250 = 350, 480 - 125 = 355, 12 x 15 = 180",
  "(555) 123-4567, +1-800-555-0199, 011 44 20 7946 0123",
  "192.168.1.1, 10.0.0.255, 172.16.254.1, 127.0.0.1",
  "2^10 = 1024, 2^16 = 65536, 2^32 = 4294967296",
  "9/5 * C + 32 = F, E = mc^2, a^2 + b^2 = c^2",
  "1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144",
  "0b101010, 0x2A, 0o52, 42",
  "2023-10-15T14:30:00Z, 12/31/2024, 23:59:59",
  "$1,234.56, €987,65, ¥100,000, £45.99",
  "0.000000001, 1e-9, 1,000,000,000, 1e9",
  "7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47",
  "360 / 24 = 15, 1440 / 60 = 24, 86400 / 60 = 1440",
  "y = mx + b, ax^2 + bx + c = 0, sin(x)^2 + cos(x)^2 = 1",
  "404 Not Found, 200 OK, 500 Internal Server Error, 301 Moved Permanently",
  "x = -b ± sqrt(b^2 - 4ac) / 2a",
  "8 bits = 1 byte, 1024 bytes = 1 KB, 1024 KB = 1 MB, 1024 MB = 1 GB",
  "ISBN-13: 978-3-16-148410-0, ISBN-10: 0-306-40615-2",
  "32°F = 0°C, 212°F = 100°C, -40°F = -40°C",
  "1, 4, 9, 16, 25, 36, 49, 64, 81, 100"
];

const paragraphs = [
  "The old house stood at the end of the lane, its windows dark and uninviting. Weeds choked the garden path, and the paint peeled from the weather-beaten siding like dead skin. Yet, despite its desolate appearance, there was a strange sort of dignity to the place, a lingering echo of happier times that refused to be completely silenced by the passage of years and the ravages of neglect.",
  "In the heart of the bustling city, a small park offered a rare oasis of green. Office workers on their lunch breaks sat on wooden benches, their faces tilted upward to catch the pale winter sun. Pigeons strutted purposefully across the concrete paths, bobbing their heads in a rhythmic dance, while the distant roar of traffic provided a constant, humming backdrop to this fleeting moment of urban tranquility.",
  "The smell of impending rain hung heavy in the stifling summer air. Dark clouds, bruised with purple and black, massed on the horizon, rolling toward the parched earth with a slow, menacing deliberation. Suddenly, a jagged fork of lightning illuminated the bruised sky, followed seconds later by a thunderclap that seemed to shake the very foundations of the world, announcing the storm's arrival.",
  "She traced the intricate patterns of the antique map with a trembling finger. The faded parchment, brittle with age, whispered secrets of forgotten lands and uncharted seas. The strange, curled script of the place names promised adventure and danger in equal measure, awakening a restlessness in her soul that she had thought long buried beneath the mundane routines of her everyday life.",
  "The coffee shop was a symphony of sounds: the hiss of the espresso machine, the clatter of ceramic cups, the low hum of murmured conversations. The air was rich with the aroma of roasted beans and warm pastries, creating an atmosphere of cozy indulgence that invited patrons to linger over their drinks, escaping the frantic pace of the world outside for just a little while longer.",
  "As the sun dipped below the horizon, painting the sky in vibrant hues of orange and pink, the desert landscape transformed. The harsh, unforgiving heat of the day gave way to a sudden, biting chill. Long shadows stretched across the dunes, distorting the shapes of the sparse scrub brush and giving the barren wasteland an ethereal, almost alien beauty that commanded both awe and respect.",
  "The librarian adjusted her glasses and peered at the dusty tome I had laid before her. Her eyes widened, and a small gasp escaped her lips as she recognized the faded crest stamped on the cracked leather cover. In that instant, I knew my long search was finally over; the missing piece of the puzzle I had been chasing for a decade was resting right there, beneath my fingertips.",
  "The rhythmic sound of waves crashing against the rocky shore provided a soothing lullaby. Seabirds wheeled overhead, their sharp cries piercing the salty air, while the wind whipped the tall grass that clung to the edge of the cliff. It was a wild, untamed place, a stark reminder of nature's raw power and the insignificant, fleeting nature of human existence in the face of the eternal ocean.",
  "The scent of old books is distinct and evocative, a complex blend of vanilla, almonds, and the subtle mustiness of decaying paper. It's a smell that promises hidden knowledge and forgotten stories, a tangible connection to the past. Breathing it in, one can almost feel the presence of the countless hands that have turned the pages, and the minds that have absorbed the words within.",
  "The train rattled through the countryside, a metallic serpent winding its way through fields of green and gold. Small towns flashed by in a blur, offering fleeting glimpses of lives intersecting briefly with mine before vanishing into the distance. The rhythmic clack-clack of the wheels on the tracks became a hypnotic mantra, lulling me into a state of quiet contemplation as the miles rolled away."
];

export function getTextForMode(mode: TextMode, targetLength: number = 800): string {
  let sourceArray: string[];
  switch (mode) {
    case 'common':
      sourceArray = commonParagraphs;
      break;
    case 'quotes':
      sourceArray = quotes;
      break;
    case 'code':
      sourceArray = codeSnippets;
      break;
    case 'numbers':
      sourceArray = numbers;
      break;
    case 'paragraphs':
      sourceArray = paragraphs;
      break;
    default:
      sourceArray = commonParagraphs;
  }

  let currentLength = 0;
  const selectedTexts: string[] = [];
  
  // Shuffle the source array to prevent repeating the same text
  const shuffledSource = getRandomItems(sourceArray, sourceArray.length);
  let index = 0;
  
  while (currentLength < targetLength) {
    const text = shuffledSource[index % shuffledSource.length];
    selectedTexts.push(text);
    currentLength += text.length + 1;
    index++;
  }
  
  return selectedTexts.join(' ').trim();
}

export function getMoreText(mode: TextMode): string {
  let sourceArray: string[];
  switch (mode) {
    case 'common':
      sourceArray = commonParagraphs;
      break;
    case 'quotes':
      sourceArray = quotes;
      break;
    case 'code':
      sourceArray = codeSnippets;
      break;
    case 'numbers':
      sourceArray = numbers;
      break;
    case 'paragraphs':
      sourceArray = paragraphs;
      break;
    default:
      sourceArray = commonParagraphs;
  }
  const randomPick = getRandomItems(sourceArray, 2);
  return randomPick.join(' ');
}
