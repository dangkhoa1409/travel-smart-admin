import TravelCard from "./TravelCard";


const RecentlyTravel = () => {
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-white py-10">
        <section data-aos="fade-up" className="container ">
          <h1 className=" my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            Chuyến đi gần đây
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <TravelCard />
          </div>
        </section>
      </div>
    </>
  );
};

export default RecentlyTravel;
