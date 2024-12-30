## Updating schema

To update the schema, you need to run the following command:

```bash
# Generate a new migration file
pnpm db generate
```

```bash
# Apply the migration
pnpm db migrate
```

> [!NOTE]  
> Make sure you filled the `.env` file with the correct database credentials.
