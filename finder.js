/* Room finder: which rooms suit N guests. Pure functions, no DOM (the page wires them to the wizard in app.js).
   Rooms come from the site data (SITE_ROOMS values): { id, cat, price: "฿1,200", unit: "/ คืน (รวม 2 ท่าน)", cap: "2 - 4 ท่าน ..." }.
   Prices are per night; guests above a room's standard count pay the extra-guest fee (same rate as the booking form). */
(function (root) {
  var EXTRA_GUEST = 50;     // ฿ per extra guest per night (FAQ faq_4)
  var SPLIT_MAX_PRICE = 1500; // "2 rooms" suggestions only use ordinary single rooms (not connecting pairs or whole houses)
  var SPLIT_MAX_GUESTS = 12;

  function digits(s) { return parseInt(String(s == null ? '' : s).replace(/[^\d]/g, ''), 10) || 0; }

  /** std = guests included in the price ("รวม N ท่าน"), max = top of the capacity range */
  function finderCapacity(cap, unit) {
    var nums = (String(cap || '').split('(')[0].match(/\d+/g) || []).map(Number);
    var incl = (String(unit || '').match(/รวม\s*(\d+)\s*ท่าน/) || [])[1];
    return { std: incl ? +incl : (nums.length ? Math.min.apply(null, nums) : 0), max: nums.length ? Math.max.apply(null, nums) : 0 };
  }

  function matches(c, vibe) {
    if (!vibe || vibe === 'any') return true;
    if (vibe === 'snooker') return c.id === 'country_house';   // the snooker table is in the whole-house Country House
    return String(c.cat || '').indexOf(vibe) >= 0;
  }

  /** guests: 1–30 (clamped). vibe: 'any' | 'riverside' | 'japanese' | 'snooker'.
      Returns { options: [{ roomId, count: 1|2, total, extra, std, vibeMatch }], tooMany }
      options = up to 2–3 single rooms (cheapest first) plus, for 3–12 guests, one "split into 2 rooms" alternative. */
  function finderOptions(guests, vibe, rooms) {
    var n = Math.min(30, Math.max(1, Math.round(Number(guests)) || 1));
    var cands = (rooms || []).map(function (r, i) {
      var cap = finderCapacity(r.cap, r.unit);
      return { id: r.id, cat: r.cat, price: digits(r.price), std: cap.std, max: cap.max, i: i };
    }).filter(function (c) { return c.id && c.price > 0 && c.max > 0; });

    var singles = cands.filter(function (c) { return c.max >= n; }).map(function (c) {
      var extra = Math.max(0, n - c.std);
      return { roomId: c.id, count: 1, total: c.price + extra * EXTRA_GUEST, extra: extra, std: c.std, vibeMatch: matches(c, vibe), i: c.i };
    });

    var split = null;
    if (n >= 3 && n <= SPLIT_MAX_GUESTS) {
      var g1 = Math.ceil(n / 2), g2 = n - g1;
      cands.filter(function (c) { return c.price <= SPLIT_MAX_PRICE && 2 * c.max >= n; }).forEach(function (c) {
        var extra = Math.max(0, g1 - c.std) + Math.max(0, g2 - c.std);
        var o = { roomId: c.id, count: 2, total: 2 * c.price + extra * EXTRA_GUEST, extra: extra, std: c.std, vibeMatch: matches(c, vibe), i: c.i };
        if (!split || cmp(o, split) < 0) split = o;
      });
    }

    function cmp(a, b) { return (a.vibeMatch === b.vibeMatch ? 0 : a.vibeMatch ? -1 : 1) || a.total - b.total || a.i - b.i; }
    singles.sort(cmp);

    // keep only style matches when there are any (singles and the split option judged together)
    var all = singles.concat(split ? [split] : []);
    if (all.some(function (o) { return o.vibeMatch; })) {
      singles = singles.filter(function (o) { return o.vibeMatch; });
      if (split && !split.vibeMatch) split = null;
    }
    singles = singles.slice(0, split ? 2 : 3);
    var options = singles.concat(split ? [split] : []).map(function (o) { delete o.i; return o; });
    return { options: options, tooMany: options.length === 0 };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { finderOptions: finderOptions, finderCapacity: finderCapacity };
  else { root.finderOptions = finderOptions; root.finderCapacity = finderCapacity; }
})(typeof window !== 'undefined' ? window : globalThis);
