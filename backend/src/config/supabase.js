const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno locales si existe el archivo .env
const envFile = path.resolve(__dirname, '../../.env');
if (require('fs').existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente público / anónimo para operaciones de autenticación de usuario
let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Cliente administrativo con privilegios Service Role para verificación de tokens y control backend
let supabaseAdmin = null;
if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = {
  supabase,
  supabaseAdmin,
  isConfigured: () => Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey)),
};

