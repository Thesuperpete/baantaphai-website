import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const { roomAvailView, fetchRoomAvail } = createRequire(import.meta.url)("../../avail.js");
const BASE = "https://example.test/exec";
const ok = (types) => async () => ({ ok: true, json: async () => ({ ok: true, types }) });

test("roomAvailView: ไม่มีข้อมูลประเภท = null (ไม่แสดงอะไร)", () => {
  assert.equal(roomAvailView(undefined), null);
  assert.equal(roomAvailView(null), null);
  assert.equal(roomAvailView({ state: "???" }), null);
});

test("roomAvailView: ok ไม่มีตัวเลข / low 1 = ห้องสุดท้าย / low N / full", () => {
  assert.deepEqual(roomAvailView({ state: "ok" }), { tone: "ok", key: "✅ มีห้องว่างในวันที่เลือก" });
  assert.deepEqual(roomAvailView({ state: "ok", left: 9 }), { tone: "ok", key: "✅ มีห้องว่างในวันที่เลือก" }); // กันรั่วถ้าเซิร์ฟเวอร์ส่ง left มาเอง
  assert.deepEqual(roomAvailView({ state: "low", left: 1 }), { tone: "low", key: "🔥 ห้องประเภทนี้ว่างเป็นห้องสุดท้าย" });
  assert.deepEqual(roomAvailView({ state: "low", left: 2 }), { tone: "low", key: "🔥 เหลือ {0} ห้องสุดท้าย", n: 2 });
  assert.deepEqual(roomAvailView({ state: "full" }), { tone: "full", key: "เต็มในช่วงวันที่เลือก ลองเปลี่ยนวัน หรือทักแอดมินเพื่อให้แนะนำประเภทห้องอื่น" });
});

test("fetchRoomAvail: URL ถูกต้อง, แคชตามคู่วันที่, หมดอายุแล้วยิงใหม่", async () => {
  let n = 0, url = "", t = 1000;
  const fetchFn = async (u) => { n++; url = u; return ok({ lake_view: { state: "ok" } })(); };
  const o = { baseUrl: BASE, fetchFn, ttlMs: 500, now: () => t };
  const a = await fetchRoomAvail("2026-12-01", "2026-12-03", o);
  assert.deepEqual(a, { lake_view: { state: "ok" } });
  assert.equal(url, BASE + "?action=availability&in=2026-12-01&out=2026-12-03");
  await fetchRoomAvail("2026-12-01", "2026-12-03", o);
  assert.equal(n, 1);
  await fetchRoomAvail("2026-12-01", "2026-12-04", o);   // คู่วันที่ใหม่
  assert.equal(n, 2);
  t += 600;
  await fetchRoomAvail("2026-12-01", "2026-12-03", o);   // เกิน ttl
  assert.equal(n, 3);
});

test("fetchRoomAvail: ล้มเหลวทุกแบบ = null และไม่แคชความล้มเหลว", async () => {
  const bad = [
    async () => ({ ok: true, json: async () => ({ ok: false, error: "past" }) }),
    async () => ({ ok: false, json: async () => ({}) }),
    async () => ({ ok: true, json: async () => { throw new Error("not json"); } }),
    async () => { throw new Error("offline"); },
    async () => ({ ok: true, json: async () => ({ ok: true }) }),            // ไม่มี types
  ];
  for (const f of bad) {
    let n = 0;
    const o = { baseUrl: BASE, fetchFn: async (u) => { n++; return f(u); }, ttlMs: 60000 };
    assert.equal(await fetchRoomAvail("2026-12-01", "2026-12-03", o), null);
    assert.equal(await fetchRoomAvail("2026-12-01", "2026-12-03", o), null);
    assert.equal(n, 2);   // ไม่แคช
  }
});

test("fetchRoomAvail: เกินเวลา = null", async () => {
  const fetchFn = () => new Promise(() => {});   // ไม่ resolve
  const t0 = Date.now();
  const r = await fetchRoomAvail("2026-12-01", "2026-12-03", { baseUrl: BASE, fetchFn, timeoutMs: 40 });
  assert.equal(r, null);
  assert.ok(Date.now() - t0 < 1000);
});
