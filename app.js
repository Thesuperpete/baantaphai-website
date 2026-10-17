    // 🌐 Smart Image URL Converter (Auto-converts Google Drive sharing links & cleans Google Maps / Photos)
    function formatDirectImageUrl(url) {
      if (!url || typeof url !== 'string') return '';
      url = url.trim();

      // 1. Google Drive Links:
      // Handles: drive.google.com/file/d/ID/view, drive.google.com/open?id=ID, drive.google.com/uc?id=ID
      const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveFileMatch && driveFileMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
      }
      const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (url.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
      }

      // 2. Google Maps / Photos URLs:
      // If user pasted a Google Maps user content image, ensure high resolution =s1600
      if (url.includes('googleusercontent.com/p/')) {
        return url.replace(/=[a-zA-Z0-9_-]+$/i, '=s1600');
      }

      return url;
    }

    // 0. HOMEPAGE HERO & NATURE HIGHLIGHT DATA STORE
    const DEFAULT_HERO_DATA = {
      badge: "อำเภอท่าเรือ จังหวัดพระนครศรีอยุธยา",
      title1: "บ้านตาผายรีสอร์ท",
      titleHl: "บ้านพักและห้องพักแนวชนบทริมน้ำ",
      title2: "ท่ามกลางธรรมชาติ",
      desc: "สัมผัสการพักผ่อนแบบเรียบง่ายและเป็นกันเองที่บ้านตาผายรีสอร์ท ที่พักแนวชนบทในอำเภอท่าเรือ จังหวัดพระนครศรีอยุธยา ที่พักมีทั้งบ้านพักและห้องพักหลากหลายรูปแบบ พร้อมกิจกรรมฟรี ไม่มีค่าใช้จ่ายเพิ่มเติม แถวใกล้สถานที่ท่องเที่ยวหลากหลายและยังเป็น Pet Friendly เปิดโอกาสให้สามารถพาสัตว์เลี้ยงมาพักผ่อนด้วยกันได้",
      startPrice: "1,200",
      startPriceNote: "ฟรี! อาหารเช้าสำหรับ 2 ท่าน",
      heroImg: "https://lh3.googleusercontent.com/d/1hkSO5TYVRJPvDsuqNCfLrOeiMNcYTD9V",
      heroImgNight: "https://lh3.googleusercontent.com/d/1hkSO5TYVRJPvDsuqNCfLrOeiMNcYTD9V",
      overlayBadge: "บ้านพัก Lake View",
      overlayTitle: "บ้านพักชั้นครึ่ง พร้อมเฉลียงริมนํ้าและซุ้มทานอาหารส่วนตัว มีที่จอดรถส่วนตัว",
      overlaySubtitle: "บ้านพักไฮไลท์ติดริมนํ้า",
      chips: [
        { icon: "fa-solid fa-water text-cyan-600", text: "ห้องพักติดริมน้ำ" },
        { icon: "fa-solid fa-torii-gate text-zen-torii", text: "โซนญี่ปุ่น ซุ้มโทริอิ" },
        { icon: "fa-solid fa-house text-emerald-700", text: "บ้านเหมาหลัง 2 ชั้น" },
        { icon: "fa-solid fa-bicycle text-amber-600", text: "คายัค & จักรยานฟรี" }
      ],
      btnStartPriceText: "เลือกดูห้องพัก (เริ่มต้น ฿1,200)",
      omikujiBtnText: "🎋 เซียมซีลุ้นส่วนลด 10–100.-",
      floatingBadgeLeft: {
        icon: "fa-brands fa-facebook",
        title: "98% แขกแนะนำ",
        subtitle: "บนเพจ Facebook",
        showThumb: true
      },
      floatingBadgeRight: {
        icon: "fa-solid fa-compass",
        title: "5 นาที",
        subtitle: "ศรีอยุธยา Lion Park"
      }
    };

    let SITE_HERO = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_hero_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.heroImg) parsed.heroImg = formatDirectImageUrl(parsed.heroImg);
          if (parsed.heroImgNight) parsed.heroImgNight = formatDirectImageUrl(parsed.heroImgNight);
          if (!parsed.chips || !Array.isArray(parsed.chips) || parsed.chips.length === 0) {
            parsed.chips = JSON.parse(JSON.stringify(DEFAULT_HERO_DATA.chips));
          }
          if (!parsed.btnStartPriceText) {
            parsed.btnStartPriceText = DEFAULT_HERO_DATA.btnStartPriceText;
          }
          if (!parsed.omikujiBtnText) {
            parsed.omikujiBtnText = DEFAULT_HERO_DATA.omikujiBtnText;
          }
          if (!parsed.floatingBadgeLeft) {
            parsed.floatingBadgeLeft = JSON.parse(JSON.stringify(DEFAULT_HERO_DATA.floatingBadgeLeft));
          }
          if (!parsed.floatingBadgeRight) {
            parsed.floatingBadgeRight = JSON.parse(JSON.stringify(DEFAULT_HERO_DATA.floatingBadgeRight));
          }
          return { ...DEFAULT_HERO_DATA, ...parsed };
        }
      } catch (e) {}
      return JSON.parse(JSON.stringify(DEFAULT_HERO_DATA));
    })();

    // 1. MASTER ROOMS DATA (Supports Multi-Photos per Room)
    const DEFAULT_ROOMS_DATA = {
      family_house: {
        id: "family_house",
        cat: "riverside whole",
        title: "Family House (ริมน้ำ)",
        badge: "🌊 โซนริมน้ำ • หลังใหญ่",
        price: "฿1,500",
        unit: "/ คืน (รวม 4 ท่าน)",
        cap: "4 - 6 ท่าน (เตียง King 6 ฟุต 2 หลัง)",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "บ้านพักติดริมน้ำขนาดใหญ่ ดีไซน์โปร่งสบาย พร้อมดาดฟ้าชมวิว 360 องศา และซุ้มอาหารส่วนตัวยื่นออกสู่ริมน้ำ บรรยากาศสุดผ่อนคลายสำหรับครอบครัว",
        highlights: [
          "ดาดฟ้า 360° ส่วนตัว ชมวิวคุ้งน้ำและรับลมธรรมชาติแบบพาโนรามา",
          "เฉลียงและซุ้มรับประทานอาหารส่วนตัวยื่นออกสู่ริมน้ำ",
          "พักผ่อนสบายด้วย 2 เตียงคิงไซส์ 6 ฟุต รองรับได้ 4-6 ท่าน",
          "มีที่จอดรถส่วนตัวบริเวณบ้านพัก สะดวกสบาย และรวมอาหารเช้า 4 ท่าน"
        ]
      },
      lake_view: {
        id: "lake_view",
        cat: "riverside",
        title: "Lake View (ริมน้ำ)",
        badge: "🌊 โซนริมน้ำ • ดีไซน์ 1.5 ชั้น",
        price: "฿1,200",
        unit: "/ คืน (รวม 2 ท่าน)",
        cap: "2 - 4 ท่าน (เตียง King 6 ฟุต 1 หลัง)",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "ดีไซน์น่ารักแบบ 1 ชั้นครึ่ง เตียงนอนบนชั้นลอยสุดชิค พร้อมเฉลียงยื่นริมน้ำและซุ้มอาหารส่วนตัวสัมผัสไอเย็นอย่างใกล้ชิด",
        highlights: [
          "ดีไซน์เล่นระดับ 1.5 ชั้น เตียงนอนชั้นลอยสุดอบอุ่นและมีสไตล์",
          "เฉลียงยื่นออกไปริมน้ำ พร้อมซุ้มสำหรับนั่งรับประทานอาหารส่วนตัว",
          "ระเบียงชมวิวด้านบน และลานกว้างหน้าบ้านติดริมน้ำ",
          "ที่จอดรถส่วนตัวหน้าบ้านพัก และรวมอาหารเช้า 2 ท่าน"
        ]
      },
      sky_view: {
        id: "sky_view",
        cat: "riverside",
        title: "Sky View (ริมน้ำ)",
        badge: "🌊 โซนริมน้ำ • ดาดฟ้าชมดาว",
        price: "฿1,200",
        unit: "/ คืน (รวม 2 ท่าน)",
        cap: "2 - 4 ท่าน (เตียง King 6 ฟุต 1 หลัง)",
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "ห้องพักติดริมน้ำในโซนส่วนตัวสูง ไร้เสียงรบกวน โดดเด่นด้วยดาดฟ้าส่วนตัวสำหรับนั่งรับลมและดูดาวยามค่ำคืน",
        highlights: [
          "ดาดฟ้าชมวิวส่วนตัว สามารถนั่งดูดาวและชมวิวคุ้งน้ำรอบด้าน",
          "ตั้งอยู่ในโซนที่มีความเป็นส่วนตัวสูง เงียบสงบ ไร้เสียงรบกวน",
          "โต๊ะรับประทานอาหารริมน้ำ นั่งจิบกาแฟชมบรรยากาศยามเช้า",
          "ที่จอดรถส่วนตัวบริเวณห้องพัก และรวมอาหารเช้า 2 ท่าน"
        ]
      },
      rock_view: {
        id: "rock_view",
        cat: "riverside",
        title: "Rock View (ริมน้ำ)",
        badge: "🌊 โซนริมน้ำ • มินิมอล",
        price: "฿800",
        unit: "/ คืน (รวม 2 ท่าน)",
        cap: "2 - 4 ท่าน (เตียง King 6 ฟุต 1 หลัง)",
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "ห้องพักสไตล์มินิมอลติดริมน้ำ เอกลักษณ์มุมนั่งห้อยขารับไอเย็น สบายกระเป๋าแต่ได้วิวธรรมชาติหลักล้าน",
        highlights: [
          "เก้าอี้นั่งริมน้ำสำหรับนั่งห้อยขาและชมวิวแบบใกล้ชิด",
          "ตกแต่งสไตล์มินิมอล เรียบง่าย สะอาด อบอุ่น",
          "บรรยากาศริมน้ำ เงียบสงบ อากาศสดชื่นตลอดวัน",
          "ราคาเริ่มต้นสุดประหยัด เพียง 800.- รวมอาหารเช้า 2 ท่าน"
        ]
      },
      jp_full: {
        id: "jp_full",
        cat: "japanese whole",
        title: "Japanese House (Full Set)",
        badge: "⛩️ โซนญี่ปุ่น • เหมาหลัง 3 ห้องนอน",
        price: "฿4,000",
        unit: "/ คืน (รวม 8 ท่าน)",
        cap: "8 - 12 ท่าน (4 เตียง King 6 ฟุต)",
        images: [
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "บ้านพักสไตล์ญี่ปุ่นเหมาหลัง 3 ห้องนอน 4 เตียงคิงไซส์ เป็นส่วนตัวยกแก๊ง พร้อมประตู Connecting เชื่อมถึงกัน",
        highlights: [
          "เหมาทั้งหลัง 3 ห้องนอน 4 เตียงคิงไซส์ ได้ความเป็นส่วนตัวยกกลุ่ม",
          "มี 2 ห้องนอนเปิดประตูเชื่อมหากันได้ (Connecting Room) สะดวกสบาย",
          "ซุ้มประตูโทริอิสีแดงและทางเดินหน้าบ้านรีโนเวทใหม่ ถ่ายรูปสวย",
          "ที่จอดรถส่วนตัวบริเวณบ้านพัก และรวมอาหารเช้าฟรี 8 ท่าน"
        ]
      },
      jp_connect: {
        id: "jp_connect",
        cat: "japanese",
        title: "Japanese | Connecting Room",
        badge: "⛩️ โซนญี่ปุ่น • 2 ห้องเชื่อมทะลุ",
        price: "฿2,000",
        unit: "/ คืน (รวม 4 ท่าน)",
        cap: "4 - 6 ท่าน (2 เตียง King 6 ฟุต)",
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "บ้านพักขนาดกลาง 2 ห้องนอนที่มีประตูด้านในเชื่อมถึงกัน สะดวกและอบอุ่นสำหรับครอบครัวหรือกลุ่มเพื่อน",
        highlights: [
          "ประตู Connecting เชื่อมถึงกัน 2 ห้องนอน อบอุ่นและปลอดภัย",
          "2 เตียง King Size 6 ฟุต หนานุ่ม นอนสบาย 4-6 ท่าน",
          "กลิ่นอายแดนอาทิตย์อุทัย ซุ้มประตูโทริอิและสวนร่มรื่น",
          "ที่จอดรถส่วนตัวหน้าบ้านพัก และรวมอาหารเช้าฟรี 4 ท่าน"
        ]
      },
      jp_2king: {
        id: "jp_2king",
        cat: "japanese",
        title: "Japanese | Two King Bed",
        badge: "⛩️ โซนญี่ปุ่น • ห้องใหญ่ 2 เตียงใหญ่",
        price: "฿1,500",
        unit: "/ คืน (รวม 4 ท่าน)",
        cap: "4 - 6 ท่าน (2 เตียง King 6 ฟุต)",
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "ห้องพักขนาดใหญ่พิเศษ วาง 2 เตียงคิงไซส์ 6 ฟุต เหมาะสำหรับเพื่อน 4 ท่านหรือครอบครัวที่ต้องการนอนรวมกัน",
        highlights: [
          "ห้องใหญ่พิเศษ วาง 2 เตียง King Size 6 ฟุต พักผ่อนสบาย",
          "โซนญี่ปุ่น บรรยากาศเงียบสงบ ทางเดินหินรีโนเวทใหม่",
          "มีห้องน้ำส่วนตัวในห้อง พร้อมอุปกรณ์อาบน้ำครบชุด",
          "ที่จอดรถส่วนตัวข้างห้องพัก และรวมอาหารเช้า 4 ท่าน"
        ]
      },
      jp_king: {
        id: "jp_king",
        cat: "japanese",
        title: "Japanese | King Size Bed",
        badge: "⛩️ โซนญี่ปุ่น • ห้องน้ำส่วนตัว",
        price: "฿1,200",
        unit: "/ คืน (รวม 2 ท่าน)",
        cap: "2 - 4 ท่าน (1 เตียง King 6 ฟุต)",
        images: [
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "ห้องพักสไตล์ญี่ปุ่นขนาดกะทัดรัด พร้อมห้องน้ำส่วนตัวและอุปกรณ์ครบครัน อบอุ่น เรียบง่าย เป็นส่วนตัว",
        highlights: [
          "ห้องน้ำส่วนตัวในห้องพัก พร้อมเครื่องทำน้ำอุ่นและอุปกรณ์ครบ",
          "เตียง King Size 6 ฟุต หนานุ่ม นอนหลับสบาย",
          "สิ่งอำนวยความสะดวกครบ: แอร์ ทีวี ตู้เย็น ไดร์เป่าผม กาน้ำร้อน",
          "ที่จอดรถส่วนตัวบริเวณห้องพัก และรวมอาหารเช้า 2 ท่าน"
        ]
      },
      jp_notoilet: {
        id: "jp_notoilet",
        cat: "japanese",
        title: "Japanese | King Bed (No Toilet)",
        badge: "⛩️ โซนญี่ปุ่น • ราคาสุดประหยัด",
        price: "฿800",
        unit: "/ คืน (รวม 2 ท่าน)",
        cap: "2 ท่าน (1 เตียง King 6 ฟุต)",
        images: [
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "ห้องพักสไตล์ญี่ปุ่นราคาประหยัด เตียง 6 ฟุต นอนสบาย ใช้ห้องน้ำรวมแยกส่วนที่สะอาดและสะดวก",
        highlights: [
          "ราคาเริ่มต้นสุดประหยัด เพียง 800.- รวมอาหารเช้า 2 ท่าน",
          "เตียง King Size 6 ฟุต นอนสบาย แอร์เย็นฉ่ำ มีตู้เย็นและทีวี",
          "ห้องน้ำส่วนกลางสะอาด แยกเป็นสัดส่วน สะดวก ปลอดภัย",
          "เพลิดเพลินกับสวนญี่ปุ่น ซุ้มโทริอิ และเรือคายัคฟรี"
        ]
      },
      country_house: {
        id: "country_house",
        cat: "whole",
        title: "Country House (เหมาหลัง 2 ชั้น)",
        badge: "🏡 บ้านพักเหมาหลัง • สำหรับ 16-20 ท่าน",
        price: "฿7,500",
        unit: "/ คืน (รวม 16 ท่าน)",
        cap: "16 - 20 ท่าน (7 ห้องนอน 8 เตียง King 6 ฟุต)",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
        ],
        desc: "บ้านพักขนาดใหญ่ 2 ชั้น ให้บริการแบบ 'เหมาหลังส่วนตัว' เท่านั้น ไม่ซอยย่อย 7 ห้องนอน 8 เตียงคิงไซส์ 6 ห้องน้ำ พร้อมโถงกลางใหญ่ โต๊ะสนุกเกอร์ และโต๊ะฟุตบอลมือหมุนฟรี!",
        highlights: [
          "โถงกลางขนาดใหญ่ พร้อมโต๊ะสนุกเกอร์ & โต๊ะฟุตบอลมือหมุน เล่นฟรี!",
          "7 ห้องนอน 8 เตียงคิงไซส์ 6 ห้องน้ำ รองรับได้ถึง 16-20 ท่าน",
          "เหมาะสำหรับครอบครัวใหญ่ งานเลี้ยงสังสรรค์ สัมมนา เลี้ยงรุ่น",
          "รวมอาหารเช้า 16 ท่าน พร้อมลานจอดรถหน้าบ้านพักหลายคัน"
        ]
      }
    };

    // 1.05 MASTER COMPARISON MATRIX DATA
    const DEFAULT_COMP_HEADER = {
      title: "ตารางเปรียบเทียบห้องพักทั้ง 10 แบบ (Room Comparison Matrix)",
      subtitle: "เปรียบเทียบราคา ขนาดเตียง จำนวนผู้เข้าพัก วิว และสิ่งอำนวยความสะดวก เพื่อให้คุณตัดสินใจได้ง่ายที่สุด",
      footerNote: "*ทุกห้องพักรวมอาหารเช้าฟรี และสิทธิ์เล่นเรือคายัค จักรยานฟรีตลอดการเข้าพัก",
      fontOverride: ""
    };

    const DEFAULT_COMP_MATRIX = [
      {
        id: "comp_1",
        roomId: "family_house",
        icon: "🏡",
        name: "Family House (ริมน้ำ)",
        zone: "เหมาหลัง",
        zoneColor: "amber",
        price: "฿1,500",
        guests: "4 - 6 ท่าน",
        beds: "เตียง King 6 ฟุต 2 หลัง",
        bathrooms: "✓ ห้องน้ำในตัว",
        highlights: "ดาดฟ้า 360° ส่วนตัว ชมวิวคุ้งน้ำและรับลมธรรมชาติแบบพาโนรามา"
      },
      {
        id: "comp_2",
        roomId: "lake_view",
        icon: "🌊",
        name: "Lake View (ริมน้ำ)",
        zone: "ริมน้ำ",
        zoneColor: "blue",
        price: "฿1,200",
        guests: "2 - 4 ท่าน",
        beds: "เตียง King 6 ฟุต 1 หลัง",
        bathrooms: "✓ ห้องน้ำในตัว",
        highlights: "ดีไซน์เล่นระดับ 1.5 ชั้น เตียงนอนชั้นลอยสุดอบอุ่นและมีสไตล์"
      },
      {
        id: "comp_3",
        roomId: "sky_view",
        icon: "🌊",
        name: "Sky View (ริมน้ำ)",
        zone: "ริมน้ำ",
        zoneColor: "blue",
        price: "฿1,200",
        guests: "2 - 4 ท่าน",
        beds: "เตียง King 6 ฟุต 1 หลัง",
        bathrooms: "✓ ห้องน้ำในตัว",
        highlights: "ดาดฟ้าชมวิวส่วนตัว สามารถนั่งดูดาวและชมวิวคุ้งน้ำรอบด้าน"
      },
      {
        id: "comp_4",
        roomId: "rock_view",
        icon: "🌊",
        name: "Rock View (ริมน้ำ)",
        zone: "ริมน้ำ",
        zoneColor: "blue",
        price: "฿800",
        guests: "2 - 4 ท่าน",
        beds: "เตียง King 6 ฟุต 1 หลัง",
        bathrooms: "✓ ห้องน้ำในตัว",
        highlights: "เก้าอี้นั่งริมน้ำสำหรับนั่งห้อยขาและชมวิวแบบใกล้ชิด"
      },
      {
        id: "comp_5",
        roomId: "jp_full",
        icon: "⛩️",
        name: "Japanese House (Full Set)",
        zone: "ญี่ปุ่น เหมาหลัง",
        zoneColor: "rose",
        price: "฿4,000",
        guests: "8 - 12 ท่าน",
        beds: "4 เตียง King 6 ฟุต",
        bathrooms: "✓ 2 ห้องน้ำ",
        highlights: "เหมาทั้งหลัง 3 ห้องนอน 4 เตียงคิงไซส์ ได้ความเป็นส่วนตัวยกกลุ่ม"
      },
      {
        id: "comp_6",
        roomId: "jp_connect",
        icon: "⛩️",
        name: "Japanese Connecting Room",
        zone: "ญี่ปุ่น",
        zoneColor: "rose",
        price: "฿2,000",
        guests: "4 - 6 ท่าน",
        beds: "2 เตียง King (2 ห้องนอน)",
        bathrooms: "✓ ห้องน้ำในตัว",
        highlights: "ประตูทะลุหากัน อบอุ่น ปลอดภัย เหมาะสำหรับครอบครัว"
      },
      {
        id: "comp_7",
        roomId: "jp_2king",
        icon: "⛩️",
        name: "Japanese Two King Bed",
        zone: "ญี่ปุ่น",
        zoneColor: "rose",
        price: "฿1,500",
        guests: "4 - 6 ท่าน",
        beds: "2 เตียง King 6 ฟุต",
        bathrooms: "✓ ห้องน้ำในตัว",
        highlights: "ห้องใหญ่พิเศษ นอนรวมกัน 4 ท่านสบาย สไตล์เรียวกัง"
      },
      {
        id: "comp_8",
        roomId: "jp_king",
        icon: "⛩️",
        name: "Japanese King Size Bed",
        zone: "ญี่ปุ่น",
        zoneColor: "rose",
        price: "฿1,200",
        guests: "2 - 4 ท่าน",
        beds: "1 เตียง King 6 ฟุต",
        bathrooms: "✓ ห้องน้ำในตัว",
        highlights: "เรียบง่าย อบอุ่น บรรยากาศเงียบสงบ มินิมอลสไตล์ญี่ปุ่น"
      },
      {
        id: "comp_9",
        roomId: "jp_notoilet",
        icon: "⛩️",
        name: "Japanese King (No Toilet)",
        zone: "ญี่ปุ่น",
        zoneColor: "rose",
        price: "฿800",
        guests: "2 ท่าน",
        beds: "1 เตียง King 6 ฟุต",
        bathrooms: "ห้องน้ำรวมแยกส่วน",
        highlights: "ราคาสุดประหยัด รวมอาหารเช้า 2 ท่าน สะอาด สะดวก"
      },
      {
        id: "comp_10",
        roomId: "country_house",
        icon: "🏡",
        name: "Country House (เหมาหลัง 2 ชั้น)",
        zone: "เหมาหลังใหญ่",
        zoneColor: "emerald",
        price: "฿7,500",
        guests: "16 - 20 ท่าน",
        beds: "8 เตียง King (7 ห้องนอน)",
        bathrooms: "✓ 6 ห้องน้ำ",
        highlights: "โถงใหญ่ โต๊ะสนุกเกอร์ & โต๊ะบอลฟรี ปาร์ตี้ปิ้งย่างได้"
      }
    ];

    // 1.08 MASTER INTERACTIVE ROOM FINDER DATA
    const DEFAULT_ROOM_FINDER_DATA = {
      badge: "Interactive Room Finder",
      title: "ไม่แน่ใจว่าจะพักห้องไหนดี? ให้เราช่วยแนะนำใน 3 คลิก!",
      subtitle: "เลือกความต้องการของคุณ ระบบจะจับคู่ห้องพักที่เหมาะกับคุณที่สุดทันที",
      step1Label: "1. จำนวนผู้เข้าพักของคุณ:",
      guestsOptions: [
        { value: "2", icon: "👥", title: "2 ท่าน", sub: "คู่รัก / เพื่อน" },
        { value: "4-6", icon: "👨‍👩‍👧‍👦", title: "4 - 6 ท่าน", sub: "ครอบครัว" },
        { value: "8-20", icon: "🏡", title: "8 - 20 ท่าน", sub: "กลุ่มใหญ่" }
      ],
      step2Label: "2. สไตล์บรรยากาศที่ชอบ:",
      vibeOptions: [
        { value: "riverside", icon: "🌊", title: "ติดริมน้ำ", sub: "ลมเย็นสบาย" },
        { value: "japanese", icon: "⛩️", title: "บ้านญี่ปุ่น", sub: "ซุ้มโทริอิ" },
        { value: "snooker", icon: "🎱", title: "สนุกเกอร์", sub: "ปาร์ตี้ส่วนตัว" }
      ],
      buttonText: "ค้นหาห้องพักที่ตรงใจที่สุด"
    };

    // 1.09 MASTER DINING HEADER & HIGHLIGHTS DATA
    const DEFAULT_DINING_HEADER_DATA = {
      badge: "Culinary & Riverside Café",
      title: "ลิ้มรสความอร่อยริมสายน้ำ <br class=\"hidden sm:inline\"> ทั้งคาเฟ่สดชื่นและครัวไทยต้นตำรับ",
      desc: "ไม่เพียงแต่การพักผ่อนที่เงียบสงบ บ้านตาผายยังมีบริการคาเฟ่เครื่องดื่มสดชื่น กาแฟอาราบิก้าคั่วหอม ชาเขียวมัทฉะแท้ และครัวอาหารไทยรสจัดจ้าน เสิร์ฟร้อนๆ ถึงซุ้มริมน้ำและระเบียงห้องพัก",
      highlights: [
        { text: "☕ กาแฟสด & มัทฉะเข้มข้น เริ่มต้น ฿55.-", isSpecial: false },
        { text: "🍲 อาหารไทย & กับข้าว เริ่มต้น ฿80.-", isSpecial: false },
        { text: "🍳 รวมอาหารเช้าฟรีทุกห้องพัก", isSpecial: true },
        { text: "🌿 มีซุ้มอาหารส่วนตัวริมน้ำ", isSpecial: false }
      ]
    };

    // 1.1 MASTER DINING SHOWCASE CARDS DATA
    const DEFAULT_DINING_CARDS = [
      {
        id: "cafe",
        title: "Ta Phai Riverside Café",
        badge: "☕ Signature Café",
        price: "เริ่มต้น ฿55.-",
        img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
        desc: "คัดสรรเมล็ดกาแฟอาราบิก้าแท้ คั่วหอมกรุ่น ทั้งเอสเพรสโซ อเมริกาโน ลาเต้ ชาเขียวมัทฉะเข้มข้น ชาไทยโบราณ และอิตาเลียนโซดาคลายร้อนริมคุ้งน้ำ",
        tags: ["เมนูกาแฟสด & Non-Coffee", "บริการเบเกอรี่ & ของหวาน"]
      },
      {
        id: "thai",
        title: "Riverside Thai Kitchen",
        badge: "🍲 ครัวไทยอยุธยารสเด็ด",
        price: "เริ่มต้น ฿80.-",
        img: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
        desc: "อาหารไทยรสจัดจ้านสูตรดั้งเดิม ต้มยำกุ้งแม่น้ำ กะเพราโบราณหมูสับ/หมูกรอบ ปีกไก่ทอดน้ำปลา ข้าวผัดกุ้ง และกับข้าวแสนอร่อย ปรุงสดใหม่จานต่อจาน",
        tags: ["เมนูอาหารจานเดียว & กับข้าว", "สั่งทานมื้อกลางวันและมื้อค่ำ"]
      },
      {
        id: "breakfast",
        title: "Garden Zone & Breakfast",
        badge: "🍳 อาหารเช้าแสนอบอุ่น",
        price: "ฟรีทุกห้องพัก",
        img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
        desc: "บริการเวลา 07:30 – 09:30 น. เสิร์ฟ American Breakfast ไข่ดาว ไส้กรอก แฮม ข้าวต้มหมู/ไก่ร้อนๆ ขนมปังปิ้ง แยมผลไม้ และบุฟเฟต์สุดพิเศษในวันเข้าพักหนาแน่น",
        tags: ["บรรยากาศสวนร่มรื่นริมน้ำ", "รวมคูปองอาหารในทุกการจอง"]
      },
      {
        id: "pavilion",
        title: "ซุ้มอาหารส่วนตัว & พักคอย",
        badge: "🌿 นั่งชิลล์ & เสิร์ฟถึงซุ้ม",
        price: "Private Dining",
        img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        desc: "มาถึงก่อนเวลาเช็คอิน 14:00 น. สามารถนั่งพักผ่อน สั่งอาหารและเครื่องดื่มรอสบายๆ ได้ พร้อมบริการยกเสิร์ฟร้อนๆ ถึงซุ้มไม้ริมน้ำส่วนตัวและระเบียงห้องพัก",
        tags: ["รับรองลูกค้ารอเช็คอิน", "สั่งเสิร์ฟถึงห้องพัก & ซุ้มริมน้ำ"]
      }
    ];

    // 1.14 MASTER DINING ACTION BANNER DATA
    const DEFAULT_DINING_BANNER_DATA = {
      showBanner: true,
      badgeIcon: "fa-solid fa-bell-concierge",
      badgeText: "บริการสั่งอาหารล่วงหน้า & เช็คเมนูสดใหม่",
      title: "อยากดูรายการเมนู หรือสั่งอาหารเตรียมไว้ล่วงหน้าก่อนเข้าพัก?",
      desc: "คลิกดูตัวอย่างเมนูแนะนำบนหน้าเว็บ หรือทัก LINE / Facebook Messenger เพื่อรับเมนูฉบับเต็มและสั่งล่วงหน้ากับแอดมินได้ตลอดเวลา",
      showBtnMenu: true,
      btnMenuText: "เปิดดูเมนูอาหาร",
      btnMenuIcon: "fa-solid fa-book-open",
      showBtnMessenger: true,
      btnMessengerText: "ทัก Messenger",
      btnMessengerUrl: "https://m.me/Baantaphai",
      showBtnLine: true,
      btnLineText: "ทัก LINE สั่งอาหาร",
      btnLineUrl: "https://line.me/R/ti/p/@baantaphairesort"
    };

    let SITE_DINING_BANNER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_dining_banner_v3');
        if (saved) return { ...DEFAULT_DINING_BANNER_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_DINING_BANNER_DATA));
    })();

    // 1.15 MASTER MENU MODAL HEADER & SERVICE BANNER DATA
    const DEFAULT_MENU_HEADER_DATA = {
      title: "เมนูแนะนำ คาเฟ่ & ครัวบ้านตาผาย",
      subtitle: "กาแฟสดอาราบิก้า เครื่องดื่มคลายร้อน อาหารไทยต้นตำรับ และของทานเล่น",
      iconClass: "fa-solid fa-mug-saucer",
      serviceTitle: "บริการเสิร์ฟถึงระเบียงห้องพัก & ซุ้มไม้ริมน้ำฟรี!",
      serviceDesc: "เวลาเปิดครัว: 10:00 – 20:00 น. | อาหารเช้าบริการเวลา: 07:30 – 09:30 น. สามารถแจ้งสั่งล่วงหน้าผ่าน LINE เพื่อความสะดวกรวดเร็วได้เลยค่ะ",
      serviceIcon: "fa-solid fa-bell-concierge",
      tabDrinks: "☕ กาแฟ & เครื่องดื่ม",
      tabThai: "🍲 อาหารไทย & กับข้าว",
      tabSnacks: "🍟 ของทานเล่น & สเต๊ก",
      tabBreakfast: "🍳 อาหารเช้าฟรี",
      tabAll: "ทั้งหมด"
    };

    let SITE_MENU_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_menu_header_v3');
        if (saved) return { ...DEFAULT_MENU_HEADER_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_MENU_HEADER_DATA));
    })();

    // 1.2 MASTER RECOMMENDED MENU DATA
    const DEFAULT_MENU_ITEMS = [
      // Drinks
      { id: "m1", category: "drinks", name: "เอสเพรสโซ่ / อเมริกาโน่", badge: "🔥 ขายดี", desc: "กาแฟอาราบิก้าแท้ คั่วหอมเข้ม เลือกระดับความหวานได้ (ร้อน / เย็น)", price: "เริ่มต้น ฿55.-" },
      { id: "m2", category: "drinks", name: "คาปูชิโน่ / ลาเต้ นมสด", badge: "☕ นมสดแท้", desc: "ฟองนมนุ่มละมุน ผสมผสานช็อตเอสเพรสโซ่เข้มข้นอย่างลงตัว", price: "เริ่มต้น ฿65.-" },
      { id: "m3", category: "drinks", name: "ชาเขียวมัทฉะลาเต้แท้", badge: "✨ ซิกเนเจอร์", desc: "ผงมัทฉะเกรดพรีเมียมจากญี่ปุ่น ชงสดใหม่ หอมกลิ่นชาแท้", price: "฿75.-" },
      { id: "m4", category: "drinks", name: "ชาไทยนมสดสูตรโบราณ", badge: "🍂 หอมใบชา", desc: "ชาไทยเข้มข้น หวานมันกลมกล่อม สูตรพิเศษของรีสอร์ท", price: "฿60.-" },
      { id: "m5", category: "drinks", name: "อิตาเลียนโซดาผลไม้", badge: "🧊 คลายร้อน", desc: "สตรอว์เบอร์รี / บลูฮาวาย / แอปเปิ้ลเขียว ซ่าสดชื่นริมน้ำ", price: "฿55.-" },
      { id: "m6", category: "drinks", name: "สมูทตี้มะม่วง / สตรอว์เบอร์รี", badge: "🥭 ผลไม้ปั่น", desc: "ผลไม้แท้ปั่นเนื้อเนียน หวานธรรมชาติ สดชื่นรับลมธรรมชาติ", price: "฿75.-" },
      
      // Thai
      { id: "m7", category: "thai", name: "กะเพราโบราณหมูสับ/หมูกรอบ + ไข่ดาว", badge: "🔥 เมนูฮิต", desc: "ผัดแห้งๆ รสจัดจ้านใบกะเพราแท้ เสิร์ฟพร้อมข้าวสวยร้อนๆ และไข่ดาวกรอบ", price: "เริ่มต้น ฿80.-" },
      { id: "m8", category: "thai", name: "ต้มยำกุ้งแม่น้ำ (น้ำข้น/น้ำใส)", badge: "🦐 อยุธยาแท้", desc: "กุ้งแม่น้ำตัวโต สมุนไพรไทยข่า ตะไคร้ ใบมะกรูด ซุปเข้มข้นรสเปรี้ยวเผ็ดกลมกล่อม", price: "฿180.-" },
      { id: "m9", category: "thai", name: "ปีกไก่ทอดน้ำปลาสูตรบ้านตาผาย", badge: "🍗 เมนูแนะนำ", desc: "หมักน้ำปลาแท้สูตรพิเศษ ทอดจนหนังกรอบสีทอง เนื้อในชุ่มฉ่ำ ทานคู่กับน้ำจิ้มแจ่ว", price: "฿120.-" },
      { id: "m10", category: "thai", name: "ข้าวผัดกุ้งแม่น้ำ / ข้าวผัดปู", badge: "🍚 ผัดหอมกระทะ", desc: "ข้าวสวยเรียงเม็ดสวย ผัดไฟแรงหอมกลิ่นกระทะ พร้อมเนื้อกุ้ง/ปูสดหวาน", price: "฿95.-" },
      { id: "m11", category: "thai", name: "ต้มจืดเต้าหู้หมูสับสาหร่าย", badge: "🍲 ซดร้อนๆ", desc: "น้ำซุปใสกลมกล่อม หมูสับนุ่มหมักพริกไทย เต้าหู้ไข่และสาหร่ายวากาเมะ", price: "฿120.-" },

      // Snacks & Steak
      { id: "m12", category: "snacks", name: "เฟรนช์ฟรายส์ทอดกรอบ + ดิปชีส", badge: "🍟 ของทานเล่น", desc: "มันฝรั่งทอดกรอบไม่อมน้ำมัน เสิร์ฟร้อนๆ พร้อมซอสมะเขือเทศและชีสดิป", price: "฿79.-" },
      { id: "m13", category: "snacks", name: "นักเก็ตไก่กรอบสีทอง (6 ชิ้น)", badge: "✨ อร่อยเพลิน", desc: "นักเก็ตไก่ชิ้นโต ทอดกรอบนอกนุ่มใน ทานเล่นเพลินๆ ริมน้ำ", price: "฿79.-" },
      { id: "m14", category: "snacks", name: "สเต๊กหมูนุ่มซอสพริกไทยดำ", badge: "🥩 สเต๊ก", desc: "สันคอหมูหมักนุ่มย่างหอม ราดซอสพริกไทยดำรสเข้มข้น พร้อมเฟรนช์ฟรายส์และสลัด", price: "฿139.-" },
      { id: "m15", category: "snacks", name: "ยำวุ้นเส้นทะเลรวมมิตร", badge: "🌶️ แซ่บจี๊ด", desc: "กุ้ง ปลาหมึก หมูสับ ยำกับน้ำยำสูตรมะนาวแท้ รสเปรี้ยว เผ็ด จัดจ้าน", price: "฿150.-" },

      // Breakfast
      { id: "m16", category: "breakfast", name: "American Breakfast Set", badge: "🍳 รวมฟรีในห้องพัก", desc: "ไข่ดาว / ไข่คน ไส้กรอก แฮม ขนมปังปิ้ง แยมผลไม้ เนย ชา กาแฟ และน้ำผลไม้", price: "ฟรีทุกห้อง" },
      { id: "m17", category: "breakfast", name: "ข้าวต้มหมูสับ / ไก่ ทรงเครื่อง", badge: "🍳 รวมฟรีในห้องพัก", desc: "ข้าวต้มนุ่มซุปกระดูกหมูกลมกล่อม หมูสับปรุงรส กระเทียมเจียวหอมๆ และผักชีต้นหอม", price: "ฟรีทุกห้อง" },
      { id: "m18", category: "breakfast", name: "Garden Buffet อาหารเช้าริมสวน", badge: "🌿 วันผู้เข้าพักหนาแน่น", desc: "บุฟเฟต์อาหารเช้าครบวงจร ข้าวผัด กับข้าวพิเศษ ขนมปังปิ้ง ชากาแฟ และผลไม้ตามฤดูกาล", price: "ฟรีทุกห้อง" }
    ];

    // 2. ACTIVE ENGINE & LOCALSTORAGE (Cache-First + Cloud-Synchronized)
    let SITE_ROOMS = JSON.parse(localStorage.getItem('baantaphai_rooms_v3') || 'null');
    if (!SITE_ROOMS) {
      SITE_ROOMS = JSON.parse(JSON.stringify(DEFAULT_ROOMS_DATA));
    } else {
      Object.keys(SITE_ROOMS).forEach(k => {
        if (SITE_ROOMS[k] && SITE_ROOMS[k].price) {
          SITE_ROOMS[k].price = SITE_ROOMS[k].price.replace(/^ราคาเริ่มต้น\s*/i, '').trim();
        }
      });
    }

    let SITE_COMP_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_comp_header_v3');
        if (saved) return { ...DEFAULT_COMP_HEADER, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_COMP_HEADER));
    })();

    let SITE_COMP_MATRIX = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_comp_matrix_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_COMP_MATRIX));
    })();

    let SITE_ROOM_FINDER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_room_finder_v3');
        if (saved) return { ...DEFAULT_ROOM_FINDER_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_ROOM_FINDER_DATA));
    })();

    let SITE_DINING_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_dining_header_v3');
        if (saved) return { ...DEFAULT_DINING_HEADER_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_DINING_HEADER_DATA));
    })();

    let SITE_DINING = JSON.parse(localStorage.getItem('baantaphai_dining_v3') || 'null');
    if (!SITE_DINING) {
      SITE_DINING = JSON.parse(JSON.stringify(DEFAULT_DINING_CARDS));
    }

    let SITE_MENU = JSON.parse(localStorage.getItem('baantaphai_menu_v3') || 'null');
    if (!SITE_MENU) {
      SITE_MENU = JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS));
    }

    // 1.3 MASTER COMPLIMENTARY ACTIVITIES & RESORT EXPERIENCE DATA
    const DEFAULT_ACTIVITIES_HEADER = {
      subtitle: "Resort Experience",
      title: "กิจกรรมฟรีสำหรับผู้เข้าพักทุกท่าน",
      desc: "เพลิดเพลินกับบรรยากาศธรรมชาติและความสนุกสนานริมน้ำได้โดยไม่มีค่าใช้จ่ายเพิ่ม",
      titleSize: "normal",
      titleWeight: "semibold"
    };

    const DEFAULT_ACTIVITIES_ITEMS = [
      {
        id: "kayak",
        emoji: "🛶",
        title: "พายเรือคายัค",
        desc: "มีชูชีพฟรี ปลอดภัย",
        detailBtnText: "ดูรายละเอียด →",
        colorTheme: "blue",
        fontSize: "normal",
        emojiSize: "normal",
        modalData: {
          title: "พายเรือคายัคชมคุ้งน้ำ (Kayaking)",
          badge: "กิจกรรมไฮไลท์ยอดนิยม",
          time: "06:30 – 18:30 น. (ทุกวัน)",
          img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
          desc: "สัมผัสความเงียบสงบของสายน้ำอยุธยาด้วยเรือคายัคมาตรฐานความปลอดภัยสูง พายล่องชมแมกไม้ธรรมชาติ สวนผลไม้ และนกน้ำนานาพันธุ์ริมฝั่งแม่น้ำ บรรยากาศยามเช้าและยามเย็นร่มรื่น สดชื่น เหมาะสำหรับทั้งคู่รักและครอบครัว",
          perks: [
            "ฟรีเสื้อชูชีพมาตรฐานสำหรับทั้งเด็กและผู้ใหญ่ครบทุกขนาด",
            "ไม้พายน้ำหนักเบา พายง่าย ควงสบาย ไม่เมื่อยล้า",
            "มีเจ้าหน้าที่คอยดูแลและให้คำแนะนำความปลอดภัยบริเวณท่าน้ำ",
            "ท่าเทียบเรือมาตรฐาน ก้าวขึ้น-ลงเรือสะดวกและปลอดภัย"
          ],
          tip: "แนะนำช่วงเวลา 07:00 – 08:30 น. แดดยังไม่ออก ลมพัดเย็นสบาย ถ่ายรูปย้อนแสงพระอาทิตย์ขึ้นสวยที่สุด หรือช่วง 17:00 – 18:15 น. ชมพระอาทิตย์อัสดงริมน้ำ",
          lineMsg: "สวัสดีค่ะ สนใจสอบถามข้อมูลกิจกรรมพายเรือคายัค สำหรับทริปเข้าพักบ้านตาผายค่ะ"
        }
      },
      {
        id: "duck",
        emoji: "🦆",
        title: "ถีบเรือเป็ด",
        desc: "ชมวิวคุ้งน้ำเพลินๆ",
        detailBtnText: "ดูรายละเอียด →",
        colorTheme: "amber",
        fontSize: "normal",
        emojiSize: "normal",
        modalData: {
          title: "ปั่นเรือเป็ดสุดชิลล์ (Duck Pedal Boat)",
          badge: "ขวัญใจเด็กๆ & ครอบครัว",
          time: "07:00 – 18:30 น. (ทุกวัน)",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          desc: "เพลิดเพลินกับกิจกรรมปั่นเรือเป็ดสีสันสดใสสุดน่ารัก ปั่นลอยลำชิลล์ๆ ชมวิวทิวทัศน์ริมน้ำกับคนพิเศษหรือเด็กๆ ปลอดภัย ไหลลื่น ปั่นง่าย ไม่ต้องออกแรงเยอะ ถ่ายรูปได้มุมน่ารักสดใส",
          perks: [
            "ฟรีเสื้อชูชีพสำหรับทุกท่านที่ลงเรือ",
            "เรือเป็ดมีความมั่นคงสูง ทรงตัวดี ไม่โคลงเคลง เหมาะกับทุกวัย",
            "นั่งได้ 2-4 ท่านต่อลำ (รองรับคุณพ่อคุณแม่และลูกๆ พร้อมกัน)",
            "บริการฟรีไม่มีค่าใช้จ่ายเพิ่มสำหรับผู้เข้าพักทุกห้อง"
          ],
          tip: "เหมาะสำหรับพาเด็กๆ มาปั่นเล่นช่วง 16:30 น. เป็นต้นไป แสงกำลังนวลสวย สามารถหยิบขนมปังมาให้อาหารปลาขณะปั่นเรือได้ด้วย",
          lineMsg: "สวัสดีค่ะ สนใจสอบถามข้อมูลกิจกรรมเรือเป็ด สำหรับทริปครอบครัวบ้านตาผายค่ะ"
        }
      },
      {
        id: "bicycle",
        emoji: "🚲",
        title: "ปั่นจักรยานริมน้ำ",
        desc: "รับลมบริสุทธิ์รอบรีสอร์ท",
        detailBtnText: "ดูรายละเอียด →",
        colorTheme: "emerald",
        fontSize: "normal",
        emojiSize: "normal",
        modalData: {
          title: "ปั่นจักรยานญี่ปุ่นชมวิถีชุมชน (Vintage Bicycle)",
          badge: "กิจกรรมสโลว์ไลฟ์",
          time: "ยืมได้ตลอดวัน 06:00 – 19:00 น.",
          img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
          desc: "บริการจักรยานวินเทจสไตล์ญี่ปุ่นพร้อมตะกร้าหน้า ให้คุณปั่นรับลมบริสุทธิ์ชมสวน สัมผัสวิถีชีวิตชาวบ้านริมน้ำอยุธยา หรือปั่นไปคาเฟ่และร้านอาหารท้องถิ่นใกล้เคียงได้อย่างสบายใจ",
          perks: [
            "มีจักรยานพร้อมตะกร้าหน้ารถสำหรับใส่ของสะพายหรือกล้อง",
            "มีหมวกกันน็อกสำหรับเด็กให้บริการเพื่อความปลอดภัย",
            "แผนที่เส้นทางปั่นชมธรรมชาติ & จุดแวะชิมอาหารพื้นบ้านท่าเรือ",
            "บริการตรวจเช็คลมยางและโซ่พร้อมใช้งานทุกคัน"
          ],
          tip: "เส้นทางรอบรีสอร์ทรถน้อยมาก อากาศยามเช้า 06:30 - 08:00 น. ร่มรื่น มีร้านกาแฟโบราณและขนมหวานขึ้นชื่อของอำเภอท่าเรือให้แวะชิมห่างไปเพียง 5-10 นาที",
          lineMsg: "สวัสดีค่ะ สนใจสอบถามข้อมูลเส้นทางปั่นจักรยานและการยืมใช้งานค่ะ"
        }
      },
      {
        id: "fish",
        emoji: "🐟",
        title: "ชมปลา & นก",
        desc: "ฝูงปลาและนกเลิฟเบิร์ด",
        detailBtnText: "ดูรายละเอียด →",
        colorTheme: "cyan",
        fontSize: "normal",
        emojiSize: "normal",
        modalData: {
          title: "ให้อาหารปลา & บ่อปลาคาร์ฟมงคล (Fish Feeding)",
          badge: "อิ่มบุญ & ผ่อนคลายจิตใจ",
          time: "ตลอดวัน 06:00 – 18:30 น.",
          img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80",
          desc: "จุดให้อาหารปลาธรรมชาติริมคุ้งน้ำและบ่อปลาคาร์ฟญี่ปุ่นมงคลหลากสีสัน ชมฝูงปลาแหวกว่ายตามธรรมชาติ เป็นกิจกรรมฝึกสมาธิที่ผ่อนคลายจิตใจและได้รับความนิยมจากทุกวัย",
          perks: [
            "ระเบียงริมน้ำมีราวกั้นปลอดภัย แข็งแรง เด็กๆ ให้อาหารปลาได้สะดวก",
            "มีอาหารปลาคุณภาพดีให้บริการที่จุดบริการต้อนรับ",
            "จุดล้างมือพร้อมสบู่และเจลแอลกอฮอล์สะอาดข้างท่าน้ำ",
            "บรรยากาศเงียบสงบ ได้ยินเสียงสายน้ำไหลเพลินใจตลอดวัน"
          ],
          tip: "ช่วงเช้าหลังรับประทานอาหารเช้า 08:30 - 09:30 น. เป็นช่วงที่ฝูงปลาจะขึ้นมาว่ายเล่นผิวน้ำเยอะที่สุด",
          lineMsg: "สวัสดีค่ะ สนใจสอบถามจุดให้อาหารปลาและบรรยากาศริมน้ำค่ะ"
        }
      },
      {
        id: "playground",
        emoji: "🎠",
        title: "สนามเด็กเล่น",
        desc: "พื้นที่เล่นสำหรับเด็กๆ",
        detailBtnText: "ดูรายละเอียด →",
        colorTheme: "orange",
        fontSize: "normal",
        emojiSize: "normal",
        modalData: {
          title: "สนามเด็กเล่น & ลานกิจกรรม (Playground)",
          badge: "พื้นที่แห่งรอยยิ้มครอบครัว",
          time: "07:00 – 19:00 น.",
          img: "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=1200&q=80",
          desc: "ลานกิจกรรมกลางแจ้งบนผืนหญ้าเขียวขจี ล้อมรอบด้วยต้นไม้ร่มรื่น พร้อมเครื่องเล่น ชิงช้า ม้ากระดก และสไลเดอร์ ปลอดภัย ออกแบบมาเพื่อเสริมสร้างพัฒนาการและให้เด็กๆ ปลดปล่อยพลังอย่างเต็มที่",
          perks: [
            "ปูพื้นหญ้านุ่มและพื้นที่ลดแรงกระแทกเพื่อความปลอดภัยของเด็ก",
            "เครื่องเล่นตรวจเช็คความแข็งแรงสม่ำเสมอทุกสัปดาห์",
            "มีม้านั่งในร่มสำหรับคุณพ่อคุณแม่นั่งดูแลและพักผ่อน",
            "เชื่อมต่อกับโซนลานอาหารเช้าและคาเฟ่ สะดวกสบาย"
          ],
          tip: "ช่วงเย็นแดดร่มลมตกตั้งแต่ 16:30 น. เด็กๆ จะสนุกสนานกับการวิ่งเล่นบนสนามหญ้าและพบปะเพื่อนใหม่",
          lineMsg: "สวัสดีค่ะ สนใจสอบถามพื้นที่กิจกรรมครอบครัวและสนามเด็กเล่นค่ะ"
        }
      },
      {
        id: "torii",
        emoji: "📸",
        title: "ซุ้มถ่ายรูปโทริอิ",
        desc: "มุมถ่ายรูปสไตล์ญี่ปุ่น",
        detailBtnText: "ดูรายละเอียด →",
        colorTheme: "rose",
        fontSize: "normal",
        emojiSize: "normal",
        modalData: {
          title: "ซุ้มประตูโทริอิ & สวนหินเซน (Torii & Zen Garden)",
          badge: "แลนด์มาร์คสไตล์เกียวโต",
          time: "เปิดตลอด 24 ชม. (มีไฟประดับกลางคืน)",
          img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
          desc: "จำลองบรรยากาศเสาโทริอิสีแดงชาดอันศักดิ์สิทธิ์แบบศาลเจ้าฟูชิมิอินาริแห่งเกียวโต ทอดยาวผ่านสวนหินเซนญี่ปุ่น ไผ่เขียวขจี และสะพานไม้ญี่ปุ่น ให้คุณสัมผัสฟีลลิ่งญี่ปุ่นแท้ๆ โดยไม่ต้องบินไปไกล",
          perks: [
            "บริการเช่าชุดยูกาตะญี่ปุ่นพร้อมพร็อพพัด ร่ม และเกี๊ยะไม้ครบเซ็ต",
            "มีโคมไฟประดับสไตล์ญี่ปุ่นเปิดสว่างสวยงามในยามค่ำคืน",
            "จุดตั้งกล้องถ่ายรูปมุม Signature ถ่ายได้ทั้งแนวตั้งและแนวนอน",
            "เชื่อมต่อกับโซนบ้านพัก Japanese Cottage เดินเล่นสะดวก"
          ],
          tip: "ใส่ชุดยูกาตะมาถ่ายรูปตอน 07:30 น. หรือช่วง 17:00 น. แสงแดดจะทอดยาวผ่านเสาโทริอิเกิดเงาที่สวยงามและภาพคมชัดราวกับถ่ายที่ญี่ปุ่นจริงๆ",
          lineMsg: "สวัสดีค่ะ สนใจเช่าชุดยูกาตะถ่ายรูปที่ซุ้มประตูโทริอิค่ะ"
        }
      }
    ];

    // 1.4 MASTER ROOMS SECTION HEADER & GUEST PERKS DATA
    const DEFAULT_ROOMS_HEADER = {
      subtitle: "Accommodations & Rates",
      title: "เลือกห้องพักที่เหมาะกับการพักผ่อนของคุณ",
      desc: "ทุกห้องพักเพียบพร้อมด้วย แอร์ ทีวี ตู้เย็น เครื่องทำน้ำอุ่น Wi-Fi ฟรี พร้อมบริการอาหารเช้าแสนอบอุ่น",
      note: '*หมายเหตุ: ราคาที่แสดงเป็น <strong>"ราคาเริ่มต้น"</strong> อาจมีการปรับเปลี่ยนตามวันเสาร์-อาทิตย์ หรือวันหยุดนักขัตฤกษ์',
      titleSize: "normal",
      titleWeight: "semibold"
    };

    const DEFAULT_PERKS_DATA = [
      {
        id: "special",
        emoji: "🌿",
        badge: "Special",
        title: "สิทธิพิเศษวันธรรมดา (อา-พฤ)",
        desc: "ฟรีเซ็ตมัทฉะต้อนรับ และขอเลทเช็คเอาท์ได้ถึง 13:00 น. (เมื่อมีห้องว่าง)",
        colorTheme: "amber",
        fontSize: "normal",
        emojiSize: "normal"
      },
      {
        id: "complimentary",
        emoji: "🎂",
        badge: "Complimentary",
        title: "ฉลองวันเกิด & วันครบรอบ",
        desc: "แจ้งล่วงหน้า รับฟรีการ์ดอวยพร & ขนมหวานพิเศษเสิร์ฟถึงห้องพัก",
        colorTheme: "rose",
        fontSize: "normal",
        emojiSize: "normal"
      },
      {
        id: "included",
        emoji: "🛶",
        badge: "Included",
        title: "รวมฟรีทุกการเข้าพัก",
        desc: "ฟรีอาหารเช้า, คายัคริมน้ำ, จักรยานปั่นชิลล์ และชุดยูกาตะถ่ายรูป",
        colorTheme: "emerald",
        fontSize: "normal",
        emojiSize: "normal"
      }
    ];

    // 1.45 MASTER LOGO & BRANDING DATA
    const DEFAULT_LOGO_DATA = {
      type: "icon",
      iconClass: "fa-solid fa-torii-gate",
      imageUrl: "",
      title: "Baan Ta Phai",
      subtitle: "Resort Ayutthaya",
      titleTh: "บ้านตาผายรีสอร์ท",
      pageTitle: "บ้านตาผายรีสอร์ท | Ta Phai Country House Resort & Restaurant"
    };

    // 1.46 MASTER NAVBAR & MENU LINKS DATA
    const DEFAULT_NAV_MENU_DATA = {
      menuRooms: "ห้องพัก",
      menuRoomsHref: "#rooms",
      menuDining: "คาเฟ่ & อาหาร",
      menuDiningHref: "#dining",
      menuReviews: "รีวิว 4.7★",
      menuReviewsIcon: "fa-solid fa-star text-amber-500 text-xs",
      menuReviewsHref: "#reviews",
      dropdownTitle: "ข้อมูลแนะนำ",
      subItemFeed: "ฟีดสดเพจ Facebook",
      subItemFeedIcon: "fa-brands fa-facebook text-[#1465D8]",
      subItemFeedHref: "#facebook-feed",
      subItemPhotoSpots: "6 จุดถ่ายรูปยอดฮิต",
      subItemPhotoSpotsIcon: "fa-solid fa-camera text-rose-500",
      subItemPhotoSpotsHref: "#photospots",
      subItemFaq: "คำถามที่พบบ่อย (FAQ)",
      subItemFaqIcon: "fa-solid fa-circle-question text-purple-600",
      subItemFaqHref: "#faq"
    };

    let SITE_NAV_MENU = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_nav_menu_v3');
        if (saved) return { ...DEFAULT_NAV_MENU_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_NAV_MENU_DATA));
    })();

    // 1.47 MASTER HEADER ACTIONS (Day/Night Mode, Phone, Messenger, LINE) DATA
    const DEFAULT_HEADER_ACTIONS_DATA = {
      showDayNight: true,
      dayNightLabelNight: "โหมดกลางคืน",
      dayNightLabelDay: "โหมดกลางวัน",
      showPhone: true,
      phoneText: "062-460-5863",
      phoneTel: "tel:0624605863",
      showMessenger: true,
      messengerText: "Messenger",
      messengerUrl: "https://m.me/Baantaphai",
      showLine: true,
      lineText: "ทัก LINE",
      lineUrl: "https://line.me/R/ti/p/@baantaphairesort"
    };

    let SITE_HEADER_ACTIONS = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_header_actions_v3');
        if (saved) return { ...DEFAULT_HEADER_ACTIONS_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_HEADER_ACTIONS_DATA));
    })();

    // 1.5 MASTER SIGNATURE PHOTO SPOTS DATA
    const DEFAULT_PHOTO_SPOTS_HEADER = {
      badge: "Signature Photo Spots",
      title: "6 มุมถ่ายรูปยอดฮิตที่คุณไม่ควรพลาด",
      desc: "เก็บบันทึกภาพความทรงจำริมสายน้ำอยุธยาและบรรยากาศอบอุ่นสไตล์ญี่ปุ่น พร้อมคำแนะนำช่วงเวลาที่แสงสวยที่สุดในแต่ละจุด",
      titleSize: "normal"
    };

    const DEFAULT_PHOTO_SPOTS_DATA = [
      {
        id: "spot1",
        title: "1. ซุ้มประตูโทริอิ & ทางเดินหิน",
        zone: "⛩️ โซนหมู่บ้านญี่ปุ่น",
        time: "แสงสวย: 08:00 - 09:30 น.",
        timeBadgeColor: "amber",
        img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        desc: "ซุ้มประตูโทริอิสีแดงสดตัดกับแมกไม้สีเขียวขจีและทางเดินหินรีโนเวทใหม่ ได้ฟีลเหมือนเดินเล่นในศาลเจ้าเกียวโต ถ่ายคู่กับชุดยูกาตะยิ่งลงตัว",
        tip: "💡 ทิป: ถ่ายมุมเสยให้เห็นยอดซุ้มตัดกับท้องฟ้า",
        borderHoverColor: "rose",
        modalData: {
          title: "ซุ้มประตูโทริอิสีแดง (Torii Gate)",
          zone: "⛩️ โซนหมู่บ้านญี่ปุ่น",
          time: "ช่วงเวลาแนะนำ: 07:00 – 08:30 น. & 16:30 – 17:45 น.",
          img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
          desc: "แลนด์มาร์คเสาโทริอิสีแดงชาดทอดยาวท่ามกลางสวนไผ่และทางเดินหินสไตล์เกียวโต ให้ฟีลลิ่งญี่ปุ่นแท้ๆ ตั้งแต่ก้าวแรกที่เดินผ่าน",
          tip: "ยืนกึ่งกลางทางเดินเสาโทริอิ เปิดโหมด Portrait หน้าชัดหลังเบลอ หรือถ่ายมุมต่ำเสยขึ้นเพื่อเน้นความโอ่อ่าของซุ้มประตู แนะนำใส่ชุดกิโมโนหรือยูกาตะจะยิ่งเข้ากับบรรยากาศ"
        }
      },
      {
        id: "spot2",
        title: "2. ระเบียงนั่งห้อยขาชมวิวโค้งน้ำ",
        zone: "🌊 โซนบ้านริมน้ำ",
        time: "แสงสวย: 16:00 - 17:30 น.",
        timeBadgeColor: "amber",
        img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
        desc: "เอกลักษณ์ของห้อง Rock View และ Lake View นั่งห้อยขาสัมผัสไอเย็นริมสายน้ำ พร้อมถือแก้วกาแฟหรืออ่านหนังสือ รับลมเย็นสบายทั้งวัน",
        tip: "💡 ทิป: ถ่ายมุมกว้าง (Wide) ให้เห็นความยาวของแม่น้ำ",
        borderHoverColor: "cyan",
        modalData: {
          title: "ระเบียงนั่งห้อยขาริมแม่น้ำอยุธยา (Riverside Deck)",
          zone: "🌊 โซนบ้านริมน้ำ",
          time: "ช่วงเวลาแนะนำ: 06:30 – 08:00 น. & 17:00 – 18:30 น.",
          img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
          desc: "ระเบียงไม้ยื่นสู่ผืนน้ำอยุธยา นั่งห้อยขาสบายๆ จิบชากาแฟอุ่นๆ พร้อมวิวคุ้งน้ำธรรมชาติและสายหมอกยามเช้าอันเงียบสงบ",
          tip: "ถ่ายจากมุมเฉียงด้านข้างให้เห็นทั้งท่าทางนั่งห้อยขา แก้วกาแฟ และระลอกคลื่นน้ำสะท้อนแสงแดดประกายสีทองยามเช้า"
        }
      },
      {
        id: "spot3",
        title: "3. ช็อตพายเรือคายัคแสงสีทอง",
        zone: "🛶 ท่าเรือคายัคฟรี",
        time: "Golden Hour: 17:15 - 18:00 น.",
        timeBadgeColor: "emerald",
        img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        desc: "พายเรือคายัคออกไปกลางสายน้ำยามพระอาทิตย์ตกดิน ผิวน้ำจะสะท้อนแสงสีส้มทองอบอุ่น ได้ภาพสวยระดับโปสการ์ด มีชูชีพให้ปลอดภัย 100%",
        tip: "💡 ทิป: ให้เพื่อนยืนถ่ายจากบนฝั่งตอนเรือกำลังเคลื่อนที่",
        borderHoverColor: "amber",
        modalData: {
          title: "ลานเรือคายัค & พระอาทิตย์อัสดง (Sunset Kayak)",
          zone: "🛶 ท่าเรือคายัคฟรี",
          time: "ช่วงเวลาแนะนำ: 17:15 – 18:30 น. (Golden Hour)",
          img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
          desc: "จุดชมพระอาทิตย์ตกดินที่สวยที่สุดของรีสอร์ท ท้องฟ้าเปลี่ยนเป็นสีส้มอมชมพูตัดกับผืนน้ำระยิบระยับยามเย็น",
          tip: "ถ่ายภาพย้อนแสง (Silhouette) ขณะกำลังพายเรือคายัค หรือยืนจับไม้พายริมท่าน้ำ จะได้ภาพเงาดำคมชัดตัดกับท้องฟ้าทไวไลท์สวยสะกดใจ"
        }
      },
      {
        id: "spot4",
        title: "4. ซุ้มอาหารไม้ไผ่ส่วนตัวริมน้ำ",
        zone: "☕ คาเฟ่ & ซุ้มริมน้ำ",
        time: "ตลอดวัน (11:00 - 19:30 น.)",
        timeBadgeColor: "amber",
        img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        desc: "สั่งต้มยำกุ้งแม่น้ำ อาหารจานด่วน หรือเครื่องดื่มกาแฟสดมานั่งทานในซุ้มไม้ไผ่ริมน้ำ ลมโกรกสบาย ถ่ายรูปอาหารคู่กับสายน้ำดูน่าทานยิ่งขึ้น",
        tip: "💡 ทิป: ถ่ายมุม Flat Lay ให้เห็นเมนูอาหารและสายน้ำ",
        borderHoverColor: "amber",
        modalData: {
          title: "ซุ้มอาหารไม้ไผ่ส่วนตัวริมน้ำ (Riverside Bamboo Pavilion)",
          zone: "☕ คาเฟ่ & ซุ้มริมน้ำ",
          time: "ตลอดวัน (11:00 - 19:30 น.)",
          img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
          desc: "สั่งต้มยำกุ้งแม่น้ำ อาหารจานด่วน หรือเครื่องดื่มกาแฟสดมานั่งทานในซุ้มไม้ไผ่ริมน้ำ ลมโกรกสบาย ถ่ายรูปอาหารคู่กับสายน้ำดูน่าทานยิ่งขึ้น",
          tip: "ถ่ายมุม Flat Lay ให้เห็นเมนูอาหารและสายน้ำ พร้อมแสงแดดธรรมชาติกระทบอาหารเพื่อความน่ารับประทาน"
        }
      },
      {
        id: "spot5",
        title: "5. โถงสนุกเกอร์ & โต๊ะฟุตบอลมือหมุน",
        zone: "🏡 Country House ชั้น 1",
        time: "ชิลล์ยามค่ำคืน",
        timeBadgeColor: "stone",
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        desc: "มุมกิจกรรมสังสรรค์ในบ้านเหมาหลัง Country House ถ่ายรูปฟีลปาร์ตี้อบอุ่นกับเพื่อนๆ และครอบครัว ได้ทั้งความสนุกและความทรงจำร่วมกัน",
        tip: "💡 ทิป: ถ่ายภาพ Portrait แอ็กชั่นกำลังเล็งแทงลูกสนุกเกอร์",
        borderHoverColor: "emerald",
        modalData: {
          title: "โถงสนุกเกอร์ & โต๊ะฟุตบอลมือหมุน (Snooker Lounge)",
          zone: "🏡 Country House ชั้น 1",
          time: "ชิลล์ได้ตลอดวัน & ยามค่ำคืน",
          img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          desc: "มุมกิจกรรมสังสรรค์ในบ้านเหมาหลัง Country House ถ่ายรูปฟีลปาร์ตี้อบอุ่นกับเพื่อนๆ และครอบครัว ได้ทั้งความสนุกและความทรงจำร่วมกัน",
          tip: "ถ่ายภาพ Portrait แอ็กชั่นกำลังเล็งแทงลูกสนุกเกอร์ หรือถ่ายมุมกว้างโถงปาร์ตี้ให้เห็นบรรยากาศความสนุกสนานของเพื่อนๆ"
        }
      },
      {
        id: "spot6",
        title: "6. เซ็ตอาหารเช้าในสวนร่มรื่น",
        zone: "🍳 ลานอาหารเช้าริมสวน",
        time: "ช่วงเช้า: 07:30 - 09:00 น.",
        timeBadgeColor: "emerald",
        img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
        desc: "เสิร์ฟ American Breakfast ไข่ดาว ไส้กรอก และข้าวต้มหมูร้อนๆ ท่ามกลางสวนธรรมชาติและไอหมอกริมน้ำในยามเช้า ฟีลอบอุ่นและสดชื่นที่สุด",
        tip: "💡 ทิป: ถ่ายตอนแสงแดดยามเช้าส่องทะลุเงาไม้ลงบนโต๊ะอาหาร",
        borderHoverColor: "emerald",
        modalData: {
          title: "เซ็ตอาหารเช้าในสวนร่มรื่น (Garden Breakfast)",
          zone: "🍳 ลานอาหารเช้าริมสวน",
          time: "ช่วงเช้า: 07:30 – 09:30 น.",
          img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
          desc: "เสิร์ฟ American Breakfast ไข่ดาว ไส้กรอก และข้าวต้มหมูร้อนๆ ท่ามกลางสวนธรรมชาติและไอหมอกริมน้ำในยามเช้า ฟีลอบอุ่นและสดชื่นที่สุด",
          tip: "ถ่ายตอนแสงแดดยามเช้าส่องทะลุเงาไม้ลงบนโต๊ะอาหาร จะได้ภาพอาหารเช้าโทนอบอุ่นและแสงนวลละมุนตา"
        }
      }
    ];

    // 1.6 MASTER REVIEWS & TRUST DATA
    const DEFAULT_REVIEWS_HEADER = {
      badge: "Verified Guest Experiences",
      title: "รีวิวและความประทับใจจากลูกค้าจริง",
      desc: "เสียงตอบรับจากผู้เข้าพักที่ได้มาสัมผัสความสุขริมสายน้ำอยุธยากับเรา ความประทับใจที่คุณวางใจได้ 100%",
      googleRating: "4.7",
      googleReviewsCount: "Google Maps (180+)",
      googleMapsLink: "https://www.google.com/maps/place/Ta+Phai+Country+House+Resort+%26+Restaurant+%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%B2%E0%B8%9C%E0%B8%B2%E0%B8%A2/@14.5254055,22.6745089,3z/data=!4m15!1m3!11m2!2sfvCh34A6yu-arkFKSLatu3YK6l20xQ!3e1!3m10!1s0x311df15adefc75fb:0xe8712cc588511d8e!5m2!4m1!1i2!8m2!3d14.5254055!4d100.7213839!9m1!1b1!16s%2Fg%2F11lqlzj55l?entry=ttu",
      facebookPercent: "98%",
      facebookReviewsLink: "https://www.facebook.com/Baantaphai/reviews",
      dualPillFb: "98% แขกแนะนำบน Facebook",
      dualPillGoogle: "4.7 ดาว บน Google Maps",
      dualPlatformTag: "ความพึงพอใจ 2 แพลตฟอร์ม",
      dualCardTitle: "รีวิวจริงจาก 2 ช่องทางชั้นนำ ยืนยันความประทับใจระดับ 98%",
      dualCardDesc: "สัมผัสเสียงตอบรับจริงจากผู้เข้าพักที่ได้มาสัมผัสความสุขริมสายน้ำอยุธยากับบ้านตาผาย ทั้งบนเพจ Facebook ทางการ (@Baantaphai) และ Google Maps ตรวจสอบความประทับใจแบบเรียลไทม์ได้ทั้ง 2 ช่องทาง",
      dualBottomNote: "อัปเดตต่อเนื่องจากผู้เข้าพักจริง",
      dualFbBtnText: "คำแนะนำบน Facebook (98%)",
      dualGoogleBtnText: "Google Maps (4.7★)",
      commitments: [
        {
          id: "commit_1",
          icon: "fa-solid fa-thumbs-up text-[#1465D8]",
          title: "98% แขกแนะนำ",
          desc: "การันตีความพึงพอใจบน Facebook"
        },
        {
          id: "commit_2",
          icon: "fa-solid fa-shield-heart text-zen-torii",
          title: "การันตีจองตรง",
          desc: "ราคาจริง ไม่มีบวกค่าคอมมิชชั่น"
        },
        {
          id: "commit_3",
          icon: "fa-solid fa-utensils text-amber-600",
          title: "ฟรีอาหารเช้า & กิจกรรม",
          desc: "รวมพายเรือคายัคและเรือเป็ดริมน้ำ"
        },
        {
          id: "commit_4",
          icon: "fa-solid fa-broom text-cyan-600",
          title: "สะอาด ปลอดภัย 100%",
          desc: "มาตรฐาน SHA Plus ทำความสะอาดทุกวัน"
        }
      ]
    };

    // 1.65 MASTER FACEBOOK COMMUNITY FEED DATA
    const DEFAULT_FACEBOOK_FEED_DATA = {
      badge: "Official Facebook Community • @Baantaphai",
      badgeIcon: "fa-brands fa-facebook",
      title: "อัปเดตบรรยากาศ & สิทธิพิเศษจากเพจ Facebook",
      desc: "เกาะติดภาพถ่ายบรรยากาศคุ้งน้ำอยุธยาวันนี้ โปรโมชั่นพิเศษ และกิจกรรมสนุกๆ ส่งตรงจากเพจทางการ @Baantaphai",
      pageName: "บ้านตาผาย Baan Ta Phai",
      pageHandle: "@Baantaphai • ผู้ติดตาม 8,270+ คน • ตอบกลับใน 5 นาที",
      pageUrl: "https://www.facebook.com/Baantaphai",
      postBadge: "โพสต์ปักหมุด",
      postCaption: "🎉 ขยายโปรโมชั่นพิเศษถึงสิ้นเดือนนี้! หนีความวุ่นวายมาพักผ่อนริมสายน้ำอยุธยาที่บ้านตาผายรีสอร์ท รับส่วนลดสุดคุ้ม 100 บาท เพียงร่วมกิจกรรมผ่าน TikTok หรือ FB/IG พร้อมพายคายัคฟรี และความเงียบสงบในบรรยากาศญี่ปุ่นริมแม่น้ำ ✨",
      promoBannerImg: "facebook_promo_banner.jpg",
      messengerUrl: "https://m.me/Baantaphai",
      benefitsTitle: "ติดตามเพจบ้านตาผาย ได้อะไรบ้าง?",
      benefitsSubtitle: "ร่วมเป็นครอบครัวเดียวกับเรา รับสิทธิพิเศษก่อนใคร",
      benefitsIcon: "✨",
      benefitItems: [
        {
          id: "fb_b1",
          icon: "🏡",
          title: "ภาพบรรยากาศบ้านพัก ห้องพัก",
          tag: "อัปเดตใหม่",
          desc: "ชมภาพห้องพักจริง บรรยากาศคุ้งน้ำอยุธยา และมุมพักผ่อนสไตล์ญี่ปุ่นก่อนเดินทางมาเช็คอิน"
        },
        {
          id: "fb_b2",
          icon: "🎟️",
          title: "โปรโมชั่นพิเศษ",
          tag: "สิทธิ์ลด 100.-",
          desc: "รับแจ้งสิทธิพิเศษเฉพาะผู้ติดตามเพจ กิจกรรมแจกส่วนลด และดีลห้องพักสุดคุ้มตลอดทั้งปี"
        },
        {
          id: "fb_b3",
          icon: "💬",
          title: "แชทคุยกับแอดมินใจดี ตอบไว",
          tag: "ตอบใน 5 นาที",
          desc: "ทักสอบถามเส้นทาง เช็คห้องว่าง หรือจองห้องพักได้อย่างสะดวกรวดเร็วในแชทเดียว"
        }
      ],
      ctaTitle: "พร้อมพักผ่อนริมสายน้ำกับเราแล้วหรือยัง?",
      ctaSubtitle: "กดติดตามเพจ หรือทักคุยกับแอดมินใจดีได้ตลอดเวลา",
      ctaIcon: "🎋",
      ctaBtn1Text: "ติดตามเพจ Facebook",
      ctaBtn2Text: "ทัก Messenger สอบถาม",
      ctaNote: "แวะมาพักแล้ว อย่าลืม Check-in & แท็ก @Baantaphai อวดรูปสวยกันนะครับ!"
    };

    // 1.68 MASTER NEARBY ATTRACTIONS DATA
    const DEFAULT_ATTRACTIONS_HEADER = {
      badge: "Nearby Places",
      title: "สถานที่ท่องเที่ยวใกล้เคียง",
      desc: "เดินทางสะดวก เที่ยวต่อได้ง่ายรอบอำเภอท่าเรือและอยุธยา",
      mapsLink: "https://maps.app.goo.gl/QZnssrZgScjpk9cJ8",
      mapsBtnText: "ดูพิกัดบน Google Maps"
    };

    const DEFAULT_ATTRACTIONS_ITEMS = [
      {
        id: "attract_1",
        emoji: "🦁",
        timeTag: "5 นาที ถึง",
        title: "ศรีอยุธยา ไลออน ปาร์ค",
        desc: "สวนสัตว์ยอดนิยม เหมาะสำหรับทุกครอบครัว",
        colorTheme: "amber"
      },
      {
        id: "attract_2",
        emoji: "🪷",
        timeTag: "8 นาที ถึง",
        title: "วัดตะโก (หลวงพ่อรวย)",
        desc: "กราบสักการะพระมหาธาตุเจดีย์มงคลสิทธาจารย์",
        colorTheme: "orange"
      },
      {
        id: "attract_3",
        emoji: "🪷",
        timeTag: "15 นาที ถึง",
        title: "วัดสะตือพุทธไสยาสน์",
        desc: "ไหว้ขอพรพระนอนองค์ใหญ่ริมแม่น้ำป่าสัก",
        colorTheme: "emerald"
      },
      {
        id: "attract_4",
        emoji: "🛒",
        timeTag: "7-10 นาที ถึง",
        title: "7-Eleven & ตลาดท่าเรือ",
        desc: "ตลาดเช้า ตลาดเย็น และร้านสะดวกซื้อ",
        colorTheme: "blue"
      }
    ];

    // 1.7 MASTER FAQ DATA
    const DEFAULT_FAQ_HEADER = {
      badge: "Frequently Asked Questions",
      title: "คำถามที่พบบ่อย (FAQ)",
      desc: "รวมทุกข้อสงสัยที่ลูกค้าสอบถามบ่อย พร้อมระบบค้นหาคำตอบอย่างรวดเร็ว หากมีคำถามเพิ่มเติมสามารถทักแชท LINE ได้ตลอดเวลา",
      searchPlaceholder: "พิมพ์ค้นหาคำถาม เช่น สัตว์เลี้ยง, อาหารเช้า, เสริมเตียง, เช็คอินก่อนเวลา, ปิ้งย่าง...",
      fontOverride: "",
      ctaTitle: "ยังมีคำถามอื่นๆ หรือต้องการสอบถามเพิ่มเติม?",
      ctaDesc: "เจ้าหน้าที่ของเราพร้อมให้คำแนะนำและช่วยเหลือคุณผ่าน Facebook Messenger หรือ LINE Official ตลอดเวลา",
      ctaButtons: [
        {
          id: "btn_messenger",
          label: "ทัก Messenger",
          url: "https://m.me/Baantaphai",
          icon: "fa-brands fa-facebook-messenger",
          colorTheme: "messenger"
        },
        {
          id: "btn_line",
          label: "ทัก LINE",
          url: "https://line.me/R/ti/p/@baantaphairesort",
          icon: "fa-brands fa-line",
          colorTheme: "line"
        }
      ]
    };

    const DEFAULT_FAQ_ITEMS = [
      {
        id: "faq_1",
        icon: "🕒",
        question: "เวลาเช็คอิน-เช็คเอาท์กี่โมง? ถ้ามาถึงก่อนเวลาเข้าพักได้ไหม?",
        answer: "• **เวลาเช็กอิน (Check-in):** 14:00 น. เป็นต้นไป\n• **เวลาเช็กเอาต์ (Check-out):** ก่อน 12:00 น.\n\nหากท่านเดินทางมาถึงก่อนเวลา 14:00 น. สามารถเข้ามานั่งพักผ่อน สั่งเครื่องดื่มกาแฟสดและอาหารที่คาเฟ่ริมน้ำรอสบายๆ ได้ฟรี พร้อมบริการฝากสัมภาระไว้ที่ล็อบบี้ต้อนรับครับ"
      },
      {
        id: "faq_2",
        icon: "🍳",
        question: "อาหารเช้ารวมฟรีในห้องพักไหม และมีบริการสั่งอาหารขึ้นห้องพักหรือไม่?",
        answer: "**รวมอาหารเช้าฟรีทุกห้องพักครับ!** บริการเวลา 07:30 – 09:30 น. เมนูประกอบด้วย American Breakfast (ไข่ดาว ไส้กรอก แฮม ขนมปังปิ้ง แยมผลไม้ เนย) และข้าวต้มหมู/ไก่ร้อนๆ เติมได้ไม่อั้น พร้อมชา กาแฟ และน้ำผลไม้\n\nนอกจากนี้ ทางรีสอร์ทมีบริการครัวอาหารไทย (10:00 – 20:00 น.) บริการยกเสิร์ฟร้อนๆ ถึงซุ้มไม้ริมน้ำส่วนตัวและระเบียงห้องพักฟรี สามารถสั่งล่วงหน้าผ่าน LINE ได้เลยครับ"
      },
      {
        id: "faq_3",
        icon: "🐶",
        question: "สามารถนำสัตว์เลี้ยง (สุนัข / แมว) เข้าพักได้ไหม?",
        answer: "เพื่อรักษาความสะอาด ความเงียบสงบ และสุขอนามัยสำหรับผู้เข้าพักทุกท่าน รวมถึงผู้ที่มีอาการแพ้ขนสัตว์ **ทางรีสอร์ทขอความกรุณางดรับสัตว์เลี้ยงทุกประเภทเข้าพักในห้องพักครับ**"
      },
      {
        id: "faq_4",
        icon: "🛏️",
        question: "เสริมเตียง / ฟูกเสริม คิดราคาเท่าไหร่ และเด็กพักฟรีไหม?",
        answer: "• **เด็กเล็กอายุต่ำกว่า 7 ขวบ:** เข้าพักฟรีร่วมกับผู้ปกครองได้ (ไม่เสริมเตียง)\n• **ฟูกเสริม (ขนาด 3.5 ฟุต):** ราคา 100 บาท / ชุด\n• **เตียงเสริม (ขนาด 3.5 ฟุต):** ราคา 200 บาท / หลัง (รวมอุปกรณ์เครื่องนอนครบชุด)\n• **ค่าบริการผู้เข้าพักเสริม:** 50 บาท / ท่าน | ค่าอาหารเช้าเพิ่มเติม เด็กเล็ก 50.- / ผู้ใหญ่ 100.-"
      },
      {
        id: "faq_5",
        icon: "🛶",
        question: "กิจกรรมพายเรือคายัค จักรยาน และสนุกเกอร์ ฟรีจริงไหม? มีค่าใช้จ่ายเพิ่มไหม?",
        answer: "**ฟรี 100% สำหรับผู้เข้าพักทุกท่านครับ!** ไม่มีค่าใช้จ่ายแอบแฝงใดๆ ทั้งสิ้น:\n• เรือคายัค & เรือเป็ดถีบ มีเสื้อชูชีพสำหรับเด็กและผู้ใหญ่ครบครัน\n• จักรยานปั่นรับลมรอบบริเวณรีสอร์ท\n• โต๊ะสนุกเกอร์ & โต๊ะฟุตบอลมือหมุน (สำหรับผู้เข้าพักบ้าน Country House)\n• สนามเด็กเล่นและมุมชมฝูงปลาธรรมชาติริมน้ำ"
      },
      {
        id: "faq_6",
        icon: "🚗",
        question: "มีที่จอดรถส่วนตัวไหม ปลอดภัยหรือไม่?",
        answer: "มีลานจอดรถส่วนตัวภายในรีสอร์ทอย่างกว้างขวาง สามารถจอดรถหน้าบ้านพักและข้างห้องพักได้สะดวก ปลอดภัยด้วยระบบไฟส่องสว่างและกล้องวงจรปิด CCTV ตลอด 24 ชั่วโมงครับ"
      },
      {
        id: "faq_7",
        icon: "🥩",
        question: "สามารถนำเตาปิ้งย่างหรือทำอาหารเองได้ไหม?",
        answer: "• **บ้านเหมาหลัง 2 ชั้น (Country House):** อนุญาตให้จัดปาร์ตี้ปิ้งย่างบริเวณลานหน้าบ้านพักได้ โดยสามารถแจ้งเจ้าหน้าที่ล่วงหน้าเพื่อจัดเตรียมจุดตั้งเตาได้ครับ\n• **ห้องพักโซนริมน้ำและโซนญี่ปุ่น:** ไม่อนุญาตให้ก่อไฟหรือประกอบอาหารที่มีควันในบริเวณห้องพัก เพื่อความปลอดภัยและสุขอนามัย แต่สามารถสั่งอาหารจากครัวของรีสอร์ทมาทานได้อย่างสะดวกสบายครับ"
      }
    ];

    // 1.8 MASTER STAY POLICIES DATA
    const DEFAULT_POLICIES_DATA = {
      title: "เงื่อนไขและการเข้าพัก",
      checkin: "14:00 น. ขึ้นไป",
      checkout: "ก่อน 12:00 น.",
      breakfast: "บริการเวลา 07:30 – 09:30 น. ที่ Garden Zone & Breakfast",
      wifi: 'ชื่อสัญญาณ "บ้านตาผาย" (รหัสผ่าน: taphai60)',
      extraBed: "เตียงสปริงเสริม 200.- / ฟูกเสริม 100.- / ท่านเสริม 50.-",
      notice: "ไม่อนุญาตให้ตกปลาในรีสอร์ท (มีบ่อตกปลาห่าง 10 นาที)"
    };

    // 1.9 MASTER CONTACT & LOCATION DATA
    const DEFAULT_CONTACT_DATA = {
      badge: "Contact & Location",
      title: "การเดินทาง & ข้อมูลติดต่อ",
      address: "35 หมู่ 7 ต.หนองขนาก อ.ท่าเรือ จ.พระนครศรีอยุธยา 13130",
      phone1: "062-460-5863",
      phone2: "097-175-2714",
      facebookName: "บ้านตาผาย (@Baantaphai)",
      facebookUrl: "https://m.me/Baantaphai",
      lineId: "@baantaphairesort",
      lineUrl: "https://line.me/R/ti/p/@baantaphairesort",
      mapsUrl: "https://maps.app.goo.gl/QZnssrZgScjpk9cJ8"
    };

    // 1.95 MASTER TOP ANNOUNCEMENT BAR & WEATHER DATA
    const DEFAULT_TOP_BAR_DATA = {
      announcementText: "บ้านตาผาย รีสอร์ท อยุธยา • ธรรมชาติริมน้ำ & ซุ้มโทริอิ • พายเรือคายัคฟรี",
      useLiveWeather: true,
      customWeatherText: "🌤️ อ.ท่าเรือ อยุธยา 29°C ลมเย็นสบาย",
      promoText: "จองผ่าน LINE รับโปรพิเศษ"
    };

    // 1.96 MASTER OMIKUJI & FORTUNE SYSTEM DATA
    const DEFAULT_OMIKUJI_HEADER = {
      title: "เซียมซีนำโชคบ้านตาผาย",
      subtitle: "เขย่าเซียมซีรับคำทำนายมงคล ลุ้นรับส่วนลดห้องพัก 10–100.- หรือส่วนลดอาหาร 5–10%",
      badge: "จำกัด 1 เครื่อง 1 สิทธิ์ (1 Spin / Device)",
      tabGameText: "🎋 เสี่ยงเซียมซี",
      tabOddsText: "อัตราออกรางวัล & เรท (Odds)",
      oddsTitle: "ตารางอัตราความน่าจะเป็น & สิทธิพิเศษ (เรท 100%)",
      oddsDesc: "แสดงเรทโอกาสออกรางวัลจริง เพื่อความโปร่งใสต่อลูกค้า และให้พนักงานหน้าร้านใช้ตรวจสอบ"
    };

    const DEFAULT_OMIKUJI_PRIZES = [
      {
        id: "room_100",
        kanji: "大吉",
        levelName: "มหาโชค",
        badgeColor: "amber",
        fortune: "✨ มหาโชค (大吉 - Daikichi)",
        title: "ส่วนลดห้องพัก 100 บาท",
        poem: "\"เสมือนต้นไผ่ต้องลมหนาว ครั้นวสันตฤดูมาเยือน ย่อมผลิใบเขียวขจีงดงาม ดั่งสายน้ำไหลรินไม่ขาดสาย วาสนาใหญ่หลวงกำลังเปิดทาง\"",
        prophecy: {
          destiny: "วาสนารุ่งโรจน์ อุปสรรคทั้งปวงคลี่คลาย จิตใจจะผ่องแผ้วดั่งจันทร์เพ็ญกระจ่างฟ้า",
          wish: "มีเกณฑ์สัมฤทธิ์ผลเกินคาดหมาย สิ่งที่มุ่งมั่นจะได้รับผลตอบแทนงดงาม",
          travel: "การเยือนเคหสถานริมน้ำจักนำพาโชคลาภ สุขภาพแข็งแรง และความร่มเย็นสู่ครอบครัว"
        },
        easyMeaning: "ช่วงเวลานี้โชคชะตากำลังเปิดรับสิ่งดีๆ อุปสรรคต่างๆ กำลังคลี่คลาย จะได้รับข่าวดีหรือผลตอบแทนจากสิ่งที่ตั้งใจทำ การเดินทางมาพักผ่อนริมน้ำจะยิ่งนำพาความร่มเย็นและโชคลาภมาให้",
        discountTag: "ลด 100.-",
        rate: 10,
        type: "room",
        condition: "ลดค่าห้องพักทุกประเภท เมื่อจองตรงผ่าน LINE Official"
      },
      {
        id: "room_50",
        kanji: "中吉",
        levelName: "มงคลยิ่ง",
        badgeColor: "orange",
        fortune: "🌟 มงคลยิ่ง (中吉 - Chukichi)",
        title: "ส่วนลดห้องพัก 50 บาท",
        poem: "\"หยาดน้ำค้างยามรุ่งอรุณบนยอดใบชา แม้กาลก่อนจักเหนื่อยล้า บัดนี้จักแปรเปลี่ยนเป็นความชุ่มชื่นใจ ดั่งดวงจันทร์โผล่พ้นทิวเขา\"",
        prophecy: {
          destiny: "ความเพียรที่ผ่านมาเริ่มผลิดอกออกผล มีเกณฑ์ได้รับข่าวดีและพลังชีวิตใหม่ๆ",
          wish: "ก้าวหน้าทีละขั้นอย่างมั่นคง จงดำเนินชีวิตด้วยความสุขุมรอบคอบ",
          travel: "ปลีกวิเวกชะล้างความวุ่นวายริมสายน้ำ จะฟื้นฟูพลังกายและจิตวิญญาณได้ดียิ่ง"
        },
        easyMeaning: "ความพยายามที่ทุ่มเทมานานกำลังผลิดอกออกผล มีความก้าวหน้าอย่างมั่นคง ขอเพียงใจเย็นและมีสติ การได้มานอนพักผ่อนริมสายน้ำจะช่วยฟื้นฟูพลังกายใจให้พร้อมลุยต่อ",
        discountTag: "ลด 50.-",
        rate: 15,
        type: "room",
        condition: "ลดค่าห้องพักทุกประเภท เมื่อจองตรงผ่าน LINE Official"
      },
      {
        id: "room_20",
        kanji: "小吉",
        levelName: "โชคดีแรกเริ่ม",
        badgeColor: "emerald",
        fortune: "🌸 โชคดีแรกเริ่ม (小吉 - Shokichi)",
        title: "ส่วนลดห้องพัก 20 บาท",
        poem: "\"สายลมฤดูใบไม้ผลิพัดผ่านซุ้มประตูไม้ ดอกไม้ที่รอคอยเริ่มแย้มบาน ก้าวแรกแห่งความสำเร็จเริ่มต้นจากความสงบนิ่ง\"",
        prophecy: {
          destiny: "มงคลเล็กๆ กำลังก่อกำเนิด ดั่งธารน้ำใสที่ค่อยๆ ไหลรวมเป็นแม่น้ำใหญ่",
          wish: "สำเร็จได้ด้วยความเมตตาและรอยยิ้ม จงอย่าเพิ่งรีบร้อน",
          travel: "นอนฟังเสียงสายน้ำและลมพัดกิ่งไผ่ จะเสริมสง่าราศีและความสุขกายสบายใจ"
        },
        easyMeaning: "โชคดีเล็กๆ กำลังเริ่มต้นขึ้น สิ่งที่คาดหวังจะสำเร็จได้ด้วยความใจดีและการยิ้มแย้ม ค่อยเป็นค่อยไปอย่าเพิ่งรีบร้อน แวะมานอนฟังเสียงสายน้ำจะช่วยให้จิตใจเบาสบายยิ่งขึ้น",
        discountTag: "ลด 20.-",
        rate: 10,
        type: "room",
        condition: "ลดค่าห้องพักทุกประเภท เมื่อจองตรงผ่าน LINE Official"
      },
      {
        id: "cafe_10",
        kanji: "小吉",
        levelName: "โภคทรัพย์บริบูรณ์",
        badgeColor: "rose",
        fortune: "🍲 โภคทรัพย์บริบูรณ์ (小吉 - Shokichi)",
        title: "ส่วนลดอาหาร & คาเฟ่ 10%",
        poem: "\"รวงข้าวสีทองโน้มกิ่งรับแสงสุริยัน ผู้มีใจอารีจักได้ลิ้มรสโอชา ความอิ่มเอมแห่งธาตุอาหารจักหล่อเลี้ยงมหาโชค\"",
        prophecy: {
          destiny: "ดวงโภคทรัพย์สมบูรณ์ มีลาภปากและมีโอกาสได้พบปะสังสรรค์กับกัลยาณมิตร",
          wish: "ราบรื่นดั่งสายธารอันใสสะอาด ไร้สิ่งติดขัดขัดข้อง",
          travel: "การได้รับประทานอาหารรสประณีตริมแม่น้ำ จะช่วยชะล้างความขุ่นมัวในจิตใจ"
        },
        easyMeaning: "มีเกณฑ์ได้รับความอิ่มหนำสำราญ ลาภปากมาเยือน การงานราบรื่นไร้อุปสรรค ได้พบปะเพื่อนฝูงคนรู้ใจ การมาทานของอร่อยริมน้ำจะช่วยชะล้างเรื่องเหนื่อยล้าให้หมดไป",
        discountTag: "ลด 10% คาเฟ่",
        rate: 15,
        type: "cafe",
        condition: "ใช้ลดค่าอาหารและเครื่องดื่มที่คาเฟ่ริมน้ำ (ยอด 300.- ขึ้นไป)"
      },
      {
        id: "cafe_5",
        kanji: "末吉",
        levelName: "มงคลปลายยอด",
        badgeColor: "teal",
        fortune: "☕ มงคลปลายยอด (末吉 - Suekichi)",
        title: "ส่วนลดอาหาร & คาเฟ่ 5%",
        poem: "\"ต้นสนบนยอดเขาสูงต้านทานลมฝน แม้ยามแรกอาจมัวหม่น ครั้นถึงปลายทางจักพบแสงทองจับขอบฟ้า ความสุขแท้จริงจักปรากฏแก่ผู้ที่รู้จักปล่อยวาง\"",
        prophecy: {
          destiny: "ยามต้นอาจเหน็ดเหนื่อย ยามปลายจักสุขสบาย อดทนข้ามผ่านมรสุมแล้วจะพบความสดใส",
          wish: "จักสมหวังในบั้นปลาย ควรใช้ชีวิตอย่างสุขุม รอบคอบ และอดทน",
          travel: "จิบชาอุ่นรับไอเย็นริมน้ำอยุธยา ปล่อยวางเรื่องหนักใจ แล้วโชคดีจะตามมา"
        },
        easyMeaning: "ช่วงแรกอาจต้องเหนื่อยและอดทนหน่อย แต่ปลายทางจะพบความสุขและความสำเร็จแน่นอน ขอเพียงปล่อยวางเรื่องหนักใจ มาจิบชาพักผ่อนริมน้ำ แล้วโชคดีจะตามมาเอง",
        discountTag: "ลด 5% คาเฟ่",
        rate: 20,
        type: "cafe",
        condition: "ลดค่าอาหาร & เครื่องดื่มทุกเมนูที่คาเฟ่ริมน้ำบ้านตาผาย"
      },
      {
        id: "activity_fish",
        kanji: "吉",
        levelName: "เมตตามงคล",
        badgeColor: "sky",
        fortune: "🛶 เมตตามงคล (吉 - Kichi)",
        title: "ฟรี! อาหารปลาคาร์ป & ชาต้อนรับ",
        poem: "\"สายน้ำมิเคยแย่งชิงสิ่งใด แต่หล่อเลี้ยงสรรพชีวิต การแบ่งปันทานและสัมผัสความบริสุทธิ์ของธรรมชาติ จะนำพาความร่มเย็นมาสู่เคหสถาน\"",
        prophecy: {
          destiny: "ดวงเมตตามหานิยมสูงเด่น ผู้ใหญ่เอ็นดู มิตรสหายเกื้อหนุนให้ก้าวหน้า",
          wish: "สำเร็จได้ด้วยกุศลจิตและการให้ ยิ่งแบ่งปันยิ่งได้รับสิ่งดีงาม",
          travel: "การให้อาหารสัตว์น้ำริมแม่น้ำอยุธยา ช่วยปัดเป่าเคราะห์ภัยและเสริมดวงชะตาให้ร่มเย็น"
        },
        easyMeaning: "ดวงผู้ใหญ่เมตตาเอ็นดู มีคนคอยช่วยเหลือเกื้อหนุน การแบ่งปันและทำบุญให้อาหารปลาธรรมชาติริมน้ำอยุธยา จะช่วยเสริมดวงให้ชีวิตร่มเย็นเป็นสุข",
        discountTag: "รับของแถมฟรี",
        rate: 10,
        type: "gift",
        condition: "แสดงสิทธิ์รับเซ็ตอาหารปลาธรรมชาติ หรือชาต้อนรับที่ล็อบบี้"
      },
      {
        id: "no_prize",
        kanji: "平",
        levelName: "จิตสงบสุข",
        badgeColor: "stone",
        fortune: "🍃 จิตสงบสุข (平 - Taira)",
        title: "คำทำนายมงคล (ไม่ได้รับรางวัล)",
        poem: "\"สายลมพัดผ่าน ผิวน้ำกระเพื่อมแล้วคืนสู่ความสงบ ไร้ลาภมิใช่ไร้สุข การมีดวงใจที่สงบนิ่งคือมหาทรัพย์ที่มั่นคงที่สุดแห่งมนุษย์\"",
        prophecy: {
          destiny: "ชะตาอยู่ในสมดุลแห่งความสงบสุข ปราศจากเคราะห์ภัย พ้นจากสิ่งรบกวนใจทั้งปวง",
          wish: "ควรรักษาความพอเหมาะพอควร มุ่งเน้นการพักฟื้นสุขภาพกายและจิตใจ",
          travel: "ธรรมชาติและสายน้ำบ้านตาผายจะช่วยบำบัดจิตใจให้เบาสบายและเปี่ยมพลังบวก"
        },
        easyMeaning: "แม้ยังไม่ได้รับรางวัลลาภลอย แต่ชีวิตช่วงนี้เปี่ยมด้วยความสงบร่มเย็น ไร้เคราะห์ภัย การได้แวะมาสูดอากาศบริสุทธิ์ริมสายน้ำคือของขวัญที่ดีที่สุดในการเติมพลังใจ",
        discountTag: "ดวงสงบสุข",
        rate: 20,
        type: "none",
        condition: "รับพรความสงบสุข & รอยยิ้มริมแม่น้ำ"
      }
    ];

    // 1.97 MASTER FOOTER DATA (แก้ได้/เพิ่มได้)
    const DEFAULT_FOOTER_DATA = {
      tagline: "บ้านตาผาย รีสอร์ท อำเภอท่าเรือ พระนครศรีอยุธยา พักผ่อนท่ามกลางสายน้ำและบรรยากาศสไตล์ญี่ปุ่น",
      copyright: "© 2026 Baan Ta Phai Resort",
      buttons: [
        {
          id: "footer_fb",
          label: "Facebook เพจหลัก",
          url: "https://www.facebook.com/Baantaphai",
          icon: "fa-brands fa-facebook",
          colorTheme: "facebook"
        },
        {
          id: "footer_msg",
          label: "Messenger",
          url: "https://m.me/Baantaphai",
          icon: "fa-brands fa-facebook-messenger",
          colorTheme: "messenger"
        },
        {
          id: "footer_line",
          label: "@baantaphairesort",
          url: "https://line.me/R/ti/p/@baantaphairesort",
          icon: "fa-brands fa-line",
          colorTheme: "line"
        },
        {
          id: "footer_phone",
          label: "062-460-5863",
          url: "tel:0624605863",
          icon: "fa-solid fa-phone",
          colorTheme: "phone"
        }
      ]
    };

    let SITE_ACTIVITIES_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_act_header_v3');
        if (saved) return { ...DEFAULT_ACTIVITIES_HEADER, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES_HEADER));
    })();

    let SITE_ACTIVITIES = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_act_items_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES_ITEMS));
    })();

    let SITE_ROOMS_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_rooms_header_v3');
        if (saved) return { ...DEFAULT_ROOMS_HEADER, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_ROOMS_HEADER));
    })();

    let SITE_PERKS = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_perks_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_PERKS_DATA));
    })();

    let SITE_PERKS_FONT_SIZE = localStorage.getItem('baantaphai_perks_font_size_v3') || 'normal';

    const FONT_MAP = {
      'ibm': { name: 'IBM Plex Sans Thai', css: '"IBM Plex Sans Thai", -apple-system, BlinkMacSystemFont, "Sukhumvit Set", sans-serif' },
      'sarabun': { name: 'Sarabun', css: '"Sarabun", -apple-system, BlinkMacSystemFont, "Sukhumvit Set", sans-serif' },
      'prompt': { name: 'Prompt', css: '"Prompt", -apple-system, BlinkMacSystemFont, "Sukhumvit Set", sans-serif' },
      'mitr': { name: 'Mitr', css: '"Mitr", -apple-system, BlinkMacSystemFont, "Sukhumvit Set", sans-serif' },
      'kanit': { name: 'Kanit', css: '"Kanit", -apple-system, BlinkMacSystemFont, "Sukhumvit Set", sans-serif' },
      'noto-serif': { name: 'Noto Serif Thai', css: '"Noto Serif Thai", serif' }
    };

    const DEFAULT_TYPOGRAPHY = {
      heading: 'prompt',
      cardTitle: 'prompt',
      body: 'prompt'
    };

    let SITE_TYPOGRAPHY = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_typography_v3');
        if (saved) return { ...DEFAULT_TYPOGRAPHY, ...JSON.parse(saved) };
      } catch(e) {}
      return { ...DEFAULT_TYPOGRAPHY };
    })();

    function applySiteTypography(customTypo) {
      const typo = customTypo || SITE_TYPOGRAPHY || DEFAULT_TYPOGRAPHY;
      const headingConf = FONT_MAP[typo.heading] || FONT_MAP['prompt'];
      const cardTitleConf = FONT_MAP[typo.cardTitle] || FONT_MAP['prompt'];
      const bodyConf = FONT_MAP[typo.body] || FONT_MAP['prompt'];

      let styleEl = document.getElementById('site-dynamic-font');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'site-dynamic-font';
        document.head.appendChild(styleEl);
      }

      styleEl.textContent = `
        /* 1. Global Body, Articles, Paragraphs & Descriptions */
        body, p, li, label, .article-text, .card-desc, .policy-text, textarea, input, select {
          font-family: ${bodyConf.css} !important;
        }

        /* 2. Main Headings */
        h1, h2, #heroHeading, #heroTitle1, #heroTitleHl, #heroTitle2, .main-heading {
          font-family: ${headingConf.css} !important;
        }

        /* 3. Card Titles & Sub-headings */
        h3, h4, .card-title, .room-title, .dining-title, .activity-title, .spot-title {
          font-family: ${cardTitleConf.css} !important;
        }

        /* English Serif Accents */
        .font-serif, .font-luxury {
          font-family: ${headingConf.css} !important;
        }

        /* Per-Card and Per-Article Font Overrides */
        .font-override-sarabun, .font-override-sarabun * { font-family: ${FONT_MAP['sarabun'].css} !important; }
        .font-override-ibm, .font-override-ibm * { font-family: ${FONT_MAP['ibm'].css} !important; }
        .font-override-prompt, .font-override-prompt * { font-family: ${FONT_MAP['prompt'].css} !important; }
        .font-override-mitr, .font-override-mitr * { font-family: ${FONT_MAP['mitr'].css} !important; }
        .font-override-kanit, .font-override-kanit * { font-family: ${FONT_MAP['kanit'].css} !important; }
        .font-override-noto-serif, .font-override-noto-serif * { font-family: ${FONT_MAP['noto-serif'].css} !important; }
      `;
    }

    let SITE_LOGO = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_logo_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.pageTitle || parsed.pageTitle.includes('Minimal Boutique') || parsed.pageTitle.includes('Haven')) {
            parsed.pageTitle = DEFAULT_LOGO_DATA.pageTitle;
          }
          if (!parsed.titleTh || parsed.titleTh === 'บ้านตาผาย') {
            parsed.titleTh = DEFAULT_LOGO_DATA.titleTh;
          }
          return { ...DEFAULT_LOGO_DATA, ...parsed };
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_LOGO_DATA));
    })();

    let SITE_PHOTO_SPOTS_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_ps_header_v3');
        if (saved) return { ...DEFAULT_PHOTO_SPOTS_HEADER, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_PHOTO_SPOTS_HEADER));
    })();

    let SITE_PHOTO_SPOTS = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_ps_items_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_PHOTO_SPOTS_DATA));
    })();

    let SITE_REVIEWS_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_reviews_header_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_REVIEWS_HEADER,
            ...parsed,
            commitments: (Array.isArray(parsed.commitments) && parsed.commitments.length >= 4)
              ? parsed.commitments
              : JSON.parse(JSON.stringify(DEFAULT_REVIEWS_HEADER.commitments))
          };
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_REVIEWS_HEADER));
    })();

    let SITE_FACEBOOK_FEED = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_fb_feed_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_FACEBOOK_FEED_DATA,
            ...parsed,
            benefitItems: (Array.isArray(parsed.benefitItems) && parsed.benefitItems.length >= 3)
              ? parsed.benefitItems
              : JSON.parse(JSON.stringify(DEFAULT_FACEBOOK_FEED_DATA.benefitItems))
          };
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_FACEBOOK_FEED_DATA));
    })();

    // =========================================================================
    // EXTRA SECTIONS: เรื่องราว (Story) / ค้นหาเรา+แผนที่ (Find us) / รีวิว (Review items) / ปุ่มติดต่อลอย (FAB)
    // Stored as one blob (SITE_EXTRA) -> localStorage + Cloud Sync + draft/publish + snapshot restore
    // =========================================================================
    const EXTRA_STORAGE_KEY = 'baantaphai_extra_v1';

    const REVIEW_TONES = {
      emerald: ['#D1FAE5', '#065F46'], blue: ['#DBEAFE', '#1E40AF'], amber: ['#FEF3C7', '#92400E'],
      rose: ['#FFE4E6', '#9F1239'], violet: ['#EDE9FE', '#5B21B6'], sky: ['#E0F2FE', '#075985'],
      teal: ['#CCFBF1', '#115E59'], orange: ['#FFEDD5', '#9A3412'], pink: ['#FCE7F3', '#9D174D'],
      indigo: ['#E0E7FF', '#3730A3'], stone: ['#E7E5E4', '#44403C']
    };
    const REVIEW_TYPES = [
      ['family', '👨‍👩‍👧‍👦 ครอบครัว'], ['couple', '👫 คู่รัก'], ['group', '🏡 เหมาหลัง/เพื่อน'],
      ['cafe', '☕ คาเฟ่/ธรรมชาติ'], ['pet', '🐶 สัตว์เลี้ยง']
    ];

    function xEsc(v) {
      return String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }

    // Default review items are read once from the static review cards that ship in the HTML
    const DEFAULT_REVIEW_ITEMS = (() => {
      const out = [];
      // The "read more reviews" call-to-action card lives in the grid markup but is NOT a guest review:
      // move it out of the grid so it stays on the page (and keeps its admin-editable fields) instead of becoming a fake review.
      const cta = document.querySelector('#reviewGrid .review-card #reviewsDualTitle');
      const ctaCard = cta && cta.closest('.review-card');
      const grid0 = document.getElementById('reviewGrid');
      if (ctaCard && grid0) {
        ctaCard.classList.remove('review-card', 'lg:col-span-2');
        ctaCard.classList.add('rv-cta');
        grid0.insertAdjacentElement('afterend', ctaCard);
      }
      document.querySelectorAll('#reviewGrid .review-card').forEach(c => {
        const h4 = c.querySelector('h4');
        const av = c.querySelector('.rounded-full');
        const toneMatch = av ? /bg-([a-z]+)-100/.exec(av.className) : null;
        const link = c.querySelector('a[href]');
        const p = c.querySelector('p');
        out.push({
          id: 'rv_' + out.length,
          name: h4 ? h4.textContent.trim() : '',
          initials: av ? av.textContent.trim() : '',
          tone: toneMatch && REVIEW_TONES[toneMatch[1]] ? toneMatch[1] : 'blue',
          source: h4 && h4.nextElementSibling ? h4.nextElementSibling.textContent.trim() : 'Google Maps Review',
          stars: Math.max(1, Math.min(5, c.querySelectorAll('.text-amber-400 .fa-star').length || 5)),
          text: p ? p.textContent.trim() : '',
          tags: Array.from(c.querySelectorAll('.flex-wrap span')).map(t => t.textContent.trim()).filter(Boolean),
          link: link ? link.href : '',
          types: (c.getAttribute('data-type') || '').split(' ').filter(Boolean)
        });
      });
      return out;
    })();

    const DEFAULT_EXTRA = {
      story: {
        show: true,
        kicker: 'Baan Ta Phai Story',
        title: 'เรื่องราวของบ้านตาผาย',
        paragraphs: [
          'บ้านตาผายรีสอร์ทเป็นที่พักแนวชนบทริมน้ำ ในอำเภอท่าเรือ จังหวัดพระนครศรีอยุธยา ออกแบบมาเพื่อการพักผ่อนแบบเรียบง่ายและเป็นกันเอง ท่ามกลางธรรมชาติและสายน้ำ',
          'ที่พักมีให้เลือกทั้งบ้านพักและห้องพักหลากหลายรูปแบบ ตั้งแต่ห้องพักติดริมน้ำไปจนถึงบ้านเหมาหลัง 2 ชั้น พร้อมโซนญี่ปุ่นและซุ้มโทริอิให้ถ่ายรูปสวย ๆ',
          'ผู้เข้าพักเล่นคายัคและปั่นจักรยานได้ฟรี ไม่มีค่าใช้จ่ายเพิ่มเติม อยู่ใกล้สถานที่ท่องเที่ยวหลายแห่ง และยังเป็น Pet Friendly พาสัตว์เลี้ยงมาพักผ่อนด้วยกันได้'
        ],
        tagline: 'พักผ่อนแบบเรียบง่าย ท่ามกลางธรรมชาติริมน้ำ',
        image: ''
      },
      findUs: {
        show: true,
        kicker: 'Find us on Google',
        titlePre: 'ค้นหา',
        titleUl: 'เราได้จาก',
        titlePost: 'กูเกิ้ล',
        mapQuery: '14.5254055,100.7213839',
        height: 380
      },
      fab: { show: true, label: 'ติดต่อเรา' },
      reviewItems: null,
      reviewsAutoplay: true
    };

    function mergeExtra(o) {
      o = o || {};
      return {
        story: { ...DEFAULT_EXTRA.story, ...(o.story || {}), paragraphs: (o.story && Array.isArray(o.story.paragraphs) && o.story.paragraphs.length) ? o.story.paragraphs : DEFAULT_EXTRA.story.paragraphs.slice() },
        findUs: { ...DEFAULT_EXTRA.findUs, ...(o.findUs || {}) },
        fab: { ...DEFAULT_EXTRA.fab, ...(o.fab || {}) },
        reviewItems: (Array.isArray(o.reviewItems) && o.reviewItems.length) ? o.reviewItems : null,
        reviewsAutoplay: o.reviewsAutoplay !== false
      };
    }

    let SITE_EXTRA = (() => {
      try {
        const saved = localStorage.getItem(EXTRA_STORAGE_KEY);
        if (saved) return mergeExtra(JSON.parse(saved));
      } catch (e) {}
      return mergeExtra({});
    })();

    function persistExtra() {
      try { localStorage.setItem(EXTRA_STORAGE_KEY, JSON.stringify(SITE_EXTRA)); } catch (e) { console.warn(e); }
    }

    function getReviewItems() {
      return SITE_EXTRA.reviewItems || DEFAULT_REVIEW_ITEMS;
    }

    // ---------- render: story ----------
    function renderExtraStory() {
      const s = SITE_EXTRA.story;
      const sec = document.getElementById('story');
      if (!sec) return;
      sec.classList.toggle('hidden', !s.show && !isAdminMode);
      sec.classList.toggle('opacity-60', !s.show && isAdminMode);
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('storyKicker', s.kicker);
      set('storyTitle', s.title);
      set('storyTagline', s.tagline);
      const body = document.getElementById('storyBody');
      if (body) {
        body.innerHTML = '';
        (s.paragraphs || []).forEach(t => { if (String(t).trim()) { const p = document.createElement('p'); p.textContent = t; body.appendChild(p); } });
      }
      const wrap = document.getElementById('storyImageWrap');
      const img = document.getElementById('storyImage');
      if (wrap && img) {
        const url = s.image ? formatDirectImageUrl(s.image) : '';
        if (url) { if (img.getAttribute('src') !== url) img.src = url; wrap.classList.remove('hidden'); }
        else { wrap.classList.add('hidden'); img.removeAttribute('src'); }
      }
    }

    // ---------- render: find us + map ----------
    function buildMapSrc(q) {
      q = (q || '').trim();
      if (/^https?:\/\//i.test(q)) {
        const m = /src="([^"]+)"/.exec(q);
        return m ? m[1] : q;
      }
      const iframeSrc = /src="([^"]+)"/.exec(q);
      if (iframeSrc) return iframeSrc[1];
      return 'https://maps.google.com/maps?q=' + encodeURIComponent(q || '14.5254055,100.7213839') + '&z=15&hl=th&output=embed';
    }
    function renderExtraFindUs() {
      const f = SITE_EXTRA.findUs;
      const block = document.getElementById('findUsBlock');
      if (!block) return;
      block.classList.toggle('hidden', !f.show && !isAdminMode);
      block.classList.toggle('opacity-60', !f.show && isAdminMode);
      const k = document.getElementById('findUsKicker'); if (k) k.textContent = f.kicker;
      const t = document.getElementById('findUsTitle');
      if (t) {
        t.innerHTML = '';
        t.appendChild(document.createTextNode(f.titlePre || ''));
        const u = document.createElement('span'); u.className = 'bt-ul'; u.textContent = f.titleUl || ''; t.appendChild(u);
        t.appendChild(document.createTextNode(f.titlePost || ''));
      }
      const frame = document.getElementById('findUsFrame');
      if (frame) {
        const src = buildMapSrc(f.mapQuery);
        if (frame.getAttribute('src') !== src) frame.setAttribute('src', src);
        const wrap = frame.parentElement;
        if (wrap) wrap.style.height = Math.max(240, Math.min(720, parseInt(f.height, 10) || 380)) + 'px';
      }
    }

    // ---------- render: floating contact button ----------
    function renderExtraFab() {
      const fab = document.getElementById('contactFab');
      if (!fab) return;
      fab.classList.toggle('fab-off', !SITE_EXTRA.fab.show && !isAdminMode);
      const btn = document.getElementById('contactFabBtn');
      if (btn) { btn.setAttribute('aria-label', SITE_EXTRA.fab.label || 'ติดต่อเรา'); btn.setAttribute('title', SITE_EXTRA.fab.label || 'ติดต่อเรา'); }
    }

    // ---------- render: reviews (grid cards + testimonial slider) ----------
    function reviewAvatarStyle(tone) {
      const t = REVIEW_TONES[tone] || REVIEW_TONES.blue;
      return `background-color:${t[0]};color:${t[1]}`;
    }
    function reviewStarsHtml(n) {
      return '<i class="fa-solid fa-star"></i>'.repeat(Math.max(1, Math.min(5, n || 5)));
    }
    function renderExtraReviewGrid() {
      const grid = document.getElementById('reviewGrid');
      if (!grid) return;
      grid.innerHTML = getReviewItems().map(r => {
        const link = /^https?:/i.test(r.link || '') ? xEsc(r.link) : '';
        return `
        <div class="review-card bg-white p-5 sm:p-6 rounded-3xl border border-zen-cardborder shadow-minimal flex flex-col justify-between space-y-4" data-type="${xEsc((r.types || []).join(' '))}">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm" style="${reviewAvatarStyle(r.tone)}">${xEsc(r.initials || (r.name || '').slice(0, 2).toUpperCase())}</div>
                <div>
                  <h4 class="font-bold text-xs sm:text-sm text-zen-dark">${xEsc(r.name)}</h4>
                  <span class="text-[10px] text-zen-muted font-light">${xEsc(r.source)}</span>
                </div>
              </div>
              ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[10px] font-medium inline-flex items-center gap-1"><i class="fa-brands fa-google text-blue-500"></i><span>รีวิวจริง</span></a>` : ''}
            </div>
            <div class="flex items-center text-amber-400 text-xs gap-1">${reviewStarsHtml(r.stars)}</div>
            <p class="text-xs text-stone-700 font-light leading-relaxed">${xEsc(r.text)}</p>
          </div>
          <div class="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap text-[10px] text-stone-600">
            <div class="flex flex-wrap gap-1.5">${(r.tags || []).map(t => `<span class="px-2 py-0.5 rounded-lg bg-stone-100">${xEsc(t)}</span>`).join('')}</div>
            ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 shrink-0 ml-auto transition-colors"><span>ดูบน Google Maps</span><i class="fa-solid fa-arrow-up-right-from-square text-[8px]"></i></a>` : ''}
          </div>
        </div>`;
      }).join('');
      // keep the active category filter applied
      const active = document.querySelector('.review-filter-btn.active');
      const m = active && /filterReviews\('([a-z]+)'/.exec(active.getAttribute('onclick') || '');
      if (m && m[1] !== 'all') filterReviews(m[1], active);
    }

    const RV = { idx: 0, timer: null, paused: false, slides: [], bound: false };
    function rvShow(n) {
      if (!RV.slides.length) return;
      RV.idx = (n + RV.slides.length) % RV.slides.length;
      RV.slides.forEach((s, i) => s.classList.toggle('on', i === RV.idx));
      const dots = document.getElementById('rvDots');
      if (dots) Array.prototype.forEach.call(dots.children, (d, i) => d.classList.toggle('on', i === RV.idx));
    }
    function rvPlay() {
      clearInterval(RV.timer);
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || RV.paused || RV.slides.length < 2 || !SITE_EXTRA.reviewsAutoplay) return;
      RV.timer = setInterval(() => rvShow(RV.idx + 1), 9000);
    }
    function rvGo(n) { rvShow(n); rvPlay(); }
    function rvUpdateToggle() {
      const grid = document.getElementById('reviewGrid');
      const toggle = document.getElementById('rvToggle');
      if (!grid || !toggle) return;
      const open = !grid.classList.contains('hidden');
      toggle.firstChild.textContent = (open ? 'ซ่อนรีวิวทั้งหมด' : 'ดูรีวิวทั้งหมด (' + getReviewItems().length + ')') + ' ';
      const ic = toggle.querySelector('i'); if (ic) ic.className = open ? 'fa-solid fa-chevron-up text-[10px]' : 'fa-solid fa-chevron-down text-[10px]';
    }
    function renderExtraReviewSlider() {
      const stage = document.getElementById('rvStage');
      const dots = document.getElementById('rvDots');
      const box = document.getElementById('reviewSlider');
      if (!stage || !dots || !box) return;
      const items = getReviewItems();
      stage.innerHTML = ''; dots.innerHTML = ''; RV.slides = [];
      box.classList.toggle('hidden', !items.length);
      const mk = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
      items.forEach((r, i) => {
        const slide = mk('div', 'rv-slide');
        slide.setAttribute('role', 'group'); slide.setAttribute('aria-label', (i + 1) + ' / ' + items.length);
        const card = mk('div', 'rv-card');
        card.appendChild(mk('div', 'rv-qmark', '\u201C'));
        const isGoogle = /google/i.test(r.source || '');
        if (isGoogle) { const b = mk('span', 'rv-badge'); b.innerHTML = '<i class="fa-brands fa-google"></i> รีวิวจาก Google Maps'; card.appendChild(b); }
        card.appendChild(mk('div', 'rv-stars', '★'.repeat(Math.max(1, Math.min(5, r.stars || 5)))));
        card.appendChild(mk('p', 'rv-quote', r.text));
        if ((r.tags || []).length) { const tg = mk('div', 'rv-tags'); r.tags.forEach(t => tg.appendChild(mk('span', null, t))); card.appendChild(tg); }
        const person = mk('div', 'rv-person');
        const a = mk('div', 'rv-avatar', r.initials || (r.name || '').slice(0, 2).toUpperCase());
        const tone = REVIEW_TONES[r.tone] || REVIEW_TONES.blue; a.style.backgroundColor = tone[0]; a.style.color = tone[1];
        const who = mk('div', 'rv-who');
        who.appendChild(mk('h3', 'rv-name', r.name));
        if (r.source) who.appendChild(mk('div', 'rv-src', r.source));
        person.appendChild(a); person.appendChild(who);
        card.appendChild(person);
        if (/^https?:/i.test(r.link || '')) { const l = mk('a', 'rv-link', 'ดูรีวิวต้นฉบับบน Google Maps'); l.href = r.link; l.target = '_blank'; l.rel = 'noopener noreferrer'; card.appendChild(l); }
        slide.appendChild(card);
        stage.appendChild(slide); RV.slides.push(slide);
        const d = mk('button'); d.type = 'button'; d.setAttribute('aria-label', 'รีวิวที่ ' + (i + 1));
        d.addEventListener('click', () => rvGo(i)); dots.appendChild(d);
      });
      const multi = items.length > 1;
      ['rvPrev', 'rvNext'].forEach(id => { const b = document.getElementById(id); if (b) b.style.visibility = multi ? 'visible' : 'hidden'; });
      dots.style.visibility = multi ? 'visible' : 'hidden';

      if (!RV.bound) {
        RV.bound = true;
        document.getElementById('rvPrev').addEventListener('click', () => rvGo(RV.idx - 1));
        document.getElementById('rvNext').addEventListener('click', () => rvGo(RV.idx + 1));
        box.addEventListener('mouseenter', () => { RV.paused = true; clearInterval(RV.timer); });
        box.addEventListener('mouseleave', () => { RV.paused = false; rvPlay(); });
        let x0 = null, y0 = null;
        const touchDone = () => { x0 = y0 = null; RV.paused = false; rvPlay(); };
        box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; RV.paused = true; clearInterval(RV.timer); }, { passive: true });
        box.addEventListener('touchend', e => {
          if (x0 === null) return;
          const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
          touchDone();
          // a clearly horizontal swipe only: a vertical page scroll with a little sideways drift must not flip the slide
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) rvGo(RV.idx + (dx < 0 ? 1 : -1));
        }, { passive: true });
        box.addEventListener('touchcancel', touchDone, { passive: true });
        const toggle = document.getElementById('rvToggle');
        const pills = document.getElementById('reviewPills');
        toggle.addEventListener('click', () => {
          const grid = document.getElementById('reviewGrid');
          const open = grid.classList.toggle('hidden') === false;
          if (pills) pills.classList.toggle('hidden', !open);
          rvUpdateToggle();
        });
      }
      rvShow(Math.min(RV.idx, Math.max(0, RV.slides.length - 1)));
      rvPlay();
      rvUpdateToggle();
    }
    function renderExtraReviews() {
      renderExtraReviewGrid();
      renderExtraReviewSlider();
    }

    function renderExtraSections() {
      renderExtraStory();
      renderExtraFindUs();
      renderExtraFab();
      renderExtraReviews();
      document.querySelectorAll('.extra-admin').forEach(el => el.classList.toggle('hidden', !isAdminMode));
    }

    // ---------- admin editor (one generic modal) ----------
    const EXTRA_SECTION_META = {
      story: { key: 'story', label: 'แก้ไขส่วนเรื่องราว (Story)' },
      findUs: { key: 'findUs', label: 'แก้ไขหัวข้อค้นหาเรา & แผนที่' },
      fab: { key: 'contactFab', label: 'แก้ไขปุ่มติดต่อลอย' },
      reviews: { key: 'reviewItems', label: 'แก้ไขรีวิวลูกค้า' }
    };
    let extraEditorKind = null;
    let extraWorkReviews = null;
    let extraReviewEditing = null; // index (-1 = new) while the single-review form is open

    const xInput = 'w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-blue-600 text-xs';
    const xLabel = 'block font-semibold text-stone-700 mb-1';
    function xField(label, inner, hint) {
      return `<div><label class="${xLabel}">${label}</label>${inner}${hint ? `<p class="text-[10px] text-stone-400 mt-1">${hint}</p>` : ''}</div>`;
    }
    function xCheck(id, label, checked) {
      return `<label class="flex items-center gap-2 text-xs font-medium text-stone-700"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''} class="w-4 h-4 accent-blue-600"> ${label}</label>`;
    }

    function ensureExtraModal() {
      let m = document.getElementById('extraEditModal');
      if (m) return m;
      m = document.createElement('div');
      m.id = 'extraEditModal';
      m.className = 'fixed inset-0 z-[70] hidden bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center overflow-hidden';
      m.innerHTML = `
        <div class="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl mobile-sheet-enter desktop-modal-enter max-h-[92vh] flex flex-col border border-blue-300" onclick="event.stopPropagation()">
          <div class="bg-blue-50 p-4 border-b border-blue-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm"><i class="fa-solid fa-pen-to-square text-blue-700"></i><span id="extraEditTitle"></span></div>
            <button type="button" onclick="closeExtraEditor()" class="text-stone-500 hover:text-black text-lg p-1" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div id="extraEditBody" class="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 text-xs"></div>
          <div id="extraEditFooter" class="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2 shrink-0 flex-wrap"></div>
        </div>`;
      m.addEventListener('click', closeExtraEditor);
      document.body.appendChild(m);
      return m;
    }

    function closeExtraEditor() {
      const m = document.getElementById('extraEditModal');
      if (m) m.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      extraEditorKind = null; extraWorkReviews = null; extraReviewEditing = null;
    }

    function setExtraFooter(mode) {
      const f = document.getElementById('extraEditFooter');
      if (!f) return;
      if (mode === 'review-form') {
        f.innerHTML = `
          <button type="button" onclick="extraReviewFormBack()" class="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 min-h-[44px]">ยกเลิก</button>
          <button type="button" onclick="extraReviewFormApply()" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm min-h-[44px]"><i class="fa-solid fa-check mr-1"></i> ตกลง</button>`;
      } else {
        f.innerHTML = `
          <button type="button" onclick="closeExtraEditor()" class="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 min-h-[44px]">ยกเลิก</button>
          <button type="button" onclick="saveExtraEditor(false)" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm min-h-[44px]"><i class="fa-solid fa-floppy-disk mr-1"></i> บันทึกแบบร่าง</button>
          <button type="button" onclick="saveExtraEditor(true)" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm min-h-[44px]"><i class="fa-solid fa-rocket mr-1"></i> เผยแพร่ทันที</button>`;
      }
    }

    function openExtraEditor(kind) {
      if (!EXTRA_SECTION_META[kind]) return;
      extraEditorKind = kind;
      const m = ensureExtraModal();
      document.getElementById('extraEditTitle').textContent = EXTRA_SECTION_META[kind].label;
      const body = document.getElementById('extraEditBody');
      const s = SITE_EXTRA;

      if (kind === 'story') {
        body.innerHTML =
          xCheck('xe_show', 'แสดงส่วนนี้บนหน้าเว็บ', s.story.show) +
          xField('ป้ายกำกับเล็ก (Kicker)', `<input id="xe_kicker" class="${xInput}" value="${xEsc(s.story.kicker)}">`) +
          xField('หัวข้อหลัก', `<input id="xe_title" class="${xInput} font-bold" value="${xEsc(s.story.title)}">`) +
          xField('เนื้อหา', `<textarea id="xe_paras" rows="9" class="${xInput} leading-relaxed">${xEsc((s.story.paragraphs || []).join('\n\n'))}</textarea>`, 'เว้น 1 บรรทัดว่างเพื่อแยกเป็นย่อหน้าใหม่') +
          xField('ประโยคปิดท้าย (ตัวเอียง)', `<input id="xe_tagline" class="${xInput}" value="${xEsc(s.story.tagline)}">`) +
          xField('รูปภาพใต้เนื้อหา (ทางเลือก)', `<input id="xe_image" class="${xInput}" placeholder="https://... หรือลิงก์ Google Drive" value="${xEsc(s.story.image)}">`, 'เว้นว่างถ้าไม่ต้องการแสดงรูป');
      } else if (kind === 'findUs') {
        body.innerHTML =
          xCheck('xe_show', 'แสดงส่วนนี้บนหน้าเว็บ', s.findUs.show) +
          xField('ป้ายกำกับเล็ก (Kicker)', `<input id="xe_kicker" class="${xInput}" value="${xEsc(s.findUs.kicker)}">`) +
          `<div class="grid grid-cols-3 gap-2">` +
            xField('หัวข้อ: ส่วนหน้า', `<input id="xe_pre" class="${xInput}" value="${xEsc(s.findUs.titlePre)}">`) +
            xField('ส่วนที่ขีดเส้นใต้', `<input id="xe_ul" class="${xInput}" value="${xEsc(s.findUs.titleUl)}">`) +
            xField('ส่วนหลัง', `<input id="xe_post" class="${xInput}" value="${xEsc(s.findUs.titlePost)}">`) +
          `</div>` +
          xField('ตำแหน่งแผนที่', `<input id="xe_map" class="${xInput}" value="${xEsc(s.findUs.mapQuery)}">`, 'ใส่พิกัด (เช่น 14.5254055,100.7213839) หรือชื่อสถานที่ หรือวางโค้ด/ลิงก์ฝังแผนที่จาก Google Maps (Share → Embed a map)') +
          xField('ความสูงแผนที่ (px)', `<input id="xe_height" type="number" min="240" max="720" class="${xInput}" value="${xEsc(s.findUs.height)}">`);
      } else if (kind === 'fab') {
        body.innerHTML =
          xCheck('xe_show', 'แสดงปุ่มติดต่อลอยบนจอคอมพิวเตอร์/แท็บเล็ต', s.fab.show) +
          xField('ชื่อปุ่ม (แสดงเมื่อเอาเมาส์ชี้)', `<input id="xe_label" class="${xInput}" value="${xEsc(s.fab.label)}">`, 'ลิงก์ LINE / Messenger / เบอร์โทร ดึงจากปุ่มบนแถบเมนู (แก้ที่ "ปุ่มติดต่อด่วน")');
      } else if (kind === 'reviews') {
        extraWorkReviews = JSON.parse(JSON.stringify(getReviewItems()));
        extraReviewEditing = null;
        renderExtraReviewList();
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        return;
      }
      setExtraFooter('save');
      m.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function renderExtraReviewList() {
      const body = document.getElementById('extraEditBody');
      const list = extraWorkReviews || [];
      body.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <span class="text-stone-500">${list.length} รีวิว — สไลด์และการ์ดทั้งหมดอัปเดตตามรายการนี้</span>
          <button type="button" onclick="extraReviewOpenForm(-1)" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"><i class="fa-solid fa-plus mr-1"></i> เพิ่มรีวิว</button>
        </div>
        ${xCheck('xe_autoplay', 'เลื่อนสไลด์รีวิวอัตโนมัติ', SITE_EXTRA.reviewsAutoplay)}
        <div class="space-y-2">
          ${list.map((r, i) => `
            <div class="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-2">
              <span class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style="${reviewAvatarStyle(r.tone)}">${xEsc(r.initials || '')}</span>
              <div class="min-w-0 flex-1">
                <div class="font-semibold text-stone-800 truncate">${xEsc(r.name)} <span class="text-amber-500">${'★'.repeat(r.stars || 5)}</span></div>
                <div class="text-[10px] text-stone-500 truncate">${xEsc(r.text)}</div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="extraReviewMove(${i},-1)" class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100" aria-label="เลื่อนขึ้น"><i class="fa-solid fa-arrow-up text-[10px]"></i></button>
                <button type="button" onclick="extraReviewMove(${i},1)" class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100" aria-label="เลื่อนลง"><i class="fa-solid fa-arrow-down text-[10px]"></i></button>
                <button type="button" onclick="extraReviewOpenForm(${i})" class="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900" aria-label="แก้ไข"><i class="fa-solid fa-pen text-[10px]"></i></button>
                <button type="button" onclick="extraReviewDelete(${i})" class="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100" aria-label="ลบ"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
              </div>
            </div>`).join('') || '<p class="text-center text-stone-400 py-6">ยังไม่มีรีวิว กด "เพิ่มรีวิว" เพื่อเริ่มต้น</p>'}
        </div>`;
      setExtraFooter('save');
    }

    function extraReviewMove(i, d) {
      const j = i + d;
      if (!extraWorkReviews || j < 0 || j >= extraWorkReviews.length) return;
      const keep = document.getElementById('xe_autoplay'); if (keep) SITE_EXTRA.reviewsAutoplay = keep.checked;
      [extraWorkReviews[i], extraWorkReviews[j]] = [extraWorkReviews[j], extraWorkReviews[i]];
      renderExtraReviewList();
    }
    function extraReviewDelete(i) {
      if (!extraWorkReviews || !confirm('ลบรีวิวนี้ออกจากรายการ?')) return;
      const keep = document.getElementById('xe_autoplay'); if (keep) SITE_EXTRA.reviewsAutoplay = keep.checked;
      extraWorkReviews.splice(i, 1);
      renderExtraReviewList();
    }
    function extraReviewOpenForm(i) {
      const keep = document.getElementById('xe_autoplay'); if (keep) SITE_EXTRA.reviewsAutoplay = keep.checked;
      extraReviewEditing = i;
      const r = i >= 0 ? extraWorkReviews[i] : { name: '', initials: '', tone: 'blue', source: 'Google Maps Review', stars: 5, text: '', tags: [], link: '', types: [] };
      const body = document.getElementById('extraEditBody');
      body.innerHTML =
        `<div class="grid grid-cols-2 gap-2">` +
          xField('ชื่อผู้รีวิว', `<input id="xr_name" class="${xInput} font-bold" value="${xEsc(r.name)}">`) +
          xField('อักษรย่อในวงกลม', `<input id="xr_ini" maxlength="3" class="${xInput}" value="${xEsc(r.initials)}" placeholder="อัตโนมัติจากชื่อ">`) +
        `</div>` +
        `<div class="grid grid-cols-2 gap-2">` +
          xField('สีวงกลม', `<select id="xr_tone" class="${xInput}">${Object.keys(REVIEW_TONES).map(t => `<option value="${t}" ${t === r.tone ? 'selected' : ''}>${t}</option>`).join('')}</select>`) +
          xField('ดาว', `<select id="xr_stars" class="${xInput}">${[5, 4, 3, 2, 1].map(n => `<option value="${n}" ${n === (r.stars || 5) ? 'selected' : ''}>${'★'.repeat(n)}</option>`).join('')}</select>`) +
        `</div>` +
        xField('แหล่งที่มา / เวลา', `<input id="xr_src" class="${xInput}" value="${xEsc(r.source)}" placeholder="Google Maps Review • 2 เดือนที่แล้ว">`) +
        xField('ข้อความรีวิว', `<textarea id="xr_text" rows="5" class="${xInput} leading-relaxed">${xEsc(r.text)}</textarea>`) +
        xField('แท็กสั้น ๆ (คั่นด้วยเครื่องหมายจุลภาค)', `<input id="xr_tags" class="${xInput}" value="${xEsc((r.tags || []).join(', '))}" placeholder="🛎️ บริการดี, 🌿 บรรยากาศร่มรื่น">`) +
        xField('ลิงก์รีวิวต้นฉบับ (ทางเลือก)', `<input id="xr_link" class="${xInput}" value="${xEsc(r.link)}" placeholder="https://maps.app.goo.gl/...">`) +
        `<div><label class="${xLabel}">หมวดสำหรับตัวกรอง</label><div class="flex flex-wrap gap-x-4 gap-y-2">${REVIEW_TYPES.map(([k, l]) => xCheck('xr_t_' + k, l, (r.types || []).includes(k))).join('')}</div></div>`;
      setExtraFooter('review-form');
    }
    function extraReviewFormBack() { extraReviewEditing = null; renderExtraReviewList(); }
    function extraReviewFormApply() {
      const name = (document.getElementById('xr_name').value || '').trim();
      const text = (document.getElementById('xr_text').value || '').trim();
      if (!name || !text) { alert('กรุณากรอกชื่อผู้รีวิวและข้อความรีวิว'); return; }
      const item = {
        id: (extraReviewEditing >= 0 && extraWorkReviews[extraReviewEditing].id) || ('rv_' + Date.now()),
        name,
        initials: (document.getElementById('xr_ini').value || '').trim().slice(0, 3) || name.slice(0, 2).toUpperCase(),
        tone: document.getElementById('xr_tone').value,
        source: (document.getElementById('xr_src').value || '').trim(),
        stars: parseInt(document.getElementById('xr_stars').value, 10) || 5,
        text,
        tags: (document.getElementById('xr_tags').value || '').split(',').map(t => t.trim()).filter(Boolean),
        link: (document.getElementById('xr_link').value || '').trim(),
        types: REVIEW_TYPES.map(t => t[0]).filter(k => document.getElementById('xr_t_' + k).checked)
      };
      if (extraReviewEditing >= 0) extraWorkReviews[extraReviewEditing] = item; else extraWorkReviews.push(item);
      extraReviewEditing = null;
      renderExtraReviewList();
    }

    function saveExtraEditor(isDirectPublish) {
      const kind = extraEditorKind;
      if (!kind) return;
      const v = id => (document.getElementById(id)?.value || '').trim();
      const chk = id => !!document.getElementById(id)?.checked;

      if (kind === 'story') {
        SITE_EXTRA.story = {
          show: chk('xe_show'),
          kicker: v('xe_kicker') || DEFAULT_EXTRA.story.kicker,
          title: v('xe_title') || DEFAULT_EXTRA.story.title,
          paragraphs: v('xe_paras').split(/\n\s*\n/).map(t => t.trim()).filter(Boolean),
          tagline: v('xe_tagline'),
          image: formatDirectImageUrl(v('xe_image'))
        };
      } else if (kind === 'findUs') {
        SITE_EXTRA.findUs = {
          show: chk('xe_show'),
          kicker: v('xe_kicker'),
          titlePre: document.getElementById('xe_pre').value,
          titleUl: document.getElementById('xe_ul').value,
          titlePost: document.getElementById('xe_post').value,
          mapQuery: v('xe_map') || DEFAULT_EXTRA.findUs.mapQuery,
          height: Math.max(240, Math.min(720, parseInt(v('xe_height'), 10) || 380))
        };
      } else if (kind === 'fab') {
        SITE_EXTRA.fab = { show: chk('xe_show'), label: v('xe_label') || DEFAULT_EXTRA.fab.label };
      } else if (kind === 'reviews') {
        const keep = document.getElementById('xe_autoplay');
        if (keep) SITE_EXTRA.reviewsAutoplay = keep.checked;
        else if (extraReviewEditing !== null) { alert('กด "ตกลง" หรือ "ยกเลิก" ที่ฟอร์มรีวิวก่อนบันทึก'); return; }
        SITE_EXTRA.reviewItems = extraWorkReviews && extraWorkReviews.length ? extraWorkReviews : null;
      }

      persistExtra();
      const meta = EXTRA_SECTION_META[kind];
      closeExtraEditor();
      renderExtraSections();
      handleSectionSave(meta.key, meta.label, isDirectPublish);
    }

    // ---------- cloud / snapshot helpers ----------
    function applyExtraFromCloud(d) {
      if (!d || typeof d !== 'object') return false;
      const merged = mergeExtra(d);
      if (JSON.stringify(merged) === JSON.stringify(SITE_EXTRA)) return false;
      SITE_EXTRA = merged;
      persistExtra();
      renderExtraSections();
      return true;
    }
    function restoreExtraFromSnapshot(snapExtra, part) {
      if (!snapExtra) return;
      if (!part) SITE_EXTRA = mergeExtra(snapExtra);
      else if (part === 'story') SITE_EXTRA.story = mergeExtra(snapExtra).story;
      else if (part === 'findUs') SITE_EXTRA.findUs = mergeExtra(snapExtra).findUs;
      else if (part === 'fab') SITE_EXTRA.fab = mergeExtra(snapExtra).fab;
      else if (part === 'reviews') { const m = mergeExtra(snapExtra); SITE_EXTRA.reviewItems = m.reviewItems; SITE_EXTRA.reviewsAutoplay = m.reviewsAutoplay; }
      persistExtra();
    }
    function resetExtraToDefaults() {
      try { localStorage.removeItem(EXTRA_STORAGE_KEY); } catch (e) {}
      SITE_EXTRA = mergeExtra({});
    }

    let SITE_ATTRACTIONS_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_attractions_header_v3');
        if (saved) return { ...DEFAULT_ATTRACTIONS_HEADER, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_ATTRACTIONS_HEADER));
    })();

    let SITE_ATTRACTIONS_ITEMS = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_attractions_items_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_ATTRACTIONS_ITEMS));
    })();

    let SITE_POLICIES = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_policies_v3');
        if (saved) return { ...DEFAULT_POLICIES_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_POLICIES_DATA));
    })();

    let SITE_CONTACT = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_contact_v3');
        if (saved) return { ...DEFAULT_CONTACT_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_CONTACT_DATA));
    })();

    let SITE_FAQ_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_faq_header_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_FAQ_HEADER,
            ...parsed,
            ctaButtons: (Array.isArray(parsed.ctaButtons) && parsed.ctaButtons.length > 0)
              ? parsed.ctaButtons
              : JSON.parse(JSON.stringify(DEFAULT_FAQ_HEADER.ctaButtons))
          };
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_FAQ_HEADER));
    })();

    let SITE_FAQ_ITEMS = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_faq_items_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_FAQ_ITEMS));
    })();

    let SITE_TOP_BAR = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_topbar_v3');
        if (saved) return { ...DEFAULT_TOP_BAR_DATA, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_TOP_BAR_DATA));
    })();

    let SITE_OMIKUJI_HEADER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_omikuji_header_v3');
        if (saved) return { ...DEFAULT_OMIKUJI_HEADER, ...JSON.parse(saved) };
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_OMIKUJI_HEADER));
    })();

    let SITE_OMIKUJI_PRIZES = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_omikuji_prizes_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_OMIKUJI_PRIZES));
    })();

    let SITE_FOOTER = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_footer_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_FOOTER_DATA,
            ...parsed,
            buttons: (Array.isArray(parsed.buttons) && parsed.buttons.length > 0)
              ? parsed.buttons
              : DEFAULT_FOOTER_DATA.buttons
          };
        }
      } catch(e) {}
      return JSON.parse(JSON.stringify(DEFAULT_FOOTER_DATA));
    })();

    // ========================================================
    // ☁️ BAAN TA PHAI REALTIME CLOUD SYNC ENGINE
    // Synchronizes admin edits across all devices, phones & visitors
    // ========================================================
    const CLOUD_SYNC_ENDPOINT = (window.location.origin && window.location.origin.includes('baantaphairesort.netlify.app'))
      ? '/.netlify/functions/sync'
      : 'https://baantaphairesort.netlify.app/.netlify/functions/sync';

    let isCloudSyncing = false;
    let isPushingCloudData = false;
    let pendingPushReason = null;
    let lastLocalEditTimestamp = 0;
    let lastCloudSyncTime = null;

    function updateCloudSyncStatusIndicator(state, detail) {
      const badge = document.getElementById('cloudSyncStatusBadge');
      if (!badge) return;

      if (state === 'syncing') {
        badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600/20 text-amber-950 border border-amber-700/30 text-[11px] font-semibold';
        badge.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin text-amber-800"></i> กำลังซิงค์ขึ้นคลาวด์...';
      } else if (state === 'synced') {
        const timeStr = detail ? new Date(detail).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';
        badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/20 text-emerald-950 border border-emerald-700/30 text-[11px] font-semibold';
        badge.innerHTML = `<i class="fa-solid fa-cloud-check text-emerald-800"></i> คลาวด์ซิงค์เรียลไทม์ (ออนไลน์${timeStr ? ' ' + timeStr : ''})`;
      } else if (state === 'error' || state === 'offline') {
        badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-950 border border-rose-700/30 text-[11px] font-semibold';
        badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-rose-800"></i> ซิงค์คลาวด์ไม่สำเร็จ (ใช้ข้อมูลในเครื่อง)';
      }
    }

    async function fetchCloudData(silent = true) {
      // 1. Guard: If currently pushing data to cloud, NEVER fetch concurrently to prevent race condition
      if (isPushingCloudData) {
        return;
      }
      // 2. Guard: If a local edit was made recently (within 8 seconds), protect local authoritative state from eventual consistency lags
      const timeSinceLocalEdit = Date.now() - lastLocalEditTimestamp;
      if (timeSinceLocalEdit < 8000) {
        return;
      }
      // 3. Guard: If there are uncommitted local drafts, skip background overwrite to protect active draft edits
      if (typeof hasPendingDrafts === 'function' && hasPendingDrafts()) {
        if (silent) {
          console.log('[BaanTaPhai CloudSync] Background sync skipped because local drafts are pending.');
          return;
        } else {
          const proceed = confirm('คุณมีแบบร่างการแก้ไขที่ยังไม่ได้เผยแพร่ หากดึงข้อมูลใหม่จากคลาวด์ตอนนี้ ข้อมูลแบบร่างอาจถูกแทนที่ ต้องการดำเนินการดึงข้อมูลต่อหรือไม่?');
          if (!proceed) return;
        }
      }
      if (isCloudSyncing) return;
      isCloudSyncing = true;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const sinceParam = lastCloudSyncTime ? `&since=${encodeURIComponent(lastCloudSyncTime)}` : '';
        const syncUrlWithBuster = `${CLOUD_SYNC_ENDPOINT}${CLOUD_SYNC_ENDPOINT.includes('?') ? '&' : '?'}t=${Date.now()}${sinceParam}`;
        const res = await fetch(syncUrlWithBuster, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-cache',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (result && result.success) {
          // If server reports notModified, local state is already latest
          if (result.notModified) {
            if (result.updatedAt) {
              lastCloudSyncTime = result.updatedAt;
              updateCloudSyncStatusIndicator('synced', lastCloudSyncTime);
            }
            return;
          }

          if (result.data) {
            const d = result.data;
            const cloudTime = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
            // Guard: If the cloud data is OLDER than our last local edit timestamp, IGNORE it completely
            if (cloudTime && lastLocalEditTimestamp && cloudTime <= lastLocalEditTimestamp) {
              isCloudSyncing = false;
              return;
            }
            const isDiff = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

            if (d.typography && typeof d.typography === 'object' && JSON.stringify(d.typography) !== JSON.stringify(SITE_TYPOGRAPHY)) {
              SITE_TYPOGRAPHY = { ...DEFAULT_TYPOGRAPHY, ...d.typography };
              try { localStorage.setItem('baantaphai_typography_v3', JSON.stringify(SITE_TYPOGRAPHY)); } catch(e){}
              applySiteTypography();
            }
            if (d.logo && typeof d.logo === 'object' && isDiff(d.logo, SITE_LOGO)) {
              if (d.logo.imageUrl) d.logo.imageUrl = formatDirectImageUrl(d.logo.imageUrl);
              SITE_LOGO = { ...DEFAULT_LOGO_DATA, ...d.logo };
              try { localStorage.setItem('baantaphai_logo_v3', JSON.stringify(SITE_LOGO)); } catch(e){}
              renderLogoSection();
            }
            if (d.navMenu && typeof d.navMenu === 'object' && isDiff(d.navMenu, SITE_NAV_MENU)) {
              SITE_NAV_MENU = { ...DEFAULT_NAV_MENU_DATA, ...d.navMenu };
              try { localStorage.setItem('baantaphai_nav_menu_v3', JSON.stringify(SITE_NAV_MENU)); } catch(e){}
              renderNavMenuSection();
            }
            if (d.headerActions && typeof d.headerActions === 'object' && isDiff(d.headerActions, SITE_HEADER_ACTIONS)) {
              SITE_HEADER_ACTIONS = { ...DEFAULT_HEADER_ACTIONS_DATA, ...d.headerActions };
              try { localStorage.setItem('baantaphai_header_actions_v3', JSON.stringify(SITE_HEADER_ACTIONS)); } catch(e){}
              renderHeaderActionsSection();
            }
            if (d.hero && typeof d.hero === 'object' && isDiff(d.hero, SITE_HERO)) {
              if (d.hero.heroImg) d.hero.heroImg = formatDirectImageUrl(d.hero.heroImg);
              if (d.hero.heroImgNight) d.hero.heroImgNight = formatDirectImageUrl(d.hero.heroImgNight);
              const h = { ...DEFAULT_HERO_DATA, ...d.hero };
              if (!h.chips || !Array.isArray(h.chips) || h.chips.length === 0) {
                h.chips = JSON.parse(JSON.stringify(DEFAULT_HERO_DATA.chips));
              }
              if (!h.btnStartPriceText) h.btnStartPriceText = DEFAULT_HERO_DATA.btnStartPriceText;
              if (!h.omikujiBtnText) h.omikujiBtnText = DEFAULT_HERO_DATA.omikujiBtnText;
              if (!h.floatingBadgeLeft) {
                h.floatingBadgeLeft = JSON.parse(JSON.stringify(DEFAULT_HERO_DATA.floatingBadgeLeft));
              }
              if (!h.floatingBadgeRight) {
                h.floatingBadgeRight = JSON.parse(JSON.stringify(DEFAULT_HERO_DATA.floatingBadgeRight));
              }
              SITE_HERO = h;
              try { localStorage.setItem('baantaphai_hero_v3', JSON.stringify(SITE_HERO)); } catch(e){}
              renderHeroSection();
            }
            if (d.rooms && typeof d.rooms === 'object' && Object.keys(d.rooms).length > 0 && isDiff(d.rooms, SITE_ROOMS)) {
              SITE_ROOMS = { ...DEFAULT_ROOMS_DATA, ...d.rooms };
              try { localStorage.setItem('baantaphai_rooms_v3', JSON.stringify(SITE_ROOMS)); } catch(e){}
              renderRoomCards();

              // Live-refresh room detail modal if currently open by customer
              const roomModal = document.getElementById('roomModal');
              if (roomModal && !roomModal.classList.contains('hidden') && currentModalRoom && SITE_ROOMS[currentModalRoom.id]) {
                const updated = SITE_ROOMS[currentModalRoom.id];
                currentModalRoom = updated;
                const modalTitle = document.getElementById('modalTitle');
                if (modalTitle) modalTitle.textContent = updated.title;
                const modalBadge = document.getElementById('modalBadge');
                if (modalBadge) modalBadge.textContent = updated.badge;
                const modalPrice = document.getElementById('modalPrice');
                if (modalPrice) modalPrice.textContent = updated.price;
                const modalUnit = document.getElementById('modalUnit');
                if (modalUnit) modalUnit.textContent = updated.unit || '/ คืน';
                const modalCap = document.getElementById('modalCap');
                if (modalCap) modalCap.textContent = updated.cap;
                const modalDesc = document.getElementById('modalDesc');
                if (modalDesc) modalDesc.textContent = updated.desc;
                const bookingBtn = document.getElementById('modalBookingBtn');
                if (bookingBtn) {
                  const msg = encodeURIComponent(`สวัสดีครับ/ค่ะ สนใจสอบถาม/จองห้อง "${updated.title}" (${updated.price}${updated.unit || '/คืน'}) ครับ/ค่ะ`);
                  bookingBtn.href = `https://line.me/R/oaMessage/@baantaphairesort/?${msg}`;
                }
              }
            }
          if (Array.isArray(d.dining) && d.dining.length > 0 && isDiff(d.dining, SITE_DINING)) {
            SITE_DINING = d.dining;
            try { localStorage.setItem('baantaphai_dining_v3', JSON.stringify(SITE_DINING)); } catch(e){}
            renderDiningCards();
          }
          if (Array.isArray(d.menu) && d.menu.length > 0 && isDiff(d.menu, SITE_MENU)) {
            SITE_MENU = d.menu;
            try { localStorage.setItem('baantaphai_menu_v3', JSON.stringify(SITE_MENU)); } catch(e){}
            renderMenuItems();
          }
          if (d.menuHeader && typeof d.menuHeader === 'object' && isDiff(d.menuHeader, SITE_MENU_HEADER)) {
            SITE_MENU_HEADER = { ...DEFAULT_MENU_HEADER_DATA, ...d.menuHeader };
            try { localStorage.setItem('baantaphai_menu_header_v3', JSON.stringify(SITE_MENU_HEADER)); } catch(e){}
            renderMenuHeaderSection();
          }
          if (d.activitiesHeader && typeof d.activitiesHeader === 'object' && isDiff(d.activitiesHeader, SITE_ACTIVITIES_HEADER)) {
            SITE_ACTIVITIES_HEADER = { ...DEFAULT_ACTIVITIES_HEADER, ...d.activitiesHeader };
            try { localStorage.setItem('baantaphai_act_header_v3', JSON.stringify(SITE_ACTIVITIES_HEADER)); } catch(e){}
            renderActivitiesSection();
          }
          if (Array.isArray(d.activities) && d.activities.length > 0 && isDiff(d.activities, SITE_ACTIVITIES)) {
            SITE_ACTIVITIES = d.activities;
            try { localStorage.setItem('baantaphai_act_items_v3', JSON.stringify(SITE_ACTIVITIES)); } catch(e){}
            renderActivitiesSection();
          }
          if (d.roomsHeader && typeof d.roomsHeader === 'object' && isDiff(d.roomsHeader, SITE_ROOMS_HEADER)) {
            SITE_ROOMS_HEADER = { ...DEFAULT_ROOMS_HEADER, ...d.roomsHeader };
            try { localStorage.setItem('baantaphai_rooms_header_v3', JSON.stringify(SITE_ROOMS_HEADER)); } catch(e){}
            renderRoomsHeaderAndPerks();
          }
          if (Array.isArray(d.perks) && d.perks.length > 0 && isDiff(d.perks, SITE_PERKS)) {
            SITE_PERKS = d.perks;
            try { localStorage.setItem('baantaphai_perks_v3', JSON.stringify(SITE_PERKS)); } catch(e){}
            renderRoomsHeaderAndPerks();
          }
          if (d.perksFontSize && d.perksFontSize !== SITE_PERKS_FONT_SIZE) {
            SITE_PERKS_FONT_SIZE = d.perksFontSize;
            try { localStorage.setItem('baantaphai_perks_font_size_v3', SITE_PERKS_FONT_SIZE); } catch(e){}
            renderRoomsHeaderAndPerks();
          }
          if (d.photoSpotsHeader && typeof d.photoSpotsHeader === 'object' && isDiff(d.photoSpotsHeader, SITE_PHOTO_SPOTS_HEADER)) {
            SITE_PHOTO_SPOTS_HEADER = { ...DEFAULT_PHOTO_SPOTS_HEADER, ...d.photoSpotsHeader };
            try { localStorage.setItem('baantaphai_ps_header_v3', JSON.stringify(SITE_PHOTO_SPOTS_HEADER)); } catch(e){}
            renderPhotoSpotsSection();
          }
          if (Array.isArray(d.photoSpots) && d.photoSpots.length > 0 && isDiff(d.photoSpots, SITE_PHOTO_SPOTS)) {
            SITE_PHOTO_SPOTS = d.photoSpots;
            try { localStorage.setItem('baantaphai_ps_items_v3', JSON.stringify(SITE_PHOTO_SPOTS)); } catch(e){}
            renderPhotoSpotsSection();
          }
          if (d.reviewsHeader && typeof d.reviewsHeader === 'object' && isDiff(d.reviewsHeader, SITE_REVIEWS_HEADER)) {
            SITE_REVIEWS_HEADER = {
              ...DEFAULT_REVIEWS_HEADER,
              ...d.reviewsHeader,
              commitments: (Array.isArray(d.reviewsHeader.commitments) && d.reviewsHeader.commitments.length >= 4)
                ? d.reviewsHeader.commitments
                : (SITE_REVIEWS_HEADER.commitments || DEFAULT_REVIEWS_HEADER.commitments)
            };
            try { localStorage.setItem('baantaphai_reviews_header_v3', JSON.stringify(SITE_REVIEWS_HEADER)); } catch(e){}
            renderReviewsSection();
          }
          if (d.facebookFeed && typeof d.facebookFeed === 'object' && isDiff(d.facebookFeed, SITE_FACEBOOK_FEED)) {
            SITE_FACEBOOK_FEED = {
              ...DEFAULT_FACEBOOK_FEED_DATA,
              ...d.facebookFeed,
              benefitItems: (Array.isArray(d.facebookFeed.benefitItems) && d.facebookFeed.benefitItems.length >= 3)
                ? d.facebookFeed.benefitItems
                : (SITE_FACEBOOK_FEED.benefitItems || DEFAULT_FACEBOOK_FEED_DATA.benefitItems)
            };
            try { localStorage.setItem('baantaphai_fb_feed_v3', JSON.stringify(SITE_FACEBOOK_FEED)); } catch(e){}
            renderFacebookFeedSection();
          }
          if (d.attractionsHeader && typeof d.attractionsHeader === 'object' && isDiff(d.attractionsHeader, SITE_ATTRACTIONS_HEADER)) {
            SITE_ATTRACTIONS_HEADER = { ...DEFAULT_ATTRACTIONS_HEADER, ...d.attractionsHeader };
            try { localStorage.setItem('baantaphai_attractions_header_v3', JSON.stringify(SITE_ATTRACTIONS_HEADER)); } catch(e){}
            renderAttractionsSection();
          }
          if (Array.isArray(d.attractionsItems) && d.attractionsItems.length > 0 && isDiff(d.attractionsItems, SITE_ATTRACTIONS_ITEMS)) {
            SITE_ATTRACTIONS_ITEMS = d.attractionsItems;
            try { localStorage.setItem('baantaphai_attractions_items_v3', JSON.stringify(SITE_ATTRACTIONS_ITEMS)); } catch(e){}
            renderAttractionsSection();
          }
          if (d.extra && typeof d.extra === 'object') { applyExtraFromCloud(d.extra); }
          if (d.policies && typeof d.policies === 'object' && isDiff(d.policies, SITE_POLICIES)) {
            SITE_POLICIES = { ...DEFAULT_POLICIES_DATA, ...d.policies };
            try { localStorage.setItem('baantaphai_policies_v3', JSON.stringify(SITE_POLICIES)); } catch(e){}
            renderPoliciesAndContactSection();
          }
          if (d.contact && typeof d.contact === 'object' && isDiff(d.contact, SITE_CONTACT)) {
            SITE_CONTACT = { ...DEFAULT_CONTACT_DATA, ...d.contact };
            try { localStorage.setItem('baantaphai_contact_v3', JSON.stringify(SITE_CONTACT)); } catch(e){}
            renderPoliciesAndContactSection();
          }
          if (d.faqHeader && typeof d.faqHeader === 'object' && isDiff(d.faqHeader, SITE_FAQ_HEADER)) {
            SITE_FAQ_HEADER = {
              ...DEFAULT_FAQ_HEADER,
              ...d.faqHeader,
              ctaButtons: (Array.isArray(d.faqHeader.ctaButtons) && d.faqHeader.ctaButtons.length > 0)
                ? d.faqHeader.ctaButtons
                : (SITE_FAQ_HEADER.ctaButtons || DEFAULT_FAQ_HEADER.ctaButtons)
            };
            try { localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER)); } catch(e){}
            renderFaqSection();
          }
          if (Array.isArray(d.faqItems) && d.faqItems.length > 0 && isDiff(d.faqItems, SITE_FAQ_ITEMS)) {
            SITE_FAQ_ITEMS = d.faqItems;
            try { localStorage.setItem('baantaphai_faq_items_v3', JSON.stringify(SITE_FAQ_ITEMS)); } catch(e){}
            renderFaqSection();
          }
          if (d.compHeader && typeof d.compHeader === 'object' && isDiff(d.compHeader, SITE_COMP_HEADER)) {
            SITE_COMP_HEADER = { ...DEFAULT_COMP_HEADER, ...d.compHeader };
            try { localStorage.setItem('baantaphai_comp_header_v3', JSON.stringify(SITE_COMP_HEADER)); } catch(e){}
            renderComparisonTable();
          }
          if (Array.isArray(d.compMatrix) && d.compMatrix.length > 0 && isDiff(d.compMatrix, SITE_COMP_MATRIX)) {
            SITE_COMP_MATRIX = d.compMatrix;
            try { localStorage.setItem('baantaphai_comp_matrix_v3', JSON.stringify(SITE_COMP_MATRIX)); } catch(e){}
            renderComparisonTable();
          }
          if (d.topBar && typeof d.topBar === 'object' && isDiff(d.topBar, SITE_TOP_BAR)) {
            SITE_TOP_BAR = { ...DEFAULT_TOP_BAR_DATA, ...d.topBar };
            try { localStorage.setItem('baantaphai_topbar_v3', JSON.stringify(SITE_TOP_BAR)); } catch(e){}
            renderTopBar();
          }
          if (d.omikujiHeader && typeof d.omikujiHeader === 'object' && isDiff(d.omikujiHeader, SITE_OMIKUJI_HEADER)) {
            SITE_OMIKUJI_HEADER = { ...DEFAULT_OMIKUJI_HEADER, ...d.omikujiHeader };
            try { localStorage.setItem('baantaphai_omikuji_header_v3', JSON.stringify(SITE_OMIKUJI_HEADER)); } catch(e){}
            renderOmikujiModal();
          }
          if (Array.isArray(d.omikujiPrizes) && d.omikujiPrizes.length > 0 && isDiff(d.omikujiPrizes, SITE_OMIKUJI_PRIZES)) {
            SITE_OMIKUJI_PRIZES = d.omikujiPrizes;
            if (typeof OMIKUJI_PRIZES !== 'undefined') OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES;
            try { localStorage.setItem('baantaphai_omikuji_prizes_v3', JSON.stringify(SITE_OMIKUJI_PRIZES)); } catch(e){}
            renderOmikujiModal();
          }
          if (d.roomFinder && typeof d.roomFinder === 'object' && isDiff(d.roomFinder, SITE_ROOM_FINDER)) {
            SITE_ROOM_FINDER = { ...DEFAULT_ROOM_FINDER_DATA, ...d.roomFinder };
            try { localStorage.setItem('baantaphai_room_finder_v3', JSON.stringify(SITE_ROOM_FINDER)); } catch(e){}
            renderRoomFinder();
          }
          if (d.diningHeader && typeof d.diningHeader === 'object' && isDiff(d.diningHeader, SITE_DINING_HEADER)) {
            SITE_DINING_HEADER = { ...DEFAULT_DINING_HEADER_DATA, ...d.diningHeader };
            try { localStorage.setItem('baantaphai_dining_header_v3', JSON.stringify(SITE_DINING_HEADER)); } catch(e){}
            renderDiningHeader();
          }
          if (d.diningBanner && typeof d.diningBanner === 'object' && isDiff(d.diningBanner, SITE_DINING_BANNER)) {
            SITE_DINING_BANNER = { ...DEFAULT_DINING_BANNER_DATA, ...d.diningBanner };
            try { localStorage.setItem('baantaphai_dining_banner_v3', JSON.stringify(SITE_DINING_BANNER)); } catch(e){}
            renderDiningBannerSection();
          }
          if (d.footer && typeof d.footer === 'object' && isDiff(d.footer, SITE_FOOTER)) {
            SITE_FOOTER = {
              ...DEFAULT_FOOTER_DATA,
              ...d.footer,
              buttons: (Array.isArray(d.footer.buttons) && d.footer.buttons.length > 0)
                ? d.footer.buttons
                : (SITE_FOOTER.buttons || DEFAULT_FOOTER_DATA.buttons)
            };
            try { localStorage.setItem('baantaphai_footer_v3', JSON.stringify(SITE_FOOTER)); } catch(e){}
            renderFooterSection();
          }

          lastCloudSyncTime = d.updatedAt || new Date().toISOString();
          updateCloudSyncStatusIndicator('synced', lastCloudSyncTime);

          if (typeof hasPendingDrafts === 'function' && !hasPendingDrafts()) {
            snapshotPublishedState();
          }
          if (typeof updateDraftUI === 'function') {
            updateDraftUI();
          }

          if (!silent) {
            showToast('☁️ ดึงข้อมูลล่าสุดจากคลาวด์สำเร็จ!');
          }
        }
      }
    } catch (err) {
        console.warn('[BaanTaPhai CloudSync] Fetch notice:', err.message);
        updateCloudSyncStatusIndicator('offline');
        if (!silent) {
          showToast('⚠️ ไม่สามารถเชื่อมต่อคลาวด์ได้ในขณะนี้ กำลังใช้ข้อมูลในเครื่อง');
        }
      } finally {
        isCloudSyncing = false;
      }
    }

    async function pushCloudData(reason = 'update') {
      lastLocalEditTimestamp = Date.now();
      if (isPushingCloudData) {
        pendingPushReason = reason;
        return;
      }
      isPushingCloudData = true;
      updateCloudSyncStatusIndicator('syncing');

      const payload = {
        rooms: SITE_ROOMS,
        hero: SITE_HERO,
        dining: SITE_DINING,
        menu: SITE_MENU,
        activitiesHeader: SITE_ACTIVITIES_HEADER,
        activities: SITE_ACTIVITIES,
        roomsHeader: SITE_ROOMS_HEADER,
        perks: SITE_PERKS,
        perksFontSize: SITE_PERKS_FONT_SIZE,
        photoSpotsHeader: SITE_PHOTO_SPOTS_HEADER,
        photoSpots: SITE_PHOTO_SPOTS,
        reviewsHeader: SITE_REVIEWS_HEADER,
        facebookFeed: SITE_FACEBOOK_FEED,
        attractionsHeader: SITE_ATTRACTIONS_HEADER,
        attractionsItems: SITE_ATTRACTIONS_ITEMS,
        logo: SITE_LOGO,
        policies: SITE_POLICIES,
        contact: SITE_CONTACT,
        faqHeader: SITE_FAQ_HEADER,
        faqItems: SITE_FAQ_ITEMS,
        footer: SITE_FOOTER,
        compHeader: SITE_COMP_HEADER,
        compMatrix: SITE_COMP_MATRIX,
        topBar: SITE_TOP_BAR,
        omikujiHeader: SITE_OMIKUJI_HEADER,
        omikujiPrizes: SITE_OMIKUJI_PRIZES,
        roomFinder: SITE_ROOM_FINDER,
        diningHeader: SITE_DINING_HEADER,
        diningBanner: SITE_DINING_BANNER,
        navMenu: SITE_NAV_MENU,
        headerActions: SITE_HEADER_ACTIONS,
        menuHeader: SITE_MENU_HEADER,
        typography: SITE_TYPOGRAPHY,
        extra: SITE_EXTRA,
        updatedAt: new Date().toISOString(),
        updatedReason: reason
      };

      try {
        const session = (typeof getAdminSession === 'function') ? getAdminSession() : null;
        if (!session) {
          // No valid admin session: keep the edit on this device and ask for the passphrase again.
          updateCloudSyncStatusIndicator('error');
          showToast('🔐 เซสชันแอดมินหมดอายุ กรุณาเข้าสู่ระบบอีกครั้งเพื่อเผยแพร่ขึ้นคลาวด์ (ข้อมูลยังเก็บไว้ในเครื่องนี้)');
          if (typeof promptAdminLoginForced === 'function') promptAdminLoginForced();
          return false;
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(CLOUD_SYNC_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.token
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.status === 401) {
          clearAdminSession();
          updateCloudSyncStatusIndicator('error');
          showToast('🔐 เซิร์ฟเวอร์ปฏิเสธสิทธิ์ (รหัสถูกเปลี่ยนหรือเซสชันหมดอายุ) กรุณาเข้าสู่ระบบใหม่ ข้อมูลยังเก็บไว้ในเครื่องนี้');
          if (typeof promptAdminLoginForced === 'function') promptAdminLoginForced();
          return false;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (result && result.success) {
          lastCloudSyncTime = result.updatedAt || new Date().toISOString();
          lastLocalEditTimestamp = new Date(lastCloudSyncTime).getTime();
          updateCloudSyncStatusIndicator('synced', lastCloudSyncTime);

          // Broadcast to all other open tabs on this device (0ms latency!)
          broadcastCloudPublish(lastCloudSyncTime, reason);

          showToast('☁️ บันทึกและซิงค์ขึ้นระบบคลาวด์สำเร็จ! (ทุกอุปกรณ์และลูกค้าทุกคนจะเห็นข้อมูลนี้ทันที)');
          return true;
        } else {
          throw new Error(result.error || 'Server returned failure');
        }
      } catch (err) {
        console.error('[BaanTaPhai CloudSync] Save error:', err);
        updateCloudSyncStatusIndicator('error');
        showToast('⚠️ ข้อมูลถูกบันทึกลงในเครื่องแล้ว แต่การซิงค์ขึ้นคลาวด์ขัดข้อง: ' + err.message);
        return false;
      } finally {
        isPushingCloudData = false;
        if (pendingPushReason) {
          const nextReason = pendingPushReason;
          pendingPushReason = null;
          pushCloudData(nextReason);
        }
      }
    }

    function forceSyncWithCloud() {
      fetchCloudData(false);
    }

    // ========================================================
    // ⚡ REAL-TIME CROSS-DEVICE & MULTI-TAB SYNC ENGINE
    // Ensures all customer phones, computers, and admin tabs update automatically
    // ========================================================
    const SYNC_CHANNEL_NAME = 'baantaphai_cloud_sync_channel';
    let syncBroadcastChannel = null;

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        syncBroadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        syncBroadcastChannel.onmessage = (event) => {
          if (!event || !event.data) return;
          const { type, updatedAt, reason } = event.data;
          if (type === 'CLOUD_PUBLISHED') {
            console.log('[BaanTaPhai Sync] Received cross-tab publish notification:', reason, updatedAt);
            fetchCloudData(true);
          }
        };
      }
    } catch(e) {
      console.warn('[BaanTaPhai Sync] BroadcastChannel init notice:', e);
    }

    function broadcastCloudPublish(timestamp, reason) {
      if (syncBroadcastChannel) {
        try {
          syncBroadcastChannel.postMessage({
            type: 'CLOUD_PUBLISHED',
            updatedAt: timestamp,
            reason: reason
          });
        } catch(e) {}
      }
      try {
        localStorage.setItem('baantaphai_cross_tab_sync_ping', String(Date.now()));
      } catch(e) {}
    }

    // Storage event listener fallback (for browsers/webviews without BroadcastChannel)
    window.addEventListener('storage', (e) => {
      if (e.key === 'baantaphai_cross_tab_sync_ping' && e.newValue) {
        fetchCloudData(true);
      }
    });

    // Window & Connectivity Lifecycle Listeners
    window.addEventListener('online', () => {
      console.log('[BaanTaPhai Sync] Device back online, syncing latest data...');
      fetchCloudData(true);
    });

    window.addEventListener('focus', () => {
      fetchCloudData(true);
    });

    window.addEventListener('pageshow', (event) => {
      fetchCloudData(true);
    });

    function isUserActivelyTyping() {
      const active = document.activeElement;
      if (!active) return false;
      const tag = (active.tagName || '').toLowerCase();
      return (tag === 'input' || tag === 'textarea' || active.isContentEditable);
    }

    let cloudSyncTimerId = null;

    function getAdaptiveSyncDelay() {
      // 12s in Admin Mode, 25s for regular guests/customers
      return (typeof isAdminMode !== 'undefined' && isAdminMode) ? 12000 : 25000;
    }

    function scheduleNextCloudSync(customDelay) {
      if (cloudSyncTimerId) clearTimeout(cloudSyncTimerId);
      const delay = customDelay || getAdaptiveSyncDelay();
      cloudSyncTimerId = setTimeout(async () => {
        try {
          if (!document.hidden && !isPushingCloudData && !isCloudSyncing && !isUserActivelyTyping()) {
            await fetchCloudData(true);
          }
        } catch(e) {}
        scheduleNextCloudSync();
      }, delay);
    }

    function startCloudSyncLoop() {
      scheduleNextCloudSync(4000); // initial start after 4s
    }

    // =========================================================================
    // DRAFT & PREVIEW BEFORE PUBLISH MANAGER (ระบบแบบร่าง & พรีวิวเว็บจริง)
    // =========================================================================
    let isPreviewOnlyMode = false;

    const SECTION_METADATA = {
      rooms: { name: 'ห้องพัก (Room Cards)', icon: '🛏️' },
      roomsHeader: { name: 'หัวข้อห้องพัก & หมายเหตุ', icon: '🛏️' },
      hero: { name: 'หน้าแรก & ภาพพื้นหลัง (Hero)', icon: '⛩️' },
      dining: { name: 'การ์ดโซนอาหาร & คาเฟ่', icon: '☕' },
      diningHeader: { name: 'หัวข้อคาเฟ่ & จุดเด่น 4 ด้าน', icon: '☕' },
      diningBanner: { name: 'แถบสั่งอาหารล่วงหน้า (Action Banner)', icon: '🛎️' },
      menu: { name: 'รายการเมนูอาหาร & คาเฟ่', icon: '🍽️' },
      menuHeader: { name: 'หัวข้อเมนูอาหารริมน้ำ', icon: '🍽️' },
      activities: { name: 'กิจกรรมฟรี (Experiences)', icon: '🛶' },
      activitiesHeader: { name: 'หัวข้อกิจกรรมฟรี', icon: '🛶' },
      perks: { name: 'สิทธิพิเศษ 3 ช่อง (Perks)', icon: '🌿' },
      photoSpots: { name: 'มุมถ่ายรูป (Photo Spots)', icon: '📸' },
      photoSpotsHeader: { name: 'หัวข้อจุดถ่ายรูป', icon: '📸' },
      reviews: { name: 'รีวิว & การันตีความประทับใจ', icon: '⭐' },
      facebook: { name: 'เพจ Facebook & โพสต์ล่าสุด', icon: '📱' },
      attractions: { name: 'สถานที่ท่องเที่ยวใกล้เคียง', icon: '🗺️' },
      attractionsHeader: { name: 'หัวข้อที่เที่ยวใกล้เคียง', icon: '🗺️' },
      logo: { name: 'โลโก้ & ชื่อรีสอร์ท', icon: '⛩️' },
      navMenu: { name: 'เมนูนำทาง (Navbar Links)', icon: '🧭' },
      headerActions: { name: 'ปุ่มติดต่อด่วน & โหมดกลางคืน (Navbar)', icon: '📞' },
      typography: { name: 'ฟอนต์และสไตล์ตัวอักษร', icon: '🔤' },
      policies: { name: 'เงื่อนไขและนโยบายการพัก', icon: '📋' },
      contact: { name: 'การเดินทาง & ข้อมูลติดต่อ', icon: '📍' },
      faq: { name: 'คำถามที่พบบ่อย (FAQ)', icon: '❓' },
      faqHeader: { name: 'หัวข้อคำถาม FAQ', icon: '❓' },
      footer: { name: 'ท้ายเว็บ (Footer & ปุ่มติดต่อ)', icon: '🦶' },
      compMatrix: { name: 'ตารางเปรียบเทียบห้องพัก', icon: '📊' },
      compHeader: { name: 'หัวข้อตารางห้องพัก', icon: '📊' },
      topBar: { name: 'แถบประกาศ & พยากรณ์อากาศ', icon: '🌤️' },
      omikuji: { name: 'เซียมซีนำโชค & รางวัล', icon: '🎋' },
      omikujiHeader: { name: 'หัวข้อเซียมซีนำโชค', icon: '🎋' },
      roomFinder: { name: 'ตัวช่วยเลือกห้องพัก (Quiz)', icon: '🎯' },
      story: { name: 'เรื่องราวของบ้านตาผาย (Story)', icon: '📖' },
      findUs: { name: 'หัวข้อค้นหาเรา & แผนที่ Google', icon: '📍' },
      reviewItems: { name: 'รีวิวลูกค้า (สไลด์ & การ์ด)', icon: '💬' },
      contactFab: { name: 'ปุ่มติดต่อลอย (ติดต่อเรา)', icon: '💬' }
    };

    let draftManifest = (() => {
      try {
        const saved = localStorage.getItem('baantaphai_draft_manifest_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch(e){}
      return [];
    })();

    function getDraftManifest() {
      return draftManifest || [];
    }

    function hasPendingDrafts() {
      return getDraftManifest().length > 0;
    }

    function getDraftChangesCount() {
      return getDraftManifest().length;
    }

    function snapshotPublishedState() {
      try {
        const snapshot = {
          SITE_LOGO,
          SITE_NAV_MENU,
          SITE_HEADER_ACTIONS,
          SITE_TYPOGRAPHY,
          SITE_ROOMS,
          SITE_HERO,
          SITE_DINING,
          SITE_DINING_HEADER,
          SITE_DINING_BANNER,
          SITE_MENU_HEADER,
          SITE_MENU,
          SITE_ACTIVITIES_HEADER,
          SITE_ACTIVITIES,
          SITE_ROOMS_HEADER,
          SITE_PERKS,
          SITE_PERKS_FONT_SIZE,
          SITE_PHOTO_SPOTS_HEADER,
          SITE_PHOTO_SPOTS,
          SITE_REVIEWS_HEADER,
          SITE_FACEBOOK_FEED,
          SITE_ATTRACTIONS_HEADER,
          SITE_ATTRACTIONS_ITEMS,
          SITE_POLICIES,
          SITE_CONTACT,
          SITE_FAQ_HEADER,
          SITE_FAQ_ITEMS,
          SITE_COMP_HEADER,
          SITE_COMP_MATRIX,
          SITE_TOP_BAR,
          SITE_OMIKUJI_HEADER,
          SITE_OMIKUJI_PRIZES,
          SITE_ROOM_FINDER,
          SITE_FOOTER,
          SITE_EXTRA,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('baantaphai_published_snapshot_v3', JSON.stringify(snapshot));
      } catch(e) {
        console.warn('[BaanTaPhai Snapshot] Save error:', e);
      }
    }

    function ensurePublishedSnapshot() {
      if (!localStorage.getItem('baantaphai_published_snapshot_v3') || !hasPendingDrafts()) {
        snapshotPublishedState();
      }
    }

    function recordDraftChange(sectionKey, description) {
      const meta = SECTION_METADATA[sectionKey] || { name: sectionKey, icon: '📝' };
      const changeItem = {
        id: 'd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        sectionKey: sectionKey,
        sectionName: meta.name,
        icon: meta.icon,
        description: description || `แก้ไข ${meta.name}`,
        timestamp: new Date().toISOString()
      };
      draftManifest.push(changeItem);
      try {
        localStorage.setItem('baantaphai_draft_manifest_v3', JSON.stringify(draftManifest));
      } catch(e) {}
    }

    function clearDraftManifest() {
      draftManifest = [];
      try {
        localStorage.removeItem('baantaphai_draft_manifest_v3');
      } catch(e) {}
    }

    function restorePublishedState() {
      try {
        const saved = localStorage.getItem('baantaphai_published_snapshot_v3');
        if (!saved) return false;
        const snap = JSON.parse(saved);
        if (snap.SITE_LOGO) { SITE_LOGO = snap.SITE_LOGO; localStorage.setItem('baantaphai_logo_v3', JSON.stringify(SITE_LOGO)); }
        if (snap.SITE_NAV_MENU) { SITE_NAV_MENU = snap.SITE_NAV_MENU; localStorage.setItem('baantaphai_nav_menu_v3', JSON.stringify(SITE_NAV_MENU)); }
        if (snap.SITE_HEADER_ACTIONS) { SITE_HEADER_ACTIONS = snap.SITE_HEADER_ACTIONS; localStorage.setItem('baantaphai_header_actions_v3', JSON.stringify(SITE_HEADER_ACTIONS)); }
        if (snap.SITE_TYPOGRAPHY) { SITE_TYPOGRAPHY = snap.SITE_TYPOGRAPHY; localStorage.setItem('baantaphai_typography_v3', JSON.stringify(SITE_TYPOGRAPHY)); applySiteTypography(); }
        if (snap.SITE_ROOMS) { SITE_ROOMS = snap.SITE_ROOMS; localStorage.setItem('baantaphai_rooms_v3', JSON.stringify(SITE_ROOMS)); }
        if (snap.SITE_HERO) { SITE_HERO = snap.SITE_HERO; localStorage.setItem('baantaphai_hero_v3', JSON.stringify(SITE_HERO)); }
        if (snap.SITE_DINING) { SITE_DINING = snap.SITE_DINING; localStorage.setItem('baantaphai_dining_v3', JSON.stringify(SITE_DINING)); }
        if (snap.SITE_DINING_HEADER) { SITE_DINING_HEADER = snap.SITE_DINING_HEADER; localStorage.setItem('baantaphai_dining_header_v3', JSON.stringify(SITE_DINING_HEADER)); }
        if (snap.SITE_DINING_BANNER) { SITE_DINING_BANNER = snap.SITE_DINING_BANNER; localStorage.setItem('baantaphai_dining_banner_v3', JSON.stringify(SITE_DINING_BANNER)); }
        if (snap.SITE_MENU_HEADER) { SITE_MENU_HEADER = snap.SITE_MENU_HEADER; localStorage.setItem('baantaphai_menu_header_v3', JSON.stringify(SITE_MENU_HEADER)); }
        if (snap.SITE_MENU) { SITE_MENU = snap.SITE_MENU; localStorage.setItem('baantaphai_menu_v3', JSON.stringify(SITE_MENU)); }
        if (snap.SITE_ACTIVITIES_HEADER) { SITE_ACTIVITIES_HEADER = snap.SITE_ACTIVITIES_HEADER; localStorage.setItem('baantaphai_act_header_v3', JSON.stringify(SITE_ACTIVITIES_HEADER)); }
        if (snap.SITE_ACTIVITIES) { SITE_ACTIVITIES = snap.SITE_ACTIVITIES; localStorage.setItem('baantaphai_act_items_v3', JSON.stringify(SITE_ACTIVITIES)); }
        if (snap.SITE_ROOMS_HEADER) { SITE_ROOMS_HEADER = snap.SITE_ROOMS_HEADER; localStorage.setItem('baantaphai_rooms_header_v3', JSON.stringify(SITE_ROOMS_HEADER)); }
        if (snap.SITE_PERKS) { SITE_PERKS = snap.SITE_PERKS; localStorage.setItem('baantaphai_perks_v3', JSON.stringify(SITE_PERKS)); }
        if (snap.SITE_PERKS_FONT_SIZE) { SITE_PERKS_FONT_SIZE = snap.SITE_PERKS_FONT_SIZE; localStorage.setItem('baantaphai_perks_font_size_v3', SITE_PERKS_FONT_SIZE); }
        if (snap.SITE_PHOTO_SPOTS_HEADER) { SITE_PHOTO_SPOTS_HEADER = snap.SITE_PHOTO_SPOTS_HEADER; localStorage.setItem('baantaphai_ps_header_v3', JSON.stringify(SITE_PHOTO_SPOTS_HEADER)); }
        if (snap.SITE_PHOTO_SPOTS) { SITE_PHOTO_SPOTS = snap.SITE_PHOTO_SPOTS; localStorage.setItem('baantaphai_ps_items_v3', JSON.stringify(SITE_PHOTO_SPOTS)); }
        if (snap.SITE_REVIEWS_HEADER) { SITE_REVIEWS_HEADER = snap.SITE_REVIEWS_HEADER; localStorage.setItem('baantaphai_reviews_header_v3', JSON.stringify(SITE_REVIEWS_HEADER)); }
        if (snap.SITE_FACEBOOK_FEED) { SITE_FACEBOOK_FEED = snap.SITE_FACEBOOK_FEED; localStorage.setItem('baantaphai_fb_feed_v3', JSON.stringify(SITE_FACEBOOK_FEED)); }
        if (snap.SITE_ATTRACTIONS_HEADER) { SITE_ATTRACTIONS_HEADER = snap.SITE_ATTRACTIONS_HEADER; localStorage.setItem('baantaphai_attractions_header_v3', JSON.stringify(SITE_ATTRACTIONS_HEADER)); }
        if (snap.SITE_ATTRACTIONS_ITEMS) { SITE_ATTRACTIONS_ITEMS = snap.SITE_ATTRACTIONS_ITEMS; localStorage.setItem('baantaphai_attractions_items_v3', JSON.stringify(SITE_ATTRACTIONS_ITEMS)); }
        if (snap.SITE_POLICIES) { SITE_POLICIES = snap.SITE_POLICIES; localStorage.setItem('baantaphai_policies_v3', JSON.stringify(SITE_POLICIES)); }
        if (snap.SITE_CONTACT) { SITE_CONTACT = snap.SITE_CONTACT; localStorage.setItem('baantaphai_contact_v3', JSON.stringify(SITE_CONTACT)); }
        if (snap.SITE_FAQ_HEADER) { SITE_FAQ_HEADER = snap.SITE_FAQ_HEADER; localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER)); }
        if (snap.SITE_FAQ_ITEMS) { SITE_FAQ_ITEMS = snap.SITE_FAQ_ITEMS; localStorage.setItem('baantaphai_faq_items_v3', JSON.stringify(SITE_FAQ_ITEMS)); }
        if (snap.SITE_COMP_HEADER) { SITE_COMP_HEADER = snap.SITE_COMP_HEADER; localStorage.setItem('baantaphai_comp_header_v3', JSON.stringify(SITE_COMP_HEADER)); }
        if (snap.SITE_COMP_MATRIX) { SITE_COMP_MATRIX = snap.SITE_COMP_MATRIX; localStorage.setItem('baantaphai_comp_matrix_v3', JSON.stringify(SITE_COMP_MATRIX)); }
        if (snap.SITE_TOP_BAR) { SITE_TOP_BAR = snap.SITE_TOP_BAR; localStorage.setItem('baantaphai_topbar_v3', JSON.stringify(SITE_TOP_BAR)); }
        if (snap.SITE_OMIKUJI_HEADER) { SITE_OMIKUJI_HEADER = snap.SITE_OMIKUJI_HEADER; localStorage.setItem('baantaphai_omikuji_header_v3', JSON.stringify(SITE_OMIKUJI_HEADER)); }
        if (snap.SITE_OMIKUJI_PRIZES) { SITE_OMIKUJI_PRIZES = snap.SITE_OMIKUJI_PRIZES; if (typeof OMIKUJI_PRIZES !== 'undefined') OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES; localStorage.setItem('baantaphai_omikuji_prizes_v3', JSON.stringify(SITE_OMIKUJI_PRIZES)); }
        if (snap.SITE_ROOM_FINDER) { SITE_ROOM_FINDER = snap.SITE_ROOM_FINDER; localStorage.setItem('baantaphai_room_finder_v3', JSON.stringify(SITE_ROOM_FINDER)); }
        if (snap.SITE_FOOTER) { SITE_FOOTER = snap.SITE_FOOTER; localStorage.setItem('baantaphai_footer_v3', JSON.stringify(SITE_FOOTER)); }
        if (snap.SITE_EXTRA) { restoreExtraFromSnapshot(snap.SITE_EXTRA); }

        clearDraftManifest();
        renderAllSiteSections();
        updateDraftUI();
        return true;
      } catch(e) {
        console.error('[BaanTaPhai Snapshot] Restore error:', e);
        return false;
      }
    }

    function renderAllSiteSections() {
      renderLogoSection();
      renderNavMenuSection();
      renderHeaderActionsSection();
      renderRoomCards();
      renderHeroSection();
      renderRoomFinder();
      renderDiningHeader();
      renderDiningCards();
      renderDiningBannerSection();
      renderMenuHeaderSection();
      renderMenuItems();
      renderActivitiesSection();
      renderRoomsHeaderAndPerks();
      renderPhotoSpotsSection();
      renderReviewsSection();
      renderFacebookFeedSection();
      renderAttractionsSection();
      renderPoliciesAndContactSection();
      renderFaqSection();
      renderComparisonTable();
      renderTopBar();
      renderOmikujiModal();
      renderFooterSection();
      renderExtraSections();
    }

    function updateDraftUI() {
      const count = getDraftChangesCount();
      const statusBadge = document.getElementById('adminDraftStatusBadge');
      const publishBtnBadge = document.getElementById('adminPublishBtnBadge');
      const discardBtn = document.getElementById('adminDiscardDraftBtn');
      const previewBadge = document.getElementById('previewDraftBadge');
      const floatingPill = document.getElementById('draftActiveFloatingPill');
      const floatingCount = document.getElementById('floatingDraftCount');

      if (statusBadge) {
        if (count > 0) {
          statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-200 border border-amber-800 text-[11px] font-bold transition-all cursor-pointer hover:brightness-125 active:scale-95 shadow-sm';
          statusBadge.innerHTML = `<i class="fa-solid fa-pencil text-amber-400"></i> มีแบบร่างรอเผยแพร่ (${count})`;
          statusBadge.title = `มีแบบร่าง ${count} รายการที่ยังไม่ได้เผยแพร่ (คลิกเพื่อดูรายการและเผยแพร่จริง)`;
          statusBadge.onclick = openPublishModal;
        } else {
          statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/10 text-stone-800 border border-stone-800/20 text-[11px] font-semibold transition-all cursor-pointer hover:bg-stone-900/20 active:scale-95';
          statusBadge.innerHTML = `<i class="fa-solid fa-check text-emerald-700"></i> เผยแพร่ล่าสุดแล้ว`;
          statusBadge.title = 'ข้อมูลบนหน้าเว็บเป็นเวอร์ชันล่าสุดแล้ว (คลิกเพื่อตรวจสอบ)';
          statusBadge.onclick = openPublishModal;
        }
      }

      if (publishBtnBadge) {
        if (count > 0) {
          publishBtnBadge.textContent = count;
          publishBtnBadge.classList.remove('hidden');
        } else {
          publishBtnBadge.classList.add('hidden');
        }
      }

      if (discardBtn) {
        if (count > 0) {
          discardBtn.classList.remove('hidden');
          discardBtn.classList.add('flex');
        } else {
          discardBtn.classList.add('hidden');
          discardBtn.classList.remove('flex');
        }
      }

      if (previewBadge) {
        previewBadge.textContent = count > 0 ? `แบบร่าง (${count})` : 'เผยแพร่ล่าสุดแล้ว';
        previewBadge.title = count > 0 ? `มีแบบร่าง ${count} รายการ (คลิกเพื่อดูและเผยแพร่จริง)` : 'เผยแพร่ล่าสุดแล้ว';
        previewBadge.onclick = openPublishModal;
      }

      if (floatingPill && floatingCount) {
        if (isAdminMode && count > 0 && !isPreviewOnlyMode) {
          floatingCount.textContent = `${count} รายการ`;
          floatingPill.classList.remove('hidden');
        } else {
          floatingPill.classList.add('hidden');
        }
      }
    }

    function handleSectionSave(sectionKey, description, isDirectPublish = false) {
      ensurePublishedSnapshot();
      recordDraftChange(sectionKey, description);
      updateDraftUI();

      if (isDirectPublish) {
        executePublishAllDrafts(description);
      } else {
        const meta = SECTION_METADATA[sectionKey] || { name: sectionKey, icon: '📝' };
        showToast(`${meta.icon} บันทึกแบบร่าง "${description || meta.name}" แล้ว!\n(สามารถพรีวิวดูผลลัพธ์บนเว็บได้ทันที หรือกด "เผยแพร่จริง" เมื่อพร้อม)`);
      }
    }

    function enterPreviewOnlyMode() {
      isPreviewOnlyMode = true;
      isAdminMode = false;
      const adminBar = document.getElementById('adminBar');
      if (adminBar) adminBar.classList.add('hidden');
      const floatingBar = document.getElementById('previewModeFloatingBar');
      if (floatingBar) floatingBar.classList.remove('hidden');

      renderAllSiteSections();
      updateDraftUI();
      showToast('👁️ เข้าสู่โหมดพรีวิวเว็บจริง (ซ่อนปุ่มแก้ไขทั้งหมด เพื่อจำลองมุมมองของลูกค้า)');
    }

    function exitPreviewOnlyMode() {
      isPreviewOnlyMode = false;
      isAdminMode = true;
      const adminBar = document.getElementById('adminBar');
      if (adminBar) adminBar.classList.remove('hidden');
      const floatingBar = document.getElementById('previewModeFloatingBar');
      if (floatingBar) floatingBar.classList.add('hidden');

      renderAllSiteSections();
      updateDraftUI();
      showToast('✏️ กลับสู่โหมดแก้ไขหน้าเว็บเรียบร้อยแล้ว');
    }

    function openPublishModal() {
      renderPublishModalList();
      const modal = document.getElementById('publishModal');
      if (modal) modal.classList.remove('hidden');
    }

    function closePublishModal() {
      const modal = document.getElementById('publishModal');
      if (modal) modal.classList.add('hidden');
    }

    function getDraftSectionTarget(sectionKey) {
      const map = {
        rooms: { elementId: 'rooms', editFn: () => typeof openRoomsHeaderEditModal === 'function' && openRoomsHeaderEditModal() },
        roomsHeader: { elementId: 'rooms', editFn: () => typeof openRoomsHeaderEditModal === 'function' && openRoomsHeaderEditModal() },
        hero: { elementId: 'topAnnounceBar', editFn: () => typeof openHeroEditModal === 'function' && openHeroEditModal() },
        dining: { elementId: 'dining', editFn: () => typeof openDiningHeaderEditModal === 'function' && openDiningHeaderEditModal() },
        diningHeader: { elementId: 'dining', editFn: () => typeof openDiningHeaderEditModal === 'function' && openDiningHeaderEditModal() },
        diningBanner: { elementId: 'diningBannerContainer', editFn: () => typeof openDiningBannerEditModal === 'function' && openDiningBannerEditModal() },
        menu: { elementId: 'dining', editFn: () => typeof openMenuModal === 'function' && openMenuModal() },
        menuHeader: { elementId: 'dining', editFn: () => typeof openMenuHeaderEditModal === 'function' && openMenuHeaderEditModal() },
        activities: { elementId: 'highlights', editFn: () => typeof openActivitiesHeaderEditModal === 'function' && openActivitiesHeaderEditModal() },
        activitiesHeader: { elementId: 'highlights', editFn: () => typeof openActivitiesHeaderEditModal === 'function' && openActivitiesHeaderEditModal() },
        perks: { elementId: 'rooms', editFn: () => typeof openPerksEditModal === 'function' && openPerksEditModal() },
        photoSpots: { elementId: 'photospots', editFn: () => typeof openPhotoSpotsHeaderEditModal === 'function' && openPhotoSpotsHeaderEditModal() },
        photoSpotsHeader: { elementId: 'photospots', editFn: () => typeof openPhotoSpotsHeaderEditModal === 'function' && openPhotoSpotsHeaderEditModal() },
        reviews: { elementId: 'reviews', editFn: () => typeof openReviewsHeaderEditModal === 'function' && openReviewsHeaderEditModal() },
        facebook: { elementId: 'facebook-feed', editFn: () => typeof openFacebookEditModal === 'function' && openFacebookEditModal() },
        attractions: { elementId: 'attractions', editFn: () => typeof openManageAttractionsModal === 'function' && openManageAttractionsModal() },
        attractionsHeader: { elementId: 'attractions', editFn: () => typeof openAttractionsHeaderEditModal === 'function' && openAttractionsHeaderEditModal() },
        logo: { elementId: 'mainNavbar', editFn: () => typeof openLogoEditModal === 'function' && openLogoEditModal() },
        navMenu: { elementId: 'mainNavbar', editFn: () => typeof openNavMenuEditModal === 'function' && openNavMenuEditModal() },
        headerActions: { elementId: 'mainNavbar', editFn: () => typeof openHeaderActionsEditModal === 'function' && openHeaderActionsEditModal() },
        typography: { elementId: 'topAnnounceBar', editFn: () => typeof openFontModal === 'function' && openFontModal() },
        policies: { elementId: 'info', editFn: () => typeof openPoliciesEditModal === 'function' && openPoliciesEditModal() },
        contact: { elementId: 'info', editFn: () => typeof openContactEditModal === 'function' && openContactEditModal() },
        faq: { elementId: 'faq', editFn: () => typeof openFaqModal === 'function' && openFaqModal() },
        faqHeader: { elementId: 'faq', editFn: () => typeof openFaqHeaderEditModal === 'function' && openFaqHeaderEditModal() },
        footer: { elementId: 'mainFooter', editFn: () => typeof openFooterEditModal === 'function' && openFooterEditModal() },
        compMatrix: { elementId: 'matcher', editFn: () => typeof openComparisonManagerModal === 'function' && openComparisonManagerModal() },
        compHeader: { elementId: 'matcher', editFn: () => typeof openComparisonHeaderEditModal === 'function' && openComparisonHeaderEditModal() },
        topBar: { elementId: 'topAnnounceBar', editFn: () => typeof openTopBarEditModal === 'function' && openTopBarEditModal() },
        omikuji: { elementId: 'topAnnounceBar', editFn: () => typeof openOmikujiManagerModal === 'function' && openOmikujiManagerModal() },
        omikujiHeader: { elementId: 'topAnnounceBar', editFn: () => typeof openOmikujiHeaderEditModal === 'function' && openOmikujiHeaderEditModal() },
        story: { elementId: 'story', editFn: () => openExtraEditor('story') },
        findUs: { elementId: 'findUsBlock', editFn: () => openExtraEditor('findUs') },
        reviewItems: { elementId: 'reviewSlider', editFn: () => openExtraEditor('reviews') },
        contactFab: { elementId: 'contactFab', editFn: () => openExtraEditor('fab') },
        roomFinder: { elementId: 'matcher', editFn: () => typeof openRoomFinderEditModal === 'function' && openRoomFinderEditModal() }
      };
      return map[sectionKey] || { elementId: 'rooms', editFn: null };
    }

    function navigateToDraftSection(sectionKey) {
      closePublishModal();
      const target = getDraftSectionTarget(sectionKey);
      if (target && target.elementId) {
        const el = document.getElementById(target.elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-amber-400', 'ring-offset-2', 'transition-all');
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-amber-400', 'ring-offset-2');
          }, 2500);
        }
      }
    }

    function openDraftSectionEditor(sectionKey) {
      closePublishModal();
      const target = getDraftSectionTarget(sectionKey);
      if (target && typeof target.editFn === 'function') {
        try {
          target.editFn();
        } catch(e) {
          console.warn('[BaanTaPhai Draft] Edit open error:', e);
        }
      }
    }

    function discardSingleDraftItem(itemId) {
      const manifest = getDraftManifest();
      const targetIndex = manifest.findIndex(m => m.id === itemId);
      if (targetIndex === -1) return;
      const targetItem = manifest[targetIndex];

      if (!confirm(`คุณต้องการยกเลิกแบบร่าง "${targetItem.description || targetItem.sectionName}" ใช่หรือไม่?\n\n(หากยกเลิก ข้อมูลส่วนนี้จะย้อนกลับไปใช้เวอร์ชันที่เผยแพร่ไว้ล่าสุด)`)) {
        return;
      }

      manifest.splice(targetIndex, 1);
      draftManifest = manifest;
      try {
        localStorage.setItem('baantaphai_draft_manifest_v3', JSON.stringify(draftManifest));
      } catch(e) {}

      const remainingForSection = draftManifest.filter(m => m.sectionKey === targetItem.sectionKey);
      if (remainingForSection.length === 0) {
        restoreSectionFromSnapshot(targetItem.sectionKey);
      }

      if (draftManifest.length === 0) {
        clearDraftManifest();
      }

      renderAllSiteSections();
      updateDraftUI();
      renderPublishModalList();
      showToast(`🔄 ยกเลิกแบบร่าง "${targetItem.description || targetItem.sectionName}" แล้ว`);
    }

    function restoreSectionFromSnapshot(sectionKey) {
      try {
        const saved = localStorage.getItem('baantaphai_published_snapshot_v3');
        if (!saved) return;
        const snap = JSON.parse(saved);
        const map = {
          rooms: () => { if (snap.SITE_ROOMS) { SITE_ROOMS = snap.SITE_ROOMS; localStorage.setItem('baantaphai_rooms_v3', JSON.stringify(SITE_ROOMS)); } },
          roomsHeader: () => { if (snap.SITE_ROOMS_HEADER) { SITE_ROOMS_HEADER = snap.SITE_ROOMS_HEADER; localStorage.setItem('baantaphai_rooms_header_v3', JSON.stringify(SITE_ROOMS_HEADER)); } },
          hero: () => { if (snap.SITE_HERO) { SITE_HERO = snap.SITE_HERO; localStorage.setItem('baantaphai_hero_v3', JSON.stringify(SITE_HERO)); } },
          dining: () => { if (snap.SITE_DINING) { SITE_DINING = snap.SITE_DINING; localStorage.setItem('baantaphai_dining_v3', JSON.stringify(SITE_DINING)); } },
          diningHeader: () => { if (snap.SITE_DINING_HEADER) { SITE_DINING_HEADER = snap.SITE_DINING_HEADER; localStorage.setItem('baantaphai_dining_header_v3', JSON.stringify(SITE_DINING_HEADER)); } },
          diningBanner: () => { if (snap.SITE_DINING_BANNER) { SITE_DINING_BANNER = snap.SITE_DINING_BANNER; localStorage.setItem('baantaphai_dining_banner_v3', JSON.stringify(SITE_DINING_BANNER)); } },
          menu: () => { if (snap.SITE_MENU) { SITE_MENU = snap.SITE_MENU; localStorage.setItem('baantaphai_menu_v3', JSON.stringify(SITE_MENU)); } },
          menuHeader: () => { if (snap.SITE_MENU_HEADER) { SITE_MENU_HEADER = snap.SITE_MENU_HEADER; localStorage.setItem('baantaphai_menu_header_v3', JSON.stringify(SITE_MENU_HEADER)); } },
          activities: () => { if (snap.SITE_ACTIVITIES) { SITE_ACTIVITIES = snap.SITE_ACTIVITIES; localStorage.setItem('baantaphai_act_items_v3', JSON.stringify(SITE_ACTIVITIES)); } },
          activitiesHeader: () => { if (snap.SITE_ACTIVITIES_HEADER) { SITE_ACTIVITIES_HEADER = snap.SITE_ACTIVITIES_HEADER; localStorage.setItem('baantaphai_act_header_v3', JSON.stringify(SITE_ACTIVITIES_HEADER)); } },
          perks: () => {
            if (snap.SITE_PERKS) { SITE_PERKS = snap.SITE_PERKS; localStorage.setItem('baantaphai_perks_v3', JSON.stringify(SITE_PERKS)); }
            if (snap.SITE_PERKS_FONT_SIZE) { SITE_PERKS_FONT_SIZE = snap.SITE_PERKS_FONT_SIZE; localStorage.setItem('baantaphai_perks_font_size_v3', SITE_PERKS_FONT_SIZE); }
          },
          photoSpots: () => { if (snap.SITE_PHOTO_SPOTS) { SITE_PHOTO_SPOTS = snap.SITE_PHOTO_SPOTS; localStorage.setItem('baantaphai_ps_items_v3', JSON.stringify(SITE_PHOTO_SPOTS)); } },
          photoSpotsHeader: () => { if (snap.SITE_PHOTO_SPOTS_HEADER) { SITE_PHOTO_SPOTS_HEADER = snap.SITE_PHOTO_SPOTS_HEADER; localStorage.setItem('baantaphai_ps_header_v3', JSON.stringify(SITE_PHOTO_SPOTS_HEADER)); } },
          reviews: () => { if (snap.SITE_REVIEWS_HEADER) { SITE_REVIEWS_HEADER = snap.SITE_REVIEWS_HEADER; localStorage.setItem('baantaphai_reviews_header_v3', JSON.stringify(SITE_REVIEWS_HEADER)); } },
          facebook: () => { if (snap.SITE_FACEBOOK_FEED) { SITE_FACEBOOK_FEED = snap.SITE_FACEBOOK_FEED; localStorage.setItem('baantaphai_fb_feed_v3', JSON.stringify(SITE_FACEBOOK_FEED)); } },
          attractions: () => { if (snap.SITE_ATTRACTIONS_ITEMS) { SITE_ATTRACTIONS_ITEMS = snap.SITE_ATTRACTIONS_ITEMS; localStorage.setItem('baantaphai_attractions_items_v3', JSON.stringify(SITE_ATTRACTIONS_ITEMS)); } },
          attractionsHeader: () => { if (snap.SITE_ATTRACTIONS_HEADER) { SITE_ATTRACTIONS_HEADER = snap.SITE_ATTRACTIONS_HEADER; localStorage.setItem('baantaphai_attractions_header_v3', JSON.stringify(SITE_ATTRACTIONS_HEADER)); } },
          logo: () => { if (snap.SITE_LOGO) { SITE_LOGO = snap.SITE_LOGO; localStorage.setItem('baantaphai_logo_v3', JSON.stringify(SITE_LOGO)); } },
          navMenu: () => { if (snap.SITE_NAV_MENU) { SITE_NAV_MENU = snap.SITE_NAV_MENU; localStorage.setItem('baantaphai_nav_menu_v3', JSON.stringify(SITE_NAV_MENU)); } },
          headerActions: () => { if (snap.SITE_HEADER_ACTIONS) { SITE_HEADER_ACTIONS = snap.SITE_HEADER_ACTIONS; localStorage.setItem('baantaphai_header_actions_v3', JSON.stringify(SITE_HEADER_ACTIONS)); } },
          typography: () => { if (snap.SITE_TYPOGRAPHY) { SITE_TYPOGRAPHY = snap.SITE_TYPOGRAPHY; localStorage.setItem('baantaphai_typography_v3', JSON.stringify(SITE_TYPOGRAPHY)); applySiteTypography(); } },
          policies: () => { if (snap.SITE_POLICIES) { SITE_POLICIES = snap.SITE_POLICIES; localStorage.setItem('baantaphai_policies_v3', JSON.stringify(SITE_POLICIES)); } },
          contact: () => { if (snap.SITE_CONTACT) { SITE_CONTACT = snap.SITE_CONTACT; localStorage.setItem('baantaphai_contact_v3', JSON.stringify(SITE_CONTACT)); } },
          faq: () => { if (snap.SITE_FAQ_ITEMS) { SITE_FAQ_ITEMS = snap.SITE_FAQ_ITEMS; localStorage.setItem('baantaphai_faq_items_v3', JSON.stringify(SITE_FAQ_ITEMS)); } },
          faqHeader: () => { if (snap.SITE_FAQ_HEADER) { SITE_FAQ_HEADER = snap.SITE_FAQ_HEADER; localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER)); } },
          footer: () => { if (snap.SITE_FOOTER) { SITE_FOOTER = snap.SITE_FOOTER; localStorage.setItem('baantaphai_footer_v3', JSON.stringify(SITE_FOOTER)); } },
          compMatrix: () => { if (snap.SITE_COMP_MATRIX) { SITE_COMP_MATRIX = snap.SITE_COMP_MATRIX; localStorage.setItem('baantaphai_comp_matrix_v3', JSON.stringify(SITE_COMP_MATRIX)); } },
          compHeader: () => { if (snap.SITE_COMP_HEADER) { SITE_COMP_HEADER = snap.SITE_COMP_HEADER; localStorage.setItem('baantaphai_comp_header_v3', JSON.stringify(SITE_COMP_HEADER)); } },
          topBar: () => { if (snap.SITE_TOP_BAR) { SITE_TOP_BAR = snap.SITE_TOP_BAR; localStorage.setItem('baantaphai_topbar_v3', JSON.stringify(SITE_TOP_BAR)); } },
          omikuji: () => {
            if (snap.SITE_OMIKUJI_PRIZES) {
              SITE_OMIKUJI_PRIZES = snap.SITE_OMIKUJI_PRIZES;
              if (typeof OMIKUJI_PRIZES !== 'undefined') OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES;
              localStorage.setItem('baantaphai_omikuji_prizes_v3', JSON.stringify(SITE_OMIKUJI_PRIZES));
            }
          },
          omikujiHeader: () => { if (snap.SITE_OMIKUJI_HEADER) { SITE_OMIKUJI_HEADER = snap.SITE_OMIKUJI_HEADER; localStorage.setItem('baantaphai_omikuji_header_v3', JSON.stringify(SITE_OMIKUJI_HEADER)); } },
          story: () => restoreExtraFromSnapshot(snap.SITE_EXTRA, 'story'),
          findUs: () => restoreExtraFromSnapshot(snap.SITE_EXTRA, 'findUs'),
          reviewItems: () => restoreExtraFromSnapshot(snap.SITE_EXTRA, 'reviews'),
          contactFab: () => restoreExtraFromSnapshot(snap.SITE_EXTRA, 'fab'),
          roomFinder: () => { if (snap.SITE_ROOM_FINDER) { SITE_ROOM_FINDER = snap.SITE_ROOM_FINDER; localStorage.setItem('baantaphai_room_finder_v3', JSON.stringify(SITE_ROOM_FINDER)); } }
        };
        if (map[sectionKey]) {
          map[sectionKey]();
        }
      } catch(e) {
        console.warn('[BaanTaPhai Revert Section] Error:', e);
      }
    }

    function renderPublishModalList() {
      const listEl = document.getElementById('publishChangesList');
      const countBadge = document.getElementById('publishChangeCountBadge');
      const bannerTitle = document.getElementById('publishBannerTitle');
      const bannerSubtitle = document.getElementById('publishBannerSubtitle');
      const confirmBtn = document.getElementById('confirmPublishBtn');
      const discardBtn = document.getElementById('publishModalDiscardBtn');
      const statusBanner = document.getElementById('publishStatusBanner');

      const manifest = getDraftManifest();
      const count = manifest.length;

      if (countBadge) countBadge.textContent = `${count} รายการ`;

      if (!listEl) return;
      listEl.innerHTML = '';

      if (count === 0) {
        if (bannerTitle) bannerTitle.textContent = '✅ ข้อมูลบนหน้าเว็บเป็นเวอร์ชันล่าสุดแล้ว';
        if (bannerSubtitle) bannerSubtitle.textContent = 'ไม่มีแบบร่างที่ค้างอยู่ ข้อมูลทั้งหมดถูกเผยแพร่สู่ระบบคลาวด์และแสดงผลแก่ลูกค้าเรียบร้อยแล้ว';
        if (statusBanner) statusBanner.className = 'p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5';
        if (confirmBtn) {
          confirmBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> บังคับซิงค์คลาวด์อีกครั้ง';
        }
        if (discardBtn) discardBtn.style.display = 'none';

        listEl.innerHTML = `
          <div class="py-8 text-center text-stone-400 text-xs">
            <span class="text-3xl block mb-2">🎉</span>
            ไม่มีแบบร่างที่รอเผยแพร่ในขณะนี้
          </div>
        `;
        return;
      }

      if (bannerTitle) bannerTitle.textContent = `มีแบบร่างที่ยังไม่ได้เผยแพร่ (${count} รายการ)`;
      if (bannerSubtitle) bannerSubtitle.textContent = 'เมื่อกดยืนยันเผยแพร่ ข้อมูลทั้งหมดจะถูกส่งขึ้นคลาวด์และแสดงผลแก่ผู้เข้าชมและลูกค้าทุกคนทันที';
      if (statusBanner) statusBanner.className = 'p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5';
      if (confirmBtn) {
        confirmBtn.innerHTML = '<i class="fa-solid fa-rocket"></i> ยืนยันเผยแพร่ทันที';
      }
      if (discardBtn) discardBtn.style.display = 'inline-flex';

      // Render list items in reverse chronological order
      const reversed = [...manifest].reverse();
      reversed.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'group p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/70 border border-stone-200 hover:border-amber-300 flex items-center justify-between gap-3 text-xs transition-all shadow-xs';
        const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';
        row.innerHTML = `
          <div onclick="navigateToDraftSection('${item.sectionKey}')" class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" title="คลิกเพื่อเลื่อนดูตำแหน่งนี้บนหน้าเว็บ">
            <span class="w-8 h-8 rounded-xl bg-amber-100 group-hover:bg-amber-200 text-stone-800 flex items-center justify-center text-base shrink-0 transition-colors shadow-xs">
              ${item.icon || '📝'}
            </span>
            <div class="min-w-0 truncate">
              <div class="flex items-center gap-2">
                <span class="font-bold text-stone-800 group-hover:text-amber-950 transition-colors">${item.sectionName || 'ส่วนของเว็บไซต์'}</span>
                <span class="text-[10px] text-stone-400 font-mono">${timeStr}</span>
              </div>
              <p class="text-stone-500 text-[11px] truncate group-hover:text-stone-700 mt-0.5">${item.description || 'มีการปรับปรุงข้อมูล'}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button type="button" onclick="navigateToDraftSection('${item.sectionKey}')" class="px-2.5 py-1 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-700 font-medium text-[11px] transition-colors flex items-center gap-1" title="ดูตำแหน่งที่แก้ไขบนหน้าเว็บ">
              <i class="fa-solid fa-eye text-[10px]"></i> <span class="hidden sm:inline">ดูบนเว็บ</span>
            </button>
            <button type="button" onclick="openDraftSectionEditor('${item.sectionKey}')" class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs" title="เปิดหน้าต่างแก้ไขส่วนนี้">
              <i class="fa-solid fa-pen text-[10px]"></i> <span class="hidden sm:inline">แก้ไขต่อ</span>
            </button>
            <button type="button" onclick="discardSingleDraftItem('${item.id}')" class="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors flex items-center justify-center text-xs" title="ยกเลิกเฉพาะแบบร่างนี้">
              <i class="fa-solid fa-trash-can text-[10px]"></i>
            </button>
          </div>
        `;
        listEl.appendChild(row);
      });
    }

    async function confirmAndExecutePublish() {
      const confirmBtn = document.getElementById('confirmPublishBtn');
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังเผยแพร่...';
      }

      const success = await executePublishAllDrafts();

      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fa-solid fa-rocket"></i> ยืนยันเผยแพร่ทันที';
      }
    }

    async function executePublishAllDrafts(customReason) {
      const count = getDraftChangesCount();
      const manifest = getDraftManifest();
      let reason = customReason;
      if (!reason) {
        if (count > 0) {
          const sections = [...new Set(manifest.map(m => m.sectionName || m.sectionKey))];
          reason = `เผยแพร่แบบร่าง (${count} รายการ: ${sections.slice(0, 3).join(', ')}${sections.length > 3 ? '...' : ''})`;
        } else {
          reason = 'เผยแพร่ข้อมูลสู่เว็บจริง';
        }
      }

      const success = await pushCloudData(reason);
      if (success) {
        clearDraftManifest();
        snapshotPublishedState();
        updateDraftUI();
        closePublishModal();
        showToast('🚀 เผยแพร่ข้อมูลสู่เว็บจริงและซิงค์คลาวด์สำเร็จแล้ว! (ลูกค้าและทุกอุปกรณ์เห็นข้อมูลใหม่ทันที)');
      }
      return success;
    }

    function discardAllDrafts() {
      const count = getDraftChangesCount();
      if (count === 0) {
        showToast('ไม่มีแบบร่างที่ต้องยกเลิก');
        return;
      }

      if (confirm(`คุณต้องการยกเลิกการเปลี่ยนแปลงทั้งหมดในแบบร่าง (${count} รายการ) และย้อนกลับไปใช้เวอร์ชันที่เผยแพร่ไว้ล่าสุดใช่หรือไม่?\n\n(ข้อมูลแบบร่างที่ยังไม่ได้เผยแพร่จะถูกยกเลิกทั้งหมด)`)) {
        const restored = restorePublishedState();
        if (restored) {
          closePublishModal();
          showToast('🔄 ยกเลิกแบบร่างทั้งหมดแล้ว หน้าเว็บกลับสู่เวอร์ชันเผยแพร่ล่าสุด');
        } else {
          showToast('⚠️ ไม่พบข้อมูลสำรอง หรือไม่สามารถคืนค่าได้');
        }
      }
    }

    let isAdminMode = false;
    let currentFilter = 'all';
    let currentModalRoom = null;
    let currentPhotoIndex = 0;
    let isNightMode = false;

    // Quiz selections
    let quizSelected = {
      people: '2',
      vibe: 'riverside'
    };

    // Card Image Focal Point, Zoom & Filter Styling Helper
    function getCardImageStyle(item) {
      if (!item) return '';
      const styles = [];
      if (item.objectPosition) {
        styles.push(`object-position: ${item.objectPosition}`);
      }
      if (item.zoom && Number(item.zoom) !== 1) {
        styles.push(`transform: scale(${item.zoom})`);
      }
      if (item.filter) {
        styles.push(`filter: ${item.filter}`);
      }
      return styles.join('; ');
    }

    // 3. RENDER ROOM CARDS (High-Performance Single-Frame Batch Render)
    function renderRoomCards() {
      const container = document.getElementById('roomContainer');
      if (!container) return;
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();

      Object.keys(SITE_ROOMS).forEach(key => {
        const room = SITE_ROOMS[key];
        const isCountry = room.id === 'country_house';
        const colClass = isCountry ? "md:col-span-2 lg:col-span-3" : "";
        const mainImg = (room.images && room.images.length > 0) ? room.images[0] : (room.img || '');

        const card = document.createElement('div');
        card.id = `card_${room.id}`;
        const fontOverrideCls = room.fontOverride ? `font-override-${room.fontOverride}` : '';
        card.className = `room-card group bg-white rounded-3xl sm:rounded-[28px] overflow-hidden border border-zen-cardborder shadow-minimal shadow-minimal-hover flex flex-col ${colClass} ${fontOverrideCls}`;
        card.setAttribute('data-cat', room.cat);

        // Edit button overlay in admin mode
        const editBtnHtml = isAdminMode ? `
          <button onclick="openEditModal('${room.id}')" class="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform active:scale-95">
            <i class="fa-solid fa-pen"></i> แก้ไขห้องนี้
          </button>
        ` : '';

        if (isCountry) {
          // Grand Villa Layout
          card.innerHTML = `
            ${editBtnHtml}
            <div class="grid grid-cols-1 lg:grid-cols-12">
              <div class="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100">
                <img src="${mainImg}" alt="${room.title}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style="${getCardImageStyle(room)}">
                <div class="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                  <span class="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-zen-dark/95 text-white shadow-xs">
                    🏡 เหมาหลัง 2 ชั้น
                  </span>
                  <span class="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-zen-torii text-white shadow-xs">
                    🎱 โต๊ะสนุกเกอร์ & โต๊ะบอลมือหมุนฟรี
                  </span>
                </div>
                <div class="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-light bg-black/75 text-white shadow-xs">
                  <i class="fa-solid fa-users text-[10px] mr-1"></i> ${room.cap}
                </div>
              </div>
              <div class="lg:col-span-6 p-5 sm:p-8 flex flex-col justify-between">
                <div>
                  <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 mb-2">
                    <div>
                      <span class="text-[10px] font-medium text-zen-torii uppercase tracking-widest">Grand Villa Exclusive</span>
                      <h3 class="text-xl sm:text-2xl font-semibold text-zen-dark tracking-tight">${room.title}</h3>
                    </div>
                    <div class="room-price-wide text-left sm:text-right">
                      <span class="text-[10px] text-zen-muted block uppercase tracking-wider font-light">ราคาเริ่มต้น</span>
                      <span class="text-2xl sm:text-3xl font-bold text-zen-torii font-serif">${room.price.replace('ราคาเริ่มต้น', '').trim()}</span>
                      <span class="text-xs text-zen-muted font-light"> ${room.unit}</span>
                    </div>
                  </div>
                  <p class="text-xs sm:text-sm text-zen-muted font-light leading-relaxed mb-4">
                    ${room.desc}
                  </p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5 py-3 border-y border-zen-cardborder/70 text-xs text-zen-dark/90 font-light">
                    ${room.highlights.map(hl => `
                      <div class="flex items-start gap-1.5">
                        <i class="fa-solid fa-check text-emerald-600 text-xs mt-0.5 shrink-0"></i>
                        <span>${hl}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button onclick="openRoomModal('${room.id}')" class="py-3 px-4 rounded-2xl bg-zen-sand text-zen-dark text-xs font-medium hover:bg-zen-sanddark transition-colors flex items-center justify-center gap-1.5 min-h-[44px] active:scale-98">
                    <i class="fa-regular fa-eye"></i> ดูข้อมูลและรูปภาพ (${(room.images||[]).length} รูป)
                  </button>
                  <a href="https://line.me/R/ti/p/@baantaphairesort" target="_blank" class="py-3 px-4 rounded-2xl bg-zen-line hover:bg-emerald-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px] active:scale-98">
                    <i class="fa-brands fa-line text-base"></i> จองเหมาหลังผ่าน LINE
                  </a>
                </div>
              </div>
            </div>
          `;
        } else {
          // Standard Room Card
          const priceNum = room.price.replace('ราคาเริ่มต้น', '').trim();
          const unitShort = (room.unit || '/ คืน').split('(')[0].trim();
          const unitNote = ((room.unit || '').match(/\(([^)]+)\)/) || [])[1] || '';
          const photoCount = (room.images || []).length;
          card.innerHTML = `
            ${editBtnHtml}
            <div class="room-media relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img src="${mainImg}" alt="${room.title}" loading="lazy" decoding="async" class="w-full h-full object-cover" style="${getCardImageStyle(room)}">
              <div class="room-shade absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"></div>
              <span class="room-chip absolute top-3 left-3">${room.badge}</span>
              <div class="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between gap-2 text-white">
                <div class="min-w-0">
                  <span class="room-chip"><i class="fa-solid fa-user-group text-[9px] mr-1"></i> ${room.cap.split('(')[0].trim()}</span>
                  ${photoCount > 1 ? `<span class="room-chip ml-1.5"><i class="fa-regular fa-images text-[9px] mr-1"></i> ${photoCount}</span>` : ''}
                </div>
                <div class="room-price text-right shrink-0">
                  <small>เริ่มต้น</small>
                  <b>${priceNum}</b>
                  <small>${unitShort}</small>
                </div>
              </div>
            </div>
            <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="room-title">${room.title}</h3>
                ${unitNote ? `<span class="room-incl"><i class="fa-solid fa-circle-check"></i> ${unitNote}</span>` : ''}
                <p class="text-xs sm:text-[13px] text-zen-muted font-light mt-3 mb-4 line-clamp-2 leading-relaxed">
                  ${room.desc}
                </p>
                <div class="space-y-2 mb-5 text-xs text-zen-dark/90 font-light">
                  ${room.highlights.slice(0, 3).map(hl => `
                    <div class="flex items-start gap-2">
                      <i class="fa-solid fa-check shrink-0"></i>
                      <span class="line-clamp-1">${hl}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2.5">
                <button onclick="openRoomModal('${room.id}')" class="room-btn-ghost w-full py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-1.5 min-h-[46px] active:scale-95">
                  <i class="fa-regular fa-eye"></i> ดูข้อมูลเต็ม
                </button>
                <a href="https://line.me/R/ti/p/@baantaphairesort" target="_blank" class="w-full py-2.5 px-3 rounded-2xl bg-zen-line hover:bg-emerald-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm min-h-[46px] active:scale-95">
                  <i class="fa-brands fa-line text-sm"></i> จองผ่าน LINE
                </a>
              </div>
            </div>
          `;
        }

        fragment.appendChild(card);
      });

      container.appendChild(fragment);
      applyCurrentFilter();
      renderComparisonTable();

      const modalAdminEls = document.querySelectorAll('#roomModal .modal-admin-only');
      modalAdminEls.forEach(el => {
        if (isAdminMode) {
          el.classList.remove('hidden');
          if (el.tagName === 'BUTTON') el.classList.add('inline-flex');
        } else {
          el.classList.add('hidden');
          el.classList.remove('inline-flex');
        }
      });
    }

    // 4. FILTER PILLS
    function filterRooms(category, btnElement) {
      if (typeof clearRoomSpotlight === 'function') clearRoomSpotlight();
      currentFilter = category;
      const pills = document.querySelectorAll('.filter-pill');
      pills.forEach(p => {
        p.classList.remove('bg-zen-dark', 'text-white', 'border-zen-dark');
        p.classList.add('bg-white', 'text-zen-dark', 'border-zen-cardborder');
      });

      const activePill = btnElement || document.querySelector(`.filter-pill[onclick*="'${category}'"]`);
      if (activePill) {
        activePill.classList.remove('bg-white', 'text-zen-dark', 'border-zen-cardborder');
        activePill.classList.add('bg-zen-dark', 'text-white', 'border-zen-dark');
      }

      applyCurrentFilter();
    }

    function applyCurrentFilter() {
      const cards = document.querySelectorAll('.room-card');
      cards.forEach(card => {
        const catData = card.getAttribute('data-cat') || '';
        if (currentFilter === 'all' || catData.includes(currentFilter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      // Meta Pixel: Search event when filtering rooms
      if (typeof window.trackMetaEvent === 'function' && currentFilter !== 'all') {
        window.trackMetaEvent('Search', {
          search_string: currentFilter,
          content_category: 'Room Category Filter'
        });
      }
    }

    // 5. DETAIL MODAL & CAROUSEL
    function openRoomModal(roomId) {
      const data = SITE_ROOMS[roomId];
      if (!data) return;

      currentModalRoom = data;
      currentPhotoIndex = 0;

      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalBadge').textContent = data.badge;
      const rawPrice = data.price || '฿0';
      const cleanPrice = rawPrice.replace(/^ราคาเริ่มต้น\s*/i, '').trim();
      document.getElementById('modalPrice').textContent = cleanPrice || rawPrice;
      document.getElementById('modalUnit').textContent = data.unit || '/ คืน';
      document.getElementById('modalCap').textContent = data.cap;
      document.getElementById('modalDesc').textContent = data.desc;

      updateModalPhoto();
      renderModalThumbnails();

      const hlContainer = document.getElementById('modalHighlights');
      if (hlContainer) {
        hlContainer.innerHTML = '';
        (data.highlights || []).forEach(hl => {
          const div = document.createElement('div');
          div.className = "flex items-start gap-2 text-xs text-zen-dark font-light";
          div.innerHTML = `<i class="fa-solid fa-check text-emerald-600 text-xs mt-0.5 shrink-0"></i> <span class="break-words leading-relaxed">${hl}</span>`;
          hlContainer.appendChild(div);
        });
      }

      // Update admin edit button states in modal
      const adminElements = document.querySelectorAll('#roomModal .modal-admin-only');
      adminElements.forEach(el => {
        if (isAdminMode) {
          el.classList.remove('hidden');
          if (el.tagName === 'BUTTON') el.classList.add('inline-flex');
        } else {
          el.classList.add('hidden');
          el.classList.remove('inline-flex');
        }
      });

      // Reset scroll position on opening modal
      const modalScrollArea = document.getElementById('modalDetailsScrollArea');
      if (modalScrollArea) modalScrollArea.scrollTop = 0;
      const modalGrid = document.querySelector('#roomModal .grid');
      if (modalGrid) modalGrid.scrollTop = 0;

      // Update direct booking CTA link
      const bookingBtn = document.getElementById('modalBookingBtn');
      if (bookingBtn) {
        const msg = encodeURIComponent(`สวัสดีครับ/ค่ะ สนใจสอบถาม/จองห้อง "${data.title}" (${cleanPrice || rawPrice}${data.unit || '/คืน'}) ครับ/ค่ะ`);
        bookingBtn.href = `https://line.me/R/oaMessage/@baantaphairesort/?${msg}`;
      }
      const messengerBtn = document.getElementById('modalMessengerBtn');
      if (messengerBtn) {
        messengerBtn.href = 'https://m.me/Baantaphai';
      }

      // Meta Pixel: ViewContent tracking for specific room
      if (typeof window.trackMetaEvent === 'function') {
        const numericPrice = parseInt((data.price || '').replace(/[^0-9]/g, ''), 10) || 0;
        window.trackMetaEvent('ViewContent', {
          content_name: data.title,
          content_category: 'Resort Room',
          content_ids: [roomId],
          value: numericPrice,
          currency: 'THB'
        });
      }

      document.getElementById('roomModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function updateModalPhoto() {
      if (!currentModalRoom) return;
      const imgs = currentModalRoom.images || [currentModalRoom.img];
      const imgUrl = imgs[currentPhotoIndex] || imgs[0];

      document.getElementById('modalImg').src = imgUrl;
      document.getElementById('modalPhotoIndex').textContent = `${currentPhotoIndex + 1} / ${imgs.length}`;

      const showArrows = imgs.length > 1;
      document.getElementById('modalPrevPhotoBtn').style.display = showArrows ? 'flex' : 'none';
      document.getElementById('modalNextPhotoBtn').style.display = showArrows ? 'flex' : 'none';
    }

    function renderModalThumbnails() {
      const bar = document.getElementById('modalThumbnailsBar');
      bar.innerHTML = '';
      if (!currentModalRoom) return;

      const imgs = currentModalRoom.images || [currentModalRoom.img];
      if (imgs.length <= 1) {
        bar.style.display = 'none';
        return;
      }
      bar.style.display = 'flex';

      imgs.forEach((imgUrl, idx) => {
        const thumb = document.createElement('button');
        thumb.className = `w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${idx === currentPhotoIndex ? 'border-zen-torii scale-105' : 'border-transparent opacity-60'}`;
        thumb.innerHTML = `<img src="${imgUrl}" loading="lazy" decoding="async" class="w-full h-full object-cover">`;
        thumb.onclick = () => {
          currentPhotoIndex = idx;
          updateModalPhoto();
          renderModalThumbnails();
        };
        bar.appendChild(thumb);
      });
    }

    function nextModalPhoto() {
      if (!currentModalRoom) return;
      const imgs = currentModalRoom.images || [currentModalRoom.img];
      currentPhotoIndex = (currentPhotoIndex + 1) % imgs.length;
      updateModalPhoto();
      renderModalThumbnails();
    }

    function prevModalPhoto() {
      if (!currentModalRoom) return;
      const imgs = currentModalRoom.images || [currentModalRoom.img];
      currentPhotoIndex = (currentPhotoIndex - 1 + imgs.length) % imgs.length;
      updateModalPhoto();
      renderModalThumbnails();
    }

    function closeRoomModal() {
      document.getElementById('roomModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    let openedFromDetailModal = false;

    function openEditModalFromDetail() {
      if (!currentModalRoom) return;
      openedFromDetailModal = true;
      const roomId = currentModalRoom.id;
      closeRoomModal();
      openEditModal(roomId);
    }

    // 6. SMART QUIZ ROOM MATCHER
    function selectQuiz(type, val, btn) {
      quizSelected[type] = val;
      const groupBtns = document.querySelectorAll(`.quiz-btn-${type}`);
      groupBtns.forEach(b => {
        b.classList.remove('border-zen-torii', 'bg-zen-sand', 'font-bold');
        b.classList.add('bg-white');
      });
      btn.classList.add('border-zen-torii', 'bg-zen-sand', 'font-bold');
      btn.classList.remove('bg-white');
    }

    function runSmartMatch() {
      let targetId = 'family_house';
      let targetTab = 'riverside';

      if (quizSelected.people === '8-20' || quizSelected.vibe === 'snooker') {
        targetId = 'country_house';
        targetTab = 'whole';
      } else if (quizSelected.people === '4-6') {
        if (quizSelected.vibe === 'japanese') {
          targetId = 'jp_connect';
          targetTab = 'japanese';
        } else {
          targetId = 'family_house';
          targetTab = 'riverside';
        }
      } else {
        // 2 people
        if (quizSelected.vibe === 'japanese') {
          targetId = 'jp_king';
          targetTab = 'japanese';
        } else {
          targetId = 'lake_view';
          targetTab = 'riverside';
        }
      }

      // Filter, scroll, then make the matched room unmistakable (pulsing glow + "matched" badge)
      filterRooms('all');
      const targetCard = document.getElementById(`card_${targetId}`);
      if (targetCard) {
        clearRoomSpotlight();
        try { window.a11yAnnounce('ห้องที่เหมาะกับคุณ: ' + ((targetCard.querySelector('.room-title') || {}).textContent || targetId).trim()); } catch (e) {}
        const guests = SITE_ROOM_FINDER.guestsOptions || DEFAULT_ROOM_FINDER_DATA.guestsOptions;
        const vibes = SITE_ROOM_FINDER.vibeOptions || DEFAULT_ROOM_FINDER_DATA.vibeOptions;
        const g = guests.find(o => o.value === quizSelected.people);
        const v = vibes.find(o => o.value === quizSelected.vibe);
        const picked = [g && g.title, v && v.title].filter(Boolean).join(' · ');

        targetCard.classList.add('room-spotlight');
        const badge = document.createElement('div');
        badge.className = 'spotlight-badge';
        badge.innerHTML = `<b>✨ ตรงใจคุณที่สุด</b>${picked ? `<small>${picked}</small>` : ''}`;
        targetCard.appendChild(badge);

        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('🎯 พบห้องพักที่เหมาะกับคุณที่สุดแล้ว!');
      }
    }

    function clearRoomSpotlight() {
      document.querySelectorAll('.room-card.room-spotlight').forEach(c => c.classList.remove('room-spotlight'));
      document.querySelectorAll('.spotlight-badge').forEach(b => b.remove());
    }

    function renderRoomFinder() {
      const container = document.getElementById('roomFinderContainer');
      if (!container) return;

      const adminBtnHtml = isAdminMode ? `
        <div class="text-center pt-2">
          <button onclick="openRoomFinderEditModal()" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-md inline-flex items-center gap-1.5 transition-transform active:scale-95">
            <i class="fa-solid fa-pen"></i> แก้ไขตัวช่วยเลือกห้องพัก (Interactive Finder)
          </button>
        </div>
      ` : '';

      const guests = SITE_ROOM_FINDER.guestsOptions || DEFAULT_ROOM_FINDER_DATA.guestsOptions;
      const vibes = SITE_ROOM_FINDER.vibeOptions || DEFAULT_ROOM_FINDER_DATA.vibeOptions;

      const guestsHtml = guests.map(opt => {
        const isSelected = quizSelected.people === opt.value;
        const activeClasses = isSelected ? 'border-zen-torii bg-zen-sand font-bold active-opt' : 'bg-white';
        return `
          <button type="button" onclick="selectQuiz('people', '${opt.value}', this)" class="quiz-btn-people flex flex-col items-center justify-center p-2 sm:py-2.5 sm:px-3 rounded-2xl border border-zen-cardborder text-zen-dark hover:border-zen-torii transition-all active:scale-95 text-center min-h-[58px] sm:min-h-[62px] ${activeClasses}">
            <span class="text-base sm:text-lg mb-0.5">${opt.icon}</span>
            <span class="font-medium text-[11px] sm:text-xs leading-tight">${opt.title}</span>
            <span class="text-[9px] text-zen-muted font-light mt-0.5">${opt.sub}</span>
          </button>
        `;
      }).join('');

      const vibeHtml = vibes.map(opt => {
        const isSelected = quizSelected.vibe === opt.value;
        const activeClasses = isSelected ? 'border-zen-torii bg-zen-sand font-bold active-opt' : 'bg-white';
        return `
          <button type="button" onclick="selectQuiz('vibe', '${opt.value}', this)" class="quiz-btn-vibe flex flex-col items-center justify-center p-2 sm:py-2.5 sm:px-3 rounded-2xl border border-zen-cardborder text-zen-dark hover:border-zen-torii transition-all active:scale-95 text-center min-h-[58px] sm:min-h-[62px] ${activeClasses}">
            <span class="text-base sm:text-lg mb-0.5">${opt.icon}</span>
            <span class="font-medium text-[11px] sm:text-xs leading-tight">${opt.title}</span>
            <span class="text-[9px] text-zen-muted font-light mt-0.5">${opt.sub}</span>
          </button>
        `;
      }).join('');

      container.innerHTML = `
        <div class="text-center space-y-1.5">
          <div class="mascot-chat">
            <span class="mc-av"><img src="mascot-cream-head.webp" alt="" width="256" height="256" loading="lazy" decoding="async"></span>
            <div class="mc-msg"><b>น้องผาย</b><span>ไม่รู้จะเลือกห้องไหนดี? ตอบ 3 ข้อสั้นๆ เดี๋ยวน้องช่วยเลือกให้ค่ะ 💙</span></div>
          </div>
          <span class="text-zen-torii text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
            <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> ${SITE_ROOM_FINDER.badge || 'Interactive Room Finder'}
          </span>
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-zen-dark">
            ${SITE_ROOM_FINDER.title}
          </h2>
          <p class="text-xs sm:text-sm text-zen-muted font-light">
            ${SITE_ROOM_FINDER.subtitle}
          </p>
          ${adminBtnHtml}
        </div>

        <div class="space-y-4 pt-2">
          <!-- Step 1: People -->
          <div>
            <label class="block text-xs font-semibold text-zen-dark mb-2">${SITE_ROOM_FINDER.step1Label || '1. จำนวนผู้เข้าพักของคุณ:'}</label>
            <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
              ${guestsHtml}
            </div>
          </div>

          <!-- Step 2: Vibe -->
          <div>
            <label class="block text-xs font-semibold text-zen-dark mb-2">${SITE_ROOM_FINDER.step2Label || '2. สไตล์บรรยากาศที่ชอบ:'}</label>
            <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
              ${vibeHtml}
            </div>
          </div>
        </div>

        <div class="pt-2 text-center">
          <button onclick="runSmartMatch()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zen-dark hover:bg-zen-forest text-white font-medium text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-md active:scale-98 transition-all min-h-[46px]">
            <i class="fa-solid fa-magnifying-glass text-amber-400"></i>
            <span>${SITE_ROOM_FINDER.buttonText || 'ค้นหาห้องพักที่ตรงใจที่สุด'}</span>
          </button>
        </div>
      `;
    }

    function openRoomFinderEditModal() {
      const rf = SITE_ROOM_FINDER || DEFAULT_ROOM_FINDER_DATA;
      const g = rf.guestsOptions || DEFAULT_ROOM_FINDER_DATA.guestsOptions;
      const v = rf.vibeOptions || DEFAULT_ROOM_FINDER_DATA.vibeOptions;

      document.getElementById('editFinderBadge').value = rf.badge || '';
      document.getElementById('editFinderTitle').value = rf.title || '';
      document.getElementById('editFinderSubtitle').value = rf.subtitle || '';
      document.getElementById('editFinderStep1Label').value = rf.step1Label || '';
      
      document.getElementById('editFinderG1Icon').value = g[0]?.icon || '👥';
      document.getElementById('editFinderG1Title').value = g[0]?.title || '2 ท่าน';
      document.getElementById('editFinderG1Sub').value = g[0]?.sub || 'คู่รัก / เพื่อน';

      document.getElementById('editFinderG2Icon').value = g[1]?.icon || '👨‍👩‍👧‍👦';
      document.getElementById('editFinderG2Title').value = g[1]?.title || '4 - 6 ท่าน';
      document.getElementById('editFinderG2Sub').value = g[1]?.sub || 'ครอบครัว';

      document.getElementById('editFinderG3Icon').value = g[2]?.icon || '🏡';
      document.getElementById('editFinderG3Title').value = g[2]?.title || '8 - 20 ท่าน';
      document.getElementById('editFinderG3Sub').value = g[2]?.sub || 'กลุ่มใหญ่';

      document.getElementById('editFinderStep2Label').value = rf.step2Label || '';

      document.getElementById('editFinderV1Icon').value = v[0]?.icon || '🌊';
      document.getElementById('editFinderV1Title').value = v[0]?.title || 'ติดริมน้ำ';
      document.getElementById('editFinderV1Sub').value = v[0]?.sub || 'ลมเย็นสบาย';

      document.getElementById('editFinderV2Icon').value = v[1]?.icon || '⛩️';
      document.getElementById('editFinderV2Title').value = v[1]?.title || 'บ้านญี่ปุ่น';
      document.getElementById('editFinderV2Sub').value = v[1]?.sub || 'ซุ้มโทริอิ';

      document.getElementById('editFinderV3Icon').value = v[2]?.icon || '🎱';
      document.getElementById('editFinderV3Title').value = v[2]?.title || 'สนุกเกอร์';
      document.getElementById('editFinderV3Sub').value = v[2]?.sub || 'ปาร์ตี้ส่วนตัว';

      document.getElementById('editFinderButtonText').value = rf.buttonText || 'ค้นหาห้องพักที่ตรงใจที่สุด';

      const modal = document.getElementById('editRoomFinderModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeRoomFinderEditModal() {
      const modal = document.getElementById('editRoomFinderModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveRoomFinderEdit(isDirectPublish = false) {
      const badge = document.getElementById('editFinderBadge').value.trim() || 'Interactive Room Finder';
      const title = document.getElementById('editFinderTitle').value.trim() || 'ไม่แน่ใจว่าจะพักห้องไหนดี? ให้เราช่วยแนะนำใน 3 คลิก!';
      const subtitle = document.getElementById('editFinderSubtitle').value.trim();
      const step1Label = document.getElementById('editFinderStep1Label').value.trim() || '1. จำนวนผู้เข้าพักของคุณ:';
      const step2Label = document.getElementById('editFinderStep2Label').value.trim() || '2. สไตล์บรรยากาศที่ชอบ:';
      const buttonText = document.getElementById('editFinderButtonText').value.trim() || 'ค้นหาห้องพักที่ตรงใจที่สุด';

      SITE_ROOM_FINDER = {
        badge,
        title,
        subtitle,
        step1Label,
        guestsOptions: [
          {
            value: "2",
            icon: document.getElementById('editFinderG1Icon').value.trim() || '👥',
            title: document.getElementById('editFinderG1Title').value.trim() || '2 ท่าน',
            sub: document.getElementById('editFinderG1Sub').value.trim() || 'คู่รัก / เพื่อน'
          },
          {
            value: "4-6",
            icon: document.getElementById('editFinderG2Icon').value.trim() || '👨‍👩‍👧‍👦',
            title: document.getElementById('editFinderG2Title').value.trim() || '4 - 6 ท่าน',
            sub: document.getElementById('editFinderG2Sub').value.trim() || 'ครอบครัว'
          },
          {
            value: "8-20",
            icon: document.getElementById('editFinderG3Icon').value.trim() || '🏡',
            title: document.getElementById('editFinderG3Title').value.trim() || '8 - 20 ท่าน',
            sub: document.getElementById('editFinderG3Sub').value.trim() || 'กลุ่มใหญ่'
          }
        ],
        step2Label,
        vibeOptions: [
          {
            value: "riverside",
            icon: document.getElementById('editFinderV1Icon').value.trim() || '🌊',
            title: document.getElementById('editFinderV1Title').value.trim() || 'ติดริมน้ำ',
            sub: document.getElementById('editFinderV1Sub').value.trim() || 'ลมเย็นสบาย'
          },
          {
            value: "japanese",
            icon: document.getElementById('editFinderV2Icon').value.trim() || '⛩️',
            title: document.getElementById('editFinderV2Title').value.trim() || 'บ้านญี่ปุ่น',
            sub: document.getElementById('editFinderV2Sub').value.trim() || 'ซุ้มโทริอิ'
          },
          {
            value: "snooker",
            icon: document.getElementById('editFinderV3Icon').value.trim() || '🎱',
            title: document.getElementById('editFinderV3Title').value.trim() || 'สนุกเกอร์',
            sub: document.getElementById('editFinderV3Sub').value.trim() || 'ปาร์ตี้ส่วนตัว'
          }
        ],
        buttonText
      };

      try {
        localStorage.setItem('baantaphai_room_finder_v3', JSON.stringify(SITE_ROOM_FINDER));
      } catch (e) {}

      renderRoomFinder();
      closeRoomFinderEditModal();
      handleSectionSave('roomFinder', 'แก้ไขตัวช่วยเลือกห้องพัก', isDirectPublish);
    }

    // 7. OMIKUJI & AUTHENTIC JAPANESE SHRINE FORTUNE SYSTEM
    var OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES;

    function getOmikujiBadgeClasses(color) {
      switch (color) {
        case 'amber':
          return { badge: 'bg-amber-100 text-amber-800 border-amber-200', rate: 'text-amber-600 bg-amber-50 border-amber-200' };
        case 'orange':
          return { badge: 'bg-orange-100 text-orange-800 border-orange-200', rate: 'text-orange-600 bg-orange-50 border-orange-200' };
        case 'emerald':
          return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', rate: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
        case 'rose':
          return { badge: 'bg-rose-100 text-rose-800 border-rose-200', rate: 'text-rose-600 bg-rose-50 border-rose-200' };
        case 'teal':
          return { badge: 'bg-teal-100 text-teal-800 border-teal-200', rate: 'text-teal-700 bg-teal-50 border-teal-200' };
        case 'sky':
          return { badge: 'bg-sky-100 text-sky-800 border-sky-200', rate: 'text-sky-700 bg-sky-50 border-sky-200' };
        case 'purple':
          return { badge: 'bg-purple-100 text-purple-800 border-purple-200', rate: 'text-purple-700 bg-purple-50 border-purple-200' };
        case 'stone':
        default:
          return { badge: 'bg-stone-200 text-stone-700 border-stone-300', rate: 'text-stone-500 bg-stone-100 border-stone-200' };
      }
    }

    // Multi-layer Storage & Lock Mechanism (Survives Refresh, Tab closing, Session changes, partial data clearing)
    // Layers: localStorage + sessionStorage (full record), cookie (compact: a full record is >4KB and browsers drop it
    // silently), IndexedDB (compact + full). Any single surviving layer re-locks the device and heals the others.
    const OMIKUJI_LOCK_KEY = 'baantaphai_omikuji_v3';
    let omikujiIdbRecord = null; // filled asynchronously from IndexedDB at startup

    function omikujiCompact(d) {
      return { id: d.id, ticketNo: d.ticketNo, playedAt: d.playedAt, title: d.title, compact: 1 };
    }
    function omikujiExpand(c) {
      if (!c || !c.compact) return c;
      const list = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length) ? SITE_OMIKUJI_PRIZES : DEFAULT_OMIKUJI_PRIZES;
      const p = list.find(x => x.id === c.id) || DEFAULT_OMIKUJI_PRIZES.find(x => x.id === c.id);
      if (p) return { ...p, ticketNo: c.ticketNo, playedAt: c.playedAt };
      const { compact, ...rest } = c; // prize was edited/removed since: keep what we know, the device stays locked
      return rest;
    }
    function omikujiIdb() {
      return new Promise((resolve, reject) => {
        try {
          const req = indexedDB.open('baantaphai_lock', 1);
          req.onupgradeneeded = () => req.result.createObjectStore('kv');
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        } catch (e) { reject(e); }
      });
    }
    function omikujiIdbSet(val) {
      return omikujiIdb().then(db => new Promise(res => {
        const tx = db.transaction('kv', 'readwrite');
        if (val === null) tx.objectStore('kv').delete(OMIKUJI_LOCK_KEY); else tx.objectStore('kv').put(val, OMIKUJI_LOCK_KEY);
        tx.oncomplete = () => { db.close(); res(true); };
        tx.onerror = tx.onabort = () => { db.close(); res(false); };
      })).catch(() => false);
    }
    function omikujiIdbGet() {
      return omikujiIdb().then(db => new Promise(res => {
        const rq = db.transaction('kv').objectStore('kv').get(OMIKUJI_LOCK_KEY);
        rq.onsuccess = () => { db.close(); res(rq.result || null); };
        rq.onerror = () => { db.close(); res(null); };
      })).catch(() => null);
    }
    function omikujiWriteSyncLayers(data) {
      const json = JSON.stringify(data);
      try { localStorage.setItem(OMIKUJI_LOCK_KEY, json); } catch (e) {}
      try { sessionStorage.setItem(OMIKUJI_LOCK_KEY, json); } catch (e) {}
      try {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 2); // 2 years persistence
        document.cookie = `${OMIKUJI_LOCK_KEY}=${encodeURIComponent(JSON.stringify(omikujiCompact(data)))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      } catch (e) {}
    }

    function getSavedOmikuji() {
      let found = null;
      try {
        const local = localStorage.getItem(OMIKUJI_LOCK_KEY);
        if (local) found = JSON.parse(local);
      } catch (e) {}
      if (!found) {
        try {
          const sess = sessionStorage.getItem(OMIKUJI_LOCK_KEY);
          if (sess) found = JSON.parse(sess);
        } catch (e) {}
      }
      if (!found) {
        try {
          const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + OMIKUJI_LOCK_KEY + '=([^;]+)'));
          if (match && match[1]) found = JSON.parse(decodeURIComponent(match[1]));
        } catch (e) {}
      }
      if (!found && omikujiIdbRecord) found = omikujiIdbRecord;
      if (!found) return null;
      found = omikujiExpand(found);
      // heal: if only one layer survived, restore the others so the lock keeps holding
      try { if (!localStorage.getItem(OMIKUJI_LOCK_KEY)) omikujiWriteSyncLayers(found); } catch (e) {}
      return found;
    }

    function saveOmikujiRecord(data) {
      omikujiWriteSyncLayers(data);
      omikujiIdbSet({ ...data, savedFull: 1 });
    }

    // Run once at startup: bring the IndexedDB copy back into the lock (and back it up if it was missing)
    function initOmikujiLock() {
      return omikujiIdbGet().then(rec => {
        if (rec) {
          omikujiIdbRecord = omikujiExpand(rec.savedFull ? (({ savedFull, ...r }) => r)(rec) : rec);
          if (!localStorage.getItem(OMIKUJI_LOCK_KEY)) omikujiWriteSyncLayers(omikujiIdbRecord);
        } else {
          const cur = getSavedOmikuji();
          if (cur) omikujiIdbSet({ ...cur, savedFull: 1 });
        }
        try { if (getSavedOmikuji()) { renderOmikujiState(); if (typeof initOmikujiDeviceCheck === 'function') initOmikujiDeviceCheck(); } } catch (e) {}
      });
    }

    function openFortuneModal() {
      document.getElementById('fortuneModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      switchFortuneTab('omikuji');
      renderOmikujiModal();
      renderOmikujiState();

      if (typeof window.trackMetaEvent === 'function') {
        window.trackMetaEvent('DrawOmikujiFortune', {
          content_name: 'Omikuji Digital Fortune & Voucher',
          content_category: 'Gamification'
        }, true);
      }
    }

    function closeFortuneModal() {
      document.getElementById('fortuneModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function switchFortuneTab(tab) {
      const omikujiSec = document.getElementById('fortuneGameSection');
      const oddsSec = document.getElementById('fortuneOddsSection');
      const tabOmikujiBtn = document.getElementById('tabOmikujiBtn');
      const tabOddsBtn = document.getElementById('tabOddsBtn');

      if (tab === 'odds') {
        omikujiSec.classList.add('hidden');
        oddsSec.classList.remove('hidden');
        tabOddsBtn.classList.add('bg-white', 'text-zen-dark', 'shadow-xs');
        tabOddsBtn.classList.remove('text-stone-500');
        tabOmikujiBtn.classList.remove('bg-white', 'text-zen-dark', 'shadow-xs');
        tabOmikujiBtn.classList.add('text-stone-500');
      } else {
        oddsSec.classList.add('hidden');
        omikujiSec.classList.remove('hidden');
        tabOmikujiBtn.classList.add('bg-white', 'text-zen-dark', 'shadow-xs');
        tabOmikujiBtn.classList.remove('text-stone-500');
        tabOddsBtn.classList.remove('bg-white', 'text-zen-dark', 'shadow-xs');
        tabOddsBtn.classList.add('text-stone-500');
      }
    }

    function renderOmikujiState() {
      const saved = getSavedOmikuji();
      const omikujiBox = document.getElementById('omikujiBox');
      const shakeBtn = document.getElementById('shakeBtn');
      const fortuneResult = document.getElementById('fortuneResult');
      const claimLineBtn = document.getElementById('claimLineBtn');
      const alreadyPlayedNotice = document.getElementById('alreadyPlayedNotice');
      const playedTimestamp = document.getElementById('playedTimestamp');

      if (saved) {
        // Locked: already played on this device
        omikujiBox.classList.add('hidden');
        shakeBtn.classList.add('hidden');
        alreadyPlayedNotice.classList.remove('hidden');
        if (playedTimestamp) playedTimestamp.textContent = saved.playedAt ? 'บันทึกเมื่อ: ' + saved.playedAt : '';

        displayOmikujiResult(saved);
      } else {
        // Ready to shake
        omikujiBox.classList.remove('hidden');
        shakeBtn.classList.remove('hidden');
        shakeBtn.disabled = false;
        shakeBtn.innerHTML = '<span>🎋</span><span>เขย่ากระบอกเซียมซี (1 สิทธิ์)</span>';
        alreadyPlayedNotice.classList.add('hidden');
        fortuneResult.classList.add('hidden');
        claimLineBtn.classList.add('hidden');
        const claimMessengerBtn = document.getElementById('claimMessengerBtn');
        if (claimMessengerBtn) claimMessengerBtn.classList.add('hidden');
      }
    }

    function shakeOmikuji() {
      // 1. Guard against re-spinning
      const existing = getSavedOmikuji();
      if (existing) {
        showToast('🔒 อุปกรณ์นี้ได้ใช้สิทธิ์เสี่ยงเซียมซีไปแล้วครับ');
        renderOmikujiState();
        return;
      }

      const prizes = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length > 0) ? SITE_OMIKUJI_PRIZES : DEFAULT_OMIKUJI_PRIZES;
      const totalRate = prizes.reduce((sum, p) => sum + (Number(p.rate) || 0), 0) || 100;

      // 2. Pick prize immediately and lock storage synchronously at 0ms (Survives immediate refresh/tab close!)
      const rand = Math.random() * totalRate;
      let cumulative = 0;
      let prize = prizes[prizes.length - 1]; // fallback

      for (let i = 0; i < prizes.length; i++) {
        cumulative += (Number(prizes[i].rate) || 0);
        if (rand < cumulative) {
          prize = prizes[i];
          break;
        }
      }

      const ticketNo = 'TP-' + Math.floor(100000 + Math.random() * 900000);
      const now = new Date();
      const timeStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      const resultData = { ...prize, ticketNo, playedAt: timeStr };

      // Write lock immediately before starting animation!
      saveOmikujiRecord(resultData);

      // 3. Play visual bamboo shake animation
      const box = document.getElementById('cylinderGraphic');
      const shakeBtn = document.getElementById('shakeBtn');
      if (box) box.classList.add('shake-anim');
      if (shakeBtn) {
        shakeBtn.disabled = true;
        shakeBtn.innerHTML = '<span>🎋</span><span>กำลังเขย่าเซียมซี...</span>';
      }

      setTimeout(() => {
        if (box) box.classList.remove('shake-anim');
        const boxContainer = document.getElementById('omikujiBox');
        if (boxContainer) boxContainer.classList.add('hidden');
        if (shakeBtn) shakeBtn.classList.add('hidden');

        displayOmikujiResult(resultData);

        if (prize.type !== 'none') {
          showToast('🎉 ยินดีด้วย! ' + prize.title);
        } else {
          showToast('🌿 ได้รับคำทำนายมงคล: ' + (prize.levelName || 'จิตสงบสุข'));
        }
      }, 1200);
    }

    function displayOmikujiResult(data) {
      const fortuneResult = document.getElementById('fortuneResult');
      const resultFortuneLevel = document.getElementById('resultFortuneLevel');
      const fortunePoem = document.getElementById('fortunePoem');
      const prophecyDestiny = document.getElementById('prophecyDestiny');
      const prophecyWish = document.getElementById('prophecyWish');
      const prophecyTravel = document.getElementById('prophecyTravel');
      const prizeSection = document.getElementById('prizeSection');
      const noPrizeSection = document.getElementById('noPrizeSection');
      const claimLineBtn = document.getElementById('claimLineBtn');

      fortuneResult.classList.remove('hidden');
      resultFortuneLevel.textContent = data.fortune;
      fortunePoem.textContent = data.poem;

      if (data.prophecy) {
        prophecyDestiny.textContent = data.prophecy.destiny;
        prophecyWish.textContent = data.prophecy.wish;
        prophecyTravel.textContent = data.prophecy.travel;
      }

      const prophecyEasyMeaning = document.getElementById('prophecyEasyMeaning');
      if (prophecyEasyMeaning) {
        prophecyEasyMeaning.textContent = data.easyMeaning || (data.prophecy ? data.prophecy.destiny : '-');
      }

      if (data.type !== 'none') {
        prizeSection.classList.remove('hidden');
        noPrizeSection.classList.add('hidden');

        document.getElementById('resultPrizeTitle').textContent = data.title;
        document.getElementById('resultTicketNo').textContent = data.ticketNo || 'TP-VERIFIED';
        document.getElementById('resultDiscountTag').textContent = data.discountTag;
        document.getElementById('resultCondition').textContent = data.condition ? (data.condition.startsWith('*') ? data.condition : '*เงื่อนไข: ' + data.condition) : '';

        claimLineBtn.classList.remove('hidden');
        const encodedText = encodeURIComponent(
          `สวัสดีครับ/ค่ะ สุ่มได้เซียมซีบ้านตาผาย "${data.title}" (เลขอ้างอิงดิจิทัล: ${data.ticketNo || 'TP-VERIFIED'})\nขอแจ้งรับสิทธิ์เพื่อจองห้องพัก/ใช้บริการครับ`
        );
        claimLineBtn.href = `https://line.me/R/ti/p/@baantaphairesort?text=${encodedText}`;
        document.getElementById('claimLineBtnText').textContent = 'แจ้งรับสิทธิ์ทาง LINE Official';

        const claimMessengerBtn = document.getElementById('claimMessengerBtn');
        if (claimMessengerBtn) {
          claimMessengerBtn.classList.remove('hidden');
          claimMessengerBtn.href = 'https://m.me/Baantaphai';
        }
      } else {
        prizeSection.classList.add('hidden');
        noPrizeSection.classList.remove('hidden');
        claimLineBtn.classList.add('hidden');
        const claimMessengerBtn = document.getElementById('claimMessengerBtn');
        if (claimMessengerBtn) claimMessengerBtn.classList.add('hidden');
      }
    }

    // Secret Staff / Developer Reset (Tap ⛩️ 5 times within 3 seconds)
    let toriiTapCount = 0;
    let toriiTapTimer = null;
    function handleSecretToriiTap() {
      toriiTapCount++;
      clearTimeout(toriiTapTimer);
      toriiTapTimer = setTimeout(() => { toriiTapCount = 0; }, 3000);
      if (toriiTapCount >= 5) {
        toriiTapCount = 0;
        const pin = prompt('⚙️ โหมดเจ้าหน้าที่: ป้อนรหัสแอดมินเพื่อรีเซ็ตสิทธิ์เซียมซีของเครื่องนี้');
        if (pin) {
          verifyAdminPassphrase(pin.trim()).then(r => {
            if (r.ok) adminResetOmikuji();
            else showToast(adminLoginErrorText(r));
          });
        }
      }
    }

    function adminResetOmikuji() {
      try {
        localStorage.removeItem('baantaphai_omikuji_v3');
        localStorage.removeItem('baantaphai_omikuji_v2');
        localStorage.removeItem('baantaphai_omikuji_result');
        sessionStorage.removeItem('baantaphai_omikuji_v3');
        document.cookie = 'baantaphai_omikuji_v3=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } catch (e) {}
      omikujiIdbRecord = null;
      omikujiIdbSet(null);
      renderOmikujiState();
      showToast('🔄 รีเซ็ตสิทธิ์เซียมซีเรียบร้อย สามารถทดสอบเขย่าใหม่ได้ครับ');
    }
    window.adminResetOmikuji = adminResetOmikuji;

    // ==========================================
    // 🎋 OMIKUJI & FORTUNE SYSTEM CONTROLLER
    // ==========================================
    function renderOmikujiModal() {
      const hTitle = document.getElementById('omikujiHeaderTitle');
      const hSub = document.getElementById('omikujiHeaderSubtitle');
      const hBadge = document.getElementById('omikujiHeaderBadge');
      const tabGame = document.getElementById('tabOmikujiBtnText');
      const tabOdds = document.getElementById('tabOddsBtnText');
      const oddsTitle = document.getElementById('omikujiOddsTitle');
      const oddsDesc = document.getElementById('omikujiOddsDesc');
      const adminHeaderTriggers = document.getElementById('omikujiAdminHeaderTriggers');
      const oddsAdminTrigger = document.getElementById('omikujiOddsAdminTrigger');

      const headerData = SITE_OMIKUJI_HEADER || DEFAULT_OMIKUJI_HEADER;
      if (hTitle) hTitle.textContent = headerData.title || DEFAULT_OMIKUJI_HEADER.title;
      if (hSub) hSub.textContent = headerData.subtitle || DEFAULT_OMIKUJI_HEADER.subtitle;
      if (hBadge) hBadge.textContent = headerData.badge || DEFAULT_OMIKUJI_HEADER.badge;
      if (tabGame) tabGame.textContent = headerData.tabGameText || DEFAULT_OMIKUJI_HEADER.tabGameText;
      if (tabOdds) tabOdds.textContent = headerData.tabOddsText || DEFAULT_OMIKUJI_HEADER.tabOddsText;
      if (oddsTitle) oddsTitle.textContent = headerData.oddsTitle || DEFAULT_OMIKUJI_HEADER.oddsTitle;
      if (oddsDesc) oddsDesc.textContent = headerData.oddsDesc || DEFAULT_OMIKUJI_HEADER.oddsDesc;

      if (adminHeaderTriggers) {
        if (isAdminMode) adminHeaderTriggers.classList.remove('hidden');
        else adminHeaderTriggers.classList.add('hidden');
      }
      if (oddsAdminTrigger) {
        if (isAdminMode) oddsAdminTrigger.classList.remove('hidden');
        else oddsAdminTrigger.classList.add('hidden');
      }

      // Render Odds List in TAB 2
      const listContainer = document.getElementById('fortuneOddsListContainer');
      const rateBadge = document.getElementById('omikujiOddsTotalRateBadge');
      const summaryRateText = document.getElementById('omikujiOddsSummaryRateText');

      const prizes = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length > 0) ? SITE_OMIKUJI_PRIZES : DEFAULT_OMIKUJI_PRIZES;
      const totalRate = prizes.reduce((s, p) => s + (Number(p.rate) || 0), 0);

      if (rateBadge) {
        rateBadge.textContent = `รวม ${totalRate}%`;
        if (totalRate === 100) {
          rateBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300';
        } else {
          rateBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300';
        }
      }

      if (summaryRateText) {
        if (totalRate === 100) {
          summaryRateText.className = 'text-emerald-700 font-bold';
          summaryRateText.textContent = '100% (โปร่งใสตรวจสอบได้)';
        } else {
          summaryRateText.className = 'text-amber-800 font-bold';
          summaryRateText.textContent = `${totalRate}% (แนะนำปรับให้รวมได้ 100%)`;
        }
      }

      if (listContainer) {
        listContainer.innerHTML = '';
        prizes.forEach(item => {
          const styling = getOmikujiBadgeClasses(item.badgeColor);
          const rowEl = document.createElement('div');
          rowEl.className = 'p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2 hover:border-amber-300 transition-colors';

          const editBtnHtml = isAdminMode ? `
            <button onclick="openOmikujiTierEditModal('${item.id}')" class="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-[10px] shadow-2xs transition-transform active:scale-95 flex items-center gap-1 shrink-0 ml-1.5" title="แก้ไขรางวัลนี้">
              <i class="fa-solid fa-pen text-[9px]"></i> แก้ไข
            </button>
          ` : '';

          rowEl.innerHTML = `
            <div class="space-y-0.5 min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded border ${styling.badge}">${item.kanji || '吉'}</span>
                <span class="font-medium text-stone-800 text-xs">${item.title || ''}</span>
              </div>
              <p class="text-[10px] text-stone-500 font-light truncate">${item.condition || ''}</p>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-xs font-bold px-2 py-1 rounded-lg border ${styling.rate}">${item.rate || 0}%</span>
              ${editBtnHtml}
            </div>
          `;
          listContainer.appendChild(rowEl);
        });
      }
    }

    function openOmikujiManagerModal() {
      renderManageOmikujiTiersList();
      const m = document.getElementById('manageOmikujiModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeOmikujiManagerModal() {
      const m = document.getElementById('manageOmikujiModal');
      if (m) {
        m.classList.add('hidden');
        if (!document.getElementById('fortuneModal') || document.getElementById('fortuneModal').classList.contains('hidden')) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function renderManageOmikujiTiersList() {
      const container = document.getElementById('manageOmikujiTiersContainer');
      const countBadge = document.getElementById('manageOmikujiCountBadge');
      const rateAlert = document.getElementById('manageOmikujiRateAlert');
      if (!container) return;
      container.innerHTML = '';

      const prizes = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length > 0) ? SITE_OMIKUJI_PRIZES : DEFAULT_OMIKUJI_PRIZES;
      if (countBadge) countBadge.textContent = `${prizes.length} รางวัล / ระดับ`;

      const totalRate = prizes.reduce((s, p) => s + (Number(p.rate) || 0), 0);
      if (rateAlert) {
        if (totalRate === 100) {
          rateAlert.className = 'px-4 py-2 border-b text-xs flex items-center justify-between gap-2 bg-emerald-50 text-emerald-900 border-emerald-200';
          rateAlert.innerHTML = `
            <div class="flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-circle-check text-emerald-600"></i>
              <span>ผลรวมอัตราออกรางวัลปัจจุบัน: <strong>100%</strong> (สมบูรณ์ตามมาตรฐาน)</span>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">พร้อมใช้งาน</span>
          `;
        } else {
          rateAlert.className = 'px-4 py-2 border-b text-xs flex items-center justify-between gap-2 bg-amber-50 text-amber-950 border-amber-200';
          rateAlert.innerHTML = `
            <div class="flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-triangle-exclamation text-amber-600"></i>
              <span>ผลรวมอัตราออกรางวัลปัจจุบัน: <strong>${totalRate}%</strong> (แนะนำให้ปรับให้ครบ 100%)</span>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">ควรปรับเรท</span>
          `;
        }
      }

      if (prizes.length === 0) {
        container.innerHTML = `
          <div class="text-center py-8 text-stone-400">
            <p>ยังไม่มีรายการรางวัลเซียมซี</p>
            <button onclick="openOmikujiTierEditModal()" class="mt-2 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs shadow-sm">
              + เพิ่มรางวัลแรก
            </button>
          </div>
        `;
        return;
      }

      prizes.forEach((tier, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'p-3 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-colors flex items-center justify-between gap-3';

        const isFirst = idx === 0;
        const isLast = idx === prizes.length - 1;
        const styling = getOmikujiBadgeClasses(tier.badgeColor);

        itemEl.innerHTML = `
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <span class="w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs border ${styling.badge}">
              ${tier.kanji || '吉'}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h4 class="font-semibold text-stone-900 text-xs truncate">${idx + 1}. ${tier.title || ''}</h4>
                <span class="px-1.5 py-0.2 rounded-md ${styling.badge} text-[9px] font-bold">${tier.kanji} (${tier.levelName || ''})</span>
                <span class="px-1.5 py-0.2 rounded-md ${styling.rate} text-[10px] font-bold">${tier.rate || 0}%</span>
              </div>
              <p class="text-[11px] text-stone-500 truncate mt-0.5">${tier.condition || (tier.discountTag || '')}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button onclick="moveOmikujiTier(${idx}, -1)" ${isFirst ? 'disabled class="w-7 h-7 rounded-lg text-stone-300 cursor-not-allowed flex items-center justify-center text-xs"' : 'class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-2xs active:scale-95 transition-all" title="เลื่อนขึ้น"'} aria-label="Move Up">
              <i class="fa-solid fa-chevron-up"></i>
            </button>
            <button onclick="moveOmikujiTier(${idx}, 1)" ${isLast ? 'disabled class="w-7 h-7 rounded-lg text-stone-300 cursor-not-allowed flex items-center justify-center text-xs"' : 'class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-2xs active:scale-95 transition-all" title="เลื่อนลง"'} aria-label="Move Down">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
            <button onclick="openOmikujiTierEditModal('${tier.id}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-2xs transition-transform active:scale-95 flex items-center gap-1" title="แก้ไข">
              <i class="fa-solid fa-pen text-[10px]"></i> แก้ไข
            </button>
            <button onclick="deleteOmikujiTier('${tier.id}')" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center text-xs transition-colors" title="ลบรางวัลนี้" aria-label="Delete">
              <i class="fa-solid fa-trash-can text-[11px]"></i>
            </button>
          </div>
        `;
        container.appendChild(itemEl);
      });
    }

    function moveOmikujiTier(idx, direction) {
      let prizes = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length > 0) ? SITE_OMIKUJI_PRIZES : [...DEFAULT_OMIKUJI_PRIZES];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= prizes.length) return;

      const temp = prizes[idx];
      prizes[idx] = prizes[targetIdx];
      prizes[targetIdx] = temp;
      SITE_OMIKUJI_PRIZES = prizes;
      OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES;

      try {
        localStorage.setItem('baantaphai_omikuji_prizes_v3', JSON.stringify(SITE_OMIKUJI_PRIZES));
      } catch(e) {}

      renderManageOmikujiTiersList();
      renderOmikujiModal();
      handleSectionSave('omikuji', 'จัดเรียงลำดับเซียมซี');
    }

    // Omikuji Header Modal Functions
    function openOmikujiHeaderEditModal() {
      const header = SITE_OMIKUJI_HEADER || DEFAULT_OMIKUJI_HEADER;
      document.getElementById('editOmikujiTitle').value = header.title || DEFAULT_OMIKUJI_HEADER.title;
      document.getElementById('editOmikujiSubtitle').value = header.subtitle || DEFAULT_OMIKUJI_HEADER.subtitle;
      document.getElementById('editOmikujiBadge').value = header.badge || DEFAULT_OMIKUJI_HEADER.badge;
      document.getElementById('editOmikujiTabGameText').value = header.tabGameText || DEFAULT_OMIKUJI_HEADER.tabGameText;
      document.getElementById('editOmikujiTabOddsText').value = header.tabOddsText || DEFAULT_OMIKUJI_HEADER.tabOddsText;
      document.getElementById('editOmikujiOddsTitle').value = header.oddsTitle || DEFAULT_OMIKUJI_HEADER.oddsTitle;
      document.getElementById('editOmikujiOddsDesc').value = header.oddsDesc || DEFAULT_OMIKUJI_HEADER.oddsDesc;

      const m = document.getElementById('editOmikujiHeaderModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeOmikujiHeaderEditModal() {
      const m = document.getElementById('editOmikujiHeaderModal');
      if (m) {
        m.classList.add('hidden');
        if ((!document.getElementById('manageOmikujiModal') || document.getElementById('manageOmikujiModal').classList.contains('hidden')) &&
            (!document.getElementById('fortuneModal') || document.getElementById('fortuneModal').classList.contains('hidden'))) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function saveOmikujiHeaderEdit(isDirectPublish = false) {
      const title = document.getElementById('editOmikujiTitle').value.trim();
      const subtitle = document.getElementById('editOmikujiSubtitle').value.trim();
      const badge = document.getElementById('editOmikujiBadge').value.trim();
      const tabGame = document.getElementById('editOmikujiTabGameText').value.trim();
      const tabOdds = document.getElementById('editOmikujiTabOddsText').value.trim();
      const oddsTitle = document.getElementById('editOmikujiOddsTitle').value.trim();
      const oddsDesc = document.getElementById('editOmikujiOddsDesc').value.trim();

      SITE_OMIKUJI_HEADER = {
        title: title || DEFAULT_OMIKUJI_HEADER.title,
        subtitle: subtitle || DEFAULT_OMIKUJI_HEADER.subtitle,
        badge: badge || DEFAULT_OMIKUJI_HEADER.badge,
        tabGameText: tabGame || DEFAULT_OMIKUJI_HEADER.tabGameText,
        tabOddsText: tabOdds || DEFAULT_OMIKUJI_HEADER.tabOddsText,
        oddsTitle: oddsTitle || DEFAULT_OMIKUJI_HEADER.oddsTitle,
        oddsDesc: oddsDesc || DEFAULT_OMIKUJI_HEADER.oddsDesc
      };

      try {
        localStorage.setItem('baantaphai_omikuji_header_v3', JSON.stringify(SITE_OMIKUJI_HEADER));
      } catch(e) {}

      renderOmikujiModal();
      closeOmikujiHeaderEditModal();
      handleSectionSave('omikujiHeader', 'แก้ไขหัวข้อเซียมซีนำโชค', isDirectPublish);
    }

    // Omikuji Tier Edit Modal Functions
    function setOmikujiTierPresetKanji(kanji, levelName, color) {
      document.getElementById('editOmikujiTierKanji').value = kanji;
      document.getElementById('editOmikujiTierLevelName').value = levelName;
      document.getElementById('editOmikujiTierColor').value = color;
      const fortuneEl = document.getElementById('editOmikujiTierFortune');
      if (fortuneEl && (!fortuneEl.value || fortuneEl.value.includes('大吉') || fortuneEl.value.includes('中吉') || fortuneEl.value.includes('小吉') || fortuneEl.value.includes('末吉') || fortuneEl.value.includes('吉') || fortuneEl.value.includes('平'))) {
        fortuneEl.value = `✨ ${levelName} (${kanji})`;
      }
    }

    function openOmikujiTierEditModal(tierId) {
      const prizes = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length > 0) ? SITE_OMIKUJI_PRIZES : DEFAULT_OMIKUJI_PRIZES;
      const modalTitle = document.getElementById('editOmikujiTierModalTitle');
      const deleteBtn = document.getElementById('deleteOmikujiTierBtn');
      const totalRate = prizes.reduce((s, p) => s + (Number(p.rate) || 0), 0);

      if (tierId) {
        // Edit existing
        const tier = prizes.find(p => p.id === tierId);
        if (!tier) return;

        if (modalTitle) modalTitle.textContent = `แก้ไข: ${tier.title || tier.kanji}`;
        if (deleteBtn) deleteBtn.classList.remove('hidden');

        document.getElementById('editOmikujiTierId').value = tier.id;
        document.getElementById('editOmikujiTierKanji').value = tier.kanji || '大吉';
        document.getElementById('editOmikujiTierLevelName').value = tier.levelName || '';
        document.getElementById('editOmikujiTierColor').value = tier.badgeColor || 'amber';
        document.getElementById('editOmikujiTierFortune').value = tier.fortune || '';
        document.getElementById('editOmikujiTierTitle').value = tier.title || '';
        document.getElementById('editOmikujiTierType').value = tier.type || 'room';
        document.getElementById('editOmikujiTierDiscountTag').value = tier.discountTag || '';
        document.getElementById('editOmikujiTierRate').value = tier.rate || 0;
        document.getElementById('editOmikujiTierCondition').value = tier.condition || '';
        document.getElementById('editOmikujiTierPoem').value = tier.poem || '';

        const prop = tier.prophecy || {};
        document.getElementById('editOmikujiTierDestiny').value = prop.destiny || '';
        document.getElementById('editOmikujiTierWish').value = prop.wish || '';
        document.getElementById('editOmikujiTierTravel').value = prop.travel || '';
        document.getElementById('editOmikujiTierEasyMeaning').value = tier.easyMeaning || '';

        const remainingExcludingThis = totalRate - (Number(tier.rate) || 0);
        const hint = document.getElementById('editOmikujiTierRateHint');
        if (hint) hint.textContent = `เรทของรายการอื่นรวม: ${remainingExcludingThis}% (แนะนำให้ใส่ ${100 - remainingExcludingThis}% เพื่อให้ครบ 100%)`;
      } else {
        // Add new
        if (modalTitle) modalTitle.textContent = 'เพิ่มรางวัล / ระดับโชคเซียมซีใหม่';
        if (deleteBtn) deleteBtn.classList.add('hidden');

        document.getElementById('editOmikujiTierId').value = '';
        document.getElementById('editOmikujiTierKanji').value = '大吉';
        document.getElementById('editOmikujiTierLevelName').value = 'มหาโชค';
        document.getElementById('editOmikujiTierColor').value = 'amber';
        document.getElementById('editOmikujiTierFortune').value = '✨ มหาโชค (大吉 - Daikichi)';
        document.getElementById('editOmikujiTierTitle').value = '';
        document.getElementById('editOmikujiTierType').value = 'room';
        document.getElementById('editOmikujiTierDiscountTag').value = '';
        const suggestedRate = Math.max(0, 100 - totalRate);
        document.getElementById('editOmikujiTierRate').value = suggestedRate;
        document.getElementById('editOmikujiTierCondition').value = 'ลดค่าห้องพักทุกประเภท เมื่อจองตรงผ่าน LINE Official';
        document.getElementById('editOmikujiTierPoem').value = '';
        document.getElementById('editOmikujiTierDestiny').value = '';
        document.getElementById('editOmikujiTierWish').value = '';
        document.getElementById('editOmikujiTierTravel').value = '';
        document.getElementById('editOmikujiTierEasyMeaning').value = '';

        const hint = document.getElementById('editOmikujiTierRateHint');
        if (hint) hint.textContent = `เรทปัจจุบันรวม: ${totalRate}% (แนะนำใส่: ${suggestedRate}% เพื่อให้ครบ 100%)`;
      }

      const m = document.getElementById('editOmikujiTierModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeOmikujiTierEditModal() {
      const m = document.getElementById('editOmikujiTierModal');
      if (m) {
        m.classList.add('hidden');
        if ((!document.getElementById('manageOmikujiModal') || document.getElementById('manageOmikujiModal').classList.contains('hidden')) &&
            (!document.getElementById('fortuneModal') || document.getElementById('fortuneModal').classList.contains('hidden'))) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function saveOmikujiTierEdit(isDirectPublish = false) {
      const tierId = document.getElementById('editOmikujiTierId').value;
      const kanji = document.getElementById('editOmikujiTierKanji').value.trim() || '吉';
      const levelName = document.getElementById('editOmikujiTierLevelName').value.trim() || 'โชคดี';
      const badgeColor = document.getElementById('editOmikujiTierColor').value;
      const fortune = document.getElementById('editOmikujiTierFortune').value.trim() || `✨ ${levelName} (${kanji})`;
      const title = document.getElementById('editOmikujiTierTitle').value.trim();
      const type = document.getElementById('editOmikujiTierType').value;
      const discountTag = document.getElementById('editOmikujiTierDiscountTag').value.trim();
      const rate = Number(document.getElementById('editOmikujiTierRate').value) || 0;
      const condition = document.getElementById('editOmikujiTierCondition').value.trim();
      const poem = document.getElementById('editOmikujiTierPoem').value.trim();
      const destiny = document.getElementById('editOmikujiTierDestiny').value.trim();
      const wish = document.getElementById('editOmikujiTierWish').value.trim();
      const travel = document.getElementById('editOmikujiTierTravel').value.trim();
      const easyMeaning = document.getElementById('editOmikujiTierEasyMeaning').value.trim();

      if (!title) {
        alert('กรุณาระบุชื่อรางวัล / สิทธิพิเศษ');
        return;
      }

      let prizes = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length > 0) ? [...SITE_OMIKUJI_PRIZES] : [...DEFAULT_OMIKUJI_PRIZES];

      const tierObj = {
        id: tierId || ('tier_' + Date.now()),
        kanji,
        levelName,
        badgeColor,
        fortune,
        title,
        type,
        discountTag: discountTag || (type === 'none' ? 'ดวงสงบสุข' : 'รับสิทธิ์ฟรี'),
        rate,
        condition,
        poem: poem || '“ดั่งสายน้ำไหลรินไม่ขาดสาย ความสงบสุขและรอยยิ้มจักหลั่งไหลสู่ชีวิต”',
        prophecy: {
          destiny: destiny || 'ดวงชะตาราบรื่นและเป็นสุข',
          wish: wish || 'สำเร็จได้ด้วยความเพียรและเมตตาจิต',
          travel: travel || 'การเยือนเคหสถานริมน้ำจักนำพาความชุ่มชื่นใจ'
        },
        easyMeaning: easyMeaning || 'ขอให้ท่านได้รับความผ่อนคลายและพลังบวกจากการพักผ่อนริมสายน้ำอยุธยา'
      };

      if (tierId) {
        const idx = prizes.findIndex(p => p.id === tierId);
        if (idx !== -1) prizes[idx] = tierObj;
        else prizes.push(tierObj);
      } else {
        prizes.push(tierObj);
      }

      SITE_OMIKUJI_PRIZES = prizes;
      OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES;

      try {
        localStorage.setItem('baantaphai_omikuji_prizes_v3', JSON.stringify(SITE_OMIKUJI_PRIZES));
      } catch(e) {}

      renderOmikujiModal();
      renderManageOmikujiTiersList();
      closeOmikujiTierEditModal();
      handleSectionSave('omikuji', 'แก้ไขรางวัลเซียมซี: ' + title, isDirectPublish);
    }

    function deleteOmikujiTierFromModal() {
      const tierId = document.getElementById('editOmikujiTierId').value;
      if (!tierId) return;
      deleteOmikujiTier(tierId);
      closeOmikujiTierEditModal();
    }

    function deleteOmikujiTier(tierId) {
      let prizes = (Array.isArray(SITE_OMIKUJI_PRIZES) && SITE_OMIKUJI_PRIZES.length > 0) ? [...SITE_OMIKUJI_PRIZES] : [...DEFAULT_OMIKUJI_PRIZES];
      if (prizes.length <= 1) {
        alert('ไม่สามารถลบได้ ต้องมีรางวัลเซียมซีอย่างน้อย 1 รายการ');
        return;
      }

      const target = prizes.find(p => p.id === tierId);
      const name = target ? target.title : 'รายการนี้';

      if (!confirm(`คุณต้องการลบ "${name}" ออกจากระบบเซียมซีใช่หรือไม่?`)) return;

      SITE_OMIKUJI_PRIZES = prizes.filter(p => p.id !== tierId);
      OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES;

      try {
        localStorage.setItem('baantaphai_omikuji_prizes_v3', JSON.stringify(SITE_OMIKUJI_PRIZES));
      } catch(e) {}

      renderOmikujiModal();
      renderManageOmikujiTiersList();
      handleSectionSave('omikuji', 'ลบรางวัลเซียมซี: ' + name, false);
    }

    // 8. DAY / NIGHT AMBIENCE TOGGLE
    function toggleDayNightMode() {
      isNightMode = !isNightMode;
      const body = document.body;
      const icon = document.getElementById('dayNightIcon');
      const label = document.getElementById('dayNightLabel');
      const drawerIcon = document.getElementById('drawerDayNightIcon');
      const drawerLabel = document.getElementById('drawerDayNightLabel');
      const heroImg = document.getElementById('heroMainImage');
      const announceText = document.getElementById('topAnnounceText');

      if (isNightMode) {
        body.classList.add('night-mode');
        if (icon) icon.className = 'fa-solid fa-sun text-amber-400 text-xs';
        const dLabel = (SITE_HEADER_ACTIONS && SITE_HEADER_ACTIONS.dayNightLabelDay) ? SITE_HEADER_ACTIONS.dayNightLabelDay : 'โหมดกลางวัน';
        if (label) label.textContent = dLabel;
        if (drawerIcon) drawerIcon.className = 'fa-solid fa-sun text-amber-400 text-xs';
        if (drawerLabel) drawerLabel.textContent = dLabel;
        if (heroImg) heroImg.src = SITE_HERO.heroImgNight || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80';
        if (announceText) announceText.textContent = '✨ บรรยากาศค่ำคืนใต้แสงดาวริมน้ำ & โคมไฟญี่ปุ่นอบอุ่น ณ บ้านตาผาย';
        showToast('🌙 สลับสู่โหมดกลางคืน');
      } else {
        body.classList.remove('night-mode');
        if (icon) icon.className = 'fa-solid fa-moon text-amber-500 text-xs';
        const nLabel = (SITE_HEADER_ACTIONS && SITE_HEADER_ACTIONS.dayNightLabelNight) ? SITE_HEADER_ACTIONS.dayNightLabelNight : 'โหมดกลางคืน';
        if (label) label.textContent = nLabel;
        if (drawerIcon) drawerIcon.className = 'fa-solid fa-moon text-amber-500 text-xs';
        if (drawerLabel) drawerLabel.textContent = nLabel;
        if (heroImg) heroImg.src = SITE_HERO.heroImg || 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80';
        if (announceText) announceText.textContent = SITE_TOP_BAR.announcementText || DEFAULT_TOP_BAR_DATA.announcementText;
        showToast('☀️ สลับสู่โหมดกลางวัน');
      }
    }

    // ========================================================
    // 🌤️ LIVE WEATHER & TOP ANNOUNCEMENT ENGINE (Free Open-Meteo API)
    // GPS: Amphoe Tha Ruea, Phra Nakhon Si Ayutthaya (14.5639° N, 100.7265° E)
    // 100% Free, No API Key, Auto Real-Time Forecast
    // ========================================================
    let liveWeatherData = null;
    let isWeatherFetching = false;

    function formatThaRueaWeather(current) {
      const temp = Math.round(current.temperature_2m);
      const code = current.weather_code;
      const isDay = current.is_day === 1;
      const wind = current.wind_speed_10m || 0;

      let icon = '🌤️';
      let desc = 'ลมเย็นสบาย';

      if (code === 0) {
        icon = isDay ? '☀️' : '🌙';
        desc = isDay ? 'แดดใส ฟ้าโปร่ง' : 'ท้องฟ้าโปร่ง ลมเย็น';
      } else if (code === 1) {
        icon = isDay ? '🌤️' : '🌙';
        desc = isDay ? 'แดดอ่อน ฟ้าโปร่ง' : 'อากาศแจ่มใส';
      } else if (code === 2) {
        icon = isDay ? '🌤️' : '☁️';
        desc = 'มีเมฆบางส่วน ลมสบาย';
      } else if (code === 3) {
        icon = '⛅';
        desc = 'เมฆเป็นส่วนมาก ลมสบาย';
      } else if (code === 45 || code === 48) {
        icon = '🌫️';
        desc = 'หมอกยามเช้า อากาศสดชื่น';
      } else if (code >= 51 && code <= 55) {
        icon = '🌦️';
        desc = 'ฝนปรอยๆ เย็นชุ่มฉ่ำ';
      } else if (code >= 61 && code <= 67) {
        icon = '🌧️';
        desc = 'ฝนตก เย็นชุ่มฉ่ำริมน้ำ';
      } else if (code >= 80 && code <= 82) {
        icon = '🌧️';
        desc = 'ฝนโปรยปราย เย็นสบาย';
      } else if (code >= 95) {
        icon = '⛈️';
        desc = 'ฝนฟ้าคะนอง';
      }

      if (code <= 3) {
        if (temp <= 25) {
          desc = 'อากาศเย็นสบาย';
        } else if (wind >= 12) {
          desc = 'ลมเย็นสบาย';
        }
      }

      return {
        icon,
        temp,
        desc,
        fullText: `${icon} อ.ท่าเรือ อยุธยา ${temp}°C ${desc}`,
        updatedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };
    }

    function renderWeatherDisplay(weatherText) {
      const topTextEl = document.getElementById('topWeatherText');
      if (topTextEl) topTextEl.textContent = weatherText;

      const drawerTextEl = document.getElementById('drawerWeatherText');
      if (drawerTextEl) {
        drawerTextEl.textContent = weatherText.replace(/^[^\s]+\s*/, '');
      }
      const drawerIconEl = document.getElementById('drawerWeatherIcon');
      if (drawerIconEl) {
        const match = weatherText.match(/^([^\s]+)/);
        if (match) drawerIconEl.textContent = match[1];
      }
    }

    async function fetchLiveWeather(forceRefresh = false) {
      if (!SITE_TOP_BAR.useLiveWeather) {
        renderWeatherDisplay(SITE_TOP_BAR.customWeatherText || '🌤️ อ.ท่าเรือ อยุธยา 29°C ลมเย็นสบาย');
        return;
      }

      const CACHE_KEY = 'baantaphai_weather_cache_v2';
      const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

      if (!forceRefresh) {
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_TTL) && parsed.fullText) {
              liveWeatherData = parsed;
              renderWeatherDisplay(parsed.fullText);
              return;
            }
          }
        } catch(e) {}
      }

      if (isWeatherFetching) return;
      isWeatherFetching = true;

      const refreshIcons = document.querySelectorAll('.weather-refresh-icon');
      refreshIcons.forEach(icon => icon.classList.add('fa-spin'));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        // Free Open-Meteo Weather API for Amphoe Tha Ruea, Phra Nakhon Si Ayutthaya
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.5639&longitude=100.7265&current=temperature_2m,is_day,weather_code,wind_speed_10m&timezone=Asia%2FBangkok';
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data && data.current) {
          const formatted = formatThaRueaWeather(data.current);
          liveWeatherData = {
            ...formatted,
            timestamp: Date.now()
          };
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(liveWeatherData));
          } catch(e) {}

          renderWeatherDisplay(formatted.fullText);
          if (forceRefresh) {
            showToast(`🌤️ อัปเดตพยากรณ์สด อ.ท่าเรือ อยุธยา แล้ว: ${formatted.temp}°C ${formatted.desc}`);
          }
        }
      } catch (err) {
        console.warn('[BaanTaPhai Weather] Free Forecast Notice:', err.message);
        const fallbackText = SITE_TOP_BAR.customWeatherText || '🌤️ อ.ท่าเรือ อยุธยา 29°C ลมเย็นสบาย';
        renderWeatherDisplay(fallbackText);
        if (forceRefresh) {
          showToast('⚠️ ไม่สามารถเชื่อมต่อพยากรณ์สดได้ในขณะนี้ กำลังใช้ข้อมูลสำรอง');
        }
      } finally {
        isWeatherFetching = false;
        refreshIcons.forEach(icon => icon.classList.remove('fa-spin'));
      }
    }

    function renderTopBar() {
      const announceEl = document.getElementById('topAnnounceText');
      if (announceEl && !isNightMode) {
        announceEl.textContent = SITE_TOP_BAR.announcementText || DEFAULT_TOP_BAR_DATA.announcementText;
      }
      const promoEl = document.getElementById('topPromoText');
      if (promoEl) {
        promoEl.textContent = SITE_TOP_BAR.promoText || DEFAULT_TOP_BAR_DATA.promoText;
      }

      const editBtn = document.getElementById('editTopBarBtn');
      if (editBtn) {
        if (isAdminMode) editBtn.classList.remove('hidden');
        else editBtn.classList.add('hidden');
      }

      if (SITE_TOP_BAR.useLiveWeather) {
        if (liveWeatherData && liveWeatherData.fullText) {
          renderWeatherDisplay(liveWeatherData.fullText);
        } else {
          fetchLiveWeather(false);
        }
      } else {
        renderWeatherDisplay(SITE_TOP_BAR.customWeatherText || '🌤️ อ.ท่าเรือ อยุธยา 29°C ลมเย็นสบาย');
      }
    }

    // Top Bar & Weather Edit Modal Functions
    function openTopBarEditModal() {
      const announceInput = document.getElementById('editTopBarAnnounceText');
      const customWeatherInput = document.getElementById('editTopBarCustomWeather');
      const promoInput = document.getElementById('editTopBarPromoText');
      const modeLiveRadio = document.getElementById('weatherModeLive');
      const modeCustomRadio = document.getElementById('weatherModeCustom');

      if (announceInput) announceInput.value = SITE_TOP_BAR.announcementText || DEFAULT_TOP_BAR_DATA.announcementText;
      if (customWeatherInput) customWeatherInput.value = SITE_TOP_BAR.customWeatherText || DEFAULT_TOP_BAR_DATA.customWeatherText;
      if (promoInput) promoInput.value = SITE_TOP_BAR.promoText || DEFAULT_TOP_BAR_DATA.promoText;

      const isLive = SITE_TOP_BAR.useLiveWeather !== false;
      if (modeLiveRadio) modeLiveRadio.checked = isLive;
      if (modeCustomRadio) modeCustomRadio.checked = !isLive;

      toggleWeatherModeInputs();
      testFetchLiveWeatherInModal(false);

      const m = document.getElementById('editTopBarModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeTopBarEditModal() {
      const m = document.getElementById('editTopBarModal');
      if (m) {
        m.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function toggleWeatherModeInputs() {
      const isCustom = document.getElementById('weatherModeCustom') && document.getElementById('weatherModeCustom').checked;
      const customWrapper = document.getElementById('customWeatherFieldWrapper');
      if (customWrapper) {
        if (isCustom) customWrapper.classList.remove('hidden');
        else customWrapper.classList.add('hidden');
      }
    }

    async function testFetchLiveWeatherInModal(showNotice = true) {
      const previewEl = document.getElementById('liveWeatherPreviewText');
      const spinner = document.querySelector('.weather-test-spinner');
      if (spinner) spinner.classList.add('fa-spin');
      if (previewEl) previewEl.textContent = 'กำลังเชื่อมต่อ Open-Meteo พยากรณ์จริง...';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.5639&longitude=100.7265&current=temperature_2m,is_day,weather_code,wind_speed_10m&timezone=Asia%2FBangkok';
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.current) {
          const formatted = formatThaRueaWeather(data.current);
          if (previewEl) previewEl.textContent = `${formatted.fullText} (อัปเดต ${formatted.updatedAt})`;
          if (showNotice) {
            showToast(`🌤️ พยากรณ์สดจริง: ${formatted.temp}°C ${formatted.desc}`);
          }
        }
      } catch (err) {
        if (previewEl) previewEl.textContent = '🌤️ อ.ท่าเรือ อยุธยา 29°C ลมเย็นสบาย (ข้อมูลสำรอง)';
        if (showNotice) {
          showToast('⚠️ ไม่สามารถเชื่อมต่อพยากรณ์สดได้ในขณะนี้');
        }
      } finally {
        if (spinner) spinner.classList.remove('fa-spin');
      }
    }

    function saveTopBarEdit(isDirectPublish = false) {
      const announceText = document.getElementById('editTopBarAnnounceText').value.trim();
      const customWeather = document.getElementById('editTopBarCustomWeather').value.trim();
      const promoText = document.getElementById('editTopBarPromoText').value.trim();
      const useLive = document.getElementById('weatherModeLive') && document.getElementById('weatherModeLive').checked;

      SITE_TOP_BAR.announcementText = announceText || DEFAULT_TOP_BAR_DATA.announcementText;
      SITE_TOP_BAR.useLiveWeather = !!useLive;
      SITE_TOP_BAR.customWeatherText = customWeather || '🌤️ อ.ท่าเรือ อยุธยา 29°C ลมเย็นสบาย';
      SITE_TOP_BAR.promoText = promoText || DEFAULT_TOP_BAR_DATA.promoText;

      try {
        localStorage.setItem('baantaphai_topbar_v3', JSON.stringify(SITE_TOP_BAR));
      } catch(e) {}

      closeTopBarEditModal();
      renderTopBar();
      if (useLive) {
        fetchLiveWeather(true);
      }
      handleSectionSave('topBar', 'แก้ไขแถบประกาศและสภาพอากาศ', isDirectPublish);
    }

    // 9. VIRAL SHARE TO LINE
    function shareResortToLine() {
      const shareUrl = window.location.href;
      const text = `พาไปพักผ่อนกัน! ชวนเที่ยว "บ้านตาผาย รีสอร์ท" อยุธยา บรรยากาศริมน้ำ & สไตล์ญี่ปุ่น ซุ้มโทริอิสวยมาก มีพายเรือคายัคฟรี ดูรูปห้องพักและราคาที่นี่เลย: ${shareUrl}`;
      window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
    }

    function shareSingleRoomToLine() {
      if (!currentModalRoom) return;
      const text = `เธอ ห้อง "${currentModalRoom.title}" (${currentModalRoom.price}) ที่บ้านตาผาย รีสอร์ท อยุธยาน่าพักมาก ดูรายละเอียดสิ: ${window.location.href}`;
      window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
    }

    function copyInquiryText() {
      if (!currentModalRoom) return;
      const inquiry = `สวัสดีค่ะ สนใจสอบถามห้องพัก "${currentModalRoom.title}" (${currentModalRoom.price}) สำหรับเข้าพักค่ะ`;
      navigator.clipboard.writeText(inquiry).then(() => {
        showToast('คัดลอกข้อความสอบถามแล้ว!');
      }).catch(() => {
        prompt('คัดลอกข้อความนี้เพื่อส่งทาง LINE:', inquiry);
      });
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2500);
    }

    // 10. SOCIAL PROOF LIVE NOTIFICATIONS (Runs periodically)
    // Only figures that are really on this page (the editable review fields) are shown; no invented visitors or quotes.
    const spText = (id) => ((document.getElementById(id) || {}).textContent || '').trim();
    const SOCIAL_PROOF_EVENTS = [
      {
        build: () => { const pct = spText('reviewsFacebookPercent'); return pct ? { msg: pct + ' แขกแนะนำบนเพจ Facebook 👍', sub: 'ความพึงพอใจการันตี @Baantaphai' } : null; },
        icon: 'fa-solid fa-thumbs-up text-[#1465D8]',
        bg: 'bg-blue-100 text-blue-600'
      },
      {
        build: () => { const r = spText('reviewsGoogleRating'), c = spText('reviewsGoogleCount'); return r ? { msg: 'คะแนน ' + r + ' ดาว' + (c ? ' บน ' + c : ' บน Google Maps'), sub: 'รีวิวจริงจากผู้เข้าพัก' } : null; },
        icon: 'fa-brands fa-google text-blue-500',
        bg: 'bg-rose-100 text-rose-600'
      }
    ];
    let socialProofIdx = 0;

    function triggerSocialProof() {
      // not while the hero is on screen: the notice would sit on top of the starting price
      const hero = document.getElementById('hero');
      if (hero && window.scrollY < hero.offsetHeight - 80) return;
      if (window.innerWidth < 640) return;
      try { if (sessionStorage.getItem('bt_toast_off') === '1') return; } catch (e) {}
      const evt = SOCIAL_PROOF_EVENTS[socialProofIdx % SOCIAL_PROOF_EVENTS.length];
      socialProofIdx++;
      const shown = evt.build();
      if (!shown) return;
      evt.msg = shown.msg; evt.sub = shown.sub;

      const toast = document.getElementById('socialProofToast');
      if (!toast) return;

      const iconWrap = document.getElementById('socialProofIconWrap');
      const icon = document.getElementById('socialProofIcon');
      const msgEl = document.getElementById('socialProofMsg');
      const subEl = document.getElementById('socialProofSub');

      if (msgEl) msgEl.textContent = evt.msg;
      if (subEl) subEl.textContent = evt.sub;
      if (iconWrap && evt.bg) iconWrap.className = `w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${evt.bg}`;
      if (icon && evt.icon) icon.className = evt.icon;

      toast.classList.remove('hidden');
      requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
      });

      setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => {
          toast.classList.add('hidden');
        }, 450);
      }, 4500);
    }
    setInterval(triggerSocialProof, 18000);

    // 11. IN-BROWSER EDIT MODAL & PHOTO STUDIO LOGIC
    function setupFocalPointDrag(viewportId, onUpdate) {
      const viewport = document.getElementById(viewportId);
      if (!viewport || viewport.dataset.dragInit === 'true') return;
      viewport.dataset.dragInit = 'true';
      let isDragging = false;

      function handlePoint(clientX, clientY) {
        const rect = viewport.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        let x = Math.round(((clientX - rect.left) / rect.width) * 100);
        let y = Math.round(((clientY - rect.top) / rect.height) * 100);
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));
        onUpdate(x, y);
      }

      viewport.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDragging = true;
        handlePoint(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        handlePoint(e.clientX, e.clientY);
      });
      window.addEventListener('mouseup', function() {
        isDragging = false;
      });

      viewport.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches.length > 0) {
          isDragging = true;
          handlePoint(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
      window.addEventListener('touchmove', function(e) {
        if (!isDragging || !e.touches || e.touches.length === 0) return;
        handlePoint(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchend', function() {
        isDragging = false;
      });
      window.addEventListener('touchcancel', function() { isDragging = false; });   // an interrupted gesture must not leave the crop stuck to the finger
    }

    let currentEditingRoomImages = [];
    let currentEditingPhotoIdx = 0;

    function openEditModal(roomId) {
      const data = SITE_ROOMS[roomId];
      if (!data) return;

      document.getElementById('editRoomKey').value = roomId;
      document.getElementById('editRoomTitleHeader').textContent = data.title;
      document.getElementById('editFieldTitle').value = data.title;
      document.getElementById('editFieldPrice').value = (data.price || '').replace(/^ราคาเริ่มต้น\s*/i, '').trim();
      document.getElementById('editFieldCap').value = data.cap;
      document.getElementById('editFieldBadge').value = data.badge || '';
      document.getElementById('editFieldUnit').value = data.unit || '/ คืน';
      document.getElementById('editFieldCat').value = data.cat || '';
      document.getElementById('editFieldFont').value = data.fontOverride || '';

      // Initialize photos array
      currentEditingRoomImages = (Array.isArray(data.images) && data.images.length > 0)
        ? [...data.images]
        : (data.img ? [data.img] : []);
      if (currentEditingRoomImages.length === 0) {
        currentEditingRoomImages = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'];
      }
      currentEditingPhotoIdx = 0;

      // Parse existing objectPosition, zoom, filter
      let panX = 50, panY = 50;
      if (data.objectPosition) {
        const parts = data.objectPosition.split(' ');
        if (parts.length >= 2) {
          panX = parseInt(parts[0], 10) || 50;
          panY = parseInt(parts[1], 10) || 50;
        }
      }
      const zoomVal = Math.round((Number(data.zoom) || 1) * 100);
      let brightVal = 100, contrastVal = 100, satVal = 100;
      if (data.filter) {
        const bMatch = data.filter.match(/brightness\(([\d.]+)\)/);
        const cMatch = data.filter.match(/contrast\(([\d.]+)\)/);
        const sMatch = data.filter.match(/saturate\(([\d.]+)\)/);
        if (bMatch) brightVal = Math.round(parseFloat(bMatch[1]) * 100);
        if (cMatch) contrastVal = Math.round(parseFloat(cMatch[1]) * 100);
        if (sMatch) satVal = Math.round(parseFloat(sMatch[1]) * 100);
      }

      document.getElementById('roomPanX').value = panX;
      document.getElementById('roomPanY').value = panY;
      document.getElementById('roomZoom').value = zoomVal;
      document.getElementById('roomBright').value = brightVal;
      document.getElementById('roomContrast').value = contrastVal;
      document.getElementById('roomSat').value = satVal;

      document.getElementById('editFieldImg').value = currentEditingRoomImages.join(', ');
      document.getElementById('editFieldDesc').value = data.desc;

      document.getElementById('editFieldHl0').value = (data.highlights && data.highlights[0]) || '';
      document.getElementById('editFieldHl1').value = (data.highlights && data.highlights[1]) || '';
      document.getElementById('editFieldHl2').value = (data.highlights && data.highlights[2]) || '';
      document.getElementById('editFieldHl3').value = (data.highlights && data.highlights[3]) || '';

      renderRoomPhotosGrid();
      updateRoomFramingFromSliders();
      updateRoomLiveCardPreview();
      updateRoomFramingStatusBox();

      // Setup interactive drag on viewport
      setupFocalPointDrag('roomCropViewport', (x, y) => {
        document.getElementById('roomPanX').value = x;
        document.getElementById('roomPanY').value = y;
        updateRoomFramingFromSliders();
      });

      document.getElementById('editRoomModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeEditModal() {
      const wasFromDetail = openedFromDetailModal;
      const key = document.getElementById('editRoomKey').value;
      openedFromDetailModal = false;
      document.getElementById('editRoomModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      if (wasFromDetail && key) {
        setTimeout(() => {
          openRoomModal(key);
        }, 50);
      }
    }

    function renderRoomPhotosGrid() {
      const grid = document.getElementById('roomPhotosThumbGrid');
      const countEl = document.getElementById('roomPhotosCount');
      if (countEl) countEl.textContent = currentEditingRoomImages.length;
      if (!grid) return;

      grid.innerHTML = '';
      currentEditingRoomImages.forEach((url, idx) => {
        const isCover = idx === 0;
        const isSelected = idx === currentEditingPhotoIdx;
        const div = document.createElement('div');
        div.className = `relative rounded-xl overflow-hidden border-2 transition-all p-1.5 bg-white shadow-xs flex flex-col justify-between ${isSelected ? 'border-amber-500 ring-2 ring-amber-300' : 'border-stone-200 hover:border-stone-400'}`;

        div.innerHTML = `
          <div class="relative aspect-[16/10] rounded-lg overflow-hidden bg-stone-100 cursor-pointer" onclick="selectPhotoForFraming(${idx})">
            <img src="${url}" alt="Room photo ${idx+1}" class="w-full h-full object-cover">
            <div class="absolute top-1 left-1 flex flex-wrap gap-1">
              <span class="px-1.5 py-0.5 rounded-md text-[9px] font-bold ${isCover ? 'bg-amber-500 text-stone-900 shadow-xs' : 'bg-black/70 text-white'}">
                ${isCover ? '⭐ หน้าปก' : `#${idx + 1}`}
              </span>
            </div>
            ${isSelected ? `
              <div class="absolute inset-0 border-2 border-amber-500 rounded-lg pointer-events-none flex items-end justify-center pb-1">
                <span class="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-bold shadow-xs">กำลังจัดมุม</span>
              </div>
            ` : ''}
          </div>
          <div class="flex items-center justify-between gap-1 pt-1.5 mt-1 border-t border-stone-100">
            <div class="flex items-center gap-0.5">
              <button type="button" onclick="moveRoomPhoto(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:pointer-events-none text-stone-700 flex items-center justify-center text-[10px]" title="เลื่อนซ้าย">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <button type="button" onclick="moveRoomPhoto(${idx}, 1)" ${idx === currentEditingRoomImages.length - 1 ? 'disabled' : ''} class="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:pointer-events-none text-stone-700 flex items-center justify-center text-[10px]" title="เลื่อนขวา">
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div class="flex items-center gap-0.5">
              ${!isCover ? `
                <button type="button" onclick="setRoomCoverPhoto(${idx})" class="px-1.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-semibold" title="ตั้งเป็นรูปหน้าปก">
                  ⭐ ปก
                </button>
              ` : ''}
              <button type="button" onclick="deleteRoomPhoto(${idx})" class="w-6 h-6 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-[10px]" title="ลบรูปภาพ">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
        grid.appendChild(div);
      });

      const txt = document.getElementById('editFieldImg');
      if (txt) txt.value = currentEditingRoomImages.join(', ');
    }

    function moveRoomPhoto(index, direction) {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= currentEditingRoomImages.length) return;
      const temp = currentEditingRoomImages[index];
      currentEditingRoomImages[index] = currentEditingRoomImages[targetIndex];
      currentEditingRoomImages[targetIndex] = temp;

      if (currentEditingPhotoIdx === index) {
        currentEditingPhotoIdx = targetIndex;
      } else if (currentEditingPhotoIdx === targetIndex) {
        currentEditingPhotoIdx = index;
      }

      renderRoomPhotosGrid();
      updateRoomFramingFromSliders();
      updateRoomLiveCardPreview();
      updateRoomFramingStatusBox();
    }

    function setRoomCoverPhoto(index) {
      if (index < 0 || index >= currentEditingRoomImages.length) return;
      if (index > 0) {
        const chosen = currentEditingRoomImages.splice(index, 1)[0];
        currentEditingRoomImages.unshift(chosen);
      }
      currentEditingPhotoIdx = 0;

      renderRoomPhotosGrid();
      updateRoomFramingFromSliders();
      updateRoomLiveCardPreview();
      updateRoomFramingStatusBox();
      showToast('⭐ ตั้งเป็นรูปหน้าปกการ์ดเรียบร้อยแล้ว!');
    }

    function deleteRoomPhoto(index) {
      if (currentEditingRoomImages.length <= 1) {
        alert('ห้องพักจำเป็นต้องมีรูปภาพอย่างน้อย 1 รูปครับ');
        return;
      }
      currentEditingRoomImages.splice(index, 1);
      if (currentEditingPhotoIdx >= currentEditingRoomImages.length) {
        currentEditingPhotoIdx = currentEditingRoomImages.length - 1;
      }
      renderRoomPhotosGrid();
      updateRoomFramingFromSliders();
      updateRoomLiveCardPreview();
      updateRoomFramingStatusBox();
      showToast('🗑️ ลบรูปภาพเรียบร้อยแล้ว');
    }

    function clearOtherPhotosKeepCurrent() {
      if (currentEditingRoomImages.length <= 1) {
        showToast('ℹ️ ในอัลบั้มมีรูปนี้เพียงรูปเดียวอยู่แล้วครับ');
        return;
      }
      if (confirm('ต้องการลบรูปภาพอื่นๆ ในห้องนี้ออกทั้งหมด และเหลือไว้เฉพาะรูปที่เลือกนี้รูปเดียวใช่หรือไม่?')) {
        const currentPhoto = currentEditingRoomImages[currentEditingPhotoIdx] || currentEditingRoomImages[0];
        currentEditingRoomImages = [currentPhoto];
        currentEditingPhotoIdx = 0;
        renderRoomPhotosGrid();
        updateRoomFramingFromSliders();
        updateRoomLiveCardPreview();
        updateRoomFramingStatusBox();
        showToast('✨ เหลือเฉพาะรูปนี้รูปเดียวและตั้งเป็นหน้าปกเรียบร้อยแล้ว!');
      }
    }

    function addRoomPhotoFromInput() {
      const inp = document.getElementById('newRoomPhotoInput');
      if (!inp) return;
      const raw = inp.value.trim();
      if (!raw) {
        alert('กรุณากรอกลิงก์รูปภาพก่อนครับ');
        return;
      }
      const formatted = formatDirectImageUrl(raw);
      // Auto-set as COVER PHOTO (index 0) so it immediately updates Live Preview card & saves as room card cover!
      currentEditingRoomImages.unshift(formatted);
      inp.value = '';
      currentEditingPhotoIdx = 0;

      renderRoomPhotosGrid();
      updateRoomFramingFromSliders();
      updateRoomLiveCardPreview();
      updateRoomFramingStatusBox();
      showToast('⭐ เพิ่มรูปภาพและตั้งเป็นรูปหน้าปกการ์ดเรียบร้อยแล้ว!');
    }

    function handleRoomPhotoFileUpload(event) {
      const file = event.target && event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }

      showToast('⏳ กำลังประมวลผลรูปภาพ...');

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          currentEditingRoomImages.unshift(dataUrl);
          currentEditingPhotoIdx = 0;

          renderRoomPhotosGrid();
          updateRoomFramingFromSliders();
          updateRoomLiveCardPreview();
          updateRoomFramingStatusBox();
          showToast('📸 อัปโหลดและตั้งเป็นรูปหน้าปกการ์ดเรียบร้อยแล้ว!');
        };
        img.onerror = function() {
          alert('ไม่สามารถเปิดไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้ง');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    function syncRoomPhotosFromTextarea(val) {
      const urls = val.split(/[\n,]+/).map(s => formatDirectImageUrl(s.trim())).filter(s => s.length > 0);
      if (urls.length > 0) {
        currentEditingRoomImages = urls;
        if (currentEditingPhotoIdx >= currentEditingRoomImages.length) {
          currentEditingPhotoIdx = 0;
        }
        renderRoomPhotosGrid();
        updateRoomFramingFromSliders();
        updateRoomLiveCardPreview();
        updateRoomFramingStatusBox();
      }
    }

    function selectPhotoForFraming(idx) {
      if (idx < 0 || idx >= currentEditingRoomImages.length) return;
      currentEditingPhotoIdx = idx;
      renderRoomPhotosGrid();
      updateRoomFramingFromSliders();
      updateRoomFramingStatusBox();
    }

    function updateRoomFramingStatusBox() {
      const box = document.getElementById('roomFramingCoverStatusBox');
      const badge = document.getElementById('roomFramingCoverBadge');
      const idxText = document.getElementById('roomFramingPhotoIndexText');
      const btn = document.getElementById('btnSetAsCoverFromFraming');
      if (!box || !badge) return;

      const total = currentEditingRoomImages.length;
      if (idxText) idxText.textContent = `(รูปที่ ${currentEditingPhotoIdx + 1} จาก ${total})`;

      if (currentEditingPhotoIdx === 0) {
        badge.textContent = '⭐ รูปนี้คือรูปหน้าปกการ์ดหลัก (กำลังแสดงผลบนการ์ดและ Live Preview)';
        badge.className = 'font-bold text-emerald-800';
        box.className = 'p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 flex-wrap';
        if (btn) btn.classList.add('hidden');
      } else {
        badge.textContent = '📸 รูปในอัลบั้มย่อย (ยังไม่ได้ตั้งเป็นหน้าปก)';
        badge.className = 'font-medium text-amber-900';
        box.className = 'p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 flex-wrap';
        if (btn) btn.classList.remove('hidden');
      }
    }

    function updateRoomFramingFromSliders() {
      const panX = document.getElementById('roomPanX') ? parseInt(document.getElementById('roomPanX').value, 10) : 50;
      const panY = document.getElementById('roomPanY') ? parseInt(document.getElementById('roomPanY').value, 10) : 50;
      const zoomVal = document.getElementById('roomZoom') ? parseInt(document.getElementById('roomZoom').value, 10) : 100;
      const brightVal = document.getElementById('roomBright') ? parseInt(document.getElementById('roomBright').value, 10) : 100;
      const contrastVal = document.getElementById('roomContrast') ? parseInt(document.getElementById('roomContrast').value, 10) : 100;
      const satVal = document.getElementById('roomSat') ? parseInt(document.getElementById('roomSat').value, 10) : 100;

      const zoomScale = (zoomVal / 100).toFixed(2);
      const filterCss = `brightness(${(brightVal/100).toFixed(2)}) contrast(${(contrastVal/100).toFixed(2)}) saturate(${(satVal/100).toFixed(2)})`;
      const posCss = `${panX}% ${panY}%`;

      // Update readout labels
      if (document.getElementById('roomPanXVal')) document.getElementById('roomPanXVal').textContent = `${panX}%`;
      if (document.getElementById('roomPanYVal')) document.getElementById('roomPanYVal').textContent = `${panY}%`;
      if (document.getElementById('roomZoomVal')) document.getElementById('roomZoomVal').textContent = `${zoomScale}x`;
      if (document.getElementById('roomBrightVal')) document.getElementById('roomBrightVal').textContent = `${brightVal}%`;
      if (document.getElementById('roomContrastVal')) document.getElementById('roomContrastVal').textContent = `${contrastVal}%`;
      if (document.getElementById('roomSatVal')) document.getElementById('roomSatVal').textContent = `${satVal}%`;
      if (document.getElementById('roomFocalCoordsText')) {
        document.getElementById('roomFocalCoordsText').textContent = `X: ${panX}% | Y: ${panY}% | Zoom: ${zoomScale}x`;
      }

      // Update crosshair indicator
      const crosshair = document.getElementById('roomCropCrosshair');
      if (crosshair) {
        crosshair.style.left = `${panX}%`;
        crosshair.style.top = `${panY}%`;
      }

      // Update crop viewport image
      const activeUrl = currentEditingRoomImages[currentEditingPhotoIdx] || currentEditingRoomImages[0] || '';
      const viewportImg = document.getElementById('roomCropViewportImg');
      if (viewportImg) {
        viewportImg.src = activeUrl;
        viewportImg.style.objectPosition = posCss;
        viewportImg.style.transform = `scale(${zoomScale})`;
        viewportImg.style.filter = filterCss;
      }

      // Update live card preview image (reflects the photo currently being framed & styled in real time)
      const liveImg = document.getElementById('roomLiveCardImg');
      if (liveImg) {
        liveImg.src = activeUrl;
        liveImg.style.objectPosition = posCss;
        liveImg.style.transform = Number(zoomScale) !== 1 ? `scale(${zoomScale})` : '';
        liveImg.style.filter = filterCss;
      }
    }

    function setRoomAnglePreset(type) {
      let x = 50, y = 50;
      if (type === 'top') { x = 50; y = 15; }
      else if (type === 'bottom') { x = 50; y = 85; }
      else if (type === 'left') { x = 15; y = 50; }
      else if (type === 'right') { x = 85; y = 50; }
      else if (type === 'center') { x = 50; y = 50; }

      document.getElementById('roomPanX').value = x;
      document.getElementById('roomPanY').value = y;
      updateRoomFramingFromSliders();
    }

    function setRoomTonePreset(type) {
      let b = 100, c = 100, s = 100;
      if (type === 'warm') { b = 105; c = 105; s = 120; }
      else if (type === 'bright') { b = 112; c = 108; s = 110; }
      else if (type === 'cozy') { b = 98; c = 115; s = 90; }
      else if (type === 'normal') { b = 100; c = 100; s = 100; }

      document.getElementById('roomBright').value = b;
      document.getElementById('roomContrast').value = c;
      document.getElementById('roomSat').value = s;
      updateRoomFramingFromSliders();
    }

    function resetRoomFramingAndFilters() {
      document.getElementById('roomPanX').value = 50;
      document.getElementById('roomPanY').value = 50;
      document.getElementById('roomZoom').value = 100;
      document.getElementById('roomBright').value = 100;
      document.getElementById('roomContrast').value = 100;
      document.getElementById('roomSat').value = 100;
      updateRoomFramingFromSliders();
      showToast('🔄 คืนค่ามุมมองและฟิลเตอร์เริ่มต้นเรียบร้อย');
    }

    function updateRoomLiveCardPreview() {
      const title = document.getElementById('editFieldTitle').value.trim() || 'ชื่อห้องพัก';
      const price = document.getElementById('editFieldPrice').value.trim() || '฿1,500';
      const unit = document.getElementById('editFieldUnit').value.trim() || '/ คืน';
      const cap = document.getElementById('editFieldCap').value.trim() || '2-4 ท่าน';
      const badge = document.getElementById('editFieldBadge').value.trim() || '🌊 โซนริมน้ำ';
      const desc = document.getElementById('editFieldDesc').value.trim() || 'คำอธิบายห้องพัก...';

      if (document.getElementById('roomLiveCardTitle')) document.getElementById('roomLiveCardTitle').textContent = title;
      if (document.getElementById('roomLiveCardPrice')) document.getElementById('roomLiveCardPrice').textContent = price.replace('ราคาเริ่มต้น', '').trim();
      if (document.getElementById('roomLiveCardUnit')) document.getElementById('roomLiveCardUnit').textContent = unit;
      if (document.getElementById('roomLiveCardCapText')) document.getElementById('roomLiveCardCapText').textContent = cap.split('(')[0].trim();
      if (document.getElementById('roomLiveCardBadge')) document.getElementById('roomLiveCardBadge').textContent = badge;
      if (document.getElementById('roomLiveCardDesc')) document.getElementById('roomLiveCardDesc').textContent = desc;

      const hl0 = document.getElementById('editFieldHl0').value.trim();
      const hl1 = document.getElementById('editFieldHl1').value.trim();
      const hlCont = document.getElementById('roomLiveCardHighlights');
      if (hlCont) {
        hlCont.innerHTML = '';
        [hl0, hl1].filter(h => h.length > 0).forEach(h => {
          const row = document.createElement('div');
          row.className = 'flex items-start gap-1 line-clamp-1';
          row.innerHTML = `<i class="fa-solid fa-check text-emerald-600 text-[10px] mt-0.5 shrink-0"></i> <span>${escapeHtml(h)}</span>`;
          hlCont.appendChild(row);
        });
      }

      const liveImg = document.getElementById('roomLiveCardImg');
      if (liveImg) {
        const activeUrl = currentEditingRoomImages[currentEditingPhotoIdx] || currentEditingRoomImages[0] || '';
        liveImg.src = activeUrl;
      }
    }

    function saveRoomEdit(isDirectPublish = false) {
      const key = document.getElementById('editRoomKey').value;
      if (!SITE_ROOMS[key]) return;

      // 1. If user typed a URL into newRoomPhotoInput and forgot to click "เพิ่มรูป" before clicking "บันทึก"
      const pendingInp = document.getElementById('newRoomPhotoInput');
      if (pendingInp && pendingInp.value.trim()) {
        const formatted = formatDirectImageUrl(pendingInp.value.trim());
        if (formatted && !currentEditingRoomImages.includes(formatted)) {
          currentEditingRoomImages.unshift(formatted);
          currentEditingPhotoIdx = 0;
        }
        pendingInp.value = '';
      }

      // 2. If user edited textarea editFieldImg
      const txtArea = document.getElementById('editFieldImg');
      if (txtArea && txtArea.value.trim()) {
        const rawUrls = txtArea.value.split(/[\n,]+/).map(s => formatDirectImageUrl(s.trim())).filter(s => s.length > 0);
        if (rawUrls.length > 0 && JSON.stringify(rawUrls) !== JSON.stringify(currentEditingRoomImages)) {
          currentEditingRoomImages = rawUrls;
        }
      }

      // 3. If user actively framed a photo at index > 0, automatically promote it to cover photo so their framing applies to the card
      if (currentEditingPhotoIdx > 0 && currentEditingPhotoIdx < currentEditingRoomImages.length) {
        const chosen = currentEditingRoomImages.splice(currentEditingPhotoIdx, 1)[0];
        currentEditingRoomImages.unshift(chosen);
        currentEditingPhotoIdx = 0;
      }

      // Ensure at least 1 image exists
      if (currentEditingRoomImages.length === 0) {
        currentEditingRoomImages = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'];
      }

      SITE_ROOMS[key].title = document.getElementById('editFieldTitle').value.trim();
      SITE_ROOMS[key].price = document.getElementById('editFieldPrice').value.trim().replace(/^ราคาเริ่มต้น\s*/i, '').trim();
      SITE_ROOMS[key].cap = document.getElementById('editFieldCap').value.trim();
      SITE_ROOMS[key].badge = document.getElementById('editFieldBadge').value.trim();
      SITE_ROOMS[key].unit = document.getElementById('editFieldUnit').value.trim();
      SITE_ROOMS[key].cat = document.getElementById('editFieldCat').value.trim();
      SITE_ROOMS[key].fontOverride = document.getElementById('editFieldFont').value || '';
      
      SITE_ROOMS[key].images = [...currentEditingRoomImages];
      SITE_ROOMS[key].img = currentEditingRoomImages[0] || '';

      // Save focal point, zoom, and filter (specifically for the cover photo)
      const panX = parseInt(document.getElementById('roomPanX').value, 10) || 50;
      const panY = parseInt(document.getElementById('roomPanY').value, 10) || 50;
      const zoomVal = parseInt(document.getElementById('roomZoom').value, 10) || 100;
      const brightVal = parseInt(document.getElementById('roomBright').value, 10) || 100;
      const contrastVal = parseInt(document.getElementById('roomContrast').value, 10) || 100;
      const satVal = parseInt(document.getElementById('roomSat').value, 10) || 100;

      SITE_ROOMS[key].objectPosition = `${panX}% ${panY}%`;
      SITE_ROOMS[key].zoom = Number((zoomVal / 100).toFixed(2));
      
      if (brightVal !== 100 || contrastVal !== 100 || satVal !== 100) {
        SITE_ROOMS[key].filter = `brightness(${(brightVal/100).toFixed(2)}) contrast(${(contrastVal/100).toFixed(2)}) saturate(${(satVal/100).toFixed(2)})`;
      } else {
        delete SITE_ROOMS[key].filter;
      }

      SITE_ROOMS[key].desc = document.getElementById('editFieldDesc').value.trim();

      SITE_ROOMS[key].highlights = [
        document.getElementById('editFieldHl0').value.trim(),
        document.getElementById('editFieldHl1').value.trim(),
        document.getElementById('editFieldHl2').value.trim(),
        document.getElementById('editFieldHl3').value.trim()
      ].filter(h => h.length > 0);

      try {
        localStorage.setItem('baantaphai_rooms_v3', JSON.stringify(SITE_ROOMS));
      } catch (e) {
        console.error('LocalStorage write error:', e);
        if (e.name === 'QuotaExceededError') {
          alert('พื้นที่ความจำในเบราว์เซอร์เต็ม (เนื่องจากรูปภาพมีขนาดใหญ่เกินไป) กรุณาลดขนาดรูปภาพหรือใช้รูปผ่านลิงก์ URL แทนครับ');
        }
      }

      if (currentModalRoom && currentModalRoom.id === key) {
        currentModalRoom = SITE_ROOMS[key];
      }

      closeEditModal();
      renderRoomCards();
      handleSectionSave('rooms', 'แก้ไขห้องพัก: ' + (SITE_ROOMS[key] ? SITE_ROOMS[key].title : key), isDirectPublish);
    }

    // Dynamic Hero & Homepage Edit Handlers
    function previewHeroImg(val) {
      const converted = formatDirectImageUrl(val);
      const p = document.getElementById('editHeroImgPreview');
      if (p && converted) p.src = converted;
    }

    function openHeroEditModal(targetSection) {
      const imgVal = formatDirectImageUrl(SITE_HERO.heroImg || DEFAULT_HERO_DATA.heroImg);
      document.getElementById('editHeroImg').value = imgVal;
      previewHeroImg(imgVal);
      document.getElementById('editHeroImgNight').value = formatDirectImageUrl(SITE_HERO.heroImgNight || '');
      document.getElementById('editHeroVideo').value = SITE_HERO.heroVideo || '';
      document.getElementById('editHeroHeadingFont').value = SITE_HERO.headingFontOverride || '';
      document.getElementById('editHeroDescFont').value = SITE_HERO.descFontOverride || '';
      document.getElementById('editHeroTitle1').value = SITE_HERO.title1 || '';
      document.getElementById('editHeroTitleHl').value = SITE_HERO.titleHl || '';
      document.getElementById('editHeroTitle2').value = SITE_HERO.title2 || '';
      document.getElementById('editHeroDesc').value = SITE_HERO.desc || '';
      document.getElementById('editHeroBadge').value = SITE_HERO.badge || '';
      document.getElementById('editHeroPrice').value = SITE_HERO.startPrice || '800';
      document.getElementById('editHeroPriceNote').value = SITE_HERO.startPriceNote || 'รวมอาหารเช้าฟรี';
      document.getElementById('editHeroOverlayBadge').value = SITE_HERO.overlayBadge || 'Baan Ta Phai';
      document.getElementById('editHeroOverlayTitle').value = SITE_HERO.overlayTitle || 'สงบ เรียบง่าย เป็นส่วนตัว';
      document.getElementById('editHeroOverlaySubtitle').value = SITE_HERO.overlaySubtitle || 'พักผ่อนริมน้ำใกล้กรุงเทพฯ เพียง 1 ชั่วโมง';

      const chips = (SITE_HERO.chips && Array.isArray(SITE_HERO.chips) && SITE_HERO.chips.length === 4) ? SITE_HERO.chips : DEFAULT_HERO_DATA.chips;
      document.getElementById('editHeroChip1Icon').value = chips[0]?.icon || '';
      document.getElementById('editHeroChip1Text').value = chips[0]?.text || '';
      document.getElementById('editHeroChip2Icon').value = chips[1]?.icon || '';
      document.getElementById('editHeroChip2Text').value = chips[1]?.text || '';
      document.getElementById('editHeroChip3Icon').value = chips[2]?.icon || '';
      document.getElementById('editHeroChip3Text').value = chips[2]?.text || '';
      document.getElementById('editHeroChip4Icon').value = chips[3]?.icon || '';
      document.getElementById('editHeroChip4Text').value = chips[3]?.text || '';

      document.getElementById('editHeroBtnStartPriceText').value = SITE_HERO.btnStartPriceText || DEFAULT_HERO_DATA.btnStartPriceText;
      document.getElementById('editHeroOmikujiBtnText').value = SITE_HERO.omikujiBtnText || DEFAULT_HERO_DATA.omikujiBtnText;

      const fbLeft = SITE_HERO.floatingBadgeLeft || DEFAULT_HERO_DATA.floatingBadgeLeft;
      document.getElementById('editHeroFloatLeftIcon').value = fbLeft?.icon || '';
      document.getElementById('editHeroFloatLeftTitle').value = fbLeft?.title || '';
      document.getElementById('editHeroFloatLeftSub').value = fbLeft?.subtitle || '';
      document.getElementById('editHeroFloatLeftShowThumb').checked = fbLeft?.showThumb !== false;

      const fbRight = SITE_HERO.floatingBadgeRight || DEFAULT_HERO_DATA.floatingBadgeRight;
      document.getElementById('editHeroFloatRightIcon').value = fbRight?.icon || '';
      document.getElementById('editHeroFloatRightTitle').value = fbRight?.title || '';
      document.getElementById('editHeroFloatRightSub').value = fbRight?.subtitle || '';

      const modal = document.getElementById('editHeroModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        if (targetSection === 'chips') {
          setTimeout(() => {
            const el = document.getElementById('modalHeroChipsSection');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else if (targetSection === 'video') {
          setTimeout(() => {
            const el = document.getElementById('modalHeroVideoSection');
            if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('ring-4', 'ring-blue-300'); setTimeout(() => el.classList.remove('ring-4', 'ring-blue-300'), 2600); }
            const inp = document.getElementById('editHeroVideo'); if (inp) inp.focus({ preventScroll: true });
          }, 150);
        } else if (targetSection === 'floating_badges') {
          setTimeout(() => {
            const el = document.getElementById('modalHeroFloatingBadgesSection');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
    }

    function closeHeroEditModal() {
      const modal = document.getElementById('editHeroModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveHeroEdit(isDirectPublish = false) {
      const rawImg = document.getElementById('editHeroImg').value.trim();
      const rawImgNight = document.getElementById('editHeroImgNight').value.trim();

      SITE_HERO.heroImg = formatDirectImageUrl(rawImg) || DEFAULT_HERO_DATA.heroImg;
      SITE_HERO.heroImgNight = formatDirectImageUrl(rawImgNight) || DEFAULT_HERO_DATA.heroImgNight;
      SITE_HERO.heroVideo = (document.getElementById('editHeroVideo').value || '').trim();
      delete SITE_HERO.heroSlides;
      SITE_HERO.headingFontOverride = document.getElementById('editHeroHeadingFont').value || '';
      SITE_HERO.descFontOverride = document.getElementById('editHeroDescFont').value || '';
      SITE_HERO.title1 = document.getElementById('editHeroTitle1').value.trim() || DEFAULT_HERO_DATA.title1;
      SITE_HERO.titleHl = document.getElementById('editHeroTitleHl').value.trim() || DEFAULT_HERO_DATA.titleHl;
      SITE_HERO.title2 = document.getElementById('editHeroTitle2').value.trim() || DEFAULT_HERO_DATA.title2;
      SITE_HERO.desc = document.getElementById('editHeroDesc').value.trim() || DEFAULT_HERO_DATA.desc;
      SITE_HERO.badge = document.getElementById('editHeroBadge').value.trim() || DEFAULT_HERO_DATA.badge;
      SITE_HERO.startPrice = document.getElementById('editHeroPrice').value.trim() || DEFAULT_HERO_DATA.startPrice;
      SITE_HERO.startPriceNote = document.getElementById('editHeroPriceNote').value.trim() || DEFAULT_HERO_DATA.startPriceNote;
      SITE_HERO.overlayBadge = document.getElementById('editHeroOverlayBadge').value.trim() || DEFAULT_HERO_DATA.overlayBadge;
      SITE_HERO.overlayTitle = document.getElementById('editHeroOverlayTitle').value.trim() || DEFAULT_HERO_DATA.overlayTitle;
      SITE_HERO.overlaySubtitle = document.getElementById('editHeroOverlaySubtitle').value.trim() || DEFAULT_HERO_DATA.overlaySubtitle;

      SITE_HERO.chips = [
        {
          icon: document.getElementById('editHeroChip1Icon').value.trim() || DEFAULT_HERO_DATA.chips[0].icon,
          text: document.getElementById('editHeroChip1Text').value.trim() || DEFAULT_HERO_DATA.chips[0].text
        },
        {
          icon: document.getElementById('editHeroChip2Icon').value.trim() || DEFAULT_HERO_DATA.chips[1].icon,
          text: document.getElementById('editHeroChip2Text').value.trim() || DEFAULT_HERO_DATA.chips[1].text
        },
        {
          icon: document.getElementById('editHeroChip3Icon').value.trim() || DEFAULT_HERO_DATA.chips[2].icon,
          text: document.getElementById('editHeroChip3Text').value.trim() || DEFAULT_HERO_DATA.chips[2].text
        },
        {
          icon: document.getElementById('editHeroChip4Icon').value.trim() || DEFAULT_HERO_DATA.chips[3].icon,
          text: document.getElementById('editHeroChip4Text').value.trim() || DEFAULT_HERO_DATA.chips[3].text
        }
      ];

      SITE_HERO.btnStartPriceText = document.getElementById('editHeroBtnStartPriceText').value.trim() || DEFAULT_HERO_DATA.btnStartPriceText;
      SITE_HERO.omikujiBtnText = document.getElementById('editHeroOmikujiBtnText').value.trim() || DEFAULT_HERO_DATA.omikujiBtnText;

      SITE_HERO.floatingBadgeLeft = {
        icon: document.getElementById('editHeroFloatLeftIcon').value.trim() || DEFAULT_HERO_DATA.floatingBadgeLeft.icon,
        title: document.getElementById('editHeroFloatLeftTitle').value.trim() || DEFAULT_HERO_DATA.floatingBadgeLeft.title,
        subtitle: document.getElementById('editHeroFloatLeftSub').value.trim() || DEFAULT_HERO_DATA.floatingBadgeLeft.subtitle,
        showThumb: document.getElementById('editHeroFloatLeftShowThumb').checked
      };

      SITE_HERO.floatingBadgeRight = {
        icon: document.getElementById('editHeroFloatRightIcon').value.trim() || DEFAULT_HERO_DATA.floatingBadgeRight.icon,
        title: document.getElementById('editHeroFloatRightTitle').value.trim() || DEFAULT_HERO_DATA.floatingBadgeRight.title,
        subtitle: document.getElementById('editHeroFloatRightSub').value.trim() || DEFAULT_HERO_DATA.floatingBadgeRight.subtitle
      };

      try {
        localStorage.setItem('baantaphai_hero_v3', JSON.stringify(SITE_HERO));
      } catch (e) {
        console.error('LocalStorage write error for hero:', e);
      }

      renderHeroSection();
      closeHeroEditModal();
      handleSectionSave('hero', 'แก้ไขหน้าแรกและรูปภาพ (Hero Section)', isDirectPublish);
    }

    // Dining Showcase Edit Handlers
    function openDiningEditModal(diningId) {
      const data = SITE_DINING.find(d => d.id === diningId);
      if (!data) return;

      document.getElementById('editDiningKey').value = data.id;
      document.getElementById('editDiningHeaderTitle').textContent = data.title;
      document.getElementById('editDiningTitle').value = data.title;
      document.getElementById('editDiningBadge').value = data.badge || '';
      document.getElementById('editDiningPrice').value = data.price || '';
      document.getElementById('editDiningImg').value = data.img || '';
      document.getElementById('editDiningDesc').value = data.desc || '';
      document.getElementById('editDiningTag0').value = (data.tags && data.tags[0]) || '';
      document.getElementById('editDiningTag1').value = (data.tags && data.tags[1]) || '';

      // Parse existing objectPosition, zoom, filter
      let panX = 50, panY = 50;
      if (data.objectPosition) {
        const parts = data.objectPosition.split(' ');
        if (parts.length >= 2) {
          panX = parseInt(parts[0], 10) || 50;
          panY = parseInt(parts[1], 10) || 50;
        }
      }
      const zoomVal = Math.round((Number(data.zoom) || 1) * 100);
      let brightVal = 100, contrastVal = 100, satVal = 100;
      if (data.filter) {
        const bMatch = data.filter.match(/brightness\(([\d.]+)\)/);
        const cMatch = data.filter.match(/contrast\(([\d.]+)\)/);
        const sMatch = data.filter.match(/saturate\(([\d.]+)\)/);
        if (bMatch) brightVal = Math.round(parseFloat(bMatch[1]) * 100);
        if (cMatch) contrastVal = Math.round(parseFloat(cMatch[1]) * 100);
        if (sMatch) satVal = Math.round(parseFloat(sMatch[1]) * 100);
      }

      document.getElementById('diningPanX').value = panX;
      document.getElementById('diningPanY').value = panY;
      document.getElementById('diningZoom').value = zoomVal;
      document.getElementById('diningBright').value = brightVal;
      document.getElementById('diningContrast').value = contrastVal;
      document.getElementById('diningSat').value = satVal;

      updateDiningFramingFromSliders();
      updateDiningLiveCardPreview();

      setupFocalPointDrag('diningCropViewport', (x, y) => {
        document.getElementById('diningPanX').value = x;
        document.getElementById('diningPanY').value = y;
        updateDiningFramingFromSliders();
      });

      const modal = document.getElementById('editDiningCardModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeDiningEditModal() {
      const modal = document.getElementById('editDiningCardModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function onDiningImgInput(val) {
      const formatted = formatDirectImageUrl(val);
      const vImg = document.getElementById('diningCropViewportImg');
      const lImg = document.getElementById('diningLiveCardImg');
      if (vImg) vImg.src = formatted;
      if (lImg) lImg.src = formatted;
    }

    function updateDiningFramingFromSliders() {
      const panX = document.getElementById('diningPanX') ? parseInt(document.getElementById('diningPanX').value, 10) : 50;
      const panY = document.getElementById('diningPanY') ? parseInt(document.getElementById('diningPanY').value, 10) : 50;
      const zoomVal = document.getElementById('diningZoom') ? parseInt(document.getElementById('diningZoom').value, 10) : 100;
      const brightVal = document.getElementById('diningBright') ? parseInt(document.getElementById('diningBright').value, 10) : 100;
      const contrastVal = document.getElementById('diningContrast') ? parseInt(document.getElementById('diningContrast').value, 10) : 100;
      const satVal = document.getElementById('diningSat') ? parseInt(document.getElementById('diningSat').value, 10) : 100;

      const zoomScale = (zoomVal / 100).toFixed(2);
      const filterCss = `brightness(${(brightVal/100).toFixed(2)}) contrast(${(contrastVal/100).toFixed(2)}) saturate(${(satVal/100).toFixed(2)})`;
      const posCss = `${panX}% ${panY}%`;

      if (document.getElementById('diningPanXVal')) document.getElementById('diningPanXVal').textContent = `${panX}%`;
      if (document.getElementById('diningPanYVal')) document.getElementById('diningPanYVal').textContent = `${panY}%`;
      if (document.getElementById('diningZoomVal')) document.getElementById('diningZoomVal').textContent = `${zoomScale}x`;
      if (document.getElementById('diningBrightVal')) document.getElementById('diningBrightVal').textContent = `${brightVal}%`;
      if (document.getElementById('diningContrastVal')) document.getElementById('diningContrastVal').textContent = `${contrastVal}%`;
      if (document.getElementById('diningSatVal')) document.getElementById('diningSatVal').textContent = `${satVal}%`;
      if (document.getElementById('diningFocalCoordsText')) {
        document.getElementById('diningFocalCoordsText').textContent = `X: ${panX}% | Y: ${panY}% | Zoom: ${zoomScale}x`;
      }

      const crosshair = document.getElementById('diningCropCrosshair');
      if (crosshair) {
        crosshair.style.left = `${panX}%`;
        crosshair.style.top = `${panY}%`;
      }

      const imgUrl = formatDirectImageUrl(document.getElementById('editDiningImg') ? document.getElementById('editDiningImg').value.trim() : '');
      const viewportImg = document.getElementById('diningCropViewportImg');
      if (viewportImg) {
        if (imgUrl) viewportImg.src = imgUrl;
        viewportImg.style.objectPosition = posCss;
        viewportImg.style.transform = `scale(${zoomScale})`;
        viewportImg.style.filter = filterCss;
      }

      const liveImg = document.getElementById('diningLiveCardImg');
      if (liveImg) {
        if (imgUrl) liveImg.src = imgUrl;
        liveImg.style.objectPosition = posCss;
        liveImg.style.transform = Number(zoomScale) !== 1 ? `scale(${zoomScale})` : '';
        liveImg.style.filter = filterCss;
      }
    }

    function setDiningAnglePreset(type) {
      let x = 50, y = 50;
      if (type === 'top') { x = 50; y = 15; }
      else if (type === 'bottom') { x = 50; y = 85; }
      else if (type === 'left') { x = 15; y = 50; }
      else if (type === 'right') { x = 85; y = 50; }
      else if (type === 'center') { x = 50; y = 50; }

      document.getElementById('diningPanX').value = x;
      document.getElementById('diningPanY').value = y;
      updateDiningFramingFromSliders();
    }

    function setDiningTonePreset(type) {
      let b = 100, c = 100, s = 100;
      if (type === 'warm') { b = 105; c = 105; s = 120; }
      else if (type === 'bright') { b = 112; c = 108; s = 110; }
      else if (type === 'cozy') { b = 98; c = 115; s = 90; }
      else if (type === 'normal') { b = 100; c = 100; s = 100; }

      document.getElementById('diningBright').value = b;
      document.getElementById('diningContrast').value = c;
      document.getElementById('diningSat').value = s;
      updateDiningFramingFromSliders();
    }

    function resetDiningFramingAndFilters() {
      document.getElementById('diningPanX').value = 50;
      document.getElementById('diningPanY').value = 50;
      document.getElementById('diningZoom').value = 100;
      document.getElementById('diningBright').value = 100;
      document.getElementById('diningContrast').value = 100;
      document.getElementById('diningSat').value = 100;
      updateDiningFramingFromSliders();
      showToast('🔄 คืนค่ามุมมองและฟิลเตอร์เริ่มต้นเรียบร้อย');
    }

    function updateDiningLiveCardPreview() {
      const title = document.getElementById('editDiningTitle').value.trim() || 'ชื่อโซนอาหาร';
      const badge = document.getElementById('editDiningBadge').value.trim() || '☕ Signature Café';
      const price = document.getElementById('editDiningPrice').value.trim() || 'เริ่มต้น ฿55.-';
      const desc = document.getElementById('editDiningDesc').value.trim() || 'คำอธิบายโซนอาหาร...';

      if (document.getElementById('diningLiveCardTitle')) document.getElementById('diningLiveCardTitle').textContent = title;
      if (document.getElementById('diningLiveCardBadge')) document.getElementById('diningLiveCardBadge').textContent = badge;
      if (document.getElementById('diningLiveCardPrice')) document.getElementById('diningLiveCardPrice').textContent = price;
      if (document.getElementById('diningLiveCardDesc')) document.getElementById('diningLiveCardDesc').textContent = desc;

      const tag0 = document.getElementById('editDiningTag0').value.trim();
      const tag1 = document.getElementById('editDiningTag1').value.trim();
      const tagsCont = document.getElementById('diningLiveCardTags');
      if (tagsCont) {
        tagsCont.innerHTML = '';
        [tag0, tag1].filter(t => t.length > 0).forEach(t => {
          const div = document.createElement('div');
          div.className = 'flex items-center gap-1';
          div.innerHTML = `<i class="fa-solid fa-check text-emerald-600 text-xs"></i> <span>${escapeHtml(t)}</span>`;
          tagsCont.appendChild(div);
        });
      }
    }

    function saveDiningEdit(isDirectPublish = false) {
      const key = document.getElementById('editDiningKey').value;
      const item = SITE_DINING.find(d => d.id === key);
      if (!item) return;

      item.title = document.getElementById('editDiningTitle').value.trim();
      item.badge = document.getElementById('editDiningBadge').value.trim();
      item.price = document.getElementById('editDiningPrice').value.trim();
      item.img = formatDirectImageUrl(document.getElementById('editDiningImg').value.trim());
      item.desc = document.getElementById('editDiningDesc').value.trim();
      
      const tag0 = document.getElementById('editDiningTag0').value.trim();
      const tag1 = document.getElementById('editDiningTag1').value.trim();
      item.tags = [tag0, tag1].filter(t => t.length > 0);

      // Save focal point, zoom, filter
      const panX = parseInt(document.getElementById('diningPanX').value, 10) || 50;
      const panY = parseInt(document.getElementById('diningPanY').value, 10) || 50;
      const zoomVal = parseInt(document.getElementById('diningZoom').value, 10) || 100;
      const brightVal = parseInt(document.getElementById('diningBright').value, 10) || 100;
      const contrastVal = parseInt(document.getElementById('diningContrast').value, 10) || 100;
      const satVal = parseInt(document.getElementById('diningSat').value, 10) || 100;

      item.objectPosition = `${panX}% ${panY}%`;
      item.zoom = Number((zoomVal / 100).toFixed(2));
      
      if (brightVal !== 100 || contrastVal !== 100 || satVal !== 100) {
        item.filter = `brightness(${(brightVal/100).toFixed(2)}) contrast(${(contrastVal/100).toFixed(2)}) saturate(${(satVal/100).toFixed(2)})`;
      } else {
        delete item.filter;
      }

      try {
        localStorage.setItem('baantaphai_dining_v3', JSON.stringify(SITE_DINING));
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }

      closeDiningEditModal();
      renderDiningCards();
      handleSectionSave('dining', 'แก้ไขโซนอาหาร: ' + (item ? item.title : key), isDirectPublish);
    }

    // Recommended Menu Edit Handlers
    function openMenuItemEditModal(itemId) {
      const isNew = !itemId;
      document.getElementById('editMenuItemId').value = isNew ? '' : itemId;
      document.getElementById('editMenuItemHeaderTitle').textContent = isNew ? 'เพิ่มเมนูใหม่' : 'แก้ไขรายการเมนู';
      
      const delBtn = document.getElementById('deleteMenuItemBtn');
      if (delBtn) {
        if (isNew) delBtn.classList.add('hidden');
        else delBtn.classList.remove('hidden');
      }

      if (isNew) {
        document.getElementById('editMenuItemCategory').value = (currentMenuCategory === 'all' ? 'drinks' : currentMenuCategory);
        document.getElementById('editMenuItemName').value = '';
        document.getElementById('editMenuItemBadge').value = '';
        document.getElementById('editMenuItemPrice').value = '';
        document.getElementById('editMenuItemDesc').value = '';
      } else {
        const item = SITE_MENU.find(m => m.id === itemId);
        if (!item) return;
        document.getElementById('editMenuItemCategory').value = item.category || 'drinks';
        document.getElementById('editMenuItemName').value = item.name || '';
        document.getElementById('editMenuItemBadge').value = item.badge || '';
        document.getElementById('editMenuItemPrice').value = item.price || '';
        document.getElementById('editMenuItemDesc').value = item.desc || '';
      }

      const modal = document.getElementById('editMenuItemModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeMenuItemEditModal() {
      const modal = document.getElementById('editMenuItemModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveMenuItemEdit(isDirectPublish = false) {
      const id = document.getElementById('editMenuItemId').value;
      const cat = document.getElementById('editMenuItemCategory').value;
      const name = document.getElementById('editMenuItemName').value.trim();
      const badge = document.getElementById('editMenuItemBadge').value.trim();
      const price = document.getElementById('editMenuItemPrice').value.trim();
      const desc = document.getElementById('editMenuItemDesc').value.trim();

      if (!name) {
        alert('กรุณากรอกชื่อเมนู');
        return;
      }

      if (!id) {
        const newId = 'm_' + Date.now();
        SITE_MENU.push({
          id: newId,
          category: cat,
          name: name,
          badge: badge,
          price: price || '฿0.-',
          desc: desc
        });
      } else {
        const item = SITE_MENU.find(m => m.id === id);
        if (item) {
          item.category = cat;
          item.name = name;
          item.badge = badge;
          item.price = price;
          item.desc = desc;
        }
      }

      try {
        localStorage.setItem('baantaphai_menu_v3', JSON.stringify(SITE_MENU));
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }

      closeMenuItemEditModal();
      renderMenuItems();
      handleSectionSave('menu', (id ? 'แก้ไขเมนู: ' : 'เพิ่มเมนูใหม่: ') + name, isDirectPublish);
    }

    function deleteMenuItem() {
      const id = document.getElementById('editMenuItemId').value;
      if (!id) return;
      const item = SITE_MENU.find(m => m.id === id);
      const name = item ? item.name : 'เมนูนี้';
      
      if (confirm(`คุณต้องการลบ "${name}" ออกจากรายการเมนูใช่หรือไม่?`)) {
        SITE_MENU = SITE_MENU.filter(m => m.id !== id);
        try {
          localStorage.setItem('baantaphai_menu_v3', JSON.stringify(SITE_MENU));
        } catch (e) {
          console.error('LocalStorage write error:', e);
        }
        closeMenuItemEditModal();
        renderMenuItems();
        handleSectionSave('menu', 'ลบรายการเมนู: ' + name);
      }
    }

    // ==========================================
    // 12.1 THEME COLOR & STYLING HELPERS
    // ==========================================
    function getThemeColorPalette(theme) {
      switch(theme) {
        case 'amber':
          return {
            bg: 'bg-amber-50',
            text: 'text-amber-800',
            border: 'border-amber-200',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-900',
            btnHover: 'hover:border-amber-500'
          };
        case 'emerald':
          return {
            bg: 'bg-emerald-50',
            text: 'text-emerald-800',
            border: 'border-emerald-200',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-900',
            btnHover: 'hover:border-emerald-500'
          };
        case 'rose':
          return {
            bg: 'bg-rose-50',
            text: 'text-rose-700',
            border: 'border-rose-200',
            badgeBg: 'bg-rose-100',
            badgeText: 'text-rose-900',
            btnHover: 'hover:border-rose-500'
          };
        case 'blue':
          return {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            border: 'border-blue-200',
            badgeBg: 'bg-blue-100',
            badgeText: 'text-blue-900',
            btnHover: 'hover:border-blue-500'
          };
        case 'cyan':
          return {
            bg: 'bg-cyan-50',
            text: 'text-cyan-700',
            border: 'border-cyan-200',
            badgeBg: 'bg-cyan-100',
            badgeText: 'text-cyan-900',
            btnHover: 'hover:border-cyan-500'
          };
        case 'orange':
          return {
            bg: 'bg-orange-50',
            text: 'text-orange-700',
            border: 'border-orange-200',
            badgeBg: 'bg-orange-100',
            badgeText: 'text-orange-900',
            btnHover: 'hover:border-orange-500'
          };
        case 'purple':
          return {
            bg: 'bg-purple-50',
            text: 'text-purple-700',
            border: 'border-purple-200',
            badgeBg: 'bg-purple-100',
            badgeText: 'text-purple-900',
            btnHover: 'hover:border-purple-500'
          };
        case 'stone':
        default:
          return {
            bg: 'bg-stone-100',
            text: 'text-stone-800',
            border: 'border-stone-300',
            badgeBg: 'bg-stone-200',
            badgeText: 'text-stone-800',
            btnHover: 'hover:border-stone-500'
          };
      }
    }

    function setActCardEmoji(emoji) {
      const input = document.getElementById('editActCardEmoji');
      if (input) input.value = emoji;
    }

    function setPerkEmoji(idx, emoji) {
      const input = document.getElementById(`editPerk${idx}Emoji`);
      if (input) input.value = emoji;
      const hEmoji = document.getElementById(`perk${idx + 1}HeaderEmoji`);
      if (hEmoji) hEmoji.textContent = emoji;
    }

    function previewActModalImg(url) {
      const converted = formatDirectImageUrl(url);
      const img = document.getElementById('editActModalImgPreview');
      if (img && converted) img.src = converted;
    }

    // ==========================================
    // 12.2 COMPLIMENTARY ACTIVITIES CONTROLLER
    // ==========================================
    function renderActivitiesSection() {
      // 1. Header Rendering
      const subEl = document.getElementById('actSubtitleEl');
      const titleEl = document.getElementById('actTitleEl');
      const descEl = document.getElementById('actDescEl');
      const triggerEl = document.getElementById('actHeaderAdminTrigger');

      if (subEl) subEl.textContent = SITE_ACTIVITIES_HEADER.subtitle || DEFAULT_ACTIVITIES_HEADER.subtitle;
      if (titleEl) {
        titleEl.textContent = SITE_ACTIVITIES_HEADER.title || DEFAULT_ACTIVITIES_HEADER.title;
        const sizeClass = SITE_ACTIVITIES_HEADER.titleSize === 'xl' 
          ? 'text-3xl sm:text-4xl lg:text-5xl' 
          : (SITE_ACTIVITIES_HEADER.titleSize === 'large' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl');
        const weightClass = SITE_ACTIVITIES_HEADER.titleWeight === 'extrabold'
          ? 'font-black'
          : (SITE_ACTIVITIES_HEADER.titleWeight === 'bold' ? 'font-bold' : 'font-semibold');
        titleEl.className = `${sizeClass} ${weightClass} text-zen-dark`;
      }
      if (descEl) descEl.textContent = SITE_ACTIVITIES_HEADER.desc || DEFAULT_ACTIVITIES_HEADER.desc;
      if (triggerEl) {
        if (isAdminMode) triggerEl.classList.remove('hidden');
        else triggerEl.classList.add('hidden');
      }

      // 2. Cards Grid Rendering
      const container = document.getElementById('activitiesGridContainer');
      if (!container) return;
      container.innerHTML = '';

      SITE_ACTIVITIES.forEach(item => {
        const palette = getThemeColorPalette(item.colorTheme || 'blue');
        const emojiSizeClass = item.emojiSize === 'large' ? 'text-2xl sm:text-3xl w-14 h-14' : 'text-lg sm:text-xl w-11 h-11 sm:w-12 sm:h-12';
        const titleSizeClass = item.fontSize === 'large' ? 'text-sm sm:text-base font-bold' : 'text-xs sm:text-sm font-medium';

        const editBtnHtml = isAdminMode ? `
          <button onclick="event.stopPropagation(); openActivityCardEditModal('${item.id}')" class="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-900 shadow-md flex items-center justify-center text-xs transition-transform active:scale-90" title="แก้ไขการ์ด & รายละเอียด">
            <i class="fa-solid fa-pen"></i>
          </button>
        ` : '';

        const card = document.createElement('div');
        const photo = (item.modalData && item.modalData.img) ? formatDirectImageUrl(item.modalData.img) : '';
        card.className = 'act-tile group relative cursor-pointer';
        card.setAttribute('onclick', `openActivityModal('${item.id}')`);
        card.innerHTML = `
          ${editBtnHtml}
          <img class="act-tile-img needs-photo" src="${photo}" alt="${String(item.title || '').replace(/"/g, '&quot;')}" loading="lazy" decoding="async">
          <span class="act-free">ฟรี</span>
          <div class="act-tile-body absolute inset-x-0 bottom-0">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <span class="act-more">${item.detailBtnText || 'ดูรายละเอียด →'}</span>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function openActivitiesHeaderEditModal() {
      document.getElementById('editActHeaderSubtitle').value = SITE_ACTIVITIES_HEADER.subtitle || DEFAULT_ACTIVITIES_HEADER.subtitle;
      document.getElementById('editActHeaderTitle').value = SITE_ACTIVITIES_HEADER.title || DEFAULT_ACTIVITIES_HEADER.title;
      document.getElementById('editActHeaderTitleSize').value = SITE_ACTIVITIES_HEADER.titleSize || 'normal';
      document.getElementById('editActHeaderTitleWeight').value = SITE_ACTIVITIES_HEADER.titleWeight || 'semibold';
      document.getElementById('editActHeaderDesc').value = SITE_ACTIVITIES_HEADER.desc || DEFAULT_ACTIVITIES_HEADER.desc;

      const m = document.getElementById('editActivitiesHeaderModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeActivitiesHeaderEditModal() {
      const m = document.getElementById('editActivitiesHeaderModal');
      if (m) {
        m.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveActivitiesHeaderEdit(isDirectPublish = false) {
      SITE_ACTIVITIES_HEADER.subtitle = document.getElementById('editActHeaderSubtitle').value.trim() || DEFAULT_ACTIVITIES_HEADER.subtitle;
      SITE_ACTIVITIES_HEADER.title = document.getElementById('editActHeaderTitle').value.trim() || DEFAULT_ACTIVITIES_HEADER.title;
      SITE_ACTIVITIES_HEADER.titleSize = document.getElementById('editActHeaderTitleSize').value;
      SITE_ACTIVITIES_HEADER.titleWeight = document.getElementById('editActHeaderTitleWeight').value;
      SITE_ACTIVITIES_HEADER.desc = document.getElementById('editActHeaderDesc').value.trim() || DEFAULT_ACTIVITIES_HEADER.desc;

      try {
        localStorage.setItem('baantaphai_act_header_v3', JSON.stringify(SITE_ACTIVITIES_HEADER));
      } catch(e) {}

      closeActivitiesHeaderEditModal();
      renderActivitiesSection();
      handleSectionSave('activitiesHeader', 'แก้ไขหัวข้อกิจกรรมฟรี (Resort Experience)', isDirectPublish);
    }

    function openActivityCardEditModal(actId) {
      const item = SITE_ACTIVITIES.find(a => a.id === actId);
      if (!item) return;

      document.getElementById('editActCardId').value = item.id;
      document.getElementById('editActCardHeaderEmoji').textContent = item.emoji;
      document.getElementById('editActCardHeaderTitle').textContent = `แก้ไขกิจกรรม: ${item.title}`;

      // Card Front View
      document.getElementById('editActCardEmoji').value = item.emoji;
      document.getElementById('editActCardTitle').value = item.title;
      document.getElementById('editActCardDesc').value = item.desc;
      document.getElementById('editActCardTheme').value = item.colorTheme || 'blue';
      document.getElementById('editActCardFontSize').value = item.fontSize || 'normal';
      document.getElementById('editActCardEmojiSize').value = item.emojiSize || 'normal';
      document.getElementById('editActCardBtnText').value = item.detailBtnText || 'ดูรายละเอียด →';

      // Popup Detail Modal
      const mData = item.modalData || {};
      document.getElementById('editActModalBadge').value = mData.badge || '';
      document.getElementById('editActModalTime').value = mData.time || '';
      document.getElementById('editActModalTitle').value = mData.title || item.title;
      const imgVal = formatDirectImageUrl(mData.img || '');
      document.getElementById('editActModalImg').value = imgVal;
      previewActModalImg(imgVal);
      document.getElementById('editActModalDesc').value = mData.desc || '';

      const perks = mData.perks || [];
      document.getElementById('editActModalPerk0').value = perks[0] || '';
      document.getElementById('editActModalPerk1').value = perks[1] || '';
      document.getElementById('editActModalPerk2').value = perks[2] || '';
      document.getElementById('editActModalPerk3').value = perks[3] || '';

      document.getElementById('editActModalTip').value = mData.tip || '';
      document.getElementById('editActModalLineMsg').value = mData.lineMsg || '';

      // Close customer modal if open
      closeActivityModal();

      const m = document.getElementById('editActivityCardModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeActivityCardEditModal() {
      const m = document.getElementById('editActivityCardModal');
      if (m) {
        m.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveActivityCardEdit(isDirectPublish = false) {
      const id = document.getElementById('editActCardId').value;
      const item = SITE_ACTIVITIES.find(a => a.id === id);
      if (!item) return;

      item.emoji = document.getElementById('editActCardEmoji').value.trim() || '🛶';
      item.title = document.getElementById('editActCardTitle').value.trim();
      item.desc = document.getElementById('editActCardDesc').value.trim();
      item.colorTheme = document.getElementById('editActCardTheme').value;
      item.fontSize = document.getElementById('editActCardFontSize').value;
      item.emojiSize = document.getElementById('editActCardEmojiSize').value;
      item.detailBtnText = document.getElementById('editActCardBtnText').value.trim() || 'ดูรายละเอียด →';

      if (!item.modalData) item.modalData = {};
      item.modalData.badge = document.getElementById('editActModalBadge').value.trim();
      item.modalData.time = document.getElementById('editActModalTime').value.trim();
      item.modalData.title = document.getElementById('editActModalTitle').value.trim() || item.title;
      item.modalData.img = formatDirectImageUrl(document.getElementById('editActModalImg').value.trim());
      item.modalData.desc = document.getElementById('editActModalDesc').value.trim();

      const perks = [
        document.getElementById('editActModalPerk0').value.trim(),
        document.getElementById('editActModalPerk1').value.trim(),
        document.getElementById('editActModalPerk2').value.trim(),
        document.getElementById('editActModalPerk3').value.trim()
      ].filter(p => p.length > 0);
      item.modalData.perks = perks;

      item.modalData.tip = document.getElementById('editActModalTip').value.trim();
      item.modalData.lineMsg = document.getElementById('editActModalLineMsg').value.trim();

      try {
        localStorage.setItem('baantaphai_act_items_v3', JSON.stringify(SITE_ACTIVITIES));
      } catch(e) {}

      closeActivityCardEditModal();
      renderActivitiesSection();
      handleSectionSave('activities', `แก้ไขกิจกรรม: ${item.title}`, isDirectPublish);
    }

    // ==========================================
    // 12.3 ROOMS SECTION HEADER & PERKS CONTROLLER
    // ==========================================
    function renderRoomsHeaderAndPerks() {
      // 1. Rooms Header
      const subEl = document.getElementById('roomsSubtitleEl');
      const titleEl = document.getElementById('roomsTitleEl');
      const descEl = document.getElementById('roomsDescEl');
      const noteEl = document.getElementById('roomsPriceNoteEl');
      const triggerEl = document.getElementById('roomsHeaderAdminTrigger');
      const perksTriggerEl = document.getElementById('perksAdminTrigger');

      if (subEl) subEl.textContent = SITE_ROOMS_HEADER.subtitle || DEFAULT_ROOMS_HEADER.subtitle;
      if (titleEl) {
        titleEl.textContent = SITE_ROOMS_HEADER.title || DEFAULT_ROOMS_HEADER.title;
        const sizeClass = SITE_ROOMS_HEADER.titleSize === 'large' ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl';
        const weightClass = SITE_ROOMS_HEADER.titleWeight === 'bold' ? 'font-bold' : 'font-semibold';
        titleEl.className = `${sizeClass} ${weightClass} text-zen-dark`;
      }
      if (descEl) descEl.textContent = SITE_ROOMS_HEADER.desc || DEFAULT_ROOMS_HEADER.desc;
      if (noteEl) noteEl.innerHTML = SITE_ROOMS_HEADER.note || DEFAULT_ROOMS_HEADER.note;

      if (triggerEl) {
        if (isAdminMode) triggerEl.classList.remove('hidden');
        else triggerEl.classList.add('hidden');
      }
      if (perksTriggerEl) {
        if (isAdminMode) perksTriggerEl.classList.remove('hidden');
        else perksTriggerEl.classList.add('hidden');
      }

      // 2. Perks Grid
      const perksContainer = document.getElementById('perksGridContainer');
      if (!perksContainer) return;
      perksContainer.innerHTML = '';

      SITE_PERKS.forEach((perk, idx) => {
        const palette = getThemeColorPalette(perk.colorTheme || 'amber');
        const isLargeFont = perk.fontSize === 'large' || SITE_PERKS_FONT_SIZE === 'large';
        const titleClass = isLargeFont ? 'text-sm font-bold' : 'text-xs font-semibold';
        const descClass = isLargeFont ? 'text-xs' : 'text-[11px]';
        const emojiSizeClass = perk.emojiSize === 'large' ? 'w-11 h-11 text-2xl' : 'w-9 h-9 text-lg';

        const editBtnHtml = isAdminMode ? `
          <button onclick="event.stopPropagation(); openPerksEditModal()" class="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-900 shadow-md flex items-center justify-center text-[10px] transition-transform active:scale-90" title="แก้ไขสิทธิพิเศษ">
            <i class="fa-solid fa-pen"></i>
          </button>
        ` : '';

        const card = document.createElement('div');
        card.className = `relative p-3.5 sm:p-4 rounded-2xl bg-white border border-zen-cardborder shadow-minimal flex items-start gap-3 transition-all hover:border-zen-torii/50`;
        if (isAdminMode) {
          card.onclick = () => openPerksEditModal();
          card.style.cursor = 'pointer';
        }
        card.innerHTML = `
          ${editBtnHtml}
          <div class="${emojiSizeClass} rounded-xl ${palette.bg} ${palette.text} flex items-center justify-center shrink-0 border ${palette.border}">
            ${perk.emoji}
          </div>
          <div class="text-left leading-snug">
            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${palette.badgeBg} ${palette.badgeText} uppercase">${perk.badge}</span>
              <p class="${titleClass} text-zen-dark">${perk.title}</p>
            </div>
            <p class="${descClass} text-zen-muted mt-1 font-light">${perk.desc}</p>
          </div>
        `;
        perksContainer.appendChild(card);
      });
    }

    function openRoomsHeaderEditModal() {
      document.getElementById('editRoomsSubtitle').value = SITE_ROOMS_HEADER.subtitle || DEFAULT_ROOMS_HEADER.subtitle;
      document.getElementById('editRoomsTitle').value = SITE_ROOMS_HEADER.title || DEFAULT_ROOMS_HEADER.title;
      document.getElementById('editRoomsTitleSize').value = SITE_ROOMS_HEADER.titleSize || 'normal';
      document.getElementById('editRoomsTitleWeight').value = SITE_ROOMS_HEADER.titleWeight || 'semibold';
      document.getElementById('editRoomsDesc').value = SITE_ROOMS_HEADER.desc || DEFAULT_ROOMS_HEADER.desc;
      document.getElementById('editRoomsPriceNote').value = SITE_ROOMS_HEADER.note || DEFAULT_ROOMS_HEADER.note;

      const m = document.getElementById('editRoomsHeaderModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeRoomsHeaderEditModal() {
      const m = document.getElementById('editRoomsHeaderModal');
      if (m) {
        m.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveRoomsHeaderEdit(isDirectPublish = false) {
      SITE_ROOMS_HEADER.subtitle = document.getElementById('editRoomsSubtitle').value.trim() || DEFAULT_ROOMS_HEADER.subtitle;
      SITE_ROOMS_HEADER.title = document.getElementById('editRoomsTitle').value.trim() || DEFAULT_ROOMS_HEADER.title;
      SITE_ROOMS_HEADER.titleSize = document.getElementById('editRoomsTitleSize').value;
      SITE_ROOMS_HEADER.titleWeight = document.getElementById('editRoomsTitleWeight').value;
      SITE_ROOMS_HEADER.desc = document.getElementById('editRoomsDesc').value.trim() || DEFAULT_ROOMS_HEADER.desc;
      SITE_ROOMS_HEADER.note = document.getElementById('editRoomsPriceNote').value.trim() || DEFAULT_ROOMS_HEADER.note;

      try {
        localStorage.setItem('baantaphai_rooms_header_v3', JSON.stringify(SITE_ROOMS_HEADER));
      } catch(e) {}

      closeRoomsHeaderEditModal();
      renderRoomsHeaderAndPerks();
      handleSectionSave('roomsHeader', 'แก้ไขหัวข้อและหมายเหตุห้องพัก', isDirectPublish);
    }

    function openPerksEditModal() {
      document.getElementById('editPerksFontSize').value = SITE_PERKS_FONT_SIZE || 'normal';

      SITE_PERKS.forEach((perk, idx) => {
        const eInput = document.getElementById(`editPerk${idx}Emoji`);
        const bInput = document.getElementById(`editPerk${idx}Badge`);
        const cSelect = document.getElementById(`editPerk${idx}Color`);
        const tInput = document.getElementById(`editPerk${idx}Title`);
        const dInput = document.getElementById(`editPerk${idx}Desc`);
        const hEmoji = document.getElementById(`perk${idx + 1}HeaderEmoji`);

        if (eInput) eInput.value = perk.emoji || '';
        if (hEmoji) hEmoji.textContent = perk.emoji || '';
        if (bInput) bInput.value = perk.badge || '';
        if (cSelect) cSelect.value = perk.colorTheme || 'amber';
        if (tInput) tInput.value = perk.title || '';
        if (dInput) dInput.value = perk.desc || '';
      });

      const m = document.getElementById('editPerksModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closePerksEditModal() {
      const m = document.getElementById('editPerksModal');
      if (m) {
        m.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function savePerksEdit(isDirectPublish = false) {
      SITE_PERKS_FONT_SIZE = document.getElementById('editPerksFontSize').value;

      SITE_PERKS.forEach((perk, idx) => {
        const eVal = document.getElementById(`editPerk${idx}Emoji`).value.trim();
        const bVal = document.getElementById(`editPerk${idx}Badge`).value.trim();
        const cVal = document.getElementById(`editPerk${idx}Color`).value;
        const tVal = document.getElementById(`editPerk${idx}Title`).value.trim();
        const dVal = document.getElementById(`editPerk${idx}Desc`).value.trim();

        perk.emoji = eVal || perk.emoji;
        perk.badge = bVal || perk.badge;
        perk.colorTheme = cVal || perk.colorTheme;
        perk.title = tVal || perk.title;
        perk.desc = dVal || perk.desc;
        perk.fontSize = SITE_PERKS_FONT_SIZE;
      });

      try {
        localStorage.setItem('baantaphai_perks_v3', JSON.stringify(SITE_PERKS));
        localStorage.setItem('baantaphai_perks_font_size_v3', SITE_PERKS_FONT_SIZE);
      } catch(e) {}

      closePerksEditModal();
      renderRoomsHeaderAndPerks();
      handleSectionSave('perks', 'แก้ไขสิทธิพิเศษ 3 ช่อง (Special Perks)', isDirectPublish);
    }

    // ==========================================
    // 10.0 LOGO & BRANDING RENDERER & CONTROLLER
    // ==========================================
    function renderLogoSection() {
      const navIcon = document.getElementById('navLogoIcon');
      const navImg = document.getElementById('navLogoImg');
      const navTitle = document.getElementById('navLogoTitle');
      const navSubtitle = document.getElementById('navLogoSubtitle');
      const logoTrigger = document.getElementById('logoAdminTrigger');

      const drawerIcon = document.getElementById('drawerLogoIcon');
      const drawerImg = document.getElementById('drawerLogoImg');
      const drawerTitle = document.getElementById('drawerLogoTitle');

      const footerIcon = document.getElementById('footerLogoIcon');
      const footerImg = document.getElementById('footerLogoImg');
      const footerTitle = document.getElementById('footerLogoTitle');

      const logo = SITE_LOGO || DEFAULT_LOGO_DATA;
      const isImg = logo.type === 'image' && logo.imageUrl && logo.imageUrl.trim() !== '';

      if (navTitle) navTitle.textContent = logo.title || 'Baan Ta Phai';
      if (navSubtitle) navSubtitle.textContent = logo.subtitle || 'Resort Ayutthaya';
      if (drawerTitle) drawerTitle.textContent = logo.titleTh || logo.title || 'บ้านตาผายรีสอร์ท';
      if (footerTitle) footerTitle.textContent = `${logo.title || 'Baan Ta Phai'} Resort`;

      // Page Title & Open Graph Sync
      const pTitle = logo.pageTitle || 'บ้านตาผายรีสอร์ท | Ta Phai Country House Resort & Restaurant';
      if (document.title !== pTitle) document.title = pTitle;
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) ogTitleMeta.setAttribute('content', pTitle);
      const ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]');
      if (ogSiteNameMeta) ogSiteNameMeta.setAttribute('content', `${logo.titleTh || 'บ้านตาผายรีสอร์ท'} (${logo.title || 'Ta Phai Country House'})`);

      if (isImg) {
        const directUrl = formatDirectImageUrl(logo.imageUrl);
        if (navImg) { navImg.src = directUrl; navImg.classList.remove('hidden'); }
        if (navIcon) navIcon.classList.add('hidden');
        if (drawerImg) { drawerImg.src = directUrl; drawerImg.classList.remove('hidden'); }
        if (drawerIcon) drawerIcon.classList.add('hidden');
        if (footerImg) { footerImg.src = directUrl; footerImg.classList.remove('hidden'); }
        if (footerIcon) footerIcon.classList.add('hidden');
      } else {
        const iconCls = logo.iconClass || 'fa-solid fa-torii-gate';
        if (navImg) navImg.classList.add('hidden');
        if (navIcon) { navIcon.className = `${iconCls} text-xs sm:text-lg text-zen-torii`; navIcon.classList.remove('hidden'); }
        if (drawerImg) drawerImg.classList.add('hidden');
        if (drawerIcon) { drawerIcon.className = iconCls; drawerIcon.classList.remove('hidden'); }
        if (footerImg) footerImg.classList.add('hidden');
        if (footerIcon) { footerIcon.className = `${iconCls} text-zen-torii text-sm`; footerIcon.classList.remove('hidden'); }
      }

      if (logoTrigger) {
        if (isAdminMode) logoTrigger.classList.remove('hidden');
        else logoTrigger.classList.add('hidden');
      }
    }

    function toggleLogoTypeInputs() {
      const isImg = document.getElementById('logoTypeImage').checked;
      const imgGroup = document.getElementById('logoImageInputGroup');
      const iconGroup = document.getElementById('logoIconInputGroup');
      if (isImg) {
        imgGroup.classList.remove('hidden');
        iconGroup.classList.add('hidden');
      } else {
        imgGroup.classList.add('hidden');
        iconGroup.classList.remove('hidden');
      }
      previewLogoInModal();
    }

    function handleLogoFileUpload(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      const fileNameEl = document.getElementById('logoFileName');
      if (fileNameEl) fileNameEl.textContent = `⏳ กำลังประมวลผล ${file.name}...`;

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const maxDim = 320;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/png');
          document.getElementById('editLogoImageUrl').value = dataUrl;
          if (fileNameEl) fileNameEl.textContent = `✓ ${file.name}`;
          previewLogoInModal();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function previewLogoInModal() {
      const isImg = document.getElementById('logoTypeImage').checked;
      const imgUrl = document.getElementById('editLogoImageUrl').value.trim();
      const iconCls = document.getElementById('editLogoIconClass').value;
      const title = document.getElementById('editLogoTitle').value.trim() || 'Baan Ta Phai';
      const subtitle = document.getElementById('editLogoSubtitle').value.trim() || 'Resort Ayutthaya';

      const pBox = document.getElementById('modalLogoPreviewBox');
      const pIcon = document.getElementById('modalLogoPreviewIcon');
      const pImg = document.getElementById('modalLogoPreviewImg');
      const pTitle = document.getElementById('modalLogoPreviewTitle');
      const pSub = document.getElementById('modalLogoPreviewSubtitle');

      if (pTitle) pTitle.textContent = title;
      if (pSub) pSub.textContent = subtitle;

      if (isImg && imgUrl) {
        if (pImg) { pImg.src = formatDirectImageUrl(imgUrl); pImg.classList.remove('hidden'); }
        if (pIcon) pIcon.classList.add('hidden');
      } else {
        if (pImg) pImg.classList.add('hidden');
        if (pIcon) { pIcon.className = `${iconCls} text-base text-zen-torii`; pIcon.classList.remove('hidden'); }
      }
    }

    function openLogoEditModal() {
      const logo = SITE_LOGO || DEFAULT_LOGO_DATA;
      document.getElementById('editLogoTitle').value = logo.title || '';
      document.getElementById('editLogoSubtitle').value = logo.subtitle || '';
      document.getElementById('editLogoTitleTh').value = logo.titleTh || 'บ้านตาผายรีสอร์ท';
      document.getElementById('editPageTitle').value = logo.pageTitle || 'บ้านตาผายรีสอร์ท | Ta Phai Country House Resort & Restaurant';
      document.getElementById('editLogoImageUrl').value = logo.imageUrl || '';
      document.getElementById('editLogoIconClass').value = logo.iconClass || 'fa-solid fa-torii-gate';

      if (logo.type === 'image') {
        document.getElementById('logoTypeImage').checked = true;
      } else {
        document.getElementById('logoTypeIcon').checked = true;
      }

      const fileNameEl = document.getElementById('logoFileName');
      if (fileNameEl) {
        fileNameEl.textContent = (logo.imageUrl && logo.imageUrl.startsWith('data:')) ? '✓ มีรูปภาพที่อัปโหลดไว้แล้ว' : 'รองรับ PNG, JPG, WebP';
      }

      toggleLogoTypeInputs();
      document.getElementById('editLogoModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeLogoEditModal() {
      document.getElementById('editLogoModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function openFontModal() {
      document.getElementById('selectFontHeading').value = SITE_TYPOGRAPHY.heading || 'ibm';
      document.getElementById('selectFontCardTitle').value = SITE_TYPOGRAPHY.cardTitle || 'ibm';
      document.getElementById('selectFontBody').value = SITE_TYPOGRAPHY.body || 'ibm';

      previewGranularTypography();
      document.getElementById('editFontModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeFontModal() {
      applySiteTypography();
      document.getElementById('editFontModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function previewGranularTypography() {
      const hVal = document.getElementById('selectFontHeading').value;
      const cVal = document.getElementById('selectFontCardTitle').value;
      const bVal = document.getElementById('selectFontBody').value;

      const pHead = document.getElementById('previewHeadingBox');
      const pCard = document.getElementById('previewCardTitleBox');
      const pBody = document.getElementById('previewBodyBox');

      if (pHead && FONT_MAP[hVal]) pHead.style.fontFamily = FONT_MAP[hVal].css;
      if (pCard && FONT_MAP[cVal]) pCard.style.fontFamily = FONT_MAP[cVal].css;
      if (pBody && FONT_MAP[bVal]) pBody.style.fontFamily = FONT_MAP[bVal].css;

      applySiteTypography({ heading: hVal, cardTitle: cVal, body: bVal });
    }

    function saveSiteFont(isDirectPublish = false) {
      SITE_TYPOGRAPHY.heading = document.getElementById('selectFontHeading').value || 'ibm';
      SITE_TYPOGRAPHY.cardTitle = document.getElementById('selectFontCardTitle').value || 'ibm';
      SITE_TYPOGRAPHY.body = document.getElementById('selectFontBody').value || 'ibm';

      try {
        localStorage.setItem('baantaphai_typography_v3', JSON.stringify(SITE_TYPOGRAPHY));
      } catch(e) {}

      applySiteTypography();
      closeFontModal();
      handleSectionSave('typography', 'แก้ไขสไตล์ฟอนต์หัวข้อและการ์ดย่อย', isDirectPublish);
    }

    function saveLogoEdit(isDirectPublish = false) {
      const isImg = document.getElementById('logoTypeImage').checked;
      SITE_LOGO.type = isImg ? 'image' : 'icon';
      SITE_LOGO.title = document.getElementById('editLogoTitle').value.trim() || 'Baan Ta Phai';
      SITE_LOGO.subtitle = document.getElementById('editLogoSubtitle').value.trim() || 'Resort Ayutthaya';
      SITE_LOGO.titleTh = document.getElementById('editLogoTitleTh').value.trim() || 'บ้านตาผายรีสอร์ท';
      SITE_LOGO.pageTitle = document.getElementById('editPageTitle').value.trim() || 'บ้านตาผายรีสอร์ท | Ta Phai Country House Resort & Restaurant';
      SITE_LOGO.imageUrl = formatDirectImageUrl(document.getElementById('editLogoImageUrl').value.trim());
      SITE_LOGO.iconClass = document.getElementById('editLogoIconClass').value;

      try {
        localStorage.setItem('baantaphai_logo_v3', JSON.stringify(SITE_LOGO));
      } catch(e) {}

      closeLogoEditModal();
      renderLogoSection();
      handleSectionSave('logo', 'แก้ไขโลโก้และชื่อแบรนด์รีสอร์ท', isDirectPublish);
    }

    // ==========================================
    // 10.05 MASTER NAVBAR & MENU LINKS RENDERER & CONTROLLER
    // ==========================================
    // Resolve nav links to real on-page anchors. Placeholder text ("รอใส่") is matched to a section by the
    // item's label. Display-only: it never rewrites the saved/cloud data, so an admin-set link always wins.
    const NAV_LINK_SLOTS = [
      ['menuRooms', 'menuRoomsHref'], ['menuDining', 'menuDiningHref'], ['menuReviews', 'menuReviewsHref'],
      ['subItemFeed', 'subItemFeedHref'], ['subItemPhotoSpots', 'subItemPhotoSpotsHref'], ['subItemFaq', 'subItemFaqHref']
    ];
    const NAV_LABEL_TARGETS = [
      [/หน้าหลัก|หน้าแรก|home/i, '#hero'],
      [/ท่องเที่ยว|สถานที่|ใกล้เคียง/i, '#attractions'],
      [/ถ่ายรูป|มุมถ่าย|photo/i, '#photospots'],
      [/อาหาร|เครื่องดื่ม|คาเฟ่|ร้านอาหาร|cafe|menu/i, '#dining'],
      [/รีวิว|review/i, '#reviews'],
      [/facebook|เฟซบุ๊ก|เพจ|ฟีด/i, '#facebook-feed'],
      [/คำถาม|faq/i, '#faq'],
      [/เงื่อนไข|เดินทาง|ติดต่อ|แผนที่/i, '#info'],
      [/กิจกรรม/i, '#highlights'],
      [/ห้องพัก|บ้านพัก|ที่พัก|room/i, '#rooms']
    ];
    function isNavPlaceholderHref(h) {
      h = (h || '').trim();
      return !h || (!/^(#|https?:|tel:|mailto:|line:|\/|\.)/i.test(h) && /[฀-๿]/.test(h));
    }
    function fixNavHrefs(menu) {
      const out = { ...menu };
      NAV_LINK_SLOTS.forEach(([labelKey, hrefKey]) => {
        const label = out[labelKey] || '';
        const fromLabel = (NAV_LABEL_TARGETS.find(([re]) => re.test(label)) || [])[1];
        const href = (out[hrefKey] || '').trim();
        if (isNavPlaceholderHref(href)) out[hrefKey] = fromLabel || DEFAULT_NAV_MENU_DATA[hrefKey] || '#';
      });
      return out;
    }

    function renderNavMenuSection() {
      const menu = fixNavHrefs(SITE_NAV_MENU || DEFAULT_NAV_MENU_DATA);

      // 1. Desktop Items
      const linkRooms = document.getElementById('navLinkRooms');
      const textRooms = document.getElementById('navLinkRoomsText');
      if (linkRooms && menu.menuRoomsHref) linkRooms.setAttribute('href', menu.menuRoomsHref);
      if (textRooms) textRooms.textContent = menu.menuRooms || 'ห้องพัก';

      const linkDining = document.getElementById('navLinkDining');
      const textDining = document.getElementById('navLinkDiningText');
      if (linkDining && menu.menuDiningHref) linkDining.setAttribute('href', menu.menuDiningHref);
      if (textDining) textDining.textContent = menu.menuDining || 'คาเฟ่ & อาหาร';

      const linkReviews = document.getElementById('navLinkReviews');
      const iconReviews = document.getElementById('navLinkReviewsIcon');
      const textReviews = document.getElementById('navLinkReviewsText');
      if (linkReviews && menu.menuReviewsHref) linkReviews.setAttribute('href', menu.menuReviewsHref);
      if (textReviews) textReviews.textContent = menu.menuReviews || 'รีวิว 4.7★';
      if (iconReviews) {
        const ic = menu.menuReviewsIcon || 'fa-solid fa-star text-amber-500 text-xs';
        if (ic.includes('fa-')) { iconReviews.className = ic; iconReviews.textContent = ''; }
        else { iconReviews.className = 'not-italic'; iconReviews.textContent = ic; }
      }

      // Dropdown header & items
      const dropTitle = document.getElementById('navDropdownTitle');
      if (dropTitle) dropTitle.textContent = menu.dropdownTitle || 'ข้อมูลแนะนำ';

      const linkSubFeed = document.getElementById('navSubFeed');
      const iconSubFeed = document.getElementById('navSubFeedIcon');
      const textSubFeed = document.getElementById('navSubFeedText');
      if (linkSubFeed && menu.subItemFeedHref) linkSubFeed.setAttribute('href', menu.subItemFeedHref);
      if (textSubFeed) textSubFeed.textContent = menu.subItemFeed || 'ฟีดสดเพจ Facebook';
      if (iconSubFeed) {
        const ic = menu.subItemFeedIcon || 'fa-brands fa-facebook text-[#1465D8]';
        if (ic.includes('fa-')) { iconSubFeed.className = (ic.includes('w-4') ? ic : ic + ' w-4 text-center'); iconSubFeed.textContent = ''; }
        else { iconSubFeed.className = 'not-italic w-4 text-center inline-block'; iconSubFeed.textContent = ic; }
      }

      const linkSubPhoto = document.getElementById('navSubPhotoSpots');
      const iconSubPhoto = document.getElementById('navSubPhotoSpotsIcon');
      const textSubPhoto = document.getElementById('navSubPhotoSpotsText');
      if (linkSubPhoto && menu.subItemPhotoSpotsHref) linkSubPhoto.setAttribute('href', menu.subItemPhotoSpotsHref);
      if (textSubPhoto) textSubPhoto.textContent = menu.subItemPhotoSpots || '6 จุดถ่ายรูปยอดฮิต';
      if (iconSubPhoto) {
        const ic = menu.subItemPhotoSpotsIcon || 'fa-solid fa-camera text-rose-500';
        if (ic.includes('fa-')) { iconSubPhoto.className = (ic.includes('w-4') ? ic : ic + ' w-4 text-center'); iconSubPhoto.textContent = ''; }
        else { iconSubPhoto.className = 'not-italic w-4 text-center inline-block'; iconSubPhoto.textContent = ic; }
      }

      const linkSubFaq = document.getElementById('navSubFaq');
      const iconSubFaq = document.getElementById('navSubFaqIcon');
      const textSubFaq = document.getElementById('navSubFaqText');
      if (linkSubFaq && menu.subItemFaqHref) linkSubFaq.setAttribute('href', menu.subItemFaqHref);
      if (textSubFaq) textSubFaq.textContent = menu.subItemFaq || 'คำถามที่พบบ่อย (FAQ)';
      if (iconSubFaq) {
        const ic = menu.subItemFaqIcon || 'fa-solid fa-circle-question text-purple-600';
        if (ic.includes('fa-')) { iconSubFaq.className = (ic.includes('w-4') ? ic : ic + ' w-4 text-center'); iconSubFaq.textContent = ''; }
        else { iconSubFaq.className = 'not-italic w-4 text-center inline-block'; iconSubFaq.textContent = ic; }
      }

      // 2. Mobile Drawer Items
      const mLinkRooms = document.getElementById('mobileNavLinkRooms');
      const mTextRooms = document.getElementById('mobileNavRoomsText');
      if (mLinkRooms && menu.menuRoomsHref) mLinkRooms.setAttribute('href', menu.menuRoomsHref);
      if (mTextRooms && menu.menuRooms) mTextRooms.textContent = menu.menuRooms;

      const mLinkDining = document.getElementById('mobileNavLinkDining');
      const mTextDining = document.getElementById('mobileNavDiningText');
      if (mLinkDining && menu.menuDiningHref) mLinkDining.setAttribute('href', menu.menuDiningHref);
      if (mTextDining && menu.menuDining) mTextDining.textContent = menu.menuDining;

      const mLinkReviews = document.getElementById('mobileNavLinkReviews');
      const mTextReviews = document.getElementById('mobileNavReviewsText');
      if (mLinkReviews && menu.menuReviewsHref) mLinkReviews.setAttribute('href', menu.menuReviewsHref);
      if (mTextReviews && menu.menuReviews) mTextReviews.textContent = menu.menuReviews;

      const mLinkFeed = document.getElementById('mobileNavLinkFeed');
      const mIconFeed = document.getElementById('mobileNavFeedIcon');
      const mTextFeed = document.getElementById('mobileNavFeedText');
      if (mLinkFeed && menu.subItemFeedHref) mLinkFeed.setAttribute('href', menu.subItemFeedHref);
      if (mTextFeed && menu.subItemFeed) mTextFeed.textContent = menu.subItemFeed;
      if (mIconFeed && menu.subItemFeedIcon) {
        const ic = menu.subItemFeedIcon;
        if (ic.includes('fa-')) { mIconFeed.className = (ic.includes('w-5') ? ic : ic + ' w-5 text-center'); mIconFeed.textContent = ''; }
        else { mIconFeed.className = 'not-italic w-5 text-center inline-block'; mIconFeed.textContent = ic; }
      }

      const mLinkPhoto = document.getElementById('mobileNavLinkPhotoSpots');
      const mIconPhoto = document.getElementById('mobileNavPhotoSpotsIcon');
      const mTextPhoto = document.getElementById('mobileNavPhotoSpotsText');
      if (mLinkPhoto && menu.subItemPhotoSpotsHref) mLinkPhoto.setAttribute('href', menu.subItemPhotoSpotsHref);
      if (mTextPhoto && menu.subItemPhotoSpots) mTextPhoto.textContent = menu.subItemPhotoSpots;
      if (mIconPhoto && menu.subItemPhotoSpotsIcon) {
        const ic = menu.subItemPhotoSpotsIcon;
        if (ic.includes('fa-')) { mIconPhoto.className = (ic.includes('w-5') ? ic : ic + ' w-5 text-center'); mIconPhoto.textContent = ''; }
        else { mIconPhoto.className = 'not-italic w-5 text-center inline-block'; mIconPhoto.textContent = ic; }
      }

      const mLinkFaq = document.getElementById('mobileNavLinkFaq');
      const mIconFaq = document.getElementById('mobileNavFaqIcon');
      const mTextFaq = document.getElementById('mobileNavFaqText');
      if (mLinkFaq && menu.subItemFaqHref) mLinkFaq.setAttribute('href', menu.subItemFaqHref);
      if (mTextFaq && menu.subItemFaq) mTextFaq.textContent = menu.subItemFaq;
      if (mIconFaq && menu.subItemFaqIcon) {
        const ic = menu.subItemFaqIcon;
        if (ic.includes('fa-')) { mIconFaq.className = (ic.includes('w-5') ? ic : ic + ' w-5 text-center'); mIconFaq.textContent = ''; }
        else { mIconFaq.className = 'not-italic w-5 text-center inline-block'; mIconFaq.textContent = ic; }
      }

      // 3. In-place Admin Trigger
      const navMenuAdminTrigger = document.getElementById('navMenuAdminTrigger');
      if (navMenuAdminTrigger) {
        if (isAdminMode) navMenuAdminTrigger.classList.remove('hidden');
        else navMenuAdminTrigger.classList.add('hidden');
      }
    }

    function openNavMenuEditModal() {
      const menu = SITE_NAV_MENU || DEFAULT_NAV_MENU_DATA;
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val !== undefined ? val : '';
      };

      setVal('editNavMenuRooms', menu.menuRooms);
      setVal('editNavMenuRoomsHref', menu.menuRoomsHref);
      setVal('editNavMenuDining', menu.menuDining);
      setVal('editNavMenuDiningHref', menu.menuDiningHref);
      setVal('editNavMenuReviews', menu.menuReviews);
      setVal('editNavMenuReviewsIcon', menu.menuReviewsIcon);
      setVal('editNavMenuReviewsHref', menu.menuReviewsHref);
      setVal('editNavDropdownTitle', menu.dropdownTitle);
      setVal('editNavSubFeed', menu.subItemFeed);
      setVal('editNavSubFeedIcon', menu.subItemFeedIcon);
      setVal('editNavSubFeedHref', menu.subItemFeedHref);
      setVal('editNavSubPhotoSpots', menu.subItemPhotoSpots);
      setVal('editNavSubPhotoSpotsIcon', menu.subItemPhotoSpotsIcon);
      setVal('editNavSubPhotoSpotsHref', menu.subItemPhotoSpotsHref);
      setVal('editNavSubFaq', menu.subItemFaq);
      setVal('editNavSubFaqIcon', menu.subItemFaqIcon);
      setVal('editNavSubFaqHref', menu.subItemFaqHref);

      const modal = document.getElementById('editNavMenuModal');
      if (modal) modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeNavMenuEditModal() {
      const modal = document.getElementById('editNavMenuModal');
      if (modal) modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function saveNavMenuEdit(isDirectPublish = false) {
      const getVal = (id, def) => {
        const el = document.getElementById(id);
        return el ? (el.value.trim() || def) : def;
      };

      SITE_NAV_MENU = {
        menuRooms: getVal('editNavMenuRooms', 'ห้องพัก'),
        menuRoomsHref: getVal('editNavMenuRoomsHref', '#rooms'),
        menuDining: getVal('editNavMenuDining', 'คาเฟ่ & อาหาร'),
        menuDiningHref: getVal('editNavMenuDiningHref', '#dining'),
        menuReviews: getVal('editNavMenuReviews', 'รีวิว 4.7★'),
        menuReviewsIcon: getVal('editNavMenuReviewsIcon', 'fa-solid fa-star text-amber-500 text-xs'),
        menuReviewsHref: getVal('editNavMenuReviewsHref', '#reviews'),
        dropdownTitle: getVal('editNavDropdownTitle', 'ข้อมูลแนะนำ'),
        subItemFeed: getVal('editNavSubFeed', 'ฟีดสดเพจ Facebook'),
        subItemFeedIcon: getVal('editNavSubFeedIcon', 'fa-brands fa-facebook text-[#1465D8]'),
        subItemFeedHref: getVal('editNavSubFeedHref', '#facebook-feed'),
        subItemPhotoSpots: getVal('editNavSubPhotoSpots', '6 จุดถ่ายรูปยอดฮิต'),
        subItemPhotoSpotsIcon: getVal('editNavSubPhotoSpotsIcon', 'fa-solid fa-camera text-rose-500'),
        subItemPhotoSpotsHref: getVal('editNavSubPhotoSpotsHref', '#photospots'),
        subItemFaq: getVal('editNavSubFaq', 'คำถามที่พบบ่อย (FAQ)'),
        subItemFaqIcon: getVal('editNavSubFaqIcon', 'fa-solid fa-circle-question text-purple-600'),
        subItemFaqHref: getVal('editNavSubFaqHref', '#faq')
      };

      try {
        localStorage.setItem('baantaphai_nav_menu_v3', JSON.stringify(SITE_NAV_MENU));
      } catch(e) {}

      closeNavMenuEditModal();
      renderNavMenuSection();
      handleSectionSave('navMenu', 'แก้ไขเมนูแถบนำทาง (Navbar Links)', isDirectPublish);
    }

    // ==========================================
    // 10.06 MASTER HEADER ACTIONS (Day/Night Mode, Phone, Messenger, LINE) CONTROLLER
    // ==========================================
    function renderHeaderActionsSection() {
      const cfg = SITE_HEADER_ACTIONS || DEFAULT_HEADER_ACTIONS_DATA;

      // 1. Day / Night mode toggle buttons
      const dayNightBtn = document.getElementById('dayNightBtn');
      const drawerDayNightBtn = document.getElementById('drawerDayNightToggleBtn');
      if (dayNightBtn) {
        dayNightBtn.style.display = (cfg.showDayNight !== false) ? 'flex' : 'none';
      }
      if (drawerDayNightBtn) {
        drawerDayNightBtn.style.display = (cfg.showDayNight !== false) ? 'flex' : 'none';
      }
      const dayNightLabel = document.getElementById('dayNightLabel');
      const drawerDayNightLabel = document.getElementById('drawerDayNightLabel');
      const curLabel = isNightMode 
        ? (cfg.dayNightLabelDay || 'โหมดกลางวัน')
        : (cfg.dayNightLabelNight || 'โหมดกลางคืน');
      if (dayNightLabel) dayNightLabel.textContent = curLabel;
      if (drawerDayNightLabel) drawerDayNightLabel.textContent = curLabel;

      // 2. Phone button
      const navPhoneLink = document.getElementById('navPhoneLink');
      const navPhoneText = document.getElementById('navPhoneText');
      const mPhoneLink = document.getElementById('mobileMenuPhoneLink');
      const mPhoneText = document.getElementById('mobileMenuPhoneText');
      const phoneVal = cfg.phoneText || '062-460-5863';
      let phoneTel = cfg.phoneTel || ('tel:' + phoneVal.replace(/[^0-9+]/g, ''));
      if (!phoneTel.startsWith('tel:') && !phoneTel.startsWith('http')) phoneTel = 'tel:' + phoneTel;

      if (navPhoneText) navPhoneText.textContent = phoneVal;
      if (navPhoneLink) {
        navPhoneLink.href = phoneTel;
        navPhoneLink.style.display = (cfg.showPhone !== false) ? '' : 'none';
      }
      if (mPhoneText) mPhoneText.textContent = `โทร ${phoneVal}`;
      if (mPhoneLink) {
        mPhoneLink.href = phoneTel;
        mPhoneLink.style.display = (cfg.showPhone !== false) ? 'flex' : 'none';
      }

      // 3. Messenger button
      const navMessengerBtn = document.getElementById('navMessengerBtn');
      const navMessengerText = document.getElementById('navMessengerText');
      const mMessengerLink = document.getElementById('mobileMenuMessengerLink');
      const mMessengerText = document.getElementById('mobileMenuMessengerText');
      const mssgText = cfg.messengerText || 'Messenger';
      const mssgUrl = cfg.messengerUrl || 'https://m.me/Baantaphai';

      if (navMessengerText) navMessengerText.textContent = mssgText;
      if (navMessengerBtn) {
        navMessengerBtn.href = mssgUrl;
        navMessengerBtn.style.display = (cfg.showMessenger !== false) ? '' : 'none';
      }
      if (mMessengerText) mMessengerText.textContent = `ทักแชท ${mssgText}`;
      if (mMessengerLink) {
        mMessengerLink.href = mssgUrl;
        mMessengerLink.style.display = (cfg.showMessenger !== false) ? 'flex' : 'none';
      }

      // 4. LINE button
      const navLineBtn = document.getElementById('navLineBtn');
      const navLineText = document.getElementById('navLineText');
      const mLineLink = document.getElementById('mobileMenuLineLink');
      const mLineText = document.getElementById('mobileMenuLineText');
      const lineText = cfg.lineText || 'ทัก LINE';
      const lineUrl = cfg.lineUrl || 'https://line.me/R/ti/p/@baantaphairesort';

      if (navLineText) navLineText.textContent = lineText;
      if (navLineBtn) {
        navLineBtn.href = lineUrl;
        navLineBtn.style.display = (cfg.showLine !== false) ? '' : 'none';
      }
      if (mLineText) mLineText.textContent = `${lineText} Official`;
      if (mLineLink) {
        mLineLink.href = lineUrl;
        mLineLink.style.display = (cfg.showLine !== false) ? 'flex' : 'none';
      }

      // 5. In-place Admin Trigger
      const trigger = document.getElementById('headerActionsAdminTrigger');
      if (trigger) {
        if (isAdminMode) trigger.classList.remove('hidden');
        else trigger.classList.add('hidden');
      }
    }

    function openHeaderActionsEditModal() {
      const cfg = SITE_HEADER_ACTIONS || DEFAULT_HEADER_ACTIONS_DATA;
      const setCheck = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = Boolean(val);
      };
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val !== undefined ? val : '';
      };

      setCheck('editHeaderShowDayNight', cfg.showDayNight !== false);
      setVal('editHeaderDayNightNight', cfg.dayNightLabelNight || 'โหมดกลางคืน');
      setVal('editHeaderDayNightDay', cfg.dayNightLabelDay || 'โหมดกลางวัน');

      setCheck('editHeaderShowPhone', cfg.showPhone !== false);
      setVal('editHeaderPhoneText', cfg.phoneText || '062-460-5863');
      setVal('editHeaderPhoneTel', cfg.phoneTel || 'tel:0624605863');

      setCheck('editHeaderShowMessenger', cfg.showMessenger !== false);
      setVal('editHeaderMessengerText', cfg.messengerText || 'Messenger');
      setVal('editHeaderMessengerUrl', cfg.messengerUrl || 'https://m.me/Baantaphai');

      setCheck('editHeaderShowLine', cfg.showLine !== false);
      setVal('editHeaderLineText', cfg.lineText || 'ทัก LINE');
      setVal('editHeaderLineUrl', cfg.lineUrl || 'https://line.me/R/ti/p/@baantaphairesort');

      const modal = document.getElementById('editHeaderActionsModal');
      if (modal) modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeHeaderActionsEditModal() {
      const modal = document.getElementById('editHeaderActionsModal');
      if (modal) modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function saveHeaderActionsEdit(isDirectPublish = false) {
      const getCheck = (id, def = true) => {
        const el = document.getElementById(id);
        return el ? el.checked : def;
      };
      const getVal = (id, def = '') => {
        const el = document.getElementById(id);
        return el ? (el.value.trim() || def) : def;
      };

      let phoneTel = getVal('editHeaderPhoneTel', '');
      const phoneText = getVal('editHeaderPhoneText', '062-460-5863');
      if (!phoneTel) {
        phoneTel = 'tel:' + phoneText.replace(/[^0-9+]/g, '');
      } else if (!phoneTel.startsWith('tel:') && !phoneTel.startsWith('http')) {
        phoneTel = 'tel:' + phoneTel;
      }

      SITE_HEADER_ACTIONS = {
        showDayNight: getCheck('editHeaderShowDayNight', true),
        dayNightLabelNight: getVal('editHeaderDayNightNight', 'โหมดกลางคืน'),
        dayNightLabelDay: getVal('editHeaderDayNightDay', 'โหมดกลางวัน'),
        showPhone: getCheck('editHeaderShowPhone', true),
        phoneText: phoneText,
        phoneTel: phoneTel,
        showMessenger: getCheck('editHeaderShowMessenger', true),
        messengerText: getVal('editHeaderMessengerText', 'Messenger'),
        messengerUrl: getVal('editHeaderMessengerUrl', 'https://m.me/Baantaphai'),
        showLine: getCheck('editHeaderShowLine', true),
        lineText: getVal('editHeaderLineText', 'ทัก LINE'),
        lineUrl: getVal('editHeaderLineUrl', 'https://line.me/R/ti/p/@baantaphairesort')
      };

      try {
        localStorage.setItem('baantaphai_header_actions_v3', JSON.stringify(SITE_HEADER_ACTIONS));
      } catch(e) {}

      closeHeaderActionsEditModal();
      renderHeaderActionsSection();
      handleSectionSave('headerActions', 'แก้ไขปุ่มติดต่อด่วน & โหมดกลางคืน (Navbar Actions)', isDirectPublish);
    }

    // ==========================================
    // 10.1 SIGNATURE PHOTO SPOTS RENDERER & CONTROLLER
    // ==========================================
    function renderPhotoSpotsSection() {
      // 1. Header
      const headerContainer = document.getElementById('photoSpotsHeaderContainer');
      if (headerContainer) {
        let titleSizeClass = 'text-2xl sm:text-3xl lg:text-4xl';
        if (SITE_PHOTO_SPOTS_HEADER.titleSize === 'large') titleSizeClass = 'text-3xl sm:text-4xl lg:text-5xl';
        else if (SITE_PHOTO_SPOTS_HEADER.titleSize === 'xl') titleSizeClass = 'text-4xl sm:text-5xl lg:text-6xl';

        const adminHeaderBtn = isAdminMode ? `
          <div class="pt-2">
            <button onclick="openPhotoSpotsHeaderEditModal()" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-md inline-flex items-center gap-1.5 transition-transform active:scale-95">
              <i class="fa-solid fa-pen"></i> แก้ไขหัวข้อมุมถ่ายรูป
            </button>
          </div>
        ` : '';

        headerContainer.innerHTML = `
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[10px] sm:text-[11px] font-medium tracking-widest uppercase border border-rose-200">
            <i class="fa-solid fa-camera text-rose-600"></i>
            <span id="psHeaderBadge">${SITE_PHOTO_SPOTS_HEADER.badge || 'Signature Photo Spots'}</span>
          </div>
          <h2 id="psHeaderTitle" class="${titleSizeClass} font-semibold text-zen-dark leading-tight">
            ${SITE_PHOTO_SPOTS_HEADER.title}
          </h2>
          <p id="psHeaderDesc" class="text-xs sm:text-sm text-zen-muted font-light leading-relaxed">
            ${SITE_PHOTO_SPOTS_HEADER.desc}
          </p>
          ${adminHeaderBtn}
        `;
      }

      // 2. Cards Grid
      const grid = document.getElementById('photoSpotsGrid');
      if (!grid) return;
      grid.innerHTML = '';

      SITE_PHOTO_SPOTS.forEach((spot, idx) => {
        const card = document.createElement('div');
        card.className = 'spot-card group flex flex-col cursor-pointer active:scale-[.99] relative';
        card.setAttribute('onclick', `openPhotoSpotModal(${idx})`);

        const adminEditBtn = isAdminMode ? `
          <button onclick="event.stopPropagation(); openPhotoSpotCardEditModal(${idx})" class="absolute top-3 right-3 z-20 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform active:scale-95" title="แก้ไขมุมถ่ายรูปนี้">
            <i class="fa-solid fa-pen"></i> แก้ไขจุดนี้
          </button>
        ` : '';

        const directImg = formatDirectImageUrl(spot.img);

        card.innerHTML = `
          ${adminEditBtn}
          <div class="spot-media relative aspect-[4/3] overflow-hidden bg-stone-100">
            <img src="${directImg}" alt="${spot.title}" loading="lazy" decoding="async" class="w-full h-full object-cover" style="${getCardImageStyle(spot)}">
            <div class="room-shade absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"></div>
            <span class="room-chip absolute top-3.5 left-3.5">${spot.zone}</span>
            <span class="spot-time absolute bottom-3.5 left-3.5"><i class="fa-regular fa-clock"></i> ${spot.time}</span>
            <span class="spot-expand absolute bottom-3.5 right-3.5" aria-hidden="true"><i class="fa-solid fa-expand"></i></span>
          </div>
          <div class="p-5 sm:p-6 flex-1 flex flex-col gap-4">
            <div>
              <h3 class="spot-title">${spot.title}</h3>
              <p class="spot-desc">${spot.desc}</p>
            </div>
            <div class="spot-tip">${spot.tip}</div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function openPhotoSpotsHeaderEditModal() {
      document.getElementById('editPsSubtitle').value = SITE_PHOTO_SPOTS_HEADER.badge || 'Signature Photo Spots';
      document.getElementById('editPsTitle').value = SITE_PHOTO_SPOTS_HEADER.title || '';
      document.getElementById('editPsTitleSize').value = SITE_PHOTO_SPOTS_HEADER.titleSize || 'normal';
      document.getElementById('editPsDesc').value = SITE_PHOTO_SPOTS_HEADER.desc || '';

      document.getElementById('editPhotoSpotsHeaderModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closePhotoSpotsHeaderEditModal() {
      document.getElementById('editPhotoSpotsHeaderModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function savePhotoSpotsHeaderEdit(isDirectPublish = false) {
      const badge = document.getElementById('editPsSubtitle').value.trim();
      const title = document.getElementById('editPsTitle').value.trim();
      const titleSize = document.getElementById('editPsTitleSize').value;
      const desc = document.getElementById('editPsDesc').value.trim();

      if (!title) {
        alert('กรุณากรอกหัวข้อ');
        return;
      }

      SITE_PHOTO_SPOTS_HEADER.badge = badge || 'Signature Photo Spots';
      SITE_PHOTO_SPOTS_HEADER.title = title;
      SITE_PHOTO_SPOTS_HEADER.titleSize = titleSize;
      SITE_PHOTO_SPOTS_HEADER.desc = desc;

      try {
        localStorage.setItem('baantaphai_ps_header_v3', JSON.stringify(SITE_PHOTO_SPOTS_HEADER));
      } catch(e) {}

      closePhotoSpotsHeaderEditModal();
      renderPhotoSpotsSection();
      handleSectionSave('photoSpotsHeader', 'แก้ไขหัวข้อ Signature Photo Spots', isDirectPublish);
    }

    function openPhotoSpotCardEditModal(index) {
      const list = (Array.isArray(SITE_PHOTO_SPOTS) && SITE_PHOTO_SPOTS.length > 0) ? SITE_PHOTO_SPOTS : DEFAULT_PHOTO_SPOTS_DATA;
      const spot = list[index];
      if (!spot) return;

      document.getElementById('editPsSpotIndex').value = index;
      document.getElementById('editPsCardHeaderTitle').textContent = `สตูดิโอปรับแต่งจุดที่ ${index + 1}: ${spot.title}`;
      document.getElementById('editPsCardTitle').value = spot.title || '';
      document.getElementById('editPsCardZone').value = spot.zone || '';
      document.getElementById('editPsCardBorderColor').value = spot.borderHoverColor || 'rose';
      document.getElementById('editPsCardTime').value = spot.time || '';
      document.getElementById('editPsCardTimeBadgeColor').value = spot.timeBadgeColor || 'amber';
      document.getElementById('editPsCardImg').value = spot.img || '';
      document.getElementById('editPsCardDesc').value = spot.desc || '';
      document.getElementById('editPsCardTip').value = spot.tip || '';

      const modalInfo = spot.modalData || {};
      document.getElementById('editPsModalTitle').value = modalInfo.title || '';
      document.getElementById('editPsModalTip').value = modalInfo.tip || '';

      // Parse existing objectPosition, zoom, filter
      let panX = 50, panY = 50;
      if (spot.objectPosition) {
        const parts = spot.objectPosition.split(' ');
        if (parts.length >= 2) {
          panX = parseInt(parts[0], 10) || 50;
          panY = parseInt(parts[1], 10) || 50;
        }
      }
      const zoomVal = Math.round((Number(spot.zoom) || 1) * 100);
      let brightVal = 100, contrastVal = 100, satVal = 100;
      if (spot.filter) {
        const bMatch = spot.filter.match(/brightness\(([\d.]+)\)/);
        const cMatch = spot.filter.match(/contrast\(([\d.]+)\)/);
        const sMatch = spot.filter.match(/saturate\(([\d.]+)\)/);
        if (bMatch) brightVal = Math.round(parseFloat(bMatch[1]) * 100);
        if (cMatch) contrastVal = Math.round(parseFloat(cMatch[1]) * 100);
        if (sMatch) satVal = Math.round(parseFloat(sMatch[1]) * 100);
      }

      document.getElementById('psPanX').value = panX;
      document.getElementById('psPanY').value = panY;
      document.getElementById('psZoom').value = zoomVal;
      document.getElementById('psBright').value = brightVal;
      document.getElementById('psContrast').value = contrastVal;
      document.getElementById('psSat').value = satVal;

      updatePsFramingFromSliders();
      updatePsLiveCardPreview();

      setupFocalPointDrag('psCropViewport', (x, y) => {
        document.getElementById('psPanX').value = x;
        document.getElementById('psPanY').value = y;
        updatePsFramingFromSliders();
      });

      document.getElementById('editPhotoSpotCardModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closePhotoSpotCardEditModal() {
      document.getElementById('editPhotoSpotCardModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function onPsImgInput(val) {
      const formatted = formatDirectImageUrl(val);
      const vImg = document.getElementById('psCropViewportImg');
      const lImg = document.getElementById('psLiveCardImg');
      if (vImg) vImg.src = formatted;
      if (lImg) lImg.src = formatted;
    }

    function updatePsFramingFromSliders() {
      const panX = document.getElementById('psPanX') ? parseInt(document.getElementById('psPanX').value, 10) : 50;
      const panY = document.getElementById('psPanY') ? parseInt(document.getElementById('psPanY').value, 10) : 50;
      const zoomVal = document.getElementById('psZoom') ? parseInt(document.getElementById('psZoom').value, 10) : 100;
      const brightVal = document.getElementById('psBright') ? parseInt(document.getElementById('psBright').value, 10) : 100;
      const contrastVal = document.getElementById('psContrast') ? parseInt(document.getElementById('psContrast').value, 10) : 100;
      const satVal = document.getElementById('psSat') ? parseInt(document.getElementById('psSat').value, 10) : 100;

      const zoomScale = (zoomVal / 100).toFixed(2);
      const filterCss = `brightness(${(brightVal/100).toFixed(2)}) contrast(${(contrastVal/100).toFixed(2)}) saturate(${(satVal/100).toFixed(2)})`;
      const posCss = `${panX}% ${panY}%`;

      if (document.getElementById('psPanXVal')) document.getElementById('psPanXVal').textContent = `${panX}%`;
      if (document.getElementById('psPanYVal')) document.getElementById('psPanYVal').textContent = `${panY}%`;
      if (document.getElementById('psZoomVal')) document.getElementById('psZoomVal').textContent = `${zoomScale}x`;
      if (document.getElementById('psBrightVal')) document.getElementById('psBrightVal').textContent = `${brightVal}%`;
      if (document.getElementById('psContrastVal')) document.getElementById('psContrastVal').textContent = `${contrastVal}%`;
      if (document.getElementById('psSatVal')) document.getElementById('psSatVal').textContent = `${satVal}%`;
      if (document.getElementById('psFocalCoordsText')) {
        document.getElementById('psFocalCoordsText').textContent = `X: ${panX}% | Y: ${panY}% | Zoom: ${zoomScale}x`;
      }

      const crosshair = document.getElementById('psCropCrosshair');
      if (crosshair) {
        crosshair.style.left = `${panX}%`;
        crosshair.style.top = `${panY}%`;
      }

      const imgUrl = formatDirectImageUrl(document.getElementById('editPsCardImg') ? document.getElementById('editPsCardImg').value.trim() : '');
      const viewportImg = document.getElementById('psCropViewportImg');
      if (viewportImg) {
        if (imgUrl) viewportImg.src = imgUrl;
        viewportImg.style.objectPosition = posCss;
        viewportImg.style.transform = `scale(${zoomScale})`;
        viewportImg.style.filter = filterCss;
      }

      const liveImg = document.getElementById('psLiveCardImg');
      if (liveImg) {
        if (imgUrl) liveImg.src = imgUrl;
        liveImg.style.objectPosition = posCss;
        liveImg.style.transform = Number(zoomScale) !== 1 ? `scale(${zoomScale})` : '';
        liveImg.style.filter = filterCss;
      }
    }

    function setPsAnglePreset(type) {
      let x = 50, y = 50;
      if (type === 'top') { x = 50; y = 15; }
      else if (type === 'bottom') { x = 50; y = 85; }
      else if (type === 'left') { x = 15; y = 50; }
      else if (type === 'right') { x = 85; y = 50; }
      else if (type === 'center') { x = 50; y = 50; }

      document.getElementById('psPanX').value = x;
      document.getElementById('psPanY').value = y;
      updatePsFramingFromSliders();
    }

    function setPsTonePreset(type) {
      let b = 100, c = 100, s = 100;
      if (type === 'warm') { b = 105; c = 105; s = 120; }
      else if (type === 'bright') { b = 112; c = 108; s = 110; }
      else if (type === 'cozy') { b = 98; c = 115; s = 90; }
      else if (type === 'normal') { b = 100; c = 100; s = 100; }

      document.getElementById('psBright').value = b;
      document.getElementById('psContrast').value = c;
      document.getElementById('psSat').value = s;
      updatePsFramingFromSliders();
    }

    function resetPsFramingAndFilters() {
      document.getElementById('psPanX').value = 50;
      document.getElementById('psPanY').value = 50;
      document.getElementById('psZoom').value = 100;
      document.getElementById('psBright').value = 100;
      document.getElementById('psContrast').value = 100;
      document.getElementById('psSat').value = 100;
      updatePsFramingFromSliders();
      showToast('🔄 คืนค่ามุมมองและฟิลเตอร์เริ่มต้นเรียบร้อย');
    }

    function updatePsLiveCardPreview() {
      const title = document.getElementById('editPsCardTitle').value.trim() || 'ชื่อจุดถ่ายรูป';
      const zone = document.getElementById('editPsCardZone').value.trim() || '⛩️ โซนหมู่บ้านญี่ปุ่น';
      const time = document.getElementById('editPsCardTime').value.trim() || 'แสงสวย: 08:00 - 09:30 น.';
      const desc = document.getElementById('editPsCardDesc').value.trim() || 'คำอธิบายจุดถ่ายรูป...';
      const tip = document.getElementById('editPsCardTip').value.trim() || '💡 ทิปถ่ายภาพ';

      if (document.getElementById('psLiveCardTitle')) document.getElementById('psLiveCardTitle').textContent = title;
      if (document.getElementById('psLiveCardZone')) document.getElementById('psLiveCardZone').textContent = zone;
      if (document.getElementById('psLiveCardTime')) document.getElementById('psLiveCardTime').textContent = time;
      if (document.getElementById('psLiveCardDesc')) document.getElementById('psLiveCardDesc').textContent = desc;
      if (document.getElementById('psLiveCardTip')) document.getElementById('psLiveCardTip').textContent = tip;
    }

    function savePhotoSpotCardEdit(isDirectPublish = false) {
      const index = parseInt(document.getElementById('editPsSpotIndex').value, 10);
      const list = (Array.isArray(SITE_PHOTO_SPOTS) && SITE_PHOTO_SPOTS.length > 0) ? SITE_PHOTO_SPOTS : DEFAULT_PHOTO_SPOTS_DATA;
      const spot = list[index];
      if (!spot) return;

      const title = document.getElementById('editPsCardTitle').value.trim();
      const zone = document.getElementById('editPsCardZone').value.trim();
      const borderHoverColor = document.getElementById('editPsCardBorderColor').value;
      const time = document.getElementById('editPsCardTime').value.trim();
      const timeBadgeColor = document.getElementById('editPsCardTimeBadgeColor').value;
      const imgRaw = document.getElementById('editPsCardImg').value.trim();
      const desc = document.getElementById('editPsCardDesc').value.trim();
      const tip = document.getElementById('editPsCardTip').value.trim();
      const modalTitle = document.getElementById('editPsModalTitle').value.trim();
      const modalTip = document.getElementById('editPsModalTip').value.trim();

      if (!title) {
        alert('กรุณากรอกชื่อจุดถ่ายรูป');
        return;
      }

      spot.title = title;
      spot.zone = zone || '⛩️ Signature Spot';
      spot.borderHoverColor = borderHoverColor;
      spot.time = time;
      spot.timeBadgeColor = timeBadgeColor;
      spot.img = formatDirectImageUrl(imgRaw);
      spot.desc = desc;
      spot.tip = tip;

      // Save focal point, zoom, filter
      const panX = parseInt(document.getElementById('psPanX').value, 10) || 50;
      const panY = parseInt(document.getElementById('psPanY').value, 10) || 50;
      const zoomVal = parseInt(document.getElementById('psZoom').value, 10) || 100;
      const brightVal = parseInt(document.getElementById('psBright').value, 10) || 100;
      const contrastVal = parseInt(document.getElementById('psContrast').value, 10) || 100;
      const satVal = parseInt(document.getElementById('psSat').value, 10) || 100;

      spot.objectPosition = `${panX}% ${panY}%`;
      spot.zoom = Number((zoomVal / 100).toFixed(2));
      
      if (brightVal !== 100 || contrastVal !== 100 || satVal !== 100) {
        spot.filter = `brightness(${(brightVal/100).toFixed(2)}) contrast(${(contrastVal/100).toFixed(2)}) saturate(${(satVal/100).toFixed(2)})`;
      } else {
        delete spot.filter;
      }

      spot.modalData = {
        title: modalTitle || title,
        tip: modalTip || tip
      };

      try {
        localStorage.setItem('baantaphai_photospots_v3', JSON.stringify(SITE_PHOTO_SPOTS));
      } catch(e) {}

      closePhotoSpotCardEditModal();
      renderPhotoSpotsSection();
      renderPhotoSpotModal();
      handleSectionSave('photoSpots', `แก้ไขจุดถ่ายรูป: ${title}`, isDirectPublish);
    }

    // ==========================================
    // 10.2 VERIFIED REVIEWS RENDERER & CONTROLLER
    // ==========================================
    function formatCommitmentIcon(iconStr, defaultClass = 'text-base') {
      if (!iconStr) return `<i class="fa-solid fa-star ${defaultClass}"></i>`;
      iconStr = iconStr.trim();
      if (iconStr.startsWith('http://') || iconStr.startsWith('https://') || iconStr.startsWith('data:image/') || iconStr.startsWith('/')) {
        return `<img src="${iconStr}" alt="icon" class="w-6 h-6 object-contain mx-auto inline-block">`;
      }
      if (iconStr.includes('fa-') || iconStr.startsWith('fa ')) {
        return `<i class="${iconStr} ${defaultClass}"></i>`;
      }
      return `<span class="not-italic font-normal text-lg sm:text-xl leading-none inline-block">${iconStr}</span>`;
    }

    function renderReviewsSection() {
      const hBadge = document.getElementById('reviewsHeaderBadge');
      const hTitle = document.getElementById('reviewsHeaderTitle');
      const hDesc = document.getElementById('reviewsHeaderDesc');
      const hTrigger = document.getElementById('reviewsHeaderAdminTrigger');
      const gRating = document.getElementById('reviewsGoogleRating');
      const gCount = document.getElementById('reviewsGoogleCount');
      const gLink = document.getElementById('reviewsGoogleLink');
      const fbPercent = document.getElementById('reviewsFacebookPercent');
      const fbLink = document.getElementById('reviewsFacebookLink');

      // Dual Card Elements
      const dualPillFb = document.getElementById('reviewsDualPillFb');
      const dualPillGoogle = document.getElementById('reviewsDualPillGoogle');
      const dualPlatformTag = document.getElementById('reviewsDualPlatformTag');
      const dualTitle = document.getElementById('reviewsDualTitle');
      const dualDesc = document.getElementById('reviewsDualDesc');
      const dualBottomNote = document.getElementById('reviewsDualBottomNote');
      const dualFbBtn = document.getElementById('reviewsDualFbBtn');
      const dualFbBtnText = document.getElementById('reviewsDualFbBtnText');
      const dualGoogleBtn = document.getElementById('reviewsDualGoogleBtn');
      const dualGoogleBtnText = document.getElementById('reviewsDualGoogleBtnText');
      const dualTrigger = document.getElementById('reviewsDualAdminTrigger');
      const commitmentsTrigger = document.getElementById('reviewsCommitmentsAdminTrigger');
      const commitmentsGrid = document.getElementById('reviewsCommitmentsGrid');

      if (hBadge) hBadge.textContent = SITE_REVIEWS_HEADER.badge || DEFAULT_REVIEWS_HEADER.badge;
      if (hTitle) hTitle.textContent = SITE_REVIEWS_HEADER.title || DEFAULT_REVIEWS_HEADER.title;
      if (hDesc) hDesc.textContent = SITE_REVIEWS_HEADER.desc || '';
      if (hTrigger) {
        if (isAdminMode) hTrigger.classList.remove('hidden');
        else hTrigger.classList.add('hidden');
      }
      if (gRating) gRating.textContent = SITE_REVIEWS_HEADER.googleRating || '4.7';
      if (gCount) gCount.textContent = SITE_REVIEWS_HEADER.googleReviewsCount || 'Google Maps (180+)';
      if (gLink && (SITE_REVIEWS_HEADER.googleMapsLink || DEFAULT_REVIEWS_HEADER.googleMapsLink)) {
        gLink.href = SITE_REVIEWS_HEADER.googleMapsLink || DEFAULT_REVIEWS_HEADER.googleMapsLink;
      }
      if (fbPercent) fbPercent.textContent = SITE_REVIEWS_HEADER.facebookPercent || '98%';
      if (fbLink && (SITE_REVIEWS_HEADER.facebookReviewsLink || DEFAULT_REVIEWS_HEADER.facebookReviewsLink)) {
        fbLink.href = SITE_REVIEWS_HEADER.facebookReviewsLink || DEFAULT_REVIEWS_HEADER.facebookReviewsLink;
      }

      // Dual Card Updates
      if (dualPillFb) dualPillFb.textContent = SITE_REVIEWS_HEADER.dualPillFb || DEFAULT_REVIEWS_HEADER.dualPillFb;
      if (dualPillGoogle) dualPillGoogle.textContent = SITE_REVIEWS_HEADER.dualPillGoogle || DEFAULT_REVIEWS_HEADER.dualPillGoogle;
      if (dualPlatformTag) dualPlatformTag.textContent = SITE_REVIEWS_HEADER.dualPlatformTag || DEFAULT_REVIEWS_HEADER.dualPlatformTag;
      if (dualTitle) dualTitle.textContent = SITE_REVIEWS_HEADER.dualCardTitle || DEFAULT_REVIEWS_HEADER.dualCardTitle;
      if (dualDesc) dualDesc.textContent = SITE_REVIEWS_HEADER.dualCardDesc || DEFAULT_REVIEWS_HEADER.dualCardDesc;
      if (dualBottomNote) {
        dualBottomNote.innerHTML = `<i class="fa-solid fa-check-circle text-emerald-600 mr-1"></i>${SITE_REVIEWS_HEADER.dualBottomNote || DEFAULT_REVIEWS_HEADER.dualBottomNote}`;
      }
      if (dualFbBtn && (SITE_REVIEWS_HEADER.facebookReviewsLink || DEFAULT_REVIEWS_HEADER.facebookReviewsLink)) {
        dualFbBtn.href = SITE_REVIEWS_HEADER.facebookReviewsLink || DEFAULT_REVIEWS_HEADER.facebookReviewsLink;
      }
      if (dualFbBtnText) dualFbBtnText.textContent = SITE_REVIEWS_HEADER.dualFbBtnText || DEFAULT_REVIEWS_HEADER.dualFbBtnText;

      if (dualGoogleBtn && (SITE_REVIEWS_HEADER.googleMapsLink || DEFAULT_REVIEWS_HEADER.googleMapsLink)) {
        dualGoogleBtn.href = SITE_REVIEWS_HEADER.googleMapsLink || DEFAULT_REVIEWS_HEADER.googleMapsLink;
      }
      if (dualGoogleBtnText) dualGoogleBtnText.textContent = SITE_REVIEWS_HEADER.dualGoogleBtnText || DEFAULT_REVIEWS_HEADER.dualGoogleBtnText;

      if (dualTrigger) {
        if (isAdminMode) dualTrigger.classList.remove('hidden');
        else dualTrigger.classList.add('hidden');
      }
      if (commitmentsTrigger) {
        if (isAdminMode) commitmentsTrigger.classList.remove('hidden');
        else commitmentsTrigger.classList.add('hidden');
      }

      // 4 Core Commitments Grid Rendering
      if (commitmentsGrid) {
        const list = (Array.isArray(SITE_REVIEWS_HEADER.commitments) && SITE_REVIEWS_HEADER.commitments.length >= 4)
          ? SITE_REVIEWS_HEADER.commitments
          : DEFAULT_REVIEWS_HEADER.commitments;

        commitmentsGrid.innerHTML = list.map(c => `
          <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 hover:border-amber-300 transition-colors flex flex-col items-center justify-center text-center">
            <div class="flex items-center justify-center min-h-[26px]">
              ${formatCommitmentIcon(c.icon)}
            </div>
            <p class="text-xs font-bold text-zen-dark leading-tight">${c.title || ''}</p>
            <p class="text-[10px] text-stone-500 font-light leading-snug">${c.desc || ''}</p>
          </div>
        `).join('');
      }
    }

    function openReviewsHeaderEditModal() {
      document.getElementById('editRevBadge').value = SITE_REVIEWS_HEADER.badge || '';
      document.getElementById('editRevTitle').value = SITE_REVIEWS_HEADER.title || '';
      document.getElementById('editRevDesc').value = SITE_REVIEWS_HEADER.desc || '';
      document.getElementById('editRevGoogleRating').value = SITE_REVIEWS_HEADER.googleRating || '';
      document.getElementById('editRevGoogleCount').value = SITE_REVIEWS_HEADER.googleReviewsCount || '';
      document.getElementById('editRevGoogleLink').value = SITE_REVIEWS_HEADER.googleMapsLink || '';
      document.getElementById('editRevFbPercent').value = SITE_REVIEWS_HEADER.facebookPercent || '';
      document.getElementById('editRevFbLink').value = SITE_REVIEWS_HEADER.facebookReviewsLink || '';

      // Dual Card
      document.getElementById('editRevDualTitle').value = SITE_REVIEWS_HEADER.dualCardTitle || '';
      document.getElementById('editRevDualDesc').value = SITE_REVIEWS_HEADER.dualCardDesc || '';
      document.getElementById('editRevDualPillFb').value = SITE_REVIEWS_HEADER.dualPillFb || '';
      document.getElementById('editRevDualPillGoogle').value = SITE_REVIEWS_HEADER.dualPillGoogle || '';
      document.getElementById('editRevDualPlatformTag').value = SITE_REVIEWS_HEADER.dualPlatformTag || '';
      document.getElementById('editRevDualBottomNote').value = SITE_REVIEWS_HEADER.dualBottomNote || '';
      document.getElementById('editRevDualFbBtnText').value = SITE_REVIEWS_HEADER.dualFbBtnText || '';
      document.getElementById('editRevDualGoogleBtnText').value = SITE_REVIEWS_HEADER.dualGoogleBtnText || '';

      // 4 Core Commitments
      const commits = (Array.isArray(SITE_REVIEWS_HEADER.commitments) && SITE_REVIEWS_HEADER.commitments.length >= 4)
        ? SITE_REVIEWS_HEADER.commitments
        : DEFAULT_REVIEWS_HEADER.commitments;

      document.getElementById('editCommit1Icon').value = commits[0]?.icon || '';
      document.getElementById('editCommit1Title').value = commits[0]?.title || '';
      document.getElementById('editCommit1Desc').value = commits[0]?.desc || '';

      document.getElementById('editCommit2Icon').value = commits[1]?.icon || '';
      document.getElementById('editCommit2Title').value = commits[1]?.title || '';
      document.getElementById('editCommit2Desc').value = commits[1]?.desc || '';

      document.getElementById('editCommit3Icon').value = commits[2]?.icon || '';
      document.getElementById('editCommit3Title').value = commits[2]?.title || '';
      document.getElementById('editCommit3Desc').value = commits[2]?.desc || '';

      document.getElementById('editCommit4Icon').value = commits[3]?.icon || '';
      document.getElementById('editCommit4Title').value = commits[3]?.title || '';
      document.getElementById('editCommit4Desc').value = commits[3]?.desc || '';

      document.getElementById('editReviewsHeaderModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeReviewsHeaderEditModal() {
      document.getElementById('editReviewsHeaderModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function saveReviewsHeaderEdit(isDirectPublish = false) {
      SITE_REVIEWS_HEADER.badge = (document.getElementById('editRevBadge')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.badge;
      SITE_REVIEWS_HEADER.title = (document.getElementById('editRevTitle')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.title;
      SITE_REVIEWS_HEADER.desc = (document.getElementById('editRevDesc')?.value || '').trim();
      SITE_REVIEWS_HEADER.googleRating = (document.getElementById('editRevGoogleRating')?.value || '').trim() || '4.7';
      SITE_REVIEWS_HEADER.googleReviewsCount = (document.getElementById('editRevGoogleCount')?.value || '').trim() || 'Google Maps (180+)';
      SITE_REVIEWS_HEADER.googleMapsLink = (document.getElementById('editRevGoogleLink')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.googleMapsLink;
      SITE_REVIEWS_HEADER.facebookPercent = (document.getElementById('editRevFbPercent')?.value || '').trim() || '98%';
      SITE_REVIEWS_HEADER.facebookReviewsLink = (document.getElementById('editRevFbLink')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.facebookReviewsLink;

      // Dual Card
      SITE_REVIEWS_HEADER.dualCardTitle = (document.getElementById('editRevDualTitle')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualCardTitle;
      SITE_REVIEWS_HEADER.dualCardDesc = (document.getElementById('editRevDualDesc')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualCardDesc;
      SITE_REVIEWS_HEADER.dualPillFb = (document.getElementById('editRevDualPillFb')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualPillFb;
      SITE_REVIEWS_HEADER.dualPillGoogle = (document.getElementById('editRevDualPillGoogle')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualPillGoogle;
      SITE_REVIEWS_HEADER.dualPlatformTag = (document.getElementById('editRevDualPlatformTag')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualPlatformTag;
      SITE_REVIEWS_HEADER.dualBottomNote = (document.getElementById('editRevDualBottomNote')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualBottomNote;
      SITE_REVIEWS_HEADER.dualFbBtnText = (document.getElementById('editRevDualFbBtnText')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualFbBtnText;
      SITE_REVIEWS_HEADER.dualGoogleBtnText = (document.getElementById('editRevDualGoogleBtnText')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.dualGoogleBtnText;

      // 4 Commitments
      SITE_REVIEWS_HEADER.commitments = [
        {
          id: "commit_1",
          icon: (document.getElementById('editCommit1Icon')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[0].icon,
          title: (document.getElementById('editCommit1Title')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[0].title,
          desc: (document.getElementById('editCommit1Desc')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[0].desc
        },
        {
          id: "commit_2",
          icon: (document.getElementById('editCommit2Icon')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[1].icon,
          title: (document.getElementById('editCommit2Title')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[1].title,
          desc: (document.getElementById('editCommit2Desc')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[1].desc
        },
        {
          id: "commit_3",
          icon: (document.getElementById('editCommit3Icon')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[2].icon,
          title: (document.getElementById('editCommit3Title')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[2].title,
          desc: (document.getElementById('editCommit3Desc')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[2].desc
        },
        {
          id: "commit_4",
          icon: (document.getElementById('editCommit4Icon')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[3].icon,
          title: (document.getElementById('editCommit4Title')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[3].title,
          desc: (document.getElementById('editCommit4Desc')?.value || '').trim() || DEFAULT_REVIEWS_HEADER.commitments[3].desc
        }
      ];

      try {
        localStorage.setItem('baantaphai_reviews_header_v3', JSON.stringify(SITE_REVIEWS_HEADER));
      } catch(e) {
        console.error('Failed to save SITE_REVIEWS_HEADER to localStorage', e);
      }

      closeReviewsHeaderEditModal();
      renderReviewsSection();
      handleSectionSave('reviews', 'แก้ไขข้อมูลรีวิวและการันตีความประทับใจ', isDirectPublish);
    }

    // ==========================================
    // 10.38 FACEBOOK COMMUNITY FEED RENDERER & CONTROLLER
    // ==========================================
    function renderFacebookFeedSection() {
      const bIcon = document.getElementById('fbSectionBadgeIcon');
      const bText = document.getElementById('fbSectionBadge');
      const sTitle = document.getElementById('fbSectionTitle');
      const sDesc = document.getElementById('fbSectionDesc');
      const sTrigger = document.getElementById('fbSectionAdminTrigger');

      if (bIcon) {
        const iconVal = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.badgeIcon) || DEFAULT_FACEBOOK_FEED_DATA.badgeIcon;
        if (!iconVal) {
          bIcon.className = 'fa-brands fa-facebook text-[#1465D8]';
          bIcon.textContent = '';
        } else if (iconVal.includes('fa-')) {
          bIcon.className = `${iconVal} text-[#1465D8]`;
          bIcon.textContent = '';
        } else {
          bIcon.className = '';
          bIcon.textContent = iconVal;
        }
      }
      if (bText) bText.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.badge) || DEFAULT_FACEBOOK_FEED_DATA.badge;
      if (sTitle) sTitle.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.title) || DEFAULT_FACEBOOK_FEED_DATA.title;
      if (sDesc) {
        const descText = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.desc) || DEFAULT_FACEBOOK_FEED_DATA.desc;
        if (descText.includes('<')) {
          sDesc.innerHTML = descText;
        } else {
          sDesc.textContent = descText;
        }
      }
      if (sTrigger) {
        if (isAdminMode) sTrigger.classList.remove('hidden');
        else sTrigger.classList.add('hidden');
      }

      // Live Widget / Post Card elements
      const pageName = document.getElementById('fbPageName');
      const pageHandle = document.getElementById('fbPageHandle');
      const openAppBtn = document.getElementById('fbOpenAppBtn');
      const postBadge = document.getElementById('fbPostBadge');
      const postCaption = document.getElementById('fbPostCaption');
      const postLink = document.getElementById('fbPostLink');
      const promoImg = document.getElementById('fbPromoImg');
      const likeBtn = document.getElementById('fbLikeBtn');
      const messengerBtn = document.getElementById('fbMessengerBtn');
      const shareBtn = document.getElementById('fbShareBtn');

      if (pageName) pageName.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.pageName) || DEFAULT_FACEBOOK_FEED_DATA.pageName;
      if (pageHandle) {
        const handleText = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.pageHandle) || DEFAULT_FACEBOOK_FEED_DATA.pageHandle;
        if (handleText.includes('<')) pageHandle.innerHTML = handleText;
        else pageHandle.textContent = handleText;
      }
      const pageUrl = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.pageUrl) || DEFAULT_FACEBOOK_FEED_DATA.pageUrl;
      if (openAppBtn) openAppBtn.href = pageUrl;
      if (postBadge) postBadge.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.postBadge) || DEFAULT_FACEBOOK_FEED_DATA.postBadge;
      if (postCaption) {
        const capText = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.postCaption) || DEFAULT_FACEBOOK_FEED_DATA.postCaption;
        if (capText.includes('<')) postCaption.innerHTML = capText;
        else postCaption.textContent = capText;
      }
      if (postLink) postLink.href = pageUrl;
      if (promoImg) {
        const imgUrl = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.promoBannerImg) || DEFAULT_FACEBOOK_FEED_DATA.promoBannerImg;
        if (promoImg.src !== imgUrl && !promoImg.src.endsWith(imgUrl)) {
          promoImg.src = imgUrl;
        }
      }
      if (likeBtn) likeBtn.href = pageUrl;
      if (messengerBtn) messengerBtn.href = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.messengerUrl) || DEFAULT_FACEBOOK_FEED_DATA.messengerUrl;
      if (shareBtn) shareBtn.href = pageUrl;

      // Benefits Card
      const bTitle = document.getElementById('fbBenefitsTitle');
      const bSubtitle = document.getElementById('fbBenefitsSubtitle');
      const bIconEl = document.getElementById('fbBenefitsIcon');
      const bAdminTrigger = document.getElementById('fbBenefitsAdminTrigger');
      const bContainer = document.getElementById('fbBenefitsContainer');

      if (bTitle) bTitle.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.benefitsTitle) || DEFAULT_FACEBOOK_FEED_DATA.benefitsTitle;
      if (bSubtitle) bSubtitle.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.benefitsSubtitle) || DEFAULT_FACEBOOK_FEED_DATA.benefitsSubtitle;
      if (bIconEl) {
        const iconVal = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.benefitsIcon) || DEFAULT_FACEBOOK_FEED_DATA.benefitsIcon;
        if (iconVal && iconVal.includes('fa-')) {
          bIconEl.innerHTML = `<i class="${iconVal}"></i>`;
        } else {
          bIconEl.textContent = iconVal || '✨';
        }
      }
      if (bAdminTrigger) {
        if (isAdminMode) bAdminTrigger.classList.remove('hidden');
        else bAdminTrigger.classList.add('hidden');
      }

      if (bContainer) {
        const items = (SITE_FACEBOOK_FEED && Array.isArray(SITE_FACEBOOK_FEED.benefitItems) && SITE_FACEBOOK_FEED.benefitItems.length >= 3)
          ? SITE_FACEBOOK_FEED.benefitItems
          : DEFAULT_FACEBOOK_FEED_DATA.benefitItems;

        const themes = [
          { iconBg: 'bg-amber-100/70 text-amber-900', tagClass: 'text-amber-800 bg-amber-50 border border-amber-200/60', hoverBorder: 'hover:border-amber-300' },
          { iconBg: 'bg-rose-100/70 text-rose-900', tagClass: 'text-rose-800 bg-rose-50 border border-rose-200/60', hoverBorder: 'hover:border-rose-300' },
          { iconBg: 'bg-blue-100/70 text-blue-900', tagClass: 'text-blue-800 bg-blue-50 border border-blue-200/60', hoverBorder: 'hover:border-blue-300' }
        ];

        bContainer.innerHTML = items.map((item, idx) => {
          const theme = themes[idx % themes.length];
          const iconHtml = (item.icon && item.icon.includes('fa-'))
            ? `<i class="${item.icon}"></i>`
            : (item.icon || '✨');

          return `
            <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/60 transition-all hover:bg-white hover:shadow-xs ${theme.hoverBorder}">
              <span class="mt-0.5 shrink-0 w-8 h-8 rounded-xl ${theme.iconBg} flex items-center justify-center text-sm">
                ${iconHtml}
              </span>
              <div class="flex-1">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="font-bold text-zen-dark text-xs sm:text-sm">${item.title || ''}</h3>
                  ${item.tag ? `<span class="text-[9px] ${theme.tagClass} px-2 py-0.5 rounded-full font-medium shrink-0">${item.tag}</span>` : ''}
                </div>
                <p class="text-[11px] sm:text-xs text-stone-500 font-light mt-0.5">${item.desc || ''}</p>
              </div>
            </div>
          `;
        }).join('');
      }

      // Bottom CTA Card (Card 3)
      const ctaTitle = document.getElementById('fbCtaTitle');
      const ctaSubtitle = document.getElementById('fbCtaSubtitle');
      const ctaIconEl = document.getElementById('fbCtaIcon');
      const ctaAdminTrigger = document.getElementById('fbCtaAdminTrigger');
      const ctaBtn1 = document.getElementById('fbCtaBtn1');
      const ctaBtn1Text = document.getElementById('fbCtaBtn1Text');
      const ctaBtn2 = document.getElementById('fbCtaBtn2');
      const ctaBtn2Text = document.getElementById('fbCtaBtn2Text');
      const ctaNote = document.getElementById('fbCtaNote');

      if (ctaTitle) ctaTitle.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaTitle) || DEFAULT_FACEBOOK_FEED_DATA.ctaTitle;
      if (ctaSubtitle) ctaSubtitle.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaSubtitle) || DEFAULT_FACEBOOK_FEED_DATA.ctaSubtitle;
      if (ctaIconEl) {
        const iconVal = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaIcon) || DEFAULT_FACEBOOK_FEED_DATA.ctaIcon;
        if (iconVal && iconVal.includes('fa-')) {
          ctaIconEl.innerHTML = `<i class="${iconVal}"></i>`;
        } else {
          ctaIconEl.textContent = iconVal || '🎋';
        }
      }
      if (ctaAdminTrigger) {
        if (isAdminMode) ctaAdminTrigger.classList.remove('hidden');
        else ctaAdminTrigger.classList.add('hidden');
      }
      if (ctaBtn1) ctaBtn1.href = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.pageUrl) || DEFAULT_FACEBOOK_FEED_DATA.pageUrl;
      if (ctaBtn1Text) ctaBtn1Text.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaBtn1Text) || DEFAULT_FACEBOOK_FEED_DATA.ctaBtn1Text;
      if (ctaBtn2) ctaBtn2.href = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.messengerUrl) || DEFAULT_FACEBOOK_FEED_DATA.messengerUrl;
      if (ctaBtn2Text) ctaBtn2Text.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaBtn2Text) || DEFAULT_FACEBOOK_FEED_DATA.ctaBtn2Text;
      if (ctaNote) ctaNote.textContent = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaNote) || DEFAULT_FACEBOOK_FEED_DATA.ctaNote;
    }

    function openFacebookEditModal() {
      const bInput = document.getElementById('editFbSectionBadge');
      const biInput = document.getElementById('editFbSectionBadgeIcon');
      const tInput = document.getElementById('editFbSectionTitle');
      const dInput = document.getElementById('editFbSectionDesc');
      const cInput = document.getElementById('editFbPostCaption');
      const imgInput = document.getElementById('editFbPromoImg');
      const pageInput = document.getElementById('editFbPageUrl');
      const msgInput = document.getElementById('editFbMessengerUrl');

      if (bInput) bInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.badge) || '';
      if (biInput) biInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.badgeIcon) || '';
      if (tInput) tInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.title) || '';
      if (dInput) dInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.desc) || '';
      if (cInput) cInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.postCaption) || '';
      if (imgInput) imgInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.promoBannerImg) || '';
      if (pageInput) pageInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.pageUrl) || '';
      if (msgInput) msgInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.messengerUrl) || '';

      const bTitleInput = document.getElementById('editFbBenefitsTitle');
      const bSubInput = document.getElementById('editFbBenefitsSubtitle');
      const bIconInput = document.getElementById('editFbBenefitsIcon');

      if (bTitleInput) bTitleInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.benefitsTitle) || '';
      if (bSubInput) bSubInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.benefitsSubtitle) || '';
      if (bIconInput) bIconInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.benefitsIcon) || '';

      const bItems = (SITE_FACEBOOK_FEED && Array.isArray(SITE_FACEBOOK_FEED.benefitItems) && SITE_FACEBOOK_FEED.benefitItems.length >= 3)
        ? SITE_FACEBOOK_FEED.benefitItems
        : DEFAULT_FACEBOOK_FEED_DATA.benefitItems;

      if (document.getElementById('editFbBenefit1Icon')) document.getElementById('editFbBenefit1Icon').value = bItems[0]?.icon || '';
      if (document.getElementById('editFbBenefit1Title')) document.getElementById('editFbBenefit1Title').value = bItems[0]?.title || '';
      if (document.getElementById('editFbBenefit1Tag')) document.getElementById('editFbBenefit1Tag').value = bItems[0]?.tag || '';
      if (document.getElementById('editFbBenefit1Desc')) document.getElementById('editFbBenefit1Desc').value = bItems[0]?.desc || '';

      if (document.getElementById('editFbBenefit2Icon')) document.getElementById('editFbBenefit2Icon').value = bItems[1]?.icon || '';
      if (document.getElementById('editFbBenefit2Title')) document.getElementById('editFbBenefit2Title').value = bItems[1]?.title || '';
      if (document.getElementById('editFbBenefit2Tag')) document.getElementById('editFbBenefit2Tag').value = bItems[1]?.tag || '';
      if (document.getElementById('editFbBenefit2Desc')) document.getElementById('editFbBenefit2Desc').value = bItems[1]?.desc || '';

      if (document.getElementById('editFbBenefit3Icon')) document.getElementById('editFbBenefit3Icon').value = bItems[2]?.icon || '';
      if (document.getElementById('editFbBenefit3Title')) document.getElementById('editFbBenefit3Title').value = bItems[2]?.title || '';
      if (document.getElementById('editFbBenefit3Tag')) document.getElementById('editFbBenefit3Tag').value = bItems[2]?.tag || '';
      if (document.getElementById('editFbBenefit3Desc')) document.getElementById('editFbBenefit3Desc').value = bItems[2]?.desc || '';

      // Card 3 inputs
      if (document.getElementById('editFbCtaIcon')) document.getElementById('editFbCtaIcon').value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaIcon) || '';
      if (document.getElementById('editFbCtaTitle')) document.getElementById('editFbCtaTitle').value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaTitle) || '';
      if (document.getElementById('editFbCtaSubtitle')) document.getElementById('editFbCtaSubtitle').value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaSubtitle) || '';
      if (document.getElementById('editFbCtaBtn1Text')) document.getElementById('editFbCtaBtn1Text').value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaBtn1Text) || '';
      if (document.getElementById('editFbCtaBtn2Text')) document.getElementById('editFbCtaBtn2Text').value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaBtn2Text) || '';
      if (document.getElementById('editFbCtaNote')) document.getElementById('editFbCtaNote').value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.ctaNote) || '';

      const modal = document.getElementById('editFacebookModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFacebookEditModal() {
      const modal = document.getElementById('editFacebookModal');
      if (modal) modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function handleFbPromoImgUpload(event) {
      const file = event.target && event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('รูปภาพมีขนาดใหญ่เกิน 2MB กรุณาเลือกรูปภาพที่เล็กกว่า 2MB เพื่อประสิทธิภาพการโหลดหน้าเว็บ');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        const input = document.getElementById('editFbPromoImg');
        if (input) input.value = dataUrl;
        showToast('📸 อัปโหลดรูปภาพตัวอย่างสำเร็จแล้ว');
      };
      reader.readAsDataURL(file);
    }

    function saveFacebookEdit(isDirectPublish = false) {
      SITE_FACEBOOK_FEED.badge = (document.getElementById('editFbSectionBadge')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.badge;
      SITE_FACEBOOK_FEED.badgeIcon = (document.getElementById('editFbSectionBadgeIcon')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.badgeIcon;
      SITE_FACEBOOK_FEED.title = (document.getElementById('editFbSectionTitle')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.title;
      SITE_FACEBOOK_FEED.desc = (document.getElementById('editFbSectionDesc')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.desc;
      SITE_FACEBOOK_FEED.postCaption = (document.getElementById('editFbPostCaption')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.postCaption;

      let promoImg = (document.getElementById('editFbPromoImg')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.promoBannerImg;
      if (promoImg && typeof formatDirectImageUrl === 'function') {
        promoImg = formatDirectImageUrl(promoImg);
      }
      SITE_FACEBOOK_FEED.promoBannerImg = promoImg;

      SITE_FACEBOOK_FEED.pageUrl = (document.getElementById('editFbPageUrl')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.pageUrl;
      SITE_FACEBOOK_FEED.messengerUrl = (document.getElementById('editFbMessengerUrl')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.messengerUrl;

      SITE_FACEBOOK_FEED.benefitsTitle = (document.getElementById('editFbBenefitsTitle')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitsTitle;
      SITE_FACEBOOK_FEED.benefitsSubtitle = (document.getElementById('editFbBenefitsSubtitle')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitsSubtitle;
      SITE_FACEBOOK_FEED.benefitsIcon = (document.getElementById('editFbBenefitsIcon')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitsIcon;

      SITE_FACEBOOK_FEED.benefitItems = [
        {
          id: "fb_b1",
          icon: (document.getElementById('editFbBenefit1Icon')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[0].icon,
          title: (document.getElementById('editFbBenefit1Title')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[0].title,
          tag: (document.getElementById('editFbBenefit1Tag')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[0].tag,
          desc: (document.getElementById('editFbBenefit1Desc')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[0].desc
        },
        {
          id: "fb_b2",
          icon: (document.getElementById('editFbBenefit2Icon')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[1].icon,
          title: (document.getElementById('editFbBenefit2Title')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[1].title,
          tag: (document.getElementById('editFbBenefit2Tag')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[1].tag,
          desc: (document.getElementById('editFbBenefit2Desc')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[1].desc
        },
        {
          id: "fb_b3",
          icon: (document.getElementById('editFbBenefit3Icon')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[2].icon,
          title: (document.getElementById('editFbBenefit3Title')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[2].title,
          tag: (document.getElementById('editFbBenefit3Tag')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[2].tag,
          desc: (document.getElementById('editFbBenefit3Desc')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.benefitItems[2].desc
        }
      ];

      // Card 3
      SITE_FACEBOOK_FEED.ctaIcon = (document.getElementById('editFbCtaIcon')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.ctaIcon;
      SITE_FACEBOOK_FEED.ctaTitle = (document.getElementById('editFbCtaTitle')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.ctaTitle;
      SITE_FACEBOOK_FEED.ctaSubtitle = (document.getElementById('editFbCtaSubtitle')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.ctaSubtitle;
      SITE_FACEBOOK_FEED.ctaBtn1Text = (document.getElementById('editFbCtaBtn1Text')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.ctaBtn1Text;
      SITE_FACEBOOK_FEED.ctaBtn2Text = (document.getElementById('editFbCtaBtn2Text')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.ctaBtn2Text;
      SITE_FACEBOOK_FEED.ctaNote = (document.getElementById('editFbCtaNote')?.value || '').trim() || DEFAULT_FACEBOOK_FEED_DATA.ctaNote;

      try {
        localStorage.setItem('baantaphai_fb_feed_v3', JSON.stringify(SITE_FACEBOOK_FEED));
      } catch(e) {
        console.error('Failed to save SITE_FACEBOOK_FEED to localStorage', e);
      }

      closeFacebookEditModal();
      renderFacebookFeedSection();
      handleSectionSave('facebook', 'แก้ไขข้อมูลส่วนเพจ Facebook', isDirectPublish);
    }

    // ==========================================
    // 10.35 NEARBY ATTRACTIONS RENDERER & CONTROLLER
    // ==========================================
    const ATTRACTION_THEMES = {
      amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        borderHover: 'hover:border-amber-300',
        tagBg: 'bg-amber-100/80 text-amber-800'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-zen-torii',
        borderHover: 'hover:border-orange-300',
        tagBg: 'bg-orange-100/80 text-orange-900'
      },
      emerald: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        borderHover: 'hover:border-emerald-300',
        tagBg: 'bg-emerald-100/80 text-emerald-900'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        borderHover: 'hover:border-blue-300',
        tagBg: 'bg-blue-100/80 text-blue-900'
      },
      rose: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        borderHover: 'hover:border-rose-300',
        tagBg: 'bg-rose-100/80 text-rose-900'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        borderHover: 'hover:border-purple-300',
        tagBg: 'bg-purple-100/80 text-purple-900'
      }
    };

    function escapeAttractionsHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function setAttractionEmojiPreset(emoji) {
      const input = document.getElementById('editAttractionItemEmoji');
      if (input) input.value = emoji;
    }

    function renderAttractionsSection() {
      // 1. Header elements
      const badgeEl = document.getElementById('attractionsBadge');
      const titleEl = document.getElementById('attractionsTitle');
      const descEl = document.getElementById('attractionsDesc');
      const mapsLinkEl = document.getElementById('attractionsMapsLink');
      const mapsBtnTextEl = document.getElementById('attractionsMapsBtnText');
      const triggerEl = document.getElementById('attractionsAdminTrigger');

      if (badgeEl) badgeEl.textContent = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.badge) || DEFAULT_ATTRACTIONS_HEADER.badge;
      if (titleEl) titleEl.textContent = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.title) || DEFAULT_ATTRACTIONS_HEADER.title;
      if (descEl) descEl.textContent = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.desc) || DEFAULT_ATTRACTIONS_HEADER.desc;
      if (mapsLinkEl) mapsLinkEl.href = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.mapsLink) || DEFAULT_ATTRACTIONS_HEADER.mapsLink;
      if (mapsBtnTextEl) mapsBtnTextEl.textContent = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.mapsBtnText) || DEFAULT_ATTRACTIONS_HEADER.mapsBtnText;

      if (triggerEl) {
        if (isAdminMode) triggerEl.classList.remove('hidden');
        else triggerEl.classList.add('hidden');
      }

      // 2. Grid Items
      const gridContainer = document.getElementById('attractionsGridContainer');
      if (!gridContainer) return;

      const items = (Array.isArray(SITE_ATTRACTIONS_ITEMS) && SITE_ATTRACTIONS_ITEMS.length > 0)
        ? SITE_ATTRACTIONS_ITEMS
        : DEFAULT_ATTRACTIONS_ITEMS;

      gridContainer.className = 'attr-grid';
      gridContainer.innerHTML = items.map((item) => {
        const theme = ATTRACTION_THEMES[item.colorTheme] || ATTRACTION_THEMES.amber;
        const emojiHtml = (item.emoji && item.emoji.includes('fa-'))
          ? `<i class="${item.emoji}"></i>`
          : (item.emoji || '📍');
        const imgUrl = item.image ? formatDirectImageUrl(item.image) : '';
        const imgHtml = imgUrl
          ? `<img src="${escapeAttractionsHtml(imgUrl)}" alt="${escapeAttractionsHtml(item.title || '')}" loading="lazy" decoding="async" onerror="this.remove()">`
          : '';

        return `
          <div class="attr-card group">
            ${isAdminMode ? `
              <button onclick="event.stopPropagation(); openAttractionItemEditModal('${item.id}')" class="absolute top-0 right-2 z-20 px-2 py-0.5 rounded-md bg-amber-500 hover:bg-amber-600 text-stone-900 text-[10px] font-bold shadow-md inline-flex items-center gap-1">
                <i class="fa-solid fa-pen text-[9px]"></i> แก้ไข
              </button>
            ` : ''}
            <div class="attr-circle ${theme.bg} ${theme.text}">
              <span class="attr-emoji">${emojiHtml}</span>
              ${imgHtml}
            </div>
            <h3 class="attr-title">${escapeAttractionsHtml(item.title || '')}</h3>
            <span class="attr-time">${escapeAttractionsHtml(item.timeTag || '')}</span>
            <p class="attr-desc">${escapeAttractionsHtml(item.desc || '')}</p>
          </div>
        `;
      }).join('');
    }

    function openManageAttractionsModal() {
      renderManageAttractionsList();
      const modal = document.getElementById('manageAttractionsModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeManageAttractionsModal() {
      const modal = document.getElementById('manageAttractionsModal');
      if (modal) modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function renderManageAttractionsList() {
      const container = document.getElementById('manageAttractionsListContainer');
      const countBadge = document.getElementById('manageAttractionsCountBadge');
      if (countBadge) {
        countBadge.textContent = `${SITE_ATTRACTIONS_ITEMS.length} สถานที่`;
      }
      if (!container) return;

      if (!Array.isArray(SITE_ATTRACTIONS_ITEMS) || SITE_ATTRACTIONS_ITEMS.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <span class="text-3xl block mb-2">🗺️</span>
            <p class="text-xs">ยังไม่มีรายการสถานที่ท่องเที่ยว</p>
            <button onclick="openAttractionItemEditModal(null)" class="mt-3 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5">
              <i class="fa-solid fa-plus"></i> เพิ่มสถานที่แรก
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = SITE_ATTRACTIONS_ITEMS.map((item, idx) => {
        const theme = ATTRACTION_THEMES[item.colorTheme] || ATTRACTION_THEMES.amber;
        const emojiHtml = (item.emoji && item.emoji.includes('fa-'))
          ? `<i class="${item.emoji}"></i>`
          : (item.emoji || '📍');

        const isFirst = idx === 0;
        const isLast = idx === SITE_ATTRACTIONS_ITEMS.length - 1;

        return `
          <div class="p-3 sm:p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-7 text-center font-bold text-stone-400 text-xs shrink-0 select-none">
                #${idx + 1}
              </div>
              <div class="w-10 h-10 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center text-lg shrink-0 shadow-2xs">
                ${emojiHtml}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[10px] font-bold text-zen-torii uppercase">${escapeAttractionsHtml(item.timeTag || '')}</span>
                  <span class="text-stone-300">•</span>
                  <h4 class="font-bold text-stone-800 text-xs sm:text-sm truncate">${escapeAttractionsHtml(item.title || '')}</h4>
                </div>
                <p class="text-[11px] text-stone-500 font-light truncate mt-0.5">${escapeAttractionsHtml(item.desc || '')}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <div class="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                <button onclick="moveAttractionItem('${item.id}', -1)" ${isFirst ? 'disabled class="p-1.5 text-stone-300 cursor-not-allowed"' : 'class="p-1.5 text-stone-600 hover:text-black hover:bg-white rounded transition-colors"'} title="เลื่อนขึ้น">
                  <i class="fa-solid fa-arrow-up text-xs"></i>
                </button>
                <button onclick="moveAttractionItem('${item.id}', 1)" ${isLast ? 'disabled class="p-1.5 text-stone-300 cursor-not-allowed"' : 'class="p-1.5 text-stone-600 hover:text-black hover:bg-white rounded transition-colors"'} title="เลื่อนลง">
                  <i class="fa-solid fa-arrow-down text-xs"></i>
                </button>
              </div>
              <button onclick="openAttractionItemEditModal('${item.id}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1" title="แก้ไข">
                <i class="fa-solid fa-pen text-[10px]"></i> <span class="hidden sm:inline">แก้ไข</span>
              </button>
              <button onclick="deleteAttractionItem('${item.id}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition-colors" title="ลบ">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function openAttractionsHeaderEditModal() {
      const bInput = document.getElementById('editAttractionsHeaderBadge');
      const tInput = document.getElementById('editAttractionsHeaderTitle');
      const dInput = document.getElementById('editAttractionsHeaderDesc');
      const mInput = document.getElementById('editAttractionsHeaderMapsLink');
      const btnInput = document.getElementById('editAttractionsHeaderMapsBtnText');

      if (bInput) bInput.value = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.badge) || '';
      if (tInput) tInput.value = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.title) || '';
      if (dInput) dInput.value = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.desc) || '';
      if (mInput) mInput.value = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.mapsLink) || '';
      if (btnInput) btnInput.value = (SITE_ATTRACTIONS_HEADER && SITE_ATTRACTIONS_HEADER.mapsBtnText) || '';

      const modal = document.getElementById('editAttractionsHeaderModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeAttractionsHeaderEditModal() {
      const modal = document.getElementById('editAttractionsHeaderModal');
      if (modal) modal.classList.add('hidden');
      const manageModal = document.getElementById('manageAttractionsModal');
      if (!manageModal || manageModal.classList.contains('hidden')) {
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveAttractionsHeaderEdit(isDirectPublish = false) {
      SITE_ATTRACTIONS_HEADER.badge = (document.getElementById('editAttractionsHeaderBadge')?.value || '').trim() || DEFAULT_ATTRACTIONS_HEADER.badge;
      SITE_ATTRACTIONS_HEADER.title = (document.getElementById('editAttractionsHeaderTitle')?.value || '').trim() || DEFAULT_ATTRACTIONS_HEADER.title;
      SITE_ATTRACTIONS_HEADER.desc = (document.getElementById('editAttractionsHeaderDesc')?.value || '').trim() || DEFAULT_ATTRACTIONS_HEADER.desc;
      SITE_ATTRACTIONS_HEADER.mapsLink = (document.getElementById('editAttractionsHeaderMapsLink')?.value || '').trim() || DEFAULT_ATTRACTIONS_HEADER.mapsLink;
      SITE_ATTRACTIONS_HEADER.mapsBtnText = (document.getElementById('editAttractionsHeaderMapsBtnText')?.value || '').trim() || DEFAULT_ATTRACTIONS_HEADER.mapsBtnText;

      try {
        localStorage.setItem('baantaphai_attractions_header_v3', JSON.stringify(SITE_ATTRACTIONS_HEADER));
      } catch(e) {
        console.error(e);
      }

      closeAttractionsHeaderEditModal();
      renderAttractionsSection();
      handleSectionSave('attractionsHeader', 'แก้ไขหัวข้อสถานที่ท่องเที่ยวใกล้เคียง', isDirectPublish);
    }

    function openAttractionItemEditModal(id) {
      const modal = document.getElementById('editAttractionItemModal');
      const titleEl = document.getElementById('editAttractionItemModalTitle');
      const deleteBtn = document.getElementById('deleteAttractionItemBtn');

      const idInput = document.getElementById('editAttractionItemId');
      const emojiInput = document.getElementById('editAttractionItemEmoji');
      const timeTagInput = document.getElementById('editAttractionItemTimeTag');
      const titleInput = document.getElementById('editAttractionItemTitle');
      const descInput = document.getElementById('editAttractionItemDesc');
      const themeInput = document.getElementById('editAttractionItemColorTheme');

      if (id) {
        const item = SITE_ATTRACTIONS_ITEMS.find(it => it.id === id);
        if (!item) return;
        if (titleEl) titleEl.textContent = 'แก้ไขสถานที่ท่องเที่ยว';
        if (deleteBtn) deleteBtn.classList.remove('hidden');
        if (idInput) idInput.value = item.id;
        if (emojiInput) emojiInput.value = item.emoji || '🦁';
        if (timeTagInput) timeTagInput.value = item.timeTag || '';
        if (titleInput) titleInput.value = item.title || '';
        if (descInput) descInput.value = item.desc || '';
        if (themeInput) themeInput.value = item.colorTheme || 'amber';
        const imgIn = document.getElementById('editAttractionItemImage'); if (imgIn) imgIn.value = item.image || '';
      } else {
        if (titleEl) titleEl.textContent = 'เพิ่มสถานที่ท่องเที่ยวใหม่';
        if (deleteBtn) deleteBtn.classList.add('hidden');
        if (idInput) idInput.value = '';
        if (emojiInput) emojiInput.value = '🦁';
        if (timeTagInput) timeTagInput.value = '5 นาที ถึง';
        if (titleInput) titleInput.value = '';
        if (descInput) descInput.value = '';
        if (themeInput) themeInput.value = 'amber';
        const imgIn = document.getElementById('editAttractionItemImage'); if (imgIn) imgIn.value = '';
      }

      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeAttractionItemEditModal() {
      const modal = document.getElementById('editAttractionItemModal');
      if (modal) modal.classList.add('hidden');
      const manageModal = document.getElementById('manageAttractionsModal');
      if (!manageModal || manageModal.classList.contains('hidden')) {
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveAttractionItemEdit(isDirectPublish = false) {
      const idInput = document.getElementById('editAttractionItemId');
      const emojiInput = document.getElementById('editAttractionItemEmoji');
      const timeTagInput = document.getElementById('editAttractionItemTimeTag');
      const titleInput = document.getElementById('editAttractionItemTitle');
      const descInput = document.getElementById('editAttractionItemDesc');
      const themeInput = document.getElementById('editAttractionItemColorTheme');

      const title = (titleInput?.value || '').trim();
      if (!title) {
        alert('กรุณากรอกชื่อสถานที่ท่องเที่ยว');
        titleInput?.focus();
        return;
      }

      const id = idInput?.value;
      const itemData = {
        id: id || ('attract_' + Date.now()),
        emoji: (emojiInput?.value || '').trim() || '📍',
        timeTag: (timeTagInput?.value || '').trim(),
        title: title,
        desc: (descInput?.value || '').trim(),
        colorTheme: themeInput?.value || 'amber',
        image: formatDirectImageUrl((document.getElementById('editAttractionItemImage')?.value || '').trim())
      };

      if (id) {
        const idx = SITE_ATTRACTIONS_ITEMS.findIndex(it => it.id === id);
        if (idx >= 0) {
          SITE_ATTRACTIONS_ITEMS[idx] = itemData;
        } else {
          SITE_ATTRACTIONS_ITEMS.push(itemData);
        }
      } else {
        SITE_ATTRACTIONS_ITEMS.push(itemData);
      }

      try {
        localStorage.setItem('baantaphai_attractions_items_v3', JSON.stringify(SITE_ATTRACTIONS_ITEMS));
      } catch(e) {
        console.error(e);
      }

      closeAttractionItemEditModal();
      renderAttractionsSection();
      renderManageAttractionsList();
      handleSectionSave('attractions', `บันทึกสถานที่ท่องเที่ยว: ${title}`, isDirectPublish);
    }

    function deleteAttractionItem(id) {
      const item = SITE_ATTRACTIONS_ITEMS.find(it => it.id === id);
      const name = item ? `"${item.title}"` : 'สถานที่นี้';
      if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${name}?`)) return;

      SITE_ATTRACTIONS_ITEMS = SITE_ATTRACTIONS_ITEMS.filter(it => it.id !== id);
      try {
        localStorage.setItem('baantaphai_attractions_items_v3', JSON.stringify(SITE_ATTRACTIONS_ITEMS));
      } catch(e) {
        console.error(e);
      }
      renderAttractionsSection();
      renderManageAttractionsList();
      handleSectionSave('attractions', `ลบสถานที่ท่องเที่ยว: ${name}`);
    }

    function deleteAttractionItemFromModal() {
      const id = document.getElementById('editAttractionItemId')?.value;
      if (!id) return;
      const item = SITE_ATTRACTIONS_ITEMS.find(it => it.id === id);
      const name = item ? `"${item.title}"` : 'สถานที่นี้';
      if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${name}?`)) return;

      SITE_ATTRACTIONS_ITEMS = SITE_ATTRACTIONS_ITEMS.filter(it => it.id !== id);
      try {
        localStorage.setItem('baantaphai_attractions_items_v3', JSON.stringify(SITE_ATTRACTIONS_ITEMS));
      } catch(e) {
        console.error(e);
      }
      closeAttractionItemEditModal();
      renderAttractionsSection();
      renderManageAttractionsList();
      handleSectionSave('attractions', `ลบสถานที่ท่องเที่ยว: ${name}`);
    }

    function moveAttractionItem(id, direction) {
      const idx = SITE_ATTRACTIONS_ITEMS.findIndex(it => it.id === id);
      if (idx < 0) return;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= SITE_ATTRACTIONS_ITEMS.length) return;

      const temp = SITE_ATTRACTIONS_ITEMS[idx];
      SITE_ATTRACTIONS_ITEMS[idx] = SITE_ATTRACTIONS_ITEMS[targetIdx];
      SITE_ATTRACTIONS_ITEMS[targetIdx] = temp;

      try {
        localStorage.setItem('baantaphai_attractions_items_v3', JSON.stringify(SITE_ATTRACTIONS_ITEMS));
      } catch(e) {
        console.error(e);
      }
      renderAttractionsSection();
      renderManageAttractionsList();
      handleSectionSave('attractions', 'จัดเรียงลำดับสถานที่ท่องเที่ยวใกล้เคียง');
    }

    // ==========================================
    // 10.4 STAY POLICIES & CONTACT RENDERER & CONTROLLER
    // ==========================================
    function renderPoliciesAndContactSection() {
      // 1. Policies
      const pTitle = document.getElementById('policyTitleText');
      const pCheckin = document.getElementById('policyCheckinText');
      const pCheckout = document.getElementById('policyCheckoutText');
      const pBreakfast = document.getElementById('policyBreakfastText');
      const pWifi = document.getElementById('policyWifiText');
      const pExtra = document.getElementById('policyExtraBedText');
      const pNotice = document.getElementById('policyNoticeText');
      const pTrigger = document.getElementById('policyAdminTrigger');

      const polCardEl = document.getElementById('policyCard');
      if (polCardEl) {
        polCardEl.classList.remove('font-override-sarabun', 'font-override-ibm', 'font-override-prompt', 'font-override-mitr', 'font-override-kanit', 'font-override-noto-serif');
        if (SITE_POLICIES.fontOverride) polCardEl.classList.add(`font-override-${SITE_POLICIES.fontOverride}`);
      }
      if (pTitle) pTitle.textContent = SITE_POLICIES.title || 'เงื่อนไขและการเข้าพัก';
      if (pCheckin) pCheckin.textContent = SITE_POLICIES.checkin || '14:00 น. ขึ้นไป';
      if (pCheckout) pCheckout.textContent = SITE_POLICIES.checkout || 'ก่อน 12:00 น.';
      if (pBreakfast) pBreakfast.innerHTML = `<strong>อาหารเช้าฟรี:</strong> ${SITE_POLICIES.breakfast || ''}`;
      if (pWifi) pWifi.innerHTML = `<strong>Wi-Fi ฟรี:</strong> ${SITE_POLICIES.wifi || ''}`;
      if (pExtra) pExtra.innerHTML = `<strong>เตียงและฟูกเสริม:</strong> ${SITE_POLICIES.extraBed || ''}`;
      if (pNotice) pNotice.innerHTML = `<strong>ข้อควรทราบ:</strong> ${SITE_POLICIES.notice || ''}`;
      if (pTrigger) {
        if (isAdminMode) pTrigger.classList.remove('hidden');
        else pTrigger.classList.add('hidden');
      }

      // 2. Contact & Location
      const cBadge = document.getElementById('contactBadgeText');
      const cTitle = document.getElementById('contactTitleText');
      const cAddr = document.getElementById('resortAddressText');
      const cPhone1 = document.getElementById('phoneText1');
      const cPhone2 = document.getElementById('phoneText2');
      const cFb = document.getElementById('contactFbText');
      const cLine = document.getElementById('contactLineText');
      const cTrigger = document.getElementById('contactAdminTrigger');
      const cMapsBtn = document.getElementById('contactMapsBtn');

      if (cBadge) cBadge.textContent = SITE_CONTACT.badge || 'Contact & Location';
      if (cTitle) cTitle.textContent = SITE_CONTACT.title || 'การเดินทาง & ข้อมูลติดต่อ';
      if (cAddr) cAddr.innerHTML = `<i class="fa-solid fa-location-dot text-zen-torii mt-0.5 shrink-0 text-xs"></i><span>${SITE_CONTACT.address}</span>`;
      if (cPhone1) cPhone1.textContent = SITE_CONTACT.phone1;
      if (cPhone2) cPhone2.textContent = SITE_CONTACT.phone2;
      if (cFb) cFb.textContent = SITE_CONTACT.facebookName;
      if (cLine) cLine.textContent = SITE_CONTACT.lineId;
      if (cMapsBtn && SITE_CONTACT.mapsUrl) cMapsBtn.href = SITE_CONTACT.mapsUrl;

      const p1Link = document.getElementById('contactPhone1');
      if (p1Link && SITE_CONTACT.phone1) p1Link.href = `tel:${SITE_CONTACT.phone1.replace(/[^0-9]/g, '')}`;
      const p2Link = document.getElementById('contactPhone2');
      if (p2Link && SITE_CONTACT.phone2) p2Link.href = `tel:${SITE_CONTACT.phone2.replace(/[^0-9]/g, '')}`;

      const fbLink = document.getElementById('contactMessenger');
      if (fbLink && SITE_CONTACT.facebookUrl) fbLink.href = SITE_CONTACT.facebookUrl;

      const lineLink = document.getElementById('contactLine');
      if (lineLink && SITE_CONTACT.lineUrl) lineLink.href = SITE_CONTACT.lineUrl;

      if (cTrigger) {
        if (isAdminMode) cTrigger.classList.remove('hidden');
        else cTrigger.classList.add('hidden');
      }

      // 3. Global Navbar, Mobile, and Footer Sync
      const navPhone = document.getElementById('navPhoneText');
      if (navPhone && SITE_CONTACT.phone1) navPhone.textContent = SITE_CONTACT.phone1;
      const navPhoneL = document.getElementById('navPhoneLink');
      if (navPhoneL && SITE_CONTACT.phone1) navPhoneL.href = `tel:${SITE_CONTACT.phone1.replace(/[^0-9]/g, '')}`;
      const mobilePhone = document.getElementById('mobileMenuPhoneLink');
      if (mobilePhone && SITE_CONTACT.phone1) {
        mobilePhone.href = `tel:${SITE_CONTACT.phone1.replace(/[^0-9]/g, '')}`;
        mobilePhone.innerHTML = `<i class="fa-solid fa-phone text-zen-torii"></i> โทร ${SITE_CONTACT.phone1}`;
      }
      const footerPhone = document.getElementById('footerPhoneText');
      if (footerPhone && SITE_CONTACT.phone1) footerPhone.textContent = SITE_CONTACT.phone1;
      const footerPhoneL = document.getElementById('footerPhoneLink');
      if (footerPhoneL && SITE_CONTACT.phone1) footerPhoneL.href = `tel:${SITE_CONTACT.phone1.replace(/[^0-9]/g, '')}`;
    }

    function openPoliciesEditModal() {
      document.getElementById('editPolTitle').value = SITE_POLICIES.title || 'เงื่อนไขและการเข้าพัก';
      document.getElementById('editPolFont').value = SITE_POLICIES.fontOverride || '';
      document.getElementById('editPolCheckin').value = SITE_POLICIES.checkin || '14:00 น. ขึ้นไป';
      document.getElementById('editPolCheckout').value = SITE_POLICIES.checkout || 'ก่อน 12:00 น.';
      document.getElementById('editPolBreakfast').value = SITE_POLICIES.breakfast || '';
      document.getElementById('editPolWifi').value = SITE_POLICIES.wifi || '';
      document.getElementById('editPolExtraBed').value = SITE_POLICIES.extraBed || '';
      document.getElementById('editPolNotice').value = SITE_POLICIES.notice || '';

      document.getElementById('editPoliciesModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closePoliciesEditModal() {
      document.getElementById('editPoliciesModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function savePoliciesEdit(isDirectPublish = false) {
      SITE_POLICIES.title = document.getElementById('editPolTitle').value.trim() || 'เงื่อนไขและการเข้าพัก';
      SITE_POLICIES.fontOverride = document.getElementById('editPolFont').value || '';
      SITE_POLICIES.checkin = document.getElementById('editPolCheckin').value.trim();
      SITE_POLICIES.checkout = document.getElementById('editPolCheckout').value.trim();
      SITE_POLICIES.breakfast = document.getElementById('editPolBreakfast').value.trim();
      SITE_POLICIES.wifi = document.getElementById('editPolWifi').value.trim();
      SITE_POLICIES.extraBed = document.getElementById('editPolExtraBed').value.trim();
      SITE_POLICIES.notice = document.getElementById('editPolNotice').value.trim();

      try {
        localStorage.setItem('baantaphai_policies_v3', JSON.stringify(SITE_POLICIES));
      } catch(e) {}

      closePoliciesEditModal();
      renderPoliciesAndContactSection();
      handleSectionSave('policies', 'แก้ไขเงื่อนไขและการเข้าพัก', isDirectPublish);
    }

    function openContactEditModal() {
      document.getElementById('editContactAddress').value = SITE_CONTACT.address || '';
      document.getElementById('editContactPhone1').value = SITE_CONTACT.phone1 || '';
      document.getElementById('editContactPhone2').value = SITE_CONTACT.phone2 || '';
      document.getElementById('editContactFbName').value = SITE_CONTACT.facebookName || '';
      document.getElementById('editContactFbUrl').value = SITE_CONTACT.facebookUrl || '';
      document.getElementById('editContactLineId').value = SITE_CONTACT.lineId || '';
      document.getElementById('editContactLineUrl').value = SITE_CONTACT.lineUrl || '';
      document.getElementById('editContactMapsUrl').value = SITE_CONTACT.mapsUrl || '';

      document.getElementById('editContactModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeContactEditModal() {
      document.getElementById('editContactModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function saveContactEdit(isDirectPublish = false) {
      SITE_CONTACT.address = document.getElementById('editContactAddress').value.trim();
      SITE_CONTACT.phone1 = document.getElementById('editContactPhone1').value.trim();
      SITE_CONTACT.phone2 = document.getElementById('editContactPhone2').value.trim();
      SITE_CONTACT.facebookName = document.getElementById('editContactFbName').value.trim();
      SITE_CONTACT.facebookUrl = document.getElementById('editContactFbUrl').value.trim();
      SITE_CONTACT.lineId = document.getElementById('editContactLineId').value.trim();
      SITE_CONTACT.lineUrl = document.getElementById('editContactLineUrl').value.trim();
      SITE_CONTACT.mapsUrl = document.getElementById('editContactMapsUrl').value.trim();

      try {
        localStorage.setItem('baantaphai_contact_v3', JSON.stringify(SITE_CONTACT));
      } catch(e) {}

      closeContactEditModal();
      renderPoliciesAndContactSection();
      handleSectionSave('contact', 'แก้ไขข้อมูลติดต่อและเบอร์โทร', isDirectPublish);
    }

    function renderHeroSection() {
      const hHeadingEl = document.getElementById('heroHeading');
      if (hHeadingEl) {
        hHeadingEl.classList.remove('font-override-sarabun', 'font-override-ibm', 'font-override-prompt', 'font-override-mitr', 'font-override-kanit', 'font-override-noto-serif');
        if (SITE_HERO.headingFontOverride) hHeadingEl.classList.add(`font-override-${SITE_HERO.headingFontOverride}`);
      }
      const hDescEl = document.getElementById('heroDesc');
      if (hDescEl) {
        hDescEl.classList.remove('font-override-sarabun', 'font-override-ibm', 'font-override-prompt', 'font-override-mitr', 'font-override-kanit', 'font-override-noto-serif');
        if (SITE_HERO.descFontOverride) hDescEl.classList.add(`font-override-${SITE_HERO.descFontOverride}`);
      }
      const badgeEl = document.getElementById('heroTopBadge');
      const title1El = document.getElementById('heroTitle1');
      const titleHlEl = document.getElementById('heroTitleHl');
      const title2El = document.getElementById('heroTitle2');
      const descEl = document.getElementById('heroDesc');
      const startPriceEl = document.getElementById('heroStartPrice');
      const startPriceNoteEl = document.getElementById('heroStartPriceNote');
      const btnStartPriceEl = document.getElementById('heroBtnStartPrice');
      const heroImgEl = document.getElementById('heroMainImage');
      const overlayBadgeEl = document.getElementById('heroBadgeText');
      const overlayTitleEl = document.getElementById('heroTitleText');
      const overlaySubtitleEl = document.getElementById('heroSubtitleText');

      if (badgeEl) badgeEl.textContent = SITE_HERO.badge;
      if (title1El) title1El.textContent = SITE_HERO.title1;
      if (titleHlEl) titleHlEl.textContent = SITE_HERO.titleHl;
      if (title2El) title2El.textContent = SITE_HERO.title2;
      if (descEl) descEl.innerHTML = SITE_HERO.desc;
      if (startPriceEl) startPriceEl.textContent = `฿${SITE_HERO.startPrice}`;
      if (startPriceNoteEl) startPriceNoteEl.textContent = `✓ ${SITE_HERO.startPriceNote}`;
      if (btnStartPriceEl) btnStartPriceEl.textContent = SITE_HERO.btnStartPriceText || `เลือกดูห้องพัก (เริ่มต้น ฿${SITE_HERO.startPrice})`;
      
      const omikujiBtnEl = document.getElementById('heroOmikujiBtnText');
      if (omikujiBtnEl) omikujiBtnEl.textContent = SITE_HERO.omikujiBtnText || '🎋 เซียมซีลุ้นส่วนลด 10–100.-';

      // 4 Quick Highlight Chips
      const chipsContainer = document.getElementById('heroChipsContainer');
      if (chipsContainer) {
        const chips = (SITE_HERO.chips && Array.isArray(SITE_HERO.chips) && SITE_HERO.chips.length === 4)
          ? SITE_HERO.chips
          : DEFAULT_HERO_DATA.chips;
        chipsContainer.innerHTML = chips.map(c => {
          let iconHtml = '';
          const rawIcon = (c.icon || '').trim();
          if (rawIcon) {
            if (rawIcon.startsWith('<i') || rawIcon.startsWith('<span')) {
              iconHtml = rawIcon;
            } else if (rawIcon.includes('fa-') || rawIcon.includes('fa ')) {
              iconHtml = `<i class="${rawIcon}"></i>`;
            } else {
              iconHtml = `<span>${rawIcon}</span>`;
            }
          }
          return `
            <span class="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-zen-cardborder/80 shadow-minimal shrink-0 text-[11px] sm:text-xs font-normal">
              ${iconHtml} ${c.text || ''}
            </span>
          `;
        }).join('');
      }
      
      if (heroImgEl) {
        const rawHero = isNightMode ? (SITE_HERO.heroImgNight || SITE_HERO.heroImg) : SITE_HERO.heroImg;
        heroImgEl.src = formatDirectImageUrl(rawHero);
      }
      if (overlayBadgeEl) overlayBadgeEl.textContent = SITE_HERO.overlayBadge;
      if (overlayTitleEl) overlayTitleEl.textContent = SITE_HERO.overlayTitle;
      if (overlaySubtitleEl) overlaySubtitleEl.textContent = SITE_HERO.overlaySubtitle;

      // Render Floating Bottom Badges
      const fbLeft = SITE_HERO.floatingBadgeLeft || DEFAULT_HERO_DATA.floatingBadgeLeft;
      const fLeftIconEl = document.getElementById('heroFloatLeftIcon');
      if (fLeftIconEl) {
        const rawIcon = (fbLeft.icon || '').trim();
        if (rawIcon.startsWith('<i') || rawIcon.startsWith('<span')) {
          fLeftIconEl.innerHTML = rawIcon;
        } else if (rawIcon.includes('fa-') || rawIcon.includes('fa ')) {
          fLeftIconEl.innerHTML = `<i class="${rawIcon}"></i>`;
        } else {
          fLeftIconEl.innerHTML = `<span>${rawIcon}</span>`;
        }
      }
      const fLeftTitleEl = document.getElementById('heroFloatLeftTitle');
      if (fLeftTitleEl) fLeftTitleEl.textContent = fbLeft.title || DEFAULT_HERO_DATA.floatingBadgeLeft.title;
      const fLeftSubEl = document.getElementById('heroFloatLeftSub');
      if (fLeftSubEl) fLeftSubEl.textContent = fbLeft.subtitle || DEFAULT_HERO_DATA.floatingBadgeLeft.subtitle;
      const fLeftThumbEl = document.getElementById('heroFloatLeftThumb');
      if (fLeftThumbEl) {
        if (fbLeft.showThumb !== false) fLeftThumbEl.classList.remove('hidden');
        else fLeftThumbEl.classList.add('hidden');
      }

      const fbRight = SITE_HERO.floatingBadgeRight || DEFAULT_HERO_DATA.floatingBadgeRight;
      const fRightIconEl = document.getElementById('heroFloatRightIcon');
      if (fRightIconEl) {
        const rawIcon = (fbRight.icon || '').trim();
        if (rawIcon.startsWith('<i') || rawIcon.startsWith('<span')) {
          fRightIconEl.innerHTML = rawIcon;
        } else if (rawIcon.includes('fa-') || rawIcon.includes('fa ')) {
          fRightIconEl.innerHTML = `<i class="${rawIcon}"></i>`;
        } else {
          fRightIconEl.innerHTML = `<span>${rawIcon}</span>`;
        }
      }
      const fRightTitleEl = document.getElementById('heroFloatRightTitle');
      if (fRightTitleEl) fRightTitleEl.textContent = fbRight.title || DEFAULT_HERO_DATA.floatingBadgeRight.title;
      const fRightSubEl = document.getElementById('heroFloatRightSub');
      if (fRightSubEl) fRightSubEl.textContent = fbRight.subtitle || DEFAULT_HERO_DATA.floatingBadgeRight.subtitle;

      // Toggle edit buttons visibility in hero
      document.querySelectorAll('.hero-edit-btn').forEach(btn => {
        if (isAdminMode) btn.classList.remove('hidden');
        else btn.classList.add('hidden');
      });
    }

    // ========================================================
    // 📊 ROOM COMPARISON MATRIX RENDERING & CONTROLLERS
    // ========================================================
    function renderComparisonTable() {
      // 1. Header, Subtitle, Footer Note & Font Override
      const compModal = document.getElementById('comparisonModal');
      if (compModal) {
        compModal.classList.remove('font-override-sarabun', 'font-override-ibm', 'font-override-prompt', 'font-override-mitr', 'font-override-kanit', 'font-override-noto-serif');
        if (SITE_COMP_HEADER.fontOverride) {
          compModal.classList.add(`font-override-${SITE_COMP_HEADER.fontOverride}`);
        }
      }

      const hTitle = document.getElementById('compHeaderTitle');
      const hSub = document.getElementById('compHeaderSubtitle');
      const fNote = document.getElementById('compFooterNote');
      const adminHeaderTriggers = document.getElementById('compAdminHeaderTriggers');

      if (hTitle) hTitle.textContent = SITE_COMP_HEADER.title || DEFAULT_COMP_HEADER.title;
      if (hSub) hSub.textContent = SITE_COMP_HEADER.subtitle || DEFAULT_COMP_HEADER.subtitle;
      if (fNote) fNote.textContent = SITE_COMP_HEADER.footerNote || DEFAULT_COMP_HEADER.footerNote;

      if (adminHeaderTriggers) {
        if (isAdminMode) adminHeaderTriggers.classList.remove('hidden');
        else adminHeaderTriggers.classList.add('hidden');
      }

      // 2. Table Rows
      const tbody = document.getElementById('comparisonTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const rows = (Array.isArray(SITE_COMP_MATRIX) && SITE_COMP_MATRIX.length > 0) ? SITE_COMP_MATRIX : DEFAULT_COMP_MATRIX;

      rows.forEach(row => {
        let badgeClass = 'bg-stone-100 text-stone-800';
        if (row.zoneColor === 'blue') badgeClass = 'bg-blue-50 text-blue-800';
        else if (row.zoneColor === 'amber') badgeClass = 'bg-amber-50 text-amber-800';
        else if (row.zoneColor === 'rose') badgeClass = 'bg-rose-50 text-rose-800';
        else if (row.zoneColor === 'emerald') badgeClass = 'bg-emerald-50 text-emerald-800';

        let toiletHtml = `<span class="text-stone-600">${row.bathrooms || ''}</span>`;
        if ((row.bathrooms || '').includes('✓') || (row.bathrooms || '').includes('ห้องน้ำในตัว')) {
          toiletHtml = `<span class="text-emerald-700 font-medium">${row.bathrooms}</span>`;
        } else if ((row.bathrooms || '').includes('รวม') || (row.bathrooms || '').includes('แยกส่วน')) {
          toiletHtml = `<span class="text-stone-400">${row.bathrooms}</span>`;
        }

        let actionBtn = '';
        if (row.roomId) {
          actionBtn = `<button onclick="closeComparisonModal(); openRoomModal('${row.roomId}');" class="comp-btn"><i class="fa-regular fa-images"></i> ดูรูปห้อง</button>`;
        }

        const adminEditBtn = isAdminMode ? `
          <button onclick="openComparisonRowEditModal('${row.id}')" class="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-[10px] shadow-2xs transition-transform active:scale-95 inline-flex items-center gap-1 ml-1 whitespace-nowrap" title="แก้ไขแถวนี้">
            <i class="fa-solid fa-pen text-[9px]"></i> แก้ไข
          </button>
        ` : '';

        const tr = document.createElement('tr');
        tr.className = 'comp-row';
        tr.innerHTML = `
          <td class="p-3 min-w-[200px]">
            <div class="comp-name"><span class="comp-ico">${row.icon || '🛏️'}</span><span>${row.name || ''}</span></div>
          </td>
          <td class="p-3">
            <span class="px-2.5 py-1 rounded-full ${badgeClass} text-[10.5px] font-medium whitespace-nowrap">${row.zone || ''}</span>
          </td>
          <td class="p-3 whitespace-nowrap"><span class="comp-price">${row.price || ''}</span></td>
          <td class="p-3 whitespace-nowrap text-stone-700">${row.guests || ''}</td>
          <td class="p-3 min-w-[150px] text-stone-700">${row.beds || ''}</td>
          <td class="p-3 min-w-[120px] whitespace-nowrap">${toiletHtml}</td>
          <td class="p-3 text-stone-600 font-light max-w-xs truncate" title="${(row.highlights || '').replace(/"/g, '&quot;')}">${row.highlights || ''}</td>
          <td class="p-3 text-center whitespace-nowrap">
            <div class="inline-flex items-center justify-center gap-1">
              ${actionBtn}
              ${adminEditBtn}
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Comparison Management Modal Functions
    function openComparisonManagerModal() {
      renderManageComparisonRowsList();
      const m = document.getElementById('manageComparisonModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeComparisonManagerModal() {
      const m = document.getElementById('manageComparisonModal');
      if (m) {
        m.classList.add('hidden');
        if (!document.getElementById('comparisonModal') || document.getElementById('comparisonModal').classList.contains('hidden')) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function renderManageComparisonRowsList() {
      const container = document.getElementById('manageComparisonRowsContainer');
      const countBadge = document.getElementById('manageCompCountBadge');
      if (!container) return;
      container.innerHTML = '';

      const rows = (Array.isArray(SITE_COMP_MATRIX) && SITE_COMP_MATRIX.length > 0) ? SITE_COMP_MATRIX : DEFAULT_COMP_MATRIX;
      if (countBadge) countBadge.textContent = `${rows.length} ห้อง`;

      if (rows.length === 0) {
        container.innerHTML = `
          <div class="text-center py-8 text-stone-400">
            <p>ยังไม่มีรายการแถวห้องพักในตาราง</p>
            <button onclick="openComparisonRowEditModal()" class="mt-2 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs shadow-sm">
              + เพิ่มแถวแรก
            </button>
          </div>
        `;
        return;
      }

      rows.forEach((row, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'p-3 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-colors flex items-center justify-between gap-3';

        const isFirst = idx === 0;
        const isLast = idx === rows.length - 1;

        let badgeClass = 'bg-stone-100 text-stone-800';
        if (row.zoneColor === 'blue') badgeClass = 'bg-blue-50 text-blue-800';
        else if (row.zoneColor === 'amber') badgeClass = 'bg-amber-50 text-amber-800';
        else if (row.zoneColor === 'rose') badgeClass = 'bg-rose-50 text-rose-800';
        else if (row.zoneColor === 'emerald') badgeClass = 'bg-emerald-50 text-emerald-800';

        itemEl.innerHTML = `
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <span class="w-8 h-8 rounded-xl bg-amber-100/80 text-base flex items-center justify-center shrink-0 shadow-2xs">
              ${row.icon || '🛏️'}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h4 class="font-semibold text-stone-900 text-xs truncate">${idx + 1}. ${row.name || ''}</h4>
                <span class="px-1.5 py-0.2 rounded-md ${badgeClass} text-[9px] font-medium">${row.zone || ''}</span>
                <span class="font-bold text-zen-torii text-[11px]">${row.price || ''}</span>
              </div>
              <p class="text-[11px] text-stone-500 truncate mt-0.5">${row.highlights || (row.guests + ' • ' + row.beds)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button onclick="moveComparisonRow(${idx}, -1)" ${isFirst ? 'disabled class="w-7 h-7 rounded-lg text-stone-300 cursor-not-allowed flex items-center justify-center text-xs"' : 'class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-2xs active:scale-95 transition-all" title="เลื่อนขึ้น"'} aria-label="Move Up">
              <i class="fa-solid fa-chevron-up"></i>
            </button>
            <button onclick="moveComparisonRow(${idx}, 1)" ${isLast ? 'disabled class="w-7 h-7 rounded-lg text-stone-300 cursor-not-allowed flex items-center justify-center text-xs"' : 'class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-2xs active:scale-95 transition-all" title="เลื่อนลง"'} aria-label="Move Down">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
            <button onclick="openComparisonRowEditModal('${row.id}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-2xs transition-transform active:scale-95 flex items-center gap-1" title="แก้ไข">
              <i class="fa-solid fa-pen text-[10px]"></i> แก้ไข
            </button>
            <button onclick="deleteComparisonRow('${row.id}')" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center text-xs transition-colors" title="ลบแถวนี้" aria-label="Delete">
              <i class="fa-solid fa-trash-can text-[11px]"></i>
            </button>
          </div>
        `;
        container.appendChild(itemEl);
      });
    }

    function moveComparisonRow(idx, direction) {
      let rows = (Array.isArray(SITE_COMP_MATRIX) && SITE_COMP_MATRIX.length > 0) ? SITE_COMP_MATRIX : [...DEFAULT_COMP_MATRIX];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= rows.length) return;

      const temp = rows[idx];
      rows[idx] = rows[targetIdx];
      rows[targetIdx] = temp;
      SITE_COMP_MATRIX = rows;

      try {
        localStorage.setItem('baantaphai_comp_matrix_v3', JSON.stringify(SITE_COMP_MATRIX));
      } catch(e) {}

      renderManageComparisonRowsList();
      renderComparisonTable();
      handleSectionSave('compMatrix', 'จัดเรียงลำดับตารางเปรียบเทียบห้องพัก');
    }

    // Comparison Header Edit Modal Functions
    function openComparisonHeaderEditModal() {
      document.getElementById('editCompTitle').value = SITE_COMP_HEADER.title || DEFAULT_COMP_HEADER.title;
      document.getElementById('editCompSubtitle').value = SITE_COMP_HEADER.subtitle || DEFAULT_COMP_HEADER.subtitle;
      document.getElementById('editCompFooterNote').value = SITE_COMP_HEADER.footerNote || DEFAULT_COMP_HEADER.footerNote;
      document.getElementById('editCompFont').value = SITE_COMP_HEADER.fontOverride || '';

      const m = document.getElementById('editComparisonHeaderModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeComparisonHeaderEditModal() {
      const m = document.getElementById('editComparisonHeaderModal');
      if (m) {
        m.classList.add('hidden');
        if ((!document.getElementById('manageComparisonModal') || document.getElementById('manageComparisonModal').classList.contains('hidden')) &&
            (!document.getElementById('comparisonModal') || document.getElementById('comparisonModal').classList.contains('hidden'))) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function saveComparisonHeaderEdit(isDirectPublish = false) {
      const title = document.getElementById('editCompTitle').value.trim();
      const subtitle = document.getElementById('editCompSubtitle').value.trim();
      const footerNote = document.getElementById('editCompFooterNote').value.trim();
      const font = document.getElementById('editCompFont').value;

      if (!title) {
        alert('กรุณากรอกหัวข้อตารางเปรียบเทียบ');
        return;
      }

      SITE_COMP_HEADER.title = title;
      SITE_COMP_HEADER.subtitle = subtitle;
      SITE_COMP_HEADER.footerNote = footerNote;
      SITE_COMP_HEADER.fontOverride = font;

      try {
        localStorage.setItem('baantaphai_comp_header_v3', JSON.stringify(SITE_COMP_HEADER));
      } catch(e) {}

      closeComparisonHeaderEditModal();
      renderComparisonTable();
      handleSectionSave('compHeader', 'แก้ไขหัวข้อตารางเปรียบเทียบห้องพัก', isDirectPublish);
    }

    // Comparison Row Edit Modal Functions
    function setComparisonPresetEmoji(emoji) {
      const iconInput = document.getElementById('editCompRowIcon');
      if (iconInput) iconInput.value = emoji;
    }

    function openComparisonRowEditModal(rowId = null) {
      const titleEl = document.getElementById('editCompRowModalTitle');
      const idInput = document.getElementById('editCompRowId');
      const iconInput = document.getElementById('editCompRowIcon');
      const nameInput = document.getElementById('editCompRowName');
      const zoneInput = document.getElementById('editCompRowZone');
      const zoneColorInput = document.getElementById('editCompRowZoneColor');
      const priceInput = document.getElementById('editCompRowPrice');
      const guestsInput = document.getElementById('editCompRowGuests');
      const bedsInput = document.getElementById('editCompRowBeds');
      const bathroomsInput = document.getElementById('editCompRowBathrooms');
      const highlightsInput = document.getElementById('editCompRowHighlights');
      const roomIdInput = document.getElementById('editCompRowRoomId');
      const delBtn = document.getElementById('deleteCompRowBtn');

      if (rowId) {
        const rows = (Array.isArray(SITE_COMP_MATRIX) && SITE_COMP_MATRIX.length > 0) ? SITE_COMP_MATRIX : DEFAULT_COMP_MATRIX;
        const row = rows.find(r => r.id === rowId);
        if (!row) return;

        if (titleEl) titleEl.textContent = 'แก้ไขแถวห้องพักในตาราง';
        if (idInput) idInput.value = row.id;
        if (iconInput) iconInput.value = row.icon || '🏡';
        if (nameInput) nameInput.value = row.name || '';
        if (zoneInput) zoneInput.value = row.zone || '';
        if (zoneColorInput) zoneColorInput.value = row.zoneColor || 'blue';
        if (priceInput) priceInput.value = row.price || '';
        if (guestsInput) guestsInput.value = row.guests || '';
        if (bedsInput) bedsInput.value = row.beds || '';
        if (bathroomsInput) bathroomsInput.value = row.bathrooms || '';
        if (highlightsInput) highlightsInput.value = row.highlights || '';
        if (roomIdInput) roomIdInput.value = row.roomId || '';
        if (delBtn) delBtn.classList.remove('hidden');
      } else {
        if (titleEl) titleEl.textContent = 'เพิ่มแถวห้องพักใหม่ในตาราง';
        if (idInput) idInput.value = '';
        if (iconInput) iconInput.value = '🏡';
        if (nameInput) nameInput.value = '';
        if (zoneInput) zoneInput.value = 'ริมน้ำ';
        if (zoneColorInput) zoneColorInput.value = 'blue';
        if (priceInput) priceInput.value = '฿1,200';
        if (guestsInput) guestsInput.value = '2 - 4 ท่าน';
        if (bedsInput) bedsInput.value = 'เตียง King 6 ฟุต 1 หลัง';
        if (bathroomsInput) bathroomsInput.value = '✓ ห้องน้ำในตัว';
        if (highlightsInput) highlightsInput.value = '';
        if (roomIdInput) roomIdInput.value = '';
        if (delBtn) delBtn.classList.add('hidden');
      }

      const m = document.getElementById('editComparisonRowModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeComparisonRowEditModal() {
      const m = document.getElementById('editComparisonRowModal');
      if (m) {
        m.classList.add('hidden');
        if ((!document.getElementById('manageComparisonModal') || document.getElementById('manageComparisonModal').classList.contains('hidden')) &&
            (!document.getElementById('comparisonModal') || document.getElementById('comparisonModal').classList.contains('hidden'))) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function saveComparisonRowEdit(isDirectPublish = false) {
      const id = document.getElementById('editCompRowId').value;
      const icon = document.getElementById('editCompRowIcon').value.trim() || '🛏️';
      const name = document.getElementById('editCompRowName').value.trim();
      const zone = document.getElementById('editCompRowZone').value.trim();
      const zoneColor = document.getElementById('editCompRowZoneColor').value || 'blue';
      const price = document.getElementById('editCompRowPrice').value.trim();
      const guests = document.getElementById('editCompRowGuests').value.trim();
      const beds = document.getElementById('editCompRowBeds').value.trim();
      const bathrooms = document.getElementById('editCompRowBathrooms').value.trim();
      const highlights = document.getElementById('editCompRowHighlights').value.trim();
      const roomId = document.getElementById('editCompRowRoomId').value.trim();

      if (!name) {
        alert('กรุณากรอกชื่อรูปแบบห้องพัก');
        return;
      }

      let rows = (Array.isArray(SITE_COMP_MATRIX) && SITE_COMP_MATRIX.length > 0) ? SITE_COMP_MATRIX : [...DEFAULT_COMP_MATRIX];

      if (id) {
        const row = rows.find(r => r.id === id);
        if (row) {
          row.icon = icon;
          row.name = name;
          row.zone = zone;
          row.zoneColor = zoneColor;
          row.price = price;
          row.guests = guests;
          row.beds = beds;
          row.bathrooms = bathrooms;
          row.highlights = highlights;
          row.roomId = roomId;
        }
      } else {
        const newId = 'row_' + Date.now();
        rows.push({
          id: newId,
          roomId: roomId,
          icon: icon,
          name: name,
          zone: zone,
          zoneColor: zoneColor,
          price: price,
          guests: guests,
          beds: beds,
          bathrooms: bathrooms,
          highlights: highlights
        });
      }

      SITE_COMP_MATRIX = rows;
      try {
        localStorage.setItem('baantaphai_comp_matrix_v3', JSON.stringify(SITE_COMP_MATRIX));
      } catch(e) {}

      closeComparisonRowEditModal();
      renderComparisonTable();
      renderManageComparisonRowsList();
      handleSectionSave('compMatrix', (id ? 'แก้ไขแถวห้องพักในตาราง: ' : 'เพิ่มแถวห้องพักใหม่: ') + name, isDirectPublish);
    }

    function deleteComparisonRowFromModal() {
      const id = document.getElementById('editCompRowId').value;
      if (!id) return;
      deleteComparisonRow(id);
    }

    function deleteComparisonRow(rowId) {
      let rows = (Array.isArray(SITE_COMP_MATRIX) && SITE_COMP_MATRIX.length > 0) ? SITE_COMP_MATRIX : [...DEFAULT_COMP_MATRIX];
      const target = rows.find(r => r.id === rowId);
      const nameText = target ? target.name : 'แถวห้องพักนี้';

      if (confirm(`คุณต้องการลบ "${nameText}" ออกจากตารางเปรียบเทียบใช่หรือไม่?`)) {
        SITE_COMP_MATRIX = rows.filter(r => r.id !== rowId);
        try {
          localStorage.setItem('baantaphai_comp_matrix_v3', JSON.stringify(SITE_COMP_MATRIX));
        } catch(e) {}

        closeComparisonRowEditModal();
        renderComparisonTable();
        renderManageComparisonRowsList();
        handleSectionSave('compMatrix', 'ลบแถวห้องพักในตาราง: ' + nameText);
      }
    }

    // Admin authentication: the passphrase is verified by the server (env var ADMIN_TOKEN on Netlify).
    // The page only ever holds a short-lived signed session token, kept in sessionStorage (cleared when the tab closes).
    const ADMIN_SESSION_KEY = 'baantaphai_admin_session';
    function getAdminSession() {
      try {
        const s = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY) || 'null');
        if (s && s.token && s.expiresAt > Date.now() + 5000) return s;
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      } catch (e) {}
      return null;
    }
    function clearAdminSession() { try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch (e) {} }
    /** Asks the server to verify a passphrase. Resolves { ok, status, token, expiresAt, retryAfterSec, error }. */
    async function verifyAdminPassphrase(passphrase) {
      try {
        const url = CLOUD_SYNC_ENDPOINT + (CLOUD_SYNC_ENDPOINT.includes('?') ? '&' : '?') + 'action=login';
        const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ passphrase }) });   // PATCH: an old, not-yet-updated server refuses it (405) instead of saving it as site data
        let data = {};
        try { data = await res.json(); } catch (e) {}
        if (res.ok && data.success && data.token) {
          try { sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ token: data.token, expiresAt: data.expiresAt })); } catch (e) {}
          return { ok: true, status: res.status, token: data.token, expiresAt: data.expiresAt };
        }
        return { ok: false, status: res.status, error: data.error || 'error', retryAfterSec: data.retryAfterSec || 0 };
      } catch (e) {
        return { ok: false, status: 0, error: 'network' };
      }
    }
    function adminLoginErrorText(r) {
      if (r.status === 429) return '🔒 กรอกผิดหลายครั้ง ระบบล็อกชั่วคราว กรุณารอ ' + Math.max(1, Math.ceil((r.retryAfterSec || 900) / 60)) + ' นาที';
      if (r.status === 503 && r.error === 'weak_token') return '⚠️ รหัสแอดมินบนเซิร์ฟเวอร์สั้นเกินไป (ต้องยาวอย่างน้อย 12 ตัวอักษร) กรุณาเปลี่ยน ADMIN_TOKEN ใน Netlify';
      if (r.status === 503) return '⚙️ เซิร์ฟเวอร์ยังไม่ได้ตั้งค่ารหัสแอดมิน (ADMIN_TOKEN)';
      if (r.status === 405 || r.status === 404) return '⚠️ เซิร์ฟเวอร์ยังเป็นเวอร์ชันเก่า (ยังไม่ได้ deploy ระบบล็อกอินใหม่) ยังเข้าโหมดแก้ไขไม่ได้';
      if (r.error === 'network' || r.status === 0) return '📡 เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง';
      return '❌ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    }

    function promptAdminLogin() {
      if (isAdminMode) {
        toggleAdminMode();
        showToast('🔒 ออกจากโหมดแก้ไขหน้าเว็บแล้ว');
        return;
      }
      const pinModal = document.getElementById('adminPinModal');
      const pinInput = document.getElementById('adminPinInput');
      const pinError = document.getElementById('adminPinError');
      if (pinInput) pinInput.value = '';
      if (pinError) pinError.classList.add('hidden');
      if (pinModal) {
        pinModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        setTimeout(() => pinInput && pinInput.focus(), 100);
      }
    }

    function promptAdminLoginForced() {
      const pinModal = document.getElementById('adminPinModal');
      const pinInput = document.getElementById('adminPinInput');
      const pinError = document.getElementById('adminPinError');
      if (pinInput) pinInput.value = '';
      if (pinError) pinError.classList.add('hidden');
      if (pinModal) {
        pinModal.classList.remove('hidden');
        setTimeout(() => pinInput && pinInput.focus(), 100);
      }
    }

    function closeAdminPinModal() {
      const pinModal = document.getElementById('adminPinModal');
      const pinInput = document.getElementById('adminPinInput');
      const pinError = document.getElementById('adminPinError');
      if (pinModal) pinModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      if (pinInput) pinInput.value = '';
      if (pinError) pinError.classList.add('hidden');
    }

    async function submitAdminPin() {
      const pinInput = document.getElementById('adminPinInput');
      const pinError = document.getElementById('adminPinError');
      const val = (pinInput ? pinInput.value : '').trim();
      if (!val) { if (pinInput) pinInput.focus(); return; }

      if (pinError) pinError.classList.add('hidden');
      const submitBtn = document.getElementById('adminPinSubmit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'กำลังตรวจสอบ...'; }
      const r = await verifyAdminPassphrase(val);
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'ยืนยันรหัส'; }

      if (r.ok) {
        closeAdminPinModal();
        if (!isAdminMode) {
          toggleAdminMode();
        }
        showToast('🔓 เข้าสู่โหมดแก้ไขข้อมูลสำเร็จ!');
      } else {
        if (pinError) { pinError.textContent = adminLoginErrorText(r); pinError.classList.remove('hidden'); }
        if (pinInput) {
          pinInput.select();
          pinInput.focus();
        }
      }
    }

    function toggleAdminMode() {
      if (isPreviewOnlyMode) {
        exitPreviewOnlyMode();
        return;
      }
      isAdminMode = !isAdminMode;
      if (!isAdminMode && typeof clearAdminSession === 'function') clearAdminSession();   // leaving admin mode drops the session token
      const bar = document.getElementById('adminBar');
      if (bar) {
        if (isAdminMode) {
          bar.classList.remove('hidden');
        } else {
          bar.classList.add('hidden');
        }
      }
      renderAllSiteSections();
      updateDraftUI();
    }

    function resetToDefaultData() {
      if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมด (รวมข้อความธรรมชาติ รูปหน้าแรก ห้องพัก ตัวช่วยเลือกห้องพัก โซนอาหาร/คาเฟ่และจุดเด่น เมนู กิจกรรมฟรี สิทธิพิเศษ ตารางเปรียบเทียบ มุมถ่ายรูป รีวิว เพจ Facebook สถานที่ท่องเที่ยวใกล้เคียง เงื่อนไข คำถาม FAQ ข้อมูลติดต่อ แถบประกาศ/สภาพอากาศ และเซียมซี/เรทรางวัล) กลับเป็นค่าเริ่มต้นใช่หรือไม่?\n\n(ข้อมูลจะถูกรีเซ็ตและซิงค์ไปยังทุกอุปกรณ์และลูกค้าทุกคนทันที)')) {
        clearDraftManifest();
        localStorage.removeItem('baantaphai_published_snapshot_v3');
        localStorage.removeItem('baantaphai_typography_v3');
        SITE_TYPOGRAPHY = { ...DEFAULT_TYPOGRAPHY };
        applySiteTypography();
        localStorage.removeItem('baantaphai_logo_v3');
        localStorage.removeItem('baantaphai_nav_menu_v3');
        localStorage.removeItem('baantaphai_header_actions_v3');
        localStorage.removeItem('baantaphai_rooms_v3');
        localStorage.removeItem('baantaphai_hero_v3');
        localStorage.removeItem('baantaphai_dining_v3');
        localStorage.removeItem('baantaphai_menu_v3');
        localStorage.removeItem('baantaphai_act_header_v3');
        localStorage.removeItem('baantaphai_act_items_v3');
        localStorage.removeItem('baantaphai_rooms_header_v3');
        localStorage.removeItem('baantaphai_perks_v3');
        localStorage.removeItem('baantaphai_perks_font_size_v3');
        localStorage.removeItem('baantaphai_ps_header_v3');
        localStorage.removeItem('baantaphai_ps_items_v3');
        localStorage.removeItem('baantaphai_reviews_header_v3');
        localStorage.removeItem('baantaphai_fb_feed_v3');
        localStorage.removeItem('baantaphai_attractions_header_v3');
        localStorage.removeItem('baantaphai_attractions_items_v3');
        localStorage.removeItem('baantaphai_policies_v3');
        localStorage.removeItem('baantaphai_contact_v3');
        localStorage.removeItem('baantaphai_faq_header_v3');
        localStorage.removeItem('baantaphai_faq_items_v3');
        localStorage.removeItem('baantaphai_comp_header_v3');
        localStorage.removeItem('baantaphai_comp_matrix_v3');
        localStorage.removeItem('baantaphai_topbar_v3');
        localStorage.removeItem('baantaphai_omikuji_header_v3');
        localStorage.removeItem('baantaphai_omikuji_prizes_v3');
        localStorage.removeItem('baantaphai_room_finder_v3');
        localStorage.removeItem('baantaphai_dining_header_v3');
        localStorage.removeItem('baantaphai_dining_banner_v3');
        localStorage.removeItem('baantaphai_menu_header_v3');
        localStorage.removeItem('baantaphai_footer_v3');

        SITE_LOGO = JSON.parse(JSON.stringify(DEFAULT_LOGO_DATA));
        SITE_NAV_MENU = JSON.parse(JSON.stringify(DEFAULT_NAV_MENU_DATA));
        SITE_HEADER_ACTIONS = JSON.parse(JSON.stringify(DEFAULT_HEADER_ACTIONS_DATA));
        SITE_ROOMS = JSON.parse(JSON.stringify(DEFAULT_ROOMS_DATA));
        SITE_HERO = JSON.parse(JSON.stringify(DEFAULT_HERO_DATA));
        SITE_DINING = JSON.parse(JSON.stringify(DEFAULT_DINING_CARDS));
        SITE_DINING_BANNER = JSON.parse(JSON.stringify(DEFAULT_DINING_BANNER_DATA));
        SITE_MENU_HEADER = JSON.parse(JSON.stringify(DEFAULT_MENU_HEADER_DATA));
        SITE_MENU = JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS));
        SITE_ACTIVITIES_HEADER = JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES_HEADER));
        SITE_ACTIVITIES = JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES_ITEMS));
        SITE_ROOMS_HEADER = JSON.parse(JSON.stringify(DEFAULT_ROOMS_HEADER));
        SITE_PERKS = JSON.parse(JSON.stringify(DEFAULT_PERKS_DATA));
        SITE_PERKS_FONT_SIZE = 'normal';
        SITE_PHOTO_SPOTS_HEADER = JSON.parse(JSON.stringify(DEFAULT_PHOTO_SPOTS_HEADER));
        SITE_PHOTO_SPOTS = JSON.parse(JSON.stringify(DEFAULT_PHOTO_SPOTS_DATA));
        SITE_REVIEWS_HEADER = JSON.parse(JSON.stringify(DEFAULT_REVIEWS_HEADER));
        SITE_FACEBOOK_FEED = JSON.parse(JSON.stringify(DEFAULT_FACEBOOK_FEED_DATA));
        SITE_ATTRACTIONS_HEADER = JSON.parse(JSON.stringify(DEFAULT_ATTRACTIONS_HEADER));
        SITE_ATTRACTIONS_ITEMS = JSON.parse(JSON.stringify(DEFAULT_ATTRACTIONS_ITEMS));
        SITE_POLICIES = JSON.parse(JSON.stringify(DEFAULT_POLICIES_DATA));
        SITE_CONTACT = JSON.parse(JSON.stringify(DEFAULT_CONTACT_DATA));
        SITE_FAQ_HEADER = JSON.parse(JSON.stringify(DEFAULT_FAQ_HEADER));
        SITE_FAQ_ITEMS = JSON.parse(JSON.stringify(DEFAULT_FAQ_ITEMS));
        SITE_COMP_HEADER = JSON.parse(JSON.stringify(DEFAULT_COMP_HEADER));
        SITE_COMP_MATRIX = JSON.parse(JSON.stringify(DEFAULT_COMP_MATRIX));
        SITE_TOP_BAR = JSON.parse(JSON.stringify(DEFAULT_TOP_BAR_DATA));
        SITE_OMIKUJI_HEADER = JSON.parse(JSON.stringify(DEFAULT_OMIKUJI_HEADER));
        SITE_OMIKUJI_PRIZES = JSON.parse(JSON.stringify(DEFAULT_OMIKUJI_PRIZES));
        if (typeof OMIKUJI_PRIZES !== 'undefined') OMIKUJI_PRIZES = SITE_OMIKUJI_PRIZES;
        SITE_ROOM_FINDER = JSON.parse(JSON.stringify(DEFAULT_ROOM_FINDER_DATA));
        SITE_DINING_HEADER = JSON.parse(JSON.stringify(DEFAULT_DINING_HEADER_DATA));
        SITE_FOOTER = JSON.parse(JSON.stringify(DEFAULT_FOOTER_DATA));
        resetExtraToDefaults();

        renderLogoSection();
        renderNavMenuSection();
        renderHeaderActionsSection();
        renderRoomCards();
        renderHeroSection();
        renderRoomFinder();
        renderDiningHeader();
        renderDiningCards();
        renderDiningBannerSection();
        renderMenuHeaderSection();
        renderMenuItems();
        renderActivitiesSection();
        renderRoomsHeaderAndPerks();
        renderPhotoSpotsSection();
        renderReviewsSection();
        renderFacebookFeedSection();
        renderAttractionsSection();
        renderPoliciesAndContactSection();
        renderFaqSection();
        renderComparisonTable();
        renderTopBar();
        renderOmikujiModal();
        renderFooterSection();
        renderExtraSections();
        clearDraftManifest();
        snapshotPublishedState();
        showToast('🔄 คืนค่าเริ่มต้นเรียบร้อยแล้ว');
        pushCloudData('รีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น');
        updateDraftUI();
      }
    }

    function toggleMobileMenu() {
      const drawer = document.getElementById('mobileMenuDrawer');
      if (!drawer) return;
      drawer.classList.toggle('hidden');
      if (!drawer.classList.contains('hidden')) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }

    function downloadUpdatedHTML() {
      // 1. Temporarily turn off admin mode & close modals so exported file has 100% clean production markup
      const wasAdminMode = isAdminMode;
      if (isAdminMode) {
        isAdminMode = false;
        const bar = document.getElementById('adminBar');
        if (bar) bar.classList.add('hidden');
        renderLogoSection();
        renderNavMenuSection();
        renderHeaderActionsSection();
        renderRoomCards();
        renderHeroSection();
        renderRoomFinder();
        renderDiningHeader();
        renderDiningCards();
        renderMenuItems();
        renderActivitiesSection();
        renderRoomsHeaderAndPerks();
        renderPhotoSpotsSection();
        renderReviewsSection();
        renderFacebookFeedSection();
        renderAttractionsSection();
        renderPoliciesAndContactSection();
        renderFaqSection();
        renderComparisonTable();
        renderTopBar();
        renderOmikujiModal();
        renderFooterSection();
      }
      closeNavMenuEditModal();
      closeHeaderActionsEditModal();
      closeMenuHeaderEditModal();
      closeEditModal();
      closeHeroEditModal();
      closeRoomFinderEditModal();
      closeDiningHeaderEditModal();
      closeDiningEditModal();
      closeDiningBannerEditModal();
      closeMenuItemEditModal();
      closeActivitiesHeaderEditModal();
      closeActivityCardEditModal();
      closeRoomsHeaderEditModal();
      closePerksEditModal();
      closePhotoSpotsHeaderEditModal();
      closePhotoSpotCardEditModal();
      closeReviewsHeaderEditModal();
      closeFacebookEditModal();
      closeManageAttractionsModal();
      closeAttractionsHeaderEditModal();
      closeAttractionItemEditModal();
      closePoliciesEditModal();
      closeContactEditModal();
      closeFaqModal();
      closeFaqHeaderEditModal();
      closeFaqItemEditModal();
      closeFaqCtaEditModal();
      closeFaqCtaSingleBtnModal();
      closeFooterEditModal();
      closeFooterSingleBtnModal();
      closeComparisonManagerModal();
      closeComparisonHeaderEditModal();
      closeComparisonRowEditModal();
      closeTopBarEditModal();
      closeOmikujiManagerModal();
      closeOmikujiHeaderEditModal();
      closeOmikujiTierEditModal();
      closeAdminPinModal();

      // 2. Serialize full document and inject updated default constants
      const serializedData = JSON.stringify(SITE_ROOMS, null, 2);
      const serializedCompHeader = JSON.stringify(SITE_COMP_HEADER, null, 2);
      const serializedCompMatrix = JSON.stringify(SITE_COMP_MATRIX, null, 2);
      const serializedRoomFinder = JSON.stringify(SITE_ROOM_FINDER, null, 2);
      const serializedDiningHeader = JSON.stringify(SITE_DINING_HEADER, null, 2);
      const serializedHero = JSON.stringify(SITE_HERO, null, 2);
      const serializedDining = JSON.stringify(SITE_DINING, null, 2);
      const serializedDiningBanner = JSON.stringify(SITE_DINING_BANNER, null, 2);
      const serializedMenuHeader = JSON.stringify(SITE_MENU_HEADER, null, 2);
      const serializedMenu = JSON.stringify(SITE_MENU, null, 2);
      const serializedActHeader = JSON.stringify(SITE_ACTIVITIES_HEADER, null, 2);
      const serializedActItems = JSON.stringify(SITE_ACTIVITIES, null, 2);
      const serializedLogo = JSON.stringify(SITE_LOGO, null, 2);
      const serializedNavMenu = JSON.stringify(SITE_NAV_MENU, null, 2);
      const serializedHeaderActions = JSON.stringify(SITE_HEADER_ACTIONS, null, 2);
      const serializedRoomsHeader = JSON.stringify(SITE_ROOMS_HEADER, null, 2);
      const serializedPerks = JSON.stringify(SITE_PERKS, null, 2);
      const serializedPsHeader = JSON.stringify(SITE_PHOTO_SPOTS_HEADER, null, 2);
      const serializedPsItems = JSON.stringify(SITE_PHOTO_SPOTS, null, 2);
      const serializedReviewsHeader = JSON.stringify(SITE_REVIEWS_HEADER, null, 2);
      const serializedFbFeed = JSON.stringify(SITE_FACEBOOK_FEED, null, 2);
      const serializedAttractionsHeader = JSON.stringify(SITE_ATTRACTIONS_HEADER, null, 2);
      const serializedAttractionsItems = JSON.stringify(SITE_ATTRACTIONS_ITEMS, null, 2);
      const serializedPolicies = JSON.stringify(SITE_POLICIES, null, 2);
      const serializedContact = JSON.stringify(SITE_CONTACT, null, 2);
      const serializedFaqHeader = JSON.stringify(SITE_FAQ_HEADER, null, 2);
      const serializedFaqItems = JSON.stringify(SITE_FAQ_ITEMS, null, 2);
      const serializedFooter = JSON.stringify(SITE_FOOTER, null, 2);
      const serializedTopBar = JSON.stringify(SITE_TOP_BAR, null, 2);
      const serializedOmikujiHeader = JSON.stringify(SITE_OMIKUJI_HEADER, null, 2);
      const serializedOmikujiPrizes = JSON.stringify(SITE_OMIKUJI_PRIZES, null, 2);

      let updatedHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      const currentTitle = (SITE_LOGO && SITE_LOGO.pageTitle) || 'บ้านตาผายรีสอร์ท | Ta Phai Country House Resort & Restaurant';
      updatedHtml = updatedHtml.replace(
        /<title>[\s\S]*?<\/title>/,
        `<title>${currentTitle}</title>`
      );
      updatedHtml = updatedHtml.replace(
        /<meta property="og:title" content="[\s\S]*?">/,
        `<meta property="og:title" content="${currentTitle}">`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_ROOMS_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.05\s*MASTER COMPARISON MATRIX DATA/,
        `const DEFAULT_ROOMS_DATA = ${serializedData};\n\n    // 1.05 MASTER COMPARISON MATRIX DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_COMP_HEADER = \{[\s\S]*?\};\s*const DEFAULT_COMP_MATRIX/,
        `const DEFAULT_COMP_HEADER = ${serializedCompHeader};\n\n    const DEFAULT_COMP_MATRIX`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_COMP_MATRIX = \[[\s\S]*?\];\s*\/\/\s*1\.08\s*MASTER INTERACTIVE ROOM FINDER DATA/,
        `const DEFAULT_COMP_MATRIX = ${serializedCompMatrix};\n\n    // 1.08 MASTER INTERACTIVE ROOM FINDER DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_ROOM_FINDER_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.09\s*MASTER DINING HEADER & HIGHLIGHTS DATA/,
        `const DEFAULT_ROOM_FINDER_DATA = ${serializedRoomFinder};\n\n    // 1.09 MASTER DINING HEADER & HIGHLIGHTS DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_DINING_HEADER_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.1\s*MASTER DINING SHOWCASE CARDS DATA/,
        `const DEFAULT_DINING_HEADER_DATA = ${serializedDiningHeader};\n\n    // 1.1 MASTER DINING SHOWCASE CARDS DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_HERO_DATA = \{[\s\S]*?\};\s*let SITE_HERO/,
        `const DEFAULT_HERO_DATA = ${serializedHero};\n\n    let SITE_HERO`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_DINING_CARDS = \[[\s\S]*?\];\s*\/\/\s*1\.14\s*MASTER DINING ACTION BANNER DATA/,
        `const DEFAULT_DINING_CARDS = ${serializedDining};\n\n    // 1.14 MASTER DINING ACTION BANNER DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_DINING_BANNER_DATA = \{[\s\S]*?\};\s*let SITE_DINING_BANNER/,
        `const DEFAULT_DINING_BANNER_DATA = ${serializedDiningBanner};\n\n    let SITE_DINING_BANNER`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_MENU_HEADER_DATA = \{[\s\S]*?\};\s*let SITE_MENU_HEADER/,
        `const DEFAULT_MENU_HEADER_DATA = ${serializedMenuHeader};\n\n    let SITE_MENU_HEADER`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_MENU_ITEMS = \[[\s\S]*?\];\s*\/\/\s*2\.\s*ACTIVE ENGINE/,
        `const DEFAULT_MENU_ITEMS = ${serializedMenu};\n\n    // 2. ACTIVE ENGINE`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_ACTIVITIES_HEADER = \{[\s\S]*?\};\s*const DEFAULT_ACTIVITIES_ITEMS/,
        `const DEFAULT_ACTIVITIES_HEADER = ${serializedActHeader};\n\n    const DEFAULT_ACTIVITIES_ITEMS`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_ACTIVITIES_ITEMS = \[[\s\S]*?\];\s*\/\/\s*1\.4\s*MASTER ROOMS SECTION HEADER/,
        `const DEFAULT_ACTIVITIES_ITEMS = ${serializedActItems};\n\n    // 1.4 MASTER ROOMS SECTION HEADER`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_ROOMS_HEADER = \{[\s\S]*?\};\s*const DEFAULT_PERKS_DATA/,
        `const DEFAULT_ROOMS_HEADER = ${serializedRoomsHeader};\n\n    const DEFAULT_PERKS_DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_PERKS_DATA = \[[\s\S]*?\];\s*\/\/\s*1\.45\s*MASTER LOGO & BRANDING DATA/,
        `const DEFAULT_PERKS_DATA = ${serializedPerks};\n\n    // 1.45 MASTER LOGO & BRANDING DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_LOGO_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.46\s*MASTER NAVBAR & MENU LINKS DATA/,
        `const DEFAULT_LOGO_DATA = ${serializedLogo};\n\n    // 1.46 MASTER NAVBAR & MENU LINKS DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_NAV_MENU_DATA = \{[\s\S]*?\};\s*let SITE_NAV_MENU/,
        `const DEFAULT_NAV_MENU_DATA = ${serializedNavMenu};\n\n    let SITE_NAV_MENU`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_HEADER_ACTIONS_DATA = \{[\s\S]*?\};\s*let SITE_HEADER_ACTIONS/,
        `const DEFAULT_HEADER_ACTIONS_DATA = ${serializedHeaderActions};\n\n    let SITE_HEADER_ACTIONS`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_PHOTO_SPOTS_HEADER = \{[\s\S]*?\};\s*const DEFAULT_PHOTO_SPOTS_DATA/,
        `const DEFAULT_PHOTO_SPOTS_HEADER = ${serializedPsHeader};\n\n    const DEFAULT_PHOTO_SPOTS_DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_PHOTO_SPOTS_DATA = \[[\s\S]*?\];\s*\/\/\s*1\.6\s*MASTER REVIEWS & TRUST DATA/,
        `const DEFAULT_PHOTO_SPOTS_DATA = ${serializedPsItems};\n\n    // 1.6 MASTER REVIEWS & TRUST DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_REVIEWS_HEADER = \{[\s\S]*?\};\s*\/\/\s*1\.65\s*MASTER FACEBOOK COMMUNITY FEED DATA/,
        `const DEFAULT_REVIEWS_HEADER = ${serializedReviewsHeader};\n\n    // 1.65 MASTER FACEBOOK COMMUNITY FEED DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_FACEBOOK_FEED_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.68\s*MASTER NEARBY ATTRACTIONS DATA/,
        `const DEFAULT_FACEBOOK_FEED_DATA = ${serializedFbFeed};\n\n    // 1.68 MASTER NEARBY ATTRACTIONS DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_ATTRACTIONS_HEADER = \{[\s\S]*?\};\s*const DEFAULT_ATTRACTIONS_ITEMS/,
        `const DEFAULT_ATTRACTIONS_HEADER = ${serializedAttractionsHeader};\n\n    const DEFAULT_ATTRACTIONS_ITEMS`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_ATTRACTIONS_ITEMS = \[[\s\S]*?\];\s*\/\/\s*1\.7\s*MASTER FAQ DATA/,
        `const DEFAULT_ATTRACTIONS_ITEMS = ${serializedAttractionsItems};\n\n    // 1.7 MASTER FAQ DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_FAQ_HEADER = \{[\s\S]*?\};\s*const DEFAULT_FAQ_ITEMS/,
        `const DEFAULT_FAQ_HEADER = ${serializedFaqHeader};\n\n    const DEFAULT_FAQ_ITEMS`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_FAQ_ITEMS = \[[\s\S]*?\];\s*\/\/\s*1\.8\s*MASTER STAY POLICIES DATA/,
        `const DEFAULT_FAQ_ITEMS = ${serializedFaqItems};\n\n    // 1.8 MASTER STAY POLICIES DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_POLICIES_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.9\s*MASTER CONTACT & LOCATION DATA/,
        `const DEFAULT_POLICIES_DATA = ${serializedPolicies};\n\n    // 1.9 MASTER CONTACT & LOCATION DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_CONTACT_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.95\s*MASTER TOP ANNOUNCEMENT BAR & WEATHER DATA/,
        `const DEFAULT_CONTACT_DATA = ${serializedContact};\n\n    // 1.95 MASTER TOP ANNOUNCEMENT BAR & WEATHER DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_TOP_BAR_DATA = \{[\s\S]*?\};\s*\/\/\s*1\.96\s*MASTER OMIKUJI & FORTUNE SYSTEM DATA/,
        `const DEFAULT_TOP_BAR_DATA = ${serializedTopBar};\n\n    // 1.96 MASTER OMIKUJI & FORTUNE SYSTEM DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_OMIKUJI_HEADER = \{[\s\S]*?\};\s*const DEFAULT_OMIKUJI_PRIZES/,
        `const DEFAULT_OMIKUJI_HEADER = ${serializedOmikujiHeader};\n\n    const DEFAULT_OMIKUJI_PRIZES`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_OMIKUJI_PRIZES = \[[\s\S]*?\];\s*\/\/\s*1\.97\s*MASTER FOOTER DATA/,
        `const DEFAULT_OMIKUJI_PRIZES = ${serializedOmikujiPrizes};\n\n    // 1.97 MASTER FOOTER DATA`
      );
      updatedHtml = updatedHtml.replace(
        /const DEFAULT_FOOTER_DATA = \{[\s\S]*?\};\s*let SITE_ACTIVITIES_HEADER/,
        `const DEFAULT_FOOTER_DATA = ${serializedFooter};\n\n    let SITE_ACTIVITIES_HEADER`
      );

      // 3. Trigger download
      const blob = new Blob([updatedHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resort_showcase.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 4. Restore admin mode state if it was active
      if (wasAdminMode) {
        isAdminMode = true;
        const bar = document.getElementById('adminBar');
        if (bar) bar.classList.remove('hidden');
        renderLogoSection();
        renderNavMenuSection();
        renderRoomCards();
        renderHeroSection();
        renderRoomFinder();
        renderDiningHeader();
        renderDiningCards();
        renderMenuItems();
        renderActivitiesSection();
        renderRoomsHeaderAndPerks();
        renderPhotoSpotsSection();
        renderReviewsSection();
        renderFacebookFeedSection();
        renderAttractionsSection();
        renderPoliciesAndContactSection();
        renderFaqSection();
        renderComparisonTable();
        renderTopBar();
        renderOmikujiModal();
      }

      showToast('💾 ดาวน์โหลดไฟล์ resort_showcase.html ที่บันทึกข้อมูลถาวรเรียบร้อยแล้ว!');
    }

    // 12. RESORT MENU & DINING CONTROLLERS
    let currentMenuCategory = 'drinks';

    function renderDiningHeader() {
      const container = document.getElementById('diningHeaderContainer');
      if (!container) return;

      const adminBtnHtml = isAdminMode ? `
        <div class="pt-2">
          <button onclick="openDiningHeaderEditModal()" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-md inline-flex items-center gap-1.5 transition-transform active:scale-95">
            <i class="fa-solid fa-pen"></i> แก้ไขหัวข้อคาเฟ่ & จุดเด่น
          </button>
        </div>
      ` : '';

      const highlights = SITE_DINING_HEADER.highlights || DEFAULT_DINING_HEADER_DATA.highlights;
      const highlightsHtml = highlights.map(h => {
        const cls = h.isSpecial 
          ? 'px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200'
          : 'px-3 py-1 rounded-full bg-zen-sand text-zen-dark border border-zen-cardborder';
        return `<span class="${cls}">${h.text}</span>`;
      }).join('');

      container.innerHTML = `
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] sm:text-[11px] font-medium tracking-widest uppercase border border-amber-200">
          <i class="fa-solid fa-mug-saucer text-amber-600"></i>
          <span>${SITE_DINING_HEADER.badge || 'Culinary & Riverside Café'}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-semibold text-zen-dark leading-tight">
          ${SITE_DINING_HEADER.title}
        </h2>
        <p class="text-xs sm:text-sm text-zen-muted font-light leading-relaxed">
          ${SITE_DINING_HEADER.desc}
        </p>

        <!-- Quick Highlight Badges -->
        <div class="pt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs">
          ${highlightsHtml}
        </div>
        ${adminBtnHtml}
      `;
    }

    function openDiningHeaderEditModal() {
      const dh = SITE_DINING_HEADER || DEFAULT_DINING_HEADER_DATA;
      const h = dh.highlights || DEFAULT_DINING_HEADER_DATA.highlights;

      document.getElementById('editDiningSecBadge').value = dh.badge || '';
      document.getElementById('editDiningSecTitle').value = dh.title || '';
      document.getElementById('editDiningSecDesc').value = dh.desc || '';

      document.getElementById('editDiningSecH1Text').value = h[0]?.text || '☕ กาแฟสด & มัทฉะเข้มข้น เริ่มต้น ฿55.-';
      document.getElementById('editDiningSecH2Text').value = h[1]?.text || '🍲 อาหารไทย & กับข้าว เริ่มต้น ฿80.-';
      document.getElementById('editDiningSecH3Text').value = h[2]?.text || '🍳 รวมอาหารเช้าฟรีทุกห้องพัก';
      document.getElementById('editDiningSecH3Special').checked = h[2]?.isSpecial !== false;
      document.getElementById('editDiningSecH4Text').value = h[3]?.text || '🌿 มีซุ้มอาหารส่วนตัวริมน้ำ';

      const modal = document.getElementById('editDiningSectionHeaderModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeDiningHeaderEditModal() {
      const modal = document.getElementById('editDiningSectionHeaderModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveDiningHeaderEdit(isDirectPublish = false) {
      const badge = document.getElementById('editDiningSecBadge').value.trim() || 'Culinary & Riverside Café';
      const title = document.getElementById('editDiningSecTitle').value.trim() || 'ลิ้มรสความอร่อยริมสายน้ำ ทั้งคาเฟ่สดชื่นและครัวไทยต้นตำรับ';
      const desc = document.getElementById('editDiningSecDesc').value.trim();

      const h1Text = document.getElementById('editDiningSecH1Text').value.trim() || '☕ กาแฟสด & มัทฉะเข้มข้น เริ่มต้น ฿55.-';
      const h2Text = document.getElementById('editDiningSecH2Text').value.trim() || '🍲 อาหารไทย & กับข้าว เริ่มต้น ฿80.-';
      const h3Text = document.getElementById('editDiningSecH3Text').value.trim() || '🍳 รวมอาหารเช้าฟรีทุกห้องพัก';
      const h3Special = document.getElementById('editDiningSecH3Special').checked;
      const h4Text = document.getElementById('editDiningSecH4Text').value.trim() || '🌿 มีซุ้มอาหารส่วนตัวริมน้ำ';

      SITE_DINING_HEADER = {
        badge,
        title,
        desc,
        highlights: [
          { text: h1Text, isSpecial: false },
          { text: h2Text, isSpecial: false },
          { text: h3Text, isSpecial: h3Special },
          { text: h4Text, isSpecial: false }
        ]
      };

      try {
        localStorage.setItem('baantaphai_dining_header_v3', JSON.stringify(SITE_DINING_HEADER));
      } catch (e) {}

      renderDiningHeader();
      closeDiningHeaderEditModal();
      handleSectionSave('diningHeader', 'อัปเดตหัวข้อคาเฟ่และจุดเด่น', isDirectPublish);
    }

    function renderDiningCards() {
      const container = document.getElementById('diningCardsContainer');
      if (!container) return;
      container.innerHTML = '';
      
      SITE_DINING.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'dine-card flex flex-col group relative';
        
        const editBtnHtml = isAdminMode ? `
          <button onclick="openDiningEditModal('${card.id}')" class="absolute top-3 right-3 z-20 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform active:scale-95">
            <i class="fa-solid fa-pen"></i> แก้ไขการ์ดนี้
          </button>
        ` : '';
        
        const priceKind = (card.price || '').includes('ฟรี') ? 'free' : ((card.price || '').includes('Private') ? 'private' : 'std');

        cardEl.innerHTML = `
          ${editBtnHtml}
          <div class="dine-media relative aspect-[4/3] overflow-hidden bg-stone-100">
            <img src="${card.img}" alt="${card.title}" loading="lazy" decoding="async" class="w-full h-full object-cover" style="${getCardImageStyle(card)}">
            <div class="room-shade absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"></div>
            <span class="room-chip absolute top-3.5 left-3.5">${card.badge}</span>
            <span class="dine-price ${priceKind} absolute bottom-3.5 right-3.5">${card.price}</span>
          </div>
          <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
            <div>
              <h3 class="dine-title">${card.title}</h3>
              <p class="dine-desc">${card.desc}</p>
            </div>
            <div class="dine-tags">
              ${(card.tags || []).map(tag => `
                <div><i class="fa-solid fa-check shrink-0"></i><span>${tag}</span></div>
              `).join('')}
            </div>
          </div>
        `;
        container.appendChild(cardEl);
      });
    }

    // 12.1 DINING ACTION BANNER CONTROLLER & EDITORS
    function renderDiningBannerSection() {
      const container = document.getElementById('diningBannerContainer');
      if (!container) return;

      const d = SITE_DINING_BANNER || DEFAULT_DINING_BANNER_DATA;

      if (!d.showBanner) {
        if (isAdminMode) {
          container.className = 'relative group my-4';
          container.innerHTML = `
            <div class="p-4 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-eye-slash text-stone-400"></i>
                <span>แถบสั่งอาหารล่วงหน้า & เมนู ถูกซ่อนอยู่ (ลูกค้าทั่วไปจะไม่เห็นแถบนี้บนหน้าเว็บ)</span>
              </span>
              <button onclick="openDiningBannerEditModal()" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95 shrink-0">
                <i class="fa-solid fa-pen"></i> แก้ไข / เปิดแสดงผล
              </button>
            </div>
          `;
        } else {
          container.className = 'hidden';
          container.innerHTML = '';
        }
        return;
      }

      container.className = 'relative group';

      const adminBtnHtml = isAdminMode ? `
        <button onclick="openDiningBannerEditModal()" class="admin-edit-badge absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 active:scale-95 opacity-90 hover:opacity-100" title="แก้ไขข้อความและปุ่มแถบสั่งอาหาร">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>แก้ไขแถบนี้</span>
        </button>
      ` : '';

      const btnMenuHtml = d.showBtnMenu !== false ? `
        <button onclick="openMenuModal()" class="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white text-zen-dark font-medium text-xs hover:bg-zen-sand transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
          <i class="${escapeHtml(d.btnMenuIcon || 'fa-solid fa-book-open')} text-zen-torii"></i>
          <span>${escapeHtml(d.btnMenuText || 'เปิดดูเมนูอาหาร')}</span>
        </button>
      ` : '';

      const btnMessengerHtml = d.showBtnMessenger !== false ? `
        <a href="${escapeHtml(d.btnMessengerUrl || 'https://m.me/Baantaphai')}" target="_blank" class="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#005EC4] hover:bg-[#0073E6] text-white font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
          <i class="fa-brands fa-facebook-messenger text-base"></i>
          <span>${escapeHtml(d.btnMessengerText || 'ทัก Messenger')}</span>
        </a>
      ` : '';

      const btnLineHtml = d.showBtnLine !== false ? `
        <a href="${escapeHtml(d.btnLineUrl || 'https://line.me/R/ti/p/@baantaphairesort')}" target="_blank" class="w-full sm:w-auto px-4 py-3 rounded-2xl bg-zen-line hover:bg-emerald-600 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
          <i class="fa-brands fa-line text-base"></i>
          <span>${escapeHtml(d.btnLineText || 'ทัก LINE สั่งอาหาร')}</span>
        </a>
      ` : '';

      container.innerHTML = `
        ${adminBtnHtml}
        <div class="p-6 sm:p-8 rounded-3xl bg-zen-forest text-zen-sand flex flex-col md:flex-row items-center justify-between gap-6 shadow-minimal overflow-hidden break-words">
          <div class="space-y-1.5 text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start gap-2 text-amber-300 text-xs font-semibold">
              <i class="${escapeHtml(d.badgeIcon || 'fa-solid fa-bell-concierge')}"></i>
              <span>${escapeHtml(d.badgeText || '')}</span>
            </div>
            <h4 class="font-luxury text-xl sm:text-2xl font-bold text-white break-words">
              ${escapeHtml(d.title || '')}
            </h4>
            <p class="text-xs sm:text-sm text-zen-sand/80 font-light max-w-xl break-words">
              ${escapeHtml(d.desc || '')}
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto shrink-0">
            ${btnMenuHtml}
            ${btnMessengerHtml}
            ${btnLineHtml}
          </div>
        </div>
      `;
    }

    function openDiningBannerEditModal() {
      const d = SITE_DINING_BANNER || DEFAULT_DINING_BANNER_DATA;

      const showEl = document.getElementById('editDiningBannerShow');
      if (showEl) showEl.checked = d.showBanner !== false;

      const badgeIconEl = document.getElementById('editDiningBannerBadgeIcon');
      if (badgeIconEl) badgeIconEl.value = d.badgeIcon || 'fa-solid fa-bell-concierge';

      const badgeTextEl = document.getElementById('editDiningBannerBadgeText');
      if (badgeTextEl) badgeTextEl.value = d.badgeText || 'บริการสั่งอาหารล่วงหน้า & เช็คเมนูสดใหม่';

      const titleEl = document.getElementById('editDiningBannerTitle');
      if (titleEl) titleEl.value = d.title || 'อยากดูรายการเมนู หรือสั่งอาหารเตรียมไว้ล่วงหน้าก่อนเข้าพัก?';

      const descEl = document.getElementById('editDiningBannerDesc');
      if (descEl) descEl.value = d.desc || '';

      const showMenuEl = document.getElementById('editDiningBannerShowMenu');
      if (showMenuEl) showMenuEl.checked = d.showBtnMenu !== false;

      const menuTextEl = document.getElementById('editDiningBannerMenuText');
      if (menuTextEl) menuTextEl.value = d.btnMenuText || 'เปิดดูเมนูอาหาร';

      const menuIconEl = document.getElementById('editDiningBannerMenuIcon');
      if (menuIconEl) menuIconEl.value = d.btnMenuIcon || 'fa-solid fa-book-open';

      const showMsgrEl = document.getElementById('editDiningBannerShowMessenger');
      if (showMsgrEl) showMsgrEl.checked = d.showBtnMessenger !== false;

      const msgrTextEl = document.getElementById('editDiningBannerMessengerText');
      if (msgrTextEl) msgrTextEl.value = d.btnMessengerText || 'ทัก Messenger';

      const msgrUrlEl = document.getElementById('editDiningBannerMessengerUrl');
      if (msgrUrlEl) msgrUrlEl.value = d.btnMessengerUrl || 'https://m.me/Baantaphai';

      const showLineEl = document.getElementById('editDiningBannerShowLine');
      if (showLineEl) showLineEl.checked = d.showBtnLine !== false;

      const lineTextEl = document.getElementById('editDiningBannerLineText');
      if (lineTextEl) lineTextEl.value = d.btnLineText || 'ทัก LINE สั่งอาหาร';

      const lineUrlEl = document.getElementById('editDiningBannerLineUrl');
      if (lineUrlEl) lineUrlEl.value = d.btnLineUrl || 'https://line.me/R/ti/p/@baantaphairesort';

      updateDiningBannerLivePreview();

      const modal = document.getElementById('editDiningBannerModal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeDiningBannerEditModal() {
      const modal = document.getElementById('editDiningBannerModal');
      if (modal) modal.classList.add('hidden');
    }

    function updateDiningBannerLivePreview() {
      const preview = document.getElementById('diningBannerLivePreview');
      if (!preview) return;

      const show = document.getElementById('editDiningBannerShow')?.checked ?? true;
      const badgeIcon = document.getElementById('editDiningBannerBadgeIcon')?.value || 'fa-solid fa-bell-concierge';
      const badgeText = document.getElementById('editDiningBannerBadgeText')?.value || '';
      const title = document.getElementById('editDiningBannerTitle')?.value || '';
      const desc = document.getElementById('editDiningBannerDesc')?.value || '';

      const showMenu = document.getElementById('editDiningBannerShowMenu')?.checked ?? true;
      const menuText = document.getElementById('editDiningBannerMenuText')?.value || 'เปิดดูเมนูอาหาร';
      const menuIcon = document.getElementById('editDiningBannerMenuIcon')?.value || 'fa-solid fa-book-open';

      const showMsgr = document.getElementById('editDiningBannerShowMessenger')?.checked ?? true;
      const msgrText = document.getElementById('editDiningBannerMessengerText')?.value || 'ทัก Messenger';

      const showLine = document.getElementById('editDiningBannerShowLine')?.checked ?? true;
      const lineText = document.getElementById('editDiningBannerLineText')?.value || 'ทัก LINE สั่งอาหาร';

      if (!show) {
        preview.innerHTML = `
          <div class="w-full text-center py-4 text-stone-400 text-xs italic">
            (แถบนี้ถูกตั้งค่าเป็น "ซ่อน" จะไม่ปรากฏแก่ลูกค้าบนหน้าเว็บ)
          </div>
        `;
        return;
      }

      preview.innerHTML = `
        <div class="space-y-1 text-left w-full md:w-auto break-words">
          <div class="flex items-center gap-1.5 text-amber-300 text-[11px] font-semibold">
            <i class="${escapeHtml(badgeIcon)}"></i>
            <span>${escapeHtml(badgeText)}</span>
          </div>
          <h4 class="font-luxury text-base sm:text-lg font-bold text-white leading-snug break-words">
            ${escapeHtml(title)}
          </h4>
          <p class="text-[11px] text-zen-sand/80 font-light max-w-lg break-words">
            ${escapeHtml(desc)}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          ${showMenu ? `
          <span class="px-3 py-1.5 rounded-xl bg-white text-zen-dark font-medium text-[11px] flex items-center gap-1.5 shadow-xs">
            <i class="${escapeHtml(menuIcon)} text-zen-torii"></i>
            <span>${escapeHtml(menuText)}</span>
          </span>` : ''}
          ${showMsgr ? `
          <span class="px-3 py-1.5 rounded-xl bg-[#005EC4] text-white font-medium text-[11px] flex items-center gap-1.5 shadow-xs">
            <i class="fa-brands fa-facebook-messenger"></i>
            <span>${escapeHtml(msgrText)}</span>
          </span>` : ''}
          ${showLine ? `
          <span class="px-3 py-1.5 rounded-xl bg-zen-line text-white font-medium text-[11px] flex items-center gap-1.5 shadow-xs">
            <i class="fa-brands fa-line"></i>
            <span>${escapeHtml(lineText)}</span>
          </span>` : ''}
        </div>
      `;
    }

    function saveDiningBannerEdit(isDirectPublish = false) {
      const show = document.getElementById('editDiningBannerShow')?.checked ?? true;
      const badgeIcon = document.getElementById('editDiningBannerBadgeIcon')?.value.trim() || 'fa-solid fa-bell-concierge';
      const badgeText = document.getElementById('editDiningBannerBadgeText')?.value.trim() || 'บริการสั่งอาหารล่วงหน้า & เช็คเมนูสดใหม่';
      const title = document.getElementById('editDiningBannerTitle')?.value.trim() || 'อยากดูรายการเมนู หรือสั่งอาหารเตรียมไว้ล่วงหน้าก่อนเข้าพัก?';
      const desc = document.getElementById('editDiningBannerDesc')?.value.trim() || '';

      const showMenu = document.getElementById('editDiningBannerShowMenu')?.checked ?? true;
      const menuText = document.getElementById('editDiningBannerMenuText')?.value.trim() || 'เปิดดูเมนูอาหาร';
      const menuIcon = document.getElementById('editDiningBannerMenuIcon')?.value.trim() || 'fa-solid fa-book-open';

      const showMsgr = document.getElementById('editDiningBannerShowMessenger')?.checked ?? true;
      const msgrText = document.getElementById('editDiningBannerMessengerText')?.value.trim() || 'ทัก Messenger';
      const msgrUrl = document.getElementById('editDiningBannerMessengerUrl')?.value.trim() || 'https://m.me/Baantaphai';

      const showLine = document.getElementById('editDiningBannerShowLine')?.checked ?? true;
      const lineText = document.getElementById('editDiningBannerLineText')?.value.trim() || 'ทัก LINE สั่งอาหาร';
      const lineUrl = document.getElementById('editDiningBannerLineUrl')?.value.trim() || 'https://line.me/R/ti/p/@baantaphairesort';

      SITE_DINING_BANNER = {
        showBanner: show,
        badgeIcon,
        badgeText,
        title,
        desc,
        showBtnMenu: showMenu,
        btnMenuText: menuText,
        btnMenuIcon: menuIcon,
        showBtnMessenger: showMsgr,
        btnMessengerText: msgrText,
        btnMessengerUrl: msgrUrl,
        showBtnLine: showLine,
        btnLineText: lineText,
        btnLineUrl: lineUrl
      };

      try {
        localStorage.setItem('baantaphai_dining_banner_v3', JSON.stringify(SITE_DINING_BANNER));
      } catch (e) {
        console.error('LocalStorage write error for dining banner:', e);
      }

      renderDiningBannerSection();
      closeDiningBannerEditModal();
      handleSectionSave('diningBanner', 'แก้ไขแถบสั่งอาหารล่วงหน้า (Action Banner)', isDirectPublish);
    }

    function renderMenuItems() {
      renderMenuHeaderSection();
      const grid = document.getElementById('menuItemsGrid');
      const adminHeader = document.getElementById('menuAdminHeader');
      if (adminHeader) {
        if (isAdminMode) adminHeader.classList.remove('hidden');
        else adminHeader.classList.add('hidden');
      }
      if (!grid) return;
      grid.innerHTML = '';

      const filtered = SITE_MENU.filter(item => {
        if (currentMenuCategory === 'all') return true;
        return item.category === currentMenuCategory;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="col-span-1 sm:col-span-2 text-center py-10 text-stone-400 text-xs">
            <i class="fa-solid fa-utensils text-2xl mb-2 text-stone-300 block"></i>
            <span>ยังไม่มีรายการในหมวดหมู่นี้</span>
          </div>
        `;
        return;
      }

      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card p-3.5 rounded-2xl bg-white border border-zen-cardborder shadow-minimal flex items-start justify-between gap-3 hover:border-amber-400/60 transition-colors relative';
        card.setAttribute('data-category', item.category);

        const editBtnHtml = isAdminMode ? `
          <button onclick="openMenuItemEditModal('${item.id}')" class="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-[10px] shadow-sm flex items-center gap-1 transition-transform active:scale-95" title="แก้ไขเมนูนี้">
            <i class="fa-solid fa-pen"></i> แก้ไข
          </button>
        ` : '';

        let priceColor = 'text-zen-torii';
        if (item.price.includes('ฟรี')) {
          priceColor = 'text-emerald-700 font-bold';
        }

        let badgeHtml = '';
        if (item.badge) {
          let badgeBg = 'bg-stone-100 text-stone-700';
          if (item.badge.includes('ขายดี') || item.badge.includes('ฮิต')) badgeBg = 'bg-rose-100 text-rose-800 font-semibold';
          else if (item.badge.includes('ฟรี') || item.badge.includes('ซิกเนเจอร์')) badgeBg = 'bg-emerald-100 text-emerald-800 font-semibold';
          else if (item.badge.includes('แนะนำ') || item.badge.includes('ผลไม้')) badgeBg = 'bg-amber-100 text-amber-800';
          else if (item.badge.includes('คลายร้อน')) badgeBg = 'bg-cyan-100 text-cyan-800';
          else if (item.badge.includes('หอม')) badgeBg = 'bg-orange-100 text-orange-800';
          
          badgeHtml = `<span class="text-[9px] ${badgeBg} px-1.5 py-0.5 rounded-md">${item.badge}</span>`;
        }

        card.innerHTML = `
          <div class="space-y-1 flex-1">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-medium text-xs sm:text-sm text-zen-dark">${item.name}</span>
              ${badgeHtml}
            </div>
            <p class="text-[11px] text-zen-muted font-light leading-snug">
              ${item.desc}
            </p>
          </div>
          <div class="text-right shrink-0 flex flex-col items-end gap-1.5">
            <span class="text-xs sm:text-sm font-bold ${priceColor}">${item.price}</span>
            ${editBtnHtml}
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function openMenuModal(category) {
      if (category) {
        currentMenuCategory = category;
      }
      const pills = document.querySelectorAll('.menu-tab-btn');
      pills.forEach(p => {
        p.classList.remove('bg-zen-dark', 'text-white', 'border-zen-dark');
        p.classList.add('bg-white', 'text-zen-dark', 'border-zen-cardborder');
        if (p.getAttribute('onclick') && p.getAttribute('onclick').includes(`'${currentMenuCategory}'`)) {
          p.classList.remove('bg-white', 'text-zen-dark', 'border-zen-cardborder');
          p.classList.add('bg-zen-dark', 'text-white', 'border-zen-dark');
        }
      });

      renderMenuItems();
      document.getElementById('menuModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeMenuModal() {
      document.getElementById('menuModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function switchMenuTab(category, btnElement) {
      currentMenuCategory = category;
      const pills = document.querySelectorAll('.menu-tab-btn');
      pills.forEach(p => {
        p.classList.remove('bg-zen-dark', 'text-white', 'border-zen-dark');
        p.classList.add('bg-white', 'text-zen-dark', 'border-zen-cardborder');
      });

      if (btnElement) {
        btnElement.classList.remove('bg-white', 'text-zen-dark', 'border-zen-cardborder');
        btnElement.classList.add('bg-zen-dark', 'text-white', 'border-zen-dark');
      }

      renderMenuItems();
    }

    // ----------------------------------------------------
    // Menu Modal Header, Tabs & Room Service Tip Controller
    // ----------------------------------------------------
    function renderMenuHeaderSection() {
      const data = SITE_MENU_HEADER || DEFAULT_MENU_HEADER_DATA;

      // Title & Subtitle
      const titleEl = document.getElementById('menuModalTitle');
      if (titleEl) titleEl.textContent = data.title || DEFAULT_MENU_HEADER_DATA.title;

      const subtitleEl = document.getElementById('menuModalSubtitle');
      if (subtitleEl) subtitleEl.textContent = data.subtitle || DEFAULT_MENU_HEADER_DATA.subtitle;

      // Header Icon
      const iconEl = document.getElementById('menuHeaderIcon');
      if (iconEl) {
        const iconVal = (data.iconClass || DEFAULT_MENU_HEADER_DATA.iconClass).trim();
        if (iconVal.startsWith('fa-') || iconVal.includes('fa-')) {
          iconEl.className = iconVal;
          iconEl.textContent = '';
        } else {
          iconEl.className = 'not-italic font-normal';
          iconEl.textContent = iconVal;
        }
      }

      // Room Service Tip Banner
      const servTitleEl = document.getElementById('menuServiceTitle');
      if (servTitleEl) servTitleEl.textContent = data.serviceTitle || DEFAULT_MENU_HEADER_DATA.serviceTitle;

      const servDescEl = document.getElementById('menuServiceDesc');
      if (servDescEl) servDescEl.textContent = data.serviceDesc || DEFAULT_MENU_HEADER_DATA.serviceDesc;

      const servIconEl = document.getElementById('menuServiceIcon');
      if (servIconEl) {
        const servIconVal = (data.serviceIcon || DEFAULT_MENU_HEADER_DATA.serviceIcon).trim();
        if (servIconVal.startsWith('fa-') || servIconVal.includes('fa-')) {
          servIconEl.className = `${servIconVal} text-amber-700 mt-0.5 text-sm shrink-0`;
          servIconEl.textContent = '';
        } else {
          servIconEl.className = 'mt-0.5 text-sm shrink-0 not-italic font-normal';
          servIconEl.textContent = servIconVal;
        }
      }

      // Category Filter Tabs
      const tabDrinks = document.getElementById('menuTabDrinks');
      if (tabDrinks) tabDrinks.textContent = data.tabDrinks || DEFAULT_MENU_HEADER_DATA.tabDrinks;

      const tabThai = document.getElementById('menuTabThai');
      if (tabThai) tabThai.textContent = data.tabThai || DEFAULT_MENU_HEADER_DATA.tabThai;

      const tabSnacks = document.getElementById('menuTabSnacks');
      if (tabSnacks) tabSnacks.textContent = data.tabSnacks || DEFAULT_MENU_HEADER_DATA.tabSnacks;

      const tabBreakfast = document.getElementById('menuTabBreakfast');
      if (tabBreakfast) tabBreakfast.textContent = data.tabBreakfast || DEFAULT_MENU_HEADER_DATA.tabBreakfast;

      const tabAll = document.getElementById('menuTabAll');
      if (tabAll) tabAll.textContent = data.tabAll || DEFAULT_MENU_HEADER_DATA.tabAll;

      // In-place Admin triggers inside Menu Modal
      const headerTrigger = document.getElementById('menuHeaderAdminTrigger');
      if (headerTrigger) {
        if (isAdminMode) headerTrigger.classList.remove('hidden');
        else headerTrigger.classList.add('hidden');
      }

      const servTrigger = document.getElementById('menuServiceAdminTrigger');
      if (servTrigger) {
        if (isAdminMode) servTrigger.classList.remove('hidden');
        else servTrigger.classList.add('hidden');
      }
    }

    function openMenuHeaderEditModal() {
      const data = SITE_MENU_HEADER || DEFAULT_MENU_HEADER_DATA;
      const elTitle = document.getElementById('editMenuHeaderTitle');
      const elSub = document.getElementById('editMenuHeaderSubtitle');
      const elIcon = document.getElementById('editMenuHeaderIcon');
      const elServTitle = document.getElementById('editMenuServiceTitle');
      const elServDesc = document.getElementById('editMenuServiceDesc');
      const elServIcon = document.getElementById('editMenuServiceIcon');
      const elTabDrinks = document.getElementById('editMenuTabDrinks');
      const elTabThai = document.getElementById('editMenuTabThai');
      const elTabSnacks = document.getElementById('editMenuTabSnacks');
      const elTabBreakfast = document.getElementById('editMenuTabBreakfast');
      const elTabAll = document.getElementById('editMenuTabAll');

      if (elTitle) elTitle.value = data.title || '';
      if (elSub) elSub.value = data.subtitle || '';
      if (elIcon) elIcon.value = data.iconClass || '';
      if (elServTitle) elServTitle.value = data.serviceTitle || '';
      if (elServDesc) elServDesc.value = data.serviceDesc || '';
      if (elServIcon) elServIcon.value = data.serviceIcon || '';
      if (elTabDrinks) elTabDrinks.value = data.tabDrinks || '';
      if (elTabThai) elTabThai.value = data.tabThai || '';
      if (elTabSnacks) elTabSnacks.value = data.tabSnacks || '';
      if (elTabBreakfast) elTabBreakfast.value = data.tabBreakfast || '';
      if (elTabAll) elTabAll.value = data.tabAll || '';

      const modal = document.getElementById('editMenuHeaderModal');
      if (modal) modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeMenuHeaderEditModal() {
      const modal = document.getElementById('editMenuHeaderModal');
      if (modal) modal.classList.add('hidden');
      const menuModal = document.getElementById('menuModal');
      if (!menuModal || menuModal.classList.contains('hidden')) {
        document.body.classList.remove('overflow-hidden');
      }
    }

    function saveMenuHeaderEdit(isDirectPublish = false) {
      const title = (document.getElementById('editMenuHeaderTitle')?.value || '').trim();
      const subtitle = (document.getElementById('editMenuHeaderSubtitle')?.value || '').trim();
      const iconClass = (document.getElementById('editMenuHeaderIcon')?.value || '').trim();
      const serviceTitle = (document.getElementById('editMenuServiceTitle')?.value || '').trim();
      const serviceDesc = (document.getElementById('editMenuServiceDesc')?.value || '').trim();
      const serviceIcon = (document.getElementById('editMenuServiceIcon')?.value || '').trim();
      const tabDrinks = (document.getElementById('editMenuTabDrinks')?.value || '').trim();
      const tabThai = (document.getElementById('editMenuTabThai')?.value || '').trim();
      const tabSnacks = (document.getElementById('editMenuTabSnacks')?.value || '').trim();
      const tabBreakfast = (document.getElementById('editMenuTabBreakfast')?.value || '').trim();
      const tabAll = (document.getElementById('editMenuTabAll')?.value || '').trim();

      SITE_MENU_HEADER = {
        title: title || DEFAULT_MENU_HEADER_DATA.title,
        subtitle: subtitle || DEFAULT_MENU_HEADER_DATA.subtitle,
        iconClass: iconClass || DEFAULT_MENU_HEADER_DATA.iconClass,
        serviceTitle: serviceTitle || DEFAULT_MENU_HEADER_DATA.serviceTitle,
        serviceDesc: serviceDesc || DEFAULT_MENU_HEADER_DATA.serviceDesc,
        serviceIcon: serviceIcon || DEFAULT_MENU_HEADER_DATA.serviceIcon,
        tabDrinks: tabDrinks || DEFAULT_MENU_HEADER_DATA.tabDrinks,
        tabThai: tabThai || DEFAULT_MENU_HEADER_DATA.tabThai,
        tabSnacks: tabSnacks || DEFAULT_MENU_HEADER_DATA.tabSnacks,
        tabBreakfast: tabBreakfast || DEFAULT_MENU_HEADER_DATA.tabBreakfast,
        tabAll: tabAll || DEFAULT_MENU_HEADER_DATA.tabAll
      };

      try {
        localStorage.setItem('baantaphai_menu_header_v3', JSON.stringify(SITE_MENU_HEADER));
      } catch (e) {
        console.error('Failed to save SITE_MENU_HEADER to localStorage', e);
      }

      renderMenuHeaderSection();
      closeMenuHeaderEditModal();
      handleSectionSave('menuHeader', 'แก้ไขหัวข้อเมนูอาหารและบริการเสิร์ฟริมน้ำ', isDirectPublish);
    }

    function openComparisonModal() {
      document.getElementById('comparisonModal').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
    function closeComparisonModal() {
      document.getElementById('comparisonModal').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    // Modal background click to close
    document.getElementById('roomModal').addEventListener('click', function(e) {
      if (e.target === this) closeRoomModal();
    });
    document.getElementById('editRoomModal').addEventListener('click', function(e) {
      if (e.target === this) closeEditModal();
    });
    document.getElementById('fortuneModal').addEventListener('click', function(e) {
      if (e.target === this) closeFortuneModal();
    });
    document.getElementById('menuModal').addEventListener('click', function(e) {
      if (e.target === this) closeMenuModal();
    });
    document.getElementById('comparisonModal').addEventListener('click', function(e) {
      if (e.target === this) closeComparisonModal();
    });
    document.getElementById('editDiningCardModal').addEventListener('click', function(e) {
      if (e.target === this) closeDiningEditModal();
    });
    document.getElementById('editMenuItemModal').addEventListener('click', function(e) {
      if (e.target === this) closeMenuItemEditModal();
    });
    const editMenuHeaderModalEl = document.getElementById('editMenuHeaderModal');
    if (editMenuHeaderModalEl) {
      editMenuHeaderModalEl.addEventListener('click', function(e) {
        if (e.target === this) closeMenuHeaderEditModal();
      });
    }
    document.getElementById('editLogoModal').addEventListener('click', function(e) {
      if (e.target === this) closeLogoEditModal();
    });
    document.getElementById('editPhotoSpotsHeaderModal').addEventListener('click', function(e) {
      if (e.target === this) closePhotoSpotsHeaderEditModal();
    });
    document.getElementById('editPhotoSpotCardModal').addEventListener('click', function(e) {
      if (e.target === this) closePhotoSpotCardEditModal();
    });
    document.getElementById('editReviewsHeaderModal').addEventListener('click', function(e) {
      if (e.target === this) closeReviewsHeaderEditModal();
    });
    document.getElementById('editFacebookModal').addEventListener('click', function(e) {
      if (e.target === this) closeFacebookEditModal();
    });
    document.getElementById('editPoliciesModal').addEventListener('click', function(e) {
      if (e.target === this) closePoliciesEditModal();
    });
    document.getElementById('editContactModal').addEventListener('click', function(e) {
      if (e.target === this) closeContactEditModal();
    });
    document.getElementById('manageFaqModal').addEventListener('click', function(e) {
      if (e.target === this) closeFaqModal();
    });
    document.getElementById('editFaqHeaderModal').addEventListener('click', function(e) {
      if (e.target === this) closeFaqHeaderEditModal();
    });
    document.getElementById('editFaqItemModal').addEventListener('click', function(e) {
      if (e.target === this) closeFaqItemEditModal();
    });
    document.getElementById('editFaqCtaModal').addEventListener('click', function(e) {
      if (e.target === this) closeFaqCtaEditModal();
    });
    document.getElementById('editFaqCtaSingleBtnModal').addEventListener('click', function(e) {
      if (e.target === this) closeFaqCtaSingleBtnModal();
    });
    document.getElementById('editFooterModal').addEventListener('click', function(e) {
      if (e.target === this) closeFooterEditModal();
    });
    document.getElementById('editFooterSingleBtnModal').addEventListener('click', function(e) {
      if (e.target === this) closeFooterSingleBtnModal();
    });
    document.getElementById('manageComparisonModal').addEventListener('click', function(e) {
      if (e.target === this) closeComparisonManagerModal();
    });
    document.getElementById('editComparisonHeaderModal').addEventListener('click', function(e) {
      if (e.target === this) closeComparisonHeaderEditModal();
    });
    document.getElementById('editComparisonRowModal').addEventListener('click', function(e) {
      if (e.target === this) closeComparisonRowEditModal();
    });
    document.getElementById('editTopBarModal').addEventListener('click', function(e) {
      if (e.target === this) closeTopBarEditModal();
    });
    document.getElementById('manageOmikujiModal').addEventListener('click', function(e) {
      if (e.target === this) closeOmikujiManagerModal();
    });
    document.getElementById('editOmikujiHeaderModal').addEventListener('click', function(e) {
      if (e.target === this) closeOmikujiHeaderEditModal();
    });
    document.getElementById('editOmikujiTierModal').addEventListener('click', function(e) {
      if (e.target === this) closeOmikujiTierEditModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeRoomModal();
        closeEditModal();
        closeHeroEditModal();
        closeRoomFinderEditModal();
        closeDiningHeaderEditModal();
        closeDiningEditModal();
        closeMenuItemEditModal();
        closeMenuHeaderEditModal();
        closeFortuneModal();
        closeMenuModal();
        closeComparisonModal();
        closeFaqModal();
        closeFaqHeaderEditModal();
        closeFaqItemEditModal();
        closeFaqCtaEditModal();
        closeFaqCtaSingleBtnModal();
        closeFooterEditModal();
        closeFooterSingleBtnModal();
        closeComparisonManagerModal();
        closeComparisonHeaderEditModal();
        closeComparisonRowEditModal();
        closeTopBarEditModal();
        closeOmikujiManagerModal();
        closeOmikujiHeaderEditModal();
        closeOmikujiTierEditModal();
        closeManageAttractionsModal();
        closeAttractionsHeaderEditModal();
        closeAttractionItemEditModal();
      }
    });

    // Mobile Swipe Gesture on Modal Image (Horizontal dominant only)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const modalImgEl = document.getElementById('modalImg');
    if (modalImgEl) {
      modalImgEl.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      modalImgEl.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        // Only trigger slide when horizontal motion is clearly dominant over vertical scrolling
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
          if (diffX < 0) nextModalPhoto();
          else prevModalPhoto();
        }
      }, { passive: true });
    }

    function initOmikujiDeviceCheck() {
      const saved = getSavedOmikuji();
      if (saved) {
        const floatBtn = document.querySelector('button[onclick="openFortuneModal()"].fixed');
        if (floatBtn) {
          const textSpan = floatBtn.querySelector('span.font-semibold');
          if (textSpan) textSpan.textContent = 'ดูสิทธิ์เซียมซีของคุณ';
        }
      }
    }

    // 14. REVIEWS FILTER ENGINE
    function filterReviews(type, btnEl) {
      const buttons = document.querySelectorAll('.review-filter-btn');
      buttons.forEach(b => {
        b.classList.remove('active', 'bg-zen-dark', 'text-white', 'border-zen-dark');
        b.classList.add('bg-white', 'text-zen-dark', 'border-zen-cardborder');
      });
      if (btnEl) {
        btnEl.classList.add('active', 'bg-zen-dark', 'text-white', 'border-zen-dark');
        btnEl.classList.remove('bg-white', 'text-zen-dark', 'border-zen-cardborder');
      }

      const cards = document.querySelectorAll('.review-card');
      cards.forEach(card => {
        if (type === 'all') {
          card.classList.remove('hidden');
        } else {
          const types = (card.getAttribute('data-type') || '').split(' ');
          if (types.includes(type)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    }

    // 15. FACEBOOK SOCIAL HUB TAB SWITCHER
    function switchFbTab(tabName) {
      const postTab = document.getElementById('fbTabPost');
      const liveTab = document.getElementById('fbTabLive');
      const postPanel = document.getElementById('fbPanelPost');
      const livePanel = document.getElementById('fbPanelLive');
      if (!postTab || !liveTab || !postPanel || !livePanel) return;

      if (tabName === 'post') {
        postTab.className = 'flex-1 py-1.5 px-3 rounded-xl font-semibold bg-white text-zen-dark shadow-xs transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs';
        liveTab.className = 'flex-1 py-1.5 px-3 rounded-xl font-medium text-stone-500 hover:text-stone-800 transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs';
        postPanel.classList.remove('hidden');
        livePanel.classList.add('hidden');
      } else {
        liveTab.className = 'flex-1 py-1.5 px-3 rounded-xl font-semibold bg-white text-zen-dark shadow-xs transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs';
        postTab.className = 'flex-1 py-1.5 px-3 rounded-xl font-medium text-stone-500 hover:text-stone-800 transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs';
        livePanel.classList.remove('hidden');
        postPanel.classList.add('hidden');
      }
    }

    // ==========================================
    // 16. FAQ SECTION RENDERER & CONTROLLER
    // ==========================================
    function formatFaqAnswer(text) {
      if (!text) return '';
      if (/<(p|ul|ol|table|div)[^>]*>/i.test(text)) {
        return text;
      }
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const paras = formatted.split(/\n\s*\n/);
      return paras.map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`).join('');
    }

    function renderFaqSection() {
      // 1. Header & Font Override
      const faqSec = document.getElementById('faq');
      if (faqSec) {
        faqSec.classList.remove('font-override-sarabun', 'font-override-ibm', 'font-override-prompt', 'font-override-mitr', 'font-override-kanit', 'font-override-noto-serif');
        if (SITE_FAQ_HEADER.fontOverride) {
          faqSec.classList.add(`font-override-${SITE_FAQ_HEADER.fontOverride}`);
        }
      }

      const hBadge = document.getElementById('faqHeaderBadge');
      const hTitle = document.getElementById('faqHeaderTitle');
      const hDesc = document.getElementById('faqHeaderDesc');
      const sInput = document.getElementById('faqSearchInput');
      const adminHeaderTriggers = document.getElementById('faqAdminHeaderTriggers');

      if (hBadge) hBadge.textContent = SITE_FAQ_HEADER.badge || 'Frequently Asked Questions';
      if (hTitle) hTitle.textContent = SITE_FAQ_HEADER.title || 'คำถามที่พบบ่อย (FAQ)';
      if (hDesc) hDesc.textContent = SITE_FAQ_HEADER.desc || 'รวมทุกข้อสงสัยที่ลูกค้าสอบถามบ่อย พร้อมระบบค้นหาคำตอบอย่างรวดเร็ว หากมีคำถามเพิ่มเติมสามารถทักแชท LINE ได้ตลอดเวลา';
      if (sInput && SITE_FAQ_HEADER.searchPlaceholder) {
        sInput.placeholder = SITE_FAQ_HEADER.searchPlaceholder;
      }

      if (adminHeaderTriggers) {
        if (isAdminMode) adminHeaderTriggers.classList.remove('hidden');
        else adminHeaderTriggers.classList.add('hidden');
      }

      // 2. Accordion Items
      const container = document.getElementById('faqAccordionList');
      if (!container) return;
      container.innerHTML = '';

      const items = (Array.isArray(SITE_FAQ_ITEMS) && SITE_FAQ_ITEMS.length > 0) ? SITE_FAQ_ITEMS : DEFAULT_FAQ_ITEMS;

      items.forEach((item, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'faq-item bg-zen-bg rounded-2xl border border-zen-cardborder overflow-hidden transition-all duration-300';
        itemEl.setAttribute('data-faq-id', item.id);

        const adminEditBtn = isAdminMode ? `
          <div class="pr-3 shrink-0 flex items-center">
            <button type="button" onclick="openFaqItemEditModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-transform active:scale-95" title="แก้ไขคำถามนี้">
              <i class="fa-solid fa-pen"></i> แก้ไข
            </button>
          </div>
        ` : '';

        itemEl.innerHTML = `
          <div class="flex items-center justify-between">
            <button type="button" onclick="toggleFaq(this)" class="flex-1 p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-stone-100/50 transition-colors">
              <span class="font-semibold text-xs sm:text-sm text-zen-dark flex items-center gap-2.5">
                <span class="text-base shrink-0">${item.icon || '❓'}</span>
                <span>${item.question}</span>
              </span>
              <i class="fa-solid fa-chevron-down text-stone-400 text-xs transition-transform duration-300 faq-icon shrink-0 ml-2"></i>
            </button>
            ${adminEditBtn}
          </div>
          <div class="faq-answer hidden px-4 sm:px-5 pb-4 pt-1 text-xs text-stone-600 font-light leading-relaxed border-t border-zen-cardborder/40 space-y-1.5">
            ${formatFaqAnswer(item.answer)}
          </div>
        `;
        container.appendChild(itemEl);
      });

      searchFaqQuestions();
      renderFaqCtaSection();
    }

    function toggleFaq(btnEl) {
      const item = btnEl.closest('.faq-item');
      if (!item) return;
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');

      const isHidden = answer.classList.contains('hidden');
      if (isHidden) {
        answer.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
        item.classList.add('border-amber-300', 'bg-amber-50/20');
      } else {
        answer.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
        item.classList.remove('border-amber-300', 'bg-amber-50/20');
      }
    }

    let faqSearchRaf = null;
    function searchFaqQuestions() {
      if (faqSearchRaf) cancelAnimationFrame(faqSearchRaf);
      faqSearchRaf = requestAnimationFrame(() => {
        const sInput = document.getElementById('faqSearchInput');
        const query = (sInput ? sInput.value : '').trim().toLowerCase();
        const items = document.querySelectorAll('.faq-item');
        let visibleCount = 0;

        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (!query || text.includes(query)) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        const noResultEl = document.getElementById('faqNoResults');
        if (noResultEl) {
          if (visibleCount === 0 && query) {
            noResultEl.classList.remove('hidden');
          } else {
            noResultEl.classList.add('hidden');
          }
        }
      });
    }

    // FAQ Management Modal Functions
    function openFaqModal() {
      renderManageFaqList();
      const m = document.getElementById('manageFaqModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFaqModal() {
      const m = document.getElementById('manageFaqModal');
      if (m) {
        m.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function renderManageFaqList() {
      const container = document.getElementById('manageFaqItemsContainer');
      const countBadge = document.getElementById('manageFaqCountBadge');
      if (!container) return;
      container.innerHTML = '';

      const items = (Array.isArray(SITE_FAQ_ITEMS) && SITE_FAQ_ITEMS.length > 0) ? SITE_FAQ_ITEMS : DEFAULT_FAQ_ITEMS;
      if (countBadge) countBadge.textContent = `${items.length} คำถาม`;

      if (items.length === 0) {
        container.innerHTML = `
          <div class="text-center py-8 text-stone-400">
            <p>ยังไม่มีรายการคำถาม</p>
            <button onclick="openFaqItemEditModal()" class="mt-2 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs shadow-sm">
              + เพิ่มคำถามแรก
            </button>
          </div>
        `;
        return;
      }

      items.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'p-3 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-colors flex items-center justify-between gap-3';

        const isFirst = idx === 0;
        const isLast = idx === items.length - 1;

        const rawAnsPreview = (item.answer || '').replace(/\*\*/g, '').replace(/\n/g, ' ');
        const snippet = rawAnsPreview.length > 70 ? rawAnsPreview.substring(0, 70) + '...' : rawAnsPreview;

        row.innerHTML = `
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <span class="w-8 h-8 rounded-xl bg-amber-100/80 text-base flex items-center justify-center shrink-0 shadow-2xs">
              ${item.icon || '❓'}
            </span>
            <div class="min-w-0 flex-1">
              <h4 class="font-semibold text-stone-900 text-xs truncate">${idx + 1}. ${item.question}</h4>
              <p class="text-[11px] text-stone-500 truncate mt-0.5">${snippet}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button onclick="moveFaqItem(${idx}, -1)" ${isFirst ? 'disabled class="w-7 h-7 rounded-lg text-stone-300 cursor-not-allowed flex items-center justify-center text-xs"' : 'class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-2xs active:scale-95 transition-all" title="เลื่อนขึ้น"'} aria-label="Move Up">
              <i class="fa-solid fa-chevron-up"></i>
            </button>
            <button onclick="moveFaqItem(${idx}, 1)" ${isLast ? 'disabled class="w-7 h-7 rounded-lg text-stone-300 cursor-not-allowed flex items-center justify-center text-xs"' : 'class="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-2xs active:scale-95 transition-all" title="เลื่อนลง"'} aria-label="Move Down">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
            <button onclick="openFaqItemEditModal('${item.id}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-2xs transition-transform active:scale-95 flex items-center gap-1" title="แก้ไข">
              <i class="fa-solid fa-pen text-[10px]"></i> แก้ไข
            </button>
            <button onclick="deleteFaqItem('${item.id}')" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center text-xs transition-colors" title="ลบคำถามนี้" aria-label="Delete">
              <i class="fa-solid fa-trash-can text-[11px]"></i>
            </button>
          </div>
        `;
        container.appendChild(row);
      });
    }

    function moveFaqItem(idx, direction) {
      const items = (Array.isArray(SITE_FAQ_ITEMS) && SITE_FAQ_ITEMS.length > 0) ? SITE_FAQ_ITEMS : DEFAULT_FAQ_ITEMS;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= items.length) return;

      const temp = items[idx];
      items[idx] = items[targetIdx];
      items[targetIdx] = temp;
      SITE_FAQ_ITEMS = items;

      try {
        localStorage.setItem('baantaphai_faq_items_v3', JSON.stringify(SITE_FAQ_ITEMS));
      } catch(e) {}

      renderManageFaqList();
      renderFaqSection();
      handleSectionSave('faq', 'จัดเรียงลำดับคำถาม FAQ ใหม่', false);
    }

    // FAQ Header Edit Modal Functions
    function openFaqHeaderEditModal() {
      document.getElementById('editFaqBadge').value = SITE_FAQ_HEADER.badge || 'Frequently Asked Questions';
      document.getElementById('editFaqTitle').value = SITE_FAQ_HEADER.title || 'คำถามที่พบบ่อย (FAQ)';
      document.getElementById('editFaqDesc').value = SITE_FAQ_HEADER.desc || '';
      document.getElementById('editFaqSearchPlaceholder').value = SITE_FAQ_HEADER.searchPlaceholder || '';
      document.getElementById('editFaqFont').value = SITE_FAQ_HEADER.fontOverride || '';

      const m = document.getElementById('editFaqHeaderModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFaqHeaderEditModal() {
      const m = document.getElementById('editFaqHeaderModal');
      if (m) {
        m.classList.add('hidden');
        if (!document.getElementById('manageFaqModal') || document.getElementById('manageFaqModal').classList.contains('hidden')) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function saveFaqHeaderEdit(isDirectPublish = false) {
      const badge = document.getElementById('editFaqBadge').value.trim();
      const title = document.getElementById('editFaqTitle').value.trim();
      const desc = document.getElementById('editFaqDesc').value.trim();
      const placeholder = document.getElementById('editFaqSearchPlaceholder').value.trim();
      const font = document.getElementById('editFaqFont').value;

      if (!title) {
        alert('กรุณากรอกหัวข้อคำถาม FAQ');
        return;
      }

      SITE_FAQ_HEADER.badge = badge || 'Frequently Asked Questions';
      SITE_FAQ_HEADER.title = title;
      SITE_FAQ_HEADER.desc = desc;
      SITE_FAQ_HEADER.searchPlaceholder = placeholder;
      SITE_FAQ_HEADER.fontOverride = font;

      try {
        localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER));
      } catch(e) {}

      closeFaqHeaderEditModal();
      renderFaqSection();
      handleSectionSave('faqHeader', 'แก้ไขหัวข้อคำถาม FAQ', isDirectPublish);
    }

    // FAQ Item Edit Modal Functions
    function setFaqItemPresetEmoji(emoji) {
      const iconInput = document.getElementById('editFaqItemIcon');
      if (iconInput) iconInput.value = emoji;
    }

    function openFaqItemEditModal(itemId) {
      const titleEl = document.getElementById('editFaqItemModalTitle');
      const idInput = document.getElementById('editFaqItemId');
      const iconInput = document.getElementById('editFaqItemIcon');
      const qInput = document.getElementById('editFaqItemQuestion');
      const aInput = document.getElementById('editFaqItemAnswer');
      const delBtn = document.getElementById('deleteFaqItemBtn');

      if (itemId) {
        const items = (Array.isArray(SITE_FAQ_ITEMS) && SITE_FAQ_ITEMS.length > 0) ? SITE_FAQ_ITEMS : DEFAULT_FAQ_ITEMS;
        const item = items.find(it => it.id === itemId);
        if (!item) return;

        if (titleEl) titleEl.textContent = 'แก้ไขคำถาม FAQ';
        if (idInput) idInput.value = item.id;
        if (iconInput) iconInput.value = item.icon || '🕒';
        if (qInput) qInput.value = item.question || '';
        if (aInput) aInput.value = item.answer || '';
        if (delBtn) delBtn.classList.remove('hidden');
      } else {
        if (titleEl) titleEl.textContent = 'เพิ่มคำถาม FAQ ใหม่';
        if (idInput) idInput.value = '';
        if (iconInput) iconInput.value = '❓';
        if (qInput) qInput.value = '';
        if (aInput) aInput.value = '';
        if (delBtn) delBtn.classList.add('hidden');
      }

      const m = document.getElementById('editFaqItemModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFaqItemEditModal() {
      const m = document.getElementById('editFaqItemModal');
      if (m) {
        m.classList.add('hidden');
        if (!document.getElementById('manageFaqModal') || document.getElementById('manageFaqModal').classList.contains('hidden')) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function saveFaqItemEdit(isDirectPublish = false) {
      const id = document.getElementById('editFaqItemId').value;
      const icon = document.getElementById('editFaqItemIcon').value.trim() || '❓';
      const question = document.getElementById('editFaqItemQuestion').value.trim();
      const answer = document.getElementById('editFaqItemAnswer').value.trim();

      if (!question) {
        alert('กรุณากรอกคำถาม');
        return;
      }
      if (!answer) {
        alert('กรุณากรอกคำตอบ');
        return;
      }

      let items = (Array.isArray(SITE_FAQ_ITEMS) && SITE_FAQ_ITEMS.length > 0) ? SITE_FAQ_ITEMS : [...DEFAULT_FAQ_ITEMS];

      if (id) {
        const item = items.find(it => it.id === id);
        if (item) {
          item.icon = icon;
          item.question = question;
          item.answer = answer;
        }
      } else {
        const newId = 'faq_' + Date.now();
        items.push({
          id: newId,
          icon: icon,
          question: question,
          answer: answer
        });
      }

      SITE_FAQ_ITEMS = items;
      try {
        localStorage.setItem('baantaphai_faq_items_v3', JSON.stringify(SITE_FAQ_ITEMS));
      } catch(e) {}

      closeFaqItemEditModal();
      renderFaqSection();
      renderManageFaqList();
      handleSectionSave('faq', (id ? 'แก้ไขคำถาม FAQ: ' : 'เพิ่มคำถาม FAQ ใหม่: ') + question, isDirectPublish);
    }

    function deleteFaqItemFromModal() {
      const id = document.getElementById('editFaqItemId').value;
      if (!id) return;
      deleteFaqItem(id);
    }

    function deleteFaqItem(itemId) {
      let items = (Array.isArray(SITE_FAQ_ITEMS) && SITE_FAQ_ITEMS.length > 0) ? SITE_FAQ_ITEMS : [...DEFAULT_FAQ_ITEMS];
      const target = items.find(it => it.id === itemId);
      const qText = target ? target.question : 'คำถามนี้';

      if (confirm(`คุณต้องการลบ "${qText}" ออกจากคำถามที่พบบ่อย (FAQ) ใช่หรือไม่?`)) {
        SITE_FAQ_ITEMS = items.filter(it => it.id !== itemId);
        try {
          localStorage.setItem('baantaphai_faq_items_v3', JSON.stringify(SITE_FAQ_ITEMS));
        } catch(e) {}

        closeFaqItemEditModal();
        renderFaqSection();
        renderManageFaqList();
        handleSectionSave('faq', 'ลบคำถาม FAQ: ' + qText, false);
      }
    }

    // ==========================================
    // 17.5 FAQ SUPPORT CTA BANNER CONTROLLER (แก้ได้/เพิ่มได้)
    // ==========================================
    const FAQ_CTA_BUTTON_THEMES = {
      messenger: {
        css: 'bg-[#005EC4] hover:bg-[#0073E6] text-white',
        defaultIcon: 'fa-brands fa-facebook-messenger',
        name: 'Facebook Messenger (ฟ้า)'
      },
      line: {
        css: 'bg-zen-line hover:bg-emerald-600 text-white',
        defaultIcon: 'fa-brands fa-line',
        name: 'LINE Official (เขียว)'
      },
      phone: {
        css: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        defaultIcon: 'fa-solid fa-phone',
        name: 'โทรศัพท์ (เขียวมรกต)'
      },
      amber: {
        css: 'bg-amber-600 hover:bg-amber-700 text-white',
        defaultIcon: 'fa-solid fa-comment-dots',
        name: 'ส้มทอง (Amber)'
      },
      instagram: {
        css: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white',
        defaultIcon: 'fa-brands fa-instagram',
        name: 'Instagram (ไล่เฉดสี)'
      },
      dark: {
        css: 'bg-stone-900 hover:bg-black text-white',
        defaultIcon: 'fa-solid fa-globe',
        name: 'ดำพรีเมียม (Dark Stone)'
      }
    };

    function renderFaqCtaSection() {
      const titleEl = document.getElementById('faqCtaTitle');
      const descEl = document.getElementById('faqCtaDesc');
      const triggerEl = document.getElementById('faqCtaAdminTrigger');
      const container = document.getElementById('faqCtaButtonsContainer');

      if (titleEl) titleEl.textContent = (SITE_FAQ_HEADER && SITE_FAQ_HEADER.ctaTitle) || DEFAULT_FAQ_HEADER.ctaTitle;
      if (descEl) descEl.textContent = (SITE_FAQ_HEADER && SITE_FAQ_HEADER.ctaDesc) || DEFAULT_FAQ_HEADER.ctaDesc;
      if (triggerEl) {
        if (isAdminMode) triggerEl.classList.remove('hidden');
        else triggerEl.classList.add('hidden');
      }

      if (container) {
        const buttons = (SITE_FAQ_HEADER && Array.isArray(SITE_FAQ_HEADER.ctaButtons) && SITE_FAQ_HEADER.ctaButtons.length > 0)
          ? SITE_FAQ_HEADER.ctaButtons
          : DEFAULT_FAQ_HEADER.ctaButtons;

        container.innerHTML = buttons.map(btn => {
          const theme = FAQ_CTA_BUTTON_THEMES[btn.colorTheme] || FAQ_CTA_BUTTON_THEMES.messenger;
          const iconHtml = (btn.icon && btn.icon.includes('fa-'))
            ? `<i class="${btn.icon} text-base"></i>`
            : (btn.icon ? `<span class="text-base">${btn.icon}</span>` : `<i class="${theme.defaultIcon} text-base"></i>`);

          return `
            <a href="${btn.url || '#'}" target="_blank" rel="noopener noreferrer" class="px-4 py-3 rounded-2xl ${theme.css} font-medium text-xs flex items-center gap-2 shadow-sm shrink-0 active:scale-95 transition-all">
              ${iconHtml}
              <span>${escapeAttractionsHtml(btn.label || '')}</span>
            </a>
          `;
        }).join('');
      }
    }

    function openFaqCtaEditModal() {
      const titleInput = document.getElementById('editFaqCtaTitleInput');
      const descInput = document.getElementById('editFaqCtaDescInput');

      if (titleInput) titleInput.value = (SITE_FAQ_HEADER && SITE_FAQ_HEADER.ctaTitle) || DEFAULT_FAQ_HEADER.ctaTitle;
      if (descInput) descInput.value = (SITE_FAQ_HEADER && SITE_FAQ_HEADER.ctaDesc) || DEFAULT_FAQ_HEADER.ctaDesc;

      renderFaqCtaButtonsListInModal();

      const m = document.getElementById('editFaqCtaModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFaqCtaEditModal() {
      const m = document.getElementById('editFaqCtaModal');
      if (m) m.classList.add('hidden');
      const manageFaq = document.getElementById('manageFaqModal');
      if (!manageFaq || manageFaq.classList.contains('hidden')) {
        document.body.classList.remove('overflow-hidden');
      }
    }

    function renderFaqCtaButtonsListInModal() {
      const container = document.getElementById('editFaqCtaButtonsList');
      const countBadge = document.getElementById('editFaqCtaBtnCountBadge');
      if (!container) return;

      const buttons = (SITE_FAQ_HEADER && Array.isArray(SITE_FAQ_HEADER.ctaButtons) && SITE_FAQ_HEADER.ctaButtons.length > 0)
        ? SITE_FAQ_HEADER.ctaButtons
        : DEFAULT_FAQ_HEADER.ctaButtons;

      if (countBadge) countBadge.textContent = `${buttons.length} ปุ่ม`;

      if (buttons.length === 0) {
        container.innerHTML = `
          <div class="p-6 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <p class="text-xs">ยังไม่มีปุ่มติดต่อ</p>
            <button type="button" onclick="openFaqCtaSingleBtnModal(null)" class="mt-2 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs shadow-sm">
              + เพิ่มปุ่มแรก
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = buttons.map((btn, idx) => {
        const theme = FAQ_CTA_BUTTON_THEMES[btn.colorTheme] || FAQ_CTA_BUTTON_THEMES.messenger;
        const iconHtml = (btn.icon && btn.icon.includes('fa-'))
          ? `<i class="${btn.icon}"></i>`
          : (btn.icon || '💬');

        const isFirst = idx === 0;
        const isLast = idx === buttons.length - 1;

        return `
          <div class="p-3 bg-stone-50 rounded-2xl border border-stone-200 hover:border-amber-300 transition-colors flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span class="w-6 text-center font-bold text-stone-400 text-xs shrink-0 select-none">#${idx + 1}</span>
              <div class="w-9 h-9 rounded-xl ${theme.css} flex items-center justify-center text-base shrink-0 shadow-2xs">
                ${iconHtml}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h5 class="font-bold text-stone-900 text-xs truncate">${escapeAttractionsHtml(btn.label || '')}</h5>
                  <span class="text-[9px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-medium shrink-0">${theme.name.split(' ')[0]}</span>
                </div>
                <p class="text-[11px] text-stone-500 font-mono truncate mt-0.5">${escapeAttractionsHtml(btn.url || '')}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <div class="flex items-center bg-stone-200/70 rounded-lg p-0.5">
                <button type="button" onclick="moveFaqCtaButton('${btn.id}', -1)" ${isFirst ? 'disabled class="p-1 text-stone-300 cursor-not-allowed"' : 'class="p-1 text-stone-600 hover:text-black hover:bg-white rounded transition-colors"'} title="เลื่อนขึ้น">
                  <i class="fa-solid fa-arrow-up text-xs"></i>
                </button>
                <button type="button" onclick="moveFaqCtaButton('${btn.id}', 1)" ${isLast ? 'disabled class="p-1 text-stone-300 cursor-not-allowed"' : 'class="p-1 text-stone-600 hover:text-black hover:bg-white rounded transition-colors"'} title="เลื่อนลง">
                  <i class="fa-solid fa-arrow-down text-xs"></i>
                </button>
              </div>
              <button type="button" onclick="openFaqCtaSingleBtnModal('${btn.id}')" class="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs transition-colors flex items-center gap-1" title="แก้ไข">
                <i class="fa-solid fa-pen text-[10px]"></i> <span class="hidden sm:inline">แก้ไข</span>
              </button>
              <button type="button" onclick="deleteFaqCtaButton('${btn.id}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition-colors" title="ลบ">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function saveFaqCtaEdit(isDirectPublish = false) {
      const title = (document.getElementById('editFaqCtaTitleInput')?.value || '').trim();
      const desc = (document.getElementById('editFaqCtaDescInput')?.value || '').trim();

      if (!title) {
        alert('กรุณากรอกหัวข้อกล่องสอบถาม');
        return;
      }

      SITE_FAQ_HEADER.ctaTitle = title;
      SITE_FAQ_HEADER.ctaDesc = desc;

      try {
        localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER));
      } catch(e) {}

      closeFaqCtaEditModal();
      renderFaqSection();
      handleSectionSave('faqHeader', 'แก้ไขกล่องสอบถามเพิ่มเติม (FAQ Support CTA)', isDirectPublish);
    }

    function openFaqCtaSingleBtnModal(btnId) {
      const titleEl = document.getElementById('editFaqCtaSingleBtnModalTitle');
      const idInput = document.getElementById('editFaqCtaSingleBtnId');
      const labelInput = document.getElementById('editFaqCtaBtnLabel');
      const urlInput = document.getElementById('editFaqCtaBtnUrl');
      const iconInput = document.getElementById('editFaqCtaBtnIcon');
      const themeInput = document.getElementById('editFaqCtaBtnTheme');
      const delBtn = document.getElementById('deleteFaqCtaSingleBtnBtn');

      const buttons = (SITE_FAQ_HEADER && Array.isArray(SITE_FAQ_HEADER.ctaButtons))
        ? SITE_FAQ_HEADER.ctaButtons
        : DEFAULT_FAQ_HEADER.ctaButtons;

      if (btnId) {
        const btn = buttons.find(b => b.id === btnId);
        if (!btn) return;
        if (titleEl) titleEl.textContent = 'แก้ไขปุ่มติดต่อ';
        if (idInput) idInput.value = btn.id;
        if (labelInput) labelInput.value = btn.label || '';
        if (urlInput) urlInput.value = btn.url || '';
        if (iconInput) iconInput.value = btn.icon || '';
        if (themeInput) themeInput.value = btn.colorTheme || 'messenger';
        if (delBtn) delBtn.classList.remove('hidden');
      } else {
        if (titleEl) titleEl.textContent = 'เพิ่มปุ่มติดต่อใหม่';
        if (idInput) idInput.value = '';
        if (labelInput) labelInput.value = '';
        if (urlInput) urlInput.value = '';
        if (iconInput) iconInput.value = 'fa-solid fa-phone';
        if (themeInput) themeInput.value = 'phone';
        if (delBtn) delBtn.classList.add('hidden');
      }

      const m = document.getElementById('editFaqCtaSingleBtnModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFaqCtaSingleBtnModal() {
      const m = document.getElementById('editFaqCtaSingleBtnModal');
      if (m) {
        m.classList.add('hidden');
        const parentM = document.getElementById('editFaqCtaModal');
        if (!parentM || parentM.classList.contains('hidden')) {
          document.body.classList.remove('overflow-hidden');
        }
      }
    }

    function setFaqCtaBtnPreset(presetType) {
      const labelInput = document.getElementById('editFaqCtaBtnLabel');
      const urlInput = document.getElementById('editFaqCtaBtnUrl');
      const iconInput = document.getElementById('editFaqCtaBtnIcon');
      const themeInput = document.getElementById('editFaqCtaBtnTheme');

      if (presetType === 'messenger') {
        if (labelInput) labelInput.value = 'ทัก Messenger';
        if (urlInput) urlInput.value = (SITE_FACEBOOK_FEED && SITE_FACEBOOK_FEED.messengerUrl) || 'https://m.me/Baantaphai';
        if (iconInput) iconInput.value = 'fa-brands fa-facebook-messenger';
        if (themeInput) themeInput.value = 'messenger';
      } else if (presetType === 'line') {
        if (labelInput) labelInput.value = 'ทัก LINE';
        if (urlInput) urlInput.value = 'https://line.me/R/ti/p/@baantaphairesort';
        if (iconInput) iconInput.value = 'fa-brands fa-line';
        if (themeInput) themeInput.value = 'line';
      } else if (presetType === 'phone') {
        if (labelInput) labelInput.value = 'โทรสอบถามด่วน';
        if (urlInput) urlInput.value = 'tel:0812345678';
        if (iconInput) iconInput.value = 'fa-solid fa-phone';
        if (themeInput) themeInput.value = 'phone';
      } else if (presetType === 'instagram') {
        if (labelInput) labelInput.value = 'IG: @Baantaphai';
        if (urlInput) urlInput.value = 'https://www.instagram.com/baantaphairesort';
        if (iconInput) iconInput.value = 'fa-brands fa-instagram';
        if (themeInput) themeInput.value = 'instagram';
      }
    }

    function saveFaqCtaSingleBtn() {
      const idInput = document.getElementById('editFaqCtaSingleBtnId');
      const labelInput = document.getElementById('editFaqCtaBtnLabel');
      const urlInput = document.getElementById('editFaqCtaBtnUrl');
      const iconInput = document.getElementById('editFaqCtaBtnIcon');
      const themeInput = document.getElementById('editFaqCtaBtnTheme');

      const label = (labelInput?.value || '').trim();
      const url = (urlInput?.value || '').trim();

      if (!label) {
        alert('กรุณากรอกข้อความบนปุ่ม');
        labelInput?.focus();
        return;
      }
      if (!url) {
        alert('กรุณากรอกลิงก์ปลายทาง (URL หรือ tel:)');
        urlInput?.focus();
        return;
      }

      let buttons = (SITE_FAQ_HEADER && Array.isArray(SITE_FAQ_HEADER.ctaButtons))
        ? [...SITE_FAQ_HEADER.ctaButtons]
        : [...DEFAULT_FAQ_HEADER.ctaButtons];

      const id = idInput?.value;
      const btnData = {
        id: id || ('btn_' + Date.now()),
        label: label,
        url: url,
        icon: (iconInput?.value || '').trim() || 'fa-solid fa-comment-dots',
        colorTheme: themeInput?.value || 'messenger'
      };

      if (id) {
        const idx = buttons.findIndex(b => b.id === id);
        if (idx >= 0) buttons[idx] = btnData;
        else buttons.push(btnData);
      } else {
        buttons.push(btnData);
      }

      SITE_FAQ_HEADER.ctaButtons = buttons;
      try {
        localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER));
      } catch(e) {}

      closeFaqCtaSingleBtnModal();
      renderFaqCtaButtonsListInModal();
      renderFaqCtaSection();
      handleSectionSave('faqHeader', 'บันทึกปุ่มติดต่อ FAQ', false);
    }

    function deleteFaqCtaButton(btnId) {
      let buttons = (SITE_FAQ_HEADER && Array.isArray(SITE_FAQ_HEADER.ctaButtons))
        ? [...SITE_FAQ_HEADER.ctaButtons]
        : [...DEFAULT_FAQ_HEADER.ctaButtons];

      const target = buttons.find(b => b.id === btnId);
      const name = target ? `"${target.label}"` : 'ปุ่มนี้';
      if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${name}?`)) return;

      SITE_FAQ_HEADER.ctaButtons = buttons.filter(b => b.id !== btnId);
      try {
        localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER));
      } catch(e) {}

      renderFaqCtaButtonsListInModal();
      renderFaqCtaSection();
      handleSectionSave('faqHeader', 'ลบปุ่มติดต่อ FAQ', false);
    }

    function deleteFaqCtaSingleBtnFromModal() {
      const id = document.getElementById('editFaqCtaSingleBtnId')?.value;
      if (!id) return;
      deleteFaqCtaButton(id);
      closeFaqCtaSingleBtnModal();
    }

    function moveFaqCtaButton(btnId, direction) {
      let buttons = (SITE_FAQ_HEADER && Array.isArray(SITE_FAQ_HEADER.ctaButtons))
        ? [...SITE_FAQ_HEADER.ctaButtons]
        : [...DEFAULT_FAQ_HEADER.ctaButtons];

      const idx = buttons.findIndex(b => b.id === btnId);
      if (idx < 0) return;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= buttons.length) return;

      const temp = buttons[idx];
      buttons[idx] = buttons[targetIdx];
      buttons[targetIdx] = temp;

      SITE_FAQ_HEADER.ctaButtons = buttons;
      try {
        localStorage.setItem('baantaphai_faq_header_v3', JSON.stringify(SITE_FAQ_HEADER));
      } catch(e) {}

      renderFaqCtaButtonsListInModal();
      renderFaqCtaSection();
      handleSectionSave('faqHeader', 'จัดเรียงลำดับปุ่มติดต่อ FAQ', false);
    }

    // ==========================================
    // 17.6 FOOTER SECTION CONTROLLER (แก้ได้/เพิ่มได้)
    // ==========================================
    const FOOTER_BUTTON_THEMES = {
      facebook: {
        containerClass: "bg-white/5 hover:bg-[#1465D8]/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-[#1465D8]",
        defaultLabel: "Facebook เพจหลัก",
        defaultUrl: "https://www.facebook.com/Baantaphai",
        defaultIcon: "fa-brands fa-facebook"
      },
      messenger: {
        containerClass: "bg-white/5 hover:bg-[#005EC4]/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-[#005EC4]",
        defaultLabel: "Messenger",
        defaultUrl: "https://m.me/Baantaphai",
        defaultIcon: "fa-brands fa-facebook-messenger"
      },
      line: {
        containerClass: "bg-white/5 hover:bg-emerald-500/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-emerald-400",
        defaultLabel: "@baantaphairesort",
        defaultUrl: "https://line.me/R/ti/p/@baantaphairesort",
        defaultIcon: "fa-brands fa-line"
      },
      phone: {
        containerClass: "bg-white/5 hover:bg-amber-500/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-amber-400 text-[10px]",
        defaultLabel: "062-460-5863",
        defaultUrl: "tel:0624605863",
        defaultIcon: "fa-solid fa-phone"
      },
      instagram: {
        containerClass: "bg-white/5 hover:bg-pink-500/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-pink-400",
        defaultLabel: "Instagram",
        defaultUrl: "https://instagram.com/baantaphairesort",
        defaultIcon: "fa-brands fa-instagram"
      },
      tiktok: {
        containerClass: "bg-white/5 hover:bg-cyan-500/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-cyan-400",
        defaultLabel: "TikTok",
        defaultUrl: "https://tiktok.com/@baantaphairesort",
        defaultIcon: "fa-brands fa-tiktok"
      },
      maps: {
        containerClass: "bg-white/5 hover:bg-red-500/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-red-400",
        defaultLabel: "แผนที่ Google Maps",
        defaultUrl: "https://maps.app.goo.gl/QZnssrZgScjpk9cJ8",
        defaultIcon: "fa-solid fa-location-dot"
      },
      custom: {
        containerClass: "bg-white/5 hover:bg-white/20 text-zen-sand hover:text-white border-white/10",
        iconClass: "text-zen-sand",
        defaultLabel: "เว็บไซต์ทางการ",
        defaultUrl: "https://baantaphairesort.com",
        defaultIcon: "fa-solid fa-globe"
      }
    };

    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderFooterSection() {
      const footer = SITE_FOOTER || DEFAULT_FOOTER_DATA;
      const taglineEl = document.getElementById('footerTagline');
      const copyrightEl = document.getElementById('footerCopyrightText');
      const triggerEl = document.getElementById('footerAdminTrigger');
      const container = document.getElementById('footerButtonsContainer');

      if (taglineEl) {
        taglineEl.textContent = footer.tagline || DEFAULT_FOOTER_DATA.tagline;
      }
      if (copyrightEl) {
        copyrightEl.textContent = footer.copyright || DEFAULT_FOOTER_DATA.copyright;
      }
      if (triggerEl) {
        if (isAdminMode) triggerEl.classList.remove('hidden');
        else triggerEl.classList.add('hidden');
      }

      if (!container) return;
      container.innerHTML = '';
      const buttons = (Array.isArray(footer.buttons) && footer.buttons.length > 0)
        ? footer.buttons
        : DEFAULT_FOOTER_DATA.buttons;

      const frag = document.createDocumentFragment();
      buttons.forEach(btn => {
        const theme = FOOTER_BUTTON_THEMES[btn.colorTheme] || FOOTER_BUTTON_THEMES.custom;
        const a = document.createElement('a');
        a.href = btn.url || '#';
        if (btn.url && !btn.url.startsWith('tel:') && !btn.url.startsWith('mailto:')) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        a.className = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${theme.containerClass} border transition-colors`;
        
        let iconHtml = '';
        if (btn.icon) {
          if (btn.icon.startsWith('fa-')) {
            iconHtml = `<i class="${escapeHtml(btn.icon)} ${theme.iconClass}"></i>`;
          } else {
            iconHtml = `<span>${escapeHtml(btn.icon)}</span>`;
          }
        }
        a.innerHTML = `${iconHtml}<span>${escapeHtml(btn.label || '')}</span>`;
        frag.appendChild(a);
      });
      container.appendChild(frag);
    }

    function openFooterEditModal() {
      const footer = SITE_FOOTER || DEFAULT_FOOTER_DATA;
      const tagInput = document.getElementById('editFooterTaglineInput');
      const cpInput = document.getElementById('editFooterCopyrightInput');

      if (tagInput) tagInput.value = footer.tagline || DEFAULT_FOOTER_DATA.tagline;
      if (cpInput) cpInput.value = footer.copyright || DEFAULT_FOOTER_DATA.copyright;

      renderFooterButtonsListInModal();

      const m = document.getElementById('editFooterModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFooterEditModal() {
      const m = document.getElementById('editFooterModal');
      if (m) m.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    function renderFooterButtonsListInModal() {
      const container = document.getElementById('editFooterButtonsList');
      const badge = document.getElementById('editFooterBtnCountBadge');
      if (!container) return;
      container.innerHTML = '';

      const buttons = (SITE_FOOTER && Array.isArray(SITE_FOOTER.buttons))
        ? SITE_FOOTER.buttons
        : DEFAULT_FOOTER_DATA.buttons;

      if (badge) badge.textContent = `${buttons.length} ปุ่ม`;

      if (buttons.length === 0) {
        container.innerHTML = `
          <div class="p-4 rounded-xl bg-stone-50 border border-dashed border-stone-300 text-center text-stone-500 text-xs">
            ยังไม่มีปุ่มติดต่อท้ายเว็บ กดปุ่ม "เพิ่มปุ่มติดต่อท้ายเว็บ" เพื่อเริ่มต้นสร้าง
          </div>
        `;
        return;
      }

      buttons.forEach((btn, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors gap-2';

        const theme = FOOTER_BUTTON_THEMES[btn.colorTheme] || FOOTER_BUTTON_THEMES.custom;
        const iconPreview = btn.icon && btn.icon.startsWith('fa-')
          ? `<i class="${escapeHtml(btn.icon)} ${theme.iconClass}"></i>`
          : `<span>${escapeHtml(btn.icon || '🔗')}</span>`;

        itemEl.innerHTML = `
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <span class="w-6 h-6 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0 text-xs">
              ${iconPreview}
            </span>
            <div class="min-w-0 flex-1">
              <p class="font-bold text-stone-800 truncate text-xs">${escapeHtml(btn.label || 'ปุ่มไม่มีชื่อ')}</p>
              <p class="text-[10px] text-stone-400 font-mono truncate">${escapeHtml(btn.url || '-')}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button type="button" onclick="moveFooterButton(${idx}, -1)" ${idx === 0 ? 'disabled class="p-1.5 text-stone-300"' : 'class="p-1.5 text-stone-500 hover:text-stone-900"'} title="เลื่อนขึ้น">
              <i class="fa-solid fa-arrow-up text-xs"></i>
            </button>
            <button type="button" onclick="moveFooterButton(${idx}, 1)" ${idx === buttons.length - 1 ? 'disabled class="p-1.5 text-stone-300"' : 'class="p-1.5 text-stone-500 hover:text-stone-900"'} title="เลื่อนลง">
              <i class="fa-solid fa-arrow-down text-xs"></i>
            </button>
            <button type="button" onclick="openFooterSingleBtnModal('${btn.id}')" class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs transition-colors flex items-center gap-1" title="แก้ไขปุ่มนี้">
              <i class="fa-solid fa-pen"></i> แก้ไข
            </button>
            <button type="button" onclick="deleteFooterButton('${btn.id}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors" title="ลบปุ่มนี้">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        `;
        container.appendChild(itemEl);
      });
    }

    function saveFooterEdit(isDirectPublish = false) {
      const tagInput = document.getElementById('editFooterTaglineInput');
      const cpInput = document.getElementById('editFooterCopyrightInput');

      const tagline = tagInput ? tagInput.value.trim() : '';
      const copyright = cpInput ? cpInput.value.trim() : '';

      SITE_FOOTER.tagline = tagline || DEFAULT_FOOTER_DATA.tagline;
      SITE_FOOTER.copyright = copyright || DEFAULT_FOOTER_DATA.copyright;

      try {
        localStorage.setItem('baantaphai_footer_v3', JSON.stringify(SITE_FOOTER));
      } catch(e) {}

      closeFooterEditModal();
      renderFooterSection();
      handleSectionSave('footer', 'แก้ไขข้อมูลส่วนท้ายเว็บ (Footer)', isDirectPublish);
    }

    function openFooterSingleBtnModal(btnId) {
      const titleEl = document.getElementById('editFooterSingleBtnModalTitle');
      const idInput = document.getElementById('editFooterSingleBtnId');
      const labelInput = document.getElementById('editFooterBtnLabel');
      const urlInput = document.getElementById('editFooterBtnUrl');
      const iconInput = document.getElementById('editFooterBtnIcon');
      const themeInput = document.getElementById('editFooterBtnTheme');
      const delBtn = document.getElementById('deleteFooterSingleBtnBtn');

      const buttons = (SITE_FOOTER && Array.isArray(SITE_FOOTER.buttons))
        ? SITE_FOOTER.buttons
        : DEFAULT_FOOTER_DATA.buttons;

      if (btnId) {
        const btn = buttons.find(b => b.id === btnId);
        if (!btn) return;
        if (titleEl) titleEl.textContent = 'แก้ไขปุ่มติดต่อท้ายเว็บ';
        if (idInput) idInput.value = btn.id;
        if (labelInput) labelInput.value = btn.label || '';
        if (urlInput) urlInput.value = btn.url || '';
        if (iconInput) iconInput.value = btn.icon || '';
        if (themeInput) themeInput.value = btn.colorTheme || 'facebook';
        if (delBtn) delBtn.classList.remove('hidden');
      } else {
        if (titleEl) titleEl.textContent = 'เพิ่มปุ่มติดต่อท้ายเว็บใหม่';
        if (idInput) idInput.value = '';
        if (labelInput) labelInput.value = '';
        if (urlInput) urlInput.value = '';
        if (iconInput) iconInput.value = 'fa-brands fa-facebook';
        if (themeInput) themeInput.value = 'facebook';
        if (delBtn) delBtn.classList.add('hidden');
      }

      const m = document.getElementById('editFooterSingleBtnModal');
      if (m) {
        m.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeFooterSingleBtnModal() {
      const m = document.getElementById('editFooterSingleBtnModal');
      if (m) m.classList.add('hidden');
      const parentM = document.getElementById('editFooterModal');
      if (!parentM || parentM.classList.contains('hidden')) {
        document.body.classList.remove('overflow-hidden');
      }
    }

    function setFooterBtnPreset(presetType) {
      const labelInput = document.getElementById('editFooterBtnLabel');
      const urlInput = document.getElementById('editFooterBtnUrl');
      const iconInput = document.getElementById('editFooterBtnIcon');
      const themeInput = document.getElementById('editFooterBtnTheme');
      const theme = FOOTER_BUTTON_THEMES[presetType];
      if (!theme) return;

      if (labelInput) {
        if (presetType === 'phone' && SITE_CONTACT && SITE_CONTACT.phone1) {
          labelInput.value = SITE_CONTACT.phone1;
        } else {
          labelInput.value = theme.defaultLabel;
        }
      }
      if (urlInput) {
        if (presetType === 'phone' && SITE_CONTACT && SITE_CONTACT.phone1) {
          urlInput.value = `tel:${SITE_CONTACT.phone1.replace(/[^0-9]/g, '')}`;
        } else {
          urlInput.value = theme.defaultUrl;
        }
      }
      if (iconInput) iconInput.value = theme.defaultIcon;
      if (themeInput) themeInput.value = presetType;
    }

    function saveFooterSingleBtn(isDirectPublish = false) {
      const idInput = document.getElementById('editFooterSingleBtnId');
      const labelInput = document.getElementById('editFooterBtnLabel');
      const urlInput = document.getElementById('editFooterBtnUrl');
      const iconInput = document.getElementById('editFooterBtnIcon');
      const themeInput = document.getElementById('editFooterBtnTheme');

      const label = labelInput ? labelInput.value.trim() : '';
      const url = urlInput ? urlInput.value.trim() : '';
      const icon = iconInput ? iconInput.value.trim() : '';
      const colorTheme = themeInput ? themeInput.value : 'facebook';

      if (!label) {
        alert('กรุณากรอกข้อความบนปุ่ม');
        if (labelInput) labelInput.focus();
        return;
      }
      if (!url) {
        alert('กรุณากรอกลิงก์ปลายทาง (URL หรือ tel:...)');
        if (urlInput) urlInput.focus();
        return;
      }

      if (!SITE_FOOTER) SITE_FOOTER = JSON.parse(JSON.stringify(DEFAULT_FOOTER_DATA));
      if (!Array.isArray(SITE_FOOTER.buttons)) SITE_FOOTER.buttons = [...DEFAULT_FOOTER_DATA.buttons];

      const btnId = idInput ? idInput.value : '';
      if (btnId) {
        const idx = SITE_FOOTER.buttons.findIndex(b => b.id === btnId);
        if (idx !== -1) {
          SITE_FOOTER.buttons[idx] = {
            ...SITE_FOOTER.buttons[idx],
            label,
            url,
            icon,
            colorTheme
          };
        }
      } else {
        const newId = 'footer_btn_' + Date.now();
        SITE_FOOTER.buttons.push({
          id: newId,
          label,
          url,
          icon,
          colorTheme
        });
      }

      try {
        localStorage.setItem('baantaphai_footer_v3', JSON.stringify(SITE_FOOTER));
      } catch(e) {}

      closeFooterSingleBtnModal();
      renderFooterButtonsListInModal();
      renderFooterSection();
      handleSectionSave('footer', 'บันทึกปุ่มติดต่อท้ายเว็บ (Footer)', isDirectPublish);
    }

    function deleteFooterButton(btnId) {
      let buttons = (SITE_FOOTER && Array.isArray(SITE_FOOTER.buttons))
        ? [...SITE_FOOTER.buttons]
        : [...DEFAULT_FOOTER_DATA.buttons];

      if (!confirm('คุณต้องการลบปุ่มติดต่อนี้ใช่หรือไม่?')) return;
      buttons = buttons.filter(b => b.id !== btnId);
      SITE_FOOTER.buttons = buttons;

      try {
        localStorage.setItem('baantaphai_footer_v3', JSON.stringify(SITE_FOOTER));
      } catch(e) {}

      renderFooterButtonsListInModal();
      renderFooterSection();
      handleSectionSave('footer', 'ลบปุ่มติดต่อท้ายเว็บ (Footer)', false);
    }

    function deleteFooterSingleBtnFromModal() {
      const id = document.getElementById('editFooterSingleBtnId')?.value;
      if (!id) return;
      closeFooterSingleBtnModal();
      deleteFooterButton(id);
    }

    function moveFooterButton(index, direction) {
      let buttons = (SITE_FOOTER && Array.isArray(SITE_FOOTER.buttons))
        ? [...SITE_FOOTER.buttons]
        : [...DEFAULT_FOOTER_DATA.buttons];

      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= buttons.length) return;

      const temp = buttons[index];
      buttons[index] = buttons[targetIndex];
      buttons[targetIndex] = temp;

      SITE_FOOTER.buttons = buttons;
      try {
        localStorage.setItem('baantaphai_footer_v3', JSON.stringify(SITE_FOOTER));
      } catch(e) {}

      renderFooterButtonsListInModal();
      renderFooterSection();
      handleSectionSave('footer', 'จัดเรียงลำดับปุ่มติดต่อท้ายเว็บ', false);
    }

    // ==========================================
    // 18. COMPLIMENTARY ACTIVITY DETAIL MODAL CONTROLLER
    // ==========================================
    const ACTIVITIES_DATA = {
      kayak: {
        title: 'พายเรือคายัคชมคุ้งน้ำ (Kayaking)',
        badge: 'กิจกรรมไฮไลท์ยอดนิยม',
        time: '06:30 – 18:30 น. (ทุกวัน)',
        img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        desc: 'สัมผัสความเงียบสงบของสายน้ำอยุธยาด้วยเรือคายัคมาตรฐานความปลอดภัยสูง พายล่องชมแมกไม้ธรรมชาติ สวนผลไม้ และนกน้ำนานาพันธุ์ริมฝั่งแม่น้ำ บรรยากาศยามเช้าและยามเย็นร่มรื่น สดชื่น เหมาะสำหรับทั้งคู่รักและครอบครัว',
        perks: [
          'ฟรีเสื้อชูชีพมาตรฐานสำหรับทั้งเด็กและผู้ใหญ่ครบทุกขนาด',
          'ไม้พายน้ำหนักเบา พายง่าย ควงสบาย ไม่เมื่อยล้า',
          'มีเจ้าหน้าที่คอยดูแลและให้คำแนะนำความปลอดภัยบริเวณท่าน้ำ',
          'ท่าเทียบเรือมาตรฐาน ก้าวขึ้น-ลงเรือสะดวกและปลอดภัย'
        ],
        tip: 'แนะนำช่วงเวลา 07:00 – 08:30 น. แดดยังไม่ออก ลมพัดเย็นสบาย ถ่ายรูปย้อนแสงพระอาทิตย์ขึ้นสวยที่สุด หรือช่วง 17:00 – 18:15 น. ชมพระอาทิตย์อัสดงริมน้ำ',
        lineMsg: 'สวัสดีค่ะ สนใจสอบถามข้อมูลกิจกรรมพายเรือคายัค สำหรับทริปเข้าพักบ้านตาผายค่ะ'
      },
      duck: {
        title: 'ปั่นเรือเป็ดสุดชิลล์ (Duck Pedal Boat)',
        badge: 'ขวัญใจเด็กๆ & ครอบครัว',
        time: '07:00 – 18:30 น. (ทุกวัน)',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        desc: 'เพลิดเพลินกับกิจกรรมปั่นเรือเป็ดสีสันสดใสสุดน่ารัก ปั่นลอยลำชิลล์ๆ ชมวิวทิวทัศน์ริมน้ำกับคนพิเศษหรือเด็กๆ ปลอดภัย ไหลลื่น ปั่นง่าย ไม่ต้องออกแรงเยอะ ถ่ายรูปได้มุมน่ารักสดใส',
        perks: [
          'ฟรีเสื้อชูชีพสำหรับทุกท่านที่ลงเรือ',
          'เรือเป็ดมีความมั่นคงสูง ทรงตัวดี ไม่โคลงเคลง เหมาะกับทุกวัย',
          'นั่งได้ 2-4 ท่านต่อลำ (รองรับคุณพ่อคุณแม่และลูกๆ พร้อมกัน)',
          'บริการฟรีไม่มีค่าใช้จ่ายเพิ่มสำหรับผู้เข้าพักทุกห้อง'
        ],
        tip: 'เหมาะสำหรับพาเด็กๆ มาปั่นเล่นช่วง 16:30 น. เป็นต้นไป แสงกำลังนวลสวย สามารถหยิบขนมปังมาให้อาหารปลาขณะปั่นเรือได้ด้วย',
        lineMsg: 'สวัสดีค่ะ สนใจสอบถามข้อมูลกิจกรรมเรือเป็ด สำหรับทริปครอบครัวบ้านตาผายค่ะ'
      },
      bicycle: {
        title: 'ปั่นจักรยานญี่ปุ่นชมวิถีชุมชน (Vintage Bicycle)',
        badge: 'กิจกรรมสโลว์ไลฟ์',
        time: 'ยืมได้ตลอดวัน 06:00 – 19:00 น.',
        img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
        desc: 'บริการจักรยานวินเทจสไตล์ญี่ปุ่นพร้อมตะกร้าหน้า ให้คุณปั่นรับลมบริสุทธิ์ชมสวน สัมผัสวิถีชีวิตชาวบ้านริมน้ำอยุธยา หรือปั่นไปคาเฟ่และร้านอาหารท้องถิ่นใกล้เคียงได้อย่างสบายใจ',
        perks: [
          'มีจักรยานพร้อมตะกร้าหน้ารถสำหรับใส่ของสะพายหรือกล้อง',
          'มีหมวกกันน็อกสำหรับเด็กให้บริการเพื่อความปลอดภัย',
          'แผนที่เส้นทางปั่นชมธรรมชาติ & จุดแวะชิมอาหารพื้นบ้านท่าเรือ',
          'บริการตรวจเช็คลมยางและโซ่พร้อมใช้งานทุกคัน'
        ],
        tip: 'เส้นทางรอบรีสอร์ทรถน้อยมาก อากาศยามเช้า 06:30 - 08:00 น. ร่มรื่น มีร้านกาแฟโบราณและขนมหวานขึ้นชื่อของอำเภอท่าเรือให้แวะชิมห่างไปเพียง 5-10 นาที',
        lineMsg: 'สวัสดีค่ะ สนใจสอบถามข้อมูลเส้นทางปั่นจักรยานและการยืมใช้งานค่ะ'
      },
      fish: {
        title: 'ให้อาหารปลา & บ่อปลาคาร์ฟมงคล (Fish Feeding)',
        badge: 'อิ่มบุญ & ผ่อนคลายจิตใจ',
        time: 'ตลอดวัน 06:00 – 18:30 น.',
        img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
        desc: 'จุดให้อาหารปลาธรรมชาติริมคุ้งน้ำและบ่อปลาคาร์ฟญี่ปุ่นมงคลหลากสีสัน ชมฝูงปลาแหวกว่ายตามธรรมชาติ เป็นกิจกรรมฝึกสมาธิที่ผ่อนคลายจิตใจและได้รับความนิยมจากทุกวัย',
        perks: [
          'ระเบียงริมน้ำมีราวกั้นปลอดภัย แข็งแรง เด็กๆ ให้อาหารปลาได้สะดวก',
          'มีอาหารปลาคุณภาพดีให้บริการที่จุดบริการต้อนรับ',
          'จุดล้างมือพร้อมสบู่และเจลแอลกอฮอล์สะอาดข้างท่าน้ำ',
          'บรรยากาศเงียบสงบ ได้ยินเสียงสายน้ำไหลเพลินใจตลอดวัน'
        ],
        tip: 'ช่วงเช้าหลังรับประทานอาหารเช้า 08:30 - 09:30 น. เป็นช่วงที่ฝูงปลาจะขึ้นมาว่ายเล่นผิวน้ำเยอะที่สุด',
        lineMsg: 'สวัสดีค่ะ สนใจสอบถามจุดให้อาหารปลาและบรรยากาศริมน้ำค่ะ'
      },
      playground: {
        title: 'สนามเด็กเล่น & ลานกิจกรรม (Playground)',
        badge: 'พื้นที่แห่งรอยยิ้มครอบครัว',
        time: '07:00 – 19:00 น.',
        img: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=1200&q=80',
        desc: 'ลานกิจกรรมกลางแจ้งบนผืนหญ้าเขียวขจี ล้อมรอบด้วยต้นไม้ร่มรื่น พร้อมเครื่องเล่น ชิงช้า ม้ากระดก และสไลเดอร์ ปลอดภัย ออกแบบมาเพื่อเสริมสร้างพัฒนาการและให้เด็กๆ ปลดปล่อยพลังอย่างเต็มที่',
        perks: [
          'ปูพื้นหญ้านุ่มและพื้นที่ลดแรงกระแทกเพื่อความปลอดภัยของเด็ก',
          'เครื่องเล่นตรวจเช็คความแข็งแรงสม่ำเสมอทุกสัปดาห์',
          'มีม้านั่งในร่มสำหรับคุณพ่อคุณแม่นั่งดูแลและพักผ่อน',
          'เชื่อมต่อกับโซนลานอาหารเช้าและคาเฟ่ สะดวกสบาย'
        ],
        tip: 'ช่วงเย็นแดดร่มลมตกตั้งแต่ 16:30 น. เด็กๆ จะสนุกสนานกับการวิ่งเล่นบนสนามหญ้าและพบปะเพื่อนใหม่',
        lineMsg: 'สวัสดีค่ะ สนใจสอบถามพื้นที่กิจกรรมครอบครัวและสนามเด็กเล่นค่ะ'
      },
      torii: {
        title: 'ซุ้มประตูโทริอิ & สวนหินเซน (Torii & Zen Garden)',
        badge: 'แลนด์มาร์คสไตล์เกียวโต',
        time: 'เปิดตลอด 24 ชม. (มีไฟประดับกลางคืน)',
        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        desc: 'จำลองบรรยากาศเสาโทริอิสีแดงชาดอันศักดิ์สิทธิ์แบบศาลเจ้าฟูชิมิอินาริแห่งเกียวโต ทอดยาวผ่านสวนหินเซนญี่ปุ่น ไผ่เขียวขจี และสะพานไม้ญี่ปุ่น ให้คุณสัมผัสฟีลลิ่งญี่ปุ่นแท้ๆ โดยไม่ต้องบินไปไกล',
        perks: [
          'บริการเช่าชุดยูกาตะญี่ปุ่นพร้อมพร็อพพัด ร่ม และเกี๊ยะไม้ครบเซ็ต',
          'มีโคมไฟประดับสไตล์ญี่ปุ่นเปิดสว่างสวยงามในยามค่ำคืน',
          'จุดตั้งกล้องถ่ายรูปมุม Signature ถ่ายได้ทั้งแนวตั้งและแนวนอน',
          'เชื่อมต่อกับโซนบ้านพัก Japanese Cottage เดินเล่นสะดวก'
        ],
        tip: 'ใส่ชุดยูกาตะมาถ่ายรูปตอน 07:30 น. หรือช่วง 17:00 น. แสงแดดจะทอดยาวผ่านเสาโทริอิเกิดเงาที่สวยงามและภาพคมชัดราวกับถ่ายที่ญี่ปุ่นจริงๆ',
        lineMsg: 'สวัสดีค่ะ สนใจเช่าชุดยูกาตะถ่ายรูปที่ซุ้มประตูโทริอิค่ะ'
      }
    };

    let currentActivityModalKey = null;

    function openActivityModal(key) {
      currentActivityModalKey = key;
      const actItem = (SITE_ACTIVITIES || []).find(a => a.id === key);
      const data = (actItem && actItem.modalData) ? actItem.modalData : ACTIVITIES_DATA[key];
      if (!data) return;

      const modal = document.getElementById('activityModal');
      const img = document.getElementById('actModalImg');
      const badge = document.getElementById('actModalBadge');
      const title = document.getElementById('actModalTitle');
      const time = document.getElementById('actModalTime');
      const desc = document.getElementById('actModalDesc');
      const perksUl = document.getElementById('actModalPerks');
      const tip = document.getElementById('actModalTip');
      const lineBtn = document.getElementById('actModalLineBtn');
      const adminBtn = document.getElementById('actModalAdminEditBtn');

      if (adminBtn) {
        if (isAdminMode) adminBtn.classList.remove('hidden');
        else adminBtn.classList.add('hidden');
      }

      if (img) img.src = formatDirectImageUrl(data.img);
      if (badge) badge.textContent = data.badge;
      if (title) title.textContent = data.title;
      if (time) {
        const span = time.querySelector('span');
        if (span) span.textContent = data.time;
      }
      if (desc) desc.textContent = data.desc;
      if (tip) tip.textContent = data.tip;

      if (perksUl) {
        perksUl.innerHTML = (data.perks || []).map(p => `
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-check text-emerald-600 mt-0.5 shrink-0 text-[10px]"></i>
            <span>${p}</span>
          </li>
        `).join('');
      }

      if (lineBtn && data.lineMsg) {
        lineBtn.href = `https://line.me/R/ti/p/@baantaphairesort?text=${encodeURIComponent(data.lineMsg)}`;
      }

      const messengerBtn = document.getElementById('actModalMessengerBtn');
      if (messengerBtn) {
        messengerBtn.href = 'https://m.me/Baantaphai';
      }

      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeActivityModal() {
      const modal = document.getElementById('activityModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    // ==========================================
    // 19. PHOTO SPOT LIGHTBOX MODAL CONTROLLER
    // ==========================================
    let currentPhotoSpotIndex = 0;

    function openPhotoSpotModal(index) {
      const list = (Array.isArray(SITE_PHOTO_SPOTS) && SITE_PHOTO_SPOTS.length > 0) ? SITE_PHOTO_SPOTS : DEFAULT_PHOTO_SPOTS_DATA;
      currentPhotoSpotIndex = Math.max(0, Math.min(index, list.length - 1));
      renderPhotoSpotModal();
      const modal = document.getElementById('photoSpotModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function renderPhotoSpotModal() {
      const list = (Array.isArray(SITE_PHOTO_SPOTS) && SITE_PHOTO_SPOTS.length > 0) ? SITE_PHOTO_SPOTS : DEFAULT_PHOTO_SPOTS_DATA;
      const spot = list[currentPhotoSpotIndex];
      if (!spot) return;

      const img = document.getElementById('psModalImg');
      const zone = document.getElementById('psModalZone');
      const time = document.getElementById('psModalTime');
      const title = document.getElementById('psModalTitle');
      const desc = document.getElementById('psModalDesc');
      const tip = document.getElementById('psModalTip');
      const indexBadge = document.getElementById('psModalIndex');
      const adminBtn = document.getElementById('psModalAdminEditBtn');

      if (adminBtn) {
        if (isAdminMode) adminBtn.classList.remove('hidden');
        else adminBtn.classList.add('hidden');
      }

      const modalInfo = spot.modalData || spot;
      const modalImgUrl = formatDirectImageUrl(modalInfo.img || spot.img);

      if (img) img.src = modalImgUrl;
      if (zone) zone.textContent = modalInfo.zone || spot.zone;
      if (time) time.textContent = modalInfo.time || spot.time;
      if (title) title.textContent = modalInfo.title || spot.title;
      if (desc) desc.textContent = modalInfo.desc || spot.desc;
      if (tip) tip.textContent = modalInfo.tip || spot.tip;
      if (indexBadge) indexBadge.textContent = `${currentPhotoSpotIndex + 1} / ${list.length}`;
    }

    function nextPhotoSpot() {
      const list = (Array.isArray(SITE_PHOTO_SPOTS) && SITE_PHOTO_SPOTS.length > 0) ? SITE_PHOTO_SPOTS : DEFAULT_PHOTO_SPOTS_DATA;
      currentPhotoSpotIndex = (currentPhotoSpotIndex + 1) % list.length;
      renderPhotoSpotModal();
    }

    function prevPhotoSpot() {
      const list = (Array.isArray(SITE_PHOTO_SPOTS) && SITE_PHOTO_SPOTS.length > 0) ? SITE_PHOTO_SPOTS : DEFAULT_PHOTO_SPOTS_DATA;
      currentPhotoSpotIndex = (currentPhotoSpotIndex - 1 + list.length) % list.length;
      renderPhotoSpotModal();
    }

    function closePhotoSpotModal() {
      const modal = document.getElementById('photoSpotModal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    function copyHashtags() {
      const tags = '#บ้านตาผายรีสอร์ท #ที่พักอยุธยา #อยุธยาริมน้ำ #เที่ยวอยุธยา #รีสอร์ทอยุธยา #BaanTaPhaiResort';
      navigator.clipboard.writeText(tags).then(() => {
        showToast('📸 คัดลอกแฮชแท็ก Instagram สำเร็จ!');
      }).catch(() => {
        prompt('คัดลอกแฮชแท็ก:', tags);
      });
    }
    // ==========================================
    // 20. GLOBAL KEYBOARD NAVIGATION & SHORTCUTS
    // ==========================================
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeRoomModal();
        closeActivityModal();
        closePhotoSpotModal();
        closeFortuneModal();
        closeHeroEditModal();
        closeRoomFinderEditModal();
        closeDiningHeaderEditModal();
        closeEditModal();
        closeDiningEditModal();
        closeMenuItemEditModal();
        closeMenuModal();
        closeLogoEditModal();
        closePhotoSpotsHeaderEditModal();
        closePhotoSpotCardEditModal();
        closeReviewsHeaderEditModal();
        closeFacebookEditModal();
        closePoliciesEditModal();
        closeContactEditModal();
        closeFaqModal();
        closeFaqHeaderEditModal();
        closeFaqItemEditModal();
        closeFaqCtaEditModal();
        closeFaqCtaSingleBtnModal();
        closeFooterEditModal();
        closeFooterSingleBtnModal();
        closeTopBarEditModal();
        closeOmikujiManagerModal();
        closeOmikujiHeaderEditModal();
        closeOmikujiTierEditModal();
        closeManageAttractionsModal();
        closeAttractionsHeaderEditModal();
        closeAttractionItemEditModal();
      } else if (e.key === 'ArrowRight') {
        const psModal = document.getElementById('photoSpotModal');
        if (psModal && !psModal.classList.contains('hidden')) {
          nextPhotoSpot();
        } else {
          const rModal = document.getElementById('roomModal');
          if (rModal && !rModal.classList.contains('hidden') && typeof nextModalPhoto === 'function') {
            nextModalPhoto();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        const psModal = document.getElementById('photoSpotModal');
        if (psModal && !psModal.classList.contains('hidden')) {
          prevPhotoSpot();
        } else {
          const rModal = document.getElementById('roomModal');
          if (rModal && !rModal.classList.contains('hidden') && typeof prevModalPhoto === 'function') {
            prevModalPhoto();
          }
        }
      }
    });

    // ==========================================
    // 21. META PIXEL CONVERSION TRACKING ENGINE
    // ==========================================
    window.trackMetaEvent = function(eventName, eventParams, isCustom) {
      try {
        const params = eventParams || {};
        if (typeof window.fbq === 'function') {
          if (isCustom) {
            window.fbq('trackCustom', eventName, params);
          } else {
            window.fbq('track', eventName, params);
          }
        }
        
        // Developer & Marketer console diagnostics
        const isDebug = window.location.search.includes('debug_pixel=true') || window.location.hostname === 'localhost';
        if (isDebug || window.__META_DEBUG) {
          console.log(`%c[Meta Pixel ${isCustom ? 'Custom' : 'Standard'}] ${eventName}`, 'color: #1465D8; font-weight: bold; background: #E7F3FF; padding: 2px 6px; border-radius: 4px;', params);
        }
      } catch(err) {
        console.warn('[Meta Pixel] Event tracking note:', err);
      }
    };

    window.setMetaPixelId = function(newId) {
      if (!newId) return;
      try {
        localStorage.setItem('baantaphai_meta_pixel_id', newId);
        window.META_PIXEL_ID = newId;
        if (typeof window.fbq === 'function') {
          window.fbq('init', newId);
          window.fbq('track', 'PageView');
        }
        console.log('%c[Meta Pixel] Pixel ID updated successfully to: ' + newId, 'color: green; font-weight: bold;');
        showToast('🎯 ตั้งค่า Meta Pixel ID: ' + newId + ' เรียบร้อย');
      } catch(e) {
        console.error('[Meta Pixel] Failed to save Pixel ID:', e);
      }
    };

    // Automated Event Delegation for Outbound & Conversion Clicks
    function initMetaConversionListeners() {
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        
        // 1. LINE Official Chat Contact
        if (href.includes('line.me')) {
          const btnText = (link.innerText || '').trim().replace(/\s+/g, ' ').substring(0, 40);
          window.trackMetaEvent('Contact', {
            channel: 'LINE',
            method: 'line_official_chat',
            content_name: btnText || 'LINE Official Booking',
            target_url: href
          });
        }
        // 2. Facebook Messenger Chat Contact
        else if (href.includes('m.me/Baantaphai') || href.includes('messenger.com')) {
          const btnText = (link.innerText || '').trim().replace(/\s+/g, ' ').substring(0, 40);
          window.trackMetaEvent('Contact', {
            channel: 'Facebook Messenger',
            method: 'messenger_direct_chat',
            content_name: btnText || 'Messenger Inquiry',
            target_url: href
          });
        }
        // 3. Direct Phone Call
        else if (href.startsWith('tel:')) {
          window.trackMetaEvent('Contact', {
            channel: 'Phone',
            method: 'direct_phone_call',
            phone_number: href.replace('tel:', ''),
            content_name: 'Direct Phone Inquiry'
          });
        }
        // 4. Google Maps Directions / Wayfinding
        else if (href.includes('maps.app.goo.gl') || href.includes('google.com/maps')) {
          window.trackMetaEvent('FindLocation', {
            content_name: 'Baan Ta Phai Google Maps Wayfinding',
            content_category: 'Navigation',
            target_url: href
          });
        }
        // 5. Facebook Page & Album Views
        else if (href.includes('facebook.com/Baantaphai')) {
          window.trackMetaEvent('ViewContent', {
            content_name: href.includes('photos') ? 'Facebook Photos Album' : 'Facebook Page Timeline',
            content_category: 'Facebook Page Follow'
          });
        }
      });
    }

    // Initial load
    document.addEventListener('DOMContentLoaded', () => {
      renderLogoSection();
      renderNavMenuSection();
      renderHeaderActionsSection();
      renderHeroSection();
      renderRoomCards();
      renderRoomFinder();
      renderDiningHeader();
      renderDiningCards();
      renderDiningBannerSection();
      renderMenuHeaderSection();
      renderMenuItems();
      renderActivitiesSection();
      renderRoomsHeaderAndPerks();
      renderPhotoSpotsSection();
      renderReviewsSection();
      renderFacebookFeedSection();
      renderAttractionsSection();
      renderPoliciesAndContactSection();
      renderFaqSection();
      renderComparisonTable();
      renderTopBar();
      renderOmikujiModal();
      renderFooterSection();
      applySiteTypography();
      initOmikujiDeviceCheck();

      // Ensure initial published snapshot is taken if none exists
      if (!localStorage.getItem('baantaphai_published_snapshot_v3')) {
        snapshotPublishedState();
      }
      updateDraftUI();

      // Lift pre-hydration veil smoothly with zero flicker of stale content
      document.documentElement.classList.remove('hydrating');
      initMetaConversionListeners();
      setTimeout(triggerSocialProof, 4000);

      // 🌤️ Live Real-Time Weather Fetch (Free Open-Meteo API)
      fetchLiveWeather(false);

      // ☁️ Background Cloud Data Sync (Auto-fetches latest edits made on any device)
      fetchCloudData(true);
      startCloudSyncLoop();

      // Auto-refresh when user switches back to this browser tab
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          fetchCloudData(true);
          fetchLiveWeather(false);
          scheduleNextCloudSync();
        }
      });

      // Programmatically remove any injected Netlify badges or floating third-party watermarks
      const removeNetlifyBadges = () => {
        try {
          document.querySelectorAll('iframe[src*="netlify"], iframe[title*="Netlify"], div[id*="netlify"], div[class*="netlify"], a[href*="netlify.com"]').forEach(el => {
            if (el && !el.closest('#reviews')) {
              const pos = window.getComputedStyle(el).position;
              if (pos === 'fixed' || pos === 'absolute' || el.tagName === 'IFRAME') {
                el.style.display = 'none';
                el.remove();
              }
            }
          });
        } catch(e) {}
      };
      removeNetlifyBadges();
      setTimeout(removeNetlifyBadges, 800);
      setTimeout(removeNetlifyBadges, 2500);
    });
  
