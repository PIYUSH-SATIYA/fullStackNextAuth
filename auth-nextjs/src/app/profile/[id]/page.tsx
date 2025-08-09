import React from "react";

async function UserProfile({ params }: any) {
    const { id: profileId } = await params;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p className="text-4xl bg-green-500">Profile Page {profileId}</p>
        </div>
    );
}

export default UserProfile;
