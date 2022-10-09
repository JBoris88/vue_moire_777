import { API_URL_DELAY } from '@/config';

export default function requestHandler() {
  return (new Promise((resolve) => { setTimeout(resolve, API_URL_DELAY); }));
}
