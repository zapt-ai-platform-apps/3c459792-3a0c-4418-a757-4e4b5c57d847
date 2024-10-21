# ZAPT

**Purpose:** Simplified integration with Supabase and other services via `@zapt/zapt-js` library.

**Setup Steps:**

1. **Visit ZAPT:**
   - Go to [ZAPT](https://www.zapt.ai) to learn more about the platform.

2. **Set App ID:**
   - Replace `your_app_id_here` in your `.env` file with your actual ZAPT App ID:
     ```
     VITE_PUBLIC_APP_ID=your_app_id_here
     ```

3. **Initialize ZAPT in Code:**
   - The app initializes ZAPT using the `initializeZapt` function in the `supabaseClient.js` file.

**Note:** The ZAPT App ID is used to configure and connect your application with the ZAPT platform.
