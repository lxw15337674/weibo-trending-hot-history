import dayjs from 'dayjs';
import { redirect } from 'next/navigation';

export default function Page() {
  redirect(`/hots/${dayjs().format('YYYY-MM-DD')}`);
}