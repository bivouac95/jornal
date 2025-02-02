import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://luymzjapsbeybffsqphk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1eW16amFwc2JleWJmZnNxcGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzODM0NTksImV4cCI6MjA1Mzk1OTQ1OX0.W7XtlWSBrBVBg7DvcR7hNGFMkqj-pCPfM0sZEhPDtvE'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase