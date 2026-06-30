'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signoutAndRedirect() {
  (await cookies()).delete('AUTH_TOKEN');
  redirect('/login');
}