# Përmbledhja Finale e Member 2

## Roli

**Member 2: Zhvillues i Databazës dhe API-së**

## Përgjegjësia Kryesore

Përgjegjësia ime kryesore si Member 2 ishte të dizajnoja dhe të ndërtoja shtresën e databazës dhe API-së për sistemin e krijimit të formularëve. Kjo përfshiu planifikimin e strukturës relacionale të databazës, definimin e lidhjeve ndërmjet entiteteve, përgatitjen e arkitekturës backend dhe mbështetjen e funksionalitetit bazë të Form Builder në frontend.

---

## Puna e Përfunduar

### Dizajni i Databazës

Kam dizajnuar një strukturë të normalizuar të databazës duke përdorur **MySQL** si databazë kryesore relacionale.

Dizajni i databazës përfshin këto tabela kryesore:

- `forms`
- `sections`
- `questions`
- `question_options`
- `responses`
- `response_answers`

Struktura është bazuar në parimet e **3NF**, duke ndarë të dhënat e formularëve, pyetjeve, opsioneve, përgjigjeve dhe përgjigjeve individuale në tabela të veçanta. Kjo ndihmon në zvogëlimin e përsëritjes së të dhënave dhe e bën sistemin më të lehtë për mirëmbajtje.

Janë planifikuar lidhje me **foreign keys** ndërmjet entiteteve kryesore, në mënyrë që:

- Një formular të ketë disa seksione.
- Një seksion të ketë disa pyetje.
- Një pyetje të ketë disa opsione.
- Një formular të ketë disa përgjigje të dorëzuara.
- Një përgjigje të ketë disa përgjigje individuale.

---

### Struktura e Backend API

Kam përgatitur strukturën e backend API duke përdorur **Node.js**, **Express.js**, **MySQL** dhe **Sequelize**.

Struktura backend përfshin:

- Sequelize models
- Lidhje ndërmjet modeleve
- Planifikim të migrimeve në MySQL
- Repository layer
- Controllers
- Express routes

Struktura e API-së është planifikuar për këto module kryesore:

- Forms
- Sections
- Questions
- Responses

---

### Repository Layer

Kam krijuar një **repository layer** për të ndarë logjikën e databazës nga controllers.

Repository layer përfshin këta file:

- `form.repository.js`
- `section.repository.js`
- `question.repository.js`
- `response.repository.js`

Kjo e bën backend-in më të pastër, sepse controllers mund t’i thërrasin funksionet nga repository në vend që të përdorin direkt query-t e Sequelize.

---

### MongoDB Skeleton

Kam shtuar një strukturë fillestare për lidhjen me **MongoDB / Mongoose** për përdorim fleksibil në të ardhmen.

MongoDB mund të përdoret më vonë për:

- activity logs
- edit history
- analytics events
- collaboration logs

Të dhënat kryesore të strukturuara të aplikacionit mbeten në **MySQL**, sepse ato kërkojnë strukturë relacionale, normalizim dhe foreign keys.

---

### Plani i Testimit të API-së

Rrjedha kryesore e planifikuar për testimin e API-së është:

1. Krijimi i një formulari
2. Krijimi i një seksioni
3. Krijimi i një pyetjeje
4. Dorëzimi i një përgjigjeje
5. Marrja e përgjigjeve nga databaza

Kjo rrjedhë ndihmon për të konfirmuar që sistemi kryesor i Form Builder dhe dorëzimit të përgjigjeve funksionon si duhet.

---

### Frontend Form Builder Skeleton

Kam përgatitur një strukturë fillestare në **React + Vite** për funksionalitetin e Form Builder.

Struktura e planifikuar në frontend përfshin:

- Form Builder page
- Section card
- Question card
- Question type selector
- Option editor
- Funksione API për krijimin e seksioneve dhe pyetjeve

Form Builder skeleton është dizajnuar që të lidhet me backend API për shtimin e seksioneve dhe pyetjeve.

---

## Tabelat e Databazës

### `forms`

Ruan informacionin kryesor të formularit, si titulli, përshkrimi, pronari dhe statusi i publikimit.

### `sections`

Ruan seksionet brenda një formulari dhe renditjen e tyre.

### `questions`

Ruan pyetjet e formularit, llojin e fushës, statusin nëse është e detyrueshme, rregullat e validimit dhe renditjen.

### `question_options`

Ruan opsionet për llojet e pyetjeve si dropdown, multiple choice dhe checkboxes.

### `responses`

Ruan çdo përgjigje të dorëzuar për një formular.

### `response_answers`

Ruan përgjigjet individuale brenda secilës përgjigje të dorëzuar.

---

## Endpoint-et e Planifikuara të API-së

### Forms

- `POST /api/forms`
- `GET /api/forms`
- `GET /api/forms/:formId`
- `PUT /api/forms/:formId`
- `DELETE /api/forms/:formId`

### Sections

- `POST /api/forms/:formId/sections`
- `GET /api/forms/:formId/sections`
- `PUT /api/sections/:sectionId`
- `DELETE /api/sections/:sectionId`

### Questions

- `POST /api/forms/:formId/questions`
- `GET /api/forms/:formId/questions`
- `PUT /api/questions/:questionId`
- `DELETE /api/questions/:questionId`
- `PATCH /api/forms/:formId/questions/reorder`

### Responses

- `POST /api/forms/:formId/responses`
- `GET /api/forms/:formId/responses`
- `GET /api/responses/:responseId`
- `DELETE /api/responses/:responseId`

---

## Teknologjitë e Përdorura

- Node.js
- Express.js
- MySQL
- Sequelize
- MongoDB / Mongoose skeleton
- React + Vite

---

## Shënime për Ekipin

- MySQL përdoret për të dhënat kryesore të strukturuara dhe relacionale.
- MongoDB mund të përdoret më vonë për logs, analytics, edit history ose collaboration events.
- Repository layer e ndan logjikën e databazës nga controllers.
- Frontend Form Builder skeleton do të lidhet me backend API për seksione dhe pyetje.
- Integrimi me authentication do të përdorë më vonë përdoruesin e kyçur nga auth middleware i Member 1.