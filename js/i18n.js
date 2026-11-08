// key: [ru, en]
const D = {
  app: ['Кофейный журнал', 'Coffee Journal'],
  tab_brews: ['Журнал', 'Journal'], tab_coffees: ['Кофе', 'Beans'], tab_gear: ['Гаджеты', 'Gear'], tab_more: ['Ещё', 'More'],
  new_brew: ['Новая варка', 'New brew'], edit_brew: ['Редактировать варку', 'Edit brew'],
  brews_title: ['Журнал варок', 'Brew journal'], products_title: ['Мои кофе', 'My coffees'], gear_title: ['Гаджеты', 'Gear'], more_title: ['Ещё', 'More'],
  search_brews: ['Поиск по варкам, кофе, вкусам…', 'Search brews, coffees, flavors…'], search_products: ['Поиск по кофе, обжарщикам, странам…', 'Search coffees, roasters, origins…'],
  clear: ['Очистить', 'Clear'], filter_all: ['Все', 'All'], filter_fav: ['Избранные', 'Favorites'],
  compare: ['Сравнить', 'Compare'], compare_n: ['Выбрано: {n} из 2', 'Selected: {n} of 2'], compare_title: ['Сравнение варок', 'Brew comparison'], compare_pick: ['Выберите две варки', 'Pick two brews'],
  cancel_select: ['Отмена', 'Cancel'],
  empty_brews_t: ['Журнал пока пуст', 'Your journal is empty'], empty_brews_p: ['Запишите первую варку: рецепт, оценку и вкус.', 'Log your first brew: recipe, rating and taste.'],
  add_first_brew: ['Записать варку', 'Log a brew'], try_demo: ['Посмотреть на примерах', 'Try with examples'],
  empty_products_t: ['Пока нет ни одной пачки', 'No coffee bags yet'], empty_products_p: ['Сохраните зёрна: обжарщик, происхождение, обработка, вкус.', 'Save your beans: roaster, origin, process and taste.'], add_coffee: ['Добавить кофе', 'Add coffee'],
  empty_gear_p: ['Добавьте кофемолку, заварник или рецепт воды: их можно выбирать в варках.', 'Add a grinder, brewer or water recipe, then pick them in brews.'],
  no_results: ['Ничего не найдено', 'Nothing found'], no_results_p: ['Попробуйте другой запрос.', 'Try a different search.'],
  // product
  new_coffee: ['Новый кофе', 'New coffee'], edit_coffee: ['Редактировать кофе', 'Edit coffee'],
  f_name: ['Название', 'Name'], f_roastery: ['Обжарщик', 'Roastery'], f_country: ['Страна', 'Country'], f_region: ['Регион', 'Region'], f_altitude: ['Высота', 'Altitude'],
  f_producer: ['Ферма / производитель', 'Farm / producer'], f_varietal: ['Сорт', 'Varietal'], f_process: ['Обработка', 'Process'], f_roast: ['Обжарка', 'Roast'], f_roast_date: ['Дата обжарки', 'Roast date'],
  f_weight: ['Вес пачки', 'Bag weight'], f_price: ['Цена', 'Price'], f_flavors: ['Вкусовой профиль', 'Flavor profile'], f_info: ['История кофе / заметки', 'Story / notes'],
  f_photo: ['Фото пачки', 'Bag photo'], f_rating: ['Оценка', 'Rating'], add_photo: ['Добавить фото', 'Add photo'], change_photo: ['Заменить фото', 'Change photo'], remove_photo: ['Убрать', 'Remove'],
  name_required: ['Укажите название', 'Enter a name'],
  p_washed: ['Мытая', 'Washed'], p_natural: ['Натуральная', 'Natural'], p_honey: ['Хани', 'Honey'], p_anaerobic: ['Анаэробная', 'Anaerobic'], p_other: ['Другая', 'Other'],
  r_light: ['Светлая', 'Light'], r_ml: ['Средне-светлая', 'Medium-light'], r_medium: ['Средняя', 'Medium'], r_md: ['Средне-тёмная', 'Medium-dark'], r_dark: ['Тёмная', 'Dark'],
  // flavors
  fl_chocolate: ['Шоколад', 'Chocolate'], fl_caramel: ['Карамель', 'Caramel'], fl_nutty: ['Орех', 'Nutty'], fl_fruity: ['Фрукты', 'Fruity'], fl_berry: ['Ягоды', 'Berry'], fl_citrus: ['Цитрус', 'Citrus'],
  fl_stone: ['Косточковые', 'Stone fruit'], fl_floral: ['Цветочный', 'Floral'], fl_spicy: ['Пряный', 'Spicy'], fl_honey: ['Мёд', 'Honey'], fl_tea: ['Чайный', 'Tea-like'], fl_winey: ['Винный', 'Winey'],
  fl_tropical: ['Тропики', 'Tropical'], fl_sweet: ['Сладкий', 'Sweet'], fl_bitter: ['Горький', 'Bitter'], fl_sour: ['Кислый', 'Sour'], fl_balanced: ['Баланс', 'Balanced'], fl_smoky: ['Дымный', 'Smoky'],
  // brew
  f_product: ['Кофе', 'Coffee'], f_no_product: ['Без привязки к пачке', 'No bag'], f_method: ['Метод заваривания', 'Brew method'], f_custom_method: ['Свой метод…', 'Custom method…'],
  f_date: ['Дата и время', 'Date & time'], f_dose: ['Кофе', 'Coffee'], f_ratio: ['Пропорция 1 :', 'Ratio 1 :'], f_water: ['Вода', 'Water'], f_temp: ['Температура', 'Temperature'],
  f_grind: ['Помол', 'Grind'], f_grind_ph: ['например, 22 клика', 'e.g. 22 clicks'], f_time: ['Время', 'Time'], f_min: ['мин', 'min'], f_sec: ['сек', 'sec'],
  f_grinder: ['Кофемолка', 'Grinder'], f_brewer: ['Заварник', 'Brewer'], f_filter: ['Фильтр', 'Filter'], f_water_recipe: ['Вода', 'Water recipe'], f_none: ['—', '—'],
  f_tds: ['TDS', 'TDS'], f_cupping: ['Оценка SCA', 'Cupping score'], f_notes: ['Заметки', 'Notes'], f_notes_ph: ['Что получилось, что поменять в следующий раз…', 'What worked, what to change next time…'],
  f_fav: ['В избранное', 'Favorite'], f_taste: ['Вкус', 'Taste'], section_recipe: ['Рецепт', 'Recipe'], section_gear: ['Оборудование', 'Equipment'], section_result: ['Результат', 'Result'],
  timer_start: ['Старт', 'Start'], timer_pause: ['Пауза', 'Pause'], timer_reset: ['Сброс', 'Reset'], timer_hint: ['Время попадёт в форму', 'Time goes into the form'],
  save: ['Сохранить', 'Save'], cancel: ['Отмена', 'Cancel'], close: ['Закрыть', 'Close'], edit: ['Изменить', 'Edit'], delete: ['Удалить', 'Delete'], back: ['Назад', 'Back'],
  duplicate: ['Повторить', 'Brew again'], brew_this: ['Сварить', 'Brew this'], fav_add: ['Добавить в избранное', 'Add to favorites'], fav_remove: ['Убрать из избранного', 'Remove from favorites'],
  no_product: ['Без кофе', 'No coffee'], rating_of: ['{n} из 5', '{n} out of 5'], no_rating: ['Без оценки', 'Not rated'],
  // toasts / confirms
  saved: ['Сохранено', 'Saved'], deleted: ['Удалено', 'Deleted'], undo: ['Отменить', 'Undo'], imported: ['Импортировано записей: {n}', 'Imported records: {n}'],
  import_err: ['Не удалось прочитать файл', 'Could not read the file'], storage_full: ['Память браузера заполнена. Сделайте резервную копию и удалите лишние фото.', 'Browser storage is full. Back up and remove some photos.'],
  demo_loaded: ['Примеры добавлены', 'Examples added'], copied: ['Варка скопирована, поправьте и сохраните', 'Brew copied, adjust and save'],
  confirm_del_product: ['Удалить «{name}»? Варки останутся в журнале.', 'Delete “{name}”? Its brews stay in the journal.'], confirm_del_brew: ['Удалить эту варку?', 'Delete this brew?'],
  confirm_yes: ['Удалить', 'Delete'],
  // detail
  d_params: ['Параметры', 'Parameters'], d_gear: ['Оборудование', 'Equipment'], d_taste: ['Вкус', 'Taste'], d_notes: ['Заметки', 'Notes'], d_brews: ['Варки этого кофе', 'Brews of this coffee'],
  d_about: ['О кофе', 'About this coffee'], d_no_brews: ['С этим кофе ещё нет варок', 'No brews with this coffee yet'], d_ratio: ['Пропорция', 'Ratio'], d_brews_n: ['{n} варок', '{n} brews'],
  s_dose: ['Кофе', 'Coffee'], s_water: ['Вода', 'Water'], s_ratio: ['Пропорция', 'Ratio'], s_temp: ['Температура', 'Temp'], s_time: ['Время', 'Time'], s_grind: ['Помол', 'Grind'],
  // equipment
  eq_grinder: ['Кофемолки', 'Grinders'], eq_brewer: ['Заварники', 'Brewers'], eq_filter: ['Фильтры', 'Filters'], eq_kettle: ['Чайники', 'Kettles'], eq_scale: ['Весы', 'Scales'], eq_water: ['Рецепты воды', 'Water recipes'], eq_other: ['Другое', 'Other'],
  eq_t_grinder: ['Кофемолка', 'Grinder'], eq_t_brewer: ['Заварник', 'Brewer'], eq_t_filter: ['Фильтр', 'Filter'], eq_t_kettle: ['Чайник', 'Kettle'], eq_t_scale: ['Весы', 'Scale'], eq_t_water: ['Рецепт воды', 'Water recipe'], eq_t_other: ['Другое', 'Other'],
  eq_add: ['Добавить', 'Add'], eq_new: ['Новый предмет', 'New item'], eq_edit: ['Изменить предмет', 'Edit item'], eq_type: ['Тип', 'Type'], eq_name: ['Название', 'Name'], eq_notes: ['Заметки', 'Notes'],
  methods_t: ['Мои методы', 'My methods'], method_add: ['Добавить метод', 'Add method'], method_name: ['Название метода', 'Method name'], methods_empty: ['В списке уже 60+ методов. Здесь можно добавить свой.', 'Over 60 methods are built in. Add your own here.'],
  // more
  st_title: ['Статистика', 'Statistics'], st_brews: ['Варок', 'Brews'], st_avg: ['Ср. оценка', 'Avg rating'], st_dose: ['Кофе, г', 'Coffee, g'], st_method: ['Любимый метод', 'Top method'],
  st_week: ['Последние 7 дней', 'Last 7 days'], st_flavors: ['Частые вкусы', 'Common flavors'], st_best: ['Лучшая варка', 'Best brew'], st_none: ['Пока нет данных', 'No data yet'],
  data_t: ['Данные', 'Data'], exp_json: ['Резервная копия (JSON)', 'Backup (JSON)'], exp_csv: ['Таблица для Excel (CSV)', 'Spreadsheet (CSV)'], exp_pdf: ['Печать / PDF журнала', 'Print / PDF journal'],
  imp_json: ['Восстановить из копии', 'Restore from backup'], data_note: ['Данные хранятся только на этом устройстве. Делайте резервные копии: так их можно перенести на другое устройство.', 'Data is stored only on this device. Back up regularly to move it to another device.'],
  settings_t: ['Настройки', 'Settings'], theme: ['Тема', 'Theme'], theme_auto: ['Авто', 'Auto'], theme_light: ['Светлая', 'Light'], theme_dark: ['Тёмная', 'Dark'],
  lang: ['Язык', 'Language'], temp_unit: ['Температура', 'Temperature'], install: ['Установить на экран', 'Install app'], install_ios: ['На iPhone: «Поделиться» → «На экран Домой».', 'On iPhone: Share → Add to Home Screen.'],
  reset_all: ['Удалить все данные', 'Delete all data'], reset_confirm: ['Удалить все данные без возможности восстановления?', 'Delete all data permanently?'], about_t: ['О приложении', 'About'],
  about_txt: ['Независимый кофейный дневник по мотивам iBrewCoffee: кофе, варки, оборудование, экспорт. Работает офлайн.', 'An independent coffee journal inspired by iBrewCoffee: beans, brews, gear, export. Works offline.'],
  print_title: ['Мой кофейный журнал', 'My coffee journal'], print_coffees: ['Кофе', 'Coffees'], print_brews: ['Варки', 'Brews'],
  // csv/print headers
  h_date: ['Дата', 'Date'], h_coffee: ['Кофе', 'Coffee'], h_method: ['Метод', 'Method'], h_dose: ['Кофе, г', 'Coffee, g'], h_water: ['Вода, г', 'Water, g'], h_ratio: ['Пропорция', 'Ratio'], h_temp: ['Темп., °C', 'Temp, °C'],
  h_grind: ['Помол', 'Grind'], h_time: ['Время', 'Time'], h_rating: ['Оценка', 'Rating'], h_notes: ['Заметки', 'Notes'], h_flavors: ['Вкус', 'Flavors'],
};

export const METHODS = [
  'Espresso', 'Ristretto', 'Lungo', 'Moka Pot', 'AeroPress', 'AeroPress (inverted)', 'AeroPress Go', 'French Press', 'Hario V60', 'Chemex', 'Kalita Wave', 'Clever Dripper',
  'Origami Dripper', 'Melitta', 'Bee House', 'April Brewer', 'Orea', 'Flat-bottom dripper', 'Wilfa Svart', 'Moccamaster', 'Batch brew', 'Siphon', 'Cold brew', 'Cold drip',
  'Japanese iced', 'Turkish cezve', 'Vietnamese phin', 'Neapolitan flip', 'Woodneck (nel drip)', 'Hario Switch', 'Fellow Stagg [X]', 'Metal filter pour-over', 'Espro Bloom',
  'Timemore B75', 'Gabi Master A', 'Ceado Hoop', 'Oxo Rapid Brewer', 'Bialetti Brikka', 'Delter Press', 'Flair / manual espresso', 'Pour-over (generic)', 'Immersion (generic)',
  'Drip machine', 'Percolator', 'Cupping', 'Hario Mugen', 'Trinity One', 'Trinity Zero', 'Tricolate', 'Bonmac', 'Cafec Deep 27', 'Kalita 185', 'Eva Solo', 'Bodum Chambord',
  'Pulsar', 'Sworks Bottomless', 'Kono dripper', 'Clever + Switch', 'Stovetop espresso', 'Nitro cold brew',
];
export const ROASTS = ['light', 'ml', 'medium', 'md', 'dark'];
export const ROAST_COLORS = ['#d2a869', '#b98446', '#8d5a2b', '#5c3a1e', '#2d1b10'];
export const PROCESSES = ['washed', 'natural', 'honey', 'anaerobic', 'other'];
export const FLAVORS = ['chocolate', 'caramel', 'nutty', 'fruity', 'berry', 'citrus', 'stone', 'floral', 'spicy', 'honey', 'tea', 'winey', 'tropical', 'sweet', 'bitter', 'sour', 'balanced', 'smoky'];
export const EQ_TYPES = ['grinder', 'brewer', 'filter', 'kettle', 'scale', 'water', 'other'];
export const COUNTRIES = ['Ethiopia', 'Kenya', 'Colombia', 'Brazil', 'Guatemala', 'Costa Rica', 'Panama', 'Rwanda', 'Burundi', 'Tanzania', 'Uganda', 'Honduras', 'El Salvador', 'Nicaragua', 'Peru', 'Bolivia', 'Mexico', 'Indonesia', 'Yemen', 'India', 'Vietnam', 'Papua New Guinea', 'Jamaica', 'Hawaii', 'China', 'Thailand'];

let lang = 'ru';
export const getLang = () => lang;
export function setLang(l) {
  lang = l === 'en' ? 'en' : 'ru';
  document.documentElement.lang = lang;
}
export function detectLang() {
  return (navigator.language || 'ru').toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
export function t(key, vars) {
  const row = D[key];
  let s = row ? row[lang === 'ru' ? 0 : 1] : key;
  if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k]);
  return s;
}
export const hasKey = (k) => k in D;
export const KEYS = Object.keys(D);
