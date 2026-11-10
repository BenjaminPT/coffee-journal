// key: [ru, en]
const D = {
  app: ['Coffee Junior', 'Coffee Junior'],
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


Object.assign(D, {
  inst_title: ['Установите на экран телефона', 'Add to your home screen'],
  inst_lead: ['Так Coffee Junior откроется как обычное приложение: на весь экран и без интернета.', 'Coffee Junior will open like a regular app: full screen and offline.'],
  inst_ios_1: ['Откройте сайт в Safari и нажмите «Поделиться» внизу экрана', 'Open the site in Safari and tap Share at the bottom'],
  inst_ios_2: ['Выберите «На экран “Домой”» (пролистайте список вниз)', 'Choose “Add to Home Screen” (scroll the list)'],
  inst_ios_3: ['Нажмите «Добавить», иконка появится на экране', 'Tap Add, the icon appears on your home screen'],
  inst_and_1: ['Откройте сайт в Chrome и нажмите меню ⋮ вверху справа', 'Open the site in Chrome and tap the ⋮ menu at the top right'],
  inst_and_2: ['Выберите «Установить приложение» или «Добавить на главный экран»', 'Choose “Install app” or “Add to Home screen”'],
  inst_and_3: ['Подтвердите, иконка появится на экране', 'Confirm, the icon appears on your home screen'],
  inst_other: ['В меню браузера выберите «Установить» или «Добавить на главный экран».', 'In the browser menu choose “Install” or “Add to Home screen”.'],
  inst_btn: ['Установить сейчас', 'Install now'], inst_ok: ['Понятно', 'Got it'], inst_menu: ['Как установить на экран', 'How to install'],
  inst_safari: ['На iPhone установка работает только из Safari.', 'On iPhone, installing only works from Safari.'],
  theme_black: ['Чёрная', 'Black'],
  prof_title: ['Профиль', 'Profile'], prof_name: ['Ваше имя', 'Your name'], prof_name_ph: ['Например, Алекс', 'e.g. Alex'], prof_default: ['Любитель кофе', 'Coffee lover'],
  prof_qr: ['QR-профиль', 'Profile QR'], prof_note: ['QR содержит имя и статистику на момент создания. Друг увидит снимок, живой связи нет.', 'The QR holds your name and a stats snapshot taken now. Your friend sees a snapshot, there is no live link.'],
  prof_snapshot: ['Снимок на {date}', 'Snapshot from {date}'], prof_of: ['Профиль: {name}', 'Profile: {name}'],
  qr_scan: ['Сканировать', 'Scan QR'], qr_create: ['Создать QR', 'Create QR'], qr_recipe_t: ['QR рецепта', 'Recipe QR'],
  qr_recipe_hint: ['Покажите код другу: он отсканирует его в приложении (кнопка «Сканировать») или камерой телефона и получит этот рецепт.', 'Show this code to a friend: they scan it in the app (Scan button) or with the phone camera and get this recipe.'],
  qr_profile_hint: ['Отсканируйте в приложении или камерой телефона, чтобы увидеть профиль и статистику.', 'Scan in the app or with the phone camera to see the profile and stats.'],
  qr_scan_t: ['Сканер QR', 'QR scanner'], qr_scan_hint: ['Наведите камеру на QR-код рецепта или профиля', 'Point the camera at a recipe or profile QR code'],
  qr_cam_denied: ['Нет доступа к камере. Разрешите её в настройках браузера или отсканируйте код камерой телефона: ссылка откроет приложение.', 'No camera access. Allow it in the browser settings, or scan with the phone camera: the link opens the app.'],
  qr_cam_none: ['Камера недоступна. Отсканируйте код камерой телефона: ссылка откроет приложение.', 'Camera unavailable. Scan with the phone camera: the link opens the app.'],
  qr_bad: ['Это не QR из «Coffee Junior»', 'This is not a Coffee Junior QR'], qr_too_long: ['Рецепт слишком длинный для QR. Сократите заметки.', 'Recipe is too long for a QR. Shorten the notes.'],
  qr_gallery: ['Выбрать фото с QR', 'Pick a photo with QR'], qr_no_code: ['На фото не нашлось QR-кода', 'No QR code found in the photo'],
  qr_copy: ['Скопировать ссылку', 'Copy link'], qr_share: ['Поделиться', 'Share'], link_copied: ['Ссылка скопирована', 'Link copied'],
  qr_loaded: ['Рецепт загружен: проверьте и сохраните', 'Recipe loaded: review and save'],
  imp_title: ['Рецепт от {name}', 'Recipe from {name}'], imp_save: ['Сохранить в рецепты', 'Save to recipes'], imp_brew: ['Сварить', 'Brew it'], imp_saved: ['Рецепт сохранён', 'Recipe saved'],
  recipes: ['Рецепты', 'Recipes'], recipe: ['Рецепт', 'Recipe'], recipes_empty: ['Здесь будут рецепты, полученные по QR. В статистику они не попадают, пока вы их не сварите.', 'Recipes received via QR appear here. They are not counted in stats until you brew them.'],
  st_note: ['В статистику попадают только варки, которые вы записали сами или сварили кнопкой «Сварить». Примеры и полученные рецепты не считаются.', 'Stats count only brews you logged yourself or made with the “Brew” button. Examples and received recipes are not counted.'],
  demo_badge: ['пример', 'example'], demo_clear: ['Убрать примеры', 'Remove examples'], demo_cleared: ['Примеры удалены', 'Examples removed'],
  cat_search: ['Поиск по каталогу', 'Search the catalog'], cat_pick: ['Выберите из каталога', 'Pick from the catalog'], cat_none: ['Ничего не найдено. Введите название вручную ниже.', 'Nothing found. Type a name below.'],
  cat_count: ['В каталоге: {n}', 'In the catalog: {n}'], cat_or: ['Или своё название', 'Or a custom name'], cat_added: ['Добавлено: {name}', 'Added: {name}'],
  method_pick: ['Выберите метод из списка', 'Pick a method from the list'], gear_empty_t: ['Пока пусто', 'Nothing here yet'],
  qr_tab_hint: ['Рецепт из QR', 'Recipe from QR'], from_user: ['От: {name}', 'From: {name}'], brew_recipe: ['Сварить по рецепту', 'Brew this recipe'],
  settings_profile: ['Профиль', 'Profile'], splash_sub: ['Заваривайте осознанно', 'Brew with intent'], splash_skip: ['Нажмите, чтобы пропустить', 'Tap to skip'],
});

export const EQUIP_CATALOG = [
  ...['Hario V60-01', 'Hario V60-02', 'Hario V60 Switch', 'Hario Mugen', 'Chemex Classic 3 Cup', 'Chemex Classic 6 Cup', 'Chemex 8 Cup', 'Kalita Wave 155', 'Kalita Wave 185', 'AeroPress Original', 'AeroPress Go', 'AeroPress Clear',
    'Clever Dripper', 'French Press Bodum Chambord', 'Origami Dripper', 'April Brewer', 'Orea V3', 'Fellow Stagg [X]', 'Timemore B75', 'Melitta 1x4', 'Bialetti Moka Express', 'Moka Pot Alessi', 'Moccamaster KBG', 'Technivorm Moccamaster', 'Gaggia Classic Pro',
    'Breville Barista Express', 'De’Longhi Dedica', 'Rancilio Silvia', 'Flair 58', 'Flair Classic', 'Hario Syphon Technica', 'Cezve / Ibrik', 'Vietnamese Phin', 'Espro Bloom', 'Cold Brew Mizudashi'].map((name) => ({ type: 'brewer', name })),
  ...['Comandante C40 MK4', '1Zpresso JX-Pro', '1Zpresso K-Ultra', '1Zpresso Q2', '1Zpresso J-Max', 'Timemore Chestnut C2', 'Timemore Chestnut C3', 'Timemore Chestnut S3', 'Fellow Ode Gen 2', 'Fellow Opus', 'Baratza Encore', 'Baratza Virtuoso+', 'Baratza Sette 270',
    'Baratza Vario', 'Eureka Mignon Specialita', 'Niche Zero', 'DF64 Gen 2', 'Lagom P64', 'Kinu M47', 'Weber EG-1', 'Hario Skerton Pro', 'Hario Mini Mill', 'Wilfa Svart Aroma', 'Option-O Lagom Mini', 'Mahlkönig EK43', 'Rocket Faustino', 'DF83', 'Hario Coffee Mill Slim'].map((name) => ({ type: 'grinder', name })),
  ...['Fellow Stagg EKG', 'Fellow Stagg Pour-Over Kettle', 'Brewista Artisan', 'Bonavita Gooseneck', 'Hario Buono Kettle', 'Timemore Fish', 'Bodum Melior', 'Cuisinart PerfecTemp', 'Hario Drip Kettle Air'].map((name) => ({ type: 'kettle', name })),
  ...['Acaia Pearl', 'Acaia Lunar', 'Timemore Black Mirror Basic', 'Timemore Black Mirror Nano', 'Hario V60 Drip Scale', 'Felicita Arc', 'Brewista Smart Scale II', 'Fellow Tally'].map((name) => ({ type: 'scale', name })),
  ...['Hario V60 paper (white)', 'Hario V60 paper (bleached)', 'Chemex bonded filters', 'Kalita Wave paper', 'AeroPress paper', 'Cafec Abaca', 'Able Kone (metal)', 'Cloth filter (Woodneck)'].map((name) => ({ type: 'filter', name })),
  ...['Third Wave Water Classic', 'Third Wave Water Light', 'Barista Hustle Water Recipe', 'Lotus Water Drops', 'Bottled water (low minerals)', 'Filtered tap water'].map((name) => ({ type: 'water', name })),
];

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
