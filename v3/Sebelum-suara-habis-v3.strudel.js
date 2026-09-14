/*
SEBELUM SUARA HABIS — v3 / TEKANAN
Post-hardcore / industrial / noise untuk spoken word.

144 BPM | 1 cycle = 5/3 detik | durasi 4:00.
EXPORT: start cycle 0, end cycle 144, cps 0.6.
MULAI_DETIK = 90 untuk mengecek transisi ke 01:40.

00:00       gitar overdrive dan drum langsung bergerak
00:13–00:40 riff patah, bass menyerang
00:40–01:07 riff baru dan snare makin mendesak
01:07–01:33 melodi tegang, gitar makin terbuka
01:33–01:40 pukulan bersama, putus singkat, feedback menggantung
01:40       ledakan gitar distorsi + noise berat, tepat detik 100
02:07–02:20 gerak cepat kembali, melodi menjawab
02:20–02:27 breakdown pendek: bass, pukulan rendah, gesekan
02:27–02:53 dorongan kedua dengan riff kromatik
02:53–03:20 tremolo dan drum lebih rapat
03:20–03:40 puncak terakhir: seruan gitar dan aksen berhenti bersama
03:40–03:53 hantaman penutup, akor terakhir menggantung
03:53–04:00 ekor efek

Tidak memakai gitar akustik atau cello.
Sampel GM, TR-909, snare dan tom tersedia di Strudel.
Internet dibutuhkan pada pemuatan pertama. Jika bunyi pertama terlewat,
tunggu sampel selesai dimuat lalu Stop dan Play lagi dari awal.
Tanpa visual dan vokal. MASTER, GITAR, DRUM, NOISE bisa diatur.
*/

const BPM = 144
const DETIK_PER_CYCLE = 240 / BPM
setcps(BPM / 240)

const MASTER = 0.56
const GITAR = 1.00
const DRUM = 1.00
const NOISE = 1.00
const MULAI_DETIK = 0

const kurva = (detik, titik) => {
  if (detik <= titik[0][0]) return titik[0][1]
  for (let i = 1; i < titik.length; i++) {
    const [a, va] = titik[i - 1]
    const [b, vb] = titik[i]
    if (detik <= b) return va + (vb - va) * (detik - a) / (b - a)
  }
  return titik[titik.length - 1][1]
}
const otomasi = (titik, skala = 1) =>
  signal(c => kurva(Number(c) * DETIK_PER_CYCLE, titik) * skala)

// Ruang pendek menjaga pukulan tegas; noise punya ruang sendiri.
const amp = p => p.roomsize(0.8).roomlp(3000).orbit(0)
const rendah = p => p.roomsize(0.6).roomlp(1300).orbit(1)
const kit = p => p.roomsize(0.8).roomlp(3400).orbit(2)
const ruangNoise = p => p.roomsize(1.6).roomlp(3100).orbit(3)

// Riff berganti kontur dan ritme. Register rendah memberi tekanan,
// sedangkan tema terakhir membuka rentang nada menuju klimaks.
const RIFF = [
  "<[d2 ~ d2 ~ d2 d2 f2 e2] [d2 ~ d2 d2 ~ d2 g2 f2] [bb2 ~ bb2 ~ bb2 bb2 a2 g2] [a2 ~ a2 a2 ~ a2 cs3 e3]>",
  "<[d2 d2 ~ d2 f2 ~ e2 d2] [f2 ~ f2 c3 f2 f2 e2 ~] [bb2 bb2 ~ bb2 d3 ~ c3 bb2] [a2 ~ a2 cs3 e3 g3 e3 cs3]>",
  "<[g2 ~ g2 [g2 a2] bb2 ~ a2 g2] [bb2 bb2 ~ f3 d3 ~ c3 bb2] [d2 ~ d2 [f2 e2] d2 d2 a2 ~] [a2 a2 ~ cs3 e3 ~ g3 e3]>",
  "<[d2 d2 ~ eb2 d2 ~ d2 ~] [eb2 ~ eb2 d2 ~ d2 f2 e2] [d2 ~ d2 [d2 d2] f2 ~ eb2 d2] [a2 ~ a2 cs3 e3 ~ a2 ~]>",
  "<[bb2 bb2 f3 bb2 d3 f3 d3 bb2] [c3 c3 g3 c3 e3 g3 e3 c3] [d3 d3 a3 d3 f3 a3 f3 d3] [a2 a2 e3 a2 cs3 e3 cs3 ~]>"
]
const AKAR = [
  "<d1 d1 bb1 a1>",
  "<d1 f1 bb1 a1>",
  "<g1 bb1 d1 a1>",
  "<d1 eb1 d1 a1>",
  "<bb1 c2 d2 a1>"
]

// mode 0: mute pendek; mode 1: serangan terbuka; mode 2: sustain lebar.
const riff = (tema = 0, mode = 0, v = 1) => {
  const p = note(RIFF[tema])
  return amp(
    stack(
      p.pan(0.16),
      p.add(note(7)).late(0.006).pan(0.84)
    ).s(mode === 0 ? "gm_overdriven_guitar" : "gm_distortion_guitar")
      .clip(mode === 0 ? 0.58 : mode === 1 ? 0.82 : 1.22)
      .attack(0.002).release(mode === 0 ? 0.055 : 0.15)
      .hpf(82).lpf(mode === 2 ? 4500 : 3500)
      .distort(mode === 0 ? "1.1:0.68" : "0.75:0.72")
      .gain("1 0.82 0.93 0.86 1 0.84 0.95 0.80".mul(0.29 * GITAR * v))
      .room(mode === 2 ? 0.18 : 0.08)
  )
}

const bass = (tema = 0, rapat = false, v = 1) => rendah(
  note(AKAR[tema])
    .struct(rapat
      ? "<[x x ~ x x ~ x x] [x ~ x x ~ x x ~]>"
      : "x ~ ~ x x ~ x ~")
    .s("gm_electric_bass_pick")
    .clip(0.85).attack(0.002).release(0.09)
    .hpf(30).lpf(1250).distort("0.9:0.62")
    .gain(0.39 * v).pan(0.5).room(0.025)
)

// Senar berulang pada nada panjang hanya muncul menjelang puncak.
// Aksen 8th/16th bergantian supaya tremolo tidak menjadi garis datar.
const tremolo = (v = 1) => amp(
  note("<[d4*8] [f4 f4 f4 f4 f4 f4 e4 e4] [d4 d4 d4 d4 c4 c4 c4 c4] [cs4 cs4 cs4 cs4 [e4 e4] [e4 e4] ~ ~]>")
    .s("gm_distortion_guitar")
    .clip(1.08).attack(0.004).release(0.13)
    .hpf(420).lpf(3900).distort("0.6:0.70")
    .gain("0.95 0.7 0.83 0.72".mul(0.12 * GITAR * v))
    .pan(0.73).room(0.24)
)

const MELODI = [
  "<[~ d4@2 f4 e4 ~ d4 ~] [~ f4@2 a4 g4 ~ f4 ~] [~ d4@2 f4 a4 ~ g4 ~] [e4@2 cs4@2 ~ a3 ~ ~]>",
  "<[~ bb4@2 a4 g4 ~ f4 ~] [~ g4@2 e4 d4 ~ c4 ~] [~ a4@2 f5 e5 ~ d5 ~] [e5@2 cs5@2 ~ a4 ~ ~]>"
]
const seruan = (tema = 0, v = 1) => ruangNoise(
  note(MELODI[tema]).s("gm_overdriven_guitar")
    .clip(1.15).attack(0.025).release(0.35)
    .hpf(350).lpf(4100).distort("1.0:0.65")
    .gain(0.16 * GITAR * v).pan(0.57)
    .delay(0.13).delaytime(0.3125).delayfeedback(0.24).room(0.26)
)

const feedback = (v = 1) => ruangNoise(
  note("<d4 e4 f4 cs4>").s("gm_distortion_guitar")
    .clip(1.2).attack(0.18).release(0.42)
    .vib(5.4).vibmod(0.12)
    .hpf(750).lpf(3800).distort("1.2:0.48")
    .pan(sine.slow(3).range(0.2, 0.8))
    .gain(0.09 * GITAR * v).room(0.40)
)

// 0: dorongan awal, 1: motor cepat, 2: hentakan setengah tempo,
// 3: puncak, 4: breakdown. Fill ditulis di ujung frase.
const KICK = [
  "<[x ~ ~ ~ x ~ x ~] [x ~ ~ x x ~ ~ ~] [x ~ ~ ~ x ~ x ~] [x ~ x ~ x ~ ~ x]>",
  "<[x ~ ~ x x ~ x ~] [x ~ x ~ x ~ ~ x] [x ~ ~ x x ~ x ~] [x ~ x x x ~ x ~]>",
  "<[x ~ ~ x ~ ~ x ~] [x ~ x ~ ~ ~ x x] [x ~ ~ x ~ ~ x ~] [x ~ x ~ x x ~ ~]>",
  "<[x ~ x x x ~ x ~] [x ~ ~ x x ~ x x] [x ~ x x x ~ x ~] [x x ~ x x ~ x ~]>",
  "<[x ~ ~ ~ x ~ ~ ~] [x ~ x ~ ~ ~ x ~]>"
]
const SNARE = [
  "<[~ x ~ x] [~ x ~ x] [~ x ~ x] [~ x ~ [x x]]>",
  "<[~ x ~ x] [~ x ~ x] [~ x ~ x] [~ x [~ x] [x x]]>",
  "<[~ ~ x ~] [~ ~ x ~] [~ ~ x ~] [~ ~ x [x x]]>",
  "<[~ x ~ x] [~ x [~ x] x] [~ x ~ x] [~ x [x x] [x x]]>",
  "<[~ ~ x ~] [~ x ~ x]>"
]
const TOMS = [
  "<[~] [~] [~] [~ ~ ~ [x x]]>",
  "<[~] [~] [~] [~ ~ [x x] [x x]]>",
  "<[x ~ ~ ~] [~ ~ ~ x] [x ~ ~ ~] [~ ~ x [x x]]>",
  "<[~ ~ ~ x] [~] [~ ~ ~ x] [~ [x x] [x x x] ~]>",
  "<[x ~ ~ x] [x ~ [x x] ~]>"
]

const drum = (mode = 0, v = 1) => kit(
  stack(
    s("tr909_bd:1").struct(KICK[mode])
      .decay(0.19).release(0.04).lpf(4200).gain(0.82 * DRUM * v),
    s("snare_low:4").struct(SNARE[mode])
      .hpf(120).lpf(5800).gain(0.66 * DRUM * v),
    s("white").struct(SNARE[mode])
      .attack(0.001).decay(0.085).sustain(0).release(0.02)
      .hpf(2300).lpf(6800).gain(0.105 * DRUM * v),
    s("tom_stick:2").struct(TOMS[mode])
      .speed("<0.95 0.84 0.95 0.72>").lpf(2500)
      .pan("<0.28 0.65 0.4 0.58>").gain(0.45 * DRUM * v)
  ).room(0.11)
)

const hat = (rapat = false, v = 1) => kit(
  s(rapat ? "tr909_hh:1*16" : "tr909_hh:1*8")
    .hpf(3400).lpf(7800).decay(0.07).release(0.025)
    .gain("0.85 0.53 1 0.58".mul(0.11 * DRUM * v))
    .pan(0.65).room(0.035)
)
const buka = (v = 1) => kit(
  s("<[~ tr909_oh:1 ~ tr909_oh:1] [~ tr909_oh:1 ~ ~]>")
    .hpf(2500).lpf(7500).decay(0.23).release(0.07)
    .gain(0.16 * DRUM * v).pan(0.34).room(0.08)
)

// Stop bersama di akhir empat bar menyisakan celah untuk seruan vokal.
// Event baru ditahan pada setengah ketuk terakhir; ekor bunyi tetap hidup.
const patah = p => p.filterWhen(t => {
  const c = Number(t)
  return !(Math.floor(c) % 4 === 3 && c % 1 >= 0.875)
})

// Noise berat masuk tepat cycle 60 = 100 detik.
// Breakdown tetap menekan; gelombang terakhir paling tebal.
const TEKANAN = [
  [100, 0.90], [120, 1.15], [135, 1.10], [140, 0.45],
  [146.667, 0.70], [160, 1.10], [173.333, 1.40],
  [195, 1.55], [200, 1.45], [216.667, 1.85],
  [220, 1.10], [230, 0.32], [233.333, 0]
]
const noiseBerat = stack(
  ruangNoise(
    s("<[pink@2 ~ pink ~ pink@3] [pink ~ pink@2 pink ~ pink ~]>")
      .attack(0.025).decay(0.16).sustain(0.70).release(0.32)
      .hpf(850)
      .lpf(otomasi([[100, 3600], [140, 2800], [173.333, 5000], [216.667, 6200], [233.333, 1500]]))
      .distort("1.8:0.56")
      .pan("<0.12 0.88 0.28 0.72>")
      .gain(otomasi(TEKANAN, 0.18 * NOISE)).room(0.27)
  ),
  rendah(
    s("brown*2")
      .attack(0.05).decay(0.15).sustain(0.72).release(0.40)
      .hpf(42).lpf(sine.slow(4).range(240, 500))
      .distort("1.3:0.52")
      .gain(otomasi(TEKANAN, 0.22 * NOISE)).pan(0.5).room(0.08)
  )
).filterWhen(t => Number(t) >= 60 && Number(t) < 140)

const hantam = kit(
  s("tr909_cr:2").hpf(1500).lpf(7200)
    .decay(0.85).release(0.25).gain(0.36 * DRUM).room(0.18)
).filterWhen(t => [0, 8, 24, 40, 60, 76, 104, 112, 120, 128, 132, 136].includes(Number(t)))

const pukulanBersama = amp(
  note("[a2,e3] ~ [a2,e3] ~").s("gm_distortion_guitar")
    .clip(0.68).attack(0.002).release(0.08)
    .hpf(85).lpf(4000).distort("1.2:0.7")
    .gain(0.27 * GITAR).room(0.09)
)
const napasPendek = ruangNoise(
  note("[a3,bb3]").s("gm_distortion_guitar")
    .clip(0.45).attack(0.015).release(0.20)
    .hpf(450).lpf(3400).gain(0.10 * GITAR).room(0.35)
)
const akorTerakhir = amp(
  note("[d2,a2,d3]").slow(4).s("gm_distortion_guitar")
    .clip(0.85).attack(0.003).release(1.0)
    .hpf(85).lpf(4200).distort("0.95:0.64")
    .gain(0.29 * GITAR).room(0.25)
)

const bab = [
  // c0–8 | 00:00–00:13.33: langsung bergerak
  [8, stack(riff(0, 0, 0.90), bass(0, false, 0.85), drum(0, 0.90), hat(false, 0.85))],

  // c8–24 | 00:13.33–00:40: riff pertama menyerang
  [16, stack(patah(riff(1, 0, 1.0)), bass(1, true, 0.95), drum(1, 0.98), hat(false, 1.0))],

  // c24–40 | 00:40–01:06.67: harmoni dan riff berganti
  [16, stack(riff(2, 1, 0.97), bass(2, true, 1.0), drum(1, 1.0), hat(true, 0.9), buka(0.7))],

  // c40–56 | 01:06.67–01:33.33: senar terbuka dan melodi menjawab
  [16, stack(riff(1, 1, 1.0), bass(1, true, 1.0), drum(1, 1.04),
    seruan(0, 0.75), hat(true, 0.95), buka(0.9))],

  // c56–59 | 01:33.33–01:38.33: pukulan bersama
  [3, stack(pukulanBersama, drum(4, 1.0), feedback(0.7))],

  // c59–60 | 01:38.33–01:40: putus pendek sebelum ledakan
  [1, napasPendek],

  // c60–76 | 01:40–02:06.67: hentakan berat lalu dorongan cepat
  [16, arrange(
    [8, stack(riff(0, 2, 1.12), bass(0, true, 1.12), drum(2, 1.10),
      feedback(0.9), hat(false, 1.0), buka(1.0))],
    [8, stack(riff(1, 2, 1.12), bass(1, true, 1.12), drum(1, 1.10),
      feedback(0.9), hat(true, 0.95), buka(1.0))]
  )],

  // c76–84 | 02:06.67–02:20: ritme cepat kembali
  [8, stack(riff(2, 1, 1.12), bass(2, true, 1.10), drum(1, 1.12),
    seruan(0, 0.9), hat(true, 1.0), buka(1.0))],

  // c84–88 | 02:20–02:26.67: breakdown, tetap keras
  [4, stack(riff(3, 0, 1.15), bass(3, false, 1.18), drum(4, 1.18), feedback(1.0))],

  // c88–104 | 02:26.67–02:53.33: dorongan kedua
  [16, stack(patah(riff(3, 1, 1.12)), bass(3, true, 1.12), drum(1, 1.14),
    tremolo(0.65), hat(true, 1.0), buka(1.0))],

  // c104–120 | 02:53.33–03:20: puncak kedua
  [16, stack(riff(4, 2, 1.18), bass(4, true, 1.15), drum(3, 1.16),
    tremolo(1.0), feedback(1.05), hat(true, 1.0), buka(1.05))],

  // c120–132 | 03:20–03:40: deklarasi terakhir
  [12, stack(patah(riff(4, 2, 1.22)), patah(bass(4, true, 1.20)),
    patah(drum(3, 1.20)), seruan(1, 1.15), feedback(1.15),
    patah(hat(true, 1.05)), buka(1.10))],

  // c132–140 | 03:40–03:53.33: runtuh lewat hantaman, lalu akor terakhir
  [8, arrange(
    [4, stack(riff(0, 2, 1.08), bass(0, false, 1.1), drum(2, 1.1), feedback(1.0))],
    [4, akorTerakhir]
  )],

  // c140–144 | 03:53.33–04:00
  [4, silence]
]

const DINAMIKA = [
  [0, 0.94], [40, 0.98], [66.667, 1.0], [93.333, 1.0],
  [100, 1.08], [140, 1.02], [146.667, 1.05],
  [173.333, 1.12], [200, 1.15], [216.667, 1.18],
  [220, 1.08], [230, 0.90], [233.333, 0.15], [240, 0]
]
const lagu = stack(arrange(...bab), noiseBerat, hantam)
  .filterWhen(t => Number(t) >= 0 && Number(t) < 140)
  .postgain(otomasi(DINAMIKA, MASTER))

$: lagu.early(MULAI_DETIK / DETIK_PER_CYCLE)
