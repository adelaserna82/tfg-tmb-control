import { defineConfig } from 'orval';

export default defineConfig({
  tmbApi: {
    input: './swagger.json',          // o URL remota: 'https://…/swagger/v1/swagger.json'
    output: {
      mode: 'tags',
      target: 'src/api/generated',
      schemas: 'src/api/generated/model',   // modelos TS
      client: 'react-query', // axios o react-query
      override: {
        mutator: {
          path: './src/api/customInstance.ts',
          name: 'customInstance',
        },
      },
      mock: false,                    // ponlo a true si quieres MSW
    },
    hooks: {
      afterAllFilesWrite: 'eslint --fix --quiet',
    },
  },
});
