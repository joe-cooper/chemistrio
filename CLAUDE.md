# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

chemistr.io — a static site of free interactive chemistry simulations and teaching notes (GCSE/A-level/pre-university), deployed to GitHub Pages (custom domain via `CNAME`, `www.chemistr.io`). No build step, no package manager, no framework: plain HTML/CSS/vanilla JS served as static files.

## Running locally

There's no dev server script in the repo — serve the root over plain static HTTP, e.g.:

```
python -m http.server 8000
```

(or any static file server). The app fetches page fragments, notes, and simulation files via `fetch()`/iframe `src`, so opening `index.html` directly via `file://` will not work.

There are no automated tests, linter, or build/bundle command. The closest thing to a build step is `scripts/build-seo-pages.js` (see below), which must be run manually.

### After adding or editing a simulation, resource, or page

```
node assets/js/version-assets.js && node scripts/build-seo-pages.js
```

The second command regenerates the per-route static shells (`index.html` itself, `sims/index.html`, `sims/<id>/index.html`, `about/index.html`, `resources/index.html`), `robots.txt`, `sitemap.xml`, and `404.html` from `assets/js/data.js`, `assets/js/render.js`, `pages/*.html` and `simulations/notes/*.md`. Its only dependency beyond Node's built-ins is the vendored `assets/vendor/marked.min.js`. Run it before pushing whenever a simulation, resource, page fragment or teaching-notes file changes.

Note that `index.html` is now both the build's template and one of its outputs. Every region the script fills is delimited by `<!--prerender:<name>:start-->` / `<!--prerender:<name>:end-->` markers and is rewritten wholesale on each run, so running the build repeatedly is safe and produces identical output. Don't remove those markers.

### Cache-busting asset versions

`assets/js/version-assets.js` rewrites `href=`/`src=` query strings in `index.html` to `?v=<md5 of file>` for local `.css`/`.js` files (external CDN URLs are skipped automatically). Run it *before* `build-seo-pages.js`, as above, so the refreshed query strings propagate from the shell into every generated route file in the same pass. Skipping it after editing `app.js`, `render.js` or `site.css` leaves returning visitors on a cached copy of the old asset against the new HTML.

## Architecture

### Site shell: a hand-rolled SPA

`index.html` is the single shell for the whole site. `assets/js/app.js` is a client-side router driven entirely by the `PAGE_META` list in `assets/js/render.js`:

- Ordinary content pages (home, sims, resources, about) are HTML fragments in `pages/*.html`, fetched over HTTP and mounted into `#pageMount`. Each `PAGE_META` entry maps an id → fragment path; `PAGE_INITS` in `app.js` attaches the optional `init()` callback for that id (e.g. `renderSimCategories` populates the sims list from `data.js`).
- Simulations render into a separate always-present `#page-viewer` section (not the fragment mount) as an `<iframe src="/simulations/<id>.html">`, since each simulation is a fully self-contained HTML file.
- Every route's content is *also* baked into its static shell at build time (see below), so the first load of any URL needs no fetch and no JS. `app.js` spots this via the `data-prerendered-for` attributes on `#pageMount` / `#notesContent` and skips re-fetching what's already there; every later in-page navigation goes through the normal fetch path.
- Navigation uses real `<a href>` elements, not `onclick` handlers. A single delegated click listener in `app.js` turns same-site anchor clicks into `pushState` navigations, so links stay crawlable without any extra wiring. Use an anchor for anything that navigates.
- Routing is real History API paths (`/sims`, `/sims/<id>`, `/about#contact`, ...), not hashes — `parsePath()`/`navigate()`/`go()`/`openSim()` in `app.js`. `migrateLegacyHash()` does a one-time redirect for old `#sim/<id>`-style bookmarks.
- To add a new top-level page: create `pages/<id>.html` (inner markup only, no wrapper) and add one entry to `PAGE_META` in `render.js`. Nav bar, router and static-shell build all read that list. Add an entry to `STATIC_PAGES` in `build-seo-pages.js` too, to give the route its own title and meta description.

### Shared rendering: `assets/js/render.js`

The functions that build the site's list markup (`simCategoriesHtml`, `featuredHtml`, `resourceCategoriesHtml`, `navHtml`) and that turn teaching-notes Markdown into HTML (`notesHtml`) live here, along with `PAGE_META`. Both runtimes use them: the browser via `app.js`, and Node via `scripts/build-seo-pages.js`. That's what stops the pre-rendered and client-rendered versions of a page drifting apart.

Nothing in this file may touch `document`, `window` or `fetch`, and data is passed in as an argument rather than read off the `simulations`/`resources` globals — both so it stays `require()`-able under Node. It's exported with the same `if (typeof module !== "undefined")` guard `data.js` uses.

### Content data: `assets/js/data.js`

Single source of truth for both simulations and resources, as plain JS arrays (`simulations`, `resources`) — no CMS/database. It's also `require()`d directly by `scripts/build-seo-pages.js` under Node (guarded by `if (typeof module !== "undefined")` at the bottom, since it's also loaded as a plain `<script>` in the browser).

To add a simulation: add an object to `simulations` with `id`, `topic` (groups it into a collapsible category), `level`, `desc`, `file` (path to the simulation's own HTML — omit/empty for a placeholder), `notes` (path to a teaching-notes Markdown file, or `""` to hide the notes panel), optional `featured: true`, optional `added: "YYYY-MM-DD"` (drives a "New" badge for `NEW_BADGE_DAYS` — 30 — days, then stops automatically), optional `tour: true` (shows a "Walk me through" button — see Tours below).

### Simulations are self-contained static pages

Each `simulations/<id>.html` is a standalone document (own `<head>`, own inline `<style>`) that:
- links `assets/css/theme.css` + `assets/css/sim.css` (shared look) plus its own inline styles for anything sim-specific,
- includes `assets/js/theme.js` and, if it has a tour, `assets/js/tour.js`,
- is designed to run both standalone (opened directly) and embedded as an iframe inside the site viewer — it `postMessage({type:'simHeight', height})`s its own height to the parent so `app.js` can size/zoom the iframe (see the fullscreen handling in `app.js` around `applyFullscreenZoom`).

### Teaching notes

Teaching notes must adhere strictly to the writing style guidelines.

Teaching notes should have a suggested use section for teachers, and an explanation that is accessible to students. For GCSE simulations, there should be a 'looking ahead' section that signposts relevant A-level content. Likewise, for A-Level simulations, the 'looking ahead' section should signpost pre-university and first-year undergraduate content.

Markdown files in `simulations/notes/*.md`, rendered by `marked` and typeset by KaTeX. `render.js`'s `protectMath()`/`restoreMath()` shield `$...$`/`$$...$$`/`\(...\)`/`\[...\]` spans from Markdown's backslash-escaping (using U+E000/U+E001 placeholders) before KaTeX sees them.

The Markdown-to-HTML step runs at build time as well as in the browser, so each `sims/<id>/index.html` ships its notes as real HTML — for most simulations this is the only substantial prose on the page, and it's what those pages can realistically rank for. Editing a `.md` file therefore needs a `build-seo-pages.js` run to show up for crawlers. KaTeX still runs client-side over the pre-rendered HTML; because its auto-render script is deferred and the pre-rendered path has no fetch to wait on, `typesetMath()` in `app.js` retries on the `load` event when `renderMathInElement` isn't available yet.

A collapsible answer block uses raw HTML in the `.md` file:

```
<details class="qa">
<summary>Show answer</summary>

The answer, in **Markdown** with $LaTeX$ if needed.

</details>
```

Blank lines around the answer content are required for the Markdown parser to still process it as Markdown rather than swallowing it as opaque HTML.

### Tours (`assets/js/tour.js`)

Shared guided-walkthrough engine. A simulation opts in by calling `ChemTour.init([...])` with an array of steps (`target` CSS selector or `null` for a centered card, `title`, `body`, optional `before(dir)` to drive the sim's own controls by dispatching real `input` events). When run standalone it injects its own trigger button; when embedded in the site viewer, the parent's "Walk me through" button calls `ChemTour.start()` directly across the iframe boundary.

### SEO / static shells (`scripts/build-seo-pages.js`)

A crawler that doesn't run JS (or runs it on a much later pass) would otherwise get an empty page at every URL, sharing one `<title>` across the whole site. This script writes a real static HTML file at each route's actual path (e.g. `sims/<id>/index.html`), built from the `index.html` shell, carrying that route's own:

- `<title>`, meta description, canonical link and OG tags,
- page content, inlined into `#pageMount` — or, for a simulation, its title as the page's `<h1>`, its description, and its teaching notes rendered from Markdown at build time,
- nav bar, as real `<a href>` links.

`app.js` still boots from that file and takes over exactly as before. The markup comes from `render.js`, the same module the browser uses.

The route list is `STATIC_PAGES` (each entry's `id` must match a `PAGE_META` id in `render.js`) plus `simulations` from `data.js`. `robots.txt`, `sitemap.xml` and `404.html` are regenerated from the same list; `404.html` is GitHub Pages' catch-all fallback and stays deliberately content-free, since an unknown path has no route to pre-render.

The pre-rendered `#viewerFrame` holds a plain link to `/simulations/<id>.html` as a stand-in for the iframe, so the simulation is reachable without JS. Those standalone simulation files are still separately indexable and carry no canonical pointing back at `/sims/<id>`, which is worth fixing if duplicate-content warnings show up in Search Console.

## Writing style for chemistry content (teaching notes, simulation copy, tours)

Write in the style of Keeler & Wothers' *Why Chemical Reactions Happen* and *Chemical Structure and Reactivity*.

- Build arguments in real time. State a plausible claim, test it against 
  a counterexample or edge case, show where it breaks, then refine it 
  into the correct statement — don't just assert the conclusion.
- Explicitly pre-empt the reader's likely wrong intuition. Where a 
  natural-but-incorrect inference is likely, name it directly 
  ("this might suggest X — but that's not quite right, because...") 
  before correcting it.
- Use first-person plural and direct address throughout ("we know that," 
  "we can see," "let's consider"). Open sub-sections with a genuine 
  question rather than a topic sentence.
- Cross-reference explicitly. Point back to where an idea was first 
  established ("as we saw when discussing...") and forward to where it 
  will be developed further, so the reader always knows how the current 
  point connects to the rest of the argument.
- Keep physical/visual description and technical precision tightly 
  coupled — never let mechanistic detail (orbitals, charge distribution, 
  bond lengths) float free of a plain-language picture of what's 
  physically happening.
- When comparing competing explanations, use real data to adjudicate 
  between them, and be honest when the simple story doesn't fully fit 
  ("the picture is a little more complicated than this...") before 
  resolving the discrepancy.
- Close each sub-argument with a short, plain declarative summary 
  ("This is why...", "In summary, this is explained by...") before 
  moving on.
- Minimise mathematics; when equations appear, motivate them in words 
  first. Prioritise honest physical reasoning over tidy but misleading 
  simplification.

Remember the context of whether the simulation is for GCSE, A-Level for Pre-University and write with consideration of the audience's likely knowledge level.

Do not be overly verbose. Take some cues from ASD-STE100 but do not adhere strictly to them.

Avoid ASCII arrows and similar.

*Strongly avoid typical AI and Claude-specific writing tropes*.

### Headings

A heading's only job is to let someone scanning the page find the part they want. Write it as either a plain noun phrase naming the topic ("Nucleophiles and electrophiles", "Leaving groups", "The aromatic ring"), or the section's actual "why" question written out in full ("Why does the same bond break four different ways?"). Nothing else.

Before writing any heading, check it against these two tests:

1. Could it be rewritten as three to five words that just name the topic, with nothing lost? If yes, use that version instead.
2. Would it look at home as a magazine cover line or a blog post title? If yes, it is wrong, however accurate it is.

Specific formulas that are always wrong, because they are title-writing rather than labelling:

- Numeral contrast: "One pattern, ten mechanisms", "One bond, four different fates", "Two rules, ten reactions".
- Tagline cadence: "Nucleophile meets electrophile, every time", "X meets Y", "X, every time".
- Teases and promises of a reveal: "The rule behind the picture", "What the arrows don't tell you", "Where it gets interesting".
- Personification or narrative flourish: "Carbonyls, and why addition refuses to stop", "When the ring fights back".
- Negative parallelism: "Not a rule, a consequence".

The body prose sets the register. Headings must match that register, not sit above it in a louder one. The failure mode to watch for is a section whose paragraphs are plain and careful under a heading that is selling something.

# AI Writing Tropes to Avoid

Add this file to your AI assistant's system prompt or context to help it avoid
common AI writing patterns. Source: [tropes.fyi](https://tropes.fyi) by [ossama.is](https://ossama.is)

---

## Word Choice

### "Quietly" and Other Magic Adverbs

Overuse of "quietly" and similar adverbs to convey subtle importance or understated power. AI reaches for these adverbs to make mundane descriptions feel significant. Also includes: "deeply", "fundamentally", "remarkably", "arguably".

**Avoid patterns like:**
- "quietly orchestrating workflows, decisions, and interactions"
- "the one that quietly suffocates everything else"
- "a quiet intelligence behind it"

### "Delve" and Friends

Used to be the most infamous AI tell. "Delve" went from an uncommon English word to appearing in a staggering percentage of AI-generated text. Part of a family of overused AI vocabulary including "certainly", "utilize", "leverage" (as a verb), "robust", "streamline", and "harness".

**Avoid patterns like:**
- "Let's delve into the details..."
- "Delving deeper into this topic..."
- "We certainly need to leverage these robust frameworks..."

### "Tapestry" and "Landscape"

Overuse of ornate or grandiose nouns where simpler words would do. "Tapestry" is used to describe anything interconnected. "Landscape" is used to describe any field or domain. Other offenders: "paradigm", "synergy", "ecosystem", "framework".

**Avoid patterns like:**
- "The rich tapestry of human experience..."
- "Navigating the complex landscape of modern AI..."
- "The ever-evolving landscape of technology..."

### The "Serves As" Dodge

Replacing simple "is" or "are" with pompous alternatives like "serves as", "stands as", "marks", or "represents". AI avoids basic copulas because its repetition penalty pushes it toward fancier constructions (I've studied this!).

**Avoid patterns like:**
- "The building serves as a reminder of the city's heritage."
- "Gallery 825 serves as LAAA's exhibition space for contemporary art."
- "The station marks a pivotal moment in the evolution of regional transit."

---

## Sentence Structure

### Negative Parallelism

The "It's not X -- it's Y" pattern, often with an em dash. The single most commonly identified AI writing tell. Man I f*cking hate it. AI uses this to create false profundity by framing everything as a surprising reframe. One in a piece can be effective; ten in a blog post is a genuine insult to the reader. Before LLMs, people simply did not write like this at scale. Includes the causal variant "not because X, but because Y" where every explanation is framed as a surprise reveal, the em-dash dismissal "X -- not Y", and the cross-sentence reframe where the same noun is negated then repositioned: "The question isn't X. The question is Y."

**Avoid patterns like:**
- "It's not bold. It's backwards."
- "Feeding isn't nutrition. It's dialysis."
- "Half the bugs you chase aren't in your code. They're in your head."

### "Not X. Not Y. Just Z."

The dramatic countdown pattern. AI builds tension by negating two or more things before revealing the actual point. Creates a false sense of narrowing down to the truth.

**Avoid patterns like:**
- "Not a bug. Not a feature. A fundamental design flaw."
- "Not ten. Not fifty. Five hundred and twenty-three lint violations across 67 files."
- "not recklessly, not completely, but enough"

### "The X? A Y."

Self-posed rhetorical questions answered immediately in the next sentence or clause. The model asks a question nobody was asking, then answers it for dramatic effect. Thinks this is the epitome of great writing.

**Avoid patterns like:**
- "The result? Devastating."
- "The worst part? Nobody saw it coming."
- "The scary part? This attack vector is perfect for developers."

### Anaphora Abuse

Repeating the same sentence opening multiple times in quick succession.

**Avoid patterns like:**
- "They assume that users will pay... They assume that developers will build... They assume that ecosystems will emerge... They assume that..."
- "They could expose... They could offer... They could provide... They could create... They could let... They could unlock..."
- "They have built engines, but not vehicles. They have built power, but not leverage. They have built walls, but not doors."

### Tricolon Abuse

Overuse of the rule-of-three pattern, often extended to four or five. A single tricolon is elegant; three back-to-back tricolons are a pattern recognition failure.

**Avoid patterns like:**
- "Products impress people; platforms empower them. Products solve problems; platforms create worlds. Products scale linearly; platforms scale exponentially."
- "identity, payments, compute, distribution"
- "workflows, decisions, and interactions"

### "It's Worth Noting"

Filler transitions that signal nothing. AI uses these phrases to introduce new points without actually connecting them to the previous argument. Also includes: "It bears mentioning", "Importantly", "Interestingly", "Notably".

**Avoid patterns like:**
- "It's worth noting that this approach has limitations."
- "Importantly, we must consider the broader implications."
- "Interestingly, this pattern repeats across industries."

### Superficial Analyses

Tacking a present participle ("-ing") phrase onto the end of a sentence to inject shallow analysis that says nothing. The model attaches significance, legacy, or broader meaning to mundane facts using phrases like "highlighting its importance", "reflecting broader trends", or "contributing to the development of...".

**Avoid patterns like:**
- "contributing to the region's rich cultural heritage"
- "This etymology highlights the enduring legacy of the community's resistance and the transformative power of unity in shaping its identity."
- "underscoring its role as a dynamic hub of activity and culture"

### False Ranges

Using "from X to Y" constructions where X and Y aren't on any real scale. In legitimate use, "from X to Y" implies a spectrum with a meaningful middle. AI uses it as a fancy way to list two loosely related things. "From innovation to cultural transformation" -- what's in between???? Nothing!

**Avoid patterns like:**
- "From innovation to implementation to cultural transformation."
- "From the singularity of the Big Bang to the grand cosmic web."
- "From problem-solving and tool-making to scientific discovery, artistic expression, and technological innovation."

---

## Paragraph Structure

### Short Punchy Fragments

Excessive use of very short sentences or sentence fragments as standalone paragraphs for manufactured emphasis. RLHF training has pushed models toward "writing for readability" aimed at the lowest common denominator: one thought per sentence, no mental state-keeping required. It's an inhuman style. No real person writes first drafts this way because it doesn't match how humans think or speak.

**Avoid patterns like:**
- "He published this. Openly. In a book. As a priest."
- "These weren't just products. And the software side matched. Then it professionalised. But I adapted."
- "Platforms do."

### Listicle in a Trench Coat

Numbered or labeled points dressed up as continuous prose. The model writes what is essentially a listicle but wraps each point in a paragraph that starts with "The first... The second... The third..." to disguise the format. Perhaps you told it to stop generating lists and it decided to do this instead... still very common.

**Avoid patterns like:**
- "The first wall is the absence of a free, scoped API... The second wall is the lack of delegated access... The third wall is the absence of scoped permissions..."
- "The second takeaway is that... The third takeaway is that... The fourth takeaway is that..."

---

## Tone

### "Here's the Kicker"

False suspense transitions that promise a revelation but deliver a point that did NOT need the buildup. The model uses these phrases to manufacture drama before an otherwise unremarkable observation LOL. Also includes: "Here's the thing", "Here's where it gets interesting", "Here's what most people miss", "Here's the starting point", "Here's the deal".

**Avoid patterns like:**
- "Here's the kicker."
- "Here's the thing about AI adoption."
- "Here's where it gets interesting."

### "Think of It As..."

The patronizing analogy. AI constantly reaches for "Think of it as..." or "It's like a..." to simplify concepts. The model defaults to teacher mode and assumes the reader needs a metaphor to understand anything. Often produces analogies that are less clear than the original concept.

**Avoid patterns like:**
- "Think of it like a highway system for data."
- "Think of it as a Swiss Army knife for your workflow."
- "It's like asking someone to buy a car they're only allowed to sit in while it's parked."

### "Imagine a World Where..."

The classic AI invitation to futurism. To sell the argument usually begins with "Imagine" followed by a list of wonderful things that will happen if the reader agrees with the premise.

**Avoid patterns like:**
- "Imagine a world where every tool you use -- your calendar, your inbox, your documents, your CRM, your code editor -- has a quiet intelligence behind it..."
- "In that world, workflows stop being collections of manual steps and start becoming orchestrations."

### False Vulnerability

Simulated self-awareness or honesty that reads as performative. The model pretends to break the fourth wall or admit a bias, creating a false sense of authenticity. Real vulnerability is specific and uncomfortable; AI vulnerability is polished and risk-free!!!!

**Avoid patterns like:**
- "And yes, I'm openly in love with the platform model"
- "And yes, since we're being honest: I'm looking at you, OpenAI, Google, Anthropic, Meta"
- "This is not a rant; it's a diagnosis"

### "The Truth Is Simple"

Asserting that something is obvious, clear or simple instead of actually proving it. If you have to tell the reader your point is clear, it very likely isn't. Also includes the dramatic reveal variant: "but none of them is the real story. The real story is..." -- claiming privileged insight while waving away everything before it.

**Avoid patterns like:**
- "The reality is simpler and less flattering"
- "History is unambiguous on this point"
- "History is clear, the metrics are clear, the examples are clear"

### Grandiose Stakes Inflation

Everything is the most important thing ever. AI inflates the stakes of every argument to world-historical significance. A blog post about API pricing becomes a meditation on the fate of civilization.

**Avoid patterns like:**
- "This will fundamentally reshape how we think about everything."
- "will define the next era of computing"
- "something entirely new"

### "Let's Break This Down"

The pedagogical voice that assumes the reader needs hand-holding. AI defaults to a teacher-student dynamic even when writing for expert audiences. Also includes: "Let's unpack this", "Let's explore", "Let's dive in".

**Avoid patterns like:**
- "Let's break this down step by step."
- "Let's unpack what this really means."
- "Let's explore this idea further."

### Vague Attributions

Attributing claims to unnamed authorities instead of being specific. AI loves to invoke "experts", "observers", "industry reports", and "several publications" without naming anyone. It also inflates the quantity of sources -- presenting what one person said as a widely held view, or writing "several publications have cited" when it means two. If you can't name the expert, you don't have a source.

**Avoid patterns like:**
- "Experts argue that this approach has significant drawbacks."
- "Industry reports suggest that adoption is accelerating."
- "Observers have cited the initiative as a turning point."

### Invented Concept Labels

AI clusters invented compound labels that sound analytical without being grounded. It appends abstract problem-nouns (paradox, trap, creep, divide, vacuum, inversion) to domain words — "supervision paradox", "acceleration trap", "workload creep" — and uses them as if they're established, rigorously defined terms. They function as rhetorical shorthand: name a thing, skip the argument. Multiple such labels in the same piece is a strong signal of AI slop.

**Avoid patterns like:**
- "the supervision paradox"
- "the acceleration trap"
- "workload creep"

---

## Formatting

### Em-Dash Addiction

Compulsive overuse of em dashes for dramatic pauses, parenthetical asides and pivot points. A human writer might use 2-3 per piece (and naturally); AI will use 20+.

**Avoid patterns like:**
- "The problem -- and this is the part nobody talks about -- is systemic."
- "The tinkerer spirit didn't die of natural causes -- it was bought out."
- "Not recklessly, not completely -- but enough -- enough to matter."

### Double-Hyphen Dash

The em dash wearing a false moustache. Once "em dash means AI" became common knowledge, the character started getting swapped for a double hyphen: sometimes because the text passed through a markdown conversion, sometimes because someone ran a find-and-replace to look more human, sometimes because the model was steered off the character while keeping the habit. Either way the compulsive mid-sentence pivot survives the substitution, which is what actually gives it away. Writers who reach for double hyphens honestly do so once or twice out of typographic laziness, rarely fifteen times in one post. Flagged at five or more per thousand words.

**Avoid patterns like:**
- "The problem -- and this is the part nobody talks about -- is systemic."
- "It's not a rewrite -- it's a reckoning."
- "We shipped it fast -- maybe too fast -- and paid for it later."

### Bold-First Bullets

Every bullet point or list item starts with a bolded phrase or sentence. Extremely common in Claude and ChatGPT markdown output. Almost nobody formats lists this way when writing by hand. It's a telltale sign of AI-generated documentation and blog posts AND README files (especially with emojis).

**Avoid patterns like:**
- "Every single bullet point begins with a bold keyword."
- "**Security**: Environment-based configuration with..."
- "**Performance**: Lazy loading of expensive resources..."

### Headline-Voice Headings

Section headings written as ad copy rather than as labels for what the section contains. This survives every other fix on this list, because headings get generated in a different register from the paragraphs underneath: the body can be plain and careful while every heading above it reaches for a hook. The commonest formula by far is the numeral contrast, "[Number] X, [Number] Y", which reads as a listicle title whether or not the section is a list. Close behind are the tagline cadence, the teasing promise of a reveal, and narrative personification. A heading exists so a reader scanning the page can find the part they want; if it would work as a magazine cover line, it is doing something else. Rewrite as a plain noun phrase naming the topic, or as the section's real question written out in full.

**Avoid patterns like:**
- "One pattern, ten mechanisms"
- "One bond, four different fates"
- "Nucleophile meets electrophile, every time"
- "The rule behind the picture"
- "Carbonyls, and why addition sometimes refuses to stop"

### Unicode Decoration

Use of unicode arrows (->), smart/curly quotes, and other special characters that can't be easily typed on a standard keyboard. Real writers typing in a text editor produce straight quotes and -> or =>. Claude in particular loves the -> arrow.

**Avoid patterns like:**
- "Input → Processing → Output"
- "This leads to better outcomes → which means higher engagement"
- "“Smart quotes” instead of straight "quotes" that you’d actually type"

---

## Composition

### Fractal Summaries

"What I'm going to tell you; what I'm telling you; what I just told you" -- applied at every level of the document. Every subsection gets a summary. Every section gets a summary. The document itself gets a summary.

**Avoid patterns like:**
- "In this section, we'll explore... [3000 words later] ...as we've seen in this section."
- "A conclusion that restates every point already made in the previous 3000 words"
- "And so we return to where we began."

### The Dead Metaphor

Latching onto a single metaphor and beating it into the ground across the entire thing. A human writer would introduce a metaphor, use it then move on. AI will repeat the same metaphor 5-10 times.

**Avoid patterns like:**
- "The ecosystem needs ecosystems to build ecosystem value."
- "Walls and doors used 30+ times in the same article"
- "Every paragraph finds a way to say "primitives" again"

### Historical Analogy Stacking

ESPECIALLY COMMON IN TECHNICAL WRITING: Rapid-fire listing of historical companies or tech revolutions to build false authority.

**Avoid patterns like:**
- "Apple didn't build Uber. Facebook didn't build Spotify. Stripe didn't build Shopify. AWS didn't build Airbnb."
- "Every major technological shift -- the web, mobile, social, cloud -- followed the same pattern."
- "Take Spotify... Or consider Uber... Airbnb followed a similar path... Shopify is another example... Even Discord..."

### One-Point Dilution

Making a single argument and restating it in 10 different ways across thousands of words. The model pads a simple thesis to feel "comprehensive" by rephrasing the same idea with different metaphors, examples, and framings. An 800-word argument becomes 4000 words of circular repetition.

**Avoid patterns like:**
- "The same point, restated eight ways across 4000 words."
- "Each section rephrases the thesis with a different metaphor but adds nothing new"

### Content Duplication

Repeating entire sections or paragraphs verbatim within the same piece. This happens when the model loses track of what it has already written, especially in longer pieces. A dead giveaway of unedited AI output. Less common nowadays.

**Avoid patterns like:**
- "The same section appeared twice, word-for-word identical."
- "Paragraph 3 and paragraph 17 are the same sentence reworded"

### The Signposted Conclusion

Explicitly announcing the conclusion with "In conclusion", "To sum up", or "In summary". Competent writing doesn't need to tell you it's concluding. The reader can feel it. AI signals its structural moves because it's following a template, not writing organically.

**Avoid patterns like:**
- "In conclusion, the future of AI depends on..."
- "To sum up, we've explored three key themes..."
- "In summary, the evidence suggests..."

### "Despite Its Challenges..."

The rigid formula where AI acknowledges problems only to immediately dismiss them. Always follows the same beat: "Despite its [positive words], [subject] faces challenges..." then ends with "Despite these challenges, [optimistic conclusion].".

**Avoid patterns like:**
- "Despite these challenges, the initiative continues to thrive."
- "Despite its industrial and residential prosperity, Korattur faces challenges typical of urban areas."
- "Despite their promising applications, pyroelectric materials face several challenges that must be addressed for broader adoption."

## Browser testing

There's no test framework. To visually verify UI changes, serve the site locally and drive a headless browser via CDP (Chrome DevTools Protocol), e.g. launching `msedge.exe --headless=new --remote-debugging-port=<port>` and a small Node script over the CDP `json/version` endpoint to navigate and screenshot. Kill the server/browser processes when done.
