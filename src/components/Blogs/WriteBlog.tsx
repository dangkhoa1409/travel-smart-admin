import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import { useUser } from "../../context/UserContext";

// Register the ImageUploader module


const WriteBlog: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const { user } = useUser();

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = () => {
    console.log("Blog content:", content);
    // Implement actual submit logic here
  };

  // Define modules for ReactQuill
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="dark:bg-gray-900 mt-5 py-10">
      <section className="container mx-auto bg-white shadow-lg rounded-lg p-6 my-8">
        <h1 className="mb-6 border-l-8 border-primary/50 py-2 pl-4 text-3xl font-extrabold text-gray-700">
          Viết về chuyến đi của{" "}
          <span className="text-secondary">{user?.name}</span>
        </h1>
        <ReactQuill
          value={content}
          onChange={handleChange}
          modules={modules}
          className="mb-6 rounded-lg min-h-72"
        />
        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-2 rounded-full"
          >
            Save Blog Post
          </button>
        </div>
      </section>
    </div>
  );
};

export default WriteBlog;
