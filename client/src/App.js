import React from 'react'
//bring in useEffect and useState
import { useEffect, useState } from 'react'

export default function App() {
  //define state as data
  const [data, setData] = useState(null);

  //define async function to fetch data from api/v1/blogs
  const fetchData = async () => {
    const response = await fetch("/api/v1/blogs");
    const data = await response.json();
    setData(data);
  }

  //call fetchData function
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
        <h1>Blogs</h1>
        {data && data.map(blog => (
            <div key={blog.id}>
                <h2>{blog.title}</h2>
                <h6>{blog.author}</h6>
                <p>{blog.content}</p>
            </div>
        ))}
    </div>
  );
}
