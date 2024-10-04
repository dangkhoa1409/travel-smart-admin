import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store"; 
import { Blog, selectCurrentPageBlogs, setBlogs, setCurrentPage } from "./BlogsSlice"; 
import BlogCard from "./BlogCard"; 
import ReactPaginate from "react-paginate";
import Img1 from "../../assets/places/tajmahal.jpg";
import Img2 from "../../assets/places/water.jpg";
import Img3 from "../../assets/places/boat.jpg";

export const BlogsData : Blog[] = [
  {
    id: 1,
    image: Img1,
    title: "Top places to visit in India",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At eligendi blanditiis veniam suscipit, consequatur assumenda recusandae nostrum reiciendis eaque inventore sed repellat tenetur id quia deleniti veritatis pariatur dignissimos voluptatum maiores...",
    author: "Someone",
    date: "April 22, 2022",
    isHome: true,
  },
  {
    id: 2,
    image: Img2,
    title: "Top places to visit in India",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At eligendi blanditiis veniam suscipit, consequatur assumenda recusandae nostrum reiciendis eaque inventore sed repellat tenetur id quia deleniti veritatis pariatur dignissimos voluptatum maiores...",
    author: "Someone",
    date: "April 22, 2022",
    isHome: false,
  },
  {
    id: 3,
    image: Img3,
    title: "Top places to visit in India",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At eligendi blanditiis veniam suscipit, consequatur assumenda recusandae nostrum reiciendis eaque inventore sed repellat tenetur id quia deleniti veritatis pariatur dignissimos voluptatum maiores...",
    author: "Someone",
    date: "April 22, 2022",
    isHome: true,
  },
  {
    id: 4,
    image: Img1,
    title: "Top places to visit in India",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At eligendi blanditiis veniam suscipit, consequatur assumenda recusandae nostrum reiciendis eaque inventore sed repellat tenetur id quia deleniti veritatis pariatur dignissimos voluptatum maiores...",
    author: "Someone",
    date: "April 22, 2022",
    isHome: true,
  },
  {
    id: 5,
    image: Img1,
    title: "Top places to visit in India",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At eligendi blanditiis veniam suscipit, consequatur assumenda recusandae nostrum reiciendis eaque inventore sed repellat tenetur id quia deleniti veritatis pariatur dignissimos voluptatum maiores...",
    author: "Someone",
    date: "April 22, 2022",
    isHome: true,
  },
  {
    id: 6,
    image: Img1,
    title: "Top places to visit in India",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At eligendi blanditiis veniam suscipit, consequatur assumenda recusandae nostrum reiciendis eaque inventore sed repellat tenetur id quia deleniti veritatis pariatur dignissimos voluptatum maiores...",
    author: "Someone",
    date: "April 22, 2022",
    isHome: true,
  },
  {
    id: 7,
    image: Img1,
    title: "Top places to visit in India",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At eligendi blanditiis veniam suscipit, consequatur assumenda recusandae nostrum reiciendis eaque inventore sed repellat tenetur id quia deleniti veritatis pariatur dignissimos voluptatum maiores...",
    author: "Someone",
    date: "April 22, 2022",
    isHome: false,
  },
];

const BlogsComp: React.FC = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state: RootState) => selectCurrentPageBlogs(state));
  const totalPages = Math.ceil(useSelector((state: RootState) => state.blogs.blogs.length) / 6);

  useEffect(() => {
    // Assuming you fetch data from an API
    dispatch(setBlogs(BlogsData)); // Update state with blog data
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page + 1));
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
          Bài viết về địa điểm du lịch
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {blogs.map((item) => (
            <BlogCard key={item.id} {...item} />
          ))}
        </div>

        <div className="pagination mt-5">
          <ReactPaginate
            pageCount={totalPages}
            onPageChange={({ selected }) => handlePageChange(selected)}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel="<"
            nextLabel=">"
          />
        </div>
      </section>
    </div>
  );
};

export default BlogsComp;
