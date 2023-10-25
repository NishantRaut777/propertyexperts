import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app }  from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";


const Profile = () => {

  // getting current user state
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);

  const [fileUploadPercent, setFileUploadPercent] = useState(0);

  const [fileUploadError, setFileUploadError] = useState(false);

  // for handling form data
  const [formData, setFormData] = useState({});

  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // manipulating user state
  const dispatch = useDispatch();

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);
  

  // handling file upload
  const handleFileUpload = (file) => {
    // getting storage from current firebase app
    const storage = getStorage(app);

    // creating unique file name
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
      setFileUploadPercent(Math.round(progress));
    },
    (error) => {
      setFileUploadError(true);
    },
    // Once the upload is successful then get the url because that will be setup on form
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({ ...formData, avatar: downloadURL  });
        setFileUploadError(false);
      })
    }
    );
  };


  // handling form data change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  // handling form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));  
    }
  };


  // handling delete user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  // handling signout
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));

    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
        onChange={(e) => setFile(e.target.files[0])}
        type='file' ref={fileRef} hidden accept='image/*' />

        {/* If formdata has image then show it else show current user image */}
        <img onClick={() => fileRef.current.click()}  src={formData.avatar || currentUser.avatar} alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />

        <p className='text-sm self-center'>
          { fileUploadError ? (
            <span className='text-red-700'>Error Image upload (image must be less than 2mb).</span>
          ) : fileUploadPercent > 0 && fileUploadPercent < 100 ? (
            <span className='text-slate-700'>
              {`Uploading ${fileUploadPercent}%`}
            </span>
          ) : fileUploadPercent === 100  ? (
            <span className='text-green-700'>
              Image successfully uploaded!
            </span>
          ) : (
            ""
          )
        }
        </p>

        <input type='text' placeholder='username' id='username'
        defaultValue={currentUser.username}
        onChange={handleChange}
         className='border p-3 rounded-lg' />

        <input type='email' placeholder='email' id='email'
        defaultValue={currentUser.email}
        onChange={handleChange}
         className='border p-3 rounded-lg' />

        <input type='password' placeholder='password' id='password'
        onChange={handleChange}
         className='border p-3 rounded-lg' />

         <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opcaity-95'>
           { loading ? "Loading..." : "Update" }
         </button>

         <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
            Create Listing
         </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span 
        onClick={handleDeleteUser}
        className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span 
        onClick={handleSignOut}
        className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5 text-center' >{ error ? error : "" }</p>

      <p className='text-green-700 mt-5 text-center'>{updateSuccess ? "User is updated successfully": ""}</p>
    </div>
  )
}

export default Profile
