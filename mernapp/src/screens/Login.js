import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!credentials.email || !credentials.password) {
                setError("All fields are required.");
                setLoading(false);
                return;
            }

            const response = await fetch("http://localhost:5000/api/loginuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });

            const json = await response.json();
            console.log(json);  // Debug log to inspect server response

            if (json.success) {
                console.log("Navigation to home page"); // Log for successful login
                navigate("/");
                localStorage.setItem("userEmail", credentials.email);
                localStorage.setItem("authToken", json.authToken);
                console.log(localStorage.getItem("authToken"))
            } else {
                setError(json.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("An error occurred while logging in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onChange = (event) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value
        });
    };

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} id="exampleInputEmail1" />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} id="exampleInputPassword1" />
                </div>

                {loading ? (
                    <button type="button" className="m-3 btn btn-secondary" disabled>
                        Loading...
                    </button>
                ) : (
                    <button type="submit" className="m-3 btn btn-success">Submit</button>
                )}

                {error && <p className="text-danger">{error}</p>}

                <Link to="/createuser" className='m-3 btn btn-danger'>I am a new User</Link>
            </form>
        </div>
    );
}

