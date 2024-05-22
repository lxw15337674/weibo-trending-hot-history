import dayjs from 'dayjs';
import { permanentRedirect } from 'next/navigation';

export default function Page() {
  permanentRedirect(`/hots/${dayjs().format('YYYY-MM-DD')}?sort=hot`);
}