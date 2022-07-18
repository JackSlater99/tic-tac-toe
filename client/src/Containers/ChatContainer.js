import React, { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001")

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("")

    const sendMessage = () => {
        socket.emit("send_message", {message})
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageReceived(data.message)
        })
    }, [socket])

    return (
        <>
        <input placeholder="Message..." onChange={(event) => {
            setMessage(event.target.value)
        }}></input>
        <button onClick={sendMessage}>Send Message</button>
        <h1>Message: {messageReceived}</h1>
        </>
    )
}

export default Chat;