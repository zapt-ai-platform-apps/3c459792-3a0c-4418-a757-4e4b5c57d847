# Neon PostgreSQL

**Purpose:** Serverless PostgreSQL database hosting.

**Setup Steps:**

1. **Create a Neon Account:**
   - Visit [Neon](https://neon.tech/) and sign up for an account.

2. **Create a New Database:**
   - Inside your Neon dashboard, create a new PostgreSQL database instance.

3. **Retrieve Database URL:**
   - Copy the database connection string (e.g., `postgresql://user:password@host:port/dbname`).

4. **Set Environment Variable:**
   - Add the connection string to your `.env` file:
     ```
     NEON_DB_URL=your_neon_db_url_here
     ```

5. **Database Migration:**
   - The database schema will be managed and updated automatically using Drizzle ORM during the build.

**Note:** Ensure the connection string is kept secure and not exposed publicly.
