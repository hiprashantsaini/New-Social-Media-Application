import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { langContent } from '../../languagesText';


function ProfilePost({ post, postFlag, setPostFlag, userFlag, setUserFlag}) {
    const [showDiscription, setShowDiscription] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [titleStatus, setTitleStatus] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [descriptiónStatus, setDescriptionStatus] = useState(false);
    const [descriptión, setDescriptión] = useState(post.description);
    const [showPop, setShowPop] = useState(false);

    const { userInfo, lang } = useContext(AppContext);
    const content = langContent[lang] || langContent['en'];


    const handleDeleteComment = async (commentId) => {
        try {
            await axios.post(`http://localhost:8080/api/post/deletecomment/${post._id}`, { commentId: commentId }, { withCredentials: true });
            setPostFlag(!postFlag);
            setUserFlag(!userFlag);
            toast(`${content.profile.alerts.comment_delete}`);
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);
        }
    }

    //Handle delete post
    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/post/deletepost/${post._id}`, { withCredentials: true });
            toast(`${content.profile.alerts.post_delete}`);
            setPostFlag(!postFlag);
            setUserFlag(!userFlag);
            setShowPop(false)
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);

        }
    }

    //Handle update title
    const handleUpdateTitle = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/post/updatetitle/${post._id}`, { title: title }, { withCredentials: true });
            toast(`${content.profile.alerts.update_title}`);
            setTitleStatus(false);
            setPostFlag(!postFlag);
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);
        }
    }

    //Handle update description
    const handleUpdateDescription = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/post/updatedescription/${post._id}`, { description: descriptión }, { withCredentials: true });
            toast(`${content.profile.alerts.update_description}`);
            setDescriptionStatus(false);
            setPostFlag(!postFlag);
        } catch (error) {
            toast.error(`${content.profile.alerts.delete_error}`);
        }
    }
    return (
        <div className='post-content'>
            {showPop && (
                <div className='popUpdelete'>
                    <div className='popup'>
                        <p style={{ fontSize: "larger",textAlign:"center", fontWeight: "bolder"}}>Do you want to delete this post?</p>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0px", gap: "20px" }}>
                            <button onClick={handleDeletePost} style={{ width: "80%", padding: "10px", fontSize: "medium", backgroundColor: "red", outline: "none", border: "none", borderRadius: "10px", cursor: "pointer",fontWeight:"bolder"}}>Delete</button>
                            <button onClick={() => setShowPop(false)} style={{ width: "80%", padding: "10px", fontSize: "medium", backgroundColor: "green", outline: "none", border: "none", borderRadius: "10px", cursor: "pointer",fontWeight:"bolder" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <p style={{ borderBottom: "1px solid gray" }}>{content.profile.createdAt} &ensp;<span className="timestamp">{post.createdAt}</span>&ensp;&ensp;<span>{content.profile.likes}: {post?.likes?.length}</span> <DeleteIcon className='comment-delete-icon' onClick={()=>setShowPop(true)} /> </p>
            <div className='post-media'>
                {
                    post?.media?.type === 'text' ?
                        <>
                            <p className='tweet-text'>{post.description.substr(0, 250) + '...'}</p>
                        </>
                        :
                        post?.media?.type === 'image' ?
                            <>
                                <img src={`${post.media.url}`} className='post-img' />
                            </>
                            :
                            post?.media?.type === 'video' ?
                                <>
                                    <video controls className='post-video'>
                                        <source src={`${post.media.url}`} />
                                    </video>
                                </>
                                : ''

                }
            </div>
            {
                !titleStatus ? <a href="#top-section" style={{ textDecoration: 'none' }}><p className='tweet-title' style={{ borderBottom: "1px solid gray" }}>{post.title} <EditIcon className='edit-icon' onClick={() => setTitleStatus(true)} /></p> </a>
                    :
                    <form className='update-title-form'>
                        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                        <br />
                        <button onClick={() => {
                            setTitleStatus(false);
                            setTitle(post.title);
                        }}>Cancel</button>
                        <button onClick={handleUpdateTitle}>Done</button>
                    </form>
            }
            <h4 onClick={() => setShowDiscription(!showDiscription)} style={{ borderBottom: "1px solid black", cursor: "pointer" }}>{content.profile.description}</h4>
            {
                showDiscription ?
                    <>
                        {
                            !descriptiónStatus ? <p>{post.description} <EditIcon className='edit-icon' onClick={() => setDescriptionStatus(true)} /></p>
                                :
                                <form className='update-title-form'>
                                    <input type='text' value={descriptión} onChange={(e) => setDescriptión(e.target.value)} />
                                    <br />
                                    <button onClick={() => {
                                        setDescriptionStatus(false);
                                        setDescriptión(post.description);

                                    }}>Cancel</button>
                                    <button onClick={handleUpdateDescription}>Done</button>
                                </form>
                        }
                    </>
                    : ''
            }
            <h4 onClick={() => setShowComments(!showComments)} style={{ borderBottom: "1px solid black", cursor: "pointer" }}>{content.profile.comment}</h4>
            {
                showComments ? post.comments.map((comment, i) => <p key={comment._id}>{i + 1}. {comment.content}  <DeleteIcon className='comment-delete-icon' onClick={() => handleDeleteComment(comment._id)} /></p>) : ''
            }
        </div>
    )
}

export default ProfilePost