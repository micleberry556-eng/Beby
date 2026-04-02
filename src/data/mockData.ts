export interface User { id: string; name: string; avatar: string; week?: number; status?: string; city?: string; friends?: number; }
export interface Post { id: string; author: User; content: string; images?: string[]; likes: number; comments: number; shares: number; liked: boolean; timestamp: string; category?: string; }
export interface Group { id: string; name: string; members: number; icon: string; description: string; }
export const currentUser: User = { id: 'me', name: 'Анна Иванова', avatar: '👩', week: 24, status: 'Ожидаю чуда', city: 'Москва', friends: 156 };
export const mockUsers: User[] = [
  { id: '1', name: 'Мария Петрова', avatar: '👩‍🦰', week: 32, city: 'Санкт-Петербург', friends: 89 },
  { id: '2', name: 'Елена Сидорова', avatar: '👩‍🦱', week: 18, city: 'Казань', friends: 124 },
  { id: '3', name: 'Ольга Козлова', avatar: '👱‍♀️', week: 28, city: 'Новосибирск', friends: 67 },
  { id: '4', name: 'Наталья Морозова', avatar: '👩‍🦳', week: 12, city: 'Екатеринбург', friends: 201 },
  { id: '5', name: 'Ирина Волкова', avatar: '🧑‍🦰', week: 36, city: 'Нижний Новгород', friends: 45 },
];
export const mockPosts: Post[] = [
  { id: '1', author: mockUsers[0], content: 'Сегодня были на УЗИ — всё отлично! Малыш уже 1.8 кг, активно пинается.', likes: 42, comments: 8, shares: 2, liked: false, timestamp: '2 часа назад', category: 'УЗИ' },
  { id: '2', author: mockUsers[1], content: 'Девочки, посоветуйте хороший крем от растяжек!', likes: 15, comments: 23, shares: 1, liked: true, timestamp: '4 часа назад', category: 'Здоровье' },
  { id: '3', author: mockUsers[2], content: 'Собрала сумку в роддом! Делюсь списком.', likes: 67, comments: 31, shares: 12, liked: false, timestamp: '6 часов назад', category: 'Подготовка к родам' },
  { id: '4', author: mockUsers[3], content: 'Первый триместр позади! Токсикоз отступил.', likes: 89, comments: 15, shares: 3, liked: false, timestamp: '8 часов назад', category: 'Первый триместр' },
  { id: '5', author: mockUsers[4], content: 'Слушаю колыбельные для малыша — он так реагирует!', likes: 103, comments: 19, shares: 7, liked: true, timestamp: 'вчера', category: 'Музыка' },
];
export const mockGroups: Group[] = [
  { id: '1', name: 'Первый триместр', members: 3420, icon: '🌱', description: '1-12 недель' },
  { id: '2', name: 'Второй триместр', members: 2890, icon: '🌸', description: '13-26 недель' },
  { id: '3', name: 'Третий триместр', members: 2150, icon: '🌺', description: '27-40 недель' },
  { id: '4', name: 'Подготовка к родам', members: 4100, icon: '🏥', description: 'Всё о родах' },
  { id: '5', name: 'Питание мамы', members: 5600, icon: '🥗', description: 'Здоровое питание' },
  { id: '6', name: 'Йога для беременных', members: 1890, icon: '🧘', description: 'Упражнения' },
  { id: '7', name: 'Имена для малышей', members: 7200, icon: '📝', description: 'Выбираем имя' },
  { id: '8', name: 'После родов', members: 6300, icon: '👶', description: 'Первые месяцы' },
];
