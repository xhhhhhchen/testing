// /supabase/functions/generate-token/index.ts
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Initialize environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Token Generation Endpoint
app.post('/', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = crypto.randomUUID();
    const { error: dbError } = await supabase
      .from('telegram_connection_tokens')
      .insert({
        user_id: user.id,
        token: token,
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour expiry
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to generate token' });
    }

    return res.json({ token });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Token service running on port ${PORT}`);
});