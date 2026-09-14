/*
SEBELUM SUARA HABIS — v3
Ambient / post-rock / noise untuk puisi dan spoken word.

80 BPM | 4 ketuk per cycle | 1 cycle = 3 detik
Bentuk: 4:00; pemicu bunyi berhenti pada 3:48, sisanya ekor efek.

00:00–00:24  udara dan fondasi
00:24–01:12  motif renggang; ruang untuk kata
01:12–01:36  denyut dan gesekan mulai menumpuk
01:36–01:40  motif mundur; tekanan tertahan
01:40        gemuruh + noise kasar masuk tepat pada detik 100
01:40–02:48  noise makin tebal, lebar, dan terbuka
02:48–03:24  klimaks; kepadatan naik, puncak sekitar 03:12
03:24–03:48  runtuh perlahan
03:48–04:00  ekor reverb / delay

Cara pakai: tempel seluruh kode di strudel.cc, lalu Play dari awal.
Stop lalu Play untuk mengulang perjalanan dari 00:00.
Sumber bunyi seluruhnya synth/noise bawaan; tidak perlu sample eksternal.
MASTER, NOISE, dan DRUM dapat disesuaikan dengan rekaman vokal.
MULAI_DETIK = 96 untuk mengecek transisi; kembalikan ke 0 untuk lagu penuh.
*/

// Waktu 01:40 bergantung pada tempo ini.
const BPM = 80
const DETIK_PER_CYCLE = 60 * 4 / BPM
setcps(BPM / 60 / 4)

const MASTER = 0.62
const NOISE = 0.95
const DRUM = 0.90
const MULAI_DETIK = 0

// Interpolasi antar titik [detik, nilai].
// Nilai diambil pada setiap event, sehingga perubahan tidak meloncat per bagian.
const kurva = (detik, titik) => {
  if (detik <= titik[0][0]) return titik[0][1]
  for (let i = 1; i < titik.length; i++) {
    const [a, va] = titik[i - 1]
    const [b, vb] = titik[i]
    if (detik <= b) return va + (vb - va) * ((detik - a) / (b - a))
  }
  return titik[titik.length - 1][1]
}
const otomasi = (titik, skala = 1) =>
  signal(c => kurva(Number(c) * DETIK_PER_CYCLE, titik) * skala)

const TEKANAN = [
  [100, 0.78], [120, 1.00], [156, 1.18], [168, 1.35],
  [192, 1.60], [204, 1.45], [212, 0.58], [228, 0]
]
const BUKA_NOISE = [
  [100, 2400], [120, 3300], [168, 4300], [192, 5600],
  [204, 4800], [216, 2100], [228, 1000]
]

// Setiap orbit memakai ukuran dan warna reverb yang konsisten.
// Orbit 0: rendah / denyut; 1: pad; 2: dawai; 3: noise.
const ruangRendah = p => p.roomsize(1).roomlp(1400).orbit(0)
const ruangKabut = p => p.roomsize(2).roomlp(1800).orbit(1)
const ruangDawai = p => p.roomsize(2).roomlp(1800).orbit(2)
const ruangNoise = p => p.roomsize(2).roomlp(2600).orbit(3)

const udara = (v = 1) => ruangKabut(
  s("brown").slow(2)
    .attack(1.5).decay(0.6).sustain(0.7).release(1.2)
    .hpf(110).lpf("<480 650 420 750>")
    .pan("<0.3 0.65 0.4 0.7>")
    .gain(0.11 * NOISE * v).room(0.40)
)

const dasar = (v = 1) => ruangRendah(
  note("<d2 bb1 d2 c2>").slow(4).s("sine")
    .fm(0.35).fmh(0.5)
    .attack(1.2).sustain(0.8).release(1.8)
    .hpf(35).lpf(220).gain(0.19 * v).room(0.08)
)

// Motif sengaja jarang; delay mengisi sela kalimat.
const dawai = (v = 1) => ruangDawai(
  note(`<
    [d3 ~ a3 ~ f3 ~ e3 ~]
    [bb2 ~ f3 ~ d3 ~ a3 ~]
    [d3 ~ a3 ~ c4 ~ a3 ~]
    [c3 ~ g3 ~ e3 ~ d3 ~]
  >`).slow(4).s("triangle")
    .fm(0.8).fmh(1).fmdecay(0.24).fmsustain(0.1)
    .attack(0.009).decay(0.65).sustain(0).release(0.6)
    .hpf(150).lpf(1700)
    .pan("<0.3 0.7 0.4 0.6>").gain(0.19 * v)
    .delay(0.32).delaytime(0.5625).delayfeedback(0.36)
    .room(0.46)
)

const kabut = (v = 1) => ruangKabut(
  note("<[d3,a3,e4] [bb2,f3,c4] [d3,a3,f4] [c3,g3,d4]>")
    .slow(4).s("sawtooth")
    .attack(2.2).decay(1).sustain(0.6).release(2.2)
    .vib(0.17).vibmod(0.05)
    .hpf(150).lpf(620).gain(0.060 * v).room(0.55)
)

const gesek = (v = 1) => ruangKabut(
  s("pink").slow(2)
    .attack(1.8).decay(1.2).sustain(0.35).release(1.2)
    .bpf("<700 1100 850 1300>").bpq(1.1)
    .hpf(350).lpf(2200).distort("0.9:0.32")
    .pan("<0.7 0.35 0.6 0.4>")
    .gain(0.18 * NOISE * v).room(0.42)
)

// Denyut kasar bergerak di bawah suara, makin rapat saat klimaks.
const mesin = (v = 1, rapat = false) => ruangRendah(
  note(rapat ? "d2 ~ d2 d2 ~ d2 ~ d2" : "d2 ~ ~ d2 ~ ~ d2 ~")
    .s("sawtooth").fm(1.1).fmh(0.7)
    .attack(0.007).decay(0.22).sustain(0.05).release(0.08)
    .hpf(90).lpf("<520 780 620 920>")
    .distort("1.15:0.45")
    .gain(0.12 * DRUM * v).room(0.12)
)

const detak = (v = 1, rapat = false) => ruangRendah(
  note(rapat ? "d2 ~ ~ d2 ~ ~ d2 ~" : "d2 ~ ~ ~ ~ ~ d2 ~")
    .slow(rapat ? 1 : 2).s("sine")
    .penv(9).pdecay(0.06)
    .attack(0.004).decay(0.28).sustain(0).release(0.06)
    .lpf(230).gain(0.40 * DRUM * v).room(0.10)
)

const pukul = (v = 1, rapat = false) => ruangRendah(
  stack(
    note(rapat ? "~ d3 ~ d3" : "~ ~ d3 ~").s("triangle")
      .fm(0.7).fmh(1.51)
      .attack(0.003).decay(0.16).sustain(0).release(0.06)
      .lpf(1000).gain(0.09 * DRUM * v),
    s(rapat ? "~ pink ~ pink" : "~ ~ pink ~")
      .attack(0.003).decay(0.12).sustain(0).release(0.06)
      .hpf(700).lpf(2800).gain(0.10 * DRUM * v)
  ).slow(rapat ? 1 : 2).room(0.16)
)

// Lapisan emosi memakai grid 1 detik (3 event per cycle).
// 100 / 3 = cycle 33 1/3: masuk tepat 01:40, bukan dibulatkan ke 01:42.
// Release saling bertumpuk agar tekstur mengalir.
const tekanan = stack(
  // Gemuruh rendah, tetap dekat tengah stereo.
  ruangRendah(
    s("brown*3")
      .attack(0.09).decay(0.25).sustain(0.82).release(0.65)
      .hpf(42).lpf(sine.slow(5).range(210, 380))
      .distort("0.85:0.48").pan(0.5)
      .gain(otomasi(TEKANAN, 0.29 * NOISE)).room(0.12)
  ),

  // Sub berdenyut pelan, mengikuti bentuk gemuruh.
  ruangRendah(
    note("d1*3").s("sine")
      .fm(sine.slow(7).range(0.45, 1.15)).fmh(0.5)
      .attack(0.12).decay(0.2).sustain(0.70).release(0.6)
      .hpf(32).lpf(150).pan(0.5)
      .gain(otomasi(TEKANAN, 0.11 * NOISE)).room(0.05)
  ),

  // Dinding kasar: filter makin terbuka ketika emosi naik.
  ruangNoise(
    s("pink*3")
      .attack(0.06).decay(0.22).sustain(0.72).release(0.70)
      .hpf(900).lpf(otomasi(BUKA_NOISE))
      .distort("1.55:0.52")
      .pan(sine.slow(5).range(0.14, 0.86))
      .gain(otomasi(TEKANAN, 0.24 * NOISE)).room(0.30)
  ),

  // Geraman mid dengan arah stereo berlawanan.
  ruangNoise(
    s("brown*3")
      .attack(0.18).decay(0.25).sustain(0.74).release(0.80)
      .hpf(230).lpf(1900)
      .bpf(sine.slow(7).range(420, 1250)).bpq(1.25)
      .distort("1.3:0.46")
      .pan(sine.slow(5).range(0.86, 0.14))
      .gain(otomasi(TEKANAN, 0.22 * NOISE)).room(0.32)
  )
).filterWhen(t => Number(t) >= 100 / DETIK_PER_CYCLE
  && Number(t) < 228 / DETIK_PER_CYCLE)

// Harmoni dan denyut tetap bergerak di balik noise.
// Noise 01:40 dijadwalkan terpisah agar waktu masuknya presisi.
const tubuh = arrange(
  // 00:00–00:24
  [8, stack(
    udara(0.8), dasar(0.55), kabut(0.35)
  )],

  // 00:24–01:12
  [16, stack(
    udara(0.6), dasar(0.8), dawai(0.8), kabut(0.5)
  )],

  // 01:12–01:36
  [8, stack(
    udara(0.8), dasar(), dawai(), kabut(0.95),
    gesek(0.55), detak(0.7), pukul(0.5)
  )],

  // 01:36–02:00 | motif mundur; tekanan masuk pada 01:40
  [8, stack(
    udara(0.75), dasar(0.65), dawai(0.30), kabut(0.62),
    gesek(0.65), detak(0.48), mesin(0.32)
  )],

  // 02:00–02:48 | penumpukan
  [16, stack(
    udara(0.65), dasar(0.70), dawai(0.22), kabut(0.80),
    gesek(0.80), detak(0.65), pukul(0.42), mesin(0.62)
  )],

  // 02:48–03:24 | klimaks
  [12, stack(
    udara(0.70), dasar(0.75), kabut(1.20), gesek(0.95),
    detak(0.95, true), pukul(0.85, true), mesin(1.0, true)
  )],

  // 03:24–03:48 | motif tinggal sebagai bayangan
  [8, stack(
    udara(0.40), dasar(0.35), dawai(0.16), kabut(0.28), gesek(0.25)
  )],

  // 03:48–04:00 | tidak ada pemicu baru; biarkan efek selesai
  [4, silence]
)

// Fade disampling mengikuti event tiap instrumen.
// Batas 76 cycle mencegah note panjang ikut terpicu di bagian ekor.
const akhir = [
  [0, 1], [204, 1], [216, 0.68], [228, 0], [240, 0]
]
const lagu = stack(tubuh, tekanan)
  .filterWhen(t => Number(t) >= 0 && Number(t) < 76)
  .postgain(otomasi(akhir, MASTER))

$: lagu.early(MULAI_DETIK / DETIK_PER_CYCLE)
