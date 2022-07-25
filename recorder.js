class Recorder {
    static Stream;
    static BufferSize = 4096;

    static IsOpen () {
        if(Recorder.Stream){
            const stream = Recorder.Stream;
            const tracks = stream.getTracks && stream.getTracks() || stream.audioTracks || [];
            const track = tracks[0];
            if(track){
                const state = track.readyState;
                return state === "live" || state === track.LIVE;
            };
        };
        return false;
    }
}