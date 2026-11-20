import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { finderOptions, finderCapacity, roomCapText, ROOM_CAPACITY } = createRequire(import.meta.url)("../../finder.js");

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
  assert.deepEqual(ids(r), ["jp_king", "jp_2king", "jp_kingx2"]);   // ห้องไม่มีห้องน้ำ (jp_notoilet) ไม่ถูกเสนอเป็นแบบแยก 2 ห้อง
  assert.deepEqual(r.options.map((o) => o.total), [1300, 1500, 2400]);
});

test("8 ท่าน ไม่เจาะจง: Japanese Full Set + แยก 2 ห้อง (Country House ไม่เสนอเพราะไม่ถึง 16 ท่าน)", () => {
  const r = finderOptions(8, "any", ROOMS);
  assert.deepEqual(ids(r), ["jp_full", "jp_kingx2"]);   // Rock View รับสูงสุด 3 จึงแยก 2 ห้องไม่ได้ (3+3 < 8)
  assert.equal(r.options[1].total, 2600);               // 2 x 1,200 + ท่านเสริม 4 x 50 (คนละ 4 ท่าน = สูงสุดของห้อง)
});

test("Country House (เหมาหลัง) เสนอเฉพาะกลุ่มตั้งแต่ 16 ท่านขึ้นไป", () => {
  for (let n = 1; n <= 15; n++) for (const v of ["any", "riverside", "japanese", "quiet", "budget"]) {
    assert.ok(finderOptions(n, v, ROOMS).options.every((o) => o.roomId !== "country_house"), `n=${n} ${v}`);
  }
  assert.ok(ids(finderOptions(16, "any", ROOMS)).includes("country_house"));
  assert.deepEqual(ids(finderOptions(20, "any", ROOMS)), ["country_house"]);
  assert.equal(finderOptions(13, "any", ROOMS).tooMany, true);   // 13–15 ท่าน: ไม่มีห้องเดียวรับได้ → ให้ทักแอดมิน
});

test("สไตล์เงียบสงบ → แนะนำ Sky View ก่อน ที่เหลือเป็นตัวเลือกอื่น (ไม่มีห้องไม่มีห้องน้ำ)", () => {
  const r = finderOptions(2, "quiet", ROOMS);
  assert.deepEqual(ids(r), ["sky_view", "rock_view", "lake_view"]);
  assert.deepEqual(r.options.map((o) => o.vibeMatch), [true, false, false]);
  assert.equal(r.matched, true);
  const r3 = finderOptions(3, "quiet", ROOMS);
  assert.deepEqual(ids(r3), ["sky_view", "sky_viewx2", "rock_view"]);   // แนะนำก่อน แล้วตัวเลือกอื่น
});

test("สไตล์ราคาประหยัด → แนะนำ Rock View ก่อน", () => {
  assert.deepEqual(ids(finderOptions(2, "budget", ROOMS)), ["rock_view", "lake_view", "sky_view"]);
  const r5 = finderOptions(5, "budget", ROOMS);               // Rock View รับสูงสุด 4 → แนะนำแบบ 2 ห้อง
  assert.deepEqual(ids(r5), ["rock_viewx2", "family_house", "jp_2king"]);
  assert.equal(r5.options[0].total, 1650);                    // 2 x 800 + ท่านเสริม 1 x 50
});

test("ผลลัพธ์บอกจำนวนที่รองรับ (std/max ต่อห้อง) เพื่อแสดงบนการ์ด", () => {
  const o = finderOptions(2, "riverside", ROOMS).options.find((x) => x.roomId === "lake_view");
  assert.deepEqual([o.std, o.max], [2, 3]);   // ตามตารางความจุของเจ้าของ: Lake/Sky/Rock รับสูงสุด 3
  const solo = finderOptions(2, "japanese", ROOMS).options.find((x) => x.roomId === "jp_notoilet");
  assert.deepEqual([solo.std, solo.max], [2, 2]);
});

test("ไม่มีห้องเดี่ยวตรงสไตล์ แต่แยก 2 ห้องตรงสไตล์ได้ → เสนอแบบแยก 2 ห้องอย่างเดียว", () => {
  const r = finderOptions(10, "riverside", ROOMS);   // ริมน้ำไม่มีห้องเดี่ยวรับ 10 ท่าน; Family House x2 รับได้
  assert.deepEqual(ids(r), ["family_housex2"]);
  assert.equal(r.options[0].total, 3100);            // 2 x 1500 + ท่านเสริม 2 x 50
  assert.equal(r.options[0].vibeMatch, true);
});

test("ไม่มีตัวเลือกตรงสไตล์เลย → แนะนำสไตล์อื่นแทน พร้อมธง vibeMatch=false, matched=false", () => {
  const r = finderOptions(16, "japanese", ROOMS);    // บ้านญี่ปุ่นรับไม่ถึง 16 ท่าน
  assert.deepEqual(ids(r), ["country_house"]);
  assert.equal(r.options[0].vibeMatch, false);
  assert.equal(r.matched, false);
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

test("ห้องไม่มีห้องน้ำไม่ถูกเสนอเป็นแบบแยก 2 ห้องเลย (ตรวจจากชื่อห้องด้วย)", () => {
  for (const vibe of ["any", "japanese"]) for (let n = 3; n <= 12; n++) {
    assert.ok(finderOptions(n, vibe, ROOMS).options.every((o) => !(o.count === 2 && o.roomId === "jp_notoilet")), `n=${n} ${vibe}`);
  }
  const named = [{ id: "x1", cat: "japanese", title: "Japanese | King Bed (No Toilet)", price: "฿800", unit: "/ คืน (รวม 2 ท่าน)", cap: "2 ท่าน" }, ...ROOMS.filter((r) => r.id === "jp_king")];
  assert.ok(finderOptions(4, "japanese", named).options.every((o) => !(o.count === 2 && o.roomId === "x1")));
});

test("ความจุตามตารางของเจ้าของ (ไม่ขึ้นกับข้อความ cap ที่แก้ในแอดมิน)", () => {
  const exp = { country_house: [16, 20], rock_view: [2, 3], sky_view: [2, 3], lake_view: [2, 3], family_house: [4, 6], jp_full: [8, 12], jp_king: [2, 4], jp_2king: [4, 5], jp_connect: [4, 6], jp_notoilet: [2, 2] };
  for (const [id, [std, max]] of Object.entries(exp)) {
    assert.deepEqual(finderCapacity("99 - 99 ท่าน", "/ คืน (รวม 99 ท่าน)", id), { std, max }, id);
    assert.deepEqual([ROOM_CAPACITY[id].std, ROOM_CAPACITY[id].max], [std, max], id);
  }
  // ห้องที่ไม่อยู่ในตาราง ใช้ข้อความ cap เหมือนเดิม
  assert.deepEqual(finderCapacity("2 - 6 ท่าน", "/ คืน (รวม 3 ท่าน)", "new_room"), { std: 3, max: 6 });
});

test("4 ท่าน: Sky View/Lake View/Rock View เดี่ยวไม่รับ (สูงสุด 3) → เสนอแบบแยก 2 ห้อง", () => {
  const r = finderOptions(4, "quiet", ROOMS);
  assert.equal(r.options[0].roomId, "sky_view"); assert.equal(r.options[0].count, 2);
  assert.ok(r.options.filter((o) => o.count === 1).every((o) => !["sky_view", "lake_view", "rock_view"].includes(o.roomId)));
});

test("roomCapText: แก้ช่วงตัวเลขตามตาราง คงรายละเอียดในวงเล็บ", () => {
  assert.equal(roomCapText("2 - 4 ท่าน (เตียง King 6 ฟุต 1 หลัง)", "sky_view"), "2 - 3 ท่าน (เตียง King 6 ฟุต 1 หลัง)");
  assert.equal(roomCapText("4 - 6 ท่าน (2 เตียง King)", "jp_2king"), "4 - 5 ท่าน (2 เตียง King)");
  assert.equal(roomCapText("2 - 4 ท่าน", "jp_notoilet"), "2 ท่าน");
  assert.equal(roomCapText("2 - 4 ท่าน", "unknown"), "2 - 4 ท่าน");
  assert.equal(roomCapText("", "sky_view"), "");
});
