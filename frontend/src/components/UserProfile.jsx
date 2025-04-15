import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../constants';
import { useSelector } from 'react-redux';

const UserProfile = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const { token } = useSelector(state => state.reducers)
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${constants.urlHost}/api/user/get`, {
                    headers: {
                        authorization: `Token ${token}`
                    }
                });
                setUserData(response.data.data);
                setLoading(false);
            } catch (err) {
                console.log(err.response.data)
                setError(err.response?.data?.message || 'Failed to fetch user profile');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) return <div className="text-center py-8">Loading profile...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!userData) return <div className="text-center py-8">User not found</div>;

    // Format the createdAt date
    const joinDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white  shadow-md">
            <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                    <img
                        src={userData.profile}
                        alt={`${userData.name}'s profile`}
                        className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"

                    />
                </div>

                <div className="text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                    <p className="text-gray-600 mb-2">{userData.email}</p>

                    {userData.bio ? (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold text-gray-700">About</h2>
                            <p className="text-gray-600 mt-1">{userData.bio}</p>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <p className="text-gray-500 italic">No bio yet</p>
                        </div>
                    )}

                    <div className="mt-4 text-sm text-gray-500">
                        <p>Member since {joinDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;