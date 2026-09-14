/*
SEBELUM SUARA HABIS — v3 / GELOMBANG
Pelan dan tegang -> menumpuk -> meledak -> surut -> meledak lebih besar.
Tekstur elektrik / post-hardcore / noise untuk spoken word.

Grid 144 BPM; awal terasa lambat lewat nada panjang dan denyut renggang.
1 cycle = 5/3 detik. Durasi 4:00.
EXPORT: start cycle 0, end cycle 144, cps 0.6.
MULAI_DETIK = 90 untuk mengecek ledakan pertama.

00:00–00:20 gitar elektrik tipis, dengung rendah; tanpa drum
00:20–00:40 denyut jarang, motif mulai bergerak
00:40–01:00 ketegangan tumbuh, masih tertahan
01:00–01:20 riff teredam dan drum setengah tempo masuk pelan
01:20–01:38 dorongan makin rapat, volume dan warna terbuka
01:38–01:40 menahan napas
01:40–02:00 LEDAKAN 1: gitar, drum penuh, noise berat
02:00–02:07 surut: dengung, sisa senar, ruang untuk kata
02:07–02:27 LEDAKAN 2: melodi lebih tinggi, noise lebih tebal
02:27–02:40 surut lagi, lalu merangkak naik
02:40–02:53 LEDAKAN 3: riff kromatik, aksen terputus
02:53–03:00 tarikan napas terakhir
03:00–03:27 KLIMAKS: tremolo, seruan, drum rapat
03:27–03:30 putus singkat
03:30–03:50 LEDAKAN TERAKHIR: paling padat dan paling berat
03:50–04:00 akor penutup dan ekor efek

Noise berat hanya dimainkan dalam jendela ledakan.
Pada bagian surut, tidak ada pemicu noise berat baru; ekor efek dibiarkan luruh.
Sampel GM, TR-909, snare dan tom tersedia di Strudel.
Internet dibutuhkan pada pemuatan pertama. Jika bunyi awal terlewat,
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

// Awal dan bagian surut memakai senar elektrik panjang, bukan riff cepat.
const BAYANG = [
  "<[d3@2 ~ a3 ~ e4 ~ ~] [bb2@2 ~ f3 ~ d4 ~ ~] [g2@2 ~ d3 ~ a3 ~ ~] [a2@2 ~ e3 ~ cs4 ~ ~]>",
  "<[d3@2 ~ f4 e4 ~ d4 ~] [bb2@2 ~ d4 f4 ~ e4 ~] [g2@2 ~ bb3 d4 ~ a3 ~] [a2@2 ~ e4 cs4 ~ a3 ~]>"
]
const bayang = (tema = 0, v = 1, lambat = 2) => amp(
  note(BAYANG[tema]).slow(lambat).s("gm_electric_guitar_clean")
    .clip(1.5).attack(0.07).release(0.60)
    .hpf(120).lpf(1900).distort("0.3:0.80")
    .gain(0.25 * GITAR * v).pan(0.38)
    .delay(0.25).delaytime(0.625).delayfeedback(0.32).room(0.32)
)
const bawah = (v = 1) => rendah(
  note("<[d2,a2] [bb1,f2] [g2,d3] [a2,e3]>").slow(2)
    .s("gm_overdriven_guitar")
    .clip(0.90).attack(0.8).sustain(0.60).release(0.8)
    .hpf(55).lpf(700).gain(0.042 * GITAR * v).room(0.16)
)
const udara = (v = 1) => ruangNoise(
  s("brown").slow(2)
    .attack(1.0).decay(0.3).sustain(0.5).release(0.70)
    .hpf(180).lpf(850).gain(0.033 * NOISE * v).room(0.24)
)
const denyut = (v = 1) => kit(
  s("tr909_bd:1 ~ ~ ~").slow(2)
    .attack(0.005).decay(0.18).release(0.06)
    .lpf(280).gain(0.29 * DRUM * v).room(0.04)
)

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

// Jendela ledakan dalam cycle. Semua mengikuti grid yang sama dengan band.
// Noise benar-benar berhenti dipicu di sela gelombang.
const GELOMBANG = [[60, 72], [76, 88], [96, 104], [108, 124], [126, 138]]
const dalamGelombang = t =>
  GELOMBANG.some(([awal, akhir]) => Number(t) >= awal && Number(t) < akhir)
const TEKANAN = [
  [100, 0.82], [110, 1.05], [118.333, 0.98],
  [126.667, 1.12], [140, 1.28], [145, 1.20],
  [160, 1.32], [171.667, 1.42],
  [180, 1.42], [200, 1.63], [205, 1.60],
  [210, 1.70], [223.333, 1.88], [228.333, 1.72], [230, 0]
]
const noiseBerat = stack(
  ruangNoise(
    s("<[pink@2 ~ pink ~ pink@3] [pink ~ pink@2 pink ~ pink ~]>")
      .attack(0.025).decay(0.16).sustain(0.70).release(0.32)
      .hpf(850)
      .lpf(otomasi([[100, 3400], [140, 4200], [171.667, 4700], [200, 5400], [223.333, 6200], [230, 4200]]))
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
).filterWhen(dalamGelombang)

const hantam = kit(
  s("tr909_cr:2").hpf(1500).lpf(7200)
    .decay(0.85).release(0.25).gain(0.36 * DRUM).room(0.18)
).filterWhen(t => [60, 64, 76, 80, 96, 100, 108, 116, 126, 130, 134, 138].includes(Number(t)))

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
  note("[d2,a2,d3]").slow(2).s("gm_distortion_guitar")
    .clip(0.75).attack(0.003).release(1.0)
    .hpf(85).lpf(4200).distort("0.95:0.64")
    .gain(0.29 * GITAR).room(0.25)
)

const bab = [
  // c0–12 | 00:00–00:20: pelan; biarkan kalimat pertama berdiri sendiri
  [12, stack(bayang(0, 0.82), bawah(0.65), udara(0.65))],

  // c12–24 | 00:20–00:40: motif berubah, denyut masih jauh
  [12, stack(bayang(1, 0.90), bawah(0.75), udara(0.75), denyut(0.55))],

  // c24–36 | 00:40–01:00: gerak senar lebih dekat
  [12, stack(bayang(0, 0.95, 1), bawah(0.85), udara(0.90), denyut(0.80))],

  // c36–48 | 01:00–01:20: bayangan riff dan drum, belum dilepas
  [12, stack(bayang(1, 0.72), riff(0, 0, 0.30).slow(2),
    bass(0, false, 0.42).slow(2), drum(0, 0.32).slow(2), udara(0.95))],

  // c48–56 | 01:20–01:33.33: tekanan makin mendesak
  [8, stack(riff(1, 0, 0.57), bass(1, false, 0.62),
    drum(1, 0.48), hat(false, 0.42), feedback(0.25))],

  // c56–59 | 01:33.33–01:38.33: pukulan singkat mengunci ketegangan
  [3, stack(pukulanBersama, drum(4, 0.65), feedback(0.38))],

  // c59–60 | 01:38.33–01:40: tahan napas
  [1, stack(napasPendek, udara(0.45))],

  // c60–72 | 01:40–02:00: LEDAKAN 1
  [12, arrange(
    [4, stack(riff(0, 2, 1.0), bass(0, true, 1.0), drum(2, 1.0),
      feedback(0.72), hat(false, 0.85), buka(0.85))],
    [8, stack(riff(1, 2, 1.03), bass(1, true, 1.02), drum(1, 1.04),
      feedback(0.80), hat(true, 0.88), buka(0.90))]
  )],

  // c72–76 | 02:00–02:06.67: surut jelas, tanpa kit penuh
  [4, stack(bayang(1, 0.72, 1), bawah(0.80), udara(1.0), feedback(0.22))],

  // c76–88 | 02:06.67–02:26.67: LEDAKAN 2, tema berbeda
  [12, stack(riff(2, 2, 1.08), bass(2, true, 1.08), drum(1, 1.10),
    seruan(0, 0.90), hat(true, 0.96), buka(0.98))],

  // c88–96 | 02:26.67–02:40: jatuh, lalu bangun dari tekanan rendah
  [8, arrange(
    [4, stack(bayang(0, 0.60), bawah(0.90), udara(1.05), feedback(0.27))],
    [4, stack(riff(3, 0, 0.42), bass(3, false, 0.60),
      drum(4, 0.45), feedback(0.40), udara(1.0))]
  )],

  // c96–104 | 02:40–02:53.33: LEDAKAN 3, pendek dan patah
  [8, stack(patah(riff(3, 1, 1.10)), bass(3, true, 1.10), drum(1, 1.13),
    tremolo(0.72), hat(true, 1.0), buka(1.0))],

  // c104–108 | 02:53.33–03:00: surut dan ancang-ancang terakhir
  [4, arrange(
    [2, stack(bayang(1, 0.55, 1), bawah(0.90), feedback(0.30), udara(1.10))],
    [2, stack(riff(3, 0, 0.48), bass(3, false, 0.60),
      drum(4, 0.58), feedback(0.45))]
  )],

  // c108–124 | 03:00–03:26.67: KLIMAKS, terus membesar
  [16, arrange(
    [8, stack(riff(4, 2, 1.15), bass(4, true, 1.13), drum(3, 1.13),
      tremolo(0.95), feedback(0.95), hat(true, 1.0), buka(1.0))],
    [8, stack(patah(riff(4, 2, 1.19)), bass(4, true, 1.16), drum(3, 1.17),
      seruan(1, 1.05), feedback(1.05), hat(true, 1.03), buka(1.05))]
  )],

  // c124–126 | 03:26.67–03:30: satu tarikan napas sebelum pecah terakhir
  [2, stack(bawah(1.0), feedback(0.36), udara(1.1))],

  // c126–138 | 03:30–03:50: LEDAKAN TERAKHIR, paling padat
  [12, stack(patah(riff(4, 2, 1.24)), patah(bass(4, true, 1.20)),
    patah(drum(3, 1.23)), seruan(1, 1.15), tremolo(0.60), feedback(1.15),
    patah(hat(true, 1.05)), buka(1.10))],

  // c138–140 | 03:50–03:53.33: akor terakhir, noise baru berhenti
  [2, akorTerakhir],

  // c140–144 | 03:53.33–04:00: ekor efek
  [4, silence]
]

// Volume mengikuti fase emosi, sementara jumlah instrumen berubah nyata.
// Titik berjarak pendek di batas gelombang memberi perubahan yang tegas.
// Nilai disampling pada event; decay, delay, dan reverb tetap meluruh alami.
const DINAMIKA = [
  [0, 0.48], [20, 0.54], [40, 0.62], [60, 0.69],
  [80, 0.79], [93.333, 0.90], [98.333, 0.40], [99.99, 0.36],
  [100, 1.03], [110, 1.07], [119.99, 1.07],
  [120, 0.40], [126.65, 0.46], [126.667, 1.10],
  [140, 1.13], [146.65, 1.10],
  [146.667, 0.42], [153.333, 0.48], [159.99, 0.66],
  [160, 1.13], [173.32, 1.14],
  [173.333, 0.42], [179.99, 0.68],
  [180, 1.15], [200, 1.17], [206.65, 1.17],
  [206.667, 0.42], [209.99, 0.48],
  [210, 1.18], [226.667, 1.20], [229.99, 1.18],
  [230, 0.95], [233.333, 0.20], [240, 0]
]
const lagu = stack(arrange(...bab), noiseBerat, hantam)
  .filterWhen(t => Number(t) >= 0 && Number(t) < 140)
  .postgain(otomasi(DINAMIKA, MASTER))

$: lagu.early(MULAI_DETIK / DETIK_PER_CYCLE)
