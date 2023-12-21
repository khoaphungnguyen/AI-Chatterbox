'use server'
import { signOut as authSignOut } from '@/auth';

export async function signOut() {
    const signOut = await authSignOut({redirectTo:"/"});
    return signOut
}