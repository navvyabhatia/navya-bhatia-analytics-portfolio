# Navya Bhatia — Analytics Portfolio

A fast, accessible, single-page portfolio for Navya Bhatia, built from the
experience and projects in her current Business Analytics résumé.

## Design direction

The visual system adapts the light, electric-blue HP analysis from
[VoltAgent's awesome-design-md collection](https://github.com/voltagent/awesome-design-md)
into a personal analytics identity. It uses editorial typography, structured
cards, evidence-first project writing, and subtle data-inspired details without
generated imagery.

## Local preview

Serve the `dist` directory with any static HTTP server. For example:

```sh
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Deployment

The repository includes a Vercel configuration that publishes `dist` directly
as a static site with no build step.

