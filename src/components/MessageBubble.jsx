function MessageBubble({text, time, type}) {
    return (
        <div className={`message ${type}`}>
            <p> {text } </p>
            <span className="time" style={{ fontSize:'0.7rem', display: 'block', opacity: 0.6 }}>
                {time}
                </span>
        </div>
    );
}
 export default MessageBubble;
 