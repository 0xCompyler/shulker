import React,{useRef,useEffect} from "react"
import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";

const videoSrc = {
    type: 'video',
    sources: [
      {
        src: 'yWtFb9LJs3o',
        provider: 'youtube',
      },
    ],
};

const TranscriptTest = () => {

    const ref = useRef();
    
    useEffect(() => {
        
        const plyr = ref.current && ref.current.plyr;

        console.log(ref.current.plyr,"ref");

        plyr?.on('timeupdate', () => {
            console.log(plyr.currentTime || 0);
        });

    }, []);

    return (
        <>
            <Plyr ref={ref} source={videoSrc} />
        </>
    );
}

export default TranscriptTest;