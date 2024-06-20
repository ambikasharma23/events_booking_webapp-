import HomePage from '../app/components/home/page';
import Category from '../app/components/home/category';
import Image from '../app/components/home/image'
import Music from './components/home/music';
export default function Home() {
  return (
    <main>
      <HomePage />
      <Image />
      <Category />
      <Music />
    </main>
  );
}
