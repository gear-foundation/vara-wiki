---
sidebar_position: 1
sidebar_label: Sails-JS
---

# Sails-JS

The `sails-js` library is a tool to help developers interact with their Sails application by generating TypeScript client libraries from a Sails IDL. There are two ways to use the library:

- The `.parseIdl` command of the `Sails` class can be used to parse a string containing an IDL description of a Sails application to instantiate a corresponding `Sails` object. This object can then be used interact with the deployed application.
- The `sails-js-cli` command-line tool auto-generates a TypeScript library file, `lib.ts`, from a given IDL file (as generated during the build step of any Vara application using Sails). This `lib.ts` can then be imported in a TypeScript project to interact with the deployed application.