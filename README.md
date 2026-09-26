# Skydancer System Services

Premium-Onepager für die Systemintegration und Nachrüstung von Reisemobilen. Die Website läuft ohne Build-Schritt und wird bei jedem Push auf `main` automatisch über GitHub Pages veröffentlicht.

## Inhalt

- Markeninszenierung mit dem originalen Skydancer Diamond als Hero-Motiv
- sechs Leistungsbausteine mit Preisorientierung, darunter neu das Cabrio-Dach
- Abschnitt Cabrio-Dach mit Machbarkeitsprüfung und Anfrage „Geht das bei meinem Modell?“ (öffnet eine vorbereitete E-Mail)
- Link „Skydancer kaufen“ zum Skydancer-Konfigurator (Navigation, eigenes Band, Footer)
- interaktives Command Center mit dreiteiliger Skydancer-Fahrzeugansicht
- drei Systempakete und transparenter Projektablauf
- beispielhafte digitale Fahrzeugakte
- vierstufiger Anfrage-Konfigurator mit Paketempfehlung und kopierbarer Zusammenfassung
- responsive Navigation, mobile Aktionsleiste und barrierearme Bedienung
- separate Seiten für Impressum und Datenschutz

## Dateien

- `index.html` – Startseite und Konfigurator
- `styles.css` – gesamtes Design und Responsive-Regeln
- `script.js` – Navigation, Command Center und Konfigurator
- `assets/` – optimierte Hero-Bilder und `skydancer-cabrio.webp` (wird als Datei geladen, nicht eingebettet)
- `fonts/` – lokal gehostete Schriften
- `.github/workflows/pages.yml` – Veröffentlichung über GitHub Pages

## Vor dem vollständigen Launch

- Pflichtangaben im Impressum ergänzen (Inhaberin, Rechtsform, Register, USt-IdNr., Handwerkskammer). Adresse und Kontakt stammen von der Skydancer-Seite und sollten geprüft werden
- Preis und Ablauf des Technik-Checks final bestätigen
- Anfrageformular an CRM beziehungsweise Terminbuchung anbinden
- Datenschutztext vor der Formularanbindung aktualisieren
- echte Referenzen, Zertifizierungen und Bewertungen erst nach Freigabe ergänzen

Die aktuelle Vorschau überträgt keine Formulardaten. Nutzerinnen und Nutzer können ihre erstellte Projektübersicht kopieren.

## Farben

Nach der Skydancer-Seite (https://vanlifemum-boop.github.io/Skydancer-/): Navy `#1B2F52`, `#223A62`, `#284370`, Eisweiß `#EEF5F7`, Silbergrau `#AAB7BE`, helles Blau `#9CC3E6` für Buttons und Akzente, Blau `#2F6FA8` auf hellen Flächen. Den Sandton der Skydancer-Seite übernehmen wir nicht, weil auf keiner Website Beige verwendet wird (siehe `CLAUDE.md`).

`index.html` enthält Styles und Skript eingebettet. Bei Änderungen `styles.css` und `script.js` gleich mitziehen.
