import { IoLocationSharp } from "react-icons/io5";
import Img3 from "../../assets/places/boat.jpg";



const TravelCard = () => {
  return (
    <>
      <div
        className="shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white cursor-pointer"
       
      >
        <div className="overflow-hidden">
          <img
            src={Img3}
            alt="No image"
            className="mx-auto h-[220px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
          />
        </div>

        <div className="space-y-2 p-3">
          <h1 className="line-clamp-1 font-bold text-xl">hello</h1>
          <div className="flex items-center gap-2 opacity-70">
            <IoLocationSharp />
            <span>Nha trang</span>
          </div>
          <p className="line-clamp-2">ahihi</p>
          <div className="flex items-center justify-between border-t-2 py-3 !mt-3">
            <div className="opacity-70">
              <p>du lịch khám phá</p>
            </div>
            <div>
              <p className="text-2xl font-bold">$2000</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelCard;
