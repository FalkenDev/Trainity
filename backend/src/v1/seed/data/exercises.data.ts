export const exercisesToSeed = [
  {
    i18nKey: 'exercise.bench_press',
    defaultName: 'Bänkpress',
    defaultDescription:
      'Skivstångspress på plan bänk. Dra ihop skulderbladen, lätt brygga, fötter i golvet. Sänk till mitten av bröstet och pressa upp med armbågar ~45°.',
    muscleGroups: ['Bröst', 'Axlar', 'Triceps'],
    defaultSets: 4,
    defaultReps: 6,
    defaultPauseSeconds: 150,
  },
  {
    i18nKey: 'exercise.incline_dumbbell_press',
    defaultName: 'Hantelpress lutande',
    defaultDescription:
      'Pressa hantlar på en bänk med 30–45° lutning. Sänk kontrollerat till bröstlinjen, pressa upp och lätt inåt.',
    muscleGroups: ['Bröst', 'Axlar', 'Triceps'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.seated_dumbbell_shoulder_press',
    defaultName: 'Sittande hantelpress (axlar)',
    defaultDescription:
      'Sittande vertikal press. Håll revbenen nere och underarmarna vertikala. Sänk till ungefär öronhöjd och pressa utan att rycka axlarna.',
    muscleGroups: ['Axlar', 'Triceps', 'Bål'],
    defaultSets: 4,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.dumbbell_lateral_raise',
    defaultName: 'Hantellyft åt sidan',
    defaultDescription:
      'Lyft hantlar lätt framåt och ut till axelhöjd. Mjuka armbågar, strikt kontroll och långsam excentrisk fas.',
    muscleGroups: ['Axlar', 'Bakre axlar'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.cable_triceps_pushdown',
    defaultName: 'Triceps pushdown (kabel)',
    defaultDescription:
      'Med rep eller stång, håll armbågarna stilla. Sträck ut helt och kontrollera tillbaka till ~90°.',
    muscleGroups: ['Triceps'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.cable_chest_fly',
    defaultName: 'Kabel-flyes (bröst)',
    defaultDescription:
      'Från höga/mitten-trissor. Lätt framåtlutning, kramrörelse med mjuka armbågar. Spänn bröstet och återgå långsamt.',
    muscleGroups: ['Bröst'],
    defaultSets: 3,
    defaultReps: 13,
    defaultPauseSeconds: 60,
  },

  {
    i18nKey: 'exercise.back_squat',
    defaultName: 'Knäböj (skivstång)',
    defaultDescription:
      'Stång på övre ryggen, spänn bålen, knän följer tårna. Gå ned så djupt du kontrollerar och driv upp igen.',
    muscleGroups: ['Framsida lår', 'Säte', 'Baksida lår', 'Bål'],
    defaultSets: 4,
    defaultReps: 8,
    defaultPauseSeconds: 150,
  },
  {
    i18nKey: 'exercise.barbell_hip_thrust',
    defaultName: 'Hip thrust (skivstång)',
    defaultDescription:
      'Övre rygg på bänk, stång över höften. Tippa bäckenet bakåt, driv genom hälarna och lås ut med sätet.',
    muscleGroups: ['Säte', 'Baksida lår'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.leg_press',
    defaultName: 'Benpress',
    defaultDescription:
      'Fötter axelbrett på släden. Sänk djupt med kontroll utan att bäckenet tippar; pressa genom mellanfoten.',
    muscleGroups: ['Framsida lår', 'Säte', 'Baksida lår'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.seated_leg_curl',
    defaultName: 'Sittande lårcurl',
    defaultDescription:
      'Justera dynan ovanför hälarna. Curl till full knäflexion med höfterna stilla; kontrollera den excentriska fasen.',
    muscleGroups: ['Baksida lår'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 75,
  },
  {
    i18nKey: 'exercise.leg_extension',
    defaultName: 'Benextension',
    defaultDescription:
      'Dyna ovanför anklarna. Sträck ut nästan till låsning med kontroll; 2–3 s excentriskt för knävänlig belastning.',
    muscleGroups: ['Framsida lår'],
    defaultSets: 3,
    defaultReps: 13,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.calf_raise_machine_or_leg_press',
    defaultName: 'Vadpress (maskin/benpress)',
    defaultDescription:
      'Full rörelse i fotleden. Pausa i bottenläget; kraftig tåhävning i toppen. Ingen studs.',
    muscleGroups: ['Vader'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },

  {
    i18nKey: 'exercise.standing_barbell_overhead_press',
    defaultName: 'Militärpress (stående)',
    defaultDescription:
      'Stå stabilt, spänn säte och bål. Pressa stången rakt upp; för huvudet fram genom armarna i toppläget.',
    muscleGroups: ['Axlar', 'Triceps', 'Övre bröst', 'Bål'],
    defaultSets: 4,
    defaultReps: 7,
    defaultPauseSeconds: 150,
  },
  {
    i18nKey: 'exercise.seated_cable_row',
    defaultName: 'Sittande rodd (kabel)',
    defaultDescription:
      'Neutral rygg, bröstet upp. Dra mot nedre revben med armbågar nära kroppen; spänn lats/mellanrygg, återgå långsamt.',
    muscleGroups: ['Rygg', 'Bakre axlar', 'Biceps'],
    defaultSets: 4,
    defaultReps: 8,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.incline_bench_press',
    defaultName: 'Bänkpress lutande (skivstång)',
    defaultDescription:
      'Skivstångspress på 30–45° lutning. Sänk till övre bröstet; pressa med armbågar ~45–60°.',
    muscleGroups: ['Bröst', 'Axlar', 'Triceps'],
    defaultSets: 3,
    defaultReps: 9,
    defaultPauseSeconds: 120,
  },
  {
    i18nKey: 'exercise.walking_lunge',
    defaultName: 'Gående utfall',
    defaultDescription:
      'Ta ett steg fram och gå ned kontrollerat. Främre knät följer tårna; pressa upp genom främre hälen och växla.',
    muscleGroups: ['Framsida lår', 'Säte', 'Baksida lår', 'Bål'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.overhead_triceps_extension_rope_or_db',
    defaultName: 'Triceps extension över huvudet (rep/hantel)',
    defaultDescription:
      'Armar över huvudet, armbågar nära. Sänk bakom huvudet för stretch; sträck ut helt utan att flare armbågarna.',
    muscleGroups: ['Triceps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 75,
  },
  {
    i18nKey: 'exercise.hammer_curl',
    defaultName: 'Hammercurl',
    defaultDescription:
      'Hantelcurl med neutralt grepp. Armbågarna vid sidan; kontrollera den excentriska fasen i ~2 sek.',
    muscleGroups: ['Biceps', 'Underarmar'],
    defaultSets: 3,
    defaultReps: 12,
    defaultPauseSeconds: 60,
  },

  {
    i18nKey: 'exercise.deadlift',
    defaultName: 'Marklyft',
    defaultDescription:
      'Höftfällning med neutral rygg, stången nära smalbenen. Tryck golvet, res dig starkt. Återställ eller kontrollera varje repetition.',
    muscleGroups: [
      'Säte',
      'Baksida lår',
      'Rygg',
      'Trapezius',
      'Bål',
      'Ländrygg',
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultPauseSeconds: 180,
  },
  {
    i18nKey: 'exercise.lat_pulldown',
    defaultName: 'Latsdrag',
    defaultDescription:
      'Greppa något bredare än axlarna. Dra stången mot övre bröstet; armbågar ned och bak; långsam excentrisk fas.',
    muscleGroups: ['Rygg', 'Biceps', 'Bakre axlar'],
    defaultSets: 4,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.seated_row_cable',
    defaultName: 'Sittande rodd (kabel) – mage',
    defaultDescription:
      'Neutral rygg; dra till navel/nedre revben. Nyp ihop skulderbladen; kontrollera återgången.',
    muscleGroups: ['Rygg', 'Bakre axlar', 'Biceps'],
    defaultSets: 4,
    defaultReps: 10,
    defaultPauseSeconds: 90,
  },
  {
    i18nKey: 'exercise.face_pull',
    defaultName: 'Face pull',
    defaultDescription:
      'Rep i ansiktshöjd. Dra mot näsa/panna med utåtrotation (tummar bak); spänn bakre axlar.',
    muscleGroups: ['Bakre axlar', 'Rygg', 'Trapezius'],
    defaultSets: 3,
    defaultReps: 14,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.biceps_curl_barbell_or_dumbbell',
    defaultName: 'Bicepscurl (stång/hantel)',
    defaultDescription:
      'Curl med supinerat grepp, armbågar vid sidan, axlarna nere. Fullt rörelseomfång; kontrollerad negativ fas.',
    muscleGroups: ['Biceps', 'Underarmar'],
    defaultSets: 3,
    defaultReps: 11,
    defaultPauseSeconds: 60,
  },
  {
    i18nKey: 'exercise.sit_up',
    defaultName: 'Situps',
    defaultDescription:
      'Tippa bäckenet bakåt; rulla upp kotsegment för segment. Undvik att dra i nacken; kontrollera nedvägen.',
    muscleGroups: ['Mage', 'Höftböjare', 'Bål'],
    defaultSets: 1,
    defaultReps: 20,
    defaultPauseSeconds: 45,
  },
  {
    i18nKey: 'exercise.lying_leg_raise',
    defaultName: 'Benlyft liggande',
    defaultDescription:
      'Tippa bäckenet bakåt; lyft raka ben utan att svanka; stoppa innan ländryggen börjar extendera.',
    muscleGroups: ['Mage', 'Höftböjare', 'Bål'],
    defaultSets: 1,
    defaultReps: 10,
    defaultPauseSeconds: 45,
  },
  {
    i18nKey: 'exercise.side_lying_leg_raise_obliques',
    defaultName: 'Sidoliggande benlyft (sneda magmuskler)',
    defaultDescription:
      'Sidoliggande; lyft med sneda magmuskler, håll höfterna staplade och kontrollera tempot.',
    muscleGroups: ['Mage', 'Bål'],
    defaultSets: 1,
    defaultReps: 20,
    defaultPauseSeconds: 45,
  },
];
