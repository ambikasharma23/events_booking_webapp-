import Category from '../app/components/home/category';
import Image from './components/home/banner'
import Music from './components/home/music';
import Comedy from './components/home/comedy';
import Dance from './components/home/dance';
import Footer from './components/footer';


export default function Home() {
  return (
    <main>
      <Image />
      <Category />
      <Music />
      <Comedy />
      <Dance />
      <Footer />     
    </main>
  );
}
