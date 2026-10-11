# Multilingual portfolio

Languages: English (`en`), Urdu (`ur`), Pashto (`ps`), Simplified Chinese (`zh`).

The navbar has a language selector. Language is saved using localStorage. Urdu and Pashto enable RTL direction. The switcher is offline-capable; it does not use an API.

## Customizing translations

Edit `js/languages.js` and locate `dictionary`. Add translations for new exact English phrases. Text that has no translation remains English. Branding, example project names, and external media are not automatically translated.

Dynamic complaint validation messages and demo project descriptions can still appear in English, as can text not present in the current translation dictionary. For professional publishing, proofread Urdu, Pashto, and Chinese translations with a fluent speaker.
