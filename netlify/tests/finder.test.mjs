import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { finderOptions, finderCapacity } = createRequire(import.meta.url)("../../finder.js");

// ห้องตามข้อมูลบนเว็บ (ลำดับเดียวกับหน้าห้องพัก)
const R = (id, cat, price, std, cap) => ({ id, cat, price, unit: `/ คืน (รวม ${std} ท่าน)`, cap });
const ROOMS = [
  R("family_house", "riverside whole", "฿1,500", 4, "4 - 6 ท่าน (2 เตียง King)"),
  R("lake_view", "riverside", "฿1,200", 2, "2 - 4 ท่าน (1 เตียง King)"),
  R("sky_view", "riverside", "฿1,200", 2, "2 - 4 ท่าน (1 เตียง King)"),
  R("rock_view", "riverside", "฿800", 2, "2 - 4 ท่าน (1 เตียง King)"),
  R("jp_full", "japanese whole", "฿4,000", 8, "8 - 12 ท่าน (4 เตียง King)"),
  R("jp_connect", "japanese", "฿2,000", 4, "4 - 6 ท่าน (2 เตียง King)"),
  R("jp_2king", "japanese", "฿1,500", 4, "4 - 6 ท่าน (2 เตียง King)"),
  R("jp_king", "japanese", "฿1,200", 2, "2 - 4 ท่าน (1 เตียง King)"),
  R("jp_notoilet", "japanese", "฿800", 2, "2 ท่าน (1 เตียง King)"),
  R("country_house", "whole", "฿7,500", 16, "16 - 20 ท่าน (7 ห้องนอน)"),
];
const ids = (r) => r.options.map((o) => o.roomId + (o.count === 2 ? "x2" : ""));

test("finderCapacity: มาตรฐาน = รวม N ท่าน, สูงสุด = เลขมากสุดของช่วง", () => {
  assert.deepEqual(finderCapacity("4 - 6 ท่าน (2 เตียง)", "/ คืน (รวม 4 ท่าน)"), { std: 4, max: 6 });
  assert.deepEqual(finderCapacity("2 ท่าน (1 เตียง)", "/ คืน (รวม 2 ท่าน)"), { std: 2, max: 2 });
  assert.deepEqual(finderCapacity("2 - 4 ท่าน", ""), { std: 2, max: 4 });
  assert.deepEqual(finderCapacity("", ""), { std: 0, max: 0 });
});

test("2 ท่าน ริมน้ำ: 3 ตัวเลือก ราคาถูกก่อน ไม่มีค่าผู้เข้าพักเสริม ไม่มีแบบแยก 2 ห้อง", () => {
  const r = finderOptions(2, "riverside", ROOMS);
  assert.deepEqual(ids(r), ["rock_view", "lake_view", "sky_view"]);
  assert.deepEqual(r.options.map((o) => [o.total, o.extra]), [[800, 0], [1200, 0], [1200, 0]]);
  assert.ok(r.options.every((o) => o.vibeMatch));
  assert.equal(r.tooMany, false);
});

test("3 ท่าน ริมน้ำ: 2 ห้องเดี่ยว (คิดท่านเสริม 50) + ทางเลือกแยก 2 ห้อง", () => {
  const r = finderOptions(3, "riverside", ROOMS);
  assert.deepEqual(ids(r), ["rock_view", "lake_view", "rock_viewx2"]);
  // ห้องเดี่ยว: ค่าห้อง + ท่านเสริม 1 × 50; แยก 2 ห้อง: 2 × 800 (คนละ 2 + 1 ไม่เกินมาตรฐาน)
  assert.deepEqual(r.options.map((o) => [o.total, o.extra]), [[850, 1], [1250, 1], [1600, 0]]);
});

test("4 ท่าน ญี่ปุ่น", () => {
  const r = finderOptions(4, "japanese", ROOMS);
  assert.deepEqual(ids(r), ["jp_king", "jp_2king", "jp_notoilet" + "x2"]);
  assert.deepEqual(r.options.map((o) => o.total), [1300, 1500, 1600]);
});

test("8 ท่าน ไม่เจาะจง: ห้องใหญ่ 2 แบบ + แยก 2 ห้อง", () => {
  const r = finderOptions(8, "any", ROOMS);
  assert.deepEqual(ids(r), ["jp_full", "country_house", "rock_viewx2"]);
  assert.equal(r.options[2].total, 1800);   // 2 x 800 + ท่านเสริม 4 x 50 (คนละ 4 ท่านในห้องรับสูงสุด 4)
});

test("สไตล์สนุกเกอร์ = เหมาหลังเท่านั้น (ไม่เอาห้องสไตล์อื่นมาปน)", () => {
  assert.deepEqual(ids(finderOptions(10, "snooker", ROOMS)), ["country_house"]);
});

test("ไม่มีห้องเดี่ยวตรงสไตล์ แต่แยก 2 ห้องตรงสไตล์ได้ → เสนอแบบแยก 2 ห้องอย่างเดียว", () => {
  const r = finderOptions(10, "riverside", ROOMS);   // ริมน้ำไม่มีห้องเดี่ยวรับ 10 ท่าน; Family House x2 รับได้
  assert.deepEqual(ids(r), ["family_housex2"]);
  assert.equal(r.options[0].total, 3100);            // 2 x 1500 + ท่านเสริม 2 x 50
  assert.equal(r.options[0].vibeMatch, true);
});

test("ไม่มีตัวเลือกตรงสไตล์เลย → แนะนำสไตล์อื่นแทน พร้อมธง vibeMatch=false", () => {
  const r = finderOptions(13, "japanese", ROOMS);    // บ้านญี่ปุ่นรับไม่ถึง 13 ท่าน
  assert.deepEqual(ids(r), ["country_house"]);
  assert.equal(r.options[0].vibeMatch, false);
});

test("เกินความจุทุกห้อง = tooMany; จำนวนผิดปกติถูกบีบเป็น 1–30", () => {
  const big = finderOptions(25, "any", ROOMS);
  assert.equal(big.tooMany, true); assert.deepEqual(big.options, []);
  assert.ok(finderOptions(0, "any", ROOMS).options.length > 0);
  assert.ok(finderOptions(NaN, "any", ROOMS).options.length > 0);
  assert.equal(finderOptions(99, "any", ROOMS).tooMany, true);
  assert.ok(finderOptions(1, "any", ROOMS).options.length > 0);
});

test("ห้องที่ข้อมูลไม่ครบ (ไม่มีราคา/ความจุ) ถูกข้าม ไม่ error", () => {
  const r = finderOptions(2, "any", [{ id: "x", cat: "", price: "", cap: "" }, ...ROOMS]);
  assert.ok(r.options.every((o) => o.roomId !== "x"));
});
