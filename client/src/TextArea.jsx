function TextArea(props){
    return(
        <textarea {...props} className={`bg-reddit_dark-brighter text-reddit_text p-2 border border-reddit_dark-brightest focus: outline-none rounded-md block ${props.className}`}></textarea>
    )
}

export default TextArea;