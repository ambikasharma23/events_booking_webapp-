import HomePage from '../app/components/home/page';
import Category from '../app/components/home/category';
import Music from './components/home/music';
export default function Home() {
  return (
    <main>
      <HomePage />
      <Category />
      <Music />
    </main>
  );
}
