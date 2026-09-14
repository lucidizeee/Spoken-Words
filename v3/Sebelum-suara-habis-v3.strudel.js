/*
SEBELUM SUARA HABIS — v3, revisi dinamika
Folk gelap / spoken word / crescendo gitar dan noise.

96 BPM, 4 ketuk per cycle. 1 cycle = 2.5 detik.
Durasi 4:00. Export: start 0, end 96, cps 0.4.
MULAI_DETIK = 90 untuk mengecek jeda dan ledakan 01:40.

00:00–00:10  petikan pembuka
00:10–00:30  tema pertama, cello menjawab
00:30–00:50  tema berubah; harmoni mulai menegang
00:50–01:10  perkusi tangan masuk
01:10–01:30  desakan pertama
01:30–01:40  akor menggantung, lalu satu bar menahan napas
01:40–02:00  ledakan pertama, gitar kasar dan noise
02:00–02:20  kalimat melodi baru, ritme makin mendesak
02:20–02:30  runtuh sejenak: ruang untuk kalimat penting
02:30–02:50  membangun lagi dari pukulan rendah
02:50–03:10  klimaks kedua, motif naik register
03:10–03:30  deklarasi terakhir; puncak terbesar
03:30–03:50  motif pembuka kembali dalam bentuk renggang
03:50–04:00  ekor efek

Gitar dan cello memakai sampel GM; perkusi memakai VCSL bawaan Strudel.
Sampel memerlukan internet saat pertama dimuat. Jika petikan awal terlewat
pada pemutaran pertama, tunggu pemuatan selesai lalu Stop dan Play lagi.
Tanpa visual, tanpa vokal. Semua motif ditulis khusus untuk aransemen ini.
*/

const BPM = 96
const DETIK_PER_CYCLE = 240 / BPM
setcps(BPM / 240)

const MASTER = 0.64
const GITAR = 1.00
const DRUM = 0.90
const NOISE = 0.85
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

// Empat ruang tetap: gitar, cello, perkusi, lalu distorsi/noise.
const ruangGitar = p => p.roomsize(1.3).roomlp(3000).orbit(0)
const ruangCello = p => p.roomsize(1.7).roomlp(2200).orbit(1)
const ruangPukul = p => p.roomsize(0.9).roomlp(2500).orbit(2)
const ruangPecah = p => p.roomsize(1.8).roomlp(2800).orbit(3)

// Harmoni berganti menurut bab. C# pada akor A menarik kembali ke D minor.
const H = [
  {
    bass: "<d2 bb1 g1 a1>",
    rendah: "<d3 bb2 g2 a2>",
    tengah: "<a3 f3 d3 e3>",
    atas: "<f4 d4 bb3 cs4>"
  },
  {
    bass: "<f2 c2 bb1 a1>",
    rendah: "<f3 c3 bb2 a2>",
    tengah: "<c4 g3 f3 e3>",
    atas: "<a4 e4 d4 cs4>"
  },
  {
    bass: "<bb1 c2 d2 a1>",
    rendah: "<bb2 c3 d3 a2>",
    tengah: "<f3 g3 a3 e3>",
    atas: "<d4 e4 f4 cs4>"
  },
  {
    bass: "<g1 bb1 d2 a1>",
    rendah: "<g2 bb2 d3 a2>",
    tengah: "<d3 f3 a3 e3>",
    atas: "<bb3 d4 f4 cs4>"
  }
]

const PETIK = [
  // Awal: kalimat pendek dengan akhir yang kosong.
  "<[d3 ~ a3 d4 ~ f4 e4 ~] [bb2 ~ f3 bb3 ~ d4 c4 ~] [g2 ~ d3 g3 ~ bb3 a3 ~] [a2 ~ e3 a3 ~ cs4 e4 ~]>",
  // Tema pertama: bass bergantian, suara atas bergerak.
  "<[d3 a3 d4 f4 e4 d4 a3 ~] [bb2 f3 bb3 d4 f4 d4 c4 ~] [g2 d3 g3 bb3 d4 bb3 a3 ~] [a2 e3 a3 cs4 e4 g4 e4 cs4]>",
  // Tema kedua: jawaban naik, kadens lebih tegas.
  "<[f3 c4 f4 a4 g4 f4 c4 ~] [c3 g3 c4 e4 g4 e4 d4 ~] [bb2 f3 bb3 d4 f4 e4 d4 ~] [a2 e3 a3 cs4 e4 g4 e4 cs4]>",
  // Rebuild: motif yang sama diputar menjadi tangga menuju puncak.
  "<[bb2 f3 bb3 d4 f4 d4 bb3 d4] [c3 g3 c4 e4 g4 e4 c4 e4] [d3 a3 d4 f4 a4 f4 e4 d4] [a2 e3 a3 cs4 e4 g4 e4 cs4]>",
  // Kepulangan: sisa frase, bukan pengulangan penuh.
  "<[d3@2 ~ a3 ~ d4 ~ ~] [bb2@2 ~ f3 ~ d4 ~ ~] [g2@2 ~ d3 ~ bb3 ~ ~] [d3@3 ~ a3@2 d4 ~]>"
]

const petik = (tema = 1, v = 1) => ruangGitar(
  note(PETIK[tema]).s("gm_acoustic_guitar_steel")
    .clip(1.65).attack(0.003).release(0.22)
    .hpf(95).lpf(3600)
    .gain("1 0.70 0.86 0.76 0.95 0.71 0.83 0.63".mul(0.40 * GITAR * v))
    .pan(0.38).room(0.22)
)

// Tiap senar dipukul berurutan dengan jarak 15 ms.
// Perubahan pola petikan -> strum menjadi salah satu penggerak emosi.
const strum = (harmoni = 0, rapat = false, v = 1) => {
  const h = H[harmoni]
  const ritme = rapat
    ? "<[x ~ x x ~ x x x] [x ~ x x x x ~ x] [x ~ x x ~ x x x] [x ~ x x x x x ~]>"
    : "<[x ~ ~ x ~ ~ x ~] [x ~ ~ x ~ x ~ ~] [x ~ ~ x ~ ~ x ~] [x ~ ~ x ~ x x ~]>"
  return ruangGitar(
    stack(
      note(h.rendah).struct(ritme).pan(0.28),
      note(h.tengah).struct(ritme).late(0.006).pan(0.42),
      note(h.atas).struct(ritme).late(0.012).pan(0.57)
    ).s("gm_acoustic_guitar_steel")
      .clip(1.15).attack(0.003).release(0.18)
      .hpf(110).lpf(rapat ? 4200 : 3000)
      .gain(perlin.slow(3).range(0.82, 1).mul(0.17 * GITAR * v))
      .room(0.17)
  )
}

const CELLO = [
  "<[~ d3@3] [f3@2 e3 d3] [bb2@2 d3 e3] [cs3@3 ~]>",
  "<[a3@2 g3 f3] [e3@3 g3] [f3@2 d3 f3] [e3@2 cs3 a2]>",
  "<[d4@2 c4 a3] [g3@2 a3 c4] [a3@2 f3 d3] [e3@2 cs3 ~]>",
  "<[bb3@2 a3 g3] [f3@2 a3 d4] [f4@2 e4 d4] [cs4@2 e4 ~]>"
]
const cello = (tema = 0, v = 1) => ruangCello(
  note(CELLO[tema]).s("gm_cello")
    .clip(1.05).attack(0.14).release(0.38)
    .hpf(115).lpf(2300)
    .gain(0.22 * v).pan(0.66).room(0.32)
)

const bass = (harmoni = 0, jalan = false, v = 1) => ruangPukul(
  note(H[harmoni].bass)
    .struct(jalan ? "x ~ ~ x x ~ x ~" : "x ~ ~ ~ x ~ ~ ~")
    .s("gm_acoustic_bass")
    .clip(1.25).attack(0.005).release(0.14)
    .hpf(36).lpf(900).gain(0.38 * v).pan(0.5).room(0.06)
)

// Gitar listrik baru hadir setelah ledakan pertama.
// Dyad rendah memberi badan; senar atas datang terlambat 20 ms.
const kasar = (harmoni = 0, rapat = false, v = 1) => {
  const h = H[harmoni]
  const ritme = rapat
    ? "<[x x x x x x x x] [x x x x x x x ~]>"
    : "x ~ ~ x x ~ x ~"
  return ruangPecah(
    stack(
      note(h.rendah).struct(ritme).pan(0.16),
      note(h.tengah).struct(ritme).late(0.008).pan(0.84)
    ).s("gm_electric_guitar_clean")
      .clip(1.35).attack(0.006).release(0.30)
      .hpf(160).lpf(rapat ? 3300 : 2600)
      .distort("1.25:0.40")
      .gain(0.21 * GITAR * v).room(0.26)
  )
}

// Jawaban tinggi hanya muncul di puncak, dengan ujung frase yang beristirahat.
const seruan = (v = 1) => ruangPecah(
  note("<[~ a4 d5@2 f5@2 e5 ~] [~ g4 c5@2 e5@2 d5 ~] [~ a4 d5@2 f5 e5 d5 ~] [e5@2 cs5@2 a4@2 ~ ~]>")
    .s("gm_electric_guitar_clean")
    .clip(1.2).attack(0.045).release(0.5)
    .hpf(400).lpf(3400).distort("0.85:0.35")
    .gain(0.16 * GITAR * v).pan(0.62)
    .delay(0.18).delaytime(0.46875).delayfeedback(0.26).room(0.35)
)

// Perkusi akustik: empat tingkat kepadatan; fill ada di akhir frase.
const KICK = [
  "<[x ~ ~ ~] [x ~ ~ ~] [x ~ ~ ~] [x ~ x ~]>",
  "<[x ~ ~ ~ x ~ ~ ~] [x ~ ~ x ~ ~ x ~] [x ~ ~ ~ x ~ ~ ~] [x ~ ~ x x ~ x ~]>",
  "<[x ~ ~ x x ~ ~ ~] [x ~ x ~ ~ ~ x ~] [x ~ ~ x x ~ ~ ~] [x ~ x ~ x ~ x ~]>",
  "<[x ~ ~ x x ~ x ~] [x ~ x ~ x ~ ~ x] [x ~ ~ x x ~ x ~] [x ~ x ~ x ~ x ~]>"
]
const TANGAN = [
  "<[~ ~ x ~] [~ x ~ ~] [~ ~ x ~] [~ x ~ x]>",
  "<[~ x ~ x] [~ x ~ x] [~ x ~ x] [~ x [x x] x]>",
  "<[~ x ~ x] [~ x ~ x] [~ x ~ x] [~ x x [x x]]>",
  "<[~ x ~ x] [~ x ~ x] [~ x ~ x] [~ x [x x] [x x]]>"
]
const TOM = [
  "<[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ x x]>",
  "<[x ~ ~ ~ ~ ~ x ~] [~ ~ x ~ ~ ~ x ~] [x ~ ~ ~ ~ ~ x ~] [~ ~ x ~ x x x ~]>",
  "<[x ~ ~ x ~ ~ x ~] [x ~ x ~ ~ ~ x ~] [x ~ ~ x ~ ~ x ~] [~ ~ x x x x [x x] ~]>",
  "<[x ~ ~ x ~ ~ x ~] [x ~ x ~ ~ x x ~] [x ~ ~ x ~ ~ x ~] [x ~ x x x x [x x x] ~]>"
]
const perkusi = (tingkat = 0, v = 1) => ruangPukul(
  stack(
    s("bassdrum1:3").struct(KICK[tingkat])
      .lpf(1600).gain(0.62 * DRUM * v),
    s(tingkat < 2 ? "cajon:4" : "snare_low:4").struct(TANGAN[tingkat])
      .hpf(140).lpf(tingkat < 2 ? 2400 : 3900)
      .gain((tingkat < 2 ? 0.32 : 0.35) * DRUM * v),
    s("tom_stick:2").struct(TOM[tingkat])
      .speed("<0.86 0.96 0.86 0.72>").lpf(2000)
      .pan("<0.30 0.65 0.38 0.58>").gain(0.37 * DRUM * v)
  ).room(0.16)
)

const shaker = (v = 1) => ruangPukul(
  s("shaker_small:3*8")
    .hpf(2800).lpf(6700)
    .gain("0.7 1 0.65 0.85 0.7 1 0.65 0.9".mul(0.12 * DRUM * v))
    .pan(0.70).room(0.08)
)

const napas = (v = 1) => ruangCello(
  s("brown").slow(2)
    .attack(1.0).sustain(0.55).release(0.8)
    .hpf(250).lpf(950).gain(0.032 * NOISE * v).room(0.22)
)

// Noise bergerak dalam gelombang, dengan cekungan jelas di 02:20.
// Volume, panjang sapuan, dan warna berubah bersama perkembangan band.
const GELOMBANG = [
  [100, 0.60], [110, 0.85], [120, 0.60], [137.5, 1.00],
  [140, 0.08], [147.5, 0.05], [150, 0.16], [165, 0.68],
  [170, 1.05], [187.5, 1.18], [190, 1.20], [207.5, 1.45],
  [210, 0.38], [220, 0.12], [230, 0]
]
const tekanan = stack(
  ruangPecah(
    s("<[pink ~ ~ pink] [pink ~ pink ~]>")
      .attack(0.05).decay(0.20).sustain(0.60).release(0.85)
      .hpf(1000)
      .lpf(otomasi([[100, 2700], [140, 1800], [170, 4100], [205, 5500], [230, 1200]]))
      .distort("1.40:0.44")
      .pan("<0.18 0.82 0.32 0.68>")
      .gain(otomasi(GELOMBANG, 0.19 * NOISE)).room(0.30)
  ),
  ruangPecah(
    s("brown*2")
      .attack(0.15).decay(0.2).sustain(0.64).release(0.7)
      .hpf(45).lpf(sine.slow(5).range(260, 480))
      .distort("0.95:0.42")
      .gain(otomasi(GELOMBANG, 0.22 * NOISE)).pan(0.5).room(0.14)
  )
).filterWhen(t => Number(t) >= 40 && Number(t) < 92)

// Pukulan cymbal menandai ledakan; tidak terus berulang sepanjang lagu.
const tanda = ruangPecah(
  s("sus_cymbal:8")
    .attack(0.002).release(1.6).hpf(1700).lpf(6200)
    .gain(0.23 * DRUM).room(0.30)
).filterWhen(t => [40, 48, 68, 76, 80, 84].includes(Number(t)))

// Tiga bar dominan sebelum 01:40. Bar keempat menyisakan bunyi yang menggantung.
const tahan = ruangGitar(
  note("<[a2 e3 g3 cs4 e4 g4 e4 cs4] [a2 e3 a3 cs4 e4 g4 a4 g4] [a2 e3 g3 cs4 e4 g4 cs5 e5]>")
    .s("gm_acoustic_guitar_steel").clip(1.3).release(0.15)
    .hpf(110).lpf(4000).gain(0.28 * GITAR).room(0.18)
)
const menggantung = ruangCello(
  note("[a2,e3,bb3]").s("gm_cello")
    .attack(0.07).sustain(0.6).release(0.35)
    .lpf(1900).gain(0.12).room(0.30)
)

const bab = [
  // c0–4 | 00:00–00:10
  [4, stack(petik(0, 0.75), napas(0.6))],

  // c4–12 | 00:10–00:30
  [8, stack(petik(1, 0.92), cello(0, 0.65), bass(0, false, 0.50))],

  // c12–20 | 00:30–00:50
  [8, stack(petik(2, 0.95), cello(1, 0.72), bass(1, false, 0.65), perkusi(0, 0.50))],

  // c20–28 | 00:50–01:10
  [8, stack(strum(0, false, 0.85), petik(1, 0.60), cello(0, 0.75),
    bass(0, true, 0.75), perkusi(1, 0.65), shaker(0.60))],

  // c28–36 | 01:10–01:30
  [8, stack(strum(2, true, 0.95), petik(3, 0.65), cello(2, 0.88),
    bass(2, true, 0.85), perkusi(1, 0.85), shaker(0.80))],

  // c36–39 | 01:30–01:37.5
  [3, stack(tahan, perkusi(1, 0.75))],

  // c39–40 | 01:37.5–01:40: ritme hilang satu bar
  [1, menggantung],

  // c40–48 | 01:40–02:00: ledakan pertama
  [8, stack(strum(0, true, 1.05), kasar(0, false, 0.72), cello(0, 0.80),
    bass(0, true, 1.0), perkusi(2, 0.95), shaker(0.80))],

  // c48–56 | 02:00–02:20: tema baru lebih tinggi
  [8, stack(strum(1, true, 1.10), petik(2, 0.62), kasar(1, false, 0.82),
    cello(1, 0.90), bass(1, true, 1.0), perkusi(2, 1.0), shaker(0.90))],

  // c56–60 | 02:20–02:30: tarik mundur untuk satu kalimat
  [4, stack(petik(0, 0.50), cello(0, 0.48), napas(1.0))],

  // c60–68 | 02:30–02:50: bangun kembali
  [8, stack(petik(3, 0.85), strum(2, false, 0.80), cello(2, 0.80),
    bass(2, true, 0.85), perkusi(1, 0.80))],

  // c68–76 | 02:50–03:10: klimaks kedua
  [8, stack(strum(3, true, 1.05), kasar(3, true, 1.0), cello(3, 0.95),
    bass(3, true, 1.0), perkusi(3, 1.05), shaker(1.0))],

  // c76–84 | 03:10–03:30: deklarasi terakhir
  [8, stack(strum(2, true, 1.12), kasar(2, true, 1.10), seruan(1.0),
    cello(2, 0.85), bass(2, true, 1.05), perkusi(3, 1.15), shaker(1.0))],

  // c84–92 | 03:30–03:50: sisa suara
  [8, stack(petik(4, 0.65), cello(0, 0.50), bass(0, false, 0.30), napas(0.75))],

  // c92–96 | 03:50–04:00: biarkan ekor efek selesai
  [4, silence]
]

const DINAMIKA = [
  [0, 0.78], [30, 0.83], [50, 0.87], [70, 0.92], [90, 0.96],
  [100, 1.0], [137.5, 1.0], [140, 0.73], [150, 0.78],
  [170, 1.0], [190, 1.03], [207.5, 1.08],
  [210, 0.82], [220, 0.55], [230, 0], [240, 0]
]
const lagu = stack(arrange(...bab), tekanan, tanda)
  .filterWhen(t => Number(t) >= 0 && Number(t) < 92)
  .postgain(otomasi(DINAMIKA, MASTER))

$: lagu.early(MULAI_DETIK / DETIK_PER_CYCLE)
