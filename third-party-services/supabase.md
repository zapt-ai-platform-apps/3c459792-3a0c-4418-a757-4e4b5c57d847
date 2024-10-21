# Supabase

**Purpose:** Authentication and Database services.

**Setup Steps:**

1. **Create a Supabase Account:**
   - Visit [Supabase](https://supabase.com/) and create a free account.

2. **Create a New Project:**
   - Once logged in, create a new project.

3. **Retrieve API Keys:**
   - Navigate to the project settings and copy the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

4. **Set Environment Variables:**
   - Add the keys to your `.env` file:
     ```
     SUPABASE_URL=your_supabase_url_here
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

5. **Set Up Authentication:**
   - Enable the authentication providers you need (e.g., email, Google).

6. **Database Schema:**
   - Supabase will automatically update the database schema using Drizzle ORM during the build process.

**Note:** Ensure that the `SUPABASE_SERVICE_ROLE_KEY` is kept secret and not exposed on the client side.
