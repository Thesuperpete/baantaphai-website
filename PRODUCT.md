# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Scope: the public marketing website for Baan Ta Phai Resort (`public_website/index.html`). The Apps Script back-office in the repository root (guest chat, receipts, daily reports) is a separate internal tool and not covered here.

Confirmed audiences, who find the resort through the website, the Facebook page and TikTok promotions:

- Couples and friends on short getaways, looking for a scenic riverside stay and photo spots.
- Families with children, and guests travelling with pets.
- International tourists. The site is currently Thai only, so serving them is an open product decision (see Capabilities and Constraints).

Job to be done: compare rooms and prices quickly, trust the place, then contact the resort to book.

## Product Purpose

Help visitors choose a room at Ta Phai Country House Resort & Restaurant (Tha Ruea district, Phra Nakhon Si Ayutthaya) and move to a conversation with staff. Success is an enquiry or booking message through LINE, Messenger or phone.

## Positioning

What nearby resorts cannot truthfully copy, as confirmed by the owner:

- Free activities for guests (kayaks, bicycles, feeding fish and birds) at no extra cost, and a Pet Friendly policy.
- A low starting price with breakfast included for two on eligible rooms.

## Operating Context

- Bookings are handled by staff over chat or phone; the site shows prices, room details, policies (check-in from 14:00), location and contact options.
- The owner edits site content in the page itself through an admin mode, with draft/publish and Cloud Sync, rather than through a developer.
- The resort promotes through a Facebook page (@Baantaphai, about 8,270 followers), TikTok and LINE Official Account.

## Capabilities and Constraints

- Contact channels: LINE Official Account @baantaphairesort, Facebook Messenger @Baantaphai, phone 062-460-5863 and 097-175-2714.
- Room types on the site: Lake View, Family House, Sky View, Rock View, plus dining and cafe areas, photo spots (including a Japanese zone with a torii gate), nearby attractions, FAQ, map and reviews.
- Stack: a single static HTML file (Tailwind via CDN, Font Awesome, Google Fonts) hosted on Netlify, with a Netlify Function and Blobs store for Cloud Sync, protected by an admin passphrase (`ADMIN_TOKEN`).
- Hard constraint: bookings go only through LINE, Messenger or phone. No online payment or online booking flow on the site.
- Hard constraint: everything the owner sees must stay editable from the in-page admin mode, and Cloud Sync must keep working.
- Language: Thai only today. Whether to add English for international visitors is undecided.

## Brand Commitments

- Resort name: Baan Ta Phai Resort / บ้านตาผายรีสอร์ท.
- Two bear mascots, น้องตา (brown) and น้องผาย (cream), exist as images and appear in promotions. Their use on the site is a design choice, not a binding commitment.

## Evidence on Hand

- Room photos, hero images and the Facebook promo banner (`facebook_promo_banner.jpg`), mostly hosted through Google Drive links entered via the admin.
- Reviews and a live Facebook page feed on the site. Do not invent further reviews, ratings, awards or counts; check the source before reusing any figure.
- Mascot images: `mascot-brown.webp`, `mascot-cream.webp` and head crops.

## Product Principles

- Booking happens in conversation: every page and section leads toward LINE, Messenger or phone.
- Show free activities, Pet Friendly policy and the starting price with breakfast early; they are the proof of value.
- The owner stays in control: no feature may require a developer to update content.
- Serve a mixed audience of couples, families with pets and international visitors, with clear, scannable room and price information.
