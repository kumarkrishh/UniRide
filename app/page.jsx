import Feed from "@components/Feed";
import MapComponent from "@components/Map";
import AddressInput from "@components/AddressInput";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <h1 className='head_text text-center blue_gradient'>
      Connect & Commute
    </h1>
    <p className='desc text-center'>
    BruinRide is a platform for college students to connect, carpool, and cut costs. Enhance your college experience by finding travel buddies and sharing rides sustainably within your community.
    </p>
    
    <br />
    
    <AddressInput/>

    <Feed />
    
  </section>
  
);

export default Home;