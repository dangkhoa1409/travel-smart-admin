import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../components/Input/Input";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ErrorMessage from "../components/Error/ErrorMessage.Jsx";
import CategoryItem from "../components/Category/CategoryItem";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const schema = yup.object({
  title: yup.string().required("Field is required"),

  tags: yup.string().required("Field is required"),
});

const BlogSave = ({ blog }) => {
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const [flag, setFlag] = useState(false);
  const [categories, setCategories] = useState([]);
  const [select, setSelect] = useState(blog ? blog.categories : []);
  const [image, setImage] = useState(
    blog ? (blog.thumbnail ? blog.thumbnail : "") : ""
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const inputCategory = useRef();
  const accessToken = JSON.parse(localStorage.getItem("user"));
  const inputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [curBlog, setCurBlog] = useState(blog);

  const onSubmit = async (values) => {
    const content = inputRef?.current?.value;
    if (!image) {
      return;
    }
    if (select.length == 0) {
      if (!inputCategory.current.value) return;
    }
    if (inputCategory.current && inputCategory.current.value) {
      const newCategory = inputCategory.current.value;
      values = {
        ...values,
        content,
        categories: [...select, ...newCategory.split(",")],
        imageId: image.id,
        tags: values.tags.split(","),
      };
    } else {
      values = {
        ...values,
        content,
        categories: [...select],
        imageId: image.id,
        tags: values.tags.split(","),
      };
    }

    try {
      let response;
      if (curBlog) {
        response = await fetch(
          `http://localhost:8888/api/v1/blog/blogs/${curBlog.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.result.accessToken}`,
            },
            body: JSON.stringify(values),
          }
        );
      } else {
        response = await fetch(`http://localhost:8888/api/v1/blog/blogs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
          body: JSON.stringify(values),
        });
      }

      console.log(response);

      const data = await response.json();
      console.log(data);
      if (data) {
        if( curBlog && curBlog.id) {
          toast.success("Sửa thành công");
        } else {
          toast.success("Thêm thành công");
        }
        setTimeout(() => {
          navigate("/Blog");
        }, 2000);
      }
    } catch (error) {
      toast.error("Thêm thất bại");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(
        `http://localhost:8888/api/v1/blog/categories/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
        }
      );
      console.log(response);

      const data = await response.json();
      console.log(data);
      if (data) {
        setCategories(data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hanleClick = (value) => {
    let newArr;

    const index = select.some((val) => val === value);
    console.log(index);
    if (index) {
      newArr = select.filter((val) => val !== value);
    } else {
      newArr = [...select, value];
    }

    setSelect(newArr);
  };

  const onSelectImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch(
          `http://localhost:8888/api/v1/blog/blogs/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken.result.accessToken}`,
            },
            body: formData,
          }
        );
        const data = await response.json();
        setImage(data.result);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  // const handleNewCategory = (e) => {
  //     const element = e.target;
  //     const node = document.querySelector('#other')
  //     if (node) {
  //         node.value = element.value.trim();
  //     }
  // }
  const handleChangeInput = (e) => {
    setFlag(true);
  };
  // const handleChangeSubject = (e) => {
  //     const subs = e.target.value.split(",")
  //     setSelect([...select, ...subs])
  // }

  return (
    <div className="w-full mx-auto p-4">
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-centerr"
      >
        <div className="flex gap-4">
          <div className="md:w-[70%]">
            <div className="mb-4">
              <Input
                defaultValue={curBlog ? curBlog.title : ""}
                name="title"
                className={"outline-none"}
                control={control}
                placeholder="Enter title blog"
                type="text"
              ></Input>
              {errors.title && (
                <ErrorMessage message={errors.title.message}></ErrorMessage>
              )}
            </div>
            <div className="mb-4">
              <CKEditor
                editor={ClassicEditor}
                data={curBlog ? curBlog.content : ""}
                onReady={(editor) => {
                  if (inputRef && inputRef.current) {
                    inputRef.current.value = editor.getData();
                  }
                }}
                onChange={(event, editor) => {
                  if (inputRef && inputRef.current) {
                    inputRef.current.value = editor.getData();
                  }
                }}
              />
              <input
                ref={inputRef}
                className=""
                type="hidden"
                name="content"
              ></input>
            </div>
          </div>
          <div className="md:flex-1">
            <div className="flex mb-4 justify-between items-start">
              <div className="">
                <div className="font-semibold mb-2">Danh mục:</div>
                <div className="flex gap-4 items-center">
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category, index) => (
                      <CategoryItem
                        isSelected={isSelected(category, select)}
                        key={index}
                        onClick={() => hanleClick(category.name)}
                      >
                        {category.name}
                      </CategoryItem>
                    ))}
                  <div className="flex gap-2 items-center other-category">
                    <input
                      type="radio"
                      name="categoryName"
                      id="other"
                      onClick={handleChangeInput}
                    ></input>
                    <label htmlFor="other">Other</label>
                    <input
                      ref={inputCategory}
                      className={`border rounded-md  border-gray-400 outline-none px-2 py-1 ${
                        flag ? "block" : "hidden"
                      }`}
                      type="text"
                      placeholder="Enter your category"
                    ></input>
                  </div>
                  {errors.categoryName && (
                    <ErrorMessage
                      message={errors.categoryName.message}
                    ></ErrorMessage>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="p-2 border rounded border-solid border-black hover:bg-black hover:text-white"
                onClick={() => navigate("/Blog")}
              >
                Quay lại
              </button>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Thẻ:</div>
              <div className="flex gap-2 flex-wrap">
                <input
                  {...register("tags")}
                  defaultValue={
                    blog
                      ? blog.tags
                          .map((tag, index, arr) =>
                            index === arr.length - 1 ? tag : `${tag}, `
                          )
                          .join("")
                      : ""
                  }
                  className="rounded-lg  border-2 border-gray-400 p-2 "
                  placeholder="Ex:Du lich, khám phá,..."
                ></input>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Ảnh bài viết: </div>
              <label
                htmlFor="image"
                className="w-full relative h-[200px] rounded-lg border border-gray-400 flex"
              >
                <img
                  className="mx-auto"
                  src={
                    image?.url ||
                    `https://freeiconshop.com/wp-content/uploads/edd/image-outline-filled.png`
                  }
                ></img>
                <div
                  className="absolute bottom-0 left-0 w-[100px] h-[3px] bg-primary"
                  style={{
                    width: `0px`,
                  }}
                ></div>
              </label>
              <input
                id="image"
                name="image"
                placeholder="image"
                type="file"
                className="hidden"
                onChange={onSelectImage}
              ></input>
              {!image && (
                <ErrorMessage message={"Choose your image"}></ErrorMessage>
              )}
            </div>
            <div className="flex justify-end ">
              <button className="px-4 py-2 rounded-md text-white bg-primary">
                {curBlog ? "Cập nhập bài viết" : "Tạo bài viết"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
const isSelected = (category, categories) => {
  return categories.some((item) => item === category.name);
};
export default BlogSave;
