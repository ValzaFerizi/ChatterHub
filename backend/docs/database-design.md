# Member 2: Database & API Design
Member 2: Databaza dhe APIg

Qëllimi i Projektit

Ky projekt është një form builder i ngjashëm me Google Forms, i ndërtuar duke përdorur një stack të stilit MERN.

Backend: Node.js dhe Express.js
Frontend: React dhe Vite
Databaza kryesore SQL: PostgreSQL ose MySQL
NoSQL / Cache: MongoDB ose Redis, nëse nevojitet nga anëtarët e tjerë të ekipit

Anëtari 2 është përgjegjës për dizajnimin e strukturës së databazës, krijimin e arkitekturës së API-së, implementimin e repositories, migrations, seeders, si dhe zhvillimin e funksionalitetit të form builder-it për shtimin e seksioneve dhe pyetjeve.

Entitetet Kryesore

Entitetet kryesore të sistemit të formularëve janë:

Përdoruesit
Formularët
Seksionet
Pyetjet
Opsionet e Pyetjeve
Përgjigjet
Përgjigjet e Detajuara
Marrëdhëniet në Databazë
Një përdorues mund të krijojë shumë formularë.
Çdo formular i përket një përdoruesi.
Një formular mund të ketë shumë seksione.
Çdo seksion i përket një formulari.
Një seksion mund të ketë shumë pyetje.
Çdo pyetje i përket një formulari.
Çdo pyetje mund të jetë pjesë e një seksioni.
Një pyetje mund të ketë shumë opsione.
Një formular mund të ketë shumë përgjigje.
Çdo përgjigje i përket një formulari.
Një përgjigje mund të ketë shumë përgjigje të detajuara.
Çdo përgjigje e detajuar i përket një përgjigjeje.
Çdo përgjigje e detajuar i përket një pyetjeje.

