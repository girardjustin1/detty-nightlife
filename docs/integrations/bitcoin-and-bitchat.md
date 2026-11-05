# Bitcoin deposits and bitchat

Researched 2026-11-05. This is a fast-moving area, both technically and in Ghanaian regulation. Anything marked **unverified** could not be confirmed from a primary source. This is not legal advice.

## TL;DR

- **bitchat is real.** It's an open-source, public-domain messenger for iOS, macOS and Android. It sends messages over a **Bluetooth LE mesh** (up to 7 hops) when offline and over **Nostr relays** when online. It has **no accounts and no phone numbers**.
- **bitchat payments are limited.** In July 2026 the iOS repo merged "first-class **Cashu ecash token** support": it detects tokens in messages, shows the amount and mint, and redeems them **through an external wallet** or `redeem.cashu.me`. It also added a `/pay` command. **It has no embedded wallet and no Lightning** in the official app. The 2025 demo of offline ecash over Bluetooth was a demo and an Android build by Cashu's creator, not a shipped payments product.
- **A Cashu token is a bearer instrument, and "first redeemer wins".** A token received offline over the mesh is *not final* until someone swaps it at the mint online. **That makes it unsafe as a door-payment method** in a packed club with no signal.
- **Ghana regulation:**
  - The **Virtual Asset Service Providers Act, 2025 (Act 1154)** was passed in December 2025, with the Bank of Ghana and SEC as co-regulators.
  - **The licensing window is still not open.** The BoG said its application and fees pages would be live "by the end of Q3 2026", and as of today they aren't.
  - In February 2026 the BoG and SEC **ordered VASPs to stop public advertising** and said "virtual asset **advocacy** is a regulated activity".
- **Recommendation:**
  - **No Bitcoin in v1.**
  - **v2:** an opt-in, low-key "Pay deposit with Lightning" option through a **licensed or registered partner that settles to us in cedis**. Do it only after Ghana counsel confirms that merchant acceptance plus in-app promotion isn't a regulated activity for us.
  - **bitchat:** don't integrate. Solve the "no signal at the door" problem with **signed offline QR passes** instead.

---

## 1. What bitchat is in 2026

| Claim | Status | Source |
|---|---|---|
| Messenger that uses a Bluetooth mesh offline and Nostr relays online | **Real** | [bitchat README](https://github.com/permissionlesstech/bitchat): "local Bluetooth mesh networks for offline communication", "Geographic chat rooms using geohash coordinates over global Nostr relays" |
| No accounts or phone numbers, released into the public domain | **Real** | same |
| End-to-end encryption via the Noise Protocol on the mesh; a custom envelope (not NIP-17/44/59) for Nostr fallback | **Real** | same |
| Multi-hop relay, at most 7 hops | **Real** | same |
| Android app (Google Play and GitHub), with Wi-Fi Aware transport | **Real**, but Wi-Fi Aware was **disabled by default** in Android 1.7.3 (June 2026) | [bitchat-android README](https://github.com/permissionlesstech/bitchat-android), [releases](https://github.com/permissionlesstech/bitchat-android/releases), [APKMirror 1.7.3](https://www.apkmirror.com/?p=14340068) |
| Detects, renders and redeems Cashu tokens in messages, plus a `/pay` command | **Real** (iOS repo PR merged 2026-07-07). Redemption goes through an external wallet or `redeem.cashu.me`, and the app "never contacts a mint and holds no keys/wallet state" | [bitchat PR #1376](https://github.com/permissionlesstech/bitchat/issues/1376) |
| An embedded ecash wallet in bitchat | **Partly real**. A 2025 Android build by Calle (Cashu's creator) demonstrated "a native Ecash wallet" and "transferring bitcoin-backed tokens across a mesh network while offline". Whether that wallet ships in today's official Android app is **unverified**; the current README doesn't mention payments | [bitcoin++ Insider, 2025-07-18](https://insider.btcpp.dev/p/knock-knock-its-cashu-bitch), [Spark research](https://www.spark.money/research/ecash-chaumian-mints-bitcoin) |
| Lightning payments inside bitchat | **Not found.** No source shows native Lightning | READMEs above |
| A public SDK or API so a third-party app can send messages through the bitchat mesh | **Not found** (**unverified**). It's a standalone app, and the code is public domain, so we could fork it, but there's no integration API | READMEs above |

Related: in October 2026 Calle launched **BitNotes**, a multi-mint Cashu wallet that **prints ecash as physical paper notes** which can be checked offline against the mint's keys and redeemed later online. It has a Mobile Money bridge, but only for Rwandan francs. ([Crypto Briefing, 2026-10-22](https://cryptobriefing.com/calle-launches-bitnotes-cashu-ecash-wallet/))

### Why offline ecash at the door is a trap

The PR itself says it: "Cashu tokens are **bearer instruments**: possession = spendability, first redeemer wins" ([PR #1376](https://github.com/permissionlesstech/bitchat/issues/1376)). The bitcoin++ write-up notes that the receiver has to **swap with the mint** to make a payment final ([btcpp](https://insider.btcpp.dev/p/knock-knock-its-cashu-bitch)). A guest with no signal can send the same token to the door *and* to a friend. Whoever reaches the mint first gets it. Door staff with no signal can't tell the difference. In a packed club, that's a fraud vector, not a feature.

### Where bitchat could fit (speculative, later at most)

- **Mesh-shared passes.** Our pass is a signed QR that verifies offline anyway (see `delivery-and-auth.md`). Sharing it as an image via WhatsApp, AirDrop or Nearby Share works without bitchat. **bitchat adds nothing for passes.**
- **Staff-to-staff chat inside the venue** when cellular is saturated, for example "Table B4 guests at the side door". bitchat already does this as-is. Venues could just install it. That's an ops suggestion, not an integration.
- **Door-device sync offline.** Several door phones need to share "already checked in" state without internet to stop double entry. This is a real problem. The *idea* (BLE or Wi-Fi local sync) is worth borrowing, but build it with standard tooling, for example a local hotspot plus a CRDT log, rather than via bitchat.
- **Cashu tips to DJs or hosts.** This is a novelty and outside our scope.

**Verdict: no bitchat integration in v1 or v2.** Revisit only if bitchat ships a third-party SDK and an embedded wallet with mint-online confirmation.

---

## 2. Ghana regulatory status (2025–2026)

| Date | Event | Source |
|---|---|---|
| 2025-12-12 to 2025-12-19 | Parliament passes the VASP Bill (sources disagree on the exact date) | [CryptoSlate](https://cryptoslate.com/crypto-laws/ghana-virtual-asset-service-providers-act-2025-act-1154/), [MariBlock](https://www.mariblock.com/stories/ghana-control-the-virtual-asset-narrative-before-full-licensing) |
| 2025-12-22 | BoG press release on passage | [BoG PDF](https://www.bog.gov.gh/wp-content/uploads/2025/12/PRESS-RELEASE-PASSAGE-OF-THE-VIRTUAL-ASSET-SERVICE-PROVIDERS-BILL221225.pdf) |
| 2025-12-24 to 2025-12-30 | Presidential assent. Becomes **Act 1154** | CryptoSlate, MariBlock |
| 2026-01-23 | SEC publishes sandbox guidelines (a 12-month sandbox) | CryptoSlate |
| about 2026-02-18 / 2026-03-10 | Six firms admitted to the sandbox | MariBlock, [TechLabari](https://techlabari.com/?p=61928) |
| **2026-02-20** | **Joint BoG/SEC directive: VASPs must stop mass or public advertising.** "Virtual asset **advocacy** is a regulated activity under Act 1154 and requires registration with the Bank of Ghana and SEC" | CryptoSlate, MariBlock |
| **By end of Q3 2026 (promised)** | BoG application process and fees pages. **As of 2026-11-05 the BoG page still reads "This page will be available by the end of the third quarter of 2026."** | [BoG: Virtual Assets](https://www.bog.gov.gh/virtual-assets/) |

Activities that need a BoG licence include wallet providers, exchanges and trading platforms, dealing, stablecoin issuance, and lending ([CryptoSlate](https://cryptoslate.com/crypto-laws/ghana-virtual-asset-service-providers-act-2025-act-1154/)).

What I could **not** verify:
- whether a *merchant* that only accepts BTC (through a licensed processor, settling in cedis) falls under Act 1154
- whether an in-app "Pay with Bitcoin" button or marketing counts as "advocacy"
- the penalties under Act 1154

**These are the questions for Ghana counsel.** The cedi is Ghana's legal tender, and nothing found suggests BTC has legal-tender status (**unverified**: no primary statement found either way).

---

## 3. Practical ways to accept a Bitcoin deposit

| Provider | Model | Cedi conversion / payout | Lightning refunds | Ghana fit |
|---|---|---|---|---|
| **BTCPay Server** (self-hosted) | Non-custodial. Our own node, or a hosted instance | **None built in.** We hold BTC and would need an exchange to convert, which may itself be a regulated activity | **Yes.** Refunds create a **pull payment**, and the customer claims it with **LNURL-withdraw** (BTC-denominated) | Technically excellent. Regulatory and treasury burden falls on us |
| **Bitnob** (Africa-focused) | Custodial API | Docs describe **paying a Lightning invoice to settle to Ghana MoMo** (MTN, Vodafone/Telecel), with about 5 minutes settlement in the sample | Not documented (**unverified**) | Best local fit *if* Bitnob is registered or licensed under Act 1154 (**unverified**). Its merchant-invoice API for Ghana is also **unverified** |
| **Strike** | Custodial | "Send Globally" *into* Ghana ($5–$1,000 per transaction). A Ghana merchant API is **unverified** | n/a | Useful for diaspora payers sending in. Not a merchant acquirer here |
| **Blink** | Custodial, GraphQL API, Lightning plus on-chain, Stablesats USD (0.5% spread) | No cedi payout | Yes, send a Lightning payment back | API exists. Unavailable in some countries; Ghana availability is **unverified** |
| **OpenNode** | Custodial processor | Fiat settlement reportedly USD for US businesses only | Yes | Weak Ghana fit (third-party) |

Sources: [BTCPay 1.6.0 (LNURL-withdraw refunds)](https://blog.btcpayserver.org/btcpay-server-1-6-0/), [BTCPay 1.3.0 (Lightning pull payments)](https://blog.btcpayserver.org/btcpay-server-1-3-0/), [BTCPay walkthrough](https://docs.btcpayserver.org/Walkthrough/); [Bitnob: Transfer to mobile money](https://docs.bitnob.com/docs/transfer-to-mobile-money) (now redirects to bitnob.dev, so content is as indexed), [Bitnob Lightning launch (Nigeria and Ghana)](https://thecondia.com/bitnob-integrate-lightning-network-faster-transactions-smaller-fees/); [Strike Send Globally countries](https://strike.me/faq/which-countries-are-available-for-send-globally/); [Blink dev docs](https://dev.blink.sv/); [OpenNode (third-party)](https://banksforcrypto.pages.dev/ar/payment-processors/opennode/).

### Design rules for a Lightning deposit (when we do it)

1. **Price in GHS and quote sats at invoice time**, with a short expiry (for example 10 minutes). The booking is only confirmed when the invoice is paid (webhook).
2. **Refunds are pull-based.** We can't push sats back to the payer's source the way we can with MoMo, so the customer has to give us an invoice or Lightning address, or scan an **LNURL-withdraw** QR. Decide up front, and put it in the policy, whether refunds are made **in GHS value** (re-quoted at refund time) or **in the original sats**. The cleanest option is the cedi value, paid by MoMo transfer if the user prefers.
3. **Same booking model** as card and MoMo: the deposit counts toward the minimum spend, under the same cancellation policy (see `payments.md`).
4. **No on-chain deposits** for v2. Confirmations take too long, and fees are too high for GHS 500–5,000 deposits.
5. **Keep it quiet.** Given the February 2026 advertising directive, show it as a payment option at checkout only. No billboard-style "Pay with Bitcoin" marketing until counsel clears it.

---

## 4. Recommendation

| Phase | Bitcoin | bitchat |
|---|---|---|
| **v1** | **None.** Paystack (MoMo, card, Apple Pay) only | None |
| **v2** | Feature-flagged **Lightning deposit** through a partner that settles to us in cedis (shortlist Bitnob, and check whether it is registered or licensed under Act 1154). Fall back to **BTCPay** only if we have a licensed off-ramp. Gate it behind a legal opinion | None. Optionally suggest it to venues for staff chat |
| **Later** | Revisit once the BoG licensing regime is live, for example Cashu or "BitNotes"-style vouchers for promoters | Revisit if bitchat ships a third-party SDK and an embedded wallet with online-mint confirmation |
