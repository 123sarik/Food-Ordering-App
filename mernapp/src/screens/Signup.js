import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", location: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // New state for success message

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError(""); 
        setSuccess(""); // Reset success message on new submit

        try {
            // Basic validation
            if (!credentials.name || !credentials.email || !credentials.password || !credentials.location) {
                setError("All fields are required.");
                setLoading(false);
                return; // Stop execution if validation fails
            }

            const response = await fetch("http://localhost:5000/api/createuser", {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
                
            });

            const json = await response.json();

            if (!json.success) {
                setError("Enter Valid Credentials"); 
            } else {
                setSuccess("User signed up successfully!"); // Set success message
                // Optionally reset form fields
                setCredentials({ name: "", email: "", password: "", location: "" });
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setError("An error occurred while signing up. Please try again."); 
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
        <div>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} id="exampleInputEmail1" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} id="exampleInputPassword1" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputAddress1" className="form-label">Address</label>
                        <input type="text" className="form-control" name='location' value={credentials.location} onChange={onChange} id="exampleInputAddress1" />
                    </div>

                    {loading ? (
                        <button type="button" className="m-3 btn btn-secondary" disabled>
                            Loading...
                        </button>
                    ) : (
                        <button type="submit" className="m-3 btn btn-success">Submit</button>
                    )}

                    {error && <p className="text-danger">{error}</p>} {/* Display error message */}
                    {success && <p className="text-success">{success}</p>} {/* Display success message */}

                    <Link to="/login" className='m-3 btn btn-danger'>Already a User</Link>
                </form>
            </div>
        </div>
    );
}
