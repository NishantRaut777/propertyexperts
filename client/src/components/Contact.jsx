import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ( { listing }) => {

    const [landlord, setLandlord] = useState(null);

    const [message, setMessage] = useState("");

    // handling message
    const handleMessage = (e) => {
        setMessage(e.target.value);
    };


    // whenever listing will change useEffect will be called
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                // making api call
                const res = await fetch(`/api/user/${listing.userRef}`);

                const data = await res.json();
                setLandlord(data);

            } catch (error) {
                console.log(error);
            }
        };

        fetchLandlord();

    }, [listing.userRef]);

  return (
    <>  
        {/* if landlord is available then show this */}
        { landlord && (
            <div className='flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>

                <textarea
                name='message'
                id='message'
                rows="2"
                value={message}
                onChange={handleMessage}
                placeholder='Enter your message here...'
                className='w-full border p-3 rounded-lg'
                >
                </textarea>

                {/* to open email prompt */}
                <Link
                to = {`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                className = "bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
                >
                    Send Message
                </Link>
            </div>
        )}
    </>
  )
}

export default Contact
