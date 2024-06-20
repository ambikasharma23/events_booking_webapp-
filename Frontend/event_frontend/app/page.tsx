import HomePage from '../app/components/home/page';
import Category from '../app/components/home/category';
import Music from './components/home/music';
import Comedy from './components/home/comedy';
import Dance from './components/home/dance';
export default function Home() {
  return (
    <main>
      <HomePage />
      <Category />
      <Music />
      <Comedy />
      <Dance />
    </main>
  );
}
