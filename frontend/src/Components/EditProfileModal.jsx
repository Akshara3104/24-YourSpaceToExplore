// import React from 'react';
// import tags from './Tags'
// import Select from 'react-select'
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import PhotoUploadLoader from './PhotoUploadLoader';
// import { toast } from 'react-toastify';
// import toastSettings from './toastSettings';

// const careerOptions = Object.values(tags).flat()

// const EditProfileModal = ({ userId, name, bio, careerInterests, profilePicture, setShowEditProfile }) => {

//     const [newData, setNewData] = React.useState({
//         name,
//         bio,
//         careerInterests,
//         profilePicture
//     })

//     const [photoUploaded,  setPhotoUploaded] = React.useState(true)

    
//     const selectOptions = careerOptions.map(option => ({
//         value: option,
//         label: option
//     }));
    
//     const [selectedOptions, setSelectedOptions] = React.useState(careerInterests.map(option => ({
//         value: option,
//         label: option
//     })));
    
//     const handleChange = (selected) => {
//         setSelectedOptions(selected || []);
//         setNewData(prev=>{
//             return{
//                 ...prev,
//                 careerInterests:selected ? selected.map(item=>item.value) : []
//         }})
//     };
    
//     const handleFile = async (event)=>{
        
//         const file = event.target.files[0]
// 		if(!file) return 
        
// 		const data = new FormData()
        
// 		data.append('file', file)
// 		data.append('upload_preset', 'nquery')
// 		data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME)

//         setPhotoUploaded(false)
    
//         const res = await axios.post(process.env.REACT_APP_CLOUDINARY_API, data)
        
//         if(res.data.url)    setPhotoUploaded(true)
            
//             setNewData(prev=>{
//                 return{
//                     ...prev, 
//                     profilePicture: res.data.url
//                 }
//             })
            
//         }
        
        
//         const handleSave = async () => {

//             if(newData.bio.length >= 300){
//                 alert('Bio length should be <300')
//                 return
//             }
            
//             const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/editProfile`, { userId, newData })
    
//             if(res.data.success){
//                 localStorage.setItem('profilePicture', newData.profilePicture)
//                 toast('Profile Successfully edited, Please refresh the page', toastSettings)
//                 setShowEditProfile(false)
//             }
//         };

//     return (
//         <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-[#161616] rounded-lg p-6 w-1/3 max-h-[85vh] overflow-y-auto">
//             <div className="flex justify-between items-center">
//                 <div className="flex justify-center py-3">
//                     <h2 className="text-2xl font-semibold relative underline-orange">
//                         Edit Profile
//                     </h2>
//                 </div>
//                 <button onClick={()=>setShowEditProfile(false)} className="text-gray-300 hover:text-white text-xl">&times;</button>
//             </div>

//             <div className="space-y-4">
//             <div className=''>
//                 <label className="block text-gray-400 mb-1">Username</label>
//                 <input
//                 type="text"
//                 value={newData.name}
//                 disabled
//                 className="w-full px-3 py-2 rounded bg-zinc-800 text-gray-400 cursor-no-drop"
//                 />
//             </div>

//             <div>
//                 <label className="block text-gray-400 mb-1">Bio</label>
//                 <textarea
//                 rows="3"
//                 value={newData.bio}
//                 onChange={(e) => setNewData(prev=>{
//                     return{
//                         ...prev,
//                         bio: e.target.value
//                     }
//                 })}
//                 className="w-full px-3 py-2 rounded bg-zinc-800 text-white"
//                 ></textarea>
//             </div>

//             <div>
//                 <label className="block text-gray-400 mb-1">Profile Picture</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFile(e)}
//                     className="w-full px-3 py-2 rounded bg-zinc-800 text-gray-300"
//                 />
//                 {
//                     !photoUploaded &&
//                     <PhotoUploadLoader />
//                 }
//             </div>

//             <div className="">
//                 <label className="block mb-2 text-gray-300">Career Interests</label>
//                 <Select
//                     options={selectOptions}
//                     value={selectedOptions}
//                     onChange={handleChange}
//                     isMulti
//                     className="react-select-container rounded"
//                     classNamePrefix="react-select"
//                     placeholder="Select your interests..."
//                     styles={{
//                         control: (provided) => ({
//                         ...provided,
//                         backgroundColor: '#525252', // Tailwind's bg-neutral-600
//                         borderColor: '#404040',
//                         color: 'white'
//                         }),
//                         menu: (provided) => ({
//                         ...provided,
//                         backgroundColor: '#525252',
//                         color: 'white'
//                         }),
//                         option: (provided, state) => ({
//                         ...provided,
//                         backgroundColor: state.isFocused ? '#404040' : '#525252',
//                         color: 'white',
//                         cursor: 'pointer'
//                         }),
//                         multiValue: (provided) => ({
//                         ...provided,
//                         backgroundColor: '#3f3f3f',
//                         color: 'white'
//                         }),
//                         multiValueLabel: (provided) => ({
//                         ...provided,
//                         color: 'white'
//                         }),
//                         multiValueRemove: (provided) => ({
//                         ...provided,
//                         color: 'white',
//                         ':hover': {
//                             backgroundColor: '#ef4444',
//                             color: 'white'
//                         }
//                         }),
//                     }}
//                 /> 
//             </div>
//             <div className='d-flex gap-2'>
//                 <button
//                     onClick={()=>setShowEditProfile(false)}
//                     className="flex-1 mt-4 bg-gradient-to-r from-blue-500 to-indigo-800 hover:opacity-90 text-white p-2 rounded"
//                     >
//                     Cancle
//                 </button>
//                 <button
//                     onClick={handleSave}
//                     disabled={!photoUploaded}
//                     className="flex-1 mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white p-2 rounded"
//                     >
//                     Save Changes
//                 </button>
//             </div>
//             </div>
//         </div>
//         </div>
//     );
// };

// export default EditProfileModal;

import React from 'react';
import tags from './Tags'; // Assuming this provides your career options
import Select from 'react-select'; // React-Select component
import axios from 'axios';
import { toast, Bounce } from 'react-toastify'; // Added Bounce transition for toast
import 'react-toastify/dist/ReactToastify.css'; // Ensure toast CSS is imported
import PhotoUploadLoader from './PhotoUploadLoader'; // Your loader component for photo uploads

// Re-using your toast settings or defining a simple one for consistency
const toastSettings = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark", // Using dark theme for consistency
    transition: Bounce, // Using Bounce transition for consistency
};

// Flatten all tags into a single array for career options
const careerOptions = Object.values(tags).flat();

const EditProfileModal = ({ userId, name, bio, careerInterests, profilePicture, setShowEditProfile, onProfileUpdated }) => {

    const [newData, setNewData] = React.useState({
        name,
        bio,
        careerInterests,
        profilePicture
    });

    const [photoUploading, setPhotoUploading] = React.useState(false); // Renamed for clarity: indicates if photo is currently uploading
    const [isSaving, setIsSaving] = React.useState(false); // State to prevent double clicks on save

    // Prepare options for react-select
    const selectOptions = careerOptions.map(option => ({
        value: option,
        label: option
    }));

    // Initialize selected options for react-select
    const [selectedOptions, setSelectedOptions] = React.useState(
        careerInterests.map(option => ({
            value: option,
            label: option
        }))
    );

    // Handle change for react-select
    const handleChange = (selected) => {
        setSelectedOptions(selected || []);
        setNewData(prev => ({
            ...prev,
            careerInterests: selected ? selected.map(item => item.value) : []
        }));
    };

    // Handle file upload to Cloudinary
    const handleFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'nquery'); // Your Cloudinary upload preset
        data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME); // Your Cloudinary cloud name

        setPhotoUploading(true); // Start loader

        try {
            const res = await axios.post(process.env.REACT_APP_CLOUDINARY_API, data);

            if (res.data && res.data.url) {
                setNewData(prev => ({
                    ...prev,
                    profilePicture: res.data.url
                }));
                toast.success("Profile picture uploaded!", toastSettings);
            } else {
                toast.error("Failed to upload image to Cloudinary.", toastSettings);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Image upload failed. Please try again.", toastSettings);
        } finally {
            setPhotoUploading(false); // End loader
        }
    };

    // Handle saving profile changes
    const handleSave = async () => {
        if (newData.bio && newData.bio.length >= 300) {
            toast.error('Bio length should be less than 300 characters.', toastSettings);
            return;
        }

        setIsSaving(true); // Disable save button
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/editProfile`, { userId, newData });

            if (res.data.success) {
                localStorage.setItem('profilePicture', newData.profilePicture);
                localStorage.setItem('name', newData.name); // Update name in local storage if it was editable
                toast.success('Profile successfully updated! Please refresh the page.', toastSettings);
                setShowEditProfile(false);
                // Call the callback to notify parent component to refresh
                if (onProfileUpdated) {
                    onProfileUpdated();
                }
            } else {
                toast.error(res.data.message || 'Failed to update profile. Please try again.', toastSettings);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error('An error occurred while saving profile. Please try again.', toastSettings);
        } finally {
            setIsSaving(false); // Re-enable save button
        }
    };

    // Custom styles for react-select to match your dark theme
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#262626', // bg-zinc-800
            borderColor: state.isFocused ? '#a855f7' : '#404040', // focus ring purple, border gray
            boxShadow: state.isFocused ? '0 0 0 1px #a855f7' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#a855f7' : '#525252' // subtle hover border
            },
            minHeight: '42px', // Standard height
            borderRadius: '8px', // Rounded corners
            padding: '0 8px', // Inner padding
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#262626', // bg-zinc-800 for dropdown
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            zIndex: 99, // Ensure it's above other elements
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#525252' : '#262626', // bg-zinc-600 on hover, bg-zinc-800 normal
            color: 'white',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: '#7c3aed', // darker purple on click
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#7c3aed', // bg-violet-600 for selected tags
            borderRadius: '16px', // Pill shape
            padding: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'white',
            fontWeight: '600', // Semi-bold text
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'rgba(255,255,255,0.7)', // Lighter white for remove X
            '&:hover': {
                backgroundColor: '#ef4444', // bg-red-500
                color: 'white',
                borderRadius: '50%', // Round remove button
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#a3a3a3', // text-gray-400
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),
        input: (provided) => ({
            ...provided,
            color: 'white',
        }),
    };

    return (
        <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border border-purple-700 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                        Edit Profile
                    </h2>
                    <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-white text-3xl font-bold transition-colors duration-200">&times;</button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-gray-300 font-semibold mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={newData.name}
                            disabled // Keeping username disabled as per your original code
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-gray-400 cursor-not-allowed focus:outline-none border border-zinc-700"
                        />
                        <p className="text-sm text-gray-500 mt-1">Username cannot be changed.</p>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-gray-300 font-semibold mb-2">Bio</label>
                        <textarea
                            id="bio"
                            rows="4"
                            value={newData.bio}
                            onChange={(e) => setNewData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200 resize-y border border-zinc-700"
                            maxLength="299" // Enforce max length visually
                        ></textarea>
                        <p className={`text-sm mt-1 ${newData.bio && newData.bio.length >= 250 ? 'text-red-400' : 'text-gray-500'}`}>
                            {newData.bio ? newData.bio.length : 0}/299 characters
                        </p>
                    </div>

                    <div>
                        <label htmlFor="profile-picture" className="block text-gray-300 font-semibold mb-2">Profile Picture</label>
                        <input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                        />
                        {photoUploading && (
                            <div className="mt-4">
                                <PhotoUploadLoader />
                                <p className="text-sm text-gray-400 text-center mt-2">Uploading photo...</p>
                            </div>
                        )}
                        {newData.profilePicture && !photoUploading && (
                            <div className="mt-4 w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden mx-auto border border-zinc-700">
                                <img src={newData.profilePicture} alt="Current Profile" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="career-interests" className="block mb-2 text-gray-300 font-semibold">Career Interests</label>
                        <Select
                            id="career-interests"
                            options={selectOptions}
                            value={selectedOptions}
                            onChange={handleChange}
                            isMulti
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select your career interests..."
                            styles={customSelectStyles}
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowEditProfile(false)}
                            className="flex-1 px-6 py-3 rounded-full text-zinc-300 border border-zinc-600 hover:bg-zinc-700 transition-all duration-300 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSave}
                            disabled={photoUploading || isSaving || (newData.bio && newData.bio.length >= 300)} // Disable if photo uploading or saving or bio too long
                            className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;