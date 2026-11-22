var FAMILY_LINK_CARD_VERSION = '1.2.4';

// ── i18n ──────────────────────────────────────────────────────────────────────
var FamilyLinkI18n = {
  en: {
    status_tracked: 'Tracked',
    status_attention: 'Attention',
    status_locked: 'Locked',
    status_not_tracked: 'Not tracked',
    devices: '{n} devices',
    device_one: '1 device',
    all: 'All',
    no_entity: 'No child found. Set up the Family Link integration, or set “entity” to a child’s status sensor.',
    unavailable: 'Family Link data is unavailable for now.',
    stale: 'Family Link unreachable: data of the last update',
    left: 'left',
    left_of: 'left of {limit}',
    used_today: 'used today',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Screen time',
    top_apps: 'Top apps today',
    no_usage: 'No screen time yet today',
    app_limit: '{n} max',
    always_allowed: 'Always allowed',
    blocked: 'Blocked',
    location: 'Location',
    unknown_place: 'Somewhere',
    not_located: 'Not located',
    blocked_apps: 'Blocked apps',
    battery: 'Battery',
    bedtime: 'Bedtime',
    schooltime: 'School time',
    in: 'in {d}',
    until: 'until {t}',
    none: '—',
    ago_now: 'just now',
    ago_min: '{n} min ago',
    ago_h: '{n} h ago',
    ago_d: '{n} d ago',
    locked_parent: 'Locked by a parent',
    locked_bedtime: 'Bedtime · until {t}',
    locked_school: 'School time · until {t}',
    locked_limit: 'Daily limit reached',
    break_title: 'Time for a break',
    break_hint: 'Calls and allowed apps still work',
    bonus_running: '+{n} min bonus',
    bonus_left: '{n} min left',
    bonus_until: 'until {t}',
    revoke: 'Revoke',
    revoke_confirm: 'Revoke the +{n} min bonus of {device}?',
    add: 'Add',
    add_minutes: 'Add {n} min',
    less: 'Less',
    more: 'More',
    lock: 'Lock',
    unlock: 'Unlock',
    ring: 'Ring',
    ringing: 'Ringing…',
    locate: 'Locate',
    emergency: 'Emergency',
    actions_for: 'Actions apply to {device}',
    cancel: 'Cancel',
    close: 'Close',
    show_full: 'Show the full card',
    show_compact: 'Back to the compact view',
    done: 'Done',
    failed: 'Failed: {error}',
    today: 'Today',
    h24: '24 h',
    d7: '7 days',
    points: '{n} points',
    km: '{n} km',
    update_location: 'Update location',
    open_history: 'Open history',
    accuracy: '±{n} m',
    no_trace: 'No position recorded over this period',
    loading: 'Loading…',
    emergency_title: 'Emergency · {name}',
    message: 'Message',
    quick_call: 'Call me back',
    quick_home: 'Come home',
    quick_where: 'Where are you?',
    opt_ring: 'Ring the device',
    opt_ring_hint: 'Family Link · even on silent',
    opt_notify: 'Critical notification with the message',
    opt_notify_hint: 'Home Assistant app · {service}',
    opt_locate: 'Ask for a fresh location',
    opt_locate_hint: 'Family Link · uses battery',
    send_emergency: 'Send emergency',
    emergency_sent: 'Emergency sent',
    school_mode: 'School mode',
    school_blocked: '{n} apps blocked',
    editor: {
      entity: 'Child (status sensor)',
      title: 'Title',
      device: 'Device shown first',
      device_type: 'Device drawing',
      type_auto: 'Automatic',
      type_phone: 'Phone',
      type_tablet: 'Tablet',
      show_scene: 'Show the animated device',
      show_top_apps: 'Show the top apps',
      show_actions: 'Show the actions',
      show_location: 'Show the location',
      trace_hours: 'Route shown by default (hours)',
      language: 'Language',
      lang_auto: 'Automatic',
      illustration: 'Illustrated header',
      illustration_theme: 'Illustration theme',
      theme_auto: 'Automatic (follows the theme)',
      theme_day: 'Day',
      theme_night: 'Night',
    },
  },
  fr: {
    status_tracked: 'Suivi',
    status_attention: 'Attention',
    status_locked: 'Verrouillé',
    status_not_tracked: 'Non suivi',
    devices: '{n} appareils',
    device_one: '1 appareil',
    all: 'Tous',
    no_entity: 'Aucun enfant trouvé. Configurez l’intégration Family Link, ou renseignez « entity » avec le capteur de statut d’un enfant.',
    unavailable: 'Les données Family Link sont indisponibles pour le moment.',
    stale: 'Family Link injoignable : données de la dernière mise à jour',
    left: 'restantes',
    left_of: 'restantes sur {limit}',
    used_today: 'utilisées aujourd’hui',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Temps d’écran',
    top_apps: 'Applis les plus utilisées',
    no_usage: 'Pas encore de temps d’écran aujourd’hui',
    app_limit: '{n} max',
    always_allowed: 'Toujours autorisée',
    blocked: 'Bloquée',
    location: 'Position',
    unknown_place: 'Quelque part',
    not_located: 'Non localisé',
    blocked_apps: 'Applis bloquées',
    battery: 'Batterie',
    bedtime: 'Coucher',
    schooltime: 'École',
    in: 'dans {d}',
    until: 'jusqu’à {t}',
    none: '—',
    ago_now: 'à l’instant',
    ago_min: 'il y a {n} min',
    ago_h: 'il y a {n} h',
    ago_d: 'il y a {n} j',
    locked_parent: 'Verrouillé par un parent',
    locked_bedtime: 'Coucher · jusqu’à {t}',
    locked_school: 'École · jusqu’à {t}',
    locked_limit: 'Limite du jour atteinte',
    break_title: 'C’est l’heure d’une pause',
    break_hint: 'Les appels et applis autorisées fonctionnent',
    bonus_running: 'Bonus +{n} min',
    bonus_left: 'encore {n} min',
    bonus_until: 'jusqu’à {t}',
    revoke: 'Révoquer',
    revoke_confirm: 'Révoquer le bonus de +{n} min de {device} ?',
    add: 'Ajouter',
    add_minutes: 'Ajouter {n} min',
    less: 'Moins',
    more: 'Plus',
    lock: 'Verrouiller',
    unlock: 'Déverrouiller',
    ring: 'Faire sonner',
    ringing: 'Sonnerie…',
    locate: 'Localiser',
    emergency: 'Urgence',
    actions_for: 'Les actions s’appliquent à {device}',
    cancel: 'Annuler',
    close: 'Fermer',
    show_full: 'Afficher la carte complète',
    show_compact: 'Revenir à la vue compacte',
    done: 'C’est fait',
    failed: 'Échec : {error}',
    today: 'Aujourd’hui',
    h24: '24 h',
    d7: '7 jours',
    points: '{n} points',
    km: '{n} km',
    update_location: 'Actualiser la position',
    open_history: 'Ouvrir l’historique',
    accuracy: '±{n} m',
    no_trace: 'Aucune position enregistrée sur cette période',
    loading: 'Chargement…',
    emergency_title: 'Urgence · {name}',
    message: 'Message',
    quick_call: 'Rappelle-moi',
    quick_home: 'Rentre à la maison',
    quick_where: 'Où es-tu ?',
    opt_ring: 'Faire sonner l’appareil',
    opt_ring_hint: 'Family Link · même en silencieux',
    opt_notify: 'Notification critique avec le message',
    opt_notify_hint: 'Appli Home Assistant · {service}',
    opt_locate: 'Demander une position récente',
    opt_locate_hint: 'Family Link · consomme la batterie',
    send_emergency: 'Envoyer l’urgence',
    emergency_sent: 'Urgence envoyée',
    school_mode: 'Mode école',
    school_blocked: '{n} applis bloquées',
    editor: {
      entity: 'Enfant (capteur de statut)',
      title: 'Titre',
      device: 'Appareil affiché en premier',
      device_type: 'Dessin de l’appareil',
      type_auto: 'Automatique',
      type_phone: 'Téléphone',
      type_tablet: 'Tablette',
      show_scene: 'Afficher l’appareil animé',
      show_top_apps: 'Afficher les applis les plus utilisées',
      show_actions: 'Afficher les actions',
      show_location: 'Afficher la position',
      trace_hours: 'Trajet affiché par défaut (heures)',
      language: 'Langue',
      lang_auto: 'Automatique',
      illustration: 'En-tête illustré',
      illustration_theme: 'Thème de l’illustration',
      theme_auto: 'Automatique (suit le thème)',
      theme_day: 'Jour',
      theme_night: 'Nuit',
    },
  },
  de: {
    status_tracked: 'Überwacht',
    status_attention: 'Achtung',
    status_locked: 'Gesperrt',
    status_not_tracked: 'Nicht überwacht',
    devices: '{n} Geräte',
    device_one: '1 Gerät',
    all: 'Alle',
    no_entity: 'Kein Kind gefunden. Richten Sie die Integration Family Link ein oder setzen Sie „entity“ auf den Statussensor eines Kindes.',
    unavailable: 'Die Family-Link-Daten sind derzeit nicht verfügbar.',
    stale: 'Family Link nicht erreichbar: Daten der letzten Aktualisierung',
    left: 'übrig',
    left_of: 'übrig von {limit}',
    used_today: 'heute genutzt',
    min: '{n} Min.',
    h: '{h} Std.',
    hmin: '{h} Std. {m}',
    screen_time: 'Bildschirmzeit',
    top_apps: 'Meistgenutzte Apps heute',
    no_usage: 'Heute noch keine Bildschirmzeit',
    app_limit: 'max. {n}',
    always_allowed: 'Immer erlaubt',
    blocked: 'Blockiert',
    location: 'Standort',
    unknown_place: 'Irgendwo',
    not_located: 'Nicht geortet',
    blocked_apps: 'Blockierte Apps',
    battery: 'Akku',
    bedtime: 'Schlafenszeit',
    schooltime: 'Schulzeit',
    in: 'in {d}',
    until: 'bis {t}',
    none: '—',
    ago_now: 'gerade eben',
    ago_min: 'vor {n} Min.',
    ago_h: 'vor {n} Std.',
    ago_d: 'vor {n} T.',
    locked_parent: 'Von einem Elternteil gesperrt',
    locked_bedtime: 'Schlafenszeit · bis {t}',
    locked_school: 'Schulzeit · bis {t}',
    locked_limit: 'Tageslimit erreicht',
    break_title: 'Zeit für eine Pause',
    break_hint: 'Anrufe und erlaubte Apps funktionieren weiter',
    bonus_running: '+{n} Min. Bonus',
    bonus_left: 'noch {n} Min.',
    bonus_until: 'bis {t}',
    revoke: 'Widerrufen',
    revoke_confirm: 'Den Bonus von +{n} Min. für {device} widerrufen?',
    add: 'Hinzufügen',
    add_minutes: '{n} Min. hinzufügen',
    less: 'Weniger',
    more: 'Mehr',
    lock: 'Sperren',
    unlock: 'Entsperren',
    ring: 'Klingeln lassen',
    ringing: 'Klingelt…',
    locate: 'Orten',
    emergency: 'Notfall',
    actions_for: 'Aktionen gelten für {device}',
    cancel: 'Abbrechen',
    close: 'Schließen',
    show_full: 'Vollständige Karte anzeigen',
    show_compact: 'Zurück zur kompakten Ansicht',
    done: 'Erledigt',
    failed: 'Fehlgeschlagen: {error}',
    today: 'Heute',
    h24: '24 Std.',
    d7: '7 Tage',
    points: '{n} Punkte',
    km: '{n} km',
    update_location: 'Standort aktualisieren',
    open_history: 'Verlauf öffnen',
    accuracy: '±{n} m',
    no_trace: 'In diesem Zeitraum keine Position aufgezeichnet',
    loading: 'Wird geladen…',
    emergency_title: 'Notfall · {name}',
    message: 'Nachricht',
    quick_call: 'Ruf mich zurück',
    quick_home: 'Komm nach Hause',
    quick_where: 'Wo bist du?',
    opt_ring: 'Gerät klingeln lassen',
    opt_ring_hint: 'Family Link · auch im Lautlos-Modus',
    opt_notify: 'Kritische Benachrichtigung mit der Nachricht',
    opt_notify_hint: 'Home-Assistant-App · {service}',
    opt_locate: 'Aktuellen Standort anfordern',
    opt_locate_hint: 'Family Link · verbraucht Akku',
    send_emergency: 'Notfall senden',
    emergency_sent: 'Notfall gesendet',
    school_mode: 'Schulmodus',
    school_blocked: '{n} Apps blockiert',
    editor: {
      entity: 'Kind (Statussensor)',
      title: 'Titel',
      device: 'Zuerst angezeigtes Gerät',
      device_type: 'Gerätezeichnung',
      type_auto: 'Automatisch',
      type_phone: 'Telefon',
      type_tablet: 'Tablet',
      show_scene: 'Animiertes Gerät anzeigen',
      show_top_apps: 'Meistgenutzte Apps anzeigen',
      show_actions: 'Aktionen anzeigen',
      show_location: 'Standort anzeigen',
      trace_hours: 'Standardmäßig angezeigte Route (Stunden)',
      language: 'Sprache',
      lang_auto: 'Automatisch',
      illustration: 'Illustrierte Kopfzeile',
      illustration_theme: 'Thema der Illustration',
      theme_auto: 'Automatisch (folgt dem Design)',
      theme_day: 'Tag',
      theme_night: 'Nacht',
    },
  },
  es: {
    status_tracked: 'Supervisado',
    status_attention: 'Atención',
    status_locked: 'Bloqueado',
    status_not_tracked: 'Sin supervisión',
    devices: '{n} dispositivos',
    device_one: '1 dispositivo',
    all: 'Todos',
    no_entity: 'No se ha encontrado ningún niño. Configura la integración Family Link o indica en «entity» el sensor de estado de un niño.',
    unavailable: 'Los datos de Family Link no están disponibles por ahora.',
    stale: 'Family Link inaccesible: datos de la última actualización',
    left: 'restantes',
    left_of: 'restantes de {limit}',
    used_today: 'usados hoy',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Tiempo de pantalla',
    top_apps: 'Apps más usadas hoy',
    no_usage: 'Aún no hay tiempo de pantalla hoy',
    app_limit: 'máx. {n}',
    always_allowed: 'Siempre permitida',
    blocked: 'Bloqueada',
    location: 'Ubicación',
    unknown_place: 'En algún lugar',
    not_located: 'Sin ubicar',
    blocked_apps: 'Apps bloqueadas',
    battery: 'Batería',
    bedtime: 'Hora de dormir',
    schooltime: 'Horario escolar',
    in: 'en {d}',
    until: 'hasta las {t}',
    none: '—',
    ago_now: 'ahora mismo',
    ago_min: 'hace {n} min',
    ago_h: 'hace {n} h',
    ago_d: 'hace {n} d',
    locked_parent: 'Bloqueado por un padre o madre',
    locked_bedtime: 'Hora de dormir · hasta las {t}',
    locked_school: 'Horario escolar · hasta las {t}',
    locked_limit: 'Límite diario alcanzado',
    break_title: 'Hora de un descanso',
    break_hint: 'Las llamadas y las apps permitidas siguen funcionando',
    bonus_running: 'Bonificación de +{n} min',
    bonus_left: 'quedan {n} min',
    bonus_until: 'hasta las {t}',
    revoke: 'Revocar',
    revoke_confirm: '¿Revocar la bonificación de +{n} min de {device}?',
    add: 'Añadir',
    add_minutes: 'Añadir {n} min',
    less: 'Menos',
    more: 'Más',
    lock: 'Bloquear',
    unlock: 'Desbloquear',
    ring: 'Hacer sonar',
    ringing: 'Sonando…',
    locate: 'Localizar',
    emergency: 'Emergencia',
    actions_for: 'Las acciones se aplican a {device}',
    cancel: 'Cancelar',
    close: 'Cerrar',
    show_full: 'Mostrar la tarjeta completa',
    show_compact: 'Volver a la vista compacta',
    done: 'Hecho',
    failed: 'Error: {error}',
    today: 'Hoy',
    h24: '24 h',
    d7: '7 días',
    points: '{n} puntos',
    km: '{n} km',
    update_location: 'Actualizar ubicación',
    open_history: 'Abrir historial',
    accuracy: '±{n} m',
    no_trace: 'Ninguna posición registrada en este periodo',
    loading: 'Cargando…',
    emergency_title: 'Emergencia · {name}',
    message: 'Mensaje',
    quick_call: 'Llámame',
    quick_home: 'Vuelve a casa',
    quick_where: '¿Dónde estás?',
    opt_ring: 'Hacer sonar el dispositivo',
    opt_ring_hint: 'Family Link · incluso en silencio',
    opt_notify: 'Notificación crítica con el mensaje',
    opt_notify_hint: 'App de Home Assistant · {service}',
    opt_locate: 'Pedir una ubicación reciente',
    opt_locate_hint: 'Family Link · consume batería',
    send_emergency: 'Enviar emergencia',
    emergency_sent: 'Emergencia enviada',
    school_mode: 'Modo escuela',
    school_blocked: '{n} apps bloqueadas',
    editor: {
      entity: 'Niño (sensor de estado)',
      title: 'Título',
      device: 'Dispositivo mostrado primero',
      device_type: 'Dibujo del dispositivo',
      type_auto: 'Automático',
      type_phone: 'Teléfono',
      type_tablet: 'Tableta',
      show_scene: 'Mostrar el dispositivo animado',
      show_top_apps: 'Mostrar las apps más usadas',
      show_actions: 'Mostrar las acciones',
      show_location: 'Mostrar la ubicación',
      trace_hours: 'Recorrido mostrado por defecto (horas)',
      language: 'Idioma',
      lang_auto: 'Automático',
      illustration: 'Encabezado ilustrado',
      illustration_theme: 'Tema de la ilustración',
      theme_auto: 'Automático (sigue el tema)',
      theme_day: 'Día',
      theme_night: 'Noche',
    },
  },
  sr: {
    status_tracked: 'Под надзором',
    status_attention: 'Пажња',
    status_locked: 'Закључано',
    status_not_tracked: 'Без надзора',
    devices: 'Уређаја: {n}',
    device_one: '1 уређај',
    all: 'Сви',
    no_entity: 'Није пронађено дете. Подесите интеграцију Family Link или подесите „entity” на сензор статуса детета.',
    unavailable: 'Подаци Family Link тренутно нису доступни.',
    stale: 'Family Link није доступан: подаци последњег ажурирања',
    left: 'преостало',
    left_of: 'преостало од {limit}',
    used_today: 'искоришћено данас',
    min: '{n} мин',
    h: '{h} ч',
    hmin: '{h} ч {m}',
    screen_time: 'Време пред екраном',
    top_apps: 'Најкоришћеније апликације данас',
    no_usage: 'Данас још нема времена пред екраном',
    app_limit: 'макс. {n}',
    always_allowed: 'Увек дозвољена',
    blocked: 'Блокирана',
    location: 'Локација',
    unknown_place: 'Негде',
    not_located: 'Није лоцирано',
    blocked_apps: 'Блокиране апликације',
    battery: 'Батерија',
    bedtime: 'Време за спавање',
    schooltime: 'Школско време',
    in: 'за {d}',
    until: 'до {t}',
    none: '—',
    ago_now: 'управо',
    ago_min: 'пре {n} мин',
    ago_h: 'пре {n} ч',
    ago_d: 'пре {n} д',
    locked_parent: 'Закључао родитељ',
    locked_bedtime: 'Време за спавање · до {t}',
    locked_school: 'Школско време · до {t}',
    locked_limit: 'Дневно ограничење достигнуто',
    break_title: 'Време је за паузу',
    break_hint: 'Позиви и дозвољене апликације и даље раде',
    bonus_running: 'Бонус +{n} мин',
    bonus_left: 'још {n} мин',
    bonus_until: 'до {t}',
    revoke: 'Опозови',
    revoke_confirm: 'Опозвати бонус од +{n} мин за {device}?',
    add: 'Додај',
    add_minutes: 'Додај {n} мин',
    less: 'Мање',
    more: 'Више',
    lock: 'Закључај',
    unlock: 'Откључај',
    ring: 'Позвони',
    ringing: 'Звони…',
    locate: 'Лоцирај',
    emergency: 'Хитно',
    actions_for: 'Радње се односе на {device}',
    cancel: 'Откажи',
    close: 'Затвори',
    show_full: 'Прикажи целу картицу',
    show_compact: 'Назад на компактан приказ',
    done: 'Готово',
    failed: 'Неуспешно: {error}',
    today: 'Данас',
    h24: '24 ч',
    d7: '7 дана',
    points: 'Тачака: {n}',
    km: '{n} км',
    update_location: 'Ажурирај локацију',
    open_history: 'Отвори историју',
    accuracy: '±{n} м',
    no_trace: 'У овом периоду није забележена ниједна позиција',
    loading: 'Учитавање…',
    emergency_title: 'Хитно · {name}',
    message: 'Порука',
    quick_call: 'Позови ме',
    quick_home: 'Дођи кући',
    quick_where: 'Где си?',
    opt_ring: 'Нека уређај зазвони',
    opt_ring_hint: 'Family Link · и у нечујном режиму',
    opt_notify: 'Критично обавештење са поруком',
    opt_notify_hint: 'Апликација Home Assistant · {service}',
    opt_locate: 'Затражи свежу локацију',
    opt_locate_hint: 'Family Link · троши батерију',
    send_emergency: 'Пошаљи хитно',
    emergency_sent: 'Хитно послато',
    school_mode: 'Школски режим',
    school_blocked: 'Блокираних апликација: {n}',
    editor: {
      entity: 'Дете (сензор статуса)',
      title: 'Наслов',
      device: 'Уређај приказан први',
      device_type: 'Цртеж уређаја',
      type_auto: 'Аутоматски',
      type_phone: 'Телефон',
      type_tablet: 'Таблет',
      show_scene: 'Прикажи анимирани уређај',
      show_top_apps: 'Прикажи најкоришћеније апликације',
      show_actions: 'Прикажи радње',
      show_location: 'Прикажи локацију',
      trace_hours: 'Подразумевано приказана рута (сати)',
      language: 'Језик',
      lang_auto: 'Аутоматски',
      illustration: 'Илустровано заглавље',
      illustration_theme: 'Тема илустрације',
      theme_auto: 'Аутоматски (прати тему)',
      theme_day: 'Дан',
      theme_night: 'Ноћ',
    },
  },
  'sr-Latn': {
    status_tracked: 'Pod nadzorom',
    status_attention: 'Pažnja',
    status_locked: 'Zaključano',
    status_not_tracked: 'Bez nadzora',
    devices: 'Uređaja: {n}',
    device_one: '1 uređaj',
    all: 'Svi',
    no_entity: 'Nije pronađeno dete. Podesite integraciju Family Link ili podesite „entity” na senzor statusa deteta.',
    unavailable: 'Podaci Family Link trenutno nisu dostupni.',
    stale: 'Family Link nije dostupan: podaci poslednjeg ažuriranja',
    left: 'preostalo',
    left_of: 'preostalo od {limit}',
    used_today: 'iskorišćeno danas',
    min: '{n} min',
    h: '{h} č',
    hmin: '{h} č {m}',
    screen_time: 'Vreme pred ekranom',
    top_apps: 'Najkorišćenije aplikacije danas',
    no_usage: 'Danas još nema vremena pred ekranom',
    app_limit: 'maks. {n}',
    always_allowed: 'Uvek dozvoljena',
    blocked: 'Blokirana',
    location: 'Lokacija',
    unknown_place: 'Negde',
    not_located: 'Nije locirano',
    blocked_apps: 'Blokirane aplikacije',
    battery: 'Baterija',
    bedtime: 'Vreme za spavanje',
    schooltime: 'Školsko vreme',
    in: 'za {d}',
    until: 'do {t}',
    none: '—',
    ago_now: 'upravo',
    ago_min: 'pre {n} min',
    ago_h: 'pre {n} č',
    ago_d: 'pre {n} d',
    locked_parent: 'Zaključao roditelj',
    locked_bedtime: 'Vreme za spavanje · do {t}',
    locked_school: 'Školsko vreme · do {t}',
    locked_limit: 'Dnevno ograničenje dostignuto',
    break_title: 'Vreme je za pauzu',
    break_hint: 'Pozivi i dozvoljene aplikacije i dalje rade',
    bonus_running: 'Bonus +{n} min',
    bonus_left: 'još {n} min',
    bonus_until: 'do {t}',
    revoke: 'Opozovi',
    revoke_confirm: 'Opozvati bonus od +{n} min za {device}?',
    add: 'Dodaj',
    add_minutes: 'Dodaj {n} min',
    less: 'Manje',
    more: 'Više',
    lock: 'Zaključaj',
    unlock: 'Otključaj',
    ring: 'Pozvoni',
    ringing: 'Zvoni…',
    locate: 'Lociraj',
    emergency: 'Hitno',
    actions_for: 'Radnje se odnose na {device}',
    cancel: 'Otkaži',
    close: 'Zatvori',
    show_full: 'Prikaži celu karticu',
    show_compact: 'Nazad na kompaktan prikaz',
    done: 'Gotovo',
    failed: 'Neuspešno: {error}',
    today: 'Danas',
    h24: '24 č',
    d7: '7 dana',
    points: 'Tačaka: {n}',
    km: '{n} km',
    update_location: 'Ažuriraj lokaciju',
    open_history: 'Otvori istoriju',
    accuracy: '±{n} m',
    no_trace: 'U ovom periodu nije zabeležena nijedna pozicija',
    loading: 'Učitavanje…',
    emergency_title: 'Hitno · {name}',
    message: 'Poruka',
    quick_call: 'Pozovi me',
    quick_home: 'Dođi kući',
    quick_where: 'Gde si?',
    opt_ring: 'Neka uređaj zazvoni',
    opt_ring_hint: 'Family Link · i u nečujnom režimu',
    opt_notify: 'Kritično obaveštenje sa porukom',
    opt_notify_hint: 'Aplikacija Home Assistant · {service}',
    opt_locate: 'Zatraži svežu lokaciju',
    opt_locate_hint: 'Family Link · troši bateriju',
    send_emergency: 'Pošalji hitno',
    emergency_sent: 'Hitno poslato',
    school_mode: 'Školski režim',
    school_blocked: 'Blokiranih aplikacija: {n}',
    editor: {
      entity: 'Dete (senzor statusa)',
      title: 'Naslov',
      device: 'Uređaj prikazan prvi',
      device_type: 'Crtež uređaja',
      type_auto: 'Automatski',
      type_phone: 'Telefon',
      type_tablet: 'Tablet',
      show_scene: 'Prikaži animirani uređaj',
      show_top_apps: 'Prikaži najkorišćenije aplikacije',
      show_actions: 'Prikaži radnje',
      show_location: 'Prikaži lokaciju',
      trace_hours: 'Podrazumevano prikazana ruta (sati)',
      language: 'Jezik',
      lang_auto: 'Automatski',
      illustration: 'Ilustrovano zaglavlje',
      illustration_theme: 'Tema ilustracije',
      theme_auto: 'Automatski (prati temu)',
      theme_day: 'Dan',
      theme_night: 'Noć',
    },
  },
  it: {
    status_tracked: 'Monitorato',
    status_attention: 'Attenzione',
    status_locked: 'Bloccato',
    status_not_tracked: 'Non monitorato',
    devices: '{n} dispositivi',
    device_one: '1 dispositivo',
    all: 'Tutti',
    no_entity: 'Nessun figlio trovato. Configura l’integrazione Family Link o imposta «entity» sul sensore di stato di un figlio.',
    unavailable: 'I dati di Family Link non sono disponibili al momento.',
    stale: 'Family Link irraggiungibile: dati dell’ultimo aggiornamento',
    left: 'rimanenti',
    left_of: 'rimanenti su {limit}',
    used_today: 'usati oggi',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Tempo di utilizzo',
    top_apps: 'App più usate oggi',
    no_usage: 'Ancora nessun tempo di utilizzo oggi',
    app_limit: 'max {n}',
    always_allowed: 'Sempre consentita',
    blocked: 'Bloccata',
    location: 'Posizione',
    unknown_place: 'Da qualche parte',
    not_located: 'Non localizzato',
    blocked_apps: 'App bloccate',
    battery: 'Batteria',
    bedtime: 'Ora di dormire',
    schooltime: 'Orario scolastico',
    in: 'tra {d}',
    until: 'fino alle {t}',
    none: '—',
    ago_now: 'proprio ora',
    ago_min: '{n} min fa',
    ago_h: '{n} h fa',
    ago_d: '{n} g fa',
    locked_parent: 'Bloccato da un genitore',
    locked_bedtime: 'Ora di dormire · fino alle {t}',
    locked_school: 'Orario scolastico · fino alle {t}',
    locked_limit: 'Limite giornaliero raggiunto',
    break_title: 'È ora di una pausa',
    break_hint: 'Chiamate e app consentite continuano a funzionare',
    bonus_running: 'Bonus di +{n} min',
    bonus_left: 'ancora {n} min',
    bonus_until: 'fino alle {t}',
    revoke: 'Revoca',
    revoke_confirm: 'Revocare il bonus di +{n} min di {device}?',
    add: 'Aggiungi',
    add_minutes: 'Aggiungi {n} min',
    less: 'Meno',
    more: 'Più',
    lock: 'Blocca',
    unlock: 'Sblocca',
    ring: 'Fai squillare',
    ringing: 'Squilla…',
    locate: 'Localizza',
    emergency: 'Emergenza',
    actions_for: 'Le azioni si applicano a {device}',
    cancel: 'Annulla',
    close: 'Chiudi',
    show_full: 'Mostra la scheda completa',
    show_compact: 'Torna alla vista compatta',
    done: 'Fatto',
    failed: 'Non riuscito: {error}',
    today: 'Oggi',
    h24: '24 h',
    d7: '7 giorni',
    points: '{n} punti',
    km: '{n} km',
    update_location: 'Aggiorna posizione',
    open_history: 'Apri cronologia',
    accuracy: '±{n} m',
    no_trace: 'Nessuna posizione registrata in questo periodo',
    loading: 'Caricamento…',
    emergency_title: 'Emergenza · {name}',
    message: 'Messaggio',
    quick_call: 'Richiamami',
    quick_home: 'Torna a casa',
    quick_where: 'Dove sei?',
    opt_ring: 'Fai squillare il dispositivo',
    opt_ring_hint: 'Family Link · anche in silenzioso',
    opt_notify: 'Notifica critica con il messaggio',
    opt_notify_hint: 'App Home Assistant · {service}',
    opt_locate: 'Chiedi una posizione aggiornata',
    opt_locate_hint: 'Family Link · consuma batteria',
    send_emergency: 'Invia emergenza',
    emergency_sent: 'Emergenza inviata',
    school_mode: 'Modalità scuola',
    school_blocked: '{n} app bloccate',
    editor: {
      entity: 'Figlio (sensore di stato)',
      title: 'Titolo',
      device: 'Dispositivo mostrato per primo',
      device_type: 'Disegno del dispositivo',
      type_auto: 'Automatico',
      type_phone: 'Telefono',
      type_tablet: 'Tablet',
      show_scene: 'Mostra il dispositivo animato',
      show_top_apps: 'Mostra le app più usate',
      show_actions: 'Mostra le azioni',
      show_location: 'Mostra la posizione',
      trace_hours: 'Percorso mostrato di default (ore)',
      language: 'Lingua',
      lang_auto: 'Automatica',
      illustration: 'Intestazione illustrata',
      illustration_theme: 'Tema dell’illustrazione',
      theme_auto: 'Automatico (segue il tema)',
      theme_day: 'Giorno',
      theme_night: 'Notte',
    },
  },
  nl: {
    status_tracked: 'Gevolgd',
    status_attention: 'Let op',
    status_locked: 'Vergrendeld',
    status_not_tracked: 'Niet gevolgd',
    devices: '{n} apparaten',
    device_one: '1 apparaat',
    all: 'Alle',
    no_entity: 'Geen kind gevonden. Stel de integratie Family Link in, of zet „entity” op de statussensor van een kind.',
    unavailable: 'De gegevens van Family Link zijn op dit moment niet beschikbaar.',
    stale: 'Family Link onbereikbaar: gegevens van de laatste update',
    left: 'over',
    left_of: 'over van {limit}',
    used_today: 'vandaag gebruikt',
    min: '{n} min',
    h: '{h} u',
    hmin: '{h} u {m}',
    screen_time: 'Schermtijd',
    top_apps: 'Meest gebruikte apps vandaag',
    no_usage: 'Vandaag nog geen schermtijd',
    app_limit: 'max. {n}',
    always_allowed: 'Altijd toegestaan',
    blocked: 'Geblokkeerd',
    location: 'Locatie',
    unknown_place: 'Ergens',
    not_located: 'Niet gelokaliseerd',
    blocked_apps: 'Geblokkeerde apps',
    battery: 'Batterij',
    bedtime: 'Bedtijd',
    schooltime: 'Schooltijd',
    in: 'over {d}',
    until: 'tot {t}',
    none: '—',
    ago_now: 'zojuist',
    ago_min: '{n} min geleden',
    ago_h: '{n} u geleden',
    ago_d: '{n} d geleden',
    locked_parent: 'Vergrendeld door een ouder',
    locked_bedtime: 'Bedtijd · tot {t}',
    locked_school: 'Schooltijd · tot {t}',
    locked_limit: 'Daglimiet bereikt',
    break_title: 'Tijd voor een pauze',
    break_hint: 'Bellen en toegestane apps blijven werken',
    bonus_running: '+{n} min bonus',
    bonus_left: 'nog {n} min',
    bonus_until: 'tot {t}',
    revoke: 'Intrekken',
    revoke_confirm: 'De bonus van +{n} min van {device} intrekken?',
    add: 'Toevoegen',
    add_minutes: '{n} min toevoegen',
    less: 'Minder',
    more: 'Meer',
    lock: 'Vergrendelen',
    unlock: 'Ontgrendelen',
    ring: 'Laten overgaan',
    ringing: 'Gaat over…',
    locate: 'Lokaliseren',
    emergency: 'Noodgeval',
    actions_for: 'Acties gelden voor {device}',
    cancel: 'Annuleren',
    close: 'Sluiten',
    show_full: 'Volledige kaart tonen',
    show_compact: 'Terug naar de compacte weergave',
    done: 'Klaar',
    failed: 'Mislukt: {error}',
    today: 'Vandaag',
    h24: '24 u',
    d7: '7 dagen',
    points: '{n} punten',
    km: '{n} km',
    update_location: 'Locatie bijwerken',
    open_history: 'Geschiedenis openen',
    accuracy: '±{n} m',
    no_trace: 'Geen positie vastgelegd in deze periode',
    loading: 'Laden…',
    emergency_title: 'Noodgeval · {name}',
    message: 'Bericht',
    quick_call: 'Bel me terug',
    quick_home: 'Kom naar huis',
    quick_where: 'Waar ben je?',
    opt_ring: 'Apparaat laten overgaan',
    opt_ring_hint: 'Family Link · ook op stil',
    opt_notify: 'Kritieke melding met het bericht',
    opt_notify_hint: 'Home Assistant-app · {service}',
    opt_locate: 'Om een actuele locatie vragen',
    opt_locate_hint: 'Family Link · verbruikt batterij',
    send_emergency: 'Noodgeval versturen',
    emergency_sent: 'Noodgeval verstuurd',
    school_mode: 'Schoolmodus',
    school_blocked: '{n} apps geblokkeerd',
    editor: {
      entity: 'Kind (statussensor)',
      title: 'Titel',
      device: 'Eerst getoond apparaat',
      device_type: 'Tekening van het apparaat',
      type_auto: 'Automatisch',
      type_phone: 'Telefoon',
      type_tablet: 'Tablet',
      show_scene: 'Geanimeerd apparaat tonen',
      show_top_apps: 'Meest gebruikte apps tonen',
      show_actions: 'Acties tonen',
      show_location: 'Locatie tonen',
      trace_hours: 'Standaard getoonde route (uren)',
      language: 'Taal',
      lang_auto: 'Automatisch',
      illustration: 'Geïllustreerde koptekst',
      illustration_theme: 'Thema van de illustratie',
      theme_auto: 'Automatisch (volgt het thema)',
      theme_day: 'Dag',
      theme_night: 'Nacht',
    },
  },
  pt: {
    status_tracked: 'Supervisionado',
    status_attention: 'Atenção',
    status_locked: 'Bloqueado',
    status_not_tracked: 'Sem supervisão',
    devices: '{n} dispositivos',
    device_one: '1 dispositivo',
    all: 'Todos',
    no_entity: 'Nenhuma criança encontrada. Configure a integração Family Link ou defina «entity» com o sensor de estado de uma criança.',
    unavailable: 'Os dados do Family Link não estão disponíveis de momento.',
    stale: 'Family Link inacessível: dados da última atualização',
    left: 'restantes',
    left_of: 'restantes de {limit}',
    used_today: 'usados hoje',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Tempo de ecrã',
    top_apps: 'Apps mais usadas hoje',
    no_usage: 'Ainda sem tempo de ecrã hoje',
    app_limit: 'máx. {n}',
    always_allowed: 'Sempre permitida',
    blocked: 'Bloqueada',
    location: 'Localização',
    unknown_place: 'Algures',
    not_located: 'Não localizado',
    blocked_apps: 'Apps bloqueadas',
    battery: 'Bateria',
    bedtime: 'Hora de dormir',
    schooltime: 'Horário escolar',
    in: 'dentro de {d}',
    until: 'até às {t}',
    none: '—',
    ago_now: 'agora mesmo',
    ago_min: 'há {n} min',
    ago_h: 'há {n} h',
    ago_d: 'há {n} d',
    locked_parent: 'Bloqueado por um pai ou mãe',
    locked_bedtime: 'Hora de dormir · até às {t}',
    locked_school: 'Horário escolar · até às {t}',
    locked_limit: 'Limite diário atingido',
    break_title: 'Hora de uma pausa',
    break_hint: 'As chamadas e as apps permitidas continuam a funcionar',
    bonus_running: 'Bónus de +{n} min',
    bonus_left: 'faltam {n} min',
    bonus_until: 'até às {t}',
    revoke: 'Revogar',
    revoke_confirm: 'Revogar o bónus de +{n} min de {device}?',
    add: 'Adicionar',
    add_minutes: 'Adicionar {n} min',
    less: 'Menos',
    more: 'Mais',
    lock: 'Bloquear',
    unlock: 'Desbloquear',
    ring: 'Fazer tocar',
    ringing: 'A tocar…',
    locate: 'Localizar',
    emergency: 'Emergência',
    actions_for: 'As ações aplicam-se a {device}',
    cancel: 'Cancelar',
    close: 'Fechar',
    show_full: 'Mostrar o cartão completo',
    show_compact: 'Voltar à vista compacta',
    done: 'Feito',
    failed: 'Falhou: {error}',
    today: 'Hoje',
    h24: '24 h',
    d7: '7 dias',
    points: '{n} pontos',
    km: '{n} km',
    update_location: 'Atualizar localização',
    open_history: 'Abrir histórico',
    accuracy: '±{n} m',
    no_trace: 'Nenhuma posição registada neste período',
    loading: 'A carregar…',
    emergency_title: 'Emergência · {name}',
    message: 'Mensagem',
    quick_call: 'Liga-me de volta',
    quick_home: 'Volta para casa',
    quick_where: 'Onde estás?',
    opt_ring: 'Fazer tocar o dispositivo',
    opt_ring_hint: 'Family Link · mesmo em silêncio',
    opt_notify: 'Notificação crítica com a mensagem',
    opt_notify_hint: 'App Home Assistant · {service}',
    opt_locate: 'Pedir uma localização recente',
    opt_locate_hint: 'Family Link · gasta bateria',
    send_emergency: 'Enviar emergência',
    emergency_sent: 'Emergência enviada',
    school_mode: 'Modo escola',
    school_blocked: '{n} apps bloqueadas',
    editor: {
      entity: 'Criança (sensor de estado)',
      title: 'Título',
      device: 'Dispositivo mostrado primeiro',
      device_type: 'Desenho do dispositivo',
      type_auto: 'Automático',
      type_phone: 'Telemóvel',
      type_tablet: 'Tablet',
      show_scene: 'Mostrar o dispositivo animado',
      show_top_apps: 'Mostrar as apps mais usadas',
      show_actions: 'Mostrar as ações',
      show_location: 'Mostrar a localização',
      trace_hours: 'Percurso mostrado por omissão (horas)',
      language: 'Idioma',
      lang_auto: 'Automático',
      illustration: 'Cabeçalho ilustrado',
      illustration_theme: 'Tema da ilustração',
      theme_auto: 'Automático (segue o tema)',
      theme_day: 'Dia',
      theme_night: 'Noite',
    },
  },
  pl: {
    status_tracked: 'Nadzorowane',
    status_attention: 'Uwaga',
    status_locked: 'Zablokowane',
    status_not_tracked: 'Bez nadzoru',
    devices: 'Urządzenia: {n}',
    device_one: '1 urządzenie',
    all: 'Wszystkie',
    no_entity: 'Nie znaleziono dziecka. Skonfiguruj integrację Family Link albo ustaw „entity” na czujnik stanu dziecka.',
    unavailable: 'Dane Family Link są obecnie niedostępne.',
    stale: 'Family Link niedostępny: dane z ostatniej aktualizacji',
    left: 'zostało',
    left_of: 'zostało z {limit}',
    used_today: 'użyte dzisiaj',
    min: '{n} min',
    h: '{h} godz.',
    hmin: '{h} godz. {m}',
    screen_time: 'Czas przed ekranem',
    top_apps: 'Najczęściej używane aplikacje dzisiaj',
    no_usage: 'Dzisiaj jeszcze brak czasu przed ekranem',
    app_limit: 'maks. {n}',
    always_allowed: 'Zawsze dozwolona',
    blocked: 'Zablokowana',
    location: 'Lokalizacja',
    unknown_place: 'Gdzieś',
    not_located: 'Nie zlokalizowano',
    blocked_apps: 'Zablokowane aplikacje',
    battery: 'Bateria',
    bedtime: 'Pora snu',
    schooltime: 'Czas szkoły',
    in: 'za {d}',
    until: 'do {t}',
    none: '—',
    ago_now: 'przed chwilą',
    ago_min: '{n} min temu',
    ago_h: '{n} godz. temu',
    ago_d: '{n} d. temu',
    locked_parent: 'Zablokowane przez rodzica',
    locked_bedtime: 'Pora snu · do {t}',
    locked_school: 'Czas szkoły · do {t}',
    locked_limit: 'Osiągnięto dzienny limit',
    break_title: 'Czas na przerwę',
    break_hint: 'Połączenia i dozwolone aplikacje nadal działają',
    bonus_running: 'Bonus +{n} min',
    bonus_left: 'zostało {n} min',
    bonus_until: 'do {t}',
    revoke: 'Cofnij',
    revoke_confirm: 'Cofnąć bonus +{n} min dla {device}?',
    add: 'Dodaj',
    add_minutes: 'Dodaj {n} min',
    less: 'Mniej',
    more: 'Więcej',
    lock: 'Zablokuj',
    unlock: 'Odblokuj',
    ring: 'Zadzwoń',
    ringing: 'Dzwoni…',
    locate: 'Zlokalizuj',
    emergency: 'Alarm',
    actions_for: 'Akcje dotyczą: {device}',
    cancel: 'Anuluj',
    close: 'Zamknij',
    show_full: 'Pokaż pełną kartę',
    show_compact: 'Wróć do widoku kompaktowego',
    done: 'Gotowe',
    failed: 'Niepowodzenie: {error}',
    today: 'Dzisiaj',
    h24: '24 godz.',
    d7: '7 dni',
    points: 'Punkty: {n}',
    km: '{n} km',
    update_location: 'Odśwież lokalizację',
    open_history: 'Otwórz historię',
    accuracy: '±{n} m',
    no_trace: 'Brak zapisanych pozycji w tym okresie',
    loading: 'Ładowanie…',
    emergency_title: 'Alarm · {name}',
    message: 'Wiadomość',
    quick_call: 'Oddzwoń do mnie',
    quick_home: 'Wracaj do domu',
    quick_where: 'Gdzie jesteś?',
    opt_ring: 'Zadzwoń na urządzenie',
    opt_ring_hint: 'Family Link · także w trybie cichym',
    opt_notify: 'Krytyczne powiadomienie z wiadomością',
    opt_notify_hint: 'Aplikacja Home Assistant · {service}',
    opt_locate: 'Poproś o aktualną lokalizację',
    opt_locate_hint: 'Family Link · zużywa baterię',
    send_emergency: 'Wyślij alarm',
    emergency_sent: 'Alarm wysłany',
    school_mode: 'Tryb szkolny',
    school_blocked: 'Zablokowane aplikacje: {n}',
    editor: {
      entity: 'Dziecko (czujnik stanu)',
      title: 'Tytuł',
      device: 'Urządzenie pokazywane jako pierwsze',
      device_type: 'Rysunek urządzenia',
      type_auto: 'Automatycznie',
      type_phone: 'Telefon',
      type_tablet: 'Tablet',
      show_scene: 'Pokaż animowane urządzenie',
      show_top_apps: 'Pokaż najczęściej używane aplikacje',
      show_actions: 'Pokaż akcje',
      show_location: 'Pokaż lokalizację',
      trace_hours: 'Trasa pokazywana domyślnie (godziny)',
      language: 'Język',
      lang_auto: 'Automatycznie',
      illustration: 'Ilustrowany nagłówek',
      illustration_theme: 'Motyw ilustracji',
      theme_auto: 'Automatycznie (zgodnie z motywem)',
      theme_day: 'Dzień',
      theme_night: 'Noc',
    },
  },
  ro: {
    status_tracked: 'Supravegheat',
    status_attention: 'Atenție',
    status_locked: 'Blocat',
    status_not_tracked: 'Nesupravegheat',
    devices: '{n} dispozitive',
    device_one: '1 dispozitiv',
    all: 'Toate',
    no_entity: 'Niciun copil găsit. Configurați integrarea Family Link sau setați „entity” la senzorul de stare al unui copil.',
    unavailable: 'Datele Family Link nu sunt disponibile momentan.',
    stale: 'Family Link inaccesibil: datele ultimei actualizări',
    left: 'rămase',
    left_of: 'rămase din {limit}',
    used_today: 'folosite azi',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Timp petrecut pe ecran',
    top_apps: 'Cele mai folosite aplicații azi',
    no_usage: 'Încă niciun timp pe ecran azi',
    app_limit: 'max. {n}',
    always_allowed: 'Permisă mereu',
    blocked: 'Blocată',
    location: 'Locație',
    unknown_place: 'Undeva',
    not_located: 'Nelocalizat',
    blocked_apps: 'Aplicații blocate',
    battery: 'Baterie',
    bedtime: 'Ora de culcare',
    schooltime: 'Program școlar',
    in: 'peste {d}',
    until: 'până la {t}',
    none: '—',
    ago_now: 'chiar acum',
    ago_min: 'acum {n} min',
    ago_h: 'acum {n} h',
    ago_d: 'acum {n} z',
    locked_parent: 'Blocat de un părinte',
    locked_bedtime: 'Ora de culcare · până la {t}',
    locked_school: 'Program școlar · până la {t}',
    locked_limit: 'Limită zilnică atinsă',
    break_title: 'E timpul pentru o pauză',
    break_hint: 'Apelurile și aplicațiile permise funcționează în continuare',
    bonus_running: 'Bonus de +{n} min',
    bonus_left: 'mai sunt {n} min',
    bonus_until: 'până la {t}',
    revoke: 'Revocă',
    revoke_confirm: 'Revocați bonusul de +{n} min pentru {device}?',
    add: 'Adaugă',
    add_minutes: 'Adaugă {n} min',
    less: 'Mai puțin',
    more: 'Mai mult',
    lock: 'Blochează',
    unlock: 'Deblochează',
    ring: 'Sună',
    ringing: 'Sună…',
    locate: 'Localizează',
    emergency: 'Urgență',
    actions_for: 'Acțiunile se aplică pentru {device}',
    cancel: 'Anulează',
    close: 'Închide',
    show_full: 'Afișează cardul complet',
    show_compact: 'Înapoi la vizualizarea compactă',
    done: 'Gata',
    failed: 'Eșec: {error}',
    today: 'Azi',
    h24: '24 h',
    d7: '7 zile',
    points: '{n} puncte',
    km: '{n} km',
    update_location: 'Actualizează locația',
    open_history: 'Deschide istoricul',
    accuracy: '±{n} m',
    no_trace: 'Nicio poziție înregistrată în această perioadă',
    loading: 'Se încarcă…',
    emergency_title: 'Urgență · {name}',
    message: 'Mesaj',
    quick_call: 'Sună-mă înapoi',
    quick_home: 'Vino acasă',
    quick_where: 'Unde ești?',
    opt_ring: 'Fă dispozitivul să sune',
    opt_ring_hint: 'Family Link · chiar și pe silențios',
    opt_notify: 'Notificare critică cu mesajul',
    opt_notify_hint: 'Aplicația Home Assistant · {service}',
    opt_locate: 'Cere o locație recentă',
    opt_locate_hint: 'Family Link · consumă bateria',
    send_emergency: 'Trimite urgența',
    emergency_sent: 'Urgență trimisă',
    school_mode: 'Mod școală',
    school_blocked: '{n} aplicații blocate',
    editor: {
      entity: 'Copil (senzor de stare)',
      title: 'Titlu',
      device: 'Dispozitiv afișat primul',
      device_type: 'Desenul dispozitivului',
      type_auto: 'Automat',
      type_phone: 'Telefon',
      type_tablet: 'Tabletă',
      show_scene: 'Afișează dispozitivul animat',
      show_top_apps: 'Afișează cele mai folosite aplicații',
      show_actions: 'Afișează acțiunile',
      show_location: 'Afișează locația',
      trace_hours: 'Traseu afișat implicit (ore)',
      language: 'Limbă',
      lang_auto: 'Automat',
      illustration: 'Antet ilustrat',
      illustration_theme: 'Tema ilustrației',
      theme_auto: 'Automat (urmează tema)',
      theme_day: 'Zi',
      theme_night: 'Noapte',
    },
  },
  da: {
    status_tracked: 'Overvåget',
    status_attention: 'Bemærk',
    status_locked: 'Låst',
    status_not_tracked: 'Ikke overvåget',
    devices: '{n} enheder',
    device_one: '1 enhed',
    all: 'Alle',
    no_entity: 'Intet barn fundet. Opsæt integrationen Family Link, eller sæt „entity” til et barns statussensor.',
    unavailable: 'Family Link-data er ikke tilgængelige lige nu.',
    stale: 'Family Link kan ikke nås: data fra seneste opdatering',
    left: 'tilbage',
    left_of: 'tilbage af {limit}',
    used_today: 'brugt i dag',
    min: '{n} min.',
    h: '{h} t.',
    hmin: '{h} t. {m}',
    screen_time: 'Skærmtid',
    top_apps: 'Mest brugte apps i dag',
    no_usage: 'Ingen skærmtid endnu i dag',
    app_limit: 'maks. {n}',
    always_allowed: 'Altid tilladt',
    blocked: 'Blokeret',
    location: 'Placering',
    unknown_place: 'Et sted',
    not_located: 'Ikke lokaliseret',
    blocked_apps: 'Blokerede apps',
    battery: 'Batteri',
    bedtime: 'Sengetid',
    schooltime: 'Skoletid',
    in: 'om {d}',
    until: 'indtil {t}',
    none: '—',
    ago_now: 'lige nu',
    ago_min: 'for {n} min. siden',
    ago_h: 'for {n} t. siden',
    ago_d: 'for {n} d. siden',
    locked_parent: 'Låst af en forælder',
    locked_bedtime: 'Sengetid · indtil {t}',
    locked_school: 'Skoletid · indtil {t}',
    locked_limit: 'Daglig grænse nået',
    break_title: 'Tid til en pause',
    break_hint: 'Opkald og tilladte apps virker stadig',
    bonus_running: '+{n} min. bonus',
    bonus_left: '{n} min. tilbage',
    bonus_until: 'indtil {t}',
    revoke: 'Tilbagekald',
    revoke_confirm: 'Tilbagekald bonussen på +{n} min. for {device}?',
    add: 'Tilføj',
    add_minutes: 'Tilføj {n} min.',
    less: 'Mindre',
    more: 'Mere',
    lock: 'Lås',
    unlock: 'Lås op',
    ring: 'Lad ringe',
    ringing: 'Ringer…',
    locate: 'Find',
    emergency: 'Nødsituation',
    actions_for: 'Handlinger gælder {device}',
    cancel: 'Annuller',
    close: 'Luk',
    show_full: 'Vis hele kortet',
    show_compact: 'Tilbage til den kompakte visning',
    done: 'Udført',
    failed: 'Mislykkedes: {error}',
    today: 'I dag',
    h24: '24 t.',
    d7: '7 dage',
    points: '{n} punkter',
    km: '{n} km',
    update_location: 'Opdater placering',
    open_history: 'Åbn historik',
    accuracy: '±{n} m',
    no_trace: 'Ingen position registreret i denne periode',
    loading: 'Indlæser…',
    emergency_title: 'Nødsituation · {name}',
    message: 'Besked',
    quick_call: 'Ring mig op',
    quick_home: 'Kom hjem',
    quick_where: 'Hvor er du?',
    opt_ring: 'Lad enheden ringe',
    opt_ring_hint: 'Family Link · også på lydløs',
    opt_notify: 'Kritisk notifikation med beskeden',
    opt_notify_hint: 'Home Assistant-appen · {service}',
    opt_locate: 'Bed om en aktuel placering',
    opt_locate_hint: 'Family Link · bruger batteri',
    send_emergency: 'Send nødsituation',
    emergency_sent: 'Nødsituation sendt',
    school_mode: 'Skoletilstand',
    school_blocked: '{n} apps blokeret',
    editor: {
      entity: 'Barn (statussensor)',
      title: 'Titel',
      device: 'Enhed vist først',
      device_type: 'Tegning af enheden',
      type_auto: 'Automatisk',
      type_phone: 'Telefon',
      type_tablet: 'Tablet',
      show_scene: 'Vis den animerede enhed',
      show_top_apps: 'Vis de mest brugte apps',
      show_actions: 'Vis handlingerne',
      show_location: 'Vis placeringen',
      trace_hours: 'Rute vist som standard (timer)',
      language: 'Sprog',
      lang_auto: 'Automatisk',
      illustration: 'Illustreret overskrift',
      illustration_theme: 'Illustrationens tema',
      theme_auto: 'Automatisk (følger temaet)',
      theme_day: 'Dag',
      theme_night: 'Nat',
    },
  },
  sv: {
    status_tracked: 'Övervakad',
    status_attention: 'Observera',
    status_locked: 'Låst',
    status_not_tracked: 'Inte övervakad',
    devices: '{n} enheter',
    device_one: '1 enhet',
    all: 'Alla',
    no_entity: 'Inget barn hittades. Konfigurera integrationen Family Link, eller ange ”entity” till ett barns statussensor.',
    unavailable: 'Family Link-data är inte tillgängliga just nu.',
    stale: 'Family Link kan inte nås: data från senaste uppdateringen',
    left: 'kvar',
    left_of: 'kvar av {limit}',
    used_today: 'använt i dag',
    min: '{n} min',
    h: '{h} tim',
    hmin: '{h} tim {m}',
    screen_time: 'Skärmtid',
    top_apps: 'Mest använda appar i dag',
    no_usage: 'Ingen skärmtid än i dag',
    app_limit: 'max {n}',
    always_allowed: 'Alltid tillåten',
    blocked: 'Blockerad',
    location: 'Plats',
    unknown_place: 'Någonstans',
    not_located: 'Inte lokaliserad',
    blocked_apps: 'Blockerade appar',
    battery: 'Batteri',
    bedtime: 'Läggdags',
    schooltime: 'Skoltid',
    in: 'om {d}',
    until: 'till {t}',
    none: '—',
    ago_now: 'just nu',
    ago_min: 'för {n} min sedan',
    ago_h: 'för {n} tim sedan',
    ago_d: 'för {n} d sedan',
    locked_parent: 'Låst av en förälder',
    locked_bedtime: 'Läggdags · till {t}',
    locked_school: 'Skoltid · till {t}',
    locked_limit: 'Daglig gräns nådd',
    break_title: 'Dags för en paus',
    break_hint: 'Samtal och tillåtna appar fungerar fortfarande',
    bonus_running: '+{n} min bonus',
    bonus_left: '{n} min kvar',
    bonus_until: 'till {t}',
    revoke: 'Återkalla',
    revoke_confirm: 'Återkalla bonusen på +{n} min för {device}?',
    add: 'Lägg till',
    add_minutes: 'Lägg till {n} min',
    less: 'Mindre',
    more: 'Mer',
    lock: 'Lås',
    unlock: 'Lås upp',
    ring: 'Låt ringa',
    ringing: 'Ringer…',
    locate: 'Hitta',
    emergency: 'Nödläge',
    actions_for: 'Åtgärderna gäller {device}',
    cancel: 'Avbryt',
    close: 'Stäng',
    show_full: 'Visa hela kortet',
    show_compact: 'Tillbaka till kompakt vy',
    done: 'Klart',
    failed: 'Misslyckades: {error}',
    today: 'I dag',
    h24: '24 tim',
    d7: '7 dagar',
    points: '{n} punkter',
    km: '{n} km',
    update_location: 'Uppdatera plats',
    open_history: 'Öppna historik',
    accuracy: '±{n} m',
    no_trace: 'Ingen position registrerad under perioden',
    loading: 'Läser in…',
    emergency_title: 'Nödläge · {name}',
    message: 'Meddelande',
    quick_call: 'Ring mig',
    quick_home: 'Kom hem',
    quick_where: 'Var är du?',
    opt_ring: 'Låt enheten ringa',
    opt_ring_hint: 'Family Link · även på ljudlöst',
    opt_notify: 'Kritisk avisering med meddelandet',
    opt_notify_hint: 'Home Assistant-appen · {service}',
    opt_locate: 'Be om en aktuell plats',
    opt_locate_hint: 'Family Link · drar batteri',
    send_emergency: 'Skicka nödläge',
    emergency_sent: 'Nödläge skickat',
    school_mode: 'Skolläge',
    school_blocked: '{n} appar blockerade',
    editor: {
      entity: 'Barn (statussensor)',
      title: 'Rubrik',
      device: 'Enhet som visas först',
      device_type: 'Bild av enheten',
      type_auto: 'Automatiskt',
      type_phone: 'Telefon',
      type_tablet: 'Surfplatta',
      show_scene: 'Visa den animerade enheten',
      show_top_apps: 'Visa de mest använda apparna',
      show_actions: 'Visa åtgärderna',
      show_location: 'Visa platsen',
      trace_hours: 'Rutt som visas som standard (timmar)',
      language: 'Språk',
      lang_auto: 'Automatiskt',
      illustration: 'Illustrerad rubrik',
      illustration_theme: 'Illustrationens tema',
      theme_auto: 'Automatiskt (följer temat)',
      theme_day: 'Dag',
      theme_night: 'Natt',
    },
  },
  bg: {
    status_tracked: 'Под надзор',
    status_attention: 'Внимание',
    status_locked: 'Заключено',
    status_not_tracked: 'Без надзор',
    devices: 'Устройства: {n}',
    device_one: '1 устройство',
    all: 'Всички',
    no_entity: 'Не е намерено дете. Настройте интеграцията Family Link или задайте в „entity“ сензора за състояние на дете.',
    unavailable: 'Данните от Family Link в момента не са налични.',
    stale: 'Family Link е недостъпен: данни от последната актуализация',
    left: 'остават',
    left_of: 'остават от {limit}',
    used_today: 'използвано днес',
    min: '{n} мин',
    h: '{h} ч',
    hmin: '{h} ч {m}',
    screen_time: 'Време пред екрана',
    top_apps: 'Най-използвани приложения днес',
    no_usage: 'Днес все още няма време пред екрана',
    app_limit: 'макс. {n}',
    always_allowed: 'Винаги разрешено',
    blocked: 'Блокирано',
    location: 'Местоположение',
    unknown_place: 'Някъде',
    not_located: 'Не е открито',
    blocked_apps: 'Блокирани приложения',
    battery: 'Батерия',
    bedtime: 'Време за сън',
    schooltime: 'Училищно време',
    in: 'след {d}',
    until: 'до {t}',
    none: '—',
    ago_now: 'току-що',
    ago_min: 'преди {n} мин',
    ago_h: 'преди {n} ч',
    ago_d: 'преди {n} д',
    locked_parent: 'Заключено от родител',
    locked_bedtime: 'Време за сън · до {t}',
    locked_school: 'Училищно време · до {t}',
    locked_limit: 'Дневният лимит е достигнат',
    break_title: 'Време е за почивка',
    break_hint: 'Обажданията и разрешените приложения продължават да работят',
    bonus_running: 'Бонус +{n} мин',
    bonus_left: 'остават {n} мин',
    bonus_until: 'до {t}',
    revoke: 'Отмени',
    revoke_confirm: 'Да се отмени ли бонусът от +{n} мин за {device}?',
    add: 'Добави',
    add_minutes: 'Добави {n} мин',
    less: 'По-малко',
    more: 'Повече',
    lock: 'Заключи',
    unlock: 'Отключи',
    ring: 'Позвъни',
    ringing: 'Звъни…',
    locate: 'Намери',
    emergency: 'Спешно',
    actions_for: 'Действията се отнасят за {device}',
    cancel: 'Отказ',
    close: 'Затвори',
    show_full: 'Покажи цялата карта',
    show_compact: 'Обратно към компактния изглед',
    done: 'Готово',
    failed: 'Неуспех: {error}',
    today: 'Днес',
    h24: '24 ч',
    d7: '7 дни',
    points: 'Точки: {n}',
    km: '{n} км',
    update_location: 'Обнови местоположението',
    open_history: 'Отвори историята',
    accuracy: '±{n} м',
    no_trace: 'Няма записани позиции за този период',
    loading: 'Зареждане…',
    emergency_title: 'Спешно · {name}',
    message: 'Съобщение',
    quick_call: 'Обади ми се',
    quick_home: 'Прибирай се',
    quick_where: 'Къде си?',
    opt_ring: 'Позвъни на устройството',
    opt_ring_hint: 'Family Link · дори в безшумен режим',
    opt_notify: 'Критично известие със съобщението',
    opt_notify_hint: 'Приложение Home Assistant · {service}',
    opt_locate: 'Поискай актуално местоположение',
    opt_locate_hint: 'Family Link · изразходва батерия',
    send_emergency: 'Изпрати спешно',
    emergency_sent: 'Спешното е изпратено',
    school_mode: 'Училищен режим',
    school_blocked: 'Блокирани приложения: {n}',
    editor: {
      entity: 'Дете (сензор за състояние)',
      title: 'Заглавие',
      device: 'Устройство, показвано първо',
      device_type: 'Рисунка на устройството',
      type_auto: 'Автоматично',
      type_phone: 'Телефон',
      type_tablet: 'Таблет',
      show_scene: 'Покажи анимираното устройство',
      show_top_apps: 'Покажи най-използваните приложения',
      show_actions: 'Покажи действията',
      show_location: 'Покажи местоположението',
      trace_hours: 'Маршрут по подразбиране (часове)',
      language: 'Език',
      lang_auto: 'Автоматично',
      illustration: 'Илюстрирана заглавка',
      illustration_theme: 'Тема на илюстрацията',
      theme_auto: 'Автоматично (следва темата)',
      theme_day: 'Ден',
      theme_night: 'Нощ',
    },
  },
  ru: {
    status_tracked: 'Под контролем',
    status_attention: 'Внимание',
    status_locked: 'Заблокировано',
    status_not_tracked: 'Без контроля',
    devices: 'Устройств: {n}',
    device_one: '1 устройство',
    all: 'Все',
    no_entity: 'Ребёнок не найден. Настройте интеграцию Family Link или укажите в «entity» датчик статуса ребёнка.',
    unavailable: 'Данные Family Link сейчас недоступны.',
    stale: 'Family Link недоступен: данные последнего обновления',
    left: 'осталось',
    left_of: 'осталось из {limit}',
    used_today: 'использовано сегодня',
    min: '{n} мин',
    h: '{h} ч',
    hmin: '{h} ч {m}',
    screen_time: 'Время у экрана',
    top_apps: 'Самые используемые приложения сегодня',
    no_usage: 'Сегодня пока нет времени у экрана',
    app_limit: 'макс. {n}',
    always_allowed: 'Всегда разрешено',
    blocked: 'Заблокировано',
    location: 'Местоположение',
    unknown_place: 'Где-то',
    not_located: 'Не определено',
    blocked_apps: 'Заблокированные приложения',
    battery: 'Батарея',
    bedtime: 'Время сна',
    schooltime: 'Школьное время',
    in: 'через {d}',
    until: 'до {t}',
    none: '—',
    ago_now: 'только что',
    ago_min: '{n} мин назад',
    ago_h: '{n} ч назад',
    ago_d: '{n} дн. назад',
    locked_parent: 'Заблокировано родителем',
    locked_bedtime: 'Время сна · до {t}',
    locked_school: 'Школьное время · до {t}',
    locked_limit: 'Дневной лимит исчерпан',
    break_title: 'Пора сделать перерыв',
    break_hint: 'Звонки и разрешённые приложения работают',
    bonus_running: 'Бонус +{n} мин',
    bonus_left: 'осталось {n} мин',
    bonus_until: 'до {t}',
    revoke: 'Отменить',
    revoke_confirm: 'Отменить бонус +{n} мин для {device}?',
    add: 'Добавить',
    add_minutes: 'Добавить {n} мин',
    less: 'Меньше',
    more: 'Больше',
    lock: 'Заблокировать',
    unlock: 'Разблокировать',
    ring: 'Позвонить',
    ringing: 'Звонит…',
    locate: 'Найти',
    emergency: 'Тревога',
    actions_for: 'Действия применяются к: {device}',
    cancel: 'Отмена',
    close: 'Закрыть',
    show_full: 'Показать полную карточку',
    show_compact: 'Вернуться к компактному виду',
    done: 'Готово',
    failed: 'Ошибка: {error}',
    today: 'Сегодня',
    h24: '24 ч',
    d7: '7 дней',
    points: 'Точек: {n}',
    km: '{n} км',
    update_location: 'Обновить местоположение',
    open_history: 'Открыть историю',
    accuracy: '±{n} м',
    no_trace: 'За этот период позиции не записаны',
    loading: 'Загрузка…',
    emergency_title: 'Тревога · {name}',
    message: 'Сообщение',
    quick_call: 'Перезвони мне',
    quick_home: 'Иди домой',
    quick_where: 'Где ты?',
    opt_ring: 'Позвонить на устройство',
    opt_ring_hint: 'Family Link · даже в беззвучном режиме',
    opt_notify: 'Критическое уведомление с сообщением',
    opt_notify_hint: 'Приложение Home Assistant · {service}',
    opt_locate: 'Запросить свежее местоположение',
    opt_locate_hint: 'Family Link · расходует батарею',
    send_emergency: 'Отправить тревогу',
    emergency_sent: 'Тревога отправлена',
    school_mode: 'Школьный режим',
    school_blocked: 'Заблокировано приложений: {n}',
    editor: {
      entity: 'Ребёнок (датчик статуса)',
      title: 'Заголовок',
      device: 'Устройство, показываемое первым',
      device_type: 'Рисунок устройства',
      type_auto: 'Автоматически',
      type_phone: 'Телефон',
      type_tablet: 'Планшет',
      show_scene: 'Показывать анимированное устройство',
      show_top_apps: 'Показывать популярные приложения',
      show_actions: 'Показывать действия',
      show_location: 'Показывать местоположение',
      trace_hours: 'Маршрут по умолчанию (часы)',
      language: 'Язык',
      lang_auto: 'Автоматически',
      illustration: 'Иллюстрированный заголовок',
      illustration_theme: 'Тема иллюстрации',
      theme_auto: 'Автоматически (по теме)',
      theme_day: 'День',
      theme_night: 'Ночь',
    },
  },
  uk: {
    status_tracked: 'Під контролем',
    status_attention: 'Увага',
    status_locked: 'Заблоковано',
    status_not_tracked: 'Без контролю',
    devices: 'Пристроїв: {n}',
    device_one: '1 пристрій',
    all: 'Усі',
    no_entity: 'Дитину не знайдено. Налаштуйте інтеграцію Family Link або вкажіть у «entity» датчик статусу дитини.',
    unavailable: 'Дані Family Link зараз недоступні.',
    stale: 'Family Link недоступний: дані останнього оновлення',
    left: 'залишилося',
    left_of: 'залишилося з {limit}',
    used_today: 'використано сьогодні',
    min: '{n} хв',
    h: '{h} год',
    hmin: '{h} год {m}',
    screen_time: 'Час перед екраном',
    top_apps: 'Найуживаніші застосунки сьогодні',
    no_usage: 'Сьогодні ще немає часу перед екраном',
    app_limit: 'макс. {n}',
    always_allowed: 'Завжди дозволено',
    blocked: 'Заблоковано',
    location: 'Місцеперебування',
    unknown_place: 'Десь',
    not_located: 'Не визначено',
    blocked_apps: 'Заблоковані застосунки',
    battery: 'Батарея',
    bedtime: 'Час сну',
    schooltime: 'Шкільний час',
    in: 'через {d}',
    until: 'до {t}',
    none: '—',
    ago_now: 'щойно',
    ago_min: '{n} хв тому',
    ago_h: '{n} год тому',
    ago_d: '{n} дн. тому',
    locked_parent: 'Заблоковано батьками',
    locked_bedtime: 'Час сну · до {t}',
    locked_school: 'Шкільний час · до {t}',
    locked_limit: 'Денний ліміт вичерпано',
    break_title: 'Час для перерви',
    break_hint: 'Дзвінки й дозволені застосунки працюють',
    bonus_running: 'Бонус +{n} хв',
    bonus_left: 'залишилося {n} хв',
    bonus_until: 'до {t}',
    revoke: 'Скасувати',
    revoke_confirm: 'Скасувати бонус +{n} хв для {device}?',
    add: 'Додати',
    add_minutes: 'Додати {n} хв',
    less: 'Менше',
    more: 'Більше',
    lock: 'Заблокувати',
    unlock: 'Розблокувати',
    ring: 'Подзвонити',
    ringing: 'Дзвонить…',
    locate: 'Знайти',
    emergency: 'Тривога',
    actions_for: 'Дії застосовуються до: {device}',
    cancel: 'Скасувати',
    close: 'Закрити',
    show_full: 'Показати повну картку',
    show_compact: 'Повернутися до компактного вигляду',
    done: 'Готово',
    failed: 'Помилка: {error}',
    today: 'Сьогодні',
    h24: '24 год',
    d7: '7 днів',
    points: 'Точок: {n}',
    km: '{n} км',
    update_location: 'Оновити місцеперебування',
    open_history: 'Відкрити історію',
    accuracy: '±{n} м',
    no_trace: 'За цей період позицій не записано',
    loading: 'Завантаження…',
    emergency_title: 'Тривога · {name}',
    message: 'Повідомлення',
    quick_call: 'Передзвони мені',
    quick_home: 'Повертайся додому',
    quick_where: 'Де ти?',
    opt_ring: 'Подзвонити на пристрій',
    opt_ring_hint: 'Family Link · навіть у беззвучному режимі',
    opt_notify: 'Критичне сповіщення з повідомленням',
    opt_notify_hint: 'Застосунок Home Assistant · {service}',
    opt_locate: 'Запитати свіже місцеперебування',
    opt_locate_hint: 'Family Link · витрачає батарею',
    send_emergency: 'Надіслати тривогу',
    emergency_sent: 'Тривогу надіслано',
    school_mode: 'Шкільний режим',
    school_blocked: 'Заблоковано застосунків: {n}',
    editor: {
      entity: 'Дитина (датчик статусу)',
      title: 'Заголовок',
      device: 'Пристрій, показаний першим',
      device_type: 'Малюнок пристрою',
      type_auto: 'Автоматично',
      type_phone: 'Телефон',
      type_tablet: 'Планшет',
      show_scene: 'Показувати анімований пристрій',
      show_top_apps: 'Показувати найуживаніші застосунки',
      show_actions: 'Показувати дії',
      show_location: 'Показувати місцеперебування',
      trace_hours: 'Маршрут за замовчуванням (години)',
      language: 'Мова',
      lang_auto: 'Автоматично',
      illustration: 'Ілюстрований заголовок',
      illustration_theme: 'Тема ілюстрації',
      theme_auto: 'Автоматично (за темою)',
      theme_day: 'День',
      theme_night: 'Ніч',
    },
  },
  hu: {
    status_tracked: 'Felügyelt',
    status_attention: 'Figyelem',
    status_locked: 'Zárolva',
    status_not_tracked: 'Nem felügyelt',
    devices: '{n} eszköz',
    device_one: '1 eszköz',
    all: 'Összes',
    no_entity: 'Nem található gyermek. Állítsa be a Family Link integrációt, vagy adja meg az „entity” értékét egy gyermek állapotérzékelőjeként.',
    unavailable: 'A Family Link adatai jelenleg nem érhetők el.',
    stale: 'A Family Link nem érhető el: a legutóbbi frissítés adatai',
    left: 'van hátra',
    left_of: 'van hátra ennyiből: {limit}',
    used_today: 'ma felhasználva',
    min: '{n} perc',
    h: '{h} ó',
    hmin: '{h} ó {m}',
    screen_time: 'Képernyőidő',
    top_apps: 'Mai legtöbbet használt alkalmazások',
    no_usage: 'Ma még nincs képernyőidő',
    app_limit: 'max. {n}',
    always_allowed: 'Mindig engedélyezett',
    blocked: 'Letiltva',
    location: 'Hely',
    unknown_place: 'Valahol',
    not_located: 'Nincs helyadat',
    blocked_apps: 'Letiltott alkalmazások',
    battery: 'Akkumulátor',
    bedtime: 'Alvásidő',
    schooltime: 'Iskolaidő',
    in: '{d} múlva',
    until: '{t}-ig',
    none: '—',
    ago_now: 'épp most',
    ago_min: '{n} perce',
    ago_h: '{n} órája',
    ago_d: '{n} napja',
    locked_parent: 'Szülő zárolta',
    locked_bedtime: 'Alvásidő · {t}-ig',
    locked_school: 'Iskolaidő · {t}-ig',
    locked_limit: 'Elérte a napi korlátot',
    break_title: 'Ideje szünetet tartani',
    break_hint: 'A hívások és az engedélyezett alkalmazások továbbra is működnek',
    bonus_running: 'Bónusz +{n} perc',
    bonus_left: 'még {n} perc',
    bonus_until: '{t}-ig',
    revoke: 'Visszavonás',
    revoke_confirm: 'Visszavonja a +{n} perces bónuszt ezen: {device}?',
    add: 'Hozzáadás',
    add_minutes: '{n} perc hozzáadása',
    less: 'Kevesebb',
    more: 'Több',
    lock: 'Zárolás',
    unlock: 'Feloldás',
    ring: 'Csengetés',
    ringing: 'Csörög…',
    locate: 'Helymeghatározás',
    emergency: 'Vészhelyzet',
    actions_for: 'A műveletek erre vonatkoznak: {device}',
    cancel: 'Mégse',
    close: 'Bezárás',
    show_full: 'Teljes kártya megjelenítése',
    show_compact: 'Vissza a kompakt nézethez',
    done: 'Kész',
    failed: 'Sikertelen: {error}',
    today: 'Ma',
    h24: '24 ó',
    d7: '7 nap',
    points: '{n} pont',
    km: '{n} km',
    update_location: 'Hely frissítése',
    open_history: 'Előzmények megnyitása',
    accuracy: '±{n} m',
    no_trace: 'Ebben az időszakban nincs rögzített pozíció',
    loading: 'Betöltés…',
    emergency_title: 'Vészhelyzet · {name}',
    message: 'Üzenet',
    quick_call: 'Hívj fel',
    quick_home: 'Gyere haza',
    quick_where: 'Hol vagy?',
    opt_ring: 'Az eszköz megcsörgetése',
    opt_ring_hint: 'Family Link · néma módban is',
    opt_notify: 'Kritikus értesítés az üzenettel',
    opt_notify_hint: 'Home Assistant alkalmazás · {service}',
    opt_locate: 'Friss hely kérése',
    opt_locate_hint: 'Family Link · akkumulátort használ',
    send_emergency: 'Vészjelzés küldése',
    emergency_sent: 'Vészjelzés elküldve',
    school_mode: 'Iskolai mód',
    school_blocked: '{n} alkalmazás letiltva',
    editor: {
      entity: 'Gyermek (állapotérzékelő)',
      title: 'Cím',
      device: 'Elsőként megjelenített eszköz',
      device_type: 'Eszköz rajza',
      type_auto: 'Automatikus',
      type_phone: 'Telefon',
      type_tablet: 'Táblagép',
      show_scene: 'Animált eszköz megjelenítése',
      show_top_apps: 'Legtöbbet használt alkalmazások megjelenítése',
      show_actions: 'Műveletek megjelenítése',
      show_location: 'Hely megjelenítése',
      trace_hours: 'Alapértelmezett útvonal (óra)',
      language: 'Nyelv',
      lang_auto: 'Automatikus',
      illustration: 'Illusztrált fejléc',
      illustration_theme: 'Az illusztráció témája',
      theme_auto: 'Automatikus (a témát követi)',
      theme_day: 'Nappal',
      theme_night: 'Éjszaka',
    },
  },
  sk: {
    status_tracked: 'Pod dohľadom',
    status_attention: 'Pozor',
    status_locked: 'Zamknuté',
    status_not_tracked: 'Bez dohľadu',
    devices: 'Zariadenia: {n}',
    device_one: '1 zariadenie',
    all: 'Všetky',
    no_entity: 'Nenašlo sa žiadne dieťa. Nastavte integráciu Family Link alebo nastavte „entity“ na senzor stavu dieťaťa.',
    unavailable: 'Údaje Family Link momentálne nie sú k dispozícii.',
    stale: 'Family Link je nedostupný: údaje z poslednej aktualizácie',
    left: 'zostáva',
    left_of: 'zostáva z {limit}',
    used_today: 'využité dnes',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Čas pred obrazovkou',
    top_apps: 'Najpoužívanejšie aplikácie dnes',
    no_usage: 'Dnes ešte žiadny čas pred obrazovkou',
    app_limit: 'max. {n}',
    always_allowed: 'Vždy povolená',
    blocked: 'Zablokovaná',
    location: 'Poloha',
    unknown_place: 'Niekde',
    not_located: 'Nelokalizované',
    blocked_apps: 'Zablokované aplikácie',
    battery: 'Batéria',
    bedtime: 'Čas na spánok',
    schooltime: 'Školský čas',
    in: 'o {d}',
    until: 'do {t}',
    none: '—',
    ago_now: 'práve teraz',
    ago_min: 'pred {n} min',
    ago_h: 'pred {n} h',
    ago_d: 'pred {n} d',
    locked_parent: 'Zamknuté rodičom',
    locked_bedtime: 'Čas na spánok · do {t}',
    locked_school: 'Školský čas · do {t}',
    locked_limit: 'Dosiahnutý denný limit',
    break_title: 'Čas na prestávku',
    break_hint: 'Hovory a povolené aplikácie naďalej fungujú',
    bonus_running: 'Bonus +{n} min',
    bonus_left: 'ešte {n} min',
    bonus_until: 'do {t}',
    revoke: 'Zrušiť',
    revoke_confirm: 'Zrušiť bonus +{n} min na zariadení {device}?',
    add: 'Pridať',
    add_minutes: 'Pridať {n} min',
    less: 'Menej',
    more: 'Viac',
    lock: 'Zamknúť',
    unlock: 'Odomknúť',
    ring: 'Zazvoniť',
    ringing: 'Zvoní…',
    locate: 'Nájsť',
    emergency: 'Núdza',
    actions_for: 'Akcie sa týkajú zariadenia {device}',
    cancel: 'Zrušiť',
    close: 'Zavrieť',
    show_full: 'Zobraziť celú kartu',
    show_compact: 'Späť na kompaktné zobrazenie',
    done: 'Hotovo',
    failed: 'Zlyhalo: {error}',
    today: 'Dnes',
    h24: '24 h',
    d7: '7 dní',
    points: 'Body: {n}',
    km: '{n} km',
    update_location: 'Aktualizovať polohu',
    open_history: 'Otvoriť históriu',
    accuracy: '±{n} m',
    no_trace: 'V tomto období nebola zaznamenaná žiadna poloha',
    loading: 'Načítava sa…',
    emergency_title: 'Núdza · {name}',
    message: 'Správa',
    quick_call: 'Zavolaj mi',
    quick_home: 'Príď domov',
    quick_where: 'Kde si?',
    opt_ring: 'Zazvoniť na zariadení',
    opt_ring_hint: 'Family Link · aj v tichom režime',
    opt_notify: 'Kritické upozornenie so správou',
    opt_notify_hint: 'Aplikácia Home Assistant · {service}',
    opt_locate: 'Vyžiadať aktuálnu polohu',
    opt_locate_hint: 'Family Link · spotrebúva batériu',
    send_emergency: 'Odoslať núdzu',
    emergency_sent: 'Núdza odoslaná',
    school_mode: 'Školský režim',
    school_blocked: 'Zablokované aplikácie: {n}',
    editor: {
      entity: 'Dieťa (senzor stavu)',
      title: 'Názov',
      device: 'Zariadenie zobrazené ako prvé',
      device_type: 'Kresba zariadenia',
      type_auto: 'Automaticky',
      type_phone: 'Telefón',
      type_tablet: 'Tablet',
      show_scene: 'Zobraziť animované zariadenie',
      show_top_apps: 'Zobraziť najpoužívanejšie aplikácie',
      show_actions: 'Zobraziť akcie',
      show_location: 'Zobraziť polohu',
      trace_hours: 'Predvolená zobrazená trasa (hodiny)',
      language: 'Jazyk',
      lang_auto: 'Automaticky',
      illustration: 'Ilustrovaná hlavička',
      illustration_theme: 'Téma ilustrácie',
      theme_auto: 'Automaticky (podľa témy)',
      theme_day: 'Deň',
      theme_night: 'Noc',
    },
  },
  cs: {
    status_tracked: 'Pod dohledem',
    status_attention: 'Pozor',
    status_locked: 'Zamčeno',
    status_not_tracked: 'Bez dohledu',
    devices: 'Zařízení: {n}',
    device_one: '1 zařízení',
    all: 'Vše',
    no_entity: 'Nebylo nalezeno žádné dítě. Nastavte integraci Family Link nebo nastavte „entity“ na senzor stavu dítěte.',
    unavailable: 'Data Family Link nejsou momentálně k dispozici.',
    stale: 'Family Link je nedostupný: data z poslední aktualizace',
    left: 'zbývá',
    left_of: 'zbývá z {limit}',
    used_today: 'využito dnes',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Čas u obrazovky',
    top_apps: 'Nejpoužívanější aplikace dnes',
    no_usage: 'Dnes zatím žádný čas u obrazovky',
    app_limit: 'max. {n}',
    always_allowed: 'Vždy povolena',
    blocked: 'Zablokována',
    location: 'Poloha',
    unknown_place: 'Někde',
    not_located: 'Nelokalizováno',
    blocked_apps: 'Zablokované aplikace',
    battery: 'Baterie',
    bedtime: 'Večerka',
    schooltime: 'Školní čas',
    in: 'za {d}',
    until: 'do {t}',
    none: '—',
    ago_now: 'právě teď',
    ago_min: 'před {n} min',
    ago_h: 'před {n} h',
    ago_d: 'před {n} d',
    locked_parent: 'Zamčeno rodičem',
    locked_bedtime: 'Večerka · do {t}',
    locked_school: 'Školní čas · do {t}',
    locked_limit: 'Dosažen denní limit',
    break_title: 'Čas na přestávku',
    break_hint: 'Hovory a povolené aplikace nadále fungují',
    bonus_running: 'Bonus +{n} min',
    bonus_left: 'ještě {n} min',
    bonus_until: 'do {t}',
    revoke: 'Zrušit',
    revoke_confirm: 'Zrušit bonus +{n} min na zařízení {device}?',
    add: 'Přidat',
    add_minutes: 'Přidat {n} min',
    less: 'Méně',
    more: 'Více',
    lock: 'Zamknout',
    unlock: 'Odemknout',
    ring: 'Prozvonit',
    ringing: 'Zvoní…',
    locate: 'Najít',
    emergency: 'Nouze',
    actions_for: 'Akce se týkají zařízení {device}',
    cancel: 'Zrušit',
    close: 'Zavřít',
    show_full: 'Zobrazit celou kartu',
    show_compact: 'Zpět na kompaktní zobrazení',
    done: 'Hotovo',
    failed: 'Selhalo: {error}',
    today: 'Dnes',
    h24: '24 h',
    d7: '7 dní',
    points: 'Body: {n}',
    km: '{n} km',
    update_location: 'Aktualizovat polohu',
    open_history: 'Otevřít historii',
    accuracy: '±{n} m',
    no_trace: 'V tomto období nebyla zaznamenána žádná poloha',
    loading: 'Načítání…',
    emergency_title: 'Nouze · {name}',
    message: 'Zpráva',
    quick_call: 'Zavolej mi',
    quick_home: 'Pojď domů',
    quick_where: 'Kde jsi?',
    opt_ring: 'Prozvonit zařízení',
    opt_ring_hint: 'Family Link · i v tichém režimu',
    opt_notify: 'Kritické oznámení se zprávou',
    opt_notify_hint: 'Aplikace Home Assistant · {service}',
    opt_locate: 'Vyžádat aktuální polohu',
    opt_locate_hint: 'Family Link · spotřebovává baterii',
    send_emergency: 'Odeslat nouzi',
    emergency_sent: 'Nouze odeslána',
    school_mode: 'Školní režim',
    school_blocked: 'Zablokované aplikace: {n}',
    editor: {
      entity: 'Dítě (senzor stavu)',
      title: 'Název',
      device: 'Zařízení zobrazené jako první',
      device_type: 'Kresba zařízení',
      type_auto: 'Automaticky',
      type_phone: 'Telefon',
      type_tablet: 'Tablet',
      show_scene: 'Zobrazit animované zařízení',
      show_top_apps: 'Zobrazit nejpoužívanější aplikace',
      show_actions: 'Zobrazit akce',
      show_location: 'Zobrazit polohu',
      trace_hours: 'Výchozí zobrazená trasa (hodiny)',
      language: 'Jazyk',
      lang_auto: 'Automaticky',
      illustration: 'Ilustrované záhlaví',
      illustration_theme: 'Motiv ilustrace',
      theme_auto: 'Automaticky (podle motivu)',
      theme_day: 'Den',
      theme_night: 'Noc',
    },
  },
  sl: {
    status_tracked: 'Pod nadzorom',
    status_attention: 'Pozor',
    status_locked: 'Zaklenjeno',
    status_not_tracked: 'Brez nadzora',
    devices: 'Naprave: {n}',
    device_one: '1 naprava',
    all: 'Vse',
    no_entity: 'Ni najdenega otroka. Nastavite integracijo Family Link ali nastavite „entity“ na senzor stanja otroka.',
    unavailable: 'Podatki Family Link trenutno niso na voljo.',
    stale: 'Family Link ni dosegljiv: podatki zadnje posodobitve',
    left: 'preostane',
    left_of: 'preostane od {limit}',
    used_today: 'porabljeno danes',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Čas pred zaslonom',
    top_apps: 'Najbolj uporabljane aplikacije danes',
    no_usage: 'Danes še ni časa pred zaslonom',
    app_limit: 'najv. {n}',
    always_allowed: 'Vedno dovoljena',
    blocked: 'Blokirana',
    location: 'Lokacija',
    unknown_place: 'Nekje',
    not_located: 'Ni locirano',
    blocked_apps: 'Blokirane aplikacije',
    battery: 'Baterija',
    bedtime: 'Čas za spanje',
    schooltime: 'Šolski čas',
    in: 'čez {d}',
    until: 'do {t}',
    none: '—',
    ago_now: 'pravkar',
    ago_min: 'pred {n} min',
    ago_h: 'pred {n} h',
    ago_d: 'pred {n} d',
    locked_parent: 'Zaklenil starš',
    locked_bedtime: 'Čas za spanje · do {t}',
    locked_school: 'Šolski čas · do {t}',
    locked_limit: 'Dosežena dnevna omejitev',
    break_title: 'Čas za odmor',
    break_hint: 'Klici in dovoljene aplikacije še vedno delujejo',
    bonus_running: 'Bonus +{n} min',
    bonus_left: 'še {n} min',
    bonus_until: 'do {t}',
    revoke: 'Prekliči',
    revoke_confirm: 'Preklicati bonus +{n} min na napravi {device}?',
    add: 'Dodaj',
    add_minutes: 'Dodaj {n} min',
    less: 'Manj',
    more: 'Več',
    lock: 'Zakleni',
    unlock: 'Odkleni',
    ring: 'Pozvoni',
    ringing: 'Zvoni…',
    locate: 'Poišči',
    emergency: 'Nujno',
    actions_for: 'Dejanja veljajo za {device}',
    cancel: 'Prekliči',
    close: 'Zapri',
    show_full: 'Prikaži celotno kartico',
    show_compact: 'Nazaj na strnjen prikaz',
    done: 'Končano',
    failed: 'Ni uspelo: {error}',
    today: 'Danes',
    h24: '24 h',
    d7: '7 dni',
    points: 'Točke: {n}',
    km: '{n} km',
    update_location: 'Posodobi lokacijo',
    open_history: 'Odpri zgodovino',
    accuracy: '±{n} m',
    no_trace: 'V tem obdobju ni zabeležena nobena lokacija',
    loading: 'Nalaganje…',
    emergency_title: 'Nujno · {name}',
    message: 'Sporočilo',
    quick_call: 'Pokliči me',
    quick_home: 'Pridi domov',
    quick_where: 'Kje si?',
    opt_ring: 'Naj naprava pozvoni',
    opt_ring_hint: 'Family Link · tudi v tihem načinu',
    opt_notify: 'Kritično obvestilo s sporočilom',
    opt_notify_hint: 'Aplikacija Home Assistant · {service}',
    opt_locate: 'Zahtevaj svežo lokacijo',
    opt_locate_hint: 'Family Link · porablja baterijo',
    send_emergency: 'Pošlji nujno',
    emergency_sent: 'Nujno poslano',
    school_mode: 'Šolski način',
    school_blocked: 'Blokirane aplikacije: {n}',
    editor: {
      entity: 'Otrok (senzor stanja)',
      title: 'Naslov',
      device: 'Naprava, prikazana prva',
      device_type: 'Risba naprave',
      type_auto: 'Samodejno',
      type_phone: 'Telefon',
      type_tablet: 'Tablica',
      show_scene: 'Prikaži animirano napravo',
      show_top_apps: 'Prikaži najbolj uporabljane aplikacije',
      show_actions: 'Prikaži dejanja',
      show_location: 'Prikaži lokacijo',
      trace_hours: 'Privzeto prikazana pot (ure)',
      language: 'Jezik',
      lang_auto: 'Samodejno',
      illustration: 'Ilustrirana glava',
      illustration_theme: 'Tema ilustracije',
      theme_auto: 'Samodejno (sledi temi)',
      theme_day: 'Dan',
      theme_night: 'Noč',
    },
  },
  lv: {
    status_tracked: 'Uzraudzīts',
    status_attention: 'Uzmanību',
    status_locked: 'Bloķēts',
    status_not_tracked: 'Neuzraudzīts',
    devices: 'Ierīces: {n}',
    device_one: '1 ierīce',
    all: 'Visas',
    no_entity: 'Bērns nav atrasts. Iestatiet Family Link integrāciju vai norādiet “entity” kā bērna statusa sensoru.',
    unavailable: 'Family Link dati pašlaik nav pieejami.',
    stale: 'Family Link nav sasniedzams: pēdējās atjaunināšanas dati',
    left: 'atlicis',
    left_of: 'atlicis no {limit}',
    used_today: 'izmantots šodien',
    min: '{n} min',
    h: '{h} st.',
    hmin: '{h} st. {m}',
    screen_time: 'Ekrāna laiks',
    top_apps: 'Šodien visvairāk lietotās lietotnes',
    no_usage: 'Šodien vēl nav ekrāna laika',
    app_limit: 'maks. {n}',
    always_allowed: 'Vienmēr atļauta',
    blocked: 'Bloķēta',
    location: 'Atrašanās vieta',
    unknown_place: 'Kaut kur',
    not_located: 'Nav noteikta',
    blocked_apps: 'Bloķētās lietotnes',
    battery: 'Akumulators',
    bedtime: 'Gulētiešanas laiks',
    schooltime: 'Skolas laiks',
    in: 'pēc {d}',
    until: 'līdz {t}',
    none: '—',
    ago_now: 'tikko',
    ago_min: 'pirms {n} min',
    ago_h: 'pirms {n} st.',
    ago_d: 'pirms {n} d.',
    locked_parent: 'Bloķējis vecāks',
    locked_bedtime: 'Gulētiešanas laiks · līdz {t}',
    locked_school: 'Skolas laiks · līdz {t}',
    locked_limit: 'Sasniegts dienas limits',
    break_title: 'Laiks pauzei',
    break_hint: 'Zvani un atļautās lietotnes joprojām darbojas',
    bonus_running: 'Bonuss +{n} min',
    bonus_left: 'vēl {n} min',
    bonus_until: 'līdz {t}',
    revoke: 'Atsaukt',
    revoke_confirm: 'Atsaukt +{n} min bonusu ierīcē {device}?',
    add: 'Pievienot',
    add_minutes: 'Pievienot {n} min',
    less: 'Mazāk',
    more: 'Vairāk',
    lock: 'Bloķēt',
    unlock: 'Atbloķēt',
    ring: 'Zvanīt',
    ringing: 'Zvana…',
    locate: 'Atrast',
    emergency: 'Ārkārtas',
    actions_for: 'Darbības attiecas uz {device}',
    cancel: 'Atcelt',
    close: 'Aizvērt',
    show_full: 'Rādīt pilno karti',
    show_compact: 'Atpakaļ uz kompakto skatu',
    done: 'Gatavs',
    failed: 'Neizdevās: {error}',
    today: 'Šodien',
    h24: '24 st.',
    d7: '7 dienas',
    points: 'Punkti: {n}',
    km: '{n} km',
    update_location: 'Atjaunināt atrašanās vietu',
    open_history: 'Atvērt vēsturi',
    accuracy: '±{n} m',
    no_trace: 'Šajā periodā nav reģistrēta neviena pozīcija',
    loading: 'Ielādē…',
    emergency_title: 'Ārkārtas · {name}',
    message: 'Ziņa',
    quick_call: 'Piezvani man',
    quick_home: 'Nāc mājās',
    quick_where: 'Kur tu esi?',
    opt_ring: 'Likt ierīcei zvanīt',
    opt_ring_hint: 'Family Link · arī klusajā režīmā',
    opt_notify: 'Kritisks paziņojums ar ziņu',
    opt_notify_hint: 'Home Assistant lietotne · {service}',
    opt_locate: 'Pieprasīt svaigu atrašanās vietu',
    opt_locate_hint: 'Family Link · patērē akumulatoru',
    send_emergency: 'Sūtīt ārkārtas',
    emergency_sent: 'Ārkārtas nosūtīts',
    school_mode: 'Skolas režīms',
    school_blocked: 'Bloķētas lietotnes: {n}',
    editor: {
      entity: 'Bērns (statusa sensors)',
      title: 'Virsraksts',
      device: 'Ierīce, kas rādīta pirmā',
      device_type: 'Ierīces zīmējums',
      type_auto: 'Automātiski',
      type_phone: 'Tālrunis',
      type_tablet: 'Planšete',
      show_scene: 'Rādīt animēto ierīci',
      show_top_apps: 'Rādīt visvairāk lietotās lietotnes',
      show_actions: 'Rādīt darbības',
      show_location: 'Rādīt atrašanās vietu',
      trace_hours: 'Noklusējuma maršruts (stundas)',
      language: 'Valoda',
      lang_auto: 'Automātiski',
      illustration: 'Ilustrēta galvene',
      illustration_theme: 'Ilustrācijas tēma',
      theme_auto: 'Automātiski (atbilstoši tēmai)',
      theme_day: 'Diena',
      theme_night: 'Nakts',
    },
  },
  el: {
    status_tracked: 'Υπό επίβλεψη',
    status_attention: 'Προσοχή',
    status_locked: 'Κλειδωμένο',
    status_not_tracked: 'Χωρίς επίβλεψη',
    devices: 'Συσκευές: {n}',
    device_one: '1 συσκευή',
    all: 'Όλες',
    no_entity: 'Δεν βρέθηκε παιδί. Ρυθμίστε την ενσωμάτωση Family Link ή ορίστε το «entity» σε αισθητήρα κατάστασης παιδιού.',
    unavailable: 'Τα δεδομένα του Family Link δεν είναι διαθέσιμα αυτή τη στιγμή.',
    stale: 'Το Family Link δεν είναι προσβάσιμο: δεδομένα τελευταίας ενημέρωσης',
    left: 'απομένουν',
    left_of: 'απομένουν από {limit}',
    used_today: 'χρήση σήμερα',
    min: '{n} λεπ.',
    h: '{h} ώ',
    hmin: '{h} ώ {m}',
    screen_time: 'Χρόνος οθόνης',
    top_apps: 'Κορυφαίες εφαρμογές σήμερα',
    no_usage: 'Κανένας χρόνος οθόνης σήμερα ακόμη',
    app_limit: 'έως {n}',
    always_allowed: 'Πάντα επιτρεπτή',
    blocked: 'Αποκλεισμένη',
    location: 'Τοποθεσία',
    unknown_place: 'Κάπου',
    not_located: 'Χωρίς τοποθεσία',
    blocked_apps: 'Αποκλεισμένες εφαρμογές',
    battery: 'Μπαταρία',
    bedtime: 'Ώρα ύπνου',
    schooltime: 'Ώρα σχολείου',
    in: 'σε {d}',
    until: 'έως {t}',
    none: '—',
    ago_now: 'μόλις τώρα',
    ago_min: 'πριν από {n} λεπ.',
    ago_h: 'πριν από {n} ώ',
    ago_d: 'πριν από {n} ημ.',
    locked_parent: 'Κλείδωσε ο γονέας',
    locked_bedtime: 'Ώρα ύπνου · έως {t}',
    locked_school: 'Ώρα σχολείου · έως {t}',
    locked_limit: 'Συμπληρώθηκε το ημερήσιο όριο',
    break_title: 'Ώρα για διάλειμμα',
    break_hint: 'Οι κλήσεις και οι επιτρεπτές εφαρμογές λειτουργούν κανονικά',
    bonus_running: 'Μπόνους +{n} λεπ.',
    bonus_left: 'απομένουν {n} λεπ.',
    bonus_until: 'έως {t}',
    revoke: 'Ανάκληση',
    revoke_confirm: 'Ανάκληση του μπόνους +{n} λεπ. στη συσκευή {device};',
    add: 'Προσθήκη',
    add_minutes: 'Προσθήκη {n} λεπ.',
    less: 'Λιγότερα',
    more: 'Περισσότερα',
    lock: 'Κλείδωμα',
    unlock: 'Ξεκλείδωμα',
    ring: 'Κουδούνισμα',
    ringing: 'Χτυπάει…',
    locate: 'Εντοπισμός',
    emergency: 'Έκτακτο',
    actions_for: 'Οι ενέργειες αφορούν τη συσκευή {device}',
    cancel: 'Ακύρωση',
    close: 'Κλείσιμο',
    show_full: 'Εμφάνιση πλήρους κάρτας',
    show_compact: 'Επιστροφή στη συμπαγή προβολή',
    done: 'Ολοκληρώθηκε',
    failed: 'Απέτυχε: {error}',
    today: 'Σήμερα',
    h24: '24 ώ',
    d7: '7 ημέρες',
    points: 'Σημεία: {n}',
    km: '{n} χλμ',
    update_location: 'Ενημέρωση τοποθεσίας',
    open_history: 'Άνοιγμα ιστορικού',
    accuracy: '±{n} μ',
    no_trace: 'Δεν καταγράφηκε καμία θέση σε αυτό το διάστημα',
    loading: 'Φόρτωση…',
    emergency_title: 'Έκτακτο · {name}',
    message: 'Μήνυμα',
    quick_call: 'Πάρε με τηλέφωνο',
    quick_home: 'Έλα σπίτι',
    quick_where: 'Πού είσαι;',
    opt_ring: 'Κουδούνισμα της συσκευής',
    opt_ring_hint: 'Family Link · ακόμη και στο αθόρυβο',
    opt_notify: 'Κρίσιμη ειδοποίηση με το μήνυμα',
    opt_notify_hint: 'Εφαρμογή Home Assistant · {service}',
    opt_locate: 'Αίτημα νέας τοποθεσίας',
    opt_locate_hint: 'Family Link · καταναλώνει μπαταρία',
    send_emergency: 'Αποστολή έκτακτου',
    emergency_sent: 'Το έκτακτο στάλθηκε',
    school_mode: 'Λειτουργία σχολείου',
    school_blocked: 'Αποκλεισμένες εφαρμογές: {n}',
    editor: {
      entity: 'Παιδί (αισθητήρας κατάστασης)',
      title: 'Τίτλος',
      device: 'Συσκευή που εμφανίζεται πρώτη',
      device_type: 'Σχέδιο συσκευής',
      type_auto: 'Αυτόματα',
      type_phone: 'Τηλέφωνο',
      type_tablet: 'Tablet',
      show_scene: 'Εμφάνιση κινούμενης συσκευής',
      show_top_apps: 'Εμφάνιση κορυφαίων εφαρμογών',
      show_actions: 'Εμφάνιση ενεργειών',
      show_location: 'Εμφάνιση τοποθεσίας',
      trace_hours: 'Προεπιλεγμένη διαδρομή (ώρες)',
      language: 'Γλώσσα',
      lang_auto: 'Αυτόματα',
      illustration: 'Εικονογραφημένη κεφαλίδα',
      illustration_theme: 'Θέμα εικονογράφησης',
      theme_auto: 'Αυτόματο (ακολουθεί το θέμα)',
      theme_day: 'Ημέρα',
      theme_night: 'Νύχτα',
    },
  },
};

var FL_DEFAULTS = {
  show_scene: true,
  show_top_apps: true,
  show_actions: true,
  show_location: true,
  device_type: 'auto',
  trace_hours: 24,
  bonus_presets: [15, 30, 60],
  illustration: true,
  illustration_theme: 'auto',
};

var FL_STATUS = {
  tracked: { color: '#34a853', tint: 'rgba(52,168,83,.18)' },
  attention: { color: '#f9ab00', tint: 'rgba(249,171,0,.18)' },
  locked: { color: '#ea4335', tint: 'rgba(234,67,53,.16)' },
  not_tracked: { color: '#9aa0a6', tint: 'rgba(154,160,166,.18)' },
};
var FL_SEVERITY = { tracked: 0, attention: 1, locked: 2, not_tracked: 3 };
var FL_APP_COLORS = ['#e8453c', '#4caf50', '#4285f4', '#f9ab00', '#a142f4', '#24c1e0', '#ff7043', '#8d6e63'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function flLang(hass, config) {
  var lang = String(config?.language || (hass && (hass.locale?.language || hass.language)) || navigator.language || 'en');
  if (FamilyLinkI18n[lang]) return lang;
  lang = lang.split('-')[0];
  return FamilyLinkI18n[lang] ? lang : 'en';
}

function flTr(t, key, vars) {
  var text = t[key] ?? FamilyLinkI18n.en[key] ?? key;
  Object.keys(vars || {}).forEach((k) => {
    text = text.split(`{${k}}`).join(vars[k]);
  });
  return text;
}

function flEsc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function flDuration(minutes, t) {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return t.none;
  var m = Math.max(0, Math.round(minutes));
  if (m < 60) return flTr(t, 'min', { n: m });
  var h = Math.floor(m / 60);
  var rest = m % 60;
  return rest ? flTr(t, 'hmin', { h: h, m: String(rest).padStart(2, '0') }) : flTr(t, 'h', { h: h });
}

function flAgo(iso, t, now) {
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  var minutes = Math.max(0, Math.round((now - ms) / 60000));
  if (minutes < 1) return t.ago_now;
  if (minutes < 60) return flTr(t, 'ago_min', { n: minutes });
  if (minutes < 48 * 60) return flTr(t, 'ago_h', { n: Math.round(minutes / 60) });
  return flTr(t, 'ago_d', { n: Math.round(minutes / 1440) });
}

function flClock(iso, hass) {
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  try {
    return new Date(ms).toLocaleTimeString(hass?.locale?.language || undefined, { hour: '2-digit', minute: '2-digit' });
  } catch (_err) {
    return new Date(ms).toTimeString().slice(0, 5);
  }
}

function flIsChild(state) {
  return !!state?.attributes?.family_link;
}

function flInDialog(ev) {
  return ev.composedPath().some((el) => el?.tagName && /^(HA-DIALOG|HA-MORE-INFO-DIALOG|MWC-DIALOG|HA-MD-DIALOG)$/.test(el.tagName));
}

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app) a
// tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to the
// page. It counts when the press and the release are both outside the card (a slider dragged out of the card does not
// close it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through the click
// event. `tap(ev)` (a press and a release at the same spot) is for the tests.
function flWatchOutside(isOut, handler) {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOut(ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOut(ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOut(ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener('pointerdown', onDown, true);
      document.addEventListener('pointerup', onUp, true);
      document.addEventListener('click', onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      document.removeEventListener('click', onClick, true);
    },
  };
}

function flKm(points) {
  var total = 0;
  for (var i = 1; i < points.length; i++) {
    var a = points[i - 1];
    var b = points[i];
    var rad = Math.PI / 180;
    var dLat = (b[0] - a[0]) * rad;
    var dLon = (b[1] - a[1]) * rad;
    var h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
    total += 12742 * Math.asin(Math.sqrt(h));
  }
  return total;
}

// Stroke icons, 24×24, drawn like the Material Design Icons line set
var FL_ICON_PATHS = {
  kite: '<path d="M12 2.2 3.4 9.8 12 21.4 20.6 9.8z"/><path d="M3.4 9.8h17.2M12 9.8v5.4M6.4 14l5.6 1.2 5.6-1.2"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path class="shackle" d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  alert: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  gift: '<circle cx="12" cy="13" r="8"/><path d="M12 9.5v7M8.5 13h7M9 2h6"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  collapse: '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/>',
  tablet: '<rect x="2" y="5" width="20" height="14" rx="2"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  block: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  offline: '<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.4-1.8M2 8.8a15 15 0 0 1 4.2-2.7M22 8.8A15 15 0 0 0 11 5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
};

// Small school cap after the child's name while the school mode is on
// The width of an element's whole text in its own font, in fractional pixels (scrollWidth is rounded).
let flTextCtx;
const flTextWidth = (el) => {
  const cs = getComputedStyle(el);
  flTextCtx ??= document.createElement('canvas').getContext?.('2d');
  if (!flTextCtx) return el.scrollWidth;
  flTextCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  return Math.max(el.scrollWidth, flTextCtx.measureText(el.textContent.trim()).width + pad);
};

function flSchoolTag(a, t) {
  return a?.school_mode?.active ? `<span class="school-tag" title="${flEsc(t.school_mode)}" aria-label="${flEsc(t.school_mode)}">${flIcon('school')}</span>` : '';
}

function flIcon(name, cls) {
  return `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${FL_ICON_PATHS[name] || ''}</svg>`;
}

// ── Illustrated header ────────────────────────────────────────────────────────
var flUid = 0;

// Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day
// picture after sunset)
function flIsNight(hass, config) {
  var theme = config?.illustration_theme;
  if (theme === 'night') return true;
  if (theme === 'day') return false;
  return !!hass?.themes?.darkMode;
}

// The header picture, 200 × 80, drawn from the right of the banner: a shelf in the child's room with a toy box,
// the child's phone or tablet (apps, or the lock / bedtime / school screen) and an hourglass for the time left.
// `st`: { kind: 'phone' | 'tablet', status, restricted, ratio (share of the day's time left, or null) }.
// `uid` keeps each card's clip-path apart when several cards share a page.
function flSceneSvg(uid, st) {
  var tablet = st.kind === 'tablet';
  var active = !st.restricted && (st.status === 'tracked' || st.status === 'attention');
  var off = !st.restricted && !active;
  // Screen box in the device's local frame (device stands on the shelf at y 0)
  var sw = tablet ? 38 : 20;
  var sh = tablet ? 24 : 31;
  var sx = -sw / 2;
  var sy = tablet ? -28.5 : -36;
  var body = tablet
    ? '<rect class="fl-dev" x="-22" y="-31" width="44" height="29" rx="3.5"/><rect class="fl-dev" x="-7" y="-2.5" width="14" height="2.5" rx="1"/>'
    : '<rect class="fl-dev" x="-12.5" y="-39.5" width="25" height="39.5" rx="4.5"/><rect class="fl-notch" x="-3" y="-38.2" width="6" height="1.1" rx=".55"/>';
  var screen;
  if (active) {
    var cols = tablet ? 4 : 2;
    var tiles = [];
    for (var i = 0; i < cols * 2; i++) {
      var tx = sx + (tablet ? 4 : 3) + (i % cols) * (tablet ? 8 : 8);
      var ty = sy + 4 + Math.floor(i / cols) * 8;
      tiles.push(`<rect class="fl-tile" x="${tx}" y="${ty}" width="6" height="6" rx="1.5" style="fill:${FL_APP_COLORS[i % FL_APP_COLORS.length]};animation-delay:${(i * 0.3).toFixed(1)}s"/>`);
    }
    var ratio = st.ratio === null || st.ratio === undefined ? null : Math.max(0, Math.min(1, st.ratio));
    var bar =
      ratio === null
        ? ''
        : `<rect class="fl-track" x="${sx + 3}" y="${sy + sh - 4.5}" width="${sw - 6}" height="2" rx="1"/><rect class="fl-bar" x="${sx + 3}" y="${sy + sh - 4.5}" width="${Math.max(1.5, (sw - 6) * ratio).toFixed(1)}" height="2" rx="1"/>`;
    screen = `<rect class="fl-screen" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/><g clip-path="url(#fl-clip-${uid})">${tiles.join('')}${bar}<rect class="fl-scan" x="${sx}" y="${sy - 8}" width="${sw}" height="8"/></g>`;
  } else if (st.restricted) {
    var cx = 0;
    var cy = sy + sh / 2;
    var sign;
    if (st.restricted === 'bedtime') sign = `<path class="fl-moon" d="M${cx + 1.5} ${cy - 5}a5 5 0 1 0 3.6 8.4 4 4 0 1 1-3.6-8.4z"/>`;
    else if (st.restricted === 'schooltime')
      sign = `<g class="fl-cap" transform="translate(${cx} ${cy})"><path d="M-6 -1.5 0 -4.5 6 -1.5 0 1.5z"/><path d="M-3.5 0v2.6c2 1.4 5 1.4 7 0V0" fill="none" stroke-width="1.2"/></g>`;
    else
      sign = `<g transform="translate(${cx} ${cy})"><rect class="fl-lock" x="-4" y="-1" width="8" height="7" rx="1"/><path class="fl-shackle" d="M-2.6 -1v-2a2.6 2.6 0 0 1 5.2 0v2"/></g>`;
    screen = `<rect class="fl-screen off" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/>${sign}`;
  } else {
    var oy = sy + sh / 2;
    screen = `<rect class="fl-screen dead" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/><g class="fl-offline" transform="translate(0 ${oy})"><circle r="4.5"/><path d="M-3.2 -3.2 3.2 3.2"/></g>`;
  }
  // Hourglass: sand on top for the time left, all down once it is spent
  var top = active ? (st.ratio === null || st.ratio === undefined ? 0.6 : Math.max(0, Math.min(1, st.ratio))) : 0;
  var th = (9 * top).toFixed(1);
  var bh = (8 * (1 - top) + 1.5).toFixed(1);
  var hourglass = `<g transform="translate(176 47.5)">
      <path class="fl-glass" d="M-6 -12h12M-6 12h12M-5 -12q0 8 5 12q-5 4-5 12M5 -12q0 8-5 12q5 4 5 12"/>
      ${top > 0 ? `<path class="fl-sand" d="M${-(4 * top).toFixed(2)} ${(-1 - 9 * top).toFixed(2)}h${(8 * top).toFixed(2)}l${-(4 * top).toFixed(2)} ${th}z"/>` : ''}
      <path class="fl-sand" d="M-${(bh * 0.55).toFixed(2)} 10.5h${(bh * 1.1).toFixed(2)}l-${(bh * 0.55).toFixed(2)} -${bh}z"/>
      ${active ? '<path class="fl-grain" d="M0 0v10"/>' : ''}
    </g>`;
  var x = tablet ? 146 : 142;
  return `<svg class="fl-scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
    <defs><clipPath id="fl-clip-${uid}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/></clipPath></defs>
    <rect class="fl-shelf" x="96" y="60" width="104" height="3"/>
    <g class="fl-box"><rect x="102" y="46" width="16" height="14" rx="2"/><rect class="fl-box-lid" x="104" y="48" width="12" height="3"/></g>
    <g class="fl-device${off ? ' dim' : ''}" transform="translate(${x} 60)">${body}${screen}</g>
    ${hourglass}
  </svg>`;
}

// ── family-link-card ─────────────────────────────────────────────────────────
class FamilyLinkCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement('family-link-card-editor');
  }

  static getStubConfig(hass) {
    var found = FamilyLinkCard._findEntities(hass);
    return found.length ? { entity: found[0] } : {};
  }

  static _findEntities(hass) {
    if (!hass?.states) return [];
    var found = Object.keys(hass.states).filter((id) => id.startsWith('sensor.') && flIsChild(hass.states[id]));
    Object.keys(hass.entities || {}).forEach((id) => {
      var e = hass.entities[id];
      if (e.platform === 'family_link' && e.translation_key === 'status' && hass.states[id] && found.indexOf(id) === -1) found.push(id);
    });
    return found.sort();
  }

  constructor() {
    super();
    this._selected = null;
    this._popup = null; // { type: 'location' | 'emergency' | 'confirm', ... }
    this._busy = {};
    this._ringing = {};
    this._custom = 45;
    this._toast = null;
    this._uid = ++flUid;
  }

  setConfig(config) {
    this._config = Object.assign({}, FL_DEFAULTS, config || {});
    if (this._config.device && !this._selected) this._selected = this._config.device;
    this._lastState = null;
    if (this._hass) this._render();
  }

  set hass(hass) {
    var first = !this._hass;
    this._hass = hass;
    var state = hass.states[this._entityId()];
    // The night picture follows the dark theme
    var night = this._config && this._config.illustration !== false ? flIsNight(hass, this._config) : null;
    if (state !== this._lastState || night !== this._lastNight) {
      this._lastState = state;
      this._lastNight = night;
      this._render();
    } else if (first) {
      this._render();
    }
    if (this._map) this._map.hass = hass;
  }

  connectedCallback() {
    this._onOutside =
      this._onOutside ||
      flWatchOutside(
        (ev) => !!this._popup && !flInDialog(ev) && !ev.composedPath().includes(this),
        () => this._closePopup()
      );
    this._onOutside.on();
    if (!this._timer) this._timer = setInterval(() => this._tick(), 30000);
    if (!this._fitObserver && typeof ResizeObserver === 'function') this._fitObserver = new ResizeObserver(() => this._fitPill());
    this._fitObserver?.observe(this);
    document.fonts?.ready?.then(() => this._fitPill());
  }

  disconnectedCallback() {
    this._onOutside?.off();
    clearTimeout(this._ringTimer);
    this._ringTimer = null;
    this._fitObserver?.disconnect();
    clearInterval(this._timer);
    this._timer = null;
    // Leaving the page closes a popup without running it
    if (this._popup) this._closePopup(true);
  }

  getCardSize() {
    return 9;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 'auto' };
  }

  _entityId() {
    var c = this._config || {};
    if (c.entity) return c.entity;
    if (!this._auto || !this._hass?.states[this._auto]) this._auto = FamilyLinkCard._findEntities(this._hass)[0];
    return this._auto;
  }

  _t() {
    return FamilyLinkI18n[flLang(this._hass, this._config)];
  }

  _state() {
    return this._hass?.states[this._entityId()];
  }

  _attrs() {
    return this._state()?.attributes || {};
  }

  // The device shown: the configured or clicked one, else the one needing most attention, else the first
  _device(attrs) {
    var devices = attrs.devices || [];
    if (this._selected === 'all' && devices.length > 1) return null;
    var wanted = this._selected;
    var found = devices.find((d) => d.id === wanted || (wanted && String(d.name).toLowerCase() === String(wanted).toLowerCase()));
    if (found) return found;
    return devices.slice().sort((a, b) => (FL_SEVERITY[b.status] || 0) - (FL_SEVERITY[a.status] || 0) || (b.used || 0) - (a.used || 0))[0] || null;
  }

  _kind(device) {
    var type = this._config.device_type;
    if (type === 'phone' || type === 'tablet') return type;
    return device && device.kind !== 'phone' ? 'tablet' : 'phone';
  }

  _ensureShell() {
    if (this._root) return;
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `<style>${FamilyLinkCard._styles()}</style><ha-card><div class="main"></div><div class="layer"></div><div class="toast" role="status" aria-live="polite"></div></ha-card>`;
    var card = this._root.querySelector('ha-card');
    card.addEventListener('click', this._onClick.bind(this));
    card.addEventListener('input', this._onInput.bind(this));
  }

  _render() {
    if (!this._config || !this._hass) return;
    this._ensureShell();
    var t = this._t();
    var state = this._state();
    var main = this._root.querySelector('.main');
    if (!state) {
      main.innerHTML = `<div class="empty">${flIcon('kite')}<span>${flEsc(t.no_entity)}</span></div>`;
      return;
    }
    var a = state.attributes || {};
    if (state.state === 'unavailable' || !a.family_link) {
      main.innerHTML = `${this._header(a, null, t, state)}<div class="empty">${flIcon('offline')}<span>${flEsc(t.unavailable)}</span></div>`;
      return;
    }
    main.innerHTML = this._compact() ? this._renderCompact(a, t, state) : this._renderFull(a, t, state);
    if (this._popup) this._renderPopup();
    this._fitPill();
  }

  // The status pill, measured after each render and on a new width (in every language): it sits on the title's row,
  // right after the title, only when the whole title and the pill's whole label fit there; otherwise it takes a line
  // of its own under the subtitle (.below), the title whole on its row (cut only when it does not fit alone). When the
  // lines do not fit in the banner above the floor, or the label does not fit its line, the pill shows its dot alone
  // (.dot-only): beside the title when the whole title leaves it room, else under the subtitle.
  _fitPill() {
    for (const t of this._root?.querySelectorAll?.('.titles') || []) {
      const row = t.querySelector('.title-row');
      const pill = row?.querySelector(':scope > .pill');
      if (!pill?.getBoundingClientRect) continue;
      t.classList.remove('below', 'dot-only');
      const name = row.querySelector('.title');
      const tag = name.querySelector('.school-tag');
      const tagW = tag ? tag.getBoundingClientRect().width + (parseFloat(getComputedStyle(tag).marginLeft) || 0) : 0;
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const room = row.getBoundingClientRect().width;
      const title = Math.max(name.scrollWidth, flTextWidth(name) + tagW) + gap;
      if (title + pill.getBoundingClientRect().width <= room) continue;
      t.classList.add('below');
      const line = t.querySelector('.pill-line > .pill');
      const banner = t.closest('.banner');
      const floor = banner ? banner.querySelector('.ground').getBoundingClientRect().top : Infinity;
      const box = t.getBoundingClientRect();
      const tx = line?.querySelector('.pt');
      const whole = !tx || (tx.scrollWidth <= tx.clientWidth + 0.5 && line.getBoundingClientRect().right <= box.right + 0.5);
      if (whole && box.bottom <= floor + 0.5 && (!banner || box.top >= banner.getBoundingClientRect().top - 0.5)) continue;
      t.classList.add('dot-only');
      if (title + (line || pill).getBoundingClientRect().width <= room) t.classList.remove('below');
    }
  }

  _compact() {
    return false;
  }

  _tick() {
    if (!this._root) return;
    var t = this._t();
    var now = Date.now();
    this._root.querySelectorAll('[data-ago]').forEach((el) => {
      el.textContent = flAgo(el.getAttribute('data-ago'), t, now);
    });
  }

  // ── Header ────────────────────────────────────────────────────────────────

  _status(_a, device, state) {
    if (device) return device.status;
    return state?.state in FL_STATUS ? state.state : 'not_tracked';
  }

  // The status line on the banner's sky: what the shown device is at (time left, lock, bedtime…)
  _statusLine(a, device, t, status) {
    var devices = a.devices || [];
    if (!device) return devices.length > 1 ? `${flDuration(a.total_minutes, t)} ${t.used_today} · ${flTr(t, 'devices', { n: devices.length })}` : t[`status_${status}`] || status;
    var line;
    if (device.restricted) line = this._restrictedShort(device, t);
    else if (status === 'not_tracked') line = t.status_not_tracked;
    else if (device.remaining !== null && device.remaining !== undefined) line = `${flDuration(device.remaining, t)} ${t.left}`;
    else line = `${flDuration(device.used, t)} ${t.used_today}`;
    return devices.length > 1 ? `${device.name} · ${line}` : line;
  }

  // The banner's picture state for a device (or the worst one when all devices are shown)
  _sceneState(a, device, status) {
    var d = device || (a.devices || []).slice().sort((x, y) => (FL_SEVERITY[y.status] || 0) - (FL_SEVERITY[x.status] || 0))[0];
    var ratio = null;
    if (d && d.remaining !== null && d.remaining !== undefined) {
      var cap = d.limit ? d.limit + (d.bonus || 0) : (d.used || 0) + d.remaining;
      ratio = cap > 0 ? d.remaining / cap : 0;
    }
    return { kind: this._kind(d), status: status, restricted: d ? d.restricted : null, ratio: ratio };
  }

  // The status pill: a dot and the status, in the round icon's colour.
  _pill(status, t) {
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var label = flEsc(t[`status_${status}`] || status);
    return `<span class="pill" style="--c:${s.color};--tint:${s.tint}" title="${label}" aria-label="${label}"><span class="dot"></span><span class="pt">${label}</span></span>`;
  }

  // The title, then the status pill right after it; `sub` under them (left out when it only repeats the status). Where
  // the pill goes is measured (_fitPill): beside the whole title, else on a line of its own under the subtitle (the
  // copy in .pill-line), else its dot alone (its text stays in its title and aria-label).
  _titles(a, t, status, title, sub, subStyle) {
    var pill = this._pill(status, t);
    var label = t[`status_${status}`] || status;
    var text = String(sub || '')
      .split(' · ')
      .filter((part) => part && part !== label)
      .join(' · ');
    var line = text ? `<div class="sub" title="${flEsc(text)}"${subStyle ? ` style="${subStyle}"` : ''}>${flEsc(text)}</div>` : '';
    return `<div class="titles"><div class="title-row"><div class="title">${flEsc(title)}${flSchoolTag(a, t)}</div>${pill}</div>${line}<div class="pill-line">${pill}</div></div>`;
  }

  // The illustrated header: the round status icon, the title and `sub` on the left, the picture on the right
  _banner(a, device, t, state, title, sub, extra) {
    var status = this._status(a, device, state);
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var label = t[`status_${status}`] || status;
    var night = flIsNight(this._hass, this._config);
    return `<div class="banner${night ? ' night' : ''}">
      ${flSceneSvg(this._uid, this._sceneState(a, device, status))}<div class="ground" aria-hidden="true"></div>
      <div class="htext"><div class="badge" style="--c:${s.color}" title="${flEsc(label)}" role="img" aria-label="${flEsc(label)}">${flIcon('kite')}</div>
      ${this._titles(a, t, status, title, sub)}</div>
      ${extra || ''}
    </div>`;
  }

  _header(a, device, t, state, extra) {
    var status = this._status(a, device, state);
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var devices = a.devices || [];
    if (this._config.illustration !== false) {
      var name = this._config.title || a.child_name || t.none;
      var line = state && state.state !== 'unavailable' && a.family_link ? this._statusLine(a, device, t, status) : t[`status_${status}`] || status;
      return this._banner(a, device, t, state, name, line, extra);
    }
    var sub = devices.length === 1 ? t.device_one : flTr(t, 'devices', { n: devices.length });
    if (device && devices.length > 1) sub = `${device.name} · ${sub}`;
    else if (device) sub = device.name;
    var title = this._config.title || a.child_name || t.none;
    return `<div class="header">
      <div class="badge" style="--c:${s.color};--tint:${s.tint}">${flIcon('kite')}</div>
      ${this._titles(a, t, status, title, sub)}
      ${extra || ''}
    </div>`;
  }

  _chips(a, device, t) {
    var devices = a.devices || [];
    if (devices.length < 2) return '';
    var all = !device;
    var chips = devices
      .map((d) => {
        var s = FL_STATUS[d.status] || FL_STATUS.not_tracked;
        var sel = device && device.id === d.id;
        var sub = d.restricted ? this._restrictedShort(d, t) : d.remaining !== null && d.remaining !== undefined ? `${flDuration(d.used, t)} · ${flDuration(d.remaining, t)} ${t.left}` : flDuration(d.used, t);
        return `<button class="chip ${sel ? 'sel' : ''}" data-action="select" data-device="${flEsc(d.id)}" aria-pressed="${sel}">
          <span class="chip-ic" style="--c:${s.color}">${flIcon(this._kind(d) === 'tablet' ? 'tablet' : 'phone')}<i></i></span>
          <span class="chip-txt"><b>${flEsc(d.name)}</b><small style="${d.restricted ? `color:${s.color}` : ''}">${flEsc(sub)}</small></span>
        </button>`;
      })
      .join('');
    var total = devices.reduce((sum, d) => sum + (d.used || 0), 0);
    return `<div class="chips" role="group">${chips}<button class="chip all ${all ? 'sel' : ''}" data-action="select" data-device="all" aria-pressed="${all}"><span class="chip-txt"><b>${flEsc(t.all)}</b><small>${flEsc(flDuration(a.total_minutes ?? total, t))}</small></span></button></div>`;
  }

  _restrictedShort(d, t) {
    if (d.restricted === 'bedtime') return t.bedtime;
    if (d.restricted === 'schooltime') return t.schooltime;
    if (d.restricted === 'limit') return t.locked_limit;
    return t.status_locked;
  }

  _restrictedText(d, t) {
    if (!d) return '';
    if (d.restricted === 'bedtime') return flTr(t, 'locked_bedtime', { t: flClock(d.bedtime?.end, this._hass) });
    if (d.restricted === 'schooltime') return flTr(t, 'locked_school', { t: flClock(d.schooltime?.end, this._hass) });
    if (d.restricted === 'limit') return t.locked_limit;
    return t.locked_parent;
  }

  // ── Full card ─────────────────────────────────────────────────────────────

  _renderFull(a, t, state) {
    var device = this._device(a);
    var c = this._config;
    var html = this._header(a, device, t, state, this._detailButton ? this._detailButton(t) : '');
    if (a.stale) html += `<div class="note">${flIcon('offline')}<span>${flEsc(t.stale)}</span></div>`;
    html += this._chips(a, device, t);
    if (c.show_scene) html += this._scene(a, device, t);
    html += this._tiles(a, device, t);
    if (c.show_top_apps) html += this._topApps(device ? device.top_apps : a.top_apps, t);
    if (c.show_actions && device) html += this._actions(a, device, t);
    return html;
  }

  _scene(a, device, t) {
    var kind = this._kind(device || (a.devices || [])[0]);
    var restricted = device ? device.restricted : null;
    var status = this._status(a, device, this._state());
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var used = device ? device.used : a.total_minutes;
    var remaining = device ? device.remaining : null;
    var limit = device ? (device.bonus ? null : device.limit) : null;
    var week = (a.week || []).slice(-6);
    var maxWeek = Math.max(1, ...week.map((w) => w.minutes || 0));
    var bars = week
      .map((w, i) => `<i class="bar ${i === week.length - 1 ? 'today' : ''}" style="height:${Math.max(6, Math.round(((w.minutes || 0) / maxWeek) * 100))}%;animation-delay:${i * 0.08}s"></i>`)
      .join('');
    var apps = (device ? device.top_apps : a.top_apps) || [];
    var tiles = [];
    for (var i = 0; i < 6; i++) {
      var app = apps[i];
      if (!app) {
        tiles.push('<span class="app empty-app"></span>');
      } else if (app.blocked) {
        tiles.push(`<span class="app blocked-app" title="${flEsc(app.title)}">${flIcon('block')}</span>`);
      } else {
        var inner = app.icon ? `<img src="${flEsc(app.icon)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : flEsc(String(app.title || '?').charAt(0));
        tiles.push(`<span class="app" style="--app:${FL_APP_COLORS[i % FL_APP_COLORS.length]};animation-delay:${i * 0.3}s" title="${flEsc(app.title)}">${inner}</span>`);
      }
    }
    var big = remaining !== null && remaining !== undefined ? flDuration(remaining, t) : flDuration(used, t);
    var small = remaining !== null && remaining !== undefined ? (limit ? flTr(t, 'left_of', { limit: flDuration(limit, t) }) : t.left) : t.used_today;
    var screen = `<div class="screen-top"></div>
      <div class="screen-label">${flEsc(t.screen_time)}</div>
      <div class="week">${bars}</div>
      <div class="screen-big">${flEsc(big)}</div><div class="screen-small">${flEsc(small)}</div>
      <div class="apps">${tiles.join('')}</div>
      <div class="scan"></div>`;
    var lockLayer = restricted
      ? `<div class="dim"></div><div class="lockmsg"><div class="lockring">${flIcon(restricted === 'bedtime' ? 'moon' : restricted === 'schooltime' ? 'school' : 'lock')}</div><b>${flEsc(t.break_title)}</b><small>${flEsc(this._restrictedText(device, t))}</small><small class="hint">${flEsc(t.break_hint)}</small></div>`
      : '';
    var protectedNow = status === 'tracked' || status === 'attention';
    var loc = a.location;
    var mapTile = this._config.show_location
      ? `<button class="maptile ${loc?.fresh ? 'fresh' : 'old'}" data-action="location" aria-label="${flEsc(t.location)}"><span class="grid"></span>${loc ? '<span class="ping"></span><span class="dot"></span>' : flIcon('pin', 'nopin')}</button>`
      : '';
    return `<div class="scene ${kind}" style="--c:${s.color};--tint:${s.tint}">
      ${protectedNow ? '<span class="wave"></span><span class="wave w2"></span>' : ''}
      <div class="device ${kind} ${restricted ? 'locked' : ''}">${screen}${lockLayer}</div>
      <span class="shield ${protectedNow ? '' : 'off'}">${flIcon(restricted ? 'lock' : protectedNow ? 'shield' : 'offline')}</span>
      ${mapTile}
    </div>`;
  }

  _nextWindow(device, t) {
    if (!device) return null;
    var now = Date.now();
    var items = [];
    [['bedtime', 'moon'], ['schooltime', 'school']].forEach(([key, icon]) => {
      var w = device[key];
      if (!w) return;
      var start = Date.parse(w.start);
      var end = Date.parse(w.end);
      if (w.active) items.push({ label: t[key], value: flTr(t, 'until', { t: flClock(w.end, this._hass) }), icon: icon, at: end });
      else if (start > now) items.push({ label: t[key], value: flTr(t, 'in', { d: flDuration((start - now) / 60000, t) }), icon: icon, at: start });
    });
    items.sort((x, y) => x.at - y.at);
    return items[0] || null;
  }

  _tiles(a, device, t) {
    var loc = a.location;
    var place = loc ? loc.place || loc.address || t.unknown_place : t.not_located;
    var next = this._nextWindow(device, t);
    var tiles = [];
    if (this._config.show_location) {
      tiles.push(`<button class="tile clickable" data-action="location"><small>${flEsc(t.location)}</small><b>${flEsc(place)}</b>${loc?.time ? `<em data-ago="${flEsc(loc.time)}">${flEsc(flAgo(loc.time, t, Date.now()))}</em>` : ''}</button>`);
    }
    tiles.push(`<div class="tile"><small>${flEsc(t.blocked_apps)}</small><b>${flEsc(a.blocked_apps ?? 0)}</b></div>`);
    if (next) tiles.push(`<div class="tile"><small>${flEsc(next.label)}</small><b>${flEsc(next.value)}</b></div>`);
    else if (loc?.battery !== null && loc?.battery !== undefined) tiles.push(`<div class="tile"><small>${flEsc(t.battery)}</small><b>${flEsc(loc.battery)} %</b></div>`);
    return `<div class="tiles">${tiles.join('')}</div>`;
  }

  _topApps(apps, t) {
    apps = (apps || []).slice(0, 4);
    if (!apps.length) return `<div class="section"><div class="label">${flEsc(t.top_apps)}</div><div class="muted">${flEsc(t.no_usage)}</div></div>`;
    var max = Math.max(1, ...apps.map((x) => x.minutes || 0));
    var rows = apps
      .map((app, i) => {
        var color = FL_APP_COLORS[i % FL_APP_COLORS.length];
        var icon = app.icon ? `<img src="${flEsc(app.icon)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : flEsc(String(app.title || '?').charAt(0));
        var tag = app.blocked
          ? `<span class="tag red">${flEsc(t.blocked)}</span>`
          : app.always_allowed
            ? `<span class="tag green">${flEsc(t.always_allowed)}</span>`
            : app.limit
              ? `<span class="tag amber">${flEsc(flTr(t, 'app_limit', { n: flDuration(app.limit, t) }))}</span>`
              : '';
        return `<div class="app-row"><span class="app-ic" style="--app:${color}">${icon}</span>
          <div class="app-main"><div class="app-line"><span>${flEsc(app.title)}</span><span class="muted">${flEsc(flDuration(app.minutes, t))}</span></div>
          <div class="track"><i class="fill" style="width:${Math.round(((app.minutes || 0) / max) * 100)}%;background:${color};animation-delay:${0.15 + i * 0.15}s"></i></div></div>${tag}</div>`;
      })
      .join('');
    return `<div class="section"><div class="label">${flEsc(t.top_apps)}</div>${rows}</div>`;
  }

  _actions(a, device, t) {
    var presets = Array.isArray(this._config.bonus_presets) ? this._config.bonus_presets : FL_DEFAULTS.bonus_presets;
    var html = '';
    if (device.bonus_id && device.bonus) {
      var left = device.bonus_remaining ?? device.bonus;
      var ratio = Math.max(0, Math.min(1, left / Math.max(1, device.bonus)));
      var until = new Date(Date.now() + left * 60000).toISOString();
      html += `<div class="bonus"><span class="shine"></span>
        <span class="bonus-ring"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" class="ring-bg"/><circle cx="16" cy="16" r="14" class="ring-fg" style="stroke-dashoffset:${(88 * (1 - ratio)).toFixed(1)}"/></svg>${flIcon('gift')}</span>
        <div class="bonus-txt"><b>${flEsc(flTr(t, 'bonus_running', { n: device.bonus }))}</b><small>${flEsc(flTr(t, 'bonus_left', { n: left }))} · ${flEsc(flTr(t, 'bonus_until', { t: flClock(until, this._hass) }))}</small></div>
        <button class="btn red" data-action="revoke" ${this._busy.revoke ? 'disabled' : ''}>${flEsc(t.revoke)}</button></div>`;
    }
    html += this._schoolRow(a, t);
    html += `<div class="addrow"><span class="label inline">${flEsc(t.add)}</span>
      ${presets.map((m) => `<button class="pchip" data-action="bonus" data-minutes="${Number(m)}" aria-label="${flEsc(flTr(t, 'add_minutes', { n: m }))}" ${this._busy.bonus ? 'disabled' : ''}>+${Number(m)}</button>`).join('')}
      <span class="stepper"><button data-action="step" data-step="-15" aria-label="${flEsc(t.less)}">−</button><button class="stepval" data-action="bonus" data-minutes="custom" aria-label="${flEsc(flTr(t, 'add_minutes', { n: this._custom }))}">${this._custom}'</button><button data-action="step" data-step="15" aria-label="${flEsc(t.more)}">+</button></span></div>`;
    var locked = device.locked;
    var ringing = this._ringing[device.id] && this._ringing[device.id] > Date.now();
    html += `<div class="grid2">
      <button class="act" data-action="${locked ? 'unlock' : 'lock'}" ${this._busy.lock ? 'disabled' : ''}><span class="${locked ? 'green' : 'red'}">${flIcon(locked ? 'unlock' : 'lock')}</span>${flEsc(locked ? t.unlock : t.lock)}</button>
      <button class="act ${ringing ? 'ringing' : ''}" data-action="ring" ${device.can_ring === false ? 'disabled' : ''}><span class="blue bellwrap">${ringing ? '<i class="bellwave"></i>' : ''}${flIcon('bell', ringing ? 'swing' : '')}</span>${flEsc(ringing ? t.ringing : t.ring)}</button>
      <button class="act" data-action="location"><span class="blue">${flIcon('pin')}</span>${flEsc(t.locate)}</button>
      <button class="act sos" data-action="emergency"><span class="red">${flIcon('alert')}</span>${flEsc(t.emergency)}</button>
    </div>`;
    if ((a.devices || []).length > 1) html += `<div class="foot">${flEsc(flTr(t, 'actions_for', { device: device.name }))}</div>`;
    return `<div class="section actions">${html}</div>`;
  }

  // School mode of the child: every app blocked but the essential ones, by hand or by the Pronote timetable
  _schoolRow(a, t) {
    var sm = a.school_mode;
    if (!sm) return '';
    var on = !!sm.active;
    var sub = on
      ? [
          sm.source === 'pronote' ? 'Pronote' : null,
          sm.until ? flTr(t, 'until', { t: flClock(sm.until, this._hass) }) : null,
          sm.blocked ? flTr(t, 'school_blocked', { n: sm.blocked }) : null,
        ]
          .filter(Boolean)
          .join(' · ')
      : sm.pronote
        ? 'Pronote'
        : '';
    return `<div class="school ${on ? 'on' : ''}"><span class="school-ic">${flIcon('school', on ? 'bob' : '')}</span>
      <div class="school-txt"><b>${flEsc(t.school_mode)}</b>${sub ? `<small>${flEsc(sub)}</small>` : ''}</div>
      <button class="switch ${on ? 'on' : ''}" role="switch" aria-checked="${on}" aria-label="${flEsc(t.school_mode)}" data-action="school" ${this._busy.school ? 'disabled' : ''}><i></i></button></div>`;
  }

  // ── Events ────────────────────────────────────────────────────────────────

  _onInput(ev) {
    if (ev.target?.id === 'sos-msg' && this._popup?.type === 'emergency') this._popup.message = ev.target.value;
  }

  _onClick(ev) {
    var el = ev.target.closest?.('[data-action]');
    if (!el || el.disabled) return;
    var action = el.getAttribute('data-action');
    var a = this._attrs();
    var device = this._device(a);
    ev.stopPropagation();
    switch (action) {
      case 'detail':
        this._toggleDetail?.(ev);
        break;
      case 'select':
        this._selected = el.getAttribute('data-device');
        this._render();
        break;
      case 'step':
        this._custom = Math.max(5, Math.min(240, this._custom + Number(el.getAttribute('data-step'))));
        this._render();
        break;
      case 'bonus': {
        var raw = el.getAttribute('data-minutes');
        var minutes = raw === 'custom' ? this._custom : Number(raw);
        if (device && minutes > 0) this._call('add_bonus', { child: a.child_id, device: device.id, minutes: minutes }, 'bonus');
        break;
      }
      case 'revoke':
        if (device) this._openPopup({ type: 'confirm', action: 'revoke', device: device.id, bonus: device.bonus });
        break;
      case 'lock':
      case 'unlock':
        if (device) this._call(action, { child: a.child_id, device: device.id }, 'lock');
        break;
      case 'ring':
        if (device) {
          this._ringing[device.id] = Date.now() + 20000;
          clearTimeout(this._ringTimer);
          this._ringTimer = setTimeout(() => this._render(), 20500);
          this._call('ring', { child: a.child_id, device: device.id }, 'ring');
        }
        break;
      case 'location':
        this._openPopup({ type: 'location', hours: Number(this._config.trace_hours) || 24 });
        break;
      case 'school':
        this._call('school_mode', { child: a.child_id, enable: !a.school_mode?.active }, 'school');
        break;
      case 'emergency':
        this._openPopup({ type: 'emergency', device: device?.id, message: '', ring: true, notify: !!a.notify_service, locate: false });
        break;
      case 'close':
        this._closePopup();
        break;
      case 'confirm-yes':
        if (this._popup?.action === 'revoke') this._call('revoke_bonus', { child: a.child_id, device: this._popup.device }, 'revoke');
        this._closePopup();
        break;
      case 'period':
        if (this._popup) {
          this._popup.hours = Number(el.getAttribute('data-hours'));
          this._popup.trace = null;
          this._popup.cursor = null;
          this._renderPopup();
        }
        break;
      case 'refresh-location':
        this._popup && (this._popup.refreshing = true);
        this._renderPopup();
        this._call('refresh_location', { child: a.child_id }, 'location').finally(() => {
          if (this._popup) {
            this._popup.refreshing = false;
            this._popup.trace = null;
            this._renderPopup();
          }
        });
        break;
      case 'history':
        this._moreInfo(a.tracker);
        break;
      case 'quick':
        if (this._popup) {
          this._popup.message = el.getAttribute('data-text');
          this._renderPopup();
        }
        break;
      case 'toggle':
        if (this._popup) {
          var key = el.getAttribute('data-key');
          this._popup[key] = !this._popup[key];
          this._renderPopup();
        }
        break;
      case 'send-emergency':
        this._sendEmergency(a);
        break;
      default:
        break;
    }
  }

  async _call(service, data, busyKey) {
    var t = this._t();
    this._busy[busyKey] = true;
    this._render();
    try {
      await this._hass.callService('family_link', service, data);
      this._showToast(t.done);
    } catch (err) {
      this._showToast(flTr(t, 'failed', { error: err?.message || err }), true);
    } finally {
      this._busy[busyKey] = false;
      this._render();
    }
  }

  async _sendEmergency(a) {
    var p = this._popup;
    var t = this._t();
    if (!p || p.sending) return;
    p.sending = true;
    this._renderPopup();
    var data = { child: a.child_id, message: p.message || '', ring: !!p.ring, refresh_location: !!p.locate };
    if (p.device) data.device = p.device;
    if (!p.notify) data.message = '';
    try {
      await this._hass.callService('family_link', 'emergency', data);
      this._closePopup();
      this._showToast(t.emergency_sent);
    } catch (err) {
      p.sending = false;
      this._renderPopup();
      this._showToast(flTr(t, 'failed', { error: err?.message || err }), true);
    }
  }

  _showToast(text, error) {
    var el = this._root?.querySelector('.toast');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('error', !!error);
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: entityId }, bubbles: true, composed: true }));
  }

  // ── Popups (top of the card) ──────────────────────────────────────────────

  _openPopup(popup) {
    this._popup = popup;
    this._renderPopup();
  }

  _closePopup(silent) {
    this._popup = null;
    this._map = null;
    var layer = this._root?.querySelector('.layer');
    if (layer) layer.innerHTML = '';
    this._root?.querySelector('ha-card')?.classList.remove('has-popup');
    void silent;
  }

  _renderPopup() {
    var layer = this._root?.querySelector('.layer');
    if (!layer || !this._popup) return;
    var t = this._t();
    var a = this._attrs();
    var p = this._popup;
    this._root.querySelector('ha-card').classList.add('has-popup');
    if (p.type === 'confirm') {
      var dev = (a.devices || []).find((d) => d.id === p.device);
      layer.innerHTML = `<div class="popup" role="dialog"><div class="pop-head"><span class="pop-ic red">${flIcon('gift')}</span><b>${flEsc(flTr(t, 'revoke_confirm', { n: p.bonus, device: dev?.name || '' }))}</b></div>
        <div class="pop-btns"><button class="btn" data-action="close">${flEsc(t.cancel)}</button><button class="btn red" data-action="confirm-yes">${flEsc(t.revoke)}</button></div></div>`;
      return;
    }
    if (p.type === 'emergency') {
      layer.innerHTML = this._emergencyPopup(a, t, p);
      var area = layer.querySelector('#sos-msg');
      if (area && document.activeElement !== this && !p.focused) {
        p.focused = true;
        setTimeout(() => area.focus({ preventScroll: true }), 50);
      }
      return;
    }
    if (p.type === 'location') this._locationPopup(layer, a, t, p);
  }

  _emergencyPopup(a, t, p) {
    var devices = a.devices || [];
    var dev = devices.find((d) => d.id === p.device);
    var loc = a.location;
    // No device picked: every device of the child rings
    var targets = dev ? dev.name : devices.map((d) => d.name).join(', ');
    var sub = [targets, loc?.place, loc?.battery !== null && loc?.battery !== undefined ? `${loc.battery} %` : null].filter(Boolean).join(' · ');
    var check = (key, label, hint) =>
      `<button class="opt" data-action="toggle" data-key="${key}" role="checkbox" aria-checked="${!!p[key]}"><span class="box ${p[key] ? 'on' : ''}"></span><span><b>${flEsc(label)}</b><small>${flEsc(hint)}</small></span></button>`;
    return `<div class="popup sos-pop" role="dialog" aria-label="${flEsc(t.emergency)}">
      <div class="pop-head"><span class="pop-ic red pulse">${flIcon('alert')}</span><div class="pop-titles"><b>${flEsc(flTr(t, 'emergency_title', { name: a.child_name || '' }))}</b><small>${flEsc(sub)}</small></div><button class="icon-btn" data-action="close" aria-label="${flEsc(t.close)}">${flIcon('close')}</button></div>
      ${
        a.notify_service
          ? `<label class="lbl" for="sos-msg">${flEsc(t.message)}</label><textarea id="sos-msg" rows="3">${flEsc(p.message || '')}</textarea>
      <div class="quick">${[t.quick_call, t.quick_home, t.quick_where].map((q) => `<button class="qchip" data-action="quick" data-text="${flEsc(q)}">${flEsc(q)}</button>`).join('')}</div>`
          : ''
      }
      <div class="opts">${devices.length ? check('ring', t.opt_ring, t.opt_ring_hint) : ''}${a.notify_service ? check('notify', t.opt_notify, flTr(t, 'opt_notify_hint', { service: a.notify_service })) : ''}${check('locate', t.opt_locate, t.opt_locate_hint)}</div>
      <button class="btn red big" data-action="send-emergency" ${p.sending ? 'disabled' : ''}>${flEsc(t.send_emergency)}</button>
    </div>`;
  }

  _locationPopup(layer, a, t, p) {
    var loc = a.location;
    var title = `${a.child_name || ''} · ${loc ? loc.place || loc.address || t.unknown_place : t.not_located}`;
    var sub = loc
      ? [loc.time ? flAgo(loc.time, t, Date.now()) : null, loc.device, loc.battery !== null && loc.battery !== undefined ? `${loc.battery} %` : null, loc.accuracy ? flTr(t, 'accuracy', { n: loc.accuracy }) : null].filter(Boolean).join(' · ')
      : '';
    var trace = p.trace;
    var stats = trace ? `${flTr(t, 'km', { n: flKm(trace.map((x) => x.point)).toFixed(1) })} · ${flTr(t, 'points', { n: trace.length })}` : t.loading;
    var periods = [
      [this._todayHours(), t.today],
      [24, t.h24],
      [168, t.d7],
    ];
    var shell = layer.querySelector('.loc-pop');
    if (!shell) {
      layer.innerHTML = `<div class="popup loc-pop" role="dialog" aria-label="${flEsc(t.location)}">
        <div class="pop-head"><span class="pop-ic blue">${flIcon('pin')}</span><div class="pop-titles"><b class="loc-title"></b><small class="loc-sub"></small></div><button class="icon-btn" data-action="close" aria-label="${flEsc(t.close)}">${flIcon('close')}</button></div>
        <div class="periods" role="group"></div>
        <div class="mapbox"><div class="map-msg"></div></div>
        <div class="replay"><span class="r-start"></span><input type="range" min="0" max="1000" value="1000" aria-label="time"><span class="r-end"></span></div>
        <div class="pop-btns"><button class="btn blue" data-action="refresh-location"></button><button class="btn" data-action="history"></button></div>
      </div>`;
      shell = layer.querySelector('.loc-pop');
      shell.querySelector('input[type=range]').addEventListener('input', (ev) => {
        if (!this._popup) return;
        this._popup.cursor = Number(ev.target.value) / 1000;
        this._updateTrace();
      });
    }
    shell.querySelector('.loc-title').textContent = title;
    shell.querySelector('.loc-sub').textContent = sub;
    shell.querySelector('.periods').innerHTML =
      periods.map(([hours, label]) => `<button class="pchip ${Math.round(p.hours) === Math.round(hours) || (label === t.today && p.today) ? 'sel' : ''}" data-action="period" data-hours="${hours}">${flEsc(label)}</button>`).join('') +
      `<span class="stats">${flEsc(stats)}</span>`;
    shell.querySelector('[data-action=refresh-location]').innerHTML = `${flIcon('refresh', p.refreshing ? 'spin' : '')}${flEsc(t.update_location)}`;
    shell.querySelector('[data-action=history]').innerHTML = `${flIcon('history')}${flEsc(t.open_history)}`;
    this._ensureMap(shell, a, t);
    if (!trace && !p.loading) this._loadTrace(a);
    else this._updateTrace();
  }

  _todayHours() {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(1, (now - midnight) / 3600000);
  }

  _ensureMap(shell, a, _t) {
    var box = shell.querySelector('.mapbox');
    if (this._map && box.contains(this._map)) return;
    var create = () => {
      if (this._popup?.type !== 'location') return;
      var map = document.createElement('ha-map');
      map.hass = this._hass;
      map.entities = a.tracker ? [{ entity_id: a.tracker, color: FL_STATUS.tracked.color }] : [];
      map.autoFit = true;
      map.fitZones = false;
      map.zoom = 14;
      map.darkMode = !!this._hass.themes?.darkMode;
      map.renderPassive = false;
      this._map = map;
      box.appendChild(map);
      this._updateTrace();
    };
    if (customElements.get('ha-map')) {
      create();
      return;
    }
    // The map element ships with the Map card: load it once through the card helpers
    window
      .loadCardHelpers?.()
      .then((helpers) => helpers.createCardElement({ type: 'map', entities: a.tracker ? [a.tracker] : [] }))
      .then(() => customElements.whenDefined('ha-map'))
      .then(create)
      .catch(() => {});
  }

  async _loadTrace(a) {
    var p = this._popup;
    if (!p || !a.tracker) {
      if (p) p.trace = [];
      return;
    }
    p.loading = true;
    var end = new Date();
    var start = new Date(end.getTime() - p.hours * 3600000);
    try {
      var result = await this._hass.callWS({
        type: 'history/history_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [a.tracker],
        minimal_response: false,
        no_attributes: false,
        significant_changes_only: false,
      });
      var rows = result?.[a.tracker] || [];
      var points = [];
      var last = null;
      rows.forEach((row) => {
        var attrs = row.a || row.attributes || {};
        var lat = Number(attrs.latitude);
        var lon = Number(attrs.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
        if (last && last[0] === lat && last[1] === lon) return;
        last = [lat, lon];
        var ts = row.lu !== undefined ? row.lu * 1000 : Date.parse(row.last_updated || row.last_changed);
        points.push({ point: [lat, lon], timestamp: new Date(ts) });
      });
      if (this._popup === p) p.trace = points;
    } catch (_err) {
      if (this._popup === p) p.trace = [];
    }
    p.loading = false;
    if (this._popup === p) this._renderPopup();
  }

  _updateTrace() {
    var p = this._popup;
    var shell = this._root?.querySelector('.loc-pop');
    if (!p || !shell) return;
    var trace = p.trace || [];
    var msg = shell.querySelector('.map-msg');
    var t = this._t();
    msg.textContent = p.trace === null || p.trace === undefined ? t.loading : trace.length ? '' : t.no_trace;
    msg.style.display = msg.textContent ? '' : 'none';
    var replay = shell.querySelector('.replay');
    replay.style.display = trace.length > 1 ? '' : 'none';
    var cut = trace;
    if (trace.length > 1) {
      var first = trace[0].timestamp.getTime();
      var lastTs = trace[trace.length - 1].timestamp.getTime();
      var at = first + (lastTs - first) * (p.cursor ?? 1);
      cut = trace.filter((x) => x.timestamp.getTime() <= at);
      shell.querySelector('.r-start').textContent = flClock(new Date(first).toISOString(), this._hass);
      shell.querySelector('.r-end').textContent = flClock(new Date(at).toISOString(), this._hass);
    }
    if (this._map) {
      this._map.paths = cut.length > 1 ? [{ points: cut, color: '#4285f4', gradualOpacity: 0.8, fullDatetime: p.hours > 24 }] : [];
    }
  }

  static _styles() {
    return `
      :host { display: block; }
      ha-card { container: fl-card / inline-size; position: relative; padding: 16px; overflow: hidden; display: flex; flex-direction: column; gap: 14px; color: var(--primary-text-color); }
      .main { display: flex; flex-direction: column; gap: 14px; }
      .ic { width: 20px; height: 20px; flex: none; }
      .header { display: flex; align-items: center; gap: 12px; }
      .badge { width: 40px; height: 40px; border-radius: 50%; background: var(--tint); color: var(--c); display: flex; align-items: center; justify-content: center; flex: none; transition: background .4s, color .4s; }
      .badge .ic { width: 24px; height: 24px; }
      .titles { flex: 1; min-width: 0; }
      /* The title line: the title, then the status pill when the whole title and the pill's whole label fit there
         (measured, see _fitPill). Otherwise the pill takes a line of its own under the subtitle (its copy in
         .pill-line), the subtitle on one line; when that does not fit in the banner above the floor, or on a card of
         200 px or less, only its dot stays (its text in its title and aria-label). */
      .title-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
      .title-row > .title { flex: 0 1 auto; min-width: 0; }
      .title-row > .pill { flex: none; }
      .pill-line { display: none; }
      .titles.below .title-row > .pill { display: none; }
      .titles.below .pill-line { display: flex; min-width: 0; margin-top: 3px; }
      .pill-line > .pill { max-width: 100%; }
      .titles.dot-only .pill { padding: 4px; } .titles.dot-only .pill .pt { display: none; }
      @container fl-card (max-width: 200px) { .pill { padding: 4px; } .pill .pt { display: none; } }
      .title { font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pill { display: inline-flex; align-items: center; gap: 4px; min-width: 0; box-sizing: border-box; overflow: hidden; padding: 1px 8px; border-radius: 12px;
              background: var(--tint); color: color-mix(in srgb, var(--c) 55%, var(--primary-text-color)); font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; }
      .pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; }
      .pill .pt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
      .banner .pill { background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
      .banner.night .pill { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
      /* Illustrated header: 90 px, edge to edge, the text on the wall at left, the picture at right, a 10 px parquet strip */
      .banner { position: relative; height: 90px; margin: -16px -16px 0; overflow: hidden; flex: none; container-type: inline-size; background: #fdf3e7; color: #0d2a45; --muted: #3b5b78; }
      .banner.night { background: #2a2a36; color: #fff; --muted: rgba(255,255,255,.78); }
      .banner .fl-scene { position: absolute; right: 0; bottom: 10px; height: 80px; width: min(200px, 66%); }
      .banner .ground { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: repeating-linear-gradient(90deg, #c99a6b 0 38px, #b98a5c 38px 40px); box-shadow: inset 0 2px 0 #a97c50; }
      .banner.night .ground { background: repeating-linear-gradient(90deg, #4a3a2c 0 38px, #3e3024 38px 40px); box-shadow: inset 0 2px 0 #5c4836; }
      .banner .htext { position: absolute; left: 0; top: 0; bottom: 10px; right: calc(min(200px, 66%) * .5 + 4px); display: flex; align-items: center; gap: 10px; padding: 0 8px 0 14px; min-width: 0; }
      .banner .badge { position: relative; background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 30%, transparent); }
      .banner.night .badge { background: rgba(255,255,255,.12); }
      .banner .title { font-size: 16px; }
      .banner .sub { font-size: 13px; color: var(--muted); }
      .banner .zoom { color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
      .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
      .banner .zoom:hover { background: rgba(255,255,255,.75); }
      .banner.night .zoom:hover { background: rgba(255,255,255,.22); }
      .banner .school-tag { color: inherit; }
      @container (max-width: 260px) { .fl-scene { display: none; } .htext { right: 36px !important; } }
      .fl-shelf { fill: #e5484d; opacity: .7; }
      .night .fl-shelf { fill: #3c4558; opacity: 1; }
      .fl-box rect { fill: #2f80ed; }
      .fl-box .fl-box-lid { fill: #fff; opacity: .6; }
      .night .fl-box rect { fill: #3a6fc4; }
      .night .fl-box .fl-box-lid { opacity: .35; }
      .fl-dev { fill: #22262b; }
      .night .fl-dev { fill: #15171c; stroke: #4a5266; stroke-width: .6; }
      .fl-notch { fill: #3a3f47; }
      .fl-screen { fill: #86b9de; }
      .night .fl-screen { fill: #3d5a8a; }
      .fl-screen.off { fill: #1a1d22; }
      .fl-screen.dead { fill: #4a4f57; }
      .fl-device.dim { opacity: .8; }
      .fl-tile { opacity: .95; animation: fl-bob 2.2s ease-in-out infinite; }
      .fl-track { fill: rgba(255,255,255,.45); }
      .fl-bar { fill: #fff; }
      .fl-scan { fill: rgba(255,255,255,.22); animation: fl-sscan 3.2s linear infinite; }
      .fl-lock { fill: #f5b400; }
      .fl-shackle { fill: none; stroke: #f5b400; stroke-width: 1.2; animation: fl-shackle 2.6s ease-in-out infinite; }
      .fl-moon { fill: #c9d4ff; animation: fl-glow 3s ease-in-out infinite; }
      .fl-cap path { fill: #f5b400; stroke: #f5b400; }
      .fl-offline { fill: none; stroke: #9aa0a6; stroke-width: 1.2; }
      .fl-glass { fill: none; stroke: #5f6b7a; stroke-width: 1.2; }
      .night .fl-glass { stroke: #9aa3ae; }
      .fl-sand { fill: #f5b400; }
      .fl-grain { stroke: #f5b400; stroke-width: .9; stroke-dasharray: 1.2 1.6; animation: fl-grain .6s linear infinite; }
      .mini-actions { display: flex; justify-content: flex-end; }
      ha-card:has(.main > .banner:only-child) { padding-bottom: 0; }
      .icon-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent; color: var(--secondary-text-color); display: flex; align-items: center; justify-content: center; cursor: pointer; flex: none; align-self: flex-start; }
      .icon-btn .ic { width: 18px; height: 18px; }
      /* The mini card's detail button: 24 px round, in the top right corner of the card (of the banner). */
      .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; width: 24px; height: 24px; padding: 0; border-radius: 50%; border: none; cursor: pointer;
              display: grid; place-items: center; color: var(--secondary-text-color); background: transparent; box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); }
      .zoom .ic { width: 16px; height: 16px; }
      .header:has(> .zoom), .compact-row:has(> .zoom) { padding-right: 14px; }
      .empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; text-align: center; color: var(--secondary-text-color); font-size: 13px; }
      .empty .ic { width: 32px; height: 32px; }
      .note { display: flex; gap: 8px; align-items: center; padding: 8px 10px; border-radius: 10px; background: rgba(249,171,0,.12); color: var(--warning-color, #f9ab00); font-size: 12px; }
      .note .ic { width: 16px; height: 16px; }
      .muted { color: var(--secondary-text-color); font-size: 12px; }
      .label { font-size: 12px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .6px; }
      .label.inline { text-transform: none; letter-spacing: 0; margin-right: 2px; }
      button { font: inherit; color: inherit; }
      button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }

      /* Device chips */
      .chips { display: flex; gap: 6px; }
      .chip { flex: 1; min-width: 0; min-height: 44px; padding: 6px 10px; border-radius: 12px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.06); display: flex; align-items: center; gap: 8px; cursor: pointer; text-align: left; }
      .chip.all { flex: none; }
      .chip.sel { border-color: rgba(52,168,83,.6); background: rgba(52,168,83,.10); }
      .chip-ic { position: relative; display: flex; color: var(--secondary-text-color); }
      .chip.sel .chip-ic { color: var(--primary-text-color); }
      .chip-ic .ic { width: 16px; height: 16px; }
      .chip-ic i { position: absolute; right: -3px; bottom: -2px; width: 7px; height: 7px; border-radius: 50%; background: var(--c); box-shadow: 0 0 0 2px var(--card-background-color, #1c1f26); }
      .chip-txt { min-width: 0; display: flex; flex-direction: column; }
      .chip-txt b { font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .chip-txt small { font-size: 10px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      /* Scene */
      .scene { position: relative; height: 290px; display: flex; align-items: center; justify-content: center; }
      .scene.tablet { height: 230px; }
      .wave { position: absolute; width: 170px; height: 170px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; animation: fl-wave 2.4s ease-out infinite; }
      .wave.w2 { animation-delay: 1.2s; }
      .device { position: relative; background: #0b0d11; border: 3px solid #3c4049; box-shadow: 0 16px 40px rgba(0,0,0,.45); box-sizing: border-box; overflow: hidden; color: #e3e3e3; display: flex; flex-direction: column; gap: 6px; }
      .device.phone { width: 132px; height: 260px; border-radius: 24px; padding: 10px 8px; animation: fl-float 4s ease-in-out infinite; }
      .device.tablet { width: 300px; height: 196px; border-radius: 20px; padding: 12px 16px; animation: fl-float-t 4.4s ease-in-out infinite; display: grid; grid-template-columns: 1fr 1.2fr; grid-template-rows: auto auto 1fr auto; column-gap: 14px; }
      .screen-top { width: 36px; height: 5px; border-radius: 3px; background: #2a2e37; align-self: center; flex: none; }
      .tablet .screen-top { display: none; }
      .screen-label { font-size: 9px; color: #9aa0a6; text-align: center; }
      .week { display: flex; align-items: flex-end; justify-content: center; gap: 4px; height: 64px; flex: none; }
      .week .bar { width: 10px; border-radius: 3px; background: #3c4049; transform-origin: bottom; animation: fl-rise 1.4s cubic-bezier(.2,.8,.2,1) both; }
      .week .bar.today { background: var(--c); }
      .screen-big { font-size: 19px; font-weight: 700; text-align: center; line-height: 1.1; }
      .screen-small { font-size: 9px; color: #9aa0a6; text-align: center; margin-top: -4px; }
      .apps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; padding: 2px 6px; }
      .tablet .screen-label { grid-column: 1; grid-row: 1; text-align: left; }
      .tablet .week { grid-column: 1; grid-row: 2 / 4; height: auto; justify-content: flex-start; }
      .tablet .screen-big { grid-column: 2; grid-row: 1; text-align: left; }
      .tablet .screen-small { grid-column: 2; grid-row: 2; text-align: left; margin: 0; }
      .tablet .apps { grid-column: 2; grid-row: 3 / 5; align-content: end; }
      .app { height: 26px; border-radius: 8px; background: var(--app); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; overflow: hidden; animation: fl-bob 2.2s ease-in-out infinite; }
      .app img { width: 100%; height: 100%; object-fit: cover; }
      .empty-app { background: #2a2e37; animation: none; }
      .blocked-app { background: #2a2e37; color: #f28b82; animation: none; }
      .blocked-app .ic { width: 12px; height: 12px; }
      .scan { position: absolute; left: 0; right: 0; top: 0; height: 60px; background: linear-gradient(180deg, transparent, rgba(129,201,149,.10), transparent); animation: fl-scan 3.2s linear infinite; pointer-events: none; }
      .device.locked .scan { display: none; }
      .device.locked > :not(.dim):not(.lockmsg) { opacity: .12; filter: grayscale(1); }
      .dim { position: absolute; inset: 0; background: rgba(11,13,17,.9); animation: fl-dim 3s ease-in-out infinite; }
      .lockmsg { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; text-align: center; padding: 8px; animation: fl-drop .9s cubic-bezier(.2,.8,.2,1) both; }
      .lockring { width: 56px; height: 56px; border-radius: 50%; background: rgba(242,139,130,.16); border: 2px solid rgba(242,139,130,.5); color: #f28b82; display: flex; align-items: center; justify-content: center; }
      .lockring .ic { width: 28px; height: 28px; }
      .lockmsg b { font-size: 12px; }
      .lockmsg small { font-size: 10px; color: #c4c7cc; }
      .lockmsg .hint { color: #9aa0a6; font-size: 9px; }
      .phone .lockmsg .hint { display: none; }
      .shackle { animation: fl-shackle 2.6s ease-in-out infinite; }
      .shield { position: absolute; right: calc(50% - 110px); top: 22px; width: 44px; height: 44px; border-radius: 50%; background: var(--card-background-color, #1c1f26); border: 2px solid var(--c); color: var(--c); display: flex; align-items: center; justify-content: center; animation: fl-pulse 2.4s ease-in-out infinite; }
      .tablet .shield { right: calc(50% - 186px); top: 0; }
      .shield.off { animation: none; }
      .maptile { position: absolute; left: calc(50% - 128px); bottom: 26px; width: 58px; height: 58px; border-radius: 14px; background: var(--secondary-background-color, #232730); border: 1px solid var(--divider-color, rgba(127,127,127,.2)); overflow: hidden; cursor: pointer; padding: 0; }
      .tablet .maptile { left: calc(50% - 196px); bottom: 0; }
      .maptile .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(127,127,127,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(127,127,127,.12) 1px, transparent 1px); background-size: 12px 12px; }
      .maptile .dot { position: absolute; left: 25px; top: 25px; width: 8px; height: 8px; border-radius: 50%; background: #4285f4; box-shadow: 0 0 0 2px var(--secondary-background-color, #232730); }
      .maptile .ping { position: absolute; left: 22px; top: 22px; width: 14px; height: 14px; border-radius: 50%; background: rgba(66,133,244,.55); animation: fl-ping 2s ease-out infinite; }
      .maptile.old .dot { background: #9aa0a6; }
      .maptile.old .ping { display: none; }
      .maptile .nopin { position: absolute; left: 19px; top: 19px; color: var(--secondary-text-color); }

      /* Tiles, apps */
      .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); grid-auto-flow: column; gap: 8px; }
      .tile { background: var(--secondary-background-color, rgba(127,127,127,.08)); border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 2px; min-width: 0; border: none; text-align: left; }
      .tile.clickable { cursor: pointer; }
      .tile small { font-size: 11px; color: var(--secondary-text-color); }
      .tile b { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tile em { font-style: normal; font-size: 11px; color: var(--secondary-text-color); }
      .section { display: flex; flex-direction: column; gap: 8px; }
      .app-row { display: flex; align-items: center; gap: 8px; }
      .app-ic { width: 22px; height: 22px; flex: none; border-radius: 6px; background: var(--app); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; overflow: hidden; }
      .app-ic img { width: 100%; height: 100%; object-fit: cover; }
      .app-main { flex: 1; min-width: 0; }
      .app-line { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; }
      .app-line span:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .track { height: 5px; border-radius: 3px; background: rgba(127,127,127,.18); margin-top: 4px; overflow: hidden; }
      .fill { display: block; height: 5px; border-radius: 3px; transform-origin: left; animation: fl-grow 1.1s cubic-bezier(.2,.8,.2,1) both; }
      .tag { font-size: 10px; padding: 2px 6px; border-radius: 999px; white-space: nowrap; }
      .tag.amber { color: #f9ab00; background: rgba(249,171,0,.12); }
      .tag.green { color: #34a853; background: rgba(52,168,83,.12); }
      .tag.red { color: #ea4335; background: rgba(234,67,53,.12); }

      /* Actions */
      .school-tag { display: inline-flex; vertical-align: -3px; margin-left: 6px; color: #4285f4; }
      .school-tag .ic { width: 16px; height: 16px; }
      .school { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); transition: border-color .3s, background .3s; }
      .school.on { border-color: rgba(66,133,244,.5); background: rgba(66,133,244,.08); }
      .school-ic { width: 36px; height: 36px; flex: none; border-radius: 50%; display: grid; place-items: center; color: #4285f4; background: rgba(66,133,244,.12); }
      .school-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .school-txt small { color: var(--secondary-text-color); font-size: 12px; }
      .switch { position: relative; width: 42px; height: 24px; flex: none; border-radius: 12px; border: 1.5px solid var(--secondary-text-color); background: transparent; color: var(--secondary-text-color); cursor: pointer; padding: 0; transition: border-color .2s, color .2s; }
      .switch i { position: absolute; top: 3px; left: 3px; width: 15px; height: 15px; border-radius: 50%; background: currentColor; transition: transform .25s cubic-bezier(.3,1.4,.6,1); }
      .switch.on { color: #4285f4; border-color: #4285f4; }
      .switch.on i { transform: translateX(18px); }
      .ic.bob { animation: fl-bob 2.4s ease-in-out infinite; }
      @keyframes fl-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px) rotate(-4deg); } }
      .bonus { position: relative; overflow: hidden; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(52,168,83,.4); background: rgba(52,168,83,.08); }
      .shine { position: absolute; top: 0; bottom: 0; left: 0; width: 30%; background: linear-gradient(90deg, transparent, rgba(52,168,83,.12), transparent); animation: fl-shine 2.6s ease-in-out infinite; pointer-events: none; }
      .bonus-ring { position: relative; width: 36px; height: 36px; flex: none; color: #34a853; }
      .bonus-ring svg { width: 36px; height: 36px; transform: rotate(-90deg); }
      .bonus-ring .ring-bg { fill: none; stroke: rgba(127,127,127,.25); stroke-width: 3; }
      .bonus-ring .ring-fg { fill: none; stroke: #34a853; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 88; transition: stroke-dashoffset 1s; }
      .bonus-ring .ic { position: absolute; left: 10px; top: 10px; width: 16px; height: 16px; }
      .bonus-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .bonus-txt b { font-size: 13px; font-weight: 500; }
      .bonus-txt small { font-size: 12px; color: #34a853; }
      .btn { min-height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.08); cursor: pointer; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
      .btn.red { color: #ea4335; border-color: rgba(234,67,53,.4); background: rgba(234,67,53,.07); }
      .btn.blue { color: #4285f4; }
      .btn.big { min-height: 48px; font-size: 15px; font-weight: 700; width: 100%; }
      .btn:disabled, .act:disabled, .pchip:disabled { opacity: .5; cursor: default; }
      .addrow { display: flex; gap: 6px; align-items: center; }
      .pchip { flex: 1; min-height: 40px; border-radius: 999px; border: 1px solid rgba(52,168,83,.4); background: rgba(52,168,83,.08); color: #34a853; font-size: 13px; font-weight: 500; cursor: pointer; }
      .stepper { display: flex; align-items: center; border-radius: 999px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.05); }
      .stepper button { width: 32px; height: 40px; border: none; background: transparent; color: var(--secondary-text-color); font-size: 16px; cursor: pointer; }
      .stepper .stepval { width: auto; min-width: 40px; color: #34a853; font-size: 13px; font-weight: 500; }
      .grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .act { min-height: 56px; border-radius: 14px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.07); font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
      .act.ringing { border-color: rgba(66,133,244,.45); background: rgba(66,133,244,.09); }
      .act.sos { color: #ea4335; border-color: rgba(234,67,53,.55); background: rgba(234,67,53,.07); font-weight: 700; animation: fl-sos 2s ease-out infinite; }
      .red { color: #ea4335; } .green { color: #34a853; } .blue { color: #4285f4; }
      .bellwrap { position: relative; display: flex; }
      .bellwave { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid rgba(66,133,244,.5); animation: fl-wave-s 1.8s ease-out infinite; }
      .swing { transform-origin: 50% 10%; animation: fl-bell 1.8s ease-in-out infinite; }
      .foot { font-size: 11px; color: var(--secondary-text-color); text-align: center; }

      /* Popups: at the top of the card */
      .layer { position: absolute; left: 0; right: 0; top: 0; z-index: 5; pointer-events: none; }
      .popup { pointer-events: auto; margin: 10px; background: var(--card-background-color, #20242c); border: 1px solid var(--divider-color, rgba(127,127,127,.25)); border-radius: 16px; padding: 14px; box-shadow: 0 18px 50px rgba(0,0,0,.45); display: flex; flex-direction: column; gap: 12px; animation: fl-in .3s ease-out both; }
      .sos-pop { border-color: rgba(234,67,53,.4); }
      .pop-head { display: flex; align-items: center; gap: 10px; }
      .pop-head > b { flex: 1; font-size: 14px; font-weight: 500; }
      .pop-ic { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: none; }
      .pop-ic.red { background: rgba(234,67,53,.14); }
      .pop-ic.blue { background: rgba(66,133,244,.14); }
      .pop-ic.pulse { animation: fl-sos 2s ease-out infinite; }
      .pop-titles { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .pop-titles b { font-size: 15px; font-weight: 500; }
      .pop-titles small { font-size: 12px; color: var(--secondary-text-color); }
      .pop-btns { display: flex; gap: 8px; }
      .pop-btns .btn { flex: 1; min-height: 44px; }
      .lbl { font-size: 12px; color: var(--secondary-text-color); }
      textarea { resize: none; border-radius: 12px; border: 1px solid var(--divider-color, rgba(127,127,127,.3)); background: var(--secondary-background-color, rgba(127,127,127,.06)); color: var(--primary-text-color); padding: 10px; font: inherit; font-size: 14px; }
      .quick { display: flex; gap: 6px; flex-wrap: wrap; }
      .qchip { min-height: 32px; padding: 0 10px; border-radius: 999px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: transparent; color: var(--secondary-text-color); font-size: 12px; cursor: pointer; }
      .opts { display: flex; flex-direction: column; gap: 4px; padding: 6px; border-radius: 12px; background: var(--secondary-background-color, rgba(127,127,127,.06)); }
      .opt { display: flex; align-items: center; gap: 10px; padding: 6px; border: none; background: transparent; text-align: left; cursor: pointer; }
      .opt b { display: block; font-size: 13px; font-weight: 500; }
      .opt small { display: block; font-size: 11px; color: var(--secondary-text-color); }
      .box { width: 18px; height: 18px; border-radius: 5px; border: 2px solid var(--secondary-text-color); flex: none; box-sizing: border-box; }
      .box.on { border-color: #4285f4; background: #4285f4 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center/14px no-repeat; }
      .periods { display: flex; gap: 6px; align-items: center; }
      .periods .pchip { flex: none; min-height: 32px; padding: 0 12px; color: var(--secondary-text-color); border-color: var(--divider-color, rgba(127,127,127,.25)); background: transparent; }
      .periods .pchip.sel { color: #4285f4; border-color: rgba(66,133,244,.55); background: rgba(66,133,244,.12); }
      .stats { margin-left: auto; font-size: 11px; color: var(--secondary-text-color); }
      .mapbox { position: relative; height: 300px; border-radius: 12px; overflow: hidden; background: var(--secondary-background-color, #1a1d23); }
      .mapbox ha-map { position: absolute; inset: 0; height: 100%; }
      .map-msg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--secondary-text-color); z-index: 1; pointer-events: none; }
      .replay { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--secondary-text-color); }
      .replay input { flex: 1; accent-color: #4285f4; }
      .spin { animation: fl-spin 1.2s linear infinite; }
      .toast { position: absolute; left: 50%; bottom: 12px; transform: translate(-50%, 20px); opacity: 0; padding: 8px 14px; border-radius: 999px; background: rgba(32,33,36,.92); color: #fff; font-size: 12px; pointer-events: none; transition: opacity .25s, transform .25s; z-index: 6; }
      .toast.show { opacity: 1; transform: translate(-50%, 0); }
      .toast.error { background: rgba(234,67,53,.95); }

      /* Mini card */
      .compact-row { display: flex; align-items: center; gap: 12px; }
      .mini-dev { position: relative; flex: none; display: flex; align-items: center; justify-content: center; }
      .mini-phone { width: 30px; height: 54px; border-radius: 8px; background: #0b0d11; border: 2px solid #3c4049; overflow: hidden; display: flex; align-items: flex-end; animation: fl-float 4s ease-in-out infinite; }
      .mini-tablet { width: 58px; height: 40px; border-radius: 8px; background: #0b0d11; border: 2px solid #3c4049; overflow: hidden; display: flex; align-items: flex-end; animation: fl-float-t 4.4s ease-in-out infinite; position: relative; }
      .mini-fill { width: 100%; background: linear-gradient(180deg, var(--c), color-mix(in srgb, var(--c) 35%, transparent)); transform-origin: bottom; animation: fl-rise 1.4s cubic-bezier(.2,.8,.2,1) both; }
      .mini-lock { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #f28b82; }
      .mini-lock .ic { width: 16px; height: 16px; }
      .mini-wave { position: absolute; width: 46px; height: 46px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; animation: fl-wave 2.4s ease-out infinite; }
      .mini-shield { position: absolute; right: -6px; top: 0; width: 18px; height: 18px; border-radius: 50%; background: var(--card-background-color, #1c1f26); color: var(--c); display: flex; align-items: center; justify-content: center; }
      .mini-shield .ic { width: 13px; height: 13px; }
      .mini-txt { flex: 1; min-width: 0; }
      .mini-txt .title { font-size: 15px; }
      .mini-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .mini-tile { background: var(--secondary-background-color, rgba(127,127,127,.08)); border-radius: 12px; padding: 8px; display: flex; align-items: center; gap: 10px; border: none; cursor: pointer; text-align: left; min-width: 0; }
      .mini-tile .mini-phone { width: 18px; height: 32px; border-radius: 5px; }
      .mini-tile .mini-tablet { width: 34px; height: 24px; border-radius: 5px; }
      .mini-tile b { display: block; font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .mini-tile small { display: block; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      @keyframes fl-float { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(-3deg); } }
      @keyframes fl-float-t { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      @keyframes fl-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes fl-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes fl-wave { 0% { transform: scale(.6); opacity: .55; } 100% { transform: scale(1.9); opacity: 0; } }
      @keyframes fl-wave-s { 0% { transform: scale(.7); opacity: .8; } 100% { transform: scale(1.6); opacity: 0; } }
      @keyframes fl-ping { 0% { transform: scale(.4); opacity: .8; } 100% { transform: scale(2.6); opacity: 0; } }
      @keyframes fl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      @keyframes fl-scan { from { transform: translateY(-100%); } to { transform: translateY(460%); } }
      @keyframes fl-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @keyframes fl-dim { 0%,100% { opacity: .92; } 50% { opacity: 1; } }
      @keyframes fl-drop { 0% { transform: translateY(-30px); opacity: 0; } 60% { transform: translateY(4px); opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes fl-shackle { 0%,30% { transform: translateY(-5px); } 45%,100% { transform: translateY(0); } }
      @keyframes fl-shine { from { transform: translateX(-100%); } to { transform: translateX(400%); } }
      @keyframes fl-bell { 0%,60%,100% { transform: rotate(0); } 10%,30%,50% { transform: rotate(14deg); } 20%,40% { transform: rotate(-14deg); } }
      @keyframes fl-sos { 0%,100% { box-shadow: 0 0 0 0 rgba(234,67,53,.4); } 50% { box-shadow: 0 0 0 6px rgba(234,67,53,0); } }
      @keyframes fl-in { from { transform: translateY(-8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes fl-spin { to { transform: rotate(360deg); } }
      @keyframes fl-sscan { from { transform: translateY(0); } to { transform: translateY(48px); } }
      @keyframes fl-grain { to { stroke-dashoffset: -2.8; } }
      @keyframes fl-glow { 0%,100% { opacity: 1; } 50% { opacity: .6; } }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
    `;
  }
}

// ── family-link-mini-card ────────────────────────────────────────────────────
class FamilyLinkMiniCard extends FamilyLinkCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onOutsideMini = flWatchOutside(
      (ev) => this._zoomed && !this._popup && !ev.composedPath().includes(this) && !flInDialog(ev),
      () => this._setZoom(false)
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this._onOutsideMini.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._onOutsideMini.off();
    if (this._zoomed) {
      this._zoomed = false;
      this._render();
    }
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 4, rows: 'auto' };
  }

  _compact() {
    return !this._zoomed;
  }

  _detailButton(t) {
    var label = this._zoomed ? t.show_compact : t.show_full;
    return `<button class="zoom" data-action="detail" title="${flEsc(label)}" aria-label="${flEsc(label)}">${flIcon(this._zoomed ? 'collapse' : 'expand')}</button>`;
  }

  _toggleDetail(ev) {
    this._setZoom(!this._zoomed);
    if (!ev.detail) this._root.querySelector('.zoom')?.focus?.({ preventScroll: true });
  }

  _setZoom(zoomed) {
    this._zoomed = zoomed;
    if (!zoomed && this._popup) this._closePopup(true);
    this._render();
  }

  _miniDevice(d, _t, big) {
    var s = FL_STATUS[d?.status] || FL_STATUS.not_tracked;
    var kind = this._kind(d);
    var used = d?.used || 0;
    var cap = d?.limit ? d.limit + (d.bonus || 0) : d?.remaining !== null && d?.remaining !== undefined ? used + d.remaining : 240;
    var ratio = Math.max(0.06, Math.min(1, used / Math.max(1, cap)));
    var lock = d?.restricted ? `<span class="mini-lock">${flIcon('lock')}</span>` : '';
    var screen = `<span class="mini-${kind}" style="--c:${s.color}">${d?.restricted ? '' : `<span class="mini-fill" style="height:${Math.round(ratio * 100)}%"></span>`}${lock}</span>`;
    if (!big) return screen;
    var protectedNow = d && (d.status === 'tracked' || d.status === 'attention');
    return `<span class="mini-dev" style="--c:${s.color};width:48px;height:64px">${protectedNow ? '<span class="mini-wave"></span>' : ''}${screen}<span class="mini-shield">${flIcon(d?.restricted ? 'lock' : 'shield')}</span></span>`;
  }

  _renderCompact(a, t, state) {
    var devices = a.devices || [];
    var device = this._device(a) || devices[0];
    var status = this._status(a, devices.length > 1 ? null : device, state);
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var loc = a.location;
    var place = loc ? loc.place || loc.address || t.unknown_place : null;
    var title = this._config.title || a.child_name || '';
    var stale = a.stale ? `<div class="note">${flIcon('offline')}<span>${flEsc(t.stale)}</span></div>` : '';
    if (devices.length > 1) {
      var tiles = devices
        .map((d) => {
          var ds = FL_STATUS[d.status] || FL_STATUS.not_tracked;
          var line = d.restricted ? this._restrictedShort(d, t) : d.remaining !== null && d.remaining !== undefined ? `${flDuration(d.remaining, t)} ${t.left}` : flDuration(d.used, t);
          return `<button class="mini-tile" data-action="select-zoom" data-device="${flEsc(d.id)}">${this._miniDevice(d, t, false)}<span style="min-width:0"><b>${flEsc(d.name)}</b><small style="color:${d.status === 'tracked' ? 'var(--secondary-text-color)' : ds.color}">${flEsc(line)}</small></span></button>`;
        })
        .join('');
      var sub = [flDuration(a.total_minutes, t), place].filter(Boolean).join(' · ');
      if (this._config.illustration !== false) return `${this._banner(a, null, t, state, title, sub, this._detailButton(t))}${stale}<div class="mini-tiles">${tiles}</div>`;
      return `<div class="compact-row"><div class="badge" style="--c:${s.color};--tint:${s.tint}">${flIcon('kite')}</div><div class="mini-txt">${this._titles(a, t, status, title, sub)}</div>${this._detailButton(t)}</div>${stale}<div class="mini-tiles">${tiles}</div>`;
    }
    var line;
    if (!device) line = t.unavailable;
    else if (device.restricted) line = this._restrictedText(device, t);
    else if (device.remaining !== null && device.remaining !== undefined) line = `${flDuration(device.remaining, t)} ${t.left}`;
    else line = `${flDuration(device.used, t)} ${t.used_today}`;
    var parts = [line, place].filter(Boolean).join(' · ');
    var unlock = device?.locked ? `<button class="btn green" data-action="unlock">${flEsc(t.unlock)}</button>` : '';
    if (this._config.illustration !== false) return `${this._banner(a, device, t, state, title, parts, this._detailButton(t))}${stale}${unlock ? `<div class="mini-actions">${unlock}</div>` : ''}`;
    return `<div class="compact-row">${this._miniDevice(device, t, true)}<div class="mini-txt">${this._titles(a, t, status, title, parts, device?.restricted ? `color:${s.color}` : '')}</div>${unlock}${this._detailButton(t)}</div>${stale}`;
  }

  _onClick(ev) {
    var el = ev.target.closest?.('[data-action="select-zoom"]');
    if (el) {
      ev.stopPropagation();
      this._selected = el.getAttribute('data-device');
      this._setZoom(true);
      return;
    }
    super._onClick(ev);
  }
}

// ── family-link-card-editor ──────────────────────────────────────────────────
var FL_LANGUAGES = [
  ['en', 'English'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['sr', 'Српски'],
  ['sr-Latn', 'Srpski (latinica)'],
  ['it', 'Italiano'],
  ['nl', 'Nederlands'],
  ['pt', 'Português (Portugal)'],
  ['pl', 'Polski'],
  ['ro', 'Română'],
  ['da', 'Dansk'],
  ['sv', 'Svenska'],
  ['bg', 'Български'],
  ['ru', 'Русский'],
  ['uk', 'Українська'],
  ['hu', 'Magyar'],
  ['sk', 'Slovenčina'],
  ['cs', 'Čeština'],
  ['sl', 'Slovenščina'],
  ['lv', 'Latviešu'],
  ['el', 'Ελληνικά'],
];

// children: the status sensors of the children (one per child); the entity picker offers only those, not the screen
// time, apps or other sensors of the integration (a selector cannot filter on the translation key).
function flEditorSchema(t, devices, children) {
  var entity = children && children.length
    ? { include_entities: children }
    : { filter: { domain: 'sensor', integration: 'family_link' } };
  return [
    { name: 'entity', selector: { entity: entity } },
    { name: 'title', selector: { text: {} } },
    {
      type: 'grid',
      name: '',
      schema: [
        {
          name: 'device',
          selector: { select: { mode: 'dropdown', options: [{ value: '', label: t.type_auto }].concat(devices.map((d) => ({ value: d.id, label: d.name }))) } },
        },
        {
          name: 'device_type',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'auto', label: t.type_auto },
                { value: 'phone', label: t.type_phone },
                { value: 'tablet', label: t.type_tablet },
              ],
            },
          },
        },
      ],
    },
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'show_scene', selector: { boolean: {} } },
        { name: 'show_top_apps', selector: { boolean: {} } },
        { name: 'show_actions', selector: { boolean: {} } },
        { name: 'show_location', selector: { boolean: {} } },
        { name: 'illustration', selector: { boolean: {} } },
        {
          name: 'illustration_theme',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'auto', label: t.theme_auto },
                { value: 'day', label: t.theme_day },
                { value: 'night', label: t.theme_night },
              ],
            },
          },
        },
      ],
    },
    { name: 'trace_hours', selector: { number: { min: 1, max: 168, mode: 'box' } } },
    {
      name: 'language',
      selector: { select: { mode: 'dropdown', options: [{ value: '', label: t.lang_auto }].concat(FL_LANGUAGES.map((l) => ({ value: l[0], label: l[1] }))) } },
    },
  ];
}

class FamilyLinkCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', this._valueChanged.bind(this));
      this.appendChild(this._form);
    }
    var children = FamilyLinkCard._findEntities(this._hass);
    var entity = this._config.entity || children[0];
    var devices = this._hass.states[entity]?.attributes?.devices || [];
    var lang = flLang(this._hass, this._config);
    var key = `${lang}|${devices.map((d) => d.id).join(',')}|${children.join(',')}`;
    if (key !== this._key) {
      this._key = key;
      var t = FamilyLinkI18n[lang].editor;
      this._form.schema = flEditorSchema(t, devices, children);
      this._form.computeLabel = (field) => t[field.name] || field.name;
    }
    this._form.hass = this._hass;
    // A new data object re-renders the whole form: handed over only when the config changed, not on every state change
    if (this._dataFor !== this._config) {
      this._dataFor = this._config;
      this._form.data = Object.assign({}, FL_DEFAULTS, this._config);
    }
  }

  _valueChanged(ev) {
    var value = Object.assign({}, ev.detail.value);
    Object.keys(FL_DEFAULTS).forEach((key) => {
      if (JSON.stringify(value[key]) === JSON.stringify(FL_DEFAULTS[key])) delete value[key];
    });
    ['title', 'language', 'device'].forEach((key) => {
      if (!value[key]) delete value[key];
    });
    this._config = value;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('family-link-card-editor')) customElements.define('family-link-card-editor', FamilyLinkCardEditor);
if (!customElements.get('family-link-card')) {
  customElements.define('family-link-card', FamilyLinkCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'family-link-card',
    name: 'Family Link',
    description: 'Your child’s phone or tablet: screen time, top apps, bonus, lock, ring, location route and emergency.',
    preview: false,
    documentationURL: 'https://github.com/juju35/ha-family-link',
  });
}
if (!customElements.get('family-link-mini-card')) {
  customElements.define('family-link-mini-card', FamilyLinkMiniCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'family-link-mini-card',
    name: 'Family Link (mini)',
    description: 'Compact view of a child’s devices, with a button to open the full card.',
    preview: false,
    documentationURL: 'https://github.com/juju35/ha-family-link',
  });
}
console.info(`%c FAMILY-LINK-CARD %c ${FAMILY_LINK_CARD_VERSION} `, 'color:#fff;background:#34a853;font-weight:700', 'color:#34a853;background:#fff');
