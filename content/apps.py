"""Portfolio data for graybearstudio.com.

Adding an app = add one entry here (+ a content/<slug>/ folder with
privacy.md and support.md once its pages are ready). Order here = order
on the home page.

status:
  "live"    on the App Store (store_url required)
  "soon"    coming soon
pages: True when /<slug>/ and its privacy/support/terms pages are built.
external_url: card links here when the app has no studio pages yet.
"""

PUBLISH_DATE = "October 13, 2026"
APPLE_EULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"

APPS = [
    {
        "slug": "hitherto",
        "name": "Hitherto",
        "full_name": "Hitherto: Prayer Journal",
        "category": "Faith",
        "tagline": "A quiet place to pray each day, and to remember how God has met you along the way.",
        "accent": ("#6B2F3A", "#D89AA6"),
        "accent2": ("#8A6718", "#D6B25E"),
        "status": "soon",
        "status_label": "Coming this Advent",
        "pages": True,
        "email": "hitherto@graybearstudio.com",
        "description": [
            "Hitherto is a daily prayer journal for Christians. Each day brings a short Scripture reading, a reflection and a guided prayer, and a place to keep the people and things you are praying for.",
            "When a prayer is answered, you mark it and it joins Remembrance: a lasting timeline of God's faithfulness, named for the stone Samuel set up in 1 Samuel 7:12.",
        ],
        "quote": ("Thus far the LORD has helped us.", "1 Samuel 7:12"),
        "features": [
            ("A daily practice", "A 90-day plan of short Scripture readings, reflections and prayer prompts, a few minutes each."),
            ("Your prayer list", "Keep what you're carrying. Hitherto gently rotates a few prayers to the top each day so none are forgotten."),
            ("Remembrance", "Mark a prayer answered (yes, no, differently than you asked, or \"it changed me\") and keep a permanent timeline of how God has met you."),
            ("The whole Bible, offline", "The Berean Standard Bible, with search, built into the app."),
            ("Private by design", "No account, no ads, no tracking. Everything stays on your iPhone."),
        ],
        "price_intro": "Free to download. The free version includes the first week of the daily practice, up to 3 active prayers at a time, marking prayers answered and the Remembrance timeline, the full Bible with search, a daily reminder, and light and dark appearance.",
        "price_plus": "Hitherto Premium adds every daily practice after the first week, unlimited prayers, Remembrance insights, and export of your full record as plain text.",
        "price_table": [
            ("Yearly", "$39.99 / year", "7-day free trial for eligible new subscribers"),
            ("Monthly", "$5.99 / month", ""),
            ("Lifetime", "$99.99 once", ""),
        ],
        "price_note": "US prices. Prices vary by country and are shown in the app and on the App Store.",
        "subscription_disclosure": "Payment is charged to your Apple ID. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel any time in your iPhone's Settings > [your name] > Subscriptions. If you start a free trial, any unused part of it ends when you subscribe.",
        "platform": "iPhone, iOS 15 or later",
        "footer_notes": ["Scripture quotations are from the Berean Standard Bible (BSB), public domain."],
        "support_notice": "Hitherto is a tool for personal prayer and reflection. It is not counseling, therapy or medical care, and it does not promise any outcome to prayer. If you are in crisis or thinking about harming yourself, contact local emergency services or a crisis line right away.",
        "disclaimers": [
            ("Not counseling or care", "Hitherto is a tool for personal prayer and reflection. It is not counseling, therapy or medical care, and it does not promise any outcome to prayer."),
            ("Scripture", "Scripture quotations are from the Berean Standard Bible (BSB), public domain."),
        ],
        "has_subscription": True,
    },
    {
        "slug": "domiledger",
        "name": "DomiLedger",
        "full_name": "DomiLedger",
        "category": "Home",
        "tagline": "The permanent record of your home, whether you own it or rent it.",
        "accent": ("#2F5D50", "#86BBA9"),
        "accent2": ("#9A7238", "#C59A5A"),
        "status": "soon",
        "status_label": "Coming soon",
        "pages": True,
        "email": "domiledger@graybearstudio.com",
        "description": [
            "DomiLedger builds a maintenance plan around your home and keeps a dated record of everything you do: the work, the cost, the appliances and their warranties.",
            "Renters get a condition record instead: dated photos of the place as you found it, what you raised while you lived there, and how you left it, ready to export as a report. Everything stays on your iPhone. There is no account and nothing to sign in to.",
        ],
        "features": [
            ("A plan for your home", "Tell it what your home has and it schedules the upkeep that applies, with reminders and the reason each job matters."),
            ("Appliances and warranties", "Scan the label to fill in the model and serial on the device, keep receipts and photos, and get warned before a warranty ends."),
            ("Safety recall checks", "Your appliances are checked against U.S. Consumer Product Safety Commission recalls, free for everyone. When a check cannot run, the app says so rather than showing a clean result."),
            ("Renting mode", "Separates your jobs from the property's, and keeps dated condition records with as many photos as each room needs. Photos keep the date the camera recorded."),
            ("Reports to share", "Export a Home Ledger PDF for a buyer, insurer or contractor, or a condition report for a move-in or move-out, with a line for the other party to sign for their copy."),
        ],
        "price_intro": "Free to download. Free includes the maintenance plan, reminders, recall checks, backups and up to 5 appliances.",
        "price_plus": "DomiLedger Pro adds unlimited appliances, warranty alerts, photos and receipts, condition record photos, PDF exports and cost history. Pro is available as an annual subscription or a one-time lifetime purchase. Current prices are shown in the app and on the App Store.",
        "price_table": [],
        "price_note": "",
        "subscription_disclosure": "Payment is charged to your Apple ID. The annual subscription renews automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel any time in your iPhone's Settings > [your name] > Subscriptions.",
        "platform": "iPhone",
        "footer_notes": [],
        "support_notice": "",
        "disclaimers": [
            ("General information, not professional advice", "Maintenance schedules and tips are general guidance. Work involving gas, electrical, roofs, heights, garage door springs or other hazards should be done by a qualified professional. Follow the manufacturer's instructions for your equipment."),
            ("Recall information", "Recall data comes from the U.S. Consumer Product Safety Commission's public records. DomiLedger is not affiliated with or endorsed by the Commission. Matches are based on the brand and model you enter and may be incomplete or inexact; the absence of a match does not mean a product has no recall. Confirm any recall with the official notice or the manufacturer."),
            ("Renting", "DomiLedger does not determine who is responsible for any repair or maintenance. Responsibilities depend on your lease and local law. A condition report is a record you made; it is not legal advice and does not guarantee the outcome of any deposit or dispute."),
            ("Warranties", "Warranty dates are what you enter. Check your warranty terms with the manufacturer or seller."),
        ],
        "has_subscription": True,
    },
    {
        "slug": "pmp",
        "name": "PMP Reasoning",
        "category": "Education",
        "tagline": "PMP exam prep that explains the reasoning behind every answer.",
        "accent": ("#3B4A8C", "#A7B3EA"),
        "status": "live",
        "status_label": "On the App Store",
        "pages": False,
        "external_url": "https://apps.apple.com/app/id6780943286",
        "external_label": "View on the App Store",
    },
    {
        "slug": "gainsay",
        "name": "Gainsay",
        "category": "Productivity",
        "tagline": "Four AIs discuss, argue and agree, then show you exactly where they split.",
        "accent": ("#5B3FA0", "#BCA9F0"),
        "status": "soon",
        "status_label": "Coming soon",
        "pages": False,
        "external_url": "https://leoblueaf.github.io/gainsay-site/",
        "external_label": "Visit the Gainsay page",
    },
    {
        "slug": "creditable",
        "name": "Creditable",
        "category": "Finance",
        "tagline": "See what life after service actually pays, before you decide.",
        "accent": ("#9A6416", "#EDB86A"),
        "status": "soon",
        "status_label": "Coming soon",
        "pages": False,
    },
    {
        "slug": "littlecompass",
        "name": "Little Compass",
        "category": "Parenting",
        "tagline": "Know what matters now, and when it is time to call.",
        "accent": ("#3E5C76", "#9FB9D1"),
        "status": "soon",
        "status_label": "Coming soon",
        "pages": False,
    },
    {
        "slug": "foodwise",
        "name": "FoodWise",
        "category": "Health",
        "tagline": "Small choices. A stronger day.",
        "accent": ("#4F7A60", "#9CC2A8"),
        "status": "soon",
        "status_label": "Coming soon",
        "pages": False,
    },
]
