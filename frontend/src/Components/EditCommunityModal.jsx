import React from 'react';
import tags from './Tags'
import Select from 'react-select'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhotoUploadLoader from './PhotoUploadLoader';
import { toast } from 'react-toastify';
import toastSettings from './toastSettings';

const careerOptions = Object.values(tags).flat()

const EditCommunityModal = ({ title, image, description, tags, setShowEditProfile, communityId }) => {

    const [newData, setNewData] = React.useState({
        title,
        description,
        tags,
        image
    })

    const [photoUploaded,  setPhotoUploaded] = React.useState(true)

    
    const selectOptions = careerOptions.map(option => ({
        value: option,
        label: option
    }));
    
    const [selectedOptions, setSelectedOptions] = React.useState(tags.map(option => ({
        value: option,
        label: option
    })));
    
    const handleChange = (selected) => {
        setSelectedOptions(selected || []);
        setNewData(prev=>{
            return{
                ...prev,
                tags:selected ? selected.map(item=>item.value) : []
        }})
    };
    
    const handleFile = async (event)=>{
        
        const file = event.target.files[0]
        if(!file) return 
        
        const data = new FormData()
        
        data.append('file', file)
        data.append('upload_preset', 'nquery')
        data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME)

        setPhotoUploaded(false)
    
        const res = await axios.post(process.env.REACT_APP_CLOUDINARY_API, data)
        
        if(res.data.url)    setPhotoUploaded(true)
            
            setNewData(prev=>{
                return{
                    ...prev, 
                    image: res.data.url
                }
            })
            
        }
        
        
        const handleSave = async () => {

            if(newData.title.length == 0){
                toast('Please enter community title', toastSettings)
                return
            }

            if(newData.title.length >= 30){
                toast('Title length should be <30 characters', toastSettings)
                return
            }

            if(newData.description.length >= 300){
                toast('Description length should be <300 characters', toastSettings)
                return
            }
            
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/editProfile`, { communityId, newData })
    
            if(res.data.success){
                localStorage.setItem('image', newData.image)
                toast('Profile Successfully edited, Please refresh the page', toastSettings)
                setShowEditProfile(false)
            }
        };

    return (
        <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#161616] rounded-lg p-6 w-1/3 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
                <div className="flex justify-center py-3">
                    <h2 className="text-2xl font-semibold relative underline-orange">
                        Edit Profile
                    </h2>
                </div>
                <button onClick={()=>setShowEditProfile(false)} className="text-gray-300 hover:text-white text-xl">&times;</button>
            </div>

            <div className="space-y-4">
            <div className=''>
                <label className="block mb-1">Title</label>
                <input
                type="text"
                value={newData.title}
                onChange={(e) => setNewData(prev=>{
                    return{
                        ...prev,
                        title: e.target.value
                    }
                })}
                className="w-full px-3 py-2 rounded bg-zinc-800"
                />
            </div>

            <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                rows="3"
                value={newData.description}
                onChange={(e) => setNewData(prev=>{
                    return{
                        ...prev,
                        description: e.target.value
                    }
                })}
                className="w-full px-3 py-2 rounded bg-zinc-800 text-white"
                ></textarea>
            </div>

            <div>
                <label className="block text-gray-400 mb-1">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e)}
                    className="w-full px-3 py-2 rounded bg-zinc-800 text-gray-300"
                />
                {
                    !photoUploaded &&
                    <PhotoUploadLoader />
                }
            </div>

            <div className="">
                <label className="block mb-2 text-gray-300">Tags</label>
                <Select
                    options={selectOptions}
                    value={selectedOptions}
                    onChange={handleChange}
                    isMulti
                    className="react-select-container rounded"
                    classNamePrefix="react-select"
                    placeholder="Select your interests..."
                    styles={{
                        control: (provided) => ({
                        ...provided,
                        backgroundColor: '#525252', // Tailwind's bg-neutral-600
                        borderColor: '#404040',
                        color: 'white'
                        }),
                        menu: (provided) => ({
                        ...provided,
                        backgroundColor: '#525252',
                        color: 'white'
                        }),
                        option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? '#404040' : '#525252',
                        color: 'white',
                        cursor: 'pointer'
                        }),
                        multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: '#3f3f3f',
                        color: 'white'
                        }),
                        multiValueLabel: (provided) => ({
                        ...provided,
                        color: 'white'
                        }),
                        multiValueRemove: (provided) => ({
                        ...provided,
                        color: 'white',
                        ':hover': {
                            backgroundColor: '#ef4444',
                            color: 'white'
                        }
                        }),
                    }}
                /> 
            </div>
            <div className='d-flex gap-2'>
                <button
                    onClick={()=>setShowEditProfile(false)}
                    className="flex-1 mt-4 bg-gradient-to-r from-blue-500 to-indigo-800 hover:opacity-90 text-white p-2 rounded"
                    >
                    Cancle
                </button>
                <button
                    onClick={handleSave}
                    disabled={!photoUploaded}
                    className="flex-1 mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white p-2 rounded"
                    >
                    Save Changes
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default EditCommunityModal;
