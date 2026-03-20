import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the login/splash page as the entry point for Sejong Pulse
  redirect('/login');
}
