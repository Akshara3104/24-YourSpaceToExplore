
import React from 'react';
import tags from './Tags'; 
import Select from 'react-select'; 
import axios from 'axios';
import { toast, Bounce } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import PhotoUploadLoader from './PhotoUploadLoader'; 

const toastSettings = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark", 
    transition: Bounce, 
};

const careerOptions = Object.values(tags).flat();

const EditProfileModal = ({ userId, name, bio, careerInterests, profilePicture, setShowEditProfile, onProfileUpdated }) => {

    const [newData, setNewData] = React.useState({
        name,
        bio,
        careerInterests,
        profilePicture
    });

    const [photoUploading, setPhotoUploading] = React.useState(false); 
    const [isSaving, setIsSaving] = React.useState(false); 

    const selectOptions = careerOptions.map(option => ({
        value: option,
        label: option
    }));

    const [selectedOptions, setSelectedOptions] = React.useState(
        careerInterests.map(option => ({
            value: option,
            label: option
        }))
    );

    const handleChange = (selected) => {
        setSelectedOptions(selected || []);
        setNewData(prev => ({
            ...prev,
            careerInterests: selected ? selected.map(item => item.value) : []
        }));
    };

    const handleFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'nquery'); 
        data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME); 

        setPhotoUploading(true);

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
            toast.error("Image upload failed. Please try again.", toastSettings);
        } finally {
            setPhotoUploading(false); 
        }
    };

    const handleSave = async () => {
        if (newData.bio && newData.bio.length >= 300) {
            toast.error('Bio length should be less than 300 characters.', toastSettings);
            return;
        }

        setIsSaving(true); 
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/editProfile`, { userId, newData });

            if (res.data.success) {
                localStorage.setItem('profilePicture', newData.profilePicture);
                localStorage.setItem('name', newData.name); 
                toast.success('Profile successfully updated! Please refresh the page.', toastSettings);
                setShowEditProfile(false);
                if (onProfileUpdated) {
                    onProfileUpdated();
                }
            } else {
                toast.error(res.data.message || 'Failed to update profile. Please try again.', toastSettings);
            }
        } catch (error) {
            toast.error('An error occurred while saving profile. Please try again.', toastSettings);
        } finally {
            setIsSaving(false); 
        }
    };

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#262626', 
            borderColor: state.isFocused ? '#a855f7' : '#404040', 
            boxShadow: state.isFocused ? '0 0 0 1px #a855f7' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#a855f7' : '#525252'
            },
            minHeight: '42px', 
            borderRadius: '8px', 
            padding: '0 8px',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#262626', 
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            zIndex: 99, 
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#525252' : '#262626', 
            color: 'white',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: '#7c3aed',
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#7c3aed',
            borderRadius: '16px', 
            padding: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'white',
            fontWeight: '600', 
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'rgba(255,255,255,0.7)', 
            '&:hover': {
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%', 
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#a3a3a3', 
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
                            disabled 
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
                            maxLength="299" 
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