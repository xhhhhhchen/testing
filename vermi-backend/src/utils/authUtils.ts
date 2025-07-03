import { supabase } from '../supabaseClient.ts';
import type { Session } from '@supabase/supabase-js';

export const signUpUser = async (
  email: string,
  password: string,
  name: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  if (error) throw error;
  return data;
};

export const signInUser = async (
  email: string,
  password: string
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });
  if (error) throw error;
  return data;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("Session not available");
  return data.session;
};



interface RegisterUserOptions {
  name: string;
  email: string;
  password: string;
  locationId: string;
  selectedTanks: string[];
}
export async function registerUserAndAssignTanks({
  name,
  email,
  password,
  locationId,
  selectedTanks,
}: RegisterUserOptions): Promise<{ session: Session; userId: number }> {
  // Step 1: Sign up user with auto-confirmation
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/homepage`, // Optional fallback
    },
  });

  if (signUpError) throw signUpError;

  // Immediate sign-in since we're auto-confirming
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !signInData.session) {
    throw new Error(signInError?.message || 'Sign-in failed');
  }

  const authUid = signInData.user.id;

  // Step 2: Insert into users table
  const { data: insertedUser, error: insertUserError } = await supabase
    .from('users')
    .insert([
      {
        auth_uid: authUid,
        username: name,
        email,
        location_id: locationId,
      },
    ])
    .select('user_id')
    .single();

  if (insertUserError || !insertedUser) throw insertUserError;

  const userId = insertedUser.user_id;

  // Step 3: Insert into user_tanks
  if (selectedTanks.length > 0) {
    const { error: insertTankError } = await supabase.from('user_tanks').insert(
      selectedTanks.map((tankId) => ({
        user_id: userId,
        tank_id: tankId,
      }))
    );
    if (insertTankError) throw insertTankError;
  }

  return {
    session: signInData.session,
    userId,
  };
}