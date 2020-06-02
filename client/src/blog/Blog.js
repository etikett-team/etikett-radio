import React, { useState, useEffect } from 'react';
import BlogInputForm from './BlogInputForm';
import Delete from "../Delete"

export default function Blog() {
    const [blogData, setBlogData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEdit, setShowEdit] =useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/blog")
            .then(res => res.json())
            .then(data => setBlogData(data.blog)) 
    }, [])
    //list item construction
    const renderLi = (blogData) => {
        if (blogData.status === 404) return (<h2>Error 404, something went wrong</h2>)
        if (blogData.length === 0) return null; 
        const reversedData = blogData.reverse();

        return reversedData.map((el, i) => (
            <li key={i} className="blog-list">

                <div className="button-container archive-controls">
                    {showEdit ? 
                    <button type="button" onClick={() => handleEdit(false)}>cancel</button>:
                    <button type="button" onClick={() => handleEdit(true)}>edit</button> 
                    }
                    <button type="button" onClick={() => handleDelete(el._id, el.heading)}>delete</button>
                </div>



                <article>
                <div className="article-header">
                    <h2>{el.heading}</h2>
                    <p>{el.date.substring(0, 10)}</p>
                </div>
                <p>{el.text}</p>
                </article>
            </li>
        ));
    };

    const handleAdd = boolean => {
        setShowForm(boolean)
    };
    const handleEdit = boolean => {
        setShowEdit(boolean)
    };

    
    

    const handleDelete = (id, heading) => {
        console.log(id)

        const check = window.confirm(`You really want to delete "${heading}"?`);

        if (check) {
           //filter copy of blog data based on checkedID and set the new state
            let filteredBlogData = [...blogData].filter(el => el._id !== id);

            setBlogData(filteredBlogData)

            console.log(blogData)
            //delete from db
            Delete([id], "blog")
            } else {
                return null
            }
    }

        
    
        return (

            <div className="blog-page">
            <div className="blog-content">
                <h2>blog</h2>
                <div className="button-container">
                {showForm ? 
                <button type="button" onClick={() => handleAdd(false)}>cancel</button>:
                <button type="button" onClick={() => handleAdd(true)}>add to blog</button> 
                }
                </div>
                {showForm ? <BlogInputForm /> : null}
                <ul>
                    {renderLi(blogData)}
                </ul>
            </div>
        </div>
        );
    
}
