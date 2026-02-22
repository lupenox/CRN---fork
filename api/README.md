# Setup PostgreSQL Locally

1. **Download Postgres.app** for your machine:  
   [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

2. **Install and initialize**  
   - Open Postgres.app after installation.  
   - Click **"Initialize"** to start the server.

3. **Default connection string**  

   Using the following format, update your DATABASE_URL in .env:

   ```text
   DATABASE_URL="postgres://<username>@localhost:5432/<username>"

4. **Dev Mode**  

    Add the following to .env:

   ```text
   DEV=true