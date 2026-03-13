/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import { ExerciseType } from '../../exercise/exercise.entity';

export interface ExerciseSeedDef {
  i18nKey: string;
  defaultName: string;
  defaultDescription: string;
  muscleGroups: string[];
  exerciseType?: ExerciseType;
  equipment?: string[];
  instructions?: string[];
  proTips?: string[];
  mistakes?: string[];
}

export const exercisesToSeed: ExerciseSeedDef[] = [
  // ─── PUSH ────────────────────────────────────────────────
  {
    i18nKey: 'exercise.bench_press',
    defaultName: 'Bänkpress',
    defaultDescription:
      'Skivstångspress på plan bänk. Dra ihop skulderbladen, lätt brygga, fötter i golvet. Sänk till mitten av bröstet och pressa upp med armbågar ~45°.',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Skivstång', 'Plan bänk'],
    instructions: [
      'Ligg på bänken med ögonen under stången.',
      'Greppa stången något bredare än axelbredd.',
      'Dra ihop skulderbladen och skapa en lätt brygga.',
      'Lyft ut stången och sänk den kontrollerat till mitten av bröstet.',
      'Pressa stången rakt upp till full armsträckning.',
    ],
    proTips: [
      'Håll armbågarna i ~45° vinkel för att skydda axlarna.',
      'Tryck fötterna stadigt i golvet för stabilitet.',
      'Andas in på väg ner, andas ut vid pressningen.',
    ],
    mistakes: [
      'Studsa inte stången mot bröstet.',
      'Lyft inte rumpan från bänken.',
      'Undvik att pressa med armbågarna rakt ut åt sidorna.',
    ],
  },
  {
    i18nKey: 'exercise.incline_dumbbell_press',
    defaultName: 'Hantelpress lutande',
    defaultDescription:
      'Pressa hantlar på en bänk med 30–45° lutning. Sänk kontrollerat till bröstlinjen, pressa upp och lätt inåt.',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Hantlar', 'Lutande bänk'],
    instructions: [
      'Ställ bänken i 30–45° lutning.',
      'Håll en hantel i varje hand med neutralt grepp.',
      'Pressa hantlarna upp till full armsträckning.',
      'Sänk kontrollerat till bröstlinjen.',
    ],
    proTips: [
      'Rotera handlederna lätt inåt i topposition för bättre kontraktion.',
      'Håll skulderbladen ihopdragna genom hela rörelsen.',
    ],
    mistakes: [
      'Ställ inte bänken för brant – det flyttar belastningen till axlarna.',
      'Sänk inte hantlarna för djupt, det belastar axelleden.',
    ],
  },
  {
    i18nKey: 'exercise.seated_dumbbell_shoulder_press',
    defaultName: 'Sittande hantelpress (axlar)',
    defaultDescription:
      'Sittande vertikal press. Håll revbenen nere och underarmarna vertikala. Sänk till ungefär öronhöjd och pressa utan att rycka axlarna.',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Hantlar', 'Sittande bänk med ryggstöd'],
    instructions: [
      'Sitt med ryggstöd och fötter stadigt i golvet.',
      'Håll hantlar vid axelhöjd med handflatorna framåt.',
      'Pressa rakt upp till full armsträckning.',
      'Sänk kontrollerat tillbaka till öronhöjd.',
    ],
    proTips: [
      'Undvik att svänga ryggen – håll bålen spänd.',
      'Tryck uppåt i en lätt bågrörelse, inte rakt framåt.',
    ],
    mistakes: [
      'Pressa inte bakom huvudet – det stressar axelleden.',
      'Undvik att använda fart för att lyfta vikten.',
    ],
  },
  {
    i18nKey: 'exercise.dumbbell_lateral_raise',
    defaultName: 'Hantellyft åt sidan',
    defaultDescription:
      'Lyft hantlar lätt framåt och ut till axelhöjd. Mjuka armbågar, strikt kontroll och långsam excentrisk fas.',
    muscleGroups: ['shoulders', 'rearDelts'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Hantlar'],
    instructions: [
      'Stå med hantlar vid sidorna, lätt framåtlutning.',
      'Lyft hantlarna ut åt sidorna till axelhöjd med mjuka armbågar.',
      'Håll kort i topposition.',
      'Sänk långsamt tillbaka.',
    ],
    proTips: [
      'Tänk att du häller ur ett glas vatten i topposition.',
      'Använd lättare vikter med strikt form för bättre isolering.',
    ],
    mistakes: [
      'Sving inte vikterna – använd kontrollerad kraft.',
      'Lyft inte ovanför axelhöjd, det kan stressa axelleden.',
    ],
  },
  {
    i18nKey: 'exercise.cable_triceps_pushdown',
    defaultName: 'Triceps pushdown (kabel)',
    defaultDescription:
      'Med rep eller stång, håll armbågarna stilla. Sträck ut helt och kontrollera tillbaka till ~90°.',
    muscleGroups: ['triceps'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Kabelmaskin', 'Rak stång eller rep'],
    instructions: [
      'Ställ dig framför kabelmaskinen med hög fäste.',
      'Greppa stången/repet med armbågarna nära kroppen.',
      'Sträck ut armarna helt nedåt.',
      'Kontrollera tillbaka till ~90° i armbågen.',
    ],
    proTips: [
      'Håll armbågarna helt stilla vid sidan under hela rörelsen.',
      'Fokusera på att pressa med triceps, inte axlar.',
    ],
    mistakes: [
      'Luta dig inte framåt och använd kroppsvikt.',
      'Undvik att flytta armbågarna fram och tillbaka.',
    ],
  },
  {
    i18nKey: 'exercise.cable_chest_fly',
    defaultName: 'Kabel-flyes (bröst)',
    defaultDescription:
      'Från höga/mitten-trissor. Lätt framåtlutning, kramrörelse med mjuka armbågar. Spänn bröstet och återgå långsamt.',
    muscleGroups: ['chest'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Kabelmaskin (dubbla trissor)'],
    instructions: [
      'Ställ dig i mitten med ett handtag i varje hand.',
      'Luta dig lätt framåt med fötter i stegposition.',
      'För ihop händerna framför bröstet i en kramrörelse.',
      'Öppna ut armarna kontrollerat tillbaka till start.',
    ],
    proTips: [
      'Håll en mjuk böj i armbågarna genom hela rörelsen.',
      'Fokusera på att pressa ihop bröstmusklerna.',
    ],
    mistakes: [
      'Rak arm sätter onödig belastning på armbågen.',
      'Undvik att dra med axlarna – håll dem nere och bakåt.',
    ],
  },

  // ─── LEGS ────────────────────────────────────────────────
  {
    i18nKey: 'exercise.back_squat',
    defaultName: 'Knäböj (skivstång)',
    defaultDescription:
      'Stång på övre ryggen, spänn bålen, knän följer tårna. Gå ned så djupt du kontrollerar och driv upp igen.',
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Skivstång', 'Knäböjställning'],
    instructions: [
      'Placera stången på övre trapeziusmuskeln.',
      'Greppa brett, dra ihop skulderbladen och spänn bålen.',
      'Ta ett steg tillbaka, fötter i axelbredd.',
      'Böj knän och höfter, sänk dig kontrollerat.',
      'Driv upp genom hälarna till full extension.',
    ],
    proTips: [
      'Tryck knäna utåt i linje med tårna.',
      'Håll bröstet uppe och blicken framåt.',
      'Andas in djupt och spänn bålen innan varje rep.',
    ],
    mistakes: [
      'Låt inte knäna kollapsa inåt.',
      'Undvik att runda ryggen vid uppresningen.',
      'Gå inte upp på tå – driv genom hela foten.',
    ],
  },
  {
    i18nKey: 'exercise.barbell_hip_thrust',
    defaultName: 'Hip thrust (skivstång)',
    defaultDescription:
      'Övre rygg på bänk, stång över höften. Tippa bäckenet bakåt, driv genom hälarna och lås ut med sätet.',
    muscleGroups: ['glutes', 'hamstrings'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Skivstång', 'Bänk', 'Barbell pad'],
    instructions: [
      'Sätt dig med övre ryggen mot en bänk och stången över höftbenen.',
      'Fötter i axelbredd, knän ~90° i topposition.',
      'Tippa bäckenet bakåt (posterior tilt).',
      'Driv genom hälarna och lyft höften till full extension.',
      'Kläm ihop sätet hårt i topposition.',
    ],
    proTips: [
      'Använd en barbell pad för komfort.',
      'Titta nedåt/framåt under rörelsen, inte uppåt.',
    ],
    mistakes: [
      'Överextendera inte ryggen – lås ut med sätesmusklerna.',
      'Placera inte fötterna för långt från eller nära bänken.',
    ],
  },
  {
    i18nKey: 'exercise.leg_press',
    defaultName: 'Benpress',
    defaultDescription:
      'Fötter axelbrett på släden. Sänk djupt med kontroll utan att bäckenet tippar; pressa genom mellanfoten.',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Benpressmaskin'],
    instructions: [
      'Sätt dig i maskinen med ryggen plant mot stolen.',
      'Placera fötter axelbrett på plattan.',
      'Lossa säkerhetsspärrarna.',
      'Sänk långsamt tills knäna bildar ~90°.',
      'Pressa tillbaka utan att låsa knäna helt.',
    ],
    proTips: [
      'Placera fötterna högre för mer sätesfokus, lägre för mer lår.',
      'Tryck genom hela foten, inte bara tårna.',
    ],
    mistakes: [
      'Låt inte bäckenet tippa upp – håll rumpan i sätet.',
      'Lås aldrig knäna helt i toppositionen.',
    ],
  },
  {
    i18nKey: 'exercise.seated_leg_curl',
    defaultName: 'Sittande lårcurl',
    defaultDescription:
      'Justera dynan ovanför hälarna. Curl till full knäflexion med höfterna stilla; kontrollera den excentriska fasen.',
    muscleGroups: ['hamstrings'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Sittande lårcurlmaskin'],
    instructions: [
      'Justera maskinen så dynan placeras ovanför hälarna.',
      'Sitt med ryggen mot ryggstödet.',
      'Curla benen nedåt till full knäflexion.',
      'Återgå kontrollerat till startposition.',
    ],
    proTips: [
      'Håll en långsam excentrisk fas (2–3 s) för bättre aktivering.',
      'Krama ihop baksida lår i bottenposition.',
    ],
    mistakes: [
      'Lyft inte rumpan från sätet under rörelsen.',
      'Undvik att använda fart – håll det kontrollerat.',
    ],
  },
  {
    i18nKey: 'exercise.leg_extension',
    defaultName: 'Benextension',
    defaultDescription:
      'Dyna ovanför anklarna. Sträck ut nästan till låsning med kontroll; 2–3 s excentriskt för knävänlig belastning.',
    muscleGroups: ['quads'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Benextensionmaskin'],
    instructions: [
      'Justera maskinen så dynan vilar ovanför anklarna.',
      'Sitt med ryggen mot ryggstödet.',
      'Sträck benen uppåt till nästan full extension.',
      'Sänk kontrollerat tillbaka (2–3 sekunder).',
    ],
    proTips: [
      'Vinkla fötterna uppåt (dorsiflektion) för bättre quad-aktivering.',
      'Pausa kort i topposition för maximal kontraktion.',
    ],
    mistakes: [
      'Lås inte knäna helt – det belastar leden.',
      'Undvik att svinga benen uppåt med fart.',
    ],
  },
  {
    i18nKey: 'exercise.calf_raise_machine_or_leg_press',
    defaultName: 'Vadpress (maskin/benpress)',
    defaultDescription:
      'Full rörelse i fotleden. Pausa i bottenläget; kraftig tåhävning i toppen. Ingen studs.',
    muscleGroups: ['calves'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Vadmaskin eller benpressmaskin'],
    instructions: [
      'Placera tåbollarna på kanten av plattan.',
      'Sänk hälarna så långt ner som möjligt.',
      'Pressa upp genom tårna till full plantarflektion.',
      'Pausa kort i topposition.',
    ],
    proTips: [
      'Pausa 1–2 sekunder i bottenläget för full stretch.',
      'Kör reps långsamt – vaderna svarar bra på tid under spänning.',
    ],
    mistakes: [
      'Studsa inte i bottenläget – det kan skada akillessenan.',
      'Undvik halva reps – kör fullt rörelseomfång.',
    ],
  },

  // ─── PUSH / SHOULDERS ────────────────────────────────────
  {
    i18nKey: 'exercise.standing_barbell_overhead_press',
    defaultName: 'Militärpress (stående)',
    defaultDescription:
      'Stå stabilt, spänn säte och bål. Pressa stången rakt upp; för huvudet fram genom armarna i toppläget.',
    muscleGroups: ['shoulders', 'triceps', 'upperChest', 'core'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Skivstång'],
    instructions: [
      'Greppa stången i axelbredd framför nyckelbenen.',
      'Spänn säte, bål och hela kroppen.',
      'Pressa stången rakt upp förbi ansiktet.',
      'Lås ut och för huvudet framåt genom armarna.',
      'Sänk kontrollerat tillbaka till start.',
    ],
    proTips: [
      'Andas in och spänn bålen ordentligt innan varje rep.',
      'Håll handlederna raka – stången ska vila på handflatan.',
    ],
    mistakes: [
      'Luta inte bakåt – det gör övningen till en stående bänkpress.',
      'Undvik att böja knäna för att skapa fart.',
    ],
  },
  {
    i18nKey: 'exercise.seated_cable_row',
    defaultName: 'Sittande rodd (kabel)',
    defaultDescription:
      'Neutral rygg, bröstet upp. Dra mot nedre revben med armbågar nära kroppen; spänn lats/mellanrygg, återgå långsamt.',
    muscleGroups: ['back', 'rearDelts', 'biceps'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Kabelmaskin', 'V-grepp eller brett handtag'],
    instructions: [
      'Sitt med fötterna på plattorna och knäna lätt böjda.',
      'Greppa handtaget med neutral rygg och bröstet upp.',
      'Dra handtaget mot nedre revben/navel.',
      'Kläm ihop skulderbladen i slutpositionen.',
      'Återgå kontrollerat utan att runda ryggen.',
    ],
    proTips: [
      'Tänk på att dra med armbågarna, inte händerna.',
      'Undvik att luta överkroppen bakåt mer än några grader.',
    ],
    mistakes: [
      'Runda inte ryggen vid utsträckt position.',
      'Använd inte fart genom att vagga med överkroppen.',
    ],
  },
  {
    i18nKey: 'exercise.incline_bench_press',
    defaultName: 'Bänkpress lutande (skivstång)',
    defaultDescription:
      'Skivstångspress på 30–45° lutning. Sänk till övre bröstet; pressa med armbågar ~45–60°.',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Skivstång', 'Lutande bänk'],
    instructions: [
      'Ligg på en bänk ställd i 30–45° lutning.',
      'Greppa stången något bredare än axelbredd.',
      'Lyft ut stången och sänk till övre bröstet.',
      'Pressa upp till full armsträckning.',
    ],
    proTips: [
      'Dra ihop skulderbladen precis som vid plan bänkpress.',
      'Håll armbågarna i ~45–60° vinkel.',
    ],
    mistakes: [
      'Ställ inte bänken för brant – 30° räcker för övre bröst.',
      'Studsa inte stången mot bröstet.',
    ],
  },
  {
    i18nKey: 'exercise.walking_lunge',
    defaultName: 'Gående utfall',
    defaultDescription:
      'Ta ett steg fram och gå ned kontrollerat. Främre knät följer tårna; pressa upp genom främre hälen och växla.',
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Hantlar (valfritt)', 'Skivstång (valfritt)'],
    instructions: [
      'Stå rak med fötterna ihop.',
      'Ta ett långt steg framåt och sänk bakre knät mot golvet.',
      'Främre knät ska vara i linje med tårna vid ~90°.',
      'Pressa upp genom främre hälen och ta nästa steg.',
    ],
    proTips: [
      'Håll överkroppen rak och blicken framåt.',
      'Längre steg = mer sätesaktivering, kortare = mer framsida lår.',
    ],
    mistakes: [
      'Låt inte främre knät gå förbi tårna.',
      'Undvik att luta överkroppen framåt.',
    ],
  },
  {
    i18nKey: 'exercise.overhead_triceps_extension_rope_or_db',
    defaultName: 'Triceps extension över huvudet (rep/hantel)',
    defaultDescription:
      'Armar över huvudet, armbågar nära. Sänk bakom huvudet för stretch; sträck ut helt utan att flare armbågarna.',
    muscleGroups: ['Triceps'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Kabelmaskin med rep', 'Hantel (alternativ)'],
    instructions: [
      'Greppa repet/hanteln och håll armarna ovanför huvudet.',
      'Håll armbågarna nära huvudet och pekande uppåt.',
      'Sänk vikten bakom huvudet genom att böja i armbågen.',
      'Sträck ut armarna till full extension.',
    ],
    proTips: [
      'Fokusera på att hålla armbågarna stilla – bara underarmarna rör sig.',
      'Kontrollera den excentriska fasen för bättre stretch.',
    ],
    mistakes: [
      'Fläkta inte ut armbågarna – håll dem nära huvudet.',
      'Använd inte för tung vikt som gör att du böjer ryggen.',
    ],
  },
  {
    i18nKey: 'exercise.hammer_curl',
    defaultName: 'Hammercurl',
    defaultDescription:
      'Hantelcurl med neutralt grepp. Armbågarna vid sidan; kontrollera den excentriska fasen i ~2 sek.',
    muscleGroups: ['Biceps', 'Underarmar'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Hantlar'],
    instructions: [
      'Stå med hantlar vid sidorna, handflatorna vända mot kroppen.',
      'Curl hantlarna uppåt utan att rotera handlederna.',
      'Kläm ihop biceps i topposition.',
      'Sänk kontrollerat i ~2 sekunder.',
    ],
    proTips: [
      'Håll armbågarna orörliga vid sidan av kroppen.',
      'Alternera armar om du vill fokusera på en sida i taget.',
    ],
    mistakes: [
      'Sving inte med kroppen för att lyfta vikten.',
      'Undvik att flytta armbågarna framåt under curlen.',
    ],
  },

  // ─── PULL ────────────────────────────────────────────────
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
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Skivstång'],
    instructions: [
      'Stå med fötterna höftbrett, stången över mellanfoten.',
      'Böj ned med neutral rygg, greppa stången i axelbredd.',
      'Spänn bålen, tryck bröstet upp.',
      'Driv genom golvet och sträck höfter och knän samtidigt.',
      'Stå rakt upp med stången nära kroppen.',
      'Sänk tillbaka med kontroll.',
    ],
    proTips: [
      'Tänk på att "trycka golvet ifrån dig" snarare än att lyfta.',
      'Håll stången så nära kroppen som möjligt.',
      'Lås ut med sätesmusklerna, inte med ryggen.',
    ],
    mistakes: [
      'Runda inte ryggen – behåll neutral rygg hela tiden.',
      'Lyft inte med armarna – de fungerar som krokar.',
      'Undvik att starta med höfterna för lågt (det är inte en knäböj).',
    ],
  },
  {
    i18nKey: 'exercise.lat_pulldown',
    defaultName: 'Latsdrag',
    defaultDescription:
      'Greppa något bredare än axlarna. Dra stången mot övre bröstet; armbågar ned och bak; långsam excentrisk fas.',
    muscleGroups: ['Rygg', 'Biceps', 'Bakre axlar'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Latsdragmaskin', 'Bred stång'],
    instructions: [
      'Greppa stången något bredare än axelbrett.',
      'Sitt med låren under dynorna.',
      'Dra stången ned mot övre bröstet.',
      'Kläm ihop skulderbladen i botten.',
      'Återgå långsamt till full utsträckning.',
    ],
    proTips: [
      'Luta överkroppen bakåt några grader för bättre rörelselinje.',
      'Tänk på att dra med armbågarna ner mot fickan.',
    ],
    mistakes: [
      'Dra inte stången bakom nacken – det stressar axeln.',
      'Luta dig inte överdrivet bakåt.',
    ],
  },
  {
    i18nKey: 'exercise.seated_row_cable',
    defaultName: 'Sittande rodd (kabel) – mage',
    defaultDescription:
      'Neutral rygg; dra till navel/nedre revben. Nyp ihop skulderbladen; kontrollera återgången.',
    muscleGroups: ['Rygg', 'Bakre axlar', 'Biceps'],
    exerciseType: ExerciseType.COMPOUND,
    equipment: ['Kabelmaskin', 'V-grepp'],
    instructions: [
      'Sitt med ryggen rak och fötterna på plattorna.',
      'Dra handtaget mot naveln/nedre revben.',
      'Kläm ihop skulderbladen i slutpositionen.',
      'Återgå kontrollerat utan att runda ryggen.',
    ],
    proTips: [
      'Håll bröstet uppe genom hela rörelsen.',
      'Experimentera med olika grepp för att variera aktiveringen.',
    ],
    mistakes: [
      'Undvik att runda ryggen vid utsträckt position.',
      'Vagga inte med överkroppen.',
    ],
  },
  {
    i18nKey: 'exercise.face_pull',
    defaultName: 'Face pull',
    defaultDescription:
      'Rep i ansiktshöjd. Dra mot näsa/panna med utåtrotation (tummar bak); spänn bakre axlar.',
    muscleGroups: ['Bakre axlar', 'Rygg', 'Trapezius'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Kabelmaskin', 'Rep'],
    instructions: [
      'Sätt kabeln i ansiktshöjd med rep.',
      'Greppa repet med tummar bakåt.',
      'Dra mot ansiktet och separera händerna utåt.',
      'Kläm ihop bakre axlar och rotera ut.',
      'Återgå kontrollerat.',
    ],
    proTips: [
      'Fokusera på utåtrotation – tummar ska peka bakåt i slutposition.',
      'Använd lättare vikt och fler repetitioner.',
    ],
    mistakes: [
      'Dra inte med hela kroppen – stå stadigt.',
      'Undvik att göra det till en bicepscurl.',
    ],
  },
  {
    i18nKey: 'exercise.biceps_curl_barbell_or_dumbbell',
    defaultName: 'Bicepscurl (stång/hantel)',
    defaultDescription:
      'Curl med supinerat grepp, armbågar vid sidan, axlarna nere. Fullt rörelseomfång; kontrollerad negativ fas.',
    muscleGroups: ['Biceps', 'Underarmar'],
    exerciseType: ExerciseType.ISOLATION,
    equipment: ['Skivstång eller hantlar'],
    instructions: [
      'Stå rak med vikten i händerna, handflatorna uppåt (supinerat grepp).',
      'Håll armbågarna vid sidan av kroppen.',
      'Curl vikten uppåt till full kontraktion.',
      'Sänk kontrollerat i ~2 sekunder.',
    ],
    proTips: [
      'Håll axlarna nere och bakåt genom hela rörelsen.',
      'Kläm ihop biceps en sekund i topposition.',
    ],
    mistakes: [
      'Sving inte med överkroppen för att lyfta vikten.',
      'Undvik att flytta armbågarna framåt under curlen.',
    ],
  },

  // ─── ABS / CORE ──────────────────────────────────────────
  {
    i18nKey: 'exercise.sit_up',
    defaultName: 'Situps',
    defaultDescription:
      'Tippa bäckenet bakåt; rulla upp kotsegment för segment. Undvik att dra i nacken; kontrollera nedvägen.',
    muscleGroups: ['Mage', 'Höftböjare', 'Bål'],
    exerciseType: ExerciseType.BODYWEIGHT,
    equipment: [],
    instructions: [
      'Ligg på rygg med knäna böjda och fötterna i golvet.',
      'Händer bakom huvudet eller korsade på bröstet.',
      'Tippa bäckenet bakåt och rulla upp segment för segment.',
      'Sänk kontrollerat tillbaka.',
    ],
    proTips: [
      'Fokusera på att rulla upp, inte snapa upp.',
      'Andas ut på väg upp, andas in på väg ner.',
    ],
    mistakes: [
      'Dra inte i nacken med händerna.',
      'Undvik att använda fart – håll det kontrollerat.',
    ],
  },
  {
    i18nKey: 'exercise.lying_leg_raise',
    defaultName: 'Benlyft liggande',
    defaultDescription:
      'Tippa bäckenet bakåt; lyft raka ben utan att svanka; stoppa innan ländryggen börjar extendera.',
    muscleGroups: ['Mage', 'Höftböjare', 'Bål'],
    exerciseType: ExerciseType.BODYWEIGHT,
    equipment: [],
    instructions: [
      'Ligg på rygg med benen raka och händer under sätesmusklerna eller vid sidan.',
      'Tippa bäckenet bakåt så ländryggen pressas mot golvet.',
      'Lyft raka ben uppåt mot taket.',
      'Sänk kontrollerat – stoppa innan ländryggen börjar lyftas.',
    ],
    proTips: [
      'Håll ländryggen pressad mot golvet hela tiden.',
      'Böj lätt i knäna om du inte kan hålla dem raka.',
    ],
    mistakes: [
      'Svanka inte i ryggen vid nedre fasen.',
      'Undvik att sparka benen uppåt med fart.',
    ],
  },
  {
    i18nKey: 'exercise.side_lying_leg_raise_obliques',
    defaultName: 'Sidoliggande benlyft (sneda magmuskler)',
    defaultDescription:
      'Sidoliggande; lyft med sneda magmuskler, håll höfterna staplade och kontrollera tempot.',
    muscleGroups: ['Mage', 'Bål'],
    exerciseType: ExerciseType.BODYWEIGHT,
    equipment: [],
    instructions: [
      'Ligg på sidan med benen raka och höfterna staplade.',
      'Stöd huvudet med underarmen.',
      'Lyft det övre benet uppåt med kontroll.',
      'Sänk tillbaka utan att röra det undre benet.',
    ],
    proTips: [
      'Håll höfterna staplade rakt ovanför varandra.',
      'Kontrollera tempot – undvik snabba rörelser.',
    ],
    mistakes: [
      'Rulla inte bakåt med höfterna.',
      'Undvik att använda fart för att lyfta benet.',
    ],
  },
];
