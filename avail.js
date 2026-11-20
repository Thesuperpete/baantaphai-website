/* Room availability by date: asks the resort's Apps Script (read-only public route) and turns the answer into customer text.
   The server decides what may be shown: "ok" never carries a room count, "low" carries the number left. Any failure = null (the form just works without a status). */
(function (root) {
  var TEXT = {
    ok: '✅ มีห้องว่างในวันที่เลือก',
    last: '🔥 ห้องประเภทนี้ว่างเป็นห้องสุดท้าย',
    few: '🔥 เหลือ {0} ห้องสุดท้าย',
    full: 'เต็มในช่วงวันที่เลือก ลองเปลี่ยนวัน หรือทักแอดมินเพื่อให้แนะนำประเภทห้องอื่น'
  };

  /** info = one entry of the server's "types" map. Returns { tone, key, n? } (key is a Thai template for tt()) or null. */
  function roomAvailView(info) {
    if (!info) return null;
    if (info.state === 'ok') return { tone: 'ok', key: TEXT.ok };
    if (info.state === 'full') return { tone: 'full', key: TEXT.full };
    if (info.state === 'low' && info.left >= 1) {
      return info.left === 1 ? { tone: 'low', key: TEXT.last } : { tone: 'low', key: TEXT.few, n: info.left };
    }
    return null;
  }

  var cache = {};

  /** Resolves to the "types" map, or null on any problem. Only successes are cached (ttlMs, default 2 minutes). */
  function fetchRoomAvail(inStr, outStr, opts) {
    opts = opts || {};
    var now = opts.now || Date.now, ttl = opts.ttlMs == null ? 120000 : opts.ttlMs;
    var key = (opts.baseUrl || '') + '|' + inStr + '|' + outStr;
    var hit = cache[key];
    if (hit && now() - hit.at < ttl) return Promise.resolve(hit.types);

    var f = opts.fetchFn || root.fetch.bind(root);
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer, timedOut = new Promise(function (res) {
      timer = setTimeout(function () { if (ctl) ctl.abort(); res(null); }, opts.timeoutMs || 8000);
    });
    var url = opts.baseUrl + '?action=availability&in=' + encodeURIComponent(inStr) + '&out=' + encodeURIComponent(outStr);
    var request = Promise.resolve().then(function () { return f(url, ctl ? { signal: ctl.signal } : undefined); })
      .then(function (r) { return r && r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || j.ok !== true || !j.types || typeof j.types !== 'object') return null;
        cache[key] = { at: now(), types: j.types };
        return j.types;
      })
      .catch(function () { return null; });
    return Promise.race([request, timedOut]).then(function (v) { clearTimeout(timer); return v; });
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { roomAvailView: roomAvailView, fetchRoomAvail: fetchRoomAvail };
  else { root.roomAvailView = roomAvailView; root.fetchRoomAvail = fetchRoomAvail; }
})(typeof window !== 'undefined' ? window : globalThis);
