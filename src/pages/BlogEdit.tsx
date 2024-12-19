import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogSave from './BlogSave';

const BlogEdit = () => {
    const {code} = useParams();
    const accessToken = JSON.parse(localStorage.getItem("user"));
    const [blog,setBlog] = useState();
   
    useEffect(() => {
        const getBlogByCode = async () => {
            try {
                
                const response = await fetch(
                    `http://localhost:8888/api/v1/blog/blogs/${code}`,
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
                    setBlog(data.result);
                }
    
    
            } catch (error) {
                console.log(error);
    
            }
        }
        getBlogByCode();
    },[])
    return (
       <>
       {blog && <BlogSave blog={blog}/>}
       </>
    );
};

export default BlogEdit;