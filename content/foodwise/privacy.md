Last updated: October 28, 2026

FoodWise is made by GrayBear Studio. This policy explains what the app collects, why, where it goes, and how to delete it. Questions: [privacy@graybearstudio.com](mailto:privacy@graybearstudio.com).

## The short version

FoodWise stores the food you log and the details you choose to add. Whatever you ask it to identify (a photo, a typed meal, or a scanned product) is sent to an AI service to be read. Photos are never stored. We do not sell your data, we do not show ads, and the app contains no advertising or analytics trackers.

## What is sent for analysis

When you photograph a meal, the image is sent from our server to Anthropic, the company behind the Claude AI model, which identifies the foods and estimates their nutrition. Typed meals, any note you add to a photo, and the product name and ingredient text from a scanned barcode are sent the same way.

FoodWise does not store your photos. The image is held in memory for the length of the analysis and then discarded. A photo you put on a share card stays on your device unless you share it yourself.

Anthropic processes what is sent in order to answer the request. Its handling of data sent through its API is governed by its own commercial terms, available at anthropic.com. We do not use your photos or your logged food to train AI models.

## What we store

When you create an account and use the app, we store:

- **Sign-in:** your email address (passwords are handled by Google Firebase Authentication and are never visible to us).
- **Profile:** a first name, if you add one.
- **Meals:** each meal you log, its foods and nutrition breakdown, the time, and any note you added.
- **Saved meals** you keep for quick logging.
- **Supplements** you track, and which ones you mark as taken each day.
- **Body measurements** you enter: weight, waist, body fat and height.
- **Calorie goal details**, if you use the calorie estimator: age, sex, height, weight, activity level and goal.
- **Preferences:** daily goals and targets, focus areas, foods to skip, fasting windows, travel mode, reminder times, app theme, and a record of when you agreed to this policy.
- **Accuracy records:** when you save a meal, whether you changed what the app identified, for example removing a food or adjusting a portion. These contain food names and portion changes, never photos. We look at them in aggregate to measure and improve how accurately the app identifies food.

We also keep two operational records tied to your account:

- **A daily count of analyses**, used to apply fair-use limits and manage costs.
- **A short-lived copy of each analysis result**, held against a one-time request ID so that a retry after a dropped connection returns the same answer instead of running twice. These expire after fifteen minutes and are deleted automatically, usually within a day.

## Where it is stored and who can see it

Your data is stored with Google Firebase (Authentication, Cloud Firestore and Cloud Functions). The app's database and servers are located in the United States. Your data is protected so that no other user can read it. We can access it through our administrative tools when needed to operate, support or secure the service, and we do not access it for any other purpose.

Our servers keep short-term technical logs to diagnose problems. These include your account ID, the time and size of each request, and the barcode of products you scan. If an analysis fails, the log entry can include the food data returned for that request. Google Cloud deletes these logs automatically after about 30 days.

## Apple Health

If you connect Apple Health, FoodWise reads steps, walking and running distance, flights climbed, active energy, resting heart rate, heart rate variability and sleep, and shows them alongside your food for context. These values are read on your device each time you open the screen. They are never sent to our servers and are never part of your food score. FoodWise does not write anything to Apple Health. You can turn access off at any time in the Health app.

## Camera, photos and notifications

FoodWise uses your camera or photo library only when you choose to photograph or pick a meal. Reminders are scheduled on your device; FoodWise does not use a push notification service.

## Food and product databases

To identify packaged foods and supplements, FoodWise looks up public databases: Open Food Facts, the USDA FoodData Central database, the NIH Dietary Supplement Label Database, and openFDA recall and adverse event records. These lookups send a barcode or a product name, never your account details. Open Food Facts and the NIH database are queried directly from your device, so, as with any website, they can see your device's IP address.

Results for a scanned product are cached on our server so the next person who scans the same package gets an instant answer. That cache holds product information only, with nothing linking it to you, and is refreshed every 180 days.

## Protection by our providers

Anthropic and Google Firebase are the only companies that receive your meals or your account data, and each receives only what it needs to do its job. Before we use a provider, we check that its published terms commit it to protecting what we send at least as strongly as this policy does: encrypted transmission, use only to provide its service to us, no sale of your data, and a stated retention and deletion practice. In other words, each provides the same or equal protection of your data as this policy. We will not use a provider that offers less, and if one changes its terms so that it does, we will stop using it and update this page. The public food and product databases receive only a barcode or a product name, never your account details.

## What we do not do

We do not sell your data. We do not share it with advertisers or data brokers. We do not use your meals to build a profile for marketing. The app contains no advertising, analytics or tracking software.

## How long we keep it

Your account data stays until you delete it or delete your account. Short-lived analysis copies are deleted within about a day, and server logs after about 30 days. The shared product cache contains no personal information.

## Your choices

- **Edit or delete** any meal, measurement, supplement or setting in the app.
- **Delete your account** in the app: Account, then Delete account. This permanently removes your meals, saved meals, supplements, measurements, goals, settings, accuracy records, analysis counts and short-lived analysis copies, and then your sign-in record. It cannot be undone and we keep no copy. Reminders on that device are cancelled.
- **Get a copy of your data** by emailing [privacy@graybearstudio.com](mailto:privacy@graybearstudio.com) from the address on your account. We will reply within 30 days.

## Children

FoodWise is not intended for children under 13, and we do not knowingly collect information from them.

## Not medical advice

FoodWise describes associations reported in nutrition research. It does not diagnose, treat or cure anything, and it is not a substitute for a qualified professional. Nutrition values estimated from a photo are estimates, and the app tells you when it is unsure.

## Links

Our website is covered by its own [privacy notice](https://graybearstudio.com/privacy/).

## Changes

If what we do with your data changes, this policy changes with it, and the app will ask you to read and agree again before you continue.

## Contact

GrayBear Studio, [privacy@graybearstudio.com](mailto:privacy@graybearstudio.com)
