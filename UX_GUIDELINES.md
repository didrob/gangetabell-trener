## UX Guidelines

Denne veilederen samler beste praksis for design og videreutvikling av prosjektet. Den er tenkt som en levende referanse – oppdater ved behov.

### Visual Design
- Etabler tydelig visuell hierarki som guider oppmerksomheten.
- Bruk en helhetlig fargepalett som matcher merkevaren (avklar palett med eier/bruker først).
- Typografi: prioritér lesbarhet; bruk skala og vekt for hierarki.
- Kontrast: oppfyll WCAG 2.1 AA for tekst/elementer.
- Hold et konsekvent uttrykk på tvers av hele appen.

### Interaction Design
- Intuitiv navigasjon med forutsigbare mønstre.
- Gjenkjennbare UI‑komponenter for lav kognitiv belastning.
- Tydelige «calls‑to‑action» som leder til ønsket handling.
- Responsivt design (mobil, nettbrett, desktop).
- Bruk animasjoner med måte for å støtte, ikke distrahere.

### Accessibility
- Følg WCAG‑retningslinjer for universell utforming.
- Bruk semantisk HTML og ARIA der nødvendig.
- Alt‑tekst for bilder og ikke‑tekstlig innhold.
- Full tastaturnavigasjon for alle interaktive elementer.
- Test med skjermlesere og andre hjelpemidler.

### Performance Optimization
- Optimaliser bilder/aktiva; bruk moderne formater der mulig.
- Lazy‑load ikke‑kritiske ressurser.
- Code splitting for raskere «first load».
- Følg opp Core Web Vitals (LCP, INP/FID, CLS).

### User Feedback
- Gi umiddelbar og tydelig tilbakemelding på handlinger.
- Vis lastestatus for asynkrone operasjoner.
- Klare feilmeldinger med forslag til løsning.
- Bruk analyser (samtykkebasert) for å finne friksjonspunkter.

### Information Architecture
- Logisk struktur og gruppering for enkel gjenfinning.
- Klare etiketter og konsistente kategorier i navigasjon.
- Effektivt søk ved behov.
- Oppretthold et enkelt «sitemap»/oversiktskart.

### Mobile‑First Design
- Design for mobil først; skaler opp til større skjermer.
- Touch‑vennlige elementer og god spacing.
- Vurder relevante gester der det gir mening.
- Plasser kritiske handlinger i «thumb‑zones».

### Consistency
- Etabler og følg et designsystem (komponenter, farger, spacing, ikoner).
- Konsistent terminologi i hele UI‑et.
- Behold plassering av repeterende elementer mellom sider.
- Visuell konsistens på tvers av seksjoner og visninger.

### Testing and Iteration
- A/B‑testing for sentrale valg (når mulig og etisk forsvarlig).
- Bruk heatmaps/session‑opptak for å forstå adferd (samtykke).
- Innhent jevnlig brukerfeedback; iterér fortløpende.
- La data og innsikt styre prioriteringer.

### Documentation
- Vedlikehold stilguide (farger, typografi, komponenter, mønstre).
- Dokumenter designmønstre og komponentbruk.
- Lag brukerflyt‑diagrammer for komplekse prosesser.
- Hold designressurser organiserte og tilgjengelige.

### Fluid Layouts
- Bruk relative enheter (%, em, rem); unngå faste px der mulig.
- Utnytt CSS Grid/Flexbox for fleksible layouter.
- Mobil‑først, skaler opp med progressive forbedringer.

### Media Queries
- Brytepunkt etter innholdsbehov, ikke spesifikke enheter.
- Test i ulike størrelser og orienteringer.
- Tilpass layout og typografi per breakpoint.

### Images and Media
- Responsive bilder (srcset/sizes) og moderne formater.
- Lazy‑load bilder og video.
- Gjør innebygd media responsiv med CSS.

### Typography
- Relative enheter for fontstørrelser (em/rem).
- Justér linjehøyde og bokstavavstand for lesbarhet.
- Bruk modulær typografisk skala for konsistens.

### Touch Targets
- Minimum 44×44 px interaktive flater.
- God avstand mellom touch‑mål.
- Støtt hover for desktop og fokus for tastatur/mobil.

### Performance (Mobile)
- Optimaliser aktiva for mobilnett.
- Foretrekk CSS‑animasjoner fremfor JS når mulig.
- Kritisk CSS for «above‑the‑fold» innhold.

### Content Prioritization
- Prioritér viktig innhold i små visninger.
- Bruk «progressive disclosure» for detaljer.
- Off‑canvas mønstre for sekundært innhold.

### Navigation
- Mobilvennlig navigasjon (hamburger/tabbar etter behov).
- Tastatur‑ og skjermleser‑tilgjengelig navigasjon.
- Vurder sticky header for rask tilgang.

### Forms
- Fleksible skjemalayouter som skalerer.
- Korrekte input‑typer for bedre mobilopplevelse.
- Inline‑validering og presise feilmeldinger.

### Testing
- Bruk devtools for respons‑testing.
- Test på faktiske enheter og nettverk.
- Gjennomfør brukertester på tvers av enheter.

---

### Operasjonelle prinsipper for dette prosjektet
- Hold komponenter små, tydelige og gjenbrukbare.
- Unngå UI‑støy: mindre er mer, særlig i læringsflyt.
- Default dark‑friendly kontrast; test mot WCAG AA.
- Prioritér læringsflyt (oppgave → svar → feedback) over pynt.
- Bevar ytelser: mål LCP/CLS jevnlig etter endringer.

### Neste steg
- Avklar merkevarepalett (primær, sekundær, aksent, states).
- Etabler typografi‑skala (base, heading, små tekster) og spacing.
- Formaliser et lite designsystem (tokens + komponenter) i repo.


