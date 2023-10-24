import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {

    // getting current state of user
    const { currentUser } = useSelector((state) => state.user);

    // If user is present then display child component else navigate to sign-in page
    return currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />
}

export default PrivateRoute
