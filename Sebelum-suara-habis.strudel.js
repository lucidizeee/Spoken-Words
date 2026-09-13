/*
SEBELUM SUARA HABIS
Aransemen original untuk puisi / spoken word.
Ambient, noise, dan perkembangan bertahap seperti post-rock.

80 BPM | 4 ketuk per cycle | 1 cycle = 3 detik
Total: 80 cycles = 4:00, termasuk ekor bunyi.

00:00 - 00:24 | c00-08 | Pembuka: biarkan ruang terbentuk.
00:24 - 01:12 | c08-24 | Bait I: mulai membaca, tenang dan dekat.
01:12 - 01:36 | c24-32 | Tekanan: naikkan intensitas pembacaan.
01:36 - 02:00 | c32-40 | Jeda: satu kalimat pendek / diam.
02:00 - 02:48 | c40-56 | Bait II: ruang pembacaan utama.
02:48 - 03:24 | c56-68 | Puncak: suara lebih tegas / jeda instrumental.
03:24 - 03:48 | c68-76 | Penutup: kalimat terakhir, pelan.
03:48 - 04:00 | c76-80 | Ekor bunyi: jangan tambah kata.

Tempel seluruh kode ke strudel.cc. Stop, lalu Play dari awal.
Export: start cycle 0, end cycle 80, cps 0.3333333333.
Setelah selesai, klik Stop lalu Play untuk mengulang.
Semua sumber bunyi sintetis bawaan; tidak perlu sample pack.
*/

setcps(80 / 60 / 4)

// Kontrol sederhana. Nilai awal disiapkan untuk ditimpa suara.
const MASTER = 0.72
const NOISE = 0.75
const DRUM = 1.00  // 0 = tanpa ketukan
const MULAI = 0    // preview: 8, 24, 32, 40, 56, atau 68

// Noise rendah: hembusan panjang, bukan potongan acak.
const udara = (v = 1) =>
  s("brown").slow(2)
    .attack(1.5).decay(0.6).sustain(0.7).release(1.2)
    .hpf(110).lpf("<480 650 420 750>")
    .pan("<0.3 0.65 0.4 0.7>")
    .gain(0.13 * NOISE * v)
    .room(0.45).roomsize(2).roomlp(1800).orbit(1)

// Nada dasar yang menahan seluruh aransemen.
const dasar = (v = 1) =>
  note("<d2 bb1 d2 c2>").slow(4).s("sine")
    .fm(0.35).fmh(0.5)
    .attack(1.2).sustain(0.8).release(1.8)
    .lpf(220).gain(0.19 * v)
    .room(0.08).roomsize(1).roomlp(2200).orbit(0)

// Motif petikan sintetis dengan gema, satu frasa tiap 4 cycles.
const dawai = (v = 1) =>
  note(`<
    [d3 ~ a3 ~ f3 ~ e3 ~]
    [bb2 ~ f3 ~ d3 ~ a3 ~]
    [d3 ~ a3 ~ c4 ~ a3 ~]
    [c3 ~ g3 ~ e3 ~ d3 ~]
  >`).slow(4).s("triangle")
    .fm(0.8).fmh(1).fmdecay(0.24).fmsustain(0.1)
    .attack(0.006).decay(0.65).sustain(0).release(0.6)
    .hpf(150).lpf(1700)
    .pan("<0.3 0.7 0.4 0.6>").gain(0.19 * v)
    .delay(0.35).delaytime(0.5625).delayfeedback(0.38)
    .room(0.5).roomsize(2).roomlp(1800).orbit(2)

// Akor menggantung, perlahan masuk seperti gesekan dawai.
const kabut = (v = 1) =>
  note("<[d3,a3,e4] [bb2,f3,c4] [d3,a3,f4] [c3,g3,d4]>")
    .slow(4).s("sawtooth")
    .attack(2.2).decay(1).sustain(0.6).release(2.2)
    .vib(0.17).vibmod(0.05)
    .hpf(150).lpf(620).gain(0.065 * v)
    .room(0.6).roomsize(2).roomlp(1800).orbit(1)

// Gesekan lebih kasar. Hanya mengemuka saat tekanan naik.
const gesek = (v = 1) =>
  s("pink").slow(2)
    .attack(1.8).decay(1.2).sustain(0.35).release(1.2)
    .bpf("<700 1100 850 1300>").bpq(1.1)
    .hpf(350).lpf(1900).distort("0.8:0.28")
    .pan("<0.7 0.35 0.6 0.4>").gain(0.2 * NOISE * v)
    .room(0.5).roomsize(2).roomlp(1800).orbit(1)

// Ketukan rendah, jarang; bagian puncak sedikit lebih rapat.
const detak = (v = 1, rapat = false) =>
  note(rapat ? "d2 ~ ~ d2 ~ ~ d2 ~" : "d2 ~ ~ ~ ~ ~ d2 ~")
    .slow(rapat ? 1 : 2).s("sine")
    .penv(9).pdecay(0.06)
    .attack(0.004).decay(0.28).sustain(0).release(0.06)
    .lpf(230).gain(0.42 * DRUM * v)
    .room(0.12).roomsize(1).roomlp(2200).orbit(0)

// Pukulan kering: badan tom dan sedikit desis, tanpa hi-hat.
const pukul = (v = 1, rapat = false) =>
  stack(
    note(rapat ? "~ d3 ~ d3" : "~ ~ d3 ~").s("triangle")
      .fm(0.7).fmh(1.51)
      .attack(0.003).decay(0.16).sustain(0).release(0.06)
      .lpf(1000).gain(0.09 * DRUM * v),
    s(rapat ? "~ pink ~ pink" : "~ ~ pink ~")
      .attack(0.003).decay(0.12).sustain(0).release(0.06)
      .hpf(700).lpf(2600).gain(0.11 * DRUM * v)
  ).slow(rapat ? 1 : 2)
    .room(0.18).roomsize(1).roomlp(2200).orbit(0)

// Susunan lengkap. Angka pertama = jumlah cycles bagian itu.
const lagu = arrange(
  [8, stack(
    udara(0.8), dasar(0.55), kabut(0.35)
  )],
  [16, stack(
    udara(0.6), dasar(0.8), dawai(0.8), kabut(0.5)
  )],
  [8, stack(
    udara(0.8), dasar(), dawai(), kabut(0.95),
    gesek(0.55), detak(0.7), pukul(0.5)
  )],
  [8, stack(
    udara(0.5), dasar(0.4), dawai(0.35)
  )],
  [16, stack(
    udara(0.6), dasar(0.9), dawai(0.8), kabut(0.65),
    detak(0.5)
  )],
  [12, stack(
    udara(), dasar(), dawai(0.9), kabut(1.7),
    gesek(), detak(0.9, true), pukul(0.85, true)
  )],
  [8, stack(
    udara(0.5), dasar(0.45), dawai(0.45), kabut(0.3)
  )],
  [4, silence]
)

// Berhenti memicu nada sesudah cycle 76; sisanya ekor bunyi.
// Filter mencegah susunan mengulang sendiri sesudah cycle 80.
$: lagu.filterWhen(t => t >= 0 && t < 80)
  .early(MULAI)
  .postgain(MASTER)
