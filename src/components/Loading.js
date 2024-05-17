import React from "react";
import loading from "../assets/loading.svg";

const Loading = () => (
    <div style={styles.spinner}>
        <img src={loading} alt="Loading" style={styles.image}/>
        <p style={styles.text}>Wait please, loading...</p>
    </div>
);

const styles = {
    spinner: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
    },
    image: {
        width: '100px',
        height: '100px',
        marginBottom: '20px'
    },
    text: {
        fontSize: '1.2em',
        color: '#555'
    }
};

export default Loading;
