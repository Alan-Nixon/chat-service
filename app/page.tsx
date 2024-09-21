import NavBar from '../components/Navbar';
import SideUsers from '../components/SideUsers'
import SingleChat from '../components/SingleChat'

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex">
        <SideUsers />
        <SingleChat />
      </div>
    </>
  );
}
