/*
SEBELUM SUARA HABIS — v2
Spoken word / ambient / harsh noise escalation.

80 BPM | 4 ketuk per cycle | 1 cycle = 3 detik
Total: 80 cycles = 4:00, termasuk ekor bunyi.

Perubahan utama v2:
- 00:00–01:36 tetap dekat dengan versi awal.
- 01:36–01:42 mulai retak / tekanan masuk perlahan.
- ±01:42 harsh noise dan gemuruh mulai terasa jelas.
- 02:00–02:48 tekanan terus menumpuk.
- 02:48–03:24 menjadi overload utama.
- 03:24–03:48 tidak langsung tenang; sisa dengung masih menempel.
- 03:48–04:00 ekor bunyi.

Targetnya bukan sekadar lebih keras, tetapi terasa seperti suara dari luar
mulai berubah menjadi tekanan dari dalam kepala.

Export: start cycle 0, end cycle 80, cps 0.3333333333.
*/

setcps(80 / 60 / 4)

const MASTER = 0.70
const NOISE = 0.78
const DRUM = 1.00
const MULAI = 0

// Hembusan dasar.
const udara = (v = 1) =>
  s("brown").slow(2)
    .attack(1.5).decay(0.6).sustain(0.7).release(1.2)
    .hpf(110).lpf("<480 650 420 750>")
    .pan("<0.3 0.65 0.4 0.7>")
    .gain(0.13 * NOISE * v)
    .room(0.45).roomsize(2).roomlp(1800).orbit(1)

// Fondasi rendah.
const dasar = (v = 1) =>
  note("<d2 bb1 d2 c2>").slow(4).s("sine")
    .fm(0.35).fmh(0.5)
    .attack(1.2).sustain(0.8).release(1.8)
    .lpf(220).gain(0.19 * v)
    .room(0.08).roomsize(1).roomlp(2200).orbit(0)

// Motif awal tetap dibiarkan manusiawi dan lapang.
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

const kabut = (v = 1) =>
  note("<[d3,a3,e4] [bb2,f3,c4] [d3,a3,f4] [c3,g3,d4]>")
    .slow(4).s("sawtooth")
    .attack(2.2).decay(1).sustain(0.6).release(2.2)
    .vib(0.17).vibmod(0.05)
    .hpf(150).lpf(620).gain(0.065 * v)
    .room(0.6).roomsize(2).roomlp(1800).orbit(1)

// Gesekan mid, kini dipakai sebagai jembatan menuju noise berat.
const gesek = (v = 1) =>
  s("pink").slow(2)
    .attack(1.8).decay(1.2).sustain(0.35).release(1.2)
    .bpf("<700 1100 850 1300>").bpq(1.1)
    .hpf(350).lpf(2200).distort("0.9:0.32")
    .pan("<0.7 0.35 0.6 0.4>").gain(0.2 * NOISE * v)
    .room(0.5).roomsize(2).roomlp(1900).orbit(1)

// Gemuruh sub dan low-mid. Ini yang membuat tekanan terasa fisik.
const gemuruh = (v = 1) =>
  stack(
    s("brown").slow(2)
      .attack(0.8).decay(0.7).sustain(0.8).release(1.4)
      .hpf(45).lpf("<180 240 160 280>")
      .gain(0.23 * NOISE * v),
    note("<d1 d1 bb0 c1>").slow(2).s("sine")
      .fm("<0.4 0.8 0.55 1.0>").fmh(0.5)
      .attack(0.25).decay(1).sustain(0.8).release(1.3)
      .lpf(150).distort("0.75:0.24")
      .gain(0.22 * v)
  )
    .room(0.18).roomsize(1).roomlp(900).orbit(0)

// Harsh noise utama. Stereo bergerak supaya terasa tidak stabil.
const harsh = (v = 1) =>
  stack(
    s("pink").slow(1)
      .attack(0.3).decay(0.8).sustain(0.8).release(0.7)
      .hpf(750).lpf("<3600 5200 4300 6200>")
      .distort("1.35:0.5")
      .pan("<0.08 0.88 0.2 0.78>")
      .gain(0.17 * NOISE * v),
    s("brown").slow(1)
      .attack(0.45).decay(0.6).sustain(0.75).release(0.8)
      .bpf("<520 880 640 1200>").bpq(1.7)
      .distort("1.1:0.42")
      .pan("<0.82 0.18 0.72 0.28>")
      .gain(0.16 * NOISE * v)
  )
    .room(0.38).roomsize(2).roomlp(2600).orbit(3)

// Nada tipis yang menempel seperti tinnitus. Sengaja sangat pelan.
const denging = (v = 1) =>
  note("<a6 e6 bb6 f6>").slow(8).s("sine")
    .vib(0.35).vibmod(0.12)
    .attack(1.8).sustain(0.7).release(2.5)
    .hpf(2600).lpf(7200)
    .pan("<0.25 0.75>")
    .gain(0.035 * v)
    .room(0.7).roomsize(2).roomlp(4800).orbit(4)

// Mesin / denyut kasar di area low-mid, muncul setelah tekanan sudah terbentuk.
const mesin = (v = 1, rapat = false) =>
  note(rapat ? "d2 ~ d2 d2 ~ d2 ~ d2" : "d2 ~ ~ d2 ~ ~ d2 ~")
    .s("sawtooth")
    .fm(1.1).fmh(0.7)
    .attack(0.005).decay(0.22).sustain(0.05).release(0.08)
    .hpf(90).lpf("<520 780 620 920>")
    .distort("1.15:0.45")
    .gain(0.12 * DRUM * v)
    .room(0.15).roomsize(1).roomlp(1500).orbit(0)

const detak = (v = 1, rapat = false) =>
  note(rapat ? "d2 ~ ~ d2 ~ ~ d2 ~" : "d2 ~ ~ ~ ~ ~ d2 ~")
    .slow(rapat ? 1 : 2).s("sine")
    .penv(9).pdecay(0.06)
    .attack(0.004).decay(0.28).sustain(0).release(0.06)
    .lpf(230).gain(0.42 * DRUM * v)
    .room(0.12).roomsize(1).roomlp(2200).orbit(0)

const pukul = (v = 1, rapat = false) =>
  stack(
    note(rapat ? "~ d3 ~ d3" : "~ ~ d3 ~").s("triangle")
      .fm(0.7).fmh(1.51)
      .attack(0.003).decay(0.16).sustain(0).release(0.06)
      .lpf(1000).gain(0.09 * DRUM * v),
    s(rapat ? "~ pink ~ pink" : "~ ~ pink ~")
      .attack(0.003).decay(0.12).sustain(0).release(0.06)
      .hpf(700).lpf(2800).gain(0.11 * DRUM * v)
  ).slow(rapat ? 1 : 2)
    .room(0.18).roomsize(1).roomlp(2200).orbit(0)

// ============================================================
// ARRANGEMENT v2
// ============================================================
// 0–32 cycles mempertahankan bentuk versi pertama.
// c32–34 = retakan awal.
// c34 ≈ 01:42 = noise mulai benar-benar menekan.
// Setelah itu intensitas tidak kembali ke kondisi awal.

const lagu = arrange(
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

  // 01:36–01:42 | sesuatu mulai salah
  [2, stack(
    udara(0.85), dasar(0.72), dawai(0.42), kabut(0.58),
    gesek(0.65), gemuruh(0.35), denging(0.22)
  )],

  // 01:42–02:00 | noise masuk ke kepala
  [6, stack(
    udara(0.8), dasar(0.75), dawai(0.32), kabut(0.72),
    gesek(0.95), gemuruh(0.72), harsh(0.38), denging(0.42),
    detak(0.48), mesin(0.38)
  )],

  // 02:00–02:48 | tekanan terus menumpuk
  [16, stack(
    udara(0.7), dasar(0.85), dawai(0.28), kabut(0.82),
    gesek(1.05), gemuruh(0.92), harsh(0.68), denging(0.55),
    detak(0.65), pukul(0.42), mesin(0.62)
  )],

  // 02:48–03:24 | OVERLOAD / gemuruh penuh
  [12, stack(
    udara(0.9), dasar(), kabut(1.45),
    gesek(1.25), gemuruh(1.15), harsh(1.0), denging(0.75),
    detak(0.95, true), pukul(0.88, true), mesin(1.0, true)
  )],

  // 03:24–03:48 | tubuh noise mulai runtuh, tapi dengung masih tertinggal
  [8, stack(
    udara(0.65), dasar(0.5), dawai(0.18), kabut(0.38),
    gemuruh(0.55), harsh(0.26), denging(0.48), gesek(0.32)
  )],

  // 03:48–04:00 | ekor
  [4, stack(
    udara(0.22), gemuruh(0.12), denging(0.18)
  )]
)

$: lagu.filterWhen(t => t >= 0 && t < 80)
  .early(MULAI)
  .postgain(MASTER)
