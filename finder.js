/* Room finder: which rooms suit N guests. Pure functions, no DOM (the page wires them to the wizard in app.js).
   Rooms come from the site data (SITE_ROOMS values): { id, cat, price: "฿1,200", unit: "/ คืน (รวม 2 ท่าน)", cap: "2 - 4 ท่าน ..." }.
   Prices are per night; guests above a room's standard count pay the extra-guest fee (same rate as the booking form). */
(function (root) {
  var EXTRA_GUEST = 50;     // ฿ per extra guest per night (FAQ faq_4)
  var SPLIT_MAX_PRICE = 1500; // "2 rooms" suggestions only use ordinary single rooms (not connecting pairs or whole houses)
  var SPLIT_MAX_GUESTS = 12;

  function digits(s) { return parseInt(String(s == null ? '' : s).replace(/[^\d]/g, ''), 10) || 0; }

  // Official capacity per room (std = guests included in the price, max = the most the room takes), from the owner's room sheet.
  // It wins over the text typed in the admin ("cap"), so the finder, booking form and room cards cannot disagree.
  var ROOM_CAPACITY = {
    country_house: { std: 16, max: 20 }, rock_view: { std: 2, max: 3 }, sky_view: { std: 2, max: 3 }, lake_view: { std: 2, max: 3 },
    family_house: { std: 4, max: 6 }, jp_full: { std: 8, max: 12 }, jp_king: { std: 2, max: 4 }, jp_2king: { std: 4, max: 5 },
    jp_connect: { std: 4, max: 6 }, jp_notoilet: { std: 2, max: 2 }
  };

  /** "2 - 4 ท่าน (เตียง King ...)" -> same text with the official range of that room ("2 - 3 ท่าน (...)"); unknown rooms are returned unchanged */
  function roomCapText(text, id) {
    var c = ROOM_CAPACITY[id];
    if (!c || !text) return text;
    return String(text).replace(/^\s*\d+(?:\s*[-–]\s*\d+)?(?=\s*ท่าน)/, c.std === c.max ? String(c.max) : c.std + ' - ' + c.max);
  }

  /** std = guests included in the price ("รวม N ท่าน"), max = top of the capacity range (room id given and known: official table) */
  function finderCapacity(cap, unit, id) {
    if (id && ROOM_CAPACITY[id]) return { std: ROOM_CAPACITY[id].std, max: ROOM_CAPACITY[id].max };
    var nums = (String(cap || '').split('(')[0].match(/\d+/g) || []).map(Number);
    var incl = (String(unit || '').match(/รวม\s*(\d+)\s*ท่าน/) || [])[1];
    return { std: incl ? +incl : (nums.length ? Math.min.apply(null, nums) : 0), max: nums.length ? Math.max.apply(null, nums) : 0 };
  }

  var MIN_GUESTS = { country_house: 16 };                  // the whole-house Country House is only offered to big groups (its price is too high for smaller ones)
  var PICK_VIBES = { quiet: 'sky_view', budget: 'rock_view' }; // these styles recommend one specific room; the rest are shown as alternatives

  function matches(c, vibe) {
    if (!vibe || vibe === 'any') return true;
    if (PICK_VIBES[vibe]) return c.id === PICK_VIBES[vibe];
    return String(c.cat || '').indexOf(vibe) >= 0;
  }

  /** guests: 1–30 (clamped). vibe: 'any' | 'riverside' | 'japanese' | 'quiet' | 'budget'.
      Returns { options, tooMany, matched }. options: [{ roomId, count: 1|2, total, extra, std, max, vibeMatch }] (std/max = per room),
      best matches first: up to 2–3 single rooms (cheapest first) plus, for 3–12 guests, one "split into 2 rooms" alternative.
      matched = at least one option fits the chosen style. */
  function finderOptions(guests, vibe, rooms) {
    var n = Math.min(30, Math.max(1, Math.round(Number(guests)) || 1));
    var pick = !!PICK_VIBES[vibe];
    var cands = (rooms || []).map(function (r, i) {
      var cap = finderCapacity(r.cap, r.unit, r.id);
      return { id: r.id, cat: r.cat, price: digits(r.price), std: cap.std, max: cap.max, i: i, noToilet: /no[\s_-]*toilet/i.test((r.id || '') + ' ' + (r.title || '')) };
    }).filter(function (c) { return c.id && c.price > 0 && c.max > 0 && n >= (MIN_GUESTS[c.id] || 0); });

    function option(c, count, total, extra) {
      return { roomId: c.id, count: count, total: total, extra: extra, std: c.std, max: c.max, vibeMatch: matches(c, vibe), i: c.i, noToilet: c.noToilet };
    }
    function cmp(a, b) { return (a.vibeMatch === b.vibeMatch ? 0 : a.vibeMatch ? -1 : 1) || a.total - b.total || a.i - b.i; }

    var singles = cands.filter(function (c) { return c.max >= n; }).map(function (c) {
      var extra = Math.max(0, n - c.std);
      return option(c, 1, c.price + extra * EXTRA_GUEST, extra);
    });

    var split = null;
    if (n >= 3 && n <= SPLIT_MAX_GUESTS) {
      var g1 = Math.ceil(n / 2), g2 = n - g1;
      // rooms without a private bathroom are fine as a single room but are not offered as a "2 rooms" plan
      cands.filter(function (c) { return c.price <= SPLIT_MAX_PRICE && 2 * c.max >= n && !c.noToilet; }).forEach(function (c) {
        var extra = Math.max(0, g1 - c.std) + Math.max(0, g2 - c.std);
        var o = option(c, 2, 2 * c.price + extra * EXTRA_GUEST, extra);
        if (!split || cmp(o, split) < 0) split = o;
      });
    }

    var matched = singles.concat(split ? [split] : []).some(function (o) { return o.vibeMatch; });
    if (matched && !pick) {            // a style with many rooms: show only the rooms that fit it
      singles = singles.filter(function (o) { return o.vibeMatch; });
      if (split && !split.vibeMatch) split = null;
    }
    if (pick) singles = singles.filter(function (o) { return o.vibeMatch || !o.noToilet; });   // alternatives never include no-bathroom rooms
    singles.sort(cmp);
    singles = singles.slice(0, split ? 2 : 3);

    var options = singles.concat(split ? [split] : []);
    options.sort(function (a, b) { return (a.vibeMatch === b.vibeMatch ? 0 : a.vibeMatch ? -1 : 1) || a.count - b.count || a.total - b.total || a.i - b.i; });
    options.forEach(function (o) { delete o.i; delete o.noToilet; });
    return { options: options, tooMany: options.length === 0, matched: matched };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { finderOptions: finderOptions, finderCapacity: finderCapacity, roomCapText: roomCapText, ROOM_CAPACITY: ROOM_CAPACITY };
  else { root.finderOptions = finderOptions; root.finderCapacity = finderCapacity; root.roomCapText = roomCapText; root.ROOM_CAPACITY = ROOM_CAPACITY; }
})(typeof window !== 'undefined' ? window : globalThis);
