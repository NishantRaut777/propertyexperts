import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app }  from "../firebase";

const Profile = () => {

  // getting current user state
  const { currentUser } = useSelector((state) => state.user);

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);

  const [fileUploadPercent, setFileUploadPercent] = useState(0);

  const [fileUploadError, setFileUploadError] = useState(false);

  // for handling form data
  const [formData, setFormData] = useState({});
  

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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
         className='border p-3 rounded-lg' />
        <input type='email' placeholder='email' id='email'
         className='border p-3 rounded-lg' />
        <input type='password' placeholder='password' id='password'
         className='border p-3 rounded-lg' />
         <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opcaity-95'>
          update
         </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>
          Delete
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
    </div>
  )
}

export default Profile
