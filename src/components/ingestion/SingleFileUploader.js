import React, {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

const SingleFileUploader = ({onFileUpload}) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("initial");
    const {getAccessTokenSilently, user} = useAuth0();

    const handleFileChange = (e) => {
        if (e.target.files) {
            setStatus("initial");
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            setStatus("uploading");

            const formData = new FormData();
            formData.append("file", file);

            try {
                const token = await getAccessTokenSilently();
                let queryParams = `schoolId=${user.app_metadata.school}`
                const result = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/files?${queryParams}`, {
                    method: "POST",
                    body: formData,
                    headers: {Authorization: `Bearer ${token}`}
                });

                const data = await result.json();

                setStatus("success");
                onFileUpload(file);
            } catch (error) {
                console.error(error);
                setStatus("fail");
            }
        }
    };

    return (
        <>
            <div className="input-group">
                <label htmlFor="file" className="sr-only">
                    Choose a file
                </label>
                <input id="file" type="file" onChange={handleFileChange}/>
            </div>
            {file && (
                <section>
                    File details:
                    <ul>
                        <li>Name: {file.name}</li>
                        <li>Type: {file.type}</li>
                        <li>Size: {file.size} bytes</li>
                    </ul>
                </section>
            )}

            {file && (
                <button onClick={handleUpload} className="submit">
                    Upload a file
                </button>
            )}

            <Result status={status}/>
        </>
    );
};

const Result = ({status}) => {
    if (status === "success") {
        return <p>✅ File uploaded successfully!</p>;
    } else if (status === "fail") {
        return <p>❌ File upload failed!</p>;
    } else if (status === "uploading") {
        return <p>⏳ Uploading selected file...</p>;
    } else {
        return null;
    }
};

export default SingleFileUploader;
