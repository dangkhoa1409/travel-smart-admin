import NatureVid from "../assets/video/main.mp4";
import Places from "../components/Places/Places";

import Banner from "../components/Banner/Banner";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import Hero from "../components/Hero/Hero";

import BlogCard from "../components/Blogs/BlogCard";
import { BlogsData } from "../components/Blogs/BlogsComp";

const Home = () => {
  const homeBlogs = BlogsData.filter((blog) => blog.isHome);

  return (
    <>
      <div>
        <div className="h-[700px] relative">
          <video
            autoPlay
            loop
            muted
            className="absolute right-0 top-0 h-[700px] w-full object-cover z-[-1]"
          >
            <source src={NatureVid} type="video/mp4" />
          </video>
          <Hero />
        </div>
        <Places />
        <div className="dark:bg-gray-900 dark:text-white py-10">
          <section data-aos="fade-up" className="container">
            <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
              Bài viết về địa điểm du lịch
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {homeBlogs.map((item) => (
                <BlogCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        </div>

        <Banner />
        <OrderPopup />
      </div>
    </>
  );
};

export default Home;
