import React from "react";
import { useState } from "react";
import Axios from 'axios';

const LoginForm = ({login, error}) => {
    const [userDetail, setUserDetail] = useState({ username: '', password: '' });
    const submitHandler = (e) => {
        Axios.post('http://localhost:3001/api/insert', {
            username: userDetail.username,
            passwords: userDetail.password,
        }).then(() => {
            alert('operation success !');
        });
        e.preventDefault();
        login(userDetail);
    };

    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Login</h2>
                {/*Error */
                    (error !== '') ? (
                        <div className="error">{error}</div>
                    ) : null
                }
                <div className="form-group">
                    <label htmlFor="username">Name</label>
                    <input type="text" name="username" id="username" onChange={e => setUserDetail({...userDetail, username: e.target.value})} value={userDetail.username} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onChange={e => setUserDetail({...userDetail, password: e.target.value})} value={userDetail.password} />
                </div>
                <input type="submit" value="login" />
            </div>
        </form>
    )
}

export default LoginForm;