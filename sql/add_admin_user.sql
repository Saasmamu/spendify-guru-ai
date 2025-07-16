
-- Create a default admin user with fixed credentials
DO $$
DECLARE
    v_role_id uuid;
    v_user_id uuid;
    v_user_email text;
    v_admin_id uuid;
BEGIN
    -- Get the super_admin role id
    SELECT id INTO v_role_id FROM admin_roles WHERE name = 'super_admin';
    
    IF v_role_id IS NULL THEN
        RAISE EXCEPTION 'Super admin role not found! Make sure you ran the setup script first.';
    END IF;
    
    -- Set the default admin email
    v_user_email := 'admin@spendify.com';
    
    -- Create the auth user first if it doesn't exist
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        phone_confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
    SELECT
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        v_user_email,
        crypt('admin123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        now(),
        now(),
        '',
        '',
        '',
        ''
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = v_user_email
    )
    RETURNING id INTO v_user_id;
    
    -- Get the user ID if it already exists
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;
    END IF;
    
    -- Create admin user entry
    INSERT INTO admin_users (user_id, role_id, email, is_active)
    VALUES (v_user_id, v_role_id, v_user_email, true)
    ON CONFLICT (user_id) DO UPDATE SET 
        role_id = EXCLUDED.role_id,
        email = EXCLUDED.email,
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
    RETURNING id INTO v_admin_id;
    
    RAISE NOTICE 'Created/Updated admin user % with ID %', v_user_email, v_admin_id;
END $$;

-- Verify the admin user was created
SELECT 
    au.id, 
    au.email, 
    ar.name AS role_name,
    au.is_active
FROM admin_users au 
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.email = 'admin@spendify.com';

-- Show login instructions
SELECT 'Login with: admin@spendify.com / admin123' AS instructions;
