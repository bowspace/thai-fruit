# ThaiFruit — Design Review Findings

> Working log for the Step 2 review pass using `Owl-Listener/designer-skills` + `impeccable`.
> Capture findings here as each command runs. Severity scale: **P0** blocker · **P1** must fix before next release · **P2** should fix · **P3** nice to have.

---

## 0. Baseline (before any edits)

- **Date started:** 2026-04-24
- **Codebase snapshot:** `main @ 22cd433`
- **Design guideline:** `.impeccable.md` (written 2026-04-24)
- **Known gaps going in** (from `CLAUDE.md`):
  - `StoreDetail.jsx` / `Seller.jsx` — hardcoded Thai, not routed through `t()`
  - Toast messages in `AppContext.jsx` — hardcoded Thai
  - `ProductModal.jsx` — deprecated, safe to delete
  - `src/data/mockData.js` — orphaned, safe to delete
  - Search bar hidden on mobile, no alternative
  - `Cart.removeFromCart` index bug (`Cart.jsx:80`)

---

## 1. Discovery — Personas & Journey Maps

**Command:** `/design-research:discover`

Paste/summarize output here. Expected artifacts:
- Buyer persona (with context: mobile, evening, Thai/EN/CN)
- Seller persona (with context: desktop, morning ops, farmer)
- Buyer journey: discover store → browse product → add to cart → checkout → order tracking
- Seller journey: signup → create store → add products → receive order → fulfill → mark done

### Findings

ThaiFruit — Design Research Discovery                                                                                                                                            

  Running a full research cycle for the ThaiFruit marketplace based on product context (multilingual TH/EN/CN marketplace, farmer sellers → fruit buyers, role-based signup,       
  cart/order flow).
                                                                                                                                                                                   
  ---             
  1. User Personas
                  
  🥭 Persona 1 — Ploy (Primary Buyer)
                                                                                                                                                                                   
  "I want the freshest fruit from source, without the markup."                                                                                                                     
                                                                                                                                                                                   
  ┌────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐                                      
  │                    │                                                                                                                    │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                      
  │ Age / Role         │ 34, Bangkok office worker, mother of one                                                                           │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Tech               │ iPhone 13, comfortable with Shopee/Lazada, LINE power user                                                         │                                      
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                      
  │ Language           │ Thai primary, reads English OK                                                                                     │                                      
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                      
  │ Goals              │ Buy seasonal fruit (durian, mangosteen) at farmer prices; trust source; gift-quality fruit for family upcountry    │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                      
  │ Frustrations       │ Can't tell if market fruit is actually fresh; Bangkok retail prices are 2–3× farm gate; delivery windows are vague │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                      
  Running a full research cycle for the ThaiFruit marketplace based on product context (multilingual TH/EN/CN marketplace, farmer sellers → fruit buyers, role-based signup,
  cart/order flow).

  ---
  1. User Personas

  🥭 Persona 1 — Ploy (Primary Buyer)

  "I want the freshest fruit from source, without the markup."

  ┌────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                    │                                                                                                                    │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Age / Role         │ 34, Bangkok office worker, mother of one                                                                           │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Tech               │ iPhone 13, comfortable with Shopee/Lazada, LINE power user                                                         │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Language           │ Thai primary, reads English OK                                                                                     │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Goals              │ Buy seasonal fruit (durian, mangosteen) at farmer prices; trust source; gift-quality fruit for family upcountry    │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Frustrations       │ Can't tell if market fruit is actually fresh; Bangkok retail prices are 2–3× farm gate; delivery windows are vague │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Triggers           │ Durian season kickoff, Chinese New Year gifts, a friend's LINE share                                               │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Success looks like │ Orders twice/month, trusts 2–3 favorite stores, shares with friends                                                │
  └────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  🧑‍🌾 Persona 2 — Somchai (Primary Seller)

  "My orchard is good. I just need people to find it."

  ┌────────────────────┬────────────────────────────────────────────────────────────────────────────────────────┐
  │                    │                                                                                        │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ Age / Role         │ 52, durian farmer, Chanthaburi; runs family orchard (~20 rai)                          │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ Tech               │ Android mid-range, uses LINE + Facebook Marketplace. Slow with forms.                  │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ Language           │ Thai only                                                                              │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ Goals              │ Sell direct without middleman; clear inbound orders; keep it as simple as LINE         │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ Frustrations       │ Order spreadsheets, manual replies, not knowing if buyer paid; English-only dashboards │
  ├────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤                                                                  
  │ Success looks like │ Sees today's orders at a glance, updates stock in under a minute                       │
  └────────────────────┴────────────────────────────────────────────────────────────────────────────────────────┘                                                                  
                  
  🍊 Persona 3 — Wei Chen (Secondary Buyer)                                                                                                                                        
                  
  "I want authentic Thai fruit shipped reliably."                                                                                                                                  
                  
  ┌────────────────────┬──────────────────────────────────────────────────────────────────────────────────────┐
  │                    │                                                                                      │
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Age / Role         │ 41, importer / gift buyer, based in Chengdu                                          │
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Tech               │ WeChat-native, uses Taobao; translates product pages                                 │                                                                    
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤                                                                    
  │ Language           │ Chinese primary, minimal English                                                     │                                                                    
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤                                                                    
  │ Goals              │ Bulk-order premium grades (Musang King, monthong); verify origin/grade               │
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤                                                                    
  │ Frustrations       │ Thai-only listings, unclear grade/size specs, payment friction                       │
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤                                                                    
  │ Success looks like │ Can read everything in Chinese, clear unit pricing (kg vs crate), confident in grade │
  └────────────────────┴──────────────────────────────────────────────────────────────────────────────────────┘                                                                    
                  
  👨‍💻 Persona 4 — Alex (Expat Buyer, tertiary)                                                                                                                                                      
   ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  "I love Thai fruit but don't know what I'm buying."                                                                                                                              
                  
  ┌──────────────┬──────────────────────────────────────────────────────────────────────────────────┐
  │              │                                                                                  │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────┤                                                                              
  │ Age / Role   │ 29, digital nomad in Chiang Mai, 1-year stay                                     │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────┤                                                                              
  │ Language     │ English                                                                          │                                                                              
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ Goals        │ Discover unfamiliar fruits; occasional orders; learn seasonality                 │                                                                              
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────┤                                                                              
  │ Frustrations │ Doesn't know variety names; can't tell what's in season; reviews/ratings missing │
  └──────────────┴──────────────────────────────────────────────────────────────────────────────────┘                                                                              
                  
  ---                                                                                                                                                                              
  2. Empathy Map — Ploy (Primary Persona)
                                                                                                                                                                                   
  ┌─────────────────────────────────┬─────────────────────────────────┐
  │  SAYS                           │  THINKS                         │                                                                                                            
  │  • "Is this really from the     │  • "Which durian variety am I   │
  │    farm or a reseller?"         │    actually getting?"           │                                                                                                            
  │  • "The picture looks good,     │  • "Is 450฿/kg fair right now?" │                                                                                                            
  │    but what grade is it?"       │  • "Will it arrive before the   │                                                                                                            
  │  • "Can they deliver Saturday?" │    weekend trip?"               │                                                                                                            
  │  • "Let me send this link to    │  • "Can I trust this seller —   │                                                                                                            
  │    mom in LINE."                │    no reviews yet…"             │                                                                                                            
  ├─────────────────────────────────┼─────────────────────────────────┤                                                                                                            
  │  DOES                           │  FEELS                          │                                                                                                            
  │  • Opens the site during lunch  │  • Excited when seeing a new    │                                                                                                            
  │    break on phone               │    in-season fruit              │                                                                                                            
  │  • Filters by category          │  • Anxious about delivery       │                                                                                                            
  │  • Compares 3 stores before     │    timing & freshness           │                                                                                                            
  │    adding to cart               │  • Skeptical of price claims    │                                                                                                            
  │  • Screenshots, shares on LINE  │  • Delighted by farmer stories  │                                                                                                            
  │  • Checks again in the evening  │  • Frustrated when language     │                                                                                                            
  │    from laptop                  │    toggle doesn't persist       │                                                                                                            
  └─────────────────────────────────┴─────────────────────────────────┘                                                                                                            
                                                                                                                                                                                   
  PAIN                                GAIN                                                                                                                                         
  • Unclear delivery ETA              • Direct-from-farm trust signal                                                                                                              
  • Unit confusion (kg vs crate)      • Buy seasonal at fair price                                                                                                                 
  • No reviews / social proof         • Surprise and share with friends
  • Cart breaks with multi-store      • Feel smarter about fruit                                                                                                                   
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  3. Journey Map — Ploy orders durian                                                                                                                                              
                                     
  ┌─────────────┬───────────────────┬───────────────────────┬────────────────────────────┬──────────────────────────────────────┬──────────────────┬─────────────────────────┐ 
  │    Stage    │    1. Trigger     │      2. Discover      │        3. Evaluate         │             4. Purchase              │    5. Wait /     │    6. Post-purchase     │     
  │             │                   │                       │                            │                                      │     Receive      │                         │ 
  ├─────────────┼───────────────────┼───────────────────────┼────────────────────────────┼──────────────────────────────────────┼──────────────────┼─────────────────────────┤     
  │ Goal        │ See what's in     │ Find a trustworthy    │ Pick the right unit/qty    │ Check out smoothly                   │ Know when it     │ Decide if she'll        │ 
  │             │ season            │ store                 │                            │                                      │ arrives          │ reorder                 │     
  ├─────────────┼───────────────────┼───────────────────────┼────────────────────────────┼──────────────────────────────────────┼──────────────────┼─────────────────────────┤     
  │ Doing       │ Sees a friend's   │ Lands on Home, taps   │ Opens product detail,      │ Adds to cart, logs in, places order  │ Checks order     │ Eats, photographs,      │     
  │             │ LINE post         │ "ทุเรียน" category      │ compares 2 stores          │                                      │ status           │ maybe shares            │     
  ├─────────────┼───────────────────┼───────────────────────┼────────────────────────────┼──────────────────────────────────────┼──────────────────┼─────────────────────────┤ 
  │ Thinking    │ "Is Monthong out  │ "Which farmer         │ "Is 1 crate too much?      │ "Do I have to create an account?"    │ "When is it      │ "Was it worth it?"      │ 
  │             │ yet?"             │ actually grows it?"   │ What's the grade?"         │                                      │ coming?"         │                         │     
  ├─────────────┼───────────────────┼───────────────────────┼────────────────────────────┼──────────────────────────────────────┼──────────────────┼─────────────────────────┤ 
  │ Feeling     │ 😊 Curious        │ 🤔 Scanning           │ 😕 Slightly overwhelmed    │ 😬 Cart friction if multi-store bug  │ 😟 Anxious (no   │ 😍 or 😞 — binary       │     
  │             │                   │                       │                            │ hits                                 │ ETA)             │                         │     
  ├─────────────┼───────────────────┼───────────────────────┼────────────────────────────┼──────────────────────────────────────┼──────────────────┼─────────────────────────┤ 
  │ Touchpoint  │ LINE / social     │ Home, Header search,  │ ProductDetail, StoreDetail │ Cart, LoginModal, Checkout           │ Order status     │ No loop back today      │     
  │             │                   │ category tabs         │                            │                                      │ page (missing?)  │                         │     
  ├─────────────┼───────────────────┼───────────────────────┼────────────────────────────┼──────────────────────────────────────┼──────────────────┼─────────────────────────┤ 
  │             │                   │ Store cards lack farm │ Unit picker unclear; no    │ Cart.removeFromCart bug removes      │ No delivery      │ No review, no reorder   │     
  │ Pain point  │ —                 │  origin/trust cues    │ size/grade spec; no        │ wrong item in multi-store carts; no  │ window shown; no │ prompt                  │ 
  │             │                   │                       │ reviews                    │ guest checkout                       │  tracking        │                         │     
  ├─────────────┼───────────────────┼───────────────────────┼────────────────────────────┼──────────────────────────────────────┼──────────────────┼─────────────────────────┤
  │             │ Seasonality       │ Farmer avatar,        │ Unit presets ("enough for  │ Fix multi-store remove index bug     │ Order timeline,  │ One-tap reorder, review │     
  │ Opportunity │ banner, "in       │ province,             │ 4 people"), grade photos,  │ (Cart.jsx:80); allow guest checkout  │ LINE notify      │  prompt 3 days later,   │
  │             │ season now"       │ years-selling badge;  │ "typical size" reference   │ w/ LINE login; show est. delivery    │ integration      │ refer-a-friend          │     
  │             │ ribbon            │ ratings               │                            │                                      │                  │                         │
  └─────────────┴───────────────────┴───────────────────────┴────────────────────────────┴──────────────────────────────────────┴──────────────────┴─────────────────────────┘

  Moments of Truth (highest leverage)                                                                                                                                              
   
  1. Trust at Discover — Ploy decides in ~10s whether a store is legit. Today, stores don't expose origin, history, or reviews.                                                    
  2. Confidence at Evaluate — Unit/quantity ambiguity is the #1 reason carts get abandoned in fresh-food commerce. Needs grade visuals + human-scale hints.
  3. Certainty at Receive — Fresh produce lives or dies on arrival timing. No status page today = anxiety and no repeat.                                                           
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  4. Synthesis — Insights & Design Implications                                                                                                                                    
                                               
  🔑 Top insights
                                                                                                                                                                                   
  1. Trust is the whole product. Ploy and Wei both want to buy direct from farmer but have no way to verify. Today's store card has name + image — not enough.                     
  2. Unit/grade confusion is a silent conversion killer. The schema already has product_units — but the UI treats it as a dropdown, not a decision aid. Buyers need "what does 1   
  crate look like / feed?"                                                                                                                                                         
  3. The seller UX is likely the bigger risk than the buyer UX. Somchai is Thai-only, slow with forms, and will churn off the platform if the dashboard feels harder than LINE.
  Seller retention → inventory → buyer retention.                                                                                                                                  
  └─────────────┴───────────────────┴───────────────────────┴────────────────────────────┴──────────────────────────────────────┴──────────────────┴─────────────────────────┘

  Moments of Truth (highest leverage)

  1. Trust at Discover — Ploy decides in ~10s whether a store is legit. Today, stores don't expose origin, history, or reviews.
  2. Confidence at Evaluate — Unit/quantity ambiguity is the #1 reason carts get abandoned in fresh-food commerce. Needs grade visuals + human-scale hints.
  3. Certainty at Receive — Fresh produce lives or dies on arrival timing. No status page today = anxiety and no repeat.

  ---
  4. Synthesis — Insights & Design Implications

  🔑 Top insights

  1. Trust is the whole product. Ploy and Wei both want to buy direct from farmer but have no way to verify. Today's store card has name + image — not enough.
  2. Unit/grade confusion is a silent conversion killer. The schema already has product_units — but the UI treats it as a dropdown, not a decision aid. Buyers need "what does 1
  crate look like / feed?"
  3. The seller UX is likely the bigger risk than the buyer UX. Somchai is Thai-only, slow with forms, and will churn off the platform if the dashboard feels harder than LINE.
  Seller retention → inventory → buyer retention.
  4. i18n is load-bearing, not cosmetic. Wei Chen (CN) and Alex (EN) are secondary today but represent upside. Known gap: StoreDetail, Seller, and Toast strings are hardcoded Thai
   — this caps the CN/EN experience before it starts.
  5. The cart multi-store bug (Cart.jsx:80) is a trust incident waiting to happen. For Ploy's persona — who compares 3 stores — this is the likely scenario. Fix before anything
  else.
  4. Synthesis — Insights & Design Implications

  🔑 Top insights

  1. Trust is the whole product. Ploy and Wei both want to buy direct from farmer but have no way to verify. Today's store card has name + image — not enough.
  2. Unit/grade confusion is a silent conversion killer. The schema already has product_units — but the UI treats it as a dropdown, not a decision aid. Buyers need "what does 1
  crate look like / feed?"
  3. The seller UX is likely the bigger risk than the buyer UX. Somchai is Thai-only, slow with forms, and will churn off the platform if the dashboard feels harder than LINE.
  Seller retention → inventory → buyer retention.
  4. i18n is load-bearing, not cosmetic. Wei Chen (CN) and Alex (EN) are secondary today but represent upside. Known gap: StoreDetail, Seller, and Toast strings are hardcoded Thai
   — this caps the CN/EN experience before it starts.
  5. The cart multi-store bug (Cart.jsx:80) is a trust incident waiting to happen. For Ploy's persona — who compares 3 stores — this is the likely scenario. Fix before anything
  else.
  crate look like / feed?"
  3. The seller UX is likely the bigger risk than the buyer UX. Somchai is Thai-only, slow with forms, and will churn off the platform if the dashboard feels harder than LINE.
  Seller retention → inventory → buyer retention.
  4. i18n is load-bearing, not cosmetic. Wei Chen (CN) and Alex (EN) are secondary today but represent upside. Known gap: StoreDetail, Seller, and Toast strings are hardcoded Thai
   — this caps the CN/EN experience before it starts.
  5. The cart multi-store bug (Cart.jsx:80) is a trust incident waiting to happen. For Ploy's persona — who compares 3 stores — this is the likely scenario. Fix before anything
  else.
   — this caps the CN/EN experience before it starts.
  5. The cart multi-store bug (Cart.jsx:80) is a trust incident waiting to happen. For Ploy's persona — who compares 3 stores — this is the likely scenario. Fix before anything
  else.
  else.
  6. Post-purchase is invisible. No order status UI = anxious buyers + no review loop + no reorder = single-purchase ceiling.

  🎯 Design implications (prioritized)

  P0 — Ship this week
  - Fix Cart.removeFromCart index bug (known, documented)
  - Add a minimal "Order status" view (confirmed → shipped → delivered)
  - Finish i18n pass on StoreDetail, Seller, and Toast strings

  P1 — Next sprint
  - Store card trust block: farmer photo, province, years-selling, (eventual) rating
  - Product unit picker: visual scale ("1 crate ≈ 5kg ≈ feeds 8"), grade photos
  5. The cart multi-store bug (Cart.jsx:80) is a trust incident waiting to happen. For Ploy's persona — who compares 3 stores — this is the likely scenario. Fix before anything
  else.
  6. Post-purchase is invisible. No order status UI = anxious buyers + no review loop + no reorder = single-purchase ceiling.

  🎯 Design implications (prioritized)

  1. Trust at Discover — Ploy decides in ~10s whether a store is legit. Today, stores don't expose origin, history, or reviews.
  2. Confidence at Evaluate — Unit/quantity ambiguity is the #1 reason carts get abandoned in fresh-food commerce. Needs grade visuals + human-scale hints.
  3. Certainty at Receive — Fresh produce lives or dies on arrival timing. No status page today = anxiety and no repeat.

  ---
  4. Synthesis — Insights & Design Implications

  🔑 Top insights

  1. Trust is the whole product. Ploy and Wei both want to buy direct from farmer but have no way to verify. Today's store card has name + image — not enough.
  2. Unit/grade confusion is a silent conversion killer. The schema already has product_units — but the UI treats it as a dropdown, not a decision aid. Buyers need "what does 1
  crate look like / feed?"
  3. The seller UX is likely the bigger risk than the buyer UX. Somchai is Thai-only, slow with forms, and will churn off the platform if the dashboard feels harder than LINE.
  Seller retention → inventory → buyer retention.
  4. i18n is load-bearing, not cosmetic. Wei Chen (CN) and Alex (EN) are secondary today but represent upside. Known gap: StoreDetail, Seller, and Toast strings are hardcoded Thai
   — this caps the CN/EN experience before it starts.
  5. The cart multi-store bug (Cart.jsx:80) is a trust incident waiting to happen. For Ploy's persona — who compares 3 stores — this is the likely scenario. Fix before anything
  else.
  6. Post-purchase is invisible. No order status UI = anxious buyers + no review loop + no reorder = single-purchase ceiling.

  🎯 Design implications (prioritized)

  P0 — Ship this week
  - Fix Cart.removeFromCart index bug (known, documented)
  - Add a minimal "Order status" view (confirmed → shipped → delivered)
  - Finish i18n pass on StoreDetail, Seller, and Toast strings

  P1 — Next sprint
  - Store card trust block: farmer photo, province, years-selling, (eventual) rating
  - Product unit picker: visual scale ("1 crate ≈ 5kg ≈ feeds 8"), grade photos
  - Seller dashboard: Thai-first, LINE-familiar patterns (big cards, not tables)

  P2 — After validation
  - Reviews & ratings (needs moderation policy)
  - LINE login + LINE order notifications
  - Seasonality banner / "in season now" on Home
  - Reorder + referral loops

  🧪 What we don't know yet

  - Whether CN buyers (Wei) are a real near-term segment or a future one — affects whether CN i18n is P0 or P2.
  - Whether sellers like Somchai will self-serve or need an onboarding human.
  - Typical basket size — drives checkout UX (guest vs account) and delivery model.
  - Delivery model itself (self-ship? aggregator? cold-chain?) — shapes the entire receive-stage UX.


---

## 2. Heuristic Evaluation — Buyer Flows

Run one per screen. Use Nielsen + Krug heuristics (visibility of status, match with real world, user control, consistency, error prevention, recognition, flexibility, minimalist design, error recovery, help & docs).

### 2.1 Home page — `src/pages/Home.jsx`
**Command:** `/prototyping-testing:evaluate` (point at `src/pages/Home.jsx` + `src/index.css` hero/stores-grid/products-grid blocks)

Heuristic Evaluation — src/pages/Home.jsx

  1. Scope

  Screens under review: Home page — hero, category tabs, featured stores, product grid, empty state.
  Flows: (a) Browse → category → product detail, (b) Search → results, (c) Discover store → store detail.
  Inputs: src/pages/Home.jsx + adjacent Header.jsx (search integration point) + src/index.css class references.

  ---
  2. Findings by Nielsen Heuristic

  H1 · Visibility of system status

  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────────────┐
  │  #  │                                                                 Finding                                                                 │ Severity │     Location     │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 1.1 │ No loading state. On first paint, products / stores from AppContext are empty arrays → the empty state ("No results, show all") flashes │ P0       │ Home.jsx:132–147 │
  │     │  before Supabase resolves. Users think the site has no data.                                                                            │          │                  │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 1.2 │ Hero stat numbers flash. stores.length and products.length render as 0 until data arrives.                                              │ P2       │ Home.jsx:69–82   │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 1.3 │ Active-filter ambiguity. When search + category are both active, the title shows only the search phrase; the category filter is         │ P1       │ Home.jsx:121–128 │
  │     │ silently still applied.                                                                                                                 │          │                  │
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────────────┘

  H2 · Match between system and the real world

  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────────────┐
  │  #  │                                                                 Finding                                                                 │ Severity │     Location     │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 2.1 │ Address parsing is brittle string surgery. locField(store,'address')?.includes('จ.')...split(' จ.')[1] hard-codes Thai-only markers to  │ P1       │ Home.jsx:101–104 │
  │     │ extract the province. Breaks for EN/CN stores without จ., and for stores with multiple จ. tokens.                                       │          │                  │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 2.2 │ t('product.from') appears after the price (฿120 from) — natural reading for TH is เริ่มต้น ฿120. Confirm translation order matches         │ P2       │ Home.jsx:171–173 │
  │     │ language.                                                                                                                               │          │                  │  
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────────────┘
                                                                                                                                                                                   
  H3 · User control and freedom

  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────────────────────┐ 
  │  #  │                                                             Finding                                                              │ Severity │        Location        │ 
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────┤ 
  │ 3.1 │ No visible "clear filters" affordance when filters are applied with results. The only "Show all" is hidden inside the empty      │ P1       │ Home.jsx:118–130       │ 
  │     │ state. Users can't see filters as removable chips.                                                                               │          │                        │ 
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────┤   
  │ 3.2 │ Category nav scrolls horizontally; the "all" tab can scroll off-screen on mobile, so "reset to all" becomes hard to find once a  │ P1       │ Home.jsx:41–53 + CSS   │
  │     │ later category is selected.                                                                                                      │          │ L268                   │   
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────┤
  │ 3.3 │ Clicking a category does window.scrollTo(0, 0) — kills the user's scroll context without an undo.                                │ P2       │ Home.jsx:47            │   
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────────────────────┘   
  
  H4 · Consistency and standards                                                                                                                                                   
                  
  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────────────────┐  
  │  #  │                                                               Finding                                                               │ Severity │      Location      │  
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤    
  │ 4.1 │ "Add to Cart" button does not add to cart. It calls onProductClick(p, store) → navigates to Product Detail. Users expect an         │ P0       │ Home.jsx:174–182   │  
  │     │ in-place add; this is a mislabel / mild dark-pattern.                                                                               │          │                    │    
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤    
  │ 4.2 │ Entire card is clickable and the "Add to Cart" button is nested and clickable, and the store label inside the card is a third       │ P1       │ Home.jsx:154–183   │  
  │     │ clickable target with stopPropagation. Three overlapping click surfaces without visual differentiation.                             │          │                    │    
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤  
  │ 4.3 │ <div> elements used as buttons (.store-card, .product-card, .product-store) — no semantic button role.                              │ P0       │ Home.jsx:95, 154,  │    
  │     │                                                                                                                                     │ (a11y)   │ 165                │    
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────────────────┘
                                                                                                                                                                                   
  H5 · Error prevention

  No major findings on this surface.                                                                                                                                               
  
  H6 · Recognition rather than recall                                                                                                                                              
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────────────┐
  │  #  │                                                          Finding                                                           │ Severity │     Location     │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 6.1 │ Category icons + names are good. But no badge/count showing how many products per category — users must click to discover. │ P2       │ Home.jsx:41–53   │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 6.2 │ "เริ่มต้น" (from) label is tiny; users can't tell if ฿120 is the price or the minimum across units.                           │ P2       │ Home.jsx:171–173 │               
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────────────┘               
                                                                                                                                                                                   
  H7 · Flexibility and efficiency                                                                                                                                                  
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────┬──────────────────┐
  │  #  │                                                      Finding                                                       │ Severity  │     Location     │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────────────┤                      
  │ 7.1 │ No sort (price, popularity, nearest, newest). Fresh-fruit marketplaces live or die by "What's in season cheapest." │ P1        │ Home.jsx:149     │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────────────┤                      
  │ 7.2 │ No keyboard nav between cards — <div>s aren't focusable.                                                           │ P0 (a11y) │ Home.jsx:95, 154 │                      
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────┴──────────────────┘                      
                                                                                                                                                                                   
  H8 · Aesthetic and minimalist design                                                                                                                                             
                  
  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬─────────────────┐
  │  #  │                                                       Finding                                                       │ Severity │    Location     │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
  │ 8.1 │ Hardcoded "5k+" customers. Marketing copy masquerading as data — erodes trust the first time a savvy user inspects. │ P1       │ Home.jsx:79     │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────┤
  │ 8.2 │ Hero, stores, and grid together make a long first screen; no easy jump to "just show me products."                  │ P2       │ Home.jsx:58–115 │                       
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴─────────────────┘                       
                                                                                                                                                                                   
  H9 · Help users recognize, diagnose, recover from errors                                                                                                                         
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────┬──────────────────┐
  │  #  │                                                            Finding                                                             │     Severity     │     Location     │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────────────┤
  │ 9.1 │ Empty-state "Show all" button resets state via document.querySelector('.search-bar input') + synthetic input event — a DOM     │ P0               │ Home.jsx:137–144 │
  │     │ side-channel into a sibling component. Brittle if Header changes, and violates React's data flow.                              │ (architectural)  │                  │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────────────┤   
  │ 9.2 │ Empty state doesn't tell the user why no results (search term? category mismatch? both?).                                      │ P2               │ Home.jsx:133–147 │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────┴──────────────────┘   
                  
  H10 · Help and documentation                                                                                                                                                     
                  
  ┌──────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────┐               
  │  #   │                                                              Finding                                                              │ Severity │ Location │
  ├──────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────┤
  │ 10.1 │ No seasonality hint (e.g., "Mango season ends June"), no unit-size primer. Primary persona Ploy needs this to decide confidently. │ P2       │ —        │
  └──────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────┘
                                                                                                                                                                                   
  ---
  3. Flow Analysis                                                                                                                                                                 
                  
                      ┌─────────────────┐
                      │   LANDING       │
                      └────────┬────────┘                                                                                                                                          
                               │
            ┌──────────────────┼──────────────────┐                                                                                                                                
            ▼                  ▼                  ▼
       [Category tab]    [Store card]       [Product card]
            │                  │                  │                                                                                                                                
            │                  ▼                  ▼
            │             StoreDetail        ProductDetail                                                                                                                         
            │                                     ▲
            ▼                                     │                                                                                                                                
       Filtered grid ──► [Add to Cart btn] ───────┘
                         (mislabel — does NOT add)                                                                                                                                 
                                                                                                                                                                                   
            [Search submit] ──► Filtered grid                                                                                                                                      
                                   │                                                                                                                                               
                                   ▼                                                                                                                                               
                       If 0 results → Empty state
                                   │
                       [Show all] ─┴─► Resets via DOM side-channel
                                                                                                                                                                                   
  Flow issues                                                                                                                                                                      
  - F1 (P0): "Add to Cart" exits discovery into a new page — a single-click conversion path from grid doesn't exist.                                                               
  - F2 (P1): When filter + search are stacked, no breadcrumb / chip stack to unwind them one at a time.                                                                            
  - F3 (P1): From any filtered state back to Home requires either logo click (loses search) or scrolling to find "all" in the category rail.
  - F4 (P2): Store list only shows 3 stores with no "See all stores" link — dead-end discovery.                                                                                    
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  4. Accessibility Check (WCAG 2.1 AA)                                                                                                                                             
                                                                                                                                                                                   
  ┌─────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬────────────────────────┬──────────┬─────────────┐
  │  #  │                                                       Issue                                                       │          WCAG          │ Severity │  Location   │    
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤    
  │ A1  │ Clickable <div>s (.store-card, .product-card, .product-store) — not keyboard-focusable, no role, no Enter/Space   │ 2.1.1 Keyboard, 4.1.2  │ P0       │ L95, 154,   │
  │     │ handler, no aria-label.                                                                                           │ Name/Role              │          │ 165         │    
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤    
  │ A2  │ Category tabs are <button>s (good) but lack aria-pressed / aria-current="true" to announce active state.          │ 4.1.2                  │ P1       │ L42–49      │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤    
  │ A3  │ Emoji-only icons (🏪, 🍎, 🔍) are decorative but inside text — should be wrapped with aria-hidden="true" or       │ 1.3.1                  │ P2       │ L91, 121,   │
  │     │ SR-relevant.                                                                                                      │                        │          │ 134         │    
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤
  │ A4  │ Empty-state image fallback (.product-img-emoji) has no text alternative when image is missing.                    │ 1.1.1                  │ P2       │ L159–161    │    
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤    
  │ A5  │ Nested interactive elements: the .product-store click inside a clickable .product-card relies on stopPropagation  │ 4.1.2                  │ P1       │ L165        │
  │     │ — screen readers will announce ambiguous focus targets.                                                           │                        │          │             │    
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤
  │ A6  │ No skip link past hero/category nav to product grid.                                                              │ 2.4.1                  │ P2       │ —           │    
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤    
  │ A7  │ Hero h1 has a <span> for the accent color but no semantic break — OK. Verify contrast of hero-badge text over     │ 1.4.3                  │ P2       │ L62–66      │
  │     │ image overlay.                                                                                                    │                        │          │             │    
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────┼──────────┼─────────────┤
  │ A8  │ Yellow pickup badge (#fef3c7 bg / #b45309 text) likely passes 4.5:1 — verify.                                     │ 1.4.3                  │ P2       │ L108        │    
  └─────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────────────────┴──────────┴─────────────┘    
   
  ---                                                                                                                                                                              
  5. Severity Summary
                     
  ┌──────────┬───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Severity │ Count │                                                Must address                                                │                                                
  ├──────────┼───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ P0       │ 5     │ 1.1 loading state · 4.1 mislabeled button · 4.3/A1 div-as-button · 7.2 keyboard nav · 9.1 DOM side-channel │                                                
  ├──────────┼───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ P1       │ 7     │ 1.3, 2.1, 3.1, 3.2, 4.2, 7.1, 8.1, A2, A5                                                                  │                                                
  ├──────────┼───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                
  │ P2       │ 9     │ polish, education, contrast checks                                                                         │                                                
  ├──────────┼───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                
  │ P3       │ 0     │ —                                                                                                          │
  └──────────┴───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────┘                                                
                  
  ---
  6. Prioritized Recommendations
                                
  🔴 P0 — Ship before next review
                                                                                                                                                                                   
  1. Rename & rewire the card CTA. Either change label to "View details" or make it genuinely add the first/default unit to cart via addToCart(p, p.units[0], 1).                  
  (Home.jsx:174–182)                                                                                                                                                               
  2. Lift "clear filters" into props. Replace the document.querySelector hack with a onClearFilters callback passed from App.jsx that resets both search and category.             
  (Home.jsx:137–144)                                                                                                                                                               
  3. Add a loading state. Expose loading from AppContext and render skeleton cards while true — prevents the empty-state flash. (Home.jsx:132)
  4. Convert clickable cards to semantic buttons or links. Replace <div onClick> with <button> (or wrap the image in an anchor for right-click/open-in-new-tab). Add               
  aria-label="Open {product name} from {store name}". Resolve nested-interactive by making the store link a separate focusable element outside the card's clickable region, or use 
  the "card pattern": one primary link, secondary actions as sibling buttons.                                                                                                      
  5. Keyboard support falls out naturally from (4). Confirm focus ring is visible in index.css.                                                                                    
                                                                                                                                                                                   
  🟠 P1 — Next sprint
                                                                                                                                                                                   
  6. Filter chip bar. When any filter is active, render removable chips above the grid: [Category: Durian ✕] [Search: "monthong" ✕] [Clear all]. Solves H1.3, H3.1, H3.2, F2, F3.  
  7. Replace string-based address parsing with a structured province field on stores (add to schema) or a util that splits on a stable delimiter. (Home.jsx:101–104)
  8. Remove or source the "5k+" stat. Either pull from a real metric (total orders in last 30d) or delete — do not fake. (Home.jsx:79)                                             
  9. aria-current="true" on the active category tab. (Home.jsx:42–49)                                                                                                              
  10. Minimal sort control. "Sort: Featured ▾ / Price ↑ / Newest" — one <select> is enough for v1.                                                                                 
                                                                                                                                                                                   
  🟡 P2 — Polish                                                                                                                                                                   
                                                                                                                                                                                   
  11. Category pills could show count badges (ทุเรียน 12).                                                                                                                           
  12. Empty-state copy should name the mismatch: "No results for 'monthong' in category Mango. Try clearing category."
  13. Show "See all N stores →" link on the featured-stores section.                                                                                                               
  14. Add a "What's in season" banner tying into H10.1 and the journey-map opportunity from /design-research:discover.                                                             
  15. Verify color contrast on all badges via an automated check.                                                                                                                  
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  7. Validation next step                                                                                                                                                          
                                                                                                                                                                                   
  A heuristic review surfaces likely issues; it doesn't prove them. Before investing P1 rework, recommend /test-plan for a 5-user moderated study on the mobile Home flow, scripted
   around:                                                                                                                                                                         
  - Task A: "Find the cheapest in-season durian and add one crate to your cart." → tests F1, H1.3, H6.2.
  - Task B: "You added the wrong fruit. Remove it and get back to browsing." → tests F2, F3, H3.1.                                                                                 
  - Task C (AT user): Navigate Home with keyboard only → tests A1, A2, A5.         

### 2.2 Product Detail — `src/pages/ProductDetail.jsx`
**Command:** `/prototyping-testing:evaluate`

Heuristic Evaluation — src/pages/ProductDetail.jsx
                                                                                                                                                                                   
  1. Scope                                                                                
                                                                                                                                                                                   
  Screen under review: Product Detail Page (PDP) — image gallery, store link, unit/qty picker, total bar, Add-to-Cart CTA, store info card, related products grid.                 
  Flows: (a) View → pick unit/qty → add to cart, (b) Unauthenticated add → login, (c) Explore store or related products.                                                           
  Inputs: src/pages/ProductDetail.jsx + AppContext.addToCart (L221–226) + LangContext keys.                                                                                        
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  2. Findings by Nielsen Heuristic                                                                                                                                                 
                                                                                                                                                                                   
  H1 · Visibility of system status
                                                                                                                                                                                   
  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬─────────────────────────────────────────┐   
  │  #  │                                                     Finding                                                     │ Severity │                Location                 │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────────────────────┤   
  │ 1.1 │ After a successful add, only a toast fires — no inline "Added!" state on the CTA, no bump of a cart badge       │ P0       │ ProductDetail.jsx:148–151 +             │
  │     │ visible on this page. Users may click again, creating duplicate entries.                                        │          │ AppContext.jsx:221–226                  │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────────────────────┤   
  │ 1.2 │ No stock/out-of-stock state anywhere in the schema or UI. Every product is implicitly "infinitely available."   │ P1       │ ProductDetail.jsx:117–131               │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────────────────────┤   
  │ 1.3 │ Total line shows only the final number. No math trail ("฿450 × 2 crates = ฿900") — Ploy and Wei both ran into   │ P2       │ ProductDetail.jsx:135–138               │
  │     │ unit-math confusion in the journey map.                                                                         │          │                                         │   
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴─────────────────────────────────────────┘
                                                                                                                                                                                   
  H2 · Match between system and the real world                                                                                                                                     
  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────────────────────────┐  
  │  #  │                                                            Finding                                                             │ Severity │         Location          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤
  │ 2.1 │ Category badge renders the raw ID. <div className="pd-category-badge">{product.category}</div> outputs slugs like durian,      │ P0       │ ProductDetail.jsx:93–96   │
  │     │ mangosteen. Should be locField(categories.find(c=>c.id===product.category), 'name') with the icon.                             │          │                           │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤  
  │ 2.2 │ Unit labels rely on seller input — no normalization hint ("1 crate ≈ 5 kg"). Pricing literacy suffers.                         │ P1       │ ProductDetail.jsx:100–111 │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤  
  │ 2.3 │ store.phone is rendered as plain text, not a tel: link. On mobile, tap-to-call is an expected convention.                      │ P2       │ ProductDetail.jsx:174–176 │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────────────────────────┘  
                  
  H3 · User control and freedom                                                                                                                                                    
                  
  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────────────────────────────────┐   
  │  #  │                                                       Finding                                                        │ Severity │              Location              │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────────────────┤
  │ 3.1 │ Quantity only adjustable via +/- buttons. Ordering 12 crates = 11 taps. No typed input.                              │ P1       │ ProductDetail.jsx:114–132          │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────────────────┤
  │ 3.2 │ Back button is custom (onBack) — browser back button won't work because routing is state-based. On mobile, this is   │ P1       │ ProductDetail.jsx:36–42 + App      │   
  │     │ the #1 navigation instinct.                                                                                          │          │ routing                            │   
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────────────────┤   
  │ 3.3 │ No breadcrumb ("Home › Durian › Monthong"); user can't jump up to the category grid.                                 │ P2       │ —                                  │   
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────────────────────────────────┘   
  
  H4 · Consistency and standards                                                                                                                                                   
                  
  ┌─────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────────────────────────┐ 
  │  #  │                                                            Finding                                                            │ Severity │         Location          │ 
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤   
  │ 4.1 │ "Add to Cart" on related-products cards re-navigates to a PDP instead of adding. Same mislabel as Home.                       │ P0       │ ProductDetail.jsx:217–225 │ 
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤   
  │ 4.2 │ Two "Go to store" surfaces — the compact .pd-store-link at the top (L76) and the large .pd-store-card at the bottom (L156).   │ P1       │ L76–88, L156–180          │   
  │     │ Two consistent ways to go to the same place = visual noise.                                                                   │          │                           │   
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤   
  │ 4.3 │ Clickable <div>s throughout: .pd-store-link (L76), .pd-thumb (L61), .unit-option (L102), .pd-store-card-body (L160), related  │ P0       │ multiple                  │   
  │     │ .product-card (L193). No button semantics, no keyboard support.                                                               │ (a11y)   │                           │   
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤
  │ 4.4 │ Unit selection is a radiogroup pattern but rendered as click-anywhere <div>s — users familiar with native radio affordances   │ P1       │ ProductDetail.jsx:100–111 │   
  │     │ get no tab-through-to-select behavior.                                                                                        │          │                           │   
  └─────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────────────────────────┘
                                                                                                                                                                                   
  H5 · Error prevention                                                                                                                                                            
  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────────────────────────┐  
  │  #  │                                                            Finding                                                             │ Severity │         Location          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤
  │ 5.1 │ Duplicate cart lines. addToCart always appends a new entry (AppContext.jsx:223). Adding the same product + unit twice yields   │ P0       │ AppContext.jsx:221–226    │
  │     │ two lines. Multiplies with the known Cart.removeFromCart bug — user tries to clean up and removes the wrong store's item.      │          │                           │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤  
  │ 5.2 │ useState(product.units[0]) (L9) crashes if units is empty. No guard; products without units are possible since they're written │ P0       │ ProductDetail.jsx:9       │
  │     │  by sellers.                                                                                                                   │          │                           │  
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤
  │ 5.3 │ qty has no ceiling. Combined with no stock data, user can order 9999 without any nudge.                                        │ P2       │ ProductDetail.jsx:125–130 │  
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤  
  │ 5.4 │ setQty(qty + 1) uses the value captured in closure — switch to updater form setQty(q => q + 1) for safety under rapid clicks.  │ P3       │ ProductDetail.jsx:127     │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────────────────────────┘  
                  
  H6 · Recognition rather than recall                                                                                                                                              
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────────────────────────┐  
  │  #  │                                                            Finding                                                             │ Severity │         Location          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤
  │ 6.1 │ After login-required add, the modal opens but the intended add is lost — user must click Add to Cart again. No "pending        │ P1       │ ProductDetail.jsx:15–21   │
  │     │ action" preserved.                                                                                                             │          │                           │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤  
  │ 6.2 │ Unit options show label + price but not quantity breakdown ("1 kg", "5 kg / crate"). Primary persona needs this to decide.     │ P1       │ ProductDetail.jsx:101–110 │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────────────────────────┘  
                  
  H7 · Flexibility and efficiency                                                                                                                                                  
                  
  ┌─────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬─────────────────────────┐
  │  #  │                                                  Finding                                                  │ Severity │        Location         │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────┤
  │ 7.1 │ No "Buy now" path — add to cart, go to cart, check out is the only flow.                                  │ P2       │ —                       │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────┤
  │ 7.2 │ No share button. Journey map identifies LINE sharing as a primary engagement driver for Persona 1 (Ploy). │ P2       │ —                       │                         
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────┤                         
  │ 7.3 │ No image zoom / lightbox. For a freshness/quality decision, this is core.                                 │ P2       │ ProductDetail.jsx:48–57 │                         
  └─────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴─────────────────────────┘                         
                  
  H8 · Aesthetic and minimalist design                                                                                                                                             
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────────────────────────┐  
  │  #  │                                                            Finding                                                             │ Severity │         Location          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤  
  │ 8.1 │ Info card at the bottom duplicates store name, avatar, and rating already shown at the top store-link.                         │ P1       │ L76–88 vs L160–179        │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────────────┤
  │ 8.2 │ Right rail mixes inline styles (L164–176) with class-based styling — hard to maintain and inconsistent with the rest of the    │ P3       │ ProductDetail.jsx:164–176 │  
  │     │ file.                                                                                                                          │          │                           │  
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────────────────────────┘  
                                                                                                                                                                                   
  H9 · Help users recognize, diagnose, recover from errors                                                                                                                         
  
  ┌─────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────────────────────┐  
  │  #  │                                                              Finding                                                              │ Severity │        Location        │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────┤
  │ 9.1 │ If Add fails (network, RLS denial on addToCart later when it's persisted), the function silently returns false. No error toast,   │ P1       │ AppContext.jsx:221–226 │
  │     │ no retry.                                                                                                                         │          │                        │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────────┤  
  │ 9.2 │ Add hardcodes the Thai toast เพิ่ม ${product.name} ลงตะกร้าแล้ว — EN/CN users see Thai. Known i18n gap.                               │ P1       │ AppContext.jsx:224     │
  └─────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────────────────────┘  
                  
  H10 · Help and documentation                                                                                                                                                     
                  
  ┌──────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────┐  
  │  #   │                                                                    Finding                                                                     │ Severity │ Location │
  ├──────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────┤  
  │ 10.1 │ No product-level info: grade, origin region, harvest date, storage/ripening tips, seasonality. These are purchase-decision blockers for both   │ P1       │ —        │
  │      │ buyer personas.                                                                                                                                │          │          │
  └──────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────┘  
  
  ---                                                                                                                                                                              
  3. Flow Analysis
                                                                                                                                                                                   
    Arrive on PDP
         │                                                                                                                                                                         
         ▼        
    Pick unit ──► Pick qty ──► See total
         │                         │                                                                                                                                               
         │                         ▼                                                                                                                                               
         │                    Click Add                                                                                                                                            
         │                  ┌──────┴──────┐                                                                                                                                        
         │                  │             │
         │             Logged in      Not logged in                                                                                                                                
         │                  │             │
         │                  ▼             ▼                                                                                                                                        
         │             Toast fires   LoginModal                                                                                                                                    
         │             (stay on PDP)      │
         │                  │        Sign in                                                                                                                                       
         │                  │             │
         │                  │             ▼                                                                                                                                        
         │                  │       Modal closes                                                                                                                                   
         │                  │       ❗ Add is LOST
         │                  │       User clicks Add again                                                                                                                          
         │                  ▼                                                                                                                                                      
         │          Click again?
         │          ❗ Creates duplicate cart line                                                                                                                                 
         │        
         └─► Click Related product's "Add to cart"                                                                                                                                 
             ❗ Navigates to another PDP instead of adding                                                                                                                         
                                                                                                                                                                                   
  Flow issues                                                                                                                                                                      
  - F1 (P0): Login interrupts the add intent without preserving it.                                                                                                                
  - F2 (P0): Related-product CTA is mislabeled (mirrors Home F1).                                                                                                                  
  - F3 (P0): Double-add creates duplicate lines; downstream Cart.removeFromCart bug then removes wrong items — compounding failure.
  - F4 (P1): Back button depends on onBack; browser back bypasses routing and looks broken.                                                                                        
  - F5 (P2): No forward path to checkout directly ("Buy now").                                                                                                                     
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  4. Accessibility Check (WCAG 2.1 AA)                                                                                                                                             
                                                                                                                                                                                   
  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────┬──────────┬─────────────────┐
  │  #  │                                                            Issue                                                            │   WCAG    │ Severity │    Location     │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤
  │ A1  │ Clickable <div>s across unit options, thumbnails, store link, store card, and related cards — no role, no keyboard, no      │ 2.1.1,    │ P0       │ L61, 76, 102,   │
  │     │ focus ring.                                                                                                                 │ 4.1.2     │          │ 160, 193        │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤   
  │ A2  │ Unit options should be a radiogroup. Render either native <input type="radio"> inside <label>s, or a div with               │ 4.1.2     │ P0       │ L100–111        │
  │     │ role="radiogroup" whose children are role="radio" + aria-checked.                                                           │           │          │                 │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤
  │ A3  │ Quantity spinner: buttons have only icons — add aria-label="Decrease quantity" / "Increase quantity". The value <div>       │ 4.1.2     │ P1       │ L116–131        │   
  │     │ should be role="spinbutton" with aria-valuenow, aria-valuemin, aria-valuemax, aria-label.                                   │           │          │                 │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤
  │ A4  │ Thumbnail <img alt=""> is empty — acceptable for purely decorative, but the thumbnail also selects the hero image. Should   │ 1.1.1,    │ P1       │ L60–68          │   
  │     │ be role="tab" inside a role="tablist" with aria-selected, or a button with aria-label="View image {n+1}".                   │ 4.1.2     │          │                 │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤
  │ A5  │ Total price change is silent to screen readers. Wrap total in aria-live="polite".                                           │ 4.1.3     │ P1       │ L135–138        │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤   
  │ A6  │ Login hint uses a color-only Info icon — acceptable, but ensure the icon has aria-hidden="true" so the message isn't read   │ 1.3.3     │ P2       │ L142–144        │
  │     │ as "Info symbol …".                                                                                                         │           │          │                 │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤
  │ A7  │ Category badge displays raw slug (see H2.1) — unusable for screen readers in TH/CN/EN if it reads "durian" in an EN context │ 1.3.1     │ P0       │ L93–96          │   
  │     │  for a Thai user.                                                                                                           │           │          │                 │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤
  │ A8  │ Back button is .btn-secondary — confirm visible focus ring across all browsers.                                             │ 2.4.7     │ P2       │ L36–42          │   
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤   
  │ A9  │ store.phone is not a tel: link — loses not just click-to-call but also the Phone role for AT users.                         │ 1.3.1     │ P2       │ L174–176        │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────┼──────────┼─────────────────┤   
  │ A10 │ Related-products repeat Home a11y issues (card is a <div>).                                                                 │ 2.1.1     │ P0       │ L193            │
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────┴──────────┴─────────────────┘   
                  
  ---                                                                                                                                                                              
  5. Severity Summary

  ┌──────────┬───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Severity │ Count │                                                                       Must address                                                                       │
  ├──────────┼───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
  │ P0       │ 7     │ Category badge raw ID · Duplicate-add bug · product.units[0] crash · Related "Add to cart" mislabel · Div-as-button (unit, thumb, card) · Unit           │
  │          │       │ radiogroup semantics · Login loses pending add                                                                                                           │  
  ├──────────┼───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
  │ P1       │ 10    │ Duplicate store cards · No qty input · No stock state · No post-login re-add · Error toast for add failures · i18n toast · No unit normalization · Back  │
  │          │       │ vs browser back · Thumbnails need tab/aria-selected · Total not aria-live · Product info missing                                                         │  
  ├──────────┼───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ P2       │ 6     │ Per-unit math · tel: link · breadcrumb · buy-now · share · image zoom                                                                                    │  
  ├──────────┼───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤  
  │ P3       │ 2     │ setQty updater form · inline-style cleanup                                                                                                               │
  └──────────┴───────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  
                  
  ---                                                                                                                                                                              
  6. Prioritized Recommendations
                                
  🔴 P0 — Ship before next review
                                                                                                                                                                                   
  1. Fix category badge — render localized name with icon:                                                                                                                         
  const cat = categories.find(c => c.id === product.category);                                                                                                                     
  <div className="pd-category-badge">{cat?.icon} {locField(cat, 'name')}</div>                                                                                                     
  2. Merge duplicate cart lines in addToCart (AppContext.jsx:221–226):                                                                                                             
  setCart(prev => {                                                                                                                                                                
    const i = prev.findIndex(x => x.product.id === product.id && x.unit.id === unit.id);                                                                                           
    if (i === -1) return [...prev, { product, store, unit, qty, addedAt: Date.now() }];                                                                                            
    return prev.map((x, idx) => idx === i ? { ...x, qty: x.qty + qty } : x);                                                                                                       
  });                                                                                                                                                                              
  2. This also disarms the known Cart.removeFromCart index bug by shrinking the surface.                                                                                           
  3. Guard against empty units: if (!product.units?.length) return <EmptyProductState />; before touching product.units[0].                                                        
  4. Preserve add intent through login. Store the pending { unit, qty } in a ref; in the auth state subscription, if pending exists, auto-call addToCart then clear.               
  5. Rename or rewire the related card CTA (same fix as Home) — either "View details" label or actually add the first unit to cart.                                                
  6. Convert unit options to native radios or a proper radiogroup and make all card-level <div onClick> real <button> / <a> with keyboard support and visible focus. Tackle        
  unit/thumbnail/store-card together — one pattern, applied.                                                                                                                       
                                                                                                                                                                                   
  🟠 P1 — Next sprint                                                                                                                                                              
                  
  7. Quantity input field in addition to +/-, with type="number" and min/max (even if max is a soft cap for v1).                                                                   
  8. Dedupe store surface. Remove either the compact header link or the bottom info card. Recommend keeping the bottom card (more scannable) and making the top store name a simple
   inline link.                                                                                                                                                                    
  9. Unit normalization hint — augment product_units schema with weight_kg or serves_people. Render as secondary line under each unit label: "1 crate · ≈ 5 kg · ฿90/kg".
  10. i18n the add toast. Move from hardcoded TH to t('toast.addedToCart', { name }).                                                                                              
  11. Error path for add: on any failure, show error toast with retry affordance.                                                                                                  
  12. Thumbnails: role="tablist" + aria-selected (or convert to buttons with labels).                                                                                              
  13. aria-live="polite" on total so the running price is announced on qty change.                                                                                                 
  14. Product info block: grade, origin, harvest date, storage tip — even as optional fields, seeded initially.                                                                    
                                                                                                                                                                                   
  🟡 P2 — Polish                                                                                                                                                                   
                                                                                                                                                                                   
  15. Tap-to-call: wrap store.phone in <a href="tel:">.                                                                                                                            
  16. Breadcrumb above the back button, deep-linkable.
  17. Image lightbox / pinch-zoom on mobile (core for freshness judgment).                                                                                                         
  18. "Buy now" secondary CTA bypassing Cart.                                                                                                                                      
  19. Share button (LINE / copy link) aligned with Ploy's journey step 6.                                                                                                          
                                                                                                                                                                                   
  🟣 P3           
                                                                                                                                                                                   
  20. setQty(q => q + 1) updater form.                                                                                                                                             
  21. Extract the inline styles in the store info card (L164–176) to CSS classes for consistency.
                                                                                                                                                                                   
  ---             
  7. Validation next step                                                                                                                                                          
                         
  The three most validation-worthy hypotheses:
                                                                                                                                                                                   
  ┌────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────┐   
  │                           Hypothesis                           │                                                   Test                                                    │   
  ├────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Duplicate cart lines are a common real failure, not an edge    │ Cart contents telemetry after 20 live sessions; or a task-based usability test where users add 2 crates   │
  │ case                                                           │ in 2 adds.                                                                                                │
  ├────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ Unit normalization ("≈ 5 kg / crate") raises add-to-cart       │ A/B between current unit list and normalized list on a cohort split.                                      │
  │ confidence                                                     │                                                                                                           │   
  ├────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Login-then-add fails users silently                            │ 5-user moderated test, task: "You aren't logged in — add 2 crates of monthong." Observe post-login        │   
  │                                                                │ recovery.                                                                                                 │   
  └────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────┘


### 2.3 Cart & Checkout — `src/pages/Cart.jsx`
**Command:** `/prototyping-testing:evaluate`
**Known issue to confirm:** `Cart.jsx:80` remove-item index bug.

Heuristic Evaluation — src/pages/Cart.jsx                                                                                                                                        
                                                          
  Scope: Cart page (empty, not-logged-in, populated states) and the one-click checkout flow it triggers. Reviewed against Nielsen's 10 heuristics plus flow and a11y layers.       
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  🔴 P0 — Critical (fix before shipping)                                                                                                                                           
                                                                                                                                                                                   
  1. Wrong item deleted from multi-store carts                                                                                                                                     
                                                                                                                                                                                   
  Cart.jsx:80 passes i (the per-store group index) to removeFromCart, but AppContext.jsx:228 treats it as an index into the flat cart array.                                       
                                                                                                                                                                                   
  Example: Cart = [Store A item, Store A item, Store B item]. User clicks 🗑 on Store B's only row (local i=0). Instead of deleting index 2, index 0 is removed — Store A loses an  
  item, Store B still has it.
                                                                                                                                                                                   
  Fix: pass a stable identifier, e.g. add an id when pushing into cart in addToCart and remove by id:                                                                              
  onClick={() => removeFromCart(item.id)}     // Cart.jsx
  // AppContext                                                                                                                                                                    
  setCart(prev => prev.filter(c => c.id !== id));                                                                                                                                  
                                                 
  This also lets you drop key={i} (anti-pattern — see P1 #5).                                                                                                                      
                                                                                                                                                                                   
  2. Checkout is a foot-gun (no double-submit protection)                                                                                                                          
                                                                                                                                                                                   
  placeOrder is async and loops through stores, but btn-checkout (line 113) is never disabled. Rapid clicks → duplicate orders inserted in Supabase. On a slow network this is very
   likely.        
                                                                                                                                                                                   
  Fix: local isSubmitting state, disable button + show spinner during the call.                                                                                                    
  
  3. No quantity editing                                                                                                                                                           
                  
  Users can only remove a line. Changing "2 crates" to "3 crates" requires remove → navigate back to product → re-add. This violates heuristic #3 (User control and freedom) and is
   the #1 expected cart affordance on every e-commerce site.
                                                                                                                                                                                   
  Fix: add − / + steppers (or an input) bound to an updateQty(id, qty) action.                                                                                                     
  
  ---                                                                                                                                                                              
  🟠 P1 — High    
                                                                                                                                                                                   
  4. Partial-failure corruption during multi-store checkout
                                                                                                                                                                                   
  AppContext.jsx:315 loops stores sequentially. If store #2's insert fails: store #1's order is already committed, the cart isn't cleared, the user sees a Thai error toast but has
   no idea which store succeeded. Next click → store #1 gets ordered again.
                                                                                                                                                                                   
  Fix: either (a) batch all inserts and roll back on failure, or (b) remove successfully-ordered items from cart as you go so a retry won't duplicate.                             
  
  5. No checkout review step                                                                                                                                                       
                  
  Tapping "สั่งซื้อ" commits an order immediately — no shipping address collected, no payment method, no confirmation dialog, no summary screen. Heuristic #5 (Error prevention) and   
  #10 (Help/docs) both violated.
                                                                                                                                                                                   
  Fix (minimum): a confirm dialog ("สั่งซื้อ X รายการ รวม ฿Y ?") before firing placeOrder. Long-term: a proper checkout page between cart and order creation.                          
  
  6. Hardcoded Thai strings break i18n promise                                                                                                                                     
                  
  Toast messages in AppContext.jsx:224,312,341,377 are Thai-only. EN/CN users see "สั่งซื้อสำเร็จ!" after checkout. CLAUDE.md already notes this — flagging because Cart is where 3 of  
  the 4 fire.     
                                                                                                                                                                                   
  7. Missing shipping/pickup context

  cart.pickup pill at Cart.jsx:51 says "รับที่ร้าน" with no address, hours, or distance. User can't decide if pickup is feasible without leaving the cart. Violates heuristic #6       
  (Recognition not recall).
                                                                                                                                                                                   
  Fix: show store address + hours in the group header (data already exists on store).                                                                                              
  
  8. React key uses array index                                                                                                                                                    
                  
  Cart.jsx:58 — key={i}. Combined with animate-fade-in, removal re-uses DOM nodes incorrectly (wrong item visually fades). Tied to fix in P0 #1.                                   
  
  ---                                                                                                                                                                              
  🟡 P2 — Medium  
                                                                                                                                                                                   
  9. Redundant "Cart (N)" heading
                                                                                                                                                                                   
  Shown at Cart.jsx:43 and again at Cart.jsx:91. The second one duplicates info 200px above it — violates heuristic #8 (Aesthetic/minimalist). Replace line 91 with a simpler      
  "สรุปคำสั่งซื้อ" / t('cart.summary').
                                                                                                                                                                                   
  10. Empty cart is a dead end                                                                                                                                                     
  
  Cart.jsx:30–38 shows an icon + message but no CTA. Add a "เลือกซื้อผลไม้" button that navigates to home.                                                                             
                  
  11. Not-logged-in CTA is LINE-only                                                                                                                                               
                  
  Cart.jsx:23 only offers the LINE login button, but the real LoginModal supports email/password + signup. Users without LINE hit a wall.                                          
                  
  Fix: use the same generic login button as the header so LoginModal opens with all methods.                                                                                       
                  
  12. Remove button a11y                                                                                                                                                           
                  
  Cart.jsx:78–84 has title only. Screen readers vary on whether they announce title reliably.                                                                                      
  
  Fix: add aria-label={t('cart.remove')}. Keep title for mouse users.                                                                                                              
                  
  13. Meaningful emoji without a11y                                                                                                                                                
                  
  🔒 🛒 🍎 on lines 20, 33, 63 are decorative-looking but carry meaning. Wrap with <span role="img" aria-label="..."> or replace with lucide icons (already imported elsewhere).   
  
  ---                                                                                                                                                                              
  🟢 P3 — Low     
             
  - cart.subtotal translation key exists but isn't used — per-store rows in the summary (Cart.jsx:96–101) use the store name as the label, which is clear but loses the "subtotal"
  semantic.                                                                                                                                                                        
  - No undo affordance after remove (toast could include "เลิกทำ").
  - Inline styles for spacing (marginBottom: 24, fontSize: 18) should use the same tokens as the rest of index.css.                                                                
  - Grand total at Cart.jsx:15 is recomputed on every render; fine at cart sizes but move to useMemo if cart grows.                                                                
  - No <h1> on the page — section-title is <h2>. Consider promoting or adding a page-level heading for landmark navigation.                                                        
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  Flow diagram (current vs. recommended)                                                                                                                                           
                                                                                                                                                                                   
  Current:   [Cart] ──click Checkout──► Orders created + cart cleared + toast
                                        (no review, no address, no confirm)                                                                                                        
                  
  Recommend: [Cart] ──Checkout──► [Review: addr, items, total] ──Confirm──► [Success page with order #]                                                                            
                                                                └─Cancel──► back to Cart
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  Prioritized fix list (copy-paste for a ticket)
                                                                                                                                                                                   
  1. P0 Fix removeFromCart id-based deletion (Cart.jsx:80 + AppContext.jsx:228)
  2. P0 Disable checkout button during async placeOrder                                                                                                                            
  3. P0 Add quantity steppers to cart rows
  4. P1 Confirm dialog before placeOrder; handle partial-failure rollback                                                                                                          
  5. P1 Translate AppContext toast strings via t()                                                                                                                                 
  6. P1 Show pickup address in store group header                                                                                                                                  
  7. P2 Dedupe cart heading; add empty-state CTA; broaden not-logged-in CTA                                                                                                        
  8. P2 a11y: aria-label on remove; role="img" on decorative emoji     

### 2.4 Store Detail — `src/pages/StoreDetail.jsx`
**Command:** `/prototyping-testing:evaluate`

Heuristic Evaluation — src/pages/StoreDetail.jsx                                                                                                                                 
                                                                                                                                                                                   
  Scope                                                                                                                                                                            
                                                                                                                                                                                   
  Single-screen evaluation of the Store Detail page (state store_detail). Entry: Home → store card. Exit: "กลับไปหน้าหลัก" button or any product click (→ ProductDetail).             
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  1. Nielsen heuristics                                                                                                                                                            
                                                                                                                                                                                   
  ┌─────┬───────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐   
  │  #  │       Heuristic       │                                                                   Finding                                                                    │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ H1  │ Visibility of system  │ No loading skeleton. While AppContext is loading products, storeProducts is [] and the "ร้านนี้กำลังเตรียมผลผลิต" empty state renders prematurely, │
  │     │ status                │  falsely telling the user the store has no stock. No breadcrumb or page title — user has no system-level orientation beyond the store name.  │
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │     │ Match between system  │ Content vocabulary is fine (ดูแลโดย, จุดรับสินค้า, เข้าร่วมปี). BUT every user-facing string is hardcoded Thai (L7, L18, L28, L39–51, L58, L64–65,   │
  │ H2  │ and the real world    │ L74, L85, L94). EN/CN users see a page that doesn't match their mental model or language — this is a project-level promise broken on this    │   
  │     │                       │ screen.                                                                                                                                      │
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │     │ User control &        │ onBack={handleNavigateHome} (App.jsx:94) always returns the user to Home, even if they arrived from product_detail via pd-store-link. User   │
  │ H3  │ freedom               │ loses their place. No browser-back support (no URL changes). "กลับไปหน้าหลัก" label lies — it says "back to home" but conceptually should be    │
  │     │                       │ "back."                                                                                                                                      │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │     │ Consistency &         │ p.name/p.description/store.name render raw DB fields — the rest of the app uses locField(obj, 'field'). Inconsistent with                    │   
  │ H4  │ standards             │ Home/ProductDetail. Back button uses btn-secondary with inline overrides (L16) instead of the app's established pattern. Section heading is  │
  │     │                       │ a <div class="section-title"> (L57) rather than <h2> — inconsistent with semantic use elsewhere.                                             │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ H5  │ Error prevention      │ Low-risk screen. Minor: Math.min(...p.units.map(u => u.price)) (L70) returns Infinity if p.units is empty/undefined — will render ฿Infinity. │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ H6  │ Recognition vs.       │ No cover image, no category badges on product cards within the store (users who landed via a category filter lose that context). No          │
  │     │ recall                │ breadcrumb "Home › Store name."                                                                                                              │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ H7  │ Flexibility &         │ No sort (price asc/desc, newest, featured first), no in-store search, no category filter within the store. Phone number is plain text (L43)  │   
  │     │ efficiency            │ — no tel: link, a miss on mobile. No "contact seller" or "save store" affordance.                                                            │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ H8  │ Aesthetic &           │ Info block is dense and mixes metrics (rating, review count, phone, address, pickup, join year) with equal visual weight. Rating "4.8        │   
  │     │ minimalist design     │ (จากลูกค้ารีวิว 1200+)" deserves prominence; join year doesn't.                                                                                  │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ H9  │ Help users recover    │ if (!store) return <div className="empty">ไม่พบข้อมูลร้านค้า</div> (L7) — no back button, no CTA, no translation, no action. Dead end.            │   
  │     │ from errors           │                                                                                                                                              │   
  ├─────┼───────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ H10 │ Help & documentation  │ N/A.                                                                                                                                         │   
  └─────┴───────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ---
  2. Flow analysis
                  
  Happy path: Home → click store → view info → click product → ProductDetail. Works.
                                                                                                                                                                                   
  Broken/weak paths:
  - "ใส่ตะกร้า" button is a lie (L87–95). It says Add to cart (shopping-cart icon + "ใส่ตะกร้า") but actually calls onProductClick — opens the ProductDetail page. Core e-commerce     
  expectation violated. Every other "ใส่ตะกร้า" in the app (e.g. Cart, ProductDetail) adds to cart.                                                                                  
  - Back button always → Home. User coming from product_detail → pd-store-link → StoreDetail → Back expects to return to the product, not jump two levels up.
  - No deep link. URL never changes. Reload resets to home. Cannot share a store URL, cannot bookmark, breaks SEO.                                                                 
  - Product click = whole card AND button. Both onClick on card (L72) and on button (L89) route to the same handler — the button's stopPropagation is pointless duplication, and   
  there's still no way to quick-add without leaving the page.                                                                                                                      
                                                                                                                                                                                   
  ---                                                                                                                                                                              
  3. Accessibility                                                                                                                                                                 
                  
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────┐ 
  │                                              Issue                                              │                                  Impact                                  │ 
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤ 
  │ Clickable <div class="product-card"> (L72) — not focusable, not announced as a button, no role, │ Keyboard & screen-reader users cannot open products.                     │ 
  │  no keyboard handler.                                                                           │                                                                          │ 
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Decorative icons (Star, Phone, MapPin, StoreIcon, ShoppingCart, ArrowLeft) have no              │ Screen readers announce them as "img" / unlabeled graphics, adding       │   
  │ aria-hidden="true".                                                                             │ noise.                                                                   │   
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Store rating rendered as bare number "4.8" (L39).                                               │ Screen readers say "4.8" with no "rating" context until the surrounding  │
  │                                                                                                 │ Thai text is read.                                                       │   
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ Emoji avatar store.avatar (L23) rendered into a plain <div>, no aria-label / role="img".        │ Lost to AT.                                                              │   
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Section title "สินค้าทั้งหมดจาก …" (L57) is a <div>, not <h2>.                                      │ Breaks heading outline — h1 → h3 skip.                                   │
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ !store fallback (L7) uses <div> with no role="alert", no recovery action.                       │ Users stuck; AT doesn't announce the state change.                       │
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ --text-secondary at 13px on cards (L64 body, L31 description) — contrast not verified against   │ Likely borderline; should be audited.                                    │
  │ WCAG AA (4.5:1).                                                                                │                                                                          │   
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ Empty-state emojis 🍎/🌱/⭐ used as content without aria-hidden.                                │ Noise for screen readers.                                                │   
  ├─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ No focus management when the page mounts — focus remains wherever the user clicked, usually     │ Keyboard users lose their place.                                         │
  │ scrolled off-screen.                                                                            │                                                                          │   
  └─────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘
                                                                                                                                                                                   
  ---             
  4. Severity & priority (Nielsen 0–4)
                                      
  ┌─────┬─────────────────────────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┐
  │  #  │                                     Finding                                     │            Severity             │ Effort │                                             
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  │ F1  │ "ใส่ตะกร้า" button opens ProductDetail instead of adding to cart                  │ 4 — Catastrophe                 │ S      │                                             
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  │ F2  │ Hardcoded Thai — no t() or locField() (breaks i18n site-wide promise)           │ 4 — Catastrophe for EN/CN users │ M      │                                             
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F3  │ Clickable <div> product cards, no keyboard support, decorative icons not hidden │ 3 — Major                       │ S      │                                             
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F4  │ Empty state flashes before products finish loading (no loading skeleton)        │ 3 — Major                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F5  │ Back button always goes home regardless of origin                               │ 3 — Major                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F6  │ No URL / deep link — reload loses state, cannot share                           │ 3 — Major                       │ L      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F7  │ !store dead-end fallback (no action, no translation)                            │ 3 — Major                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F8  │ Section title is <div> not <h2>; heading hierarchy broken                       │ 2 — Minor                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F9  │ Math.min(...units) = Infinity when units array is empty                         │ 2 — Minor                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F10 │ Phone is plain text, no tel: link                                               │ 2 — Minor                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤                                             
  │ F9  │ Math.min(...units) = Infinity when units array is empty                         │ 2 — Minor                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  │ F10 │ Phone is plain text, no tel: link                                               │ 2 — Minor                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  │ F10 │ Phone is plain text, no tel: link                                               │ 2 — Minor                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  │ F11 │ No in-store sort / filter / search                                              │ 2 — Minor                       │ M      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  │ F12 │ Rating lacks accessible label ("rating: 4.8")                                   │ 2 — Minor                       │ S      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┤
  │ F13 │ Inline styles (L16, L31, L57, L62) should live in CSS                           │ 1 — Cosmetic                    │ S      │
  └─────┴─────────────────────────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┘

  ---
  5. Recommended fixes (prioritized)

  Ship first (P0):
  1. Fix the add-to-cart lie. Either (a) make btn-add actually add the default (first/cheapest) unit via addToCart(p, p.units[0], 1) and fire a toast, or (b) relabel it to
  t('viewProduct') / "ดูสินค้า" with an eye icon. Option (a) matches user expectations; option (b) is the minimal fix.
  2. Route every string through t() and every DB field through locField(). Mirror the pattern already used in ProductDetail.jsx. Add keys: backToHome, caredBy, rating, reviews,
  contact, farmLocation, pickupPoint, joinedYear, allProductsFrom, storeNotFound, storePreparingHarvest, nextSeasonNotice, recommended, startingFrom.

  Ship next (P1):
  3. Loading state. Read loading from AppContext (or derive from products.length === 0 && !loaded) and render skeleton cards instead of the empty state until data lands.
  4. Smarter back. Use previousPage from App so onBack returns to the actual previous page (the same ref already exists — just pass it through).
  5. Keyboard-accessible cards. Convert .product-card to a <button> or <a> semantically, or add role="button" tabIndex={0} + onKeyDown (Enter/Space). Mark decorative lucide icons
  with aria-hidden="true". This pattern fix should be done app-wide, not just here.
  6. Fix the !store dead-end. Translate the message, render a back button, make the card look like the empty state on L62–66 (same visual treatment, consistent recovery).

  Ship eventually (P2):
  7. Promote section title to <h2>; add aria-labels for rating + avatar (role="img" with aria-label={${store.name} avatar}).
  8. Math.min guard: p.units?.length ? Math.min(...) : 0.
  9. <a href={tel:${store.phone}}> for phone.
  10. Add URL routing (react-router-dom is already installed) so /stores/:id deep-links work.
  11. Add sort control (price ↑/↓, featured first) above the grid once ≥6 products.
  12. Move inline styles into .store-detail-* classes.

### 2.5 Login — `src/components/LoginModal.jsx`
**Command:** `/prototyping-testing:evaluate`
**Context:** dual-role signup (buyer/seller toggle), LINE OAuth, test-login shortcut.

Heuristic Evaluation — src/components/LoginModal.jsx                                                                                                                             
                                                                                                                                                                                   
  1. Scope                                                                                                                                                                         
                                                                                                                                                                                   
  Single component: the auth modal shown for both login and signup (mode toggle), including the test-login shortcut. Assumes the modal is opened from Header.jsx and dispatches to 
  login() / signup() in AppContext.                                                                                                                                                
                                                                                                                                                                                   
  2. Findings by Heuristic

  H1 — Visibility of system status

  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐  
  │  #  │                                                                          Finding                                                                           │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 1.1 │ Loading state collapses the whole label to just "..." (line 135). Users can't tell whether the system is thinking, failing, or hung.                       │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 1.2 │ Failure path is silent: success = await login(...) returning false simply leaves the modal open with no message (lines 22–27). User has no idea whether    │ P0       │  
  │     │ password was wrong, email unconfirmed, or the network failed. Toast is raised in AppContext but it's covered/obscured by the modal overlay.                │          │  
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 1.3 │ No aria-busy / live region while submitting — screen readers announce nothing during the wait.                                                             │ P1       │  
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘  
  
  H2 — Match between system & real world                                                                                                                                           
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐
  │  #  │                                                                          Finding                                                                           │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 2.1 │ Submit button pairs MessageCircle (a chat bubble icon, line 133) with text like "เข้าสู่ระบบ". Visually reads as "chat", not "log in". The btn-line class     │ P1       │
  │     │ name suggests the button was originally intended for LINE OAuth and is now overloaded for email submit.                                                    │          │  
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 2.2 │ Emoji-only logo 🛒 (line 46) renders inconsistently across platforms/fonts and doesn't identify the product ("ThaiFruit").                                 │ P3       │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘  
                  
  H3 — User control & freedom                                                                                                                                                      
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────┬──────────┐                                                                          
  │  #  │                                      Finding                                       │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────┼──────────┤                                                                          
  │ 3.1 │ No Escape key handler. Keyboard users can only dismiss by tabbing to the × button. │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 3.2 │ No focus trap — Tab escapes into the page behind the overlay.                      │ P1       │                                                                          
  ├─────┼────────────────────────────────────────────────────────────────────────────────────┼──────────┤                                                                          
  │ 3.3 │ No "Forgot password?" affordance anywhere in login mode.                           │ P1       │                                                                          
  └─────┴────────────────────────────────────────────────────────────────────────────────────┴──────────┘                                                                          
                  
  H4 — Consistency & standards                                                                                                                                                     
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐
  │  #  │                                                                          Finding                                                                           │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 4.1 │ Inline styles dominate (lines 50–165), while the rest of the codebase uses src/index.css classes (per CLAUDE.md convention). Styling drift — role buttons  │ P2       │
  │     │ and input wrappers should use .modal-* / new .login-* classes.                                                                                             │          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 4.2 │ btn-line class applied to a plain email submit breaks the class's semantic meaning (LINE). Future dev will be confused.                                    │ P2       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 4.3 │ Role toggle buttons (lines 65–90) duplicate 23 lines of near-identical inline styling — they'd be a natural <SegmentedControl> or radio-group component.   │ P2       │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘  
                  
  H5 — Error prevention                                                                                                                                                            
                  
  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐
  │  #  │                                                               Finding                                                                │ Severity │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 5.1 │ Password minLength={6} (line 115) is below current guidance (NIST recommends 8+). Browser-level only; no visible hint before submit. │ P2       │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 5.2 │ Signup has no confirm-password field — typos become account-lockouts the user can't self-recover (no reset flow exists).             │ P1       │                        
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤                        
  │ 5.3 │ No Caps Lock warning on the password field.                                                                                          │ P3       │                        
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤                        
  │ 5.4 │ No explanation of what "ผู้ซื้อ / ผู้ขาย" actually unlocks. Users may pick the wrong role and get stuck.                                   │ P1       │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘                        
                  
  H6 — Recognition rather than recall                                                                                                                                              
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐  
  │  #  │                                                                          Finding                                                                           │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 6.1 │ Placeholders used in place of labels (lines 57, 99, 111). When a user types, the prompt vanishes — classic recall-over-recognition failure and a WCAG      │ P1       │
  │     │ violation (see accessibility).                                                                                                                             │          │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘  
  
  H7 — Flexibility & efficiency of use                                                                                                                                             
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐  
  │  #  │                                                                          Finding                                                                           │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 7.1 │ No autoFocus on the first field — every user has to click/tab before typing.                                                                               │ P2       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 7.2 │ Test-login shortcut (line 154) is great; but it's visually equal-weight to the primary submit, which can tempt real users to tap it. Consider a subtler    │ P2       │  
  │     │ "dev-only" treatment or hiding in production builds.                                                                                                       │          │  
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 7.3 │ No LINE OAuth button despite LINE being listed as a supported auth method in backend (CLAUDE.md). The icon is here; the button is not.                     │ P2       │  
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘  
  
  H8 — Aesthetic & minimalist design                                                                                                                                               
                  
  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐            
  │  #  │                                                                     Finding                                                                      │ Severity │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 8.1 │ Role toggle has heavy visual weight (emoji + bold + colored border) before users even know what the choice means. Decision comes before context. │ P2       │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘
                                                                                                                                                                                   
  H9 — Help users recognize, diagnose, recover from errors
                                                                                                                                                                                   
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐
  │  #  │                                                                          Finding                                                                           │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 9.1 │ No inline error display anywhere in the modal. All failure modes (wrong password, email not confirmed, rate-limited, network) resolve to a silent          │ P0       │
  │     │ stay-open. This is the single biggest UX blocker.                                                                                                          │          │  
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 9.2 │ No password-reset pathway to recover.                                                                                                                      │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤  
  │ 9.3 │ No handling for "email already registered" on signup — user can't tell whether to switch to login mode.                                                    │ P1       │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘  
                  
  H10 — Help & documentation                                                                                                                                                       
                  
  ┌──────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┐   
  │  #   │                                                                         Finding                                                                          │ Severity │
  ├──────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 10.1 │ No link to Terms / Privacy at signup. Legal risk plus user trust issue.                                                                                  │ P1       │
  ├──────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┤
  │ 10.2 │ login.note footer exists but its content isn't surfaced in this file for review. Verify it explains what happens next (email verification? auto-login?). │ P2       │   
  └──────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┘   
                                                                                                                                                                                   
  3. Flow Analysis                                                                                                                                                                 
                  
  [Header "Login"] ──▶ Modal opens (login mode)
                           │                                                                                                                                                       
                           ├─ submit ──▶ login() ──┬─ success ──▶ close modal ✓
                           │                        └─ fail ──▶ [silent — P0]                                                                                                      
                           │                                                                                                                                                       
                           ├─ "switch to signup" ──▶ mode=signup                                                                                                                   
                           │                         │                                                                                                                             
                           │                         ├─ pick role (no description — P1)
                           │                         ├─ submit ──▶ signup() ──┬─ success ──▶ close ✓                                                                               
                           │                         │                         └─ fail (email taken?) ──▶ silent                                                                   
                           │                         │                                                                                                                             
                           │                         └─ [no confirm password — P1]                                                                                                 
                           │                                                                                                                                                       
                           ├─ "test login" ──▶ fixed creds
                           │                                                                                                                                                       
                           └─ "forgot password?" ──▶ ✗ missing — P1
                                                                                                                                                                                   
  Dead ends: failed login, failed signup, forgotten password, account-exists-on-signup. All four drop users into a state with no recovery UI.                                      
                                                                                                                                                                                   
  4. Accessibility Issues (WCAG 2.1 AA)                                                                                                                                            
                  
  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────┬──────────┐   
  │  #  │                                                                 Issue                                                                  │    Criterion     │ Severity │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A1  │ Inputs have no <label> or aria-label — only placeholder text (lines 55–62, 97–104, 109–117). Screen readers may announce generic "edit │ 1.3.1, 3.3.2,    │ P0       │
  │     │  text".                                                                                                                                │ 4.1.2            │          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤   
  │ A2  │ Modal missing role="dialog", aria-modal="true", and aria-labelledby pointing to .login-title. AT users get no indication a modal       │ 4.1.2            │ P0       │
  │     │ opened.                                                                                                                                │                  │          │   
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A3  │ No focus management: first field isn't focused on open; focus not returned to the trigger on close.                                    │ 2.4.3            │ P1       │   
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤   
  │ A4  │ No focus trap — Tab leaks to background content.                                                                                       │ 2.4.3            │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤   
  │ A5  │ No Escape-to-close.                                                                                                                    │ 2.1.1            │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤   
  │ A4  │ No focus trap — Tab leaks to background content.                                                                                       │ 2.4.3            │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A5  │ No Escape-to-close.                                                                                                                    │ 2.1.1            │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A6  │ Icon-only buttons lack accessible names: close ✕ (line 43), show/hide password (lines 118–124). Reads as "button, button".             │ 4.1.2            │ P0       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A7  │ Role toggle is two <button>s (lines 65–90) that act as a single-select — should be a role="radiogroup" with role="radio" and           │ 1.3.1, 4.1.2     │ P1       │
  │     │ aria-checked, or real <input type="radio">s.                                                                                           │                  │          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A8  │ Loading state communicated only by text "…" with no aria-live announcement; disabled button during load has no aria-busy.              │ 4.1.3            │ P1       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A9  │ Placeholder colour uses var(--text-secondary) on input background — likely <4.5:1 contrast; verify with the token palette.             │ 1.4.3            │ P2       │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A10 │ Overlay click-to-close (line 40) depends on classList.contains('overlay') — works for mouse/touch but not keyboard; acceptable as long │ 2.1.1            │ P1       │
  │     │  as Escape also works (currently doesn't).                                                                                             │                  │          │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┼──────────┤
  │ A11 │ Submit/close buttons sit above the bottom fold on small screens with no max-height / scroll handling on .modal — verify it doesn't     │ 1.4.10           │ P2       │
  │     │ trap content off-screen in landscape mobile.                                                                                           │                  │          │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────┴──────────┘

  5. Prioritised Recommendations

  Ship first — P0

  1. Surface auth errors inside the modal. Add an error-message slot below the submit button; have login/signup return { ok, message } or read from AppContext.lastAuthError. Wire
  role="alert" so screen readers announce it.
  2. Add proper labels. Replace placeholder-only inputs with visible <label> elements (visually-hidden is fine if the icon+placeholder pattern is kept), and attach htmlFor / id
  pairs.
  3. Make the modal a real dialog. Add role="dialog", aria-modal="true", aria-labelledby="login-title", focus-trap, Escape handler, and return-focus on close. Consider switching
  to a headless dialog (e.g. Radix or a small custom hook) instead of hand-rolling.
  4. Accessible names on icon buttons. aria-label="Close" on ✕, aria-label={showPassword ? 'Hide password' : 'Show password'} on the eye toggle.

  Next — P1

  5. Replace MessageCircle icon on the email submit button with something neutral (ArrowRight) or remove it; rename btn-line → btn-primary when used for email submit and keep
  btn-line for an actual LINE button.
  6. Add a "Forgot password?" link in login mode → route to a reset-request flow (even a simple Supabase resetPasswordForEmail + success toast).
  7. Add confirm-password in signup; validate match inline before hitting the API.
  8. Explain the role choice. One-line microcopy under each role button: "ซื้อผลไม้จากร้านค้า" / "เปิดร้านค้าของคุณ". Consider hiding the role toggle behind a "Sign up as seller →"
  secondary path if buyer is the default 95% case.
  9. Convert role buttons to <input type="radio"> inside a <fieldset role="radiogroup"> with a visually-hidden legend.
  10. Autofocus first field on open; show loading as "Signing in…" plus an aria-busy button.                                                                                       
  11. Handle "email already registered" on signup with inline error + CTA to switch to login.                                                                                      
  12. Add Terms/Privacy acknowledgement on signup (checkbox or fine-print with links).                                                                                             
                                                                                                                                                                                   
  Polish — P2/P3                                                                                                                                                                   
                                                                                                                                                                                   
  13. Move inline styles into src/index.css under .login-* selectors to match project convention (CLAUDE.md §Conventions).                                                         
  14. Raise password minLength to 8; optionally add a lightweight strength hint.
  15. De-emphasise "test login" button (dashed border, smaller text, or gate behind import.meta.env.DEV) so it's obvious it's not for end users.                                   
  16. If LINE OAuth is intended, add the actual button; otherwise drop MessageCircle.                                                                                              
  17. Check colour contrast of var(--text-secondary) on input and role-button backgrounds against AA (≥4.5:1 for body text, ≥3:1 for large text/UI).    

### 2.6 Header & Navigation — `src/components/Header.jsx`
**Command:** `/prototyping-testing:evaluate`
**Focus:** mobile search (currently hidden), language switcher discoverability.

Heuristic Evaluation — src/components/Header.jsx

  1. Scope

  Component under review: Global sticky header — logo, search form, language switcher, seller/cart/login actions, user identity display.
  Flows: (a) Home navigation via logo, (b) Search submit, (c) Language switch, (d) Cart entry, (e) Login/logout, (f) Seller dashboard entry.
  Inputs: src/components/Header.jsx (1–125) + responsive CSS at index.css:1968–2021 + language menu styles index.css:2026–2070.

  ---
  2. Findings by Nielsen Heuristic

  H1 · Visibility of system status

  ┌─────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────────────────┐
  │  #  │                                                                      Finding                                                                      │ Severity │     Location      │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────┤
  │ 1.1 │ No active-page indicator. Header buttons (Seller/Cart) don't reflect which page the user is on. Users rely on page content alone to orient.       │ P1       │ Header.jsx:98–105 │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────┤
  │ 1.2 │ Cart badge only shows when cartCount > 0. Once you have items, count updates but there's no aria-live announcement.                               │ P1       │ Header.jsx:104    │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────┤
  │ 1.3 │ Scroll shadow toggle fires React state updates on every scroll pixel past 20 — unnecessary renders; also listener is not { passive: true },       │ P2       │ Header.jsx:30–36  │
  │     │ blocks scroll thread.                                                                                                                             │          │                   │
  └─────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────────────────┘

  H2 · Match between system and the real world

  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────────────────┐
  │  #  │                                                                     Finding                                                                      │ Severity │      Location      │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 2.1 │ <a href="#" onClick> for logo — hash-fragment pseudo-link. Breaks browser expectations (right-click "open in new tab" navigates to /#,           │ P1       │ Header.jsx:52–55   │
  │     │ middle-click opens blank). Should be a <button> (state routing) or a real route.                                                                 │          │                    │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 2.2 │ Logout button uses only a LogOut icon on desktop (no text label until hover/title). Destructive action should be labeled, not cryptic.           │ P1       │ Header.jsx:112–114 │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 2.3 │ User display "🧑 {firstName}" with pointerEvents: 'none' (L109) looks and reads as a button but does nothing. Mislabel of affordance.            │ P1       │ Header.jsx:108–111 │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────────────────┘

  H3 · User control and freedom

  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────────────────┐
  │  #  │                                                                     Finding                                                                      │ Severity │      Location      │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 3.1 │ Language menu has no outside-click close and no Escape handler. Opens, stays open, user must click the toggle again.                             │ P0       │ Header.jsx:71–96   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 3.2 │ Logout is a one-click destructive action. No confirmation. If the button sits next to the "cart" tap target on dense mobile layouts, mis-taps    │ P1       │ Header.jsx:112–114 │
  │     │ are likely.                                                                                                                                      │          │                    │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 3.3 │ Search handleSearchSubmit has a setTimeout(() => onSearch(searchInput), 0) double-call when navigating home (L43). Brittle side-effect pattern;  │ P1       │ Header.jsx:38–45   │
  │     │ if searchQuery already equals input, the race has no reliable ordering.                                                                          │          │                    │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────────────────┘

  H4 · Consistency and standards

  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────────────────┐
  │  #  │                                                                     Finding                                                                      │ Severity │     Location      │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────┤
  │ 4.1 │ Seller entry is shown to every user, including buyers, regardless of role. Confuses Persona 1 (buyer) and exposes a dashboard they can't use.    │ P0       │ Header.jsx:98–100 │
  │     │ Should only render for authenticated users with role === 'seller', or rename to "Become a seller" for everyone else.                             │          │                   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────┤
  │ 4.2 │ <form> handles submit via button type "submit" (good), but the button also contains an icon + text pattern that breaks .hide-mobile convention   │ P3       │ Header.jsx:64–66  │
  │     │ inconsistently vs. other header buttons.                                                                                                         │          │                   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────┤
  │ 4.3 │ Language menu toggle is a <button> that opens a popover rendered as <div>s — no ARIA relationship between trigger and menu.                      │ P1       │ Header.jsx:72–95  │
  │     │                                                                                                                                                  │ (a11y)   │                   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────────────────┤
  │ 4.4 │ useEffect syncing searchQuery → searchInput is the set-state-in-effect lint error noted in CLAUDE.md. Derived state could live in a useMemo with │ P2       │ Header.jsx:26–28  │
  │     │  a controlled parent, or key-reset, to avoid the anti-pattern.                                                                                   │          │                   │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────────────────┘

  H5 · Error prevention

  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────────────┐
  │  #  │                                                                      Finding                                                                       │ Severity │     Location     │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 5.1 │ Empty-string search submits navigate home anyway (no early return). Harmless but wasteful.                                                         │ P3       │ Header.jsx:38–45 │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 5.2 │ user.name.split(' ')[0] (L110) crashes if user.name is null/undefined. Defensively handle — signups can produce profiles with empty display names. │ P1       │ Header.jsx:110   │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────────────┘

  H6 · Recognition rather than recall

  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬─────────────────────────────┐
  │  #  │                                                                Finding                                                                 │ Severity │          Location           │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────────┤
  │ 6.1 │ Language flag emojis in the dropdown are scannable, but the toggle itself only shows the label (🇬🇧 EN) on desktop and the Globe icon   │ P1       │ Header.jsx:77–78 + CSS      │
  │     │ on mobile — on mobile users can't tell which language is currently active without opening the menu.                                    │          │ .hide-mobile                │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼─────────────────────────────┤
  │ 6.2 │ Cart icon shows item count but not total value — a small affordance to aid recall ("how much am I about to spend?").                   │ P2       │ Header.jsx:102–105          │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴─────────────────────────────┘

  H7 · Flexibility and efficiency

  ┌─────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────────────────────────┐
  │  #  │                                                                Finding                                                                │ Severity │           Location           │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────────────────┤
  │ 7.1 │ Search bar is display: none on mobile (index.css:1968–1970) with no alternative (icon trigger, drawer, full-screen search). On a      │ P0       │ CSS L1968–1970; referenced   │
  │     │ mobile-first marketplace, this strands discovery.                                                                                     │          │ by Header                    │
  ├─────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────────────────┤
  │ 7.2 │ No keyboard shortcut to focus search (/ or ⌘K) despite being the hero discovery tool.                                                 │ P3       │ —                            │
  └─────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────────────────────────┘

  H8 · Aesthetic and minimalist design

  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬────────────────────┐
  │  #  │                                                                   Finding                                                                    │ Severity │      Location      │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 8.1 │ Five top-level buttons on mobile (Globe, Seller, Cart, User, Logout) become an icon soup with no labels.                                     │ P1       │ Header.jsx:69–121  │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼────────────────────┤
  │ 8.2 │ Logged-in state renders user chip + logout as sibling buttons with a tiny gap: 4 (L108) — visually reads as one interactive unit but is two. │ P2       │ Header.jsx:107–115 │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴────────────────────┘

  H9 · Help users recognize, diagnose, recover from errors

  ┌─────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬──────────────────┐
  │  #  │                                                                      Finding                                                                       │ Severity │     Location     │
  ├─────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼──────────────────┤
  │ 9.1 │ No announcement (toast / focus move) after language switch. If a user mis-taps CN when they wanted EN, the whole page content swaps silently —     │ P2       │ Header.jsx:85–89 │
  │     │ jarring and no undo.                                                                                                                               │          │                  │
  └─────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴──────────────────┘

  H10 · Help and documentation

  No major findings at component scope.

  ---
  3. Flow Analysis

    ┌────────────────────────── HEADER ──────────────────────────┐
    │ [Logo]  [────── search form ──────]  [🌐] [Seller] [🛒] [👤]│
    └────────┬──────────────┬──────────────────┬──────┬──────┬──┘
             │              │                  │      │      │
             ▼              ▼                  │      ▼      ▼
        Home (state)   Search submit           │   Cart    Login
                       │                       │           or
                       ├─ if already on Home → onSearch only
                       └─ else → navigateHome + setTimeout(onSearch)
                          ❗ race-prone double call
                                               │
                                               ▼
                                       Lang toggle (no outside-click close,
                                                    no Escape, no aria-expanded)

    MOBILE: search form hidden entirely ❗ no alternative entry
    MOBILE: hide-mobile strips labels from every action → icon soup

  Flow issues
  - F1 (P0): No mobile search entry — primary discovery task has no mobile affordance.
  - F2 (P0): Language menu traps input focus behavior: open + click elsewhere leaves it stuck open. Keyboard users have no Escape.
  - F3 (P1): Seller button's always-on visibility confuses buyers; for sellers, it's also the only way back to the dashboard (no active state).
  - F4 (P1): Logout sits adjacent to cart with no confirmation — high mis-tap risk on mobile.
  - F5 (P1): Logo link is a fragment anchor, breaking browser navigation idioms.

  ---
  4. Accessibility Check (WCAG 2.1 AA)

  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────────┬──────────┬──────────┐
  │  #  │                                                              Issue                                                              │           WCAG           │ Severity │ Location │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A1  │ Language toggle missing aria-haspopup="menu", aria-expanded={showLangMenu}, and menu missing role="menu" + children with        │ 4.1.2                    │ P0       │ L72–96   │
  │     │ role="menuitemradio" + aria-checked.                                                                                            │                          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A2  │ Language menu: no focus management. Opening should move focus to the first menuitem, arrow keys should navigate, Escape should  │ 2.1.2, 2.4.3             │ P0       │ L80–94   │
  │     │ close and restore focus to toggle.                                                                                              │                          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A3  │ On mobile, buttons with .hide-mobile strip visible labels leaving icon-only buttons — need aria-label on each (Globe, Seller,   │ 4.1.2, 2.5.3             │ P0       │ L72–119  │
  │     │ Cart, Login, Logout). Current title attribute is not a reliable accessible name on touch devices.                               │                          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A4  │ Cart badge count is not announced on change. Wrap count in aria-live="polite" or add a visually-hidden companion like <span     │ 4.1.3                    │ P1       │ L104     │
  │     │ className="sr-only">{cartCount} items in cart</span>.                                                                           │                          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A5  │ Logo <a href="#"> + preventDefault — screen readers announce "link" but there's no real target, and the hash can focus nothing. │ 4.1.2                    │ P1       │ L52–55   │
  │     │  Prefer <button> styled as a logo.                                                                                              │                          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A6  │ No <nav aria-label="Primary"> wrapping the action buttons; no skip-to-content link. With sticky header, keyboard users          │ 1.3.1, 2.4.1             │ P0       │ L49–122  │
  │     │ re-traverse every link on every page.                                                                                           │                          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A7  │ .btn-header used for the user identity chip with pointerEvents: 'none' still registers as a focusable button to AT. Either      │ 4.1.2                    │ P1       │ L108–111 │
  │     │ render a <span role="status"> or make it a real link to a profile route.                                                        │                          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A8  │ Search input lacks a visible <label>; placeholder is not a substitute. Add a visually-hidden label.                             │ 1.3.1, 3.3.2             │ P1       │ L58–63   │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A9  │ Logout destructive control has no discoverable warning; combined with no visible text label on desktop, risks accidental        │ 3.3.4 (not 2.1 core, but │ P1       │ L112–114 │
  │     │ activation.                                                                                                                     │  best practice)          │          │          │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────┼──────────┼──────────┤
  │ A10 │ Scroll listener updates inline boxShadow (L50) — flickering box-shadow can fail reduce-motion preferences if it becomes         │ 2.3.3                    │ P3       │ L50      │
  │     │ animated later. Not currently violating, flagged for future.                                                                    │                          │          │          │
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────┴──────────┴──────────┘

  ---
  5. Severity Summary

  ┌──────────┬───────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Severity │ Count │                                                                            Must address                                                                             │
  ├──────────┼───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ P0       │ 5     │ 7.1 No mobile search · 3.1/A2 Lang menu can't be dismissed · 4.1 Seller button for buyers · A1 aria-expanded/haspopup missing · A3 icon-only buttons need labels ·  │
  │          │       │ A6 nav landmark + skip link                                                                                                                                         │
  ├──────────┼───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ P1       │ 12    │ Logo href="#" · Logout labeling/confirm · User chip fake-button · Active-page state · user.name null guard · Search double-call hack · Menu fm/keyboard semantics · │
  │          │       │  Cart badge a11y · Search input label · Mobile label soup · No aria-expanded/role="menu" · Mobile current-lang display                                              │
  ├──────────┼───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ P2       │ 5     │ Scroll passive/throttle · Lang switch announcement · Cart total cue · useEffect sync anti-pattern · Logged-in chip visual grouping                                  │
  ├──────────┼───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ P3       │ 3     │ Empty-search no-op · Keyboard shortcut · Icon-button variant consistency                                                                                            │
  └──────────┴───────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ---
  6. Prioritized Recommendations

  🔴 P0 — Ship before next review

  1. Mobile search affordance. Minimum-viable: render a <button className="search-icon"> on mobile that expands into a full-width search drawer. The form stays keyboard-first.
  2. Dismissable language menu. Add a useEffect that binds click and keydown (Escape) to document while showLangMenu === true:
  useEffect(() => {
    if (!showLangMenu) return;
    const close = () => setShowLangMenu(false);
    const onKey = e => e.key === 'Escape' && close();
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [showLangMenu]);
  2. Stop propagation from the menu itself so clicks inside don't close it prematurely.
  3. Gate the Seller button by role. Render only when user?.role === 'seller'. For unauthenticated/buyer users, replace with a subtle "Sell on ThaiFruit" link in the footer or a separate
  onboarding entry.
  4. A11y baseline on the language menu:
    - Toggle: aria-haspopup="menu", aria-expanded={showLangMenu}, aria-controls="lang-menu".
    - Menu: role="menu" with id="lang-menu" and children as role="menuitemradio" aria-checked={lang === l.code}.
    - Move focus to active menuitemradio on open; return focus to toggle on close.
  5. Accessible names for all header icon buttons: aria-label={t('nav.seller')} etc., independent of .hide-mobile text. The visible text can still hide on mobile; the accessible name must
  not.
  6. Landmarks: wrap action cluster in <nav aria-label="Primary">, add a <a href="#main-content" className="skip-link"> skip link (style it to appear on focus).

  🟠 P1 — Next sprint

  7. Active page state: aria-current="page" on the active top-level button (Cart / Seller) — paired with a visual underline.
  8. Logo: replace <a href="#"> with <button type="button" className="logo">, keeping the same appearance. Preserves right-click/middle-click sanity.
    - Menu: role="menu" with id="lang-menu" and children as role="menuitemradio" aria-checked={lang === l.code}.
    - Move focus to active menuitemradio on open; return focus to toggle on close.
  5. Accessible names for all header icon buttons: aria-label={t('nav.seller')} etc., independent of .hide-mobile text. The visible text can still hide on mobile; the accessible name must
  not.
  6. Landmarks: wrap action cluster in <nav aria-label="Primary">, add a <a href="#main-content" className="skip-link"> skip link (style it to appear on focus).

  🟠 P1 — Next sprint

  7. Active page state: aria-current="page" on the active top-level button (Cart / Seller) — paired with a visual underline.
  8. Logo: replace <a href="#"> with <button type="button" className="logo">, keeping the same appearance. Preserves right-click/middle-click sanity.
  5. Accessible names for all header icon buttons: aria-label={t('nav.seller')} etc., independent of .hide-mobile text. The visible text can still hide on mobile; the accessible name must
  not.
  6. Landmarks: wrap action cluster in <nav aria-label="Primary">, add a <a href="#main-content" className="skip-link"> skip link (style it to appear on focus).

  🟠 P1 — Next sprint

  7. Active page state: aria-current="page" on the active top-level button (Cart / Seller) — paired with a visual underline.
  8. Logo: replace <a href="#"> with <button type="button" className="logo">, keeping the same appearance. Preserves right-click/middle-click sanity.
  9. Logout: add a labeled destructive confirm (inline popover or toast-with-undo). At minimum, show "Log out" text next to the icon on desktop and aria-label on mobile.
  not.
  6. Landmarks: wrap action cluster in <nav aria-label="Primary">, add a <a href="#main-content" className="skip-link"> skip link (style it to appear on focus).

  🟠 P1 — Next sprint

  7. Active page state: aria-current="page" on the active top-level button (Cart / Seller) — paired with a visual underline.
  8. Logo: replace <a href="#"> with <button type="button" className="logo">, keeping the same appearance. Preserves right-click/middle-click sanity.
  9. Logout: add a labeled destructive confirm (inline popover or toast-with-undo). At minimum, show "Log out" text next to the icon on desktop and aria-label on mobile.
  10. Remove the pointerEvents: 'none' user chip. Render it as a <span> with a proper role, or promote it to a real profile link.
  7. Active page state: aria-current="page" on the active top-level button (Cart / Seller) — paired with a visual underline.
  8. Logo: replace <a href="#"> with <button type="button" className="logo">, keeping the same appearance. Preserves right-click/middle-click sanity.
  9. Logout: add a labeled destructive confirm (inline popover or toast-with-undo). At minimum, show "Log out" text next to the icon on desktop and aria-label on mobile.
  10. Remove the pointerEvents: 'none' user chip. Render it as a <span> with a proper role, or promote it to a real profile link.
  9. Logout: add a labeled destructive confirm (inline popover or toast-with-undo). At minimum, show "Log out" text next to the icon on desktop and aria-label on mobile.
  10. Remove the pointerEvents: 'none' user chip. Render it as a <span> with a proper role, or promote it to a real profile link.
  10. Remove the pointerEvents: 'none' user chip. Render it as a <span> with a proper role, or promote it to a real profile link.
  11. Simplify handleSearchSubmit: just call onSearch(searchInput); onNavigateHome(); — let the parent resolve which order makes sense. No setTimeout.
  12. Guard user.name: user.name?.split(' ')[0] || t('nav.account').
  13. Visually-hidden <label> for the search input, linked via htmlFor.
  14. Cart count a11y: add <span className="sr-only">{t('nav.cartCount', { n: cartCount })}</span> adjacent to the visible badge.
  15. Mobile current-language hint: show the 2-letter code next to the Globe icon even when .hide-mobile hides the full label (🌐 EN).

  🟡 P2 — Polish

  16. Passive scroll listener: window.addEventListener('scroll', handler, { passive: true }); also coarse-grain the state (if (next !== scrolled) setScrolled(next)) to avoid render spam.
  17. After language switch, fire a toast ("Language changed to English") to acknowledge and provide an undo path.
  18. Cart chip could expose subtotal on hover (tooltip/dropdown).
  19. Replace the useEffect(set searchInput from prop) pattern with key based remount, or lift the input state fully to the parent.
  20. Visually separate the logged-in chip from the logout button (more gap or a subtle divider).

  11. Simplify handleSearchSubmit: just call onSearch(searchInput); onNavigateHome(); — let the parent resolve which order makes sense. No setTimeout.
  12. Guard user.name: user.name?.split(' ')[0] || t('nav.account').
  13. Visually-hidden <label> for the search input, linked via htmlFor.
  14. Cart count a11y: add <span className="sr-only">{t('nav.cartCount', { n: cartCount })}</span> adjacent to the visible badge.
  15. Mobile current-language hint: show the 2-letter code next to the Globe icon even when .hide-mobile hides the full label (🌐 EN).

  🟡 P2 — Polish

  16. Passive scroll listener: window.addEventListener('scroll', handler, { passive: true }); also coarse-grain the state (if (next !== scrolled) setScrolled(next)) to avoid render spam.
  17. After language switch, fire a toast ("Language changed to English") to acknowledge and provide an undo path.
  18. Cart chip could expose subtotal on hover (tooltip/dropdown).
  19. Replace the useEffect(set searchInput from prop) pattern with key based remount, or lift the input state fully to the parent.
  20. Visually separate the logged-in chip from the logout button (more gap or a subtle divider).

  12. Guard user.name: user.name?.split(' ')[0] || t('nav.account').
  13. Visually-hidden <label> for the search input, linked via htmlFor.
  14. Cart count a11y: add <span className="sr-only">{t('nav.cartCount', { n: cartCount })}</span> adjacent to the visible badge.
  15. Mobile current-language hint: show the 2-letter code next to the Globe icon even when .hide-mobile hides the full label (🌐 EN).

  🟡 P2 — Polish

  16. Passive scroll listener: window.addEventListener('scroll', handler, { passive: true }); also coarse-grain the state (if (next !== scrolled) setScrolled(next)) to avoid render spam.
  17. After language switch, fire a toast ("Language changed to English") to acknowledge and provide an undo path.
  18. Cart chip could expose subtotal on hover (tooltip/dropdown).
  19. Replace the useEffect(set searchInput from prop) pattern with key based remount, or lift the input state fully to the parent.
  20. Visually separate the logged-in chip from the logout button (more gap or a subtle divider).

  🟡 P2 — Polish

  16. Passive scroll listener: window.addEventListener('scroll', handler, { passive: true }); also coarse-grain the state (if (next !== scrolled) setScrolled(next)) to avoid render spam.
  17. After language switch, fire a toast ("Language changed to English") to acknowledge and provide an undo path.
  18. Cart chip could expose subtotal on hover (tooltip/dropdown).
  19. Replace the useEffect(set searchInput from prop) pattern with key based remount, or lift the input state fully to the parent.
  20. Visually separate the logged-in chip from the logout button (more gap or a subtle divider).

  🟣 P3

  21. / keyboard shortcut focuses the search input (once mobile drawer exists, same shortcut opens it).
  22. Early-return on empty-string search submit.

  ---
  7. Validation next step
  🟡 P2 — Polish

  16. Passive scroll listener: window.addEventListener('scroll', handler, { passive: true }); also coarse-grain the state (if (next !== scrolled) setScrolled(next)) to avoid render spam.
  17. After language switch, fire a toast ("Language changed to English") to acknowledge and provide an undo path.
  18. Cart chip could expose subtotal on hover (tooltip/dropdown).
  19. Replace the useEffect(set searchInput from prop) pattern with key based remount, or lift the input state fully to the parent.
  20. Visually separate the logged-in chip from the logout button (more gap or a subtle divider).

  🟣 P3

  21. / keyboard shortcut focuses the search input (once mobile drawer exists, same shortcut opens it).
  22. Early-return on empty-string search submit.

  ---
  7. Validation next step
  22. Early-return on empty-string search submit.

  ---
  7. Validation next step
  7. Validation next step

  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐

  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐

  19. Replace the useEffect(set searchInput from prop) pattern with key based remount, or lift the input state fully to the parent.
  20. Visually separate the logged-in chip from the logout button (more gap or a subtle divider).

  🟣 P3
  🟣 P3

  21. / keyboard shortcut focuses the search input (once mobile drawer exists, same shortcut opens it).
  22. Early-return on empty-string search submit.

  ---
  7. Validation next step

  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                 Hypothesis                                 │                                                   Test                                                   │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ No mobile search is a measurable discovery blocker, not just a theoretical │ 5 users, mobile Safari, task: "Find monthong durian under ฿500." Time to first result + success rate.    │
  │  one                                                                       │                                                                                                          │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Buyers are confused or deterred by the always-visible "Seller" button      │ 5 new-buyer users: prompt-free exploration, ask post-task "What is the Seller button?" and "Would you    │
  │                                                                            │ tap it?"                                                                                                 │
  └────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Want me to run /prototyping-testing:test-plan to script those, or should I start on the P0 bundle — language-menu a11y + outside-click + mobile search drawer fits nicely in one PR?

  16. Passive scroll listener: window.addEventListener('scroll', handler, { passive: true }); also coarse-grain the state (if (next !== scrolled) setScrolled(next)) to avoid render spam.
  17. After language switch, fire a toast ("Language changed to English") to acknowledge and provide an undo path.
  18. Cart chip could expose subtotal on hover (tooltip/dropdown).
  19. Replace the useEffect(set searchInput from prop) pattern with key based remount, or lift the input state fully to the parent.
  20. Visually separate the logged-in chip from the logout button (more gap or a subtle divider).

  🟣 P3

  21. / keyboard shortcut focuses the search input (once mobile drawer exists, same shortcut opens it).
  22. Early-return on empty-string search submit.

  ---
  7. Validation next step

  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                 Hypothesis                                 │                                                   Test                                                   │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ No mobile search is a measurable discovery blocker, not just a theoretical │ 5 users, mobile Safari, task: "Find monthong durian under ฿500." Time to first result + success rate.    │
  │  one                                                                       │                                                                                                          │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Buyers are confused or deterred by the always-visible "Seller" button      │ 5 new-buyer users: prompt-free exploration, ask post-task "What is the Seller button?" and "Would you    │
  │                                                                            │ tap it?"                                                                                                 │
  └────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Want me to run /prototyping-testing:test-plan to script those, or should I start on the P0 bundle — language-menu a11y + outside-click + mobile search drawer fits nicely in one PR?
  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                 Hypothesis                                 │                                                   Test                                                   │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ No mobile search is a measurable discovery blocker, not just a theoretical │ 5 users, mobile Safari, task: "Find monthong durian under ฿500." Time to first result + success rate.    │
  │  one                                                                       │                                                                                                          │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Buyers are confused or deterred by the always-visible "Seller" button      │ 5 new-buyer users: prompt-free exploration, ask post-task "What is the Seller button?" and "Would you    │
  │                                                                            │ tap it?"                                                                                                 │
  └────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Want me to run /prototyping-testing:test-plan to script those, or should I start on the P0 bundle — language-menu a11y + outside-click + mobile search drawer fits nicely in one PR?
  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐

  Two recommendations most worth a real-user check before investing:

  ┌────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                 Hypothesis                                 │                                                   Test                                                   │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ No mobile search is a measurable discovery blocker, not just a theoretical │ 5 users, mobile Safari, task: "Find monthong durian under ฿500." Time to first result + success rate.    │
  │  one                                                                       │                                                                                                          │
  ├────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Buyers are confused or deterred by the always-visible "Seller" button      │ 5 new-buyer users: prompt-free exploration, ask post-task "What is the Seller button?" and "Would you    │
  │                                                                            │ tap it?"                                                                                                 │
  └────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


---

## 3. Heuristic Evaluation — Seller Flows

### 3.1 Seller Dashboard — `src/pages/Seller.jsx`
**Command:** `/prototyping-testing:evaluate`
**Focus:** stats → orders → add product → store settings tabs.

Heuristic Evaluation — src/pages/Seller.jsx

  Scope: Full seller dashboard — five tabs (dashboard, orders, products, add product, settings) plus the not-logged-in state. Also covers the write paths via AppContext.addProduct
   / updateStore.

  ---
  🔴 P0 — Critical

  1. Dashboard metrics are fabricated

  Seller.jsx:81,87 hardcode trend labels: "↑ 3 ใหม่วันนี้" on the orders tile and "↑ 12% จากสัปดาห์ก่อน" on the revenue tile. These numbers are invented, shown regardless of real data,  
  and shape business decisions a seller makes. This is worse than missing data — it's untrue data in a management UI.
                                                                                                                                                                                   
  Fix: compute from myOrders (filter by date === today), or remove the trend prop entirely until you have real comparison data.                                                    
  
  2. Category dropdown can submit a value that breaks the FK                                                                                                                       
                  
  Seller.jsx:263 injects <option value="อื่นๆ">อื่นๆ</option>. DB category IDs are ASCII slugs (orange, durian…) — inserting the literal Thai string "อื่นๆ" into category_id will fail  
  the FK constraint on products.category_id → categories.id, and the user sees a Supabase error toast instead of a success.
                                                                                                                                                                                   
  Fix: remove the "อื่นๆ" option, or add a real "อื่นๆ" category row to the DB and reference its slug.

  3. Image upload is fake and non-accessible

  Seller.jsx:271–278 — clicking the upload area silently sets images to the single demo path /images/fruits-collection.png, and the UI even exposes the string "MOCK:
  the end user. Additionally:
  - The clickable area is a <div> with onClick, not a <button> or <input type="file"> — no keyboard focus, no Enter/Space, no screen-reader affordance.
  - The backend already has POST /upload/image (CLAUDE.md), so the plumbing exists but isn't wired.

  Fix: hidden <input type="file" accept="image/*" multiple> triggered by a real button, upload to /upload/image, store returned URLs.

  4. Image remove button deletes ALL images, not just the clicked one

  Seller.jsx:285: onClick={() => setNewProduct({ ...newProduct, images: [] })}. Wipes the whole array regardless of which preview's ✕ was clicked. Breaks as soon as upload supports multiple
  images (needed anyway for the hint at line 269: "อัปโหลดได้สูงสุด 5 รูป").

  Fix: images: newProduct.images.filter((_, j) => j !== i).

  5. Seller with no store → silently broken page

  If a seller signs up but no stores row exists, myStore is null. The header renders "ระบบจัดการร้านค้า — undefined" (Seller.jsx:54), all stat cards show 0, and attempting to add a product
  yields a Thai error toast from addProduct at AppContext.jsx:240. There is no UI anywhere to create a store, even though the backend has POST /stores.

  Fix: if !myStore on seller page, render an "สร้างร้านค้า" onboarding form instead of the broken dashboard.

  ---
  🟠 P1 — High

  6. Settings form uses defaultValue + getElementById → stale after save

  Seller.jsx:380–405 use defaultValue={myStore?.name} and read values with document.getElementById(...). Two problems stack:
  1. defaultValue is only consumed on mount. After updateStore succeeds, the DOM inputs still show the old text you typed; switching tabs and returning doesn't refresh them (component
  doesn't remount).
  2. Settings has no Cancel button — users who change their minds have to tab away, and there's no indication their edits are being discarded.

  Fix: convert to controlled inputs seeded from myStore via useState + useEffect dependency on myStore. Add an explicit Cancel that resets state.

  Also note: updateStore in AppContext.jsx:289 silently drops the owner field the form collects — never persisted.

  7. Orders tab has dead UI

  Seller.jsx:142–149: search input has no onChange/state, filter button has no onClick. Both decorative. A seller looking at 200 orders cannot narrow the list. Heuristic #2 violation (users
  expect what they see to work) and #7 (Flexibility).

  Fix: wire up queryState + a status filter, or hide both controls until implemented.

  8. Products tab is read-only

  Seller can view their products but not edit, delete, mark out-of-stock, or change price. Add-product is one-way. This is the single most important day-to-day seller action and it's
  missing.

  Fix: at minimum, add an edit icon per product-card that routes to a prefilled Add form.

  9. No order status actions

  Orders display status badges but the seller cannot change pending → confirmed → shipped → done. Backend has PATCH /orders/:id/status ready. Without this, the whole order lifecycle is
  orphaned.

  Fix: inline status dropdown or action buttons on each row.

  10. Tabs lack ARIA roles — screen readers get nothing

  Seller.jsx:57–73: just a row of <button>s with a visual .active class. Missing: role="tablist" / role="tab" / aria-selected / aria-controls, and tab panels don't have role="tabpanel" or
  matching aria-labelledby. Keyboard arrow navigation between tabs also not implemented.

  Fix: either add full tablist ARIA + arrow-key handling, or convert tabs to proper routes (easier long-term and unblocks deep-linking).                                                      
  
  11. Cancel on Add Product silently loses a half-filled form                                                                                                                                 
                  
  Seller.jsx:363 just does setTab('products'). If the form is dirty, no confirm. Combine with hardcoded mock image and it's easy to lose 5 minutes of work.                                   
                  
  Fix: window.confirm when any field is non-empty, and reset state on confirm.                                                                                                                
                  
  12. alert() for validation                                                                                                                                                                  
                  
  Seller.jsx:352 uses native alert() — breaks the design system, blocks the UI, is disorienting on mobile, and bypasses the toast system the rest of the app uses. Also only checks name /    
  category / first unit — extra empty unit rows pass through and get inserted with empty labels.
                                                                                                                                                                                              
  Fix: inline field errors under each input, plus showToast for form-level errors. Validate all unit rows.                                                                                    
  
  ---                                                                                                                                                                                         
  🟡 P2 — Medium  

  13. Hardcoded Thai throughout

  Every string in this file is literal Thai — none use t(). CLAUDE.md already flags this, but given how much copy lives in Seller.jsx (tabs, table headers, form labels, placeholders, status 
  map), this is the single biggest blocker to the "multilingual" product promise. Status map at Seller.jsx:36 is particularly important: sellers in EN/CN mode still see Thai status badges.
                                                                                                                                                                                              
  14. Search/search inputs missing labels                                                                                                                                                     
  
  Seller.jsx:144 has placeholder only, no <label> or aria-label. Same on mobile the placeholder disappears the moment the user types, so screen readers and cognitive-load users lose context.
                  
  15. Tables aren't responsive                                                                                                                                                                
                  
  .orders-table-wrap presumably allows horizontal scroll, but 7 columns on mobile is unusable without an alternative card layout. The note cell truncates with text-overflow: ellipsis on a   
  maxWidth: 150 — sellers can't read the buyer's note without clicking into a detail view that doesn't exist.
                                                                                                                                                                                              
  16. Form labels mix icon-inline hacks                                                                                                                                                       
  
  Seller.jsx:389,399 use inline <Phone size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> inside <label>. Works but fragile and inconsistent with the section-title icon       
  pattern. Factor into a <LabelWithIcon> helper.
                                                                                                                                                                                              
  17. Mock disclosure visible to user                                                                                                                                                         
  
  Seller.jsx:277: "MOCK: จะใช้รูปตัวอย่างรวมผลไม้" text. Ship-blocker — strip before release.                                                                                                      
                  
  18. Required-field asterisks without aria-required                                                                                                                                          
                  
  Lines 233, 253, 293 have visual * but no aria-required="true" or required attribute, so SR users and native browser validation both miss them.                                              
  
  19. Empty-state for dashboard "ออเดอร์ล่าสุด"                                                                                                                                                  
                  
  Seller.jsx:108: bare "ยังไม่มีออเดอร์ในขณะนี้". New sellers with no orders get 4 zero-value stat cards + this line. Consider a CTA like "เพิ่มสินค้าเพื่อเริ่มรับออเดอร์" linking to the add-product tab.   
                  
  ---                                                                                                                                                                                         
  🟢 P3 — Low     
             
  - Date.now() as unit.id in initial useState (Seller.jsx:19, 339) is stable enough but technically side-effecting in render and flagged by CLAUDE.md lint.
  - Emoji in tab labels (📊 📦 🍎 ➕ ⚙️ ) — screen readers announce as symbol names. Either wrap in aria-hidden and replace with lucide icons (already imported) or add aria-label on each tab.
  - No pagination / virtualization on orders table — fine for 50 orders, painful for 500.                                                                                                     
  - Many inline styles that duplicate what the stylesheet already expresses (e.g. fontWeight: 800, fontSize: 18 on Seller.jsx:106 — use .section-subtitle or similar).                        
  - myStore?.totalSales used as "รีวิว" count (Seller.jsx:99) — label calls it reviews, data is sales count. Semantic mismatch.                                                                 
  - Dashboard "5 latest orders" has no "ดูทั้งหมด" link to orders tab.                                                                                                                           
                                                                                                                                                                                              
  ---                                                                                                                                                                                         
  Flow issues                                                                                                                                                                                 
                                                                                                                                                                                              
  🟢 P3 — Low

  - Date.now() as unit.id in initial useState (Seller.jsx:19, 339) is stable enough but technically side-effecting in render and flagged by CLAUDE.md lint.
  - Emoji in tab labels (📊 📦 🍎 ➕ ⚙️ ) — screen readers announce as symbol names. Either wrap in aria-hidden and replace with lucide icons (already imported) or add aria-label on each tab.
  - No pagination / virtualization on orders table — fine for 50 orders, painful for 500.
  - Many inline styles that duplicate what the stylesheet already expresses (e.g. fontWeight: 800, fontSize: 18 on Seller.jsx:106 — use .section-subtitle or similar).
  - myStore?.totalSales used as "รีวิว" count (Seller.jsx:99) — label calls it reviews, data is sales count. Semantic mismatch.
  - Dashboard "5 latest orders" has no "ดูทั้งหมด" link to orders tab.

  ---
  Flow issues

  Observed:
    [Login] → [Seller page]
        ↓
    If no store → ["ระบบจัดการร้านค้า — undefined", all 0s, add-product fails silently]
        ↓
    If store but 0 products → [Add Product form → Cancel loses work; Save lies about upload]
        ↓
    [Products tab] → [View only — no edit, no delete, no stock state]
        ↓
    [Orders tab] → [List-only — no status change, no search, no filter, no detail]

  Recommended:
    Gate: if !myStore → onboarding flow creating the store row before tabs unlock.
    Each tab must have a closed loop (list → edit → save → back to list).
  - No pagination / virtualization on orders table — fine for 50 orders, painful for 500.
  - Many inline styles that duplicate what the stylesheet already expresses (e.g. fontWeight: 800, fontSize: 18 on Seller.jsx:106 — use .section-subtitle or similar).
  - myStore?.totalSales used as "รีวิว" count (Seller.jsx:99) — label calls it reviews, data is sales count. Semantic mismatch.
  - Dashboard "5 latest orders" has no "ดูทั้งหมด" link to orders tab.

  ---
  Flow issues

  Observed:
    [Login] → [Seller page]
        ↓
    If no store → ["ระบบจัดการร้านค้า — undefined", all 0s, add-product fails silently]
        ↓
    If store but 0 products → [Add Product form → Cancel loses work; Save lies about upload]
        ↓
    [Products tab] → [View only — no edit, no delete, no stock state]
        ↓
    [Orders tab] → [List-only — no status change, no search, no filter, no detail]

  Recommended:
    Gate: if !myStore → onboarding flow creating the store row before tabs unlock.
    Each tab must have a closed loop (list → edit → save → back to list).

  ---
  Prioritized fix list

  1. P0 Remove/replace fabricated trend metrics on dashboard
  2. P0 Fix category dropdown FK mismatch (remove "อื่นๆ" literal)
  3. P0 Wire real image upload to /upload/image; remove MOCK disclosure; make upload element keyboard-accessible
  4. P0 Fix image-preview remove (remove single index, not all)


  ---
  Prioritized fix list

  1. P0 Remove/replace fabricated trend metrics on dashboard
  2. P0 Fix category dropdown FK mismatch (remove "อื่นๆ" literal)
  3. P0 Wire real image upload to /upload/image; remove MOCK disclosure; make upload element keyboard-accessible
  4. P0 Fix image-preview remove (remove single index, not all)
  5. P0 Add "create store" onboarding for sellers with no store
  6. P1 Convert settings form to controlled inputs; add Cancel; pass owner through updateStore
  7. P1 Wire orders search + status filter, or hide until ready
  8. P1 Add edit/delete on products tab
  9. P1 Add status-change action on orders tab (backend ready)
  10. P1 Add proper tablist ARIA or move tabs to routes
  11. P1 Replace alert() with inline + toast errors; validate all unit rows
  12. P2 Route all copy through t(); localize status map
  13. P2 Mobile card layout for orders table
  14. P2 aria-label/<label> on search input; aria-required on * fields

  Given the volume of P0/P1 work, consider splitting into two PRs: (a) correctness & data integrity (#1-5, #11), (b) feature completeness (#7-9) so reviewers aren't drowning. Suggest
  /test-plan once P0/P1 land — the store-onboarding and product-edit flows are the ones worth observing with a real farmer in the loop.
    [Products tab] → [View only — no edit, no delete, no stock state]
        ↓
    [Orders tab] → [List-only — no status change, no search, no filter, no detail]

  Recommended:
    Gate: if !myStore → onboarding flow creating the store row before tabs unlock.
    Each tab must have a closed loop (list → edit → save → back to list).

  ---
    Each tab must have a closed loop (list → edit → save → back to list).

  ---
  Prioritized fix list

  1. P0 Remove/replace fabricated trend metrics on dashboard
  2. P0 Fix category dropdown FK mismatch (remove "อื่นๆ" literal)
  3. P0 Wire real image upload to /upload/image; remove MOCK disclosure; make upload element keyboard-accessible
  4. P0 Fix image-preview remove (remove single index, not all)
  5. P0 Add "create store" onboarding for sellers with no store
  6. P1 Convert settings form to controlled inputs; add Cancel; pass owner through updateStore
  7. P1 Wire orders search + status filter, or hide until ready
  8. P1 Add edit/delete on products tab
  9. P1 Add status-change action on orders tab (backend ready)
  10. P1 Add proper tablist ARIA or move tabs to routes
  11. P1 Replace alert() with inline + toast errors; validate all unit rows
  12. P2 Route all copy through t(); localize status map
  13. P2 Mobile card layout for orders table
  14. P2 aria-label/<label> on search input; aria-required on * fields

---

## 4. Design System Audit

**Command:** `/design-systems:audit-system`

Expected checks:
- Token coverage — every color/spacing/radius used maps to a CSS variable
- Component reuse — `.btn-primary` / `.btn-secondary` used consistently across pages
- Typography scale — no size outside the documented 38/28/22/17/15/14/13/12/11 scale
- Naming — page prefixes (`.pd-*`, `.cart-*`) applied correctly

### Findings

_(to fill in)_

---

## 5. UI Design Review

**Command:** `/ui-design:*` (use relevant sub-skills: layout-grids, color-systems, typography, responsive)

Check against `.impeccable.md` principles:
1. Product first, chrome second — are fruit photos getting the real estate?
2. Calm hierarchy — one loud thing per screen?
3. Warm neutrals — any pure gray leaking in?
4. Generous rhythm — borders where whitespace would do?
5. Buyer mobile / seller desktop — layouts adapting, not amputating?

### Findings

_(to fill in)_

---

## 6. Action Plan

After sections 1–5 are populated, distill into a prioritized backlog.

| # | Severity | Screen / Area | Issue | Proposed fix | Owner | Status |
|---|---|---|---|---|---|---|
|   |   |   |   |   |   |   |

---

## 7. Post-review deliverables

- [ ] Update `.impeccable.md` with anything learned (new anti-patterns, new token needs)
- [ ] File issues for P0/P1 items
- [ ] Once UI is stable, scaffold `.claude/skills/thaifruit-design/` (Step 3)
